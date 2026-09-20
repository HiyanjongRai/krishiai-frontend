"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useExpertApplication } from "@/providers/expert-application-provider";
import { SPECIALIZATIONS_CATALOG } from "@/data/expert-options";
import { masterDataService } from "@/services/master-data";
import type { CropResponse, LocationResponse } from "@/types/master-data";
import {
  FileCheck2,
  Edit3,
  User,
  Briefcase,
  Sprout,
  FileText,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  MapPin,
  Award,
  Sparkles,
  Phone,
  Mail,
  GraduationCap,
  Building2,
  Loader2,
} from "lucide-react";
import AgricultureLoader from "@/components/ui/loading-box";
import { useToast } from "@/providers/toast-provider";
import { getApiErrorMessage } from "@/lib/toast-utils";

export function ReviewStep() {
  const {
    application,
    goToStep,
    prevStep,
    setAgreedToTerms,
    submitApplication,
  } = useExpertApplication();

  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [cropCatalog, setCropCatalog] = useState<CropResponse[]>([]);
  const [locationCatalog, setLocationCatalog] = useState<LocationResponse[]>([]);

  const { account, professional, expertise, documents, agreedToTerms } = application;

  useEffect(() => {
    let alive = true;
    Promise.all([
      masterDataService.getCrops({ size: 200 }),
      masterDataService.getLocations(),
    ])
      .then(([cropPage, locationData]) => {
        if (!alive) return;
        setCropCatalog(cropPage.content ?? []);
        setLocationCatalog(locationData);
      })
      .catch(() => {
        if (!alive) return;
        setCropCatalog([]);
        setLocationCatalog([]);
      });
    return () => { alive = false; };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      setErrorMsg("Please confirm that the submitted information is accurate.");
      return;
    }

    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      await submitApplication();
      toast.success({
        title: "Application submitted",
        description: "Your expert application has been submitted for professional verification.",
      });
    } catch (e) {
      const msg = getApiErrorMessage(e, "Submission failed. Please try again.");
      setErrorMsg(msg);
      toast.error({
        title: "Submission failed",
        description: msg,
      });
      setIsSubmitting(false);
    }
  };

  const allCropsSet = new Set([
    ...(expertise.primaryCrops || []),
    ...(expertise.secondaryCrops || []),
    ...(expertise.crops || []),
  ]);
  const selectedCropsDetails = useMemo(
    () => cropCatalog.filter((c) => allCropsSet.has(String(c.id))),
    [allCropsSet, cropCatalog]
  );

  const selectedAreas = expertise.expertiseAreas || [];

  const selectedSpecDetails = SPECIALIZATIONS_CATALOG.filter((s) =>
    expertise.specializations.includes(s.id)
  );

  const selectedLocationDetails = useMemo(
    () => locationCatalog.filter((l) => (expertise.locations || []).includes(String(l.id))),
    [expertise.locations, locationCatalog]
  );

  const userInitials = account.fullName
    ? account.fullName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "EX";

  return (
    <div className="relative bg-white rounded-2xl p-5 sm:p-6 border border-[#E5E7EB] shadow-xs space-y-5 animate-in fade-in duration-200">
      {/* Submitting Loading Overlay */}
      {isSubmitting && (
        <AgricultureLoader
          fullScreen={true}
          title="Cultivating Your Verification"
          subtitle="Encrypting credentials and submitting application to KrishiAI registry..."
        />
      )}

      {/* Step Header */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E8F5E9] border border-[#A5D6A7]/80 text-[#1B5E20] text-[10px] font-bold">
          <FileCheck2 className="w-3 h-3 text-[#1B5E20]" />
          <span>Step 5 • Final Review & Submission</span>
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-[#1F2937] tracking-tight">
          Review your complete application
        </h2>
        <p className="text-xs text-[#6B7280] leading-relaxed">
          Please review all submitted documents, credentials, crop expertise, and skills before sending for administrator approval.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Card 1: Account Information & Profile Picture */}
        <div className="p-5 rounded-2xl border border-[#E5E7EB] bg-[#F8FAF8] space-y-4">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#E8F5E9] flex items-center justify-center text-[#1B5E20]">
                <User className="w-4 h-4" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[#1F2937]">
                Account & Identity
              </h3>
            </div>
            <button
              type="button"
              onClick={() => goToStep(1)}
              className="text-xs font-bold text-[#1B5E20] hover:text-[#1B5E20] hover:bg-[#E8F5E9] px-2.5 py-1 rounded-lg border border-[#A5D6A7] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-1">
            {/* Profile Avatar Preview */}
            <div className="w-16 h-16 rounded-2xl bg-[#1B5E20] text-white flex items-center justify-center font-black text-xl shadow-xs shrink-0">
              {userInitials}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm flex-1 w-full">
              <div>
                <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">
                  Full Name
                </p>
                <p className="font-bold text-[#1F2937] mt-0.5">
                  {account.fullName || "—"}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider flex items-center gap-1">
                  <Mail className="w-3 h-3 text-[#9CA3AF]" />
                  <span>Email Address</span>
                </p>
                <p className="font-semibold text-[#1F2937] mt-0.5 truncate">
                  {account.email || "—"}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider flex items-center gap-1">
                  <Phone className="w-3 h-3 text-[#9CA3AF]" />
                  <span>Phone Number</span>
                </p>
                <p className="font-semibold text-[#1F2937] mt-0.5">
                  {account.phone || "—"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Professional Credentials */}
        <div className="p-5 rounded-2xl border border-[#E5E7EB] bg-[#F8FAF8] space-y-4">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#E8F5E9] flex items-center justify-center text-[#1B5E20]">
                <Briefcase className="w-4 h-4" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[#1F2937]">
                Professional Qualifications
              </h3>
            </div>
            <button
              type="button"
              onClick={() => goToStep(2)}
              className="text-xs font-bold text-[#1B5E20] hover:text-[#1B5E20] hover:bg-[#E8F5E9] px-2.5 py-1 rounded-lg border border-[#A5D6A7] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm pt-1">
            <div>
              <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">
                Current Title / Role
              </p>
              <p className="font-semibold text-[#1F2937] mt-0.5">
                {professional.title || "—"}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">
                Organization / Employer
              </p>
              <p className="font-semibold text-[#1F2937] mt-0.5">
                {professional.organization || "Independent Practice"}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">
                Experience
              </p>
              <p className="font-semibold text-[#1F2937] mt-0.5">
                {professional.yearsOfExperience} Years
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">
                Highest Qualification
              </p>
              <p className="font-semibold text-[#1F2937] mt-0.5">
                {professional.highestQualification || "—"}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">
                University / Institution
              </p>
              <p className="font-semibold text-[#1F2937] mt-0.5">
                {professional.institution || "—"}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">
                License / Registration No.
              </p>
              <p className="font-semibold text-[#1F2937] mt-0.5">
                {professional.registrationNumber || "Not Provided"}
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-[#EEF0EE]">
            <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">
              Professional Bio & Approach
            </p>
            <p className="text-xs text-[#6B7280] mt-1 leading-relaxed italic bg-white p-3 rounded-xl border border-[#E5E7EB]">
              &ldquo;{professional.bio || "No bio provided"}&rdquo;
            </p>
          </div>
        </div>

        {/* Card 3: Crops, Specializations, and Locations */}
        <div className="p-5 rounded-2xl border border-[#E5E7EB] bg-[#F8FAF8] space-y-4">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#E8F5E9] flex items-center justify-center text-[#1B5E20]">
                <Sprout className="w-4 h-4" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[#1F2937]">
                Crops, Skills & Service Areas
              </h3>
            </div>
            <button
              type="button"
              onClick={() => goToStep(3)}
              className="text-xs font-bold text-[#1B5E20] hover:text-[#1B5E20] hover:bg-[#E8F5E9] px-2.5 py-1 rounded-lg border border-[#A5D6A7] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          </div>

          <div className="space-y-3 pt-1">
            {/* Crops */}
            <div>
              <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">
                Specialized Crops ({selectedCropsDetails.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedCropsDetails.map((crop) => {
                  const isPrimary = (expertise.primaryCrops || []).includes(String(crop.id));
                  return (
                    <span
                      key={crop.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E5E7EB] text-xs font-bold text-[#1F2937]"
                    >
                      <span>{crop.name}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                          isPrimary
                            ? "bg-[#E8F5E9] text-[#1B5E20]"
                            : "bg-[#F1F5F2] text-[#4B5563]"
                        }`}
                      >
                        {isPrimary ? "Primary" : "Secondary"}
                      </span>
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Expertise Areas */}
            {selectedAreas.length > 0 && (
              <div className="pt-2 border-t border-[#EEF0EE]">
                <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">
                  Agricultural Domains ({selectedAreas.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedAreas.map((areaId) => (
                    <span
                      key={areaId}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F5E9] border border-[#A5D6A7] text-xs font-bold text-[#1B5E20]"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#2E7D32]" />
                      <span>{areaId.replace(/_/g, " ")}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Specializations */}
            <div className="pt-2 border-t border-[#EEF0EE]">
              <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">
                Agronomic Specializations & Skills ({selectedSpecDetails.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedSpecDetails.map((spec) => (
                  <span
                    key={spec.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F5E9] border border-[#A5D6A7] text-xs font-semibold text-[#1B5E20]"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />
                    <span>{spec.name}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Locations */}
            <div className="pt-2 border-t border-[#EEF0EE]">
              <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">
                Geographic Service Areas ({selectedLocationDetails.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedLocationDetails.map((loc) => (
                  <span
                    key={loc.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E5E7EB] text-xs font-semibold text-[#4B5563]"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#2E7D32]" />
                    <span>{loc.name}</span>
                    <span className="text-[9px] text-[#9CA3AF]">({loc.type})</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Uploaded Verification Documents */}
        <div className="p-5 rounded-2xl border border-[#E5E7EB] bg-[#F8FAF8] space-y-4">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#E8F5E9] flex items-center justify-center text-[#1B5E20]">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[#1F2937]">
                Verification Document Proofs
              </h3>
            </div>
            <button
              type="button"
              onClick={() => goToStep(4)}
              className="text-xs font-bold text-[#1B5E20] hover:text-[#1B5E20] hover:bg-[#E8F5E9] px-2.5 py-1 rounded-lg border border-[#A5D6A7] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* 1. Identity */}
            <div className="p-3.5 bg-white rounded-xl border border-[#E5E7EB] flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <p className="font-bold text-[#1F2937]">Citizenship / National ID</p>
                <p className="text-[#6B7280] truncate max-w-[180px]">
                  {documents.identity?.fileName || "Uploaded & Encrypted"}
                </p>
                {documents.identity?.fileSize && (
                  <p className="text-[10px] text-[#9CA3AF]">{documents.identity.fileSize}</p>
                )}
              </div>
              <span className="text-[#2E7D32] font-bold flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
                <span>Ready</span>
              </span>
            </div>

            {/* 2. Education */}
            <div className="p-3.5 bg-white rounded-xl border border-[#E5E7EB] flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <p className="font-bold text-[#1F2937]">Degree Certificate</p>
                <p className="text-[#6B7280] truncate max-w-[180px]">
                  {documents.education?.fileName || "Uploaded & Encrypted"}
                </p>
                {documents.education?.fileSize && (
                  <p className="text-[10px] text-[#9CA3AF]">{documents.education.fileSize}</p>
                )}
              </div>
              <span className="text-[#2E7D32] font-bold flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
                <span>Ready</span>
              </span>
            </div>

            {/* 3. License */}
            <div className="p-3.5 bg-white rounded-xl border border-[#E5E7EB] flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <p className="font-bold text-[#1F2937]">Professional License</p>
                <p className="text-[#6B7280] truncate max-w-[180px]">
                  {documents.license?.fileName || "Uploaded & Encrypted"}
                </p>
              </div>
              <span className="text-[#2E7D32] font-bold flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
                <span>Ready</span>
              </span>
            </div>

            {/* 4. Experience */}
            <div className="p-3.5 bg-white rounded-xl border border-[#E5E7EB] flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <p className="font-bold text-[#1F2937]">Experience Certificate</p>
                <p className="text-[#6B7280] truncate max-w-[180px]">
                  {documents.experience?.fileName || "Uploaded & Encrypted"}
                </p>
              </div>
              <span className="text-[#2E7D32] font-bold flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
                <span>Ready</span>
              </span>
            </div>
          </div>
        </div>

        {/* Confirmation Checkbox */}
        <div className="p-4 rounded-2xl bg-[#E8F5E9] border border-[#A5D6A7] space-y-2">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 w-4 h-4 rounded text-[#1B5E20] focus:ring-[#1B5E20] border-[#D1D5DB] cursor-pointer"
            />
            <span className="text-xs sm:text-sm text-[#1F2937] font-medium leading-relaxed">
              I confirm that all provided documents, credentials, crop expertise, and contact details are accurate, complete, and authentic. I agree to KrishiAI&apos;s agricultural code of conduct.
            </span>
          </label>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-[#FEE2E2] border border-[#FCA5A5] text-[#DC2626] text-xs sm:text-sm font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Actions */}
        <div className="pt-3 border-t border-[#EEF0EE] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={prevStep}
            disabled={isSubmitting}
            className="px-4 py-2.5 border border-[#E5E7EB] hover:bg-[#F8FAF8] text-[#1F2937] font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-[#1B5E20] hover:bg-[#1B5E20] text-white font-bold text-xs rounded-xl transition-all shadow-2xs hover:shadow-xs flex items-center justify-center gap-2 cursor-pointer group disabled:opacity-75"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Submitting to Registry...</span>
              </>
            ) : (
              <>
                <span>Submit Application for Approval</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
