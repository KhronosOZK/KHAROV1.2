import { useEffect, useState } from "react";
import { useParams, useNavigate, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Car, Building2, PoundSterling, ChevronDown } from "lucide-react";
import { api } from "@/lib/api";
import { LIVE_CITIES, CITY_IMAGES } from "@/lib/cities";
import VehicleCard from "@/components/VehicleCard";
import { Button } from "@/components/ui/button";

const CITY_SEO = {
  London: {
    intro: "London is where Kharo started. Whether you drive for Uber, Bolt or a local firm, you'll find PCO-ready hybrids, electric cars and executive saloons in every borough, almost all of them ULEZ friendly. Rent from operators we've checked, with rent, insurance and cover shown as one weekly figure.",
    faq: [
      { q: "Do I need a PCO licence to rent a car in London?", a: "Yes. Every private hire car in London needs a TfL PCO licence, and so do you. Have your badge ready and you're good to go." },
      { q: "Are the cars ULEZ compliant?", a: "Almost all of them. Our hybrids and electric cars are ULEZ exempt or compliant, so you won't pay the daily charge." },
      { q: "How much does a PCO car cost in London?", a: "Rent-only prices start from around £130 a week. Insurance and breakdown cover are shown on top, so there are no surprises." },
    ],
  },
  Birmingham: {
    intro: "Birmingham is one of the busiest private hire markets outside London. Kharo brings you checked local operators right across the city, from the centre to Sparkhill, Handsworth and Small Heath, with fuel-efficient cars ready to earn.",
    faq: [
      { q: "What licence do I need to drive private hire in Birmingham?", a: "You'll need a private hire driver licence from Birmingham City Council, plus a licensed vehicle. Kharo cars are ready for council plating." },
      { q: "Which cars work best here?", a: "Hybrids like the Prius and Corolla are popular for low running costs, and we list plenty of them in Birmingham." },
      { q: "How soon can I start?", a: "Register your interest and we'll match you with a local car and operator as soon as we go live in Birmingham." },
    ],
  },
  Manchester: {
    intro: "Manchester's private hire scene is growing fast. Kharo lists vetted operators from the city centre out to Cheetham Hill, Rusholme and Longsight, so you can find a reliable car close to where you drive.",
    faq: [
      { q: "Do I need a Manchester council licence?", a: "Yes, you'll need a private hire driver and vehicle licence from your local council. Our operators can help you get plated." },
      { q: "Are electric cars a good choice in Manchester?", a: "They can be, with charging points across the city and very low running costs. We list electric and hybrid options here." },
      { q: "What will it cost me each week?", a: "Rent starts from around £130 a week, with insurance and cover shown clearly on top." },
    ],
  },
  Leeds: {
    intro: "Leeds drivers get the same honest deal from Kharo: checked operators, clear weekly pricing and cars ready for private hire work across the city, from the centre to Harehills, Beeston and Hyde Park.",
    faq: [
      { q: "What do I need to drive private hire in Leeds?", a: "A private hire driver and vehicle licence from Leeds City Council. Kharo cars are ready for council plating." },
      { q: "Which cars are available in Leeds?", a: "Mostly hybrids and electric cars with low running costs, plus a few MPVs and executive options." },
      { q: "Is there anything to pay to register?", a: "No. Registering your interest is free. You only pay once you've been approved and you're renting a car." },
    ],
  },
  Sheffield: {
    intro: "Sheffield is one of our newest cities. Kharo connects you with vetted local operators across the city, from the centre to Burngreave, Attercliffe and Firth Park, with efficient cars suited to the hills and the daily miles.",
    faq: [
      { q: "What licence do I need in Sheffield?", a: "A private hire driver and vehicle licence from Sheffield City Council. Our operators can help you through plating." },
      { q: "Which cars suit Sheffield best?", a: "Hybrids handle the hills well and keep fuel costs down. We list plenty of Priuses and Corollas here." },
      { q: "When can I rent a car in Sheffield?", a: "Register your interest now and we'll email you the moment cars are ready to rent in Sheffield." },
    ],
  },
};

export default function CityPage() {
  const { name } = useParams();
  const navigate = useNavigate();
  const city = LIVE_CITIES.find((c) => c.toLowerCase() === (name || "").toLowerCase()) || name;
  const isLive = LIVE_CITIES.includes(city);
  const [items, setItems] = useState(null);

  useEffect(() => {
    api.get(`/listings?city=${encodeURIComponent(city)}`).then((r) => setItems(r.data)).catch(() => setItems([]));
  }, [city]);

  const list = items || [];
  const count = list.length;
  const operators = new Set(list.map((v) => v.operator_code)).size;
  const boroughs = new Set(list.map((v) => v.borough)).size;
  const fromRent = count ? Math.min(...list.map((v) => v.weekly_rent)) : 0;
  const greenCount = list.filter((v) => v.fuel === "electric" || v.fuel === "hybrid").length;

  const stats = [
    { icon: Car, n: count, l: "cars ready to rent" },
    { icon: Building2, n: operators, l: "vetted operators" },
    { icon: MapPin, n: boroughs, l: "areas covered" },
    { icon: PoundSterling, n: `£${fromRent}`, l: "from, per week" },
  ];

  if (!isLive) return <Navigate to="/" replace />;
  if (items === null)
    return <main className="max-w-7xl mx-auto px-4 py-24 text-[#7A857F]" data-testid="city-loading">Loading {city}…</main>;

  return (
    <main data-testid={`city-page-${city}`}>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={CITY_IMAGES[city]} alt={`${city} skyline`} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#0A130F]/82" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A130F] via-[#0A130F]/70 to-[#0A130F]/35" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-16 sm:pt-20 sm:pb-24">
          <p className="text-[13px] font-medium text-[#5FD3A6] tracking-[0.14em] uppercase">Private hire cars in</p>
          <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            className="mt-3 text-[42px] leading-[1.02] sm:text-6xl lg:text-[72px] font-heading font-extrabold text-white tracking-tight drop-shadow-[0_2px_20px_rgba(0,0,0,0.4)]">
            {city}
          </motion.h1>
          <p className="mt-4 text-[17px] sm:text-xl text-white/85 max-w-2xl leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
            {count} vetted rental cars in {city} from {operators} operators we've checked ourselves. Rent,
            insurance and cover shown up front. No deposits vanishing, no chasing a stranger on WhatsApp.
          </p>
          <div className="flex gap-3 mt-8 flex-wrap">
            <Button onClick={() => navigate(`/search?city=${encodeURIComponent(city)}`)} data-testid="city-see-all"
              className="rounded-full bg-white text-[#1A2E25] hover:bg-[#F1EFE9] font-semibold">
              See all {count} cars <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button onClick={() => navigate("/register")} variant="outline"
              className="rounded-full border-white/40 text-white bg-transparent hover:bg-white/10 hover:text-white">
              Create a driver account
            </Button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-10 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((s) => (
            <div key={s.l} data-testid="city-stat" className="bg-white rounded-2xl p-5 ring-1 ring-slate-200/70 shadow-sm">
              <s.icon className="w-5 h-5 text-[#0B6B4F]" strokeWidth={1.6} />
              <div className="text-2xl sm:text-[28px] font-heading font-extrabold text-[#1A2E25] mt-3 leading-none">{s.n}</div>
              <div className="text-[12.5px] text-[#7A857F] mt-1.5">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-12">
        <p className="text-[17px] text-[#3B4A44] leading-relaxed max-w-3xl" data-testid="city-intro">{CITY_SEO[city]?.intro}</p>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="mb-7">
          <h2 className="text-[26px] sm:text-4xl font-heading font-bold text-[#1A2E25]">Cars in {city} right now</h2>
          <p className="text-[#7A857F] mt-1.5">
            {greenCount} of them are hybrid or fully electric, the lowest running costs on the road.
          </p>
        </div>
        {count === 0 ? (
          <div className="text-center py-20 text-[#7A857F] bg-white rounded-2xl ring-1 ring-slate-200">
            No cars listed in {city} yet. Check back soon.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.slice(0, 9).map((v) => <VehicleCard key={v.id} v={v} />)}
          </div>
        )}
        {count > 9 && (
          <div className="mt-8">
            <Button onClick={() => navigate(`/search?city=${encodeURIComponent(city)}`)} variant="outline" className="rounded-full">
              See all {count} cars in {city} <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-4" data-testid="city-faq">
        <h2 className="text-[24px] sm:text-3xl font-heading font-bold text-[#1A2E25] mb-6">Renting a car in {city}</h2>
        <div className="divide-y divide-slate-200 rounded-2xl ring-1 ring-slate-200 bg-white">
          {(CITY_SEO[city]?.faq || []).map((item) => (
            <details key={item.q} data-testid="city-faq-item" className="group p-5">
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-heading font-semibold text-[#1A2E25]">
                {item.q}
                <ChevronDown className="w-5 h-5 text-[#0B6B4F] shrink-0 transition-transform duration-300 group-open:rotate-180" />
              </summary>
              <p className="text-[15px] text-[#4A564F] mt-3 leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <h3 className="font-heading font-bold text-[#1A2E25] text-lg mb-4">Other cities we cover</h3>
        <div className="flex flex-wrap gap-2.5">
          {LIVE_CITIES.filter((c) => c !== city).map((c) => (
            <Link key={c} to={`/city/${c}`} data-testid={`city-link-${c}`}
              className="px-4 py-2 rounded-full bg-white ring-1 ring-slate-200 text-[#1A2E25] text-sm font-medium hover:ring-[#0B6B4F] hover:text-[#0B6B4F] transition-colors">
              {c}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
