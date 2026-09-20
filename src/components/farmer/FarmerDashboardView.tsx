"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/providers/auth-provider";
import { useToast } from "@/providers/toast-provider";
import { farmService } from "@/services/farm";
import type { FarmerDashboardResponse } from "@/types/farm";
import { WeatherWidget } from "@/components/weather";

import {
  Scan,
  Bot,
  Users,
  ArrowUpRight,
  Plus,
  Calendar,
  Send,
  AlertTriangle,
  Sprout,
  Sun,
  Star,
  ChevronDown,
  CloudRain,
  MapPin,
  Activity,
} from "lucide-react";
import { CropAvatar } from "@/components/ui/crop-avatar";

// ─── Quixotic-Style Bar Chart Component ───────────────────────────────────────
function MiniBarChart() {
  const months = [
    { label: "APR", value: 32, active: false },
    { label: "MAY", value: 54, active: false },
    { label: "JUN", value: 46, active: false },
    { label: "JUL", value: 85, active: true, badge: "+17.8%" },
    { label: "AUG", value: 62, active: false },
    { label: "SEP", value: 52, active: false },
  ];
  const max = 85;

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
                  : "bg-[#E8F5E9] hover:bg-[#E8F5E9]"
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
  const points = [15, 35, 28, 55, 45, 68, 60, 82, 70, 88];
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
        <linearGradient id="farmSparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2E7D32" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#2E7D32" stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path d={filled} fill="url(#farmSparkGrad)" />
      <path d={d} fill="none" stroke="#2E7D32" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
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

  useEffect(() => {
    let active = true;
    farmService
      .getFarmerDashboard()
      .then((data) => {
        if (active) setDashboardData(data);
      })
      .catch(() => {
        // Silently fallback to standard layout metrics
      });
    return () => {
      active = false;
    };
  }, []);

  const farmerName = user?.fullName?.split(" ")[0] || "Ram";

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
    <div className="space-y-6">

      {/* ─── HEADER ROW (Quixotic Style) ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#1F2937] flex items-center gap-2">
            <span>Welcome Back,</span>
            <span className="text-[#2E7D32]">{farmerName}</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
            Real-time crop health, farm analytics, and AI diagnostic insights.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap w-full sm:w-auto">
          {/* Date Range Pill */}
          <div className="flex items-center justify-between sm:justify-start gap-2 bg-white border border-[#E5E7EB] rounded-full px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs font-semibold text-[#4B5563] shadow-[0_4px_20px_-2px_#EEF0EE] cursor-pointer hover:border-[#D1D5DB] transition-colors flex-1 sm:flex-initial">
            <div className="flex items-center gap-2 min-w-0">
              <Calendar className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" />
              <span className="truncate">Kharif 2081 (Jun – Sep)</span>
            </div>
            <ChevronDown className="w-3 h-3 text-[#9CA3AF] shrink-0" />
          </div>

          {/* Primary Action Button */}
          <Link
            href="/farmer/analysis"
            className="flex items-center justify-center gap-2 bg-[#2E7D32] hover:bg-[#256B2A] text-white rounded-full px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-bold shadow-sm transition-all active:scale-95 flex-1 sm:flex-initial min-h-[40px]"
          >
            <Plus className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap">New Crop Analysis</span>
          </Link>
        </div>
      </div>

      {/* ─── 3-COLUMN RESPONSIVE DASHBOARD GRID ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

        {/* ════════════════════════════════════════════════════════════════════
            LEFT COLUMN (Desktop: 3 cols, Laptop/Tablet: 4 cols)
            ════════════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-5">

          {/* Card: Hero Crop Summary (Credit-Card Style) */}
          <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 space-y-4 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#1F2937]">Crop Goal</p>
                <p className="text-[11px] text-[#9CA3AF]">Total active harvest</p>
              </div>
              <Link
                href="/farmer/crops"
                className="w-7 h-7 rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#9CA3AF] hover:text-[#2E7D32] hover:border-[#C8E6C9] transition-colors"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Rich Green Hero Card (Inspired by reference credit card surface) */}
            <div className="bg-gradient-to-br from-[#2E7D32] to-[#388E3C] rounded-[22px] p-5 text-white shadow-md relative overflow-hidden space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold tracking-wider text-[#2E7D32] uppercase">
                    {dashboardData?.primaryFarm ? "Primary Farm" : "Primary Harvest"}
                  </span>
                  <p className="text-xl font-black tracking-tight mt-0.5 truncate max-w-[170px]">
                    {dashboardData?.primaryFarm?.farmName || "Tomato"}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-xs">
                  <Sprout className="w-5 h-5 text-white" />
                </div>
              </div>

              <div>
                <p className="text-[10px] font-semibold text-[#2E7D32] opacity-90">Field Area</p>
                <p className="text-2xl font-black tracking-tight">
                  {dashboardData?.primaryFarm?.area
                    ? `${dashboardData.primaryFarm.area} ${dashboardData.primaryFarm.areaUnit.toLowerCase()}`
                    : "1.5 Hectares"}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-white/20 text-[10px] text-[#2E7D32]">
                <span className="font-mono tracking-wider truncate max-w-[140px]">
                  {dashboardData?.primaryFarm?.location?.name || "Kathmandu Farm"}
                </span>
                <span>{dashboardData ? `${dashboardData.totalFarms} Farms` : "EXP: 09/81"}</span>
              </div>
            </div>

            {/* Weekly Activity Metric */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <p className="text-[11px] text-[#9CA3AF] font-semibold">Active Crops</p>
                <p className="text-xl font-black text-[#1F2937]">
                  {dashboardData ? `${dashboardData.cropCount} Crops` : "8 Crops"}
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-[10px] font-bold border border-[#C8E6C9]">
                {dashboardData?.activeConsultations ? `${dashboardData.activeConsultations} Active Sessions` : "+12.8%"}
              </span>
            </div>
          </div>

          {/* Card: Quick Actions */}
          <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 space-y-3 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE]">
            <p className="text-xs font-bold text-[#1F2937]">Quick Operations</p>
            <div className="space-y-2">
              <Link
                href="/farmer/farms"
                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-[#F1F5F2] transition-colors group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#1F2937]">Manage My Farms</p>
                  <p className="text-[10px] text-[#9CA3AF] truncate">Plots, coordinates &amp; units</p>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#6B7280] group-hover:text-[#2E7D32] transition-colors" />
              </Link>

              <Link
                href="/farmer/analysis"
                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-[#F1F5F2] transition-colors group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Scan className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#1F2937]">Analyze Crop</p>
                  <p className="text-[10px] text-[#9CA3AF] truncate">AI leaf diagnosis</p>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#6B7280] group-hover:text-[#2E7D32] transition-colors" />
              </Link>

              <Link
                href="/farmer/ai-advisor"
                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-[#F1F5F2] transition-colors group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#1F2937]">Ask AI Advisor</p>
                  <p className="text-[10px] text-[#9CA3AF] truncate">Farm recommendations</p>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#6B7280] group-hover:text-[#2E7D32] transition-colors" />
              </Link>

              <Link
                href="/farmer/consultations"
                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-[#F1F5F2] transition-colors group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Users className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#1F2937]">Consult Expert</p>
                  <p className="text-[10px] text-[#9CA3AF] truncate">Book verified specialist</p>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#6B7280] group-hover:text-[#2563EB] transition-colors" />
              </Link>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            CENTER COLUMN (Desktop: 6 cols, Laptop/Tablet: 8 cols)
            ════════════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-8 xl:col-span-6 space-y-5">

          {/* Card: Engagement Rate / Analysis Activity (Quixotic Center Top Card) */}
          <div className="rounded-[20px] sm:rounded-[24px] border border-[#E5E7EB] bg-white p-4 sm:p-5 md:p-6 space-y-5 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32] shrink-0">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1F2937]">Diagnostic Rate</p>
                  <p className="text-[11px] text-[#9CA3AF]">Crop diagnoses this season</p>
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
                <button className="w-7 h-7 rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#9CA3AF] hover:text-[#2E7D32] hover:border-[#C8E6C9] transition-colors ml-1 shrink-0">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <MiniBarChart />
          </div>

          {/* Card: Diagnostic History Table (Responsive Contained Table + Mobile Cards) */}
          <div id="history" className="rounded-[20px] sm:rounded-[24px] border border-[#E5E7EB] bg-white p-4 sm:p-5 md:p-6 space-y-4 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-[#1F2937]">Diagnostic History</p>
                <p className="text-[11px] text-[#9CA3AF]">Recent crop scan results</p>
              </div>
              <Link
                href="/farmer/analysis"
                className="w-7 h-7 rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#9CA3AF] hover:text-[#2E7D32] hover:border-[#C8E6C9] transition-colors"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Mobile Cards View (sm:hidden) */}
            <div className="sm:hidden space-y-2.5">
              {[
                { crop: "Tomato", icon: "🍅", date: "16 Jun 2025", time: "10:30 PM", status: "Successful", conf: "94.2%", color: "emerald" },
                { crop: "Potato", icon: "🥔", date: "15 Jun 2025", time: "11:45 PM", status: "Successful", conf: "91.5%", color: "emerald" },
                { crop: "Maize", icon: "🌽", date: "14 Jun 2025", time: "10:15 PM", status: "Review", conf: "82.4%", color: "amber" },
                { crop: "Rice", icon: "🌾", date: "12 Jun 2025", time: "08:20 AM", status: "Successful", conf: "96.8%", color: "emerald" },
              ].map((row) => (
                <div key={row.crop} className="p-3 rounded-2xl bg-[#F8FAF8] border border-[#EEF0EE] flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <CropAvatar name={row.crop} emoji={row.icon} size="sm" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#1F2937] truncate">{row.crop}</p>
                      <p className="text-[10px] text-[#9CA3AF]">{row.date} · {row.time}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-0.5 shrink-0">
                    <span className="text-xs font-black text-[#1F2937]">{row.conf}</span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#4B5563]">
                      <span className={`w-1.5 h-1.5 rounded-full ${row.color === "emerald" ? "bg-[#2E7D32]" : "bg-[#F59E0B]"}`} />
                      {row.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop / Tablet Table View (hidden sm:block) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[420px]">
                <thead>
                  <tr className="border-b border-[#E5E7EB] text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                    <th className="pb-3 font-semibold">Crop</th>
                    <th className="pb-3 font-semibold">Date</th>
                    <th className="pb-3 font-semibold">Time</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EEF0EE]">
                  {[
                    { crop: "Tomato", icon: "🍅", date: "16 Jun 2025", time: "10:30 PM", status: "Successful", conf: "94.2%", color: "emerald" },
                    { crop: "Potato", icon: "🥔", date: "15 Jun 2025", time: "11:45 PM", status: "Successful", conf: "91.5%", color: "emerald" },
                    { crop: "Maize", icon: "🌽", date: "14 Jun 2025", time: "10:15 PM", status: "Review", conf: "82.4%", color: "amber" },
                    { crop: "Rice", icon: "🌾", date: "12 Jun 2025", time: "08:20 AM", status: "Successful", conf: "96.8%", color: "emerald" },
                  ].map((row) => (
                    <tr key={row.crop} className="hover:bg-[#F8FAF8]/70 transition-colors">
                      <td className="py-3.5 font-bold text-[#1F2937] flex items-center gap-2.5">
                        <CropAvatar name={row.crop} emoji={row.icon} size="xs" />
                        <span>{row.crop}</span>
                      </td>
                      <td className="py-3.5 text-[#6B7280] text-[11px]">{row.date}</td>
                      <td className="py-3.5 text-[#6B7280] text-[11px]">{row.time}</td>
                      <td className="py-3.5">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#1F2937]">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              row.color === "emerald" ? "bg-[#2E7D32]" : "bg-[#F59E0B]"
                            }`}
                          />
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right font-black text-[#1F2937]">{row.conf}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Card: Ask KrishiAI Interactive Input */}
          <div className="rounded-[20px] sm:rounded-[24px] border border-[#E5E7EB] bg-white p-4 sm:p-5 md:p-6 space-y-3.5 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#1F2937]">Ask KrishiAI Advisor</p>
                <p className="text-[11px] text-[#9CA3AF]">Ask about crop diseases, fertilizers, or seasonal planning</p>
              </div>
            </div>

            <form onSubmit={handleChatSubmit} className="relative">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask KrishiAI about your crops..."
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
                "Why are my tomato leaves turning yellow?",
                "How often should I water maize in dry season?",
                "Organic solutions for potato blight",
              ].map((p) => (
                <button
                  key={p}
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

          {/* Card: Farm Health Score (Quixotic Top Right Card) */}
          <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 space-y-3.5 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#1F2937]">Farm Health Goal</p>
                <p className="text-[11px] text-[#9CA3AF]">Total vitality score</p>
              </div>
              <button className="w-7 h-7 rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#9CA3AF] hover:text-[#2E7D32] hover:border-[#C8E6C9] transition-colors">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <p className="text-[10px] text-[#9CA3AF] font-semibold mb-0.5">Total Balance</p>
              <p className="text-3xl font-black text-[#1F2937] tracking-tight">
                87<span className="text-lg text-[#9CA3AF] font-semibold">/100</span>
              </p>
            </div>

            <Sparkline />

            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                href="/farmer/analysis"
                className="py-2.5 rounded-full bg-[#2E7D32] hover:bg-[#256B2A] text-white text-[11px] font-bold text-center transition-colors shadow-xs"
              >
                Analyze ↑
              </Link>
              <Link
                href="/farmer/consultations"
                className="py-2.5 rounded-full border border-[#E5E7EB] hover:bg-[#F8FAF8] text-[#4B5563] text-[11px] font-bold text-center transition-colors"
              >
                Consult ↓
              </Link>
            </div>
          </div>

          {/* Card: Attention Required */}
          <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 space-y-3 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#1F2937]">Requires Action</p>
                <p className="text-[11px] text-[#9CA3AF]">Potential crop risks</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#F59E0B] text-[10px] font-bold border border-[#FCD34D]">
                +12.8%
              </span>
            </div>
            <p className="text-3xl font-black text-[#1F2937]">2 <span className="text-xs text-[#9CA3AF] font-semibold">crops</span></p>

            <div className="space-y-2 pt-1">
              {[
                { crop: "Potato", issue: "Leaf blight suspected", farm: "Bhaktapur Farm" },
                { crop: "Maize", issue: "High pest alert", farm: "Kavre Farm" },
              ].map((item) => (
                <div key={item.crop} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#FEF3C7]/60 border border-[#FCD34D]">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B]0 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-bold text-[#1F2937]">{item.crop} <span className="font-normal text-[#6B7280]">– {item.farm}</span></p>
                    <p className="text-[10px] text-[#F59E0B]">{item.issue}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card: Weather Card */}
          <WeatherWidget id="weather" />

          {/* Card: Expert Consultations (Quixotic Avatar Stack Card) */}
          <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 space-y-3.5 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#1F2937]">Consultation Network</p>
                <p className="text-[11px] text-[#9CA3AF]">Active certified experts</p>
              </div>
              <Link
                href="/farmer/consultations"
                className="w-7 h-7 rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#9CA3AF] hover:text-[#2E7D32] hover:border-[#C8E6C9] transition-colors"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Quixotic-style Avatar Stack with +2 green badge */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2.5">
                {[
                  { src: "/images/experts/expert-anil.jpg", name: "Dr. Anil Sharma" },
                  { src: "/images/experts/expert-sita.jpg", name: "Dr. Sita Karki" },
                  { src: "/images/experts/expert-dinesh.jpg", name: "Er. Dinesh Rai" },
                ].map((expert, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full border-2 border-white overflow-hidden bg-[#F1F5F2] relative shadow-2xs"
                    title={expert.name}
                  >
                    <Image
                      src={expert.src}
                      alt={expert.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
                <div className="w-9 h-9 rounded-full border-2 border-white bg-[#2E7D32] flex items-center justify-center text-[10px] font-black text-white shadow-2xs">
                  +2
                </div>
              </div>
              <p className="text-[11px] text-[#6B7280] font-medium">5 specialists ready</p>
            </div>

            <div className="space-y-2">
              {[
                { name: "Dr. Anil Sharma", role: "Agronomist", rating: "4.8", available: true },
                { name: "Dr. Sita Karki", role: "Pathologist", rating: "4.7", available: true },
              ].map((expert) => (
                <div
                  key={expert.name}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-[#E5E7EB] hover:border-[#C8E6C9] hover:bg-[#E8F5E9]/20 transition-all"
                >
                  <div>
                    <p className="text-[11px] font-bold text-[#1F2937]">{expert.name}</p>
                    <p className="text-[10px] text-[#9CA3AF]">{expert.role}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-0.5 text-[10px] text-[#F59E0B]0 font-bold">
                      <Star className="w-2.5 h-2.5 fill-current" />
                      {expert.rating}
                    </div>
                    <div className={`flex items-center gap-1 text-[9px] font-semibold ${expert.available ? "text-[#2E7D32]" : "text-[#DC2626]"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${expert.available ? "bg-[#2E7D32]" : "bg-[#DC2626]"}`} />
                      {expert.available ? "Available" : "Busy"}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/farmer/consultations"
              className="block w-full py-2.5 rounded-full bg-[#2E7D32] hover:bg-[#256B2A] text-white text-[11px] font-bold text-center transition-colors shadow-xs"
            >
              Book a Consultation
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
