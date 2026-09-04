"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { useExpertApplication } from "@/providers/expert-application-provider";
import { RegistrationProgress } from "./RegistrationProgress";
import { AccountStep } from "./AccountStep";
import { ProfessionalStep } from "./ProfessionalStep";
import { ExpertiseStep } from "./ExpertiseStep";
import { DocumentsStep } from "./DocumentsStep";
import { ReviewStep } from "./ReviewStep";
import { SubmittedStep } from "./SubmittedStep";
import { ResumeApplicationCard } from "./ResumeApplicationCard";

import {
  Sprout,
  ShieldCheck,
  Award,
  Users,
  CheckCircle2,
  Lock,
  ArrowRight,
  Star,
  Sparkles,
  HelpCircle,
  FileCheck2,
  PhoneCall,
  ChevronRight,
} from "lucide-react";

export function ExpertRegistrationWizard() {
  const { application, hasExistingDraft, isLoading } = useExpertApplication();
  const [showResumeBanner, setShowResumeBanner] = useState(true);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAF6]">
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
    <div className="min-h-screen bg-[#F8FAF6] text-[#17201A] font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* Full-Width Site Navbar matching Homepage & Farmer Dashboard */}
      <Navbar />

      {/* Main Container matching Farmer Dashboard scale */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
        
        {/* Top Breadcrumb & Quick Action Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3.5 border-b border-[#E2E8E3]">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-[#166534] transition-colors font-medium">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <Link href="/experts" className="hover:text-[#166534] transition-colors font-medium">
              Experts
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="font-bold text-[#166534] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80 text-[11px]">
              Agronomist Registration
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/expert-register/status"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#166534] bg-white hover:bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200/80 shadow-2xs transition-all hover:border-emerald-300"
            >
              <FileCheck2 className="w-3.5 h-3.5 text-[#166534]" />
              <span>Track Application Status</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
          
          {/* Left Column: Branding & Trust Authority Sidebar (Sticky on Desktop) */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
            
            {/* Primary Value Proposition Card */}
            <div className="bg-white rounded-2xl p-5 border border-[#E2E8E3] shadow-xs space-y-4">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F0FDF4] border border-emerald-200 text-[#166534] text-[10px] font-bold uppercase tracking-wider">
                  <Award className="w-3 h-3" />
                  <span>Certified Network</span>
                </span>
                <h1 className="text-base sm:text-lg font-bold text-[#17201A] leading-snug">
                  Empower Farmers with Verified Knowledge
                </h1>
                <p className="text-xs text-[#647067] leading-relaxed">
                  Join Nepal&apos;s leading network of agronomists, plant pathologists, and soil scientists bridging AI crop insights with real human judgment.
                </p>
              </div>

              {/* Impact Metrics Grid */}
              <div className="grid grid-cols-3 gap-1.5 py-2.5 px-3 bg-[#F8FAF6] rounded-xl border border-[#E2E8E3] text-center">
                <div>
                  <p className="text-sm font-black text-[#166534]">15K+</p>
                  <p className="text-[9px] font-medium text-slate-500 leading-tight">Farmers</p>
                </div>
                <div className="border-x border-slate-200">
                  <p className="text-sm font-black text-[#166534]">98.4%</p>
                  <p className="text-[9px] font-medium text-slate-500 leading-tight">Accuracy</p>
                </div>
                <div>
                  <p className="text-sm font-black text-[#166534]">NPR</p>
                  <p className="text-[9px] font-medium text-slate-500 leading-tight">Honorarium</p>
                </div>
              </div>

              {/* Trust & Credibility Metrics */}
              <div className="space-y-2.5 pt-1 text-xs">
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#166534] shrink-0 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-xs text-[#17201A]">Council Recognized</h2>
                    <p className="text-slate-500 text-[10px] leading-relaxed">
                      Verified against academic degrees and national council standards.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#166534] shrink-0 mt-0.5">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-xs text-[#17201A]">Smart Case Dispatching</h2>
                    <p className="text-slate-500 text-[10px] leading-relaxed">
                      Direct referrals matched to your crop specialities and province.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#166534] shrink-0 mt-0.5">
                    <Award className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-xs text-[#17201A]">Advisory Honorarium</h2>
                    <p className="text-slate-500 text-[10px] leading-relaxed">
                      Earn consulting compensation for secondary diagnoses & reviews.
                    </p>
                  </div>
                </div>
              </div>

              {/* Verified Expert Testimonial */}
              <div className="p-3 rounded-xl bg-[#F8FAF6] border border-[#E2E8E3] space-y-1.5">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                  <span className="text-[10px] font-bold text-slate-600 ml-1">5.0</span>
                </div>
                <p className="text-[11px] text-[#17201A] italic leading-relaxed">
                  &ldquo;KrishiAI allows me to verify complex crop blight outbreaks in minutes rather than spending days traveling to remote hillside farms.&rdquo;
                </p>
                <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-[10px] font-bold text-emerald-800">
                    AS
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#17201A]">Dr. Anil Sharma</p>
                    <p className="text-[9px] text-slate-500">Senior Agronomist, NARC • 8+ Yrs</p>
                  </div>
                </div>
              </div>

              {/* Security & Verification Guarantee */}
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                <Lock className="w-3 h-3 text-[#166534]" />
                <span>256-bit SSL encrypted • Private data policy</span>
              </div>
            </div>

            {/* Application Status Tracker Link Card */}
            <div className="bg-white rounded-2xl p-3.5 border border-[#E2E8E3] flex items-center justify-between text-xs shadow-2xs">
              <div>
                <p className="font-bold text-xs text-[#17201A]">Already applied?</p>
                <p className="text-slate-500 text-[10px]">Track verification status anytime</p>
              </div>
              <Link
                href="/expert-register/status"
                className="px-3 py-1.5 font-bold text-xs text-[#166534] bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-colors"
              >
                Track Status →
              </Link>
            </div>

            {/* Assistance Card */}
            <div className="rounded-2xl p-3.5 bg-emerald-950 text-emerald-100 space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-white text-xs">
                <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Need Assistance?</span>
              </div>
              <p className="text-[10px] text-emerald-200/80 leading-relaxed">
                Questions about certificates? Contact the expert desk.
              </p>
              <div className="flex items-center gap-1.5 pt-0.5 text-[10px] text-emerald-300 font-semibold">
                <PhoneCall className="w-3 h-3" />
                <span>experts@krishiai.gov.np</span>
              </div>
            </div>

          </aside>

          {/* Right Column: Stepper & Active Step Container */}
          <main className="lg:col-span-8 space-y-5">
            
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

    </div>
  );
}
