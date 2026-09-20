"use client";

import React from "react";
import {
  CheckCircle2,
  Clock,
  Leaf,
  User,
  ArrowRight,
  AlertCircle,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { ExpertAccountStatus, VerificationStatus } from "@/types/expert-verification";

interface OverviewCardsProps {
  accountStatus: ExpertAccountStatus;
  verificationStatus: VerificationStatus;
  expertiseCount: number;
  profileCompletionPercentage: number;
}

export function DashboardOverviewCards({
  accountStatus,
  verificationStatus,
  expertiseCount,
  profileCompletionPercentage,
}: OverviewCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Account Status Card */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 hover:border-[#A5D6A7] hover:shadow-sm transition-all">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#E8F5E9]">
            <CheckCircle2 className="w-5 h-5 text-[#2E7D32]" />
          </div>
          <div className="text-[11px] font-bold text-[#2E7D32] bg-[#E8F5E9] px-2.5 py-1 rounded-md uppercase tracking-wide">
            Active
          </div>
        </div>
        <div className="text-xs font-bold text-[#4B5563] uppercase tracking-wide mb-0.5">
          Account Status
        </div>
        <div className="text-lg font-bold text-[#1F2937] mb-2">Active</div>
        <div className="text-xs text-[#4B5563] leading-relaxed">
          Your account is active and ready to use.
        </div>
      </div>

      {/* Verification Status Card */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 hover:border-[#FCD34D] hover:shadow-sm transition-all">
        <div className="flex items-start justify-between mb-3">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-xl ${
              verificationStatus === "APPROVED"
                ? "bg-[#E8F5E9]"
                : "bg-[#FEF3C7]"
            }`}
          >
            {verificationStatus === "APPROVED" ? (
              <CheckCircle2 className="w-5 h-5 text-[#2E7D32]" />
            ) : (
              <Clock className="w-5 h-5 text-[#F59E0B]" />
            )}
          </div>
          <div
            className={`text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wide ${
              verificationStatus === "APPROVED"
                ? "text-[#2E7D32] bg-[#E8F5E9]"
                : "text-[#F59E0B] bg-[#FEF3C7]"
            }`}
          >
            {verificationStatus === "APPROVED" ? "Verified" : "Pending"}
          </div>
        </div>
        <div className="text-xs font-bold text-[#4B5563] uppercase tracking-wide mb-0.5">
          Professional Verification
        </div>
        <div className="text-lg font-bold text-[#1F2937] mb-2 capitalize">
          {verificationStatus === "APPROVED"
            ? "Verified"
            : verificationStatus === "UNDER_REVIEW"
              ? "Under Review"
              : verificationStatus === "ADDITIONAL_INFO_REQUIRED"
                ? "Additional Info Needed"
                : verificationStatus === "REJECTED"
                  ? "Rejected"
                  : "Pending"}
        </div>
        <div className="text-xs text-[#4B5563] leading-relaxed">
          {verificationStatus === "APPROVED"
            ? "Professional credentials verified"
            : "Admin team is reviewing your credentials"}
        </div>
      </div>

      {/* Expertise Areas Card */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 hover:border-[#A5D6A7] hover:shadow-sm transition-all group">
        <Link href="/expert/expertise" className="block h-full">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#E8F5E9]">
              <Leaf className="w-5 h-5 text-[#2E7D32]" />
            </div>
            <ArrowRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#2E7D32] transition-colors" />
          </div>
          <div className="text-xs font-bold text-[#4B5563] uppercase tracking-wide mb-0.5">
            Expertise Areas
          </div>
          <div className="text-3xl font-bold text-[#1F2937] mb-2">
            {expertiseCount}
          </div>
          <div className="text-xs text-[#4B5563] leading-relaxed">
            Areas of expertise submitted
          </div>
        </Link>
      </div>

      {/* Profile Completion Card */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 hover:border-[#93C5FD] hover:shadow-sm transition-all group">
        <Link href="/expert/profile" className="block h-full">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#DBEAFE]">
              <User className="w-5 h-5 text-[#2563EB]" />
            </div>
            <div className="text-[11px] font-bold text-[#2563EB] bg-[#DBEAFE] px-2.5 py-1 rounded-md uppercase tracking-wide">
              {profileCompletionPercentage}%
            </div>
          </div>
          <div className="text-xs font-bold text-[#4B5563] uppercase tracking-wide mb-0.5">
            Profile Completion
          </div>
          <div className="mb-3">
            {/* Progress Bar */}
            <div className="w-full h-2 bg-[#F1F5F2] rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-gradient-to-r from-[#DBEAFE]0 to-[#DBEAFE] transition-all"
                style={{ width: `${profileCompletionPercentage}%` }}
              />
            </div>
            <div className="text-xs text-[#4B5563]">
              {profileCompletionPercentage}% complete
            </div>
          </div>
          <div className="text-xs text-[#4B5563] leading-relaxed">
            Complete your profile to help verification
          </div>
        </Link>
      </div>
    </div>
  );
}
