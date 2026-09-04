import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";

export default async function KnowledgeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-16 space-y-6">
        <Link href="/knowledge" className="text-xs text-emerald-700 hover:underline">← Back to Knowledge Base</Link>
        <h1 className="text-3xl font-extrabold text-slate-900 capitalize">{slug.replace(/-/g, ' ')}</h1>
        <p className="text-slate-600 text-sm leading-relaxed">
          Detailed agronomic advice and grounded AI insights compiled from verified agricultural guidelines.
        </p>
      </main>
      <Footer />
    </div>
  );
}
