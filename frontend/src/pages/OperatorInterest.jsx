import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Building2, Car, UserRound, TrendingUp, ShieldCheck, Wallet, MapPin, Mail, ArrowRight, Zap } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { VEHICLE_CLASSES, fleetBucket, estimateFleetEarnings } from "@/lib/pricing";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { IMG } from "@/lib/images";

const steps = ["Company", "Fleet", "Your login"];
const fleetOpts = ["1-5", "6-15", "16-30", "30+"];
const inputCls = "h-11 bg-white border-[#1A2E25]/12 rounded-xl focus-visible:ring-[#0B6B4F]/30 focus-visible:border-[#0B6B4F]";

export default function OperatorInterest() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [count, setCount] = useState(37);
  const [loading, setLoading] = useState(false);
  const [cars, setCars] = useState(10);
  const [vClass, setVClass] = useState(VEHICLE_CLASSES[0]);
  const [f, setF] = useState({
    company_name: "", companies_house: "", tfl_operator_licence: "", fleet_size: "6-15",
    vehicle_types: "", areas: "", contact_name: "", role: "", email: "", phone: "", password: "", heard_from: "Word of mouth",
  });
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));

  useEffect(() => { api.get("/stats").then((r) => setCount(r.data.operators + 37)).catch(() => {}); }, []);
  useEffect(() => { setF((p) => ({ ...p, fleet_size: fleetBucket(cars) })); }, [cars]);

  const earn = estimateFleetEarnings(cars, vClass.weekly);

  const canNext = () => {
    if (step === 0) return f.company_name;
    if (step === 1) return f.areas;
    return f.contact_name && f.email && f.phone && f.password.length >= 6;
  };

  const submit = async () => {
    setLoading(true);
    const res = await register({ name: f.contact_name, email: f.email, phone: f.phone, password: f.password, role: "operator" });
    try {
      await api.post("/interest", {
        company_name: f.company_name, companies_house: f.companies_house, tfl_operator_licence: f.tfl_operator_licence,
        fleet_size: f.fleet_size, areas: f.vehicle_types ? `${f.areas} (types: ${f.vehicle_types})` : f.areas,
        contact_name: f.contact_name, role: f.role, email: f.email, phone: f.phone, heard_from: f.heard_from,
      });
    } catch { /* lead capture best-effort */ }
    setLoading(false);
    if (res.ok) { setDone(true); window.scrollTo(0, 0); }
    else { toast.error(res.error?.includes("exists") ? "That email is already registered. Try signing in." : (res.error || "Something went wrong.")); }
  };

  const next = () => { if (!canNext()) { toast.error(step === 2 ? "Add your details and a password of at least 6 characters." : "Please fill in the fields on this step."); return; } if (step < 2) setStep(step + 1); else submit(); };
  const scrollToForm = () => document.getElementById("operator-form")?.scrollIntoView({ behavior: "smooth", block: "center" });

  if (done) return (
    <main className="max-w-xl mx-auto px-4 py-24 text-center">
      <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto"><Check className="w-8 h-8 text-emerald-700" /></div>
      <h1 className="text-3xl font-heading font-extrabold text-[#1A2E25] mt-6" data-testid="interest-success">You are in. Welcome to Caro.</h1>
      <p className="text-[#4A5D54] mt-3 text-[16px] leading-relaxed">Your account is ready. We have sent an email with your earning potential, the onboarding steps and how verification works. In the meantime, take a look around your fleet dashboard.</p>
      <div className="flex gap-3 justify-center mt-8 flex-wrap">
        <Button onClick={() => navigate("/operator-dashboard")} className="rounded-full bg-[#0B6B4F] hover:bg-[#047857] text-white" data-testid="interest-goto-dashboard">Open my dashboard <ArrowRight className="w-4 h-4 ml-2" /></Button>
        <Button onClick={() => navigate("/operator-guide")} variant="outline" className="rounded-full border-[#1A2E25]/20">See how it works</Button>
      </div>
    </main>
  );

  return (
    <main className="relative bg-[#07110D] overflow-hidden">
      <div className="absolute inset-0">
        <img src={IMG.rowCars} alt="" className="w-full h-full object-cover opacity-[0.14]" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#07110D] via-[#07110D]/94 to-[#0B2118]/85" />
        <div className="absolute -top-48 -right-40 w-[620px] h-[620px] rounded-full bg-[#0B6B4F]/28 blur-[130px]" />
        <div className="absolute -bottom-52 -left-24 w-[560px] h-[560px] rounded-full bg-[#5FD3A6]/12 blur-[130px]" />
        <div className="absolute inset-0 grain opacity-40" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 lg:py-16 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* LEFT — estimator stage */}
        <div className="text-white">
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[12px] font-medium tracking-[0.16em] uppercase text-[#5FD3A6]">
              <Zap className="w-3.5 h-3.5" /> For rental companies
            </div>
            <h1 className="mt-6 font-heading font-extrabold tracking-tight leading-[0.98] text-[clamp(2.4rem,5.4vw,4.2rem)] text-balance">
              Put your fleet<br /><span className="text-[#5FD3A6]">to work.</span>
            </h1>
            <p className="mt-5 text-[16px] sm:text-[17px] text-white/65 max-w-md leading-relaxed">Drag to your fleet size and see what Caro could bring in, matched with vetted drivers and paid every fortnight.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.55 }}
            className="mt-9 max-w-md rounded-[26px] bg-[#0A1712]/70 border border-white/10 backdrop-blur-2xl p-6 sm:p-7 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]" data-testid="earnings-estimator">
            <div className="text-[11px] text-white/50 uppercase tracking-[0.18em]">Estimated monthly earnings</div>
            <div className="flex items-end gap-1.5 mt-1">
              <AnimatedNumber value={earn.grossMonth} prefix="£" data-testid="estimator-monthly" className="text-[clamp(2.8rem,8vw,4.2rem)] font-heading font-extrabold text-[#5FD3A6] leading-[0.9]" />
              <span className="text-white/55 text-lg pb-1.5">/ month</span>
            </div>
            <div className="text-[13.5px] text-white/65 mt-2">Around <span className="font-semibold text-white"><AnimatedNumber value={earn.grossYear} prefix="£" /></span> a year gross, keeping <span className="font-semibold text-white"><AnimatedNumber value={earn.netYear} prefix="£" /></span> after our fee.</div>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-[13px] text-white/70">How many cars would you list?</Label>
                <span className="font-heading font-extrabold text-white text-lg" data-testid="estimator-cars">{cars}{cars >= 40 ? "+" : ""}</span>
              </div>
              <Slider min={1} max={40} step={1} value={[cars]} onValueChange={(v) => setCars(v[0])} data-testid="estimator-slider" />
              <div className="flex justify-between text-[11px] text-white/40 mt-1.5"><span>1 car</span><span>40+ cars</span></div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
              {VEHICLE_CLASSES.map((c) => {
                const active = vClass.key === c.key;
                return (
                  <button key={c.key} onClick={() => setVClass(c)} data-testid={`estimator-class-${c.key}`}
                    className={`text-left rounded-2xl px-4 py-2.5 ring-1 transition-all hover:-translate-y-[2px] ${active ? "ring-2 ring-[#5FD3A6] bg-[#5FD3A6]/12" : "ring-white/10 bg-white/[0.03] hover:bg-white/[0.07]"}`}>
                    <div className="text-[13px] font-semibold text-white">{c.label}</div>
                    <div className="text-[11.5px] text-white/50">£{c.weekly}/wk each</div>
                  </button>
                );
              })}
            </div>
            <button onClick={scrollToForm} data-testid="estimator-cta" className="w-full mt-5 h-11 rounded-2xl bg-[#5FD3A6] hover:bg-white text-[#07110D] text-[15px] font-semibold transition-colors">Register my fleet interest</button>
          </motion.div>

          <div className="mt-7 space-y-2.5 max-w-md">
            {[[ShieldCheck, "Every driver background and licence checked"], [Wallet, "No listing fees, a flat 10% on the rental side only"], [MapPin, "Track every vehicle's live location from your dashboard"], [TrendingUp, "Rent covered up to two weeks if a driver defaults"]].map(([Icon, t]) => (
              <div key={t} className="flex items-start gap-3 text-[14px] text-white/75"><Icon className="w-5 h-5 text-[#5FD3A6] shrink-0 mt-0.5" strokeWidth={1.5} /> {t}</div>
            ))}
            <p className="text-white/40 text-[13px] pt-1">{count} operators have already registered their interest</p>
          </div>
        </div>

        {/* RIGHT — form card */}
        <motion.div id="operator-form" initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.55 }}
          className="w-full max-w-md justify-self-center lg:justify-self-end bg-[#F9F8F6] rounded-[28px] p-6 sm:p-8 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.7)] scroll-mt-24">
          <h2 className="text-[24px] font-heading font-extrabold text-[#1A2E25]">Claim your spot on the launch list</h2>
          <p className="text-[14px] text-[#4A5D54] mt-1.5">Two minutes, and you can explore your dashboard straight away.</p>

          <div className="mt-5 flex items-start gap-3 rounded-2xl bg-[#E6F5F0] border border-[#0B6B4F]/15 p-3.5">
            <Mail className="w-5 h-5 text-[#0B6B4F] shrink-0 mt-0.5" strokeWidth={1.5} />
            <p className="text-[13px] text-[#1A2E25] leading-relaxed">The moment you register, we email you everything: your exact earning potential, the full onboarding process, verification steps and how live tracking works.</p>
          </div>

          <div className="flex items-center gap-2 my-6">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${i <= step ? "bg-[#0B6B4F] text-white" : "bg-[#E7E4DC] text-[#9AA39D]"}`}>{i < step ? <Check className="w-4 h-4" /> : i + 1}</div>
                  <span className={`text-[12.5px] hidden sm:block ${i <= step ? "text-[#1A2E25] font-medium" : "text-[#9AA39D]"}`}>{s}</span>
                </div>
                {i < steps.length - 1 && <div className={`h-0.5 flex-1 mx-2 rounded ${i < step ? "bg-[#0B6B4F]" : "bg-[#E7E4DC]"}`} />}
              </div>
            ))}
          </div>

          {step === 0 && (<div>
            <div className="flex items-center gap-2 text-[#0B6B4F] font-semibold mb-1 text-[15px]"><Building2 className="w-5 h-5" strokeWidth={1.5} /> About your company</div>
            <p className="text-[13.5px] text-[#7A857F] mb-5">Licence numbers are optional right now.</p>
            <div className="space-y-4">
              <div><Label className="mb-1.5 block text-sm">Company name</Label><Input value={f.company_name} onChange={set("company_name")} data-testid="int-company" className={inputCls} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="mb-1.5 block text-sm">Companies House</Label><Input value={f.companies_house} onChange={set("companies_house")} data-testid="int-ch" className={inputCls} /></div>
                <div><Label className="mb-1.5 block text-sm">TfL operator licence</Label><Input value={f.tfl_operator_licence} onChange={set("tfl_operator_licence")} data-testid="int-tfl" className={inputCls} /></div>
              </div>
            </div>
          </div>)}
          {step === 1 && (<div>
            <div className="flex items-center gap-2 text-[#0B6B4F] font-semibold mb-1 text-[15px]"><Car className="w-5 h-5" strokeWidth={1.5} /> Your fleet</div>
            <p className="text-[13.5px] text-[#7A857F] mb-5">Helps us understand the supply you can bring.</p>
            <div className="space-y-4">
              <div><Label className="mb-1.5 block text-sm">How many vehicles do you run?</Label>
                <Select value={f.fleet_size} onValueChange={(v) => setF((p) => ({ ...p, fleet_size: v }))}><SelectTrigger data-testid="int-fleet" className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>{fleetOpts.map((x) => <SelectItem key={x} value={x}>{x} vehicles</SelectItem>)}</SelectContent></Select>
              </div>
              <div><Label className="mb-1.5 block text-sm">Boroughs or areas you cover</Label><Input value={f.areas} onChange={set("areas")} data-testid="int-areas" className={inputCls} placeholder="Croydon, Bromley" /></div>
              <div><Label className="mb-1.5 block text-sm">Types of car you rent out</Label><Input value={f.vehicle_types} onChange={set("vehicle_types")} data-testid="int-types" className={inputCls} placeholder="Hybrids, saloons, one WAV" /></div>
            </div>
            <div className="mt-5 rounded-2xl bg-[#0E1A14] text-white p-4" data-testid="int-earnings">
              <div className="text-[11.5px] text-white/60 uppercase tracking-wide">A fleet your size could earn</div>
              <div className="text-2xl font-heading font-extrabold text-[#5FD3A6] mt-1">£{estimateFleetEarnings({ "1-5": 3, "6-15": 10, "16-30": 22, "30+": 40 }[f.fleet_size] || 10, vClass.weekly).grossYear.toLocaleString()}<span className="text-sm font-normal text-white/60"> a year</span></div>
            </div>
          </div>)}
          {step === 2 && (<div>
            <div className="flex items-center gap-2 text-[#0B6B4F] font-semibold mb-1 text-[15px]"><UserRound className="w-5 h-5" strokeWidth={1.5} /> Your login</div>
            <p className="text-[13.5px] text-[#7A857F] mb-5">Create your account to sign in and explore your dashboard.</p>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="mb-1.5 block text-sm">Your name</Label><Input value={f.contact_name} onChange={set("contact_name")} data-testid="int-name" className={inputCls} /></div>
                <div><Label className="mb-1.5 block text-sm">Your role</Label><Input value={f.role} onChange={set("role")} data-testid="int-role" className={inputCls} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="mb-1.5 block text-sm">Email</Label><Input type="email" value={f.email} onChange={set("email")} data-testid="int-email" className={inputCls} /></div>
                <div><Label className="mb-1.5 block text-sm">Phone</Label><Input value={f.phone} onChange={set("phone")} data-testid="int-phone" className={inputCls} /></div>
              </div>
              <div><Label className="mb-1.5 block text-sm">Password</Label><Input type="password" value={f.password} onChange={set("password")} data-testid="int-password" className={inputCls} placeholder="At least 6 characters" /></div>
              <div><Label className="mb-1.5 block text-sm">How did you hear about us?</Label>
                <Select value={f.heard_from} onValueChange={(v) => setF((p) => ({ ...p, heard_from: v }))}><SelectTrigger data-testid="int-heard" className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>{["Word of mouth", "Social media", "Search engine", "Industry event", "Other"].map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent></Select>
              </div>
            </div>
          </div>)}

          <div className="flex gap-3 mt-7">
            {step > 0 && <Button variant="outline" onClick={() => setStep(step - 1)} className="rounded-full border-[#1A2E25]/20" data-testid="int-back">Back</Button>}
            <Button onClick={next} disabled={loading} className="rounded-full bg-[#0B6B4F] hover:bg-[#047857] text-white flex-1 hover:-translate-y-[2px] transition-transform" data-testid={step === 2 ? "int-submit" : "int-continue"}>
              {step < 2 ? "Continue" : (loading ? "Creating your account" : "Create account and register")}
            </Button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
