"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/providers/auth-provider";
import { useToast } from "@/providers/toast-provider";
import { farmService } from "@/services/farm";
import { cropTaskService } from "@/services/farm/farmCropService";
import type { FarmerDashboardResponse } from "@/types/farm";
import type { CropTaskResponse } from "@/types/farmCrop";
import { WeatherWidget } from "@/components/weather";

import {
  LayoutDashboard,
  Scan,
  Bot,
  Users,
  ArrowUpRight,
  Plus,
  Calendar,
  Send,
  AlertTriangle,
  Sprout,
  ChevronDown,
  MapPin,
  Activity,
  Layers,
  ShieldCheck,
  Clock,
  History,
  CheckCircle2,
  ClipboardList,
  Sparkles,
} from "lucide-react";

// ─── Mini Bar Chart Component ────────────────────────────────────────────────
function MiniBarChart() {
  const bars = [
    { label: "APR", val: 40 },
    { label: "MAY", val: 65 },
    { label: "JUN", val: 85 },
    { label: "JUL", val: 55 },
    { label: "AUG", val: 90 },
    { label: "SEP", val: 75 },
  ];
  return (
    <div className="flex items-end gap-2 sm:gap-3 h-28 w-full pt-2">
      {bars.map((item) => (
        <div key={item.label} className="flex flex-col items-center gap-1.5 flex-1 h-full justify-end">
          <div
            className="w-full rounded-t-lg bg-[#2E7D32]/80 hover:bg-[#2E7D32] transition-all cursor-pointer"
            style={{ height: `${item.val}%` }}
            title={`${item.label}: ${item.val}% diagnosis rate`}
          />
          <span className="text-[10px] font-semibold text-[#9CA3AF]">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Smooth Area Sparkline SVG ────────────────────────────────────────────────
function Sparkline() {
  const w = 220;
  const h = 48;
  const points = "0,35 40,28 80,32 120,18 160,22 200,12 220,15";
  const filled = `M 0,35 L 40,28 L 80,32 L 120,18 L 160,22 L 200,12 L 220,15 L 220,${h} L 0,${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-10 overflow-visible" preserveAspectRatio="none">
      <defs>
        <linearGradient id="farmSparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2E7D32" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#2E7D32" stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path d={filled} fill="url(#farmSparkGrad)" />
      <polyline
        points={points}
        fill="none"
        stroke="#2E7D32"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Main Dashboard Component ─────────────────────────────────────────────────
export function FarmerDashboardView() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [chatInput, setChatInput] = useState("");
  const [chartMode, setChartMode] = useState<"Monthly" | "Annually">("Monthly");
  const [dashboardData, setDashboardData] = useState<FarmerDashboardResponse | null>(null);
  const [pendingTasks, setPendingTasks] = useState<CropTaskResponse[]>([]);

  useEffect(() => {
    let active = true;
    farmService
      .getFarmerDashboard()
      .then((data) => {
        if (active) setDashboardData(data);
      })
      .catch(() => {});

    cropTaskService
      .getAllPendingTasks()
      .then((tasks) => {
        if (active) setPendingTasks(tasks || []);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  const handleCompleteTask = async (taskId: number) => {
    try {
      await cropTaskService.markTaskStatus(taskId, "DONE");
      setPendingTasks((prev) => prev.filter((t) => t.id !== taskId));
      toast.success({
        title: "Task completed!",
        description: "Great job keeping up with your crop care schedule.",
      });
    } catch {
      toast.error({ title: "Failed to update task" });
    }
  };

  const farmerName = user?.fullName?.split(" ")[0] || "Farmer";

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    toast.info({
      title: "KrishiAI Advisor",
      description: `Analyzing: "${chatInput}"...`,
    });
    setChatInput("");
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* ─── 1. PAGE HEADER (Matches 'My Farm' Standard) ───────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#E5E7EB]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-[#E8F5E9] text-[#2E7D32]">
              <LayoutDashboard className="w-4 h-4" />
            </span>
            <h1 className="text-lg sm:text-xl font-bold text-[#1F2937] tracking-tight">
              Welcome Back, <span className="text-[#2E7D32]">{farmerName}</span>
            </h1>
          </div>
          <p className="text-[11px] sm:text-xs text-[#6B7280] mt-0.5">
            Real-time crop health, farm analytics, and AI diagnostic insights across your plots.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Season Pill */}
          <div className="flex items-center gap-1.5 bg-white border border-[#E5E7EB] rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#4B5563] shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" />
            <span className="truncate">Kharif Season (2081)</span>
          </div>

          {/* New Crop Scan Action */}
          <Link
            href="/farmer/analysis"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#2E7D32] hover:bg-[#256B2A] text-white text-xs font-bold rounded-lg shadow-xs transition-all active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Crop Scan</span>
          </Link>
        </div>
      </div>

      {/* ─── 2. METRIC CARDS ROW (Matches 'My Farm' Cards) ──────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl bg-white border border-[#E5E7EB]/80 p-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Registered Farms</p>
            <div className="w-6 h-6 rounded-lg bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center">
              <Layers className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-[#1F2937] mt-1">
            {dashboardData?.totalFarms ?? 1}
          </p>
          <p className="text-[10px] text-[#9CA3AF] mt-0.5">Active agricultural holdings</p>
        </div>

        <div className="rounded-xl bg-white border border-[#E5E7EB]/80 p-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Active Crops</p>
            <div className="w-6 h-6 rounded-lg bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center">
              <Sprout className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-[#1F2937] mt-1">
            {dashboardData?.cropCount ?? 6}
          </p>
          <p className="text-[10px] text-[#9CA3AF] mt-0.5">Under current monitoring</p>
        </div>

        <div className="rounded-xl bg-white border border-[#E5E7EB]/80 p-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Crop Vitality</p>
            <div className="w-6 h-6 rounded-lg bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-[#2E7D32] mt-1">94.8%</p>
          <p className="text-[10px] text-[#2E7D32] mt-0.5">Optimal health index</p>
        </div>

        <div className="rounded-xl bg-white border border-[#E5E7EB]/80 p-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Consultations</p>
            <div className="w-6 h-6 rounded-lg bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-[#1F2937] mt-1">
            {dashboardData?.activeConsultations ?? 0} Active
          </p>
          <p className="text-[10px] text-[#9CA3AF] mt-0.5">Agronomist sessions</p>
        </div>
      </div>

      {/* ─── 3. BALANCED 2-COLUMN DASHBOARD GRID ──────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* LEFT COLUMN: 7 cols */}
        <div className="lg:col-span-7 space-y-4">
          {/* Card: Primary Farm Hero */}
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-3.5 sm:p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#1F2937]">Primary Farm Overview</p>
                <p className="text-[10px] text-[#9CA3AF]">Key plot &amp; harvest status</p>
              </div>
              <Link
                href="/farmer/farms"
                className="w-6 h-6 rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#9CA3AF] hover:text-[#2E7D32] hover:border-[#C8E6C9] transition-colors"
                title="View all farms"
              >
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Emerald Gradient Card */}
            <div className="bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] rounded-xl p-4 text-white shadow-xs relative overflow-hidden space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-bold tracking-wider text-emerald-200 uppercase">
                    Registered Plot
                  </span>
                  <p className="text-base sm:text-lg font-bold tracking-tight truncate max-w-[200px]">
                    {dashboardData?.primaryFarm?.farmName || "Central Agricultural Plot"}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center backdrop-blur-xs">
                  <Sprout className="w-4 h-4 text-white" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <p className="text-[9px] font-semibold text-emerald-200">Parcel Area</p>
                  <p className="text-base sm:text-lg font-bold">
                    {dashboardData?.primaryFarm?.area
                      ? `${dashboardData.primaryFarm.area} ${dashboardData.primaryFarm.areaUnit.toLowerCase()}`
                      : "4.5 Ropani"}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-semibold text-emerald-200">Location</p>
                  <p className="text-xs sm:text-sm font-semibold truncate">
                    {dashboardData?.primaryFarm?.location?.name || "Kathmandu Valley"}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1.5 border-t border-white/20 text-[10px] text-emerald-200">
                <span>Type: {dashboardData?.primaryFarm?.farmType || "Crop Farm"}</span>
                <Link
                  href="/farmer/farms"
                  className="underline hover:text-white transition-colors"
                >
                  Manage Plot →
                </Link>
              </div>
            </div>
          </div>

          {/* Card: Diagnostic Rate & Activity */}
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-3.5 sm:p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32]">
                  <Activity className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1F2937]">Diagnostic Frequency</p>
                  <p className="text-[10px] text-[#9CA3AF]">Scan activity over the season</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {(["Monthly", "Annually"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setChartMode(mode)}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition-all cursor-pointer ${
                      chartMode === mode
                        ? "bg-[#2E7D32] text-white"
                        : "text-[#6B7280] hover:bg-[#F1F5F2]"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <MiniBarChart />
          </div>

          {/* Card: Upcoming Crop Care Tasks */}
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-3.5 sm:p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32]">
                  <ClipboardList className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1F2937]">Upcoming Crop Care &amp; Reminders</p>
                  <p className="text-[10px] text-[#9CA3AF]">Smart activities scheduled across your plots</p>
                </div>
              </div>
              <Link
                href="/farmer/crops"
                className="text-[11px] font-bold text-[#2E7D32] hover:underline"
              >
                View Crops →
              </Link>
            </div>

            {pendingTasks.length === 0 ? (
              <div className="rounded-xl bg-[#F8FAF8] border border-dashed border-[#E5E7EB] p-3 text-center">
                <CheckCircle2 className="w-6 h-6 text-[#2E7D32] mx-auto mb-1 opacity-80" />
                <p className="text-xs font-bold text-[#374151]">All care tasks up to date</p>
                <p className="text-[10px] text-[#9CA3AF] mt-0.5">
                  Check your farm detail to generate fresh AI recommendations or schedule tasks.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {pendingTasks.slice(0, 3).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between gap-2.5 p-2 rounded-xl border border-[#EEF0EE] hover:border-[#C8E6C9] bg-[#FAFCFA] transition-all"
                  >
                    <div className="flex items-start gap-2 min-w-0">
                      <button
                        type="button"
                        onClick={() => handleCompleteTask(task.id)}
                        className="mt-0.5 w-4 h-4 rounded-full border border-[#D1D5DB] hover:border-[#2E7D32] hover:bg-[#E8F5E9] flex items-center justify-center transition-colors cursor-pointer shrink-0"
                        title="Mark as completed"
                      >
                        <CheckCircle2 className="w-3 h-3 text-[#2E7D32] opacity-0 hover:opacity-100 transition-opacity" />
                      </button>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#1F2937] truncate">{task.title}</p>
                        <div className="flex items-center gap-2 text-[10px] text-[#6B7280] mt-0.5">
                          {task.cropName && (
                            <span className="inline-flex items-center gap-0.5 font-medium text-[#2E7D32]">
                              <span>{task.cropEmoji || "🌱"}</span>
                              <span className="truncate max-w-[80px]">{task.cropName}</span>
                            </span>
                          )}
                          {task.dueDate && (
                            <span className="flex items-center gap-0.5 text-[#9CA3AF]">
                              <Clock className="w-2.5 h-2.5" />
                              <span>{task.dueDate}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <Link
                      href={`/farmer/farms/${task.farmId}?tab=tasks`}
                      className="shrink-0 text-[10px] font-semibold text-[#2E7D32] bg-[#E8F5E9] hover:bg-[#C8E6C9] px-2 py-0.5 rounded-md transition-colors"
                    >
                      Open
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Card: Quick Operations */}
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-3.5 sm:p-4 shadow-2xs space-y-2.5">
            <p className="text-xs font-bold text-[#1F2937]">Quick Operations</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Link
                href="/farmer/farms"
                className="flex items-center gap-2.5 p-2.5 rounded-xl border border-[#E5E7EB] hover:border-[#2E7D32] hover:bg-[#F8FAF8] transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center shrink-0">
                  <Sprout className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-[#1F2937] truncate">Manage Crops &amp; Farms</p>
                  <p className="text-[10px] text-[#9CA3AF] truncate">AI Care &amp; planting cycles</p>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#9CA3AF] group-hover:text-[#2E7D32] transition-colors" />
              </Link>
              <Link
                href="/farmer/analysis"
                className="flex items-center gap-2.5 p-2.5 rounded-xl border border-[#E5E7EB] hover:border-[#2E7D32] hover:bg-[#F8FAF8] transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center shrink-0">
                  <Scan className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-[#1F2937] truncate">Scan Crop Leaf</p>
                  <p className="text-[10px] text-[#9CA3AF] truncate">AI disease diagnosis</p>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#9CA3AF] group-hover:text-[#2E7D32] transition-colors" />
              </Link>

              <Link
                href="/farmer/ai-advisor"
                className="flex items-center gap-2.5 p-2.5 rounded-xl border border-[#E5E7EB] hover:border-[#2E7D32] hover:bg-[#F8FAF8] transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-[#1F2937] truncate">Ask AI Advisor</p>
                  <p className="text-[10px] text-[#9CA3AF] truncate">Crop care &amp; fertilizers</p>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#9CA3AF] group-hover:text-[#2E7D32] transition-colors" />
              </Link>

              <Link
                href="/farmer/experts"
                className="flex items-center gap-2.5 p-2.5 rounded-xl border border-[#E5E7EB] hover:border-[#2E7D32] hover:bg-[#F8FAF8] transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-[#1F2937] truncate">Find Agronomists</p>
                  <p className="text-[10px] text-[#9CA3AF] truncate">Consult verified experts</p>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#9CA3AF] group-hover:text-[#2563EB] transition-colors" />
              </Link>

              <Link
                href="/farmer/weather"
                className="flex items-center gap-2.5 p-2.5 rounded-xl border border-[#E5E7EB] hover:border-[#2E7D32] hover:bg-[#F8FAF8] transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-[#1F2937] truncate">Weather Center</p>
                  <p className="text-[10px] text-[#9CA3AF] truncate">Spraying feasibility</p>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#9CA3AF] group-hover:text-[#D97706] transition-colors" />
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 5 cols */}
        <div className="lg:col-span-5 space-y-4">
          {/* Card: Farm Health Trend */}
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-3.5 sm:p-4 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#1F2937]">Health Trend</p>
                <p className="text-[10px] text-[#9CA3AF]">Vitality curve past 30 days</p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-[10px] font-bold">
                +4.2% stability
              </span>
            </div>

            <Sparkline />

            <div className="flex items-center justify-between pt-1 text-xs">
              <span className="text-[11px] text-[#6B7280]">Target Vitality: 95%</span>
              <Link
                href="/farmer/analysis"
                className="text-[11px] font-bold text-[#2E7D32] hover:underline"
              >
                View Diagnostics →
              </Link>
            </div>
          </div>

          {/* Card: Alerts & Action Required */}
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-3.5 sm:p-4 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-[#1F2937]">Farm Advisories</p>
              <span className="text-[10px] text-[#9CA3AF]">Real-time status</span>
            </div>

            {dashboardData?.notifications && dashboardData.notifications.filter((n) => !n.read).length > 0 ? (
              <div className="space-y-1.5">
                {dashboardData.notifications
                  .filter((n) => !n.read)
                  .slice(0, 2)
                  .map((notif) => (
                    <div
                      key={notif.id}
                      className="flex items-start gap-2 p-2 rounded-lg bg-[#FEF3C7]/60 border border-[#FCD34D] text-[11px] text-[#4B5563]"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B] shrink-0 mt-0.5" />
                      <span>{notif.message}</span>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="rounded-lg bg-[#E8F5E9]/50 border border-[#C8E6C9] p-2.5 text-center">
                <p className="text-xs font-bold text-[#2E7D32]">All Clear</p>
                <p className="text-[10px] text-[#6B7280] mt-0.5">No urgent disease alerts on active plots.</p>
              </div>
            )}
          </div>

          {/* Card: Microclimate Preview */}
          <WeatherWidget id="weather" />

          {/* Card: Diagnostic History Quick Link */}
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-3.5 sm:p-4 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-[#2E7D32]" />
                <p className="text-xs font-bold text-[#1F2937]">Recent Scans</p>
              </div>
              <Link
                href="/farmer/history"
                className="text-[11px] font-bold text-[#2E7D32] hover:underline"
              >
                Full History →
              </Link>
            </div>
            <p className="text-[11px] text-[#6B7280]">
              Review past leaf diagnostics, severity grades, and treatment history.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
