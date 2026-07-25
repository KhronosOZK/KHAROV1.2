GALLERY = {
    "white_sedan": "https://images.unsplash.com/photo-1623869675781-80aa31012a5a?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
    "white_bmw": "https://images.pexels.com/photos/14776716/pexels-photo-14776716.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "white_forest": "https://images.pexels.com/photos/11039663/pexels-photo-11039663.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "white_parked": "https://images.unsplash.com/photo-1689264023564-607c57ede91a?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
    "white_lot": "https://images.unsplash.com/photo-1712524651532-82380bca59bb?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
    "black_merc": "https://images.unsplash.com/photo-1764090317825-9b76e437c8d8?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
    "black_merc2": "https://images.unsplash.com/photo-1779025313068-b4a11d86bf0d?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
    "black_saloon": "https://images.unsplash.com/photo-1764089859665-7d417664c5de?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
    "tesla": "https://images.unsplash.com/photo-1615829386703-e2bb66a7cb7d?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
    "tesla2": "https://images.unsplash.com/photo-1615901555268-839b7a1ede54?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
}

def _photos(*keys):
    return [GALLERY[k] for k in keys]

# ---------------------------------------------------------------------------
# Royalty-free imagery pool (Unsplash / Pexels — free for commercial use)
# Grouped by vehicle "look" so generated listings get sensible photos.
# ---------------------------------------------------------------------------
PHOTOS = {
    "hybrid": [
        "https://images.unsplash.com/photo-1764228511847-ca049447646b?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
        "https://images.unsplash.com/photo-1764228424090-7cb9b0e5ddcc?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
        "https://images.unsplash.com/photo-1773063250524-38ac5eebd3c5?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
        "https://images.pexels.com/photos/8737951/pexels-photo-8737951.png?auto=compress&cs=tinysrgb&w=1200",
        "https://images.unsplash.com/photo-1764228495934-3c5287aa57d4?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
        "https://images.pexels.com/photos/34445488/pexels-photo-34445488.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ],
    "electric": [
        "https://images.unsplash.com/photo-1617727553401-3ec4e92f32a5?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
        "https://images.unsplash.com/photo-1671785253964-bdb43087ed99?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
        "https://images.pexels.com/photos/10029873/pexels-photo-10029873.jpeg?auto=compress&cs=tinysrgb&w=1200",
        "https://images.pexels.com/photos/34070159/pexels-photo-34070159.jpeg?auto=compress&cs=tinysrgb&w=1200",
        "https://images.unsplash.com/photo-1704475289650-6ab9fc4a0a5b?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
    ],
    "executive": [
        "https://images.unsplash.com/photo-1764090317825-9b76e437c8d8?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
        "https://images.unsplash.com/photo-1764089859665-7d417664c5de?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
        "https://images.unsplash.com/photo-1779025313068-b4a11d86bf0d?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
        "https://images.pexels.com/photos/15535501/pexels-photo-15535501.jpeg?auto=compress&cs=tinysrgb&w=1200",
        "https://images.pexels.com/photos/4096527/pexels-photo-4096527.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ],
    "estate": [
        "https://images.unsplash.com/photo-1771773638952-d7c87e5a6858?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
        "https://images.pexels.com/photos/37472548/pexels-photo-37472548.jpeg?auto=compress&cs=tinysrgb&w=1200",
        "https://images.pexels.com/photos/38513236/pexels-photo-38513236.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ],
    "mpv": [
        "https://images.pexels.com/photos/37029578/pexels-photo-37029578.jpeg?auto=compress&cs=tinysrgb&w=1200",
        "https://images.pexels.com/photos/17455632/pexels-photo-17455632.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ],
    "generic": [
        "https://images.unsplash.com/photo-1771210363520-7ee7d4106d5e?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
        "https://images.unsplash.com/photo-1759782178409-12deac1a0a6d?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
    ],
}


def _gallery_for(vtype, fuel, seed):
    if fuel == "electric":
        pool = PHOTOS["electric"]
    elif vtype == "executive":
        pool = PHOTOS["executive"]
    elif vtype == "estate":
        pool = PHOTOS["estate"]
    elif vtype in ("mpv", "wav"):
        pool = PHOTOS["mpv"] + PHOTOS["generic"]
    else:
        pool = PHOTOS["hybrid"]
    g = PHOTOS["generic"]
    return [
        pool[seed % len(pool)],
        pool[(seed + 1) % len(pool)],
        pool[(seed + 2) % len(pool)],
        g[seed % len(g)],
    ]


# ---------------------------------------------------------------------------
# Hand-crafted flagship London listings
# ---------------------------------------------------------------------------
LISTINGS = [
    {"id": "ve-001", "make": "Toyota", "model": "Prius", "year": 2022, "colour": "Silver",
     "plate": "LK22 CAR", "vehicle_type": "saloon", "fuel": "hybrid", "mpg": 65, "seats": 5,
     "weekly_rent": 175, "deposit": 400, "mileage_allowance": 1200, "min_experience": 1,
     "borough": "Newham", "postcode": "E13", "breakdown_included": True,
     "designated_garage": "Stratford Motors", "wear_tear": "Standard", "restrictions": "None",
     "operator_code": "NE-2291", "operator_rating": 4.8, "operator_rentals": 63,
     "operator_since": 2021, "operator_response": "under 2 hours", "mileage": 47300,
     "features": ["Dash cam", "ULEZ compliant", "Apple CarPlay", "Rear camera"],
     "description": "Well-maintained hybrid, ULEZ compliant, dash cam fitted front and rear. Full service history, serviced every 10,000 miles at our designated garage in Stratford. Available for immediate handover.",
     "photos": _photos("white_sedan", "white_parked", "white_lot", "black_merc2")},

    {"id": "ve-002", "make": "Ford", "model": "Galaxy", "year": 2021, "colour": "Grey",
     "plate": "LG21 GXY", "vehicle_type": "mpv", "fuel": "diesel", "mpg": 48, "seats": 7,
     "weekly_rent": 175, "deposit": 450, "mileage_allowance": 1200, "min_experience": 2,
     "borough": "Croydon", "postcode": "CR0", "breakdown_included": True,
     "designated_garage": "Croydon Fleet Services", "wear_tear": "Standard", "restrictions": "No airport runs after midnight",
     "operator_code": "CR-1187", "operator_rating": 4.6, "operator_rentals": 41,
     "operator_since": 2020, "operator_response": "under 4 hours", "mileage": 62100,
     "features": ["7 seats", "ULEZ compliant", "Parking sensors"],
     "description": "Spacious 7-seat MPV, ideal for group and airport work. Regularly serviced, ULEZ compliant, breakdown cover included.",
     "photos": _photos("white_forest", "white_bmw", "white_parked", "black_saloon")},

    {"id": "ve-003", "make": "Tesla", "model": "Model 3", "year": 2023, "colour": "White",
     "plate": "TM23 EVX", "vehicle_type": "executive", "fuel": "electric", "mpg": 0, "seats": 5,
     "weekly_rent": 245, "deposit": 600, "mileage_allowance": 1500, "min_experience": 2,
     "borough": "Redbridge", "postcode": "IG1", "breakdown_included": False,
     "designated_garage": "Ilford EV Centre", "wear_tear": "Standard", "restrictions": "None",
     "operator_code": "IG-3350", "operator_rating": 4.9, "operator_rentals": 88,
     "operator_since": 2019, "operator_response": "under 1 hour", "mileage": 21400,
     "features": ["330 mile range", "Autopilot", "Premium interior", "Fast charging"],
     "description": "Long-range Model 3, premium executive vehicle with autopilot. Low running costs, perfect for high-mileage executive work. Charging network access included.",
     "photos": _photos("tesla", "tesla2", "white_lot", "black_merc")},

    {"id": "ve-004", "make": "Skoda", "model": "Octavia", "year": 2020, "colour": "Blue",
     "plate": "SK20 OCT", "vehicle_type": "estate", "fuel": "diesel", "mpg": 58, "seats": 5,
     "weekly_rent": 140, "deposit": 350, "mileage_allowance": 1000, "min_experience": 0,
     "borough": "Harrow", "postcode": "HA1", "breakdown_included": True,
     "designated_garage": "Harrow Auto Care", "wear_tear": "Standard", "restrictions": "None",
     "operator_code": "HA-0824", "operator_rating": 4.5, "operator_rentals": 29,
     "operator_since": 2021, "operator_response": "same day", "mileage": 71200,
     "features": ["Large boot", "ULEZ compliant", "Economical"],
     "description": "Reliable and economical estate with a huge boot. Great value weekly rent, ideal for new drivers. Breakdown cover included.",
     "photos": _photos("white_parked", "white_sedan", "white_bmw", "black_saloon")},

    {"id": "ve-005", "make": "Toyota", "model": "Camry", "year": 2022, "colour": "Black",
     "plate": "LK22 CMY", "vehicle_type": "saloon", "fuel": "hybrid", "mpg": 57, "seats": 5,
     "weekly_rent": 195, "deposit": 450, "mileage_allowance": 1300, "min_experience": 1,
     "borough": "Newham", "postcode": "E13", "breakdown_included": True,
     "designated_garage": "Stratford Motors", "wear_tear": "Standard", "restrictions": "None",
     "operator_code": "NE-2291", "operator_rating": 4.8, "operator_rentals": 63,
     "operator_since": 2021, "operator_response": "under 2 hours", "mileage": 38900,
     "features": ["Leather seats", "ULEZ compliant", "Dash cam", "Comfort ride"],
     "description": "Comfortable hybrid saloon, popular with executive passengers. Leather interior, low emissions, full service history.",
     "photos": _photos("black_merc", "black_merc2", "white_sedan", "white_lot")},

    {"id": "ve-006", "make": "Volkswagen", "model": "Caddy WAV", "year": 2021, "colour": "White",
     "plate": "BK21 WAV", "vehicle_type": "wav", "fuel": "diesel", "mpg": 45, "seats": 5,
     "weekly_rent": 185, "deposit": 500, "mileage_allowance": 1100, "min_experience": 2,
     "borough": "Barking & Dagenham", "postcode": "IG11", "breakdown_included": True,
     "designated_garage": "Barking Commercial", "wear_tear": "Standard", "restrictions": "Accessibility trained drivers preferred",
     "operator_code": "BK-4410", "operator_rating": 4.7, "operator_rentals": 19,
     "operator_since": 2022, "operator_response": "under 3 hours", "mileage": 54300,
     "features": ["Wheelchair accessible", "Ramp fitted", "ULEZ compliant"],
     "description": "Wheelchair-accessible vehicle with rear ramp. In demand for accessible PHV work across East London. Breakdown cover included.",
     "photos": _photos("white_lot", "white_parked", "white_forest", "black_merc2")},

    {"id": "ve-007", "make": "Mercedes-Benz", "model": "E-Class", "year": 2021, "colour": "Black",
     "plate": "ME21 EXC", "vehicle_type": "executive", "fuel": "diesel", "mpg": 52, "seats": 5,
     "weekly_rent": 265, "deposit": 700, "mileage_allowance": 1400, "min_experience": 3,
     "borough": "Westminster", "postcode": "SW1", "breakdown_included": True,
     "designated_garage": "Victoria Prestige", "wear_tear": "Enhanced", "restrictions": "3+ years experience",
     "operator_code": "WM-5567", "operator_rating": 4.9, "operator_rentals": 102,
     "operator_since": 2018, "operator_response": "under 1 hour", "mileage": 44800,
     "features": ["Executive interior", "Leather", "Sat nav", "Premium sound"],
     "description": "Premium executive saloon for high-end private hire and chauffeur work. Immaculate condition, enhanced wear-and-tear cover, breakdown included.",
     "photos": _photos("black_merc", "black_saloon", "black_merc2", "white_bmw")},

    {"id": "ve-008", "make": "BMW", "model": "3 Series", "year": 2020, "colour": "White",
     "plate": "BM20 SER", "vehicle_type": "executive", "fuel": "petrol", "mpg": 44, "seats": 5,
     "weekly_rent": 225, "deposit": 600, "mileage_allowance": 1200, "min_experience": 2,
     "borough": "Camden", "postcode": "NW1", "breakdown_included": False,
     "designated_garage": "Camden Motorworks", "wear_tear": "Standard", "restrictions": "None",
     "operator_code": "CM-2204", "operator_rating": 4.6, "operator_rentals": 47,
     "operator_since": 2020, "operator_response": "under 5 hours", "mileage": 58600,
     "features": ["Sport interior", "Alloy wheels", "Sat nav"],
     "description": "Sporty executive saloon with strong ratings. Popular for executive app work. Breakdown cover available as an add-on.",
     "photos": _photos("white_bmw", "white_forest", "white_sedan", "black_merc")},

    {"id": "ve-009", "make": "Toyota", "model": "Corolla", "year": 2022, "colour": "Grey",
     "plate": "TC22 COR", "vehicle_type": "saloon", "fuel": "hybrid", "mpg": 62, "seats": 5,
     "weekly_rent": 165, "deposit": 400, "mileage_allowance": 1250, "min_experience": 0,
     "borough": "Hounslow", "postcode": "TW3", "breakdown_included": True,
     "designated_garage": "Hounslow Hybrid Hub", "wear_tear": "Standard", "restrictions": "None",
     "operator_code": "HO-3391", "operator_rating": 4.7, "operator_rentals": 55,
     "operator_since": 2021, "operator_response": "under 3 hours", "mileage": 33100,
     "features": ["ULEZ compliant", "Dash cam", "Low running costs", "Apple CarPlay"],
     "description": "Efficient hybrid saloon near Heathrow, ideal for airport work. Low fuel costs, breakdown cover included, well maintained.",
     "photos": _photos("white_parked", "white_sedan", "white_lot", "black_merc2")},

    {"id": "ve-010", "make": "Nissan", "model": "Leaf", "year": 2021, "colour": "Blue",
     "plate": "NL21 EVL", "vehicle_type": "saloon", "fuel": "electric", "mpg": 0, "seats": 5,
     "weekly_rent": 175, "deposit": 450, "mileage_allowance": 1000, "min_experience": 1,
     "borough": "Lewisham", "postcode": "SE13", "breakdown_included": True,
     "designated_garage": "Lewisham EV Works", "wear_tear": "Standard", "restrictions": "None",
     "operator_code": "LW-7712", "operator_rating": 4.4, "operator_rentals": 24,
     "operator_since": 2022, "operator_response": "same day", "mileage": 29800,
     "features": ["168 mile range", "ULEZ exempt", "Fast charge", "Low running costs"],
     "description": "Fully electric, zero emissions and ULEZ exempt. Very low running costs for city work. Breakdown cover and home-charge guidance included.",
     "photos": _photos("tesla2", "tesla", "white_parked", "white_bmw")},

    {"id": "ve-011", "make": "Vauxhall", "model": "Insignia", "year": 2019, "colour": "Silver",
     "plate": "VI19 INS", "vehicle_type": "saloon", "fuel": "diesel", "mpg": 50, "seats": 5,
     "weekly_rent": 120, "deposit": 300, "mileage_allowance": 1000, "min_experience": 0,
     "borough": "Ealing", "postcode": "W5", "breakdown_included": False,
     "designated_garage": "Ealing Motor Group", "wear_tear": "Standard", "restrictions": "None",
     "operator_code": "EA-8830", "operator_rating": 4.3, "operator_rentals": 31,
     "operator_since": 2021, "operator_response": "same day", "mileage": 78200,
     "features": ["Budget friendly", "Spacious", "Cruise control"],
     "description": "Budget-friendly saloon, our lowest weekly rate. Great for drivers starting out. Breakdown cover available as an add-on.",
     "photos": _photos("white_forest", "white_parked", "white_sedan", "black_saloon")},

    {"id": "ve-012", "make": "Kia", "model": "Niro", "year": 2022, "colour": "Grey",
     "plate": "KN22 NRO", "vehicle_type": "estate", "fuel": "hybrid", "mpg": 60, "seats": 5,
     "weekly_rent": 175, "deposit": 450, "mileage_allowance": 1200, "min_experience": 1,
     "borough": "Bromley", "postcode": "BR1", "breakdown_included": True,
     "designated_garage": "Bromley Service Centre", "wear_tear": "Standard", "restrictions": "None",
     "operator_code": "BR-4419", "operator_rating": 4.6, "operator_rentals": 38,
     "operator_since": 2021, "operator_response": "under 4 hours", "mileage": 41500,
     "features": ["ULEZ compliant", "Roomy boot", "Reversing camera", "Economical"],
     "description": "Practical hybrid crossover with plenty of space and low fuel costs. Breakdown cover included, full service history.",
     "photos": _photos("white_bmw", "white_lot", "white_forest", "black_merc")},
]

# ---------------------------------------------------------------------------
# Generated inventory — market-accurate weekly rents (Splend/Otto/G&M benchmark)
# ---------------------------------------------------------------------------
# make, model, vtype, fuel, mpg, seats, base_rent, deposit, min_exp, colour, features
_MODELS = [
    ("Toyota", "Prius", "saloon", "hybrid", 65, 5, 175, 400, 1, "Silver", ["Dash cam", "ULEZ compliant", "Apple CarPlay"]),
    ("Toyota", "Corolla", "saloon", "hybrid", 62, 5, 165, 400, 0, "Grey", ["ULEZ compliant", "Reversing camera", "Low running costs"]),
    ("Toyota", "Camry", "saloon", "hybrid", 57, 5, 195, 450, 1, "Black", ["Leather seats", "ULEZ compliant", "Comfort ride"]),
    ("Honda", "Insight", "saloon", "hybrid", 60, 5, 170, 400, 1, "White", ["ULEZ compliant", "Adaptive cruise", "Apple CarPlay"]),
    ("Hyundai", "Ioniq", "saloon", "hybrid", 62, 5, 170, 400, 0, "Silver", ["ULEZ compliant", "Lane assist", "Economical"]),
    ("Toyota", "Corolla Touring", "estate", "hybrid", 60, 5, 180, 450, 1, "Silver", ["Large boot", "ULEZ compliant", "Reversing camera"]),
    ("Kia", "Niro", "estate", "hybrid", 60, 5, 175, 450, 1, "Grey", ["ULEZ compliant", "Roomy boot", "Economical"]),
    ("Skoda", "Octavia", "estate", "diesel", 58, 5, 140, 350, 0, "Blue", ["Large boot", "ULEZ compliant", "Cruise control"]),
    ("Volkswagen", "Passat", "estate", "diesel", 54, 5, 160, 400, 1, "Silver", ["Spacious", "ULEZ compliant", "Sat nav"]),
    ("Ford", "Galaxy", "mpv", "diesel", 48, 7, 175, 450, 2, "Grey", ["7 seats", "ULEZ compliant", "Parking sensors"]),
    ("Volkswagen", "Sharan", "mpv", "diesel", 46, 7, 180, 450, 2, "Silver", ["7 seats", "Sliding doors", "ULEZ compliant"]),
    ("Ford", "Tourneo", "mpv", "diesel", 44, 8, 200, 500, 2, "White", ["8 seats", "Ideal for airport work", "Parking sensors"]),
    ("Tesla", "Model 3", "executive", "electric", 0, 5, 245, 600, 2, "White", ["Long range", "Autopilot", "Fast charging"]),
    ("Tesla", "Model Y", "executive", "electric", 0, 5, 265, 650, 2, "White", ["Long range", "Spacious", "Fast charging"]),
    ("Polestar", "2", "executive", "electric", 0, 5, 250, 650, 2, "Grey", ["Premium interior", "Long range", "Fast charging"]),
    ("Nissan", "Leaf", "saloon", "electric", 0, 5, 175, 450, 1, "Blue", ["ULEZ exempt", "Fast charge", "Low running costs"]),
    ("Hyundai", "Kona Electric", "saloon", "electric", 0, 5, 179, 450, 1, "White", ["ULEZ exempt", "300 mile range", "Reversing camera"]),
    ("Kia", "e-Niro", "estate", "electric", 0, 5, 195, 500, 1, "White", ["ULEZ exempt", "Roomy boot", "Fast charge"]),
    ("Mercedes-Benz", "E-Class", "executive", "diesel", 52, 5, 265, 700, 3, "Black", ["Executive interior", "Leather", "Premium sound"]),
    ("BMW", "3 Series", "executive", "petrol", 44, 5, 225, 600, 2, "White", ["Sport interior", "Alloy wheels", "Sat nav"]),
    ("Audi", "A4", "executive", "diesel", 50, 5, 230, 600, 2, "Grey", ["Virtual cockpit", "Leather", "Sat nav"]),
    ("Mercedes-Benz", "C-Class", "executive", "hybrid", 55, 5, 245, 650, 2, "Black", ["ULEZ compliant", "Leather", "Premium sound"]),
    ("Vauxhall", "Insignia", "saloon", "diesel", 50, 5, 120, 300, 0, "Silver", ["Budget friendly", "Spacious", "Cruise control"]),
    ("Volkswagen", "Caddy WAV", "wav", "diesel", 45, 5, 185, 500, 2, "White", ["Wheelchair accessible", "Ramp fitted", "ULEZ compliant"]),
]

_LONDON = [
    ("Newham", "E13"), ("Croydon", "CR0"), ("Redbridge", "IG1"), ("Harrow", "HA1"),
    ("Barking & Dagenham", "IG11"), ("Westminster", "SW1"), ("Camden", "NW1"), ("Hounslow", "TW3"),
    ("Lewisham", "SE13"), ("Ealing", "W5"), ("Bromley", "BR1"), ("Enfield", "EN1"),
    ("Brent", "NW10"), ("Hackney", "E8"), ("Haringey", "N17"), ("Waltham Forest", "E17"),
    ("Greenwich", "SE10"), ("Southwark", "SE1"), ("Tower Hamlets", "E14"), ("Wandsworth", "SW18"),
    ("Merton", "SW19"), ("Sutton", "SM1"), ("Hillingdon", "UB8"), ("Bexley", "DA5"),
]

_OPS = [
    ("NE-2291", "Stratford Motors", 4.8, 63, 2021, "under 2 hours"),
    ("CR-1187", "Croydon Fleet Services", 4.6, 41, 2020, "under 4 hours"),
    ("IG-3350", "Ilford EV Centre", 4.9, 88, 2019, "under 1 hour"),
    ("HA-0824", "Harrow Auto Care", 4.5, 29, 2021, "same day"),
    ("WM-5567", "Victoria Prestige", 4.9, 102, 2018, "under 1 hour"),
    ("CM-2204", "Camden Motorworks", 4.6, 47, 2020, "under 5 hours"),
    ("HO-3391", "Hounslow Hybrid Hub", 4.7, 55, 2021, "under 3 hours"),
    ("LW-7712", "Lewisham EV Works", 4.4, 24, 2022, "same day"),
    ("EA-8830", "Ealing Motor Group", 4.3, 31, 2021, "same day"),
    ("BR-4419", "Bromley Service Centre", 4.6, 38, 2021, "under 4 hours"),
    ("EN-1120", "Enfield Fleet Co", 4.5, 33, 2020, "under 3 hours"),
    ("BN-6642", "Brent Cars Ltd", 4.7, 49, 2019, "under 2 hours"),
    ("HK-2098", "Hackney Hire", 4.5, 27, 2022, "same day"),
    ("TH-3376", "Docklands Rentals", 4.8, 71, 2019, "under 2 hours"),
    ("WD-5510", "Wandsworth Autos", 4.6, 44, 2020, "under 4 hours"),
]

# (city, area, postcode, operator_code, operator_name)
_OTHER = [
    ("Birmingham", "City Centre", "B1", "BM-1004", "Midlands Motor Hire"),
    ("Birmingham", "Sparkhill", "B11", "BM-1004", "Midlands Motor Hire"),
    ("Birmingham", "Handsworth", "B21", "BM-2087", "Brum Fleet Services"),
    ("Birmingham", "Small Heath", "B10", "BM-2087", "Brum Fleet Services"),
    ("Manchester", "City Centre", "M1", "MN-2207", "Northern Fleet Co"),
    ("Manchester", "Cheetham Hill", "M8", "MN-2207", "Northern Fleet Co"),
    ("Manchester", "Rusholme", "M14", "MN-3391", "Mancunian Hire"),
    ("Manchester", "Longsight", "M13", "MN-3391", "Mancunian Hire"),
    ("Leeds", "City Centre", "LS1", "LS-3309", "Leeds City Rentals"),
    ("Leeds", "Harehills", "LS8", "LS-3309", "Leeds City Rentals"),
    ("Leeds", "Beeston", "LS11", "LS-4418", "Yorkshire Auto Group"),
    ("Leeds", "Hyde Park", "LS6", "LS-4418", "Yorkshire Auto Group"),
]

_YEARS = [2020, 2021, 2022, 2023]
_PLATE_TAGS = ["CAB", "PHV", "TXI", "HIR", "LDN", "FLT", "GOU", "DRV"]


def _make_listing(idx, model, colour_override, city, borough, postcode, op, garage=None):
    make, mdl, vtype, fuel, mpg, seats, base, deposit, min_exp, colour, feats = model
    year = _YEARS[idx % len(_YEARS)]
    rent = base + (year - 2021) * 5
    breakdown = idx % 3 != 0
    yy = year % 100
    plate = f"{make[:2].upper()}{yy:02d} {_PLATE_TAGS[idx % len(_PLATE_TAGS)]}"
    mileage = 18000 + ((2023 - year) * 15000) + (idx * 137) % 9000
    op_code, op_name, op_rating, op_rentals, op_since, op_resp = op
    where = borough if city == "London" else f"{borough}, {city}"
    return {
        "id": f"ve-{13 + idx:03d}",
        "make": make, "model": mdl, "year": year, "colour": colour_override or colour,
        "plate": plate, "vehicle_type": vtype, "fuel": fuel, "mpg": mpg, "seats": seats,
        "weekly_rent": rent, "deposit": deposit, "mileage_allowance": 1000 + (seats >= 7) * 200,
        "min_experience": min_exp, "city": city, "borough": borough, "postcode": postcode,
        "breakdown_included": breakdown,
        "designated_garage": garage or op_name, "wear_tear": "Enhanced" if vtype == "executive" else "Standard",
        "restrictions": "3+ years experience" if min_exp >= 3 else "None",
        "operator_code": op_code, "operator_rating": op_rating, "operator_rentals": op_rentals,
        "operator_since": op_since, "operator_response": op_resp, "mileage": mileage,
        "features": feats,
        "description": f"{colour_override or colour} {make} {mdl} available for private hire in {where}. "
                       f"{'ULEZ compliant and ' if fuel in ('hybrid', 'electric') else ''}"
                       f"{'breakdown cover included' if breakdown else 'breakdown cover available as an add-on'}. "
                       f"Full service history, well maintained and ready for immediate handover.",
        "photos": _gallery_for(vtype, fuel, idx),
    }


def _build_generated():
    out = []
    idx = 0
    # 36 additional London listings across boroughs
    for i in range(36):
        model = _MODELS[i % len(_MODELS)]
        borough, postcode = _LONDON[i % len(_LONDON)]
        op = _OPS[i % len(_OPS)]
        out.append(_make_listing(idx, model, None, "London", borough, postcode, op))
        idx += 1
    # 12 listings in Birmingham, Manchester and Leeds
    for j, (city, area, postcode, op_code, op_name) in enumerate(_OTHER):
        model = _MODELS[(j * 2 + 3) % len(_MODELS)]
        op = (op_code, op_name, round(4.4 + (j % 5) * 0.1, 1), 20 + (j * 7) % 60, 2019 + (j % 4), _OPS[j % len(_OPS)][5])
        out.append(_make_listing(idx, model, None, city, area, postcode, op, garage=op_name))
        idx += 1
    return out


LISTINGS = LISTINGS + _build_generated()
