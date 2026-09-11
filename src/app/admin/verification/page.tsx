import { VerificationQueue } from "@/components/admin/verification-card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

export default function AdminVerificationPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        greeting="Expert Verification Pipeline"
        subtitle="Review, audit, and authorize agricultural credentials submitted by specialist candidates."
      />
      <VerificationQueue />
    </div>
  );
}
