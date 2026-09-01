import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ArrowRight, Columns3, X } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import VehicleCard from "@/components/VehicleCard";
import CompareTable from "@/components/CompareTable";
import { Button } from "@/components/ui/button";

export default function Saved() {
  const { saved, toggleSaved } = useAuth();
  const navigate = useNavigate();
  const [all, setAll] = useState([]);
  const [compare, setCompare] = useState(false);

  useEffect(() => { api.get("/listings").then((r) => setAll(r.data)); }, []);
  const items = all.filter((v) => saved.includes(v.id));

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
        <CompareTable items={items} onRemove={toggleSaved} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{items.map((v) => <VehicleCard key={v.id} v={v} />)}</div>
      )}
    </main>
  );
}
