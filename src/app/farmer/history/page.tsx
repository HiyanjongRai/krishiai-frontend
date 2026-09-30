"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  History,
  Scan,
  Users,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Plus,
  Search,
  Calendar,
  LayoutGrid,
  Table as TableIcon,
  Send,
  Trash2,
  Leaf,
  Loader2,
  ExternalLink,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { useToast } from "@/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CropAvatar } from "@/components/ui/crop-avatar";
import { UserAvatar } from "@/components/ui/avatar";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  getDiagnosisHistory,
  deleteDiagnosis,
  DiagnosisRecord,
} from "@/services/diagnosis-service";
import { consultationService } from "@/services/messaging";
import {
  SendToExpertModal,
  DiagnosisSummaryData,
} from "@/components/farmer/SendToExpertModal";
import type { ConsultationDetailDto } from "@/types/messaging";

export default function FarmerHistoryPage() {
  const { toast } = useToast();

  const [diagnoses, setDiagnoses] = useState<DiagnosisRecord[]>([]);
  const [consultations, setConsultations] = useState<ConsultationDetailDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"ALL" | "DIAGNOSES" | "CONSULTATIONS">("ALL");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  // Deletion modal
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deletingName, setDeletingName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Expert consultation modal
  const [consultModalData, setConsultModalData] = useState<DiagnosisSummaryData | null>(null);
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [diagRes, consultRes] = await Promise.all([
        getDiagnosisHistory(0, 50).catch(() => ({ content: [] })),
        consultationService.listConsultations().catch(() => []),
      ]);
      setDiagnoses(diagRes.content || []);
      setConsultations(Array.isArray(consultRes) ? consultRes : []);
    } catch {
      toast.error({
        title: "Failed to load history",
        description: "Please check your network connection and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await deleteDiagnosis(deletingId);
      setDiagnoses((prev) => prev.filter((d) => d.id !== deletingId));
      toast.success({
        title: "Record Deleted",
        description: "Diagnostic record has been removed.",
      });
      setDeletingId(null);
    } catch {
      toast.error({
        title: "Deletion failed",
        description: "Could not remove the record. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Stats
  const healthyCount = diagnoses.filter(
    (d) => d.severity === "Low" || d.predictedDisease?.toLowerCase().includes("healthy")
  ).length;
  const alertCount = diagnoses.filter(
    (d) => d.severity === "High" || d.severity === "Moderate"
  ).length;

  // Filtered lists
  const filteredDiagnoses = useMemo(() => {
    if (activeTab === "CONSULTATIONS") return [];
    return diagnoses.filter((d) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        d.crop?.toLowerCase().includes(q) ||
        d.predictedDisease?.toLowerCase().includes(q) ||
        d.recommendation?.toLowerCase().includes(q)
      );
    });
  }, [diagnoses, searchQuery, activeTab]);

  const filteredConsultations = useMemo(() => {
    if (activeTab === "DIAGNOSES") return [];
    return consultations.filter((c) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const expName = c.expert?.fullName || c.expert?.displayName || "";
      return (
        expName.toLowerCase().includes(q) ||
        c.subject?.toLowerCase().includes(q) ||
        c.cropName?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q)
      );
    });
  }, [consultations, searchQuery, activeTab]);

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* ─── 1. PAGE HEADER (Matches 'My Farm' Standard) ───────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#E5E7EB]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-[#E8F5E9] text-[#2E7D32]">
              <History className="w-4 h-4" />
            </span>
            <h1 className="text-lg sm:text-xl font-bold text-[#1F2937] tracking-tight">
              Diagnostic &amp; Consultation History
            </h1>
          </div>
          <p className="text-[11px] sm:text-xs text-[#6B7280] mt-0.5">
            Complete audit trail of AI leaf scans, disease predictions, and expert consultations across your plots.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-lg bg-white border border-[#E5E7EB] text-[#4B5563] hover:text-[#2E7D32] hover:border-[#C8E6C9] transition-colors shadow-2xs cursor-pointer disabled:opacity-60"
            title="Refresh history"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[#2E7D32]" : ""}`} />
          </button>

          <Link
            href="/farmer/analysis"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#2E7D32] hover:bg-[#256B2A] text-white text-xs font-bold rounded-lg shadow-xs transition-all active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Crop Scan</span>
          </Link>
        </div>
      </div>

      {/* ─── 2. METRIC CARDS ROW ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl bg-white border border-[#E5E7EB]/80 p-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Total Scans</p>
            <div className="w-6 h-6 rounded-lg bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center">
              <Scan className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-[#1F2937] mt-1">{diagnoses.length}</p>
          <p className="text-[10px] text-[#9CA3AF] mt-0.5">AI pathology scans</p>
        </div>

        <div className="rounded-xl bg-white border border-[#E5E7EB]/80 p-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Optimal Health</p>
            <div className="w-6 h-6 rounded-lg bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-[#2E7D32] mt-1">{healthyCount}</p>
          <p className="text-[10px] text-[#2E7D32] mt-0.5">Healthy plant detections</p>
        </div>

        <div className="rounded-xl bg-white border border-[#E5E7EB]/80 p-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Disease Alerts</p>
            <div className="w-6 h-6 rounded-lg bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-[#D97706] mt-1">{alertCount}</p>
          <p className="text-[10px] text-[#9CA3AF] mt-0.5">Actionable pathologies</p>
        </div>

        <div className="rounded-xl bg-white border border-[#E5E7EB]/80 p-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Consultations</p>
            <div className="w-6 h-6 rounded-lg bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-[#1F2937] mt-1">{consultations.length}</p>
          <p className="text-[10px] text-[#9CA3AF] mt-0.5">Specialist interactions</p>
        </div>
      </div>

      {/* ─── 3. FILTER AND SEARCH BAR (Matches 'My Farm') ──────────────────────── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#E5E7EB]/80 shadow-2xs">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search scans, crop names, diseases, or experts..."
            className="w-full text-xs sm:text-sm pl-9 pr-3.5 py-2 rounded-xl bg-[#F8FAF8] border border-[#E5E7EB] focus:bg-white focus:border-[#2E7D32] focus:outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(
            [
              { id: "ALL", label: "All History" },
              { id: "DIAGNOSES", label: "AI Scans" },
              { id: "CONSULTATIONS", label: "Consultations" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-[#2E7D32] text-white shadow-2xs"
                  : "bg-[#F8FAF8] border border-[#E5E7EB] text-[#4B5563] hover:bg-white"
              }`}
            >
              {tab.label}
            </button>
          ))}

          <div className="flex items-center bg-[#F1F5F2] rounded-xl p-0.5 ml-1">
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === "cards" ? "bg-white text-[#2E7D32] shadow-2xs" : "text-[#6B7280]"
              }`}
              title="Cards grid view"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === "table" ? "bg-white text-[#2E7D32] shadow-2xs" : "text-[#6B7280]"
              }`}
              title="Table view"
            >
              <TableIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ─── 4. HISTORY CONTENT ───────────────────────────────────────────────── */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-[#E5E7EB] bg-white p-4 space-y-3 animate-pulse"
            >
              <div className="h-5 bg-[#E5E7EB] rounded-md w-3/4" />
              <div className="h-3.5 bg-[#F1F5F2] rounded-md w-1/2" />
              <div className="h-20 bg-[#F8FAF8] rounded-xl" />
            </div>
          ))}
        </div>
      ) : filteredDiagnoses.length === 0 && filteredConsultations.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#D1D5DB] bg-white p-12 text-center space-y-3">
          <div className="w-12 h-12 bg-[#E8F5E9] text-[#2E7D32] rounded-xl flex items-center justify-center mx-auto">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-[#1F2937]">
              No history records found
            </h2>
            <p className="text-xs text-[#6B7280] mt-1 max-w-sm mx-auto">
              {searchQuery
                ? "Try adjusting your search criteria."
                : "Run your first AI crop analysis or consult an agronomist to start building your farm history."}
            </p>
          </div>
          {!searchQuery && (
            <Link
              href="/farmer/analysis"
              className="inline-flex items-center gap-1.5 px-4 py-2 mt-2 bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Scan Crop Leaf</span>
            </Link>
          )}
        </div>
      ) : viewMode === "cards" ? (
        <div className="space-y-6">
          {/* AI Diagnoses Cards */}
          {filteredDiagnoses.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                  AI Leaf Diagnostic Scans ({filteredDiagnoses.length})
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredDiagnoses.map((scan) => {
                  const confNumber = Math.round(
                    scan.confidence > 1 ? scan.confidence : scan.confidence * 100
                  );
                  const dateStr = scan.createdAt
                    ? new Date(scan.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Recent";

                  return (
                    <div
                      key={scan.id}
                      className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-2xs hover:border-[#C8E6C9] transition-all flex flex-col justify-between group"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2.5">
                          <div className="flex items-center gap-2.5 min-w-0">
                            {scan.imageUrl ? (
                              <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-[#E5E7EB] bg-black shadow-2xs">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={scan.imageUrl}
                                  alt={`${scan.crop} leaf`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <CropAvatar name={scan.crop} size="sm" className="rounded-xl shrink-0" />
                            )}
                            <div className="min-w-0">
                              <span className="px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-[9px] font-bold uppercase tracking-wider">
                                {scan.crop || "Crop"}
                              </span>
                              <h4 className="text-sm font-bold text-[#1F2937] truncate mt-0.5">
                                {scan.predictedDisease || "Undetected"}
                              </h4>
                            </div>
                          </div>

                          {scan.id && (
                            <button
                              type="button"
                              onClick={() => {
                                setDeletingId(scan.id!);
                                setDeletingName(`${scan.crop} (${scan.predictedDisease})`);
                              }}
                              className="text-[#9CA3AF] hover:text-[#DC2626] transition-colors p-1 rounded-lg hover:bg-[#FEF2F2] cursor-pointer"
                              title="Delete record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        {/* Confidence bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] font-semibold text-[#6B7280]">
                            <span>Match Confidence</span>
                            <span className="text-[#1F2937] font-bold">{confNumber}%</span>
                          </div>
                          <div className="w-full bg-[#F1F5F2] h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-[#2E7D32] h-full rounded-full transition-all"
                              style={{ width: `${Math.min(100, Math.max(5, confNumber))}%` }}
                            />
                          </div>
                        </div>

                        {/* Recommendation */}
                        <div className="p-2.5 rounded-xl bg-[#F8FAF8] border border-[#EEF0EE] text-[11px] text-[#4B5563] line-clamp-2">
                          {scan.recommendation || "Follow standard crop protection measures."}
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="pt-3 mt-3 border-t border-[#F1F5F2] flex items-center justify-between gap-2 text-xs">
                        <span className="text-[10px] text-[#9CA3AF] flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {dateStr}
                        </span>

                        <button
                          type="button"
                          onClick={() => {
                            setConsultModalData({
                              id: scan.id,
                              crop: scan.crop,
                              disease: scan.predictedDisease,
                              confidence: confNumber,
                              severity: scan.severity,
                              recommendation: scan.recommendation,
                              imageUrl: scan.imageUrl,
                              advice: scan.advice,
                            });
                            setIsConsultModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#2E7D32] hover:text-white font-semibold text-[11px] transition-all cursor-pointer border border-[#C8E6C9]"
                        >
                          <Send className="w-2.5 h-2.5" />
                          <span>Verify</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Consultations Cards */}
          {filteredConsultations.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                  Specialist Consultations ({filteredConsultations.length})
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredConsultations.map((item) => {
                  const expertName = item.expert?.fullName || item.expert?.displayName || "Agronomist";
                  const dateFormatted = new Date(item.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });

                  return (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-2xs hover:border-[#C8E6C9] transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-2.5">
                          <UserAvatar src={item.expert?.profileImageUrl} name={expertName} size="sm" />
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-[#1F2937] truncate">{expertName}</h4>
                            <p className="text-[10px] text-[#6B7280]">{item.cropName ? `Crop: ${item.cropName}` : "Consultation"}</p>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-[#F8FAF8] border border-[#EEF0EE] text-[11px] text-[#4B5563] line-clamp-2">
                          {item.description || item.subject || "No description provided."}
                        </div>
                      </div>

                      <div className="pt-3 mt-3 border-t border-[#F1F5F2] flex items-center justify-between gap-2 text-xs">
                        <span className="text-[10px] text-[#9CA3AF] flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {dateFormatted}
                        </span>

                        <Link
                          href={`/farmer/consultations/${item.id}`}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2E7D32] hover:underline"
                        >
                          <span>Open Dossier</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Table View */
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-2xs overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#F1F5F2] text-[10px] uppercase font-bold text-[#9CA3AF] tracking-wider">
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Subject / Condition</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Status / Match</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F2]">
              {filteredDiagnoses.map((d) => (
                <tr key={`diag-${d.id}`} className="hover:bg-[#F8FAF8] transition-colors">
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-[9px] font-bold">
                      Scan
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-[#1F2937]">
                    {d.crop} — {d.predictedDisease}
                  </td>
                  <td className="py-2.5 px-3 text-[#6B7280]">
                    {d.createdAt ? new Date(d.createdAt).toLocaleDateString() : "—"}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-[#2E7D32]">
                    {Math.round(d.confidence > 1 ? d.confidence : d.confidence * 100)}%
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setConsultModalData({
                          id: d.id,
                          crop: d.crop,
                          disease: d.predictedDisease,
                          confidence: d.confidence,
                          severity: d.severity,
                          recommendation: d.recommendation,
                          imageUrl: d.imageUrl,
                          advice: d.advice,
                        });
                        setIsConsultModalOpen(true);
                      }}
                      className="text-[#2E7D32] hover:underline font-bold text-[11px] cursor-pointer"
                    >
                      Verify
                    </button>
                  </td>
                </tr>
              ))}

              {filteredConsultations.map((c) => (
                <tr key={`consult-${c.id}`} className="hover:bg-[#F8FAF8] transition-colors">
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded-full bg-[#DBEAFE] text-[#2563EB] text-[9px] font-bold">
                      Consult
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-[#1F2937]">
                    {c.expert?.fullName || "Specialist"} — {c.subject || "Advisory"}
                  </td>
                  <td className="py-2.5 px-3 text-[#6B7280]">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-2.5 px-3 text-[#6B7280] font-semibold">{c.status}</td>
                  <td className="py-2.5 px-3 text-right">
                    <Link
                      href={`/farmer/consultations/${c.id}`}
                      className="text-[#2E7D32] hover:underline font-bold text-[11px]"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        open={Boolean(deletingId)}
        onCancel={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Diagnostic Record?"
        description={`Are you sure you want to delete the record for ${deletingName}? This cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Keep Record"
        variant="danger"
        isLoading={isDeleting}
      />

      {/* Send to Expert Modal */}
      <SendToExpertModal
        isOpen={isConsultModalOpen}
        onClose={() => {
          setIsConsultModalOpen(false);
          setConsultModalData(null);
        }}
        diagnosis={consultModalData}
      />
    </div>
  );
}
