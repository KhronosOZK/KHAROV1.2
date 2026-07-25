import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Heart, Share2, MapPin, Check, RotateCw, ChevronLeft as CL, ChevronRight as CR } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { PRICING_TIERS, weeklyForWeeks } from "@/lib/pricing";
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

  if (!v) return <div className="max-w-7xl mx-auto px-4 py-20 text-[#7A857F]">Loading…</div>;

  const insurance = quote ? quote.cheapest_weekly : null;
  const breakdownCost = v.breakdown_included ? 0 : 8;
  const total = (v.weekly_rent + (insurance || 0) + breakdownCost).toFixed(2);
  const monthly = (Number(total) * 4.33).toFixed(0);
  const isSaved = saved.includes(v.id);
  const [lat, lon] = COORDS[v.borough] || [51.509, -0.118];
  const bbox = `${lon - 0.06}%2C${lat - 0.03}%2C${lon + 0.06}%2C${lat + 0.03}`;
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lon}`;

  const specs = [
    { l: "Fuel", val: v.fuel, cap: true }, { l: "Seats", val: v.seats },
    { l: v.fuel === "electric" ? "Range" : "Economy", val: v.fuel === "electric" ? "330 miles" : `${v.mpg} mpg` },
    { l: "Weekly mileage", val: `${v.mileage_allowance} miles` },
  ];
  const included = [
    "MOT, road tax and PHV compliance handled by the operator",
    v.breakdown_included ? "Breakdown cover with 24/7 roadside help" : "Add breakdown cover for £8 a week at checkout",
    `Servicing booked in at ${v.designated_garage}`,
    "A live insurance quote through Quotezone at checkout",
  ];
  const reviews = [
    { n: "Mo R.", t: "3 weeks ago", r: 5, txt: "Handover took about fifteen minutes, photos done properly on both sides, and the car was exactly as listed." },
    { n: "David K.", t: "6 weeks ago", r: 4, txt: "Good chat throughout. One small delay getting a service slot but they sorted a courtesy day rate while it was in." },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-32 lg:pb-6">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1 text-sm text-[#4A564F] hover:text-[#0B6B4F]" data-testid="back-btn"><ChevronLeft className="w-4 h-4" /> Back to the cars</button>
        <div className="flex items-center gap-4">
          <button onClick={() => toggleSaved(v.id)} className="inline-flex items-center gap-1.5 text-sm text-[#4A564F] hover:text-[#0B6B4F]" data-testid="detail-save"><Heart className={`w-4 h-4 ${isSaved ? "fill-[#B4472E] text-[#B4472E]" : ""}`} /> Save</button>
          <button className="inline-flex items-center gap-1.5 text-sm text-[#4A564F] hover:text-[#0B6B4F]"><Share2 className="w-4 h-4" /> Share</button>
        </div>
      </div>

      {/* Gallery */}
      <div className="grid grid-cols-4 grid-rows-2 gap-2 rounded-[26px] overflow-hidden h-[300px] sm:h-[440px]">
        <div className="col-span-4 sm:col-span-2 row-span-2 cursor-pointer" onClick={() => setPhoto(0)}>
          <img src={v.photos[0]} alt="" className="w-full h-full object-cover" />
        </div>
        {v.photos.slice(1, 5).map((p, i) => (
          <div key={i} className="hidden sm:block cursor-pointer overflow-hidden" onClick={() => setPhoto(i + 1)}>
            <img src={p} alt="" className="w-full h-full object-cover hover:brightness-95 transition-all" />
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-3 overflow-x-auto hide-scrollbar">
        {v.photos.map((p, i) => (
          <button key={i} onClick={() => setPhoto(i)} className={`w-20 h-16 rounded-lg overflow-hidden ring-2 shrink-0 ${photo === i ? "ring-[#0B6B4F]" : "ring-transparent"}`}><img src={p} alt="" className="w-full h-full object-cover" /></button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-10 mt-8">
        <div className="lg:col-span-2">
          <h1 className="text-3xl sm:text-[40px] font-heading font-extrabold text-[#1A2E25] leading-tight">{v.make} {v.model} {v.year}</h1>
          <p className="text-[#4A564F] mt-2 text-[16px]">{v.colour} · {v.mileage.toLocaleString()} miles on the clock · plate {v.plate}</p>

          {/* Clean trust row, no chips */}
          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-[14px] text-[#3B4A44]">
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-[#0B6B4F]" /> TfL licence checked</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-[#0B6B4F]" /> Companies House verified</span>
            <span className="flex items-center gap-1.5"><span className="text-[#C08A2D]">★</span> {v.operator_rating} across {v.operator_rentals} rentals</span>
          </div>

          <div className="mt-6 rounded-2xl bg-[#F1EFE9] p-5">
            <div className="font-semibold text-[#1A2E25]">A trusted operator in {v.borough}</div>
            <p className="text-[14px] text-[#4A564F] mt-1.5 leading-relaxed">We keep the company name private until your application is approved, so nobody can go around us. They usually reply in {v.operator_response} and have been renting through Caro since {v.operator_since}.</p>
          </div>

          <Section title="What your weekly rent covers">
            <ul className="space-y-3">{included.map((x) => (<li key={x} className="flex items-start gap-2.5 text-[15px] text-[#4A564F]"><Check className="w-4 h-4 text-[#0B6B4F] shrink-0 mt-1" /> {x}</li>))}</ul>
          </Section>

          <Section title="The longer you rent, the less you pay">
            <div className="grid sm:grid-cols-3 gap-3">
              {PRICING_TIERS.map((t, i) => {
                const wk = weeklyForWeeks(v.weekly_rent, t.weeks);
                return (
                  <div key={t.label} className={`rounded-2xl p-5 ring-1 ${i === 1 ? "ring-[#0B6B4F] bg-emerald-50/40" : "ring-slate-200 bg-white"}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-heading font-bold text-[#1A2E25]">{t.label}</span>
                      {i > 0 && <span className="text-[11px] font-semibold text-[#0B6B4F] bg-emerald-100 px-2 py-0.5 rounded-full">save {i === 1 ? "3" : "6"}%</span>}
                    </div>
                    <div className="text-[12px] text-[#7A857F] mt-0.5">{t.sub}</div>
                    <div className="text-2xl font-heading font-extrabold text-[#1A2E25] mt-3">£{wk.toFixed(0)}<span className="text-[13px] font-normal text-[#7A857F]"> a week</span></div>
                  </div>
                );
              })}
            </div>
            <p className="text-[13px] text-[#7A857F] mt-3">Commit to 26 weeks or more and it drops further. You choose your term when you apply.</p>
          </Section>

          <Section title="A bit about this car">
            <p className="text-[#4A564F] leading-relaxed text-[16px]">{v.description}</p>
            <div className="flex flex-wrap gap-2 mt-4">{v.features.map((f) => (<span key={f} className="text-[13px] font-medium text-[#1A2E25] bg-white ring-1 ring-slate-200 px-3 py-1.5 rounded-full">{f}</span>))}</div>
          </Section>

          {/* 360 spin */}
          <Section title="Take a spin around it">
            <p className="text-[14px] text-[#4A564F] mb-4">Drag left or right to look around the car, or press play to spin it yourself.</p>
            <Spin360 photos={v.photos} />
          </Section>

          <Section title="The details">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {specs.map((s) => (<div key={s.l} className="bg-white rounded-2xl p-4 ring-1 ring-slate-200/70"><div className="text-[12px] text-[#7A857F]">{s.l}</div><div className={`font-semibold text-[#1A2E25] mt-1 ${s.cap ? "capitalize" : ""}`}>{s.val}</div></div>))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3 mt-4 text-[14px]">
              <Row l="Experience needed" v={v.min_experience ? `${v.min_experience} year plus` : "Open to new drivers"} />
              <Row l="Wear and tear" v={v.wear_tear} />
              <Row l="Servicing garage" v={v.designated_garage} />
              <Row l="Restrictions" v={v.restrictions} />
              <Row l="Deposit" v={`£${v.deposit}, back on return`} />
            </div>
          </Section>

          <Section title="Where you would pick it up">
            <div className="rounded-2xl overflow-hidden ring-1 ring-slate-200"><iframe title="map" src={mapUrl} className="w-full h-72 border-0" loading="lazy" data-testid="location-map" /></div>
            <p className="text-[14px] text-[#7A857F] mt-3 flex items-center gap-2"><MapPin className="w-4 h-4 text-[#0B6B4F]" /> Roughly around {v.borough}, {v.postcode}. You get the exact address once you are approved.</p>
          </Section>

          <Section title="What drivers say">
            <div className="flex items-baseline gap-2 mb-4"><span className="text-4xl font-heading font-extrabold text-[#1A2E25]">{v.operator_rating}</span><span className="text-[#C08A2D] text-lg">★★★★★</span><span className="text-[14px] text-[#7A857F]">from {v.operator_rentals} rentals</span></div>
            <div className="grid sm:grid-cols-2 gap-4">
              {reviews.map((r) => (<div key={r.n} className="bg-white rounded-2xl p-5 ring-1 ring-slate-200/70"><div className="flex items-center justify-between"><span className="font-semibold text-[#1A2E25]">{r.n}</span><span className="text-[12px] text-[#7A857F]">{r.t}</span></div><div className="text-[#C08A2D] my-1.5 text-sm">{"★".repeat(r.r)}</div><p className="text-[14px] text-[#4A564F] leading-relaxed">{r.txt}</p></div>))}
            </div>
          </Section>
        </div>

        <div className="hidden lg:block">
          <div className="sticky top-24 bg-white rounded-[22px] p-6 ring-1 ring-slate-200/70 shadow-sm">
            <CostPanel v={v} insurance={insurance} breakdownCost={breakdownCost} total={total} monthly={monthly} navigate={navigate} />
          </div>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200 p-4">
        <div className="flex items-center justify-between gap-3">
          <div><div className="text-[12px] text-[#7A857F]">All in from</div><div className="text-xl font-heading font-extrabold text-[#1A2E25]">£{total}<span className="text-sm font-medium text-[#7A857F]"> pw</span></div></div>
          <Button onClick={() => navigate(`/apply/${v.id}`)} data-testid="apply-mobile-btn" className="flex-1 h-12 rounded-2xl bg-[#0B6B4F] hover:bg-[#095B43] text-white font-semibold">Apply to rent</Button>
        </div>
      </div>
    </main>
  );
}

function Spin360({ photos }) {
  const [idx, setIdx] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const startX = useRef(null);
  useEffect(() => {
    if (!spinning) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % photos.length), 220);
    return () => clearInterval(t);
  }, [spinning, photos.length]);
  const onDown = (e) => { startX.current = (e.touches ? e.touches[0].clientX : e.clientX); setSpinning(false); };
  const onMove = (e) => {
    if (startX.current == null) return;
    const x = (e.touches ? e.touches[0].clientX : e.clientX);
    if (Math.abs(x - startX.current) > 28) { setIdx((i) => (i + (x > startX.current ? 1 : photos.length - 1)) % photos.length); startX.current = x; }
  };
  const onUp = () => { startX.current = null; };
  return (
    <div className="relative rounded-[22px] overflow-hidden bg-[#EFEDE8] aspect-[16/10] select-none"
      onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
      onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp} data-testid="spin-360">
      <img src={photos[idx]} alt="360 view" draggable={false} className="w-full h-full object-cover pointer-events-none" />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/90 backdrop-blur rounded-full px-2 py-1.5 shadow">
        <button data-testid="spin-360-prev" onClick={() => setIdx((i) => (i + photos.length - 1) % photos.length)} className="w-8 h-8 rounded-full hover:bg-[#F1EFE9] flex items-center justify-center"><CL className="w-4 h-4" /></button>
        <button data-testid="spin-360-spin" onClick={() => setSpinning((s) => !s)} className="px-3 h-8 rounded-full bg-[#0B6B4F] text-white text-[13px] font-medium flex items-center gap-1.5"><RotateCw className={`w-3.5 h-3.5 ${spinning ? "animate-spin" : ""}`} /> {spinning ? "Stop" : "Spin"}</button>
        <button data-testid="spin-360-next" onClick={() => setIdx((i) => (i + 1) % photos.length)} className="w-8 h-8 rounded-full hover:bg-[#F1EFE9] flex items-center justify-center"><CR className="w-4 h-4" /></button>
      </div>
    </div>
  );
}

function CostPanel({ v, insurance, breakdownCost, total, monthly, navigate }) {
  return (
    <>
      <div className="flex items-baseline gap-1"><span className="text-3xl font-heading font-extrabold text-[#1A2E25]">£{v.weekly_rent}</span><span className="text-[#7A857F]">a week</span></div>
      <p className="text-[12px] text-[#7A857F] mt-1">plus £{v.deposit} deposit, returned when you hand the car back</p>
      <div className="mt-5 space-y-3 text-[14px]">
        <div className="flex justify-between"><span className="text-[#4A564F]">Weekly rent</span><span className="font-semibold">£{v.weekly_rent.toFixed(2)}</span></div>
        <div className="flex justify-between"><span className="text-[#4A564F]">Insurance quote</span><span className="font-semibold">{insurance != null ? `£${insurance.toFixed(2)}` : "…"}</span></div>
        <div className="flex justify-between"><span className="text-[#4A564F]">Breakdown cover</span><span className="font-semibold">{v.breakdown_included ? "Included" : `£${breakdownCost.toFixed(2)}`}</span></div>
        <div className="border-t border-slate-200 pt-3 flex justify-between text-base"><span className="font-semibold text-[#1A2E25]">Every week</span><span className="font-heading font-extrabold text-[#0B6B4F]">£{total}</span></div>
        <div className="text-[12px] text-[#7A857F] text-right">around £{monthly} a month</div>
      </div>
      <Button onClick={() => navigate(`/apply/${v.id}`)} data-testid="apply-to-rent-btn" className="w-full mt-5 h-12 rounded-2xl bg-[#0B6B4F] hover:bg-[#095B43] text-white font-semibold">Apply to rent</Button>
      <div className="mt-5"><div className="text-[12px] font-semibold text-[#4A564F] mb-2">What happens after you apply</div>
        <ol className="space-y-2 text-[12.5px] text-[#7A857F]">{["The company reviews your application", "A quick background check runs", "You sign the agreement digitally", "You pay and arrange to collect"].map((s, i) => (<li key={s} className="flex gap-2"><span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 text-[10px] flex items-center justify-center shrink-0 font-bold">{i + 1}</span>{s}</li>))}</ol>
      </div>
    </>
  );
}

const Section = ({ title, children }) => (<div className="mt-9 border-t border-slate-200 pt-7"><h2 className="text-xl font-heading font-bold text-[#1A2E25] mb-4">{title}</h2>{children}</div>);
const Row = ({ l, v }) => (<div><div className="text-[12px] text-[#7A857F]">{l}</div><div className="font-medium text-[#1A2E25] mt-0.5">{v}</div></div>);
