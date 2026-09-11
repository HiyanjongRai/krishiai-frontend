"use client";

import React from "react";
import { useExpertApplication } from "@/providers/expert-application-provider";
import { Clock, ArrowRight, X, RotateCcw } from "lucide-react";

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
      className={`rounded-[20px] border border-[#BCE9D5] bg-[#DDF4EA]/40 p-3.5 shadow-[0_4px_16px_-2px_rgba(15,159,104,0.1)] relative overflow-hidden transition-all ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white border border-[#BCE9D5] text-[#0F9F68] text-[10px] font-black">
              <Clock className="w-2.5 h-2.5" />
              <span>Draft ({percentage}%)</span>
            </span>
            <span className="text-xs font-bold text-[#171717]">
              Welcome back{application.account.fullName ? `, ${application.account.fullName.split(" ")[0]}` : ""} 👋
            </span>
          </div>
          <p className="text-[11px] text-gray-500">
            Unfinished application. Next: <strong className="text-[#171717]">{nextStepItem.title}</strong>
          </p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={resumeDraft}
            className="inline-flex items-center gap-1.5 py-1.5 px-3.5 bg-[#0F9F68] hover:bg-[#0D8A5A] text-white font-bold text-[11px] rounded-full transition-all shadow-[0_2px_8px_rgba(15,159,104,0.25)] cursor-pointer"
          >
            <span>Resume</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          <button
            type="button"
            onClick={resetDraft}
            title="Start fresh"
            className="p-1.5 rounded-full border border-[rgba(234,234,236,0.85)] text-gray-400 hover:text-[#171717] hover:bg-white text-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
          </button>

          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              title="Dismiss"
              className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-white/60 transition-colors cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
