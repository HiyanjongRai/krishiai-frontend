import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";
import { Card } from "@/components/ui/card";

export default function KnowledgeBasePage() {
  const articles = [
    { slug: "early-blight-management", title: "Managing Early Blight in Tomato Crops", category: "Disease Control" },
    { slug: "monsoon-irrigation-tips", title: "Monsoon Season Irrigation and Drainage", category: "Water Management" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-16 space-y-8">
        <h1 className="text-3xl font-extrabold text-[#1F2937]">Agricultural Knowledge Base</h1>
        <div className="space-y-4">
          {articles.map((a) => (
            <Link key={a.slug} href={`/knowledge/${a.slug}`}>
              <Card className="hover:border-[#A5D6A7]">
                <span className="text-[11px] font-bold text-[#2E7D32] uppercase">{a.category}</span>
                <h3 className="text-base font-bold text-[#1F2937] mt-1">{a.title}</h3>
              </Card>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
