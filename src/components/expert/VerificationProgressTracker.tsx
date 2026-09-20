"use client";

import React from "react";
import { CheckCircle2, Clock } from "lucide-react";
import { VerificationStatus } from "@/types/expert-verification";

interface VerificationProgressTrackerProps {
  currentStatus: VerificationStatus;
  submittedAt?: string;
  underReviewSince?: string;
  approvedAt?: string;
}

const statusStages: Array<{
  status: VerificationStatus;
  label: string;
  icon: "check" | "clock" | "empty";
  color: string;
  description: string;
}> = [
  {
    status: "PENDING",
    label: "Submitted",
    icon: "check",
    color: "emerald",
    description: "Application received",
  },
  {
    status: "UNDER_REVIEW",
    label: "Under Review",
    icon: "clock",
    color: "amber",
    description: "Admin verification in progress",
  },
  {
    status: "APPROVED",
    label: "Verified",
    icon: "check",
    color: "emerald",
    description: "Professional verification completed",
  },
];

function getStageIcon(
  stage: "check" | "clock" | "empty",
  isCompleted: boolean,
  isCurrent: boolean
) {
  if (isCompleted) {
    return <CheckCircle2 className="h-5 w-5 text-[#2E7D32]" />;
  }
  if (isCurrent && stage === "clock") {
    return <Clock className="h-5 w-5 text-[#F59E0B] animate-pulse" />;
  }
  return (
    <div className="h-5 w-5 rounded-full border-2 border-[#D1D5DB] bg-white" />
  );
}

export function VerificationProgressTracker({
  currentStatus,
  submittedAt,
  underReviewSince,
  approvedAt,
}: VerificationProgressTrackerProps) {
  // Determine which stages are completed
  const isSubmitted = true; // If we have this component, they submitted
  const isUnderReview =
    currentStatus === "UNDER_REVIEW" ||
    currentStatus === "ADDITIONAL_INFO_REQUIRED" ||
    currentStatus === "APPROVED" ||
    currentStatus === "REJECTED";
  const isApproved = currentStatus === "APPROVED";

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 sm:p-8">
      <h3 className="text-lg font-bold text-[#1F2937] mb-6">
        Expert Verification Progress
      </h3>

      {/* Timeline */}
      <div className="space-y-4">
        {statusStages.map((stage, index) => {
          const isCompleted =
            (stage.status === "PENDING" && isSubmitted) ||
            (stage.status === "UNDER_REVIEW" && isUnderReview) ||
            (stage.status === "APPROVED" && isApproved);

          const isCurrent =
            currentStatus === stage.status ||
            (currentStatus === "ADDITIONAL_INFO_REQUIRED" &&
              stage.status === "UNDER_REVIEW") ||
            (currentStatus === "REJECTED" && stage.status === "UNDER_REVIEW");

          return (
            <div key={stage.status}>
              {/* Timeline Item */}
              <div className="flex gap-4">
                {/* Icon */}
                <div className="flex-shrink-0 pt-0.5">
                  {getStageIcon(stage.icon, isCompleted, isCurrent)}
                </div>

                {/* Content */}
                <div className="flex-1 pb-4">
                  <div
                    className={`font-semibold text-sm transition-colors ${
                      isCompleted || isCurrent
                        ? "text-[#1F2937]"
                        : "text-[#9CA3AF]"
                    }`}
                  >
                    {stage.label}
                  </div>
                  <div
                    className={`text-xs mt-1 transition-colors ${
                      isCompleted || isCurrent
                        ? "text-[#4B5563]"
                        : "text-[#9CA3AF]"
                    }`}
                  >
                    {stage.description}
                  </div>

                  {/* Timestamp for completed/current stages */}
                  {isCurrent && (
                    <div className="mt-2">
                      {stage.status === "PENDING" && submittedAt && (
                        <div className="text-[11px] font-medium text-[#2E7D32] bg-[#E8F5E9] px-2.5 py-1 rounded inline-block">
                          Submitted {new Date(submittedAt).toLocaleDateString()}
                        </div>
                      )}
                      {stage.status === "UNDER_REVIEW" && underReviewSince && (
                        <div className="text-[11px] font-medium text-[#F59E0B] bg-[#FEF3C7] px-2.5 py-1 rounded inline-block">
                          Since {new Date(underReviewSince).toLocaleDateString()}
                        </div>
                      )}
                      {stage.status === "APPROVED" && approvedAt && (
                        <div className="text-[11px] font-medium text-[#2E7D32] bg-[#E8F5E9] px-2.5 py-1 rounded inline-block">
                          Approved {new Date(approvedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Connector Line */}
              {index < statusStages.length - 1 && (
                <div className="flex gap-4 ml-2">
                  <div
                    className={`w-0.5 h-6 transition-colors ${
                      isCompleted
                        ? "bg-[#C8E6C9]"
                        : isCurrent
                          ? "bg-[#FEF3C7]"
                          : "bg-[#E5E7EB]"
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Current Status Description */}
      <div className="mt-8 pt-6 border-t border-[#E5E7EB]">
        <div className="bg-[#F8FAF8] rounded-xl p-4">
          <div className="text-xs font-bold text-[#4B5563] uppercase tracking-wide mb-2">
            Current Status
          </div>
          {currentStatus === "UNDER_REVIEW" && (
            <div>
              <div className="text-sm font-semibold text-[#F59E0B] mb-1">
                Under Review
              </div>
              <div className="text-sm text-[#4B5563]">
                Our admin team is reviewing your professional qualifications and submitted expertise. This typically takes 3-7 business days.
              </div>
            </div>
          )}
          {currentStatus === "PENDING" && (
            <div>
              <div className="text-sm font-semibold text-[#1B5E20] mb-1">
                Application Received
              </div>
              <div className="text-sm text-[#4B5563]">
                Your application has been received. We will begin reviewing your credentials shortly.
              </div>
            </div>
          )}
          {currentStatus === "ADDITIONAL_INFO_REQUIRED" && (
            <div>
              <div className="text-sm font-semibold text-[#2563EB] mb-1">
                Additional Information Required
              </div>
              <div className="text-sm text-[#4B5563]">
                Please provide the requested additional information to proceed with verification.
              </div>
            </div>
          )}
          {currentStatus === "APPROVED" && (
            <div>
              <div className="text-sm font-semibold text-[#1B5E20] mb-1">
                Verification Complete
              </div>
              <div className="text-sm text-[#4B5563]">
                Congratulations! Your professional expertise has been verified. You can now access all verified expert features.
              </div>
            </div>
          )}
          {currentStatus === "REJECTED" && (
            <div>
              <div className="text-sm font-semibold text-[#DC2626] mb-1">
                Application Needs Changes
              </div>
              <div className="text-sm text-[#4B5563]">
                Please review the feedback provided and update your application accordingly.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
