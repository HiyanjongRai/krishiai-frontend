"use client";

import React, { useState } from "react";
import {
  Phone,
  MapPin,
  Sprout,
  Bot,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/providers/toast-provider";
import { getApiErrorMessage } from "@/lib/toast-utils";
import { adminService } from "@/services/admin";
import type { FarmerSummary } from "@/types/admin";
import { UserAvatar } from "@/components/ui/avatar";

interface FarmerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  farmer: FarmerSummary | null;
  onStatusChanged?: () => void;
}

export function FarmerDetailsModal({
  isOpen,
  onClose,
  farmer,
  onStatusChanged,
}: FarmerDetailsModalProps) {
  const { toast } = useToast();

  const [isProcessing, setIsProcessing] = useState(false);
  const [showBlockReasonInput, setShowBlockReasonInput] = useState(false);
  const [blockReason, setBlockReason] = useState("");

  if (!isOpen || !farmer) return null;

  const isBlocked = farmer.status.toUpperCase() === "BLOCKED";

  const handleBlockFarmer = async () => {
    setIsProcessing(true);
    try {
      await adminService.blockUser(farmer.id, blockReason.trim() || "Account blocked by administrator");
      toast.success({
        title: "Farmer blocked",
        description: `${farmer.fullName} has been blocked and their active sessions revoked.`,
      });
      setShowBlockReasonInput(false);
      setBlockReason("");
      if (onStatusChanged) onStatusChanged();
      onClose();
    } catch (err) {
      const msg = getApiErrorMessage(err, "Failed to block farmer.");
      toast.error({ title: "Action failed", description: msg });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUnblockFarmer = async () => {
    setIsProcessing(true);
    try {
      await adminService.unblockUser(farmer.id, "Account reactivated by administrator");
      toast.success({
        title: "Farmer unblocked",
        description: `${farmer.fullName}'s account has been restored to active status.`,
      });
      if (onStatusChanged) onStatusChanged();
      onClose();
    } catch (err) {
      const msg = getApiErrorMessage(err, "Failed to unblock farmer.");
      toast.error({ title: "Action failed", description: msg });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Farmer Account Details">
      <div className="space-y-4 pt-1">
        {/* Top Profile Header */}
        <div className="flex items-center gap-3.5 rounded-xl bg-[#F8FAF8] p-4 border border-[#E5E7EB]">
          <UserAvatar
            src={farmer.profileImage}
            name={farmer.fullName}
            size="md"
            className="shrink-0 ring-1 ring-[#E5E7EB]"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm font-bold text-[#1F2937] truncate">{farmer.fullName}</h4>
              <span
                className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-semibold border ${
                  isBlocked
                    ? "bg-[#FEE2E2] text-[#DC2626] border-[#FCA5A5]"
                    : farmer.status.toUpperCase() === "ACTIVE"
                    ? "bg-[#E8F5E9] text-[#2E7D32] border-[#A5D6A7]"
                    : "bg-[#FEF3C7] text-[#F59E0B] border-[#FCD34D]"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isBlocked ? "bg-[#DC2626]" : farmer.status.toUpperCase() === "ACTIVE" ? "bg-[#2E7D32]" : "bg-[#F59E0B]"
                  }`}
                />
                {farmer.status}
              </span>
            </div>
            <p className="text-xs text-[#6B7280] truncate mt-0.5">{farmer.email}</p>
          </div>
        </div>

        {/* Informational Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-3 shadow-xs">
            <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF]">
              <Phone className="w-3.5 h-3.5 text-[#9CA3AF]" /> Phone
            </span>
            <p className="mt-1 font-medium text-[#1F2937]">{farmer.phone || "Not provided"}</p>
          </div>

          <div className="rounded-xl border border-[#E5E7EB] bg-white p-3 shadow-xs">
            <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF]">
              <MapPin className="w-3.5 h-3.5 text-[#9CA3AF]" /> Farm Location
            </span>
            <p className="mt-1 font-medium text-[#1F2937]">{farmer.location || "Not specified"}</p>
          </div>

          <div className="rounded-xl border border-[#E5E7EB] bg-white p-3 shadow-xs">
            <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF]">
              <Sprout className="w-3.5 h-3.5 text-[#2E7D32]" /> Plotted Crops
            </span>
            <p className="mt-1 font-semibold text-[#1F2937]">{farmer.cropsCount ?? 0} active plantings</p>
          </div>

          <div className="rounded-xl border border-[#E5E7EB] bg-white p-3 shadow-xs">
            <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF]">
              <Bot className="w-3.5 h-3.5 text-[#2563EB]" /> AI Diagnoses
            </span>
            <p className="mt-1 font-semibold text-[#1F2937]">{farmer.aiAnalysesCount ?? 0} scans resolved</p>
          </div>
        </div>

        {/* Member status banner */}
        {isBlocked ? (
          <div className="flex items-start gap-2.5 rounded-xl bg-[#FEE2E2] border border-[#FCA5A5] p-3.5 text-xs text-[#DC2626]">
            <ShieldAlert className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#DC2626]">Account is currently suspended</p>
              <p className="text-[11px] text-[#DC2626] mt-0.5">
                The cultivator cannot authenticate, initiate AI crop scans, or access field records.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-2.5 rounded-xl bg-[#E8F5E9] border border-[#A5D6A7] p-3 text-xs text-[#1B5E20]">
            <ShieldCheck className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />
            <p className="text-[11px] font-medium text-[#1B5E20]">
              Account in good standing with active access to advisory and diagnostic tools.
            </p>
          </div>
        )}

        {/* Moderation Block Reason Input */}
        {showBlockReasonInput && !isBlocked && (
          <div className="space-y-2 rounded-xl bg-[#FEF3C7]/70 border border-[#FCD34D] p-3.5 animate-in fade-in duration-150">
            <label className="block text-xs font-semibold text-[#F59E0B]">
              Reason for Blocking Account
            </label>
            <input
              type="text"
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              placeholder="e.g. Terms violation, abusive behavior..."
              className="h-9 w-full rounded-lg border border-[#FCD34D] bg-white px-3 text-xs text-[#1F2937] outline-none focus:border-[#DC2626] focus:ring-1 focus:ring-[#FCA5A5]"
            />
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowBlockReasonInput(false)}
                disabled={isProcessing}
                className="rounded-lg px-2.5 py-1 text-xs font-medium text-[#4B5563] hover:bg-[#FEF3C7]/60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBlockFarmer}
                disabled={isProcessing}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#DC2626] px-3 py-1 text-xs font-semibold text-white hover:bg-[#B91C1C] shadow-xs"
              >
                {isProcessing ? <LoadingSpinner size="xs" color="white" /> : <Lock className="w-3 h-3" />}
                <span>Confirm Block</span>
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2 pt-3 border-t border-[#EEF0EE]">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto rounded-lg border border-[#E5E7EB] bg-white px-3.5 py-2 text-xs font-medium text-[#4B5563] hover:bg-[#F8FAF8] transition-colors cursor-pointer shadow-xs"
          >
            Close
          </button>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {isBlocked ? (
              <button
                type="button"
                onClick={handleUnblockFarmer}
                disabled={isProcessing}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#2E7D32] px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#2E7D32] transition-colors cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? <LoadingSpinner size="xs" color="white" /> : <Unlock className="w-3.5 h-3.5" />}
                <span>Unblock Cultivator</span>
              </button>
            ) : !showBlockReasonInput ? (
              <button
                type="button"
                onClick={() => setShowBlockReasonInput(true)}
                disabled={isProcessing}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#FEE2E2] border border-[#FCA5A5] px-3.5 py-2 text-xs font-medium text-[#DC2626] hover:bg-[#FEE2E2] transition-colors cursor-pointer disabled:opacity-50"
              >
                <Lock className="w-3.5 h-3.5 text-[#DC2626]" />
                <span>Block Cultivator</span>
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </Modal>
  );
}
