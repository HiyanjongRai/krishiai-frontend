"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertCircle,
  ArrowUpRight,
  Award,
  Bot,
  Calendar,
  Check,
  ChevronDown,
  Clock,
  Clock3,
  FileCheck2,
  FileText,
  MapPin,
  Plus,
  RefreshCw,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Sprout,
  UserRound,
  Users,
} from "lucide-react";
import { api } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/toast-utils";
import { formatFullName } from "@/lib/format-utils";
import { useAuth } from "@/providers/auth-provider";
import { useToast } from "@/providers/toast-provider";
import type { UserResponse } from "@/types/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/ui/avatar";
import { CropAvatar } from "@/components/ui/crop-avatar";
import { WeatherWidget } from "@/components/weather";

/* ─── Types ───────────────────────────────────────────────────────────────── */
interface CropExpertise {
  id: number;
  cropId?: number;
  expertiseId?: number;
  cropName?: string;
  expertiseArea?: string;
  cropEmoji?: string;
  cropImageUrl?: string;
  categoryName?: string;
  expertiseType: string;
  verificationStatus: "SELF_DECLARED" | "EVIDENCE_SUBMITTED" | "VERIFIED" | "REJECTED" | "PENDING";
  expertiseLevel?: string;
  yearsOfExperience?: number;
  verifiedAt?: string;
  rejectionReason?: string;
}

interface ExpertDocument {
  id: number;
  documentType: string;
  title: string;
  fileName: string;
  fileType?: string;
  fileSize?: string;
  fileUrl?: string;
  uploadedAt?: string;
}

interface ExpertProfile {
  id: number;
  user: UserResponse;
  bio?: string;
  yearsOfExperience?: number;
  qualification?: string;
  institution?: string;
  organization?: string;
  designation?: string;
  verifiedExpert: boolean;
  verificationStatus: string;
  applicationStatus?: string;
  submittedAt?: string;
  reviewedAt?: string;
  adminNotes?: string;
  crops: CropExpertise[];
  specializations: { id: number; name: string; code: string }[];
  locations: { id: number; name: string; type: string }[];
  documents: ExpertDocument[];
  createdAt?: string;
  updatedAt?: string;
}

const statusConfig: Record<
  string,
  { label: string; badgeTone: string; bannerTone: string; icon: React.ReactNode; description: string }
> = {
  UNVERIFIED: {
    label: "Not Submitted",
    badgeTone: "bg-[#F1F5F2] text-[#4B5563] border-[#E5E7EB]",
    bannerTone: "border-[#E5E7EB] bg-white",
    icon: <AlertCircle className="h-5 w-5 text-[#6B7280]" />,
    description: "Complete your professional profile and submit credentials for review.",
  },
  DRAFT: {
    label: "Draft Application",
    badgeTone: "bg-[#F1F5F2] text-[#4B5563] border-[#E5E7EB]",
    bannerTone: "border-[#E5E7EB] bg-white",
    icon: <AlertCircle className="h-5 w-5 text-[#6B7280]" />,
    description: "Your application is saved as a draft. Submit when all required details are entered.",
  },
  SUBMITTED: {
    label: "Pending Review",
    badgeTone: "bg-[#FEF3C7] text-[#F59E0B] border-[#FCD34D]",
    bannerTone: "border-[#FCD34D]/80 bg-[#FEF3C7]/40",
    icon: <Clock3 className="h-5 w-5 text-[#F59E0B]" />,
    description: "Your professional application is queued for administrator inspection.",
  },
  UNDER_REVIEW: {
    label: "Under Active Review",
    badgeTone: "bg-[#DBEAFE] text-[#2563EB] border-[#93C5FD]",
    bannerTone: "border-[#93C5FD]/80 bg-[#DBEAFE]/40",
    icon: <Clock3 className="h-5 w-5 text-[#2563EB]" />,
    description: "Your credentials and submitted documents are currently being evaluated by our team.",
  },
  ADDITIONAL_INFORMATION_REQUIRED: {
    label: "Action Required",
    badgeTone: "bg-[#FEF3C7] text-[#F59E0B] border-[#FCD34D]",
    bannerTone: "border-[#FCD34D]/80 bg-[#FEF3C7]/40",
    icon: <AlertCircle className="h-5 w-5 text-[#F59E0B]" />,
    description: "The administration team requires additional clarification or documents to proceed.",
  },
  APPROVED: {
    label: "Verified Specialist",
    badgeTone: "bg-[#E8F5E9] text-[#2E7D32] border-[#A5D6A7]",
    bannerTone: "border-[#A5D6A7]/80 bg-[#E8F5E9]/40",
    icon: <ShieldCheck className="h-5 w-5 text-[#2E7D32]" />,
    description: "Your professional credentials have been authorized. You can advise farmers across assigned crop domains.",
  },
  VERIFIED: {
    label: "Verified Specialist",
    badgeTone: "bg-[#E8F5E9] text-[#2E7D32] border-[#A5D6A7]",
    bannerTone: "border-[#A5D6A7]/80 bg-[#E8F5E9]/40",
    icon: <ShieldCheck className="h-5 w-5 text-[#2E7D32]" />,
    description: "Your professional credentials have been authorized. You can advise farmers across assigned crop domains.",
  },
  REJECTED: {
    label: "Declined",
    badgeTone: "bg-[#FEE2E2] text-[#DC2626] border-[#FCA5A5]",
    bannerTone: "border-[#FCA5A5]/80 bg-[#FEE2E2]/40",
    icon: <ShieldAlert className="h-5 w-5 text-[#DC2626]" />,
    description: "Your application was declined. Review reviewer feedback and update your profile to resubmit.",
  },
};

function formatDate(value?: string) {
  if (!value) return "Not submitted";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Not submitted"
    : date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getCompletion(profile: ExpertProfile) {
  const checks = [
    Boolean(profile.user.fullName && profile.user.email),
    Boolean(profile.qualification || profile.designation || profile.bio),
    profile.crops.length > 0 || profile.specializations.length > 0,
    profile.documents.length > 0,
    Boolean(profile.submittedAt || profile.applicationStatus === "APPROVED" || profile.verifiedExpert),
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

// ─── Smooth Area Sparkline SVG ────────────────────────────────────────────────
function Sparkline({ completion }: { completion: number }) {
  const baseCurve = [20, 35, 45, 40, 60, 55, 75, 70, 85, completion];
  const w = 220;
  const h = 55;
  const xs = baseCurve.map((_, i) => (i / (baseCurve.length - 1)) * w);
  const ys = baseCurve.map((v) => h - (v / 100) * h);

  let d = `M ${xs[0]} ${ys[0]}`;
  for (let i = 1; i < baseCurve.length; i++) {
    const prevX = xs[i - 1];
    const prevY = ys[i - 1];
    const currX = xs[i];
    const currY = ys[i];
    const cx1 = prevX + (currX - prevX) / 2;
    const cx2 = cx1;
    d += ` C ${cx1} ${prevY}, ${cx2} ${currY}, ${currX} ${currY}`;
  }
  const filled = `${d} L ${w},${h} L 0,${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-12 overflow-visible" preserveAspectRatio="none">
      <defs>
        <linearGradient id="expertVitalityGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2E7D32" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#2E7D32" stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path d={filled} fill="url(#expertVitalityGrad)" />
      <path d={d} fill="none" stroke="#2E7D32" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Main Expert Dashboard Component ──────────────────────────────────────────
export function PendingVerificationExpertDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<ExpertProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState("");

  const loadProfile = useCallback(async () => {
    setError(null);
    try {
      setProfile(await api.get<ExpertProfile>("/v1/expert/profile"));
    } catch (requestError) {
      const message = getApiErrorMessage(requestError, "Unable to load your expert profile.");
      setError(message);
      toast.error({ title: "Unable to load expert dashboard", description: message });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadProfile();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadProfile]);

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    toast.info({
      title: "KrishiAI Specialist Assistant",
      description: `Searching clinical agricultural guidelines for: "${chatInput}"...`,
    });
    setChatInput("");
  };

  if (isLoading) return <DashboardSkeleton />;
  if (error || !profile) {
    return (
      <ErrorState
        message={error ?? "Your expert profile is unavailable."}
        onRetry={() => {
          setIsLoading(true);
          void loadProfile();
        }}
      />
    );
  }

  const applicationStatus = profile.verifiedExpert
    ? "VERIFIED"
    : profile.applicationStatus || profile.verificationStatus || "UNVERIFIED";
  const status = statusConfig[applicationStatus] ?? statusConfig.UNVERIFIED;
  const completion = getCompletion(profile);
  const verifiedCrops = profile.crops.filter((c) => c.verificationStatus === "VERIFIED").length;
  const inReviewCrops = profile.crops.filter(
    (c) => c.verificationStatus === "EVIDENCE_SUBMITTED" || c.verificationStatus === "PENDING"
  ).length;
  const selfDeclaredCrops = profile.crops.filter((c) => c.verificationStatus === "SELF_DECLARED").length;
  const totalCrops = profile.crops.length;

  const verifiedPercent = totalCrops > 0 ? Math.round((verifiedCrops / totalCrops) * 100) : 0;
  const inReviewPercent = totalCrops > 0 ? Math.round((inReviewCrops / totalCrops) * 100) : 0;
  const selfDeclaredPercent = totalCrops > 0 ? Math.max(0, 100 - verifiedPercent - inReviewPercent) : 0;

  const nextAction =
    applicationStatus === "UNVERIFIED" || applicationStatus === "DRAFT"
      ? "/expert-register"
      : "/expert/profile";

  const firstName = (profile.user.fullName || user?.fullName || "Specialist").split(" ")[0];

  const currentDateFormatted = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="space-y-6">

      {/* ─── HEADER ROW (Farmer Dashboard Style) ────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#1F2937] flex items-center gap-2">
            <span>Welcome Back,</span>
            <span className="text-[#2E7D32]">{firstName}</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
            Manage your credentials, crop accreditations, and verification progress.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap w-full sm:w-auto">
          {/* Active Term Pill */}
          <div className="flex items-center justify-between sm:justify-start gap-2 bg-white border border-[#E5E7EB] rounded-full px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs font-semibold text-[#4B5563] shadow-[0_4px_20px_-2px_#EEF0EE] cursor-pointer hover:border-[#D1D5DB] transition-colors flex-1 sm:flex-initial">
            <div className="flex items-center gap-2 min-w-0">
              <Calendar className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" />
              <span className="truncate">{currentDateFormatted}</span>
            </div>
            <span className={`w-2 h-2 rounded-full shrink-0 ${profile.verifiedExpert ? "bg-[#2E7D32]" : "bg-[#F59E0B]"}`} />
          </div>

          {/* Primary Action Button */}
          <Link
            href="/expert/expertise"
            className="flex items-center justify-center gap-2 bg-[#2E7D32] hover:bg-[#256B2A] text-white rounded-full px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-bold shadow-sm transition-all active:scale-95 flex-1 sm:flex-initial min-h-[40px]"
          >
            <Plus className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap">Manage Specializations</span>
          </Link>
        </div>
      </div>

      {/* ─── 3-COLUMN RESPONSIVE DASHBOARD GRID (Farmer Structure) ──────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

        {/* ════════════════════════════════════════════════════════════════════
            LEFT COLUMN (Desktop: 3 cols, Laptop/Tablet: 4 cols)
            ════════════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-5">

          {/* Card: Hero Accreditation Credential (Farmer Credit-Card Style) */}
          <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 space-y-4 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#1F2937]">Accreditation Goal</p>
                <p className="text-[11px] text-[#9CA3AF]">Certified specialist standing</p>
              </div>
              <Link
                href="/expert/profile"
                className="w-7 h-7 rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#9CA3AF] hover:text-[#2E7D32] hover:border-[#C8E6C9] transition-colors"
                title="View full credentials"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Rich Emerald Hero Surface (Matching farmer primary card) */}
            <div className="bg-gradient-to-br from-[#2E7D32] to-[#388E3C] rounded-[22px] p-5 text-white shadow-md relative overflow-hidden space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold tracking-wider text-[#A5D6A7] uppercase">
                    Primary Credential
                  </span>
                  <p className="text-xl font-black tracking-tight mt-0.5 truncate max-w-[170px]">
                    {profile.designation || "Agronomist"}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-xs">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
              </div>

              <div>
                <p className="text-[10px] font-semibold text-[#C8E6C9] opacity-90">Affiliated Body</p>
                <p className="text-base font-bold tracking-tight truncate max-w-[210px]">
                  {profile.organization || profile.institution || "KrishiAI Specialist Network"}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-white/20 text-[10px] text-[#C8E6C9]">
                <span className="font-mono tracking-wider truncate max-w-[130px]">
                  ID: KAI-EXP-#{profile.id}
                </span>
                <span>
                  {profile.yearsOfExperience ? `${profile.yearsOfExperience} Yrs Exp` : status.label}
                </span>
              </div>
            </div>

            {/* Verified Metric Row */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <p className="text-[11px] text-[#9CA3AF] font-semibold">Verified Domains</p>
                <p className="text-xl font-black text-[#1F2937]">
                  {verifiedCrops} Crops
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-[10px] font-bold border border-[#C8E6C9]">
                {profile.verifiedExpert ? "Active Advisor" : `${completion}% Complete`}
              </span>
            </div>
          </div>

          {/* Card: Quick Operations (Farmer Quick Operations Structure) */}
          <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 space-y-3 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE]">
            <p className="text-xs font-bold text-[#1F2937]">Quick Operations</p>
            <div className="space-y-2">
              <Link
                href="/expert/expertise"
                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-[#F1F5F2] transition-colors group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Sprout className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#1F2937]">Manage Specializations</p>
                  <p className="text-[10px] text-[#9CA3AF] truncate">Crops, domains &amp; evidence</p>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#6B7280] group-hover:text-[#2E7D32] transition-colors" />
              </Link>

              <Link
                href="/expert/documents"
                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-[#F1F5F2] transition-colors group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FileCheck2 className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#1F2937]">Verification Documents</p>
                  <p className="text-[10px] text-[#9CA3AF] truncate">Degrees &amp; certifications</p>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#6B7280] group-hover:text-[#2E7D32] transition-colors" />
              </Link>

              <Link
                href="/expert/consultations"
                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-[#F1F5F2] transition-colors group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Users className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#1F2937]">Farmer Consultations</p>
                  <p className="text-[10px] text-[#9CA3AF] truncate">Review incoming inquiries</p>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#6B7280] group-hover:text-[#2563EB] transition-colors" />
              </Link>

              <Link
                href="/expert/ai-reviews"
                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-[#F1F5F2] transition-colors group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#1F2937]">AI Diagnostic Reviews</p>
                  <p className="text-[10px] text-[#9CA3AF] truncate">Validate machine assessments</p>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#6B7280] group-hover:text-[#2E7D32] transition-colors" />
              </Link>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            CENTER COLUMN (Desktop: 6 cols, Laptop/Tablet: 8 cols)
            ════════════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-8 xl:col-span-6 space-y-5">

          {/* Card: Specialization & Accreditation Overview (Real Data Distribution) */}
          <div className="rounded-[20px] sm:rounded-[24px] border border-[#E5E7EB] bg-white p-4 sm:p-5 md:p-6 space-y-5 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32] shrink-0">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1F2937]">Accreditation Distribution</p>
                  <p className="text-[11px] text-[#9CA3AF]">Status of claimed crop specializations</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-[#E8F5E9] text-[#2E7D32] border border-[#A5D6A7]">
                  {verifiedCrops} of {totalCrops} Verified
                </span>
                <Link
                  href="/expert/expertise"
                  className="w-7 h-7 rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#9CA3AF] hover:text-[#2E7D32] hover:border-[#C8E6C9] transition-colors ml-1 shrink-0"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Segmented Distribution Bar */}
            <div className="space-y-2">
              <div className="h-3.5 w-full rounded-full bg-[#F1F5F2] overflow-hidden flex p-0.5 gap-1">
                {verifiedPercent > 0 && (
                  <div
                    className="h-full rounded-full bg-[#2E7D32] transition-all duration-500"
                    style={{ width: `${verifiedPercent}%` }}
                    title={`Verified: ${verifiedCrops} (${verifiedPercent}%)`}
                  />
                )}
                {inReviewPercent > 0 && (
                  <div
                    className="h-full rounded-full bg-[#F59E0B] transition-all duration-500"
                    style={{ width: `${inReviewPercent}%` }}
                    title={`In Review: ${inReviewCrops} (${inReviewPercent}%)`}
                  />
                )}
                {selfDeclaredPercent > 0 && (
                  <div
                    className="h-full rounded-full bg-[#9CA3AF] transition-all duration-500"
                    style={{ width: `${selfDeclaredPercent}%` }}
                    title={`Self-declared: ${selfDeclaredCrops} (${selfDeclaredPercent}%)`}
                  />
                )}
              </div>

              {/* Status Breakdown Pills */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="p-3 rounded-2xl bg-[#E8F5E9]/50 border border-[#C8E6C9] flex flex-col">
                  <span className="text-[10px] font-bold text-[#2E7D32] uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]" /> Verified
                  </span>
                  <span className="text-lg font-black text-[#1F2937] mt-0.5">{verifiedCrops}</span>
                  <span className="text-[10px] text-[#6B7280]">Accredited crops</span>
                </div>

                <div className="p-3 rounded-2xl bg-[#FEF3C7]/50 border border-[#FCD34D] flex flex-col">
                  <span className="text-[10px] font-bold text-[#F59E0B] uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" /> In Review
                  </span>
                  <span className="text-lg font-black text-[#1F2937] mt-0.5">{inReviewCrops}</span>
                  <span className="text-[10px] text-[#6B7280]">Evidence queued</span>
                </div>

                <div className="p-3 rounded-2xl bg-[#F8FAF8] border border-[#E5E7EB] flex flex-col">
                  <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#9CA3AF]" /> Declared
                  </span>
                  <span className="text-lg font-black text-[#1F2937] mt-0.5">{selfDeclaredCrops}</span>
                  <span className="text-[10px] text-[#6B7280]">Self declared</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card: Accredited Domains & Crops Table (Farmer Table Structure) */}
          <div id="domains" className="rounded-[20px] sm:rounded-[24px] border border-[#E5E7EB] bg-white p-4 sm:p-5 md:p-6 space-y-4 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-[#1F2937]">Accredited Domains &amp; Crops</p>
                <p className="text-[11px] text-[#9CA3AF]">Registered specializations &amp; evidence</p>
              </div>
              <Link
                href="/expert/expertise"
                className="w-7 h-7 rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#9CA3AF] hover:text-[#2E7D32] hover:border-[#C8E6C9] transition-colors"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {profile.crops.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[#E5E7EB] bg-[#F8FAF8] p-6 text-center text-xs text-[#6B7280]">
                No crop specializations added yet.{" "}
                <Link href="/expert/expertise" className="text-[#2E7D32] font-semibold hover:underline">
                  Add crops &amp; domains
                </Link>
              </div>
            ) : (
              <>
                {/* Mobile Cards View (sm:hidden) */}
                <div className="sm:hidden space-y-2.5">
                  {profile.crops.map((crop) => {
                    const isVer = crop.verificationStatus === "VERIFIED";
                    const isPend = crop.verificationStatus === "EVIDENCE_SUBMITTED" || crop.verificationStatus === "PENDING";
                    const isRej = crop.verificationStatus === "REJECTED";
                    return (
                      <div
                        key={crop.id}
                        className="p-3 rounded-2xl bg-[#F8FAF8] border border-[#EEF0EE] flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <CropAvatar name={crop.cropName} imageUrl={crop.cropImageUrl} emoji={crop.cropEmoji} isArea={crop.expertiseType === "AREA"} size="sm" />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-[#1F2937] truncate">
                              {crop.cropName || crop.expertiseArea || "Domain"}
                            </p>
                            <p className="text-[10px] text-[#9CA3AF] truncate">
                              {crop.categoryName || crop.expertiseType}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-0.5 shrink-0">
                          <span className="text-xs font-bold text-[#1F2937]">
                            {crop.yearsOfExperience ? `${crop.yearsOfExperience} yrs` : crop.expertiseLevel || "Specialist"}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#4B5563]">
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isVer ? "bg-[#2E7D32]" : isRej ? "bg-[#DC2626]" : "bg-[#F59E0B]"
                              }`}
                            />
                            {isVer ? "Verified" : isPend ? "In Review" : isRej ? "Rejected" : "Self-declared"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Desktop / Tablet Table View (hidden sm:block) */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[420px]">
                    <thead>
                      <tr className="border-b border-[#E5E7EB] text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                        <th className="pb-3 font-semibold">Specialization</th>
                        <th className="pb-3 font-semibold">Category</th>
                        <th className="pb-3 font-semibold">Experience</th>
                        <th className="pb-3 font-semibold">Status</th>
                        <th className="pb-3 font-semibold text-right">Standing</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EEF0EE]">
                      {profile.crops.map((crop) => {
                        const isVer = crop.verificationStatus === "VERIFIED";
                        const isPend = crop.verificationStatus === "EVIDENCE_SUBMITTED" || crop.verificationStatus === "PENDING";
                        const isRej = crop.verificationStatus === "REJECTED";
                        return (
                          <tr key={crop.id} className="hover:bg-[#F8FAF8]/70 transition-colors">
                            <td className="py-3.5 font-bold text-[#1F2937] flex items-center gap-2.5">
                              <CropAvatar name={crop.cropName} imageUrl={crop.cropImageUrl} emoji={crop.cropEmoji} isArea={crop.expertiseType === "AREA"} size="xs" />
                              <span>{crop.cropName || crop.expertiseArea || "Domain"}</span>
                            </td>
                            <td className="py-3.5 text-[#6B7280] text-[11px]">
                              {crop.categoryName || crop.expertiseType}
                            </td>
                            <td className="py-3.5 text-[#6B7280] text-[11px]">
                              {crop.yearsOfExperience ? `${crop.yearsOfExperience} Yrs` : "Recorded"}
                            </td>
                            <td className="py-3.5">
                              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#1F2937]">
                                <span
                                  className={`w-2 h-2 rounded-full ${
                                    isVer ? "bg-[#2E7D32]" : isRej ? "bg-[#DC2626]" : "bg-[#F59E0B]"
                                  }`}
                                />
                                {isVer ? "Verified" : isPend ? "In Review" : isRej ? "Rejected" : "Self-declared"}
                              </span>
                            </td>
                            <td className="py-3.5 text-right font-black text-[#1F2937]">
                              {crop.expertiseLevel || (isVer ? "Accredited" : "Pending")}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>

          {/* Card: Ask KrishiAI Specialist Advisor Interactive Input */}
          <div className="rounded-[20px] sm:rounded-[24px] border border-[#E5E7EB] bg-white p-4 sm:p-5 md:p-6 space-y-3.5 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#1F2937]">Ask KrishiAI Specialist Assistant</p>
                <p className="text-[11px] text-[#9CA3AF]">Query plant pathology, soil management &amp; agrochemical dosage</p>
              </div>
            </div>

            <form onSubmit={handleChatSubmit} className="relative">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask KrishiAI clinical question or treatment protocol..."
                className="w-full py-3 pl-4 pr-12 rounded-full border border-[#E5E7EB] text-xs focus:ring-3 focus:ring-[#2E7D32]/15 focus:border-[#2E7D32] outline-none transition-all placeholder:text-[#9CA3AF]"
              />
              <button
                type="submit"
                aria-label="Send query"
                className="w-8 h-8 rounded-full bg-[#2E7D32] hover:bg-[#256B2A] text-white flex items-center justify-center absolute right-1.5 top-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="flex flex-wrap gap-2">
              {[
                "Optimal fungicides for early tomato blight?",
                "Intercropping recommendations for maize?",
                "Nitrogen deficiency vs iron chlorosis symptoms",
              ].map((p) => (
                <button
                  key={p}
                  onClick={() => setChatInput(p)}
                  className="px-3 py-1 rounded-full bg-[#F1F5F2] hover:bg-[#E8F5E9] hover:text-[#2E7D32] text-[#4B5563] text-[10px] font-semibold transition-colors text-left cursor-pointer"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            RIGHT COLUMN (Desktop: 3 cols, Laptop: full 12 cols with 2 sub-cols)
            ════════════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-12 xl:col-span-3 space-y-5 lg:grid lg:grid-cols-2 xl:block lg:gap-5 xl:space-y-5">
          {/* Reusable Weather Widget */}
          <WeatherWidget />

          {/* Card: Profile Vitality / Credential Score (Farmer Vitality Style) */}
          <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 space-y-3.5 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#1F2937]">Profile Vitality</p>
                <p className="text-[11px] text-[#9CA3AF]">Credential strength</p>
              </div>
              <Link
                href="/expert/profile"
                className="w-7 h-7 rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#9CA3AF] hover:text-[#2E7D32] hover:border-[#C8E6C9] transition-colors"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <div>
                <span className="text-3xl font-black text-[#1F2937] tracking-tight">
                  {completion}%
                </span>
                <span className="text-xs font-semibold text-[#6B7280] ml-1.5">Score</span>
              </div>
              <span className="text-xs font-bold text-[#2E7D32] bg-[#E8F5E9] px-2.5 py-1 rounded-full border border-[#C8E6C9]">
                {completion === 100 ? "Ready" : "In Progress"}
              </span>
            </div>

            <Sparkline completion={completion} />

            <div className="pt-2 border-t border-[#EEF0EE] space-y-2 text-xs">
              <div className="flex items-center justify-between text-[#6B7280]">
                <span>Attached Certificates</span>
                <span className="font-bold text-[#1F2937]">{profile.documents.length} Files</span>
              </div>
              <div className="flex items-center justify-between text-[#6B7280]">
                <span>Specialization Claims</span>
                <span className="font-bold text-[#1F2937]">{profile.crops.length} Domains</span>
              </div>
              <div className="flex items-center justify-between text-[#6B7280]">
                <span>Verified Endorsements</span>
                <span className="font-bold text-[#2E7D32]">{verifiedCrops} Approved</span>
              </div>
            </div>
          </div>

          {/* Card: Verification Status & Stepper */}
          <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 space-y-4 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#1F2937]">Verification Pipeline</p>
                <p className="text-[11px] text-[#9CA3AF]">Administrator review audit</p>
              </div>
              <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${status.badgeTone}`}>
                {status.label}
              </span>
            </div>

            {/* Banner status pill */}
            <div className={`p-3 rounded-xl border text-xs leading-relaxed ${status.bannerTone}`}>
              <div className="flex items-center gap-2 font-bold text-[#1F2937] mb-1">
                {status.icon}
                <span>{status.label}</span>
              </div>
              <p className="text-[#4B5563] text-[11px]">{status.description}</p>
              {profile.adminNotes && (
                <div className="mt-2.5 pt-2 border-t border-[#E5E7EB] text-[11px] text-[#1F2937]">
                  <strong className="text-[#2E7D32]">Admin Note: </strong>
                  {profile.adminNotes}
                </div>
              )}
            </div>

            {/* Stepper items */}
            <div className="space-y-2.5 pt-1">
              <ProgressItem done label="Specialist account registered" />
              <ProgressItem
                done={Boolean(profile.qualification || profile.designation || profile.bio)}
                label="Qualifications & background entered"
              />
              <ProgressItem
                done={profile.crops.length > 0 || profile.specializations.length > 0}
                label="Crop specializations submitted"
              />
              <ProgressItem
                done={profile.documents.length > 0}
                label="Verification certificates uploaded"
              />
              <ProgressItem
                done={applicationStatus === "APPROVED" || applicationStatus === "VERIFIED"}
                active={applicationStatus === "SUBMITTED" || applicationStatus === "UNDER_REVIEW"}
                label="KrishiAI administrator approval"
              />
            </div>

            <div className="pt-2 border-t border-[#EEF0EE]">
              <Link
                href={nextAction}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl border border-[#E5E7EB] hover:bg-[#F8FAF8] text-xs font-bold text-[#1F2937] transition-colors"
              >
                <span>{applicationStatus === "VERIFIED" ? "View Credentials" : "Continue Application"}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#9CA3AF]" />
              </Link>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

function ProgressItem({
  label,
  done,
  active,
}: {
  label: string;
  done?: boolean;
  active?: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5 text-xs">
      <span
        className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border text-[9px] ${
          done
            ? "border-[#2E7D32] bg-[#2E7D32] text-white"
            : active
            ? "border-[#FCD34D] bg-[#FEF3C7] text-[#F59E0B]"
            : "border-[#E5E7EB] bg-[#F8FAF8] text-[#9CA3AF]"
        }`}
      >
        {done ? (
          <Check className="h-2.5 w-2.5 stroke-[2.5]" />
        ) : active ? (
          <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
        ) : null}
      </span>
      <span
        className={`text-[11px] ${
          done ? "text-[#1F2937] font-medium" : active ? "font-bold text-[#F59E0B]" : "text-[#9CA3AF]"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="rounded-2xl border border-[#FCA5A5] bg-[#FEE2E2] p-8 text-center space-y-3">
      <AlertCircle className="mx-auto h-8 w-8 text-[#DC2626]" />
      <h3 className="text-sm font-bold text-[#DC2626]">Unable to load your expert dashboard</h3>
      <p className="text-xs text-[#DC2626] max-w-md mx-auto leading-relaxed">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] px-4 py-2 text-xs font-semibold text-white shadow-xs transition-colors cursor-pointer"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        <span>Try Again</span>
      </button>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 rounded-xl" />
          <Skeleton className="h-4 w-96 rounded-md" />
        </div>
        <Skeleton className="h-10 w-44 rounded-full" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-4 xl:col-span-3 space-y-5">
          <Skeleton className="h-72 rounded-[24px]" />
          <Skeleton className="h-64 rounded-[24px]" />
        </div>
        <div className="lg:col-span-8 xl:col-span-6 space-y-5">
          <Skeleton className="h-56 rounded-[24px]" />
          <Skeleton className="h-80 rounded-[24px]" />
        </div>
        <div className="lg:col-span-12 xl:col-span-3 space-y-5">
          <Skeleton className="h-60 rounded-[24px]" />
          <Skeleton className="h-72 rounded-[24px]" />
        </div>
      </div>
    </div>
  );
}
