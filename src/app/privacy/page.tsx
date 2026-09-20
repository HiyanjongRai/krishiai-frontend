import { Navbar } from "@/components/shared/layout/navbar";
import { Footer } from "@/components/shared/layout/footer";

const sections = [
  {
    title: "Information We Collect",
    body: "KrishiAI collects account details, profile information, uploaded crop images, farm and crop records, consultation activity, expert verification materials, and technical information needed to operate and secure the platform.",
  },
  {
    title: "How We Use Information",
    body: "We use information to provide crop advisory features, manage consultations, verify experts, maintain account security, improve platform reliability, and support users who request help.",
  },
  {
    title: "Expert Verification Data",
    body: "Professional credentials, licenses, identity documents, and experience details are used for verification and administrative review. These materials are not shown publicly unless a verified expert profile intentionally exposes approved profile information.",
  },
  {
    title: "Data Sharing",
    body: "KrishiAI does not sell personal information. Data may be shared with service providers that help operate hosting, media storage, analytics, authentication, and support systems, subject to appropriate safeguards.",
  },
  {
    title: "Security",
    body: "We use access controls, authentication, encrypted transport, and operational safeguards to protect user information. No online service can guarantee absolute security, so users should keep account credentials private.",
  },
  {
    title: "Your Choices",
    body: "Users can update profile information, manage uploaded profile photos, and request support for account or data questions through the platform contact channels.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F8FAF8] text-[#1F2937]">
      <Navbar />
      <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-[0_12px_34px_-28px_#E5E7EB] sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#2E7D32]">KrishiAI policy</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#1F2937]">Privacy Policy</h1>
          <p className="mt-3 text-sm leading-6 text-[#4B5563]">
            This policy explains how KrishiAI handles information for farmers, experts, and administrators using the platform.
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
            Last updated: September 13, 2026. For privacy questions, contact the KrishiAI support team through the contact page.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
