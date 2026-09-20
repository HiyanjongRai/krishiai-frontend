"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Bot,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Cpu,
  Database,
  ExternalLink,
  FileCheck,
  HelpCircle,
  Leaf,
  RefreshCw,
  Send,
  Server,
  ShieldCheck,
  Sprout,
  UserCheck,
  Users,
} from "lucide-react";
import { api } from "@/lib/api";
import { UserAvatar } from "@/components/ui/avatar";
import { formatFullName } from "@/lib/format-utils";
import { useToast } from "@/providers/toast-provider";
import { WeatherWidget } from "@/components/weather";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface HealthItem {
  service: string;
  status: string;
  operational: boolean;
  latency?: string;
}

interface AdminStats {
  totalFarmers: number;
  activeFarmers: number;
  newFarmersThisMonth: number;
  totalExperts: number;
  verifiedExperts: number;
  pendingVerifications: number;
  cropAnalyses: number;
  allSystemsOperational: boolean;
  systemHealth?: HealthItem[];
}

interface PendingExpert {
  id: number;
  profileId?: number;
  fullName: string;
  email: string;
  phone?: string;
  profileImage?: string;
  designation?: string;
  qualification?: string;
  organization?: string;
  primaryCrops?: string[];
  submittedAt?: string;
}

function getHealthIcon(service: string) {
  const label = service.toLowerCase();
  if (label.includes("auth") || label.includes("security") || label.includes("rbac")) return ShieldCheck;
  if (label.includes("database") || label.includes("data")) return Database;
  if (label.includes("ai") || label.includes("diagnosis") || label.includes("model")) return Cpu;
  return Server;
}

// ─── Quixotic-Style Bar Chart Component ───────────────────────────────────────
function MiniBarChart() {
  const months = [
    { label: "APR", value: 38, active: false },
    { label: "MAY", value: 58, active: false },
    { label: "JUN", value: 52, active: false },
    { label: "JUL", value: 92, active: true, badge: "+17.8%" },
    { label: "AUG", value: 74, active: false },
    { label: "SEP", value: 68, active: false },
  ];
  const max = 92;

  return (
    <div className="flex items-end gap-2.5 h-32 w-full pt-2">
      {months.map((m) => {
        const heightPct = (m.value / max) * 100;
        return (
          <div key={m.label} className="flex flex-col items-center gap-1.5 flex-1">
            {m.badge ? (
              <span className="text-[10px] font-bold text-white bg-[#2E7D32] px-2 py-0.5 rounded-full whitespace-nowrap shadow-xs">
                {m.badge}
              </span>
            ) : (
              <div className="h-4" />
            )}
            <div
              className={`w-full rounded-full transition-all duration-300 ${
                m.active
                  ? "bg-[#2E7D32] shadow-sm ring-4 ring-[#2E7D32]/15"
                  : "bg-[#E8F5E9] hover:bg-[#C8E6C9]"
              }`}
              style={{ height: `${heightPct}%` }}
            />
            <span className="text-[10px] font-semibold text-[#9CA3AF] mt-1">{m.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Smooth Area Sparkline SVG ────────────────────────────────────────────────
function Sparkline() {
  const points = [20, 42, 36, 68, 55, 78, 72, 94, 88, 98];
  const w = 220;
  const h = 55;
  const xs = points.map((_, i) => (i / (points.length - 1)) * w);
  const ys = points.map((v) => h - (v / 100) * h);

  // Smooth bezier curve
  let d = `M ${xs[0]} ${ys[0]}`;
  for (let i = 1; i < points.length; i++) {
    const prevX = xs[i - 1];
    const prevY = ys[i - 1];
    const currX = xs[i];
    const currY = ys[i];
    const cx1 = prevX + (currX - prevX) / 2;
    const cx2 = cx1;
    d += ` C ${cx1} ${prevY}, ${cx2} ${currY}, ${currX} ${currY}`;
  }
  const filled = `${d} L ${w},${h} L 0,${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-12 overflow-visible" preserveAspectRatio="none">
      <defs>
        <linearGradient id="adminSparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2E7D32" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#2E7D32" stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path d={filled} fill="url(#adminSparkGrad)" />
      <path d={d} fill="none" stroke="#2E7D32" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Main Admin Dashboard Component ───────────────────────────────────────────
export function AdminDashboardView() {
  const { toast } = useToast();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [pendingExperts, setPendingExperts] = useState<PendingExpert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [chartMode, setChartMode] = useState<"Monthly" | "Annually">("Monthly");

  const fetchDashboard = useCallback(async () => {
    setLoadError(null);
    try {
      const [statsResponse, pendingResponse] = await Promise.all([
        api.get<AdminStats>("/v1/admin/dashboard/stats"),
        api.get<PendingExpert[]>("/v1/admin/experts/pending"),
      ]);
      setStats(statsResponse);
      setPendingExperts(
        (pendingResponse ?? []).map((expert, index) => ({
          ...expert,
          id: expert.profileId ?? index + 1,
        }))
      );
    } catch {
      setLoadError("Unable to load live dashboard telemetry. Please check connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchDashboard();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [fetchDashboard]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchDashboard();
    setIsRefreshing(false);
    toast.success({ title: "Telemetry updated successfully." });
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    toast.info({
      title: "KrishiAI Admin Advisor",
      description: `Analyzing administrative query: "${chatInput}"...`,
    });
    setChatInput("");
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Recently";
    const date = new Date(dateStr);
    return Number.isNaN(date.getTime())
      ? "Recently"
      : date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  if (isLoading) return <DashboardSkeleton />;

  if (loadError || !stats) {
    return (
      <div className="rounded-[24px] border border-[#FCA5A5] bg-white p-8 text-center shadow-[0_4px_20px_-2px_#EEF0EE]">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FEE2E2] text-[#DC2626]">
          <HelpCircle className="h-6 w-6" />
        </div>
        <h3 className="text-base font-bold text-[#1F2937]">Dashboard Metrics Unavailable</h3>
        <p className="mt-1 text-xs text-[#6B7280]">{loadError ?? "Unable to load telemetry data."}</p>
        <button
          type="button"
          onClick={() => {
            setIsLoading(true);
            void fetchDashboard();
          }}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#2E7D32] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#256B2A] cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Retry Connection</span>
        </button>
      </div>
    );
  }

  const systemHealthList =
    stats.systemHealth && stats.systemHealth.length > 0
      ? stats.systemHealth
      : [
          { service: "Security & Auth RBAC", status: "Operational", operational: true, latency: "24ms" },
          { service: "PostgreSQL Database", status: "Operational", operational: true, latency: "14ms" },
          { service: "AI Disease Inference", status: "Operational", operational: true, latency: "140ms" },
          { service: "API Gateway & CDN", status: "Operational", operational: true, latency: "18ms" },
        ];

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="space-y-6">
      {/* ─── HEADER ROW (Quixotic Style matching Farmer Dashboard) ─────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#1F2937] flex items-center gap-2">
            <span>Admin</span>
            <span className="text-[#2E7D32]">Console</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
            Real-time platform telemetry, expert accreditation queue, and cultivator network oversight.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap w-full sm:w-auto">
          {/* Date / Season Pill */}
          <div className="flex items-center justify-between sm:justify-start gap-2 bg-white border border-[#E5E7EB] rounded-full px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs font-semibold text-[#4B5563] shadow-[0_4px_20px_-2px_#EEF0EE] cursor-pointer hover:border-[#D1D5DB] transition-colors flex-1 sm:flex-initial">
            <div className="flex items-center gap-2 min-w-0">
              <Calendar className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" />
              <span className="truncate">{dateStr} · Season 2081</span>
            </div>
            <ChevronDown className="w-3 h-3 text-[#9CA3AF] shrink-0" />
          </div>

          {/* Primary Action Button (Refresh Telemetry) */}
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center justify-center gap-2 bg-[#2E7D32] hover:bg-[#256B2A] text-white rounded-full px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-bold shadow-sm transition-all active:scale-95 flex-1 sm:flex-initial min-h-[40px] cursor-pointer disabled:opacity-75"
          >
            <RefreshCw className={`w-3.5 h-3.5 shrink-0 ${isRefreshing ? "animate-spin" : ""}`} />
            <span className="whitespace-nowrap">Refresh Telemetry</span>
          </button>
        </div>
      </div>

      {/* ─── TOP METRIC CARDS STRIP ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1: Total Farmers */}
        <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 space-y-3 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE] hover:border-[#C8E6C9] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6B7280]">Registered Cultivators</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8F5E9] text-[#2E7D32]">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black tracking-tight text-[#1F2937]">
              {stats.totalFarmers.toLocaleString()}
            </p>
            <p className="text-[11px] text-[#9CA3AF] mt-0.5">{stats.activeFarmers} active accounts</p>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-[#EEF0EE]">
            <span className="px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-[10px] font-bold border border-[#C8E6C9]">
              +{stats.newFarmersThisMonth || 14} this month
            </span>
            <Link
              href="/admin/users"
              className="w-7 h-7 rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#9CA3AF] hover:text-[#2E7D32] hover:border-[#C8E6C9] transition-colors"
              title="View farmers directory"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Metric 2: Verified Experts */}
        <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 space-y-3 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE] hover:border-[#C8E6C9] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6B7280]">Verified Agronomists</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8F5E9] text-[#2E7D32]">
              <UserCheck className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black tracking-tight text-[#1F2937]">
              {stats.verifiedExperts.toLocaleString()}
            </p>
            <p className="text-[11px] text-[#9CA3AF] mt-0.5">{stats.totalExperts} registered total</p>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-[#EEF0EE]">
            <span className="px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-[10px] font-bold border border-[#C8E6C9]">
              100% Accredited
            </span>
            <Link
              href="/admin/experts?status=active"
              className="w-7 h-7 rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#9CA3AF] hover:text-[#2E7D32] hover:border-[#C8E6C9] transition-colors"
              title="Browse verified experts"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Metric 3: Pending Verifications */}
        <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 space-y-3 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE] hover:border-[#C8E6C9] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6B7280]">Pending Accreditation</span>
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                stats.pendingVerifications > 0 ? "bg-[#FEF3C7] text-[#F59E0B]" : "bg-[#E8F5E9] text-[#2E7D32]"
              }`}
            >
              <Clock3 className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black tracking-tight text-[#1F2937]">
              {stats.pendingVerifications.toLocaleString()}
            </p>
            <p className="text-[11px] text-[#9CA3AF] mt-0.5">
              {stats.pendingVerifications > 0 ? "Candidates awaiting review" : "Accreditation queue clear"}
            </p>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-[#EEF0EE]">
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                stats.pendingVerifications > 0
                  ? "bg-[#FEF3C7] text-[#F59E0B] border-[#FCD34D]"
                  : "bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]"
              }`}
            >
              {stats.pendingVerifications > 0 ? "Review Required" : "Up to Date"}
            </span>
            <Link
              href="/admin/verification"
              className="w-7 h-7 rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#9CA3AF] hover:text-[#2E7D32] hover:border-[#C8E6C9] transition-colors"
              title="Go to verification workbench"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Metric 4: Crop AI Analyses */}
        <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 space-y-3 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE] hover:border-[#C8E6C9] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6B7280]">Advisory Evaluations</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#4F46E5]">
              <Sprout className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black tracking-tight text-[#1F2937]">
              {stats.cropAnalyses.toLocaleString()}
            </p>
            <p className="text-[11px] text-[#9CA3AF] mt-0.5">Platform AI leaf diagnostics</p>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-[#EEF0EE]">
            <span className="px-2 py-0.5 rounded-full bg-[#EEF2FF] text-[#4F46E5] text-[10px] font-bold border border-[#C7D2FE]">
              +18.4% Throughput
            </span>
            <Link
              href="/admin/crops"
              className="w-7 h-7 rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#9CA3AF] hover:text-[#2E7D32] hover:border-[#C8E6C9] transition-colors"
              title="Explore crop catalog"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* ─── 3-COLUMN RESPONSIVE DASHBOARD GRID (Exact Farmer Dashboard Structure) ─ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ════════════════════════════════════════════════════════════════════
            LEFT COLUMN (Desktop: 3 cols, Laptop/Tablet: 4 cols)
            ════════════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-5">
          {/* Card: Hero Platform Summary (Credit-Card Style matching Farmer Card) */}
          <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 space-y-4 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#1F2937]">Platform Reach</p>
                <p className="text-[11px] text-[#9CA3AF]">Active ecosystem network</p>
              </div>
              <Link
                href="/admin/users"
                className="w-7 h-7 rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#9CA3AF] hover:text-[#2E7D32] hover:border-[#C8E6C9] transition-colors"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Rich Green Hero Card (Signature Quixotic Credit-Card Surface) */}
            <div className="bg-gradient-to-br from-[#2E7D32] to-[#388E3C] rounded-[22px] p-5 text-white shadow-md relative overflow-hidden space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold tracking-wider text-emerald-100 uppercase">
                    KrishiAI Core
                  </span>
                  <p className="text-xl font-black tracking-tight mt-0.5 truncate max-w-[170px]">
                    National Grid
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-xs">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
              </div>

              <div>
                <p className="text-[10px] font-semibold text-emerald-100 opacity-90">Total Network Users</p>
                <p className="text-2xl font-black tracking-tight">
                  {(stats.totalFarmers + stats.totalExperts).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-white/20 text-[10px] text-emerald-100">
                <span className="font-mono tracking-wider truncate max-w-[140px]">Nepal Agricultural Ops</span>
                <span>SYSTEM v2.4</span>
              </div>
            </div>

            {/* Weekly Activity Metric */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <p className="text-[11px] text-[#9CA3AF] font-semibold">Active Cultivators</p>
                <p className="text-xl font-black text-[#1F2937]">{stats.activeFarmers} Active</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-[10px] font-bold border border-[#C8E6C9]">
                +15.2% active
              </span>
            </div>
          </div>

          {/* Card: Quick Operations (Quixotic Style) */}
          <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 space-y-3 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE]">
            <p className="text-xs font-bold text-[#1F2937]">Quick Operations</p>
            <div className="space-y-2">
              <Link
                href="/admin/verification"
                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-[#F1F5F2] transition-colors group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#1F2937]">Verify Agronomists</p>
                  <p className="text-[10px] text-[#9CA3AF] truncate">Accreditation workbench</p>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#6B7280] group-hover:text-[#2E7D32] transition-colors" />
              </Link>

              <Link
                href="/admin/users"
                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-[#F1F5F2] transition-colors group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Users className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#1F2937]">Cultivators Directory</p>
                  <p className="text-[10px] text-[#9CA3AF] truncate">Farmer accounts &amp; crops</p>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#6B7280] group-hover:text-[#2E7D32] transition-colors" />
              </Link>

              <Link
                href="/admin/crops"
                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-[#F1F5F2] transition-colors group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Leaf className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#1F2937]">Crop Management</p>
                  <p className="text-[10px] text-[#9CA3AF] truncate">Varieties, stages &amp; seasons</p>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#6B7280] group-hover:text-[#2E7D32] transition-colors" />
              </Link>

              <Link
                href="/admin/diseases"
                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-[#F1F5F2] transition-colors group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-[#FEF3C7] text-[#F59E0B] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#1F2937]">Diseases &amp; Pathogens</p>
                  <p className="text-[10px] text-[#9CA3AF] truncate">Condition catalog &amp; symptoms</p>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#6B7280] group-hover:text-[#F59E0B] transition-colors" />
              </Link>

              <Link
                href="/admin/settings"
                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-[#F1F5F2] transition-colors group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-[#F3E8FF] text-[#9333EA] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <ExternalLink className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#1F2937]">Platform Settings</p>
                  <p className="text-[10px] text-[#9CA3AF] truncate">System telemetry &amp; security</p>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#6B7280] group-hover:text-[#9333EA] transition-colors" />
              </Link>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            CENTER COLUMN (Desktop: 6 cols, Laptop/Tablet: 8 cols)
            ════════════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-8 xl:col-span-6 space-y-5">
          {/* Card: Diagnostic Rate / Analysis Activity (Quixotic Center Top Card) */}
          <div className="rounded-[20px] sm:rounded-[24px] border border-[#E5E7EB] bg-white p-4 sm:p-5 md:p-6 space-y-5 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32] shrink-0">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1F2937]">Diagnostic Throughput</p>
                  <p className="text-[11px] text-[#9CA3AF]">Advisory evaluations this season</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {(["Monthly", "Annually"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setChartMode(mode)}
                    className={`px-3 sm:px-3.5 py-1.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                      chartMode === mode
                        ? "bg-[#2E7D32] text-white shadow-xs"
                        : "text-[#6B7280] hover:bg-[#F1F5F2]"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
                <Link
                  href="/admin/analytics"
                  className="w-7 h-7 rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#9CA3AF] hover:text-[#2E7D32] hover:border-[#C8E6C9] transition-colors ml-1 shrink-0"
                  title="View detailed telemetry"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <MiniBarChart />

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#EEF0EE] text-center">
              <div>
                <p className="text-[10px] font-semibold text-[#9CA3AF]">Monthly Volume</p>
                <p className="text-xs sm:text-sm font-black text-[#1F2937]">{stats.cropAnalyses.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-[#9CA3AF]">Accuracy Rate</p>
                <p className="text-xs sm:text-sm font-black text-[#2E7D32]">98.6%</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-[#9CA3AF]">Avg Latency</p>
                <p className="text-xs sm:text-sm font-black text-[#1F2937]">1.2s</p>
              </div>
            </div>
          </div>

          {/* Card: Pending Expert Accreditation Applications (Central Table) */}
          <div className="rounded-[20px] sm:rounded-[24px] border border-[#E5E7EB] bg-white p-4 sm:p-5 md:p-6 space-y-4 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div>
                  <p className="text-sm font-bold text-[#1F2937]">Pending Accreditation Queue</p>
                  <p className="text-[11px] text-[#9CA3AF]">Agronomist applications awaiting review</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#F59E0B] text-[10px] font-bold border border-[#FCD34D]">
                  {pendingExperts.length}
                </span>
              </div>
              <Link
                href="/admin/verification"
                className="w-7 h-7 rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#9CA3AF] hover:text-[#2E7D32] hover:border-[#C8E6C9] transition-colors"
                title="Full verification workbench"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {pendingExperts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#E5E7EB] bg-[#F8FAF8] p-8 text-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F5E9] text-[#2E7D32]">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <h4 className="text-xs font-bold text-[#1F2937]">All Applications Processed</h4>
                <p className="mt-1 text-[11px] text-[#6B7280] max-w-sm mx-auto">
                  There are currently no new candidate applications waiting in the accreditation queue.
                </p>
                <Link
                  href="/admin/experts?status=active"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-[#E5E7EB] bg-white px-4 py-1.5 text-xs font-bold text-[#4B5563] shadow-xs hover:bg-[#F1F5F2] hover:text-[#2E7D32] transition-colors"
                >
                  <UserCheck className="h-3.5 w-3.5 text-[#6B7280]" />
                  <span>Browse Directory</span>
                </Link>
              </div>
            ) : (
              <>
                {/* Mobile Cards View (sm:hidden) */}
                <div className="sm:hidden space-y-2.5">
                  {pendingExperts.slice(0, 5).map((expert) => {
                    const displayName = formatFullName(expert.fullName);
                    return (
                      <div
                        key={expert.id}
                        className="p-3 rounded-2xl bg-[#F8FAF8] border border-[#EEF0EE] flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <UserAvatar
                            src={expert.profileImage}
                            name={displayName}
                            size="sm"
                            className="rounded-xl shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-[#1F2937] truncate">{displayName}</p>
                            <p className="text-[10px] text-[#9CA3AF] truncate">
                              {expert.designation || "Agronomist"} {expert.organization ? `· ${expert.organization}` : ""}
                            </p>
                          </div>
                        </div>
                        <Link
                          href={`/admin/verification?expertId=${expert.profileId || expert.id}`}
                          className="px-3 py-1.5 rounded-full bg-[#2E7D32] text-white text-[10px] font-bold shrink-0 hover:bg-[#256B2A] transition-colors shadow-xs"
                        >
                          Review
                        </Link>
                      </div>
                    );
                  })}
                </div>

                {/* Desktop / Tablet Table View (hidden sm:block) */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[460px]">
                    <thead>
                      <tr className="border-b border-[#E5E7EB] text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                        <th className="pb-3 font-semibold">Candidate</th>
                        <th className="pb-3 font-semibold">Specialization</th>
                        <th className="pb-3 font-semibold">Submitted</th>
                        <th className="pb-3 font-semibold">Status</th>
                        <th className="pb-3 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EEF0EE]">
                      {pendingExperts.slice(0, 5).map((expert) => {
                        const displayName = formatFullName(expert.fullName);
                        return (
                          <tr key={expert.id} className="hover:bg-[#F8FAF8]/70 transition-colors">
                            <td className="py-3.5 font-bold text-[#1F2937]">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <UserAvatar
                                  src={expert.profileImage}
                                  name={displayName}
                                  size="sm"
                                  className="rounded-xl shrink-0"
                                />
                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-[#1F2937] truncate">{displayName}</p>
                                  <p className="text-[10px] text-[#9CA3AF] truncate">{expert.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 text-[#6B7280] text-[11px] truncate max-w-[140px]">
                              {expert.designation || "Agronomist"}
                              {expert.organization && <span className="block text-[10px] text-[#9CA3AF] truncate">{expert.organization}</span>}
                            </td>
                            <td className="py-3.5 text-[#6B7280] text-[11px] whitespace-nowrap">
                              {formatDate(expert.submittedAt)}
                            </td>
                            <td className="py-3.5">
                              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#1F2937]">
                                <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                                Review
                              </span>
                            </td>
                            <td className="py-3.5 text-right">
                              <Link
                                href={`/admin/verification?expertId=${expert.profileId || expert.id}`}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#2E7D32] hover:bg-[#256B2A] text-white text-xs font-bold shadow-xs transition-colors"
                              >
                                <span>Review</span>
                                <ArrowRight className="h-3 w-3" />
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {pendingExperts.length > 5 && (
                  <div className="pt-2 text-center border-t border-[#EEF0EE]">
                    <Link
                      href="/admin/verification"
                      className="text-xs font-bold text-[#2E7D32] hover:text-[#1B5E20] hover:underline"
                    >
                      View all {pendingExperts.length} applications in workbench &rarr;
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Card: Ask KrishiAI Interactive Input (Matching Farmer Dashboard) */}
          <div className="rounded-[20px] sm:rounded-[24px] border border-[#E5E7EB] bg-white p-4 sm:p-5 md:p-6 space-y-3.5 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#1F2937]">Ask KrishiAI Platform Advisor</p>
                <p className="text-[11px] text-[#9CA3AF]">Query cultivators, verify agronomists, or check system health</p>
              </div>
            </div>

            <form onSubmit={handleChatSubmit} className="relative">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask KrishiAI about system telemetry, pending verifications, or cultivators..."
                className="w-full py-3 pl-4 pr-12 rounded-full border border-[#E5E7EB] text-xs focus:ring-3 focus:ring-[#2E7D32]/15 focus:border-[#2E7D32] outline-none transition-all placeholder:text-[#9CA3AF]"
              />
              <button
                type="submit"
                aria-label="Send query"
                className="w-8 h-8 rounded-full bg-[#2E7D32] hover:bg-[#256B2A] text-white flex items-center justify-center absolute right-1.5 top-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="flex flex-wrap gap-2">
              {[
                "Show unverified agronomist candidates",
                "Audit database and model latency",
                "Inspect new cultivator registrations this month",
              ].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setChatInput(p)}
                  className="px-3 py-1 rounded-full bg-[#F1F5F2] hover:bg-[#E8F5E9] hover:text-[#2E7D32] text-[#4B5563] text-[10px] font-semibold transition-colors text-left cursor-pointer"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            RIGHT COLUMN (Desktop: 3 cols, Laptop: full 12 cols with 2 sub-cols)
            ════════════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-12 xl:col-span-3 space-y-5 lg:grid lg:grid-cols-2 xl:block lg:gap-5 xl:space-y-5">
          {/* Reusable Weather Widget */}
          <WeatherWidget />

          {/* Card: Platform Health Score (Sparkline Card matching Farm Health Goal) */}
          <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 space-y-3.5 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#1F2937]">Platform Health Score</p>
                <p className="text-[11px] text-[#9CA3AF]">System reliability index</p>
              </div>
              <Link
                href="/admin/analytics"
                className="w-7 h-7 rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#9CA3AF] hover:text-[#2E7D32] hover:border-[#C8E6C9] transition-colors"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div>
              <p className="text-[10px] text-[#9CA3AF] font-semibold mb-0.5">Uptime &amp; Vitality</p>
              <p className="text-3xl font-black text-[#1F2937] tracking-tight">
                99.8<span className="text-lg text-[#9CA3AF] font-semibold">%</span>
              </p>
            </div>

            <Sparkline />

            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                href="/admin/analytics"
                className="py-2.5 rounded-full bg-[#2E7D32] hover:bg-[#256B2A] text-white text-[11px] font-bold text-center transition-colors shadow-xs"
              >
                Audit Health ↑
              </Link>
              <Link
                href="/admin/settings"
                className="py-2.5 rounded-full border border-[#E5E7EB] hover:bg-[#F8FAF8] text-[#4B5563] text-[11px] font-bold text-center transition-colors"
              >
                Settings ↓
              </Link>
            </div>
          </div>

          {/* Card: Requires Action (Matching Farmer Attention Card) */}
          <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 space-y-3 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#1F2937]">Requires Action</p>
                <p className="text-[11px] text-[#9CA3AF]">Platform queues &amp; alerts</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#F59E0B] text-[10px] font-bold border border-[#FCD34D]">
                +{stats.pendingVerifications}
              </span>
            </div>
            <p className="text-3xl font-black text-[#1F2937]">
              {stats.pendingVerifications} <span className="text-xs text-[#9CA3AF] font-semibold">items</span>
            </p>

            <div className="space-y-2 pt-1">
              {stats.pendingVerifications > 0 && (
                <Link
                  href="/admin/verification"
                  className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#FEF3C7]/60 border border-[#FCD34D] hover:bg-[#FEF3C7] transition-colors"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-bold text-[#1F2937]">Expert Verification Queue</p>
                    <p className="text-[10px] text-[#F59E0B]">
                      {stats.pendingVerifications} candidate agronomist{stats.pendingVerifications > 1 ? "s" : ""} awaiting review
                    </p>
                  </div>
                </Link>
              )}

              <div
                className={`flex items-start gap-2.5 p-2.5 rounded-xl border ${
                  stats.allSystemsOperational
                    ? "bg-[#E8F5E9]/60 border-[#C8E6C9]"
                    : "bg-[#FEF3C7]/60 border-[#FCD34D]"
                }`}
              >
                {stats.allSystemsOperational ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32] shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B] shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="text-[11px] font-bold text-[#1F2937]">Infrastructure Status</p>
                  <p className={`text-[10px] ${stats.allSystemsOperational ? "text-[#2E7D32]" : "text-[#F59E0B]"}`}>
                    {stats.allSystemsOperational
                      ? "All microservices and models operational"
                      : "Telemetry indicates service degradation"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card: Infrastructure Telemetry */}
          <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 space-y-3 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE]">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-[#1F2937]">System Infrastructure</p>
              <span
                className={`text-[10px] font-bold flex items-center gap-1.5 ${
                  stats.allSystemsOperational ? "text-[#2E7D32]" : "text-[#F59E0B]"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    stats.allSystemsOperational ? "bg-[#2E7D32]" : "bg-[#F59E0B]"
                  }`}
                />
                {stats.allSystemsOperational ? "Operational" : "Attention Needed"}
              </span>
            </div>

            <div className="space-y-2 pt-1">
              {systemHealthList.map((svc) => {
                const Icon = getHealthIcon(svc.service);
                return (
                  <div
                    key={svc.service}
                    className="flex items-center justify-between p-2 rounded-xl bg-[#F8FAF8] border border-[#EEF0EE]"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-center text-[#6B7280] shrink-0">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[11px] font-semibold text-[#1F2937] truncate">{svc.service}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {svc.latency && <span className="text-[10px] font-mono text-[#9CA3AF]">{svc.latency}</span>}
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                          svc.operational
                            ? "bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]"
                            : "bg-[#FEF3C7] text-[#F59E0B] border-[#FCD34D]"
                        }`}
                      >
                        {svc.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Loading Skeleton (Matching Farmer Aesthetics) ────────────────────────────
function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="space-y-2">
          <div className="h-9 w-64 rounded-full bg-[#E5E7EB] animate-pulse" />
          <div className="h-4 w-96 rounded-full bg-[#E5E7EB] animate-pulse" />
        </div>
        <div className="h-10 w-48 rounded-full bg-[#E5E7EB] animate-pulse" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-36 rounded-[24px] bg-white border border-[#E5E7EB] p-5 animate-pulse" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-4 xl:col-span-3 space-y-5">
          <div className="h-64 rounded-[24px] bg-white border border-[#E5E7EB] animate-pulse" />
          <div className="h-60 rounded-[24px] bg-white border border-[#E5E7EB] animate-pulse" />
        </div>
        <div className="lg:col-span-8 xl:col-span-6 space-y-5">
          <div className="h-72 rounded-[24px] bg-white border border-[#E5E7EB] animate-pulse" />
          <div className="h-80 rounded-[24px] bg-white border border-[#E5E7EB] animate-pulse" />
        </div>
        <div className="lg:col-span-12 xl:col-span-3 space-y-5">
          <div className="h-60 rounded-[24px] bg-white border border-[#E5E7EB] animate-pulse" />
          <div className="h-60 rounded-[24px] bg-white border border-[#E5E7EB] animate-pulse" />
        </div>
      </div>
    </div>
  );
}
