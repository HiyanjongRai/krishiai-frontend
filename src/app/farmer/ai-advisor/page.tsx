import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function FarmerAdvisorPage() {
  return (
    <DashboardLayout role="farmer">
      <div className="space-y-6">
        <h1 className="text-2xl font-black text-slate-900">Agricultural AI Advisor</h1>
        <div className="p-6 rounded-3xl bg-white border border-slate-200">
          <p className="text-xs text-slate-500">Ask questions about weather, soil nutrients, pest identification, and cultivation practices.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
