"use client";

import React, { useState } from "react";
import { useExpertApplication } from "@/providers/expert-application-provider";
import { ApplicationStatus } from "@/types/expert-application";
import { Sliders, Check, RotateCcw, ChevronUp, ChevronDown, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export function DemoStatusSwitcher() {
  const { application, setMockStatus, resetDraft, goToStep } = useExpertApplication();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const statuses: { label: string; status: ApplicationStatus; note: string; action: () => void }[] = [
    {
      label: "1. Clean Draft (Step 1)",
      status: "DRAFT",
      note: "Brand new user starting registration",
      action: () => {
        resetDraft();
        goToStep(1);
        router.push("/expert-register");
      },
    },
    {
      label: "2. Returning Incomplete (60% at Docs)",
      status: "DRAFT",
      note: "Account, Bio, and Crops completed; at Step 4",
      action: () => {
        setMockStatus("DRAFT", { step: 4 });
        router.push("/expert-register");
      },
    },
    {
      label: "3. Application Submitted",
      status: "SUBMITTED",
      note: "Success screen with ID KAI-2026-001284",
      action: () => {
        setMockStatus("SUBMITTED");
        router.push("/expert-register");
      },
    },
    {
      label: "4. Under Verification Review",
      status: "UNDER_REVIEW",
      note: "Documents under review by KrishiAI board",
      action: () => {
        setMockStatus("UNDER_REVIEW");
        router.push("/expert-register/status");
      },
    },
    {
      label: "5. Additional Info Required",
      status: "ADDITIONAL_INFORMATION_REQUIRED",
      note: "Experience certificate needs clarification",
      action: () => {
        setMockStatus("ADDITIONAL_INFORMATION_REQUIRED");
        router.push("/expert-register/status");
      },
    },
    {
      label: "6. Approved & Verified 🎉",
      status: "APPROVED",
      note: "Accredited expert badge & dashboard entry",
      action: () => {
        setMockStatus("APPROVED");
        router.push("/expert-register/status");
      },
    },
    {
      label: "7. Changes Required / Rejected",
      status: "REJECTED",
      note: "Clear, supportive rationale with re-upload",
      action: () => {
        setMockStatus("REJECTED");
        router.push("/expert-register/status");
      },
    },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700/80 overflow-hidden text-xs max-w-sm transition-all">
        {/* Toggle bar */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-2.5 flex items-center justify-between gap-3 font-bold bg-slate-800/90 hover:bg-slate-800 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <Sliders className="w-3.5 h-3.5 text-emerald-400" />
            <span className="tracking-wide">Prototype State Switcher</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="text-[10px] uppercase font-semibold text-emerald-300">
              {application.status}
            </span>
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </div>
        </button>

        {isOpen && (
          <div className="p-3 space-y-2 border-t border-slate-700 bg-slate-900/95 max-h-[380px] overflow-y-auto">
            <p className="text-[11px] text-slate-400 leading-snug">
              Switch between simulated backend states to review each UX requirement:
            </p>

            <div className="space-y-1.5 pt-1">
              {statuses.map((item, idx) => {
                const isActive =
                  application.status === item.status &&
                  (item.status !== "DRAFT" ||
                    (item.label.includes("60%") && application.currentStep === 4) ||
                    (item.label.includes("Step 1") && application.currentStep === 1));

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      item.action();
                      setIsOpen(false);
                    }}
                    className={`w-full text-left p-2 rounded-xl transition-all flex items-start justify-between gap-2 cursor-pointer ${
                      isActive
                        ? "bg-emerald-950/80 border border-emerald-500/50 text-emerald-200"
                        : "bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-transparent"
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-xs text-white">{item.label}</p>
                      <p className="text-[10px] text-slate-400">{item.note}</p>
                    </div>
                    {isActive && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Current Step: {application.currentStep} / 5</span>
              <button
                type="button"
                onClick={() => resetDraft()}
                className="flex items-center gap-1 text-red-400 hover:text-red-300 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset All</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
