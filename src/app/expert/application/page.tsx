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
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#0F9F68]">Verification</p>
        <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-[#171717]">Application Status</h1>
        <p className="mt-1 text-sm text-gray-400">Track the progress of your expert verification application.</p>
      </div>

      {/* Status Overview Card */}
      <div className={`rounded-[28px] border p-6 sm:p-8 ${statusConfig.cardClass}`}>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-2">
            <div className={`flex items-center gap-2 font-black text-lg ${statusConfig.textClass}`}>
              {statusConfig.icon}
              <span>{statusConfig.label}</span>
            </div>
            <p className="text-xs text-gray-500">
              Application ID: <span className="font-mono font-bold text-[#171717]">{applicationData.applicationId}</span>
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "Submitted", value: applicationData.submittedAt },
            { label: "Last Updated", value: applicationData.lastUpdated },
            { label: "Est. Completion", value: applicationData.estimatedCompletionDate },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white/60 rounded-[16px] p-3 border border-white/80">
              <div className="text-[10px] font-black uppercase tracking-[0.12em] text-gray-400 mb-1">{label}</div>
              <div className="text-sm font-bold text-[#171717]">{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Admin Notes */}
      {applicationData.adminNotes && (
        <div className="rounded-[24px] border border-blue-200 bg-blue-50 p-5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-[12px] bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-blue-900 mb-1">Admin Notes</h3>
              <p className="text-sm text-blue-800">{applicationData.adminNotes}</p>
            </div>
          </div>
        </div>
      )}

      {/* Two-column: Timeline + Expertise/Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Timeline */}
        <div className="lg:col-span-5 rounded-[28px] border border-[rgba(234,234,236,0.85)] bg-white p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04),0_2px_6px_-1px_rgba(0,0,0,0.02)]">
          <h2 className="text-sm font-bold text-[#171717] mb-6">Verification Journey</h2>
          <div className="space-y-1">
            {timeline.map((item, index) => (
              <div key={index} className="flex gap-3 pb-5 relative last:pb-0">
                {/* Connector line */}
                {index < timeline.length - 1 && (
                  <div
                    className={`absolute left-[15px] top-8 w-px h-6 ${
                      item.status === "completed" ? "bg-[#0F9F68]" : item.status === "current" ? "bg-amber-400" : "bg-[rgba(234,234,236,0.85)]"
                    }`}
                  />
                )}
                {/* Icon */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 border ${
                  item.status === "completed"
                    ? "bg-[#DDF4EA] border-[#BCE9D5]"
                    : item.status === "current"
                    ? "bg-amber-50 border-amber-200"
                    : "bg-[#F4F4F6] border-[rgba(234,234,236,0.85)]"
                }`}>
                  {item.icon}
                </div>
                {/* Content */}
                <div className="flex-1 pt-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xs font-bold text-[#171717]">{item.stage}</h3>
                    {item.date && <span className="text-[10px] font-bold text-gray-400 shrink-0">{item.date}</span>}
                  </div>
                  <p className="text-[11px] text-gray-400 mt-0.5">{item.description}</p>
                  {item.status === "current" && (
                    <span className="mt-2 inline-flex px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold border border-amber-200">
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
          <div className="rounded-[28px] border border-[rgba(234,234,236,0.85)] bg-white p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04),0_2px_6px_-1px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-[12px] bg-[#DDF4EA] text-[#0F9F68] flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-[#171717]">Submitted Expertise</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {applicationData.submittedExpertise.map((expertise, index) => (
                <div
                  key={index}
                  className="rounded-[20px] border border-[rgba(234,234,236,0.85)] p-3.5 flex items-start justify-between hover:bg-[#F4F4F6]/50 transition-colors"
                >
                  <div>
                    <div className="text-sm font-bold text-[#171717]">{expertise.name}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">
                      {expertise.category === "CROP" ? "Primary Crop" : "Professional Expertise"}
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    Pending
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Submitted Documents */}
          <div className="rounded-[28px] border border-[rgba(234,234,236,0.85)] bg-white p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04),0_2px_6px_-1px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-[12px] bg-[#DDF4EA] text-[#0F9F68] flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-[#171717]">Submitted Documents</h2>
            </div>
            <div className="space-y-2.5">
              {applicationData.submittedDocuments.map((doc, index) => (
                <div
                  key={index}
                  className={`rounded-[20px] border p-3.5 flex items-center justify-between ${
                    doc.status === "VERIFIED"
                      ? "border-[#BCE9D5] bg-[#DDF4EA]/30"
                      : "border-[rgba(234,234,236,0.85)] bg-[#F4F4F6]/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FileText className={`w-4 h-4 shrink-0 ${doc.status === "VERIFIED" ? "text-[#0F9F68]" : "text-gray-400"}`} />
                    <div>
                      <div className="text-sm font-bold text-[#171717]">{doc.name}</div>
                      {doc.verifiedAt && (
                        <div className="text-[10px] text-gray-400">Verified on {doc.verifiedAt}</div>
                      )}
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                    doc.status === "VERIFIED"
                      ? "bg-[#DDF4EA] text-[#0F9F68] border-[#BCE9D5]"
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
      <div className="rounded-[28px] border border-[#BCE9D5] bg-gradient-to-br from-[#DDF4EA]/60 to-white p-6 shadow-[0_4px_20px_-2px_rgba(15,159,104,0.08)]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-[12px] bg-[#DDF4EA] text-[#0F9F68] flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-[#171717]">What&apos;s Next?</h3>
        </div>

        {applicationData.currentStatus === "UNDER_REVIEW" && (
          <>
            <p className="text-sm text-gray-500 mb-4">
              Your application is being reviewed. We typically complete verification within 7–10 business days.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/expert/profile"
                className="px-5 py-2.5 bg-white border border-[rgba(234,234,236,0.85)] hover:bg-[#F4F4F6] text-[#171717] font-bold text-sm rounded-full transition-colors"
              >
                Update Profile
              </Link>
              <button
                onClick={() => alert("Feature coming soon: Contact support")}
                className="px-5 py-2.5 bg-[#0F9F68] hover:bg-[#0D8A5A] text-white font-bold text-sm rounded-full transition-colors shadow-[0_4px_12px_rgba(15,159,104,0.25)] cursor-pointer"
              >
                Contact Support
              </button>
            </div>
          </>
        )}

        {applicationData.currentStatus === "APPROVED" && (
          <>
            <p className="text-sm text-gray-500 mb-4">
              Congratulations! Your expert profile has been verified. You can now accept consultations from farmers.
            </p>
            <Link
              href="/expert/consultations"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0F9F68] hover:bg-[#0D8A5A] text-white font-bold text-sm rounded-full transition-colors shadow-[0_4px_12px_rgba(15,159,104,0.25)]"
            >
              <ArrowRight className="w-4 h-4" />
              View Consultations
            </Link>
          </>
        )}

        {applicationData.currentStatus === "REJECTED" && (
          <>
            <p className="text-sm text-gray-500 mb-4">
              Your application was not approved. Please review the feedback and resubmit if applicable.
            </p>
            <button
              onClick={() => alert("Feature coming soon: Resubmit application")}
              className="px-5 py-2.5 bg-[#0F9F68] hover:bg-[#0D8A5A] text-white font-bold text-sm rounded-full transition-colors shadow-[0_4px_12px_rgba(15,159,104,0.25)] cursor-pointer"
            >
              Resubmit Application
            </button>
          </>
        )}

        {applicationData.currentStatus === "ADDITIONAL_INFO_REQUIRED" && (
          <>
            <p className="text-sm text-gray-500 mb-4">
              Please provide the additional information requested by our team to complete your verification.
            </p>
            <button
              onClick={() => alert("Feature coming soon: Provide additional info")}
              className="px-5 py-2.5 bg-[#0F9F68] hover:bg-[#0D8A5A] text-white font-bold text-sm rounded-full transition-colors shadow-[0_4px_12px_rgba(15,159,104,0.25)] cursor-pointer"
            >
              Provide Additional Information
            </button>
          </>
        )}
      </div>
    </div>
  );
}
