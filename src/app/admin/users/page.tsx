import { UserTable } from "@/components/admin/user-table";

export default function AdminUsersPage() {
  return (
    <div>
      <div className="space-y-6">
        <h1 className="text-2xl font-black text-slate-900">User Management</h1>
        <UserTable />
      </div>
    </div>
  );
}
