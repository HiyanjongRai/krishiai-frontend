"use client";

import React from "react";
import { Check, CheckCircle2, Cloud, Loader2 } from "lucide-react";
import { useExpertApplication } from "@/providers/expert-application-provider";

interface StepMeta {
  step: number;
  label: string;
  description: string;
}

const STEPS: StepMeta[] = [
  { step: 1, label: "Account", description: "Identity & Credentials" },
  { step: 2, label: "Professional", description: "Experience & Education" },
  { step: 3, label: "Expertise", description: "Crops & Specializations" },
  { step: 4, label: "Documents", description: "Verification Files" },
  { step: 5, label: "Review", description: "Final Verification" },
];

export function RegistrationProgress() {
  const { application, saveStatus, goToStep } = useExpertApplication();
  const current = application.currentStep;
  const completed = new Set(application.completedSteps);

  if (current > 5) return null;

  const percentage = application.percentage;

  return (
    <div className="rounded-[24px] border border-[rgba(234,234,236,0.85)] bg-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04),0_2px_6px_-1px_rgba(0,0,0,0.02)] p-4 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#0F9F68]">
            Registration
          </p>
          <span className="text-xs font-bold text-[#171717]">
            Step {current} of 5
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
            <span className="inline-flex items-center gap-1 text-[#0F9F68] bg-[#DDF4EA] px-2 py-0.5 rounded-full border border-[#BCE9D5] font-bold text-[10px]">
              <CheckCircle2 className="w-3 h-3" />
              <span>Saved</span>
            </span>
          )}
          {saveStatus === "idle" && (
            <span className="inline-flex items-center gap-1 text-gray-400 text-[10px]">
              <Cloud className="w-3 h-3" />
              <span className="hidden sm:inline">Auto-saved</span>
            </span>
          )}
          <div className="text-[12px] font-black text-[#0F9F68]">
            {percentage}%
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#F4F4F6] h-1.5 rounded-full overflow-hidden mb-4">
        <div
          className="bg-[#0F9F68] h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${Math.max(percentage, (current / 5) * 100)}%` }}
        />
      </div>

      {/* Steps */}
      <div className="space-y-1">
        {STEPS.map((s) => {
          const isDone = completed.has(s.step);
          const isCurrent = current === s.step;
          const isClickable = isDone || isCurrent;

          return (
            <button
              key={s.step}
              type="button"
              disabled={!isClickable}
              onClick={() => isClickable && goToStep(s.step)}
              className={`relative flex items-center gap-3 w-full p-2.5 rounded-[16px] transition-all text-left focus:outline-none ${
                isCurrent
                  ? "bg-[#DDF4EA] text-[#0F9F68]"
                  : isDone
                  ? "text-[#171717] hover:bg-[#F4F4F6]"
                  : "text-gray-400 hover:text-gray-500"
              } ${isClickable ? "cursor-pointer" : "cursor-default"}`}
            >
              {s.step < 5 && (
                <span className="absolute left-[22px] top-9 h-4 w-px bg-[rgba(234,234,236,0.85)]" aria-hidden="true" />
              )}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-[10px] shrink-0 transition-all ${
                  isDone
                    ? "bg-[#0F9F68] text-white"
                    : isCurrent
                    ? "bg-[#0F9F68] text-white ring-4 ring-[#DDF4EA]"
                    : "bg-[#F4F4F6] text-gray-400 border border-[rgba(234,234,236,0.85)]"
                }`}
              >
                {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : s.step}
              </div>

              <span className="min-w-0">
                <span
                  className={`block text-xs truncate ${
                    isCurrent ? "font-bold text-[#0F9F68]" : isDone ? "font-bold text-[#171717]" : "font-medium text-gray-400"
                  }`}
                >{s.label}</span>
                <span className="block text-[10px] text-gray-400 truncate mt-0.5">{s.description}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
