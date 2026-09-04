import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { CropCard } from "@/components/farmer/crop-card";
import { sampleCrops } from "@/data/crops";

export default function FarmerCropsPage() {
  return (
    <DashboardLayout role="farmer">
      <div className="space-y-6">
        <h1 className="text-2xl font-black text-slate-900">My Crops</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {sampleCrops.map((c) => (
            <CropCard key={c.id} name={c.name} variety={c.variety} stage={c.growthStage} health={c.healthStatus} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
