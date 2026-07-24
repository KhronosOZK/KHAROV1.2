import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, ShieldCheck, Star, ArrowRight, Zap, Accessibility, TrendingUp, Sparkles, Wrench, BadgeCheck } from "lucide-react";
import { api, trackEvent } from "@/lib/api";
import { IMG } from "@/lib/images";
import VehicleCard from "@/components/VehicleCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

const boroughs = ["all", "Newham", "Croydon", "Redbridge", "Harrow", "Barking & Dagenham", "Westminster", "Camden", "Hounslow", "Lewisham", "Ealing", "Bromley"];

const collections = [
  { key: "electric", label: "Electric & ULEZ-exempt", desc: "Zero emissions, lowest running costs", icon: Zap, img: IMG.ev, filter: { fuel: "electric" } },
  { key: "executive", label: "Executive & premium", desc: "Higher fares, premium passengers", icon: Sparkles, img: IMG.executive, filter: { vehicle_type: "executive" } },
  { key: "value", label: "Under £250 / week", desc: "Best value for new drivers", icon: TrendingUp, img: IMG.hybrid, filter: { max_budget: 250 } },
  { key: "wav", label: "Wheelchair accessible", desc: "In-demand accessible work", icon: Accessibility, img: IMG.interior, filter: { vehicle_type: "wav" } },
];

export default function Home() {
  const navigate = useNavigate();
  const [all, setAll] = useState([]);
  const [listings, setListings] = useState([]);
  const [borough, setBorough] = useState("all");
  const [vtype, setVtype] = useState("any");
  const [fuel, setFuel] = useState("any");
  const [range, setRange] = useState([180, 400]);
  const [sort, setSort] = useState("default");

  const applyBudget = useCallback((arr) => arr.filter((v) => v.weekly_rent >= range[0] && v.weekly_rent <= (range[1] >= 400 ? 9999 : range[1])), [range]);

  const fetchList = useCallback(async (params = {}) => {
    const q = { ...params };
    if (sort !== "default") q.sort = sort;
    const { data } = await api.get("/listings", { params: q });
    setListings(data);
  }, [sort]);

  useEffect(() => {
    api.get("/listings").then((r) => { setAll(r.data); setListings(r.data); });
  }, []);

  const runSearch = () => {
    const params = {};
    if (borough !== "all") params.borough = borough;
    if (vtype !== "any") params.vehicle_type = vtype;
    if (fuel !== "any") params.fuel = fuel;
    trackEvent("search", { ...params, range });
    api.get("/listings", { params: { ...params, ...(sort !== "default" ? { sort } : {}) } })
      .then((r) => setListings(applyBudget(r.data)));
    document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
  };

  const openCollection = (c) => { trackEvent("collection_click", { key: c.key }); fetchList(c.filter); document.getElementById("results")?.scrollIntoView({ behavior: "smooth" }); };

  const featured = [...all].sort((a, b) => b.operator_rating - a.operator_rating)[0];
  const spotlight = [...all].sort((a, b) => b.operator_rating - a.operator_rating).slice(1, 4);

  const stats = [
    { n: "1,240+", l: "drivers matched" },
    { n: "4.7★", l: "avg operator rating" },
    { n: "86", l: "companies live" },
    { n: "<5%", l: "default rate target" },
  ];

  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMG.londonStreet} alt="London" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#12211B]/80 via-[#12211B]/75 to-[#12211B]/90" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-12 sm:pt-20 sm:pb-16">
          <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#10B981] bg-white/10 border border-white/10 px-3 py-1.5 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" /> London's trusted PHV rental marketplace
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="mt-5 text-4xl sm:text-5xl lg:text-7xl font-heading font-extrabold text-white tracking-tight max-w-4xl leading-[1.02]">
            Rent your next <span className="text-[#10B981]">PHV car</span>, the right way.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
            className="mt-5 text-base sm:text-xl text-white/80 max-w-2xl leading-relaxed">
            Compare real cars from vetted London rental companies. See the full weekly cost up front — rent, insurance and breakdown cover — and pay nothing until you're approved.
          </motion.p>

          {/* Search */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
            className="mt-9 bg-white rounded-3xl p-4 sm:p-6 shadow-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Filter label="Borough">
                <Select value={borough} onValueChange={setBorough}>
                  <SelectTrigger data-testid="filter-borough" className="h-11 bg-white"><SelectValue /></SelectTrigger>
                  <SelectContent>{boroughs.map((b) => <SelectItem key={b} value={b}>{b === "all" ? "All of London" : b}</SelectItem>)}</SelectContent>
                </Select>
              </Filter>
              <Filter label="Vehicle type">
                <Select value={vtype} onValueChange={setVtype}>
                  <SelectTrigger data-testid="filter-type" className="h-11 bg-white"><SelectValue /></SelectTrigger>
                  <SelectContent>{["any", "saloon", "executive", "mpv", "estate", "wav"].map((t) => <SelectItem key={t} value={t} className="capitalize">{t === "any" ? "Any type" : t.toUpperCase()}</SelectItem>)}</SelectContent>
                </Select>
              </Filter>
              <Filter label="Fuel">
                <Select value={fuel} onValueChange={setFuel}>
                  <SelectTrigger data-testid="filter-fuel" className="h-11 bg-white"><SelectValue /></SelectTrigger>
                  <SelectContent>{["any", "hybrid", "electric", "petrol", "diesel"].map((f) => <SelectItem key={f} value={f} className="capitalize">{f === "any" ? "Any fuel" : f}</SelectItem>)}</SelectContent>
                </Select>
              </Filter>
              <Filter label={`Weekly budget · £${range[0]} – £${range[1] >= 400 ? "400+" : range[1]}`}>
                <div className="h-11 flex items-center px-1">
                  <Slider min={180} max={400} step={5} value={range} onValueChange={setRange} data-testid="filter-budget" minStepsBetweenThumbs={1} />
                </div>
              </Filter>
            </div>
            <Button onClick={runSearch} data-testid="search-btn" className="w-full mt-4 h-12 rounded-2xl bg-[#047857] hover:bg-[#065F46] text-white text-base font-semibold">
              <Search className="w-5 h-5 mr-2" /> Search available cars
            </Button>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-9">
            {stats.map((s) => (
              <div key={s.l}><div className="text-2xl sm:text-3xl font-heading font-extrabold text-white">{s.n}</div><div className="text-xs text-white/55 mt-0.5">{s.l}</div></div>
            ))}
          </div>
        </div>
      </section>

      {/* SPOTLIGHT */}
      {featured && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="flex items-end justify-between mb-6">
            <div>
              <span className="text-xs font-semibold text-[#047857] uppercase tracking-wide">Spotlight</span>
              <h2 className="text-2xl sm:text-4xl font-heading font-bold text-[#1A2E25] mt-1">This week's top-rated cars</h2>
            </div>
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Big featured */}
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              onClick={() => navigate(`/vehicle/${featured.id}`)}
              className="group relative rounded-3xl overflow-hidden cursor-pointer min-h-[380px] flex flex-col justify-end" data-testid="spotlight-featured">
              <img src={featured.photos[0]} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12211B]/90 via-[#12211B]/20 to-transparent" />
              <div className="relative p-6 sm:p-8 text-white">
                <span className="inline-flex items-center gap-1 text-xs font-semibold bg-[#10B981] text-white px-2.5 py-1 rounded-full"><Star className="w-3 h-3 fill-white" /> {featured.operator_rating} · Top rated</span>
                <h3 className="text-2xl sm:text-3xl font-heading font-bold mt-3">{featured.make} {featured.model} {featured.year}</h3>
                <p className="text-white/70 mt-1 capitalize">{featured.fuel} · {featured.seats} seats · {featured.borough}</p>
                <div className="flex items-center gap-4 mt-4">
                  <span className="text-3xl font-heading font-extrabold">£{featured.weekly_rent}<span className="text-base font-normal text-white/70">/wk</span></span>
                  <span className="inline-flex items-center gap-1 text-sm text-white group-hover:gap-2 transition-all">View details <ArrowRight className="w-4 h-4" /></span>
                </div>
              </div>
            </motion.div>
            {/* 3 supporting */}
            <div className="grid sm:grid-cols-1 gap-4">
              {spotlight.map((v) => (
                <div key={v.id} onClick={() => navigate(`/vehicle/${v.id}`)}
                  className="group flex gap-4 bg-white border border-slate-200 rounded-2xl p-3 cursor-pointer hover:border-slate-400 hover:shadow-md transition-all">
                  <div className="w-32 sm:w-40 aspect-[4/3] rounded-xl overflow-hidden shrink-0 bg-[#F3F1EC]">
                    <img src={v.photos[0]} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="flex-1 min-w-0 py-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full w-fit"><BadgeCheck className="w-3 h-3" /> {v.operator_code}</div>
                    <h3 className="font-heading font-bold text-[#1A2E25] mt-1.5 truncate">{v.make} {v.model} {v.year}</h3>
                    <p className="text-xs text-[#64748B] capitalize">{v.fuel} · {v.seats} seats · {v.borough}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-lg font-heading font-extrabold text-[#1A2E25]">£{v.weekly_rent}<span className="text-xs font-normal text-[#64748B]">/wk</span></span>
                      <span className="inline-flex items-center gap-1 text-sm text-[#1A2E25]"><Star className="w-3.5 h-3.5 fill-[#D97706] text-[#D97706]" /> {v.operator_rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* COLLECTIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-4">
        <h2 className="text-2xl sm:text-4xl font-heading font-bold text-[#1A2E25] mb-6">Browse by collection</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {collections.map((c, i) => (
            <motion.button key={c.key} onClick={() => openCollection(c)} data-testid={`collection-${c.key}`}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] text-left">
              <img src={c.img} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12211B]/90 via-[#12211B]/30 to-transparent" />
              <div className="relative h-full flex flex-col justify-end p-4 text-white">
                <c.icon className="w-6 h-6 text-[#10B981] mb-2" />
                <h3 className="font-heading font-bold text-lg leading-tight">{c.label}</h3>
                <p className="text-xs text-white/70 mt-1">{c.desc}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* RESULTS */}
      <section id="results" className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#1A2E25]">{listings.length} vehicles available</h2>
          <Select value={sort} onValueChange={(v) => { setSort(v); }}>
            <SelectTrigger className="w-48 bg-white" data-testid="sort-select"><SelectValue placeholder="Sort" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Recommended</SelectItem>
              <SelectItem value="price_asc">Price: low to high</SelectItem>
              <SelectItem value="price_desc">Price: high to low</SelectItem>
              <SelectItem value="rating">Top rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {listings.length === 0 ? (
          <div className="text-center py-20 text-[#64748B] bg-white border border-slate-200 rounded-2xl" data-testid="empty-state">
            No vehicles match your filters. Try adjusting your budget or location.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((v, i) => (
              <div key={v.id} className="animate-fade-up" style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}><VehicleCard v={v} /></div>
            ))}
          </div>
        )}
      </section>

      {/* HOW IT WORKS teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <span className="text-xs font-semibold text-[#047857] uppercase tracking-wide">The Caro way</span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#1A2E25] mt-2">Find a car, understand the cost, get moving.</h2>
            <p className="text-[#475569] mt-4 leading-relaxed">No hidden fees, no chasing WhatsApp groups. Every car is from a vetted, TfL-verified operator, insured for hire and reward, with breakdown and support built in.</p>
            <div className="mt-6 space-y-4">
              {[
                { t: "Search & compare", d: "Filter by borough, fuel and budget. Full weekly cost shown up front." },
                { t: "Apply once, reuse everywhere", d: "Your licence and insurance profile are saved and reused on every listing." },
                { t: "Sign & drive", d: "Digital agreement, documented handover, cover included." },
              ].map((s, i) => (
                <div key={s.t} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#047857] text-white flex items-center justify-center font-heading font-bold shrink-0">{i + 1}</div>
                  <div><h3 className="font-heading font-bold text-[#1A2E25]">{s.t}</h3><p className="text-sm text-[#475569]">{s.d}</p></div>
                </div>
              ))}
            </div>
            <Button onClick={() => navigate("/driver-guide")} className="mt-7 rounded-full bg-[#1A2E25] hover:bg-[#0f1a15] text-white">See how it works <ArrowRight className="w-4 h-4 ml-2" /></Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src={IMG.phoneInCar} alt="" className="rounded-2xl object-cover w-full h-48 sm:h-60 mt-8" />
            <img src={IMG.happyDriver} alt="" className="rounded-2xl object-cover w-full h-48 sm:h-60" />
            <img src={IMG.keysHandover} alt="" className="rounded-2xl object-cover w-full h-48 sm:h-60" />
            <img src={IMG.interior} alt="" className="rounded-2xl object-cover w-full h-48 sm:h-60 -mt-8" />
          </div>
        </div>
      </section>

      {/* TRUST band */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { i: ShieldCheck, t: "Vetted operators only", d: "Every company checked against TfL & Companies House before listing." },
            { i: Wrench, t: "Cover built in", d: "Hire-and-reward insurance and breakdown options at checkout." },
            { i: Star, t: "Transparent pricing", d: "Full weekly cost shown up front. Deposit released on return." },
          ].map((x) => (
            <div key={x.t} className="bg-white border border-slate-200 rounded-2xl p-6">
              <x.i className="w-6 h-6 text-[#047857]" />
              <h3 className="font-heading font-bold text-[#1A2E25] mt-3">{x.t}</h3>
              <p className="text-sm text-[#475569] mt-1.5">{x.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* OPERATOR CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="relative rounded-3xl overflow-hidden">
          <img src={IMG.fleetAerial} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#12211B]/85" />
          <div className="relative p-8 sm:p-14 max-w-2xl text-white">
            <ShieldCheck className="w-8 h-8 text-[#10B981]" />
            <h2 className="text-2xl sm:text-4xl font-heading font-bold mt-4">Running a PHV rental fleet?</h2>
            <p className="text-white/70 mt-3 leading-relaxed text-lg">List your vehicles, get vetted drivers, and get paid fortnightly — guaranteed for two weeks if a driver defaults. 10% flat fee, no listing costs.</p>
            <div className="flex gap-3 mt-6 flex-wrap">
              <Button onClick={() => navigate("/list-your-fleet")} data-testid="list-fleet-cta" className="rounded-full bg-white text-[#1A2E25] hover:bg-[#F3F1EC] font-semibold">List your fleet <ArrowRight className="w-4 h-4 ml-2" /></Button>
              <Button onClick={() => navigate("/operator-guide")} variant="outline" className="rounded-full border-white/40 text-white bg-transparent hover:bg-white/10 hover:text-white">Operator guide</Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

const Filter = ({ label, children }) => (
  <div>
    <label className="text-xs font-semibold text-[#475569] mb-1.5 block truncate">{label}</label>
    {children}
  </div>
);
