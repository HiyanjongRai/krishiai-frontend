"use client";

import React from "react";
import { useExpertApplication } from "@/providers/expert-application-provider";
import {
  Clock,
  ArrowRight,
  X,
  RotateCcw,
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
  const { application, resumeDraft, resetDraft } = useExpertApplication();

  const completed = new Set(application.completedSteps);
  const percentage = application.percentage;
  const nextStepItem = STEP_NAMES.find((s) => !completed.has(s.step)) || STEP_NAMES[4];

  return (
    <div
      className={`bg-white rounded-xl p-3 sm:p-3.5 border border-emerald-200/80 shadow-2xs relative overflow-hidden transition-all ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#166534] text-[10px] font-bold">
              <Clock className="w-2.5 h-2.5" />
              <span>Draft ({percentage}%)</span>
            </span>
            <span className="text-xs font-semibold text-[#17201A]">
              Welcome back{application.account.fullName ? `, ${application.account.fullName.split(" ")[0]}` : ""} 👋
            </span>
          </div>
          <p className="text-[11px] text-[#647067]">
            Unfinished application. Next: <strong className="text-[#17201A]">{nextStepItem.title}</strong>
          </p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={resumeDraft}
            className="inline-flex items-center gap-1 py-1 px-3 bg-[#166534] hover:bg-[#14532d] text-white font-bold text-[11px] rounded-lg transition-all shadow-2xs cursor-pointer"
          >
            <span>Resume</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          <button
            type="button"
            onClick={resetDraft}
            title="Start fresh"
            className="p-1 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 text-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
          </button>

          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              title="Dismiss"
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
