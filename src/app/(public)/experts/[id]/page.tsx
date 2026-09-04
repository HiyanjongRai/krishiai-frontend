import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ExpertDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-16 space-y-6">
        <div className="space-y-2">
          <Link href="/experts" className="text-xs text-emerald-700 hover:underline">← Back to Experts</Link>
          <h1 className="text-3xl font-extrabold text-slate-900">Expert Consultation</h1>
          <p className="text-sm text-slate-500">Expert Profile #{id}</p>
        </div>
        <div className="p-6 rounded-3xl border border-slate-200 bg-white space-y-4">
          <h3 className="font-bold text-slate-900 text-lg">Book a Consultation</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Get personalized assistance and diagnostic reviews for your specific crops and diseases directly from verified agricultural scientists.
          </p>
          <Button>Schedule Consultation</Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
