import { useNavigate } from "react-router-dom";
import { Heart, Star, ShieldCheck, Wrench, Users, Fuel } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { trackEvent } from "@/lib/api";

export default function VehicleCard({ v }) {
  const navigate = useNavigate();
  const { saved, toggleSaved } = useAuth();
  const isSaved = saved.includes(v.id);

  const open = () => {
    trackEvent("card_click", { listing_id: v.id });
    navigate(`/vehicle/${v.id}`);
  };

  return (
    <div data-testid={`vehicle-card-${v.id}`} onClick={open}
      className="group cursor-pointer bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-400 hover:shadow-sm transition-all">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#F3F1EC]">
        <img src={v.photos[0]} alt={`${v.make} ${v.model}`} loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        {v.breakdown_included && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-white/95 px-2.5 py-1 rounded-full">
            <Wrench className="w-3 h-3" /> Breakdown cover
          </span>
        )}
        <button data-testid={`save-btn-${v.id}`}
          onClick={(e) => { e.stopPropagation(); toggleSaved(v.id); }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 flex items-center justify-center hover:bg-white transition-colors">
          <Heart className={`w-4 h-4 ${isSaved ? "fill-[#DC2626] text-[#DC2626]" : "text-[#475569]"}`} />
        </button>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-heading font-bold text-[#1A2E25] leading-tight">{v.make} {v.model} <span className="text-[#64748B] font-medium">{v.year}</span></h3>
          <div className="text-right shrink-0">
            <div className="text-xl font-heading font-extrabold text-[#1A2E25]">£{v.weekly_rent}</div>
            <div className="text-xs text-[#64748B] -mt-0.5">/week</div>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-2 text-xs text-[#64748B]">
          <span className="inline-flex items-center gap-1 capitalize"><Fuel className="w-3 h-3" />{v.fuel}</span>
          <span className="inline-flex items-center gap-1"><Users className="w-3 h-3" />{v.seats} seats</span>
          <span>{v.borough}</span>
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
            <ShieldCheck className="w-3 h-3" /> {v.operator_code}
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#1A2E25]">
            <Star className="w-3.5 h-3.5 fill-[#D97706] text-[#D97706]" /> {v.operator_rating}
          </span>
        </div>
      </div>
    </div>
  );
}
