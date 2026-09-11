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
  PENDING: { label: "Pending", cls: "bg-amber-50 text-amber-700 border-amber-200", icon: <Clock className="w-3 h-3" /> },
  ACTIVE: { label: "Active", cls: "bg-[#DDF4EA] text-[#0F9F68] border-[#BCE9D5]", icon: <MessageSquare className="w-3 h-3" /> },
  RESOLVED: { label: "Resolved", cls: "bg-blue-50 text-blue-700 border-blue-200", icon: <CheckCircle2 className="w-3 h-3" /> },
  CANCELLED: { label: "Cancelled", cls: "bg-[#F4F4F6] text-gray-400 border-[rgba(234,234,236,0.85)]", icon: <XCircle className="w-3 h-3" /> },
};

const PRIORITY_CONFIG: Record<string, { label: string; cls: string }> = {
  HIGH: { label: "High Priority", cls: "bg-rose-50 text-rose-700 border-rose-200" },
  MEDIUM: { label: "Medium", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  LOW: { label: "Low", cls: "bg-[#F4F4F6] text-gray-500 border-[rgba(234,234,236,0.85)]" },
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
    <div className="space-y-5">
      {/* Header */}
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#0F9F68]">Farmer Support</p>
        <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-[#171717]">Assigned Consultations</h1>
        <p className="mt-1 text-sm text-gray-400">Review and respond to farmer queries assigned to you.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total", value: counts.ALL, icon: <MessageSquare className="w-4 h-4" />, cls: "bg-[#DDF4EA] text-[#0F9F68]" },
          { label: "Pending", value: counts.PENDING, icon: <Clock className="w-4 h-4" />, cls: "bg-amber-50 text-amber-600" },
          { label: "Active", value: counts.ACTIVE, icon: <CheckCircle2 className="w-4 h-4" />, cls: "bg-blue-50 text-blue-600" },
          { label: "Resolved", value: counts.RESOLVED, icon: <CheckCircle2 className="w-4 h-4" />, cls: "bg-[#F4F4F6] text-gray-500" },
        ].map(({ label, value, icon, cls }) => (
          <div key={label} className="rounded-[24px] border border-[rgba(234,234,236,0.85)] bg-white p-4 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)]">
            <div className={`w-8 h-8 rounded-[12px] ${cls} flex items-center justify-center mb-2`}>{icon}</div>
            <div className="text-2xl font-black text-[#171717]">{value}</div>
            <div className="text-[11px] font-bold text-gray-400 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-3.5 h-3.5 text-gray-400" />
        {(["ALL", "PENDING", "ACTIVE", "RESOLVED"] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold border transition-all cursor-pointer ${
              filter === f
                ? "bg-[#0F9F68] text-white border-[#0F9F68] shadow-[0_4px_12px_rgba(15,159,104,0.2)]"
                : "bg-white text-gray-500 border-[rgba(234,234,236,0.85)] hover:bg-[#F4F4F6]"
            }`}
          >
            {f === "ALL" ? `All (${counts.ALL})` : f === "PENDING" ? `Pending (${counts.PENDING})` : f === "ACTIVE" ? `Active (${counts.ACTIVE})` : `Resolved (${counts.RESOLVED})`}
          </button>
        ))}
      </div>

      {/* Consultation list */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="rounded-[28px] border border-[rgba(234,234,236,0.85)] bg-white p-12 text-center shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)]">
            <MessageSquare className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-sm font-bold text-gray-400">No consultations found</p>
            <p className="text-xs text-gray-400 mt-1">Farmer queries will appear here once assigned to you.</p>
          </div>
        )}

        {filtered.map((consultation) => {
          const statusCfg = STATUS_CONFIG[consultation.status];
          const priorityCfg = PRIORITY_CONFIG[consultation.priority];

          return (
            <div
              key={consultation.id}
              className="rounded-[24px] border border-[rgba(234,234,236,0.85)] bg-white p-5 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04),0_2px_6px_-1px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] transition-all group"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-[#DDF4EA] text-[#0F9F68] flex items-center justify-center font-black text-sm shrink-0">
                  {consultation.farmerName.charAt(0)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-[#171717]">{consultation.farmerName}</span>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusCfg.cls}`}>
                      {statusCfg.icon}{statusCfg.label}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${priorityCfg.cls}`}>
                      {priorityCfg.label}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#171717] mb-1">{consultation.cropIssue}</h3>
                  <p className="text-[11px] text-gray-400 leading-relaxed mb-2 line-clamp-2">{consultation.description}</p>

                  <div className="flex flex-wrap items-center gap-3 text-[10px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <Leaf className="w-3 h-3 text-[#0F9F68]" />
                      <span>{consultation.crop}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{consultation.date}</span>
                    </span>
                    <span className="font-mono text-gray-300">#{consultation.id}</span>
                  </div>
                </div>

                {/* CTA */}
                <div className="sm:ml-auto">
                  <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0F9F68] hover:bg-[#0D8A5A] text-white text-[11px] font-bold rounded-full transition-all shadow-[0_4px_12px_rgba(15,159,104,0.2)] cursor-pointer group-hover:shadow-[0_4px_16px_rgba(15,159,104,0.3)]">
                    <span>{consultation.status === "PENDING" ? "Respond" : "View"}</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
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
