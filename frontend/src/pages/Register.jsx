import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const steps = ["You", "Login", "Licence"];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [f, setF] = useState({ name: "", email: "", phone: "", password: "", dob: "", dvla_licence: "", pco_licence: "" });
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));

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
    <main className="max-w-lg mx-auto px-4 sm:px-6 py-12">
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

      <div className="bg-white rounded-[22px] p-7 sm:p-9 ring-1 ring-slate-200/70">
        {step === 0 && (<div>
          <h1 className="text-2xl font-heading font-bold text-[#1A2E25]">Let us get to know you</h1>
          <p className="text-[15px] text-[#4A564F] mt-2 mb-7">Just the basics for now. You can add your licence details when you are ready.</p>
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
          <p className="text-[15px] text-[#4A564F] mt-2 mb-7">Optional right now, but adding them means faster quotes and one less form later.</p>
          <div className="space-y-4">
            <div><Label className="mb-1.5 block text-sm">DVLA licence number</Label><Input value={f.dvla_licence} onChange={set("dvla_licence")} data-testid="reg-dvla" className="h-11" placeholder="SMITH901284JS9AB" /></div>
            <div><Label className="mb-1.5 block text-sm">PCO / TfL badge number</Label><Input value={f.pco_licence} onChange={set("pco_licence")} data-testid="reg-pco" className="h-11" placeholder="123456" /></div>
          </div>
          <div className="mt-6 space-y-2">
            {["We never sell your details on", "Most drivers hear back within a day", "Nothing is charged until you sign an agreement"].map((t) => (
              <div key={t} className="flex items-center gap-2 text-[13px] text-[#4A564F]"><Check className="w-4 h-4 text-[#0B6B4F]" /> {t}</div>
            ))}
          </div>
        </div>)}

        <div className="flex gap-3 mt-8">
          {step > 0 && <Button variant="outline" onClick={() => setStep(step - 1)} className="rounded-full" data-testid="reg-back">Back</Button>}
          <Button onClick={next} disabled={loading} className="rounded-full bg-[#0B6B4F] hover:bg-[#095B43] text-white flex-1" data-testid={step === 2 ? "reg-submit" : "reg-continue"}>
            {step < 2 ? "Continue" : (loading ? "Creating your account" : "Create account and browse cars")}
          </Button>
        </div>
      </div>
      <p className="text-[14px] text-[#4A564F] mt-6 text-center">Already with us? <Link to="/login" className="text-[#0B6B4F] font-semibold">Sign in</Link></p>
    </main>
  );
}
