import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ClipboardList, BadgeCheck, Car, Users, Camera, Banknote, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IMG } from "@/lib/images";

const perks = [
  { t: "10% flat fee", d: "Deducted before your fortnightly payout. No listing fees, no hidden costs." },
  { t: "2-week rent guarantee", d: "We cover the rent if a driver defaults while you arrange a replacement." },
  { t: "Vetted drivers only", d: "Every applicant is background-checked and insured through the platform." },
];

const steps = [
  { n: "01", icon: ClipboardList, t: "Register your interest", d: "Before Caro is live in your area, tell us about your fleet — size, boroughs and a contact. We'll reach out when onboarding opens near you.", img: IMG.handshake },
  { n: "02", icon: BadgeCheck, t: "Get verified", d: "We check your Companies House registration and TfL operator licence against the public register before any listing goes live — the same trust checks drivers see.", img: IMG.signingLaptop },
  { n: "03", icon: Car, t: "List your fleet", d: "Add each vehicle with photos, weekly rent, what's included and any conditions. Pause or edit any listing any time from your dashboard.", img: IMG.fleetLot },
  { n: "04", icon: Users, t: "Review applications", d: "Vetted, background-checked drivers apply directly. Approve or decline from your queue, with each driver's experience and rating up front.", img: IMG.phoneInCar },
  { n: "05", icon: Camera, t: "Handover with evidence", d: "A documented photo handover at pickup protects you if a car comes back damaged — the same in reverse at return, so deductions are backed by evidence.", img: IMG.keysHandover },
  { n: "06", icon: Banknote, t: "Get paid fortnightly", d: "Payouts run fortnightly, net of Caro's 10% fee. If a driver defaults, our rent guarantee covers up to two weeks while you find a replacement.", img: IMG.executive },
  { n: "07", icon: CalendarClock, t: "Compliance handled", d: "MOT, road tax, insurance and PHV licence renewal dates for your whole fleet in one place, with alerts before anything lapses. No more spreadsheet.", img: IMG.interior },
];

export default function OperatorGuide() {
  const navigate = useNavigate();
  return (
    <main>
      <section className="relative overflow-hidden">
        <img src={IMG.fleetAerial} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#12211B]/95 via-[#12211B]/80 to-[#12211B]/50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <span className="text-xs font-semibold text-[#10B981] uppercase tracking-wide">For rental companies</span>
          <h1 className="text-4xl sm:text-6xl font-heading font-extrabold text-white mt-3 max-w-3xl leading-[1.02]">Fill your fleet with vetted drivers.</h1>
          <p className="text-white/80 mt-5 text-lg max-w-2xl leading-relaxed">Replace the spreadsheets and WhatsApp chaos. List once, get matched with background-checked drivers, and get paid on time — every time.</p>
          <Button onClick={() => navigate("/list-your-fleet")} className="mt-8 rounded-full bg-white text-[#1A2E25] hover:bg-[#F3F1EC] font-semibold">Register your interest <ArrowRight className="w-4 h-4 ml-2" /></Button>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-10 relative z-10">
        <div className="grid sm:grid-cols-3 gap-4">
          {perks.map((p) => (
            <div key={p.t} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="font-heading font-extrabold text-[#047857] text-2xl">{p.t}</div>
              <p className="text-sm text-[#475569] mt-2">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-14">
        {steps.map((s, i) => (
          <motion.section key={s.n} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.55 }}
            className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-center py-10 sm:py-14 ${i % 2 ? "lg:[direction:rtl]" : ""}`}>
            <div className="lg:[direction:ltr]">
              <div className="flex items-center gap-3">
                <span className="text-5xl font-heading font-extrabold text-[#E2E8F0]">{s.n}</span>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center"><s.icon className="w-6 h-6 text-[#047857]" /></div>
              </div>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#1A2E25] mt-4">{s.t}</h2>
              <p className="text-[#475569] mt-4 text-lg leading-relaxed">{s.d}</p>
            </div>
            <div className="lg:[direction:ltr]"><div className="rounded-3xl overflow-hidden shadow-lg aspect-[4/3]"><img src={s.img} alt={s.t} className="w-full h-full object-cover" /></div></div>
          </motion.section>
        ))}
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="bg-[#1A2E25] rounded-3xl p-8 sm:p-14 text-center">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white">Get your fleet ready for launch</h2>
          <p className="text-white/70 mt-3 max-w-xl mx-auto">Register your interest and preview the operator dashboard you'll manage everything from.</p>
          <div className="flex gap-3 justify-center mt-7 flex-wrap">
            <Button onClick={() => navigate("/list-your-fleet")} className="rounded-full bg-[#10B981] hover:bg-[#047857] text-white font-semibold">Register interest</Button>
            <Button onClick={() => navigate("/operator-dashboard")} variant="outline" className="rounded-full border-white/40 text-white bg-transparent hover:bg-white/10 hover:text-white">View dashboard preview</Button>
          </div>
        </div>
      </section>
    </main>
  );
}
