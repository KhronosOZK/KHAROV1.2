import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { SlidersHorizontal, Search } from "lucide-react";
import { api, trackEvent } from "@/lib/api";
import VehicleCard from "@/components/VehicleCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

const boroughs = ["all", "Newham", "Croydon", "Redbridge", "Harrow", "Barking & Dagenham", "Westminster", "Camden", "Hounslow", "Lewisham", "Ealing", "Bromley"];

export default function SearchResults() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const [listings, setListings] = useState(null);
  const [borough, setBorough] = useState(params.get("borough") || "all");
  const [vtype, setVtype] = useState(params.get("type") || "any");
  const [fuel, setFuel] = useState(params.get("fuel") || "any");
  const [range, setRange] = useState([Number(params.get("min")) || 180, Number(params.get("max")) || 400]);
  const [sort, setSort] = useState("default");

  const run = useCallback(async () => {
    setListings(null);
    const q = {};
    if (borough !== "all") q.borough = borough;
    if (vtype !== "any") q.vehicle_type = vtype;
    if (fuel !== "any") q.fuel = fuel;
    if (sort !== "default") q.sort = sort;
    const { data } = await api.get("/listings", { params: q });
    const filtered = data.filter((v) => v.weekly_rent >= range[0] && v.weekly_rent <= (range[1] >= 400 ? 9999 : range[1]));
    setListings(filtered);
  }, [borough, vtype, fuel, sort, range]);

  useEffect(() => { run(); /* eslint-disable-next-line */ }, [sort]);
  useEffect(() => { run(); /* eslint-disable-next-line */ }, []);

  const apply = () => {
    const p = new URLSearchParams();
    if (borough !== "all") p.set("borough", borough);
    if (vtype !== "any") p.set("type", vtype);
    if (fuel !== "any") p.set("fuel", fuel);
    p.set("min", range[0]); p.set("max", range[1]);
    setParams(p);
    trackEvent("search", { borough, vtype, fuel, range });
    run();
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <button onClick={() => navigate("/")} className="text-sm text-[#4A564F] hover:text-[#0B6B4F]">Home</button>
      <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-[#1A2E25] mt-2">
        {borough === "all" ? "Cars across London" : `Cars in ${borough}`}
      </h1>

      {/* Filter bar */}
      <div className="mt-6 bg-white rounded-2xl p-4 ring-1 ring-slate-200/70">
        <div className="flex items-center gap-2 text-[#0B6B4F] font-semibold text-sm mb-3"><SlidersHorizontal className="w-4 h-4" /> Refine</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Field label="Borough"><Select value={borough} onValueChange={setBorough}><SelectTrigger data-testid="sr-borough" className="h-11 bg-white"><SelectValue /></SelectTrigger><SelectContent>{boroughs.map((b) => <SelectItem key={b} value={b}>{b === "all" ? "All of London" : b}</SelectItem>)}</SelectContent></Select></Field>
          <Field label="Type"><Select value={vtype} onValueChange={setVtype}><SelectTrigger data-testid="sr-type" className="h-11 bg-white"><SelectValue /></SelectTrigger><SelectContent>{["any", "saloon", "executive", "mpv", "estate", "wav"].map((t) => <SelectItem key={t} value={t} className="capitalize">{t === "any" ? "Any type" : t.toUpperCase()}</SelectItem>)}</SelectContent></Select></Field>
          <Field label="Fuel"><Select value={fuel} onValueChange={setFuel}><SelectTrigger data-testid="sr-fuel" className="h-11 bg-white"><SelectValue /></SelectTrigger><SelectContent>{["any", "hybrid", "electric", "petrol", "diesel"].map((f) => <SelectItem key={f} value={f} className="capitalize">{f === "any" ? "Any fuel" : f}</SelectItem>)}</SelectContent></Select></Field>
          <Field label={`Budget: £${range[0]} to £${range[1] >= 400 ? "400+" : range[1]}`}><div className="h-11 flex items-center px-1"><Slider min={180} max={400} step={5} value={range} onValueChange={setRange} data-testid="sr-budget" minStepsBetweenThumbs={1} /></div></Field>
        </div>
        <Button onClick={apply} data-testid="sr-apply" className="mt-4 rounded-full bg-[#0B6B4F] hover:bg-[#095B43] text-white"><Search className="w-4 h-4 mr-2" /> Update results</Button>
      </div>

      <div className="flex items-center justify-between mt-8 mb-6 flex-wrap gap-3">
        <p className="text-[#4A564F]" data-testid="sr-count">{listings == null ? "Searching…" : `${listings.length} cars match`}</p>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-52 bg-white" data-testid="sr-sort"><SelectValue placeholder="Sort" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Our pick for you</SelectItem>
            <SelectItem value="price_asc">Cheapest first</SelectItem>
            <SelectItem value="price_desc">Dearest first</SelectItem>
            <SelectItem value="rating">Best rated operators</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {listings == null ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <div key={i} className="h-80 rounded-2xl bg-white ring-1 ring-slate-200/70 animate-pulse" />)}
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-20 text-[#7A857F] bg-white rounded-2xl ring-1 ring-slate-200" data-testid="sr-empty">
          Nothing matches that combination yet. Try widening your budget or picking another borough.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((v, i) => (<div key={v.id} className="animate-fade-up" style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}><VehicleCard v={v} /></div>))}
        </div>
      )}
    </main>
  );
}

const Field = ({ label, children }) => (<div><label className="text-[12.5px] font-medium text-[#4A564F] mb-1.5 block truncate">{label}</label>{children}</div>);
