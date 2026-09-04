"use client";

import React from "react";
import { useExpertApplication } from "@/providers/expert-application-provider";
import {
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  RotateCcw,
  ShieldAlert,
} from "lucide-react";

interface ResumeApplicationCardProps {
  onDismiss?: () => void;
  className?: string;
}

const STEP_NAMES = [
  { step: 1, title: "Account Credentials" },
  { step: 2, title: "Professional Background" },
  { step: 3, title: "Expertise & Crops" },
  { step: 4, title: "Verification Documents" },
  { step: 5, title: "Review Application" },
];

export function ResumeApplicationCard({ onDismiss, className = "" }: ResumeApplicationCardProps) {
  const { application, resumeDraft, resetDraft, goToStep } = useExpertApplication();

  const completed = new Set(application.completedSteps);
  const currentStep = application.currentStep;
  const percentage = application.percentage;

  const nextStepItem = STEP_NAMES.find((s) => !completed.has(s.step)) || STEP_NAMES[4];

  return (
    <div
      className={`bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-500/40 shadow-xl relative overflow-hidden transition-all ${className}`}
    >
      {/* Subtle Background Accent */}
      <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full bg-emerald-50/80 -z-0 pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>Draft Saved Automatically</span>
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-[#17201A]">
              Welcome back{application.account.fullName ? `, ${application.account.fullName.split(" ")[0]}` : ""} 👋
            </h3>
            <p className="text-sm text-[#647067]">
              Your KrishiAI Expert application is <strong>{percentage}% complete</strong>.
            </p>
          </div>

          <div className="text-right">
            <span className="text-2xl sm:text-3xl font-black text-[#166534]">
              {percentage}%
            </span>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Completed
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-600 to-lime-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.max(10, percentage)}%` }}
          />
        </div>

        {/* Steps Checklist */}
        <div className="space-y-2.5 bg-[#F7F9F4] p-4 rounded-2xl border border-[#E2E8E3]">
          {STEP_NAMES.map((s) => {
            const isDone = completed.has(s.step);
            const isCurrent = currentStep === s.step;

            return (
              <div
                key={s.step}
                className="flex items-center justify-between text-xs sm:text-sm"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isDone
                        ? "bg-[#166534] text-white"
                        : isCurrent
                        ? "bg-amber-500 text-white ring-2 ring-amber-200"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {isDone ? "✓" : s.step}
                  </span>
                  <span
                    className={`font-semibold ${
                      isCurrent
                        ? "text-[#166534] font-bold"
                        : isDone
                        ? "text-slate-800"
                        : "text-slate-400"
                    }`}
                  >
                    {s.title}
                  </span>
                </div>

                <span className="text-[11px] font-medium text-slate-500">
                  {isDone ? (
                    <span className="text-emerald-700 font-bold">Complete</span>
                  ) : isCurrent ? (
                    <span className="text-amber-700 font-bold">In Progress</span>
                  ) : (
                    "Pending"
                  )}
                </span>
              </div>
            );
          })}
        </div>

        {/* Next Step Callout */}
        <div className="p-3.5 rounded-xl bg-[#F0FDF4] border border-emerald-200 text-xs sm:text-sm text-[#166534] flex items-center justify-between">
          <span>
            Next up: <strong>{nextStepItem.title}</strong>
          </span>
          <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
            Ready to continue
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            type="button"
            onClick={resumeDraft}
            className="w-full sm:flex-1 py-3.5 bg-[#166534] hover:bg-[#14532d] text-white font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer group"
          >
            <span>Continue Application</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            type="button"
            onClick={() => goToStep(5)}
            className="w-full sm:w-auto px-5 py-3.5 border border-[#E2E8E3] hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-xl transition-all cursor-pointer"
          >
            Review Progress
          </button>

          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              className="w-full sm:w-auto px-4 py-3.5 text-slate-400 hover:text-slate-600 text-xs font-semibold cursor-pointer"
            >
              Not now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
