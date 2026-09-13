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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Farmer Support</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Assigned Consultations</h1>
        <p className="mt-0.5 text-xs text-slate-500 font-medium">Review, diagnose, and advise on agricultural issues submitted by farmers.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Queries", value: counts.ALL, icon: <MessageSquare className="w-4 h-4" />, cls: "bg-emerald-50 text-emerald-700 border-emerald-100" },
          { label: "Pending Response", value: counts.PENDING, icon: <Clock className="w-4 h-4" />, cls: "bg-amber-50 text-amber-700 border-amber-100" },
          { label: "Active Consultations", value: counts.ACTIVE, icon: <CheckCircle2 className="w-4 h-4" />, cls: "bg-blue-50 text-blue-700 border-blue-100" },
          { label: "Resolved Cases", value: counts.RESOLVED, icon: <CheckCircle2 className="w-4 h-4" />, cls: "bg-slate-100 text-slate-700 border-slate-200" },
        ].map(({ label, value, icon, cls }) => (
          <div key={label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">{label}</span>
              <div className={`w-7 h-7 rounded-lg ${cls} flex items-center justify-center border shadow-2xs`}>{icon}</div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 mt-2">{value}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center justify-between gap-3 overflow-x-auto no-scrollbar pb-1">
        <div className="inline-flex items-center rounded-xl bg-slate-100 p-1 text-xs font-medium text-slate-600 gap-1 flex-nowrap">
          {(["ALL", "PENDING", "ACTIVE", "RESOLVED"] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap min-h-[36px] ${
                filter === f
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
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
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-xs">
            <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2.5" />
            <p className="text-sm font-bold text-slate-800">No consultations found</p>
            <p className="text-xs text-slate-500 mt-0.5">Farmer queries will appear here once assigned to you.</p>
          </div>
        )}

        {filtered.map((consultation) => {
          const statusCfg = STATUS_CONFIG[consultation.status];
          const priorityCfg = PRIORITY_CONFIG[consultation.priority];

          return (
            <div
              key={consultation.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs hover:border-slate-300 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-3.5">
                {/* Avatar */}
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs">
                  {consultation.farmerName.charAt(0)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-900">{consultation.farmerName}</span>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md border ${statusCfg.cls}`}>
                      {statusCfg.icon}{statusCfg.label}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${priorityCfg.cls}`}>
                      {priorityCfg.label}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-slate-900 mb-0.5">{consultation.cropIssue}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-2 line-clamp-2">{consultation.description}</p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-slate-600">{consultation.crop}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{consultation.date}</span>
                    </span>
                    <span className="font-mono text-slate-400">#{consultation.id}</span>
                  </div>
                </div>

                {/* CTA */}
                <div className="sm:ml-auto w-full sm:w-auto pt-2 sm:pt-0">
                  <button className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs cursor-pointer min-h-[40px]">
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
