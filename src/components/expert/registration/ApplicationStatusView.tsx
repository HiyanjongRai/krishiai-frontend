"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight, CheckCircle2, Clock3, FileText, RefreshCw, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/toast-utils";
import { useToast } from "@/providers/toast-provider";

interface StatusProfile { id: number; user: { fullName: string; email: string; status: string }; designation?: string; qualification?: string; verifiedExpert: boolean; verificationStatus: string; applicationStatus?: string; submittedAt?: string; reviewedAt?: string; adminNotes?: string; documents: { id: number; title: string; fileName: string; uploadedAt?: string }[]; }
const statusCopy: Record<string, { label: string; tone: string; icon: React.ReactNode; message: string }> = {
  SUBMITTED: { label: "Pending review", tone: "border-[#FCD34D] bg-[#FEF3C7] text-[#F59E0B]", icon: <Clock3 className="h-5 w-5" />, message: "Your application has been submitted and is waiting for professional verification." },
  UNDER_REVIEW: { label: "Under review", tone: "border-[#93C5FD] bg-[#DBEAFE] text-[#2563EB]", icon: <ShieldCheck className="h-5 w-5" />, message: "The KrishiAI administration team is reviewing your professional credentials." },
  ADDITIONAL_INFORMATION_REQUIRED: { label: "Additional information required", tone: "border-[#FCD34D] bg-[#FEF3C7] text-[#F59E0B]", icon: <AlertCircle className="h-5 w-5" />, message: "The administration team needs more information before completing your review." },
  APPROVED: { label: "Verified", tone: "border-[#A5D6A7] bg-[#E8F5E9] text-[#1B5E20]", icon: <CheckCircle2 className="h-5 w-5" />, message: "Your professional profile has been verified by KrishiAI." },
  VERIFIED: { label: "Verified", tone: "border-[#A5D6A7] bg-[#E8F5E9] text-[#1B5E20]", icon: <CheckCircle2 className="h-5 w-5" />, message: "Your professional profile has been verified by KrishiAI." },
  REJECTED: { label: "Changes required", tone: "border-[#FCA5A5] bg-[#FEE2E2] text-[#DC2626]", icon: <AlertCircle className="h-5 w-5" />, message: "Your application needs updates before it can be resubmitted." },
};
function formatDate(value?: string) { if (!value) return "Not available"; const date = new Date(value); return Number.isNaN(date.getTime()) ? "Not available" : date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); }

export function ApplicationStatusView() {
  const { toast } = useToast();
  const [profile, setProfile] = useState<StatusProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const load = useCallback(async () => { setError(null); try { setProfile(await api.get<StatusProfile>("/v1/expert/profile")); } catch (requestError) { const message = getApiErrorMessage(requestError, "Unable to load application status."); setError(message); toast.error({ title: "Unable to load status", description: message }); } finally { setIsLoading(false); } }, [toast]);
  useEffect(() => { const timer = window.setTimeout(() => { void load(); }, 0); return () => window.clearTimeout(timer); }, [load]);
  if (isLoading) return <><Navbar /><main className="mx-auto max-w-5xl space-y-5 px-4 py-8"><Skeleton className="h-8 w-72" /><Skeleton className="h-48 rounded-2xl" /><Skeleton className="h-64 rounded-2xl" /></main></>;
  if (error || !profile) return <><Navbar /><main className="mx-auto max-w-5xl px-4 py-12"><div className="rounded-2xl border border-[#FCA5A5] bg-[#FEE2E2] p-8 text-center"><p className="text-sm font-semibold text-[#DC2626]">{error ?? "Application status unavailable."}</p><button type="button" onClick={() => { setIsLoading(true); void load(); }} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#B91C1C] px-3 py-2 text-xs font-bold text-white"><RefreshCw className="h-3.5 w-3.5" />Try again</button></div></main></>;
  const currentStatus = profile.verifiedExpert ? "VERIFIED" : profile.applicationStatus || profile.verificationStatus || "SUBMITTED";
  const copy = statusCopy[currentStatus] ?? statusCopy.SUBMITTED;
  return <><Navbar /><main className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6 lg:py-8"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2E7D32]">Professional verification</p><h1 className="mt-1 text-2xl font-bold text-[#1F2937]">Application status</h1><p className="mt-1 text-sm text-[#6B7280]">{profile.user.fullName} · {profile.designation || profile.qualification || "Expert applicant"}</p></div><section className={`rounded-2xl border p-6 shadow-sm ${copy.tone}`}><div className="flex items-start gap-3">{copy.icon}<div><span className="rounded-full bg-white/70 px-2.5 py-1 text-xs font-bold">{copy.label}</span><p className="mt-3 text-sm leading-relaxed">{copy.message}</p>{profile.adminNotes && <p className="mt-4 rounded-xl bg-white/60 p-3 text-xs font-medium">Admin note: {profile.adminNotes}</p>}</div></div><div className="mt-5 grid grid-cols-1 gap-3 border-t border-current/10 pt-4 text-xs sm:grid-cols-3"><span>Account: <strong>{profile.user.status}</strong></span><span>Submitted: <strong>{formatDate(profile.submittedAt)}</strong></span><span>Reviewed: <strong>{formatDate(profile.reviewedAt)}</strong></span></div></section><section className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><h2 className="text-sm font-bold text-[#1F2937]">Submitted documents</h2><Link href="/expert-register" className="inline-flex items-center gap-1 text-xs font-semibold text-[#2E7D32]">Update application <ArrowRight className="h-3.5 w-3.5" /></Link></div><div className="mt-4 space-y-2">{profile.documents.length === 0 ? <p className="rounded-xl border border-dashed border-[#E5E7EB] bg-[#F8FAF8] p-6 text-center text-xs text-[#9CA3AF]">No documents submitted.</p> : profile.documents.map((document) => <div key={document.id} className="flex items-center gap-3 rounded-xl border border-[#EEF0EE] p-3"><FileText className="h-4 w-4 text-[#9CA3AF]" /><div><p className="text-xs font-semibold text-[#4B5563]">{document.title || document.fileName}</p><p className="mt-0.5 text-[10px] text-[#9CA3AF]">{document.fileName} · Uploaded {formatDate(document.uploadedAt)}</p></div></div>)}</div></section></main></>;
}
