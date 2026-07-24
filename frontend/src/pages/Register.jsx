import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [f, setF] = useState({ name: "", email: "", phone: "", password: "", dob: "", dvla_licence: "", pco_licence: "" });
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await register({ ...f, role: "driver" });
    setLoading(false);
    if (res.ok) { toast.success("Account created"); navigate("/portal"); }
    else toast.error(res.error);
  };

  return (
    <main className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white border border-slate-200 rounded-2xl p-8">
        <h1 className="text-2xl font-heading font-bold text-[#1A2E25]">Create your account</h1>
        <p className="text-sm text-[#64748B] mt-1 mb-6">Takes about a minute. Sign up once, then browse and apply to any vehicle — your details are reused everywhere.</p>
        <form onSubmit={submit} className="space-y-4">
          <div><Label className="mb-1.5 block text-sm">Full name</Label><Input value={f.name} onChange={set("name")} data-testid="reg-name" required /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="mb-1.5 block text-sm">Email</Label><Input type="email" value={f.email} onChange={set("email")} data-testid="reg-email" required /></div>
            <div><Label className="mb-1.5 block text-sm">Phone</Label><Input value={f.phone} onChange={set("phone")} data-testid="reg-phone" required /></div>
          </div>
          <div><Label className="mb-1.5 block text-sm">Password</Label><Input type="password" value={f.password} onChange={set("password")} data-testid="reg-password" required /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="mb-1.5 block text-sm">DVLA licence <span className="text-[#94A3B8]">(optional)</span></Label><Input value={f.dvla_licence} onChange={set("dvla_licence")} data-testid="reg-dvla" /></div>
            <div><Label className="mb-1.5 block text-sm">PCO / TfL number <span className="text-[#94A3B8]">(optional)</span></Label><Input value={f.pco_licence} onChange={set("pco_licence")} data-testid="reg-pco" /></div>
          </div>
          <Button type="submit" disabled={loading} className="w-full rounded-full bg-[#047857] hover:bg-[#065F46] text-white" data-testid="reg-submit">{loading ? "Creating…" : "Create account & browse cars"}</Button>
        </form>
        <div className="mt-5 space-y-1.5">
          {["Your details are never sold on", "Applications get a first response within 24 hours", "Nothing charged until you sign an agreement"].map((t) => (
            <div key={t} className="flex items-center gap-2 text-xs text-[#64748B]"><Check className="w-3.5 h-3.5 text-[#047857]" /> {t}</div>
          ))}
        </div>
        <p className="text-sm text-[#64748B] mt-5 text-center">Already have an account? <Link to="/login" className="text-[#047857] font-semibold">Sign in</Link></p>
      </div>
    </main>
  );
}
