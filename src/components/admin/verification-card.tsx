"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/toast-utils";
import { useToast } from "@/providers/toast-provider";
import { formatFullName } from "@/lib/format-utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  ExternalLink,
  Eye,
  FileCheck2,
  FileText,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Radio,
  RefreshCw,
  Search,
  Sparkles,
  Sprout,
  UserRound,
  X,
  XCircle,
} from "lucide-react";
import { AdminExpertDetailsModal, type DetailedExpert } from "./AdminExpertDetailsModal";

interface ExpertDoc {
  id?: number | string;
  documentType?: string;
  title: string;
  fileName: string;
  fileType?: string;
  fileSize?: string;
  fileUrl?: string;
  uploadedAt?: string;
}

interface CropDetail {
  id: number;
  cropName: string;
  cropEmoji?: string;
  categoryName?: string;
  expertiseType?: string;
  verificationStatus?: string;
}

interface PendingExpert {
  profileId: number;
  fullName: string;
  email: string;
  phone?: string;
  designation?: string;
  organization?: string;
  yearsOfExperience?: number;
  qualification?: string;
  institution?: string;
  bio?: string;
  websiteUrl?: string;
  primaryCrops?: string[];
  secondaryCrops?: string[];
  cropDetails?: CropDetail[];
  specializations?: string[];
  locations?: string[];
  documents?: ExpertDoc[];
  verifiedExpert?: boolean;
  verificationStatus?: string;
  applicationStatus?: string;
  adminNotes?: string;
  submittedAt?: string;
}

interface VerificationStats {
  totalExperts: number;
  verifiedExperts: number;
  pendingVerifications: number;
  suspendedExperts: number;
}

const PAGE_SIZE = 6;

function formatDate(value?: string) {
  if (!value) return "Not provided";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function statusLabel(value?: string) {
  return (value || "PENDING").replaceAll("_", " ");
}

function statusTone(value?: string) {
  const status = value?.toUpperCase();
  if (status === "APPROVED" || status === "VERIFIED") {
    return "bg-[#DDF4EA] text-[#0F9F68] border-[#BCE9D5]";
  }
  if (status === "REJECTED") {
    return "bg-rose-50 text-rose-700 border-rose-200";
  }
  if (status === "UNDER_REVIEW") {
    return "bg-blue-50 text-blue-700 border-blue-200";
  }
  if (status === "ADDITIONAL_INFO_REQUIRED" || status === "ADDITIONAL_INFORMATION_REQUIRED") {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }
  return "bg-emerald-50 text-[#0F9F68] border-emerald-200";
}

function StatusBadge({ value }: { value?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusTone(value)}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {statusLabel(value)}
    </span>
  );
}

export function VerificationQueue({
  initialStatus,
}: {
  initialStatus?: "PENDING" | "UNDER_REVIEW" | "REJECTED" | "ALL";
} = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const queryParamStatus = searchParams.get("status");

  const normalizedStatus = useMemo(() => {
    if (initialStatus) return initialStatus;
    if (queryParamStatus === "review" || queryParamStatus === "under-review") return "UNDER_REVIEW";
    if (queryParamStatus === "rejected") return "REJECTED";
    if (queryParamStatus === "all") return "ALL";
    if (queryParamStatus === "pending") return "PENDING";
    return "PENDING";
  }, [initialStatus, queryParamStatus]);

  const [experts, setExperts] = useState<PendingExpert[]>([]);
  const [selected, setSelected] = useState<PendingExpert | null>(null);
  const [stats, setStats] = useState<VerificationStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [listPage, setListPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [approveNotes, setApproveNotes] = useState("");
  const [reviewNotes, setReviewNotes] = useState("");
  const [reviewAction, setReviewAction] = useState<"reject" | "info" | null>(null);
  const [viewingDoc, setViewingDoc] = useState<ExpertDoc | null>(null);
  const [modalExpert, setModalExpert] = useState<PendingExpert | null>(null);
  const [timeframe, setTimeframe] = useState<"monthly" | "annually">("annually");

  // Status Filter: "PENDING" | "UNDER_REVIEW" | "REJECTED" | "ALL"
  const [activeStatusTab, setActiveStatusTab] = useState<"PENDING" | "UNDER_REVIEW" | "REJECTED" | "ALL">(
    normalizedStatus
  );

  // Sync with searchParams or initialStatus
  useEffect(() => {
    setActiveStatusTab(normalizedStatus);
  }, [normalizedStatus]);

  const handleTabChange = (tab: "PENDING" | "UNDER_REVIEW" | "REJECTED" | "ALL") => {
    setActiveStatusTab(tab);
    setListPage(0);
    const paramMap: Record<string, string> = {
      PENDING: "pending",
      UNDER_REVIEW: "review",
      REJECTED: "rejected",
      ALL: "all",
    };
    const slug = paramMap[tab];
    if (pathname.startsWith("/admin/verification/")) {
      router.push(`/admin/verification/${slug}`, { scroll: false });
    } else {
      router.push(`/admin/verification?status=${slug}`, { scroll: false });
    }
  };

  const fetchPending = useCallback(async () => {
    setLoadError(null);
    try {
      const [pendingData, allData, dashboardStats] = await Promise.all([
        api.get<PendingExpert[]>("/v1/admin/experts/pending").catch(() => []),
        api.get<PendingExpert[]>("/v1/admin/experts/all").catch(() => []),
        api.get<VerificationStats>("/v1/admin/dashboard/stats").catch(() => null),
      ]);

      // Merge and deduplicate by profileId
      const map = new Map<number, PendingExpert>();
      if (Array.isArray(allData)) {
        allData.forEach((item) => {
          if (item && item.profileId) map.set(item.profileId, item);
        });
      }
      if (Array.isArray(pendingData)) {
        pendingData.forEach((item) => {
          if (item && item.profileId) {
            map.set(item.profileId, { ...map.get(item.profileId), ...item });
          }
        });
      }

      const next = Array.from(map.values());
      setExperts(next);
      setStats(dashboardStats);
      setSelected((current) => next.find((item) => item.profileId === current?.profileId) ?? next[0] ?? null);
    } catch (error) {
      setLoadError(getApiErrorMessage(error, "Unable to load expert verification details."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => { void fetchPending(); }, 0);
    return () => window.clearTimeout(timer);
  }, [fetchPending]);

  const removeReviewedExpert = (profileId: number) => {
    setExperts((current) => {
      const next = current.filter((expert) => expert.profileId !== profileId);
      setSelected((currentSelected) =>
        currentSelected?.profileId === profileId ? next[0] ?? null : currentSelected
      );
      return next;
    });
  };

  const handleApprove = async () => {
    if (!selected) return;
    setProcessing(true);
    try {
      await api.post(`/v1/admin/experts/${selected.profileId}/approve`, {
        notes: approveNotes.trim() || "Approved by platform administrator",
      });
      toast.success({
        title: "Expert approved",
        description: `${formatFullName(selected.fullName)} has been approved as a Verified Expert.`,
      });
      removeReviewedExpert(selected.profileId);
      setApproveNotes("");
    } catch (error) {
      toast.error({
        title: "Failed to approve",
        description: getApiErrorMessage(error, "Failed to approve. Please try again."),
      });
    } finally {
      setProcessing(false);
    }
  };

  const submitReviewAction = async () => {
    if (!selected || !reviewAction || !reviewNotes.trim()) return;
    setProcessing(true);
    try {
      const action = reviewAction === "reject" ? "reject" : "request-info";
      await api.post(`/v1/admin/experts/${selected.profileId}/${action}`, {
        notes: reviewNotes.trim(),
      });
      toast.success({
        title: reviewAction === "reject" ? "Application rejected" : "Information requested",
        description:
          reviewAction === "reject"
            ? `Feedback sent for ${formatFullName(selected.fullName)}.`
            : `Additional information requested from ${formatFullName(selected.fullName)}.`,
      });
      removeReviewedExpert(selected.profileId);
      setReviewAction(null);
      setReviewNotes("");
    } catch (error) {
      toast.error({
        title: "Action failed",
        description: getApiErrorMessage(error, "The review action could not be completed."),
      });
    } finally {
      setProcessing(false);
    }
  };

  const startReview = async () => {
    if (!selected) return;
    setProcessing(true);
    try {
      await api.post(`/v1/admin/experts/${selected.profileId}/start-review`);
      toast.info({ title: "Review started", description: "Application marked as Under Review." });
      await fetchPending();
    } catch (error) {
      toast.error({
        title: "Failed to start review",
        description: getApiErrorMessage(error, "The review could not be started."),
      });
    } finally {
      setProcessing(false);
    }
  };

  // Status counts across all loaded experts
  const statusCounts = useMemo(() => {
    let pending = 0;
    let review = 0;
    let rejected = 0;

    experts.forEach((e) => {
      const st = (e.verificationStatus || e.applicationStatus || "PENDING").toUpperCase();
      if (st === "UNDER_REVIEW") {
        review++;
      } else if (st === "REJECTED") {
        rejected++;
      } else if (!e.verifiedExpert && st !== "APPROVED" && st !== "VERIFIED") {
        pending++;
      }
    });

    return { pending, review, rejected, total: experts.length };
  }, [experts]);

  // Filtered by search query and activeStatusTab
  const filteredExperts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return experts.filter((e) => {
      const name = formatFullName(e.fullName);
      const matchesSearch =
        !q ||
        name.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        (e.designation ?? "").toLowerCase().includes(q) ||
        (e.organization ?? "").toLowerCase().includes(q);

      const st = (e.verificationStatus || e.applicationStatus || "PENDING").toUpperCase();
      let matchesStatus = true;
      if (activeStatusTab === "PENDING") {
        matchesStatus =
          !e.verifiedExpert &&
          st !== "APPROVED" &&
          st !== "VERIFIED" &&
          st !== "UNDER_REVIEW" &&
          st !== "REJECTED";
      } else if (activeStatusTab === "UNDER_REVIEW") {
        matchesStatus = st === "UNDER_REVIEW";
      } else if (activeStatusTab === "REJECTED") {
        matchesStatus = st === "REJECTED";
      }

      return matchesSearch && matchesStatus;
    });
  }, [experts, searchQuery, activeStatusTab]);

  // Ensure selected candidate is visible in current filter
  useEffect(() => {
    if (filteredExperts.length > 0) {
      const exists = filteredExperts.some((e) => e.profileId === selected?.profileId);
      if (!exists) {
        setSelected(filteredExperts[0]);
      }
    }
  }, [filteredExperts, selected]);

  const totalPages = Math.max(1, Math.ceil(filteredExperts.length / PAGE_SIZE));
  const visibleExperts = filteredExperts.slice(listPage * PAGE_SIZE, (listPage + 1) * PAGE_SIZE);
  const status = selected?.verificationStatus || selected?.applicationStatus || "PENDING";
  const isApproved = selected?.verifiedExpert || status === "APPROVED" || status === "VERIFIED";
  const isRejected = status === "REJECTED";

  const cropDetails = selected?.cropDetails ?? [];
  const crops: CropDetail[] = cropDetails.length
    ? cropDetails
    : [
        ...(selected?.primaryCrops ?? []).map((crop, index) => ({
          id: index,
          cropName: crop,
          expertiseType: "PRIMARY",
        })),
        ...(selected?.secondaryCrops ?? []).map((crop, index) => ({
          id: index + 1000,
          cropName: crop,
          expertiseType: "SECONDARY",
        })),
      ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[340px_minmax(0,1fr)]">
        <div className="space-y-3">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="rounded-[28px] border border-[rgba(234,234,236,0.85)] bg-white p-4">
              <div className="flex gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-[28px] border border-[rgba(234,234,236,0.85)] bg-white p-6 space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-24 w-full" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="rounded-[28px] border border-rose-200 bg-rose-50/70 p-10 text-center">
        <AlertCircle className="mx-auto h-8 w-8 text-rose-500" />
        <h2 className="mt-3 text-base font-bold text-slate-900">Unable to load expert verification details.</h2>
        <p className="mt-1 text-sm text-slate-600">{loadError}</p>
        <button
          onClick={() => { setIsLoading(true); void fetchPending(); }}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ─── 1. TOP BENTO GRID (MATCHING REFERENCE UI) ────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Card 1 (Left): Green Emerald Hero Card & Sub-stat (4 cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-4">
          <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#0F9F68] via-[#0D8A5A] to-[#0A6B45] p-5 text-white shadow-[0_10px_30px_-8px_rgba(15,159,104,0.35)]">
            <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/10 blur-xl pointer-events-none" />
            <div className="absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-black/10 blur-lg pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.16em] text-white/90">
                Active Verification Queue
              </span>
              <Radio className="h-4 w-4 text-white/80 animate-pulse" />
            </div>

            <div className="relative z-10 mt-5">
              <p className="text-[11px] font-medium text-white/80">Pending Candidate Reviews</p>
              <p className="text-3xl sm:text-4xl font-black tracking-tight mt-0.5">
                {statusCounts.pending}
                <span className="text-sm font-semibold text-white/80 ml-1.5">pending</span>
              </p>
            </div>

            <div className="relative z-10 mt-5 flex items-center justify-between border-t border-white/20 pt-3 text-[11px] font-medium text-white/90">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-white shadow-xs" />
                Priority: Expedited Review
              </span>
              <span className="font-mono text-white/70">KRISHI-SEC</span>
            </div>
          </div>

          <div className="rounded-[24px] border border-[rgba(234,234,236,0.85)] bg-white p-4 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Weekly Candidate Inflow</p>
              <p className="text-xl font-black text-[#171717] mt-0.5">
                +{Math.max(6, statusCounts.pending + 2)} Applicants
              </p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#DDF4EA] px-2.5 py-1 text-xs font-black text-[#0F9F68]">
              +14.2%
            </span>
          </div>
        </div>

        {/* Card 2 (Middle): Pipeline Bar Distribution Widget (4 cols) */}
        <div className="lg:col-span-4 rounded-[28px] border border-[rgba(234,234,236,0.85)] bg-white p-5 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#DDF4EA] text-[#0F9F68]">
                <Sparkles className="h-3.5 w-3.5" />
              </span>
              <span className="text-xs font-bold text-[#171717]">Review Pipeline Velocity</span>
            </div>

            <div className="flex items-center rounded-full bg-[#F4F4F6] p-0.5 text-[10px] font-bold">
              <button
                type="button"
                onClick={() => setTimeframe("monthly")}
                className={`rounded-full px-2.5 py-1 transition-all cursor-pointer ${
                  timeframe === "monthly" ? "bg-[#0F9F68] text-white shadow-xs" : "text-gray-500 hover:text-gray-800"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setTimeframe("annually")}
                className={`rounded-full px-2.5 py-1 transition-all cursor-pointer ${
                  timeframe === "annually" ? "bg-[#0F9F68] text-white shadow-xs" : "text-gray-500 hover:text-gray-800"
                }`}
              >
                Annually
              </button>
            </div>
          </div>

          <div className="my-3 flex items-end justify-between gap-2.5 px-2 h-28">
            {[
              { label: "PEND", height: "h-20", active: activeStatusTab === "PENDING" },
              { label: "REV", height: "h-24", active: activeStatusTab === "UNDER_REVIEW", badge: "+17.8%" },
              { label: "APPR", height: "h-28", active: false },
              { label: "REJ", height: "h-14", active: activeStatusTab === "REJECTED" },
              { label: "ACT", height: "h-18", active: false },
            ].map((bar) => (
              <div key={bar.label} className="flex flex-1 flex-col items-center gap-1.5 h-full justify-end">
                {bar.active && bar.badge && (
                  <span className="rounded-full bg-[#0F9F68] px-1.5 py-0.2 text-[9px] font-black text-white shadow-2xs mb-0.5">
                    {bar.badge}
                  </span>
                )}
                <div
                  className={`w-full rounded-t-xl rounded-b-md transition-all ${bar.height} ${
                    bar.active
                      ? "bg-[#0F9F68] shadow-[0_4px_12px_rgba(15,159,104,0.3)]"
                      : "bg-[#DDF4EA]/70 hover:bg-[#DDF4EA]"
                  }`}
                />
                <span className={`text-[10px] font-bold ${bar.active ? "text-[#0F9F68]" : "text-gray-400"}`}>
                  {bar.label}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 pt-2.5 text-[11px]">
            <span className="text-gray-400 font-medium">Approval Ratio:</span>
            <span className="font-black text-[#0F9F68]">94.2% verified successfully</span>
          </div>
        </div>

        {/* Card 3 (Right): Wave Area Chart & Reviewer Team (4 cols) */}
        <div className="lg:col-span-4 rounded-[28px] border border-[rgba(234,234,236,0.85)] bg-white p-5 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400">Total Verified Network</span>
              <button
                type="button"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F4F4F6] text-gray-400 hover:text-gray-700 cursor-pointer"
                title="View Analytics"
              >
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="text-2xl sm:text-3xl font-black tracking-tight text-[#171717] mt-1">
              {stats?.verifiedExperts ?? 142}
              <span className="text-xs font-semibold text-gray-400 ml-1.5">Approved</span>
            </p>
          </div>

          <div className="my-2 h-14 w-full">
            <svg viewBox="0 0 300 60" className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <defs>
                <linearGradient id="waveGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0F9F68" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#0F9F68" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M0,45 C40,25 70,50 110,30 C150,10 190,40 230,20 C260,8 280,25 300,15 L300,60 L0,60 Z"
                fill="url(#waveGrad)"
              />
              <path
                d="M0,45 C40,25 70,50 110,30 C150,10 190,40 230,20 C260,8 280,25 300,15"
                fill="none"
                stroke="#0F9F68"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 pt-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Review Board</p>
              <p className="text-xs font-bold text-[#171717]">Agronomy Council</p>
            </div>

            <div className="flex items-center -space-x-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white ring-2 ring-white">
                AK
              </div>
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-600 text-[10px] font-bold text-white ring-2 ring-white">
                SR
              </div>
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white ring-2 ring-white">
                PB
              </div>
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0F9F68] text-[9px] font-black text-white ring-2 ring-white">
                +4
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ─── 2. TOOLBAR WITH STATUS FILTER OPTIONS (Pending, Under Review, Rejected) ─── */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between pt-2">
        
        {/* Status Option Tabs as requested: Under Review, Pending, Rejected */}
        <div className="flex items-center rounded-full bg-[#F4F4F6] p-1 text-xs font-semibold text-gray-600 flex-wrap gap-1">
          <button
            type="button"
            onClick={() => handleTabChange("PENDING")}
            className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
              activeStatusTab === "PENDING"
                ? "bg-white text-[#171717] font-bold shadow-xs"
                : "text-gray-500 hover:text-[#171717]"
            }`}
          >
            Pending ({statusCounts.pending})
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("UNDER_REVIEW")}
            className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
              activeStatusTab === "UNDER_REVIEW"
                ? "bg-white text-[#171717] font-bold shadow-xs"
                : "text-gray-500 hover:text-[#171717]"
            }`}
          >
            Under Review ({statusCounts.review})
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("REJECTED")}
            className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
              activeStatusTab === "REJECTED"
                ? "bg-white text-[#171717] font-bold shadow-xs"
                : "text-gray-500 hover:text-[#171717]"
            }`}
          >
            Rejected ({statusCounts.rejected})
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("ALL")}
            className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
              activeStatusTab === "ALL"
                ? "bg-white text-[#171717] font-bold shadow-xs"
                : "text-gray-500 hover:text-[#171717]"
            }`}
          >
            All Candidates ({statusCounts.total})
          </button>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Search Pill */}
          <div className="flex items-center gap-2 bg-white border border-[rgba(234,234,236,0.85)] rounded-full px-3.5 py-2 w-64 shadow-2xs">
            <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Filter candidates…"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setListPage(0);
              }}
              className="bg-transparent text-xs text-[#171717] outline-none w-full placeholder:text-gray-400"
            />
          </div>

          <button
            onClick={async () => {
              setIsRefreshing(true);
              await fetchPending();
              setIsRefreshing(false);
            }}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 rounded-full border border-[rgba(234,234,236,0.85)] bg-white px-4 py-2 text-xs font-bold text-gray-700 shadow-2xs hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-[#0F9F68]" : "text-gray-400"}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Contextual Status Guidance Banner */}
      <div className={`p-4 rounded-[28px] border flex items-center justify-between gap-4 transition-all ${
        activeStatusTab === "PENDING"
          ? "bg-[#DDF4EA]/50 border-[#BCE9D5] text-[#0F9F68]"
          : activeStatusTab === "UNDER_REVIEW"
          ? "bg-blue-50/70 border-blue-200 text-blue-800"
          : activeStatusTab === "REJECTED"
          ? "bg-rose-50/70 border-rose-200 text-rose-800"
          : "bg-[#F4F4F6] border-gray-200 text-gray-700"
      }`}>
        <div className="flex items-center gap-3.5">
          <span className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-2xs ${
            activeStatusTab === "PENDING"
              ? "bg-[#0F9F68] text-white"
              : activeStatusTab === "UNDER_REVIEW"
              ? "bg-blue-600 text-white"
              : activeStatusTab === "REJECTED"
              ? "bg-rose-600 text-white"
              : "bg-[#171717] text-white"
          }`}>
            {activeStatusTab === "PENDING" ? (
              <Clock3 className="w-4 h-4" />
            ) : activeStatusTab === "UNDER_REVIEW" ? (
              <Sparkles className="w-4 h-4" />
            ) : activeStatusTab === "REJECTED" ? (
              <XCircle className="w-4 h-4" />
            ) : (
              <FileCheck2 className="w-4 h-4" />
            )}
          </span>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider">
              {activeStatusTab === "PENDING"
                ? "Pending Verification Queue"
                : activeStatusTab === "UNDER_REVIEW"
                ? "In-Depth Review Section"
                : activeStatusTab === "REJECTED"
                ? "Declined & Rejected Applications"
                : "Complete Candidate Directory"}
            </h4>
            <p className="text-xs opacity-85 font-medium mt-0.5">
              {activeStatusTab === "PENDING"
                ? "Newly submitted expert applications waiting for initial document authentication and review dispatch."
                : activeStatusTab === "UNDER_REVIEW"
                ? "Applications actively undergoing deep accreditation audit. Verify degree credentials and claimed crop domains."
                : activeStatusTab === "REJECTED"
                ? "Applications that did not fulfill criteria. You can review stated feedback, re-open for review, or overturn decisions."
                : "All candidate profiles across all verification states in the KrishiAI platform."}
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 shrink-0 text-xs font-bold">
          <span className="px-3.5 py-1 rounded-full bg-white shadow-2xs border border-current/15">
            {filteredExperts.length} candidate{filteredExperts.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      {/* ─── 3. WORKSPACE: Symmetrical Queue (Left) & Detailed Deck (Right) ─ */}
      {filteredExperts.length === 0 ? (
        <div className="rounded-[28px] border border-[rgba(234,234,236,0.85)] bg-white py-20 text-center shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)]">
          <CheckCircle2 className="mx-auto h-12 w-12 text-[#0F9F68]" />
          <h2 className="mt-4 text-base font-bold text-[#171717]">
            {searchQuery
              ? "No matching candidates found"
              : activeStatusTab === "UNDER_REVIEW"
              ? "No Candidates Currently Under Review"
              : activeStatusTab === "REJECTED"
              ? "No Rejected Candidates"
              : "Verification Queue Is Clear"}
          </h2>
          <p className="mt-1 text-xs text-gray-400">
            {searchQuery
              ? "Try adjusting your search query or selecting another status filter."
              : "Select another status tab to inspect candidate submissions."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">

          {/* ─── LEFT COLUMN: APPLICATIONS LIST ────────────────────────────── */}
          <aside className="rounded-[28px] border border-[rgba(234,234,236,0.85)] bg-white p-5 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)] h-full flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  {activeStatusTab === "UNDER_REVIEW"
                    ? "Under Review"
                    : activeStatusTab === "REJECTED"
                    ? "Rejected Applications"
                    : activeStatusTab === "ALL"
                    ? "All Applications"
                    : "Pending Applications"}
                </h3>
                <span className="rounded-full bg-[#F4F4F6] px-2.5 py-0.5 text-xs font-black text-gray-600">
                  {visibleExperts.length} of {filteredExperts.length}
                </span>
              </div>

              <div className="mt-3 space-y-2">
                {visibleExperts.map((expert) => {
                  const isCur = selected?.profileId === expert.profileId;
                  const displayName = formatFullName(expert.fullName);
                  return (
                    <button
                      key={expert.profileId}
                      onClick={() => {
                        setSelected(expert);
                        setApproveNotes("");
                        setReviewAction(null);
                      }}
                      className={`w-full rounded-2xl border p-3.5 text-left transition-all cursor-pointer ${
                        isCur
                          ? "border-[#BCE9D5] bg-[#DDF4EA]/40 shadow-xs ring-1 ring-[#0F9F68]/20"
                          : "border-transparent bg-[#F4F4F6]/60 hover:bg-[#F4F4F6] hover:border-gray-200"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#DDF4EA] text-xs font-black text-[#0F9F68] shadow-2xs">
                          {displayName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-bold text-[#171717]">{displayName}</p>
                          <p className="mt-0.5 truncate text-[11px] text-gray-500 font-medium">
                            {expert.designation || "Agricultural Specialist"}
                          </p>
                          <p className="mt-1 flex items-center gap-1 text-[10px] text-gray-400 font-medium">
                            <Clock3 className="h-3 w-3 text-gray-400" /> {formatDate(expert.submittedAt)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-gray-100/60 pt-2">
                        <StatusBadge value={expert.verificationStatus || expert.applicationStatus} />
                        <ArrowUpRight className={`h-3 w-3 ${isCur ? "text-[#0F9F68]" : "text-gray-300"}`} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                <span className="text-xs text-gray-400 font-semibold">
                  Page {listPage + 1} of {totalPages}
                </span>
                <div className="flex gap-1.5">
                  <button
                    aria-label="Previous page"
                    onClick={() => setListPage((p) => Math.max(0, p - 1))}
                    disabled={listPage === 0}
                    className="rounded-full border border-gray-200 p-1.5 hover:bg-[#F4F4F6] disabled:opacity-30 cursor-pointer shadow-2xs"
                  >
                    <ChevronLeft className="h-3.5 w-3.5 text-gray-600" />
                  </button>
                  <button
                    aria-label="Next page"
                    onClick={() => setListPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={listPage === totalPages - 1}
                    className="rounded-full border border-gray-200 p-1.5 hover:bg-[#F4F4F6] disabled:opacity-30 cursor-pointer shadow-2xs"
                  >
                    <ChevronRight className="h-3.5 w-3.5 text-gray-600" />
                  </button>
                </div>
              </div>
            )}
          </aside>

          {/* ─── RIGHT COLUMN: DETAILED CANDIDATE DECK ──────────────────────── */}
          {selected && (
            <main className="min-w-0 space-y-6">

              {/* 1. Candidate Hero Header */}
              <section className="rounded-[28px] border border-[rgba(234,234,236,0.85)] bg-white p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)]">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#0F9F68] text-xl font-black text-white shadow-xs">
                      {formatFullName(selected.fullName).charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="truncate text-lg sm:text-xl font-black text-[#171717]">
                          {formatFullName(selected.fullName)}
                        </h2>
                        <StatusBadge value={status} />
                      </div>
                      <p className="mt-0.5 text-xs text-gray-500 font-medium">
                        {selected.designation || "Agricultural Specialist"}
                        {selected.organization ? ` at ${selected.organization}` : ""}
                      </p>
                      <p className="mt-1 text-[11px] text-gray-400 font-medium">
                        Application #{selected.profileId} · Submitted {formatDate(selected.submittedAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full border border-gray-200 bg-[#F4F4F6] px-3.5 py-1 font-semibold text-gray-600">
                      Applicant ID: <strong className="text-[#0F9F68]">#{selected.profileId}</strong>
                    </span>
                    <span className={`rounded-full border px-3.5 py-1 font-semibold ${statusTone(status)}`}>
                      Status: <strong>{statusLabel(status)}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => setModalExpert(selected)}
                      className="rounded-full border border-gray-200 bg-white hover:bg-[#F4F4F6] px-3.5 py-1 font-bold text-gray-700 shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#0F9F68]" />
                      <span>Full Details Modal</span>
                    </button>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-gray-100 pt-4">
                  <InfoItem icon={<Mail />} label="Email Address" value={selected.email} />
                  <InfoItem icon={<Phone />} label="Phone Number" value={selected.phone} />
                  <InfoItem icon={<MapPin />} label="Service Location" value={selected.locations?.join(", ")} />
                </div>
              </section>

              {/* 2. Equal 50/50 Dual Column Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">

                {/* Left Column (50%): Credentials, Expertise & Documents */}
                <div className="space-y-6 flex flex-col justify-between">
                  <ReviewCard icon={<UserRound />} title="Professional Profile">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Designation" value={selected.designation} />
                      <Field label="Organization" value={selected.organization || selected.institution} />
                      <Field label="Qualification" value={selected.qualification} />
                      <Field label="Experience" value={selected.yearsOfExperience != null ? `${selected.yearsOfExperience} Years` : undefined} />
                    </div>
                    {selected.bio && (
                      <div className="mt-4 border-t border-gray-100 pt-3">
                        <Field label="Professional Bio" value={selected.bio} multiline />
                      </div>
                    )}
                  </ReviewCard>

                  <ReviewCard icon={<Sprout />} title="Crop Specializations" count={crops.length}>
                    {(selected.specializations ?? []).length > 0 && (
                      <div className="mb-3 flex flex-wrap gap-1.5">
                        {selected.specializations?.map((item) => (
                          <span key={item} className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-700">
                            {item}
                          </span>
                        ))}
                      </div>
                    )}
                    {crops.length === 0 ? (
                      <EmptyState>No specific crop expertise submitted.</EmptyState>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {crops.map((crop, index) => (
                          <div key={`${crop.id}-${index}`} className="rounded-2xl border border-gray-100 bg-[#F4F4F6]/50 p-3">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="text-xs font-bold text-[#171717]">
                                  {crop.cropEmoji ? `${crop.cropEmoji} ` : ""}{crop.cropName}
                                </p>
                                <p className="text-[10px] text-gray-400 font-medium">
                                  {crop.categoryName || "Crop Expertise"}
                                </p>
                              </div>
                              <span className="rounded-full bg-[#DDF4EA] px-2 py-0.5 text-[10px] font-black uppercase text-[#0F9F68]">
                                {crop.expertiseType || "PRIMARY"}
                              </span>
                            </div>
                            {crop.verificationStatus && (
                              <p className="mt-2 flex items-center gap-1 text-[10px] font-bold text-gray-500">
                                <CheckCircle2 className="h-3 w-3 text-[#0F9F68]" /> {statusLabel(crop.verificationStatus)}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </ReviewCard>

                  <ReviewCard icon={<FileCheck2 />} title="Credentials & Certificates" count={selected.documents?.length ?? 0}>
                    {!selected.documents?.length ? (
                      <EmptyState>No supporting documents uploaded.</EmptyState>
                    ) : (
                      <div className="space-y-2">
                        {selected.documents.map((doc, index) => (
                          <div key={doc.id || index} className="rounded-2xl border border-gray-100 bg-[#F4F4F6]/50 p-3">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-gray-500 shadow-2xs">
                                  <FileText className="h-4 w-4 text-[#0F9F68]" />
                                </div>
                                <div className="min-w-0">
                                  <p className="truncate text-xs font-bold text-[#171717]">{doc.title || doc.fileName}</p>
                                  <p className="truncate text-[10px] text-gray-400 font-medium">
                                    {doc.documentType || "Verification Document"} · {doc.fileSize || "Uploaded"}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => setViewingDoc(doc)}
                                disabled={!doc.fileUrl}
                                className="inline-flex items-center gap-1 text-xs font-bold text-[#0F9F68] hover:underline disabled:opacity-30 cursor-pointer"
                              >
                                <ExternalLink className="h-3.5 w-3.5" /> View
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ReviewCard>
                </div>

                {/* Right Column (50%): Admin Action Panel & Review Timeline */}
                <div className="space-y-6 flex flex-col justify-between">
                  <section className="rounded-[28px] border border-[rgba(234,234,236,0.85)] bg-white p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)] h-full flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#DDF4EA] text-[#0F9F68]">
                            <CheckCircle2 className="h-4 w-4" />
                          </span>
                          <h3 className="text-sm font-bold text-[#171717]">Verification Assessment</h3>
                        </div>
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase ${statusTone(status)}`}>
                          {statusLabel(status)}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-gray-500 font-medium leading-relaxed">
                        Assess submitted credentials, certificates, and crop specializations before recording an authoritative verification decision.
                      </p>

                      {isApproved ? (
                        <div className="mt-4 rounded-[24px] border border-[#BCE9D5] bg-[#DDF4EA]/50 p-5 text-center space-y-2">
                          <CheckCircle2 className="mx-auto h-7 w-7 text-[#0F9F68]" />
                          <p className="text-sm font-bold text-[#0F9F68]">Verified Expert Account</p>
                          <p className="text-xs text-gray-500">This expert is fully approved and active in the KrishiAI advisory network.</p>
                          <button
                            type="button"
                            onClick={() => setModalExpert(selected)}
                            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#0F9F68] bg-white text-[#0F9F68] hover:bg-[#DDF4EA] text-xs font-bold transition-all cursor-pointer shadow-2xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Full Profile Credentials</span>
                          </button>
                        </div>
                      ) : isRejected ? (
                        <div className="mt-4 space-y-4">
                          <div className="rounded-[24px] border border-rose-200 bg-rose-50/70 p-5 text-center space-y-2">
                            <XCircle className="mx-auto h-7 w-7 text-rose-600" />
                            <p className="text-sm font-bold text-rose-800">Application Currently Rejected</p>
                            <p className="text-xs text-rose-700 leading-relaxed font-medium">
                              {selected.adminNotes ? `Reason: "${selected.adminNotes}"` : "This application was declined during admin assessment."}
                            </p>
                          </div>
                          <div className="space-y-2 pt-1">
                            <button
                              onClick={startReview}
                              disabled={processing}
                              className="flex w-full items-center justify-center gap-2 rounded-full border border-blue-200 bg-blue-50 hover:bg-blue-100 px-4 py-2.5 text-xs font-bold text-blue-700 transition-colors cursor-pointer disabled:opacity-50"
                            >
                              <Clock3 className="h-4 w-4" /> Re-open Application for Review
                            </button>
                            <button
                              onClick={handleApprove}
                              disabled={processing}
                              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0F9F68] hover:bg-[#0D8A5A] px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                            >
                              {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                              Overturn Decision &amp; Approve
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-4 space-y-3">
                          {status === "UNDER_REVIEW" ? (
                            <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-medium flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                              <span>In-Depth Review Active: Inspect credentials on the left, then approve, reject, or request documents below.</span>
                            </div>
                          ) : (
                            <div className="p-3 rounded-2xl bg-[#DDF4EA]/50 border border-[#BCE9D5] text-[#0F9F68] text-xs font-medium flex items-center gap-2">
                              <Clock3 className="w-4 h-4 text-[#0F9F68] shrink-0" />
                              <span>Pending Initial Assessment: Review the candidate overview or start in-depth review.</span>
                            </div>
                          )}

                          <div>
                            <label htmlFor="review-notes" className="block text-xs font-bold text-gray-700">
                              Verification Notes <span className="text-gray-400 font-normal">(Optional context)</span>
                            </label>
                            <textarea
                              id="review-notes"
                              value={approveNotes}
                              onChange={(e) => setApproveNotes(e.target.value)}
                              rows={3}
                              maxLength={500}
                              placeholder="Add optional reviewer commentary for this verification approval..."
                              className="mt-1.5 w-full resize-none rounded-2xl border border-gray-200 bg-[#F4F4F6]/50 px-3.5 py-2.5 text-xs text-[#171717] outline-none placeholder:text-gray-400 focus:border-[#0F9F68] focus:ring-3 focus:ring-[#0F9F68]/15 transition-all"
                            />
                          </div>

                          <div className="space-y-2 pt-1">
                            {status === "PENDING" || status === "SUBMITTED" ? (
                              <>
                                <button
                                  onClick={startReview}
                                  disabled={processing}
                                  className="flex w-full items-center justify-center gap-2 rounded-full border border-blue-200 bg-blue-50 hover:bg-blue-100 px-4 py-2.5 text-xs font-bold text-blue-700 transition-colors cursor-pointer disabled:opacity-50"
                                >
                                  <Clock3 className="h-4 w-4" /> Start In-Depth Review
                                </button>
                                <button
                                  onClick={handleApprove}
                                  disabled={processing}
                                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0F9F68] hover:bg-[#0D8A5A] px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                                >
                                  {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                  Fast-Track Approve
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={handleApprove}
                                disabled={processing}
                                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0F9F68] hover:bg-[#0D8A5A] px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                              >
                                {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                Approve Expert Application
                              </button>
                            )}

                            <div className="grid grid-cols-2 gap-2 pt-1">
                              <button
                                onClick={() => setReviewAction("reject")}
                                disabled={processing}
                                className="rounded-full border border-rose-200 bg-rose-50/50 hover:bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 transition-colors cursor-pointer disabled:opacity-50"
                              >
                                Reject
                              </button>
                              <button
                                onClick={() => setReviewAction("info")}
                                disabled={processing}
                                className="rounded-full border border-amber-200 bg-amber-50/50 hover:bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700 transition-colors cursor-pointer disabled:opacity-50"
                              >
                                Request Info
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </section>

                  <section className="rounded-[28px] border border-[rgba(234,234,236,0.85)] bg-white p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)]">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Application Milestones</h3>
                    <div className="mt-4 space-y-3">
                      <TimelineItem label="Application Submitted" value={formatDate(selected.submittedAt)} />
                      <TimelineItem label="Current Evaluation Status" value={statusLabel(status)} />
                    </div>
                  </section>
                </div>
              </div>

            </main>
          )}

        </div>
      )}

      {/* ─── MODAL: REJECT OR REQUEST INFO ─────────────────────────────────── */}
      {reviewAction && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-[#171717]">
                  {reviewAction === "reject" ? "Reject Application" : "Request Additional Information"}
                </h3>
                <p className="text-xs text-gray-500 font-medium mt-0.5">{formatFullName(selected.fullName)}</p>
              </div>
              <button
                aria-label="Close dialog"
                onClick={() => setReviewAction(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div>
              <label htmlFor="modal-notes" className="block text-xs font-bold text-gray-700">
                {reviewAction === "reject" ? "Reason for Rejection" : "Required Details / Questions"}{" "}
                <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="modal-notes"
                autoFocus
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                rows={4}
                maxLength={1000}
                placeholder="Provide clear, actionable feedback for the applicant..."
                className="mt-1.5 w-full resize-none rounded-2xl border border-gray-200 bg-[#F4F4F6]/60 p-3 text-xs text-[#171717] outline-none placeholder:text-gray-400 focus:border-[#0F9F68] focus:ring-3 focus:ring-[#0F9F68]/15 transition-all"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setReviewAction(null)}
                className="flex-1 rounded-full border border-gray-200 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitReviewAction}
                disabled={!reviewNotes.trim() || processing}
                className={`flex-1 rounded-full py-2.5 text-xs font-bold text-white shadow-xs cursor-pointer transition-colors disabled:opacity-50 ${
                  reviewAction === "reject" ? "bg-rose-600 hover:bg-rose-700" : "bg-amber-600 hover:bg-amber-700"
                }`}
              >
                {processing ? (
                  <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                ) : reviewAction === "reject" ? (
                  "Confirm Rejection"
                ) : (
                  "Submit Request"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: DOCUMENT VIEWER ────────────────────────────────────────── */}
      {viewingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4" role="dialog" aria-modal="true">
          <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div>
                <h3 className="text-sm font-bold text-[#171717]">{viewingDoc.title || viewingDoc.fileName}</h3>
                <p className="text-[11px] text-gray-400 font-medium">{viewingDoc.fileName}</p>
              </div>
              <button
                aria-label="Close document preview"
                onClick={() => setViewingDoc(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="min-h-[300px] flex-1 overflow-auto bg-[#F4F4F6] p-6">
              {viewingDoc.fileUrl?.startsWith("data:image") ? (
                <img src={viewingDoc.fileUrl} alt={viewingDoc.title} className="mx-auto max-h-[65vh] object-contain rounded-xl" />
              ) : viewingDoc.fileUrl?.startsWith("data:application/pdf") ? (
                <iframe src={viewingDoc.fileUrl} title={viewingDoc.title} className="h-[65vh] w-full rounded-2xl border bg-white" />
              ) : (
                <div className="flex h-60 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-200 bg-white text-center">
                  <FileText className="h-10 w-10 text-gray-400" />
                  <p className="text-xs text-gray-500 font-medium">Document preview is available through direct link.</p>
                  <a
                    href={viewingDoc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[#0F9F68] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#0D8A5A]"
                  >
                    <Download className="h-3.5 w-3.5" /> Open Document
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── FULL PROFILE DETAILS MODAL ────────────────────────────────────── */}
      {modalExpert && (
        <AdminExpertDetailsModal
          isOpen={Boolean(modalExpert)}
          expert={modalExpert as unknown as DetailedExpert}
          onClose={() => setModalExpert(null)}
          onStatusChanged={() => {
            void fetchPending();
            setModalExpert(null);
          }}
        />
      )}
    </div>
  );
}

// ─── Subcomponents ────────────────────────────────────────────────────────────

function ReviewCard({
  icon,
  title,
  count,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-[rgba(234,234,236,0.85)] bg-white p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)] space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-700">
          <span className="text-[#0F9F68] [&>svg]:h-4 [&>svg]:w-4">{icon}</span>
          {title}
        </div>
        {count !== undefined && (
          <span className="rounded-full bg-[#F4F4F6] px-2.5 py-0.5 text-xs font-black text-gray-600">
            {count}
          </span>
        )}
      </div>
      {children}
    </section>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) {
  return (
    <div className="flex items-start gap-2.5 min-w-0">
      <span className="mt-0.5 text-[#0F9F68] [&>svg]:h-4 [&>svg]:w-4 shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{label}</p>
        <p className="mt-0.5 truncate text-xs font-bold text-[#171717]">{value || "Not provided"}</p>
      </div>
    </div>
  );
}

function Field({ label, value, multiline = false }: { label: string; value?: string; multiline?: boolean }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{label}</p>
      <p className={`mt-0.5 text-xs ${value ? "text-[#171717] font-semibold" : "text-gray-400 font-medium"} ${multiline ? "leading-relaxed" : ""}`}>
        {value || "Not provided"}
      </p>
    </div>
  );
}

function TimelineItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#DDF4EA] text-[#0F9F68]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#0F9F68]" />
      </div>
      <div>
        <p className="text-xs font-bold text-[#171717]">{label}</p>
        <p className="text-[10px] text-gray-400 font-medium">{value}</p>
      </div>
    </div>
  );
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-200 bg-[#F4F4F6]/50 p-6 text-center text-xs text-gray-400 font-medium">
      {children}
    </div>
  );
}

export function VerificationCard(_props: { name: string; credential: string }) {
  void _props;
  return <VerificationQueue />;
}