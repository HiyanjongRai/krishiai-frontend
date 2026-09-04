import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function AdminKnowledgePage() {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <h1 className="text-2xl font-black text-slate-900">RAG Vector Chunks & Sources</h1>
      </div>
    </DashboardLayout>
  );
}
