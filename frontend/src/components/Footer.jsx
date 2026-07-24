import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

const cols = [
  { h: "Drivers", links: [["Search vehicles", "/"], ["How renting works", "/driver-guide"], ["Cost calculator", "/calculator"], ["Create an account", "/register"]] },
  { h: "Operators", links: [["List your fleet", "/list-your-fleet"], ["Operator guide", "/operator-guide"], ["Dashboard preview", "/operator-dashboard"]] },
  { h: "Company", links: [["Why choose Caro", "/why-caro"], ["Get help", "/help"], ["Legal & privacy", "/legal"]] },
];

export default function Footer() {
  return (
    <footer className="bg-[#12211B] text-white mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="caro-wordmark text-3xl">caro<span className="text-[#10B981]">.</span></div>
            <p className="text-sm text-white/60 mt-3 max-w-xs">London's marketplace for private hire vehicle rental. Vetted operators, transparent pricing, cover built in.</p>
            <div className="mt-4 inline-flex items-center gap-2 text-xs text-[#10B981] bg-white/5 px-3 py-1.5 rounded-full"><ShieldCheck className="w-4 h-4" /> Verified against TfL & Companies House</div>
          </div>
          {cols.map((c) => (
            <div key={c.h}>
              <h4 className="text-sm font-semibold mb-4">{c.h}</h4>
              <ul className="space-y-2 text-sm text-white/60">
                {c.links.map(([label, to]) => (<li key={label}><Link to={to} className="hover:text-white transition-colors">{label}</Link></li>))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row justify-between gap-3 text-xs text-white/40">
          <span>© 2026 Caro. Launching across Greater London.</span>
          <span>Instagram · Facebook · TikTok</span>
        </div>
      </div>
    </footer>
  );
}
