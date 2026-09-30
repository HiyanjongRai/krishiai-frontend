"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  X,
  Search,
  CheckCircle2,
  ShieldCheck,
  Send,
  Loader2,
  Sparkles,
  ArrowRight,
  MessageSquare,
  AlertCircle,
  HelpCircle,
  UserCheck,
} from "lucide-react";
import { expertDirectoryService } from "@/services/expert/expertDirectoryService";
import { sendDiagnosisToExpert } from "@/services/diagnosis-service";
import { useToast } from "@/providers/toast-provider";
import type { VerifiedExpert } from "@/types/expert-directory";

export interface DiagnosisSummaryData {
  id?: number | null;
  crop?: string | null;
  disease?: string | null;
  confidence?: number;
  severity?: string;
  recommendation?: string;
  imageUrl?: string | null;
  advice?: any;
}

interface SendToExpertModalProps {
  isOpen: boolean;
  onClose: () => void;
  diagnosis: DiagnosisSummaryData | null;
  onSuccess?: (consultationId: number) => void;
}

const QUICK_PROMPTS = [
  "Please verify if this AI diagnosis is accurate for my field.",
  "What is the best immediate organic or chemical treatment?",
  "How fast will this spread and what preventive steps should I take?",
  "Is it safe to harvest or consume affected plants?",
];

export function SendToExpertModal({
  isOpen,
  onClose,
  diagnosis,
  onSuccess,
}: SendToExpertModalProps) {
  const { toast } = useToast();

  const [experts, setExperts] = useState<VerifiedExpert[]>([]);
  const [isLoadingExperts, setIsLoadingExperts] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState<VerifiedExpert | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [farmerNote, setFarmerNote] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [createdConsultationId, setCreatedConsultationId] = useState<number | null>(null);

  // Load experts whenever modal opens
  useEffect(() => {
    if (!isOpen) {
      setSelectedExpert(null);
      setFarmerNote("");
      setSearchQuery("");
      setCreatedConsultationId(null);
      return;
    }

    let isMounted = true;
    setIsLoadingExperts(true);

    expertDirectoryService
      .getExperts(diagnosis?.crop || undefined)
      .then((data) => {
        if (!isMounted) return;
        setExperts(data);
        if (data.length > 0) {
          setSelectedExpert(data[0]);
        }
      })
      .catch(() => {
        // Fallback: fetch without crop filter
        expertDirectoryService
          .getExperts()
          .then((data) => {
            if (!isMounted) return;
            setExperts(data);
            if (data.length > 0) {
              setSelectedExpert(data[0]);
            }
          })
          .catch(() => {
            if (isMounted) setExperts([]);
          });
      })
      .finally(() => {
        if (isMounted) setIsLoadingExperts(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, diagnosis?.crop]);

  if (!isOpen || !diagnosis) return null;

  const filteredExperts = experts.filter((exp) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      exp.fullName.toLowerCase().includes(q) ||
      (exp.designation && exp.designation.toLowerCase().includes(q)) ||
      (exp.organization && exp.organization.toLowerCase().includes(q)) ||
      (exp.specializations && exp.specializations.some((s) => s.toLowerCase().includes(q))) ||
      (exp.verifiedCrops && exp.verifiedCrops.some((c) => c.cropName?.toLowerCase().includes(q)))
    );
  });

  const handleSend = async () => {
    if (!selectedExpert) {
      toast.warning({
        title: "Expert Required",
        description: "Please select an agricultural expert from the directory.",
      });
      return;
    }

    const expertUserId = selectedExpert.userId ?? selectedExpert.expertProfileId;
    if (!expertUserId) {
      toast.error({
        title: "Invalid Specialist",
        description: "Selected specialist account cannot receive consultations.",
      });
      return;
    }

    setIsSending(true);
    try {
      const res = await sendDiagnosisToExpert({
        diagnosisId: diagnosis.id ?? null,
        expertUserId: expertUserId,
        crop: diagnosis.crop ?? null,
        disease: diagnosis.disease ?? null,
        confidence: diagnosis.confidence ?? null,
        imageUrl: diagnosis.imageUrl ?? null,
        recommendation: diagnosis.recommendation ?? null,
        farmerNote: farmerNote.trim() || undefined,
      });

      toast.success({
        title: "Diagnosis Sent to Specialist",
        description: `Forwarded to ${selectedExpert.fullName}. Check your consultations for updates.`,
      });
      const consultationId = res?.id ?? res?.consultationId ?? null;
      setCreatedConsultationId(consultationId);
      if (consultationId && onSuccess) {
        onSuccess(consultationId);
      }
    } catch (err: any) {
      toast.error({
        title: "Submission Failed",
        description: err?.message || "Failed to submit diagnosis to expert. Please try again.",
      });
    } finally {
      setIsSending(false);
    }
  };

  const confPercent = diagnosis.confidence
    ? Math.round(diagnosis.confidence > 1 ? diagnosis.confidence : diagnosis.confidence * 100)
    : 85;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-[#E5E7EB] animate-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col my-auto overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EEF0EE] bg-gradient-to-r from-[#F0FDF4] to-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2E7D32] text-white flex items-center justify-center shadow-xs">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1F2937]">Send to Agricultural Expert</h3>
              <p className="text-xs text-[#6B7280]">
                Get your AI diagnosis verified by certified agronomists
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#9CA3AF] hover:text-[#1F2937] hover:bg-[#E5E7EB]/50 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-5">
          {createdConsultationId ? (
            /* Success State */
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#E8F5E9] text-[#2E7D32] mx-auto flex items-center justify-center shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h4 className="text-lg font-black text-[#1F2937]">Consultation Request Created!</h4>
                <p className="text-xs text-[#6B7280] leading-relaxed">
                  Your diagnosis for <strong>{diagnosis.crop} ({diagnosis.disease})</strong> has been
                  forwarded to <strong>{selectedExpert?.fullName}</strong>. You will receive advice and
                  can chat directly in your consultations tab.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <Link
                  href={`/farmer/consultations`}
                  className="px-6 py-2.5 bg-[#2E7D32] hover:bg-[#256B2A] text-white text-xs font-bold rounded-full shadow-xs transition-colors inline-flex items-center gap-2"
                >
                  <span>Go to Consultations</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 bg-[#F1F5F2] hover:bg-[#E5E7EB] text-[#4B5563] text-xs font-bold rounded-full transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Diagnosis Summary Banner */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-[#F8FAF8] border border-[#E5E7EB] flex items-center gap-3 sm:gap-4">
                {diagnosis.imageUrl ? (
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 border border-[#C8E6C9] bg-black">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={diagnosis.imageUrl}
                      alt="Leaf preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center shrink-0 font-bold text-xs uppercase">
                    {diagnosis.crop?.slice(0, 3) ?? "Crop"}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-full border border-[#C8E6C9]">
                      {diagnosis.crop ?? "Crop"}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#D97706] bg-[#FEF3C7] px-2 py-0.5 rounded-full border border-[#FDE68A]">
                      Severity: {diagnosis.severity ?? "Moderate"}
                    </span>
                  </div>
                  <h4 className="font-black text-[#1F2937] text-sm sm:text-base truncate mt-0.5">
                    {diagnosis.disease ?? "Leaf Disease"}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-24 sm:w-32 h-1.5 rounded-full bg-[#E5E7EB] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#2E7D32]"
                        style={{ width: `${confPercent}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-[#2E7D32]">
                      {confPercent}% match
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 1: Expert Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#1F2937] uppercase tracking-wider flex items-center gap-1.5">
                    <span>1. Select an Agricultural Specialist</span>
                    <span className="text-[#2E7D32]">*</span>
                  </label>
                  <span className="text-[11px] text-[#6B7280]">
                    {filteredExperts.length} expert{filteredExperts.length === 1 ? "" : "s"} available
                  </span>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search specialist by name, crop, or organization..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E5E7EB] focus:outline-hidden focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 transition-all bg-[#FAFAFA]"
                  />
                </div>

                {/* Expert List */}
                {isLoadingExperts ? (
                  <div className="py-8 flex flex-col items-center justify-center gap-2 text-xs text-[#6B7280]">
                    <Loader2 className="w-5 h-5 text-[#2E7D32] animate-spin" />
                    <span>Loading verified agronomists...</span>
                  </div>
                ) : filteredExperts.length === 0 ? (
                  <div className="p-4 rounded-xl border border-dashed border-[#E5E7EB] text-center text-xs text-[#6B7280]">
                    No specialists match your search. Try a broader term.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2.5 max-h-52 overflow-y-auto pr-1">
                    {filteredExperts.map((expert) => {
                      const isSelected =
                        selectedExpert?.expertProfileId === expert.expertProfileId ||
                        (selectedExpert?.userId && selectedExpert.userId === expert.userId);

                      return (
                        <div
                          key={expert.expertProfileId}
                          onClick={() => setSelectedExpert(expert)}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                            isSelected
                              ? "border-[#2E7D32] bg-[#F0FDF4] shadow-xs ring-1 ring-[#2E7D32]"
                              : "border-[#E5E7EB] bg-white hover:border-[#C8E6C9] hover:bg-[#F9FAF9]"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-full bg-[#E8F5E9] text-[#2E7D32] font-black text-xs flex items-center justify-center shrink-0 uppercase border border-[#C8E6C9]">
                              {expert.fullName.slice(0, 2)}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <h5 className="text-xs font-bold text-[#1F2937] truncate">
                                  {expert.fullName}
                                </h5>
                                {expert.professionalVerified && (
                                  <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D32] shrink-0" />
                                )}
                              </div>
                              <p className="text-[11px] text-[#6B7280] truncate">
                                {expert.designation || "Agronomist"}
                                {expert.organization ? ` • ${expert.organization}` : ""}
                              </p>
                              {expert.yearsOfExperience && (
                                <p className="text-[10px] text-[#2E7D32] font-medium">
                                  {expert.yearsOfExperience} yrs experience
                                </p>
                              )}
                            </div>
                          </div>

                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                              isSelected
                                ? "bg-[#2E7D32] border-[#2E7D32] text-white"
                                : "border-[#D1D5DB] bg-white"
                            }`}
                          >
                            {isSelected && <CheckCircle2 className="w-4 h-4" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Step 2: Farmer's Note / Feedback */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#1F2937] uppercase tracking-wider flex items-center gap-1.5">
                    <span>2. Your Notes, Questions or Symptoms</span>
                    <span className="text-[#9CA3AF] font-normal lowercase">(optional)</span>
                  </label>
                  <span className="text-[11px] text-[#6B7280]">
                    {farmerNote.length}/500
                  </span>
                </div>

                <textarea
                  rows={3}
                  maxLength={500}
                  value={farmerNote}
                  onChange={(e) => setFarmerNote(e.target.value)}
                  placeholder="Describe field conditions, when symptoms started, soil moisture, or specific advice needed..."
                  className="w-full p-3 text-xs rounded-2xl border border-[#E5E7EB] focus:outline-hidden focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 transition-all bg-[#FAFAFA] resize-none"
                />

                {/* Quick Prompts Chips */}
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                    Quick Suggestions
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_PROMPTS.map((prompt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() =>
                          setFarmerNote((prev) =>
                            prev ? `${prev}\n${prompt}` : prompt
                          )
                        }
                        className="text-[11px] px-2.5 py-1 rounded-full bg-[#F1F5F2] hover:bg-[#E8F5E9] hover:text-[#2E7D32] text-[#4B5563] transition-colors cursor-pointer border border-[#E5E7EB]"
                      >
                        + {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        {!createdConsultationId && (
          <div className="px-6 py-4 bg-[#F8FAF8] border-t border-[#EEF0EE] flex items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isSending}
              className="px-4 py-2 text-xs font-semibold text-[#6B7280] hover:text-[#1F2937] transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSend}
              disabled={isSending || !selectedExpert}
              className="px-6 py-2.5 bg-[#2E7D32] hover:bg-[#256B2A] text-white text-xs font-bold rounded-full shadow-xs transition-all disabled:opacity-50 cursor-pointer min-h-[40px] inline-flex items-center gap-2"
            >
              {isSending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting to Expert...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Send to {selectedExpert ? selectedExpert.fullName.split(" ")[0] : "Expert"}</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
