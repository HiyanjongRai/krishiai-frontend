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
import { UserAvatar } from "@/components/ui/avatar";

import type { UserRole } from "@/types/auth";
import { Shield } from "lucide-react";

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
  const [selectedRole, setSelectedRole] = useState<UserRole>("ROLE_FARMER");
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  if (!isOpen || !farmer) return null;

  const isBlocked = farmer.status.toUpperCase() === "BLOCKED";

  const handleUpdateRole = async () => {
    setIsUpdatingRole(true);
    try {
      await adminService.updateUserRole(farmer.id, {
        role: selectedRole,
        reason: `Role changed to ${selectedRole} by admin`,
      });
      toast.success({
        title: "Role updated",
        description: `${farmer.fullName}'s role has been changed to ${selectedRole}.`,
      });
      if (onStatusChanged) onStatusChanged();
    } catch (err) {
      const msg = getApiErrorMessage(err, "Failed to update user role.");
      toast.error({ title: "Role update failed", description: msg });
    } finally {
      setIsUpdatingRole(false);
    }
  };

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
        <div className="flex items-center gap-3.5 rounded-xl bg-slate-50 p-4 border border-slate-200">
          <UserAvatar
            src={farmer.profileImage}
            name={farmer.fullName}
            size="md"
            className="shrink-0 ring-1 ring-slate-200"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm font-bold text-slate-900 truncate">{farmer.fullName}</h4>
              <span
                className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-semibold border ${
                  isBlocked
                    ? "bg-rose-50 text-rose-700 border-rose-200"
                    : farmer.status.toUpperCase() === "ACTIVE"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isBlocked ? "bg-rose-500" : farmer.status.toUpperCase() === "ACTIVE" ? "bg-emerald-600" : "bg-amber-500"
                  }`}
                />
                {farmer.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 truncate mt-0.5">{farmer.email}</p>
          </div>
        </div>

        {/* Informational Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
            <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone
            </span>
            <p className="mt-1 font-medium text-slate-800">{farmer.phone || "Not provided"}</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
            <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> Farm Location
            </span>
            <p className="mt-1 font-medium text-slate-800">{farmer.location || "Not specified"}</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
            <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              <Sprout className="w-3.5 h-3.5 text-emerald-600" /> Plotted Crops
            </span>
            <p className="mt-1 font-semibold text-slate-900">{farmer.cropsCount ?? 0} active plantings</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
            <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              <Bot className="w-3.5 h-3.5 text-blue-600" /> AI Diagnoses
            </span>
            <p className="mt-1 font-semibold text-slate-900">{farmer.aiAnalysesCount ?? 0} scans resolved</p>
          </div>
        </div>

        {/* Member status banner */}
        {isBlocked ? (
          <div className="flex items-start gap-2.5 rounded-xl bg-rose-50 border border-rose-200 p-3.5 text-xs text-rose-900">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-rose-900">Account is currently suspended</p>
              <p className="text-[11px] text-rose-700 mt-0.5">
                The cultivator cannot authenticate, initiate AI crop scans, or access field records.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200 p-3 text-xs text-emerald-900">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-[11px] font-medium text-emerald-800">
              Account in good standing with active access to advisory and diagnostic tools.
            </p>
          </div>
        )}

        {/* Role Authorization Control */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-slate-500" /> Platform Role
            </span>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              Authority Tier
            </span>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRole)}
              className="flex-1 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-emerald-600"
            >
              <option value="ROLE_FARMER">Farmer (ROLE_FARMER)</option>
              <option value="ROLE_EXPERT">Expert Specialist (ROLE_EXPERT)</option>
              <option value="ROLE_ADMIN">Administrator (ROLE_ADMIN)</option>
            </select>
            <button
              type="button"
              onClick={handleUpdateRole}
              disabled={isUpdatingRole}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer shrink-0 shadow-2xs"
            >
              {isUpdatingRole ? "Updating..." : "Update Role"}
            </button>
          </div>
        </div>

        {/* Moderation Block Reason Input */}
        {showBlockReasonInput && !isBlocked && (
          <div className="space-y-2 rounded-xl bg-amber-50/70 border border-amber-200 p-3.5 animate-in fade-in duration-150">
            <label className="block text-xs font-semibold text-amber-900">
              Reason for Blocking Account
            </label>
            <input
              type="text"
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              placeholder="e.g. Terms violation, abusive behavior..."
              className="h-9 w-full rounded-lg border border-amber-300 bg-white px-3 text-xs text-slate-900 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
            />
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowBlockReasonInput(false)}
                disabled={isProcessing}
                className="rounded-lg px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-amber-100/60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBlockFarmer}
                disabled={isProcessing}
                className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1 text-xs font-semibold text-white hover:bg-rose-700 shadow-xs"
              >
                {isProcessing ? <LoadingSpinner size="xs" color="white" /> : <Lock className="w-3 h-3" />}
                <span>Confirm Block</span>
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-xs"
          >
            Close
          </button>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {isBlocked ? (
              <button
                type="button"
                onClick={handleUnblockFarmer}
                disabled={isProcessing}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? <LoadingSpinner size="xs" color="white" /> : <Unlock className="w-3.5 h-3.5" />}
                <span>Unblock Cultivator</span>
              </button>
            ) : !showBlockReasonInput ? (
              <button
                type="button"
                onClick={() => setShowBlockReasonInput(true)}
                disabled={isProcessing}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-rose-50 border border-rose-200 px-3.5 py-2 text-xs font-medium text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer disabled:opacity-50"
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
