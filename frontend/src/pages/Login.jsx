import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    if (res.ok) { toast.success("Welcome back"); navigate("/portal"); }
    else toast.error(res.error);
  };

  return (
    <main className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white border border-slate-200 rounded-2xl p-8">
        <h1 className="text-2xl font-heading font-bold text-[#1A2E25]">Sign in</h1>
        <p className="text-sm text-[#64748B] mt-1 mb-6">Access your rentals, applications and saved cars.</p>
        <form onSubmit={submit} className="space-y-4">
          <div><Label className="mb-1.5 block text-sm">Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} data-testid="login-email" required /></div>
          <div><Label className="mb-1.5 block text-sm">Password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} data-testid="login-password" required /></div>
          <Button type="submit" disabled={loading} className="w-full rounded-full bg-[#047857] hover:bg-[#065F46] text-white" data-testid="login-submit">{loading ? "Signing in…" : "Sign in"}</Button>
        </form>
        <p className="text-sm text-[#64748B] mt-5 text-center">New to Caro? <Link to="/register" className="text-[#047857] font-semibold">Create an account</Link></p>
      </div>
    </main>
  );
}
