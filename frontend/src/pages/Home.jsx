import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, ArrowRight, Zap, Accessibility, Sparkles, Coins } from "lucide-react";
import { api, trackEvent } from "@/lib/api";
import { IMG } from "@/lib/images";
import { estimateOperatorAnnual } from "@/lib/pricing";
import { POPULAR_CITIES, MORE_CITIES } from "@/lib/cities";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

const boroughs = ["all", "Newham", "Croydon", "Redbridge", "Harrow", "Barking & Dagenham", "Westminster", "Camden", "Hounslow", "Lewisham", "Ealing", "Bromley"];
const collections = [
  { key: "electric", label: "Electric and ULEZ exempt", desc: "The lowest running costs in London", icon: Zap, img: IMG.ev, q: "fuel=electric" },
  { key: "executive", label: "Executive and premium", desc: "Higher fares, better passengers", icon: Sparkles, img: IMG.executive, q: "type=executive" },
  { key: "value", label: "Under £250 a week", desc: "An easy place to start out", icon: Coins, img: IMG.hybrid, q: "max=250" },
  { key: "wav", label: "Wheelchair accessible", desc: "Steady, in demand work", icon: Accessibility, img: IMG.interior, q: "type=wav" },
];

export default function Home() {
  const navigate = useNavigate();
  const [all, setAll] = useState([]);
  const [city, setCity] = useState("London");
  const [vtype, setVtype] = useState("any");
  const [fuel, setFuel] = useState("any");
  const [range, setRange] = useState([0, 400]);

  useEffect(() => { api.get("/listings").then((r) => setAll(r.data)); }, []);

  const goSearch = () => {
    const p = new URLSearchParams();
    p.set("city", city);
    if (vtype !== "any") p.set("type", vtype);
    if (fuel !== "any") p.set("fuel", fuel);
    p.set("min", range[0]); p.set("max", range[1]);
    trackEvent("search", { city, vtype, fuel, range });
    navigate(`/search?${p.toString()}`);
  };

  const featured = [...all].sort((a, b) => b.operator_rating - a.operator_rating)[0];
  const spotlight = [...all].sort((a, b) => b.operator_rating - a.operator_rating).slice(1, 4);
  const earn = estimateOperatorAnnual("6-15");

  const stats = [
    { n: all.length ? `${all.length}` : "60", l: "cars from operators we've checked" },
    { n: "5 cities", l: "London, Birmingham, Manchester, Leeds & Sheffield" },
    { n: "Under 24h", l: "to hear back after you apply" },
    { n: "One price", l: "rent, insurance and cover, weekly" },
  ];

  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMG.londonNight} alt="London at night" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#0A130F]/88" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A130F] via-[#0A130F]/70 to-[#0A130F]/40" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-14 sm:pt-24 sm:pb-20">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-[13px] font-medium text-[#5FD3A6] tracking-[0.14em] uppercase">
            Private hire car rental, done properly
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="mt-4 text-[38px] leading-[1.03] sm:text-6xl lg:text-[76px] font-heading font-extrabold text-white tracking-tight max-w-4xl text-balance drop-shadow-[0_2px_20px_rgba(0,0,0,0.4)]">
            London private hire cars, no hidden costs and no nonsense.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
            className="mt-5 text-[17px] sm:text-xl text-white/85 max-w-2xl leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
            You pay nothing until you're approved and behind the wheel. Every car comes from a rental company we've checked ourselves, with the real weekly cost — rent, insurance and cover — shown up front.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
            className="mt-9 bg-white rounded-[26px] p-4 sm:p-6 shadow-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Filter label="Where you drive">
                <Select value={city} onValueChange={setCity}><SelectTrigger data-testid="filter-borough" className="h-11 bg-white"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectGroup><SelectLabel className="text-[11px] uppercase tracking-wide text-[#0B6B4F]">Most popular</SelectLabel>
                      {POPULAR_CITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectGroup>
                    <SelectGroup><SelectLabel className="text-[11px] uppercase tracking-wide text-[#9AA39D]">More cities</SelectLabel>
                      {MORE_CITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectGroup>
                  </SelectContent></Select>
              </Filter>
              <Filter label="Type of car">
                <Select value={vtype} onValueChange={setVtype}><SelectTrigger data-testid="filter-type" className="h-11 bg-white"><SelectValue /></SelectTrigger>
                  <SelectContent>{["any", "saloon", "executive", "mpv", "estate", "wav"].map((t) => <SelectItem key={t} value={t} className="capitalize">{t === "any" ? "Any type" : t.toUpperCase()}</SelectItem>)}</SelectContent></Select>
              </Filter>
              <Filter label="Fuel">
                <Select value={fuel} onValueChange={setFuel}><SelectTrigger data-testid="filter-fuel" className="h-11 bg-white"><SelectValue /></SelectTrigger>
                  <SelectContent>{["any", "hybrid", "electric", "petrol", "diesel"].map((f) => <SelectItem key={f} value={f} className="capitalize">{f === "any" ? "Any fuel" : f}</SelectItem>)}</SelectContent></Select>
              </Filter>
              <Filter label={`Weekly budget: £${range[0]} to £${range[1] >= 400 ? "400+" : range[1]}`}>
                <div className="h-11 flex items-center px-1"><Slider min={0} max={400} step={5} value={range} onValueChange={setRange} data-testid="filter-budget" minStepsBetweenThumbs={1} /></div>
              </Filter>
            </div>
            <Button onClick={goSearch} data-testid="search-btn" className="w-full mt-4 h-12 rounded-2xl bg-[#0B6B4F] hover:bg-[#095B43] text-white text-base font-semibold">
              <Search className="w-5 h-5 mr-2" /> Show me the cars
            </Button>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-6 mt-10">
            {stats.map((s) => (
              <div key={s.l} className="border-l border-white/20 pl-4">
                <div className="text-2xl sm:text-[28px] font-heading font-extrabold text-white leading-none">{s.n}</div>
                <div className="text-[12.5px] text-white/60 mt-2 leading-snug">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SPOTLIGHT */}
      {featured && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <p className="text-[13px] font-medium text-[#0B6B4F] tracking-[0.12em] uppercase">Worth a look</p>
          <h2 className="text-[26px] sm:text-4xl font-heading font-bold text-[#1A2E25] mt-2">Popular cars from our vetted operators</h2>
          <div className="grid lg:grid-cols-2 gap-6 mt-8">
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              onClick={() => navigate(`/vehicle/${featured.id}`)}
              className="group relative rounded-[26px] overflow-hidden cursor-pointer min-h-[400px] flex flex-col justify-end" data-testid="spotlight-featured">
              <img src={featured.photos[0]} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A130F]/92 via-[#0A130F]/25 to-transparent" />
              <div className="relative p-7 sm:p-9 text-white">
                <span className="text-[13px] text-white/80">Rated {featured.operator_rating} across {featured.operator_rentals} rentals</span>
                <h3 className="text-2xl sm:text-[32px] font-heading font-bold mt-2">{featured.make} {featured.model} {featured.year}</h3>
                <p className="text-white/70 mt-1 capitalize">{featured.fuel} · {featured.seats} seats · {featured.borough}</p>
                <div className="flex items-center gap-4 mt-4">
                  <span className="text-[30px] font-heading font-extrabold">£{featured.weekly_rent}<span className="text-base font-normal text-white/70"> a week</span></span>
                  <span className="inline-flex items-center gap-1 text-sm text-white group-hover:gap-2 transition-all">See the full cost <ArrowRight className="w-4 h-4" /></span>
                </div>
              </div>
            </motion.div>
            <div className="grid gap-4">
              {spotlight.map((v) => (
                <div key={v.id} onClick={() => navigate(`/vehicle/${v.id}`)}
                  className="group flex gap-4 bg-white rounded-2xl p-3 cursor-pointer ring-1 ring-slate-200/70 hover:ring-slate-300 hover:shadow-md transition-all">
                  <div className="w-32 sm:w-44 aspect-[4/3] rounded-xl overflow-hidden shrink-0 bg-[#EFEDE8]">
                    <img src={v.photos[0]} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="flex-1 min-w-0 py-1.5">
                    <h3 className="font-heading font-bold text-[#1A2E25] mt-0.5 truncate">{v.make} {v.model} {v.year}</h3>
                    <p className="text-[12.5px] text-[#7A857F] capitalize">{v.fuel} · {v.seats} seats · {v.borough}</p>
                    <p className="text-[12.5px] text-[#7A857F] mt-1">{v.operator_rentals} rentals completed</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-lg font-heading font-extrabold text-[#1A2E25]">£{v.weekly_rent}<span className="text-xs font-normal text-[#7A857F]"> pw</span></span>
                      <span className="text-[13px] text-[#1A2E25] font-medium"><span className="text-[#C08A2D]">★</span> {v.operator_rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8"><Button onClick={() => navigate("/search")} variant="outline" className="rounded-full">See all {all.length} cars <ArrowRight className="w-4 h-4 ml-2" /></Button></div>
        </section>
      )}

      {/* COLLECTIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-4">
        <h2 className="text-[26px] sm:text-4xl font-heading font-bold text-[#1A2E25] mb-7">Find the right kind of work</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {collections.map((c, i) => (
            <motion.button key={c.key} onClick={() => navigate(`/search?${c.q}`)} data-testid={`collection-${c.key}`}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] text-left">
              <img src={c.img} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A130F]/92 via-[#0A130F]/30 to-transparent" />
              <div className="relative h-full flex flex-col justify-end p-5 text-white">
                <c.icon className="w-6 h-6 text-[#5FD3A6] mb-2" />
                <h3 className="font-heading font-bold text-[17px] leading-tight">{c.label}</h3>
                <p className="text-[12.5px] text-white/70 mt-1">{c.desc}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <p className="text-[13px] font-medium text-[#0B6B4F] tracking-[0.12em] uppercase">How it works</p>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#1A2E25] mt-2 text-balance">Find a car, know the cost, get on the road.</h2>
            <p className="text-[#4A564F] mt-4 leading-relaxed text-[17px]">No deposits disappearing, no chasing a stranger on WhatsApp. Just a straight, honest way to rent from companies we already trust.</p>
            <div className="mt-7 space-y-6">
              {[
                { n: "1", t: "Look around", d: "Filter by borough, fuel and budget. The price you see is the price you pay, cover included." },
                { n: "2", t: "Tell us once", d: "Your licence and insurance details are saved and reused, so you never fill the same form twice." },
                { n: "3", t: "Agree and drive", d: "Agree the rental terms with the operator, do a quick photo walkround at handover, and the keys are yours." },
              ].map((s) => (
                <div key={s.n} className="flex gap-5">
                  <div className="text-[34px] font-heading font-extrabold text-[#D6D2C8] leading-none w-8">{s.n}</div>
                  <div><h3 className="font-heading font-bold text-[#1A2E25] text-lg">{s.t}</h3><p className="text-[15px] text-[#4A564F] mt-1">{s.d}</p></div>
                </div>
              ))}
            </div>
            <Button onClick={() => navigate("/driver-guide")} className="mt-8 rounded-full bg-[#1A2E25] hover:bg-[#0f1a15] text-white">Read the full walkthrough <ArrowRight className="w-4 h-4 ml-2" /></Button>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <img src={IMG.phoneInCar} alt="" className="rounded-2xl object-cover w-full h-40 sm:h-64 sm:mt-8" />
            <img src={IMG.driverMirror} alt="" className="rounded-2xl object-cover w-full h-40 sm:h-64" />
            <img src={IMG.keysHandover} alt="" className="rounded-2xl object-cover w-full h-40 sm:h-64" />
            <img src={IMG.interior} alt="" className="rounded-2xl object-cover w-full h-40 sm:h-64 sm:-mt-8" />
          </div>
        </div>
      </section>

      {/* OPERATOR CTA with earnings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="relative rounded-[26px] overflow-hidden">
          <img src={IMG.showroom} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A130F]/97 via-[#0A130F]/90 to-[#0A130F]/70" />
          <div className="relative p-8 sm:p-16 grid lg:grid-cols-2 gap-8 items-center">
            <div className="text-white [text-shadow:0_2px_18px_rgba(0,0,0,0.5)]">
              <p className="text-[13px] font-medium text-[#5FD3A6] tracking-[0.12em] uppercase">For rental companies</p>
              <h2 className="text-[26px] sm:text-4xl font-heading font-bold mt-3 text-balance">Keep your cars earning, not sitting on a forecourt.</h2>
              <p className="text-white/75 mt-4 leading-relaxed text-[17px]">List your fleet, get matched with vetted drivers, and get paid every fortnight. If a driver stops paying, we cover the rent for up to two weeks while you sort it out.</p>
              <div className="flex gap-3 mt-7 flex-wrap">
                <Button onClick={() => navigate("/list-your-fleet")} data-testid="list-fleet-cta" className="rounded-full bg-white text-[#1A2E25] hover:bg-[#F1EFE9] font-semibold">List your fleet <ArrowRight className="w-4 h-4 ml-2" /></Button>
                <Button onClick={() => navigate("/operator-guide")} variant="outline" className="rounded-full border-white/40 text-white bg-transparent hover:bg-white/10 hover:text-white">See how it works</Button>
              </div>
            </div>
            <div className="bg-white rounded-3xl p-7 shadow-xl">
              <div className="text-[12px] text-[#7A857F] uppercase tracking-wide font-semibold">Typical earnings per car</div>
              <div className="text-4xl sm:text-5xl font-heading font-extrabold text-[#0B6B4F] mt-2">£{earn.perCarYear.toLocaleString()}<span className="text-lg text-[#7A857F] font-normal"> / year</span></div>
              <div className="text-[#4A564F] text-[14px] mt-1">before our 10% fee, at typical utilisation</div>
              <div className="h-px bg-slate-200 my-5" />
              <div className="space-y-2.5 text-[14px]">
                <div className="flex justify-between"><span className="text-[#4A564F]">Run 10 cars</span><span className="font-heading font-bold text-[#1A2E25]">£{(earn.perCarYear * 10).toLocaleString()}/yr</span></div>
                <div className="flex justify-between"><span className="text-[#4A564F]">Paid to you</span><span className="font-heading font-bold text-[#1A2E25]">Every fortnight</span></div>
                <div className="flex justify-between"><span className="text-[#4A564F]">If a driver defaults</span><span className="font-heading font-bold text-[#0B6B4F]">Rent covered 2 wks</span></div>
              </div>
              <Button onClick={() => navigate("/list-your-fleet")} className="w-full mt-6 rounded-full bg-[#0B6B4F] hover:bg-[#095B43] text-white font-semibold">See your earning potential</Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

const Filter = ({ label, children }) => (
  <div><label className="text-[12.5px] font-medium text-[#4A564F] mb-1.5 block truncate">{label}</label>{children}</div>
);
