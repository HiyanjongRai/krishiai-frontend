"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Users,
  Sprout,
  Bot,
  RefreshCw,
  Eye,
  CheckCircle2,
  AlertCircle,
  MapPin,
} from "lucide-react";
import { api } from "@/lib/api";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { FarmerDetailsModal } from "./FarmerDetailsModal";
import { UserAvatar } from "@/components/ui/avatar";

interface Farmer {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  role?: string;
  location?: string;
  status: string;
  emailVerified: boolean;
  profileImage?: string;
  createdAt?: string;
  cropsCount?: number;
  aiAnalysesCount?: number;
}

const PAGE_SIZE = 10;

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function statusClasses(status: string) {
  switch (status.toUpperCase()) {
    case "ACTIVE":
      return "bg-[#E8F5E9] text-[#2E7D32] border-[#A5D6A7]";
    case "BLOCKED":
    case "SUSPENDED":
      return "bg-[#FEE2E2] text-[#DC2626] border-[#FCA5A5]";
    case "PENDING":
      return "bg-[#FEF3C7] text-[#F59E0B] border-[#FCD34D]";
    default:
      return "bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB]";
  }
}

export function UserTable() {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [locationFilter, setLocationFilter] = useState("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  const fetchFarmers = useCallback(async () => {
    setLoadError(null);
    try {
      const data = await api.get<Farmer[]>("/v1/admin/farmers");
      setFarmers(Array.isArray(data) ? data : []);
    } catch {
      setLoadError("Unable to load cultivators list. Please check connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => { void fetchFarmers(); }, 0);
    return () => window.clearTimeout(timer);
  }, [fetchFarmers]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchFarmers();
    setIsRefreshing(false);
  };

  const locations = useMemo(
    () => Array.from(new Set(farmers.map((farmer) => farmer.location).filter(Boolean))).sort(),
    [farmers]
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return farmers.filter((farmer) => {
      const matchesSearch =
        !query ||
        [farmer.fullName, farmer.email, farmer.phone, farmer.location].some((value) =>
          value?.toLowerCase().includes(query)
        );
      const matchesStatus = statusFilter === "ALL" || farmer.status.toUpperCase() === statusFilter;
      const matchesRole = roleFilter === "ALL" || (farmer.role ? farmer.role.toUpperCase() === roleFilter : true);
      const matchesLocation = locationFilter === "ALL" || farmer.location === locationFilter;
      return matchesSearch && matchesStatus && matchesLocation && matchesRole;
    });
  }, [farmers, search, statusFilter, roleFilter, locationFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = useMemo(
    () => filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE),
    [filtered, page]
  );

  const resetPage = () => setPage(0);

  const totalActive = farmers.filter((f) => f.status.toUpperCase() === "ACTIVE").length;
  const totalBlocked = farmers.filter((f) => f.status.toUpperCase() === "BLOCKED" || f.status.toUpperCase() === "SUSPENDED").length;

  return (
    <div className="space-y-6">
      {/* Summary Metrics Strip (Farmer Dashboard Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE] space-y-2 hover:border-[#C8E6C9] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6B7280]">Total Cultivators</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8F5E9] text-[#2E7D32]">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-[#1F2937] tracking-tight">{farmers.length}</p>
            <p className="text-[11px] text-[#9CA3AF] mt-0.5">Registered farmer network</p>
          </div>
        </div>

        <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE] space-y-2 hover:border-[#C8E6C9] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6B7280]">Active Accounts</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8F5E9] text-[#2E7D32]">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-[#2E7D32] tracking-tight">{totalActive}</p>
            <p className="text-[11px] text-[#9CA3AF] mt-0.5">Platform enabled producers</p>
          </div>
        </div>

        <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE] space-y-2 hover:border-[#FCA5A5] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6B7280]">Suspended / Blocked</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FEE2E2] text-[#DC2626]">
              <AlertCircle className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-[#1F2937] tracking-tight">{totalBlocked}</p>
            <p className="text-[11px] text-[#9CA3AF] mt-0.5">Restricted or flagged accounts</p>
          </div>
        </div>
      </div>

      {/* ── 2. Filters & Search Toolbar (Farmer Dashboard Pills) ─────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative min-w-0 flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); resetPage(); }}
            placeholder="Search by name, email, phone, location..."
            className="h-10 w-full rounded-full border border-[#E5E7EB] bg-white pl-9 pr-4 text-xs text-[#1F2937] outline-none placeholder:text-[#9CA3AF] shadow-[0_4px_20px_-2px_#EEF0EE] transition-all focus:border-[#2E7D32] focus:ring-3 focus:ring-[#2E7D32]/15"
          />
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); resetPage(); }}
            className="h-10 rounded-full border border-[#E5E7EB] bg-white px-4 text-xs font-semibold text-[#4B5563] shadow-[0_4px_20px_-2px_#EEF0EE] outline-none focus:border-[#2E7D32] focus:ring-3 focus:ring-[#2E7D32]/15 cursor-pointer"
          >
            <option value="ALL">All Roles</option>
            <option value="ROLE_FARMER">Farmers</option>
            <option value="ROLE_EXPERT">Experts</option>
            <option value="ROLE_ADMIN">Admins</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); resetPage(); }}
            className="h-10 rounded-full border border-[#E5E7EB] bg-white px-4 text-xs font-semibold text-[#4B5563] shadow-[0_4px_20px_-2px_#EEF0EE] outline-none focus:border-[#2E7D32] focus:ring-3 focus:ring-[#2E7D32]/15 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="PENDING">Pending</option>
            <option value="BLOCKED">Blocked</option>
            <option value="SUSPENDED">Suspended</option>
          </select>

          {locations.length > 0 && (
            <select
              value={locationFilter}
              onChange={(e) => { setLocationFilter(e.target.value); resetPage(); }}
              className="h-10 rounded-full border border-[#E5E7EB] bg-white px-4 text-xs font-semibold text-[#4B5563] shadow-[0_4px_20px_-2px_#EEF0EE] outline-none focus:border-[#2E7D32] focus:ring-3 focus:ring-[#2E7D32]/15 cursor-pointer"
            >
              <option value="ALL">All Locations</option>
              {locations.map((loc) => (
                <option key={loc} value={loc!}>
                  {loc}
                </option>
              ))}
            </select>
          )}

          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-bold text-[#4B5563] shadow-[0_4px_20px_-2px_#EEF0EE] transition-all hover:bg-[#F1F5F2] hover:text-[#2E7D32] cursor-pointer"
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
              onClick={() => { setIsLoading(true); void fetchFarmers(); }}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[#2E7D32] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#256B2A] cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Retry</span>
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="mx-auto h-8 w-8 text-[#9CA3AF]" />
            <h3 className="mt-2 text-sm font-semibold text-[#1F2937]">No cultivators found</h3>
            <p className="mt-1 text-xs text-[#6B7280]">
              No registered farmers match your current search or filter criteria.
            </p>
          </div>
        ) : (
          <>
            {/* ── Mobile card list (< md) ──────────────────────────────── */}
            <div className="md:hidden divide-y divide-[#EEF0EE]">
              {paginated.map((farmer) => (
                <div key={farmer.id} className="p-4 flex items-start gap-3 transition-colors hover:bg-[#F8FAF8]">
                  <UserAvatar
                    src={farmer.profileImage}
                    name={farmer.fullName}
                    size="sm"
                    className="rounded-lg ring-1 ring-[#E5E7EB] shrink-0 mt-0.5"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#1F2937] truncate">{farmer.fullName}</p>
                        <p className="text-[11px] text-[#6B7280] truncate">{farmer.email}</p>
                        {farmer.location && (
                          <p className="mt-0.5 text-[11px] text-[#9CA3AF] flex items-center gap-1">
                            <MapPin className="h-3 w-3 shrink-0" />
                            {farmer.location}
                          </p>
                        )}
                      </div>
                      <span className={`inline-flex shrink-0 items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold ${statusClasses(farmer.status)}`}>
                        {farmer.status}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-[11px] text-[#6B7280]">
                        <span className="inline-flex items-center gap-1 rounded bg-[#F1F5F2] px-1.5 py-0.5 font-semibold text-[#4B5563]">
                          <Sprout className="h-3 w-3 text-[#2E7D32]" />{farmer.cropsCount ?? 0}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded bg-[#EEF2FF] px-1.5 py-0.5 font-semibold text-[#3730A3]">
                          <Bot className="h-3 w-3 text-[#4F46E5]" />{farmer.aiAnalysesCount ?? 0}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setSelectedFarmer(farmer); setIsDetailsOpen(true); }}
                        className="inline-flex items-center gap-1 rounded-md border border-[#E5E7EB] bg-white px-2.5 py-1 text-xs font-medium text-[#4B5563] shadow-sm transition-colors hover:bg-[#F1F5F2] hover:text-[#2E7D32] cursor-pointer"
                      >
                        <Eye className="h-3 w-3 text-[#9CA3AF]" />
                        <span>Manage</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Desktop table (md+) ──────────────────────────────────── */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[#E5E7EB] bg-[#F8FAF8] text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Cultivator</th>
                    <th className="py-3 px-4">Email Address</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Registered Date</th>
                    <th className="py-3 px-4">Plots</th>
                    <th className="py-3 px-4">AI Scans</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EEF0EE]">
                  {paginated.map((farmer) => (
                    <tr key={farmer.id} className="transition-colors hover:bg-[#F8FAF8]">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <UserAvatar
                            src={farmer.profileImage}
                            name={farmer.fullName}
                            size="sm"
                            className="rounded-lg ring-1 ring-[#E5E7EB] shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-[#1F2937] truncate">{farmer.fullName}</p>
                            <p className="text-[11px] text-[#6B7280]">{farmer.phone || "No phone recorded"}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-[#4B5563] font-medium">{farmer.email}</td>

                      <td className="py-3 px-4 text-[#4B5563]">
                        {farmer.location ? (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-[#9CA3AF] shrink-0" />
                            <span>{farmer.location}</span>
                          </span>
                        ) : (
                          <span className="text-[#9CA3AF]">—</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-[#6B7280] whitespace-nowrap">
                        {formatDate(farmer.createdAt)}
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 rounded bg-[#F1F5F2] px-2 py-0.5 text-xs font-semibold text-[#4B5563]">
                          <Sprout className="h-3 w-3 text-[#2E7D32]" />
                          {farmer.cropsCount ?? 0}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 rounded bg-[#EEF2FF] px-2 py-0.5 text-xs font-semibold text-[#3730A3]">
                          <Bot className="h-3 w-3 text-[#4F46E5]" />
                          {farmer.aiAnalysesCount ?? 0}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${statusClasses(farmer.status)}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {farmer.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFarmer(farmer);
                            setIsDetailsOpen(true);
                          }}
                          className="inline-flex items-center gap-1.5 rounded-full border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-semibold text-[#4B5563] shadow-xs transition-colors hover:border-[#2E7D32] hover:bg-[#E8F5E9] hover:text-[#2E7D32] cursor-pointer"
                        >
                          <Eye className="h-3 w-3 text-[#9CA3AF]" />
                          <span>Manage</span>
                        </button>
                      </td>
                    </tr>
                  ))}
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
              <span className="font-bold text-[#1F2937]">{filtered.length}</span> cultivators
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

      {/* ── Farmer Management Details Modal ─────────────────────────────────── */}
      <FarmerDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedFarmer(null);
        }}
        farmer={selectedFarmer}
        onStatusChanged={fetchFarmers}
      />
    </div>
  );
}
