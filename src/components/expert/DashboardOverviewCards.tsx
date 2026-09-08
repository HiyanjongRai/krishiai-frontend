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
      <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-emerald-300 hover:shadow-sm transition-all">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-100">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md uppercase tracking-wide">
            Active
          </div>
        </div>
        <div className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-0.5">
          Account Status
        </div>
        <div className="text-lg font-bold text-slate-900 mb-2">Active</div>
        <div className="text-xs text-slate-600 leading-relaxed">
          Your account is active and ready to use.
        </div>
      </div>

      {/* Verification Status Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-amber-300 hover:shadow-sm transition-all">
        <div className="flex items-start justify-between mb-3">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-xl ${
              verificationStatus === "APPROVED"
                ? "bg-emerald-100"
                : "bg-amber-100"
            }`}
          >
            {verificationStatus === "APPROVED" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <Clock className="w-5 h-5 text-amber-600" />
            )}
          </div>
          <div
            className={`text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wide ${
              verificationStatus === "APPROVED"
                ? "text-emerald-700 bg-emerald-50"
                : "text-amber-700 bg-amber-50"
            }`}
          >
            {verificationStatus === "APPROVED" ? "Verified" : "Pending"}
          </div>
        </div>
        <div className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-0.5">
          Professional Verification
        </div>
        <div className="text-lg font-bold text-slate-900 mb-2 capitalize">
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
        <div className="text-xs text-slate-600 leading-relaxed">
          {verificationStatus === "APPROVED"
            ? "Professional credentials verified"
            : "Admin team is reviewing your credentials"}
        </div>
      </div>

      {/* Expertise Areas Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-emerald-300 hover:shadow-sm transition-all group">
        <Link href="/expert/expertise" className="block h-full">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-100">
              <Leaf className="w-5 h-5 text-emerald-600" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
          </div>
          <div className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-0.5">
            Expertise Areas
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-2">
            {expertiseCount}
          </div>
          <div className="text-xs text-slate-600 leading-relaxed">
            Areas of expertise submitted
          </div>
        </Link>
      </div>

      {/* Profile Completion Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-sm transition-all group">
        <Link href="/expert/profile" className="block h-full">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md uppercase tracking-wide">
              {profileCompletionPercentage}%
            </div>
          </div>
          <div className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-0.5">
            Profile Completion
          </div>
          <div className="mb-3">
            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                style={{ width: `${profileCompletionPercentage}%` }}
              />
            </div>
            <div className="text-xs text-slate-600">
              {profileCompletionPercentage}% complete
            </div>
          </div>
          <div className="text-xs text-slate-600 leading-relaxed">
            Complete your profile to help verification
          </div>
        </Link>
      </div>
    </div>
  );
}
