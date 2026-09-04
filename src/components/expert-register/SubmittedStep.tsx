"use client";

import React, { useState } from "react";
import { useExpertApplication } from "@/providers/expert-application-provider";
import { VerificationTimeline } from "./VerificationTimeline";
import {
  CheckCircle2,
  Copy,
  Check,
  ArrowRight,
  Home,
  BellRing,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function SubmittedStep() {
  const { application } = useExpertApplication();
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const handleCopy = () => {
    navigator.clipboard.writeText(application.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E2E8E3] shadow-xs space-y-8 animate-in fade-in zoom-in-95 duration-200">
      {/* Top Banner / Hero */}
      <div className="text-center space-y-4 max-w-xl mx-auto">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-[#F0FDF4] border-2 border-emerald-200 flex items-center justify-center text-[#166534] mx-auto shadow-sm animate-in zoom-in-50 duration-300">
          <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-[#16A34A] stroke-[2.5]" />
        </div>

        <div className="space-y-1.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Application Received</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#17201A] tracking-tight">
            Application Submitted
          </h2>
          <p className="text-sm sm:text-base text-[#647067] leading-relaxed">
            Your expert application has been successfully submitted and is now under verification.
          </p>
        </div>

        {/* Application ID Card */}
        <div className="p-4 rounded-2xl bg-[#F7F9F4] border border-[#E2E8E3] inline-flex items-center gap-3">
          <div className="text-left">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Application ID
            </p>
            <p className="font-mono text-base sm:text-lg font-black text-[#166534] tracking-wider">
              {application.id}
            </p>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            title="Copy Application ID"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Verification Timeline Card */}
      <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 bg-white shadow-2xs max-w-2xl mx-auto space-y-4">
        <h3 className="text-sm sm:text-base font-bold text-[#17201A] border-b border-slate-100 pb-3">
          Verification Milestones
        </h3>
        <VerificationTimeline
          status={application.status}
          submittedAt={application.submittedAt}
        />
      </div>

      {/* Notification advisory */}
      <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-[#F0FDF4] border border-emerald-200 flex items-center gap-3 text-emerald-900 text-xs sm:text-sm">
        <BellRing className="w-5 h-5 text-emerald-600 shrink-0" />
        <p className="leading-relaxed">
          You will receive an SMS and email notification at <strong>{application.account.email || "your registered email"}</strong> when your application status changes.
        </p>
      </div>

      {/* Actions */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/expert-register/status"
          className="w-full sm:w-auto px-8 py-3.5 bg-[#166534] hover:bg-[#14532d] text-white font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer group"
        >
          <span>View Application Status</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/"
          className="w-full sm:w-auto px-6 py-3.5 border border-[#E2E8E3] hover:bg-slate-50 text-[#17201A] font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4 text-slate-500" />
          <span>Go to Home</span>
        </Link>
      </div>
    </div>
  );
}
