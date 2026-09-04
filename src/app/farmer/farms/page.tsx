import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { FarmCard } from "@/components/farmer/farm-card";

export default function FarmerFarmsPage() {
  return (
    <DashboardLayout role="farmer">
      <div className="space-y-6">
        <h1 className="text-2xl font-black text-slate-900">My Farms</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FarmCard name="Green Valley Terraces" location="Kavrepalanchok" area={2.4} cropsCount={4} />
          <FarmCard name="Hillside Organic Plot" location="Nuwakot" area={1.8} cropsCount={2} />
        </div>
      </div>
    </DashboardLayout>
  );
}
