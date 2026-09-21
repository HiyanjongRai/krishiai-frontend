"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Sprout,
  Check,
  X,
  User,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { useConsultation } from '@/hooks/useConsultation';
import { ChatWindow } from '@/components/messaging';
import { UserAvatar } from '@/components/ui/avatar';

export default function ExpertConsultationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const consultationId = Number(params?.id);

  const {
    consultation,
    isLoading,
    actionLoading,
    error,
    accept,
    reject,
    complete,
  } = useConsultation(consultationId);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#2E7D32]" />
        <p className="text-xs text-[#6B7280]">Loading inquiry details...</p>
      </div>
    );
  }

  if (error || !consultation) {
    return (
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 text-center max-w-lg mx-auto mt-12">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
        <h2 className="text-base font-bold text-[#1F2937]">Inquiry Not Found</h2>
        <p className="text-xs text-[#6B7280] mt-1 mb-4">
          {error ?? 'Unable to find this consultation session.'}
        </p>
        <Link
          href="/expert/consultations"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2E7D32] text-white text-xs font-semibold hover:bg-[#1B5E20] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Inquiries
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
            href="/expert/consultations"
            className="p-2 rounded-xl bg-white border border-[#E5E7EB] text-[#4B5563] hover:text-[#1F2937] hover:bg-[#F3F4F6] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-[#1F2937]">
                {consultation.subject || `Inquiry #${consultation.id}`}
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
              Farmer: {consultation.farmer.fullName}
            </p>
          </div>
        </div>

        {consultation.conversationId && (
          <Link
            href={`/expert/messages?id=${consultation.conversationId}`}
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
            otherParticipant={consultation.farmer}
            onCompleteConsultation={complete}
            consultationActionLoading={actionLoading}
          />
        </div>
      ) : consultation.status === 'PAYMENT_PENDING' ? (
        /* Awaiting Farmer Payment State */
        <div className="bg-white rounded-2xl border border-amber-200 p-6 sm:p-8 shadow-xs max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-[#EEF0EE]">
            <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1F2937]">
                Inquiry Accepted &bull; Awaiting Farmer Payment
              </h2>
              <p className="text-xs text-[#6B7280]">
                Farmer: {consultation.farmer.fullName}
              </p>
            </div>
          </div>

          <div className="bg-amber-50/70 rounded-xl p-4 border border-amber-200/80 text-xs space-y-2 text-amber-900">
            <p className="font-semibold text-amber-950">
              You have accepted this consultation request!
            </p>
            <p className="text-amber-800 leading-relaxed">
              The farmer has been notified to complete the payment of{' '}
              <strong className="text-amber-950 font-bold">
                {consultation.currency ?? 'NPR'} {consultation.priceAtPurchase ?? 0}
              </strong>
              . As soon as the farmer verifies payment via eSewa, live messaging and document sharing will open here automatically.
            </p>
          </div>

          {/* Inquiry Details */}
          <div className="space-y-3 text-xs">
            <div className="bg-[#F9FAFB] rounded-xl p-4 space-y-2.5 border border-[#E5E7EB]">
              <div>
                <span className="font-semibold text-[#374151] block mb-0.5">Subject:</span>
                <span className="text-sm font-medium text-[#1F2937]">
                  {consultation.subject}
                </span>
              </div>

              {consultation.cropName && (
                <div className="flex items-center gap-1.5 text-[#2E7D32] font-semibold pt-1">
                  <Sprout className="w-4 h-4" /> Crop: {consultation.cropName}
                </div>
              )}

              {consultation.description && (
                <div className="pt-2 border-t border-[#EEF0EE]">
                  <span className="font-semibold text-[#374151] block mb-1">
                    Farmer Notes:
                  </span>
                  <p className="text-[#4B5563] leading-relaxed whitespace-pre-wrap">
                    {consultation.description}
                  </p>
                </div>
              )}

              <div className="flex items-center gap-2 text-[#9CA3AF] pt-2">
                <Calendar className="w-3.5 h-3.5" />
                Submitted on{' '}
                {new Date(consultation.createdAt).toLocaleString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#EEF0EE]">
            <Link
              href="/expert/consultations"
              className="text-xs text-[#6B7280] hover:text-[#1F2937] font-medium"
            >
              &larr; Back to Consultation Inquiries
            </Link>
            <span className="text-[11px] text-amber-700 font-medium bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Awaiting Farmer Checkout
            </span>
          </div>
        </div>
      ) : (
        /* Pending Request Decision State */
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 sm:p-8 shadow-xs max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-[#EEF0EE]">
            <UserAvatar
              src={consultation.farmer.profileImageUrl}
              name={consultation.farmer.fullName}
              size="lg"
            />
            <div>
              <h2 className="text-base font-bold text-[#1F2937]">
                {consultation.farmer.fullName}
              </h2>
              <p className="text-xs text-[#6B7280]">Farmer Consultation Request</p>
            </div>
          </div>

          {/* Inquiry Details */}
          <div className="space-y-3 text-xs">
            <div className="bg-[#F9FAFB] rounded-xl p-4 space-y-2.5 border border-[#E5E7EB]">
              <div>
                <span className="font-semibold text-[#374151] block mb-0.5">Subject:</span>
                <span className="text-sm font-medium text-[#1F2937]">
                  {consultation.subject}
                </span>
              </div>

              {consultation.cropName && (
                <div className="flex items-center gap-1.5 text-[#2E7D32] font-semibold pt-1">
                  <Sprout className="w-4 h-4" /> Crop: {consultation.cropName}
                </div>
              )}

              {consultation.description && (
                <div className="pt-2 border-t border-[#EEF0EE]">
                  <span className="font-semibold text-[#374151] block mb-1">
                    Farmer Notes:
                  </span>
                  <p className="text-[#4B5563] leading-relaxed whitespace-pre-wrap">
                    {consultation.description}
                  </p>
                </div>
              )}

              <div className="flex items-center gap-2 text-[#9CA3AF] pt-2">
                <Calendar className="w-3.5 h-3.5" />
                Submitted on{' '}
                {new Date(consultation.createdAt).toLocaleString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              disabled={actionLoading}
              onClick={reject}
              className="px-4 py-2 rounded-xl bg-white border border-red-200 hover:bg-red-50 text-red-600 text-xs font-semibold transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" /> Decline Request
            </button>
            <button
              type="button"
              disabled={actionLoading}
              onClick={accept}
              className="px-5 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
            >
              {actionLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Accepting...
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" /> Accept & Start Chat
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
