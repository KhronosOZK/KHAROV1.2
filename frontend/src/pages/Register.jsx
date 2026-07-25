import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Check, ArrowRight, ShieldCheck, Clock, BadgePoundSterling } from "lucide-react";
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

  // Driver value widget
  const [carKey, setCarKey] = useState("hybrid");
  const [fullTime, setFullTime] = useState(true);
  const est = estimateDriverWeek(carKey, fullTime);

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
    <main className="grid lg:grid-cols-[1.05fr_1fr] min-h-[calc(100vh-68px)]">
      {/* LEFT: immersive value panel */}
      <section className="relative overflow-hidden bg-[#0A130F] px-5 sm:px-10 lg:px-14 py-12 lg:py-16 flex flex-col justify-center">
        <img src={IMG.taxiDriver} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A130F]/94 via-[#0A130F]/86 to-[#0A130F]/72" />
        <div className="relative max-w-lg mx-auto lg:mx-0 w-full text-white">
          <p className="text-[12px] font-medium text-[#5FD3A6] tracking-[0.2em] uppercase">Drive with Caro</p>
          <h1 className="text-[34px] sm:text-5xl font-heading font-extrabold mt-4 leading-[1.03] text-balance">See what you could take home each week.</h1>
          <p className="text-white/70 mt-4 text-[16px] leading-relaxed">Rent included, insurance included, breakdown cover included. One honest weekly figure, then the rest is yours.</p>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="mt-8 rounded-[24px] bg-[#0A130F]/45 border border-white/12 backdrop-blur-xl p-6 sm:p-7" data-testid="driver-take-home">
            <div className="flex items-center gap-2">
              {[{ v: true, l: "Full time" }, { v: false, l: "Part time" }].map((o) => (
                <button key={o.l} onClick={() => setFullTime(o.v)} data-testid={`driver-hours-${o.v ? "full" : "part"}`}
                  className={`flex-1 rounded-full py-2 text-[13.5px] font-medium transition-all ${fullTime === o.v ? "bg-[#5FD3A6] text-[#0A130F]" : "bg-white/8 text-white/75 hover:bg-white/15"}`}>{o.l}</button>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3">
              {DRIVER_CARS.map((c) => (
                <button key={c.key} onClick={() => setCarKey(c.key)} data-testid={`driver-car-${c.key}`}
                  className={`rounded-2xl px-3 py-3 text-left ring-1 transition-all ${carKey === c.key ? "ring-2 ring-[#5FD3A6] bg-white/10" : "ring-white/10 bg-white/[0.04] hover:bg-white/8"}`}>
                  <div className="text-[13px] font-semibold text-white">{c.label}</div>
                  <div className="text-[10.5px] text-white/55 leading-tight mt-0.5">{c.sub}</div>
                </button>
              ))}
            </div>

            <div className="mt-6 flex items-end justify-between">
              <div>
                <div className="text-[11.5px] text-white/55 uppercase tracking-wide">Estimated take-home</div>
                <div className="flex items-end gap-1">
                  <AnimatedNumber value={est.takeHome} prefix="£" data-testid="driver-takehome-value" className="text-[42px] sm:text-5xl font-heading font-extrabold text-[#5FD3A6] leading-none" />
                  <span className="text-white/60 text-sm pb-1">/ week</span>
                </div>
              </div>
              <BadgePoundSterling className="w-8 h-8 text-white/25" strokeWidth={1.5} />
            </div>
            <div className="mt-5 space-y-1.5 text-[13px]">
              <div className="flex justify-between text-white/70"><span>Typical weekly fares</span><span className="text-white font-medium">£{est.gross.toLocaleString()}</span></div>
              <div className="flex justify-between text-white/70"><span>All-in car cost</span><span className="text-white font-medium">£{est.carCost}</span></div>
              <div className="flex justify-between text-white/70"><span>Fuel or charge</span><span className="text-white font-medium">£{est.fuel}</span></div>
            </div>
            <p className="text-[11px] text-white/40 mt-4">A guide based on typical London private hire fares. Your numbers depend on the hours you put in.</p>
          </motion.div>

          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2">
            {[[ShieldCheck, "Cover built in"], [Clock, "Hear back within a day"], [Check, "No deposit until approved"]].map(([Icon, t]) => (
              <span key={t} className="flex items-center gap-2 text-[13px] text-white/75"><Icon className="w-4 h-4 text-[#5FD3A6]" strokeWidth={1.5} /> {t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* RIGHT: account form */}
      <section className="flex items-center justify-center px-5 sm:px-8 py-12 lg:py-16 bg-[#F9F8F6]">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${i <= step ? "bg-[#0B6B4F] text-white" : "bg-[#E7E4DC] text-[#9AA39D]"}`}>{i < step ? <Check className="w-4 h-4" /> : i + 1}</div>
                  <span className={`text-[13px] hidden sm:block ${i <= step ? "text-[#1A2E25] font-medium" : "text-[#9AA39D]"}`}>{s}</span>
                </div>
                {i < steps.length - 1 && <div className={`h-0.5 flex-1 mx-2 rounded ${i < step ? "bg-[#0B6B4F]" : "bg-[#E7E4DC]"}`} />}
              </div>
            ))}
          </div>

          {step === 0 && (<div>
            <h2 className="text-[26px] font-heading font-extrabold text-[#1A2E25]">Let us get to know you</h2>
            <p className="text-[15px] text-[#4A5D54] mt-2 mb-7">Just the basics for now. Licence details can wait.</p>
            <div className="space-y-4">
              <Field label="Full name"><Input value={f.name} onChange={set("name")} data-testid="reg-name" className="h-12 bg-white border-[#1A2E25]/12 rounded-xl" placeholder="Jordan Smith" /></Field>
              <Field label="Email"><Input type="email" value={f.email} onChange={set("email")} data-testid="reg-email" className="h-12 bg-white border-[#1A2E25]/12 rounded-xl" placeholder="you@email.com" /></Field>
              <Field label="Mobile number"><Input value={f.phone} onChange={set("phone")} data-testid="reg-phone" className="h-12 bg-white border-[#1A2E25]/12 rounded-xl" placeholder="07…" /></Field>
            </div>
          </div>)}
          {step === 1 && (<div>
            <h2 className="text-[26px] font-heading font-extrabold text-[#1A2E25]">Set up your login</h2>
            <p className="text-[15px] text-[#4A5D54] mt-2 mb-7">Choose a password so you can pick up where you left off.</p>
            <div className="space-y-4">
              <Field label="Password"><Input type="password" value={f.password} onChange={set("password")} data-testid="reg-password" className="h-12 bg-white border-[#1A2E25]/12 rounded-xl" placeholder="At least 6 characters" /></Field>
              <Field label="Date of birth"><Input type="date" value={f.dob} onChange={set("dob")} className="h-12 bg-white border-[#1A2E25]/12 rounded-xl" /></Field>
            </div>
          </div>)}
          {step === 2 && (<div>
            <h2 className="text-[26px] font-heading font-extrabold text-[#1A2E25]">Your driving licences</h2>
            <p className="text-[15px] text-[#4A5D54] mt-2 mb-7">Optional now, but adding them means faster quotes and one less form later.</p>
            <div className="space-y-4">
              <Field label="DVLA licence number"><Input value={f.dvla_licence} onChange={set("dvla_licence")} data-testid="reg-dvla" className="h-12 bg-white border-[#1A2E25]/12 rounded-xl" placeholder="SMITH901284JS9AB" /></Field>
              <Field label="PCO / TfL badge number"><Input value={f.pco_licence} onChange={set("pco_licence")} data-testid="reg-pco" className="h-12 bg-white border-[#1A2E25]/12 rounded-xl" placeholder="123456" /></Field>
            </div>
          </div>)}

          <div className="flex gap-3 mt-8">
            {step > 0 && <Button variant="outline" onClick={() => setStep(step - 1)} className="rounded-full border-[#1A2E25]/20 hover:-translate-y-[2px] transition-transform" data-testid="reg-back">Back</Button>}
            <Button onClick={next} disabled={loading} className="rounded-full bg-[#0B6B4F] hover:bg-[#047857] text-white flex-1 h-11 hover:-translate-y-[2px] transition-transform" data-testid={step === 2 ? "reg-submit" : "reg-continue"}>
              {step < 2 ? "Continue" : (loading ? "Creating your account" : "Create account and browse cars")} {step < 2 && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
          <p className="text-[14px] text-[#4A5D54] mt-6 text-center">Already with us? <Link to="/login" className="text-[#0B6B4F] font-semibold">Sign in</Link></p>
        </div>
      </section>
    </main>
  );
}

const Field = ({ label, children }) => (<div><Label className="text-[13px] font-medium text-[#4A5D54] mb-1.5 block">{label}</Label>{children}</div>);
