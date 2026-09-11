"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, Check, Clock3, FileText, RefreshCw, ShieldCheck, Sprout, UserRound } from "lucide-react";
import { api } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/toast-utils";
import { useAuth } from "@/providers/auth-provider";
import { useToast } from "@/providers/toast-provider";
import type { UserResponse } from "@/types/auth";
import { Skeleton } from "@/components/ui/skeleton";

interface CropExpertise { id: number; cropId: number; cropName: string; cropEmoji?: string; categoryName?: string; expertiseType: string; verificationStatus: string; verifiedAt?: string; }
interface ExpertDocument { id: number; documentType: string; title: string; fileName: string; fileType?: string; fileSize?: string; fileUrl?: string; uploadedAt?: string; }
interface ExpertProfile {
  id: number; user: UserResponse; bio?: string; yearsOfExperience?: number; qualification?: string; institution?: string;
  organization?: string; designation?: string; verifiedExpert: boolean; verificationStatus: string; applicationStatus?: string;
  submittedAt?: string; reviewedAt?: string; adminNotes?: string; crops: CropExpertise[]; specializations: { id: number; name: string; code: string }[];
  locations: { id: number; name: string; type: string }[]; documents: ExpertDocument[]; createdAt?: string; updatedAt?: string;
}

const statusLabels: Record<string, { label: string; tone: string; description: string }> = {
  UNVERIFIED: { label: "Not submitted", tone: "bg-slate-100 text-slate-700 border-slate-200", description: "Complete your professional profile and submit your application for review." },
  DRAFT: { label: "Draft", tone: "bg-slate-100 text-slate-700 border-slate-200", description: "Your application is saved as a draft." },
  SUBMITTED: { label: "Pending review", tone: "bg-amber-100 text-amber-800 border-amber-200", description: "Your professional verification is waiting for administrator review." },
  UNDER_REVIEW: { label: "Under review", tone: "bg-blue-100 text-blue-800 border-blue-200", description: "Your application is being reviewed by the KrishiAI administration team." },
  ADDITIONAL_INFORMATION_REQUIRED: { label: "Additional information required", tone: "bg-orange-100 text-orange-800 border-orange-200", description: "The administration team needs more information before completing your review." },
  APPROVED: { label: "Verified", tone: "bg-emerald-100 text-emerald-800 border-emerald-200", description: "Your professional profile has been verified by KrishiAI." },
  VERIFIED: { label: "Verified", tone: "bg-emerald-100 text-emerald-800 border-emerald-200", description: "Your professional profile has been verified by KrishiAI." },
  REJECTED: { label: "Rejected", tone: "bg-rose-100 text-rose-800 border-rose-200", description: "Your application needs updates before it can be resubmitted." },
};

function formatDate(value?: string) { if (!value) return "Not submitted"; const date = new Date(value); return Number.isNaN(date.getTime()) ? "Not submitted" : date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); }
function getCompletion(profile: ExpertProfile) { const checks = [Boolean(profile.user.fullName && profile.user.email), Boolean(profile.qualification || profile.designation || profile.bio), profile.crops.length > 0 || profile.specializations.length > 0, profile.documents.length > 0, Boolean(profile.submittedAt || profile.applicationStatus === "APPROVED")]; return Math.round((checks.filter(Boolean).length / checks.length) * 100); }

export function PendingVerificationExpertDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<ExpertProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    setError(null);
    try { setProfile(await api.get<ExpertProfile>("/v1/expert/profile")); }
    catch (requestError) { const message = getApiErrorMessage(requestError, "Unable to load your expert profile."); setError(message); toast.error({ title: "Unable to load expert dashboard", description: message }); }
    finally { setIsLoading(false); }
  }, [toast]);

  useEffect(() => { const timer = window.setTimeout(() => { void loadProfile(); }, 0); return () => window.clearTimeout(timer); }, [loadProfile]);

  if (isLoading) return <DashboardSkeleton />;
  if (error || !profile) return <ErrorState message={error ?? "Your expert profile is unavailable."} onRetry={() => { setIsLoading(true); void loadProfile(); }} />;

  const applicationStatus = profile.verifiedExpert ? "VERIFIED" : profile.applicationStatus || profile.verificationStatus || "UNVERIFIED";
  const status = statusLabels[applicationStatus] ?? statusLabels.UNVERIFIED;
  const completion = getCompletion(profile);
  const pendingCrops = profile.crops.filter((crop) => crop.verificationStatus === "PENDING").length;
  const verifiedCrops = profile.crops.filter((crop) => crop.verificationStatus === "VERIFIED").length;
  const nextAction = applicationStatus === "UNVERIFIED" || applicationStatus === "DRAFT" ? "/expert-register" : "/expert/profile";

  return (
    <div className="space-y-6">
      <header><p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#0F9F68]">Expert Portal</p><h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-[#171717]">Good morning, {(profile.user.fullName || user?.fullName || "Expert").split(" ")[0]} <span aria-hidden="true">👋</span></h1><p className="mt-1 text-sm text-gray-500">Your professional profile, expertise, and verification progress in one place.</p></header>

      <section className={`rounded-[28px] border p-5 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)] sm:p-6 ${status.tone}`}><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div className="flex gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[16px] bg-white/80"><ShieldCheck className="h-5 w-5" /></span><div><p className="text-sm font-bold">Professional verification: {status.label}</p><p className="mt-1 max-w-2xl text-sm opacity-80">{status.description}</p>{profile.adminNotes && <p className="mt-3 rounded-xl bg-white/60 p-3 text-xs font-medium">Admin note: {profile.adminNotes}</p>}</div></div><Link href={nextAction} className="inline-flex shrink-0 items-center justify-center rounded-full bg-white px-4 py-2 text-xs font-bold text-[#171717] shadow-sm hover:bg-white/80">{applicationStatus === "VERIFIED" ? "View profile" : "Continue application"}</Link></div><div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-current/10 pt-4 text-xs opacity-80"><span>Application status: <strong>{applicationStatus.replaceAll("_", " ")}</strong></span><span>Submitted: <strong>{formatDate(profile.submittedAt)}</strong></span><span>Account: <strong>{profile.user.status}</strong></span></div></section>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4"><OverviewCard icon={<UserRound />} value={`${completion}%`} label="Profile completion" /><OverviewCard icon={<Sprout />} value={profile.crops.length} label={`${verifiedCrops} verified expertise`} /><OverviewCard icon={<FileText />} value={profile.documents.length} label="Documents submitted" /><OverviewCard icon={<Clock3 />} value={pendingCrops} label="Expertise pending" /></div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <section className="lg:col-span-8 rounded-[28px] border border-[rgba(234,234,236,0.85)] bg-white p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04),0_2px_6px_-1px_rgba(0,0,0,0.02)]"><div className="flex items-center justify-between"><div><h2 className="text-sm font-bold text-[#171717]">Application progress</h2><p className="mt-1 text-xs text-gray-400">Your account stays active while professional verification is reviewed.</p></div><span className="text-lg font-black text-[#0F9F68]">{completion}%</span></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-[#F4F4F6]"><div className="h-full rounded-full bg-[#0F9F68] transition-all" style={{ width: `${completion}%` }} /></div><div className="mt-6 space-y-4"><ProgressItem done label="Account created" /><ProgressItem done={Boolean(profile.qualification || profile.designation || profile.bio)} label="Professional profile" /><ProgressItem done={profile.crops.length > 0 || profile.specializations.length > 0} label="Expertise added" /><ProgressItem done={profile.documents.length > 0} label="Documents uploaded" /><ProgressItem done={Boolean(profile.submittedAt)} label="Application submitted" /><ProgressItem done={applicationStatus === "UNDER_REVIEW" || applicationStatus === "APPROVED" || applicationStatus === "VERIFIED"} active={applicationStatus === "SUBMITTED" || applicationStatus === "UNDER_REVIEW"} label="Admin verification" /><ProgressItem done={applicationStatus === "APPROVED" || applicationStatus === "VERIFIED"} label="Verification complete" /></div></section>
        <section className="lg:col-span-4 rounded-[28px] border border-[rgba(234,234,236,0.85)] bg-white p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04),0_2px_6px_-1px_rgba(0,0,0,0.02)]"><div className="flex items-center justify-between"><h2 className="text-sm font-bold text-[#171717]">Profile snapshot</h2><Link href="/expert/profile" className="text-xs font-bold text-[#0F9F68] hover:underline">Edit profile</Link></div><div className="mt-5 space-y-4"><Info label="Professional type" value={profile.designation} /><Info label="Qualification" value={profile.qualification} /><Info label="Experience" value={profile.yearsOfExperience != null ? `${profile.yearsOfExperience} years` : undefined} /><Info label="Institution" value={profile.institution} /><Info label="Service locations" value={profile.locations.map((location) => location.name).join(", ")} /></div></section>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2"><ExpertisePanel crops={profile.crops} /><DocumentsPanel documents={profile.documents} /></div>
    </div>
  );
}

function OverviewCard({ icon, value, label }: { icon: React.ReactNode; value: string | number; label: string }) { return <div className="rounded-[24px] border border-[rgba(234,234,236,0.85)] bg-white p-5 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04),0_2px_6px_-1px_rgba(0,0,0,0.02)]"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#DDF4EA] text-[#0F9F68]">{React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: "h-4 w-4" })}</span><p className="mt-3 text-2xl font-black text-[#171717]">{value}</p><p className="mt-1 text-xs text-gray-400">{label}</p></div>; }
function ProgressItem({ label, done, active }: { label: string; done?: boolean; active?: boolean }) { return <div className="flex items-center gap-3 text-sm"><span className={`flex h-6 w-6 items-center justify-center rounded-full border ${done ? "border-[#0F9F68] bg-[#0F9F68] text-white" : active ? "border-amber-500 bg-amber-50 text-amber-700" : "border-[rgba(234,234,236,0.85)] text-gray-300"}`}>{done ? <Check className="h-3.5 w-3.5" /> : active ? <span className="h-2 w-2 rounded-full bg-current" /> : ""}</span><span className={done ? "font-semibold text-[#171717]" : active ? "font-semibold text-amber-700" : "text-gray-400"}>{label}</span></div>; }
function Info({ label, value }: { label: string; value?: string }) { return <div className="flex items-start justify-between gap-4 border-b border-[rgba(234,234,236,0.85)] pb-3 last:border-0"><span className="text-xs text-gray-400">{label}</span><span className={`text-right text-xs font-bold ${value ? "text-[#171717]" : "text-gray-400"}`}>{value || "Not provided"}</span></div>; }
function ExpertisePanel({ crops }: { crops: CropExpertise[] }) { return <section className="rounded-[28px] border border-[rgba(234,234,236,0.85)] bg-white p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04),0_2px_6px_-1px_rgba(0,0,0,0.02)]"><h2 className="text-sm font-bold text-[#171717]">My expertise</h2><p className="mt-1 text-xs text-gray-400">Verification status is controlled by the KrishiAI administration team.</p><div className="mt-4 space-y-2">{crops.length === 0 ? <Empty message="No expertise submitted yet." /> : crops.map((crop) => <div key={crop.id} className="flex items-center justify-between rounded-[20px] border border-[rgba(234,234,236,0.85)] p-3 hover:bg-[#F4F4F6]/50 transition-colors"><div><p className="text-sm font-bold text-[#171717]">{crop.cropEmoji ? `${crop.cropEmoji} ` : ""}{crop.cropName}</p><p className="mt-0.5 text-xs text-gray-400">{crop.categoryName || crop.expertiseType}</p></div><span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${crop.verificationStatus === "VERIFIED" ? "border-[#BCE9D5] bg-[#DDF4EA] text-[#0F9F68]" : crop.verificationStatus === "REJECTED" ? "border-rose-200 bg-rose-50 text-rose-700" : "border-amber-200 bg-amber-50 text-amber-700"}`}>{crop.verificationStatus.replaceAll("_", " ")}</span></div>)}</div></section>; }
function DocumentsPanel({ documents }: { documents: ExpertDocument[] }) { return <section className="rounded-[28px] border border-[rgba(234,234,236,0.85)] bg-white p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04),0_2px_6px_-1px_rgba(0,0,0,0.02)]"><h2 className="text-sm font-bold text-[#171717]">Supporting documents</h2><p className="mt-1 text-xs text-gray-400">Documents remain protected by the authenticated expert profile API.</p><div className="mt-4 space-y-2">{documents.length === 0 ? <Empty message="No supporting documents uploaded yet." /> : documents.map((document) => <div key={document.id} className="flex items-center gap-3 rounded-[20px] border border-[rgba(234,234,236,0.85)] p-3 hover:bg-[#F4F4F6]/50 transition-colors"><FileText className="h-4 w-4 shrink-0 text-[#0F9F68]" /><div className="min-w-0 flex-1"><p className="truncate text-xs font-bold text-[#171717]">{document.title || document.fileName}</p><p className="mt-0.5 text-[10px] text-gray-400">{document.fileName} · {document.fileSize || "Size unavailable"}</p></div><span className="text-[10px] font-bold text-gray-400">{formatDate(document.uploadedAt)}</span></div>)}</div></section>; }
function Empty({ message }: { message: string }) { return <div className="rounded-[20px] border border-dashed border-[rgba(234,234,236,0.85)] bg-[#F4F4F6]/50 p-6 text-center text-xs text-gray-400">{message}</div>; }
function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) { return <div className="rounded-[28px] border border-rose-200 bg-rose-50 p-8 text-center"><AlertCircle className="mx-auto h-8 w-8 text-rose-600" /><p className="mt-3 text-sm font-bold text-rose-900">Unable to load your expert dashboard</p><p className="mt-1 text-xs text-rose-800">{message}</p><button type="button" onClick={onRetry} className="mt-4 inline-flex items-center gap-2 rounded-full bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700"><RefreshCw className="h-3.5 w-3.5" />Try again</button></div>; }
function DashboardSkeleton() { return <div className="space-y-6" aria-busy="true"><Skeleton className="h-16 w-80 rounded-[20px]" /><Skeleton className="h-36 rounded-[28px]" /><div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-28 rounded-[24px]" />)}</div><div className="grid grid-cols-1 gap-5 lg:grid-cols-12"><Skeleton className="lg:col-span-8 h-96 rounded-[28px]" /><Skeleton className="lg:col-span-4 h-96 rounded-[28px]" /></div></div>; }
