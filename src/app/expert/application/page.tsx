/**
 * Expert Application Status Page
 * Displays the complete verification journey and application status
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
  Calendar,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { ExpertApplicationProgress, VerificationStatus } from "@/types/expert-verification";

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
      {
        name: "B.Sc. Agriculture Certificate",
        status: "VERIFIED",
        verifiedAt: "January 17, 2024",
      },
      {
        name: "Training Certificate - IPM",
        status: "PENDING",
      },
      {
        name: "Experience Letter",
        status: "PENDING",
      },
    ],

    adminNotes:
      "Application is under review. All documents received. Expertise verification in progress.",
  });

  const getStatusIcon = (status: VerificationStatus) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle2 className="w-6 h-6 text-emerald-600" />;
      case "REJECTED":
        return <XCircle className="w-6 h-6 text-red-600" />;
      case "ADDITIONAL_INFO_REQUIRED":
        return <AlertCircle className="w-6 h-6 text-blue-600" />;
      case "UNDER_REVIEW":
        return <Clock className="w-6 h-6 text-amber-600" />;
      case "PENDING":
      default:
        return <Clock className="w-6 h-6 text-slate-600" />;
    }
  };

  const getStatusLabel = (status: VerificationStatus): string => {
    switch (status) {
      case "APPROVED":
        return "Approved";
      case "REJECTED":
        return "Rejected";
      case "ADDITIONAL_INFO_REQUIRED":
        return "Action Required";
      case "UNDER_REVIEW":
        return "Under Review";
      case "PENDING":
      default:
        return "Pending";
    }
  };

  const getStatusColor = (status: VerificationStatus) => {
    switch (status) {
      case "APPROVED":
        return "bg-emerald-50 border-emerald-200 text-emerald-900";
      case "REJECTED":
        return "bg-red-50 border-red-200 text-red-900";
      case "ADDITIONAL_INFO_REQUIRED":
        return "bg-blue-50 border-blue-200 text-blue-900";
      case "UNDER_REVIEW":
        return "bg-amber-50 border-amber-200 text-amber-900";
      case "PENDING":
      default:
        return "bg-slate-50 border-slate-200 text-slate-900";
    }
  };

  const timeline: ApplicationTimeline[] = [
    {
      stage: "Application Submitted",
      status: "completed",
      date: "Jan 15, 2024",
      description: "Your application and documents have been received",
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
    },
    {
      stage: "Initial Review",
      status: "completed",
      date: "Jan 16, 2024",
      description: "Documents have been verified for completeness",
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
    },
    {
      stage: "Expertise Verification",
      status: "current",
      description: "Your expertise areas are being reviewed",
      icon: <Clock className="w-5 h-5 text-amber-600" />,
    },
    {
      stage: "Professional Review",
      status: "pending",
      description: "Additional verification may be required",
      icon: <Clock className="w-5 h-5 text-slate-400" />,
    },
    {
      stage: "Final Approval",
      status: "pending",
      description: "Awaiting final decision from admin",
      icon: <Clock className="w-5 h-5 text-slate-400" />,
    },
  ];

  const handleRequestClarification = () => {
    alert("Feature coming soon: Request clarification from admin");
  };

  const handleResubmitApplication = () => {
    alert("Feature coming soon: Resubmit application with updates");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Application Status</h1>
        <p className="text-slate-600 mt-1">
          Track the progress of your expert verification application
        </p>
      </div>

      {/* Status Overview */}
      <div className={`rounded-2xl border-2 p-8 ${getStatusColor(applicationData.currentStatus)}`}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              {getStatusIcon(applicationData.currentStatus)}
              <h2 className="text-2xl font-bold">
                {getStatusLabel(applicationData.currentStatus)}
              </h2>
            </div>
            <p className="text-sm opacity-75">
              Application ID: <span className="font-mono font-bold">{applicationData.applicationId}</span>
            </p>
          </div>
        </div>

        {/* Status Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/50 rounded-lg p-3">
            <div className="text-xs font-semibold opacity-75 mb-1">Submitted</div>
            <div className="font-bold text-sm">{applicationData.submittedAt}</div>
          </div>
          <div className="bg-white/50 rounded-lg p-3">
            <div className="text-xs font-semibold opacity-75 mb-1">Last Updated</div>
            <div className="font-bold text-sm">{applicationData.lastUpdated}</div>
          </div>
          <div className="bg-white/50 rounded-lg p-3">
            <div className="text-xs font-semibold opacity-75 mb-1">Est. Completion</div>
            <div className="font-bold text-sm">{applicationData.estimatedCompletionDate}</div>
          </div>
        </div>
      </div>

      {/* Admin Notes */}
      {applicationData.adminNotes && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <MessageSquare className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-950 mb-1">Admin Notes</h3>
              <p className="text-blue-900">{applicationData.adminNotes}</p>
            </div>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-8">Verification Journey</h2>

        <div className="space-y-0">
          {timeline.map((item, index) => (
            <div key={index} className="flex gap-4 pb-8 relative">
              {/* Timeline Line */}
              {index < timeline.length - 1 && (
                <div
                  className={`absolute left-2.5 top-12 w-1 h-16 ${
                    item.status === "completed"
                      ? "bg-emerald-400"
                      : item.status === "current"
                        ? "bg-amber-400"
                        : "bg-slate-200"
                  }`}
                />
              )}

              {/* Icon */}
              <div className="flex-shrink-0 relative z-10 bg-white p-1 rounded-full">
                {item.icon}
              </div>

              {/* Content */}
              <div className="flex-1 pt-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900">{item.stage}</h3>
                    <p className="text-sm text-slate-600 mt-1">{item.description}</p>
                  </div>
                  {item.date && (
                    <div className="text-xs font-semibold text-slate-500 flex-shrink-0 ml-4">
                      {item.date}
                    </div>
                  )}
                </div>

                {item.status === "current" && (
                  <div className="mt-3 inline-block px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                    In Progress
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submitted Expertise */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <User className="w-5 h-5 text-emerald-600" />
          <h2 className="text-xl font-bold text-slate-900">Submitted Expertise</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {applicationData.submittedExpertise.map((expertise, index) => (
            <div
              key={index}
              className="rounded-lg border border-slate-200 p-4 bg-slate-50 flex items-start justify-between"
            >
              <div>
                <div className="font-semibold text-slate-900">{expertise.name}</div>
                <div className="text-xs text-slate-600 mt-1">
                  {expertise.category === "CROP" ? "Primary Crop" : "Professional Expertise"}
                </div>
              </div>
              <div className="text-xs font-semibold px-2.5 py-1 bg-amber-100 text-amber-700 rounded-md">
                ⏳ Pending
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submitted Documents */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <FileText className="w-5 h-5 text-emerald-600" />
          <h2 className="text-xl font-bold text-slate-900">Submitted Documents</h2>
        </div>

        <div className="space-y-3">
          {applicationData.submittedDocuments.map((doc, index) => (
            <div
              key={index}
              className={`rounded-lg border p-4 ${
                doc.status === "VERIFIED"
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-amber-200 bg-amber-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-slate-600" />
                  <div>
                    <div className="font-semibold text-slate-900">{doc.name}</div>
                    {doc.verifiedAt && (
                      <div className="text-xs text-slate-600">Verified on {doc.verifiedAt}</div>
                    )}
                  </div>
                </div>
                <div
                  className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                    doc.status === "VERIFIED"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {doc.status === "VERIFIED" ? "✓ Verified" : "⏳ Pending"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-gradient-to-r from-emerald-50 to-emerald-50 rounded-2xl border border-emerald-200 p-6">
        <h3 className="font-bold text-emerald-950 mb-4">What's Next?</h3>

        <div className="space-y-3">
          {applicationData.currentStatus === "ADDITIONAL_INFO_REQUIRED" ? (
            <>
              <p className="text-sm text-emerald-900 mb-4">
                Please provide the additional information requested by our team to complete your verification.
              </p>
              <button
                onClick={handleResubmitApplication}
                className="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <ArrowRight className="w-4 h-4" />
                Provide Additional Information
              </button>
            </>
          ) : applicationData.currentStatus === "UNDER_REVIEW" ? (
            <>
              <p className="text-sm text-emerald-900 mb-4">
                Your application is being reviewed. We typically complete verification within 7-10 business days.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Link
                  href="/expert/profile"
                  className="px-6 py-3 bg-white border-2 border-emerald-200 hover:bg-emerald-50 text-emerald-700 font-semibold rounded-lg transition-colors text-center"
                >
                  Update Profile
                </Link>
                <button
                  onClick={handleRequestClarification}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Contact Support
                </button>
              </div>
            </>
          ) : applicationData.currentStatus === "APPROVED" ? (
            <>
              <p className="text-sm text-emerald-900 mb-4">
                Congratulations! Your expert profile has been verified. You can now accept consultations from farmers.
              </p>
              <Link
                href="/expert/consultations"
                className="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <ArrowRight className="w-4 h-4" />
                View Consultations
              </Link>
            </>
          ) : applicationData.currentStatus === "REJECTED" ? (
            <>
              <p className="text-sm text-emerald-900 mb-4">
                Your application was not approved. Please review the feedback and resubmit if applicable.
              </p>
              <button
                onClick={handleResubmitApplication}
                className="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors"
              >
                Resubmit Application
              </button>
            </>
          ) : null}
        </div>
      </div>

      {/* Help Card */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
        <h3 className="font-bold text-slate-900 mb-3">Need Help?</h3>
        <p className="text-sm text-slate-700 mb-4">
          If you have questions about your application status or need assistance, please contact our support team.
        </p>
        <Link
          href="/contact"
          className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm flex items-center gap-1"
        >
          Contact Support <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
