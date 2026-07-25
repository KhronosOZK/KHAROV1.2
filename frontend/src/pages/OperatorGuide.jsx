import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IMG } from "@/lib/images";

const perks = [
  { t: "10% flat", d: "Taken from the rental company side before your fortnightly payout. No listing fees, no setup costs." },
  { t: "Two weeks covered", d: "If a driver stops paying, we cover the rent for up to a fortnight while you sort out a replacement." },
  { t: "Checked drivers", d: "Everyone who applies has been through background and licence checks before they reach you." },
];

const steps = [
  { n: "01", t: "Register your interest", d: "Before we go live near you, tell us about your fleet and leave a contact. We will reach out when onboarding opens in your area.", img: IMG.handshake },
  { n: "02", t: "Get verified", d: "We check your Companies House record and TfL operator licence against the public register before anything goes live. It is the same badge of trust your drivers will see.", img: IMG.signingLaptop },
  { n: "03", t: "List your cars", d: "Add each vehicle with photos, weekly rent, what is included and any conditions. Pause or edit a listing whenever you like from your dashboard.", img: IMG.showroom },
  { n: "04", t: "Pick your drivers", d: "Vetted drivers apply to your listings. You see their experience and rating up front, then approve or decline from one queue.", img: IMG.driverMirror },
  { n: "05", t: "Hand over with proof", d: "A quick photo handover at pickup protects you if a car comes back damaged, and the same happens at return, so any deduction is backed by evidence.", img: IMG.keysWoman },
  { n: "06", t: "Get paid on time", d: "Payouts run every fortnight, minus the 10% fee. The rent guarantee has your back if a driver defaults.", img: IMG.executive },
  { n: "07", t: "Stay on top of the paperwork", d: "MOT, tax, insurance and PHV licence dates for the whole fleet in one view, with a heads up before anything lapses.", img: IMG.interior },
];

export default function OperatorGuide() {
  const navigate = useNavigate();
  return (
    <main>
      <section className="relative overflow-hidden">
        <img src={IMG.rowCars} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0E1A14]/95 via-[#0E1A14]/82 to-[#0E1A14]/50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <p className="text-[13px] font-medium text-[#5FD3A6] tracking-[0.12em] uppercase">For rental companies</p>
          <h1 className="text-4xl sm:text-6xl font-heading font-extrabold text-white mt-3 max-w-3xl leading-[1.03] text-balance">Fill your fleet with drivers worth having.</h1>
          <p className="text-white/75 mt-5 text-[18px] max-w-2xl leading-relaxed">Put the spreadsheets and the WhatsApp groups away. List once, get matched with vetted drivers, and get paid when you should.</p>
          <Button onClick={() => navigate("/list-your-fleet")} className="mt-8 rounded-full bg-white text-[#1A2E25] hover:bg-[#F1EFE9] font-semibold">Register your interest <ArrowRight className="w-4 h-4 ml-2" /></Button>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-10 relative z-10">
        <div className="grid sm:grid-cols-3 gap-4">
          {perks.map((p) => (
            <div key={p.t} className="bg-white rounded-2xl p-6 ring-1 ring-slate-200/70 shadow-sm">
              <div className="font-heading font-extrabold text-[#0B6B4F] text-2xl">{p.t}</div>
              <p className="text-[14px] text-[#4A564F] mt-2 leading-relaxed">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {steps.map((s, i) => (
          <motion.section key={s.n} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.55 }}
            className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-center py-10 sm:py-14 ${i % 2 ? "lg:[direction:rtl]" : ""}`}>
            <div className="lg:[direction:ltr]">
              <span className="text-[15px] font-heading font-bold text-[#0B6B4F] tracking-widest">{s.n}</span>
              <h2 className="text-3xl sm:text-[40px] font-heading font-bold text-[#1A2E25] mt-3 leading-tight text-balance">{s.t}</h2>
              <p className="text-[#4A564F] mt-4 text-[17px] leading-relaxed">{s.d}</p>
            </div>
            <div className="lg:[direction:ltr]"><div className="rounded-[26px] overflow-hidden shadow-lg aspect-[4/3]"><img src={s.img} alt={s.t} className="w-full h-full object-cover" /></div></div>
          </motion.section>
        ))}
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-[#0E1A14] rounded-[26px] p-7 sm:p-12 text-white">
          <p className="text-[13px] font-medium text-[#5FD3A6] tracking-[0.12em] uppercase">Your earning potential</p>
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-end mt-2">
            <div>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-balance">See what your fleet could bring in.</h2>
              <p className="text-white/70 mt-3 text-[16px] leading-relaxed">Real figures based on typical London weekly rates at 85% utilisation, before our flat 10% fee. Register to get a full breakdown for your exact fleet.</p>
            </div>
            <div className="rounded-2xl bg-white/[0.06] ring-1 ring-white/10 p-6">
              <div className="text-[12px] text-white/55 uppercase tracking-wide">A well run car earns up to</div>
              <div className="text-[44px] sm:text-6xl font-heading font-extrabold text-[#5FD3A6] leading-none mt-2">£14,586<span className="text-lg font-normal text-white/55"> / year</span></div>
              <div className="text-[13px] text-white/60 mt-2">Executive vehicles, at £330 a week and typical utilisation.</div>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-8">
            {[["Hybrid saloon", 255], ["Executive", 330], ["Electric", 235], ["Wheelchair accessible", 255]].map(([label, wk]) => {
              const perYear = Math.round(wk * 52 * 0.85);
              return (
                <div key={label} className="bg-white/5 rounded-2xl p-5 ring-1 ring-white/10">
                  <div className="text-[13px] text-white/60">{label}</div>
                  <div className="text-2xl font-heading font-extrabold text-[#5FD3A6] mt-2">£{perYear.toLocaleString()}</div>
                  <div className="text-[12px] text-white/50 mt-1">per car, per year · £{wk}/wk</div>
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-4">
            {[5, 15, 30].map((n) => (
              <div key={n} className="flex items-center justify-between bg-white/5 rounded-2xl p-5 ring-1 ring-white/10">
                <span className="text-white/70">{n} car fleet</span>
                <span className="text-xl font-heading font-extrabold text-white">£{(255 * 52 * 0.85 * n).toLocaleString()}<span className="text-[12px] text-white/50 font-normal">/yr</span></span>
              </div>
            ))}
          </div>
          <Button onClick={() => navigate("/list-your-fleet")} className="mt-8 rounded-full bg-[#5FD3A6] hover:bg-white text-[#0E1A14] font-semibold">Register to see your full breakdown <ArrowRight className="w-4 h-4 ml-2" /></Button>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 pt-6">
        <div className="relative rounded-[26px] overflow-hidden p-8 sm:p-16 text-center">
          <img src={IMG.handshakeDesk} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#0A130F]/85" />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white text-balance">Get your fleet ready for launch.</h2>
            <p className="text-white/70 mt-3 max-w-xl mx-auto text-[16px]">Register your interest and take a look at the dashboard you will run everything from.</p>
            <div className="flex gap-3 justify-center mt-7 flex-wrap">
              <Button onClick={() => navigate("/list-your-fleet")} className="rounded-full bg-[#5FD3A6] hover:bg-[#0B6B4F] text-[#0E1A14] hover:text-white font-semibold">Register interest</Button>
              <Button onClick={() => navigate("/operator-dashboard")} variant="outline" className="rounded-full border-white/40 text-white bg-transparent hover:bg-white/10 hover:text-white">Preview the dashboard</Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
