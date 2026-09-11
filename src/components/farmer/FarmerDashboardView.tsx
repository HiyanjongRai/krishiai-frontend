"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/providers/auth-provider";
import { useToast } from "@/providers/toast-provider";

import {
  Scan,
  Bot,
  CloudSun,
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
              <span className="text-[10px] font-bold text-white bg-[#0F9F68] px-2 py-0.5 rounded-full whitespace-nowrap shadow-xs">
                {m.badge}
              </span>
            ) : (
              <div className="h-4" />
            )}
            <div
              className={`w-full rounded-full transition-all duration-300 ${
                m.active
                  ? "bg-[#0F9F68] shadow-sm ring-4 ring-[#0F9F68]/15"
                  : "bg-[#DDF4EA] hover:bg-[#cbf1e1]"
              }`}
              style={{ height: `${heightPct}%` }}
            />
            <span className="text-[10px] font-semibold text-gray-400 mt-1">{m.label}</span>
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
          <stop offset="0%" stopColor="#0F9F68" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#0F9F68" stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path d={filled} fill="url(#farmSparkGrad)" />
      <path d={d} fill="none" stroke="#0F9F68" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Main Dashboard Component ─────────────────────────────────────────────────
export function FarmerDashboardView() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [chatInput, setChatInput] = useState("");
  const [chartMode, setChartMode] = useState<"Monthly" | "Annually">("Monthly");

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
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#171717] flex items-center gap-2">
            <span>Welcome Back,</span>
            <span className="text-[#0F9F68]">{farmerName}</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Real-time crop health, farm analytics, and AI diagnostic insights.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Date Range Pill */}
          <div className="flex items-center gap-2 bg-white border border-[rgba(234,234,236,0.85)] rounded-full px-4 py-2.5 text-xs font-semibold text-gray-700 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] cursor-pointer hover:border-gray-300 transition-colors">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            <span>Kharif 2081 (Jun – Sep)</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </div>

          {/* Primary Action Button */}
          <Link
            href="/farmer/analysis"
            className="flex items-center gap-2 bg-[#0F9F68] hover:bg-[#0D8A5A] text-white rounded-full px-5 py-2.5 text-xs font-bold shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Crop Analysis</span>
          </Link>
        </div>
      </div>

      {/* ─── 3-COLUMN ASYMMETRIC DASHBOARD GRID ─────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">

        {/* ════════════════════════════════════════════════════════════════════
            LEFT COLUMN (3 cols)
            ════════════════════════════════════════════════════════════════════ */}
        <div className="xl:col-span-3 space-y-5">

          {/* Card: Hero Crop Summary (Credit-Card Style) */}
          <div className="rounded-[24px] border border-[rgba(234,234,236,0.85)] bg-white p-5 space-y-4 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04),0_2px_6px_-1px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#171717]">Crop Goal</p>
                <p className="text-[11px] text-gray-400">Total active harvest</p>
              </div>
              <Link
                href="/farmer/crops"
                className="w-7 h-7 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#0F9F68] hover:border-[#BCE9D5] transition-colors"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Rich Green Hero Card (Inspired by reference credit card surface) */}
            <div className="bg-gradient-to-br from-[#0F9F68] to-[#0A8754] rounded-[22px] p-5 text-white shadow-md relative overflow-hidden space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold tracking-wider text-emerald-200 uppercase">Primary Harvest</span>
                  <p className="text-xl font-black tracking-tight mt-0.5">Tomato</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-xs">
                  <Sprout className="w-5 h-5 text-white" />
                </div>
              </div>

              <div>
                <p className="text-[10px] font-semibold text-emerald-100 opacity-90">Field Area</p>
                <p className="text-2xl font-black tracking-tight">1.5 Hectares</p>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-white/20 text-[10px] text-emerald-100">
                <span className="font-mono tracking-wider">Kathmandu Farm</span>
                <span>EXP: 09/81</span>
              </div>
            </div>

            {/* Weekly Activity Metric */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <p className="text-[11px] text-gray-400 font-semibold">Active Crops</p>
                <p className="text-xl font-black text-[#171717]">8 Crops</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#DDF4EA] text-[#0F9F68] text-[10px] font-bold border border-[#BCE9D5]">
                +12.8%
              </span>
            </div>
          </div>

          {/* Card: Quick Actions */}
          <div className="rounded-[24px] border border-[rgba(234,234,236,0.85)] bg-white p-5 space-y-3 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04),0_2px_6px_-1px_rgba(0,0,0,0.02)]">
            <p className="text-xs font-bold text-[#171717]">Quick Operations</p>
            <div className="space-y-2">
              <Link
                href="/farmer/analysis"
                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-[#F4F4F6] transition-colors group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-[#DDF4EA] text-[#0F9F68] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Scan className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#171717]">Analyze Crop</p>
                  <p className="text-[10px] text-gray-400 truncate">AI leaf diagnosis</p>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#0F9F68] transition-colors" />
              </Link>

              <Link
                href="/farmer/ai-advisor"
                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-[#F4F4F6] transition-colors group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#171717]">Ask AI Advisor</p>
                  <p className="text-[10px] text-gray-400 truncate">Farm recommendations</p>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-teal-600 transition-colors" />
              </Link>

              <Link
                href="/farmer/consultations"
                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-[#F4F4F6] transition-colors group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Users className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#171717]">Consult Expert</p>
                  <p className="text-[10px] text-gray-400 truncate">Book verified specialist</p>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-600 transition-colors" />
              </Link>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            CENTER COLUMN (6 cols)
            ════════════════════════════════════════════════════════════════════ */}
        <div className="xl:col-span-6 space-y-5">

          {/* Card: Engagement Rate / Analysis Activity (Quixotic Center Top Card) */}
          <div className="rounded-[24px] border border-[rgba(234,234,236,0.85)] bg-white p-6 space-y-5 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04),0_2px_6px_-1px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#DDF4EA] flex items-center justify-center text-[#0F9F68]">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#171717]">Diagnostic Rate</p>
                  <p className="text-[11px] text-gray-400">Crop diagnoses this season</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {(["Monthly", "Annually"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setChartMode(mode)}
                    className={`px-3.5 py-1.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                      chartMode === mode
                        ? "bg-[#0F9F68] text-white shadow-xs"
                        : "text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
                <button className="w-7 h-7 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#0F9F68] hover:border-[#BCE9D5] transition-colors ml-1">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <MiniBarChart />
          </div>

          {/* Card: Diagnostic History Table (Quixotic Bottom Left Table) */}
          <div id="history" className="rounded-[24px] border border-[rgba(234,234,236,0.85)] bg-white p-6 space-y-4 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04),0_2px_6px_-1px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-[#171717]">Diagnostic History</p>
                <p className="text-[11px] text-gray-400">Recent crop scan results</p>
              </div>
              <Link
                href="/farmer/analysis"
                className="w-7 h-7 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#0F9F68] hover:border-[#BCE9D5] transition-colors"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    <th className="pb-3 font-semibold">Crop</th>
                    <th className="pb-3 font-semibold">Date</th>
                    <th className="pb-3 font-semibold">Time</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[
                    { crop: "Tomato", icon: "🍅", date: "16 Jun 2025", time: "10:30 PM", status: "Successful", conf: "94.2%", color: "emerald" },
                    { crop: "Potato", icon: "🥔", date: "15 Jun 2025", time: "11:45 PM", status: "Successful", conf: "91.5%", color: "emerald" },
                    { crop: "Maize", icon: "🌽", date: "14 Jun 2025", time: "10:15 PM", status: "Review", conf: "82.4%", color: "amber" },
                    { crop: "Rice", icon: "🌾", date: "12 Jun 2025", time: "08:20 AM", status: "Successful", conf: "96.8%", color: "emerald" },
                  ].map((row) => (
                    <tr key={row.crop} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3.5 font-bold text-[#171717] flex items-center gap-2.5">
                        <span className="text-base leading-none">{row.icon}</span>
                        <span>{row.crop}</span>
                      </td>
                      <td className="py-3.5 text-gray-500 text-[11px]">{row.date}</td>
                      <td className="py-3.5 text-gray-500 text-[11px]">{row.time}</td>
                      <td className="py-3.5">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#171717]">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              row.color === "emerald" ? "bg-[#0F9F68]" : "bg-amber-500"
                            }`}
                          />
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right font-black text-[#171717]">{row.conf}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Card: Ask KrishiAI Interactive Input */}
          <div className="rounded-[24px] border border-[rgba(234,234,236,0.85)] bg-white p-6 space-y-3.5 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04),0_2px_6px_-1px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#DDF4EA] text-[#0F9F68] flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#171717]">Ask KrishiAI Advisor</p>
                <p className="text-[11px] text-gray-400">Ask about crop diseases, fertilizers, or seasonal planning</p>
              </div>
            </div>

            <form onSubmit={handleChatSubmit} className="relative">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask KrishiAI about your crops..."
                className="w-full py-3 pl-4 pr-12 rounded-full border border-gray-200 text-xs focus:ring-3 focus:ring-[#0F9F68]/15 focus:border-[#0F9F68] outline-none transition-all placeholder:text-gray-400"
              />
              <button
                type="submit"
                className="w-8 h-8 rounded-full bg-[#0F9F68] hover:bg-[#0D8A5A] text-white flex items-center justify-center absolute right-1.5 top-1.5 transition-colors cursor-pointer shadow-xs"
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
                  className="px-3 py-1 rounded-full bg-[#F4F4F6] hover:bg-[#DDF4EA] hover:text-[#0F9F68] text-gray-600 text-[10px] font-semibold transition-colors text-left cursor-pointer"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            RIGHT COLUMN (3 cols)
            ════════════════════════════════════════════════════════════════════ */}
        <div className="xl:col-span-3 space-y-5">

          {/* Card: Farm Health Score (Quixotic Top Right Card) */}
          <div className="rounded-[24px] border border-[rgba(234,234,236,0.85)] bg-white p-5 space-y-3.5 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04),0_2px_6px_-1px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#171717]">Farm Health Goal</p>
                <p className="text-[11px] text-gray-400">Total vitality score</p>
              </div>
              <button className="w-7 h-7 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#0F9F68] hover:border-[#BCE9D5] transition-colors">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <p className="text-[10px] text-gray-400 font-semibold mb-0.5">Total Balance</p>
              <p className="text-3xl font-black text-[#171717] tracking-tight">
                87<span className="text-lg text-gray-400 font-semibold">/100</span>
              </p>
            </div>

            <Sparkline />

            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                href="/farmer/analysis"
                className="py-2.5 rounded-full bg-[#0F9F68] hover:bg-[#0D8A5A] text-white text-[11px] font-bold text-center transition-colors shadow-xs"
              >
                Analyze ↑
              </Link>
              <Link
                href="/farmer/consultations"
                className="py-2.5 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-700 text-[11px] font-bold text-center transition-colors"
              >
                Consult ↓
              </Link>
            </div>
          </div>

          {/* Card: Attention Required */}
          <div className="rounded-[24px] border border-[rgba(234,234,236,0.85)] bg-white p-5 space-y-3 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04),0_2px_6px_-1px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#171717]">Requires Action</p>
                <p className="text-[11px] text-gray-400">Potential crop risks</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200">
                +12.8%
              </span>
            </div>
            <p className="text-3xl font-black text-[#171717]">2 <span className="text-xs text-gray-400 font-semibold">crops</span></p>

            <div className="space-y-2 pt-1">
              {[
                { crop: "Potato", issue: "Leaf blight suspected", farm: "Bhaktapur Farm" },
                { crop: "Maize", issue: "High pest alert", farm: "Kavre Farm" },
              ].map((item) => (
                <div key={item.crop} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-amber-50/60 border border-amber-100">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-bold text-[#171717]">{item.crop} <span className="font-normal text-gray-500">– {item.farm}</span></p>
                    <p className="text-[10px] text-amber-700">{item.issue}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card: Weather Card */}
          <div id="weather" className="rounded-[24px] border border-[rgba(234,234,236,0.85)] bg-white p-5 space-y-3 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04),0_2px_6px_-1px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-[#171717]">Today&apos;s Weather</p>
              <span className="text-[10px] font-semibold text-gray-400 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Kathmandu
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500">
                <Sun className="w-6 h-6 fill-amber-300" />
              </div>
              <div>
                <p className="text-3xl font-black text-[#171717]">24°<span className="text-lg text-gray-400 font-semibold">C</span></p>
                <p className="text-xs text-gray-500">Partly Cloudy</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px] pt-1">
              {[
                ["Humidity", "58%"],
                ["Rain Prob.", "20%"],
                ["Wind", "12 km/h"],
                ["Feels Like", "25°C"],
              ].map(([label, val]) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-gray-400">{label}</span>
                  <span className="font-bold text-[#171717]">{val}</span>
                </div>
              ))}
            </div>

            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 text-amber-900">
              <CloudRain className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[10px] leading-snug">
                <span className="font-bold">Farm Alert:</span> Rain expected tomorrow. Plan drainage.
              </p>
            </div>
          </div>

          {/* Card: Expert Consultations (Quixotic Avatar Stack Card) */}
          <div className="rounded-[24px] border border-[rgba(234,234,236,0.85)] bg-white p-5 space-y-3.5 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04),0_2px_6px_-1px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#171717]">Consultation Network</p>
                <p className="text-[11px] text-gray-400">Active certified experts</p>
              </div>
              <Link
                href="/farmer/consultations"
                className="w-7 h-7 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#0F9F68] hover:border-[#BCE9D5] transition-colors"
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
                    className="w-9 h-9 rounded-full border-2 border-white overflow-hidden bg-gray-100 relative shadow-2xs"
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
                <div className="w-9 h-9 rounded-full border-2 border-white bg-[#0F9F68] flex items-center justify-center text-[10px] font-black text-white shadow-2xs">
                  +2
                </div>
              </div>
              <p className="text-[11px] text-gray-500 font-medium">5 specialists ready</p>
            </div>

            <div className="space-y-2">
              {[
                { name: "Dr. Anil Sharma", role: "Agronomist", rating: "4.8", available: true },
                { name: "Dr. Sita Karki", role: "Pathologist", rating: "4.7", available: true },
              ].map((expert) => (
                <div
                  key={expert.name}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 hover:border-[#BCE9D5] hover:bg-[#DDF4EA]/20 transition-all"
                >
                  <div>
                    <p className="text-[11px] font-bold text-[#171717]">{expert.name}</p>
                    <p className="text-[10px] text-gray-400">{expert.role}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-0.5 text-[10px] text-amber-500 font-bold">
                      <Star className="w-2.5 h-2.5 fill-current" />
                      {expert.rating}
                    </div>
                    <div className={`flex items-center gap-1 text-[9px] font-semibold ${expert.available ? "text-[#0F9F68]" : "text-rose-500"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${expert.available ? "bg-[#0F9F68]" : "bg-rose-500"}`} />
                      {expert.available ? "Available" : "Busy"}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/farmer/consultations"
              className="block w-full py-2.5 rounded-full bg-[#0F9F68] hover:bg-[#0D8A5A] text-white text-[11px] font-bold text-center transition-colors shadow-xs"
            >
              Book a Consultation
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
