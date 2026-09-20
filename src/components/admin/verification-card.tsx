"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
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
  RefreshCw,
  Search,
  Sprout,
  UserRound,
  X,
  XCircle,
} from "lucide-react";
import { AdminExpertDetailsModal, type DetailedExpert } from "./AdminExpertDetailsModal";
import { UserAvatar } from "@/components/ui/avatar";

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
  profileImage?: string;
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
    return "bg-[#E8F5E9] text-[#2E7D32] border-[#A5D6A7]";
  }
  if (status === "REJECTED") {
    return "bg-[#FEE2E2] text-[#DC2626] border-[#FCA5A5]";
  }
  if (status === "UNDER_REVIEW") {
    return "bg-[#DBEAFE] text-[#2563EB] border-[#93C5FD]";
  }
  if (status === "ADDITIONAL_INFO_REQUIRED" || status === "ADDITIONAL_INFORMATION_REQUIRED") {
    return "bg-[#FEF3C7] text-[#F59E0B] border-[#FCD34D]";
  }
  return "bg-[#FEF3C7] text-[#F59E0B] border-[#FCD34D]";
}

function StatusBadge({ value }: { value?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusTone(value)}`}>
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

  // Status Filter: "PENDING" | "UNDER_REVIEW" | "REJECTED" | "ALL"
  const [activeStatusTab, setActiveStatusTab] = useState<"PENDING" | "UNDER_REVIEW" | "REJECTED" | "ALL">(
    normalizedStatus
  );

  // Sync with searchParams or initialStatus
  useEffect(() => {
    const timer = window.setTimeout(() => setActiveStatusTab(normalizedStatus), 0);
    return () => window.clearTimeout(timer);
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
      void dashboardStats;
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
      toast.info({
        title: "Review started",
        description: `Application for ${formatFullName(selected.fullName)} is now Under Review.`,
      });
      // Optimistically update status so the evaluation and approval options immediately appear
      setSelected((prev) => (prev && prev.profileId === selected.profileId ? { ...prev, applicationStatus: "UNDER_REVIEW" } : prev));
      setExperts((prev) => prev.map((exp) => exp.profileId === selected.profileId ? { ...exp, applicationStatus: "UNDER_REVIEW" } : exp));
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

  const resolveExpertStatus = useCallback((e?: PendingExpert | null): string => {
    if (!e) return "PENDING";
    if (e.verifiedExpert) return "APPROVED";
    const appSt = (e.applicationStatus || "").toUpperCase();
    if (appSt) return appSt;
    const verSt = (e.verificationStatus || "").toUpperCase();
    if (verSt && verSt !== "UNVERIFIED") return verSt;
    return "PENDING";
  }, []);

  // Status counts across all loaded experts
  const statusCounts = useMemo(() => {
    let pending = 0;
    let review = 0;
    let rejected = 0;

    experts.forEach((e) => {
      const st = resolveExpertStatus(e);
      if (st === "UNDER_REVIEW") {
        review++;
      } else if (st === "REJECTED") {
        rejected++;
      } else if (st !== "APPROVED" && st !== "VERIFIED") {
        pending++;
      }
    });

    return { pending, review, rejected, total: experts.length };
  }, [experts, resolveExpertStatus]);

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

      const st = resolveExpertStatus(e);
      let matchesStatus = true;
      if (activeStatusTab === "PENDING") {
        matchesStatus =
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
  }, [experts, searchQuery, activeStatusTab, resolveExpertStatus]);

  // Ensure selected candidate is visible in current filter
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (filteredExperts.length > 0) {
        const exists = filteredExperts.some((e) => e.profileId === selected?.profileId);
        if (!exists) {
          setSelected(filteredExperts[0]);
        }
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [filteredExperts, selected]);

  const totalPages = Math.max(1, Math.ceil(filteredExperts.length / PAGE_SIZE));
  const visibleExperts = filteredExperts.slice(listPage * PAGE_SIZE, (listPage + 1) * PAGE_SIZE);
  const status = resolveExpertStatus(selected);
  const isApproved = selected?.verifiedExpert || status === "APPROVED" || status === "VERIFIED";
  const isRejected = status === "REJECTED";
  const isUnderReview = status === "UNDER_REVIEW";

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
            <div key={item} className="rounded-xl border border-[#E5E7EB] bg-white p-4">
              <div className="flex gap-3">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 space-y-4">
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
      <div className="rounded-2xl border border-[#FCA5A5] bg-[#FEE2E2] p-8 text-center">
        <AlertCircle className="mx-auto h-8 w-8 text-[#DC2626]" />
        <h2 className="mt-3 text-sm font-bold text-[#1F2937]">Unable to load expert verification pipeline</h2>
        <p className="mt-1 text-xs text-[#4B5563]">{loadError}</p>
        <button
          onClick={() => { setIsLoading(true); void fetchPending(); }}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#2E7D32] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#256B2A] cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Retry Request
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* ─── 1. REAL METRIC SUMMARY CARDS ───────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Total Candidacies</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F1F5F2] text-[#6B7280]">
              <FileCheck2 className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-3xl font-black text-[#1F2937] tracking-tight">{statusCounts.total}</p>
          <p className="mt-1 text-xs text-[#6B7280] font-medium">All submissions recorded</p>
        </div>

        <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Pending Initial Review</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FEF3C7] text-[#F59E0B]">
              <Clock3 className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-3xl font-black text-[#1F2937] tracking-tight">{statusCounts.pending}</p>
          <p className="mt-1 text-xs text-[#F59E0B] font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" /> Awaiting evaluation
          </p>
        </div>

        <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Under Review</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#DBEAFE] text-[#2563EB]">
              <UserRound className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-3xl font-black text-[#1F2937] tracking-tight">{statusCounts.review}</p>
          <p className="mt-1 text-xs text-[#2563EB] font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" /> In active audit
          </p>
        </div>

        <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Rejected / Returned</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FEE2E2] text-[#DC2626]">
              <XCircle className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-3xl font-black text-[#1F2937] tracking-tight">{statusCounts.rejected}</p>
          <p className="mt-1 text-xs text-[#DC2626] font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" /> Declined candidacies
          </p>
        </div>
      </div>

      {/* ─── 2. TOOLBAR WITH STATUS FILTER PILLS ───────────────────────── */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between pt-1">
        {/* Rounded-full filter pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {([
            { key: "PENDING", label: "Pending", count: statusCounts.pending },
            { key: "UNDER_REVIEW", label: "Under Review", count: statusCounts.review },
            { key: "REJECTED", label: "Rejected", count: statusCounts.rejected },
            { key: "ALL", label: "All Candidates", count: statusCounts.total },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => handleTabChange(tab.key)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeStatusTab === tab.key
                  ? "bg-[#2E7D32] text-white shadow-sm"
                  : "bg-white text-[#4B5563] border border-[#E5E7EB] hover:bg-[#F8FAF8] hover:text-[#2E7D32]"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Rounded-full Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Search candidate name or role..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setListPage(0);
              }}
              className="h-10 w-full rounded-full border border-[#E5E7EB] bg-white pl-9 pr-4 text-xs text-[#1F2937] placeholder:text-[#9CA3AF] outline-none transition-colors focus:border-[#2E7D32] focus:ring-2 focus:ring-[#E8F5E9] shadow-xs"
            />
          </div>

          <button
            onClick={async () => {
              setIsRefreshing(true);
              await fetchPending();
              setIsRefreshing(false);
            }}
            disabled={isRefreshing}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-4 text-xs font-semibold text-[#4B5563] shadow-xs hover:bg-[#F1F5F2] hover:text-[#2E7D32] cursor-pointer transition-colors disabled:bg-[#E5E7EB] disabled:text-[#9CA3AF]"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-[#2E7D32]" : "text-[#9CA3AF]"}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Contextual Status Guidance Banner */}
      <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-[0_4px_20px_-2px_#EEF0EE] flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <span className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold ${
            activeStatusTab === "PENDING"
              ? "bg-[#FEF3C7] text-[#F59E0B]"
              : activeStatusTab === "UNDER_REVIEW"
              ? "bg-[#DBEAFE] text-[#2563EB]"
              : activeStatusTab === "REJECTED"
              ? "bg-[#FEE2E2] text-[#DC2626]"
              : "bg-[#E8F5E9] text-[#2E7D32]"
          }`}>
            {activeStatusTab === "PENDING" ? (
              <Clock3 className="w-5 h-5" />
            ) : activeStatusTab === "UNDER_REVIEW" ? (
              <UserRound className="w-5 h-5" />
            ) : activeStatusTab === "REJECTED" ? (
              <XCircle className="w-5 h-5" />
            ) : (
              <FileCheck2 className="w-5 h-5" />
            )}
          </span>
          <div>
            <h4 className="text-sm font-bold text-[#1F2937]">
              {activeStatusTab === "PENDING"
                ? "Pending Verification Queue"
                : activeStatusTab === "UNDER_REVIEW"
                ? "In-Depth Review Section"
                : activeStatusTab === "REJECTED"
                ? "Declined & Rejected Applications"
                : "Complete Candidate Directory"}
            </h4>
            <p className="text-xs text-[#6B7280] mt-0.5">
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

        <div className="hidden sm:flex items-center shrink-0">
          <span className="px-3 py-1 rounded-full bg-[#F1F5F2] text-[#4B5563] text-xs font-semibold border border-[#E5E7EB]">
            {filteredExperts.length} candidate{filteredExperts.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      {/* ─── 3. WORKSPACE: Symmetrical Queue (Left) & Detailed Deck (Right) ─ */}
      {filteredExperts.length === 0 ? (
        <div className="rounded-[24px] border border-[#E5E7EB] bg-white py-16 text-center shadow-[0_4px_20px_-2px_#EEF0EE]">
          <CheckCircle2 className="mx-auto h-12 w-12 text-[#2E7D32]" />
          <h2 className="mt-4 text-base font-bold text-[#1F2937]">
            {searchQuery
              ? "No matching candidates found"
              : activeStatusTab === "UNDER_REVIEW"
              ? "No Candidates Currently Under Review"
              : activeStatusTab === "REJECTED"
              ? "No Rejected Candidates"
              : "Verification Queue Is Clear"}
          </h2>
          <p className="mt-1 text-xs text-[#6B7280]">
            {searchQuery
              ? "Try adjusting your search query or selecting another status filter."
              : "Select another status tab to inspect candidate submissions."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 items-stretch gap-5 xl:grid-cols-[330px_minmax(0,1fr)]">

          {/* ─── LEFT COLUMN: APPLICATIONS LIST ────────────────────────────── */}
          <aside className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE] h-full flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#EEF0EE]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF]">
                  {activeStatusTab === "UNDER_REVIEW"
                    ? "Under Review"
                    : activeStatusTab === "REJECTED"
                    ? "Rejected Applications"
                    : activeStatusTab === "ALL"
                    ? "All Applications"
                    : "Pending Applications"}
                </h3>
                <span className="rounded-full bg-[#F1F5F2] px-2.5 py-0.5 text-xs font-semibold text-[#4B5563]">
                  {visibleExperts.length} of {filteredExperts.length}
                </span>
              </div>

              <div className="mt-3 space-y-2.5">
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
                      className={`w-full rounded-[18px] border p-3.5 text-left transition-all cursor-pointer ${
                        isCur
                          ? "border-[#2E7D32] bg-[#E8F5E9]/50 shadow-sm ring-1 ring-[#2E7D32]/20"
                          : "border-[#EEF0EE] bg-[#F8FAF8] hover:bg-[#F1F5F2] hover:border-[#E5E7EB]"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <UserAvatar
                          src={expert.profileImage}
                          name={displayName}
                          size="sm"
                          className="shrink-0 ring-1 ring-[#E5E7EB]"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-bold text-[#1F2937]">{displayName}</p>
                          <p className="mt-0.5 truncate text-[11px] text-[#6B7280] font-medium">
                            {expert.designation || "Agricultural Specialist"}
                          </p>
                          <p className="mt-1 flex items-center gap-1 text-[10px] text-[#9CA3AF] font-medium">
                            <Clock3 className="h-3 w-3 text-[#9CA3AF]" /> {formatDate(expert.submittedAt)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-[#EEF0EE] pt-2">
                        <StatusBadge value={resolveExpertStatus(expert)} />
                        <ArrowUpRight className={`h-3.5 w-3.5 ${isCur ? "text-[#2E7D32]" : "text-[#9CA3AF]"}`} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-[#EEF0EE] pt-3">
                <span className="text-xs text-[#6B7280] font-medium">
                  Page {listPage + 1} of {totalPages}
                </span>
                <div className="flex gap-1.5">
                  <button
                    aria-label="Previous page"
                    onClick={() => setListPage((p) => Math.max(0, p - 1))}
                    disabled={listPage === 0}
                    className="rounded-full border border-[#E5E7EB] p-2 hover:bg-[#F1F5F2] disabled:opacity-30 cursor-pointer shadow-xs transition-colors"
                  >
                    <ChevronLeft className="h-3.5 w-3.5 text-[#4B5563]" />
                  </button>
                  <button
                    aria-label="Next page"
                    onClick={() => setListPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={listPage === totalPages - 1}
                    className="rounded-full border border-[#E5E7EB] p-2 hover:bg-[#F1F5F2] disabled:opacity-30 cursor-pointer shadow-xs transition-colors"
                  >
                    <ChevronRight className="h-3.5 w-3.5 text-[#4B5563]" />
                  </button>
                </div>
              </div>
            )}
          </aside>

          {/* ─── RIGHT COLUMN: DETAILED CANDIDATE DECK ──────────────────────── */}
          {selected && (
            <main className="min-w-0 space-y-5">

              {/* 1. Candidate Hero Header */}
              <section className="rounded-[24px] border border-[#E5E7EB] bg-white p-6 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE]">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-4">
                    <UserAvatar
                      src={selected.profileImage}
                      name={formatFullName(selected.fullName)}
                      size="lg"
                      className="shrink-0 ring-2 ring-[#E5E7EB]"
                    />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h2 className="truncate text-xl font-black text-[#1F2937]">
                          {formatFullName(selected.fullName)}
                        </h2>
                        <StatusBadge value={status} />
                      </div>
                      <p className="mt-0.5 text-xs text-[#4B5563] font-medium">
                        {selected.designation || "Agricultural Specialist"}
                        {selected.organization ? ` at ${selected.organization}` : ""}
                      </p>
                      <p className="mt-1 text-[11px] text-[#9CA3AF] font-medium">
                        Application #{selected.profileId} · Submitted {formatDate(selected.submittedAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full border border-[#E5E7EB] bg-[#F8FAF8] px-3 py-1.5 text-xs text-[#4B5563] font-semibold">
                      Applicant ID: <strong className="text-[#1F2937]">#{selected.profileId}</strong>
                    </span>
                    <span className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${statusTone(status)}`}>
                      {statusLabel(status)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setModalExpert(selected)}
                      className="rounded-full border border-[#E5E7EB] bg-white hover:bg-[#F8FAF8] px-4 py-1.5 text-xs font-semibold text-[#4B5563] shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#2E7D32]" />
                      <span>Full Dossier</span>
                    </button>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-[#EEF0EE] pt-4">
                  <InfoItem icon={<Mail />} label="Email Address" value={selected.email} />
                  <InfoItem icon={<Phone />} label="Phone Number" value={selected.phone} />
                  <InfoItem icon={<MapPin />} label="Service Location" value={selected.locations?.join(", ")} />
                </div>
              </section>

              {/* 2. Equal 50/50 Dual Column Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">

                {/* Left Column (50%): Credentials, Expertise & Documents */}
                <div className="space-y-5 flex flex-col justify-between">
                  <ReviewCard icon={<UserRound />} title="Professional Profile">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <Field label="Designation" value={selected.designation} />
                      <Field label="Organization" value={selected.organization || selected.institution} />
                      <Field label="Qualification" value={selected.qualification} />
                      <Field label="Experience" value={selected.yearsOfExperience != null ? `${selected.yearsOfExperience} Years` : undefined} />
                    </div>
                    {selected.bio && (
                      <div className="mt-3.5 border-t border-[#EEF0EE] pt-3">
                        <Field label="Professional Bio" value={selected.bio} multiline />
                      </div>
                    )}
                  </ReviewCard>

                  <ReviewCard icon={<Sprout />} title="Crop Specializations" count={crops.length}>
                    {(selected.specializations ?? []).length > 0 && (
                      <div className="mb-3 flex flex-wrap gap-1.5">
                        {selected.specializations?.map((item) => (
                          <span key={item} className="rounded-full border border-[#93C5FD] bg-[#DBEAFE] px-2.5 py-0.5 text-[11px] font-semibold text-[#2563EB]">
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
                          <div key={`${crop.id}-${index}`} className="rounded-[16px] border border-[#E5E7EB] bg-[#F8FAF8] p-3.5">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="text-xs font-bold text-[#1F2937]">
                                  {crop.cropEmoji ? `${crop.cropEmoji} ` : ""}{crop.cropName}
                                </p>
                                <p className="text-[10px] text-[#6B7280] font-medium">
                                  {crop.categoryName || "Crop Expertise"}
                                </p>
                              </div>
                              <span className="rounded-full bg-[#E8F5E9] px-2 py-0.5 text-[10px] font-bold text-[#2E7D32] uppercase">
                                {crop.expertiseType || "PRIMARY"}
                              </span>
                            </div>
                            {crop.verificationStatus && (
                              <p className="mt-2 flex items-center gap-1.5 text-[10px] font-semibold text-[#6B7280]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]" /> {statusLabel(crop.verificationStatus)}
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
                      <div className="space-y-2.5">
                        {selected.documents.map((doc, index) => (
                          <div key={doc.id || index} className="rounded-[16px] border border-[#E5E7EB] bg-[#F8FAF8] p-3.5">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#6B7280] border border-[#E5E7EB] shadow-xs">
                                  <FileText className="h-4 w-4 text-[#2E7D32]" />
                                </div>
                                <div className="min-w-0">
                                  <p className="truncate text-xs font-bold text-[#1F2937]">{doc.title || doc.fileName}</p>
                                  <p className="truncate text-[10px] text-[#6B7280] font-medium">
                                    {doc.documentType || "Verification Document"} · {doc.fileSize || "Uploaded"}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => setViewingDoc(doc)}
                                disabled={!doc.fileUrl}
                                className="inline-flex items-center gap-1 text-xs font-semibold text-[#2E7D32] hover:text-[#256B2A] hover:underline disabled:opacity-30 cursor-pointer"
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
                <div className="space-y-5 flex flex-col justify-between">
                  <section className="rounded-[24px] border border-[#E5E7EB] bg-white p-6 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE] h-full flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]">
                            <CheckCircle2 className="h-4 w-4" />
                          </span>
                          <h3 className="text-sm font-bold text-[#1F2937]">Verification Assessment</h3>
                        </div>
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase ${statusTone(status)}`}>
                          {statusLabel(status)}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-[#6B7280] font-medium leading-relaxed">
                        Assess submitted credentials, certificates, and crop specializations before recording an authoritative verification decision.
                      </p>

                      {isApproved ? (
                        <div className="mt-5 rounded-[20px] border border-[#A5D6A7] bg-[#E8F5E9] p-5 text-center space-y-2.5">
                          <CheckCircle2 className="mx-auto h-7 w-7 text-[#2E7D32]" />
                          <p className="text-sm font-bold text-[#1B5E20]">Verified Expert Account</p>
                          <p className="text-xs text-[#6B7280]">This expert is fully approved and active in the KrishiAI advisory network.</p>
                          <button
                            type="button"
                            onClick={() => setModalExpert(selected)}
                            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#2E7D32] bg-white text-[#2E7D32] hover:bg-[#E8F5E9] text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Full Profile Credentials</span>
                          </button>
                        </div>
                      ) : isRejected ? (
                        <div className="mt-5 space-y-3">
                          <div className="rounded-[20px] border border-[#FCA5A5] bg-[#FEE2E2] p-5 text-center space-y-2">
                            <XCircle className="mx-auto h-7 w-7 text-[#DC2626]" />
                            <p className="text-sm font-bold text-[#DC2626]">Application Currently Rejected</p>
                            <p className="text-xs text-[#DC2626] leading-relaxed font-medium">
                              {selected.adminNotes ? `Reason: "${selected.adminNotes}"` : "This application was declined during admin assessment."}
                            </p>
                          </div>
                          <div className="space-y-2 pt-1">
                            <button
                              onClick={startReview}
                              disabled={processing}
                              className="flex w-full items-center justify-center gap-2 rounded-full border border-[#93C5FD] bg-[#DBEAFE] hover:bg-[#BFDBFE] px-4 py-2.5 text-xs font-semibold text-[#2563EB] transition-colors cursor-pointer disabled:opacity-50"
                            >
                              <Clock3 className="h-4 w-4" /> Re-open Application for Review
                            </button>
                            <button
                              onClick={handleApprove}
                              disabled={processing}
                              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#2E7D32] hover:bg-[#256B2A] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                            >
                              {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                              Overturn Decision &amp; Approve
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-5 space-y-3">
                          {isUnderReview ? (
                            <div className="p-3.5 rounded-[16px] bg-[#DBEAFE] border border-[#93C5FD] text-[#2563EB] text-xs font-medium flex items-center gap-2.5">
                              <UserRound className="w-4 h-4 text-[#2563EB] shrink-0" />
                              <span>In-Depth Review Active: Inspect credentials on the left, then approve, reject, or request documents below.</span>
                            </div>
                          ) : (
                            <div className="p-3.5 rounded-[16px] bg-[#E8F5E9] border border-[#A5D6A7] text-[#1B5E20] text-xs font-medium flex items-center gap-2.5">
                              <Clock3 className="w-4 h-4 text-[#2E7D32] shrink-0" />
                              <span>Pending Initial Assessment: Candidate profile is awaiting review before accreditation decisions can be made.</span>
                            </div>
                          )}

                          {!isUnderReview ? (
                            <div className="space-y-3 pt-1">
                              <button
                                onClick={startReview}
                                disabled={processing}
                                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#2E7D32] hover:bg-[#256B2A] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                              >
                                {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Clock3 className="h-4 w-4" />}
                                Review the Expert
                              </button>

                              <p className="text-center text-[11px] text-[#6B7280] font-medium px-1">
                                Start candidate review to verify credentials, assess qualifications, and access official approval actions.
                              </p>

                              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#EEF0EE]">
                                <button
                                  onClick={() => setReviewAction("reject")}
                                  disabled={processing}
                                  className="rounded-full border border-[#FCA5A5] bg-[#FEE2E2] hover:bg-[#FCD8D8] px-3.5 py-2 text-xs font-semibold text-[#DC2626] transition-colors cursor-pointer disabled:opacity-50"
                                >
                                  Reject
                                </button>
                                <button
                                  onClick={() => setReviewAction("info")}
                                  disabled={processing}
                                  className="rounded-full border border-[#FCD34D] bg-[#FEF3C7] hover:bg-[#FDE68A] px-3.5 py-2 text-xs font-semibold text-[#F59E0B] transition-colors cursor-pointer disabled:opacity-50"
                                >
                                  Request Info
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3 pt-1">
                              <div>
                                <label htmlFor="review-notes" className="block text-xs font-semibold text-[#4B5563]">
                                  Verification Notes <span className="text-[#9CA3AF] font-normal">(Optional context)</span>
                                </label>
                                <textarea
                                  id="review-notes"
                                  value={approveNotes}
                                  onChange={(e) => setApproveNotes(e.target.value)}
                                  rows={3}
                                  maxLength={500}
                                  placeholder="Add optional reviewer commentary for this verification approval..."
                                  className="mt-1.5 w-full resize-none rounded-[16px] border border-[#E5E7EB] bg-white px-3.5 py-2.5 text-xs text-[#1F2937] outline-none placeholder:text-[#9CA3AF] focus:border-[#2E7D32] focus:ring-2 focus:ring-[#E8F5E9] transition-colors"
                                />
                              </div>

                              <div className="space-y-2 pt-1">
                                <button
                                  onClick={handleApprove}
                                  disabled={processing}
                                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#2E7D32] hover:bg-[#256B2A] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                                >
                                  {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                  Approve Expert Application
                                </button>

                                <div className="grid grid-cols-2 gap-2 pt-1">
                                  <button
                                    onClick={() => setReviewAction("reject")}
                                    disabled={processing}
                                    className="rounded-full border border-[#FCA5A5] bg-[#FEE2E2] hover:bg-[#FCD8D8] px-3.5 py-2 text-xs font-semibold text-[#DC2626] transition-colors cursor-pointer disabled:opacity-50"
                                  >
                                    Reject
                                  </button>
                                  <button
                                    onClick={() => setReviewAction("info")}
                                    disabled={processing}
                                    className="rounded-full border border-[#FCD34D] bg-[#FEF3C7] hover:bg-[#FDE68A] px-3.5 py-2 text-xs font-semibold text-[#F59E0B] transition-colors cursor-pointer disabled:opacity-50"
                                  >
                                    Request Info
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </section>

                  <section className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE]">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF]">Application Milestones</h3>
                    <div className="mt-3.5 space-y-3">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F2937]/40 backdrop-blur-xs p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-[28px] border border-[#E5E7EB] bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-[#1F2937]">
                  {reviewAction === "reject" ? "Reject Application" : "Request Additional Information"}
                </h3>
                <p className="text-xs text-[#6B7280] font-medium mt-0.5">{formatFullName(selected.fullName)}</p>
              </div>
              <button
                aria-label="Close dialog"
                onClick={() => setReviewAction(null)}
                className="p-1.5 rounded-full text-[#9CA3AF] hover:text-[#4B5563] hover:bg-[#F1F5F2] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div>
              <label htmlFor="modal-notes" className="block text-xs font-semibold text-[#4B5563]">
                {reviewAction === "reject" ? "Reason for Rejection" : "Required Details / Questions"}{" "}
                <span className="text-[#DC2626]">*</span>
              </label>
              <textarea
                id="modal-notes"
                autoFocus
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                rows={4}
                maxLength={1000}
                placeholder="Provide clear, actionable feedback for the applicant..."
                className="mt-1.5 w-full resize-none rounded-[16px] border border-[#E5E7EB] bg-white p-3 text-xs text-[#1F2937] outline-none placeholder:text-[#9CA3AF] focus:border-[#2E7D32] focus:ring-2 focus:ring-[#E8F5E9] transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setReviewAction(null)}
                className="flex-1 rounded-full border border-[#E5E7EB] py-2.5 text-xs font-semibold text-[#4B5563] hover:bg-[#F8FAF8] cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitReviewAction}
                disabled={!reviewNotes.trim() || processing}
                className={`flex-1 rounded-full py-2.5 text-xs font-semibold text-white shadow-sm cursor-pointer transition-colors disabled:opacity-50 ${
                  reviewAction === "reject" ? "bg-[#DC2626] hover:bg-[#B91C1C]" : "bg-[#F59E0B] hover:bg-[#D97706]"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F2937]/50 backdrop-blur-xs p-4" role="dialog" aria-modal="true">
          <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-[28px] border border-[#E5E7EB] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] px-6 py-4">
              <div>
                <h3 className="text-base font-bold text-[#1F2937]">{viewingDoc.title || viewingDoc.fileName}</h3>
                <p className="text-xs text-[#6B7280] font-medium">{viewingDoc.fileName}</p>
              </div>
              <button
                aria-label="Close document preview"
                onClick={() => setViewingDoc(null)}
                className="p-1.5 rounded-full text-[#9CA3AF] hover:text-[#4B5563] hover:bg-[#F1F5F2] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="min-h-[300px] flex-1 overflow-auto bg-[#F8FAF8] p-6">
              {viewingDoc.fileUrl?.startsWith("data:image") ? (
                <div className="relative mx-auto h-[65vh] max-h-[65vh] w-full max-w-3xl rounded-[20px] border border-[#E5E7EB] bg-white shadow-xs overflow-hidden">
                  <Image
                    src={viewingDoc.fileUrl}
                    alt={viewingDoc.title}
                    fill
                    sizes="min(100vw, 768px)"
                    className="object-contain p-2"
                    unoptimized
                  />
                </div>
              ) : viewingDoc.fileUrl?.startsWith("data:application/pdf") ? (
                <iframe src={viewingDoc.fileUrl} title={viewingDoc.title} className="h-[65vh] w-full rounded-[20px] border border-[#E5E7EB] bg-white" />
              ) : (
                <div className="flex h-60 flex-col items-center justify-center gap-3 rounded-[20px] border border-dashed border-[#D1D5DB] bg-white text-center">
                  <FileText className="h-10 w-10 text-[#9CA3AF]" />
                  <p className="text-xs text-[#6B7280] font-medium">Document preview is available through direct link.</p>
                  <a
                    href={viewingDoc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[#2E7D32] px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#256B2A] transition-colors"
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
    <section className="rounded-[24px] border border-[#E5E7EB] bg-white p-6 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE] space-y-4">
      <div className="flex items-center justify-between border-b border-[#EEF0EE] pb-3.5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#4B5563]">
          <span className="text-[#2E7D32] [&>svg]:h-4 [&>svg]:w-4">{icon}</span>
          {title}
        </div>
        {count !== undefined && (
          <span className="rounded-full bg-[#F1F5F2] px-2.5 py-0.5 text-xs font-semibold text-[#4B5563]">
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
    <div className="flex items-start gap-3 min-w-0">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E8F5E9] text-[#2E7D32] [&>svg]:h-3.5 [&>svg]:w-3.5">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">{label}</p>
        <p className="mt-0.5 truncate text-xs font-semibold text-[#1F2937]">{value || "Not provided"}</p>
      </div>
    </div>
  );
}

function Field({ label, value, multiline = false }: { label: string; value?: string; multiline?: boolean }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">{label}</p>
      <p className={`mt-0.5 text-xs ${value ? "text-[#1F2937] font-semibold" : "text-[#9CA3AF] font-normal"} ${multiline ? "leading-relaxed" : ""}`}>
        {value || "Not provided"}
      </p>
    </div>
  );
}

function TimelineItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E8F5E9] text-[#2E7D32] border border-[#A5D6A7]">
        <span className="h-2 w-2 rounded-full bg-[#2E7D32]" />
      </div>
      <div>
        <p className="text-xs font-semibold text-[#1F2937]">{label}</p>
        <p className="text-[10px] text-[#6B7280] font-medium">{value}</p>
      </div>
    </div>
  );
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[20px] border border-dashed border-[#E5E7EB] bg-[#F8FAF8] p-6 text-center text-xs text-[#9CA3AF] font-medium">
      {children}
    </div>
  );
}

export function VerificationCard(_props: { name: string; credential: string }) {
  void _props;
  return <VerificationQueue />;
}
