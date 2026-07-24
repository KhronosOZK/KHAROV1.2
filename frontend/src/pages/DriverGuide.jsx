import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const steps = [
  { t: "Search & compare", d: "Filter by borough, vehicle type, fuel and budget. Every listing shows the full weekly cost up front — rent, insurance and breakdown cover — so nothing is sprung on you later." },
  { t: "Get your insurance sorted", d: "Sign up once with your licence and driving history. We pull quotes from multiple insurers for proper hire-and-reward cover, auto-select the cheapest fully comprehensive option, and you can switch any time before you apply." },
  { t: "Submit your application", d: "A short four-step application — personal details, licence, insurance, review. Your ID and insurance profile are reused automatically, so you only ever enter them once across every listing." },
  { t: "Get accepted", d: "The rental company reviews your application and runs a background check. Most drivers hear back within 24 hours — you'll get a notification the moment there's an update." },
  { t: "Sign your agreement", d: "Once approved, you sign a digital rental agreement. Nothing is charged until this is signed, and the agreement is always available in your driver portal." },
  { t: "Pick up your car", d: "You and the operator complete a documented handover — photos from all four angles, timestamped. This protects you both if there's ever a dispute about the car's condition later." },
  { t: "Weekly rent payments", d: "Rent is collected weekly on the day agreed. Your driver portal shows exactly what's been paid, what's due next, and a running history — no chasing paper receipts." },
  { t: "While you're driving", d: "Report any issue or accident directly from your driver portal. Breakdown cover and roadside assistance are included, and servicing is scheduled by the operator at your designated garage." },
  { t: "Returning the car", d: "Book a return slot, and the same photo handover happens in reverse. Your deposit is released once both sets of photos are compared and agreed — typically within a few working days." },
  { t: "Renewing or switching", d: "Nearing the end of your rental? Compare fresh insurance quotes for your next term, extend with the same operator, or search again — your saved profile carries over either way." },
];

export default function DriverGuide() {
  const navigate = useNavigate();
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <span className="text-xs font-semibold text-[#047857]">Driver guide</span>
      <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-[#1A2E25] mt-2">How renting a car with Caro works</h1>
      <p className="text-[#475569] mt-3 leading-relaxed">From your first search to handing the keys back — here's the whole journey, step by step.</p>

      <Accordion type="single" collapsible className="mt-8" defaultValue="item-0">
        {steps.map((s, i) => (
          <AccordionItem key={i} value={`item-${i}`} className="border border-slate-200 rounded-xl mb-3 px-4 bg-white">
            <AccordionTrigger className="hover:no-underline" data-testid={`guide-step-${i}`}>
              <span className="flex items-center gap-3 text-left">
                <span className="w-7 h-7 rounded-full bg-[#047857] text-white text-sm font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                <span className="font-heading font-bold text-[#1A2E25]">{s.t}</span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-[#475569] leading-relaxed pl-10">{s.d}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="mt-10 bg-[#F3F1EC] rounded-2xl p-6 text-center">
        <h2 className="font-heading font-bold text-xl text-[#1A2E25]">Ready to find your car?</h2>
        <Button onClick={() => navigate("/")} className="mt-4 rounded-full bg-[#047857] hover:bg-[#065F46] text-white">Browse vehicles</Button>
      </div>
    </main>
  );
}
