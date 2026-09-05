import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { VerificationQueue } from "@/components/admin/verification-card";

export default function AdminVerificationPage() {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Expert Verification Queue</h1>
          <p className="text-sm text-slate-500 mt-1">
            Review, approve, or reject expert applications submitted for verification.
          </p>
        </div>
        <VerificationQueue />
      </div>
    </DashboardLayout>
  );
}
