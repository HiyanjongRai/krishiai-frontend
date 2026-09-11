"use client";

import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import type { ExpertDoc } from "./AdminExpertDetailsModal";
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
  Sprout,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  Radio,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { AdminExpertDetailsModal } from "./AdminExpertDetailsModal";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { formatFullName } from "@/lib/format-utils";

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
  documents?: ExpertDoc[];
  createdAt?: string;
  submittedAt?: string;
}

const PAGE_SIZE = 10;

const statusConfig: Record<string, { label: string; icon: React.ReactNode; cls: string }> = {
  VERIFIED: {
    label: "Verified",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    cls: "text-[#0F9F68] bg-[#DDF4EA] border-[#BCE9D5]",
  },
  UNDER_REVIEW: {
    label: "Under Review",
    icon: <Clock className="w-3.5 h-3.5" />,
    cls: "text-blue-700 bg-blue-50 border-blue-200",
  },
  ADDITIONAL_INFORMATION_REQUIRED: {
    label: "Action Required",
    icon: <Clock className="w-3.5 h-3.5" />,
    cls: "text-amber-800 bg-amber-50 border-amber-300",
  },
  SUBMITTED: {
    label: "Pending Review",
    icon: <Clock className="w-3.5 h-3.5" />,
    cls: "text-amber-700 bg-amber-50 border-amber-200",
  },
  DRAFT: {
    label: "Draft",
    icon: <Clock className="w-3.5 h-3.5" />,
    cls: "text-gray-600 bg-gray-100 border-gray-200",
  },
  REJECTED: {
    label: "Rejected",
    icon: <XCircle className="w-3.5 h-3.5" />,
    cls: "text-rose-700 bg-rose-50 border-rose-200",
  },
};

export function ExpertTable() {
  const searchParams = useSearchParams();
  const [experts, setExperts] = useState<Expert[]>([]);
  const [search, setSearch] = useState("");
  const queryStatus = searchParams.get("status");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "VERIFIED" | "UNDER_REVIEW" | "PENDING">(
    queryStatus === "pending"
      ? "PENDING"
      : queryStatus === "review"
      ? "UNDER_REVIEW"
      : "VERIFIED"
  );
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [loadingDetailId, setLoadingDetailId] = useState<number | null>(null);
  const [domainMetric, setDomainMetric] = useState<"crops" | "regions">("crops");

  const fetchExperts = useCallback(async () => {
    setLoadError(null);
    try {
      const data = await api.get<Expert[]>("/v1/admin/experts/all");
      if (Array.isArray(data)) {
        setExperts(data);
      }
    } catch {
      setLoadError("Unable to load experts. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => { void fetchExperts(); }, 0);
    return () => window.clearTimeout(timer);
  }, [fetchExperts]);

  const getStatus = (e: Expert) => {
    if (e.verifiedExpert || e.applicationStatus === "APPROVED") return "VERIFIED";
    return e.applicationStatus ?? "DRAFT";
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return experts.filter((e) => {
      const matchSearch =
        formatFullName(e.fullName).toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        (e.designation ?? "").toLowerCase().includes(q) ||
        (e.organization ?? "").toLowerCase().includes(q);

      const expStatus = getStatus(e);
      let matchStatus = true;
      if (statusFilter === "VERIFIED") {
        matchStatus = expStatus === "VERIFIED";
      } else if (statusFilter === "UNDER_REVIEW") {
        matchStatus = expStatus === "UNDER_REVIEW";
      } else if (statusFilter === "PENDING") {
        matchStatus = expStatus === "SUBMITTED" || expStatus === "DRAFT" || expStatus === "ADDITIONAL_INFORMATION_REQUIRED";
      }

      return matchSearch && matchStatus;
    });
  }, [experts, search, statusFilter]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchExperts();
    setIsRefreshing(false);
  };

  const handleViewDetails = async (expert: Expert) => {
    setSelectedExpert(expert);
    try {
      setLoadingDetailId(expert.profileId);
      const full = await api.get<Expert>(`/v1/admin/experts/${expert.profileId}`);
      if (full) setSelectedExpert(full as Expert);
    } catch (err) {
      console.warn("Could not load full expert details:", err);
    } finally {
      setLoadingDetailId(null);
    }
  };

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const verifiedCount = experts.filter((expert) => getStatus(expert) === "VERIFIED").length;
  const pendingCount = experts.filter((expert) => {
    const st = getStatus(expert);
    return st === "SUBMITTED" || st === "DRAFT" || st === "ADDITIONAL_INFORMATION_REQUIRED";
  }).length;
  const reviewCount = experts.filter((expert) => getStatus(expert) === "UNDER_REVIEW").length;

  return (
    <div className="space-y-6">
      {/* ─── 1. TOP BENTO GRID (MATCHING REFERENCE UI) ────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">

        {/* Card 1 (Left): Green Emerald Accent Card & Sub-stat (4 cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-4">
          <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#0F9F68] via-[#0D8A5A] to-[#0A6B45] p-5 text-white shadow-[0_10px_30px_-8px_rgba(15,159,104,0.35)]">
            <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/10 blur-xl pointer-events-none" />
            <div className="absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-black/10 blur-lg pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.16em] text-white/90">
                Verified Agronomy Network
              </span>
              <Radio className="h-4 w-4 text-white/80 animate-pulse" />
            </div>

            <div className="relative z-10 mt-5">
              <p className="text-[11px] font-medium text-white/80">Active Certified Specialists</p>
              <p className="text-3xl sm:text-4xl font-black tracking-tight mt-0.5">
                {verifiedCount}
                <span className="text-sm font-semibold text-white/80 ml-1.5">experts</span>
              </p>
            </div>

            <div className="relative z-10 mt-5 flex items-center justify-between border-t border-white/20 pt-3 text-[11px] font-medium text-white/90">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-white shadow-xs" />
                Network Status: Active
              </span>
              <span className="font-mono text-white/70">KRISHI-PRO</span>
            </div>
          </div>

          <div className="rounded-[24px] border border-[rgba(234,234,236,0.85)] bg-white p-4 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Monthly Farmer Consults</p>
              <p className="text-xl font-black text-[#171717] mt-0.5">
                +{verifiedCount * 14 + 28} Sessions
              </p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#DDF4EA] px-2.5 py-1 text-xs font-black text-[#0F9F68]">
              +18.4%
            </span>
          </div>
        </div>

        {/* Card 2 (Middle): Expertise Distribution Bar Chart (4 cols) */}
        <div className="lg:col-span-4 rounded-[28px] border border-[rgba(234,234,236,0.85)] bg-white p-5 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#DDF4EA] text-[#0F9F68]">
                <Sparkles className="h-3.5 w-3.5" />
              </span>
              <span className="text-xs font-bold text-[#171717]">Domain Distribution</span>
            </div>

            <div className="flex items-center rounded-full bg-[#F4F4F6] p-0.5 text-[10px] font-bold">
              <button
                type="button"
                onClick={() => setDomainMetric("crops")}
                className={`rounded-full px-2.5 py-1 transition-all cursor-pointer ${
                  domainMetric === "crops" ? "bg-[#0F9F68] text-white shadow-xs" : "text-gray-500 hover:text-gray-800"
                }`}
              >
                Crops
              </button>
              <button
                type="button"
                onClick={() => setDomainMetric("regions")}
                className={`rounded-full px-2.5 py-1 transition-all cursor-pointer ${
                  domainMetric === "regions" ? "bg-[#0F9F68] text-white shadow-xs" : "text-gray-500 hover:text-gray-800"
                }`}
              >
                Regions
              </button>
            </div>
          </div>

          <div className="my-3 flex items-end justify-between gap-2.5 px-2 h-28">
            {[
              { label: "CEREAL", height: "h-16", active: false },
              { label: "HORTI", height: "h-22", active: false },
              { label: "SOIL", height: "h-26", active: true, badge: "Top Domain" },
              { label: "PEST", height: "h-18", active: false },
              { label: "ORGN", height: "h-12", active: false },
              { label: "CASH", height: "h-14", active: false },
            ].map((bar) => (
              <div key={bar.label} className="flex flex-1 flex-col items-center gap-1.5 h-full justify-end">
                {bar.active && bar.badge && (
                  <span className="rounded-full bg-[#0F9F68] px-1.5 py-0.2 text-[9px] font-black text-white shadow-2xs mb-0.5 whitespace-nowrap">
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
                <span className={`text-[9px] font-bold ${bar.active ? "text-[#0F9F68]" : "text-gray-400"}`}>
                  {bar.label}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 pt-2.5 text-[11px]">
            <span className="text-gray-400 font-medium">Domain Coverage:</span>
            <span className="font-black text-[#0F9F68]">100% Primary Agriculture</span>
          </div>
        </div>

        {/* Card 3 (Right): Network Total & Top Agronomist Avatars (4 cols) */}
        <div className="lg:col-span-4 rounded-[28px] border border-[rgba(234,234,236,0.85)] bg-white p-5 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400">Total Registered Specialists</span>
              <button
                type="button"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F4F4F6] text-gray-400 hover:text-gray-700 cursor-pointer"
                title="View Analytics"
              >
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="text-2xl sm:text-3xl font-black tracking-tight text-[#171717] mt-1">
              {experts.length}
              <span className="text-xs font-semibold text-gray-400 ml-1.5">Profiles</span>
            </p>
          </div>

          {/* Smooth SVG Wave Sparkline */}
          <div className="my-2 h-14 w-full">
            <svg viewBox="0 0 300 60" className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <defs>
                <linearGradient id="expertWaveGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0F9F68" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#0F9F68" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M0,50 C50,20 90,45 130,25 C170,5 210,35 250,15 C280,5 290,20 300,10 L300,60 L0,60 Z"
                fill="url(#expertWaveGrad)"
              />
              <path
                d="M0,50 C50,20 90,45 130,25 C170,5 210,35 250,15 C280,5 290,20 300,10"
                fill="none"
                stroke="#0F9F68"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 pt-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Featured Agronomists</p>
              <p className="text-xs font-bold text-[#171717]">Top Advisory Leaders</p>
            </div>

            <div className="flex items-center -space-x-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white ring-2 ring-white">
                DR
              </div>
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-600 text-[10px] font-bold text-white ring-2 ring-white">
                MN
              </div>
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white ring-2 ring-white">
                PS
              </div>
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0F9F68] text-[9px] font-black text-white ring-2 ring-white">
                +{Math.max(1, verifiedCount - 3)}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ─── 2. TOOLBAR WITH PILL FILTERS & SEARCH ────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3 justify-between pt-1">
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Search Pill */}
          <div className="flex items-center gap-2 bg-white border border-[rgba(234,234,236,0.85)] rounded-full px-4 py-2 w-72 shadow-2xs">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search experts by name, email, org…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              className="bg-transparent text-xs text-[#171717] outline-none w-full placeholder:text-gray-400"
            />
          </div>

          {/* Segmented Filter Pills */}
          <div className="flex items-center rounded-full bg-[#F4F4F6] p-1 text-xs font-semibold text-gray-600">
            <button
              type="button"
              onClick={() => { setStatusFilter("VERIFIED"); setPage(0); }}
              className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                statusFilter === "VERIFIED" ? "bg-white font-bold text-[#171717] shadow-xs" : "hover:text-[#171717]"
              }`}
            >
              Verified ({verifiedCount})
            </button>
            <button
              type="button"
              onClick={() => { setStatusFilter("UNDER_REVIEW"); setPage(0); }}
              className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                statusFilter === "UNDER_REVIEW" ? "bg-white font-bold text-[#171717] shadow-xs" : "hover:text-[#171717]"
              }`}
            >
              Under Review ({reviewCount})
            </button>
            <button
              type="button"
              onClick={() => { setStatusFilter("PENDING"); setPage(0); }}
              className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                statusFilter === "PENDING" ? "bg-white font-bold text-[#171717] shadow-xs" : "hover:text-[#171717]"
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              type="button"
              onClick={() => { setStatusFilter("ALL"); setPage(0); }}
              className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                statusFilter === "ALL" ? "bg-white font-bold text-[#171717] shadow-xs" : "hover:text-[#171717]"
              }`}
            >
              All
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-semibold px-3.5 py-1.5 bg-[#F4F4F6] rounded-full">
            {isLoading ? "Loading..." : `${filtered.length} expert${filtered.length !== 1 ? "s" : ""}`}
          </span>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-700 bg-white border border-[rgba(234,234,236,0.85)] rounded-full px-4 py-2 hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[#0F9F68]" : "text-gray-400"}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* ─── 3. MODERN TABLE CONTAINER ────────────────────────────────────── */}
      {isLoading ? (
        <TableSkeleton rows={6} columns={6} showHeader={true} />
      ) : loadError ? (
        <div className="rounded-[28px] border border-rose-200 bg-rose-50 p-10 text-center">
          <p className="text-sm font-bold text-rose-900">{loadError}</p>
          <button onClick={() => { setIsLoading(true); void fetchExperts(); }} className="mt-4 rounded-full bg-rose-700 px-4 py-2 text-xs font-bold text-white hover:bg-rose-800 cursor-pointer shadow-xs">
            Try again
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-[28px] border border-[rgba(234,234,236,0.85)] overflow-hidden shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04),0_2px_6px_-1px_rgba(0,0,0,0.02)]">
          {paginated.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center">
                <UserCheck className="w-7 h-7 text-slate-400" />
              </div>
              <p className="text-sm font-semibold text-slate-600">No experts found</p>
              <p className="text-xs text-slate-400">
                {search ? "Try adjusting your search query or filters" : "No expert records currently in this category."}
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-[#F4F4F6]/60">
                  <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider py-3.5 px-6">
                    Expert Specialist
                  </th>
                  <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider py-3.5 px-4 hidden sm:table-cell">
                    Affiliation & Contact
                  </th>
                  <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider py-3.5 px-4 hidden md:table-cell">
                    Crop Domains
                  </th>
                  <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider py-3.5 px-4">
                    Status
                  </th>
                  <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider py-3.5 px-4 hidden lg:table-cell">
                    Tenure
                  </th>
                  <th className="text-right text-[10px] font-bold text-gray-400 uppercase tracking-wider py-3.5 px-6">
                    Audit Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginated.map((expert) => {
                  const status = getStatus(expert);
                  const sc = statusConfig[status] ?? statusConfig.DRAFT;
                  return (
                    <tr
                      key={expert.profileId}
                      className="hover:bg-[#F4F4F6]/60 transition-colors group"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3.5">
                          <div className="w-11 h-11 rounded-[14px] bg-gradient-to-br from-[#0F9F68] to-[#0A6B45] text-white flex items-center justify-center font-black text-sm shrink-0 shadow-2xs ring-2 ring-[#0F9F68]/15 group-hover:scale-105 transition-transform">
                            {formatFullName(expert.fullName).charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <button
                              type="button"
                              onClick={() => handleViewDetails(expert)}
                              className="text-sm font-bold text-[#171717] hover:text-[#0F9F68] transition-colors text-left cursor-pointer flex items-center gap-1.5"
                            >
                              <span>{formatFullName(expert.fullName)}</span>
                            </button>
                            <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                              {expert.designation && expert.designation !== "Not specified" ? expert.designation : "Agricultural Consultant"}
                            </p>
                            <p className="text-[10px] text-gray-400 flex items-center gap-1 sm:hidden mt-0.5">
                              <Mail className="w-3 h-3 text-[#0F9F68]" />
                              {expert.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 hidden sm:table-cell">
                        <div className="space-y-1">
                          <p className="text-xs text-[#171717] font-semibold flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-[#0F9F68]" />
                            <span>{expert.organization && expert.organization !== "Not specified" ? expert.organization : "Independent Specialist"}</span>
                          </p>
                          <p className="text-[11px] text-gray-500 flex items-center gap-1.5">
                            <Mail className="w-3 h-3 text-gray-400" />
                            <span>{expert.email}</span>
                          </p>
                          {expert.phone && (
                            <p className="text-[11px] text-gray-400 flex items-center gap-1.5">
                              <Phone className="w-3 h-3 text-gray-400" />
                              <span>{expert.phone}</span>
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 hidden md:table-cell">
                        <div className="flex flex-wrap gap-1.5 max-w-[240px]">
                          {(expert.primaryCrops ?? []).slice(0, 2).map((crop) => (
                            <span
                              key={crop}
                              className="inline-flex items-center gap-1 text-[10px] font-bold text-[#0F9F68] bg-[#DDF4EA] border border-[#BCE9D5] rounded-full px-2.5 py-0.5 shadow-2xs"
                            >
                              <Sprout className="w-2.5 h-2.5" />
                              {crop}
                            </span>
                          ))}
                          {(expert.specializations ?? []).slice(0, 1).map((spec) => (
                            <span
                              key={spec}
                              className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-full px-2.5 py-0.5 shadow-2xs"
                            >
                              <Award className="w-2.5 h-2.5" />
                              {spec}
                            </span>
                          ))}
                          {(expert.primaryCrops?.length ?? 0) + (expert.specializations?.length ?? 0) > 3 && (
                            <span className="text-[10px] text-gray-500 font-bold self-center bg-gray-100 px-2 py-0.5 rounded-full">
                              +{(expert.primaryCrops?.length ?? 0) + (expert.specializations?.length ?? 0) - 3}
                            </span>
                          )}
                          {!expert.primaryCrops?.length && !expert.specializations?.length && (
                            <span className="text-xs text-gray-400 font-medium">General Agronomy</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 text-[11px] font-bold border rounded-full px-3 py-1 shadow-2xs ${sc.cls}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full bg-current ${status === "VERIFIED" ? "animate-pulse" : ""}`} />
                          {sc.label}
                        </span>
                      </td>
                      <td className="py-4 px-4 hidden lg:table-cell">
                        <span className="inline-flex items-center text-xs font-bold text-[#171717] bg-[#F4F4F6] px-2.5 py-1 rounded-full border border-gray-200/60 shadow-2xs">
                          {expert.yearsOfExperience != null ? `${expert.yearsOfExperience} yr${expert.yearsOfExperience !== 1 ? "s" : ""}` : "1 yr"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          type="button"
                          onClick={() => handleViewDetails(expert)}
                          disabled={loadingDetailId !== null}
                          className="px-4 py-2 rounded-full border border-gray-200 bg-white hover:bg-[#0F9F68] hover:text-white hover:border-[#0F9F68] text-xs font-bold transition-all shadow-2xs hover:shadow inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-60 group/btn"
                          title="View credentials & inspection dossier"
                        >
                          {loadingDetailId === expert.profileId ? (
                            <LoadingSpinner size="xs" color="primary" />
                          ) : (
                            <Eye className="w-3.5 h-3.5 text-gray-500 group-hover/btn:text-white transition-colors" />
                          )}
                          <span>
                            {loadingDetailId === expert.profileId ? "Loading..." : "View Dossier"}
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

      {/* ─── 4. PAGINATION ────────────────────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-gray-500 px-1">
          <p>
            Showing {filtered.length === 0 ? 0 : page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length} specialists
          </p>
          <div className="flex items-center gap-2">
            <span>Page {page + 1} of {totalPages}</span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-1.5 rounded-full border border-gray-200 text-gray-500 hover:bg-white disabled:opacity-30 transition-colors shadow-2xs cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="p-1.5 rounded-full border border-gray-200 text-gray-500 hover:bg-white disabled:opacity-30 transition-colors shadow-2xs cursor-pointer"
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
