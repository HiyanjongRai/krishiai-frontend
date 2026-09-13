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
      return "bg-emerald-50 text-emerald-800 border-emerald-200";
    case "BLOCKED":
    case "SUSPENDED":
      return "bg-rose-50 text-rose-800 border-rose-200";
    case "PENDING":
      return "bg-amber-50 text-amber-800 border-amber-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
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
      {/* ── 1. Page Header & Stats Strip ────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Cultivators Directory
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-slate-500">
            Oversee registered agricultural producers, plot allocations, and security statuses.
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Cultivators</span>
            <Users className="h-4 w-4 text-slate-400" />
          </div>
          <p className="mt-1.5 text-2xl font-bold text-slate-900">{farmers.length}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Active Accounts</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="mt-1.5 text-2xl font-bold text-emerald-700">{totalActive}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Suspended / Blocked</span>
            <AlertCircle className="h-4 w-4 text-rose-500" />
          </div>
          <p className="mt-1.5 text-2xl font-bold text-slate-900">{totalBlocked}</p>
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
            placeholder="Search by name, email, phone, location..."
            className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 shadow-2xs transition-colors"
          />
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); resetPage(); }}
            className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 outline-none focus:border-emerald-700 shadow-2xs cursor-pointer"
          >
            <option value="ALL">All Roles</option>
            <option value="ROLE_FARMER">Farmers</option>
            <option value="ROLE_EXPERT">Experts</option>
            <option value="ROLE_ADMIN">Admins</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); resetPage(); }}
            className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 outline-none focus:border-emerald-700 shadow-2xs cursor-pointer"
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
              className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 outline-none focus:border-emerald-700 shadow-2xs cursor-pointer"
            >
              <option value="ALL">All Locations</option>
              {locations.map((loc) => (
                <option key={loc} value={loc!}>
                  {loc}
                </option>
              ))}
            </select>
          )}
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
              onClick={() => { setIsLoading(true); void fetchFarmers(); }}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-800 transition-colors shadow-2xs cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Retry</span>
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="mx-auto h-8 w-8 text-slate-400" />
            <h3 className="mt-2 text-sm font-semibold text-slate-900">No cultivators found</h3>
            <p className="mt-1 text-xs text-slate-500">
              No registered farmers match your current search or filter criteria.
            </p>
          </div>
        ) : (
          <>
            {/* ── Mobile card list (< md) ──────────────────────────────── */}
            <div className="md:hidden divide-y divide-slate-100">
              {paginated.map((farmer) => (
                <div key={farmer.id} className="p-4 flex items-start gap-3 hover:bg-slate-50/60 transition-colors">
                  <UserAvatar
                    src={farmer.profileImage}
                    name={farmer.fullName}
                    size="sm"
                    className="rounded-lg ring-1 ring-slate-200 shrink-0 mt-0.5"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-900 truncate">{farmer.fullName}</p>
                        <p className="text-[11px] text-slate-500 truncate">{farmer.email}</p>
                        {farmer.location && (
                          <p className="mt-0.5 text-[11px] text-slate-400 flex items-center gap-1">
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
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5 font-semibold text-slate-700">
                          <Sprout className="h-3 w-3 text-emerald-700" />{farmer.cropsCount ?? 0}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5 font-semibold text-slate-700">
                          <Bot className="h-3 w-3 text-blue-600" />{farmer.aiAnalysesCount ?? 0}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setSelectedFarmer(farmer); setIsDetailsOpen(true); }}
                        className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
                      >
                        <Eye className="h-3 w-3 text-slate-400" />
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
                <thead className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
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
                <tbody className="divide-y divide-slate-100">
                  {paginated.map((farmer) => (
                    <tr key={farmer.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <UserAvatar
                            src={farmer.profileImage}
                            name={farmer.fullName}
                            size="sm"
                            className="rounded-lg ring-1 ring-slate-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 truncate">{farmer.fullName}</p>
                            <p className="text-[11px] text-slate-500">{farmer.phone || "No phone recorded"}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-600 font-medium">{farmer.email}</td>

                      <td className="py-3 px-4 text-slate-600">
                        {farmer.location ? (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                            <span>{farmer.location}</span>
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                        {formatDate(farmer.createdAt)}
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                          <Sprout className="h-3 w-3 text-emerald-700" />
                          {farmer.cropsCount ?? 0}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                          <Bot className="h-3 w-3 text-blue-600" />
                          {farmer.aiAnalysesCount ?? 0}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold ${statusClasses(farmer.status)}`}>
                          {farmer.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFarmer(farmer);
                            setIsDetailsOpen(true);
                          }}
                          className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
                        >
                          <Eye className="h-3 w-3 text-slate-400" />
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
          <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 bg-slate-50/50">
            <span className="text-xs text-slate-500">
              Showing <span className="font-semibold text-slate-900">{page * PAGE_SIZE + 1}</span> to{" "}
              <span className="font-semibold text-slate-900">{Math.min((page + 1) * PAGE_SIZE, filtered.length)}</span> of{" "}
              <span className="font-semibold text-slate-900">{filtered.length}</span> cultivators
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
