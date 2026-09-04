import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { sampleDiseases } from "@/data/diseases";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DiseasesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto px-4 py-16 space-y-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Crop Disease Knowledge Base</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sampleDiseases.map((d) => (
            <Card key={d.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">{d.name}</h3>
                <Badge variant={d.severity === "HIGH" ? "danger" : "warning"}>{d.severity} Severity</Badge>
              </div>
              <p className="text-xs italic text-slate-500">{d.scientificName}</p>
              <p className="text-xs text-slate-600 font-semibold">Symptoms:</p>
              <ul className="text-xs text-slate-500 list-disc list-inside space-y-0.5">
                {d.symptoms.map((s, idx) => <li key={idx}>{s}</li>)}
              </ul>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
