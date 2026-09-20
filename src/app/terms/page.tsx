import { Navbar } from "@/components/shared/layout/navbar";
import { Footer } from "@/components/shared/layout/footer";

const sections = [
  {
    title: "Use of the Platform",
    body: "KrishiAI provides agricultural information, crop analysis workflows, expert consultation features, and administration tools. Users must provide accurate information and use the platform lawfully.",
  },
  {
    title: "Agricultural Advice",
    body: "AI-assisted insights and expert responses support decision-making but do not replace local agronomic assessment, laboratory testing, or professional judgment for high-risk crop or business decisions.",
  },
  {
    title: "Accounts and Security",
    body: "Users are responsible for maintaining the confidentiality of login credentials and for activity under their account. KrishiAI may restrict accounts that violate platform rules or create security risk.",
  },
  {
    title: "Expert Responsibilities",
    body: "Experts must submit truthful credentials, maintain professional conduct, and provide guidance within their verified expertise. KrishiAI may review, approve, reject, suspend, or request updates to expert profiles.",
  },
  {
    title: "Uploaded Content",
    body: "Users retain responsibility for the images, documents, messages, and records they upload. Uploaded content must not violate privacy, intellectual property, or applicable law.",
  },
  {
    title: "Service Availability",
    body: "KrishiAI aims to keep the platform reliable, but features may be unavailable during maintenance, technical issues, or third-party service interruptions.",
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAF8] text-[#1F2937]">
      <Navbar />
      <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-[0_12px_34px_-28px_#E5E7EB] sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#2E7D32]">KrishiAI terms</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#1F2937]">Terms and Conditions</h1>
          <p className="mt-3 text-sm leading-6 text-[#4B5563]">
            These terms describe the basic rules for using KrishiAI as a farmer, expert, administrator, or visitor.
          </p>

          <div className="mt-8 space-y-6">
            {sections.map((section) => (
              <section key={section.title} className="border-t border-[#EEF0EE] pt-5">
                <h2 className="text-base font-semibold text-[#1F2937]">{section.title}</h2>
                <p className="mt-2 text-sm leading-6 text-[#4B5563]">{section.body}</p>
              </section>
            ))}
          </div>

          <p className="mt-8 rounded-xl border border-[#E5E7EB] bg-[#F8FAF8] p-4 text-xs leading-5 text-[#6B7280]">
            Last updated: September 13, 2026. Continued use of KrishiAI means you agree to these terms.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
