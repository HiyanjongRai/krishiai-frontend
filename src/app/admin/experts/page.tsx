import { ExpertTable } from "@/components/admin/expert-table";

export default function AdminExpertsPage() {
  return (
    <div>
      <div className="space-y-6">
        <h1 className="text-2xl font-black text-slate-900">Expert Management</h1>
        <ExpertTable />
      </div>
    </div>
  );
}
