import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const steps = [
  { t: "Register your interest", d: "Before Caro is live in your area, tell us about your fleet — size, boroughs, and a contact. We'll reach out when onboarding opens near you." },
  { t: "Get verified", d: "We check your Companies House registration and TfL operator licence against the public register before any listing goes live — the same check drivers see in Caro's Trust & Risk tooling." },
  { t: "List your fleet", d: "Add each vehicle with photos, weekly rent, what's included (breakdown cover, servicing) and any conditions. Listings can be paused or edited any time from your dashboard." },
  { t: "Review driver applications", d: "Vetted, background-checked drivers apply directly to your listings. Approve or decline from your Applications queue, with each driver's experience and rating shown up front." },
  { t: "Handover", d: "A documented photo handover at pickup protects you if a vehicle comes back damaged. The same happens in reverse at return, so deposit deductions are backed by evidence, not a dispute." },
  { t: "Get paid", d: "Payouts run fortnightly, net of Caro's 10% handling fee. If a driver defaults, Caro's rent guarantee covers up to two weeks while you find a replacement driver." },
  { t: "Manage compliance", d: "MOT, road tax, insurance and PHV licence renewal dates for your whole fleet are tracked in one place, with alerts before anything lapses — no more spreadsheet." },
  { t: "Handle returns & disputes", d: "If there's a disagreement over a deposit deduction, both handover photo sets are there as evidence, and Caro's Trust & Risk team can help mediate." },
];

const perks = [
  { t: "10% flat fee", d: "Deducted before your fortnightly payout. No listing fees, no hidden costs." },
  { t: "2-week rent guarantee", d: "We cover the rent if a driver defaults while you arrange a replacement." },
  { t: "Vetted drivers only", d: "Every applicant is background-checked and insured through the platform." },
];

export default function OperatorGuide() {
  const navigate = useNavigate();
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <span className="text-xs font-semibold text-[#047857]">Operator guide</span>
      <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-[#1A2E25] mt-2">How listing your fleet on Caro works</h1>
      <p className="text-[#475569] mt-3 leading-relaxed">From registering your interest to getting paid — here's how rental companies use the platform.</p>

      <div className="grid sm:grid-cols-3 gap-4 mt-8">
        {perks.map((p) => (
          <div key={p.t} className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="font-heading font-bold text-[#047857] text-lg">{p.t}</div>
            <p className="text-sm text-[#475569] mt-1.5">{p.d}</p>
          </div>
        ))}
      </div>

      <Accordion type="single" collapsible className="mt-8" defaultValue="item-0">
        {steps.map((s, i) => (
          <AccordionItem key={i} value={`item-${i}`} className="border border-slate-200 rounded-xl mb-3 px-4 bg-white">
            <AccordionTrigger className="hover:no-underline" data-testid={`op-guide-step-${i}`}>
              <span className="flex items-center gap-3 text-left">
                <span className="w-7 h-7 rounded-full bg-[#1A2E25] text-white text-sm font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                <span className="font-heading font-bold text-[#1A2E25]">{s.t}</span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-[#475569] leading-relaxed pl-10">{s.d}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="mt-10 bg-[#1A2E25] rounded-2xl p-6 text-center">
        <h2 className="font-heading font-bold text-xl text-white">Get your fleet ready for launch</h2>
        <p className="text-white/70 text-sm mt-2">Register your interest and see the operator dashboard in action.</p>
        <div className="flex gap-3 justify-center mt-4 flex-wrap">
          <Button onClick={() => navigate("/list-your-fleet")} className="rounded-full bg-white text-[#1A2E25] hover:bg-[#F3F1EC]">Register interest</Button>
          <Button onClick={() => navigate("/operator-dashboard")} variant="outline" className="rounded-full border-white/30 text-white hover:bg-white/10 hover:text-white bg-transparent">View dashboard preview</Button>
        </div>
      </div>
    </main>
  );
}
