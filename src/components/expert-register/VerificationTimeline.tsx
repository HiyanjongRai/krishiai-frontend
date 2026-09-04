import React from "react";
import { ApplicationStatus } from "@/types/expert-application";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck2,
  ShieldCheck,
  Award,
  XCircle,
} from "lucide-react";

interface VerificationTimelineProps {
  status: ApplicationStatus;
  submittedAt?: string;
  actionRequiredNotes?: string;
  rejectionReason?: string;
  onUpdateAction?: () => void;
  className?: string;
}

export function VerificationTimeline({
  status,
  submittedAt,
  actionRequiredNotes,
  rejectionReason,
  onUpdateAction,
  className = "",
}: VerificationTimelineProps) {
  const isSubmitted = status !== "DRAFT";
  const isApproved = status === "APPROVED";
  const isRejected = status === "REJECTED";
  const isActionRequired = status === "ADDITIONAL_INFORMATION_REQUIRED";
  const isUnderReview = status === "UNDER_REVIEW";

  const milestones = [
    {
      id: "submission",
      title: "Application Submitted",
      description: "Basic profile, professional background, and credentials received.",
      date: submittedAt ? new Date(submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Today",
      icon: FileCheck2,
      state: isSubmitted ? ("done" as const) : ("current" as const),
    },
    {
      id: "docs",
      title: "Document & Identity Verification",
      description: isActionRequired
        ? "Action needed: One or more uploaded certificates require clarification."
        : "Checking degree certificates, registration validity, and citizenship with national records.",
      date: isSubmitted ? "In Progress" : "Pending",
      icon: ShieldCheck,
      state: isActionRequired
        ? ("warning" as const)
        : isApproved || isUnderReview || isRejected
        ? ("done" as const)
        : isSubmitted
        ? ("current" as const)
        : ("pending" as const),
    },
    {
      id: "panel",
      title: "KrishiAI Expert Board Review",
      description: "Agricultural board evaluates domain expertise, crop focus areas, and advisory alignment.",
      date: isUnderReview || isApproved ? "Active" : "Pending",
      icon: Award,
      state: isApproved
        ? ("done" as const)
        : isRejected
        ? ("error" as const)
        : isUnderReview
        ? ("current" as const)
        : ("pending" as const),
    },
    {
      id: "activation",
      title: "Official Accreditation & Account Activation",
      description: isApproved
        ? "Verified! You can now advise farmers, respond to diagnostic cases, and earn advisory fees."
        : isRejected
        ? "Application closed. You may address the feedback and resubmit your application."
        : "Final approval, issuing digital expert badge, and granting verified portal access.",
      date: isApproved ? "Complete" : isRejected ? "Declined" : "Pending",
      icon: CheckCircle2,
      state: isApproved
        ? ("done" as const)
        : isRejected
        ? ("error" as const)
        : ("pending" as const),
    },
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {milestones.map((step) => {
          const Icon = step.icon;

          let iconBg = "bg-slate-100 text-slate-400 border-slate-300";
          let circleRing = "";
          if (step.state === "done") {
            iconBg = "bg-[#166534] text-white border-[#166534]";
          } else if (step.state === "current") {
            iconBg = "bg-amber-500 text-white border-amber-500";
            circleRing = "ring-4 ring-amber-100 animate-pulse";
          } else if (step.state === "warning") {
            iconBg = "bg-orange-500 text-white border-orange-500";
            circleRing = "ring-4 ring-orange-100";
          } else if (step.state === "error") {
            iconBg = "bg-rose-500 text-white border-rose-500";
            circleRing = "ring-4 ring-rose-100";
          }

          return (
            <div key={step.id} className="relative group">
              {/* Timeline Icon Node */}
              <div
                className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 flex items-center justify-center transition-all ${iconBg} ${circleRing}`}
              >
                {step.state === "done" ? (
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                ) : step.state === "warning" ? (
                  <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                ) : step.state === "error" ? (
                  <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                ) : (
                  <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                )}
              </div>

              {/* Text Content */}
              <div className="space-y-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4
                    className={`text-sm sm:text-base font-bold ${
                      step.state === "current"
                        ? "text-slate-900"
                        : step.state === "warning"
                        ? "text-orange-950 font-extrabold"
                        : step.state === "done"
                        ? "text-slate-900"
                        : "text-slate-500"
                    }`}
                  >
                    {step.title}
                  </h4>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      step.state === "done"
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : step.state === "warning"
                        ? "bg-orange-50 text-orange-800 border border-orange-200"
                        : step.state === "error"
                        ? "bg-rose-50 text-rose-800 border border-rose-200"
                        : step.state === "current"
                        ? "bg-amber-50 text-amber-800 border border-amber-200"
                        : "bg-slate-50 text-slate-400"
                    }`}
                  >
                    {step.date}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {step.description}
                </p>

                {/* Inline Warning Callout for Action Required */}
                {step.id === "docs" && isActionRequired && actionRequiredNotes && (
                  <div className="mt-3 p-3.5 rounded-xl bg-orange-50 border border-orange-200 text-orange-900 space-y-2">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                      <div className="text-xs sm:text-sm">
                        <p className="font-bold text-orange-950">Clarification Needed</p>
                        <p className="text-orange-800 mt-0.5">{actionRequiredNotes}</p>
                      </div>
                    </div>
                    {onUpdateAction && (
                      <button
                        type="button"
                        onClick={onUpdateAction}
                        className="mt-1 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <span>Update Document</span>
                        <span>→</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Inline Rejection Details */}
                {step.id === "activation" && isRejected && rejectionReason && (
                  <div className="mt-3 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 space-y-2">
                    <div className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div className="text-xs sm:text-sm">
                        <p className="font-bold text-rose-950">Review Feedback</p>
                        <p className="text-rose-800 mt-0.5">{rejectionReason}</p>
                      </div>
                    </div>
                    {onUpdateAction && (
                      <button
                        type="button"
                        onClick={onUpdateAction}
                        className="mt-1 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <span>Revise & Resubmit Application</span>
                        <span>→</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
