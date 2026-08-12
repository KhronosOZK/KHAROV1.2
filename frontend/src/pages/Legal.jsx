const sections = [
  { t: "About Kharo", b: "Kharo is a marketplace connecting London private hire vehicle (PHV) drivers with vetted, TfL-licensed rental companies. Kharo operates the marketplace, matching, and payment flow, and orchestrates specialist partners for insurance, claims and support. Kharo is not an insurer and does not provide credit." },
  { t: "How your data is used", b: "We collect the details you provide (name, contact details, licence and driving information) to verify your eligibility, generate insurance quotes, and match you to vehicles. Your data is used only to operate the service and, where you've agreed, to keep you informed about launch and relevant offers. We never sell your personal data to third parties." },
  { t: "Insurance", b: "Insurance quotes are provided for comparison via Quotezone. Standard personal motor policies exclude hire and reward. Any policy you take must properly cover private hire use. Kharo facilitates quotes and payment but the insurance contract is between you and the insurer." },
  { t: "Payments & deposits", b: "All payments are processed through Kharo. Deposits are held securely and released after return, subject to the agreed handover condition record. Going around the platform to pay an operator directly may void cover and protections." },
  { t: "Operator verification", b: "Rental companies are checked against the TfL operator register and Companies House before listing. Operator identity is disclosed to a driver once their application is approved." },
  { t: "Your rights (UK GDPR)", b: "You can request access to, correction of, or deletion of your personal data at any time by contacting privacy@kharo.uk. Where processing is based on consent, you can withdraw it at any time in your account settings." },
  { t: "Cookies", b: "We use essential cookies to keep you signed in and to remember your preferences, and limited analytics to understand how the marketplace is used. You can control non-essential cookies in your browser." },
];

export default function Legal() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-[#1A2E25]">Legal & privacy</h1>
      <p className="text-[#64748B] mt-3">Last updated 17 June 2026. This is a plain-English summary for our pre-launch validation platform, not a substitute for the full terms available at go-live.</p>

      <div className="mt-10 space-y-8">
        {sections.map((s) => (
          <section key={s.t}>
            <h2 className="text-xl font-heading font-bold text-[#1A2E25]">{s.t}</h2>
            <p className="text-[#475569] mt-2 leading-relaxed">{s.b}</p>
          </section>
        ))}
      </div>

      <div className="mt-10 bg-white border border-slate-200 rounded-2xl p-6 text-sm text-[#64748B]">
        Questions about your data? Email <a href="mailto:privacy@kharo.uk" className="text-[#0B6B4F] font-semibold">privacy@kharo.uk</a>.
      </div>
    </main>
  );
}
