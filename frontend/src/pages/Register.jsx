import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { IMG } from "@/lib/images";

const steps = ["You", "Login", "Licence"];
const typeChips = [
  { key: "any", label: "Any car" },
  { key: "hybrid", label: "Hybrid" },
  { key: "electric", label: "Electric" },
  { key: "executive", label: "Executive" },
  { key: "wav", label: "Accessible" },
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [f, setF] = useState({ name: "", email: "", phone: "", password: "", dob: "", dvla_licence: "", pco_licence: "" });
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));

  // Interactive match explorer
  const [listings, setListings] = useState([]);
  const [pick, setPick] = useState("any");
  const [budget, setBudget] = useState(350);
  useEffect(() => { api.get("/listings").then((r) => setListings(r.data || [])).catch(() => {}); }, []);

  const matches = useMemo(() => listings.filter((v) => {
    const okType = pick === "any" || v.fuel === pick || v.vehicle_type === pick;
    return okType && v.weekly_rent <= budget;
  }), [listings, pick, budget]);
  const cheapest = matches.length ? Math.min(...matches.map((v) => v.weekly_rent)) : null;
  const hero = matches[0];

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
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <div className="grid lg:grid-cols-5 gap-8">
        {/* INTERACTIVE MATCH EXPLORER */}
        <div className="lg:col-span-2">
          <div className="relative rounded-[24px] overflow-hidden bg-[#0A130F] text-white h-full min-h-[440px]" data-testid="match-explorer">
            <img key={hero ? hero.id : "fallback"} src={hero ? hero.photos[0] : IMG.driverNight} alt=""
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0A130F]/35 via-[#0A130F]/72 to-[#0A130F]/97" />
            <div className="relative p-6 sm:p-7 h-full flex flex-col justify-between gap-6">
              <div>
                <p className="text-[12px] font-medium text-[#5FD3A6] tracking-[0.14em] uppercase">See what is waiting for you</p>
                <div className="mt-3 flex items-baseline gap-2">
                  <AnimatedNumber value={matches.length} className="text-5xl font-heading font-extrabold text-white leading-none" data-testid="match-count" />
                  <span className="text-white/70 text-[15px]">cars match right now</span>
                </div>
                <p className="text-white/70 text-[14px] mt-2">
                  {cheapest != null ? <>From <span className="font-semibold text-white">£{cheapest}/wk</span>, insurance and cover already included.</> : "Widen your budget to see more cars."}
                </p>
              </div>

              <div className="rounded-2xl bg-white/[0.08] ring-1 ring-white/10 p-4 backdrop-blur-md">
                <div className="flex flex-wrap gap-1.5">
                  {typeChips.map((c) => (
                    <button key={c.key} onClick={() => setPick(c.key)} data-testid={`explore-type-${c.key}`}
                      className={`text-[12.5px] px-3 py-1.5 rounded-full transition-all ${pick === c.key ? "bg-[#5FD3A6] text-[#0A130F] font-semibold" : "bg-white/10 text-white/80 hover:bg-white/20"}`}>
                      {c.label}
                    </button>
                  ))}
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-[12.5px] text-white/75 mb-1.5">
                    <span>Weekly budget</span><span className="font-semibold text-white">up to £{budget}{budget >= 400 ? "+" : ""}</span>
                  </div>
                  <Slider min={180} max={400} step={5} value={[budget]} onValueChange={(v) => setBudget(v[0])} data-testid="explore-budget" />
                </div>
              </div>

              <div className="space-y-2">
                {["We never sell your details on", "Most drivers hear back within a day", "Nothing charged until you are behind the wheel"].map((t) => (
                  <div key={t} className="flex items-center gap-2.5 text-[13px] text-white/85"><Check className="w-4 h-4 text-[#5FD3A6] shrink-0" /> {t}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SIGN UP FORM */}
        <div className="lg:col-span-3">
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

          <div className="bg-white rounded-[22px] p-7 ring-1 ring-slate-200/70">
            {matches.length > 0 && (
              <div className="mb-6 flex items-center gap-2 rounded-full bg-emerald-50 text-[#0B6B4F] text-[13px] font-medium px-4 py-2 w-fit">
                <Sparkles className="w-3.5 h-3.5" /> {matches.length} cars are ready for you the moment you finish
              </div>
            )}
            {step === 0 && (<div>
              <h1 className="text-2xl font-heading font-bold text-[#1A2E25]">Let us get to know you</h1>
              <p className="text-[15px] text-[#4A564F] mt-2 mb-7">Just the basics for now. Licence details can wait.</p>
              <div className="space-y-4">
                <div><Label className="mb-1.5 block text-sm">Full name</Label><Input value={f.name} onChange={set("name")} data-testid="reg-name" className="h-11" placeholder="Jordan Smith" /></div>
                <div><Label className="mb-1.5 block text-sm">Email</Label><Input type="email" value={f.email} onChange={set("email")} data-testid="reg-email" className="h-11" placeholder="you@email.com" /></div>
                <div><Label className="mb-1.5 block text-sm">Mobile number</Label><Input value={f.phone} onChange={set("phone")} data-testid="reg-phone" className="h-11" placeholder="07…" /></div>
              </div>
            </div>)}
            {step === 1 && (<div>
              <h1 className="text-2xl font-heading font-bold text-[#1A2E25]">Set up your login</h1>
              <p className="text-[15px] text-[#4A564F] mt-2 mb-7">Choose a password so you can pick up where you left off.</p>
              <div className="space-y-4">
                <div><Label className="mb-1.5 block text-sm">Password</Label><Input type="password" value={f.password} onChange={set("password")} data-testid="reg-password" className="h-11" placeholder="At least 6 characters" /></div>
                <div><Label className="mb-1.5 block text-sm">Date of birth</Label><Input type="date" value={f.dob} onChange={set("dob")} className="h-11" /></div>
              </div>
            </div>)}
            {step === 2 && (<div>
              <h1 className="text-2xl font-heading font-bold text-[#1A2E25]">Your driving licences</h1>
              <p className="text-[15px] text-[#4A564F] mt-2 mb-7">Optional now, but adding them means faster quotes and one less form later.</p>
              <div className="space-y-4">
                <div><Label className="mb-1.5 block text-sm">DVLA licence number</Label><Input value={f.dvla_licence} onChange={set("dvla_licence")} data-testid="reg-dvla" className="h-11" placeholder="SMITH901284JS9AB" /></div>
                <div><Label className="mb-1.5 block text-sm">PCO / TfL badge number</Label><Input value={f.pco_licence} onChange={set("pco_licence")} data-testid="reg-pco" className="h-11" placeholder="123456" /></div>
              </div>
            </div>)}

            <div className="flex gap-3 mt-8">
              {step > 0 && <Button variant="outline" onClick={() => setStep(step - 1)} className="rounded-full" data-testid="reg-back">Back</Button>}
              <Button onClick={next} disabled={loading} className="rounded-full bg-[#0B6B4F] hover:bg-[#095B43] text-white flex-1" data-testid={step === 2 ? "reg-submit" : "reg-continue"}>
                {step < 2 ? "Continue" : (loading ? "Creating your account" : "Create account and browse cars")} {step < 2 && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          </div>
          <p className="text-[14px] text-[#4A564F] mt-5 text-center">Already with us? <Link to="/login" className="text-[#0B6B4F] font-semibold">Sign in</Link></p>
        </div>
      </div>
    </main>
  );
}
