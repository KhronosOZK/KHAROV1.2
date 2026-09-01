import { useEffect, useState } from "react";
import { useParams, useNavigate, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Car, Building2, PoundSterling } from "lucide-react";
import { api } from "@/lib/api";
import { LIVE_CITIES, CITY_IMAGES } from "@/lib/cities";
import VehicleCard from "@/components/VehicleCard";
import { Button } from "@/components/ui/button";

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
            {count} vetted rental cars in {city} from {operators} operators we've checked ourselves — rent,
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

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="mb-7">
          <h2 className="text-[26px] sm:text-4xl font-heading font-bold text-[#1A2E25]">Cars in {city} right now</h2>
          <p className="text-[#7A857F] mt-1.5">
            {greenCount} of them are hybrid or fully electric — the lowest running costs on the road.
          </p>
        </div>
        {count === 0 ? (
          <div className="text-center py-20 text-[#7A857F] bg-white rounded-2xl ring-1 ring-slate-200">
            No cars listed in {city} yet — check back soon.
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
