import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MessageCircle, Mail, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const faqs = [
  { q: "How much does it cost to use Caro?", a: "It's free for drivers to browse and apply. You pay the weekly rent, insurance and any add-ons shown on the listing. Caro takes a 10% handling fee from the rental company's side, never from you." },
  { q: "Why are the rental company names hidden?", a: "Operator names and contact details are only revealed once your application is approved. This keeps early enquiries within Caro and protects both sides during the matching process." },
  { q: "Is the insurance proper hire-and-reward cover?", a: "Yes. Standard personal policies exclude private hire work. Every quote we show via Quotezone is proper hire-and-reward cover, so you're never unknowingly uninsured." },
  { q: "When do I pay, and how?", a: "Nothing is charged until you've been approved and signed your digital rental agreement. All payments go through Caro, you never pay an operator directly by bank transfer." },
  { q: "What happens if the car breaks down?", a: "If the listing includes breakdown cover, 24/7 roadside assistance is included. If not, you can add cover for £8/week at checkout, or you're responsible for getting the car to the designated garage." },
  { q: "What is the deposit and when do I get it back?", a: "The deposit is held securely and released after return, once both sets of timestamped handover photos are compared and agreed, typically within a few working days, minus any agreed deductions." },
  { q: "How quickly will I hear back after applying?", a: "Most drivers get a first response within 24 hours. You'll be notified in-app and by email the moment the operator reviews your application." },
  { q: "I'm a rental company, how do I list my fleet?", a: "Caro is onboarding its first operators now. Register your interest and we'll reach out before we go live in your area to get you verified and listed." },
];

export default function Help() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const filtered = faqs.filter((f) => (f.q + f.a).toLowerCase().includes(q.toLowerCase()));

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-[#1A2E25]">How can we help?</h1>
        <p className="text-[#475569] mt-3">Answers to the questions drivers and operators ask most.</p>
        <div className="relative max-w-xl mx-auto mt-6">
          <Search className="w-5 h-5 text-[#94A3B8] absolute left-4 top-1/2 -translate-y-1/2" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search help articles…" className="pl-11 h-12 rounded-full bg-white" data-testid="help-search" />
        </div>
      </div>

      <Accordion type="single" collapsible className="mt-10">
        {filtered.map((f, i) => (
          <AccordionItem key={f.q} value={`f-${i}`} className="border border-slate-200 rounded-2xl mb-3 px-5 bg-white">
            <AccordionTrigger className="hover:no-underline font-heading font-bold text-[#1A2E25] text-left" data-testid={`faq-${i}`}>{f.q}</AccordionTrigger>
            <AccordionContent className="text-[#475569] leading-relaxed">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
        {filtered.length === 0 && <div className="text-center text-[#64748B] py-10">No articles match "{q}". Try a different search.</div>}
      </Accordion>

      <div className="mt-10 bg-[#1A2E25] rounded-3xl p-8 text-center text-white">
        <MessageCircle className="w-8 h-8 text-[#10B981] mx-auto" />
        <h2 className="text-2xl font-heading font-bold mt-3">Still need a hand?</h2>
        <p className="text-white/70 mt-2">Our team is here 7 days a week.</p>
        <div className="flex flex-wrap gap-3 justify-center mt-6">
          <a href="mailto:hello@caro.co.uk"><Button className="rounded-full bg-[#10B981] hover:bg-[#047857] text-white"><Mail className="w-4 h-4 mr-2" /> hello@caro.co.uk</Button></a>
          <Button onClick={() => navigate("/list-your-fleet")} variant="outline" className="rounded-full border-white/40 text-white bg-transparent hover:bg-white/10 hover:text-white"><Phone className="w-4 h-4 mr-2" /> I'm an operator</Button>
        </div>
      </div>
    </main>
  );
}
