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
    cls: "bg-emerald-50 text-emerald-800 border-emerald-200",
    icon: CheckCircle2,
  },
  UNDER_REVIEW: {
    label: "Under Review",
    cls: "bg-blue-50 text-blue-800 border-blue-200",
    icon: Clock,
  },
  PENDING: {
    label: "Pending Review",
    cls: "bg-amber-50 text-amber-800 border-amber-200",
    icon: Clock,
  },
  REJECTED: {
    label: "Rejected",
    cls: "bg-rose-50 text-rose-800 border-rose-200",
    icon: XCircle,
  },
  DRAFT: {
    label: "Draft",
    cls: "bg-slate-100 text-slate-700 border-slate-200",
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
      {/* ── 1. Page Header & Stats ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Accredited Agronomists
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-slate-500">
            Verified agricultural specialists, professional credentials, and advisory domains.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="self-start sm:self-center inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-emerald-700" : "text-slate-400"}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Real Summary Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Specialists</span>
            <UserCheck className="h-4 w-4 text-slate-400" />
          </div>
          <p className="mt-1.5 text-2xl font-bold text-slate-900">{experts.length}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Verified &amp; Active</span>
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="mt-1.5 text-2xl font-bold text-emerald-700">{verifiedCount}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Under Review</span>
            <Clock className="h-4 w-4 text-blue-600" />
          </div>
          <p className="mt-1.5 text-2xl font-bold text-blue-700">{underReviewCount}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Pending Accreditation</span>
            <AlertCircle className="h-4 w-4 text-amber-600" />
          </div>
          <p className="mt-1.5 text-2xl font-bold text-amber-700">{pendingCount}</p>
        </div>
      </div>

      {/* ── 2. Filters & Search Toolbar ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative min-w-0 flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); resetPage(); }}
            placeholder="Search by name, organization, designation, crop..."
            className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 shadow-2xs transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 -mx-0.5 px-0.5 no-scrollbar flex-nowrap sm:flex-wrap sm:overflow-x-visible">
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
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-emerald-700 text-white shadow-2xs"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── 3. Main Data Table ──────────────────────────────────────────────── */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
        {isLoading ? (
          <TableSkeleton rows={8} />
        ) : loadError ? (
          <div className="p-8 text-center">
            <p className="text-sm font-semibold text-rose-700">{loadError}</p>
            <button
              type="button"
              onClick={() => { setIsLoading(true); void fetchExperts(); }}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-800 transition-colors shadow-2xs cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Retry</span>
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <UserCheck className="mx-auto h-8 w-8 text-slate-400" />
            <h3 className="mt-2 text-sm font-semibold text-slate-900">No agronomists found</h3>
            <p className="mt-1 text-xs text-slate-500">
              No specialists match your current filter or search criteria.
            </p>
          </div>
        ) : (
          <>
            {/* ── Mobile card list (< md) ──────────────────────────────── */}
            <div className="md:hidden divide-y divide-slate-100">
              {paginated.map((expert) => {
                const status = getExpertStatus(expert);
                const badge = statusBadgeConfig[status] || statusBadgeConfig.DRAFT;
                const BadgeIcon = badge.icon;
                const displayName = formatFullName(expert.fullName);
                return (
                  <div key={expert.profileId} className="p-4 flex items-start gap-3 hover:bg-slate-50/60 transition-colors">
                    <UserAvatar
                      src={expert.profileImage}
                      name={displayName}
                      size="sm"
                      className="rounded-lg ring-1 ring-slate-200 shrink-0 mt-0.5"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-900 truncate">{displayName}</p>
                          <p className="text-[11px] text-slate-500 truncate">{expert.designation || "Agricultural Specialist"}</p>
                          <p className="text-[11px] text-slate-400 truncate">{expert.organization || "Independent"}</p>
                        </div>
                        <span className={`inline-flex shrink-0 items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold ${badge.cls}`}>
                          <BadgeIcon className="h-3 w-3 shrink-0" />
                          <span className="hidden xs:inline">{badge.label}</span>
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <p className="text-[11px] text-slate-400 truncate">{expert.email}</p>
                        <button
                          type="button"
                          onClick={() => handleViewDetails(expert)}
                          disabled={loadingDetailId === expert.profileId}
                          className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer disabled:opacity-50 shrink-0"
                        >
                          {loadingDetailId === expert.profileId ? (
                            <LoadingSpinner size="xs" color="current" />
                          ) : (
                            <Eye className="h-3 w-3 text-slate-400" />
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
                <thead className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Expert Specialist</th>
                    <th className="py-3 px-4 hidden sm:table-cell">Affiliation &amp; Contact</th>
                    <th className="py-3 px-4 hidden md:table-cell">Crop Domains</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 hidden lg:table-cell">Tenure</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginated.map((expert) => {
                    const status = getExpertStatus(expert);
                    const badge = statusBadgeConfig[status] || statusBadgeConfig.DRAFT;
                    const BadgeIcon = badge.icon;
                    const displayName = formatFullName(expert.fullName);

                    return (
                      <tr key={expert.profileId} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <UserAvatar
                              src={expert.profileImage}
                              name={displayName}
                              size="md"
                              className="rounded-lg ring-1 ring-slate-200 shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-900 truncate">{displayName}</p>
                              <p className="text-[11px] text-slate-500 truncate">
                                {expert.designation || "Agricultural Specialist"}
                              </p>
                              <p className="text-[10px] text-slate-400 sm:hidden">{expert.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 hidden sm:table-cell">
                          <div className="space-y-0.5">
                            <p className="text-xs font-medium text-slate-700 truncate">
                              {expert.organization || "Independent Specialist"}
                            </p>
                            <p className="text-[11px] text-slate-500 truncate">{expert.email}</p>
                            {expert.phone && (
                              <p className="text-[11px] text-slate-400">{expert.phone}</p>
                            )}
                          </div>
                        </td>

                        <td className="py-3 px-4 hidden md:table-cell">
                          <div className="flex flex-wrap gap-1 max-w-[260px]">
                            {(expert.primaryCrops ?? []).slice(0, 2).map((crop) => (
                              <span
                                key={crop}
                                className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700 border border-slate-200"
                              >
                                <Sprout className="h-2.5 w-2.5 text-emerald-700" />
                                <span>{crop}</span>
                              </span>
                            ))}
                            {(expert.primaryCrops?.length ?? 0) > 2 && (
                              <span className="rounded bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 border border-slate-200">
                                +{(expert.primaryCrops?.length ?? 0) - 2} more
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold ${badge.cls}`}>
                            <BadgeIcon className="h-3 w-3 shrink-0" />
                            <span>{badge.label}</span>
                          </span>
                        </td>

                        <td className="py-3 px-4 text-slate-500 hidden lg:table-cell whitespace-nowrap">
                          {expert.yearsOfExperience
                            ? `${expert.yearsOfExperience} yrs exp`
                            : "1+ yr exp"}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleViewDetails(expert)}
                            disabled={loadingDetailId === expert.profileId}
                            className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
                          >
                            {loadingDetailId === expert.profileId ? (
                              <LoadingSpinner size="xs" color="current" />
                            ) : (
                              <Eye className="h-3 w-3 text-slate-400" />
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
          <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 bg-slate-50/50">
            <span className="text-xs text-slate-500">
              Showing <span className="font-semibold text-slate-900">{page * PAGE_SIZE + 1}</span> to{" "}
              <span className="font-semibold text-slate-900">{Math.min((page + 1) * PAGE_SIZE, filtered.length)}</span> of{" "}
              <span className="font-semibold text-slate-900">{filtered.length}</span> specialists
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs transition-colors cursor-pointer"
                title="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs transition-colors cursor-pointer"
                title="Next page"
              >
                <ChevronRight className="h-4 w-4" />
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
