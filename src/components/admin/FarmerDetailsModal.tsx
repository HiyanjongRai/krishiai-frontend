"use client";

import React, { useState } from "react";
import {
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Sprout,
  Bot,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Lock,
  Unlock,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/providers/toast-provider";
import { getApiErrorMessage } from "@/lib/toast-utils";
import { adminService } from "@/services/admin";
import type { FarmerSummary } from "@/types/admin";

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
      <div className="space-y-5 pt-1">
        {/* Top Profile Header */}
        <div className="flex items-center gap-4 rounded-2xl bg-gray-50/70 p-4 border border-gray-100">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0F9F68] text-base font-black text-white shadow-sm">
            {farmer.fullName
              .split(" ")
              .map((p) => p[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm font-bold text-[#171717] truncate">{farmer.fullName}</h4>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                  isBlocked
                    ? "bg-rose-50 text-rose-700 border-rose-200"
                    : farmer.status.toUpperCase() === "ACTIVE"
                    ? "bg-[#DDF4EA] text-[#0F9F68] border-[#BCE9D5]"
                    : "bg-amber-50 text-amber-700 border-amber-200"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isBlocked ? "bg-rose-500" : farmer.status.toUpperCase() === "ACTIVE" ? "bg-[#0F9F68]" : "bg-amber-500"
                  }`}
                />
                {farmer.status}
              </span>
            </div>
            <p className="text-xs text-gray-500 truncate mt-0.5">{farmer.email}</p>
          </div>
        </div>

        {/* Informational Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-2xl border border-gray-100 bg-white p-3 shadow-2xs">
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              <Phone className="w-3.5 h-3.5 text-gray-400" /> Phone
            </span>
            <p className="mt-1 font-semibold text-gray-800">{farmer.phone || "Not provided"}</p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-3 shadow-2xs">
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              <MapPin className="w-3.5 h-3.5 text-gray-400" /> Farm Location
            </span>
            <p className="mt-1 font-semibold text-gray-800">{farmer.location || "Not specified"}</p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-3 shadow-2xs">
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              <Sprout className="w-3.5 h-3.5 text-[#0F9F68]" /> Plotted Crops
            </span>
            <p className="mt-1 font-bold text-gray-900">{farmer.cropsCount ?? 0} active plantings</p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-3 shadow-2xs">
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              <Bot className="w-3.5 h-3.5 text-blue-600" /> AI Diagnoses
            </span>
            <p className="mt-1 font-bold text-gray-900">{farmer.aiAnalysesCount ?? 0} scans resolved</p>
          </div>
        </div>

        {/* Member status banner */}
        {isBlocked ? (
          <div className="flex items-start gap-2.5 rounded-2xl bg-rose-50 border border-rose-200 p-3.5 text-xs text-rose-900">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Account is currently blocked</p>
              <p className="text-[11px] text-rose-700 mt-0.5">
                The cultivator cannot authenticate, initiate AI leaf scans, or access their crop records.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-2.5 rounded-2xl bg-[#DDF4EA]/50 border border-[#BCE9D5] p-3 text-xs text-[#0F9F68]">
            <ShieldCheck className="w-4 h-4 text-[#0F9F68] shrink-0 mt-0.5" />
            <p className="text-[11px] font-medium text-emerald-900">
              Account in good standing with access to agricultural AI models and consultations.
            </p>
          </div>
        )}

        {/* Moderation Block Reason Input */}
        {showBlockReasonInput && !isBlocked && (
          <div className="space-y-2 rounded-2xl bg-amber-50/70 border border-amber-200 p-3.5 animate-in fade-in duration-150">
            <label className="block text-xs font-bold text-amber-900">
              Reason for Blocking Account
            </label>
            <input
              type="text"
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              placeholder="e.g. Terms violation, abusive behavior..."
              className="h-9 w-full rounded-xl border border-amber-300 bg-white px-3 text-xs text-gray-900 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
            />
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowBlockReasonInput(false)}
                disabled={isProcessing}
                className="rounded-lg px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-amber-100/50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBlockFarmer}
                disabled={isProcessing}
                className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1 text-xs font-bold text-white hover:bg-rose-700 shadow-2xs"
              >
                {isProcessing ? <LoadingSpinner size="xs" color="white" /> : <Lock className="w-3 h-3" />}
                <span>Confirm Block</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            {isBlocked ? (
              <button
                type="button"
                onClick={handleUnblockFarmer}
                disabled={isProcessing}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#0F9F68] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#0D8A5A] transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {isProcessing ? <LoadingSpinner size="xs" color="white" /> : <Unlock className="w-3.5 h-3.5" />}
                <span>Unblock Cultivator</span>
              </button>
            ) : !showBlockReasonInput ? (
              <button
                type="button"
                onClick={() => setShowBlockReasonInput(true)}
                disabled={isProcessing}
                className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200 px-4 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              >
                <Lock className="w-3.5 h-3.5 text-rose-600" />
                <span>Block Cultivator</span>
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </Modal>
  );
}
