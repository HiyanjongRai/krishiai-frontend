"use client";

import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import type { ExpertDoc, DetailedExpert } from "./AdminExpertDetailsModal";
import {
  Search,
  UserCheck,
  RefreshCw,
  Mail,
  Phone,
  Building2,
  ChevronLeft,
  ChevronRight,
  Sprout,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  ShieldCheck,
  AlertCircle,
  Briefcase,
} from "lucide-react";
import { AdminExpertDetailsModal } from "./AdminExpertDetailsModal";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { formatFullName } from "@/lib/format-utils";
import { UserAvatar } from "@/components/ui/avatar";

export interface Expert {
  profileId: number;
  userId: number;
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
  verifiedExpert: boolean;
  applicationStatus: string;
  adminNotes?: string;
  primaryCrops?: string[];
  secondaryCrops?: string[];
  specializations?: string[];
  locations?: string[];
  documents?: ExpertDoc[];
  createdAt?: string;
  submittedAt?: string;
}

const PAGE_SIZE = 10;

function getExpertStatus(expert: Expert): "VERIFIED" | "UNDER_REVIEW" | "PENDING" | "REJECTED" | "DRAFT" {
  if (expert.verifiedExpert) return "VERIFIED";
  const st = (expert.applicationStatus || "DRAFT").toUpperCase();
  if (st === "APPROVED") return "VERIFIED";
  if (st === "UNDER_REVIEW" || st === "IN_REVIEW") return "UNDER_REVIEW";
  if (st === "SUBMITTED" || st === "PENDING" || st === "ADDITIONAL_INFORMATION_REQUIRED") return "PENDING";
  if (st === "REJECTED") return "REJECTED";
  return "DRAFT";
}

const statusBadgeConfig = {
  VERIFIED: {
    label: "Verified Expert",
    cls: "bg-[#E8F5E9] text-[#2E7D32] border-[#A5D6A7]",
    icon: CheckCircle2,
  },
  UNDER_REVIEW: {
    label: "Under Review",
    cls: "bg-[#DBEAFE] text-[#2563EB] border-[#93C5FD]",
    icon: Clock,
  },
  PENDING: {
    label: "Pending Review",
    cls: "bg-[#FEF3C7] text-[#F59E0B] border-[#FCD34D]",
    icon: Clock,
  },
  REJECTED: {
    label: "Rejected",
    cls: "bg-[#FEE2E2] text-[#DC2626] border-[#FCA5A5]",
    icon: XCircle,
  },
  DRAFT: {
    label: "Draft",
    cls: "bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB]",
    icon: Clock,
  },
};

export function ExpertTable() {
  const searchParams = useSearchParams();
  const [experts, setExperts] = useState<Expert[]>([]);
  const [search, setSearch] = useState("");
  const queryStatus = searchParams.get("status");

  const [statusFilter, setStatusFilter] = useState<string>(
    queryStatus === "pending"
      ? "PENDING"
      : queryStatus === "review"
      ? "UNDER_REVIEW"
      : queryStatus === "active"
      ? "VERIFIED"
      : "ALL"
  );

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [selectedExpert, setSelectedExpert] = useState<DetailedExpert | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingDetailId, setLoadingDetailId] = useState<number | null>(null);

  const fetchExperts = useCallback(async () => {
    setLoadError(null);
    try {
      const data = await api.get<Expert[]>("/v1/admin/experts/all");
      setExperts(Array.isArray(data) ? data : []);
    } catch {
      setLoadError("Unable to load agronomists directory. Please check connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => { void fetchExperts(); }, 0);
    return () => window.clearTimeout(timer);
  }, [fetchExperts]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchExperts();
    setIsRefreshing(false);
  };

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return experts.filter((expert) => {
      const status = getExpertStatus(expert);
      const matchesStatus = statusFilter === "ALL" || status === statusFilter;
      const matchesSearch =
        !query ||
        [
          expert.fullName,
          expert.email,
          expert.phone,
          expert.organization,
          expert.designation,
          ...(expert.primaryCrops ?? []),
          ...(expert.specializations ?? []),
        ].some((val) => val?.toLowerCase().includes(query));

      return matchesStatus && matchesSearch;
    });
  }, [experts, search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = useMemo(
    () => filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE),
    [filtered, page]
  );

  const resetPage = () => setPage(0);

  const verifiedCount = experts.filter((e) => getExpertStatus(e) === "VERIFIED").length;
  const underReviewCount = experts.filter((e) => getExpertStatus(e) === "UNDER_REVIEW").length;
  const pendingCount = experts.filter((e) => getExpertStatus(e) === "PENDING").length;

  const handleViewDetails = async (expert: Expert) => {
    setLoadingDetailId(expert.profileId);
    try {
      const detail = await api.get<DetailedExpert>(`/v1/admin/experts/${expert.profileId}`);
      setSelectedExpert(detail);
      setIsModalOpen(true);
    } catch {
      // Fallback to table data if details endpoint fails
      setSelectedExpert({
        ...expert,
        cropDetails: [],
      });
      setIsModalOpen(true);
    } finally {
      setLoadingDetailId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Metrics Strip (Farmer Dashboard Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE] space-y-2 hover:border-[#C8E6C9] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6B7280]">Total Specialists</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8F5E9] text-[#2E7D32]">
              <UserCheck className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-[#1F2937] tracking-tight">{experts.length}</p>
            <p className="text-[11px] text-[#9CA3AF] mt-0.5">Total registered candidates</p>
          </div>
        </div>

        <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE] space-y-2 hover:border-[#C8E6C9] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6B7280]">Verified &amp; Active</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8F5E9] text-[#2E7D32]">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-[#2E7D32] tracking-tight">{verifiedCount}</p>
            <p className="text-[11px] text-[#9CA3AF] mt-0.5">Accredited consultants</p>
          </div>
        </div>

        <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE] space-y-2 hover:border-[#93C5FD] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6B7280]">Under Review</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#DBEAFE] text-[#2563EB]">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-[#2563EB] tracking-tight">{underReviewCount}</p>
            <p className="text-[11px] text-[#9CA3AF] mt-0.5">Credentials evaluating</p>
          </div>
        </div>

        <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE] space-y-2 hover:border-[#FCD34D] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6B7280]">Pending Accreditation</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FEF3C7] text-[#F59E0B]">
              <AlertCircle className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-[#F59E0B] tracking-tight">{pendingCount}</p>
            <p className="text-[11px] text-[#9CA3AF] mt-0.5">Awaiting initial triage</p>
          </div>
        </div>
      </div>

      {/* ── 2. Filters & Search Toolbar (Farmer Dashboard Style) ─────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative min-w-0 flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); resetPage(); }}
            placeholder="Search by name, organization, designation, crop..."
            className="h-10 w-full rounded-full border border-[#E5E7EB] bg-white pl-9 pr-4 text-xs text-[#1F2937] outline-none placeholder:text-[#9CA3AF] shadow-[0_4px_20px_-2px_#EEF0EE] transition-all focus:border-[#2E7D32] focus:ring-3 focus:ring-[#2E7D32]/15"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-0.5 -mx-0.5 px-0.5 no-scrollbar flex-nowrap sm:flex-wrap sm:overflow-x-visible">
          {[
            { id: "ALL", label: "All Specialists" },
            { id: "VERIFIED", label: "Verified" },
            { id: "UNDER_REVIEW", label: "Under Review" },
            { id: "PENDING", label: "Pending" },
            { id: "REJECTED", label: "Rejected" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => { setStatusFilter(tab.id); resetPage(); }}
              className={`rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-[#2E7D32] text-white shadow-xs"
                  : "bg-white border border-[#E5E7EB] text-[#4B5563] shadow-[0_4px_20px_-2px_#EEF0EE] hover:bg-[#F1F5F2] hover:text-[#2E7D32]"
              }`}
            >
              {tab.label}
            </button>
          ))}

          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-bold text-[#4B5563] shadow-[0_4px_20px_-2px_#EEF0EE] transition-all hover:bg-[#F1F5F2] hover:text-[#2E7D32] cursor-pointer shrink-0"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-[#2E7D32]" : "text-[#9CA3AF]"}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* ── 3. Main Data Table ──────────────────────────────────────────────── */}
      <div className="rounded-[24px] border border-[#E5E7EB] bg-white shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE] overflow-hidden">
        {isLoading ? (
          <TableSkeleton rows={8} />
        ) : loadError ? (
          <div className="p-8 text-center">
            <p className="text-sm font-semibold text-[#DC2626]">{loadError}</p>
            <button
              type="button"
              onClick={() => { setIsLoading(true); void fetchExperts(); }}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[#2E7D32] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#256B2A] cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Retry</span>
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <UserCheck className="mx-auto h-8 w-8 text-[#9CA3AF]" />
            <h3 className="mt-2 text-sm font-semibold text-[#1F2937]">No agronomists found</h3>
            <p className="mt-1 text-xs text-[#6B7280]">
              No specialists match your current filter or search criteria.
            </p>
          </div>
        ) : (
          <>
            {/* ── Mobile card list (< md) ──────────────────────────────── */}
            <div className="md:hidden divide-y divide-[#EEF0EE]">
              {paginated.map((expert) => {
                const status = getExpertStatus(expert);
                const badge = statusBadgeConfig[status] || statusBadgeConfig.DRAFT;
                const BadgeIcon = badge.icon;
                const displayName = formatFullName(expert.fullName);
                return (
                  <div key={expert.profileId} className="p-4 flex items-start gap-3 transition-colors hover:bg-[#F8FAF8]">
                    <UserAvatar
                      src={expert.profileImage}
                      name={displayName}
                      size="sm"
                      className="rounded-lg ring-1 ring-[#E5E7EB] shrink-0 mt-0.5"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[#1F2937] truncate">{displayName}</p>
                          <p className="text-[11px] text-[#6B7280] truncate">{expert.designation || "Agricultural Specialist"}</p>
                          <p className="text-[11px] text-[#9CA3AF] truncate">{expert.organization || "Independent"}</p>
                        </div>
                        <span className={`inline-flex shrink-0 items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold ${badge.cls}`}>
                          <BadgeIcon className="h-3 w-3 shrink-0" />
                          <span className="hidden xs:inline">{badge.label}</span>
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <p className="text-[11px] text-[#9CA3AF] truncate">{expert.email}</p>
                        <button
                          type="button"
                          onClick={() => handleViewDetails(expert)}
                          disabled={loadingDetailId === expert.profileId}
                          className="inline-flex items-center gap-1 rounded-md border border-[#E5E7EB] bg-white px-2.5 py-1 text-xs font-medium text-[#4B5563] shadow-sm transition-colors hover:bg-[#F1F5F2] hover:text-[#2E7D32] cursor-pointer disabled:bg-[#E5E7EB] disabled:text-[#9CA3AF] shrink-0"
                        >
                          {loadingDetailId === expert.profileId ? (
                            <LoadingSpinner size="xs" color="current" />
                          ) : (
                            <Eye className="h-3 w-3 text-[#9CA3AF]" />
                          )}
                          <span>Dossier</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Desktop table (md+) ──────────────────────────────────── */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[#E5E7EB] bg-[#F8FAF8] text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Expert Specialist</th>
                    <th className="py-3 px-4 hidden sm:table-cell">Affiliation &amp; Contact</th>
                    <th className="py-3 px-4 hidden md:table-cell">Crop Domains</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 hidden lg:table-cell">Tenure</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EEF0EE]">
                  {paginated.map((expert) => {
                    const status = getExpertStatus(expert);
                    const badge = statusBadgeConfig[status] || statusBadgeConfig.DRAFT;
                    const BadgeIcon = badge.icon;
                    const displayName = formatFullName(expert.fullName);

                    return (
                      <tr key={expert.profileId} className="transition-colors hover:bg-[#F8FAF8]">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <UserAvatar
                              src={expert.profileImage}
                              name={displayName}
                              size="md"
                              className="rounded-lg ring-1 ring-[#E5E7EB] shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="font-semibold text-[#1F2937] truncate">{displayName}</p>
                              <p className="text-[11px] text-[#6B7280] truncate">
                                {expert.designation || "Agricultural Specialist"}
                              </p>
                              <p className="text-[10px] text-[#9CA3AF] sm:hidden">{expert.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 hidden sm:table-cell">
                          <div className="space-y-0.5">
                            <p className="text-xs font-medium text-[#4B5563] truncate">
                              {expert.organization || "Independent Specialist"}
                            </p>
                            <p className="text-[11px] text-[#6B7280] truncate">{expert.email}</p>
                            {expert.phone && (
                              <p className="text-[11px] text-[#9CA3AF]">{expert.phone}</p>
                            )}
                          </div>
                        </td>

                        <td className="py-3 px-4 hidden md:table-cell">
                          <div className="flex flex-wrap gap-1 max-w-[260px]">
                            {(expert.primaryCrops ?? []).slice(0, 2).map((crop) => (
                              <span
                                key={crop}
                                className="inline-flex items-center gap-1 rounded bg-[#F1F5F2] px-2 py-0.5 text-[10px] font-semibold text-[#4B5563] border border-[#E5E7EB]"
                              >
                                <Sprout className="h-2.5 w-2.5 text-[#2E7D32]" />
                                <span>{crop}</span>
                              </span>
                            ))}
                            {(expert.primaryCrops?.length ?? 0) > 2 && (
                              <span className="rounded bg-[#F8FAF8] px-1.5 py-0.5 text-[10px] font-medium text-[#6B7280] border border-[#E5E7EB]">
                                +{(expert.primaryCrops?.length ?? 0) - 2} more
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${badge.cls}`}>
                            <BadgeIcon className="h-3 w-3 shrink-0" />
                            <span>{badge.label}</span>
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-[#6B7280] hidden lg:table-cell whitespace-nowrap text-xs">
                          {expert.yearsOfExperience
                            ? `${expert.yearsOfExperience} yrs exp`
                            : "1+ yr exp"}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleViewDetails(expert)}
                            disabled={loadingDetailId === expert.profileId}
                            className="inline-flex items-center gap-1.5 rounded-full border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-semibold text-[#4B5563] shadow-xs transition-colors hover:border-[#2E7D32] hover:bg-[#E8F5E9] hover:text-[#2E7D32] cursor-pointer disabled:opacity-50"
                          >
                            {loadingDetailId === expert.profileId ? (
                              <LoadingSpinner size="xs" color="current" />
                            ) : (
                              <Eye className="h-3 w-3 text-[#9CA3AF]" />
                            )}
                            <span>Dossier</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ── Pagination Footer ──────────────────────────────────────────────── */}
        {!isLoading && filtered.length > 0 && (
          <div className="flex items-center justify-between border-t border-[#EEF0EE] px-5 py-3.5 bg-[#F8FAF8]">
            <span className="text-xs text-[#6B7280]">
              Showing <span className="font-bold text-[#1F2937]">{page * PAGE_SIZE + 1}</span> to{" "}
              <span className="font-bold text-[#1F2937]">{Math.min((page + 1) * PAGE_SIZE, filtered.length)}</span> of{" "}
              <span className="font-bold text-[#1F2937]">{filtered.length}</span> specialists
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="rounded-full border border-[#E5E7EB] bg-white p-2 text-[#6B7280] shadow-xs transition-colors hover:bg-[#F1F5F2] hover:text-[#2E7D32] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                title="Previous page"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="rounded-full border border-[#E5E7EB] bg-white p-2 text-[#6B7280] shadow-xs transition-colors hover:bg-[#F1F5F2] hover:text-[#2E7D32] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                title="Next page"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Expert Details Modal ────────────────────────────────────────────── */}
      <AdminExpertDetailsModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedExpert(null);
        }}
        expert={selectedExpert}
        onStatusChanged={fetchExperts}
      />
    </div>
  );
}
