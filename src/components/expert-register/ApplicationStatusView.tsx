"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useExpertApplication } from "@/providers/expert-application-provider";
import { StatusBadge } from "./StatusBadge";
import { VerificationTimeline } from "./VerificationTimeline";
import { Navbar } from "@/components/layout/navbar";

import {
  Sprout,
  ArrowLeft,
  ArrowRight,
  Copy,
  Check,
  AlertCircle,
  CheckCircle2,
  FileEdit,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Mail,
  ChevronRight,
} from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/providers/toast-provider";

export function ApplicationStatusView() {
  const router = useRouter();
  const { application, goToStep, setMockStatus, isLoading } = useExpertApplication();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(application.id);
    setCopied(true);
    toast.info("Application ID copied to clipboard.");
    setTimeout(() => setCopied(false), 2000);
  };

  const status = application.status;

  const handleUpdateDocumentAction = () => {
    // Jump directly to Step 4 (Documents)
    goToStep(4);
    router.push("/expert-register");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAF6] text-[#17201A] font-sans antialiased">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6" aria-busy="true" aria-label="Loading application status">
          {/* Breadcrumb Skeleton */}
          <div className="flex items-center justify-between pb-4 border-b border-[#E2E8E3]">
            <Skeleton className="h-4 w-64 rounded-md" />
            <Skeleton className="h-4 w-28 rounded-md" />
          </div>

          {/* Hero Status Card Skeleton */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center justify-between">
              <Skeleton className="h-7 w-44 rounded-full" />
              <Skeleton className="h-7 w-32 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-8 w-80 rounded-xl" />
              <Skeleton className="h-4 w-full max-w-lg rounded-md" />
            </div>
            <Skeleton className="h-20 w-full rounded-2xl" />
          </div>

          {/* Timeline & Actions Skeleton */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-4 shadow-xs">
            <Skeleton className="h-6 w-48 rounded-lg" />
            <div className="space-y-4 pt-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-4 w-44 rounded-md" />
                    <Skeleton className="h-3 w-64 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAF6] text-[#17201A] font-sans antialiased">
      {/* Unified Full-Width Navbar */}
      <Navbar />

      {/* Main Status Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
        {/* Breadcrumb Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E2E8E3]">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
            <Link href="/" className="hover:text-[#166534] transition-colors font-medium">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/expert-register" className="hover:text-[#166534] transition-colors font-medium">
              Expert Application
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-bold text-[#166534] bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200/80">
              Application Tracker
            </span>
          </div>

          <Link
            href="/expert-register"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#166534] bg-white hover:bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200/80 shadow-2xs transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Application Form</span>
          </Link>
        </div>

        {/* Application Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8E3] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Official Expert Verification
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17201A] tracking-tight">
                Application Status
              </h1>
              <p className="text-xs sm:text-sm text-[#647067]">
                Applicant: <strong>{application.account.fullName || "Dr. Ram Prasad Sharma"}</strong> •{" "}
                {application.professional.title || "Agricultural Scientist"}
              </p>
            </div>

            <div className="flex flex-col sm:items-end gap-2">
              <StatusBadge status={status} size="lg" />
              <div className="inline-flex items-center gap-2 text-xs text-slate-500">
                <span>Application ID:</span>
                <span className="font-mono font-bold text-[#166534]">{application.id}</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700 cursor-pointer"
                  title="Copy ID"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Conditional Status Alert Banner */}
          {status === "APPROVED" && (
            <div className="p-6 rounded-2xl bg-[#F0FDF4] border-2 border-emerald-300 text-[#166534] space-y-3 animate-in fade-in duration-200">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-[#16A34A] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h2 className="text-base sm:text-lg font-black text-emerald-950">
                    You&apos;re a Verified KrishiAI Expert 🎉
                  </h2>
                  <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed">
                    Congratulations! Your agricultural credentials, identity documents, and domain experience have been officially verified by the KrishiAI Expert Committee.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href="/expert"
                  className="px-5 py-2.5 bg-[#166534] hover:bg-[#14532d] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm hover:shadow flex items-center gap-2"
                >
                  <span>Go to Expert Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <span className="text-xs font-semibold text-emerald-700">
                  Accreditation Code: KAI-EXP-VERIFIED-2026
                </span>
              </div>
            </div>
          )}

          {status === "ADDITIONAL_INFORMATION_REQUIRED" && (
            <div className="p-6 rounded-2xl bg-orange-50 border-2 border-orange-300 text-orange-950 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-orange-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h2 className="text-base sm:text-lg font-black text-orange-950">
                    Additional Information Required
                  </h2>
                  <p className="text-xs sm:text-sm text-orange-800 leading-relaxed">
                    {application.actionRequiredNotes ||
                      "Your uploaded experience certificate needs clarification. The official seal from the institution is partially blurred."}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-orange-200 text-xs sm:text-sm space-y-2">
                <p className="font-bold text-slate-900">What you can do:</p>
                <p className="text-slate-600">
                  Upload a clear, scanned copy or high-resolution photo of your Experience Certificate and resubmit. You do not need to re-enter other details.
                </p>
                <button
                  type="button"
                  onClick={handleUpdateDocumentAction}
                  className="mt-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <span>Update Document</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {status === "REJECTED" && (
            <div className="p-6 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-950 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h2 className="text-base sm:text-lg font-black text-rose-950">
                    Application Requires Changes
                  </h2>
                  <p className="text-xs sm:text-sm text-rose-800 leading-relaxed">
                    We couldn&apos;t verify one or more submitted documents with the respective academic or council registry.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-rose-200 text-xs sm:text-sm space-y-2">
                <p className="font-bold text-slate-900">Reason:</p>
                <p className="text-slate-600 italic">
                  &ldquo;{application.rejectionReason || "The uploaded experience certificate is unclear."}&rdquo;
                </p>
                <p className="font-bold text-slate-900 pt-1">What you can do:</p>
                <p className="text-slate-600">
                  Upload a clearer copy of the document or provide an alternative credential and resubmit your application. Our team is available if you have questions.
                </p>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleUpdateDocumentAction}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                  >
                    <span>Update Documents</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <a
                    href="mailto:support@krishiai.com"
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Contact Support</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {status === "DRAFT" && (
            <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm">Application Incomplete ({application.percentage}%)</span>
                <span className="text-xs font-bold text-amber-800">Draft Status</span>
              </div>
              <p className="text-xs sm:text-sm text-amber-800">
                You have started your expert application but haven&apos;t finished submitting it. Your progress is saved safely.
              </p>
              <button
                type="button"
                onClick={() => {
                  goToStep(application.currentStep);
                  router.push("/expert-register");
                }}
                className="px-5 py-2.5 bg-[#166534] hover:bg-[#14532d] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <span>Continue Application (Step {application.currentStep})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {status === "UNDER_REVIEW" && (
            <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-950 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span>Your application is being reviewed by the KrishiAI Expert Committee</span>
              </div>
              <p className="text-xs text-blue-800 leading-relaxed">
                Verification takes typically 24-48 business hours. You will receive an SMS and email notification once verified.
              </p>
            </div>
          )}

          {/* Timeline Section */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-[#17201A]">
              Verification Timeline
            </h2>
            <VerificationTimeline
              status={status}
              submittedAt={application.submittedAt}
              actionRequiredNotes={application.actionRequiredNotes}
              rejectionReason={application.rejectionReason}
              onUpdateAction={handleUpdateDocumentAction}
            />
          </div>
        </div>

        {/* Application Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Summary 1: Profile & Credentials */}
          <div className="p-5 rounded-2xl bg-white border border-[#E2E8E3] shadow-2xs space-y-3">
            <h2 className="text-sm font-bold text-[#17201A] border-b border-slate-100 pb-2">
              Submitted Credentials
            </h2>
            <div className="text-xs space-y-2">
              <p>
                <span className="text-slate-400 font-medium">Institution:</span>{" "}
                <strong className="text-[#17201A]">
                  {application.professional.institution || "Tribhuvan University, IAAS Rampur"}
                </strong>
              </p>
              <p>
                <span className="text-slate-400 font-medium">Qualification:</span>{" "}
                <strong className="text-[#17201A]">
                  {application.professional.highestQualification || "B.Sc. Agriculture (Honours)"}
                </strong>
              </p>
              <p>
                <span className="text-slate-400 font-medium">Experience:</span>{" "}
                <strong className="text-[#17201A]">
                  {application.professional.yearsOfExperience} Years
                </strong>
              </p>
              <p>
                <span className="text-slate-400 font-medium">Registration:</span>{" "}
                <strong className="text-[#17201A]">
                  {application.professional.registrationNumber || "NEC-AGR-4421"}
                </strong>
              </p>
            </div>
          </div>

          {/* Summary 2: Focus Areas */}
          <div className="p-5 rounded-2xl bg-white border border-[#E2E8E3] shadow-2xs space-y-3">
            <h2 className="text-sm font-bold text-[#17201A] border-b border-slate-100 pb-2">
              Advisory Focus Areas
            </h2>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-400 font-medium">Crops:</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {application.expertise.crops.slice(0, 4).map((c) => (
                    <span
                      key={c}
                      className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-semibold text-[11px] border border-emerald-200"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pt-1">
                <span className="text-slate-400 font-medium">Specializations:</span>
                <p className="text-[#17201A] font-semibold mt-0.5">
                  {application.expertise.specializations.length} specializations registered
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
