import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
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
      className="group cursor-pointer bg-white rounded-2xl overflow-hidden ring-1 ring-slate-200/70 hover:ring-slate-300 hover:shadow-[0_12px_40px_-12px_rgba(20,33,27,0.25)] transition-all duration-300">
      <div className="relative aspect-[16/11] overflow-hidden bg-[#EFEDE8]">
        <img src={v.photos[0]} alt={`${v.make} ${v.model}`} loading="lazy"
          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-[600ms]" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/25 to-transparent" />
        <button data-testid={`save-btn-${v.id}`}
          onClick={(e) => { e.stopPropagation(); toggleSaved(v.id); }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/85 backdrop-blur flex items-center justify-center hover:bg-white transition-colors">
          <Heart className={`w-[18px] h-[18px] ${isSaved ? "fill-[#B4472E] text-[#B4472E]" : "text-[#3B4A44]"}`} />
        </button>
        <span className="absolute bottom-3 left-3 text-[13px] font-medium text-white/95 tracking-wide">
          {v.borough}
        </span>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-heading font-bold text-[17px] text-[#1A2E25] leading-snug truncate">{v.make} {v.model}</h3>
            <p className="text-[13px] text-[#7A857F] mt-0.5 capitalize">{v.year} · {v.fuel} · {v.seats} seats</p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-[22px] font-heading font-extrabold text-[#1A2E25] leading-none">£{v.weekly_rent}</div>
            <div className="text-[12px] text-[#7A857F] mt-1">per week</div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-[13px]">
          <span className="text-[#3B4A44]">
            {v.operator_rentals} rentals completed
          </span>
          <span className="flex items-center gap-1.5 text-[#1A2E25] font-medium">
            <span className="text-[#C08A2D] text-[15px] leading-none">★</span> {v.operator_rating}
          </span>
        </div>
        <p className="mt-2 text-[12.5px] text-[#7A857F]">
          {v.breakdown_included ? "Breakdown cover and servicing included" : "Insurance and cover available at checkout"}
        </p>
      </div>
    </div>
  );
}
