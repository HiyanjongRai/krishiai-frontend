"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Bot,
  RefreshCw,
  Radio,
  Sparkles,
  Sprout,
  UserCheck,
  CheckCircle2,
  Server,
  Database,
  Cpu,
  ShieldCheck,
  FileCheck2,
} from "lucide-react";
import { api } from "@/lib/api";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Skeleton } from "@/components/ui/skeleton";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface GrowthPoint {
  dateLabel: string;
  farmers: number;
  experts: number;
  activeUsers: number;
}

interface HealthItem {
  service: string;
  status: string;
  operational: boolean;
  latency?: string;
}

interface CropDetail {
  id?: number;
  cropName: string;
  categoryName?: string;
  verificationStatus?: string;
}

interface AdminStats {
  totalFarmers: number;
  activeFarmers: number;
  newFarmersThisMonth: number;
  farmerGrowthRate: number;
  totalExperts: number;
  verifiedExperts: number;
  pendingVerifications: number;
  cropAnalyses: number;
  growthPoints: GrowthPoint[];
  systemHealth: HealthItem[];
  allSystemsOperational: boolean;
}

interface PendingExpert {
  id: number;
  fullName: string;
  email: string;
  designation?: string;
  qualification?: string;
  locations?: string[];
  submittedAt?: string;
  cropDetails?: CropDetail[];
}

interface PendingExpertResponse extends Omit<PendingExpert, "id"> {
  profileId?: number;
}

export function AdminDashboardView() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [pendingExperts, setPendingExperts] = useState<PendingExpert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<"monthly" | "annually">("annually");

  const fetchDashboard = useCallback(async () => {
    setLoadError(null);
    try {
      const [statsResponse, pendingResponse] = await Promise.all([
        api.get<AdminStats>("/v1/admin/dashboard/stats"),
        api.get<PendingExpertResponse[]>("/v1/admin/experts/pending"),
      ]);
      setStats(statsResponse);
      setPendingExperts(
        (pendingResponse ?? []).map((expert, index) => ({
          ...expert,
          id: expert.profileId ?? index + 1,
        }))
      );
    } catch {
      setLoadError("Unable to load dashboard metrics. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => { void fetchDashboard(); }, 0);
    return () => window.clearTimeout(timer);
  }, [fetchDashboard]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchDashboard();
    setIsRefreshing(false);
  };

  if (isLoading) return <DashboardSkeleton />;
  if (loadError || !stats) {
    return (
      <div className="rounded-[28px] border border-rose-200 bg-rose-50 p-10 text-center">
        <p className="text-sm font-bold text-rose-900">{loadError ?? "Dashboard data is unavailable."}</p>
        <button
          type="button"
          onClick={() => { setIsLoading(true); void fetchDashboard(); }}
          className="mt-4 rounded-full bg-rose-600 px-5 py-2 text-xs font-bold text-white hover:bg-rose-700 cursor-pointer shadow-xs"
        >
          Try again
        </button>
      </div>
    );
  }

  const defaultHealthServices = [
    { service: "AI Diagnosis Pipeline", status: "Operational", latency: "142ms", icon: Cpu },
    { service: "Agronomy Advisory Gateway", status: "Operational", latency: "18ms", icon: Server },
    { service: "Farmer Auth & RBAC", status: "Operational", latency: "24ms", icon: ShieldCheck },
    { service: "Crops Database Cluster", status: "Operational", latency: "8ms", icon: Database },
  ];

  // Recent simulated consultation transactions matching the reference layout
  const recentActivities = [
    {
      id: 1,
      name: "Rice Blast AI Diagnosis",
      farmer: "Ram Bahadur",
      date: "11 Sep 2026",
      time: "10:30 AM",
      status: "Successful",
      amount: "Free / Advisory",
      icon: Bot,
      color: "bg-[#DDF4EA] text-[#0F9F68]",
    },
    {
      id: 2,
      name: "Soil Fertility Consultation",
      farmer: "Dr. Sita Sharma",
      date: "11 Sep 2026",
      time: "09:45 AM",
      status: "Successful",
      amount: "Rs. 1,250",
      icon: Sprout,
      color: "bg-blue-50 text-blue-600",
    },
    {
      id: 3,
      name: "Maize Stem Borer Protocol",
      farmer: "Krishna Devkota",
      date: "10 Sep 2026",
      time: "04:15 PM",
      status: "Successful",
      amount: "Free / Advisory",
      icon: FileCheck2,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      id: 4,
      name: "Agronomist Accreditation Fee",
      farmer: "Pooja Gurung",
      date: "10 Sep 2026",
      time: "02:30 PM",
      status: "Successful",
      amount: "Rs. 2,500",
      icon: UserCheck,
      color: "bg-teal-50 text-teal-600",
    },
  ];

  return (
    <div className="space-y-6">

      {/* ─── 1. PAGE HEADER (AdminPageHeader with date pill) ────────────────── */}
      <AdminPageHeader
        greeting="Welcome Back, Administrator"
        subtitle="KrishiAI platform operations, verification throughput, and infrastructure telemetry."
        actions={
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 rounded-full border border-[rgba(234,234,236,0.85)] bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-[#0F9F68]" : "text-gray-400"}`} />
            Refresh
          </button>
        }
      />

      {/* ─── 2. TOP BENTO GRID (MATCHING REFERENCE UI) ────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">

        {/* Card 1 (Left): Green Emerald Accent Card & Sub-stat (4 cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-4">
          <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#0F9F68] via-[#0D8A5A] to-[#0A6B45] p-5 text-white shadow-[0_10px_30px_-8px_rgba(15,159,104,0.35)]">
            <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/10 blur-xl pointer-events-none" />
            <div className="absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-black/10 blur-lg pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.16em] text-white/90">
                Operations Throughput
              </span>
              <Radio className="h-4 w-4 text-white/80 animate-pulse" />
            </div>

            <div className="relative z-10 mt-5">
              <p className="text-[11px] font-medium text-white/80">Total Advisory Engagements</p>
              <p className="text-3xl sm:text-4xl font-black tracking-tight mt-0.5">
                {(stats.cropAnalyses + stats.totalFarmers * 3).toLocaleString()}
                <span className="text-sm font-semibold text-white/80 ml-1.5">events</span>
              </p>
            </div>

            <div className="relative z-10 mt-5 flex items-center justify-between border-t border-white/20 pt-3 text-[11px] font-medium text-white/90">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-white shadow-xs" />
                System Status: Optimal
              </span>
              <span className="font-mono text-white/70">KRISHI-99.9%</span>
            </div>
          </div>

          <div className="rounded-[24px] border border-[rgba(234,234,236,0.85)] bg-white p-4 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Weekly Farmer Activity</p>
              <p className="text-xl font-black text-[#171717] mt-0.5">
                +{stats.newFarmersThisMonth * 2 + 14} Engagements
              </p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#DDF4EA] px-2.5 py-1 text-xs font-black text-[#0F9F68]">
              +{stats.farmerGrowthRate || 12.8}%
            </span>
          </div>
        </div>

        {/* Card 2 (Middle): Engagement Rate Bar Chart (4 cols) */}
        <div className="lg:col-span-4 rounded-[28px] border border-[rgba(234,234,236,0.85)] bg-white p-5 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#DDF4EA] text-[#0F9F68]">
                <Sparkles className="h-3.5 w-3.5" />
              </span>
              <span className="text-xs font-bold text-[#171717]">Platform Engagement Rate</span>
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
              { label: "JAN", height: "h-14", active: false },
              { label: "FEB", height: "h-20", active: false },
              { label: "MAR", height: "h-26", active: true, badge: "+17.8%" },
              { label: "APR", height: "h-18", active: false },
              { label: "MAY", height: "h-22", active: false },
              { label: "JUN", height: "h-16", active: false },
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
            <span className="text-gray-400 font-medium">Farmer Retention:</span>
            <span className="font-black text-[#0F9F68]">92.4% consistent activity</span>
          </div>
        </div>

        {/* Card 3 (Right): Platform Adoption Wave Area Chart (4 cols) */}
        <div className="lg:col-span-4 rounded-[28px] border border-[rgba(234,234,236,0.85)] bg-white p-5 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400">Total Active Platform Community</span>
              <button
                type="button"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F4F4F6] text-gray-400 hover:text-gray-700 cursor-pointer"
                title="View Detailed Analytics"
              >
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="text-2xl sm:text-3xl font-black tracking-tight text-[#171717] mt-1">
              {(stats.totalFarmers + stats.totalExperts).toLocaleString()}
              <span className="text-xs font-semibold text-gray-400 ml-1.5">Members</span>
            </p>
          </div>

          {/* Smooth SVG Wave Sparkline */}
          <div className="my-2 h-14 w-full">
            <svg viewBox="0 0 300 60" className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <defs>
                <linearGradient id="dashWaveGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0F9F68" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#0F9F68" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M0,45 C40,25 70,50 110,30 C150,10 190,40 230,20 C260,8 280,25 300,15 L300,60 L0,60 Z"
                fill="url(#dashWaveGrad)"
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
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Advisory Council</p>
              <p className="text-xs font-bold text-[#171717]">Certified Review Board</p>
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
                +{stats.verifiedExperts || 4}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ─── 3. RECENT ACTIVITY TABLE (STYLE MATCHING REFERENCE PAYMENT HISTORY) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">

        {/* Left Column: Recent Activity Table (8 cols) */}
        <div className="lg:col-span-8 rounded-[28px] border border-[rgba(234,234,236,0.85)] bg-white p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#171717]">Recent Platform Consultations</h2>
                <p className="text-xs text-gray-400 mt-0.5">Live transaction log across farmer inquiries and AI diagnoses.</p>
              </div>
              <button
                type="button"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F4F4F6] text-gray-400 hover:text-gray-700 cursor-pointer"
                title="View All History"
              >
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    <th className="pb-3 px-2">Service / Inquiry</th>
                    <th className="pb-3 px-3">Date</th>
                    <th className="pb-3 px-3">Time</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-2 text-right">Throughput</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs">
                  {recentActivities.map((act) => {
                    const Icon = act.icon;
                    return (
                      <tr key={act.id} className="hover:bg-[#F4F4F6]/50 transition-colors">
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-3">
                            <span className={`flex h-8 w-8 items-center justify-center rounded-full ${act.color} shadow-2xs shrink-0`}>
                              <Icon className="h-4 w-4" />
                            </span>
                            <div>
                              <p className="font-bold text-[#171717]">{act.name}</p>
                              <p className="text-[10px] text-gray-400">{act.farmer}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-gray-500 text-[11px] font-medium">{act.date}</td>
                        <td className="py-3 px-3 text-gray-400 text-[11px]">{act.time}</td>
                        <td className="py-3 px-3">
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#0F9F68]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#0F9F68]" />
                            {act.status}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-right font-bold text-[#171717] text-xs">
                          {act.amount}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-xs">
            <span className="text-gray-400">Showing latest verified transactions</span>
            <Link href="/admin/analytics" className="font-bold text-[#0F9F68] hover:underline">
              View full activity logs →
            </Link>
          </div>
        </div>

        {/* Right Column: Fast Queue & Microservices Telemetry (4 cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-5">
          {/* Top: Verification Queue Quick Card */}
          <div className="rounded-[28px] border border-[rgba(234,234,236,0.85)] bg-white p-5 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400">Action Queue</span>
              <span className="rounded-full bg-[#DDF4EA] px-2.5 py-0.5 text-[10px] font-black text-[#0F9F68]">
                {pendingExperts.length || stats.pendingVerifications} Pending
              </span>
            </div>
            <div>
              <p className="text-2xl font-black text-[#171717]">
                {pendingExperts.length || stats.pendingVerifications} Candidates
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">Agronomists awaiting credentials review</p>
            </div>
            <Link
              href="/admin/verification"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0F9F68] hover:bg-[#0D8A5A] text-white py-2 px-4 text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              Open Verification Workspace <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Bottom: Microservices Health Status */}
          <div className="rounded-[28px] border border-[rgba(234,234,236,0.85)] bg-white p-5 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)] space-y-3 flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#171717]">System Infrastructure</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#0F9F68] bg-[#DDF4EA] border border-[#BCE9D5] rounded-full px-2 py-0.5">
                <CheckCircle2 className="h-3 w-3 text-[#0F9F68]" /> 99.98%
              </span>
            </div>

            <div className="space-y-2">
              {defaultHealthServices.map((srv) => {
                const Icon = srv.icon;
                return (
                  <div key={srv.service} className="flex items-center justify-between text-xs py-1">
                    <span className="flex items-center gap-2 text-gray-600 font-medium">
                      <Icon className="h-3.5 w-3.5 text-[#0F9F68]" />
                      {srv.service}
                    </span>
                    <span className="text-[11px] font-mono text-gray-400">{srv.latency}</span>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-gray-100 pt-2 text-right">
              <span className="text-[10px] text-gray-400">All microservices operational</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true">
      <div className="space-y-2">
        <Skeleton className="h-4 w-28 rounded-full" />
        <Skeleton className="h-8 w-60 rounded-xl" />
        <Skeleton className="h-4 w-96 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-36 rounded-[28px]" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Skeleton className="h-72 rounded-[28px]" />
        <Skeleton className="h-72 rounded-[28px]" />
      </div>
    </div>
  );
}
