"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  MessageSquare,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowRight,
  Star,
  Sprout,
} from "lucide-react";
import { ConsultationChatModal } from "@/components/farmer/ConsultationChatModal";

type ConsultationStatus = "ACTIVE" | "SCHEDULED" | "COMPLETED";

interface FarmerConsultation {
  id: string;
  expertName: string;
  specialization: string;
  crop: string;
  issue: string;
  date: string;
  time: string;
  status: ConsultationStatus;
  notes?: string;
}

export default function FarmerConsultationsPage() {
  const [filter, setFilter] = useState<"ALL" | ConsultationStatus>("ALL");
  const [activeChatConsultation, setActiveChatConsultation] = useState<FarmerConsultation | null>(null);

  const consultations: FarmerConsultation[] = [
    {
      id: "FC-101",
      expertName: "Dr. Anil Sharma",
      specialization: "Senior Plant Pathologist",
      crop: "Tomato",
      issue: "Rapid spreading of brown lesions on early-season foliage",
      date: "Tomorrow",
      time: "2:30 PM",
      status: "SCHEDULED",
      notes: "Field photos uploaded. Agronomist reviewing fungicide plan.",
    },
    {
      id: "FC-102",
      expertName: "Dr. Sita Karki",
      specialization: "Soil & Nutrient Specialist",
      crop: "Potato",
      issue: "Low tuber formation despite recommended urea dosage",
      date: "Today, 11:00 AM",
      time: "Active Chat",
      status: "ACTIVE",
      notes: "Soil report shared. Recommended foliar potassium spray.",
    },
    {
      id: "FC-103",
      expertName: "Er. Dinesh Rai",
      specialization: "Irrigation & Horticulture",
      crop: "Rice",
      issue: "Drip line installation advice for terraced paddy",
      date: "12 Jun 2025",
      time: "Completed",
      status: "COMPLETED",
      notes: "Terrace contour map validated. System operational.",
    },
  ];

  const filtered = consultations.filter((c) => filter === "ALL" || c.status === filter);

  const statusConfig: Record<
    ConsultationStatus,
    { label: string; cls: string; icon: React.ReactNode }
  > = {
    ACTIVE: {
      label: "Active Inquiry",
      cls: "bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]",
      icon: <MessageSquare className="w-3 h-3" />,
    },
    SCHEDULED: {
      label: "Scheduled",
      cls: "bg-[#DBEAFE] text-[#2563EB] border-[#93C5FD]",
      icon: <Calendar className="w-3 h-3" />,
    },
    COMPLETED: {
      label: "Resolved",
      cls: "bg-[#F1F5F2] text-[#4B5563] border-[#E5E7EB]",
      icon: <CheckCircle2 className="w-3 h-3" />,
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E7EB]/80">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#2E7D32]">
            Specialist Support
          </p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-[#1F2937]">
            Expert Consultations
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-[#6B7280] font-medium">
            Connect directly with verified agronomists, soil specialists, and crop doctors.
          </p>
        </div>

        <Link
          href="/experts"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#2E7D32] hover:bg-[#256B2A] text-white text-xs font-bold rounded-full shadow-xs transition-all active:scale-95 cursor-pointer min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span>Book New Specialist</span>
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: "Total Queries", val: consultations.length, icon: Users, color: "text-[#1F2937] bg-[#F1F5F2]" },
          { label: "Active Inquiries", val: consultations.filter((c) => c.status === "ACTIVE").length, icon: MessageSquare, color: "text-[#2E7D32] bg-[#E8F5E9]" },
          { label: "Scheduled Calls", val: consultations.filter((c) => c.status === "SCHEDULED").length, icon: Calendar, color: "text-[#2563EB] bg-[#DBEAFE]" },
          { label: "Resolved Cases", val: consultations.filter((c) => c.status === "COMPLETED").length, icon: CheckCircle2, color: "text-[#2E7D32] bg-[#E8F5E9]" },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#6B7280]">{item.label}</span>
                <div className={`w-7 h-7 rounded-lg ${item.color} flex items-center justify-center shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-[#1F2937] mt-1">{item.val}</p>
            </div>
          );
        })}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {(["ALL", "ACTIVE", "SCHEDULED", "COMPLETED"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap min-h-[36px] ${
              filter === tab
                ? "bg-[#2E7D32] text-white shadow-xs"
                : "bg-white border border-[#E5E7EB] text-[#4B5563] hover:bg-[#F8FAF8]"
            }`}
          >
            {tab === "ALL" ? "All Consultations" : tab === "ACTIVE" ? "Active Now" : tab === "SCHEDULED" ? "Upcoming" : "Resolved"}
          </button>
        ))}
      </div>

      {/* Consultations List */}
      <div className="space-y-3.5">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#D1D5DB] bg-white p-12 text-center">
            <Users className="w-10 h-10 text-[#6B7280] mx-auto mb-2" />
            <p className="text-sm font-bold text-[#4B5563]">No consultations in this category</p>
            <p className="text-xs text-[#9CA3AF] mt-0.5">Explore certified agricultural experts to get personalized crop guidance.</p>
            <Link
              href="/experts"
              className="inline-flex items-center gap-1.5 px-4 py-2 mt-4 bg-[#2E7D32] text-white text-xs font-bold rounded-full shadow-xs"
            >
              <span>Explore Agronomists</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          filtered.map((item) => {
            const status = statusConfig[item.status];
            return (
              <div
                key={item.id}
                className="rounded-2xl sm:rounded-3xl border border-[#E5E7EB] bg-white p-4 sm:p-5 shadow-xs hover:border-[#C8E6C9] transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center font-bold text-sm shrink-0 border border-[#C8E6C9]">
                      {item.expertName.charAt(3) || "E"}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <h3 className="font-bold text-[#1F2937] text-sm sm:text-base truncate">
                          {item.expertName}
                        </h3>
                        <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md border ${status.cls}`}>
                          {status.icon}
                          {status.label}
                        </span>
                      </div>
                      <p className="text-xs text-[#6B7280] font-medium truncate">
                        {item.specialization}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#6B7280] font-medium self-start sm:self-auto">
                    <Calendar className="w-3.5 h-3.5 text-[#9CA3AF]" />
                    <span>{item.date} · {item.time}</span>
                  </div>
                </div>

                <div className="mt-3 p-3 rounded-xl bg-[#F8FAF8] border border-[#EEF0EE] text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-[#1F2937] font-bold">
                    <Sprout className="w-3.5 h-3.5 text-[#2E7D32]" />
                    <span>Crop: {item.crop}</span>
                  </div>
                  <p className="text-[#4B5563] leading-relaxed font-medium">
                    <strong className="text-[#4B5563]">Issue:</strong> {item.issue}
                  </p>
                  {item.notes && (
                    <p className="text-[#1B5E20] text-[11px] font-medium pt-0.5">
                      <strong>Advisor Update:</strong> {item.notes}
                    </p>
                  )}
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#EEF0EE] flex items-center justify-between gap-2 flex-wrap">
                  <span className="font-mono text-[10px] text-[#9CA3AF]">Ref: #{item.id}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveChatConsultation(item)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E8F5E9] hover:bg-[#E8F5E9] text-[#2E7D32] text-xs font-bold transition-colors min-h-[36px] cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat with Expert</span>
                    </button>
                    <Link
                      href="/experts"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F1F5F2] hover:bg-[#E5E7EB] text-[#4B5563] text-xs font-bold transition-colors min-h-[36px]"
                    >
                      <span>Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {activeChatConsultation && (
        <ConsultationChatModal
          isOpen={Boolean(activeChatConsultation)}
          onClose={() => setActiveChatConsultation(null)}
          consultationId={activeChatConsultation.id}
          expertName={activeChatConsultation.expertName}
          specialization={activeChatConsultation.specialization}
          cropName={activeChatConsultation.crop}
        />
      )}
    </div>
  );
}
