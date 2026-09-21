"use client";

import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Check,
  X,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import type { ConsultationDetailDto } from '@/types/messaging';
import { useAuth } from '@/providers/auth-provider';

interface ConsultationStatusBannerProps {
  consultation: ConsultationDetailDto;
  onAccept?: () => Promise<unknown>;
  onReject?: () => Promise<unknown>;
  onComplete?: () => Promise<unknown>;
  onCancel?: () => Promise<unknown>;
  actionLoading?: boolean;
}


export function ConsultationStatusBanner({
  consultation,
  onAccept,
  onReject,
  onComplete,
  onCancel,
  actionLoading = false,
}: ConsultationStatusBannerProps) {
  const { user } = useAuth();
  const isExpert = user?.role === 'ROLE_EXPERT';
  const isFarmer = user?.role === 'ROLE_FARMER';
  const status = consultation.status;

  if (status === 'COMPLETED') {
    return (
      <div className="flex items-center gap-2.5 px-4 py-2.5 bg-[#E8F5E9] border-b border-[#C8E6C9] text-xs text-[#2E7D32]">
        <CheckCircle2 className="w-4 h-4 shrink-0 text-[#2E7D32]" />
        <span className="font-medium">
          This consultation was completed. Discussion history is archived for reference.
        </span>
      </div>
    );
  }

  if (status === 'EXPIRED') {
    return (
      <div className="flex items-center gap-2.5 px-4 py-2.5 bg-gray-100 border-b border-gray-300 text-xs text-[#4B5563]">
        <Clock className="w-4 h-4 shrink-0 text-gray-500" />
        <span className="font-medium">
          Consultation window has expired. Chat is in read-only archive mode.
        </span>
      </div>
    );
  }

  if (status === 'PAYMENT_PENDING') {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-amber-50 border-b border-amber-200 text-xs text-amber-900">
        <div className="flex items-center gap-2 min-w-0">
          <Clock className="w-4 h-4 shrink-0 text-amber-600 animate-pulse" />
          <span className="font-medium">
            {isFarmer
              ? `Expert accepted your request! Please complete eSewa payment of NPR ${consultation.priceAtPurchase ?? 'fee'} to unlock live messaging.`
              : `You accepted this consultation. Waiting for farmer payment of NPR ${consultation.priceAtPurchase ?? 'fee'} via eSewa before chat unlocks.`}
          </span>
        </div>

        {isFarmer && (
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={`/farmer/payments/${consultation.id}`}
              className="px-3.5 py-1.5 rounded-lg bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <span>Pay with eSewa</span>
            </a>
          </div>
        )}
      </div>
    );
  }

  if (status === 'REJECTED') {
    return (
      <div className="flex items-center gap-2.5 px-4 py-2.5 bg-red-50 border-b border-red-200 text-xs text-red-700">
        <XCircle className="w-4 h-4 shrink-0 text-red-600" />
        <span className="font-medium">
          This consultation request was declined by the expert.
        </span>
      </div>
    );
  }

  if (status === 'CANCELLED') {
    return (
      <div className="flex items-center gap-2.5 px-4 py-2.5 bg-gray-100 border-b border-gray-200 text-xs text-gray-700">
        <AlertCircle className="w-4 h-4 shrink-0 text-gray-500" />
        <span className="font-medium">
          This consultation was cancelled.
        </span>
      </div>
    );
  }

  if (status === 'REQUESTED' || status === 'PENDING') {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-amber-50 border-b border-amber-200 text-xs text-amber-900">
        <div className="flex items-center gap-2 min-w-0">
          <Clock className="w-4 h-4 shrink-0 text-amber-600 animate-pulse" />
          <span className="font-medium">
            {isExpert
              ? `Farmer ${consultation.farmer.fullName} has requested a consultation regarding ${consultation.cropName ?? 'a crop issue'}.`
              : `Consultation request is pending expert acceptance. You will be notified once accepted.`}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isExpert && onAccept && (
            <button
              type="button"
              disabled={actionLoading}
              onClick={onAccept}
              className="px-3 py-1.5 rounded-lg bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-semibold flex items-center gap-1 shadow-xs transition-colors disabled:opacity-50"
            >
              {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              Accept
            </button>
          )}

          {isExpert && onReject && (
            <button
              type="button"
              disabled={actionLoading}
              onClick={onReject}
              className="px-3 py-1.5 rounded-lg bg-white border border-red-200 hover:bg-red-50 text-red-700 font-medium flex items-center gap-1 transition-colors disabled:opacity-50"
            >
              <X className="w-3.5 h-3.5" />
              Decline
            </button>
          )}

          {isFarmer && onCancel && (
            <button
              type="button"
              disabled={actionLoading}
              onClick={onCancel}
              className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 hover:bg-amber-100 text-amber-800 font-medium transition-colors disabled:opacity-50"
            >
              Cancel Request
            </button>
          )}
        </div>
      </div>
    );
  }

  // Active
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-emerald-50 border-b border-emerald-200 text-xs text-emerald-900">
      <div className="flex items-center gap-2 min-w-0">
        <ShieldCheck className="w-4 h-4 shrink-0 text-[#2E7D32]" />
        <span className="font-medium">
          Consultation active • Live messaging unlocked
          {consultation.expiresAt && (
            <span className="text-[#047857] ml-1">
              (Expires: {new Date(consultation.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
            </span>
          )}
        </span>
      </div>

      {onComplete && (
        <button
          type="button"
          disabled={actionLoading}
          onClick={onComplete}
          className="px-3 py-1 rounded-lg bg-white border border-[#A5D6A7] hover:bg-[#E8F5E9] text-[#2E7D32] font-semibold flex items-center gap-1 shadow-xs transition-colors disabled:opacity-50"
        >
          {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
          Complete Consultation
        </button>
      )}
    </div>
  );
}
