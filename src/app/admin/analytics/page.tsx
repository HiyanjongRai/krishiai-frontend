import { BarChart3 } from "lucide-react";

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">Operational reporting</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">Platform analytics</h1>
        <p className="mt-1 text-sm text-slate-500">Live analytics will appear here when the backend reporting endpoint is available.</p>
      </div>
      <div className="rounded-[24px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-[0_12px_32px_rgba(22,29,37,0.06)]">
        <BarChart3 className="mx-auto h-10 w-10 text-slate-300" />
        <h2 className="mt-4 text-sm font-bold text-slate-700">No analytics data available</h2>
        <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed text-slate-500">
          The current admin API provides dashboard totals and verification data, but not diagnostic distribution or trend reports.
        </p>
      </div>
    </div>
  );
}
