"use client";

import React from "react";
import { AlertCircle, CheckCircle2, Clock, X } from "lucide-react";
import Link from "next/link";
import { ExpertAccountStatus, VerificationStatus } from "@/types/expert-verification";

interface VerificationBannerProps {
  status: VerificationStatus;
  onDismiss?: () => void;
  accountStatus: ExpertAccountStatus;
  submittedAt?: string;
}

export function VerificationBanner({
  status,
  onDismiss,
  accountStatus,
}: VerificationBannerProps) {
  // For PENDING and UNDER_REVIEW states
  if (status === "PENDING" || status === "UNDER_REVIEW") {
    return (
      <div className="bg-gradient-to-r from-[#FEF3C7] to-[#FEF3C7] border border-[#FCD34D] rounded-2xl p-4 sm:p-6 mb-6">
        <div className="flex gap-4">
          {/* Icon */}
          <div className="flex-shrink-0 mt-0.5">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-[#FEF3C7]">
              <Clock className="h-5 w-5 text-[#F59E0B] animate-pulse" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-base font-semibold text-[#F59E0B] mb-1">
                  ⏳ Expertise Verification Pending
                </h3>
                <p className="text-sm text-[#F59E0B] mb-3">
                  Your professional credentials and selected expertise are currently being reviewed by the KrishiAI admin team.
                </p>

                {/* Key Status Info */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-white/60 backdrop-blur-xs rounded-lg p-3 border border-[#FCD34D]">
                    <div className="text-[11px] font-bold text-[#F59E0B] uppercase tracking-wide">
                      Account Status
                    </div>
                    <div className="text-sm font-semibold text-[#2E7D32] flex items-center gap-1.5 mt-1">
                      <CheckCircle2 className="h-4 w-4" />
                      Active
                    </div>
                  </div>
                  <div className="bg-white/60 backdrop-blur-xs rounded-lg p-3 border border-[#FCD34D]">
                    <div className="text-[11px] font-bold text-[#F59E0B] uppercase tracking-wide">
                      Professional Verification
                    </div>
                    <div className="text-sm font-semibold text-[#F59E0B] flex items-center gap-1.5 mt-1">
                      <Clock className="h-4 w-4" />
                      Pending
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[#F59E0B] mb-3">
                  Your account is active. You can manage your profile, expertise, and documents while verification is in progress.
                </p>
              </div>

              {/* Close Button */}
              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className="flex-shrink-0 text-[#F59E0B] hover:text-[#F59E0B] transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* CTA Button */}
            <Link
              href="/expert/application"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2.5 bg-[#FEF3C7] hover:bg-[#FEF3C7] text-white text-sm font-semibold rounded-lg transition-colors"
            >
              View Verification Status
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // For ADDITIONAL_INFO_REQUIRED
  if (status === "ADDITIONAL_INFO_REQUIRED") {
    return (
      <div className="bg-gradient-to-r from-[#DBEAFE] to-[#DBEAFE] border border-[#93C5FD] rounded-2xl p-4 sm:p-6 mb-6">
        <div className="flex gap-4">
          <div className="flex-shrink-0 mt-0.5">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-[#DBEAFE]">
              <AlertCircle className="h-5 w-5 text-[#2563EB]" />
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-base font-semibold text-[#2563EB] mb-1">
              ⚠️ Additional Information Required
            </h3>
            <p className="text-sm text-[#2563EB] mb-3">
              Our verification team needs additional information before your professional expertise can be verified.
            </p>
            <Link
              href="/expert/application"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#DBEAFE] hover:bg-[#DBEAFE] text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Review Request
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // For REJECTED
  if (status === "REJECTED") {
    return (
      <div className="bg-gradient-to-r from-[#FEE2E2] to-[#FEE2E2] border border-[#FCA5A5] rounded-2xl p-4 sm:p-6 mb-6">
        <div className="flex gap-4">
          <div className="flex-shrink-0 mt-0.5">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-[#FEE2E2]">
              <AlertCircle className="h-5 w-5 text-[#DC2626]" />
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-base font-semibold text-[#DC2626] mb-1">
              Application Requires Changes
            </h3>
            <p className="text-sm text-[#DC2626] mb-3">
              Your application could not be verified in its current form. Please review the feedback and update your information.
            </p>
            <Link
              href="/expert/application"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FEE2E2] hover:bg-[#FEE2E2] text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Review & Update Application
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // For APPROVED
  if (status === "APPROVED") {
    return (
      <div className="bg-gradient-to-r from-[#E8F5E9] to-[#E8F5E9] border border-[#A5D6A7] rounded-2xl p-4 sm:p-6 mb-6">
        <div className="flex gap-4">
          <div className="flex-shrink-0 mt-0.5">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-[#E8F5E9]">
              <CheckCircle2 className="h-5 w-5 text-[#2E7D32]" />
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-base font-semibold text-[#2E7D32] mb-1">
              🟢 Verified Expert
            </h3>
            <p className="text-sm text-[#1B5E20] mb-3">
              Your professional expertise has been verified by KrishiAI. You can now provide professional agricultural guidance through the platform.
            </p>

            {/* Status Info */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white/60 backdrop-blur-xs rounded-lg p-3 border border-[#C8E6C9]">
                <div className="text-[11px] font-bold text-[#1B5E20] uppercase tracking-wide">
                  Account Status
                </div>
                <div className="text-sm font-semibold text-[#2E7D32] flex items-center gap-1.5 mt-1">
                  <CheckCircle2 className="h-4 w-4" />
                  Active
                </div>
              </div>
              <div className="bg-white/60 backdrop-blur-xs rounded-lg p-3 border border-[#C8E6C9]">
                <div className="text-[11px] font-bold text-[#1B5E20] uppercase tracking-wide">
                  Professional Verification
                </div>
                <div className="text-sm font-semibold text-[#2E7D32] flex items-center gap-1.5 mt-1">
                  <CheckCircle2 className="h-4 w-4" />
                  Verified
                </div>
              </div>
            </div>

            <p className="text-xs text-[#1B5E20]">
              You can now access verified expert features and appear as a verified agricultural advisor on the platform.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
