"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { useExpertApplication } from "@/providers/expert-application-provider";
import { RegistrationProgress } from "./RegistrationProgress";
import { AccountStep } from "./AccountStep";
import { ProfessionalStep } from "./ProfessionalStep";
import { ExpertiseStep } from "./ExpertiseStep";
import { DocumentsStep } from "./DocumentsStep";
import { ReviewStep } from "./ReviewStep";
import { ResumeApplicationCard } from "./ResumeApplicationCard";
import { CROPS_CATALOG, SPECIALIZATIONS_CATALOG } from "@/data/expert-options";

import {
  ShieldCheck,
  Award,
  Users,
  CheckCircle2,
  Lock,
  ArrowRight,
  Star,
  HelpCircle,
  FileCheck2,
  PhoneCall,
  ChevronRight,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function ExpertRegistrationWizard() {
  const { application, isLoading } = useExpertApplication();
  const [showResumeBanner, setShowResumeBanner] = useState(true);
  const router = useRouter();
  const isSubmittedState = application.status === "SUBMITTED" || application.currentStep === 6;

  useEffect(() => {
    if (!isLoading && isSubmittedState) {
      router.replace("/expert/dashboard");
    }
  }, [isLoading, isSubmittedState, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAF6] text-[#17201A] font-sans antialiased">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6" aria-busy="true" aria-label="Loading application wizard">
          {/* Header Skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
            <div className="space-y-2">
              <Skeleton className="h-4 w-48 rounded-md" />
              <Skeleton className="h-8 w-80 rounded-xl" />
            </div>
            <Skeleton className="h-8 w-36 rounded-full" />
          </div>

          {/* Progress Indicator Skeleton */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
            <Skeleton className="h-3 w-full rounded-full" />
          </div>

          {/* Wizard Step Card Skeleton */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="space-y-2">
              <Skeleton className="h-6 w-56 rounded-lg" />
              <Skeleton className="h-4 w-96 rounded-md" />
            </div>
            <div className="space-y-4 pt-2">
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
            <div className="flex justify-between pt-4 border-t border-slate-100">
              <Skeleton className="h-10 w-28 rounded-xl" />
              <Skeleton className="h-10 w-36 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (isSubmittedState) return null;

  const currentStep = application.currentStep;
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
          <aside className="hidden">
            
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

          {/* Left Column: Registration progress rail */}
          <aside className="lg:col-span-3 lg:sticky lg:top-24">
            <RegistrationProgress />
          </aside>

          {/* Right Column: Stepper & Active Step Container */}
          <main className="lg:col-span-6 space-y-5">
            
            {/* Returning Incomplete Draft Banner */}
            {isIncompleteDraft && showResumeBanner && currentStep === 1 && (
              <ResumeApplicationCard onDismiss={() => setShowResumeBanner(false)} />
            )}

            {/* Step Content */}
            <div className="transition-all">
              {currentStep === 1 && <AccountStep />}
              {currentStep === 2 && <ProfessionalStep />}
              {currentStep === 3 && <ExpertiseStep />}
              {currentStep === 4 && <DocumentsStep />}
              {currentStep === 5 && <ReviewStep />}
            </div>
          </main>

          {/* Right Column: Live application summary */}
          {!isSubmittedState && (
            <aside className="lg:col-span-3 lg:sticky lg:top-24">
              <div className="bg-white border border-[#DCE8DF] rounded-xl overflow-hidden shadow-[0_8px_24px_rgba(28,71,45,0.04)]">
                <div className="px-4 py-3 border-b border-[#E8EFEA] flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#16834C] flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h2 className="text-sm font-bold text-[#17201A]">Your application</h2>
                </div>

                <div className="p-4 space-y-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Account</p>
                    <p className="text-sm font-semibold text-[#17201A] mt-1 truncate">
                      {application.account.fullName || "Personal information"}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                      {application.account.email || "Complete your account details"}
                    </p>
                  </div>

                  <div className="border-t border-slate-100 pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Expertise</p>
                      <span className="text-[10px] font-bold text-[#16834C]">
                        {(application.expertise.primaryCrops || application.expertise.crops).length} crops
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {(application.expertise.primaryCrops || application.expertise.crops).map((id) => {
                        const crop = CROPS_CATALOG.find((item) => item.id === id);
                        return crop ? (
                          <span key={id} className="inline-flex items-center gap-1 rounded-md bg-[#F4FAF5] border border-[#D9EBDD] px-2 py-1 text-[11px] font-semibold text-[#315B3C]">
                            <span>{crop.emoji}</span>{crop.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {application.expertise.specializations.map((id) => {
                        const specialization = SPECIALIZATIONS_CATALOG.find((item) => item.id === id);
                        return specialization ? (
                          <span key={id} className="inline-flex items-center gap-1 rounded-md bg-white border border-slate-200 px-2 py-1 text-[11px] font-medium text-slate-600">
                            <CheckCircle2 className="w-3 h-3 text-[#16834C]" />{specialization.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-4 space-y-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">What happens next?</p>
                    {[
                      [FileCheck2, "Submit application", "Send your completed details and documents"],
                      [ShieldCheck, "Admin verification", "Our team reviews your credentials"],
                      [Award, "Get verified", "Start helping farmers with trusted advice"],
                    ].map(([Icon, title, description]) => (
                      <div key={title as string} className="flex items-start gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-emerald-50 text-[#16834C] flex items-center justify-center shrink-0">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#17201A]">{title as string}</p>
                          <p className="text-[10px] leading-relaxed text-slate-500 mt-0.5">{description as string}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 flex items-start gap-2">
                    <Lock className="w-3.5 h-3.5 text-amber-700 mt-0.5 shrink-0" />
                    <p className="text-[10px] leading-relaxed text-amber-900">Your information is securely stored and used only for expert verification.</p>
                  </div>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>

    </div>
  );
}
