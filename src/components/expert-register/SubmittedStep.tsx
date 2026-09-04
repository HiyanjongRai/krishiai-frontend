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
    <div className="bg-white rounded-2xl p-5 sm:p-7 border border-[#E2E8E3] shadow-xs space-y-6 animate-in fade-in zoom-in-95 duration-200">
      {/* Top Banner / Hero */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-[#F0FDF4] border-2 border-emerald-200 flex items-center justify-center text-[#166534] mx-auto shadow-2xs">
          <CheckCircle2 className="w-7 h-7 text-[#16A34A] stroke-[2.5]" />
        </div>

        <div className="space-y-1">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>Application Received</span>
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-[#17201A] tracking-tight">
            Application Submitted
          </h2>
          <p className="text-xs text-[#647067] leading-relaxed">
            Your expert application has been successfully submitted and is now under verification.
          </p>
        </div>

        {/* Application ID Card */}
        <div className="p-3 rounded-xl bg-[#F7F9F4] border border-[#E2E8E3] inline-flex items-center gap-3">
          <div className="text-left">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
              Application ID
            </p>
            <p className="font-mono text-sm font-bold text-[#166534] tracking-wider">
              {application.id}
            </p>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            title="Copy Application ID"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Verification Timeline Card */}
      <div className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-white shadow-2xs max-w-xl mx-auto space-y-3">
        <h3 className="text-xs font-bold text-[#17201A] border-b border-slate-100 pb-2">
          Verification Milestones
        </h3>
        <VerificationTimeline
          status={application.status}
          submittedAt={application.submittedAt}
        />
      </div>

      {/* Notification advisory */}
      <div className="max-w-xl mx-auto p-3 rounded-xl bg-[#F0FDF4] border border-emerald-200 flex items-center gap-2.5 text-emerald-900 text-xs">
        <BellRing className="w-4 h-4 text-emerald-600 shrink-0" />
        <p className="leading-relaxed text-[11px]">
          You will receive an SMS and email notification at <strong>{application.account.email || "your registered email"}</strong> when your application status changes.
        </p>
      </div>

      {/* Actions */}
      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-2.5">
        <Link
          href="/expert-register/status"
          className="w-full sm:w-auto px-6 py-2.5 bg-[#166534] hover:bg-[#14532d] text-white font-bold text-xs rounded-xl transition-all shadow-2xs hover:shadow-xs flex items-center justify-center gap-2 cursor-pointer group"
        >
          <span>View Application Status</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/"
          className="w-full sm:w-auto px-5 py-2.5 border border-[#E2E8E3] hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}
