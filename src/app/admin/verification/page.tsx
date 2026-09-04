import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { VerificationCard } from "@/components/admin/verification-card";

export default function AdminVerificationPage() {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <h1 className="text-2xl font-black text-slate-900">Expert Verification Queue</h1>
        <VerificationCard name="Dr. Bimal Adhikari" credential="PhD in Plant Pathology, Tribhuvan University" />
      </div>
    </DashboardLayout>
  );
}
