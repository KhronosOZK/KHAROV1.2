import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, ArrowLeft, ShieldCheck, Clock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { DRIVER_CARS, estimateDriverWeek } from "@/lib/pricing";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const inputCls = "h-12 bg-white border-slate-200 rounded-xl focus-visible:ring-[#0B6B4F]/30 focus-visible:border-[#0B6B4F]";

const STEPS = [
  { key: "name", q: "What's your name?", sub: "This is how operators will see you when you apply.", fields: [{ label: "Full name", name: "name", placeholder: "Jordan Smith", testid: "reg-name" }], required: ["name"] },
  { key: "email", q: "What's your email?", sub: "We'll send your account details and quotes here.", fields: [{ label: "Email", name: "email", type: "email", placeholder: "you@email.com", testid: "reg-email" }], required: ["email"] },
  { key: "phone", q: "Your mobile number", sub: "Operators can reach you faster this way.", fields: [{ label: "Mobile number", name: "phone", placeholder: "07…", testid: "reg-phone" }], required: ["phone"] },
  { key: "password", q: "Create a password", sub: "So you can pick up right where you left off.", fields: [{ label: "Password", name: "password", type: "password", placeholder: "At least 6 characters", testid: "reg-password" }], required: ["password"], minPassword: true },
  { key: "dob", q: "When were you born?", sub: "Most operators require drivers to be 21 or over.", fields: [{ label: "Date of birth", name: "dob", type: "date", testid: "reg-dob" }] },
  { key: "licence", q: "Your driving licences", sub: "Optional now, but adding them means faster quotes and one less form later.", fields: [{ label: "DVLA licence number", name: "dvla_licence", placeholder: "SMITH901284JS9AB", testid: "reg-dvla" }, { label: "PCO / TfL badge number", name: "pco_licence", placeholder: "123456", testid: "reg-pco" }] },
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [f, setF] = useState({ name: "", email: "", phone: "", password: "", dob: "", dvla_licence: "", pco_licence: "" });
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));

  const [carKey, setCarKey] = useState("hybrid");
  const est = estimateDriverWeek(carKey);

  const cur = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const pct = Math.round(((step + 1) / STEPS.length) * 100);

  const canNext = () => {
    if (cur.required) { for (const r of cur.required) if (!f[r]?.trim()) return false; }
    if (cur.minPassword && f.password.length < 6) return false;
    return true;
  };

  const finish = async () => {
    setLoading(true);
    const res = await register({ ...f, role: "driver" });
    setLoading(false);
    if (res.ok) { toast.success("Account created. Welcome to Caro."); navigate("/portal"); }
    else toast.error(res.error);
  };

  const next = () => {
    if (!canNext()) { toast.error(cur.minPassword ? "Your password needs at least 6 characters." : "Please fill this in to continue."); return; }
    if (!isLast) setStep(step + 1); else finish();
  };
  const back = () => setStep((s) => Math.max(0, s - 1));

  return (
    <main className="bg-[#F9F8F6] min-h-[calc(100vh-68px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 lg:py-20 grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center">
        {/* LEFT — value stage (light) */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center lg:text-left">
          <p className="text-[13px] font-medium text-[#0B6B4F] tracking-[0.12em] uppercase">Drive with Caro</p>
          <h1 className="mt-3 font-heading font-extrabold tracking-tight text-4xl sm:text-5xl lg:text-6xl leading-[1.03] text-[#1A2E25] text-balance">
            The keys to a<br /><span className="text-[#0B6B4F]">better week.</span>
          </h1>
          <p className="mt-5 text-[17px] text-[#4A564F] max-w-md mx-auto lg:mx-0 leading-relaxed">
            Rent, insurance and breakdown cover in one honest weekly figure. Pick a car and see what a full-time week could put in your pocket.
          </p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.5 }}
            className="mt-8 max-w-md mx-auto lg:mx-0 text-left rounded-[24px] bg-white ring-1 ring-slate-200/70 p-6 sm:p-7 shadow-sm" data-testid="driver-take-home">
            <div className="text-[11px] text-[#7A857F] uppercase tracking-[0.18em]">Your estimated take-home</div>
            <div className="flex items-end gap-2 mt-1.5">
              <AnimatedNumber value={est.takeHome} prefix="£" data-testid="driver-takehome-value" className="text-[clamp(2.6rem,8vw,4rem)] font-heading font-extrabold text-[#1A2E25] leading-[0.9]" />
              <span className="text-[#7A857F] text-lg pb-2">/ week, full time</span>
            </div>
            <div className="mt-4 h-px bg-slate-200/80" />
            <div className="mt-4 grid grid-cols-3 gap-2">
              {DRIVER_CARS.map((c) => (
                <button key={c.key} onClick={() => setCarKey(c.key)} data-testid={`driver-car-${c.key}`}
                  className={`rounded-2xl px-3 py-3 text-left ring-1 transition-all hover:-translate-y-[2px] ${carKey === c.key ? "ring-2 ring-[#0B6B4F] bg-[#0B6B4F]/[0.06]" : "ring-slate-200 bg-white hover:bg-slate-50"}`}>
                  <div className="text-[13px] font-semibold text-[#1A2E25]">{c.label}</div>
                  <div className="text-[10.5px] text-[#7A857F] leading-tight mt-0.5">{c.sub}</div>
                </button>
              ))}
            </div>
            <div className="mt-5 space-y-2 text-[13px]">
              <Line l="Typical weekly fares" v={`£${est.gross.toLocaleString()}`} strong />
              <Line l="All-in car cost" v={`- £${est.carCost}`} />
              <Line l="Fuel or charge" v={`- £${est.fuel}`} />
            </div>
            <p className="text-[11px] text-[#9AA39D] mt-4 leading-relaxed">A guide based on typical London minicab fares at full-time hours. Your figure moves with the hours you put in.</p>
          </motion.div>

          <div className="mt-7 flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2.5">
            {[[ShieldCheck, "Cover built in"], [Clock, "Hear back within a day"], [Check, "No deposit until approved"]].map(([Icon, t]) => (
              <span key={t} className="flex items-center gap-2 text-[13px] text-[#4A564F]"><Icon className="w-4 h-4 text-[#0B6B4F]" strokeWidth={1.6} /> {t}</span>
            ))}
          </div>
        </motion.div>

        {/* RIGHT — one-question-per-screen wizard */}
        <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}
          className="w-full max-w-md justify-self-center lg:justify-self-end bg-white rounded-[24px] ring-1 ring-slate-200/70 p-6 sm:p-8 shadow-sm">
          <div className="mb-7">
            <div className="flex items-center justify-between text-[12.5px] text-[#7A857F] mb-2">
              <span data-testid="reg-step-label">Step {step + 1} of {STEPS.length}</span>
              <span>{pct}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-[#EDEAE3] overflow-hidden">
              <div className="h-full bg-[#0B6B4F] rounded-full transition-all duration-500" style={{ width: `${pct}%` }} data-testid="reg-progress" />
            </div>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); next(); }}>
            <AnimatePresence mode="wait">
              <motion.div key={cur.key} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25 }}>
                <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#1A2E25] leading-tight text-balance">{cur.q}</h2>
                <p className="text-[15px] text-[#4A564F] mt-2 mb-7">{cur.sub}</p>
                <div className="space-y-4">
                  {cur.fields.map((fl, idx) => (
                    <Field key={fl.name} label={fl.label}>
                      <Input autoFocus={idx === 0} type={fl.type || "text"} value={f[fl.name]} onChange={set(fl.name)} data-testid={fl.testid} className={inputCls} placeholder={fl.placeholder} />
                    </Field>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex gap-3 mt-8">
              {step > 0 && <Button type="button" variant="outline" onClick={back} className="rounded-full border-slate-200 hover:-translate-y-[2px] transition-transform" data-testid="reg-back"><ArrowLeft className="w-4 h-4" /></Button>}
              <Button type="submit" disabled={loading} className="rounded-full bg-[#0B6B4F] hover:bg-[#095B43] text-white flex-1 h-11 hover:-translate-y-[2px] transition-transform" data-testid={isLast ? "reg-submit" : "reg-continue"}>
                {isLast ? (loading ? "Creating your account" : "Create account and browse cars") : "Continue"} {!isLast && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          </form>
          <p className="text-[14px] text-[#4A564F] mt-6 text-center">Already with us? <Link to="/login" className="text-[#0B6B4F] font-semibold">Sign in</Link></p>
        </motion.div>
      </div>
    </main>
  );
}

const Field = ({ label, children }) => (<div><Label className="text-[13px] font-medium text-[#4A564F] mb-1.5 block">{label}</Label>{children}</div>);
const Line = ({ l, v, strong }) => (<div className="flex justify-between"><span className="text-[#7A857F]">{l}</span><span className={strong ? "text-[#1A2E25] font-semibold" : "text-[#4A564F]"}>{v}</span></div>);
