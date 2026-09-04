import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function FarmerProfilePage() {
  return (
    <DashboardLayout role="farmer">
      <div className="space-y-6">
        <h1 className="text-2xl font-black text-slate-900">Farmer Profile</h1>
        <p className="text-xs text-slate-500">Manage your contact details, farm locations, and preferences.</p>
      </div>
    </DashboardLayout>
  );
}
