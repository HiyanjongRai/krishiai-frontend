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
import { SPECIALIZATIONS_CATALOG } from "@/data/expert-options";
import { masterDataService } from "@/services/master-data";
import type { CropResponse } from "@/types/master-data";

import {
  ShieldCheck,
  Award,
  FileCheck2,
  CheckCircle2,
  Lock,
  ArrowRight,
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
      <div className="min-h-screen bg-[#F1F5F2] text-[#1F2937] font-sans antialiased">
        <Navbar />
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5" aria-busy="true">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#E5E7EB]">
            <div className="space-y-2">
              <Skeleton className="h-3 w-40 rounded-full" />
              <Skeleton className="h-7 w-72 rounded-[16px]" />
            </div>
            <Skeleton className="h-8 w-36 rounded-full" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-3">
              <Skeleton className="h-72 w-full rounded-[24px]" />
            </div>
            <div className="lg:col-span-6 space-y-4">
              <Skeleton className="h-96 w-full rounded-[28px]" />
            </div>
            <div className="lg:col-span-3">
              <Skeleton className="h-72 w-full rounded-[24px]" />
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
    <div className="min-h-screen bg-[#F1F5F2] text-[#1F2937] font-sans antialiased selection:bg-[#E8F5E9] selection:text-[#2E7D32]">
      <Navbar />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">

        {/* Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3.5 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2 text-xs text-[#9CA3AF]">
            <Link href="/" className="hover:text-[#2E7D32] transition-colors font-medium">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/experts" className="hover:text-[#2E7D32] transition-colors font-medium">Experts</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="font-bold text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-full border border-[#C8E6C9] text-[11px]">
              Expert Registration
            </span>
          </div>

          <Link
            href="/expert-register/status"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2E7D32] bg-white hover:bg-[#E8F5E9] px-3 py-1.5 rounded-full border border-[#C8E6C9] shadow-[0_2px_8px_#EEF0EE] transition-all"
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Track Application Status</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Three-column grid: Progress | Step Content | Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

          {/* Left: Registration progress rail */}
          <aside className="lg:col-span-3 lg:sticky lg:top-24">
            <RegistrationProgress />
          </aside>

          {/* Center: Active step content */}
          <main className="lg:col-span-6 space-y-4">
            {isIncompleteDraft && showResumeBanner && currentStep === 1 && (
              <ResumeApplicationCard onDismiss={() => setShowResumeBanner(false)} />
            )}
            <div className="transition-all">
              {currentStep === 1 && <AccountStep />}
              {currentStep === 2 && <ProfessionalStep />}
              {currentStep === 3 && <ExpertiseStep />}
              {currentStep === 4 && <DocumentsStep />}
              {currentStep === 5 && <ReviewStep />}
            </div>
          </main>

          {/* Right: Live application summary */}
          {!isSubmittedState && (
            <aside className="lg:col-span-3 lg:sticky lg:top-24 space-y-4">
              {/* Summary card */}
              <div className="rounded-[24px] border border-[#E5E7EB] bg-white shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE] overflow-hidden">
                <div className="px-4 py-3 border-b border-[#E5E7EB] flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-[12px] bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h2 className="text-sm font-bold text-[#1F2937]">Your application</h2>
                </div>

                <div className="p-4 space-y-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#9CA3AF]">Account</p>
                    <p className="text-sm font-bold text-[#1F2937] mt-1 truncate">
                      {application.account.fullName || "Personal information"}
                    </p>
                    <p className="text-[11px] text-[#9CA3AF] mt-0.5 truncate">
                      {application.account.email || "Complete your account details"}
                    </p>
                  </div>

                  <div className="border-t border-[#E5E7EB] pt-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#9CA3AF]">Expertise</p>
                      <span className="text-[10px] font-bold text-[#2E7D32]">
                        {(application.expertise.primaryCrops || application.expertise.crops).length} crops
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <SelectedCropBadges cropIds={application.expertise.primaryCrops || application.expertise.crops} />
                      {application.expertise.specializations.map((id) => {
                        const spec = SPECIALIZATIONS_CATALOG.find((item) => item.id === id);
                        return spec ? (
                          <span key={id} className="inline-flex items-center gap-1 rounded-full bg-white border border-[#E5E7EB] px-2 py-0.5 text-[10px] font-medium text-[#6B7280]">
                            <CheckCircle2 className="w-2.5 h-2.5 text-[#2E7D32]" />{spec.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>

                  <div className="border-t border-[#E5E7EB] pt-3 space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#9CA3AF]">What happens next?</p>
                    {([
                      [FileCheck2, "Submit application", "Send your completed details and documents"],
                      [ShieldCheck, "Admin verification", "Our team reviews your credentials"],
                      [Award, "Get verified", "Start helping farmers with trusted advice"],
                    ] as const).map(([Icon, title, description]) => (
                      <div key={title} className="flex items-start gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center shrink-0">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#1F2937]">{title}</p>
                          <p className="text-[10px] leading-relaxed text-[#9CA3AF] mt-0.5">{description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-[16px] border border-[#FCD34D] bg-[#FEF3C7] px-3 py-2.5 flex items-start gap-2">
                    <Lock className="w-3.5 h-3.5 text-[#F59E0B] mt-0.5 shrink-0" />
                    <p className="text-[10px] leading-relaxed text-[#F59E0B]">Your information is securely stored and used only for expert verification.</p>
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

function SelectedCropBadges({ cropIds }: { cropIds: string[] }) {
  const [cropCatalog, setCropCatalog] = useState<CropResponse[]>([]);

  useEffect(() => {
    if (cropIds.length === 0) return;
    void masterDataService
      .getCrops({ size: 200 })
      .then((page) => setCropCatalog(page.content ?? []))
      .catch(() => setCropCatalog([]));
  }, [cropIds.length]);

  const cropNameById = new Map(cropCatalog.map((crop) => [String(crop.id), crop.name]));

  return (
    <>
      {cropIds.map((id) => (
        <span key={id} className="inline-flex items-center gap-1 rounded-full bg-[#E8F5E9] border border-[#C8E6C9] px-2 py-0.5 text-[10px] font-bold text-[#2E7D32]">
          {cropNameById.get(String(id)) || "Selected crop"}
        </span>
      ))}
    </>
  );
}
