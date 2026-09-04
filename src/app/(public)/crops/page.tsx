import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { sampleCrops } from "@/data/crops";
import { CropCard } from "@/components/farmer/crop-card";

export default function CropsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto px-4 py-16 space-y-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Supported Crops</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {sampleCrops.map((c) => (
            <CropCard key={c.id} name={c.name} variety={c.variety} stage={c.growthStage} health={c.healthStatus} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
