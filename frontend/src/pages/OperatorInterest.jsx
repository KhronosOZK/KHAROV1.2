import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Building2, Car, UserRound, TrendingUp, ShieldCheck, Wallet } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { VEHICLE_CLASSES, fleetBucket, estimateFleetEarnings } from "@/lib/pricing";
import { AnimatedNumber } from "@/components/AnimatedNumber";

const steps = ["Company", "Fleet", "Contact"];
const fleetOpts = ["1-5", "6-15", "16-30", "30+"];

export default function OperatorInterest() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [count, setCount] = useState(37);
  const [loading, setLoading] = useState(false);
  const [cars, setCars] = useState(10);
  const [vClass, setVClass] = useState(VEHICLE_CLASSES[0]);
  const [f, setF] = useState({
    company_name: "", companies_house: "", tfl_operator_licence: "", fleet_size: "6-15",
    vehicle_types: "", areas: "", contact_name: "", role: "", email: "", phone: "", heard_from: "Word of mouth",
  });
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));

  useEffect(() => { api.get("/stats").then((r) => setCount(r.data.operators + 37)).catch(() => {}); }, []);
  useEffect(() => { setF((p) => ({ ...p, fleet_size: fleetBucket(cars) })); }, [cars]);

  const earn = estimateFleetEarnings(cars, vClass.weekly);

  const canNext = () => {
    if (step === 0) return f.company_name;
    if (step === 1) return f.areas;
    return f.contact_name && f.email && f.phone;
  };

  const submit = async () => {
    setLoading(true);
    try {
      await api.post("/interest", {
        company_name: f.company_name, companies_house: f.companies_house, tfl_operator_licence: f.tfl_operator_licence,
        fleet_size: f.fleet_size, areas: f.vehicle_types ? `${f.areas} (types: ${f.vehicle_types})` : f.areas,
        contact_name: f.contact_name, role: f.role, email: f.email, phone: f.phone, heard_from: f.heard_from,
      });
      setDone(true); window.scrollTo(0, 0);
    } catch { toast.error("Something went wrong. Please try again."); }
    setLoading(false);
  };

  const next = () => { if (!canNext()) { toast.error("Please fill in the fields on this step."); return; } if (step < 2) setStep(step + 1); else submit(); };
  const scrollToForm = () => document.getElementById("operator-form")?.scrollIntoView({ behavior: "smooth", block: "start" });

  if (done) return (
    <main className="max-w-xl mx-auto px-4 py-24 text-center">
      <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto"><Check className="w-8 h-8 text-emerald-700" /></div>
      <h1 className="text-3xl font-heading font-extrabold text-[#1A2E25] mt-6" data-testid="interest-success">You are on the list</h1>
      <p className="text-[#4A564F] mt-3 text-[16px] leading-relaxed">Thanks for registering. We will be in touch before Caro opens in your area to get you verified and your first cars listed.</p>
    </main>
  );

  return (
    <main className="pb-16">
      {/* INTERACTIVE EARNINGS ESTIMATOR */}
      <section className="bg-[#0B130F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="text-white">
            <p className="text-[12px] font-medium text-[#5FD3A6] tracking-[0.14em] uppercase">For rental companies</p>
            <h1 className="text-[34px] sm:text-5xl font-heading font-extrabold mt-3 leading-[1.04] text-balance">Your cars could be earning while you read this.</h1>
            <p className="text-white/70 mt-4 text-[17px] leading-relaxed max-w-lg">Drag the slider to your fleet size and see what Caro could bring in, matched with vetted drivers and paid every fortnight.</p>
            <div className="mt-8 space-y-3">
              {[
                [ShieldCheck, "Every driver background and licence checked before they reach you"],
                [Wallet, "No listing or setup fees, a flat 10% taken from the rental side only"],
                [TrendingUp, "Rent covered up to two weeks if a driver ever defaults"],
              ].map(([Icon, t]) => (
                <div key={t} className="flex items-start gap-3 text-[14.5px] text-white/85"><Icon className="w-5 h-5 text-[#5FD3A6] shrink-0 mt-0.5" /> {t}</div>
              ))}
            </div>
            <p className="text-white/45 text-[13px] mt-7">{count} operators have already registered their interest</p>
          </div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="bg-white rounded-[28px] p-6 sm:p-8 shadow-2xl" data-testid="earnings-estimator">
            <div className="text-[12px] text-[#7A857F] uppercase tracking-wide font-semibold">Estimated monthly earnings</div>
            <div className="flex items-end gap-1 mt-1">
              <AnimatedNumber value={earn.grossMonth} prefix="£" className="text-[46px] sm:text-6xl font-heading font-extrabold text-[#0B6B4F] leading-none" data-testid="estimator-monthly" />
              <span className="text-[#7A857F] text-lg pb-1.5">/ month</span>
            </div>
            <div className="text-[14px] text-[#4A564F] mt-2">
              Around <span className="font-semibold text-[#1A2E25]"><AnimatedNumber value={earn.grossYear} prefix="£" /></span> a year gross, keeping <span className="font-semibold text-[#1A2E25]"><AnimatedNumber value={earn.netYear} prefix="£" /></span> after our fee.
            </div>

            <div className="mt-7">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm text-[#4A564F]">How many cars would you list?</Label>
                <span className="font-heading font-extrabold text-[#1A2E25] text-lg" data-testid="estimator-cars">{cars}{cars >= 40 ? "+" : ""}</span>
              </div>
              <Slider min={1} max={40} step={1} value={[cars]} onValueChange={(v) => setCars(v[0])} data-testid="estimator-slider" />
              <div className="flex justify-between text-[11px] text-[#9AA39D] mt-1.5"><span>1 car</span><span>40+ cars</span></div>
            </div>

            <div className="mt-6">
              <Label className="text-sm text-[#4A564F] mb-2 block">Mostly what kind of car?</Label>
              <div className="grid grid-cols-2 gap-2">
                {VEHICLE_CLASSES.map((c) => {
                  const active = vClass.key === c.key;
                  return (
                    <button key={c.key} onClick={() => setVClass(c)} data-testid={`estimator-class-${c.key}`}
                      className={`text-left rounded-2xl px-4 py-3 ring-1 transition-all ${active ? "ring-2 ring-[#0B6B4F] bg-emerald-50/70" : "ring-slate-200 bg-white hover:ring-slate-300"}`}>
                      <div className="text-[13.5px] font-semibold text-[#1A2E25]">{c.label}</div>
                      <div className="text-[12px] text-[#7A857F]">£{c.weekly}/wk each</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between rounded-2xl bg-[#F1EFE9] px-5 py-3.5">
              <span className="text-[13.5px] text-[#4A564F]">Per car, per month</span>
              <span className="font-heading font-bold text-[#1A2E25]"><AnimatedNumber value={earn.perCarMonth} prefix="£" /></span>
            </div>

            <Button onClick={scrollToForm} data-testid="estimator-cta" className="w-full mt-6 h-12 rounded-2xl bg-[#0B6B4F] hover:bg-[#095B43] text-white text-base font-semibold">Register my fleet interest</Button>
            <p className="text-[11.5px] text-[#9AA39D] text-center mt-3">Estimate based on {Math.round(85)}% utilisation and typical London weekly rates. Your figures are confirmed at onboarding.</p>
          </motion.div>
        </div>
      </section>

      {/* REGISTRATION FORM */}
      <section id="operator-form" className="max-w-2xl mx-auto px-4 sm:px-6 py-14 scroll-mt-20">
        <div className="text-center mb-9">
          <h2 className="text-[28px] sm:text-4xl font-heading font-extrabold text-[#1A2E25] text-balance">Claim your spot on the launch list</h2>
          <p className="text-[#4A564F] mt-3 text-[16px]">Two minutes, no obligation. We reach out before we open in your area so you get first pick of drivers.</p>
        </div>

        <div className="flex items-center gap-2 mb-7">
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

        <div className="bg-white rounded-[22px] p-6 sm:p-8 ring-1 ring-slate-200/70">
          {step === 0 && (<div>
            <div className="flex items-center gap-2 text-[#0B6B4F] font-semibold mb-1"><Building2 className="w-5 h-5" /> About your company</div>
            <p className="text-[14px] text-[#7A857F] mb-6">Tell us who you are. If you do not have the licence numbers to hand, leave them blank.</p>
            <div className="space-y-4">
              <div><Label className="mb-1.5 block text-sm">Company name</Label><Input value={f.company_name} onChange={set("company_name")} data-testid="int-company" className="h-11" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="mb-1.5 block text-sm">Companies House no.</Label><Input value={f.companies_house} onChange={set("companies_house")} data-testid="int-ch" className="h-11" /></div>
                <div><Label className="mb-1.5 block text-sm">TfL operator licence</Label><Input value={f.tfl_operator_licence} onChange={set("tfl_operator_licence")} data-testid="int-tfl" className="h-11" /></div>
              </div>
            </div>
          </div>)}
          {step === 1 && (<div>
            <div className="flex items-center gap-2 text-[#0B6B4F] font-semibold mb-1"><Car className="w-5 h-5" /> Your fleet</div>
            <p className="text-[14px] text-[#7A857F] mb-6">This helps us understand the kind of supply you can bring.</p>
            <div className="space-y-4">
              <div><Label className="mb-1.5 block text-sm">How many vehicles do you run?</Label>
                <Select value={f.fleet_size} onValueChange={(v) => setF((p) => ({ ...p, fleet_size: v }))}><SelectTrigger data-testid="int-fleet" className="h-11"><SelectValue /></SelectTrigger>
                  <SelectContent>{fleetOpts.map((x) => <SelectItem key={x} value={x}>{x} vehicles</SelectItem>)}</SelectContent></Select>
              </div>
              <div><Label className="mb-1.5 block text-sm">Boroughs or areas you cover</Label><Input value={f.areas} onChange={set("areas")} data-testid="int-areas" className="h-11" placeholder="Croydon, Bromley" /></div>
              <div><Label className="mb-1.5 block text-sm">Types of car you rent out</Label><Input value={f.vehicle_types} onChange={set("vehicle_types")} data-testid="int-types" className="h-11" placeholder="Hybrids, saloons, one WAV" /></div>
            </div>
            <div className="mt-5 rounded-2xl bg-[#0E1A14] text-white p-5" data-testid="int-earnings">
              <div className="text-[12px] text-white/60 uppercase tracking-wide">What a fleet your size could earn</div>
              <div className="text-3xl font-heading font-extrabold text-[#5FD3A6] mt-1.5">£{estimateFleetEarnings({ "1-5": 3, "6-15": 10, "16-30": 22, "30+": 40 }[f.fleet_size] || 10, vClass.weekly).grossYear.toLocaleString()}<span className="text-sm font-normal text-white/60"> a year</span></div>
              <div className="text-[13px] text-white/70 mt-1">Based on {vClass.label.toLowerCase()} at £{vClass.weekly}/wk, before our 10% fee, at typical utilisation.</div>
            </div>
          </div>)}
          {step === 2 && (<div>
            <div className="flex items-center gap-2 text-[#0B6B4F] font-semibold mb-1"><UserRound className="w-5 h-5" /> How we reach you</div>
            <p className="text-[14px] text-[#7A857F] mb-6">We will only use this to contact you about listing your fleet.</p>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="mb-1.5 block text-sm">Your name</Label><Input value={f.contact_name} onChange={set("contact_name")} data-testid="int-name" className="h-11" /></div>
                <div><Label className="mb-1.5 block text-sm">Your role</Label><Input value={f.role} onChange={set("role")} data-testid="int-role" className="h-11" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="mb-1.5 block text-sm">Email</Label><Input type="email" value={f.email} onChange={set("email")} data-testid="int-email" className="h-11" /></div>
                <div><Label className="mb-1.5 block text-sm">Phone</Label><Input value={f.phone} onChange={set("phone")} data-testid="int-phone" className="h-11" /></div>
              </div>
              <div><Label className="mb-1.5 block text-sm">How did you hear about us?</Label>
                <Select value={f.heard_from} onValueChange={(v) => setF((p) => ({ ...p, heard_from: v }))}><SelectTrigger data-testid="int-heard" className="h-11"><SelectValue /></SelectTrigger>
                  <SelectContent>{["Word of mouth", "Social media", "Search engine", "Industry event", "Other"].map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent></Select>
              </div>
            </div>
          </div>)}

          <div className="flex gap-3 mt-8">
            {step > 0 && <Button variant="outline" onClick={() => setStep(step - 1)} className="rounded-full" data-testid="int-back">Back</Button>}
            <Button onClick={next} disabled={loading} className="rounded-full bg-[#0B6B4F] hover:bg-[#095B43] text-white flex-1" data-testid={step === 2 ? "int-submit" : "int-continue"}>
              {step < 2 ? "Continue" : (loading ? "Sending" : "Register my interest")}
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
