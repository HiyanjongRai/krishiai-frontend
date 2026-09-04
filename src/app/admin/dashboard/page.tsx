import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatsCard } from "@/components/admin/stats-card";

export default function AdminDashboard() {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <h1 className="text-2xl font-black text-slate-900">System Administration</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total Farmers" count="1,420" change="+12% this month" />
          <StatsCard title="Verified Experts" count="48" change="+3 pending" />
          <StatsCard title="Total AI Scans" count="18,340" />
          <StatsCard title="Platform Accuracy" count="94.2%" />
        </div>
      </div>
    </DashboardLayout>
  );
}
