/**
 * Expert Application Status Page
 * Redesigned with admin dashboard design tokens for consistency.
 */

"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  FileText,
  User,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { VerificationStatus } from "@/types/expert-verification";


interface ApplicationTimeline {
  stage: string;
  status: "completed" | "current" | "pending";
  date?: string;
  description: string;
  icon: React.ReactNode;
}

export default function ExpertApplicationPage() {
  const [applicationData] = useState({
    applicationId: "APP-2024-001234",
    submittedAt: "January 15, 2024",
    lastUpdated: "January 18, 2024",
    currentStatus: "UNDER_REVIEW" as VerificationStatus,
    estimatedCompletionDate: "February 15, 2024",

    submittedExpertise: [
      { name: "Tomato", category: "CROP", status: "PENDING" },
      { name: "Potato", category: "CROP", status: "PENDING" },
      { name: "Pest Management", category: "PROFESSIONAL_EXPERTISE", status: "PENDING" },
    ],

    submittedDocuments: [
      { name: "B.Sc. Agriculture Certificate", status: "VERIFIED", verifiedAt: "January 17, 2024" },
      { name: "Training Certificate - IPM", status: "PENDING" },
      { name: "Experience Letter", status: "PENDING" },
    ],

    adminNotes: "Application is under review. All documents received. Expertise verification in progress.",
  });

  const getStatusConfig = (status: VerificationStatus) => {
    switch (status) {
      case "APPROVED":
        return { icon: <CheckCircle2 className="w-5 h-5" />, label: "Approved", cardClass: "border-[#BCE9D5] bg-[#DDF4EA]", textClass: "text-[#0F9F68]" };
      case "REJECTED":
        return { icon: <XCircle className="w-5 h-5" />, label: "Rejected", cardClass: "border-rose-200 bg-rose-50", textClass: "text-rose-700" };
      case "ADDITIONAL_INFO_REQUIRED":
        return { icon: <AlertCircle className="w-5 h-5" />, label: "Action Required", cardClass: "border-blue-200 bg-blue-50", textClass: "text-blue-700" };
      case "UNDER_REVIEW":
        return { icon: <Clock className="w-5 h-5" />, label: "Under Review", cardClass: "border-amber-200 bg-amber-50", textClass: "text-amber-700" };
      default:
        return { icon: <Clock className="w-5 h-5" />, label: "Pending", cardClass: "border-[rgba(234,234,236,0.85)] bg-[#F4F4F6]", textClass: "text-gray-500" };
    }
  };

  const statusConfig = getStatusConfig(applicationData.currentStatus);

  const timeline: ApplicationTimeline[] = [
    {
      stage: "Application Submitted",
      status: "completed",
      date: "Jan 15, 2024",
      description: "Your application and documents have been received",
      icon: <CheckCircle2 className="w-4 h-4 text-[#0F9F68]" />,
    },
    {
      stage: "Initial Review",
      status: "completed",
      date: "Jan 16, 2024",
      description: "Documents have been verified for completeness",
      icon: <CheckCircle2 className="w-4 h-4 text-[#0F9F68]" />,
    },
    {
      stage: "Expertise Verification",
      status: "current",
      description: "Your expertise areas are being reviewed",
      icon: <Clock className="w-4 h-4 text-amber-500" />,
    },
    {
      stage: "Professional Review",
      status: "pending",
      description: "Additional verification may be required",
      icon: <Clock className="w-4 h-4 text-gray-300" />,
    },
    {
      stage: "Final Approval",
      status: "pending",
      description: "Awaiting final decision from admin",
      icon: <Clock className="w-4 h-4 text-gray-300" />,
    },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Verification</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Application Status</h1>
        <p className="mt-0.5 text-xs text-slate-500 font-medium">Track the progress of your expert verification application.</p>
      </div>

      {/* Status Overview Card */}
      <div className={`rounded-xl border p-5 shadow-xs ${statusConfig.cardClass}`}>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-1.5">
            <div className={`flex items-center gap-2 font-bold text-base ${statusConfig.textClass}`}>
              {statusConfig.icon}
              <span>{statusConfig.label}</span>
            </div>
            <p className="text-xs text-slate-600">
              Application ID: <span className="font-mono font-bold text-slate-900">{applicationData.applicationId}</span>
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "Submitted", value: applicationData.submittedAt },
            { label: "Last Updated", value: applicationData.lastUpdated },
            { label: "Est. Completion", value: applicationData.estimatedCompletionDate },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white/80 rounded-lg p-3 border border-slate-200/60 shadow-2xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">{label}</div>
              <div className="text-xs font-bold text-slate-900">{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Admin Notes */}
      {applicationData.adminNotes && (
        <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-blue-900 mb-0.5">Reviewer Notes</h3>
              <p className="text-xs text-blue-800 leading-relaxed">{applicationData.adminNotes}</p>
            </div>
          </div>
        </div>
      )}

      {/* Two-column: Timeline + Expertise/Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Timeline */}
        <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Verification Journey</h2>
          <div className="space-y-1">
            {timeline.map((item, index) => (
              <div key={index} className="flex gap-3 pb-4 relative last:pb-0">
                {/* Connector line */}
                {index < timeline.length - 1 && (
                  <div
                    className={`absolute left-[13px] top-7 w-px h-5 ${
                      item.status === "completed" ? "bg-emerald-600" : item.status === "current" ? "bg-amber-400" : "bg-slate-200"
                    }`}
                  />
                )}
                {/* Icon */}
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 border ${
                  item.status === "completed"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : item.status === "current"
                    ? "bg-amber-50 border-amber-200 text-amber-700"
                    : "bg-slate-50 border-slate-200 text-slate-300"
                }`}>
                  {item.icon}
                </div>
                {/* Content */}
                <div className="flex-1 pt-0.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xs font-bold text-slate-900">{item.stage}</h3>
                    {item.date && <span className="text-[10px] font-medium text-slate-400 shrink-0">{item.date}</span>}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{item.description}</p>
                  {item.status === "current" && (
                    <span className="mt-1.5 inline-flex px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[10px] font-semibold border border-amber-200">
                      In Progress
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: Expertise + Documents */}
        <div className="lg:col-span-7 space-y-5">
          {/* Submitted Expertise */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
              <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <User className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-sm font-bold text-slate-900">Submitted Expertise</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {applicationData.submittedExpertise.map((expertise, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-slate-200 bg-slate-50/60 p-3 flex items-start justify-between hover:bg-slate-100/60 transition-colors"
                >
                  <div>
                    <div className="text-xs font-semibold text-slate-900">{expertise.name}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5 font-medium">
                      {expertise.category === "CROP" ? "Primary Crop" : "Professional Expertise"}
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                    Pending
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Submitted Documents */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
              <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <FileText className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-sm font-bold text-slate-900">Submitted Documents</h2>
            </div>
            <div className="space-y-2">
              {applicationData.submittedDocuments.map((doc, index) => (
                <div
                  key={index}
                  className={`rounded-lg border p-3 flex items-center justify-between ${
                    doc.status === "VERIFIED"
                      ? "border-emerald-200 bg-emerald-50/40"
                      : "border-slate-200 bg-slate-50/60"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className={`w-4 h-4 shrink-0 ${doc.status === "VERIFIED" ? "text-emerald-700" : "text-slate-400"}`} />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-900 truncate">{doc.name}</div>
                      {doc.verifiedAt && (
                        <div className="text-[10px] text-slate-500 font-medium">Verified on {doc.verifiedAt}</div>
                      )}
                    </div>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border shrink-0 ${
                    doc.status === "VERIFIED"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}>
                    {doc.status === "VERIFIED" ? "✓ Verified" : "Pending"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* What's Next */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">What&apos;s Next?</h3>
        </div>

        {applicationData.currentStatus === "UNDER_REVIEW" && (
          <>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              Your application is being reviewed by our agricultural administration team. We typically complete verification within 2–3 business days.
            </p>
            <div className="flex flex-wrap gap-2.5">
              <Link
                href="/expert/profile"
                className="px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-xs rounded-lg transition-colors shadow-2xs"
              >
                Update Profile
              </Link>
              <Link
                href="/expert/dashboard"
                className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs"
              >
                Return to Dashboard
              </Link>
            </div>
          </>
        )}

        {applicationData.currentStatus === "APPROVED" && (
          <>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              Congratulations! Your expert profile has been verified. You can now accept consultations from farmers across your crop domains.
            </p>
            <Link
              href="/expert/consultations"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs"
            >
              <span>View Consultations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </>
        )}

        {applicationData.currentStatus === "REJECTED" && (
          <>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              Your application was declined. Please review the reviewer feedback and resubmit your updated credentials.
            </p>
            <Link
              href="/expert/profile"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs"
            >
              <span>Update &amp; Resubmit</span>
            </Link>
          </>
        )}

        {applicationData.currentStatus === "ADDITIONAL_INFO_REQUIRED" && (
          <>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              Please provide the additional information or documents requested by our team to complete your verification.
            </p>
            <Link
              href="/expert/profile"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs"
            >
              <span>Provide Required Information</span>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
