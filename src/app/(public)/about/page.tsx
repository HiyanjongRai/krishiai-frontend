import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-16 space-y-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">About KrishiAI</h1>
        <p className="text-slate-600 leading-relaxed">
          KrishiAI is an AI-powered agricultural advisory platform designed to bridge the gap between smallholder farmers, cutting-edge artificial intelligence, and verified agricultural professionals.
        </p>
      </main>
      <Footer />
    </div>
  );
}
