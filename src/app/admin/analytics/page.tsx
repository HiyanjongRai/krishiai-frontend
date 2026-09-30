"use client";

import React, { useState } from "react";
import {
  Activity,
  CheckCircle2,
  Download,
  RefreshCw,
  Sparkles,
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
          <p className="mt-3 text-3xl font-black text-[#9CA3AF] tracking-tight">&mdash;</p>
          <p className="mt-1 text-xs text-[#9CA3AF] font-medium">Total leaf scans processed</p>
        </div>

        <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Model Accuracy</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8F5E9] text-[#2E7D32]">
              <CheckCircle2 className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-3xl font-black text-[#9CA3AF] tracking-tight">&mdash;</p>
          <p className="mt-1 text-xs text-[#9CA3AF] font-medium">ResNet50 validation score</p>
        </div>

        <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Inference Latency</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FEF3C7] text-[#F59E0B]">
              <Zap className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-3xl font-black text-[#9CA3AF] tracking-tight">&mdash;</p>
          <p className="mt-1 text-xs text-[#9CA3AF] font-medium">Avg GPU inference</p>
        </div>

        <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Active Sessions</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#DBEAFE] text-[#2563EB]">
              <Activity className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-3xl font-black text-[#9CA3AF] tracking-tight">&mdash;</p>
          <p className="mt-1 text-xs text-[#9CA3AF] font-medium">Live connected farmers</p>
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

          {/* Placeholder — real diagnostic activity trend data will come from the analytics API */}
          <div className="pt-2 flex items-center justify-center h-48">
            <p className="text-sm text-[#9CA3AF] font-medium">No diagnostic activity data available yet</p>
          </div>
        </div>

        {/* Top Diagnosed Crops Breakdown */}
        <div className="lg:col-span-4 rounded-[24px] border border-[#E5E7EB] bg-white p-6 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE] space-y-4">
          <div className="pb-3.5 border-b border-[#EEF0EE]">
            <h3 className="text-sm font-bold text-[#1F2937]">Top Crops Diagnosed</h3>
            <p className="text-xs text-[#6B7280] mt-0.5">High volume diagnostic queries</p>
          </div>

          {/* Placeholder — real top crops data will come from the analytics API */}
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-[#9CA3AF] font-medium">No crop query data available yet</p>
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
              {/* TODO: Replace with real API call to /v1/admin/analytics/diagnostics */}
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center">
                  <p className="text-sm font-semibold text-[#9CA3AF]">No diagnostic telemetry available yet</p>
                  <p className="text-xs text-[#9CA3AF] mt-1">Live inference data will appear here once the AI engine begins processing.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
