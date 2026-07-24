import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Car, ShieldCheck, FileText, AlertTriangle, Wrench, Clock, Check, X, Heart, CalendarClock } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from "recharts";

const statusMap = {
  approved: { c: "text-emerald-800 bg-emerald-50", i: Check, t: "Approved" },
  under_review: { c: "text-amber-800 bg-amber-50", i: Clock, t: "Under review" },
  declined: { c: "text-red-700 bg-red-50", i: X, t: "Declined" },
};
const spend = [{ m: "Feb", v: 1294 }, { m: "Mar", v: 1294 }, { m: "Apr", v: 1294 }, { m: "May", v: 1294 }, { m: "Jun", v: 1294 }];

export default function DriverPortal() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [apps, setApps] = useState([]);

  useEffect(() => {
    if (user === false) navigate("/login");
    if (user) api.get("/applications/me").then((r) => setApps(r.data)).catch(() => {});
  }, [user, navigate]);

  if (!user) return <div className="max-w-5xl mx-auto px-4 py-20 text-[#64748B]">Loading…</div>;

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div><h1 className="text-3xl font-heading font-extrabold text-[#1A2E25]">Welcome back, {user.name?.split(" ")[0]}</h1><p className="text-[#64748B] mt-1">Here's where things stand today.</p></div>
        <div className="flex gap-2"><Button variant="outline" onClick={() => navigate("/saved")} className="rounded-full"><Heart className="w-4 h-4 mr-2" /> Saved</Button><Button onClick={() => navigate("/")} className="rounded-full bg-[#047857] hover:bg-[#065F46] text-white">Find a car</Button></div>
      </div>

      {/* Current rental */}
      <div className="mt-8 bg-gradient-to-br from-[#1A2E25] to-[#12211B] text-white rounded-3xl p-6 sm:p-8">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center"><Car className="w-6 h-6 text-[#10B981]" /></div>
            <div><h2 className="font-heading font-bold text-xl">Toyota Prius 2022</h2><p className="text-sm text-white/60">Verified Operator · NE-2291 · LK22 CAR · <span className="text-[#10B981] font-medium">Active</span></p></div>
          </div>
          <div className="text-right"><div className="text-2xl font-heading font-extrabold">£323.40<span className="text-sm font-normal text-white/60">/wk</span></div><div className="text-xs text-white/60">Next payment: Fri 4 Jul</div></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {[{ i: AlertTriangle, t: "Report issue" }, { i: Wrench, t: "Roadside assist" }, { i: ShieldCheck, t: "Insurance" }, { i: FileText, t: "Documents" }].map((a) => (
            <button key={a.t} className="bg-white/5 hover:bg-white/10 rounded-2xl p-3 text-sm font-medium transition-colors flex flex-col items-center gap-1.5"><a.i className="w-5 h-5 text-[#10B981]" /> {a.t}</button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-6">
          <h3 className="font-heading font-bold text-lg text-[#1A2E25] mb-4">Your applications</h3>
          {apps.length === 0 ? (
            <div className="text-sm text-[#64748B]">You haven't applied to any vehicles yet. <button onClick={() => navigate("/")} className="text-[#047857] font-semibold">Browse cars</button></div>
          ) : (
            <div className="space-y-3" data-testid="my-applications">
              {apps.map((a, i) => { const s = statusMap[a.status] || statusMap.under_review; return (
                <div key={i} className="flex items-center justify-between border border-slate-100 rounded-2xl p-3">
                  <div><div className="font-medium text-[#1A2E25] text-sm">{a.vehicle || "Vehicle"}</div><div className="text-xs text-[#64748B]">Operator · {a.operator_code || "—"}</div></div>
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${s.c}`}><s.i className="w-3 h-3" /> {s.t}</span>
                </div>); })}
            </div>
          )}
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6">
          <h3 className="font-heading font-bold text-lg text-[#1A2E25] mb-2">Monthly spend</h3>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={spend}>
              <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10B981" stopOpacity={0.4} /><stop offset="100%" stopColor="#10B981" stopOpacity={0} /></linearGradient></defs>
              <XAxis dataKey="m" tickLine={false} axisLine={false} fontSize={11} stroke="#94A3B8" />
              <Tooltip formatter={(x) => [`£${x}`, "Spend"]} />
              <Area type="monotone" dataKey="v" stroke="#047857" strokeWidth={2} fill="url(#g)" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-3 flex items-center justify-between text-sm bg-[#F9F8F6] rounded-2xl p-3"><span className="text-[#475569]">Insurance</span><span className="font-semibold text-emerald-700">Active · expires 14 Sep 2026</span></div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mt-6">
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" /><span className="text-sm text-amber-900 flex-1">Upload your PCO/TfL badge photo to finish verification.</span><Button size="sm" className="rounded-full bg-[#047857] hover:bg-[#065F46] text-white text-xs">Upload</Button>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
          <CalendarClock className="w-5 h-5 text-[#047857] shrink-0" /><span className="text-sm text-[#475569]">MOT due 18 Aug 2026 — already booked by your operator at Stratford Motors.</span>
        </div>
      </div>
    </main>
  );
}
