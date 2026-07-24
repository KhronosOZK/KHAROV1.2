import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Search, ShieldCheck, FileSignature, Camera, Car, RefreshCw, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IMG } from "@/lib/images";

const steps = [
  { n: "01", icon: Search, t: "Search & compare", d: "Filter by borough, vehicle type, fuel and budget. Every listing shows the full weekly cost up front — rent, insurance and breakdown cover — so there's nothing sprung on you later.", img: IMG.phoneInCar },
  { n: "02", icon: ShieldCheck, t: "Get your insurance sorted", d: "Sign up once with your licence and driving history. We pull quotes from multiple insurers for proper hire-and-reward cover, auto-select the cheapest fully comprehensive option, and you can switch it any time before you apply.", img: IMG.signingCouple },
  { n: "03", icon: FileSignature, t: "Apply & get accepted", d: "A short four-step application — personal details, licence, insurance, review. Your ID and insurance profile are reused automatically. The operator reviews and runs a background check. Most drivers hear back within 24 hours.", img: IMG.signingLaptop },
  { n: "04", icon: Camera, t: "Documented handover", d: "You and the operator complete a photo handover — all four angles, timestamped. This protects you both if there's ever a dispute about the car's condition later. Nothing is charged until your digital agreement is signed.", img: IMG.keysHandover },
  { n: "05", icon: Car, t: "Drive & earn", d: "Report any issue or accident directly from your driver portal. Breakdown cover and roadside assistance are included, and servicing is scheduled by the operator at your designated garage.", img: IMG.happyDriver },
  { n: "06", icon: RefreshCw, t: "Return or renew", d: "Book a return slot and the same photo handover happens in reverse. Your deposit is released once both photo sets are agreed. Nearing the end? Compare fresh quotes and extend, all with your saved profile.", img: IMG.driverSuit },
];

export default function DriverGuide() {
  const navigate = useNavigate();
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <img src={IMG.happyDriver} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#12211B]/95 via-[#12211B]/80 to-[#12211B]/50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <span className="text-xs font-semibold text-[#10B981] uppercase tracking-wide">For drivers</span>
          <h1 className="text-4xl sm:text-6xl font-heading font-extrabold text-white mt-3 max-w-3xl leading-[1.02]">From first search to keys in hand.</h1>
          <p className="text-white/80 mt-5 text-lg max-w-2xl leading-relaxed">Here's the whole journey of renting a PHV car with Caro — transparent, insured, and built around drivers who need to earn.</p>
          <Button onClick={() => navigate("/")} className="mt-8 rounded-full bg-white text-[#1A2E25] hover:bg-[#F3F1EC] font-semibold">Browse cars <ArrowRight className="w-4 h-4 ml-2" /></Button>
        </div>
      </section>

      {/* Steps */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
        {steps.map((s, i) => (
          <motion.section key={s.n} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.55 }}
            className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-center py-10 sm:py-16 ${i % 2 ? "lg:[direction:rtl]" : ""}`}>
            <div className="lg:[direction:ltr]">
              <div className="flex items-center gap-3">
                <span className="text-5xl font-heading font-extrabold text-[#E2E8F0]">{s.n}</span>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center"><s.icon className="w-6 h-6 text-[#047857]" /></div>
              </div>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#1A2E25] mt-4">{s.t}</h2>
              <p className="text-[#475569] mt-4 text-lg leading-relaxed">{s.d}</p>
            </div>
            <div className="lg:[direction:ltr]">
              <div className="rounded-3xl overflow-hidden shadow-lg aspect-[4/3]">
                <img src={s.img} alt={s.t} className="w-full h-full object-cover" />
              </div>
            </div>
          </motion.section>
        ))}
      </div>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="bg-[#1A2E25] rounded-3xl p-8 sm:p-14 text-center grain">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white">Ready to find your car?</h2>
          <p className="text-white/70 mt-3 max-w-xl mx-auto">Create an account in about a minute — then browse and apply to any vehicle with your details reused everywhere.</p>
          <div className="flex gap-3 justify-center mt-7 flex-wrap">
            <Button onClick={() => navigate("/")} className="rounded-full bg-[#10B981] hover:bg-[#047857] text-white font-semibold">Browse vehicles</Button>
            <Button onClick={() => navigate("/register")} variant="outline" className="rounded-full border-white/40 text-white bg-transparent hover:bg-white/10 hover:text-white">Create account</Button>
          </div>
        </div>
      </section>
    </main>
  );
}
