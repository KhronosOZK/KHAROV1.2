import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Star, ShieldCheck, Wrench, Fuel, Users, Gauge, MapPin, ChevronLeft, Lock, Check, Building2,
} from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function VehicleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [v, setV] = useState(null);
  const [quote, setQuote] = useState(null);
  const [photo, setPhoto] = useState(0);

  useEffect(() => {
    api.get(`/listings/${id}`).then((r) => {
      setV(r.data);
      api.post("/quote", { listing_id: id }).then((q) => setQuote(q.data)).catch(() => {});
    }).catch(() => navigate("/"));
  }, [id, navigate]);

  if (!v) return <div className="max-w-7xl mx-auto px-4 py-20 text-[#64748B]">Loading…</div>;

  const insurance = quote ? quote.cheapest_weekly : null;
  const total = insurance ? (v.weekly_rent + insurance).toFixed(2) : v.weekly_rent.toFixed(2);

  const specs = [
    { i: Fuel, l: "Fuel type", val: v.fuel, cap: true },
    { i: Users, l: "Seats", val: v.seats },
    { i: Gauge, l: v.fuel === "electric" ? "Range" : "MPG", val: v.fuel === "electric" ? "330 mi" : `${v.mpg} mpg` },
    { i: MapPin, l: "Mileage allowance", val: `${v.mileage_allowance} mi/wk` },
  ];
  const included = [
    "MOT, road tax & PHV compliance handled by the operator",
    v.breakdown_included ? "Breakdown cover — 24/7 roadside assistance" : "Breakdown cover available as a weekly add-on",
    `Scheduled servicing at ${v.designated_garage}`,
    "Insurance quote via Quotezone at checkout",
  ];
  const reviews = [
    { n: "Mo R.", t: "3 weeks ago", txt: "Handover took about fifteen minutes, photos were done properly on both sides, and the car matched the listing exactly." },
    { n: "David K.", t: "6 weeks ago", txt: "Good communication throughout. One small delay getting a service slot but they sorted a courtesy day rate while it was in." },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-32 lg:pb-6">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1 text-sm text-[#475569] hover:text-[#047857] mb-4" data-testid="back-btn">
        <ChevronLeft className="w-4 h-4" /> Back to search
      </button>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Gallery */}
          <div className="rounded-2xl overflow-hidden bg-[#F3F1EC] aspect-[16/10]">
            <img src={v.photos[photo]} alt={`${v.make} ${v.model}`} className="w-full h-full object-cover" />
          </div>
          <div className="flex gap-2 mt-3">
            {v.photos.map((p, i) => (
              <button key={i} onClick={() => setPhoto(i)} data-testid={`thumb-${i}`}
                className={`w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${photo === i ? "border-[#047857]" : "border-transparent"}`}>
                <img src={p} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          <div className="mt-6">
            <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-[#1A2E25]">{v.make} {v.model} {v.year}</h1>
            <p className="text-[#475569] mt-1">{v.borough}, {v.postcode} · {v.colour} · {v.mileage.toLocaleString()} miles · {v.plate}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge icon={ShieldCheck} text="TfL licence verified" />
              <Badge icon={Building2} text="Companies House match" />
              {v.breakdown_included && <Badge icon={Wrench} text="Breakdown cover included" />}
              <Badge icon={Star} text={`${v.operator_rating} · ${v.operator_rentals} rentals`} />
            </div>
          </div>

          {/* Anonymity notice */}
          <div className="mt-6 bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-start gap-3">
            <Lock className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-emerald-900 text-sm">Verified Operator · {v.operator_code}</div>
              <p className="text-sm text-emerald-800/80 mt-1">The operator's registered name and contact details are shared once your application is approved — this keeps early enquiries within Caro. Responds in {v.operator_response} · member since {v.operator_since}.</p>
            </div>
          </div>

          <Section title="What's included in your weekly rent">
            <ul className="space-y-2.5">
              {included.map((x) => (
                <li key={x} className="flex items-start gap-2 text-sm text-[#475569]">
                  <Check className="w-4 h-4 text-[#047857] shrink-0 mt-0.5" /> {x}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="About this car">
            <p className="text-[#475569] leading-relaxed">{v.description}</p>
          </Section>

          <Section title="Vehicle details">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {specs.map((s) => (
                <div key={s.l} className="bg-white border border-slate-200 rounded-xl p-4">
                  <s.i className="w-4 h-4 text-[#64748B]" />
                  <div className="text-xs text-[#64748B] mt-2">{s.l}</div>
                  <div className={`font-semibold text-[#1A2E25] ${s.cap ? "capitalize" : ""}`}>{s.val}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3 mt-4 text-sm">
              <Row l="Min. experience" v={`${v.min_experience || "Any"}${v.min_experience ? " year(s)" : ""}`} />
              <Row l="Wear & tear policy" v={v.wear_tear} />
              <Row l="Designated garage" v={v.designated_garage} />
              <Row l="Driving restrictions" v={v.restrictions} />
              <Row l="Deposit" v={`£${v.deposit}`} />
            </div>
          </Section>

          <Section title="Ratings & reviews">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl font-heading font-extrabold text-[#1A2E25]">{v.operator_rating}</span>
              <div className="flex text-[#D97706]">{[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}</div>
            </div>
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r.n} className="bg-white border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#1A2E25]">{r.n}</span>
                    <span className="text-xs text-[#64748B]">{r.t}</span>
                  </div>
                  <p className="text-sm text-[#475569] mt-2">{r.txt}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>

        {/* Cost panel — desktop */}
        <div className="hidden lg:block">
          <div className="sticky top-24 bg-white border border-slate-200 rounded-2xl p-6">
            <CostPanel v={v} insurance={insurance} total={total} navigate={navigate} />
          </div>
        </div>
      </div>

      {/* Sticky mobile panel */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs text-[#64748B]">All-in from</div>
            <div className="text-xl font-heading font-extrabold text-[#1A2E25]">£{total}<span className="text-sm font-medium text-[#64748B]">/wk</span></div>
          </div>
          <Button onClick={() => navigate(`/apply/${v.id}`)} data-testid="apply-mobile-btn"
            className="flex-1 h-12 rounded-xl bg-[#047857] hover:bg-[#065F46] text-white font-semibold">Apply to rent</Button>
        </div>
      </div>
    </main>
  );
}

function CostPanel({ v, insurance, total, navigate }) {
  return (
    <>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-heading font-extrabold text-[#1A2E25]">£{v.weekly_rent}</span>
        <span className="text-[#64748B]">/week</span>
      </div>
      <p className="text-xs text-[#64748B] mt-1">+ £{v.deposit} deposit, released on return</p>
      <div className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between"><span className="text-[#475569]">Weekly rent</span><span className="font-semibold">£{v.weekly_rent.toFixed(2)}</span></div>
        <div className="flex justify-between"><span className="text-[#475569]">Insurance (from Quotezone)</span><span className="font-semibold">{insurance ? `£${insurance.toFixed(2)}` : "…"}</span></div>
        <div className="flex justify-between"><span className="text-[#475569]">Breakdown cover</span><span className="font-semibold">{v.breakdown_included ? "Included" : "+ £8.00"}</span></div>
        <div className="border-t border-slate-200 pt-3 flex justify-between text-base">
          <span className="font-semibold text-[#1A2E25]">Total per week</span>
          <span className="font-heading font-extrabold text-[#047857]">£{total}</span>
        </div>
      </div>
      <Button onClick={() => navigate(`/apply/${v.id}`)} data-testid="apply-to-rent-btn"
        className="w-full mt-5 h-12 rounded-xl bg-[#047857] hover:bg-[#065F46] text-white font-semibold">Apply to rent</Button>
      <div className="mt-5">
        <div className="text-xs font-semibold text-[#475569] mb-2">What happens next</div>
        <ol className="space-y-2 text-xs text-[#64748B]">
          {["Company reviews your application", "Background check runs", "Digital agreement signed", "Pay and arrange handover"].map((s, i) => (
            <li key={s} className="flex gap-2"><span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 text-[10px] flex items-center justify-center shrink-0 font-bold">{i + 1}</span>{s}</li>
          ))}
        </ol>
      </div>
    </>
  );
}

const Badge = ({ icon: Icon, text }) => (
  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
    <Icon className="w-3 h-3" /> {text}
  </span>
);
const Section = ({ title, children }) => (
  <div className="mt-8 border-t border-slate-200 pt-6">
    <h2 className="text-xl font-heading font-bold text-[#1A2E25] mb-4">{title}</h2>
    {children}
  </div>
);
const Row = ({ l, v }) => (
  <div><div className="text-xs text-[#64748B]">{l}</div><div className="font-medium text-[#1A2E25]">{v}</div></div>
);
