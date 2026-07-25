import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Zap, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IMG } from "@/lib/images";

const inputCls = "h-12 bg-white border-[#1A2E25]/12 rounded-xl focus-visible:ring-[#0B6B4F]/30 focus-visible:border-[#0B6B4F]";

export default function Login() {
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
    if (res.ok) { toast.success("Good to see you again"); navigate("/portal"); }
    else toast.error(res.error);
  };

  return (
    <main className="relative min-h-[calc(100vh-68px)] bg-[#07110D] overflow-hidden">
      <div className="absolute inset-0">
        <img src={IMG.taxiDriver} alt="" className="w-full h-full object-cover opacity-[0.16]" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#07110D] via-[#07110D]/94 to-[#0B2118]/85" />
        <div className="absolute -top-48 -left-40 w-[620px] h-[620px] rounded-full bg-[#0B6B4F]/30 blur-[130px]" />
        <div className="absolute -bottom-52 -right-24 w-[560px] h-[560px] rounded-full bg-[#5FD3A6]/12 blur-[130px]" />
        <div className="absolute inset-0 grain opacity-40" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 lg:py-16 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center min-h-[calc(100vh-68px)]">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-white text-center lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[12px] font-medium tracking-[0.14em] uppercase text-[#5FD3A6]">
            <Zap className="w-3.5 h-3.5" /> Welcome back
          </div>
          <h1 className="mt-6 font-heading font-extrabold tracking-tight text-[40px] leading-[1.04] sm:text-5xl lg:text-[64px] text-balance">
            Back to the<br /><span className="text-[#5FD3A6]">driver's seat.</span>
          </h1>
          <div className="mt-9 max-w-md mx-auto lg:mx-0 text-left rounded-[24px] bg-[#0A1712]/70 border border-white/10 backdrop-blur-2xl p-6 sm:p-7 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]">
            <p className="text-[18px] font-heading font-semibold text-white leading-snug">"I knew exactly what I was paying before I turned up. First time that has happened."</p>
            <p className="text-white/55 mt-3 text-sm">Amara, private hire driver in Croydon</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.55 }}
          className="w-full max-w-md justify-self-center lg:justify-self-end bg-[#F9F8F6] rounded-[28px] p-7 sm:p-9 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.7)]">
          <h2 className="text-[28px] font-heading font-extrabold text-[#1A2E25]">Sign in</h2>
          <p className="text-[14.5px] text-[#4A5D54] mt-2 mb-7">See your rentals, applications and saved cars.</p>
          <form onSubmit={submit} className="space-y-4">
            <div><Label className="text-[13px] font-medium text-[#4A5D54] mb-1.5 block">Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} data-testid="login-email" className={inputCls} required /></div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label className="text-[13px] font-medium text-[#4A5D54]">Password</Label>
                <Link to="/forgot-password" className="text-[12.5px] text-[#0B6B4F] font-medium hover:underline" data-testid="login-forgot">Forgot password?</Link>
              </div>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} data-testid="login-password" className={inputCls} required />
            </div>
            <Button type="submit" disabled={loading} className="w-full h-11 rounded-full bg-[#0B6B4F] hover:bg-[#047857] text-white hover:-translate-y-[2px] transition-transform" data-testid="login-submit">{loading ? "Signing in" : "Sign in"}</Button>
          </form>
          <div className="mt-5 flex items-center gap-2 text-[12.5px] text-[#7A857F]"><ShieldCheck className="w-4 h-4 text-[#0B6B4F]" strokeWidth={1.5} /> Your details are encrypted and never sold on.</div>
          <p className="text-[14px] text-[#4A5D54] mt-6 text-center">New here? <Link to="/register" className="text-[#0B6B4F] font-semibold">Create your driver account</Link></p>
          <p className="text-[13px] text-[#7A857F] mt-2 text-center">Run a fleet? <Link to="/operator-login" className="text-[#0B6B4F] font-medium">Operator sign in</Link></p>
        </motion.div>
      </div>
    </main>
  );
}
