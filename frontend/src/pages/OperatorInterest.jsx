import { useEffect, useState } from "react";
import { Check, Building2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function OperatorInterest() {
  const [done, setDone] = useState(false);
  const [count, setCount] = useState(37);
  const [loading, setLoading] = useState(false);
  const [f, setF] = useState({
    company_name: "", companies_house: "", tfl_operator_licence: "", fleet_size: "6-15",
    areas: "", contact_name: "", role: "", email: "", phone: "", heard_from: "Word of mouth",
  });
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));

  useEffect(() => { api.get("/stats").then((r) => setCount(r.data.operators + 37)).catch(() => {}); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/interest", f);
      setDone(true); window.scrollTo(0, 0);
    } catch { toast.error("Couldn't submit. Please try again."); }
    setLoading(false);
  };

  if (done) return (
    <main className="max-w-xl mx-auto px-4 py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto"><Check className="w-8 h-8 text-emerald-700" /></div>
      <h1 className="text-3xl font-heading font-extrabold text-[#1A2E25] mt-6" data-testid="interest-success">You're on the list</h1>
      <p className="text-[#475569] mt-3">Thanks — we'll be in touch before Caro launches in your area.</p>
    </main>
  );

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="bg-[#1A2E25] rounded-2xl p-6 text-white mb-6">
        <span className="text-xs font-semibold text-[#10B981]">Not yet live in your area</span>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold mt-2">Register your fleet's interest</h1>
        <p className="text-white/70 mt-2 text-sm">Caro is onboarding its first rental companies now. This isn't a live listing yet — it puts you on the list for launch. <span className="text-white font-semibold">{count} operators registered.</span></p>
      </div>

      <form onSubmit={submit} className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-5">
        <div className="flex items-center gap-2 text-[#047857] font-semibold"><Building2 className="w-5 h-5" /> Company</div>
        <div><Label className="mb-1.5 block text-sm">Company name</Label><Input value={f.company_name} onChange={set("company_name")} data-testid="int-company" required /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label className="mb-1.5 block text-sm">Companies House no.</Label><Input value={f.companies_house} onChange={set("companies_house")} data-testid="int-ch" /></div>
          <div><Label className="mb-1.5 block text-sm">TfL operator licence</Label><Input value={f.tfl_operator_licence} onChange={set("tfl_operator_licence")} data-testid="int-tfl" /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="mb-1.5 block text-sm">Fleet size</Label>
            <Select value={f.fleet_size} onValueChange={(v) => setF((p) => ({ ...p, fleet_size: v }))}>
              <SelectTrigger data-testid="int-fleet"><SelectValue /></SelectTrigger>
              <SelectContent>{["1-5", "6-15", "16-30", "30+"].map((x) => <SelectItem key={x} value={x}>{x} vehicles</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label className="mb-1.5 block text-sm">Boroughs / areas</Label><Input value={f.areas} onChange={set("areas")} data-testid="int-areas" placeholder="Croydon, Bromley" required /></div>
        </div>

        <div className="border-t border-slate-200 pt-5 space-y-5">
          <div className="text-[#047857] font-semibold">Contact details</div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="mb-1.5 block text-sm">Contact name</Label><Input value={f.contact_name} onChange={set("contact_name")} data-testid="int-name" required /></div>
            <div><Label className="mb-1.5 block text-sm">Role</Label><Input value={f.role} onChange={set("role")} data-testid="int-role" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="mb-1.5 block text-sm">Email</Label><Input type="email" value={f.email} onChange={set("email")} data-testid="int-email" required /></div>
            <div><Label className="mb-1.5 block text-sm">Phone</Label><Input value={f.phone} onChange={set("phone")} data-testid="int-phone" required /></div>
          </div>
          <div>
            <Label className="mb-1.5 block text-sm">How did you hear about Caro?</Label>
            <Select value={f.heard_from} onValueChange={(v) => setF((p) => ({ ...p, heard_from: v }))}>
              <SelectTrigger data-testid="int-heard"><SelectValue /></SelectTrigger>
              <SelectContent>{["Word of mouth", "Social media", "Search engine", "Industry event", "Other"].map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>

        <Button type="submit" disabled={loading} className="w-full rounded-full bg-[#047857] hover:bg-[#065F46] text-white h-12" data-testid="int-submit">{loading ? "Submitting…" : "Register interest"}</Button>
      </form>
    </main>
  );
}
