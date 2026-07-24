import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Car, ShieldCheck, FileText, AlertTriangle, Wrench, Clock, Check, X } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const statusMap = {
  approved: { c: "text-emerald-800 bg-emerald-50", i: Check, t: "Approved" },
  under_review: { c: "text-amber-800 bg-amber-50", i: Clock, t: "Under review" },
  declined: { c: "text-red-700 bg-red-50", i: X, t: "Declined" },
};

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
      <h1 className="text-3xl font-heading font-extrabold text-[#1A2E25]">Welcome back, {user.name?.split(" ")[0]}</h1>
      <p className="text-[#64748B] mt-1">Here's where things stand today.</p>

      {/* Current rental (demo) */}
      <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center"><Car className="w-6 h-6 text-[#047857]" /></div>
            <div>
              <h2 className="font-heading font-bold text-lg text-[#1A2E25]">Toyota Prius 2022</h2>
              <p className="text-sm text-[#64748B]">Verified Operator · NE-2291 · LK22 CAR · <span className="text-emerald-700 font-medium">Active</span></p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-heading font-extrabold text-[#1A2E25]">£323.40<span className="text-sm font-normal text-[#64748B]">/wk</span></div>
            <div className="text-xs text-[#64748B]">Next payment: Fri 4 Jul</div>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {[{ i: AlertTriangle, t: "Report an issue" }, { i: Wrench, t: "Roadside assist" }, { i: ShieldCheck, t: "Insurance" }, { i: FileText, t: "Documents" }].map((a) => (
            <button key={a.t} className="border border-slate-200 rounded-xl p-3 text-sm font-medium text-[#1A2E25] hover:border-slate-400 hover:bg-[#F9F8F6] transition-colors flex flex-col items-center gap-1.5">
              <a.i className="w-5 h-5 text-[#047857]" /> {a.t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        {/* Applications */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="font-heading font-bold text-lg text-[#1A2E25] mb-4">Your applications</h3>
          {apps.length === 0 ? (
            <div className="text-sm text-[#64748B]">
              You haven't applied to any vehicles yet. <button onClick={() => navigate("/")} className="text-[#047857] font-semibold">Browse cars</button>
            </div>
          ) : (
            <div className="space-y-3" data-testid="my-applications">
              {apps.map((a, i) => {
                const s = statusMap[a.status] || statusMap.under_review;
                return (
                  <div key={i} className="flex items-center justify-between border border-slate-100 rounded-xl p-3">
                    <div>
                      <div className="font-medium text-[#1A2E25] text-sm">{a.vehicle || "Vehicle"}</div>
                      <div className="text-xs text-[#64748B]">Operator · {a.operator_code}</div>
                    </div>
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${s.c}`}><s.i className="w-3 h-3" /> {s.t}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Payments */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="font-heading font-bold text-lg text-[#1A2E25] mb-4">Recent payments</h3>
          <table className="w-full text-sm">
            <tbody>
              {[["27 Jun 2026", "£323.40", "Paid"], ["20 Jun 2026", "£323.40", "Paid"], ["4 Jul 2026", "£323.40", "Upcoming"]].map((r) => (
                <tr key={r[0]} className="border-b border-slate-100 last:border-0">
                  <td className="py-2.5 text-[#475569]">{r[0]}</td>
                  <td className="py-2.5 font-medium text-[#1A2E25]">{r[1]}</td>
                  <td className="py-2.5 text-right"><span className={`text-xs font-semibold ${r[2] === "Paid" ? "text-emerald-700" : "text-amber-700"}`}>{r[2]}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 flex items-center justify-between text-sm bg-[#F9F8F6] rounded-xl p-3">
            <span className="text-[#475569]">Insurance</span>
            <span className="font-semibold text-emerald-700">Active · expires 14 Sep 2026</span>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
        <span className="text-sm text-amber-900">Upload your PCO/TfL badge photo to finish verification.</span>
        <Button size="sm" className="ml-auto rounded-full bg-[#047857] hover:bg-[#065F46] text-white text-xs">Upload</Button>
      </div>
    </main>
  );
}
