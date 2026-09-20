"use client";

import React, { useState } from "react";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  Cpu,
  Download,
  Filter,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d" | "all">("7d");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Platform & AI Analytics"
        subtitle="Real-time telemetry, leaf diagnostic throughput, model accuracy metrics, and user engagement trends."
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold text-[#4B5563] shadow-xs hover:bg-[#F1F5F2] hover:text-[#2E7D32] transition-colors cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-[#2E7D32]" : ""}`} />
              Refresh
            </button>
            <button className="inline-flex items-center gap-2 rounded-full bg-[#2E7D32] hover:bg-[#256B2A] text-white px-4 py-2 text-xs font-semibold shadow-xs transition-colors cursor-pointer">
              <Download className="h-3.5 w-3.5" />
              Export CSV Report
            </button>
          </div>
        }
      />

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Total Diagnoses</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8F5E9] text-[#2E7D32]">
              <Sparkles className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-3xl font-black text-[#1F2937] tracking-tight">18,420</p>
          <p className="mt-1 text-xs text-[#2E7D32] font-medium flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5" /> +14.8% vs last period
          </p>
        </div>

        <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Model Accuracy</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8F5E9] text-[#2E7D32]">
              <CheckCircle2 className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-3xl font-black text-[#1F2937] tracking-tight">98.6%</p>
          <p className="mt-1 text-xs text-[#2E7D32] font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]" /> ResNet50 validation score
          </p>
        </div>

        <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Inference Latency</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FEF3C7] text-[#F59E0B]">
              <Zap className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-3xl font-black text-[#1F2937] tracking-tight">42 ms</p>
          <p className="mt-1 text-xs text-[#6B7280] font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" /> Avg GPU inference
          </p>
        </div>

        <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Active Sessions</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#DBEAFE] text-[#2563EB]">
              <Activity className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-3xl font-black text-[#1F2937] tracking-tight">1,248</p>
          <p className="mt-1 text-xs text-[#2563EB] font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" /> Live connected farmers
          </p>
        </div>
      </div>

      {/* Filter Tabs Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: "24h", label: "Past 24 Hours" },
            { id: "7d", label: "Past 7 Days" },
            { id: "30d", label: "Past 30 Days" },
            { id: "all", label: "All Time" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTimeRange(item.id as typeof timeRange)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                timeRange === item.id
                  ? "bg-[#2E7D32] text-white shadow-sm"
                  : "bg-white text-[#4B5563] border border-[#E5E7EB] hover:bg-[#F8FAF8] hover:text-[#2E7D32]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <span className="text-xs text-[#6B7280] font-medium">
          Telemetry stream auto-refreshed every 60 seconds
        </span>
      </div>

      {/* Middle Grid: Diagnostic Throughput Chart & Top Disease Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 rounded-[24px] border border-[#E5E7EB] bg-white p-6 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE] space-y-4">
          <div className="flex items-center justify-between pb-3.5 border-b border-[#EEF0EE]">
            <div>
              <h3 className="text-sm font-bold text-[#1F2937]">Diagnostic Activity Trend</h3>
              <p className="text-xs text-[#6B7280] mt-0.5">Leaf scans analyzed per day across all registered farmer zones</p>
            </div>
            <span className="rounded-full bg-[#E8F5E9] text-[#2E7D32] border border-[#A5D6A7] px-3 py-1 text-[11px] font-bold">
              +28% High Season
            </span>
          </div>

          {/* Simple Visual Bar Chart */}
          <div className="pt-2">
            <div className="flex items-end justify-between gap-3 h-48 px-2">
              {[
                { day: "Mon", count: 2100, height: "65%" },
                { day: "Tue", count: 2450, height: "76%" },
                { day: "Wed", count: 2890, height: "90%" },
                { day: "Thu", count: 3200, height: "100%" },
                { day: "Fri", count: 2600, height: "81%" },
                { day: "Sat", count: 1980, height: "62%" },
                { day: "Sun", count: 1850, height: "58%" },
              ].map((bar) => (
                <div key={bar.day} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-bold text-[#6B7280] opacity-0 group-hover:opacity-100 transition-opacity">
                    {bar.count}
                  </span>
                  <div className="w-full bg-[#F1F5F2] rounded-t-xl h-full flex items-end overflow-hidden">
                    <div
                      style={{ height: bar.height }}
                      className="w-full bg-gradient-to-t from-[#2E7D32] to-[#43A047] rounded-t-xl transition-all duration-500 group-hover:from-[#256B2A] group-hover:to-[#2E7D32]"
                    />
                  </div>
                  <span className="text-xs font-semibold text-[#4B5563]">{bar.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Diagnosed Crops Breakdown */}
        <div className="lg:col-span-4 rounded-[24px] border border-[#E5E7EB] bg-white p-6 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE] space-y-4">
          <div className="pb-3.5 border-b border-[#EEF0EE]">
            <h3 className="text-sm font-bold text-[#1F2937]">Top Crops Diagnosed</h3>
            <p className="text-xs text-[#6B7280] mt-0.5">High volume diagnostic queries</p>
          </div>

          <div className="space-y-3.5">
            {[
              { name: "Paddy / Rice", count: "6,480 queries", pct: 45, color: "bg-[#2E7D32]" },
              { name: "Maize (Corn)", count: "4,120 queries", pct: 28, color: "bg-[#43A047]" },
              { name: "Tomato", count: "2,840 queries", pct: 18, color: "bg-[#81C784]" },
              { name: "Wheat", count: "1,420 queries", pct: 9, color: "bg-[#C8E6C9]" },
            ].map((crop) => (
              <div key={crop.name} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-[#1F2937]">{crop.name}</span>
                  <span className="text-[#6B7280]">{crop.count}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#F1F5F2] overflow-hidden">
                  <div style={{ width: `${crop.pct}%` }} className={`h-full rounded-full ${crop.color}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Model Diagnostic Telemetry Table */}
      <div className="rounded-[24px] border border-[#E5E7EB] bg-white shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE] overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#EEF0EE] bg-[#F8FAF8]/60 px-6 py-4">
          <div>
            <h3 className="text-sm font-bold text-[#1F2937]">Live AI Detection Stream</h3>
            <p className="text-xs text-[#6B7280] mt-0.5">Recent diagnostic inferences processed by KrishiAI Vision Engine</p>
          </div>
          <span className="rounded-full bg-[#E8F5E9] text-[#2E7D32] border border-[#A5D6A7] px-3 py-1 text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#2E7D32] animate-pulse" /> Live Telemetry
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#4B5563]">
            <thead className="border-b border-[#E5E7EB] bg-[#F8FAF8] text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
              <tr>
                <th className="px-5 py-3.5">Crop &amp; Disease Condition</th>
                <th className="px-5 py-3.5">Confidence</th>
                <th className="px-5 py-3.5">Inference Model</th>
                <th className="px-5 py-3.5">Latency</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF0EE]">
              {[
                { crop: "Paddy", disease: "Bacterial Leaf Blight", conf: "99.2%", model: "ResNet50-V2", lat: "38ms", status: "VERIFIED", time: "Just now" },
                { crop: "Tomato", disease: "Early Blight", conf: "97.8%", model: "YOLOv8-Crop", lat: "44ms", status: "VERIFIED", time: "2 min ago" },
                { crop: "Maize", disease: "Fall Armyworm Damage", conf: "96.4%", model: "ResNet50-V2", lat: "41ms", status: "VERIFIED", time: "5 min ago" },
                { crop: "Wheat", disease: "Yellow Rust", conf: "98.7%", model: "ResNet50-V2", lat: "39ms", status: "VERIFIED", time: "11 min ago" },
                { crop: "Paddy", disease: "Brown Spot", conf: "95.1%", model: "YOLOv8-Crop", lat: "45ms", status: "VERIFIED", time: "18 min ago" },
              ].map((row, idx) => (
                <tr key={idx} className="transition-colors hover:bg-[#F8FAF8]/70">
                  <td className="px-5 py-3.5">
                    <p className="font-bold text-[#1F2937]">{row.disease}</p>
                    <p className="text-[11px] text-[#6B7280] font-medium">{row.crop}</p>
                  </td>
                  <td className="px-5 py-3.5 font-bold text-[#2E7D32]">{row.conf}</td>
                  <td className="px-5 py-3.5 font-mono text-[11px] text-[#4B5563]">{row.model}</td>
                  <td className="px-5 py-3.5 text-[#6B7280] font-medium">{row.lat}</td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] border border-[#A5D6A7] px-2.5 py-0.5 text-[10px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]" />
                      {row.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right text-[11px] text-[#9CA3AF] font-medium">{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
