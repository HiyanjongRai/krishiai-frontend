"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useExpertApplication } from "@/providers/expert-application-provider";
import { RegistrationProgress } from "./RegistrationProgress";
import { AccountStep } from "./AccountStep";
import { ProfessionalStep } from "./ProfessionalStep";
import { ExpertiseStep } from "./ExpertiseStep";
import { DocumentsStep } from "./DocumentsStep";
import { ReviewStep } from "./ReviewStep";
import { SubmittedStep } from "./SubmittedStep";
import { ResumeApplicationCard } from "./ResumeApplicationCard";
import { DemoStatusSwitcher } from "./DemoStatusSwitcher";
import {
  Sprout,
  ShieldCheck,
  Award,
  Users,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Star,
} from "lucide-react";
import Image from "next/image";

export function ExpertRegistrationWizard() {
  const { application, hasExistingDraft, isLoading } = useExpertApplication();
  const [showResumeBanner, setShowResumeBanner] = useState(true);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F9F4]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-200 border-t-[#166534] rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Restoring your expert application...</p>
        </div>
      </div>
    );
  }

  const currentStep = application.currentStep;
  const isSubmittedState = application.status === "SUBMITTED" || currentStep === 6;
  const isIncompleteDraft =
    application.status === "DRAFT" &&
    (application.completedSteps.length > 0 || !!application.account.fullName);

  return (
    <div className="min-h-screen bg-[#F7F9F4] text-[#17201A] selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Mobile Bar */}
      <header className="lg:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E2E8E3] px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#F0FDF4] border border-emerald-200 flex items-center justify-center text-[#166534]">
            <Sprout className="w-4 h-4" />
          </div>
          <span className="text-lg font-black tracking-tight">
            Krishi<span className="text-[#166534]">AI</span>
          </span>
        </Link>

        <Link
          href="/expert-register/status"
          className="text-xs font-bold text-[#166534] bg-[#F0FDF4] px-3 py-1.5 rounded-lg border border-emerald-200"
        >
          Track Status
        </Link>
      </header>

      {/* Main Two-Column Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Branding & Trust Information (Sticky on Desktop) */}
          <aside className="lg:col-span-4 lg:sticky lg:top-8 space-y-6">
            {/* Desktop Brand Logo */}
            <div className="hidden lg:block">
              <Link href="/" className="inline-flex items-center gap-2.5 group">
                <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] border border-emerald-200/90 flex items-center justify-center text-[#166534] group-hover:scale-105 transition-transform shadow-2xs">
                  <Sprout className="w-5 h-5" />
                </div>
                <span className="text-2xl font-black tracking-tight text-[#17201A]">
                  Krishi<span className="text-[#166534]">AI</span>
                </span>
              </Link>
            </div>

            {/* Value Proposition Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E2E8E3] shadow-xs space-y-5">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#F0FDF4] border border-emerald-200 text-[#166534] text-[11px] font-bold uppercase tracking-wider">
                  <Award className="w-3.5 h-3.5" />
                  <span>Expert Network</span>
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-[#17201A] leading-tight">
                  Empower Farmers with Verified Knowledge
                </h1>
                <p className="text-xs sm:text-sm text-[#647067] leading-relaxed">
                  Join Nepal&apos;s leading network of agronomists, plant pathologists, and soil scientists bridging AI insights with real human judgment.
                </p>
              </div>

              {/* Trust Metrics */}
              <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#166534] shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-bold text-sm text-[#17201A]">Government & Council Recognized</h2>
                    <p className="text-slate-500 text-[11px]">
                      Credibility verified against official academic and registration standards.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#166534] shrink-0 mt-0.5">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-bold text-sm text-[#17201A]">Over 15,000+ Farmers Served</h2>
                    <p className="text-slate-500 text-[11px]">
                      Direct case referrals matched to your crop specialities and province.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#166534] shrink-0 mt-0.5">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-bold text-sm text-[#17201A]">Advisory Honorarium</h2>
                    <p className="text-slate-500 text-[11px]">
                      Earn consulting compensation for secondary diagnoses and field prescription reviews.
                    </p>
                  </div>
                </div>
              </div>

              {/* Expert Quote / Testimonial */}
              <div className="p-4 rounded-2xl bg-[#F7F9F4] border border-[#E2E8E3] space-y-3">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-[#17201A] italic leading-relaxed">
                  &ldquo;KrishiAI allows me to verify complex crop blight outbreaks in minutes rather than spending days traveling to remote hillside farms.&rdquo;
                </p>
                <div className="flex items-center gap-2.5 pt-1">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-800">
                    AS
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#17201A]">Dr. Anil Sharma</p>
                    <p className="text-[10px] text-slate-500">Agronomist, 8+ Years Experience</p>
                  </div>
                </div>
              </div>

              {/* Security Badge */}
              <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                <Lock className="w-3.5 h-3.5 text-[#166534]" />
                <span>256-bit SSL encrypted • Private data policy</span>
              </div>
            </div>

            {/* Quick Link to Status Tracker */}
            <div className="bg-white rounded-2xl p-4 border border-[#E2E8E3] flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-[#17201A]">Already applied?</p>
                <p className="text-slate-500">Track your verification progress</p>
              </div>
              <Link
                href="/expert-register/status"
                className="px-3 py-1.5 font-bold text-[#166534] hover:bg-emerald-50 rounded-lg border border-emerald-200 transition-colors"
              >
                Track Status →
              </Link>
            </div>
          </aside>

          {/* Right Column: Registration Progress & Active Step */}
          <main className="lg:col-span-8 space-y-6">
            {/* Top Navigation Row */}
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to KrishiAI Home</span>
              </Link>

              <Link
                href="/expert-register/status"
                className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-[#166534] hover:underline"
              >
                <span>Check Application Status</span>
                <span>→</span>
              </Link>
            </div>

            {/* Returning Incomplete Draft Banner */}
            {isIncompleteDraft && showResumeBanner && currentStep === 1 && (
              <ResumeApplicationCard onDismiss={() => setShowResumeBanner(false)} />
            )}

            {/* Multi-step Stepper Progress */}
            {!isSubmittedState && <RegistrationProgress />}

            {/* Step Content */}
            <div className="transition-all">
              {currentStep === 1 && <AccountStep />}
              {currentStep === 2 && <ProfessionalStep />}
              {currentStep === 3 && <ExpertiseStep />}
              {currentStep === 4 && <DocumentsStep />}
              {currentStep === 5 && <ReviewStep />}
              {currentStep === 6 && <SubmittedStep />}
            </div>
          </main>
        </div>
      </div>

      {/* Floating Demo Status Switcher */}
      <DemoStatusSwitcher />
    </div>
  );
}
