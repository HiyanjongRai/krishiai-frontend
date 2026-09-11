import { VerificationQueue } from "@/components/admin/verification-card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

export default async function DynamicAdminVerificationPage({
  params,
}: {
  params: Promise<{ status: string }>;
}) {
  const { status } = await params;
  const lower = status?.toLowerCase() || "pending";

  let initialStatus: "PENDING" | "UNDER_REVIEW" | "REJECTED" | "ALL" = "PENDING";
  let greeting = "Pending Expert Verifications";
  let subtitle = "Assess newly submitted candidate credentials, degrees, and accreditations awaiting verification.";

  if (lower === "review" || lower === "under-review") {
    initialStatus = "UNDER_REVIEW";
    greeting = "In-Depth Verification Review";
    subtitle = "Active evaluation of specialist qualifications, verification documents, and claimed crop domains.";
  } else if (lower === "rejected") {
    initialStatus = "REJECTED";
    greeting = "Rejected Expert Applications";
    subtitle = "Audit declined applications, examine historical reviewer feedback, or re-open candidate cases.";
  } else if (lower === "all") {
    initialStatus = "ALL";
    greeting = "Expert Verification Pipeline";
    subtitle = "Comprehensive directory of candidate applications across all review stages.";
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader greeting={greeting} subtitle={subtitle} />
      <VerificationQueue initialStatus={initialStatus} />
    </div>
  );
}
