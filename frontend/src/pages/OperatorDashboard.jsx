import { useState } from "react";
import { Car, TrendingUp, Users, AlertTriangle, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const kpis = [
  { l: "Vehicles listed", v: "14", d: "▲ 2 this month", i: Car },
  { l: "Currently rented", v: "11", d: "78% utilisation", i: TrendingUp },
  { l: "Revenue this month", v: "£12,850", d: "▲ 6.4% vs last", i: TrendingUp },
  { l: "Pending applications", v: "3", d: "Avg. response 4h", i: Users },
];
const fleet = [
  ["Toyota Prius 2022", "LK22 CAR · Jordan S.", "Rented", "£265"],
  ["Toyota Camry 2022", "LK22 CMY · —", "Available", "£280"],
  ["Ford Galaxy 2021", "LG21 GXY · —", "Maintenance", "£245"],
  ["Skoda Octavia 2020", "SK20 OCT · Amara P.", "Rented", "£210"],
  ["Tesla Model 3 2023", "TM23 EVX · —", "Available", "£340"],
];
const apps = [
  ["Priya N.", "4 yrs experience · 4.9★ history · Toyota Camry", "Check passed"],
  ["Tunde A.", "1 yr experience · New driver · Ford Galaxy", "Check pending"],
  ["Elif K.", "6 yrs experience · 4.7★ history · Toyota Camry", "Check passed"],
];
const revenue = [
  ["Toyota Prius", "4", "£1,060.00", "£954.00"],
  ["Skoda Octavia", "4", "£840.00", "£756.00"],
  ["Toyota Camry", "2", "£560.00", "£504.00"],
];
const compliance = [
  "MOT due in 12 days — Toyota Prius (LK22 CAR)",
  "Insurance renewal in 30 days — fleet-wide",
  "PHV licence renewal in 41 days — Ford Galaxy (LG21 GXY)",
  "Road tax renewal in 58 days — Skoda Octavia (SK20 OCT)",
];

const statusColor = (s) => s === "Rented" ? "text-emerald-800 bg-emerald-50" : s === "Available" ? "text-blue-800 bg-blue-50" : "text-amber-800 bg-amber-50";

export default function OperatorDashboard() {
  const [tab, setTab] = useState("overview");
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-[#1A2E25] text-white flex items-center justify-center font-heading font-bold">SF</div>
        <div>
          <h1 className="text-2xl font-heading font-extrabold text-[#1A2E25]">South Forest Rentals</h1>
          <p className="text-sm text-[#64748B]">Rental company · Newham & East London <span className="ml-2 text-xs bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full">Preview</span></p>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="mt-6">
        <TabsList className="flex-wrap h-auto">
          {["overview", "fleet", "applications", "financials", "compliance"].map((t) => (
            <TabsTrigger key={t} value={t} className="capitalize" data-testid={`op-tab-${t}`}>{t}</TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((k) => (
              <div key={k.l} className="bg-white border border-slate-200 rounded-xl p-5">
                <k.i className="w-5 h-5 text-[#047857]" />
                <div className="text-2xl font-heading font-extrabold text-[#1A2E25] mt-3">{k.v}</div>
                <div className="text-xs text-[#64748B]">{k.l}</div>
                <div className="text-xs text-emerald-700 mt-1">{k.d}</div>
              </div>
            ))}
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5 mt-6">
            <h3 className="font-heading font-bold text-[#1A2E25] mb-3">Compliance alerts</h3>
            {compliance.slice(0, 3).map((c) => (
              <div key={c} className="flex items-center gap-2 py-2 text-sm text-[#475569] border-b border-slate-100 last:border-0">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" /> {c}
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="fleet" className="mt-6">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            {fleet.map((r) => (
              <div key={r[0]} className="flex items-center justify-between p-4 border-b border-slate-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#F3F1EC] flex items-center justify-center"><Car className="w-5 h-5 text-[#047857]" /></div>
                  <div><div className="font-medium text-[#1A2E25] text-sm">{r[0]}</div><div className="text-xs text-[#64748B]">{r[1]}</div></div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColor(r[2])}`}>{r[2]}</span>
                  <span className="font-heading font-bold text-[#1A2E25]">{r[3]}<span className="text-xs font-normal text-[#64748B]">/wk</span></span>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="applications" className="mt-6 space-y-3">
          {apps.map((a) => (
            <div key={a[0]} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between flex-wrap gap-3">
              <div>
                <div className="font-medium text-[#1A2E25]">{a[0]}</div>
                <div className="text-xs text-[#64748B]">{a[1]} · {a[2]}</div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="rounded-full"><X className="w-4 h-4 mr-1" /> Decline</Button>
                <Button size="sm" className="rounded-full bg-[#047857] hover:bg-[#065F46] text-white"><Check className="w-4 h-4 mr-1" /> Approve</Button>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="financials" className="mt-6">
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <Stat l="Next fortnightly payout" v="£8,415.00" />
            <Stat l="Payout date" v="Fri 4 Jul 2026" />
            <Stat l="Deposits held" v="£4,400.00" />
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h3 className="font-heading font-bold text-[#1A2E25] mb-3">Revenue by vehicle — this month</h3>
            <table className="w-full text-sm">
              <thead><tr className="text-left text-[#64748B] text-xs border-b border-slate-100"><th className="py-2">Vehicle</th><th>Weeks</th><th>Gross</th><th className="text-right">Net (after 10%)</th></tr></thead>
              <tbody>
                {revenue.map((r) => (
                  <tr key={r[0]} className="border-b border-slate-100 last:border-0">
                    <td className="py-2.5 text-[#1A2E25] font-medium">{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td className="text-right text-emerald-700 font-semibold">{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="mt-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            {compliance.map((c) => (
              <div key={c} className="flex items-center gap-2 py-3 text-sm text-[#475569] border-b border-slate-100 last:border-0">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" /> {c}
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}

const Stat = ({ l, v }) => (
  <div className="bg-white border border-slate-200 rounded-xl p-5">
    <div className="text-xs text-[#64748B]">{l}</div>
    <div className="text-xl font-heading font-extrabold text-[#1A2E25] mt-1">{v}</div>
  </div>
);
