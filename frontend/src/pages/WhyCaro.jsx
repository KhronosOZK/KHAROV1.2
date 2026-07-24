import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, Wrench, Eye, Scale, HandCoins, Headphones, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IMG } from "@/lib/images";

const reasons = [
  { i: ShieldCheck, t: "Vetted operators only", d: "Every rental company is checked against TfL's operator register and Companies House before a single car goes live. No fly-by-night operators." },
  { i: Eye, t: "Total price transparency", d: "The full weekly cost — rent, insurance and breakdown — is shown up front on every listing. No deposits vanishing, no surprises at handover." },
  { i: Wrench, t: "Insurance & cover built in", d: "Proper hire-and-reward cover via Quotezone at checkout, breakdown options, and one point of contact when something goes wrong." },
  { i: HandCoins, t: "Your money is protected", d: "You pay Caro, not a stranger. Deposits are ring-fenced and only released against agreed, timestamped handover photos." },
  { i: Scale, t: "Evidence, not disputes", d: "Timestamped photo handovers at pickup and return mean deposit deductions are backed by proof — not one person's word against another." },
  { i: Headphones, t: "Real support", d: "Accidents, breakdowns, PCNs — report it from your portal and we help coordinate. You're never left chasing a WhatsApp number." },
];

export default function WhyCaro() {
  const navigate = useNavigate();
  return (
    <main>
      <section className="relative overflow-hidden">
        <img src={IMG.driverSuit} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#12211B]/95 via-[#12211B]/80 to-[#12211B]/50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <span className="text-xs font-semibold text-[#10B981] uppercase tracking-wide">Why Caro</span>
          <h1 className="text-4xl sm:text-6xl font-heading font-extrabold text-white mt-3 max-w-3xl leading-[1.02]">Renting a PHV car shouldn't be a gamble.</h1>
          <p className="text-white/80 mt-5 text-lg max-w-2xl leading-relaxed">Drivers hand over money before they've seen the car. We built Caro so that trust is designed in — not hoped for.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((r, i) => (
            <motion.div key={r.t} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="bg-white border border-slate-200 rounded-2xl p-6">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 flex items-center justify-center"><r.i className="w-6 h-6 text-[#047857]" /></div>
              <h3 className="font-heading font-bold text-lg text-[#1A2E25] mt-4">{r.t}</h3>
              <p className="text-sm text-[#475569] mt-2 leading-relaxed">{r.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="bg-[#1A2E25] rounded-3xl p-8 sm:p-14 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div><h2 className="text-2xl sm:text-3xl font-heading font-bold text-white">See what it costs you.</h2><p className="text-white/70 mt-2">Use the calculator to work out your true weekly cost before you apply.</p></div>
          <div className="flex gap-3">
            <Button onClick={() => navigate("/calculator")} className="rounded-full bg-[#10B981] hover:bg-[#047857] text-white font-semibold">Cost calculator <ArrowRight className="w-4 h-4 ml-2" /></Button>
            <Button onClick={() => navigate("/")} variant="outline" className="rounded-full border-white/40 text-white bg-transparent hover:bg-white/10 hover:text-white">Browse cars</Button>
          </div>
        </div>
      </section>
    </main>
  );
}
