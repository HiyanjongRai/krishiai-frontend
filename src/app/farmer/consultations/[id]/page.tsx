"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Sprout,
  ShieldCheck,
  User,
  AlertCircle,
  Loader2,
  CreditCard,
  CheckCircle2,
} from 'lucide-react';
import { useConsultation } from '@/hooks/useConsultation';
import { ChatWindow } from '@/components/messaging';
import { UserAvatar } from '@/components/ui/avatar';

export default function FarmerConsultationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const consultationId = Number(params?.id);

  const {
    consultation,
    isLoading,
    actionLoading,
    error,
    cancel,
    complete,
  } = useConsultation(consultationId);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#2E7D32]" />
        <p className="text-xs text-[#6B7280]">Loading consultation details...</p>
      </div>
    );
  }

  if (error || !consultation) {
    return (
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 text-center max-w-lg mx-auto mt-12">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
        <h2 className="text-base font-bold text-[#1F2937]">Consultation Not Found</h2>
        <p className="text-xs text-[#6B7280] mt-1 mb-4">
          {error ?? 'Unable to find this consultation session.'}
        </p>
        <Link
          href="/farmer/consultations"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2E7D32] text-white text-xs font-semibold hover:bg-[#1B5E20] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Consultations
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ─── Breadcrumbs & Header ────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Link
            href="/farmer/consultations"
            className="p-2 rounded-xl bg-white border border-[#E5E7EB] text-[#4B5563] hover:text-[#1F2937] hover:bg-[#F3F4F6] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-[#1F2937]">
                {consultation.subject || `Consultation #${consultation.id}`}
              </h1>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                  consultation.status === 'ACCEPTED' || consultation.status === 'ACTIVE'
                    ? 'bg-emerald-50 text-[#2E7D32] border-emerald-200'
                    : consultation.status === 'REQUESTED' || consultation.status === 'PENDING'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : consultation.status === 'COMPLETED'
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-gray-100 text-gray-600 border-gray-200'
                }`}
              >
                {consultation.status}
              </span>
            </div>
            <p className="text-xs text-[#6B7280]">
              Expert: {consultation.expert?.fullName ?? 'Assigned Agricultural Specialist'}
            </p>
          </div>
        </div>

        {consultation.conversationId && (
          <Link
            href={`/farmer/messages?id=${consultation.conversationId}`}
            className="text-xs font-medium text-[#2E7D32] hover:underline"
          >
            Open in Full Messages Hub →
          </Link>
        )}
      </div>

      {/* ─── Main Content ────────────────────────────────────────────────── */}
      {consultation.conversationId ? (
        <div className="h-[calc(100vh-220px)]">
          <ChatWindow
            conversationId={consultation.conversationId}
            consultation={consultation}
            otherParticipant={consultation.expert}
            onCompleteConsultation={complete}
            onCancelConsultation={cancel}
            consultationActionLoading={actionLoading}
          />
        </div>
      ) : consultation.status === 'PAYMENT_PENDING' ? (
        /* Payment Pending Checkout State */
        <div className="bg-white rounded-2xl border border-amber-300 p-6 sm:p-8 shadow-xs max-w-2xl mx-auto text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#2E7D32] mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-black text-[#1F2937]">
              Specialist Accepted! Complete Payment to Start
            </h2>
            <p className="text-xs text-[#6B7280] max-w-md mx-auto leading-relaxed">
              <strong className="text-[#1F2937]">
                {consultation.expert?.fullName ?? 'The specialist'}
              </strong>{' '}
              has reviewed and accepted your inquiry. Please proceed with payment of{' '}
              <span className="font-bold text-[#2E7D32]">
                {consultation.currency ?? 'NPR'} {consultation.priceAtPurchase ?? 0}
              </span>{' '}
              to activate live messaging, direct chat, and advisory.
            </p>
          </div>

          {/* Request Details Card */}
          <div className="bg-[#F9FAFB] rounded-xl p-4 text-left space-y-2 border border-[#E5E7EB] text-xs">
            <div>
              <span className="font-semibold text-[#374151]">Subject:</span>{' '}
              <span className="font-medium text-[#1F2937]">{consultation.subject}</span>
            </div>
            {consultation.cropName && (
              <div className="flex items-center gap-2 text-[#374151]">
                <Sprout className="w-4 h-4 text-[#2E7D32]" />
                <span className="font-semibold">Crop:</span> {consultation.cropName}
              </div>
            )}
            {consultation.description && (
              <div className="text-[#4B5563] pt-1">
                <span className="font-semibold text-[#374151]">Description:</span>{' '}
                {consultation.description}
              </div>
            )}
            <div className="flex items-center justify-between text-[#374151] pt-2 border-t border-[#EEF0EE]">
              <span className="font-semibold">Consultation Fee:</span>
              <span className="text-sm font-bold text-[#2E7D32]">
                {consultation.currency ?? 'NPR'} {consultation.priceAtPurchase ?? 0}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <Link
              href={`/farmer/payments/${consultation.id}`}
              className="px-6 py-3 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <CreditCard className="w-4 h-4" />
              <span>Pay {consultation.currency ?? 'NPR'} {consultation.priceAtPurchase ?? 0} via eSewa</span>
            </Link>
            <button
              type="button"
              disabled={actionLoading}
              onClick={cancel}
              className="px-4 py-3 rounded-xl bg-white border border-red-200 hover:bg-red-50 text-red-600 text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
            >
              {actionLoading ? 'Cancelling...' : 'Cancel Request'}
            </button>
          </div>
        </div>
      ) : (
        /* Pending Acceptance Waiting State */
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 sm:p-8 shadow-xs max-w-2xl mx-auto text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mx-auto">
            <Clock className="w-8 h-8 animate-pulse" />
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-bold text-[#1F2937]">
              Waiting for Expert Review
            </h2>
            <p className="text-xs text-[#6B7280] max-w-md mx-auto leading-relaxed">
              Your consultation request has been sent to{' '}
              <strong className="text-[#1F2937]">
                {consultation.expert?.fullName ?? 'the specialist'}
              </strong>
              . As soon as the expert accepts your inquiry, live chat and photo diagnostics will be enabled here automatically.
            </p>
          </div>

          {/* Request Details Card */}
          <div className="bg-[#F9FAFB] rounded-xl p-4 text-left space-y-2 border border-[#E5E7EB] text-xs">
            {consultation.cropName && (
              <div className="flex items-center gap-2 text-[#374151]">
                <Sprout className="w-4 h-4 text-[#2E7D32]" />
                <span className="font-semibold">Crop:</span> {consultation.cropName}
              </div>
            )}
            {consultation.description && (
              <div className="text-[#4B5563] pt-1">
                <span className="font-semibold text-[#374151]">Description:</span>{' '}
                {consultation.description}
              </div>
            )}
            <div className="flex items-center gap-2 text-[#9CA3AF] pt-1">
              <Calendar className="w-3.5 h-3.5" />
              Requested on{' '}
              {new Date(consultation.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-center gap-3 pt-2">
            <button
              type="button"
              disabled={actionLoading}
              onClick={cancel}
              className="px-4 py-2 rounded-xl bg-white border border-red-200 hover:bg-red-50 text-red-600 text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
            >
              {actionLoading ? 'Cancelling...' : 'Cancel Consultation Request'}
            </button>
            <Link
              href="/farmer/consultations"
              className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#374151] text-xs font-semibold transition-colors"
            >
              Back to Inquiries
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
