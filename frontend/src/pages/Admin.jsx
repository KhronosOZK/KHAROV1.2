import { useEffect, useState } from "react";
import { Download, Lock } from "lucide-react";
import { toast } from "sonner";
import { api, API } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const TABS = ["leads", "applications", "interests", "users", "events"];

export default function Admin() {
  const { user, login } = useAuth();
  const [summary, setSummary] = useState(null);
  const [tab, setTab] = useState("leads");
  const [rows, setRows] = useState([]);
  const [creds, setCreds] = useState({ email: "", password: "" });

  const isAdmin = user && user.role === "admin";

  useEffect(() => { if (isAdmin) api.get("/admin/summary").then((r) => setSummary(r.data)).catch(() => {}); }, [isAdmin]);
  useEffect(() => { if (isAdmin) api.get(`/admin/${tab}`).then((r) => setRows(r.data)).catch(() => setRows([])); }, [isAdmin, tab]);

  const doLogin = async (e) => {
    e.preventDefault();
    const res = await login(creds.email, creds.password);
    if (!res.ok) toast.error(res.error);
  };

  const exportCsv = () => { window.open(`${API}/admin/export/${tab}`, "_blank"); };

  if (!isAdmin) return (
    <main className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white border border-slate-200 rounded-2xl p-8">
        <Lock className="w-6 h-6 text-[#047857]" />
        <h1 className="text-2xl font-heading font-bold text-[#1A2E25] mt-3">Caro Ops — admin</h1>
        <p className="text-sm text-[#64748B] mt-1 mb-6">Sign in with your operations account to view captured leads.</p>
        <form onSubmit={doLogin} className="space-y-4">
          <div><Label className="mb-1.5 block text-sm">Email</Label><Input type="email" value={creds.email} onChange={(e) => setCreds((p) => ({ ...p, email: e.target.value }))} data-testid="admin-email" /></div>
          <div><Label className="mb-1.5 block text-sm">Password</Label><Input type="password" value={creds.password} onChange={(e) => setCreds((p) => ({ ...p, password: e.target.value }))} data-testid="admin-password" /></div>
          <Button type="submit" className="w-full rounded-full bg-[#047857] hover:bg-[#065F46] text-white" data-testid="admin-login">Sign in</Button>
        </form>
      </div>
    </main>
  );

  const cards = summary ? [
    { l: "Total leads", v: summary.leads }, { l: "Driver accounts", v: summary.drivers },
    { l: "Applications", v: summary.applications }, { l: "Operator interest", v: summary.interests },
    { l: "Listing views", v: summary.listing_views }, { l: "Searches", v: summary.searches },
  ] : [];

  const columns = rows.length ? Object.keys(rows[0]).filter((k) => k !== "data" && k !== "password_hash").slice(0, 6) : [];

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-heading font-extrabold text-[#1A2E25]">Interest & leads tracker</h1>
      <p className="text-[#64748B] mt-1">Every captured email, phone number and enquiry — export any table as CSV for outreach.</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6">
        {cards.map((c) => (
          <div key={c.l} className="bg-white border border-slate-200 rounded-xl p-4" data-testid={`stat-${c.l}`}>
            <div className="text-2xl font-heading font-extrabold text-[#1A2E25]">{c.v}</div>
            <div className="text-xs text-[#64748B] mt-0.5">{c.l}</div>
          </div>
        ))}
      </div>

      <Tabs value={tab} onValueChange={setTab} className="mt-8">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <TabsList className="flex-wrap h-auto">
            {TABS.map((t) => <TabsTrigger key={t} value={t} className="capitalize" data-testid={`admin-tab-${t}`}>{t}</TabsTrigger>)}
          </TabsList>
          <Button onClick={exportCsv} variant="outline" className="rounded-full" data-testid="export-csv-btn"><Download className="w-4 h-4 mr-2" /> Export CSV</Button>
        </div>

        {TABS.map((t) => (
          <TabsContent key={t} value={t} className="mt-4">
            <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto">
              {rows.length === 0 ? (
                <div className="p-8 text-center text-[#64748B] text-sm">No records yet.</div>
              ) : (
                <table className="w-full text-sm" data-testid={`table-${t}`}>
                  <thead><tr className="text-left text-[#64748B] text-xs border-b border-slate-200 bg-[#F9F8F6]">
                    {columns.map((c) => <th key={c} className="py-3 px-4 capitalize whitespace-nowrap">{c.replace(/_/g, " ")}</th>)}
                  </tr></thead>
                  <tbody>
                    {rows.map((r, i) => (
                      <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-[#F9F8F6]">
                        {columns.map((c) => <td key={c} className="py-2.5 px-4 text-[#475569] whitespace-nowrap max-w-xs truncate">{String(r[c] ?? "—")}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </main>
  );
}
