import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Check, Wallet, ShieldCheck, MapPin, Wrench, BadgeCheck, Navigation, Clock, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IMG } from "@/lib/images";

const benefits = [
  { icon: Wallet, t: "One honest weekly figure", d: "Rent, insurance and breakdown cover added up on every car. What you see is what leaves your account each week, before you ever commit." },
  { icon: ShieldCheck, t: "Insured for the work you do", d: "A normal policy won't cover private hire. We connect you to proper hire-and-reward cover through Quotezone, and reuse your details so you never fill the same form twice." },
  { icon: BadgeCheck, t: "Operators we've checked", d: "Every rental company on Kharo is vetted before a single car goes live. No unknown yards, no fake landlords on WhatsApp." },
  { icon: Navigation, t: "Every rental is GPS-tracked", d: "The live location of each vehicle is tracked throughout the rental, so both you and the operator are protected if anything is ever disputed." },
  { icon: Wrench, t: "Cover built in", d: "Breakdown cover and servicing are handled on most cars, so a flat battery or a warning light doesn't cost you a day's work." },
  { icon: MapPin, t: "Cars across five cities", d: "Browse vetted vehicles in London, Birmingham, Manchester, Leeds and Sheffield, with more cities opening as we grow." },
];

const steps = [
  { n: "01", t: "Have a proper look", d: "Filter by city, car type, fuel and the weekly budget that works for you. Every price already includes insurance and cover, so you compare like for like." },
  { n: "02", t: "Sort your insurance once", d: "Give us your licence and driving history a single time. We connect you to specialist private hire cover and reuse your details on every car after that." },
  { n: "03", t: "Apply in minutes", d: "Your saved profile fills the form for you. Apply to any car and usually hear back from the operator within 24 hours." },
  { n: "04", t: "Agree and drive", d: "Agree the rental terms, do a quick photo walkround at handover, and the keys are yours. Then get out there and earn." },
];

const requirements = [
  "A valid TfL / PCO private hire driver licence (or one in progress)",
  "A full UK or exchangeable driving licence, held 12 months or more",
  "You are 21 or over, which most operators require for insurance",
  "The right to work and drive for private hire in the UK",
];

export default function ForDrivers() {
  const navigate = useNavigate();
  return (
    <main className="bg-[#F9F8F6]">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <img src={IMG.happyDriver} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0E1A14]/92 via-[#0E1A14]/58 to-[#0E1A14]/15" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0E1A14]/60 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <p className="text-[13px] font-medium text-[#5FD3A6] tracking-wide">For drivers</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-white mt-3 max-w-3xl leading-[1.03] text-balance">
            The right car for the week, no hidden costs.
          </h1>
          <p className="text-white/75 mt-4 text-[17px] max-w-xl leading-relaxed">
            Rent from vetted London operators. One honest weekly price, nothing to pay until you're approved.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button onClick={() => navigate("/")} data-testid="fd-browse" className="rounded-full bg-[#5FD3A6] hover:bg-white text-[#0E1A14] font-semibold h-11 px-6">Browse cars <ArrowRight className="w-4 h-4 ml-2" /></Button>
            <Button onClick={() => navigate("/register")} data-testid="fd-register" variant="outline" className="rounded-full border-white/40 text-white bg-transparent hover:bg-white/10 hover:text-white h-11 px-6">Register your interest</Button>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[["Free", "to browse and apply"], ["Under 24h", "to hear back after you apply"], ["One price", "rent, insurance and cover"], ["5 cities", "and growing"]].map(([n, l]) => (
            <div key={n} className="text-center md:text-left">
              <div className="text-2xl sm:text-3xl font-heading font-extrabold text-[#1A2E25]">{n}</div>
              <div className="text-[13px] text-[#4A564F] mt-1">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Why drivers choose Kharo */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <p className="text-[13px] font-medium text-[#0B6B4F] tracking-wide">Why drivers choose Kharo</p>
        <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#1A2E25] mt-2 max-w-2xl text-balance">Everything you need to rent with your eyes open.</h2>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {benefits.map((b, i) => (
            <motion.div key={b.t} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="bg-white rounded-[24px] ring-1 ring-slate-200/70 p-6 shadow-sm">
              <div className="w-11 h-11 rounded-2xl bg-[#0B6B4F]/[0.08] flex items-center justify-center"><b.icon className="w-5 h-5 text-[#0B6B4F]" strokeWidth={1.7} /></div>
              <h3 className="font-heading font-bold text-[#1A2E25] mt-4 text-[17px]">{b.t}</h3>
              <p className="text-[14.5px] text-[#4A564F] mt-2 leading-relaxed">{b.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Earnings teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-4">
        <div className="rounded-[26px] overflow-hidden bg-[#0E1A14] text-white grid lg:grid-cols-2">
          <div className="p-8 sm:p-12">
            <p className="text-[13px] font-medium text-[#5FD3A6] tracking-wide">See what a week could pay</p>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold mt-3 leading-tight text-balance">Pick a car and watch the numbers add up.</h2>
            <p className="text-white/70 mt-4 text-[15px] leading-relaxed max-w-md">
              Our take-home estimator shows typical weekly fares against the all-in car cost and fuel, so you know what a full-time week could really put in your pocket before you sign up.
            </p>
            <Button onClick={() => navigate("/register")} className="mt-7 rounded-full bg-[#5FD3A6] hover:bg-white text-[#0E1A14] font-semibold h-11 px-6">Estimate my take-home <ArrowRight className="w-4 h-4 ml-2" /></Button>
          </div>
          <div className="min-h-[240px] lg:min-h-0"><img src={IMG.driverNight} alt="Private hire driver at night" className="w-full h-full object-cover" /></div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-[13px] font-medium text-[#0B6B4F] tracking-wide">How renting works</p>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#1A2E25] mt-2 text-balance">From first look to keys in your hand.</h2>
          </div>
          <button onClick={() => navigate("/driver-guide")} className="text-[#0B6B4F] font-semibold text-[15px] inline-flex items-center gap-1.5 hover:gap-2.5 transition-all self-start sm:self-auto">See the full guide <ArrowRight className="w-4 h-4" /></button>
        </div>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s, i) => (
            <motion.div key={s.n} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="bg-white rounded-[24px] ring-1 ring-slate-200/70 p-6 shadow-sm">
              <span className="font-heading font-extrabold text-[#0B6B4F]/25 text-3xl">{s.n}</span>
              <h3 className="font-heading font-bold text-[#1A2E25] mt-3 text-[17px]">{s.t}</h3>
              <p className="text-[14px] text-[#4A564F] mt-2 leading-relaxed">{s.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Requirements */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="rounded-[26px] overflow-hidden aspect-[4/3] shadow-lg"><img src={IMG.keysWoman} alt="Driver collecting keys" className="w-full h-full object-cover" /></div>
          <div>
            <p className="text-[13px] font-medium text-[#0B6B4F] tracking-wide">What you'll need</p>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#1A2E25] mt-2 text-balance">Ready to rent? Here's the checklist.</h2>
            <p className="text-[15px] text-[#4A564F] mt-3 leading-relaxed">You can browse and register with none of this to hand. You'll only need these to complete a rental.</p>
            <ul className="mt-6 space-y-4">
              {requirements.map((r) => (
                <li key={r} className="flex gap-3"><div className="w-6 h-6 rounded-full bg-[#0B6B4F] text-white flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3.5 h-3.5" /></div><span className="text-[15px] text-[#1A2E25] leading-relaxed">{r}</span></li>
              ))}
            </ul>
            <div className="mt-7 flex flex-wrap gap-4 text-[13px] text-[#4A564F]">
              <span className="inline-flex items-center gap-2"><Clock className="w-4 h-4 text-[#0B6B4F]" /> Most drivers are approved within a day</span>
              <span className="inline-flex items-center gap-2"><FileCheck className="w-4 h-4 text-[#0B6B4F]" /> Details reused across every application</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="bg-[#F1EFE9] rounded-[26px] p-8 sm:p-14 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div><h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#1A2E25] text-balance">Find your car this week.</h2><p className="text-[#4A564F] mt-2 text-[15px]">Vetted cars in four UK cities, with insurance and cover already in the price.</p></div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Button onClick={() => navigate("/")} className="rounded-full bg-[#0B6B4F] hover:bg-[#095B43] text-white font-semibold">Browse cars <ArrowRight className="w-4 h-4 ml-2" /></Button>
            <Button onClick={() => navigate("/register")} variant="outline" className="rounded-full border-[#1A2E25]/20 text-[#1A2E25]">Create account</Button>
          </div>
        </div>
      </section>
    </main>
  );
}
