import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function AdminCropsPage() {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <h1 className="text-2xl font-black text-slate-900">Crop Taxonomy</h1>
      </div>
    </DashboardLayout>
  );
}
