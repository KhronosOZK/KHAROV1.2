import { useState } from "react";
import { MapPin, Check } from "lucide-react";
import { toast } from "sonner";
import { api, trackEvent } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CityInterestForm({ city, compact }) {
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [f, setF] = useState({ name: "", email: "", phone: "", vehicle_type: "" });
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!f.email) { toast.error("Please add your email so we can reach you."); return; }
    setLoading(true);
    try {
      await api.post("/city-interest", { city, ...f });
      trackEvent("city_interest", { city });
      setDone(true);
    } catch { toast.error("Something went wrong. Please try again."); }
    setLoading(false);
  };

  if (done) return (
    <div className="text-center py-8" data-testid="city-interest-success">
      <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto"><Check className="w-7 h-7 text-emerald-700" /></div>
      <h3 className="text-xl font-heading font-bold text-[#1A2E25] mt-4">You are on the list for {city}</h3>
      <p className="text-[#4A564F] mt-2 text-[15px]">As soon as we have cars in {city}, you will be the first to know.</p>
    </div>
  );

  return (
    <div className={compact ? "" : "bg-white rounded-[22px] p-7 ring-1 ring-slate-200/70 max-w-xl mx-auto"} data-testid="city-interest-form">
      <div className="flex items-center gap-2 text-[#0B6B4F] font-semibold"><MapPin className="w-5 h-5" /> No cars in {city} just yet</div>
      <p className="text-[15px] text-[#4A564F] mt-2 mb-5">Tell us you want one and we will prioritise {city} based on demand. Leave your details and we will be in touch the moment cars go live there.</p>
      <form onSubmit={submit} className="space-y-3">
        <div className="grid sm:grid-cols-2 gap-3">
          <div><Label className="mb-1.5 block text-sm">Your name</Label><Input value={f.name} onChange={set("name")} data-testid="city-name" className="h-11" /></div>
          <div><Label className="mb-1.5 block text-sm">Phone</Label><Input value={f.phone} onChange={set("phone")} data-testid="city-phone" className="h-11" /></div>
        </div>
        <div><Label className="mb-1.5 block text-sm">Email</Label><Input type="email" value={f.email} onChange={set("email")} data-testid="city-email" className="h-11" required /></div>
        <div><Label className="mb-1.5 block text-sm">Type of car you want</Label><Input value={f.vehicle_type} onChange={set("vehicle_type")} data-testid="city-vehicle" className="h-11" placeholder="Hybrid, electric, WAV…" /></div>
        <Button type="submit" disabled={loading} className="w-full h-11 rounded-full bg-[#0B6B4F] hover:bg-[#095B43] text-white" data-testid="city-submit">{loading ? "Sending" : `Notify me about ${city}`}</Button>
      </form>
    </div>
  );
}
