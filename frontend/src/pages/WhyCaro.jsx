import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IMG } from "@/lib/images";

const driverPoints = [
  { t: "You know the number before you commit", d: "Rent, insurance and breakdown are added up for you on every car. What you see is what leaves your account each week." },
  { t: "Insured for the work you actually do", d: "A normal policy will not cover private hire. Every quote we show is proper hire and reward cover, so you are never caught out." },
  { t: "Your money is not sitting with a stranger", d: "You pay Caro, not an unknown yard. Your deposit is held safely and comes back once the return photos are agreed." },
  { t: "One point of contact when things go wrong", d: "Breakdown, bump, or a parking ticket. You report it from your account and we help sort it, instead of leaving you on hold." },
];
const operatorPoints = [
  { t: "Drivers who are already checked", d: "Everyone who applies has been through background and licence checks. You approve the ones you like and skip the time wasters." },
  { t: "Rent that turns up on time", d: "Payments run through us and land in your account every fortnight. If a driver defaults, we cover the rent for up to two weeks." },
  { t: "Your paperwork in one place", d: "MOT, tax, insurance and PHV licence dates for the whole fleet, with a nudge before anything runs out. No more spreadsheet." },
  { t: "Evidence instead of arguments", d: "Timestamped handover photos at pickup and return mean any deposit deduction is backed by proof, not a shouting match." },
];

export default function WhyCaro() {
  const navigate = useNavigate();
  return (
    <main>
      <section className="relative overflow-hidden">
        <img src={IMG.driverSuit} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0E1A14]/95 via-[#0E1A14]/82 to-[#0E1A14]/55" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <p className="text-[13px] font-medium text-[#5FD3A6] tracking-[0.12em] uppercase">Why Caro</p>
          <h1 className="text-4xl sm:text-6xl font-heading font-extrabold text-white mt-3 max-w-3xl leading-[1.03] text-balance">Renting a private hire car should not feel like a risk.</h1>
          <p className="text-white/75 mt-5 text-[18px] max-w-2xl leading-relaxed">Drivers hand over real money before they have even seen the car. Operators hand over their livelihood. We built Caro so both sides can relax a little.</p>
        </div>
      </section>

      {/* Drivers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="rounded-[26px] overflow-hidden aspect-[4/3] shadow-lg order-1"><img src={IMG.happyDriver} alt="Driver" className="w-full h-full object-cover" /></div>
          <div className="order-2">
            <p className="text-[13px] font-medium text-[#0B6B4F] tracking-[0.12em] uppercase">If you are a driver</p>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#1A2E25] mt-2 text-balance">Get on the road with your eyes open.</h2>
            <div className="mt-7 space-y-6">
              {driverPoints.map((p, i) => (
                <motion.div key={p.t} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }} className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-[#0B6B4F] text-white flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3.5 h-3.5" /></div>
                  <div><h3 className="font-heading font-bold text-[#1A2E25]">{p.t}</h3><p className="text-[15px] text-[#4A564F] mt-1 leading-relaxed">{p.d}</p></div>
                </motion.div>
              ))}
            </div>
            <Button onClick={() => navigate("/")} className="mt-8 rounded-full bg-[#0B6B4F] hover:bg-[#095B43] text-white">Browse cars <ArrowRight className="w-4 h-4 ml-2" /></Button>
          </div>
        </div>
      </section>

      {/* Operators */}
      <section className="bg-[#12211B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <p className="text-[13px] font-medium text-[#5FD3A6] tracking-[0.12em] uppercase">If you run a fleet</p>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mt-2 text-balance">Fewer empty cars, fewer headaches.</h2>
              <div className="mt-7 space-y-6">
                {operatorPoints.map((p, i) => (
                  <motion.div key={p.t} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }} className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-[#5FD3A6] text-[#0E1A14] flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3.5 h-3.5" /></div>
                    <div><h3 className="font-heading font-bold text-white">{p.t}</h3><p className="text-[15px] text-white/70 mt-1 leading-relaxed">{p.d}</p></div>
                  </motion.div>
                ))}
              </div>
              <Button onClick={() => navigate("/list-your-fleet")} className="mt-8 rounded-full bg-white text-[#12211B] hover:bg-[#F1EFE9] font-semibold">List your fleet <ArrowRight className="w-4 h-4 ml-2" /></Button>
            </div>
            <div className="rounded-[26px] overflow-hidden aspect-[4/3] shadow-lg"><img src={IMG.fleetLot} alt="Fleet" className="w-full h-full object-cover" /></div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-[#F1EFE9] rounded-[26px] p-8 sm:p-14 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div><h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#1A2E25] text-balance">Not sure what it would cost you?</h2><p className="text-[#4A564F] mt-2 text-[15px]">Work out your real weekly cost and take home pay in under a minute.</p></div>
          <Button onClick={() => navigate("/calculator")} className="rounded-full bg-[#0B6B4F] hover:bg-[#095B43] text-white font-semibold shrink-0">Try the calculator <ArrowRight className="w-4 h-4 ml-2" /></Button>
        </div>
      </section>
    </main>
  );
}
