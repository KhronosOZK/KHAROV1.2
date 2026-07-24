import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IMG } from "@/lib/images";

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
    <main className="grid lg:grid-cols-2 min-h-[calc(100vh-68px)]">
      <div className="hidden lg:block relative">
        <img src={IMG.happyDriver} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#0E1A14]/55" />
        <div className="absolute bottom-10 left-10 right-10 text-white">
          <p className="text-2xl font-heading font-bold leading-snug">"I knew exactly what I was paying before I turned up. First time that has happened."</p>
          <p className="text-white/70 mt-3 text-sm">Amara, private hire driver in Croydon</p>
        </div>
      </div>
      <div className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-heading font-extrabold text-[#1A2E25]">Welcome back</h1>
          <p className="text-[15px] text-[#4A564F] mt-2 mb-8">Sign in to see your rentals, applications and saved cars.</p>
          <form onSubmit={submit} className="space-y-4">
            <div><Label className="mb-1.5 block text-sm">Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} data-testid="login-email" className="h-11" required /></div>
            <div><Label className="mb-1.5 block text-sm">Password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} data-testid="login-password" className="h-11" required /></div>
            <Button type="submit" disabled={loading} className="w-full h-11 rounded-full bg-[#0B6B4F] hover:bg-[#095B43] text-white" data-testid="login-submit">{loading ? "Signing in" : "Sign in"}</Button>
          </form>
          <p className="text-[14px] text-[#4A564F] mt-6 text-center">New here? <Link to="/register" className="text-[#0B6B4F] font-semibold">Create your driver account</Link></p>
          <p className="text-[13px] text-[#7A857F] mt-2 text-center">Run a fleet? <Link to="/list-your-fleet" className="text-[#0B6B4F] font-medium">Register as an operator</Link></p>
        </div>
      </div>
    </main>
  );
}
