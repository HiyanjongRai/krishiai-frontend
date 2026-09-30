"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { CropAvatar } from "@/components/ui/crop-avatar";
import {
  Trash2,
  Send,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export interface AnalysisCardProps {
  id?: number | null;
  crop: string;
  disease: string;
  confidence: number;
  date: string;
  severity?: "Low" | "Moderate" | "High" | "Uncertain" | "N/A" | string;
  recommendation?: string;
  imageUrl?: string | null;
  onDelete?: (id: number) => Promise<void> | void;
  onSendToExpert?: () => void;
}

export function AnalysisCard({
  id,
  crop,
  disease,
  confidence,
  date,
  severity = "Moderate",
  recommendation = "Follow standard crop protection practices.",
  imageUrl,
  onDelete,
  onSendToExpert,
}: AnalysisCardProps) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isHighConfidence = confidence >= 80;
  const isModerateConfidence = confidence >= 60 && confidence < 80;

  const severityBadgeVariant =
    severity === "High"
      ? "danger"
      : severity === "Moderate"
      ? "warning"
      : severity === "Low"
      ? "success"
      : "neutral";

  const handleDeleteConfirm = async () => {
    if (!id || !onDelete) return;
    setIsDeleting(true);
    try {
      await onDelete(id);
      setIsConfirmingDelete(false);
    } catch {
      // Handled by parent or toast
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="group relative rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#2E7D32]/50 shadow-xs hover:shadow-md transition-all duration-200 p-4 sm:p-5 flex flex-col justify-between gap-4">
        {/* Top Header: Image/Avatar + Crop & Disease + Status Badges */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2.5">
            <div className="flex items-center gap-3 min-w-0">
              {imageUrl ? (
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-[#E5E7EB] bg-black shadow-2xs group-hover:border-[#2E7D32]/40 transition-colors">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt={`${crop} leaf`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              ) : (
                <CropAvatar name={crop} size="md" className="shrink-0 shadow-2xs" />
              )}

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-md uppercase tracking-wider">
                    {crop}
                  </span>
                  <Badge variant={severityBadgeVariant} className="text-[10px] px-2 py-0">
                    {severity}
                  </Badge>
                </div>
                <h4 className="font-bold text-[#1F2937] text-sm sm:text-base leading-tight truncate mt-1">
                  {disease}
                </h4>
              </div>
            </div>

            {/* Delete button (top right) */}
            {id && onDelete && (
              <button
                type="button"
                onClick={() => setIsConfirmingDelete(true)}
                title="Delete diagnosis record"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#9CA3AF] hover:text-[#DC2626] hover:bg-[#FEF2F2] transition-colors cursor-pointer shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* AI Confidence Bar */}
          <div className="space-y-1.5 pt-0.5">
            <div className="flex justify-between text-[11px] font-medium text-[#6B7280]">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#2E7D32]" />
                <span>AI Confidence</span>
              </span>
              <span
                className={`font-bold ${
                  isHighConfidence
                    ? "text-[#2E7D32]"
                    : isModerateConfidence
                    ? "text-[#D97706]"
                    : "text-[#6B7280]"
                }`}
              >
                {confidence}%
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-[#F1F5F2] overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isHighConfidence
                    ? "bg-[#2E7D32]"
                    : isModerateConfidence
                    ? "bg-[#F59E0B]"
                    : "bg-[#9CA3AF]"
                }`}
                style={{ width: `${Math.min(100, Math.max(5, confidence))}%` }}
              />
            </div>
          </div>

          {/* Recommendation Box */}
          <div className="p-3 rounded-xl bg-[#F8FAF8] border border-[#EEF0EE] text-xs space-y-1">
            <p className="text-[#9CA3AF] font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
              <span>Advisory Action</span>
            </p>
            <p className="text-[#4B5563] font-medium text-xs line-clamp-2 leading-relaxed">
              {recommendation}
            </p>
          </div>
        </div>

        {/* Action Footer */}
        <div className="pt-3 border-t border-[#F1F5F2] flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1 text-[11px] text-[#9CA3AF] font-medium truncate">
            <Calendar className="w-3 h-3 shrink-0" />
            <span className="truncate">{date}</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {onSendToExpert && (
              <button
                type="button"
                onClick={onSendToExpert}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E8F5E9] hover:bg-[#2E7D32] text-[#2E7D32] hover:text-white font-bold text-xs transition-all cursor-pointer border border-[#C8E6C9] hover:border-transparent shadow-2xs"
              >
                <Send className="w-3 h-3" />
                <span>Verify with Expert</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={isConfirmingDelete}
        title="Delete Diagnostic Record?"
        description={`Are you sure you want to delete this diagnosis record for ${crop} (${disease})? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Keep Record"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsConfirmingDelete(false)}
      />
    </>
  );
}
