"use client";

import React from "react";
import { Check, CheckCircle2, Cloud, Loader2 } from "lucide-react";
import { useExpertApplication } from "@/providers/expert-application-provider";

interface StepMeta {
  step: number;
  label: string;
  shortLabel: string;
  description: string;
}

const STEPS: StepMeta[] = [
  { step: 1, label: "Account", shortLabel: "Account", description: "Identity & Credentials" },
  { step: 2, label: "Professional", shortLabel: "Profile", description: "Experience & Education" },
  { step: 3, label: "Expertise", shortLabel: "Expertise", description: "Crops & Specializations" },
  { step: 4, label: "Documents", shortLabel: "Docs", description: "Verification Files" },
  { step: 5, label: "Review", shortLabel: "Review", description: "Final Verification" },
];

export function RegistrationProgress() {
  const { application, saveStatus, goToStep } = useExpertApplication();
  const current = application.currentStep; // 1 to 5
  const completed = new Set(application.completedSteps);

  if (current > 5) {
    // Submitted state handles its own timeline
    return null;
  }

  const percentage = application.percentage;

  return (
    <div className="w-full bg-white rounded-xl p-3.5 sm:p-4 border border-[#E2E8E3] shadow-2xs mb-4 transition-all">
      {/* Top Header: Step Counter & Auto-save Status */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#166534] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80">
            Step {current} of 5
          </span>
          <span className="text-xs font-semibold text-slate-600 hidden sm:inline">
            {STEPS[current - 1]?.description}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          {saveStatus === "saving" && (
            <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 text-[10px] animate-pulse">
              <Loader2 className="w-2.5 h-2.5 animate-spin" />
              <span>Saving</span>
            </span>
          )}
          {saveStatus === "saved" && (
            <span className="inline-flex items-center gap-1 text-[#166534] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80 font-bold text-[10px]">
              <CheckCircle2 className="w-3 h-3 text-[#166534]" />
              <span>Saved</span>
            </span>
          )}
          {saveStatus === "idle" && (
            <span className="inline-flex items-center gap-1 text-slate-400 text-[10px]">
              <Cloud className="w-3 h-3" />
              <span className="hidden sm:inline">Auto-saved</span>
            </span>
          )}

          <div className="text-[11px] font-bold text-[#17201A] bg-[#F8FAF6] px-2 py-0.5 rounded-md border border-slate-200">
            {percentage}%
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-3">
        <div
          className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-lime-500 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${Math.max(percentage, (current / 5) * 100)}%` }}
        />
      </div>

      {/* Stepper Steps Row */}
      <div className="grid grid-cols-5 gap-1 pt-0.5">
        {STEPS.map((s) => {
          const isDone = completed.has(s.step);
          const isCurrent = current === s.step;
          const isClickable = isDone || s.step <= current;

          return (
            <button
              key={s.step}
              type="button"
              disabled={!isClickable}
              onClick={() => isClickable && goToStep(s.step)}
              className={`flex items-center justify-center sm:justify-start gap-1.5 p-1 rounded-lg transition-all text-left focus:outline-none ${
                isCurrent
                  ? "bg-emerald-50/80 text-[#166534]"
                  : isDone
                  ? "text-[#17201A] hover:bg-slate-50"
                  : "text-slate-400 hover:text-slate-600"
              } ${isClickable ? "cursor-pointer" : "cursor-default"}`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 transition-all ${
                  isDone
                    ? "bg-[#166534] text-white"
                    : isCurrent
                    ? "bg-[#166534] text-white ring-2 ring-emerald-200"
                    : "bg-slate-100 text-slate-400 border border-slate-200"
                }`}
              >
                {isDone ? <Check className="w-3 h-3 stroke-[3]" /> : s.step}
              </div>

              <span
                className={`text-[11px] truncate hidden sm:inline ${
                  isCurrent ? "font-bold text-[#166534]" : isDone ? "font-medium" : "text-slate-400"
                }`}
              >
                {s.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
