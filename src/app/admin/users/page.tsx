import { UserTable } from "@/components/admin/user-table";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        greeting="Farmers Community & Directory"
        subtitle="Manage registered cultivators, track farm locations, crop allocations, and AI diagnostic activity."
      />
      <UserTable />
    </div>
  );
}
