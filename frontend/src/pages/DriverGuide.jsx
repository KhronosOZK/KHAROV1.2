import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IMG } from "@/lib/images";

const steps = [
  { n: "01", t: "Have a proper look", d: "Filter by borough, type of car, fuel and what you can afford each week. The price on every card already includes insurance and breakdown, so you are comparing like for like from the start.", img: IMG.phoneInCar },
  { n: "02", t: "Sort your insurance once", d: "You give us your licence and driving history a single time. We connect you to specialist hire-and-reward cover through Quotezone, and reuse your details so you never fill the same form twice.", img: IMG.signingCouple },
  { n: "03", t: "Apply and get the nod", d: "The application is short and your details fill themselves in. The rental company reviews it and runs a background check. Most drivers hear back inside a day.", img: IMG.signingLaptop },
  { n: "04", t: "Check the car over together", d: "At launch, you and the operator take photos from every angle before you drive off. Both sides get a timestamped record, so if anything comes up later there is proof rather than a disagreement.", img: IMG.keysWoman },
  { n: "05", t: "Get out there and earn", d: "Anything crops up — a warning light, a bump, a parking ticket — you let us know and we point you to the right person. Breakdown cover and servicing are already handled.", img: IMG.driverNight },
  { n: "06", t: "Hand back or carry on", d: "Book a return slot and do the same quick photo check in reverse. Your deposit comes back once both sets match. Want to keep going? Compare fresh quotes and extend with your details already saved.", img: IMG.vintageDriver },
];

export default function DriverGuide() {
  const navigate = useNavigate();
  return (
    <main>
      <section className="relative overflow-hidden">
        <img src={IMG.taxiDriver} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0E1A14]/95 via-[#0E1A14]/82 to-[#0E1A14]/50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28 [text-shadow:0_2px_16px_rgba(0,0,0,0.45)]">
          <p className="text-[13px] font-medium text-[#5FD3A6] tracking-[0.12em] uppercase">For drivers</p>
          <h1 className="text-4xl sm:text-6xl font-heading font-extrabold text-white mt-3 max-w-3xl leading-[1.03] text-balance">From first look to keys in your hand.</h1>
          <p className="text-white/75 mt-5 text-[18px] max-w-2xl leading-relaxed">Here is the whole thing, start to finish, in plain English. No small print surprises.</p>
          <Button onClick={() => navigate("/")} className="mt-8 rounded-full bg-white text-[#1A2E25] hover:bg-[#F1EFE9] font-semibold">Browse cars <ArrowRight className="w-4 h-4 ml-2" /></Button>
        </div>
      </section>

      {steps.map((s, i) => {
        const dark = i % 2 === 1;
        return (
          <section key={s.n} className={dark ? "bg-[#0E1A14]" : "bg-[#F9F8F6]"}>
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.55 }}
              className={`max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-8 lg:gap-16 items-center py-12 sm:py-20 ${i % 2 ? "lg:[direction:rtl]" : ""}`}>
              <div className="lg:[direction:ltr]">
                <span className={`text-[15px] font-heading font-bold tracking-widest ${dark ? "text-[#5FD3A6]" : "text-[#0B6B4F]"}`}>{s.n}</span>
                <h2 className={`text-3xl sm:text-[40px] font-heading font-bold mt-3 leading-tight text-balance ${dark ? "text-white" : "text-[#1A2E25]"}`}>{s.t}</h2>
                <p className={`mt-4 text-[17px] leading-relaxed ${dark ? "text-white/70" : "text-[#4A564F]"}`}>{s.d}</p>
              </div>
              <div className="lg:[direction:ltr]"><div className="rounded-[26px] overflow-hidden shadow-lg aspect-[4/3]"><img src={s.img} alt={s.t} className="w-full h-full object-cover" /></div></div>
            </motion.div>
          </section>
        );
      })}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="relative rounded-[26px] overflow-hidden p-8 sm:p-16 text-center">
          <img src={IMG.happyDriver} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#0A130F]/82" />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white text-balance">Ready when you are.</h2>
            <p className="text-white/75 mt-3 max-w-xl mx-auto text-[16px]">Set up your account in about a minute, then browse and apply with your details already in place. No deposit until you are approved.</p>
            <div className="flex gap-3 justify-center mt-7 flex-wrap">
              <Button onClick={() => navigate("/register")} className="rounded-full bg-[#5FD3A6] hover:bg-[#0B6B4F] text-[#0E1A14] hover:text-white font-semibold">Create your free account <ArrowRight className="w-4 h-4 ml-2" /></Button>
              <button onClick={() => navigate("/")} className="text-white/80 hover:text-white text-[14px] font-medium underline underline-offset-4">Browse cars first</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
