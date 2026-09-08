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
    <div className="w-full bg-white rounded-xl p-4 border border-[#DCE8DF] shadow-[0_8px_24px_rgba(28,71,45,0.04)] transition-all">
      {/* Top Header: Step Counter & Auto-save Status */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#17201A]">
            Registration Progress
          </span>
          <span className="text-[10px] font-semibold text-slate-500">Step {current} of 5</span>
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

          <div className="text-[11px] font-bold text-[#16834C]">
            {percentage}%
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-4">
        <div
          className="bg-[#16834C] h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${Math.max(percentage, (current / 5) * 100)}%` }}
        />
      </div>

      {/* Vertical stepper on desktop; compact row on small screens */}
      <div className="space-y-1 pt-0.5">
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
              className={`relative flex items-center gap-3 w-full p-2 rounded-lg transition-all text-left focus:outline-none ${
                isCurrent
                  ? "bg-emerald-50/80 text-[#166534]"
                  : isDone
                  ? "text-[#17201A] hover:bg-slate-50"
                  : "text-slate-400 hover:text-slate-600"
              } ${isClickable ? "cursor-pointer" : "cursor-default"}`}
            >
              {s.step < 5 && (
                <span className="absolute left-[18px] top-8 h-5 w-px bg-[#DCE8DF]" aria-hidden="true" />
              )}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 transition-all ${
                  isDone
                    ? "bg-[#166534] text-white"
                    : isCurrent
                    ? "bg-[#166534] text-white ring-2 ring-emerald-200"
                    : "bg-slate-100 text-slate-400 border border-slate-200"
                }`}
              >
                {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : s.step}
              </div>

              <span className="min-w-0">
                <span
                  className={`block text-xs truncate ${
                    isCurrent ? "font-bold text-[#166534]" : isDone ? "font-semibold text-[#17201A]" : "font-medium text-slate-400"
                  }`}
                >{s.label}</span>
                <span className="block text-[10px] text-slate-500 truncate mt-0.5">{s.description}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
