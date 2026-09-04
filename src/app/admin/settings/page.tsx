import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function AdminSettingsPage() {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <h1 className="text-2xl font-black text-slate-900">System Settings</h1>
      </div>
    </DashboardLayout>
  );
}
