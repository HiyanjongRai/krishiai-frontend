import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function ExpertConsultationsPage() {
  return (
    <DashboardLayout role="expert">
      <div className="space-y-6">
        <h1 className="text-2xl font-black text-slate-900">Assigned Consultations</h1>
      </div>
    </DashboardLayout>
  );
}
