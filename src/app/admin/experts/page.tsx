import { ExpertTable } from "@/components/admin/expert-table";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

export default function AdminExpertsPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        greeting="Verified Expert Directory"
        subtitle="Browse certified agricultural specialists, agronomists, and consultants across all crop domains."
      />
      <ExpertTable />
    </div>
  );
}
