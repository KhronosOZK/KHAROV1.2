import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1A2E25] text-white mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="caro-wordmark text-3xl">caro<span className="text-[#10B981]">.</span></div>
            <p className="text-sm text-white/60 mt-3 max-w-xs">
              London's marketplace for private hire vehicle rental. Vetted operators, transparent pricing, cover built in.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 text-xs text-[#10B981] bg-white/5 px-3 py-1.5 rounded-full">
              <ShieldCheck className="w-4 h-4" /> Operators verified against TfL & Companies House
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4">Drivers</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link to="/" className="hover:text-white transition-colors">Search vehicles</Link></li>
              <li><Link to="/driver-guide" className="hover:text-white transition-colors">How renting works</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Create an account</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4">Operators</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link to="/list-your-fleet" className="hover:text-white transition-colors">List your fleet</Link></li>
              <li><Link to="/operator-guide" className="hover:text-white transition-colors">Operator guide</Link></li>
              <li><Link to="/operator-dashboard" className="hover:text-white transition-colors">Dashboard preview</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link to="/driver-guide" className="hover:text-white transition-colors">About</Link></li>
              <li><a href="mailto:hello@caro.co.uk" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row justify-between gap-3 text-xs text-white/40">
          <span>© 2026 Caro. Launching across Greater London.</span>
          <span>Instagram · Facebook · TikTok</span>
        </div>
      </div>
    </footer>
  );
}
