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
    <div className="w-full bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs mb-6 sm:mb-8 transition-all">
      {/* Top Header: Step Counter & Auto-save Status */}
      <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/80">
            Step {current} of 5
          </span>
          <span className="text-xs font-semibold text-slate-500 hidden xs:inline">
            • {STEPS[current - 1]?.description}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 text-xs font-medium">
          {saveStatus === "saving" && (
            <span className="inline-flex items-center gap-1.5 text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 animate-pulse">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Saving...</span>
            </span>
          )}
          {saveStatus === "saved" && (
            <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/80">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Progress saved</span>
            </span>
          )}
          {saveStatus === "idle" && (
            <span className="inline-flex items-center gap-1.5 text-slate-400">
              <Cloud className="w-3 h-3" />
              <span className="hidden sm:inline">Auto-saves on change</span>
            </span>
          )}

          <div className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full">
            {percentage}% Complete
          </div>
        </div>
      </div>

      {/* Modern Progress Bar */}
      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-5">
        <div
          className="bg-gradient-to-r from-emerald-700 to-lime-600 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${Math.max(percentage, (current / 5) * 100)}%` }}
        />
      </div>

      {/* Desktop Stepper */}
      <div className="hidden md:flex items-center justify-between relative">
        {/* Connecting Background Line */}
        <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -z-0" />

        {STEPS.map((s) => {
          const isDone = completed.has(s.step);
          const isCurrent = current === s.step;
          const isPending = !isDone && !isCurrent;
          const isClickable = isDone || s.step <= current;

          return (
            <button
              key={s.step}
              type="button"
              disabled={!isClickable}
              onClick={() => isClickable && goToStep(s.step)}
              className={`relative z-10 flex flex-col items-center group transition-all text-center focus:outline-none ${
                isClickable ? "cursor-pointer" : "cursor-not-allowed opacity-75"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  isDone
                    ? "bg-[#166534] text-white ring-4 ring-emerald-100 shadow-sm group-hover:scale-105"
                    : isCurrent
                    ? "bg-[#166534] text-white ring-4 ring-emerald-200 shadow-md font-extrabold scale-110"
                    : "bg-white text-slate-400 border-2 border-slate-300 group-hover:border-slate-400"
                }`}
              >
                {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : s.step}
              </div>

              <span
                className={`mt-2 text-xs font-semibold tracking-tight transition-colors ${
                  isCurrent
                    ? "text-[#166534] font-bold"
                    : isDone
                    ? "text-slate-800"
                    : "text-slate-400"
                }`}
              >
                {s.label}
              </span>

              <span className="text-[10px] text-slate-400 hidden lg:block">
                {isDone ? "Completed" : isCurrent ? "Current step" : "Pending"}
              </span>
            </button>
          );
        })}
      </div>

      {/* Mobile Stepper */}
      <div className="md:hidden flex items-center justify-between pt-1">
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
              className={`flex items-center gap-1.5 focus:outline-none ${
                isClickable ? "cursor-pointer" : "cursor-default"
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                  isDone
                    ? "bg-[#166534] text-white"
                    : isCurrent
                    ? "bg-[#166534] text-white ring-2 ring-emerald-200 scale-105"
                    : "bg-slate-100 text-slate-400 border border-slate-200"
                }`}
              >
                {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : s.step}
              </span>
              <span
                className={`text-xs ${
                  isCurrent
                    ? "font-bold text-[#166534]"
                    : isDone
                    ? "font-medium text-slate-700 hidden xs:inline"
                    : "text-slate-400 hidden xs:inline"
                }`}
              >
                {s.shortLabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
