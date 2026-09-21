"use client";

import React, { useEffect, useState } from "react";
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
  Sprout,
  Loader2,
  CreditCard,
} from "lucide-react";
import { consultationService } from "@/services/messaging";
import { UserAvatar } from "@/components/ui/avatar";
import type { ConsultationDetailDto } from "@/types/messaging";

export default function FarmerConsultationsPage() {
  const [consultations, setConsultations] = useState<ConsultationDetailDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "ACTIVE" | "PENDING" | "COMPLETED">("ALL");

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

  const filtered = consultations.filter((c) => {
    if (filter === "ALL") return true;
    if (filter === "ACTIVE") return c.status === "ACCEPTED" || c.status === "ACTIVE";
    if (filter === "PENDING") return c.status === "REQUESTED" || c.status === "PENDING" || c.status === "PAYMENT_PENDING";
    if (filter === "COMPLETED") return c.status === "COMPLETED" || c.status === "EXPIRED";
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
          label: "Payment Pending",
          cls: "bg-amber-100 text-amber-800 border-amber-300",
          icon: <Clock className="w-3 h-3 animate-pulse" />,
        };
      case "REQUESTED":
      case "PENDING":
        return {
          label: "Pending Review",
          cls: "bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]",
          icon: <Clock className="w-3 h-3 animate-pulse" />,
        };
      case "EXPIRED":
        return {
          label: "Expired",
          cls: "bg-orange-50 text-orange-700 border-orange-200",
          icon: <AlertCircle className="w-3 h-3" />,
        };
      case "COMPLETED":
        return {
          label: "Resolved",
          cls: "bg-[#F1F5F2] text-[#4B5563] border-[#E5E7EB]",
          icon: <CheckCircle2 className="w-3 h-3" />,
        };
      default:
        return {
          label: status,
          cls: "bg-gray-100 text-gray-600 border-gray-200",
          icon: <AlertCircle className="w-3 h-3" />,
        };
    }
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
            My Consultations
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-[#6B7280] font-medium">
            Track your consultation requests and connect directly with verified agronomists.
          </p>
        </div>

        <Link
          href="/experts"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold rounded-full shadow-xs transition-all active:scale-95 cursor-pointer min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span>Consult Specialist</span>
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {[
          {
            label: "Total Requests",
            val: consultations.length,
            icon: Users,
            color: "text-[#1F2937] bg-[#F1F5F2]",
          },
          {
            label: "Active Sessions",
            val: consultations.filter(
              (c) => c.status === "ACCEPTED" || c.status === "ACTIVE"
            ).length,
            icon: MessageSquare,
            color: "text-[#2E7D32] bg-[#E8F5E9]",
          },
          {
            label: "Pending / Payment",
            val: consultations.filter(
              (c) =>
                c.status === "REQUESTED" ||
                c.status === "PENDING" ||
                c.status === "PAYMENT_PENDING"
            ).length,
            icon: Clock,
            color: "text-amber-600 bg-amber-50",
          },
          {
            label: "Resolved / Completed",
            val: consultations.filter(
              (c) => c.status === "COMPLETED" || c.status === "EXPIRED"
            ).length,
            icon: CheckCircle2,
            color: "text-[#2E7D32] bg-[#E8F5E9]",
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#6B7280]">
                  {item.label}
                </span>
                <div
                  className={`w-7 h-7 rounded-lg ${item.color} flex items-center justify-center shrink-0`}
                >
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
        {(
          [
            { id: "ALL", label: "All Consultations" },
            { id: "ACTIVE", label: "Active Sessions" },
            { id: "PENDING", label: "Pending & Payment" },
            { id: "COMPLETED", label: "Resolved" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap min-h-[36px] ${
              filter === tab.id
                ? "bg-[#2E7D32] text-white shadow-xs"
                : "bg-white border border-[#E5E7EB] text-[#4B5563] hover:bg-[#F8FAF8]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Consultations List */}
      <div className="space-y-3.5">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#2E7D32]" />
            <p className="text-xs text-[#6B7280]">Loading consultations...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#D1D5DB] bg-white p-12 text-center">
            <Users className="w-10 h-10 text-[#6B7280] mx-auto mb-2" />
            <p className="text-sm font-bold text-[#4B5563]">
              No consultations in this category
            </p>
            <p className="text-xs text-[#9CA3AF] mt-0.5">
              Explore certified agricultural experts to get personalized crop guidance.
            </p>
            <Link
              href="/experts"
              className="inline-flex items-center gap-1.5 px-4 py-2 mt-4 bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold rounded-full shadow-xs transition-colors"
            >
              <span>Explore Agronomists</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          filtered.map((item) => {
            const badge = getStatusBadge(item.status);
            const expertName = item.expert?.fullName ?? "Agricultural Specialist";
            const dateFormatted = new Date(item.createdAt).toLocaleDateString(
              undefined,
              {
                month: "short",
                day: "numeric",
                year: "numeric",
              }
            );

            return (
              <div
                key={item.id}
                className="rounded-2xl sm:rounded-3xl border border-[#E5E7EB] bg-white p-4 sm:p-5 shadow-xs hover:border-[#C8E6C9] transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <UserAvatar
                      src={item.expert?.profileImageUrl}
                      name={expertName}
                      size="md"
                    />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <h3 className="font-bold text-[#1F2937] text-sm sm:text-base truncate">
                          {expertName}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md border ${badge.cls}`}
                        >
                          {badge.icon}
                          {badge.label}
                        </span>
                      </div>
                      <p className="text-xs text-[#6B7280] font-medium truncate">
                        {item.expert?.specialization || "Certified Agronomist"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#6B7280] font-medium self-start sm:self-auto">
                    <Calendar className="w-3.5 h-3.5 text-[#9CA3AF]" />
                    <span>{dateFormatted}</span>
                  </div>
                </div>

                <div className="mt-3 p-3.5 rounded-xl bg-[#F8FAF8] border border-[#EEF0EE] text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[#1F2937] font-bold">
                    <Sprout className="w-3.5 h-3.5 text-[#2E7D32]" />
                    <span>Subject: {item.subject || "Crop Consultation"}</span>
                  </div>
                  {item.cropName && (
                    <p className="text-[#2E7D32] font-semibold">
                      Crop: {item.cropName}
                    </p>
                  )}
                  {item.description && (
                    <p className="text-[#4B5563] leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#EEF0EE] flex items-center justify-between gap-2 flex-wrap">
                  <span className="font-mono text-[10px] text-[#9CA3AF]">
                    Ref: #{item.id}
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {item.status === "PAYMENT_PENDING" && (
                      <Link
                        href={`/farmer/payments/${item.id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all min-h-[36px] shadow-xs animate-pulse"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>
                          Pay with eSewa{item.priceAtPurchase ? ` (Rs. ${item.priceAtPurchase})` : ""}
                        </span>
                      </Link>
                    )}
                    <Link
                      href={`/farmer/consultations/${item.id}`}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-colors min-h-[36px] shadow-xs ${
                        item.status === "PAYMENT_PENDING"
                          ? "bg-white border border-[#E5E7EB] text-[#4B5563] hover:bg-[#F8FAF8]"
                          : "bg-[#2E7D32] hover:bg-[#1B5E20] text-white"
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>
                        {item.status === "REQUESTED"
                          ? "View Status"
                          : item.status === "PAYMENT_PENDING"
                          ? "View Details"
                          : item.status === "EXPIRED"
                          ? "View Past Chat"
                          : "Open Consultation Chat"}
                      </span>
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
