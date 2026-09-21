"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Clock,
  CheckCircle2,
  XCircle,
  Leaf,
  Calendar,
  ArrowRight,
  Filter,
  Loader2,
} from "lucide-react";
import { consultationService } from "@/services/messaging";
import { UserAvatar } from "@/components/ui/avatar";
import type { ConsultationDetailDto } from "@/types/messaging";

type FilterType = "ALL" | "PENDING" | "ACTIVE" | "RESOLVED";

export default function ExpertConsultationsPage() {
  const [consultations, setConsultations] = useState<ConsultationDetailDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("ALL");

  const loadConsultations = async () => {
    try {
      setIsLoading(true);
      const data = await consultationService.listConsultations();
      setConsultations(data);
    } catch (err) {
      console.error("Failed to load consultations", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConsultations();
  }, []);

  const counts = {
    ALL: consultations.length,
    PENDING: consultations.filter(
      (c) => c.status === "REQUESTED" || c.status === "PENDING" || c.status === "PAYMENT_PENDING"
    ).length,
    ACTIVE: consultations.filter(
      (c) => c.status === "ACCEPTED" || c.status === "ACTIVE"
    ).length,
    RESOLVED: consultations.filter((c) => c.status === "COMPLETED" || c.status === "EXPIRED").length,
  };

  const filtered = consultations.filter((c) => {
    if (filter === "ALL") return true;
    if (filter === "PENDING") return c.status === "REQUESTED" || c.status === "PENDING" || c.status === "PAYMENT_PENDING";
    if (filter === "ACTIVE") return c.status === "ACCEPTED" || c.status === "ACTIVE";
    if (filter === "RESOLVED") return c.status === "COMPLETED" || c.status === "EXPIRED";
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACCEPTED":
      case "ACTIVE":
        return {
          label: "Active Session",
          cls: "bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]",
          icon: <MessageSquare className="w-3 h-3" />,
        };
      case "PAYMENT_PENDING":
        return {
          label: "Awaiting Farmer Payment",
          cls: "bg-amber-100 text-amber-800 border-amber-300",
          icon: <Clock className="w-3 h-3 animate-pulse" />,
        };
      case "REQUESTED":
      case "PENDING":
        return {
          label: "Pending Request",
          cls: "bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]",
          icon: <Clock className="w-3 h-3 animate-pulse" />,
        };
      case "COMPLETED":
        return {
          label: "Resolved",
          cls: "bg-[#DBEAFE] text-[#2563EB] border-[#93C5FD]",
          icon: <CheckCircle2 className="w-3 h-3" />,
        };
      default:
        return {
          label: status,
          cls: "bg-[#F1F5F2] text-[#9CA3AF] border-[#E5E7EB]",
          icon: <XCircle className="w-3 h-3" />,
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* ─── Header ──────────────────────────────────────────────────────── */}
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
      </div>

      {/* ─── Stats Row ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Total Inquiries",
            value: counts.ALL,
            icon: <MessageSquare className="w-4 h-4" />,
            cls: "bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]",
          },
          {
            label: "Pending Response",
            value: counts.PENDING,
            icon: <Clock className="w-4 h-4" />,
            cls: "bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]",
          },
          {
            label: "Active Consultations",
            value: counts.ACTIVE,
            icon: <CheckCircle2 className="w-4 h-4" />,
            cls: "bg-[#DBEAFE] text-[#2563EB] border-[#93C5FD]",
          },
          {
            label: "Resolved Cases",
            value: counts.RESOLVED,
            icon: <CheckCircle2 className="w-4 h-4" />,
            cls: "bg-[#F1F5F2] text-[#4B5563] border-[#E5E7EB]",
          },
        ].map(({ label, value, icon, cls }) => (
          <div
            key={label}
            className="rounded-[24px] border border-[#E5E7EB] bg-white p-4 sm:p-5 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE]"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#6B7280]">{label}</span>
              <div
                className={`w-7 h-7 rounded-lg ${cls} flex items-center justify-center border shadow-2xs`}
              >
                {icon}
              </div>
            </div>
            <div className="text-2xl font-black tracking-tight text-[#1F2937] mt-2">
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* ─── Filter Tabs ─────────────────────────────────────────────────── */}
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
              {f === "ALL"
                ? `All (${counts.ALL})`
                : f === "PENDING"
                ? `Pending (${counts.PENDING})`
                : f === "ACTIVE"
                ? `Active (${counts.ACTIVE})`
                : `Resolved (${counts.RESOLVED})`}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Consultations List ──────────────────────────────────────────── */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#2E7D32]" />
            <p className="text-xs text-[#6B7280]">Loading farmer inquiries...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-12 text-center shadow-xs">
            <MessageSquare className="w-8 h-8 text-[#9CA3AF] mx-auto mb-2.5" />
            <p className="text-sm font-bold text-[#1F2937]">No consultations found</p>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Farmer queries will appear here once assigned to you.
            </p>
          </div>
        ) : (
          filtered.map((consultation) => {
            const statusBadge = getStatusBadge(consultation.status);
            const farmerName = consultation.farmer.fullName;
            const dateFormatted = new Date(consultation.createdAt).toLocaleDateString(
              undefined,
              {
                month: "short",
                day: "numeric",
                year: "numeric",
              }
            );

            return (
              <div
                key={consultation.id}
                className="rounded-[24px] border border-[#E5E7EB] bg-white p-4 sm:p-5 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE] hover:border-[#C8E6C9] transition-all duration-200 hover:shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-3.5">
                  {/* Avatar */}
                  <UserAvatar
                    src={consultation.farmer.profileImageUrl}
                    name={farmerName}
                    size="md"
                  />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-[#1F2937]">
                        {farmerName}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md border ${statusBadge.cls}`}
                      >
                        {statusBadge.icon}
                        {statusBadge.label}
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-[#1F2937] mb-0.5">
                      {consultation.subject || "Farmer Consultation"}
                    </h3>
                    {consultation.description && (
                      <p className="text-xs text-[#6B7280] leading-relaxed mb-2 line-clamp-2">
                        {consultation.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#9CA3AF] font-medium">
                      {consultation.cropName && (
                        <span className="flex items-center gap-1">
                          <Leaf className="w-3.5 h-3.5 text-[#2E7D32]" />
                          <span className="text-[#4B5563]">{consultation.cropName}</span>
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{dateFormatted}</span>
                      </span>
                      <span className="font-mono text-[#9CA3AF]">
                        #{consultation.id}
                      </span>
                    </div>
                  </div>

                  {/* Action CTA */}
                  <div className="sm:ml-auto w-full sm:w-auto pt-2 sm:pt-0">
                    <Link
                      href={`/expert/consultations/${consultation.id}`}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-semibold rounded-xl transition-colors shadow-xs cursor-pointer min-h-[40px]"
                    >
                      <span>
                        {consultation.status === "REQUESTED" ||
                        consultation.status === "PENDING"
                          ? "Review Request"
                          : "Open Consultation Chat"}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
