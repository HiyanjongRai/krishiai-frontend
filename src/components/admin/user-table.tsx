"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Search,
  Users,
  Radio,
  ArrowUpRight,
  Sparkles,
  Sprout,
  Bot,
  Eye,
  Lock,
  Unlock,
} from "lucide-react";
import { api } from "@/lib/api";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { FarmerDetailsModal } from "./FarmerDetailsModal";

interface Farmer {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  status: string;
  emailVerified: boolean;
  createdAt?: string;
  cropsCount?: number;
  aiAnalysesCount?: number;
}

const PAGE_SIZE = 10;
const avatarColors = [
  "bg-[#0F9F68]",
  "bg-teal-600",
  "bg-emerald-600",
  "bg-blue-600",
  "bg-indigo-600",
  "bg-cyan-700",
];

function formatDate(value?: string) {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "-"
    : date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function isWithinCurrentMonth(value?: string) {
  if (!value) return false;
  const date = new Date(value);
  const now = new Date();
  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
}

function statusClasses(status: string) {
  switch (status.toUpperCase()) {
    case "ACTIVE":
      return "bg-[#DDF4EA] text-[#0F9F68] border-[#BCE9D5]";
    case "BLOCKED":
    case "SUSPENDED":
      return "bg-rose-50 text-rose-700 border-rose-200";
    case "PENDING":
      return "bg-amber-50 text-amber-700 border-amber-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
}

export function UserTable() {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [locationFilter, setLocationFilter] = useState("ALL");
  const [activityMetric, setActivityMetric] = useState<"diagnoses" | "crops">("diagnoses");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  const fetchFarmers = useCallback(async () => {
    setLoadError(null);
    try {
      const data = await api.get<Farmer[]>("/v1/admin/farmers");
      setFarmers(Array.isArray(data) ? data : []);
    } catch {
      setLoadError("Unable to load farmers. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => { void fetchFarmers(); }, 0);
    return () => window.clearTimeout(timer);
  }, [fetchFarmers]);

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
      const matchesLocation = locationFilter === "ALL" || farmer.location === locationFilter;
      return matchesSearch && matchesStatus && matchesLocation;
    });
  }, [farmers, locationFilter, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages - 1);
  const paginated = filtered.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);
  const totalActive = farmers.filter((farmer) => farmer.status.toUpperCase() === "ACTIVE").length;
  const newThisMonth = farmers.filter((farmer) => isWithinCurrentMonth(farmer.createdAt)).length;

  const resetPage = () => setPage(0);

  if (isLoading) return <TableSkeleton rows={7} columns={7} showHeader />;
  if (loadError) {
    return (
      <div className="rounded-[28px] border border-rose-200 bg-rose-50 p-10 text-center">
        <p className="text-sm font-bold text-rose-900">{loadError}</p>
        <button
          onClick={() => { setIsLoading(true); void fetchFarmers(); }}
          className="mt-4 rounded-full bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 cursor-pointer"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ─── 1. TOP BENTO GRID (MATCHING REFERENCE UI) ────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">

        {/* Card 1 (Left): Green Emerald Hero Card & Subcard (4 cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-4">
          <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#0F9F68] via-[#0D8A5A] to-[#0A6B45] p-5 text-white shadow-[0_10px_30px_-8px_rgba(15,159,104,0.35)]">
            <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/10 blur-xl pointer-events-none" />
            <div className="absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-black/10 blur-lg pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.16em] text-white/90">
                Farmer Community Network
              </span>
              <Radio className="h-4 w-4 text-white/80 animate-pulse" />
            </div>

            <div className="relative z-10 mt-5">
              <p className="text-[11px] font-medium text-white/80">Active Verified Cultivators</p>
              <p className="text-3xl sm:text-4xl font-black tracking-tight mt-0.5">
                {totalActive}
                <span className="text-sm font-semibold text-white/80 ml-1.5">farmers</span>
              </p>
            </div>

            <div className="relative z-10 mt-5 flex items-center justify-between border-t border-white/20 pt-3 text-[11px] font-medium text-white/90">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-white shadow-xs" />
                Network Health: Optimal
              </span>
              <span className="font-mono text-white/70">KRISHI-FARM</span>
            </div>
          </div>

          <div className="rounded-[24px] border border-[rgba(234,234,236,0.85)] bg-white p-4 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">New This Month</p>
              <p className="text-xl font-black text-[#171717] mt-0.5">
                +{newThisMonth} Joined
              </p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#DDF4EA] px-2.5 py-1 text-xs font-black text-[#0F9F68]">
              +12.8%
            </span>
          </div>
        </div>

        {/* Card 2 (Middle): Diagnostic & Crop Velocity Bar Chart (4 cols) */}
        <div className="lg:col-span-4 rounded-[28px] border border-[rgba(234,234,236,0.85)] bg-white p-5 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#DDF4EA] text-[#0F9F68]">
                <Sparkles className="h-3.5 w-3.5" />
              </span>
              <span className="text-xs font-bold text-[#171717]">Farmer Activity Trends</span>
            </div>

            <div className="flex items-center rounded-full bg-[#F4F4F6] p-0.5 text-[10px] font-bold">
              <button
                type="button"
                onClick={() => setActivityMetric("diagnoses")}
                className={`rounded-full px-2.5 py-1 transition-all cursor-pointer ${
                  activityMetric === "diagnoses" ? "bg-[#0F9F68] text-white shadow-xs" : "text-gray-500 hover:text-gray-800"
                }`}
              >
                AI Scans
              </button>
              <button
                type="button"
                onClick={() => setActivityMetric("crops")}
                className={`rounded-full px-2.5 py-1 transition-all cursor-pointer ${
                  activityMetric === "crops" ? "bg-[#0F9F68] text-white shadow-xs" : "text-gray-500 hover:text-gray-800"
                }`}
              >
                Crops
              </button>
            </div>
          </div>

          <div className="my-3 flex items-end justify-between gap-2.5 px-2 h-28">
            {[
              { label: "MON", height: "h-14", active: false },
              { label: "TUE", height: "h-20", active: false },
              { label: "WED", height: "h-26", active: true, badge: "+24.6%" },
              { label: "THU", height: "h-18", active: false },
              { label: "FRI", height: "h-22", active: false },
              { label: "SAT", height: "h-12", active: false },
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
            <span className="text-gray-400 font-medium">Weekly AI Diagnoses:</span>
            <span className="font-black text-[#0F9F68]">348 leaf scans resolved</span>
          </div>
        </div>

        {/* Card 3 (Right): Total Farmers & Community Cluster (4 cols) */}
        <div className="lg:col-span-4 rounded-[28px] border border-[rgba(234,234,236,0.85)] bg-white p-5 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400">Total Registered Cultivators</span>
              <button
                type="button"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F4F4F6] text-gray-400 hover:text-gray-700 cursor-pointer"
                title="View Analytics"
              >
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="text-2xl sm:text-3xl font-black tracking-tight text-[#171717] mt-1">
              {farmers.length}
              <span className="text-xs font-semibold text-gray-400 ml-1.5">Accounts</span>
            </p>
          </div>

          {/* Smooth SVG Wave Sparkline */}
          <div className="my-2 h-14 w-full">
            <svg viewBox="0 0 300 60" className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <defs>
                <linearGradient id="farmerWaveGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0F9F68" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#0F9F68" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M0,45 C30,30 60,15 100,35 C140,55 180,20 220,15 C260,10 280,30 300,20 L300,60 L0,60 Z"
                fill="url(#farmerWaveGrad)"
              />
              <path
                d="M0,45 C30,30 60,15 100,35 C140,55 180,20 220,15 C260,10 280,30 300,20"
                fill="none"
                stroke="#0F9F68"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 pt-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Farmer Directory</p>
              <p className="text-xs font-bold text-[#171717]">Multi-district Reach</p>
            </div>

            <div className="flex items-center -space-x-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white ring-2 ring-white">
                RK
              </div>
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-600 text-[10px] font-bold text-white ring-2 ring-white">
                BT
              </div>
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white ring-2 ring-white">
                ST
              </div>
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0F9F68] text-[9px] font-black text-white ring-2 ring-white">
                +{Math.max(1, farmers.length - 3)}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ─── 2. FILTER TOOLBAR ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
        <label className="relative min-w-0 flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(event) => { setSearch(event.target.value); resetPage(); }}
            placeholder="Search by name, email, phone, or location..."
            className="h-10 w-full rounded-full border border-[rgba(234,234,236,0.85)] bg-white pl-10 pr-4 text-xs text-[#171717] outline-none placeholder:text-gray-400 focus:border-[#0F9F68] focus:ring-3 focus:ring-[#0F9F68]/15 shadow-2xs transition-all"
          />
        </label>
        <select
          value={statusFilter}
          onChange={(event) => { setStatusFilter(event.target.value); resetPage(); }}
          className="h-10 rounded-full border border-[rgba(234,234,236,0.85)] bg-white px-4 text-xs font-semibold text-gray-700 outline-none focus:border-[#0F9F68] shadow-2xs cursor-pointer"
        >
          <option value="ALL">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="BLOCKED">Blocked</option>
          <option value="SUSPENDED">Suspended</option>
          <option value="PENDING">Pending</option>
        </select>
        <select
          value={locationFilter}
          onChange={(event) => { setLocationFilter(event.target.value); resetPage(); }}
          className="h-10 rounded-full border border-[rgba(234,234,236,0.85)] bg-white px-4 text-xs font-semibold text-gray-700 outline-none focus:border-[#0F9F68] shadow-2xs cursor-pointer"
        >
          <option value="ALL">All Locations</option>
          {locations.map((location) => (
            <option key={location} value={location}>{location}</option>
          ))}
        </select>
      </div>

      {/* ─── 3. MODERN TABLE CONTAINER ────────────────────────────────────── */}
      <div className="overflow-x-auto rounded-[28px] border border-[rgba(234,234,236,0.85)] bg-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04),0_2px_6px_-1px_rgba(0,0,0,0.02)]">
        {paginated.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Users className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-3 text-sm font-bold text-[#171717]">No farmers found</p>
            <p className="mt-1 text-xs text-gray-400">Try adjusting your search criteria or filters.</p>
          </div>
        ) : (
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F4F4F6]/60">
                <HeaderCell label="Farmer" />
                <HeaderCell label="Email Address" />
                <HeaderCell label="Location" />
                <HeaderCell label="Registered" />
                <HeaderCell label="Crops Plotted" />
                <HeaderCell label="AI Diagnoses" />
                <HeaderCell label="Account Status" />
                <th className="w-10 px-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.map((farmer, index) => (
                <tr key={farmer.id} className="hover:bg-[#F4F4F6]/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                          avatarColors[index % avatarColors.length]
                        } shadow-2xs`}
                      >
                        {farmer.fullName
                          .split(" ")
                          .map((part) => part[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()}
                      </span>
                      <div>
                        <p className="whitespace-nowrap text-xs font-bold text-[#171717]">{farmer.fullName}</p>
                        <p className="text-[10px] text-gray-400 font-medium">{farmer.phone || "No phone registered"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-gray-600 font-medium">{farmer.email}</td>
                  <td className="px-4 py-3.5 text-xs text-gray-600 font-medium">{farmer.location || "—"}</td>
                  <td className="px-4 py-3.5 whitespace-nowrap text-xs text-gray-500 font-medium">
                    {formatDate(farmer.createdAt)}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[#0F9F68] bg-[#DDF4EA] px-2.5 py-0.5 rounded-full">
                      <Sprout className="w-3 h-3" />
                      {farmer.cropsCount ?? 0}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">
                      <Bot className="w-3 h-3" />
                      {farmer.aiAnalysesCount ?? 0}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${statusClasses(
                        farmer.status
                      )}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          farmer.status.toUpperCase() === "ACTIVE"
                            ? "bg-[#0F9F68]"
                            : farmer.status.toUpperCase() === "PENDING"
                            ? "bg-amber-500"
                            : "bg-rose-500"
                        }`}
                      />
                      {farmer.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFarmer(farmer);
                        setIsDetailsOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#F4F4F6] px-3 py-1 text-xs font-bold text-gray-700 hover:bg-[#DDF4EA] hover:text-[#0F9F68] transition-colors cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Details</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ─── 4. PAGINATION ────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between text-xs text-gray-500 px-1">
        <span>
          Showing {filtered.length === 0 ? 0 : currentPage * PAGE_SIZE + 1}–{Math.min((currentPage + 1) * PAGE_SIZE, filtered.length)} of {filtered.length} farmers
        </span>
        <div className="flex items-center gap-2">
          <span>Page {currentPage + 1} of {totalPages}</span>
          <button
            type="button"
            aria-label="Previous page"
            onClick={() => setPage((value) => Math.max(0, value - 1))}
            disabled={currentPage === 0}
            className="rounded-full border border-gray-200 p-1.5 hover:bg-white disabled:opacity-30 cursor-pointer transition-colors shadow-2xs"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Next page"
            onClick={() => setPage((value) => Math.min(totalPages - 1, value + 1))}
            disabled={currentPage === totalPages - 1}
            className="rounded-full border border-gray-200 p-1.5 hover:bg-white disabled:opacity-30 cursor-pointer transition-colors shadow-2xs"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Farmer Account & Moderation Details Modal */}
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

function HeaderCell({ label }: { label: string }) {
  return (
    <th className="whitespace-nowrap px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-gray-400">
      {label}
    </th>
  );
}
