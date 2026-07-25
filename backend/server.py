from dotenv import load_dotenv
from pathlib import Path
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import os
import io
import csv
import jwt
import bcrypt
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Annotated

from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends
from fastapi.responses import StreamingResponse
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, BeforeValidator, EmailStr, ConfigDict
from bson import ObjectId

# ---------------------------------------------------------------- DB
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="Caro API")
api = APIRouter(prefix="/api")

JWT_ALGORITHM = "HS256"

def now_iso():
    return datetime.now(timezone.utc).isoformat()

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False

def create_access_token(user_id: str, email: str, role: str) -> str:
    payload = {"sub": user_id, "email": email, "role": role,
               "exp": datetime.now(timezone.utc) + timedelta(days=7), "type": "access"}
    return jwt.encode(payload, os.environ["JWT_SECRET"], algorithm=JWT_ALGORITHM)

async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth = request.headers.get("Authorization", "")
        if auth.startswith("Bearer "):
            token = auth[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, os.environ["JWT_SECRET"], algorithms=[JWT_ALGORITHM])
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        user["id"] = str(user["_id"])
        user.pop("_id", None)
        user.pop("password_hash", None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def require_admin(user: dict = Depends(get_current_user)) -> dict:
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

# ---------------------------------------------------------------- Models
class RegisterIn(BaseModel):
    name: str
    email: EmailStr
    phone: str
    password: str
    role: str = "driver"
    dob: Optional[str] = None
    dvla_licence: Optional[str] = None
    pco_licence: Optional[str] = None

class LoginIn(BaseModel):
    email: EmailStr
    password: str

class QuoteIn(BaseModel):
    listing_id: Optional[str] = None
    age: Optional[int] = 35
    years_experience: Optional[int] = 3
    ncb_years: Optional[int] = 2
    convictions: Optional[bool] = False
    cover_level: str = "comprehensive"
    policy_length: str = "annual"

class ApplicationIn(BaseModel):
    listing_id: str
    full_name: str
    email: EmailStr
    phone: str
    dob: Optional[str] = None
    dvla_licence: Optional[str] = None
    pco_licence: Optional[str] = None
    years_experience: Optional[int] = None
    previous_incidents: Optional[str] = None
    duration_weeks: Optional[int] = None
    insurance_details: Optional[dict] = None
    estimated_weekly_cost: Optional[float] = None

class InterestIn(BaseModel):
    company_name: str
    companies_house: Optional[str] = None
    tfl_operator_licence: Optional[str] = None
    fleet_size: str
    areas: str
    contact_name: str
    role: Optional[str] = None
    email: EmailStr
    phone: str
    heard_from: Optional[str] = None

class EventIn(BaseModel):
    type: str
    data: Optional[dict] = None

class LeadIn(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    source: str = "unknown"
    data: Optional[dict] = None

# ---------------------------------------------------------------- Auth routes
async def _issue(resp: Response, user_id: str, email: str, role: str):
    token = create_access_token(user_id, email, role)
    resp.set_cookie("access_token", token, httponly=True, secure=True,
                    samesite="none", max_age=604800, path="/")
    return token

@api.post("/auth/register")
async def register(body: RegisterIn, response: Response):
    email = body.email.lower()
    if await db.users.find_one({"email": email}):
        raise HTTPException(status_code=400, detail="An account with this email already exists")
    role = body.role if body.role in ("driver", "operator") else "driver"
    doc = {
        "name": body.name, "email": email, "phone": body.phone,
        "password_hash": hash_password(body.password), "role": role,
        "dob": body.dob, "dvla_licence": body.dvla_licence, "pco_licence": body.pco_licence,
        "created_at": now_iso(),
    }
    res = await db.users.insert_one(doc)
    uid = str(res.inserted_id)
    await db.leads.insert_one({
        "name": body.name, "email": email, "phone": body.phone,
        "source": f"{role}_signup", "user_id": uid, "created_at": now_iso(),
        "data": {"dvla_licence": body.dvla_licence, "pco_licence": body.pco_licence, "dob": body.dob},
    })
    token = await _issue(response, uid, email, role)
    return {"id": uid, "name": body.name, "email": email, "phone": body.phone, "role": role, "token": token}

@api.post("/auth/login")
async def login(body: LoginIn, response: Response):
    email = body.email.lower()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(body.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Wrong email or password")
    uid = str(user["_id"])
    token = await _issue(response, uid, email, user["role"])
    return {"id": uid, "name": user["name"], "email": email, "phone": user.get("phone"), "role": user["role"], "token": token}

@api.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    return {"ok": True}

@api.get("/auth/me")
async def me(user: dict = Depends(get_current_user)):
    return user

# ---------------------------------------------------------------- Listings
@api.get("/listings")
async def list_listings(borough: Optional[str] = None, vehicle_type: Optional[str] = None,
                        fuel: Optional[str] = None, max_budget: Optional[int] = None,
                        breakdown: Optional[bool] = None, sort: Optional[str] = None):
    q = {}
    if borough and borough != "all":
        q["borough"] = borough
    if vehicle_type and vehicle_type != "any":
        q["vehicle_type"] = vehicle_type
    if fuel and fuel != "any":
        q["fuel"] = fuel
    if max_budget:
        q["weekly_rent"] = {"$lte": max_budget}
    if breakdown:
        q["breakdown_included"] = True
    cursor = db.listings.find(q, {"_id": 0})
    docs = await cursor.to_list(200)
    if sort == "price_asc":
        docs.sort(key=lambda d: d["weekly_rent"])
    elif sort == "price_desc":
        docs.sort(key=lambda d: -d["weekly_rent"])
    elif sort == "rating":
        docs.sort(key=lambda d: -d["operator_rating"])
    return docs

@api.get("/listings/{listing_id}")
async def get_listing(listing_id: str):
    doc = await db.listings.find_one({"id": listing_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Listing not found")
    await db.events.insert_one({"type": "listing_view", "data": {"listing_id": listing_id},
                                "created_at": now_iso()})
    return doc

# ---------------------------------------------------------------- Quote engine (mock Quotezone)
@api.post("/quote")
async def quote(body: QuoteIn):
    listing = None
    if body.listing_id:
        listing = await db.listings.find_one({"id": body.listing_id}, {"_id": 0})
    base = 52.0
    if listing:
        vt = listing.get("vehicle_type", "saloon")
        base += {"executive": 22, "mpv": 14, "wav": 10, "estate": 6, "saloon": 0}.get(vt, 0)
        if listing.get("fuel") == "electric":
            base += 8
    age = body.age or 35
    if age < 25:
        base *= 1.45
    elif age < 30:
        base *= 1.18
    base -= min((body.years_experience or 0), 8) * 1.4
    base -= min((body.ncb_years or 0), 9) * 1.9
    if body.convictions:
        base += 15
    base = max(base, 34.0)
    cheapest = round(base, 2)
    quotes = [
        {"insurer": "Northbridge Cover", "level": "Comprehensive", "weekly": cheapest,
         "note": "Includes breakdown & courtesy car", "cheapest": True},
        {"insurer": "Thameside Insurance", "level": "Comprehensive", "weekly": round(cheapest * 1.06, 2),
         "note": "Standard cover", "cheapest": False},
        {"insurer": "Mercer Cover", "level": "Third party, fire & theft", "weekly": round(cheapest * 0.82, 2),
         "note": "Lower cover, lower price", "cheapest": False},
    ]
    return {"cheapest_weekly": cheapest, "quotes": quotes}

# ---------------------------------------------------------------- Data capture
@api.post("/applications")
async def create_application(body: ApplicationIn, request: Request):
    listing = await db.listings.find_one({"id": body.listing_id}, {"_id": 0})
    user_id = None
    try:
        u = await get_current_user(request)
        user_id = u["id"]
    except HTTPException:
        pass
    doc = body.model_dump()
    doc.update({
        "user_id": user_id, "status": "under_review", "created_at": now_iso(),
        "operator_code": listing.get("operator_code") if listing else None,
        "vehicle": f"{listing['make']} {listing['model']} {listing['year']}" if listing else None,
    })
    res = await db.applications.insert_one(doc)
    if user_id:
        profile = {k: v for k, v in {
            "phone": body.phone, "dob": body.dob, "dvla_licence": body.dvla_licence,
            "pco_licence": body.pco_licence, "years_experience": body.years_experience,
        }.items() if v not in (None, "")}
        if profile:
            await db.users.update_one({"_id": ObjectId(user_id)}, {"$set": profile})
    await db.leads.insert_one({
        "name": body.full_name, "email": body.email.lower(), "phone": body.phone,
        "source": "vehicle_application", "user_id": user_id, "created_at": now_iso(),
        "data": {"listing_id": body.listing_id, "vehicle": doc["vehicle"]},
    })
    return {"id": str(res.inserted_id), "status": "under_review"}

@api.get("/applications/me")
async def my_applications(user: dict = Depends(get_current_user)):
    docs = await db.applications.find({"user_id": user["id"]}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return docs

@api.post("/interest")
async def create_interest(body: InterestIn):
    doc = body.model_dump()
    doc["created_at"] = now_iso()
    await db.interests.insert_one(doc)
    await db.leads.insert_one({
        "name": body.contact_name, "email": body.email.lower(), "phone": body.phone,
        "source": "operator_interest", "created_at": now_iso(),
        "data": {"company_name": body.company_name, "fleet_size": body.fleet_size, "areas": body.areas},
    })
    return {"ok": True}

@api.post("/leads")
async def create_lead(body: LeadIn):
    doc = body.model_dump()
    if doc.get("email"):
        doc["email"] = doc["email"].lower()
    doc["created_at"] = now_iso()
    await db.leads.insert_one(doc)
    return {"ok": True}

@api.post("/events")
async def create_event(body: EventIn):
    await db.events.insert_one({"type": body.type, "data": body.data or {}, "created_at": now_iso()})
    return {"ok": True}

@api.get("/stats")
async def stats():
    drivers = await db.users.count_documents({"role": "driver"})
    operators = await db.interests.count_documents({})
    listings = await db.listings.count_documents({})
    apps = await db.applications.count_documents({})
    recent = await db.interests.find({}, {"_id": 0, "company_name": 1, "fleet_size": 1, "areas": 1, "created_at": 1}).sort("created_at", -1).to_list(6)
    return {"drivers": drivers, "operators": operators, "combined": drivers + operators,
            "listings": listings, "applications": apps, "recent_operators": recent}

# ---------------------------------------------------------------- Admin
@api.get("/admin/summary")
async def admin_summary(_: dict = Depends(require_admin)):
    return {
        "leads": await db.leads.count_documents({}),
        "drivers": await db.users.count_documents({"role": "driver"}),
        "applications": await db.applications.count_documents({}),
        "interests": await db.interests.count_documents({}),
        "events": await db.events.count_documents({}),
        "listing_views": await db.events.count_documents({"type": "listing_view"}),
        "searches": await db.events.count_documents({"type": "search"}),
    }

@api.get("/admin/{collection}")
async def admin_list(collection: str, _: dict = Depends(require_admin)):
    allowed = {"leads", "applications", "interests", "events", "users"}
    if collection not in allowed:
        raise HTTPException(status_code=404, detail="Unknown collection")
    proj = {"_id": 0, "password_hash": 0} if collection == "users" else {"_id": 0}
    docs = await db[collection].find({}, proj).sort("created_at", -1).to_list(1000)
    return docs

@api.get("/admin/export/{collection}")
async def admin_export(collection: str, _: dict = Depends(require_admin)):
    allowed = {"leads", "applications", "interests", "events", "users"}
    if collection not in allowed:
        raise HTTPException(status_code=404, detail="Unknown collection")
    proj = {"_id": 0, "password_hash": 0} if collection == "users" else {"_id": 0}
    docs = await db[collection].find({}, proj).to_list(5000)
    fields = []
    for d in docs:
        for k in d.keys():
            if k not in fields:
                fields.append(k)
    buf = io.StringIO()
    writer = csv.DictWriter(buf, fieldnames=fields or ["empty"])
    writer.writeheader()
    for d in docs:
        writer.writerow({k: (str(v) if isinstance(v, (dict, list)) else v) for k, v in d.items()})
    buf.seek(0)
    return StreamingResponse(iter([buf.getvalue()]), media_type="text/csv",
                             headers={"Content-Disposition": f"attachment; filename=caro_{collection}.csv"})

app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------- Seed
async def seed_admin():
    email = os.environ["ADMIN_EMAIL"].lower()
    pwd = os.environ["ADMIN_PASSWORD"]
    existing = await db.users.find_one({"email": email})
    if not existing:
        await db.users.insert_one({"name": "Caro Ops", "email": email, "phone": "",
                                   "password_hash": hash_password(pwd), "role": "admin",
                                   "created_at": now_iso()})
    elif not verify_password(pwd, existing["password_hash"]):
        await db.users.update_one({"email": email}, {"$set": {"password_hash": hash_password(pwd)}})

async def seed_listings():
    from seed_data import LISTINGS
    if await db.listings.count_documents({}) == 0:
        await db.listings.insert_many([dict(x) for x in LISTINGS])

@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    await db.listings.create_index("id")
    await seed_admin()
    await seed_listings()

@app.on_event("shutdown")
async def shutdown():
    client.close()
