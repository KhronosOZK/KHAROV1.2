import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Check, ShieldCheck, Lock } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const steps = ["Personal", "Licence", "Insurance", "Review"];

export default function Apply() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [v, setV] = useState(null);
  const [quote, setQuote] = useState(null);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [f, setF] = useState({ full_name: "", email: "", phone: "", dob: "", dvla_licence: "", pco_licence: "", years_experience: "", previous_incidents: "none" });

  useEffect(() => {
    window.scrollTo(0, 0);
    api.get(`/listings/${id}`).then((r) => setV(r.data)).catch(() => navigate("/"));
    api.post("/quote", { listing_id: id }).then((r) => setQuote(r.data)).catch(() => {});
  }, [id, navigate]);
  useEffect(() => { if (user) setF((p) => ({ ...p, full_name: user.name || "", email: user.email || "", phone: user.phone || "" })); }, [user]);

  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));
  const insurance = quote ? quote.cheapest_weekly : 0;
  const breakdownCost = v && !v.breakdown_included ? 8 : 0;
  const total = v ? (v.weekly_rent + insurance + breakdownCost).toFixed(2) : "0";

  const canNext = () => {
    if (step === 0) return f.full_name && f.email && f.phone && f.dob;
    if (step === 1) return f.dvla_licence && f.pco_licence;
    return true;
  };

  const submit = async () => {
    try {
      await api.post("/applications", {
        listing_id: id, full_name: f.full_name, email: f.email, phone: f.phone, dob: f.dob,
        dvla_licence: f.dvla_licence, pco_licence: f.pco_licence,
        years_experience: f.years_experience ? Number(f.years_experience) : null,
        previous_incidents: f.previous_incidents,
        insurance_details: { insurer: quote?.quotes?.[0]?.insurer, weekly: insurance },
        estimated_weekly_cost: Number(total),
      });
      setDone(true); window.scrollTo(0, 0);
    } catch { toast.error("Couldn't send your application. Please try again."); }
  };

  if (!v) return <div className="max-w-2xl mx-auto px-4 py-20 text-[#64748B]">Loading…</div>;

  if (done) return (
    <main className="max-w-xl mx-auto px-4 py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto"><Check className="w-8 h-8 text-emerald-700" /></div>
      <h1 className="text-3xl font-heading font-extrabold text-[#1A2E25] mt-6" data-testid="apply-success">Application sent</h1>
      <p className="text-[#475569] mt-3 leading-relaxed">Verified Operator · {v.operator_code} typically responds within 24 hours. We'll email and notify you the moment they review it. Their full registered details are shared with you the moment they accept.</p>
      <div className="flex gap-3 justify-center mt-8"><Button onClick={() => navigate("/portal")} className="rounded-full bg-[#047857] hover:bg-[#065F46] text-white">Go to my portal</Button><Button onClick={() => navigate("/")} variant="outline" className="rounded-full">Keep browsing</Button></div>
    </main>
  );

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Stepper */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${i <= step ? "bg-[#047857] text-white" : "bg-[#E2E8F0] text-[#64748B]"}`}>{i < step ? <Check className="w-4 h-4" /> : i + 1}</div>
                  <span className={`text-xs mt-1.5 hidden sm:block ${i <= step ? "text-[#1A2E25] font-medium" : "text-[#94A3B8]"}`}>{s}</span>
                </div>
                {i < steps.length - 1 && <div className={`h-0.5 flex-1 mx-2 rounded ${i < step ? "bg-[#047857]" : "bg-[#E2E8F0]"}`} />}
              </div>
            ))}
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8">
            {step === 0 && (<div>
              <h1 className="text-2xl font-heading font-bold text-[#1A2E25]">Let's start with the basics</h1>
              <p className="text-sm text-[#64748B] mt-1 mb-6">Takes about 3 minutes. You'll need your DVLA and PCO licence numbers next.</p>
              <div className="space-y-4">
                <Field label="Full name" testid="apply-name"><Input value={f.full_name} onChange={set("full_name")} placeholder="Jordan Smith" className="h-11" /></Field>
                <Field label="Date of birth" testid="apply-dob"><Input type="date" value={f.dob} onChange={set("dob")} className="h-11" /></Field>
                <Field label="Email" testid="apply-email"><Input type="email" value={f.email} onChange={set("email")} placeholder="you@email.com" className="h-11" /></Field>
                <Field label="Phone" testid="apply-phone"><Input value={f.phone} onChange={set("phone")} placeholder="07…" className="h-11" /></Field>
              </div>
            </div>)}
            {step === 1 && (<div>
              <h1 className="text-2xl font-heading font-bold text-[#1A2E25]">Licence & driving info</h1>
              <p className="text-sm text-[#64748B] mt-1 mb-6">The same information insurers ask for — captured once so you're never asked twice.</p>
              <div className="space-y-4">
                <Field label="DVLA licence number" testid="apply-dvla"><Input value={f.dvla_licence} onChange={set("dvla_licence")} placeholder="SMITH901284JS9AB" className="h-11" /></Field>
                <Field label="PCO / TfL licence number (6 digits)" testid="apply-pco"><Input value={f.pco_licence} onChange={set("pco_licence")} placeholder="123456" className="h-11" /></Field>
                <Field label="Years of driving experience" testid="apply-exp"><Input type="number" value={f.years_experience} onChange={set("years_experience")} placeholder="3" className="h-11" /></Field>
                <Field label="Any incidents in the last 5 years?" testid="apply-incidents"><Input value={f.previous_incidents} onChange={set("previous_incidents")} placeholder="None declared" className="h-11" /></Field>
              </div>
            </div>)}
            {step === 2 && (<div>
              <h1 className="text-2xl font-heading font-bold text-[#1A2E25]">Choose your insurance</h1>
              <p className="text-sm text-[#64748B] mt-1 mb-6">Quotes generated for this vehicle via Quotezone. We've picked the cheapest fully comprehensive policy.</p>
              <div className="space-y-3">
                {(quote?.quotes || []).map((q) => (
                  <div key={q.insurer} className={`border rounded-2xl p-4 flex items-center justify-between ${q.cheapest ? "border-[#047857] bg-emerald-50/50" : "border-slate-200"}`}>
                    <div><div className="font-semibold text-[#1A2E25] flex items-center gap-2">{q.insurer}{q.cheapest && <span className="text-[10px] bg-[#047857] text-white px-1.5 py-0.5 rounded">Cheapest</span>}</div><div className="text-xs text-[#64748B]">{q.level} · {q.note}</div></div>
                    <div className="font-heading font-extrabold text-[#1A2E25]">£{q.weekly}<span className="text-xs font-normal text-[#64748B]">/wk</span></div>
                  </div>
                ))}
              </div>
            </div>)}
            {step === 3 && (<div>
              <h1 className="text-2xl font-heading font-bold text-[#1A2E25]">Review & submit</h1>
              <p className="text-sm text-[#64748B] mt-1 mb-6">Check the details, then send your application to Verified Operator · {v.operator_code}.</p>
              <div className="space-y-3 text-sm bg-[#F9F8F6] rounded-2xl p-5">
                <Rev l="Vehicle" v={`${v.make} ${v.model} ${v.year}`} />
                <Rev l="Applicant" v={f.full_name} />
                <Rev l="Weekly rent" v={`£${v.weekly_rent.toFixed(2)}`} />
                <Rev l="Insurance" v={`${quote?.quotes?.[0]?.insurer || "Quote"} — £${insurance.toFixed(2)}/wk`} />
                <div className="border-t border-slate-200 pt-3 flex justify-between font-semibold text-base"><span>Total estimated weekly cost</span><span className="text-[#047857]">£{total}</span></div>
              </div>
              <div className="mt-4 flex items-start gap-2 text-xs text-[#64748B]"><ShieldCheck className="w-4 h-4 text-[#047857] shrink-0 mt-0.5" /> Your details are used only to vet you for this rental — never sold on. You won't be charged until you've signed a digital agreement.</div>
            </div>)}

            <div className="flex gap-3 mt-8">
              {step > 0 && <Button variant="outline" onClick={() => setStep(step - 1)} className="rounded-full" data-testid="apply-back">Back</Button>}
              {step < 3 ? (
                <Button onClick={() => canNext() ? setStep(step + 1) : toast.error("Please fill in the required fields.")} className="rounded-full bg-[#047857] hover:bg-[#065F46] text-white flex-1" data-testid="apply-continue">Continue</Button>
              ) : (
                <Button onClick={submit} className="rounded-full bg-[#047857] hover:bg-[#065F46] text-white flex-1" data-testid="apply-submit">Send application</Button>
              )}
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div>
          <div className="lg:sticky lg:top-24 bg-white border border-slate-200 rounded-3xl overflow-hidden">
            <img src={v.photos[0]} alt="" className="w-full h-40 object-cover" />
            <div className="p-6">
              <h3 className="font-heading font-bold text-[#1A2E25]">{v.make} {v.model} {v.year}</h3>
              <p className="text-xs text-[#64748B] capitalize">{v.fuel} · {v.seats} seats · {v.borough}</p>
              <div className="mt-4 space-y-2.5 text-sm">
                <div className="flex justify-between"><span className="text-[#475569]">Weekly rent</span><span className="font-semibold">£{v.weekly_rent.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-[#475569]">Insurance</span><span className="font-semibold">£{insurance.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-[#475569]">Breakdown</span><span className="font-semibold">{v.breakdown_included ? "Included" : `£${breakdownCost.toFixed(2)}`}</span></div>
                <div className="border-t border-slate-200 pt-2.5 flex justify-between text-base"><span className="font-semibold">Total / week</span><span className="font-heading font-extrabold text-[#047857]">£{total}</span></div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-[#64748B]"><Lock className="w-3.5 h-3.5 text-[#047857]" /> Operator identity revealed on approval.</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

const Field = ({ label, children, testid }) => (<div data-testid={testid}><Label className="text-sm text-[#475569] mb-1.5 block">{label}</Label>{children}</div>);
const Rev = ({ l, v }) => (<div className="flex justify-between"><span className="text-[#64748B]">{l}</span><span className="font-medium text-[#1A2E25]">{v}</span></div>);
