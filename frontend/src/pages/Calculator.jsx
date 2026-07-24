import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator as CalcIcon, Info } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Calculator() {
  const navigate = useNavigate();
  const [rent, setRent] = useState([250]);
  const [experience, setExperience] = useState([3]);
  const [breakdown, setBreakdown] = useState(true);
  const [fuel, setFuel] = useState([180]); // weekly fuel/charging spend
  const [earnings, setEarnings] = useState([900]); // weekly gross earnings

  const insurance = Math.max(34, 55 - Math.min(experience[0], 8) * 1.6);
  const breakdownCost = breakdown ? 8 : 0;
  const weekly = rent[0] + insurance + breakdownCost;
  const monthly = weekly * 4.33;
  const totalOutgoings = weekly + fuel[0];
  const netWeekly = earnings[0] - totalOutgoings;

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-emerald-50 flex items-center justify-center"><CalcIcon className="w-6 h-6 text-[#047857]" /></div>
        <div><h1 className="text-3xl font-heading font-extrabold text-[#1A2E25]">Rental cost calculator</h1><p className="text-[#64748B]">Work out your true weekly cost and take-home before you apply.</p></div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-7">
          <Control label="Weekly rent" value={`£${rent[0]}`}><Slider min={180} max={400} step={5} value={rent} onValueChange={setRent} data-testid="calc-rent" /></Control>
          <Control label="Years of driving experience" value={`${experience[0]} yr`}><Slider min={0} max={12} step={1} value={experience} onValueChange={setExperience} data-testid="calc-exp" /></Control>
          <Control label="Weekly fuel / charging spend" value={`£${fuel[0]}`}><Slider min={40} max={350} step={10} value={fuel} onValueChange={setFuel} /></Control>
          <Control label="Your expected weekly earnings" value={`£${earnings[0]}`}><Slider min={400} max={2000} step={50} value={earnings} onValueChange={setEarnings} /></Control>
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm font-medium text-[#1A2E25]">Include breakdown cover (£8/wk)</span>
            <Switch checked={breakdown} onCheckedChange={setBreakdown} data-testid="calc-breakdown" />
          </div>
        </div>

        <motion.div layout className="bg-[#1A2E25] text-white rounded-3xl p-6 sm:p-8">
          <h2 className="font-heading font-bold text-lg text-white/90">Your estimated costs</h2>
          <div className="mt-5 space-y-3 text-sm">
            <Line l="Weekly rent" v={`£${rent[0].toFixed(2)}`} />
            <Line l="Insurance (est.)" v={`£${insurance.toFixed(2)}`} />
            <Line l="Breakdown cover" v={breakdown ? "£8.00" : "£0.00"} />
            <div className="border-t border-white/10 pt-3 flex justify-between text-lg"><span className="font-semibold">Rental cost / week</span><span className="font-heading font-extrabold text-[#10B981]">£{weekly.toFixed(2)}</span></div>
            <div className="flex justify-between text-white/60 text-xs"><span>Rental cost / month (≈)</span><span>£{monthly.toFixed(0)}</span></div>
          </div>

          <div className="mt-6 bg-white/5 rounded-2xl p-4">
            <div className="text-xs text-white/60">Estimated take-home after rental + fuel</div>
            <div className={`text-3xl font-heading font-extrabold mt-1 ${netWeekly >= 0 ? "text-[#10B981]" : "text-red-400"}`} data-testid="calc-net">£{netWeekly.toFixed(0)}<span className="text-sm font-normal text-white/50">/week</span></div>
            <div className="text-xs text-white/50 mt-1">≈ £{(netWeekly * 4.33).toFixed(0)}/month before tax</div>
          </div>

          <div className="flex items-start gap-2 mt-5 text-xs text-white/50"><Info className="w-4 h-4 shrink-0 mt-0.5" /> Estimates only. Insurance is illustrative (real quotes via Quotezone at checkout). Earnings and fuel vary by hours worked and vehicle.</div>
          <Button onClick={() => navigate("/")} className="w-full mt-5 rounded-full bg-[#10B981] hover:bg-[#047857] text-white font-semibold">Find cars in your budget</Button>
        </motion.div>
      </div>
    </main>
  );
}

const Control = ({ label, value, children }) => (
  <div>
    <div className="flex justify-between mb-3"><span className="text-sm font-medium text-[#1A2E25]">{label}</span><span className="text-sm font-heading font-bold text-[#047857]">{value}</span></div>
    <div className="px-1">{children}</div>
  </div>
);
const Line = ({ l, v }) => (<div className="flex justify-between"><span className="text-white/60">{l}</span><span className="font-semibold">{v}</span></div>);
