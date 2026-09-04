import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function FarmerConsultationsPage() {
  return (
    <DashboardLayout role="farmer">
      <div className="space-y-6">
        <h1 className="text-2xl font-black text-slate-900">Expert Consultations</h1>
        <p className="text-xs text-slate-500">Manage your scheduled and completed consultations with verified agronomists.</p>
      </div>
    </DashboardLayout>
  );
}
