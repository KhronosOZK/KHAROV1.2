import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IMG } from "@/lib/images";

export default function OperatorLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.ok) { toast.success("Welcome back"); navigate("/operator-dashboard"); }
    else toast.error(res.error);
  };

  return (
    <main className="grid lg:grid-cols-2 min-h-[calc(100vh-68px)]">
      <div className="hidden lg:block relative">
        <img src={IMG.handshakeSmile} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A130F]/92 via-[#0A130F]/55 to-[#0A130F]/40" />
        <div className="absolute bottom-10 left-10 right-10 text-white">
          <p className="text-2xl font-heading font-bold leading-snug">"Our cars stopped sitting idle. Applications come in already vetted and the rent turns up on time."</p>
          <p className="text-white/70 mt-3 text-sm">Sam, fleet operator in East London</p>
        </div>
      </div>
      <div className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">
          <p className="text-[13px] font-medium text-[#0B6B4F] tracking-[0.12em] uppercase">Rental operators</p>
          <h1 className="text-3xl font-heading font-extrabold text-[#1A2E25] mt-2">Sign in to your fleet</h1>
          <p className="text-[15px] text-[#4A564F] mt-2 mb-8">Manage your cars, applications and payouts in one place.</p>
          <form onSubmit={submit} className="space-y-4">
            <div><Label className="mb-1.5 block text-sm">Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} data-testid="oplogin-email" className="h-11" required /></div>
            <div><Label className="mb-1.5 block text-sm">Password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} data-testid="oplogin-password" className="h-11" required /></div>
            <Button type="submit" disabled={loading} className="w-full h-11 rounded-full bg-[#0B6B4F] hover:bg-[#095B43] text-white" data-testid="oplogin-submit">{loading ? "Signing in" : "Sign in"}</Button>
          </form>
          <div className="mt-8 rounded-2xl bg-[#F1EFE9] p-5">
            <p className="text-[14px] text-[#4A564F]">Not with us yet? We are onboarding the first London operators now.</p>
            <Link to="/list-your-fleet" className="inline-flex items-center gap-1.5 text-[#0B6B4F] font-semibold mt-2 text-[14px]">Register your fleet <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <p className="text-[13px] text-[#7A857F] mt-4 text-center">Are you a driver? <Link to="/login" className="text-[#0B6B4F] font-medium">Sign in here</Link></p>
        </div>
      </div>
    </main>
  );
}
