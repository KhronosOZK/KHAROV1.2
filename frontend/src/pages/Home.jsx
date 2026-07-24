import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Sparkles, ShieldCheck, Star, ArrowRight } from "lucide-react";
import { api, trackEvent } from "@/lib/api";
import VehicleCard from "@/components/VehicleCard";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

const HERO = "https://images.unsplash.com/photo-1534800891164-a1d96b5114e7?crop=entropy&cs=srgb&fm=jpg&q=85&w=2000";
const boroughs = ["all", "Newham", "Croydon", "Redbridge", "Harrow", "Barking & Dagenham", "Westminster", "Camden", "Hounslow", "Lewisham", "Ealing", "Bromley"];
const chips = [
  { label: "All vehicles", f: {} },
  { label: "Hybrid", f: { fuel: "hybrid" } },
  { label: "Electric", f: { fuel: "electric" } },
  { label: "Wheelchair accessible", f: { vehicle_type: "wav" } },
  { label: "Breakdown cover", f: { breakdown: true } },
  { label: "Under £250/wk", f: { max_budget: 250 } },
];

export default function Home() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [borough, setBorough] = useState("all");
  const [vtype, setVtype] = useState("any");
  const [fuel, setFuel] = useState("any");
  const [budget, setBudget] = useState([400]);
  const [activeChip, setActiveChip] = useState(0);
  const [sort, setSort] = useState("default");

  const fetch = useCallback(async (params = {}) => {
    const q = { ...params };
    if (sort !== "default") q.sort = sort;
    const { data } = await api.get("/listings", { params: q });
    setListings(data);
  }, [sort]);

  useEffect(() => { fetch(); }, [fetch]);

  const runSearch = () => {
    const params = {};
    if (borough !== "all") params.borough = borough;
    if (vtype !== "any") params.vehicle_type = vtype;
    if (fuel !== "any") params.fuel = fuel;
    if (budget[0] < 400) params.max_budget = budget[0];
    trackEvent("search", params);
    setActiveChip(-1);
    fetch(params);
  };

  const applyChip = (i) => { setActiveChip(i); fetch(chips[i].f); };

  const stats = [
    { n: "1,240+", l: "drivers matched" },
    { n: "4.7★", l: "average operator rating" },
    { n: "86", l: "rental companies live" },
    { n: "<5%", l: "driver default rate target" },
  ];

  return (
    <main>
      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0">
          <img src={HERO} alt="London" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#1A2E25]/85" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-10 sm:pt-24 sm:pb-16">
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#10B981] bg-white/10 px-3 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5" /> London's PHV marketplace
          </span>
          <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-white tracking-tight max-w-3xl">
            Find your next <span className="text-[#10B981] italic">rental car.</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-white/80 max-w-2xl leading-relaxed">
            Compare real cars from vetted London rental companies. See the full weekly cost up front — rent, insurance, breakdown cover — and pay nothing until you're approved.
          </p>

          {/* Search bar */}
          <div className="mt-8 bg-white rounded-2xl p-4 sm:p-5 shadow-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#475569] mb-1.5 block">Borough</label>
                <Select value={borough} onValueChange={setBorough}>
                  <SelectTrigger data-testid="filter-borough"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {boroughs.map((b) => <SelectItem key={b} value={b}>{b === "all" ? "All of London" : b}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#475569] mb-1.5 block">Vehicle type</label>
                <Select value={vtype} onValueChange={setVtype}>
                  <SelectTrigger data-testid="filter-type"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["any", "saloon", "executive", "mpv", "estate", "wav"].map((t) =>
                      <SelectItem key={t} value={t} className="capitalize">{t === "any" ? "Any type" : t.toUpperCase()}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#475569] mb-1.5 block">Fuel</label>
                <Select value={fuel} onValueChange={setFuel}>
                  <SelectTrigger data-testid="filter-fuel"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["any", "hybrid", "electric", "petrol", "diesel"].map((f) =>
                      <SelectItem key={f} value={f} className="capitalize">{f === "any" ? "Any fuel" : f}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#475569] mb-1.5 block">Max weekly budget · £{budget[0]}{budget[0] >= 400 ? "+" : ""}</label>
                <div className="h-10 flex items-center px-1">
                  <Slider min={180} max={400} step={5} value={budget} onValueChange={setBudget} data-testid="filter-budget" />
                </div>
              </div>
            </div>
            <Button onClick={runSearch} data-testid="search-btn"
              className="w-full mt-4 h-12 rounded-xl bg-[#047857] hover:bg-[#065F46] text-white text-base font-semibold">
              <Search className="w-5 h-5 mr-2" /> Search {listings.length ? `${listings.length} cars` : ""}
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            {stats.map((s) => (
              <div key={s.l}>
                <div className="text-2xl sm:text-3xl font-heading font-extrabold text-white">{s.n}</div>
                <div className="text-xs text-white/60 mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chips + results */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {chips.map((c, i) => (
            <button key={c.label} onClick={() => applyChip(i)} data-testid={`chip-${i}`}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                activeChip === i ? "bg-[#1A2E25] text-white border-[#1A2E25]" : "bg-white text-[#475569] border-slate-200 hover:border-slate-400"}`}>
              {c.label}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mt-8 mb-6">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#1A2E25]">
            {listings.length} vehicles available
          </h2>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-44" data-testid="sort-select"><SelectValue placeholder="Sort" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Recommended</SelectItem>
              <SelectItem value="price_asc">Price: low to high</SelectItem>
              <SelectItem value="price_desc">Price: high to low</SelectItem>
              <SelectItem value="rating">Top rated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {listings.length === 0 ? (
          <div className="text-center py-20 text-[#64748B]" data-testid="empty-state">
            No vehicles match your filters. Try adjusting your budget or location.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((v, i) => (
              <div key={v.id} className="animate-fade-up" style={{ animationDelay: `${i * 40}ms` }}>
                <VehicleCard v={v} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#1A2E25] mb-8">How renting works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { t: "Search & compare", d: "Filter by borough, fuel type and budget. Every listing shows the full weekly cost up front — no surprises later." },
            { t: "Apply & get verified", d: "A short application, checked once and reused everywhere. Most drivers hear back within 24 hours." },
            { t: "Sign & drive", d: "Digital agreement, documented handover, and you're on the road — with breakdown cover and support built in." },
          ].map((s, i) => (
            <div key={s.t} className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="w-9 h-9 rounded-full bg-[#047857] text-white flex items-center justify-center font-heading font-bold">{i + 1}</div>
              <h3 className="font-heading font-bold text-lg text-[#1A2E25] mt-4">{s.t}</h3>
              <p className="text-sm text-[#475569] mt-2 leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Operator CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-[#1A2E25] rounded-2xl p-8 sm:p-12 grain overflow-hidden">
          <div className="max-w-2xl">
            <ShieldCheck className="w-8 h-8 text-[#10B981]" />
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white mt-4">Running a PHV rental fleet?</h2>
            <p className="text-white/70 mt-3 leading-relaxed">
              List your vehicles, get vetted drivers, and get paid fortnightly — guaranteed for two weeks if a driver defaults.
            </p>
            <Button onClick={() => navigate("/list-your-fleet")} data-testid="list-fleet-cta"
              className="mt-6 rounded-full bg-white text-[#1A2E25] hover:bg-[#F3F1EC] font-semibold">
              List your fleet <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
