"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/providers/auth-provider";

import {
  LayoutDashboard,
  Home,
  Sprout,
  Scan,
  Bot,
  CloudSun,
  Users,
  History,
  Bell,
  HelpCircle,
  Settings,
  LogOut,
  ChevronDown,
  AlertTriangle,
  Send,
  CloudRain,
  MapPin,
  ArrowUpRight,
  Plus,
  Calendar,
  Search,
  CheckCircle2,
  Sparkles,
  Info,
  Sun,
  Star,
  Activity,
  Droplets,
  Wind,
} from "lucide-react";

export function FarmerDashboardView() {
  const { user, logout } = useAuth();
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [chatInput, setChatInput] = useState("");
  const [activeTab, setActiveTab] = useState<
    "Overview" | "Crops" | "AI Diagnostics" | "Weather" | "Advisories"
  >("Overview");

  // Farmer's display name
  const farmerName = user?.fullName || "Ram Bahadur";

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    alert(`🤖 KrishiAI Advisor: Processing "${chatInput}"...`);
    setChatInput("");
  };

  return (
    <div className="space-y-6">
      {/* ─── Hero Greeting & Seasonal Control Row ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#17201A] flex items-center gap-2">
            <span>Good morning, {farmerName}</span>
            <span>👋</span>
          </h1>
          <p className="text-xs text-[#647067] mt-0.5">
            Here&apos;s what&apos;s happening with your crops and farms today.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Season Filter Pill */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 rounded-full px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition-colors cursor-pointer">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>Kharif 2081 (Jun - Aug)</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>

          {/* Primary Action Button */}
          <Link
            href="/farmer/analysis"
            className="flex items-center gap-1.5 bg-[#166534] hover:bg-[#15803d] text-white rounded-full px-4 py-2 text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Crop Analysis</span>
          </Link>
        </div>
      </div>

      {/* ─── Main Content Grid: 8 Cols Core + 4 Cols Right Sidebar ──────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            
            {/* ══════════════════════════════════════════════════════════════════════════
                LEFT CORE SECTION (XL: 8 COLS) - Actions, Stats, Crops, & Diagnostics
               ══════════════════════════════════════════════════════════════════════════ */}
            <div className="xl:col-span-8 space-y-6">
              
              {/* ── MODULE 1: "What would you like to do?" (Box Shapes from Reference) ─ */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-extrabold text-[#17201A]">What would you like to do?</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
                  {/* Action 1: Analyze Crop */}
                  <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#166534]">
                      <Scan className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-[#17201A]">Analyze Crop</h3>
                      <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                        Upload a crop image and check health.
                      </p>
                    </div>
                    <Link
                      href="/farmer/analysis"
                      className="w-full py-2 rounded-full bg-[#166534] hover:bg-[#15803d] text-white text-xs font-bold text-center shadow-2xs transition-all block"
                    >
                      Analyze Now
                    </Link>
                  </div>

                  {/* Action 2: My Crops */}
                  <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                      <Sprout className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-[#17201A]">My Crops</h3>
                      <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                        View and manage active crops.
                      </p>
                    </div>
                    <Link
                      href="/farmer/crops"
                      className="w-full py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold text-center shadow-2xs transition-all block"
                    >
                      View Crops
                    </Link>
                  </div>

                  {/* Action 3: Ask AI Advisor */}
                  <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-[#17201A]">Ask AI Advisor</h3>
                      <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                        Get personalized agricultural guidance.
                      </p>
                    </div>
                    <Link
                      href="/farmer/ai-advisor"
                      className="w-full py-2 rounded-full bg-[#0F766E] hover:bg-[#115E59] text-white text-xs font-bold text-center shadow-2xs transition-all block"
                    >
                      Ask Advisor
                    </Link>
                  </div>

                  {/* Action 4: Check Weather */}
                  <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                      <CloudSun className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-[#17201A]">Check Weather</h3>
                      <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                        View forecast & rain probability.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab("Weather")}
                      className="w-full py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold text-center shadow-2xs transition-all cursor-pointer"
                    >
                      View Weather
                    </button>
                  </div>
                </div>
              </div>

              {/* ── MODULE 2: "My Farm Overview" Stat Cards (Clean Rounded Box Style) ─── */}
              <div className="space-y-3">
                <h2 className="text-sm font-extrabold text-[#17201A]">My Farm Overview</h2>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  {/* Stat 1: Total Farms */}
                  <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#166534] flex items-center justify-center shrink-0">
                      <Home className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-[#17201A] leading-tight">3</p>
                      <p className="text-xs font-bold text-slate-700">Total Farms</p>
                      <p className="text-[10px] text-slate-400">All your farms</p>
                    </div>
                  </div>

                  {/* Stat 2: Active Crops */}
                  <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#166534] flex items-center justify-center shrink-0">
                      <Sprout className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-[#17201A] leading-tight">8</p>
                      <p className="text-xs font-bold text-slate-700">Active Crops</p>
                      <p className="text-[10px] text-slate-400">Across all farms</p>
                    </div>
                  </div>

                  {/* Stat 3: AI Analyses */}
                  <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-[#17201A] leading-tight">12</p>
                      <p className="text-xs font-bold text-slate-700">AI Analyses</p>
                      <p className="text-[10px] text-slate-400">This season</p>
                    </div>
                  </div>

                  {/* Stat 4: Need Attention */}
                  <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-amber-600 leading-tight">2</p>
                      <p className="text-xs font-bold text-slate-700">Need Attention</p>
                      <p className="text-[10px] text-slate-400">Crops need care</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── MODULE 3: "Crop Health" Cards & "KrishiAI Insight" ────────────────── */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                {/* Crop Health (LG: 7 COLS) */}
                <div className="lg:col-span-7 space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-extrabold text-[#17201A]">Crop Health</h2>
                    <Link href="/farmer/crops" className="text-xs font-bold text-[#166534] hover:underline flex items-center gap-1">
                      <span>View All Crops</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {/* Crop 1: Tomato */}
                    <div className="bg-white rounded-3xl p-3 border border-slate-100 shadow-2xs space-y-2 flex flex-col justify-between hover:shadow-xs transition-shadow">
                      <div className="w-full h-24 rounded-2xl overflow-hidden relative bg-slate-100">
                        <Image
                          src="/images/crops/tomato-crop.jpg"
                          alt="Tomato"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-xs text-[#17201A]">Tomato</p>
                        <p className="text-[10px] text-slate-400">Kathmandu Farm</p>
                        <span className="inline-block px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[9px] font-semibold">
                          Flowering Stage
                        </span>
                        <div>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[9px] font-bold">
                            ✓ Healthy
                          </span>
                        </div>
                        <p className="text-[9px] text-slate-400 pt-0.5">Last checked: Today</p>
                      </div>
                      <Link
                        href="/farmer/crops"
                        className="w-full py-1.5 rounded-full border border-slate-200 hover:bg-slate-50 text-[10px] font-bold text-slate-700 text-center transition-colors block"
                      >
                        View Details
                      </Link>
                    </div>

                    {/* Crop 2: Potato */}
                    <div className="bg-white rounded-3xl p-3 border border-slate-100 shadow-2xs space-y-2 flex flex-col justify-between hover:shadow-xs transition-shadow">
                      <div className="w-full h-24 rounded-2xl overflow-hidden relative bg-slate-100">
                        <Image
                          src="/images/crops/potato-crop.jpg"
                          alt="Potato"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-xs text-[#17201A]">Potato</p>
                        <p className="text-[10px] text-slate-400">Bhaktapur Farm</p>
                        <span className="inline-block px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[9px] font-semibold">
                          Vegetative Stage
                        </span>
                        <div>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[9px] font-bold">
                            ⚠️ Needs Attention
                          </span>
                        </div>
                        <p className="text-[9px] text-slate-400 pt-0.5">Last checked: Yesterday</p>
                      </div>
                      <Link
                        href="/farmer/crops"
                        className="w-full py-1.5 rounded-full border border-slate-200 hover:bg-slate-50 text-[10px] font-bold text-slate-700 text-center transition-colors block"
                      >
                        View Details
                      </Link>
                    </div>

                    {/* Crop 3: Rice */}
                    <div className="bg-white rounded-3xl p-3 border border-slate-100 shadow-2xs space-y-2 flex flex-col justify-between hover:shadow-xs transition-shadow">
                      <div className="w-full h-24 rounded-2xl overflow-hidden relative bg-slate-100">
                        <Image
                          src="/images/crops/rice-crop.jpg"
                          alt="Rice"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-xs text-[#17201A]">Rice</p>
                        <p className="text-[10px] text-slate-400">Lalitpur Farm</p>
                        <span className="inline-block px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[9px] font-semibold">
                          Tillering Stage
                        </span>
                        <div>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[9px] font-bold">
                            ✓ Healthy
                          </span>
                        </div>
                        <p className="text-[9px] text-slate-400 pt-0.5">Last checked: Aug 30</p>
                      </div>
                      <Link
                        href="/farmer/crops"
                        className="w-full py-1.5 rounded-full border border-slate-200 hover:bg-slate-50 text-[10px] font-bold text-slate-700 text-center transition-colors block"
                      >
                        View Details
                      </Link>
                    </div>

                    {/* Crop 4: Maize */}
                    <div className="bg-white rounded-3xl p-3 border border-slate-100 shadow-2xs space-y-2 flex flex-col justify-between hover:shadow-xs transition-shadow">
                      <div className="w-full h-24 rounded-2xl overflow-hidden relative bg-slate-100">
                        <Image
                          src="/images/crops/maize-crop.jpg"
                          alt="Maize"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-xs text-[#17201A]">Maize</p>
                        <p className="text-[10px] text-slate-400">Kavre Farm</p>
                        <span className="inline-block px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[9px] font-semibold">
                          Vegetative Stage
                        </span>
                        <div>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[9px] font-bold">
                            🚨 High Risk
                          </span>
                        </div>
                        <p className="text-[9px] text-slate-400 pt-0.5">Last checked: Aug 29</p>
                      </div>
                      <Link
                        href="/farmer/crops"
                        className="w-full py-1.5 rounded-full border border-slate-200 hover:bg-slate-50 text-[10px] font-bold text-slate-700 text-center transition-colors block"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>

                {/* KrishiAI Insight Card (LG: 5 COLS - Styled in Deep Emerald Gradient) */}
                <div className="lg:col-span-5 bg-gradient-to-br from-[#0C4A42] via-[#0F5132] to-[#0a3824] text-white rounded-3xl p-6 shadow-md shadow-emerald-950/15 flex flex-col justify-between space-y-4 relative overflow-hidden">
                  <div className="space-y-2 relative z-10">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center text-emerald-300">
                        <Bot className="w-4 h-4" />
                      </div>
                      <h3 className="text-xs font-black tracking-wider uppercase text-emerald-200">
                        KrishiAI Insight
                      </h3>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      Your tomato crop was recently analyzed. The AI detected signs that may require attention.
                    </p>
                  </div>

                  {/* Confidence Breakdown Card */}
                  <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 space-y-2.5 text-xs relative z-10 border border-white/10">
                    <div className="flex items-center justify-between text-slate-200">
                      <span>Possible Issue:</span>
                      <span className="font-bold text-white">Leaf Disease</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-200">
                      <span>Confidence:</span>
                      <span className="font-bold text-white">82%</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-200">
                      <span>Severity:</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-bold text-[10px]">
                        Medium
                      </span>
                    </div>

                    {/* Smooth Pill Progress Bar */}
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[10px] text-slate-300">
                        <span>AI Confidence</span>
                        <span className="font-bold">82%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden">
                        <div className="h-full bg-emerald-400 rounded-full" style={{ width: "82%" }} />
                      </div>
                    </div>

                    <p className="text-[9px] text-slate-300 leading-normal flex items-start gap-1 pt-1 opacity-90">
                      <Info className="w-3 h-3 shrink-0 mt-0.5 text-emerald-300" />
                      <span>
                        AI confidence shows model certainty. Consult an expert for confirmation.
                      </span>
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-1 relative z-10">
                    <Link
                      href="/farmer/analysis"
                      className="py-2 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-bold text-center transition-colors"
                    >
                      View Analysis
                    </Link>
                    <Link
                      href="/farmer/consultations"
                      className="py-2 rounded-full bg-white hover:bg-slate-100 text-[#0C4A42] text-xs font-extrabold text-center shadow-xs transition-colors"
                    >
                      Ask an Expert
                    </Link>
                  </div>
                </div>

              </div>

              {/* ── MODULE 4: "Recent Analyses" Table & "Ask KrishiAI" Box ───────────── */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                {/* Recent Analyses Table (LG: 6 COLS - Styled with Modern Table Spacing) */}
                <div id="history" className="lg:col-span-6 bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-extrabold text-[#17201A]">Recent Analyses</h2>
                      <p className="text-[11px] text-slate-400">Diagnostic scan history</p>
                    </div>
                    <Link href="/farmer/analysis" className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#166534] hover:border-emerald-300 transition-colors">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 text-[10px] font-semibold text-slate-400">
                          <th className="pb-2 font-medium">Crop</th>
                          <th className="pb-2 font-medium">Analysis</th>
                          <th className="pb-2 font-medium">Confidence</th>
                          <th className="pb-2 font-medium">Date</th>
                          <th className="pb-2 text-right font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        <tr className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-2.5 font-bold text-[#17201A]">Tomato</td>
                          <td className="py-2.5 text-slate-600">Leaf Disease</td>
                          <td className="py-2.5 text-slate-600">82%</td>
                          <td className="py-2.5 text-slate-400 text-[11px]">Today</td>
                          <td className="py-2.5 text-right">
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold">
                              Review
                            </span>
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-2.5 font-bold text-[#17201A]">Potato</td>
                          <td className="py-2.5 text-slate-600">Healthy</td>
                          <td className="py-2.5 text-slate-600">94%</td>
                          <td className="py-2.5 text-slate-400 text-[11px]">Yesterday</td>
                          <td className="py-2.5 text-right">
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                              Healthy
                            </span>
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-2.5 font-bold text-[#17201A]">Rice</td>
                          <td className="py-2.5 text-slate-600">Healthy</td>
                          <td className="py-2.5 text-slate-600">91%</td>
                          <td className="py-2.5 text-slate-400 text-[11px]">Aug 30</td>
                          <td className="py-2.5 text-right">
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                              Healthy
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Ask KrishiAI Chat Box (LG: 6 COLS) */}
                <div className="lg:col-span-6 bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs space-y-3.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-emerald-50 text-[#166534] flex items-center justify-center">
                        <Bot className="w-4 h-4" />
                      </div>
                      <h2 className="text-sm font-extrabold text-[#17201A]">Ask KrishiAI</h2>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                      Have a question about your crops, soil, fertilizer, pests, weather, or farming practices?
                    </p>
                  </div>

                  {/* Input form */}
                  <form onSubmit={handleChatSubmit} className="relative">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask KrishiAI something..."
                      className="w-full py-2.5 pl-4 pr-12 rounded-full border border-slate-200 text-xs focus:ring-2 focus:ring-[#166534] outline-none transition-all placeholder:text-slate-400 shadow-2xs"
                    />
                    <button
                      type="submit"
                      className="w-8 h-8 rounded-full bg-[#0F766E] hover:bg-[#115E59] text-white flex items-center justify-center absolute right-1.5 top-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>

                  {/* Suggestion Chips */}
                  <div className="space-y-1.5 pt-1">
                    <p className="text-[10px] font-bold text-slate-400">Try asking:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        "Why are my tomato leaves turning yellow?",
                        "When should I water my crop?",
                        "How can I protect my crop from pests?",
                      ].map((promptText) => (
                        <button
                          key={promptText}
                          onClick={() => setChatInput(promptText)}
                          className="px-3 py-1 rounded-full bg-[#F0FDF4] hover:bg-emerald-100 border border-emerald-200 text-[#166534] text-[10px] font-semibold transition-colors text-left cursor-pointer"
                        >
                          {promptText}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* ══════════════════════════════════════════════════════════════════════════
                RIGHT PANEL SECTION (XL: 4 COLS) - Weather, Notifications, & Experts
               ══════════════════════════════════════════════════════════════════════════ */}
            <div className="xl:col-span-4 space-y-6">
              
              {/* ── Widget 1: Today's Weather & 7-Day Forecast (Box Style from Ref) ─── */}
              <div id="weather" className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-extrabold text-[#17201A]">Today&apos;s Weather</h2>
                  <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    Kathmandu, Nepal
                  </span>
                </div>

                {/* Main Weather Display */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500">
                      <Sun className="w-7 h-7 fill-amber-400" />
                    </div>
                    <div>
                      <span className="text-3xl font-black text-[#17201A]">24°c</span>
                      <p className="text-xs font-semibold text-slate-500">Partly Cloudy</p>
                    </div>
                  </div>

                  {/* 2x2 Stats */}
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-right">
                    <div className="text-slate-400">Humidity</div>
                    <div className="font-bold text-[#17201A]">58%</div>
                    <div className="text-slate-400">Rain Prob.</div>
                    <div className="font-bold text-[#17201A]">20%</div>
                    <div className="text-slate-400">Wind</div>
                    <div className="font-bold text-[#17201A]">12 km/h</div>
                    <div className="text-slate-400">Feels Like</div>
                    <div className="font-bold text-[#17201A]">25°c</div>
                  </div>
                </div>

                {/* 7-Day Forecast Mini Row */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400">7-Day Forecast</p>
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {[
                      { day: "Today", icon: Sun, high: "24°", low: "16°", active: true },
                      { day: "Sat", icon: Sun, high: "23°", low: "15°" },
                      { day: "Sun", icon: CloudSun, high: "22°", low: "14°" },
                      { day: "Mon", icon: Sun, high: "23°", low: "15°" },
                      { day: "Tue", icon: Sun, high: "24°", low: "16°" },
                      { day: "Wed", icon: Sun, high: "25°", low: "17°" },
                      { day: "Thu", icon: Sun, high: "26°", low: "17°" },
                    ].map((f) => {
                      const DayIcon = f.icon;
                      return (
                        <div
                          key={f.day}
                          className={`p-1.5 rounded-2xl flex flex-col items-center gap-1 ${
                            f.active ? "bg-emerald-50/80 border border-emerald-200" : ""
                          }`}
                        >
                          <span className="text-[9px] font-bold text-slate-600">{f.day}</span>
                          <DayIcon className="w-3.5 h-3.5 text-amber-500" />
                          <span className="text-[10px] font-black text-[#17201A]">{f.high}</span>
                          <span className="text-[8px] text-slate-400">{f.low}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Farm Alert Box */}
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-amber-900">
                  <div className="w-7 h-7 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0 mt-0.5">
                    <CloudRain className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs">Farm Alert</h4>
                    <p className="text-[10px] leading-snug mt-0.5 text-amber-800">
                      Rain is expected tomorrow. Consider checking your crop protection and irrigation plans.
                    </p>
                  </div>
                </div>
              </div>

              {/* ── Widget 2: Notifications ─────────────────────────────────────────── */}
              <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs space-y-3.5">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-extrabold text-[#17201A]">Notifications</h2>
                  <button className="text-xs font-bold text-[#166534] hover:underline cursor-pointer">
                    View All
                  </button>
                </div>

                <div className="space-y-3">
                  {/* Notification 1 */}
                  <div className="flex items-start justify-between gap-2.5 p-1.5 hover:bg-slate-50/70 rounded-2xl transition-colors">
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                        <Sprout className="w-4 h-4 text-[#166534]" />
                      </div>
                      <div>
                        <p className="font-bold text-xs text-[#17201A]">Crop analysis completed</p>
                        <p className="text-[10px] text-slate-500">Your tomato crop analysis is ready.</p>
                      </div>
                    </div>
                    <span className="text-[9px] text-slate-400 shrink-0">10m ago</span>
                  </div>

                  {/* Notification 2 */}
                  <div className="flex items-start justify-between gap-2.5 p-1.5 hover:bg-slate-50/70 rounded-2xl transition-colors">
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="font-bold text-xs text-[#17201A]">Weather warning</p>
                        <p className="text-[10px] text-slate-500">Rain is expected tomorrow.</p>
                      </div>
                    </div>
                    <span className="text-[9px] text-slate-400 shrink-0">1h ago</span>
                  </div>

                  {/* Notification 3 */}
                  <div className="flex items-start justify-between gap-2.5 p-1.5 hover:bg-slate-50/70 rounded-2xl transition-colors">
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-bold text-xs text-[#17201A]">Expert response</p>
                        <p className="text-[10px] text-slate-500">Dr. Anil Sharma responded to your query.</p>
                      </div>
                    </div>
                    <span className="text-[9px] text-slate-400 shrink-0">3h ago</span>
                  </div>
                </div>
              </div>

              {/* ── Widget 3: Need Expert Help? ─────────────────────────────────────── */}
              <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs space-y-3.5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-extrabold text-[#17201A]">Need Expert Help?</h2>
                    <p className="text-[10px] text-slate-400">
                      Connect with a verified agricultural expert.
                    </p>
                  </div>
                  <Link href="/farmer/consultations" className="text-xs font-bold text-[#166534] hover:underline shrink-0">
                    Find an Expert →
                  </Link>
                </div>

                {/* 3 Expert Cards Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  {/* Expert 1 */}
                  <div className="p-3 rounded-2xl border border-slate-100 bg-slate-50/40 hover:bg-white hover:border-emerald-200 transition-all flex flex-col justify-between space-y-2 text-center shadow-2xs">
                    <div className="space-y-1">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-300 relative mx-auto">
                        <Image
                          src="/images/experts/expert-anil.jpg"
                          alt="Dr. Anil Sharma"
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="font-bold text-xs text-[#17201A] truncate">Dr. Anil Sharma</p>
                      <p className="text-[9px] text-slate-500">Agronomist</p>
                      <span className="inline-block text-[8px] text-emerald-800 font-semibold">
                        🌱 Vegetable Crops
                      </span>
                      <div className="flex items-center justify-center gap-1 text-[9px] text-amber-500 font-bold">
                        <Star className="w-2.5 h-2.5 fill-current" />
                        <span>4.8 (124)</span>
                      </div>
                      <div className="text-[9px] text-emerald-700 font-semibold flex items-center justify-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Available</span>
                      </div>
                    </div>
                    <Link
                      href="/farmer/consultations"
                      className="w-full py-1 rounded-full border border-slate-200 hover:bg-[#166534] hover:text-white text-[10px] font-bold text-slate-700 transition-colors block"
                    >
                      View
                    </Link>
                  </div>

                  {/* Expert 2 */}
                  <div className="p-3 rounded-2xl border border-slate-100 bg-slate-50/40 hover:bg-white hover:border-emerald-200 transition-all flex flex-col justify-between space-y-2 text-center shadow-2xs">
                    <div className="space-y-1">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-300 relative mx-auto">
                        <Image
                          src="/images/experts/expert-sita.jpg"
                          alt="Dr. Sita Karki"
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="font-bold text-xs text-[#17201A] truncate">Dr. Sita Karki</p>
                      <p className="text-[9px] text-slate-500">Pathologist</p>
                      <span className="inline-block text-[8px] text-emerald-800 font-semibold">
                        🌾 Crop Protection
                      </span>
                      <div className="flex items-center justify-center gap-1 text-[9px] text-amber-500 font-bold">
                        <Star className="w-2.5 h-2.5 fill-current" />
                        <span>4.7 (98)</span>
                      </div>
                      <div className="text-[9px] text-emerald-700 font-semibold flex items-center justify-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Available</span>
                      </div>
                    </div>
                    <Link
                      href="/farmer/consultations"
                      className="w-full py-1 rounded-full border border-slate-200 hover:bg-[#166534] hover:text-white text-[10px] font-bold text-slate-700 transition-colors block"
                    >
                      View
                    </Link>
                  </div>

                  {/* Expert 3 */}
                  <div className="p-3 rounded-2xl border border-slate-100 bg-slate-50/40 hover:bg-white hover:border-emerald-200 transition-all flex flex-col justify-between space-y-2 text-center shadow-2xs">
                    <div className="space-y-1">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-300 relative mx-auto">
                        <Image
                          src="/images/experts/expert-dinesh.jpg"
                          alt="Er. Dinesh Rai"
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="font-bold text-xs text-[#17201A] truncate">Er. Dinesh Rai</p>
                      <p className="text-[9px] text-slate-500">Soil Specialist</p>
                      <span className="inline-block text-[8px] text-emerald-800 font-semibold">
                        🪴 Fertility
                      </span>
                      <div className="flex items-center justify-center gap-1 text-[9px] text-amber-500 font-bold">
                        <Star className="w-2.5 h-2.5 fill-current" />
                        <span>4.6 (76)</span>
                      </div>
                      <div className="text-[9px] text-rose-600 font-semibold flex items-center justify-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        <span>Busy</span>
                      </div>
                    </div>
                    <Link
                      href="/farmer/consultations"
                      className="w-full py-1 rounded-full border border-slate-200 hover:bg-[#166534] hover:text-white text-[10px] font-bold text-slate-700 transition-colors block"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
    </div>
  );
}

