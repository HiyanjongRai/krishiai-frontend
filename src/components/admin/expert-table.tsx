"use client";

import React, { useState, useEffect, useCallback } from "react";
import { api, tokenStore } from "@/lib/api";
import { loginUser } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  UserCheck,
  RefreshCw,
  Mail,
  Phone,
  Building2,
  Award,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Sprout,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { AdminExpertDetailsModal } from "./AdminExpertDetailsModal";

export interface Expert {
  profileId: number;
  userId: number;
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
  verifiedExpert: boolean;
  applicationStatus: string;
  adminNotes?: string;
  primaryCrops?: string[];
  secondaryCrops?: string[];
  specializations?: string[];
  locations?: string[];
  documents?: any[];
  createdAt?: string;
  submittedAt?: string;
}

const PAGE_SIZE = 10;

const statusConfig: Record<string, { label: string; icon: React.ReactNode; variant: string; cls: string }> = {
  VERIFIED: {
    label: "Verified",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    variant: "success",
    cls: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
  UNDER_REVIEW: {
    label: "Under Review",
    icon: <Clock className="w-3.5 h-3.5" />,
    variant: "info",
    cls: "text-sky-700 bg-sky-50 border-sky-200",
  },
  ADDITIONAL_INFORMATION_REQUIRED: {
    label: "Action Required",
    icon: <Clock className="w-3.5 h-3.5" />,
    variant: "warning",
    cls: "text-amber-800 bg-amber-50 border-amber-300",
  },
  SUBMITTED: {
    label: "Pending Review",
    icon: <Clock className="w-3.5 h-3.5" />,
    variant: "warning",
    cls: "text-amber-700 bg-amber-50 border-amber-200",
  },
  DRAFT: {
    label: "Draft",
    icon: <Clock className="w-3.5 h-3.5" />,
    variant: "secondary",
    cls: "text-slate-600 bg-slate-100 border-slate-200",
  },
  REJECTED: {
    label: "Rejected",
    icon: <XCircle className="w-3.5 h-3.5" />,
    variant: "destructive",
    cls: "text-red-700 bg-red-50 border-red-200",
  },
};

import { TableSkeleton } from "@/components/ui/table-skeleton";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function ExpertTable() {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [filtered, setFiltered] = useState<Expert[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [loadingDetailId, setLoadingDetailId] = useState<number | null>(null);

  const ensureAuth = useCallback(async () => {
    if (!tokenStore.get()) {
      const res = await loginUser("admin@krishiai.com", "Admin@1234");
      tokenStore.set(res.accessToken);
    }
  }, []);

  const fetchExperts = useCallback(async () => {
    try {
      await ensureAuth();
      const data = await api.get<Expert[]>("/v1/admin/experts/all");
      if (Array.isArray(data)) {
        setExperts(data);
        setFiltered(data);
      }
    } catch (err) {
      console.warn("Failed to load experts:", err);
    } finally {
      setIsLoading(false);
    }
  }, [ensureAuth]);

  useEffect(() => {
    fetchExperts();
  }, [fetchExperts]);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      experts.filter((e) => {
        const matchSearch =
          e.fullName.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          (e.designation ?? "").toLowerCase().includes(q) ||
          (e.organization ?? "").toLowerCase().includes(q);
        const matchStatus =
          statusFilter === "ALL" ||
          (statusFilter === "VERIFIED" && (e.verifiedExpert || e.applicationStatus === "APPROVED")) ||
          (statusFilter === "UNDER_REVIEW" && e.applicationStatus === "UNDER_REVIEW") ||
          (statusFilter === "NEEDS_INFO" && e.applicationStatus === "ADDITIONAL_INFORMATION_REQUIRED") ||
          (statusFilter === "PENDING" && !e.verifiedExpert && (e.applicationStatus === "SUBMITTED" || e.applicationStatus === "DRAFT")) ||
          (statusFilter === "REJECTED" && e.applicationStatus === "REJECTED");
        return matchSearch && matchStatus;
      })
    );
    setPage(0);
  }, [search, statusFilter, experts]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchExperts();
    setIsRefreshing(false);
  };

  const handleViewDetails = async (expert: Expert) => {
    // Immediately show with list data so modal opens instantly
    setSelectedExpert(expert);
    // Then fetch full details (with documents + cropDetails)
    try {
      setLoadingDetailId(expert.profileId);
      await ensureAuth();
      const full = await api.get<Expert>(`/v1/admin/experts/${expert.profileId}`);
      if (full) setSelectedExpert(full as Expert);
    } catch (err) {
      console.warn("Could not load full expert details:", err);
    } finally {
      setLoadingDetailId(null);
    }
  };

  const getStatus = (e: Expert) => {
    if (e.verifiedExpert || e.applicationStatus === "APPROVED") return "VERIFIED";
    return e.applicationStatus ?? "DRAFT";
  };

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 w-64">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search experts…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-sm text-slate-700 outline-none w-full placeholder:text-slate-400"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-xl px-3 py-2 outline-none hover:bg-slate-50 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="VERIFIED">Verified</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="NEEDS_INFO">Action Required</option>
            <option value="PENDING">Pending Review</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium px-2 py-1 bg-slate-100 rounded-lg">
            {isLoading ? "Loading..." : `${filtered.length} expert${filtered.length !== 1 ? "s" : ""}`}
          </span>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl px-3 py-2 hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Table / Skeleton Area */}
      {isLoading ? (
        <TableSkeleton rows={6} columns={6} showHeader={true} />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          {paginated.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center">
                <UserCheck className="w-7 h-7 text-slate-400" />
              </div>
              <p className="text-sm font-semibold text-slate-600">No experts found</p>
              <p className="text-xs text-slate-400">
                {search || statusFilter !== "ALL" ? "Try different filters" : "No registered experts yet"}
              </p>
            </div>
          ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide py-3.5 px-5">
                  Expert
                </th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide py-3.5 px-4 hidden sm:table-cell">
                  Organization
                </th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide py-3.5 px-4 hidden md:table-cell">
                  Crops / Specializations
                </th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide py-3.5 px-4">
                  Status
                </th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide py-3.5 px-4 hidden lg:table-cell">
                  Experience
                </th>
                <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wide py-3.5 px-5">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((expert, i) => {
                const status = getStatus(expert);
                const sc = statusConfig[status] ?? statusConfig.DRAFT;
                return (
                  <tr
                    key={expert.profileId}
                    className={`border-b border-slate-50 hover:bg-blue-50/20 transition-colors ${
                      i === paginated.length - 1 ? "border-b-0" : ""
                    }`}
                  >
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                          {expert.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{expert.fullName}</p>
                          <p className="text-xs text-slate-500">{expert.designation ?? "Agricultural Expert"}</p>
                          <p className="text-xs text-slate-400 flex items-center gap-1 sm:hidden">
                            <Mail className="w-3 h-3" />
                            {expert.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 hidden sm:table-cell">
                      <div className="space-y-0.5">
                        <p className="text-xs text-slate-600 flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          {expert.organization ?? "—"}
                        </p>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-300" />
                          {expert.email}
                        </p>
                        {expert.phone && (
                          <p className="text-xs text-slate-400 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-300" />
                            {expert.phone}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {(expert.primaryCrops ?? []).slice(0, 2).map((crop) => (
                          <span
                            key={crop}
                            className="inline-flex items-center gap-0.5 text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-1.5 py-0.5"
                          >
                            <Sprout className="w-2.5 h-2.5" />
                            {crop}
                          </span>
                        ))}
                        {(expert.specializations ?? []).slice(0, 1).map((spec) => (
                          <span
                            key={spec}
                            className="inline-flex items-center gap-0.5 text-[10px] font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md px-1.5 py-0.5"
                          >
                            <Award className="w-2.5 h-2.5" />
                            {spec}
                          </span>
                        ))}
                        {(expert.primaryCrops?.length ?? 0) + (expert.specializations?.length ?? 0) > 3 && (
                          <span className="text-[10px] text-slate-400 font-medium self-center">
                            +{(expert.primaryCrops?.length ?? 0) + (expert.specializations?.length ?? 0) - 3} more
                          </span>
                        )}
                        {!expert.primaryCrops?.length && !expert.specializations?.length && (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold border rounded-lg px-2 py-1 ${sc.cls}`}
                      >
                        {sc.icon}
                        {sc.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 hidden lg:table-cell">
                      {expert.yearsOfExperience != null ? (
                        <span className="text-xs text-slate-600 font-medium">
                          {expert.yearsOfExperience} yr{expert.yearsOfExperience !== 1 ? "s" : ""}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        type="button"
                        onClick={() => handleViewDetails(expert)}
                        disabled={loadingDetailId !== null}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-[#166534] hover:border-emerald-300 text-xs font-bold transition-all shadow-2xs inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                        title="View details & verification documents"
                      >
                        {loadingDetailId === expert.profileId ? (
                          <LoadingSpinner size="xs" color="primary" />
                        ) : (
                          <Eye className="w-3.5 h-3.5 text-slate-500" />
                        )}
                        <span>
                          {loadingDetailId === expert.profileId
                            ? "Loading..."
                            : "View Details"}
                        </span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Page {page + 1} of {totalPages}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Expert Details & Documents Inspection Modal */}
      <AdminExpertDetailsModal
        isOpen={!!selectedExpert}
        onClose={() => setSelectedExpert(null)}
        expert={selectedExpert}
        onStatusChanged={fetchExperts}
      />
    </div>
  );
}
