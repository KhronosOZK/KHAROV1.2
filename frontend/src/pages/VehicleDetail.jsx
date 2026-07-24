import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Star, ShieldCheck, Wrench, Fuel, Users, Gauge, MapPin, ChevronLeft, Lock, Check, Building2, Rotate3d, Heart, Share2, Play,
} from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const COORDS = {
  "Newham": [51.528, 0.035], "Croydon": [51.372, -0.101], "Redbridge": [51.559, 0.076],
  "Harrow": [51.58, -0.336], "Barking & Dagenham": [51.554, 0.129], "Westminster": [51.497, -0.137],
  "Camden": [51.549, -0.142], "Hounslow": [51.468, -0.361], "Lewisham": [51.462, -0.011],
  "Ealing": [51.513, -0.305], "Bromley": [51.406, 0.015],
};

export default function VehicleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { saved, toggleSaved } = useAuth();
  const [v, setV] = useState(null);
  const [quote, setQuote] = useState(null);
  const [photo, setPhoto] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    api.get(`/listings/${id}`).then((r) => {
      setV(r.data);
      api.post("/quote", { listing_id: id }).then((q) => setQuote(q.data)).catch(() => {});
    }).catch(() => navigate("/"));
  }, [id, navigate]);

  if (!v) return <div className="max-w-7xl mx-auto px-4 py-20 text-[#64748B]">Loading…</div>;

  const insurance = quote ? quote.cheapest_weekly : null;
  const breakdownCost = v.breakdown_included ? 0 : 8;
  const total = (v.weekly_rent + (insurance || 0) + breakdownCost).toFixed(2);
  const monthly = (Number(total) * 4.33).toFixed(0);
  const isSaved = saved.includes(v.id);
  const [lat, lon] = COORDS[v.borough] || [51.509, -0.118];
  const bbox = `${lon - 0.06}%2C${lat - 0.03}%2C${lon + 0.06}%2C${lat + 0.03}`;
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lon}`;

  const specs = [
    { i: Fuel, l: "Fuel type", val: v.fuel, cap: true },
    { i: Users, l: "Seats", val: v.seats },
    { i: Gauge, l: v.fuel === "electric" ? "Range" : "MPG", val: v.fuel === "electric" ? "330 mi" : `${v.mpg} mpg` },
    { i: MapPin, l: "Mileage/wk", val: `${v.mileage_allowance} mi` },
  ];
  const included = [
    "MOT, road tax & PHV compliance handled by the operator",
    v.breakdown_included ? "Breakdown cover — 24/7 roadside assistance" : "Breakdown cover available for £8/week at checkout",
    `Scheduled servicing at ${v.designated_garage}`,
    "Insurance quote via Quotezone at checkout",
  ];
  const reviews = [
    { n: "Mo R.", t: "3 weeks ago", r: 5, txt: "Handover took about fifteen minutes, photos were done properly on both sides, and the car matched the listing exactly." },
    { n: "David K.", t: "6 weeks ago", r: 4, txt: "Good communication throughout. One small delay getting a service slot but they sorted a courtesy day rate while it was in." },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-32 lg:pb-6">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1 text-sm text-[#475569] hover:text-[#047857]" data-testid="back-btn"><ChevronLeft className="w-4 h-4" /> Back to search</button>
        <div className="flex items-center gap-2">
          <button onClick={() => toggleSaved(v.id)} className="inline-flex items-center gap-1.5 text-sm text-[#475569] hover:text-[#047857]" data-testid="detail-save"><Heart className={`w-4 h-4 ${isSaved ? "fill-[#DC2626] text-[#DC2626]" : ""}`} /> Save</button>
          <button className="inline-flex items-center gap-1.5 text-sm text-[#475569] hover:text-[#047857]"><Share2 className="w-4 h-4" /> Share</button>
        </div>
      </div>

      {/* Gallery — Turo/Airbnb style mosaic */}
      <div className="grid grid-cols-4 grid-rows-2 gap-2 rounded-3xl overflow-hidden h-[300px] sm:h-[440px]">
        <div className="col-span-4 sm:col-span-2 row-span-2 relative group cursor-pointer" onClick={() => setPhoto(0)}>
          <img src={v.photos[0]} alt="" className="w-full h-full object-cover" />
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 bg-white/95 text-[#1A2E25] text-xs font-semibold px-3 py-1.5 rounded-full"><Rotate3d className="w-3.5 h-3.5" /> 360° view available</span>
        </div>
        {v.photos.slice(1, 5).map((p, i) => (
          <div key={i} className="hidden sm:block relative group cursor-pointer" onClick={() => setPhoto(i + 1)}>
            <img src={p} alt="" className="w-full h-full object-cover group-hover:brightness-90 transition-all" />
            {i === 3 && <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm font-semibold"><Play className="w-5 h-5 mr-1.5" /> Watch tour</div>}
          </div>
        ))}
      </div>
      {/* Active photo bar */}
      <div className="flex gap-2 mt-3 overflow-x-auto hide-scrollbar">
        {v.photos.map((p, i) => (
          <button key={i} onClick={() => setPhoto(i)} className={`w-20 h-16 rounded-lg overflow-hidden border-2 shrink-0 ${photo === i ? "border-[#047857]" : "border-transparent"}`}>
            <img src={p} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2">
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-[#1A2E25]">{v.make} {v.model} {v.year}</h1>
          <p className="text-[#475569] mt-1">{v.borough}, {v.postcode} · {v.colour} · {v.mileage.toLocaleString()} miles · {v.plate}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge icon={ShieldCheck} text="TfL licence verified" />
            <Badge icon={Building2} text="Companies House match" />
            {v.breakdown_included && <Badge icon={Wrench} text="Breakdown cover included" />}
            <Badge icon={Star} text={`${v.operator_rating} · ${v.operator_rentals} rentals`} />
          </div>

          <div className="mt-6 bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-start gap-3">
            <Lock className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-emerald-900 text-sm">Verified Operator · {v.operator_code}</div>
              <p className="text-sm text-emerald-800/80 mt-1">The operator's registered name and contact details are shared once your application is approved — this keeps early enquiries within Caro. Responds in {v.operator_response} · member since {v.operator_since}.</p>
            </div>
          </div>

          <Section title="What's included in your weekly rent">
            <ul className="space-y-2.5">{included.map((x) => (<li key={x} className="flex items-start gap-2 text-sm text-[#475569]"><Check className="w-4 h-4 text-[#047857] shrink-0 mt-0.5" /> {x}</li>))}</ul>
          </Section>

          <Section title="About this car"><p className="text-[#475569] leading-relaxed">{v.description}</p>
            <div className="flex flex-wrap gap-2 mt-4">{v.features.map((f) => (<span key={f} className="text-xs font-medium text-[#1A2E25] bg-[#F3F1EC] px-3 py-1.5 rounded-full">{f}</span>))}</div>
          </Section>

          <Section title="Vehicle details">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {specs.map((s) => (<div key={s.l} className="bg-white border border-slate-200 rounded-2xl p-4"><s.i className="w-4 h-4 text-[#64748B]" /><div className="text-xs text-[#64748B] mt-2">{s.l}</div><div className={`font-semibold text-[#1A2E25] ${s.cap ? "capitalize" : ""}`}>{s.val}</div></div>))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3 mt-4 text-sm">
              <Row l="Min. experience" v={`${v.min_experience || "Any"}${v.min_experience ? " year(s)" : ""}`} />
              <Row l="Wear & tear policy" v={v.wear_tear} />
              <Row l="Designated garage" v={v.designated_garage} />
              <Row l="Driving restrictions" v={v.restrictions} />
              <Row l="Deposit" v={`£${v.deposit}`} />
            </div>
          </Section>

          {/* MAP */}
          <Section title="Pickup location">
            <div className="rounded-2xl overflow-hidden border border-slate-200">
              <iframe title="map" src={mapUrl} className="w-full h-72 border-0" loading="lazy" data-testid="location-map" />
            </div>
            <p className="text-sm text-[#64748B] mt-3 flex items-center gap-2"><MapPin className="w-4 h-4 text-[#047857]" /> Approximate pickup area: {v.borough}, {v.postcode}. Exact address is shared after your application is approved.</p>
          </Section>

          <Section title="Ratings & reviews">
            <div className="flex items-center gap-3 mb-4"><span className="text-4xl font-heading font-extrabold text-[#1A2E25]">{v.operator_rating}</span><div className="flex text-[#D97706]">{[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}</div><span className="text-sm text-[#64748B]">· {v.operator_rentals} completed rentals</span></div>
            <div className="grid sm:grid-cols-2 gap-4">
              {reviews.map((r) => (<div key={r.n} className="bg-white border border-slate-200 rounded-2xl p-4"><div className="flex items-center justify-between"><span className="font-semibold text-[#1A2E25]">{r.n}</span><span className="text-xs text-[#64748B]">{r.t}</span></div><div className="flex text-[#D97706] my-1.5">{[...Array(r.r)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}</div><p className="text-sm text-[#475569]">{r.txt}</p></div>))}
            </div>
          </Section>
        </div>

        {/* Cost panel desktop */}
        <div className="hidden lg:block">
          <div className="sticky top-24 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <CostPanel v={v} insurance={insurance} breakdownCost={breakdownCost} total={total} monthly={monthly} navigate={navigate} />
          </div>
        </div>
      </div>

      {/* Sticky mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200 p-4">
        <div className="flex items-center justify-between gap-3">
          <div><div className="text-xs text-[#64748B]">All-in from</div><div className="text-xl font-heading font-extrabold text-[#1A2E25]">£{total}<span className="text-sm font-medium text-[#64748B]">/wk</span></div></div>
          <Button onClick={() => navigate(`/apply/${v.id}`)} data-testid="apply-mobile-btn" className="flex-1 h-12 rounded-2xl bg-[#047857] hover:bg-[#065F46] text-white font-semibold">Apply to rent</Button>
        </div>
      </div>
    </main>
  );
}

function CostPanel({ v, insurance, breakdownCost, total, monthly, navigate }) {
  return (
    <>
      <div className="flex items-baseline gap-1"><span className="text-3xl font-heading font-extrabold text-[#1A2E25]">£{v.weekly_rent}</span><span className="text-[#64748B]">/week</span></div>
      <p className="text-xs text-[#64748B] mt-1">+ £{v.deposit} deposit, released on return</p>
      <div className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between"><span className="text-[#475569]">Weekly rent</span><span className="font-semibold">£{v.weekly_rent.toFixed(2)}</span></div>
        <div className="flex justify-between"><span className="text-[#475569]">Insurance (Quotezone)</span><span className="font-semibold">{insurance != null ? `£${insurance.toFixed(2)}` : "…"}</span></div>
        <div className="flex justify-between"><span className="text-[#475569]">Breakdown cover</span><span className="font-semibold">{v.breakdown_included ? "Included" : `£${breakdownCost.toFixed(2)}`}</span></div>
        <div className="border-t border-slate-200 pt-3 flex justify-between text-base"><span className="font-semibold text-[#1A2E25]">Total per week</span><span className="font-heading font-extrabold text-[#047857]">£{total}</span></div>
        <div className="text-xs text-[#64748B] text-right">≈ £{monthly}/month</div>
      </div>
      <Button onClick={() => navigate(`/apply/${v.id}`)} data-testid="apply-to-rent-btn" className="w-full mt-5 h-12 rounded-2xl bg-[#047857] hover:bg-[#065F46] text-white font-semibold">Apply to rent</Button>
      <div className="mt-5"><div className="text-xs font-semibold text-[#475569] mb-2">What happens next</div>
        <ol className="space-y-2 text-xs text-[#64748B]">{["Company reviews your application", "Background check runs", "Digital agreement signed", "Pay and arrange handover"].map((s, i) => (<li key={s} className="flex gap-2"><span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 text-[10px] flex items-center justify-center shrink-0 font-bold">{i + 1}</span>{s}</li>))}</ol>
      </div>
    </>
  );
}

const Badge = ({ icon: Icon, text }) => (<span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full"><Icon className="w-3 h-3" /> {text}</span>);
const Section = ({ title, children }) => (<div className="mt-8 border-t border-slate-200 pt-6"><h2 className="text-xl font-heading font-bold text-[#1A2E25] mb-4">{title}</h2>{children}</div>);
const Row = ({ l, v }) => (<div><div className="text-xs text-[#64748B]">{l}</div><div className="font-medium text-[#1A2E25]">{v}</div></div>);
