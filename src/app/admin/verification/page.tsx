import { VerificationQueue } from "@/components/admin/verification-card";

export default function AdminVerificationPage() {
  return (
    <div>
      <div className="space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Administrator review</p>
          <h1 className="mt-1 text-2xl font-black text-slate-900">Expert Verification</h1>
          <p className="text-sm text-slate-500 mt-1">
            Review professional credentials and expertise submitted by this expert.
          </p>
        </div>
        <VerificationQueue />
      </div>
    </div>
  );
}
