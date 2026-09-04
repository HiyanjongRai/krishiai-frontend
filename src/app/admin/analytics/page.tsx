import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AnalyticsCard } from "@/components/admin/analytics-card";

export default function AdminAnalyticsPage() {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <h1 className="text-2xl font-black text-slate-900">Platform Analytics</h1>
        <AnalyticsCard title="AI Diagnostics Distribution" summary="Tomato (42%), Potato (31%), Rice (18%), Others (9%)" />
      </div>
    </DashboardLayout>
  );
}
