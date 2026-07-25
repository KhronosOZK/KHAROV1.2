import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Check, ArrowRight, ShieldCheck, Clock, Zap } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { DRIVER_CARS, estimateDriverWeek } from "@/lib/pricing";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IMG } from "@/lib/images";

const steps = ["You", "Login", "Licence"];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [f, setF] = useState({ name: "", email: "", phone: "", password: "", dob: "", dvla_licence: "", pco_licence: "" });
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));

  const [carKey, setCarKey] = useState("hybrid");
  const est = estimateDriverWeek(carKey);

  const canNext = () => {
    if (step === 0) return f.name && f.email && f.phone;
    if (step === 1) return f.password.length >= 6;
    return true;
  };
  const finish = async () => {
    setLoading(true);
    const res = await register({ ...f, role: "driver" });
    setLoading(false);
    if (res.ok) { toast.success("Account created. Welcome to Caro."); navigate("/portal"); }
    else toast.error(res.error);
  };
  const next = () => { if (!canNext()) { toast.error("Please fill in the fields on this step."); return; } if (step < 2) setStep(step + 1); else finish(); };

  return (
    <main className="relative min-h-[calc(100vh-68px)] bg-[#07110D] overflow-hidden">
      <div className="absolute inset-0">
        <img src={IMG.taxiDriver} alt="" className="w-full h-full object-cover opacity-[0.16]" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#07110D] via-[#07110D]/94 to-[#0B2118]/85" />
        <div className="absolute -top-48 -left-40 w-[620px] h-[620px] rounded-full bg-[#0B6B4F]/30 blur-[130px]" />
        <div className="absolute -bottom-52 -right-24 w-[560px] h-[560px] rounded-full bg-[#5FD3A6]/12 blur-[130px]" />
        <div className="absolute inset-0 grain opacity-40" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 lg:py-16 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-16 items-center min-h-[calc(100vh-68px)]">
        {/* LEFT — cinematic value stage */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-white text-center lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[12px] font-medium tracking-[0.14em] uppercase text-[#5FD3A6]">
            <Zap className="w-3.5 h-3.5" /> Drive with Caro
          </div>
          <h1 className="mt-6 font-heading font-extrabold tracking-tight text-[40px] leading-[1.04] sm:text-5xl lg:text-[64px] text-balance">
            The keys to a<br /><span className="text-[#5FD3A6]">better week.</span>
          </h1>
          <p className="mt-5 text-[16px] sm:text-[17px] text-white/65 max-w-md mx-auto lg:mx-0 leading-relaxed">
            Rent, insurance and breakdown cover in one honest weekly figure. Pick a car and see what a full-time week could put in your pocket.
          </p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }}
            className="mt-9 max-w-md mx-auto lg:mx-0 text-left rounded-[26px] bg-[#0A1712]/70 border border-white/10 backdrop-blur-2xl p-6 sm:p-7 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]" data-testid="driver-take-home">
            <div className="text-[11px] text-white/50 uppercase tracking-[0.18em]">Your estimated take-home</div>
            <div className="flex items-end gap-2 mt-1.5">
              <AnimatedNumber value={est.takeHome} prefix="£" data-testid="driver-takehome-value" className="text-[clamp(3rem,9vw,4.5rem)] font-heading font-extrabold text-white leading-[0.9]" />
              <span className="text-white/55 text-lg pb-2">/ week, full time</span>
            </div>
            <div className="mt-3 h-px bg-white/10" />
            <div className="mt-4 grid grid-cols-3 gap-2">
              {DRIVER_CARS.map((c) => (
                <button key={c.key} onClick={() => setCarKey(c.key)} data-testid={`driver-car-${c.key}`}
                  className={`rounded-2xl px-3 py-3 text-left ring-1 transition-all hover:-translate-y-[2px] ${carKey === c.key ? "ring-2 ring-[#5FD3A6] bg-[#5FD3A6]/12" : "ring-white/10 bg-white/[0.03] hover:bg-white/[0.07]"}`}>
                  <div className="text-[13px] font-semibold text-white">{c.label}</div>
                  <div className="text-[10.5px] text-white/50 leading-tight mt-0.5">{c.sub}</div>
                </button>
              ))}
            </div>
            <div className="mt-5 space-y-2 text-[13px]">
              <Line l="Typical weekly fares" v={`£${est.gross.toLocaleString()}`} strong />
              <Line l="All-in car cost" v={`- £${est.carCost}`} />
              <Line l="Fuel or charge" v={`- £${est.fuel}`} />
            </div>
            <p className="text-[11px] text-white/40 mt-4 leading-relaxed">A guide based on typical London minicab fares at full-time hours. Your figure moves with the hours you put in.</p>
          </motion.div>

          <div className="mt-7 flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2.5">
            {[[ShieldCheck, "Cover built in"], [Clock, "Hear back within a day"], [Check, "No deposit until approved"]].map(([Icon, t]) => (
              <span key={t} className="flex items-center gap-2 text-[13px] text-white/70"><Icon className="w-4 h-4 text-[#5FD3A6]" strokeWidth={1.5} /> {t}</span>
            ))}
          </div>
        </motion.div>

        {/* RIGHT — floating form card */}
        <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.55 }}
          className="w-full max-w-md justify-self-center lg:justify-self-end bg-[#F9F8F6] rounded-[28px] p-6 sm:p-8 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.7)]">
          <div className="flex items-center gap-2 mb-7">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${i <= step ? "bg-[#0B6B4F] text-white" : "bg-[#E7E4DC] text-[#9AA39D]"}`}>{i < step ? <Check className="w-4 h-4" /> : i + 1}</div>
                  <span className={`text-[13px] hidden sm:block ${i <= step ? "text-[#1A2E25] font-medium" : "text-[#9AA39D]"}`}>{s}</span>
                </div>
                {i < steps.length - 1 && <div className={`h-0.5 flex-1 mx-2 rounded ${i < step ? "bg-[#0B6B4F]" : "bg-[#E7E4DC]"}`} />}
              </div>
            ))}
          </div>

          {step === 0 && (<div>
            <h2 className="text-[26px] font-heading font-extrabold text-[#1A2E25]">Let us get to know you</h2>
            <p className="text-[14.5px] text-[#4A5D54] mt-2 mb-7">Just the basics for now. Licence details can wait.</p>
            <div className="space-y-4">
              <Field label="Full name"><Input value={f.name} onChange={set("name")} data-testid="reg-name" className={inputCls} placeholder="Jordan Smith" /></Field>
              <Field label="Email"><Input type="email" value={f.email} onChange={set("email")} data-testid="reg-email" className={inputCls} placeholder="you@email.com" /></Field>
              <Field label="Mobile number"><Input value={f.phone} onChange={set("phone")} data-testid="reg-phone" className={inputCls} placeholder="07…" /></Field>
            </div>
          </div>)}
          {step === 1 && (<div>
            <h2 className="text-[26px] font-heading font-extrabold text-[#1A2E25]">Set up your login</h2>
            <p className="text-[14.5px] text-[#4A5D54] mt-2 mb-7">Choose a password so you can pick up where you left off.</p>
            <div className="space-y-4">
              <Field label="Password"><Input type="password" value={f.password} onChange={set("password")} data-testid="reg-password" className={inputCls} placeholder="At least 6 characters" /></Field>
              <Field label="Date of birth"><Input type="date" value={f.dob} onChange={set("dob")} className={inputCls} /></Field>
            </div>
          </div>)}
          {step === 2 && (<div>
            <h2 className="text-[26px] font-heading font-extrabold text-[#1A2E25]">Your driving licences</h2>
            <p className="text-[14.5px] text-[#4A5D54] mt-2 mb-7">Optional now, but adding them means faster quotes and one less form later.</p>
            <div className="space-y-4">
              <Field label="DVLA licence number"><Input value={f.dvla_licence} onChange={set("dvla_licence")} data-testid="reg-dvla" className={inputCls} placeholder="SMITH901284JS9AB" /></Field>
              <Field label="PCO / TfL badge number"><Input value={f.pco_licence} onChange={set("pco_licence")} data-testid="reg-pco" className={inputCls} placeholder="123456" /></Field>
            </div>
          </div>)}

          <div className="flex gap-3 mt-8">
            {step > 0 && <Button variant="outline" onClick={() => setStep(step - 1)} className="rounded-full border-[#1A2E25]/20 hover:-translate-y-[2px] transition-transform" data-testid="reg-back">Back</Button>}
            <Button onClick={next} disabled={loading} className="rounded-full bg-[#0B6B4F] hover:bg-[#047857] text-white flex-1 h-11 hover:-translate-y-[2px] transition-transform" data-testid={step === 2 ? "reg-submit" : "reg-continue"}>
              {step < 2 ? "Continue" : (loading ? "Creating your account" : "Create account and browse cars")} {step < 2 && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
          <p className="text-[13.5px] text-[#4A5D54] mt-6 text-center">Already with us? <Link to="/login" className="text-[#0B6B4F] font-semibold">Sign in</Link></p>
        </motion.div>
      </div>
    </main>
  );
}

const inputCls = "h-12 bg-white border-[#1A2E25]/12 rounded-xl focus-visible:ring-[#0B6B4F]/30 focus-visible:border-[#0B6B4F]";
const Field = ({ label, children }) => (<div><Label className="text-[13px] font-medium text-[#4A5D54] mb-1.5 block">{label}</Label>{children}</div>);
const Line = ({ l, v, strong }) => (<div className="flex justify-between"><span className="text-white/60">{l}</span><span className={strong ? "text-white font-semibold" : "text-white/80"}>{v}</span></div>);
