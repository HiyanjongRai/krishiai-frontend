"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Download,
  Filter,
  Headphones,
  MessagesSquare,
  PhoneCall,
  RefreshCw,
  Search,
  Star,
  UserRound,
  Video,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

export default function AdminConsultationsPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"ALL" | "LIVE" | "COMPLETED" | "FLAGGED">("ALL");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const consultations = [
    { id: "CNS-1048", farmer: "Ram Bahadur Thapa", expert: "Dr. Anish Sharma", domain: "Paddy Blight", type: "VIDEO", status: "LIVE", duration: "12m 45s", rating: "Pending", date: "Just now" },
    { id: "CNS-1047", farmer: "Sita Kumari Rai", expert: "Prof. Gita Karki", domain: "Tomato Wilt", type: "AUDIO", status: "COMPLETED", duration: "18m 10s", rating: "5.0 ★", date: "24 min ago" },
    { id: "CNS-1046", farmer: "Dhaniram Chaudhary", expert: "Bikash Adhikari", domain: "Maize Borer", type: "CHAT", status: "COMPLETED", duration: "09m 30s", rating: "4.8 ★", date: "1 hour ago" },
    { id: "CNS-1045", farmer: "Hari Prasad Poudel", expert: "Dr. Anish Sharma", domain: "Potato Rot", type: "VIDEO", status: "FLAGGED", duration: "25m 00s", rating: "3.2 ★", date: "3 hours ago" },
    { id: "CNS-1044", farmer: "Maya Devi Gurung", expert: "Sunita Shrestha", domain: "Citrus Canker", type: "AUDIO", status: "COMPLETED", duration: "14m 20s", rating: "5.0 ★", date: "Yesterday" },
  ];

  const filtered = consultations.filter((c) => {
    const matchesTab = activeTab === "ALL" || c.status === activeTab;
    const matchesSearch =
      c.farmer.toLowerCase().includes(search.toLowerCase()) ||
      c.expert.toLowerCase().includes(search.toLowerCase()) ||
      c.domain.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Tele-Agri Consultations"
        subtitle="Monitor live farmer-to-expert consultation channels, advisory resolution rates, and farmer satisfaction ratings."
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
              Download Audit Log
            </button>
          </div>
        }
      />

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Total Consultations</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8F5E9] text-[#2E7D32]">
              <MessagesSquare className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-3xl font-black text-[#1F2937] tracking-tight">1,480</p>
          <p className="mt-1 text-xs text-[#2E7D32] font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]" /> All channels recorded
          </p>
        </div>

        <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Live Sessions Right Now</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#DBEAFE] text-[#2563EB]">
              <Headphones className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-3xl font-black text-[#1F2937] tracking-tight">18</p>
          <p className="mt-1 text-xs text-[#2563EB] font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse" /> Active audio/video calls
          </p>
        </div>

        <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Avg Turnaround</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FEF3C7] text-[#F59E0B]">
              <Clock3 className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-3xl font-black text-[#1F2937] tracking-tight">14.2 m</p>
          <p className="mt-1 text-xs text-[#6B7280] font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" /> First expert reply in 4m
          </p>
        </div>

        <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Farmer Satisfaction</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8F5E9] text-[#2E7D32]">
              <Star className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-3xl font-black text-[#1F2937] tracking-tight">4.9 / 5.0</p>
          <p className="mt-1 text-xs text-[#2E7D32] font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]" /> 98% positive reviews
          </p>
        </div>
      </div>

      {/* Toolbar: Search + Rounded Pill Tabs */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between pt-1">
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Search by farmer, expert, or crop issue..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-full border border-[#E5E7EB] bg-white pl-9 pr-4 text-xs text-[#1F2937] placeholder:text-[#9CA3AF] outline-none transition-colors focus:border-[#2E7D32] focus:ring-2 focus:ring-[#E8F5E9] shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: "ALL", label: "All Sessions" },
            { id: "LIVE", label: "Live Now" },
            { id: "COMPLETED", label: "Completed" },
            { id: "FLAGGED", label: "Flagged for Audit" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-[#2E7D32] text-white shadow-sm"
                  : "bg-white text-[#4B5563] border border-[#E5E7EB] hover:bg-[#F8FAF8] hover:text-[#2E7D32]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Consultation Audit Table Container */}
      <div className="rounded-[24px] border border-[#E5E7EB] bg-white shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE] overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#EEF0EE] bg-[#F8FAF8]/60 px-6 py-4">
          <div>
            <h3 className="text-sm font-bold text-[#1F2937]">Consultation Sessions Feed</h3>
            <p className="text-xs text-[#6B7280] mt-0.5">Showing {filtered.length} recent sessions for administrative moderation</p>
          </div>
          <span className="rounded-full bg-white border border-[#E5E7EB] px-3 py-1 text-xs font-semibold text-[#4B5563] shadow-2xs">
            {filtered.length} sessions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#4B5563]">
            <thead className="border-b border-[#E5E7EB] bg-[#F8FAF8] text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
              <tr>
                <th className="px-5 py-3.5">Session ID</th>
                <th className="px-5 py-3.5">Farmer</th>
                <th className="px-5 py-3.5">Assigned Expert</th>
                <th className="px-5 py-3.5">Domain</th>
                <th className="px-5 py-3.5">Channel</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Duration</th>
                <th className="px-5 py-3.5">Rating</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF0EE]">
              {filtered.map((c) => (
                <tr key={c.id} className="transition-colors hover:bg-[#F8FAF8]/70">
                  <td className="px-5 py-3.5 font-mono text-[11px] font-bold text-[#1F2937]">{c.id}</td>
                  <td className="px-5 py-3.5 font-bold text-[#1F2937]">{c.farmer}</td>
                  <td className="px-5 py-3.5 font-medium text-[#2E7D32]">{c.expert}</td>
                  <td className="px-5 py-3.5 font-medium text-[#4B5563]">{c.domain}</td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#F1F5F2] border border-[#E5E7EB] px-2.5 py-0.5 text-[10px] font-bold text-[#4B5563]">
                      {c.type === "VIDEO" ? <Video className="w-3 h-3 text-[#2E7D32]" /> : c.type === "AUDIO" ? <PhoneCall className="w-3 h-3 text-[#2563EB]" /> : <MessagesSquare className="w-3 h-3 text-[#F59E0B]" />}
                      {c.type}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        c.status === "LIVE"
                          ? "bg-[#DBEAFE] text-[#2563EB] border border-[#93C5FD]"
                          : c.status === "FLAGGED"
                          ? "bg-[#FEE2E2] text-[#DC2626] border border-[#FCA5A5]"
                          : "bg-[#E8F5E9] text-[#2E7D32] border border-[#A5D6A7]"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          c.status === "LIVE" ? "bg-[#2563EB] animate-pulse" : c.status === "FLAGGED" ? "bg-[#DC2626]" : "bg-[#2E7D32]"
                        }`}
                      />
                      {c.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-medium text-[#6B7280]">{c.duration}</td>
                  <td className="px-5 py-3.5 font-bold text-[#1F2937]">{c.rating}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button className="rounded-full border border-[#E5E7EB] bg-white px-3 py-1 text-xs font-semibold text-[#2E7D32] hover:bg-[#E8F5E9] transition-colors cursor-pointer shadow-2xs">
                      Audit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
