import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ArrowRight, Columns3, X } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import VehicleCard from "@/components/VehicleCard";
import { Button } from "@/components/ui/button";

export default function Saved() {
  const { saved, toggleSaved } = useAuth();
  const navigate = useNavigate();
  const [all, setAll] = useState([]);
  const [compare, setCompare] = useState(false);
  const [quotes, setQuotes] = useState({});

  useEffect(() => { api.get("/listings").then((r) => setAll(r.data)); }, []);
  const items = all.filter((v) => saved.includes(v.id));

  useEffect(() => {
    if (!compare) return;
    items.forEach((v) => {
      if (quotes[v.id] !== undefined) return;
      api.post("/quote", { listing_id: v.id })
        .then((r) => setQuotes((q) => ({ ...q, [v.id]: r.data.cheapest_weekly })))
        .catch(() => setQuotes((q) => ({ ...q, [v.id]: null })));
    });
  }, [compare, saved.join(","), all.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const allIn = (v) => {
    const ins = quotes[v.id] || 0;
    const bd = v.breakdown_included ? 0 : 8;
    return v.weekly_rent + ins + bd;
  };
  const cheapest = compare && items.length
    ? items.reduce((m, v) => (allIn(v) < allIn(m) ? v : m), items[0]).id : null;

  const rows = [
    { label: "Weekly rent", get: (v) => `£${v.weekly_rent.toFixed ? v.weekly_rent.toFixed(2) : v.weekly_rent}` },
    { label: "Insurance (indicative)", get: (v) => (quotes[v.id] == null ? "…" : `£${quotes[v.id].toFixed(2)}`) },
    { label: "Breakdown cover", get: (v) => (v.breakdown_included ? "Included" : "£8.00") },
    { label: "All-in per week", get: (v) => `£${allIn(v).toFixed(2)}`, strong: true },
    { label: "Deposit (refundable)", get: (v) => `£${v.deposit}` },
    { label: "Fuel", get: (v) => v.fuel, cap: true },
    { label: "Seats", get: (v) => v.seats },
    { label: "Weekly mileage", get: (v) => `${v.mileage_allowance} mi` },
    { label: "Area", get: (v) => `${v.borough}${v.city && v.city !== "London" ? `, ${v.city}` : ""}` },
    { label: "Operator rating", get: (v) => `★ ${v.operator_rating}` },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between gap-3 mb-8 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 flex items-center justify-center"><Heart className="w-6 h-6 text-[#0B6B4F]" /></div>
          <div>
            <h1 className="text-3xl font-heading font-extrabold text-[#1A2E25]">Saved cars</h1>
            <p className="text-[#64748B]">{items.length} vehicle{items.length !== 1 ? "s" : ""} saved</p>
          </div>
        </div>
        {items.length >= 2 && (
          <Button onClick={() => setCompare((c) => !c)} data-testid="compare-toggle"
            className="rounded-full bg-[#1A2E25] hover:bg-[#0f1a15] text-white">
            {compare ? <><X className="w-4 h-4 mr-2" /> Back to grid</> : <><Columns3 className="w-4 h-4 mr-2" /> Compare {items.length} cars</>}
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center">
          <Heart className="w-10 h-10 text-[#CBD5E1] mx-auto" />
          <h2 className="font-heading font-bold text-xl text-[#1A2E25] mt-4">No saved cars yet</h2>
          <p className="text-[#64748B] mt-2">Tap the heart on any listing to save it here, then compare the full weekly cost side by side.</p>
          <Button onClick={() => navigate("/")} className="mt-6 rounded-full bg-[#0B6B4F] hover:bg-[#065F46] text-white">Browse cars <ArrowRight className="w-4 h-4 ml-2" /></Button>
        </div>
      ) : compare ? (
        <div className="overflow-x-auto rounded-2xl ring-1 ring-slate-200 bg-white" data-testid="compare-table">
          <table className="w-full border-collapse min-w-[640px]">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 bg-white p-4 text-left align-bottom w-40" />
                {items.map((v) => (
                  <th key={v.id} className={`p-4 align-bottom border-l border-slate-100 min-w-[220px] ${cheapest === v.id ? "bg-emerald-50/60" : ""}`}>
                    <div className="relative">
                      <button onClick={() => toggleSaved(v.id)} data-testid={`compare-remove-${v.id}`}
                        className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-white ring-1 ring-slate-200 flex items-center justify-center hover:bg-slate-50">
                        <X className="w-3.5 h-3.5 text-[#3B4A44]" />
                      </button>
                      <div className="aspect-[16/11] rounded-xl overflow-hidden bg-[#EFEDE8] mb-3 cursor-pointer" onClick={() => navigate(`/vehicle/${v.id}`)}>
                        <img src={v.photos[0]} alt={`${v.make} ${v.model}`} className="w-full h-full object-cover" />
                      </div>
                      <div className="font-heading font-bold text-[#1A2E25] leading-snug">{v.make} {v.model}</div>
                      <div className="text-[12.5px] text-[#7A857F] capitalize">{v.year} · {v.colour}</div>
                      {cheapest === v.id && <span className="inline-block mt-2 text-[11px] font-semibold text-[#0B6B4F] bg-emerald-100 rounded-full px-2 py-0.5">Best all-in price</span>}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label} className="border-t border-slate-100">
                  <td className="sticky left-0 z-10 bg-white p-4 text-[13px] font-medium text-[#64748B]">{r.label}</td>
                  {items.map((v) => (
                    <td key={v.id} data-testid={`compare-cell-${v.id}`}
                      className={`p-4 border-l border-slate-100 text-[14px] ${r.cap ? "capitalize" : ""} ${r.strong ? "font-heading font-extrabold text-[#0B6B4F] text-[16px]" : "text-[#1A2E25]"} ${cheapest === v.id ? "bg-emerald-50/40" : ""}`}>
                      {r.get(v)}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="border-t border-slate-100">
                <td className="sticky left-0 z-10 bg-white p-4" />
                {items.map((v) => (
                  <td key={v.id} className={`p-4 border-l border-slate-100 ${cheapest === v.id ? "bg-emerald-50/40" : ""}`}>
                    <Button onClick={() => navigate(`/apply/${v.id}`)} data-testid={`compare-apply-${v.id}`}
                      className="w-full rounded-full bg-[#0B6B4F] hover:bg-[#095B43] text-white text-[13px] h-9">Apply</Button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{items.map((v) => <VehicleCard key={v.id} v={v} />)}</div>
      )}
    </main>
  );
}
