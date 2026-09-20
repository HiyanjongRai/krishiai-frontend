"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  Clock,
  CheckCircle2,
  XCircle,
  User,
  Leaf,
  Calendar,
  ArrowRight,
  Filter,
} from "lucide-react";

type ConsultationStatus = "PENDING" | "ACTIVE" | "RESOLVED" | "CANCELLED";

interface Consultation {
  id: string;
  farmerName: string;
  cropIssue: string;
  crop: string;
  date: string;
  status: ConsultationStatus;
  priority: "HIGH" | "MEDIUM" | "LOW";
  description: string;
}

const MOCK_CONSULTATIONS: Consultation[] = [
  {
    id: "CON-001",
    farmerName: "Ram Bahadur Thapa",
    cropIssue: "Tomato blight spreading rapidly in field",
    crop: "Tomato",
    date: "Today, 9:30 AM",
    status: "ACTIVE",
    priority: "HIGH",
    description: "Noticed yellow/brown spots on leaves spreading from one side to entire plot within 2 days.",
  },
  {
    id: "CON-002",
    farmerName: "Sita Devi Gurung",
    cropIssue: "Poor germination rate despite adequate watering",
    crop: "Paddy",
    date: "Today, 7:14 AM",
    status: "PENDING",
    priority: "MEDIUM",
    description: "Planted new variety. Only 40% germination after 10 days. Soil tested normal.",
  },
  {
    id: "CON-003",
    farmerName: "Krishna Prasad Sharma",
    cropIssue: "Aphid infestation on cauliflower heads",
    crop: "Cauliflower",
    date: "Yesterday",
    status: "RESOLVED",
    priority: "LOW",
    description: "Applied neem oil spray as advised. Significant improvement after 3 days.",
  },
  {
    id: "CON-004",
    farmerName: "Dhan Bahadur Rai",
    cropIssue: "Yellowing of lower potato leaves",
    crop: "Potato",
    date: "2 days ago",
    status: "PENDING",
    priority: "HIGH",
    description: "Lower leaves turning yellow and wilting. Watering schedule unchanged.",
  },
];

const STATUS_CONFIG: Record<ConsultationStatus, { label: string; cls: string; icon: React.ReactNode }> = {
  PENDING: { label: "Pending", cls: "bg-[#FEF3C7] text-[#F59E0B] border-[#FCD34D]", icon: <Clock className="w-3 h-3" /> },
  ACTIVE: { label: "Active", cls: "bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]", icon: <MessageSquare className="w-3 h-3" /> },
  RESOLVED: { label: "Resolved", cls: "bg-[#DBEAFE] text-[#2563EB] border-[#93C5FD]", icon: <CheckCircle2 className="w-3 h-3" /> },
  CANCELLED: { label: "Cancelled", cls: "bg-[#F1F5F2] text-[#9CA3AF] border-[#E5E7EB]", icon: <XCircle className="w-3 h-3" /> },
};

const PRIORITY_CONFIG: Record<string, { label: string; cls: string }> = {
  HIGH: { label: "High Priority", cls: "bg-[#FEE2E2] text-[#DC2626] border-[#FCA5A5]" },
  MEDIUM: { label: "Medium", cls: "bg-[#FEF3C7] text-[#F59E0B] border-[#FCD34D]" },
  LOW: { label: "Low", cls: "bg-[#F1F5F2] text-[#6B7280] border-[#E5E7EB]" },
};

type FilterType = "ALL" | ConsultationStatus;

export default function ExpertConsultationsPage() {
  const [filter, setFilter] = useState<FilterType>("ALL");

  const filtered = MOCK_CONSULTATIONS.filter((c) => filter === "ALL" || c.status === filter);

  const counts = {
    ALL: MOCK_CONSULTATIONS.length,
    PENDING: MOCK_CONSULTATIONS.filter((c) => c.status === "PENDING").length,
    ACTIVE: MOCK_CONSULTATIONS.filter((c) => c.status === "ACTIVE").length,
    RESOLVED: MOCK_CONSULTATIONS.filter((c) => c.status === "RESOLVED").length,
  };

  return (
    <div className="space-y-6">
      {/* ─── HEADER ROW (Farmer Dashboard Style) ───────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#1F2937] flex items-center gap-2">
            <span>Farmer</span>
            <span className="text-[#2E7D32]">Consultations</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
            Review, diagnose, and advise on agricultural issues submitted by farmers.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap w-full sm:w-auto">
          {/* Filter Pill */}
          <div className="flex items-center justify-between sm:justify-start gap-2 bg-white border border-[#E5E7EB] rounded-full px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs font-semibold text-[#4B5563] shadow-[0_4px_20px_-2px_#EEF0EE] cursor-pointer hover:border-[#D1D5DB] transition-colors flex-1 sm:flex-initial">
            <div className="flex items-center gap-2 min-w-0">
              <Filter className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" />
              <span className="truncate">All Consultations</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Queries", value: counts.ALL, icon: <MessageSquare className="w-4 h-4" />, cls: "bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]" },
          { label: "Pending Response", value: counts.PENDING, icon: <Clock className="w-4 h-4" />, cls: "bg-[#FEF3C7] text-[#F59E0B] border-[#FCD34D]" },
          { label: "Active Consultations", value: counts.ACTIVE, icon: <CheckCircle2 className="w-4 h-4" />, cls: "bg-[#DBEAFE] text-[#2563EB] border-[#93C5FD]" },
          { label: "Resolved Cases", value: counts.RESOLVED, icon: <CheckCircle2 className="w-4 h-4" />, cls: "bg-[#F1F5F2] text-[#4B5563] border-[#E5E7EB]" },
        ].map(({ label, value, icon, cls }) => (
          <div key={label} className="rounded-[24px] border border-[#E5E7EB] bg-white p-4 sm:p-5 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#6B7280]">{label}</span>
              <div className={`w-7 h-7 rounded-lg ${cls} flex items-center justify-center border shadow-2xs`}>{icon}</div>
            </div>
            <div className="text-2xl font-black tracking-tight text-[#1F2937] mt-2">{value}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center justify-between gap-3 overflow-x-auto no-scrollbar pb-1">
        <div className="inline-flex items-center rounded-xl bg-[#F1F5F2] p-1 text-xs font-medium text-[#4B5563] gap-1 flex-nowrap">
          {(["ALL", "PENDING", "ACTIVE", "RESOLVED"] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap min-h-[36px] ${
                filter === f
                  ? "bg-white text-[#1F2937] shadow-xs"
                  : "text-[#4B5563] hover:text-[#1F2937]"
              }`}
            >
              {f === "ALL" ? `All (${counts.ALL})` : f === "PENDING" ? `Pending (${counts.PENDING})` : f === "ACTIVE" ? `Active (${counts.ACTIVE})` : `Resolved (${counts.RESOLVED})`}
            </button>
          ))}
        </div>
      </div>

      {/* Consultation list */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-12 text-center shadow-xs">
            <MessageSquare className="w-8 h-8 text-[#9CA3AF] mx-auto mb-2.5" />
            <p className="text-sm font-bold text-[#1F2937]">No consultations found</p>
            <p className="text-xs text-[#6B7280] mt-0.5">Farmer queries will appear here once assigned to you.</p>
          </div>
        )}

        {filtered.map((consultation) => {
          const statusCfg = STATUS_CONFIG[consultation.status];
          const priorityCfg = PRIORITY_CONFIG[consultation.priority];

          return (
            <div
              key={consultation.id}
              className="rounded-[24px] border border-[#E5E7EB] bg-white p-4 sm:p-5 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE] hover:border-[#C8E6C9] transition-all duration-200 hover:shadow-md"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-3.5">
                {/* Avatar */}
                <div className="w-9 h-9 rounded-lg bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9] flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs">
                  {consultation.farmerName.charAt(0)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-[#1F2937]">{consultation.farmerName}</span>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md border ${statusCfg.cls}`}>
                      {statusCfg.icon}{statusCfg.label}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${priorityCfg.cls}`}>
                      {priorityCfg.label}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-[#1F2937] mb-0.5">{consultation.cropIssue}</h3>
                  <p className="text-xs text-[#6B7280] leading-relaxed mb-2 line-clamp-2">{consultation.description}</p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#9CA3AF] font-medium">
                    <span className="flex items-center gap-1">
                      <Leaf className="w-3.5 h-3.5 text-[#2E7D32]" />
                      <span className="text-[#4B5563]">{consultation.crop}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{consultation.date}</span>
                    </span>
                    <span className="font-mono text-[#9CA3AF]">#{consultation.id}</span>
                  </div>
                </div>

                {/* CTA */}
                <div className="sm:ml-auto w-full sm:w-auto pt-2 sm:pt-0">
                  <button className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-semibold rounded-lg transition-colors shadow-xs cursor-pointer min-h-[40px]">
                    <span>{consultation.status === "PENDING" ? "Respond to Farmer" : "View Consultation"}</span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
