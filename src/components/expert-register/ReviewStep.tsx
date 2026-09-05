"use client";

import React, { useState } from "react";
import { useExpertApplication } from "@/providers/expert-application-provider";
import { CROPS_CATALOG, SPECIALIZATIONS_CATALOG, LOCATIONS_CATALOG } from "@/data/expert-options";
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

  const { account, professional, expertise, documents, agreedToTerms } = application;

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

  const selectedCropsDetails = CROPS_CATALOG.filter((c) =>
    expertise.crops.includes(c.id)
  );

  const selectedSpecDetails = SPECIALIZATIONS_CATALOG.filter((s) =>
    expertise.specializations.includes(s.id)
  );

  const selectedLocationDetails = LOCATIONS_CATALOG.filter((l) =>
    (expertise.locations || []).includes(l.id)
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
    <div className="relative bg-white rounded-2xl p-5 sm:p-6 border border-[#E2E8E3] shadow-xs space-y-5 animate-in fade-in duration-200">
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
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F0FDF4] border border-emerald-200/80 text-[#166534] text-[10px] font-bold">
          <FileCheck2 className="w-3 h-3 text-[#166534]" />
          <span>Step 5 • Final Review & Submission</span>
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-[#17201A] tracking-tight">
          Review your complete application
        </h2>
        <p className="text-xs text-[#647067] leading-relaxed">
          Please review all submitted documents, credentials, crop expertise, and skills before sending for administrator approval.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Card 1: Account Information & Profile Picture */}
        <div className="p-5 rounded-2xl border border-[#E2E8E3] bg-[#F7F9F4] space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800">
                <User className="w-4 h-4" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[#17201A]">
                Account & Identity
              </h3>
            </div>
            <button
              type="button"
              onClick={() => goToStep(1)}
              className="text-xs font-bold text-[#166534] hover:text-[#14532d] hover:bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-1">
            {/* Profile Avatar Preview */}
            <div className="w-16 h-16 rounded-2xl bg-[#166534] text-white flex items-center justify-center font-black text-xl shadow-xs shrink-0">
              {userInitials}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm flex-1 w-full">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Full Name
                </p>
                <p className="font-bold text-[#17201A] mt-0.5">
                  {account.fullName || "—"}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Mail className="w-3 h-3 text-slate-400" />
                  <span>Email Address</span>
                </p>
                <p className="font-semibold text-[#17201A] mt-0.5 truncate">
                  {account.email || "—"}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>Phone Number</span>
                </p>
                <p className="font-semibold text-[#17201A] mt-0.5">
                  {account.phone || "—"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Professional Credentials */}
        <div className="p-5 rounded-2xl border border-[#E2E8E3] bg-[#F7F9F4] space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800">
                <Briefcase className="w-4 h-4" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[#17201A]">
                Professional Qualifications
              </h3>
            </div>
            <button
              type="button"
              onClick={() => goToStep(2)}
              className="text-xs font-bold text-[#166534] hover:text-[#14532d] hover:bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm pt-1">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Current Title / Role
              </p>
              <p className="font-semibold text-[#17201A] mt-0.5">
                {professional.title || "—"}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Organization / Employer
              </p>
              <p className="font-semibold text-[#17201A] mt-0.5">
                {professional.organization || "Independent Practice"}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Experience
              </p>
              <p className="font-semibold text-[#17201A] mt-0.5">
                {professional.yearsOfExperience} Years
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Highest Qualification
              </p>
              <p className="font-semibold text-[#17201A] mt-0.5">
                {professional.highestQualification || "—"}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                University / Institution
              </p>
              <p className="font-semibold text-[#17201A] mt-0.5">
                {professional.institution || "—"}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                License / Registration No.
              </p>
              <p className="font-semibold text-[#17201A] mt-0.5">
                {professional.registrationNumber || "Not Provided"}
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200/50">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Professional Bio & Approach
            </p>
            <p className="text-xs text-[#647067] mt-1 leading-relaxed italic bg-white p-3 rounded-xl border border-slate-200">
              &ldquo;{professional.bio || "No bio provided"}&rdquo;
            </p>
          </div>
        </div>

        {/* Card 3: Crops, Specializations, and Locations */}
        <div className="p-5 rounded-2xl border border-[#E2E8E3] bg-[#F7F9F4] space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800">
                <Sprout className="w-4 h-4" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[#17201A]">
                Crops, Skills & Service Areas
              </h3>
            </div>
            <button
              type="button"
              onClick={() => goToStep(3)}
              className="text-xs font-bold text-[#166534] hover:text-[#14532d] hover:bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          </div>

          <div className="space-y-3 pt-1">
            {/* Crops */}
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Specialized Crops ({selectedCropsDetails.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedCropsDetails.map((crop) => {
                  const isPrimary = (expertise.primaryCrops || []).includes(crop.id);
                  return (
                    <span
                      key={crop.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-bold text-[#17201A]"
                    >
                      <span>{crop.emoji}</span>
                      <span>{crop.name}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                          isPrimary
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {isPrimary ? "Primary" : "Secondary"}
                      </span>
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Specializations */}
            <div className="pt-2 border-t border-slate-200/50">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Agronomic Specializations & Skills ({selectedSpecDetails.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedSpecDetails.map((spec) => (
                  <span
                    key={spec.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0FDF4] border border-emerald-200 text-xs font-semibold text-[#166534]"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{spec.name}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Locations */}
            <div className="pt-2 border-t border-slate-200/50">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Geographic Service Areas ({selectedLocationDetails.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedLocationDetails.map((loc) => (
                  <span
                    key={loc.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700"
                  >
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{loc.name}</span>
                    <span className="text-[9px] text-slate-400">({loc.type})</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Uploaded Verification Documents */}
        <div className="p-5 rounded-2xl border border-[#E2E8E3] bg-[#F7F9F4] space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[#17201A]">
                Verification Document Proofs
              </h3>
            </div>
            <button
              type="button"
              onClick={() => goToStep(4)}
              className="text-xs font-bold text-[#166534] hover:text-[#14532d] hover:bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* 1. Identity */}
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <p className="font-bold text-[#17201A]">Citizenship / National ID</p>
                <p className="text-slate-500 truncate max-w-[180px]">
                  {documents.identity?.fileName || "Uploaded & Encrypted"}
                </p>
                {documents.identity?.fileSize && (
                  <p className="text-[10px] text-slate-400">{documents.identity.fileSize}</p>
                )}
              </div>
              <span className="text-emerald-700 font-bold flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Ready</span>
              </span>
            </div>

            {/* 2. Education */}
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <p className="font-bold text-[#17201A]">Degree Certificate</p>
                <p className="text-slate-500 truncate max-w-[180px]">
                  {documents.education?.fileName || "Uploaded & Encrypted"}
                </p>
                {documents.education?.fileSize && (
                  <p className="text-[10px] text-slate-400">{documents.education.fileSize}</p>
                )}
              </div>
              <span className="text-emerald-700 font-bold flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Ready</span>
              </span>
            </div>

            {/* 3. License */}
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <p className="font-bold text-[#17201A]">Professional License</p>
                <p className="text-slate-500 truncate max-w-[180px]">
                  {documents.license?.fileName || "Uploaded & Encrypted"}
                </p>
              </div>
              <span className="text-emerald-700 font-bold flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Ready</span>
              </span>
            </div>

            {/* 4. Experience */}
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <p className="font-bold text-[#17201A]">Experience Certificate</p>
                <p className="text-slate-500 truncate max-w-[180px]">
                  {documents.experience?.fileName || "Uploaded & Encrypted"}
                </p>
              </div>
              <span className="text-emerald-700 font-bold flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Ready</span>
              </span>
            </div>
          </div>
        </div>

        {/* Confirmation Checkbox */}
        <div className="p-4 rounded-2xl bg-[#F0FDF4] border border-emerald-200 space-y-2">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 w-4 h-4 rounded text-[#166534] focus:ring-[#166534] border-slate-300 cursor-pointer"
            />
            <span className="text-xs sm:text-sm text-[#17201A] font-medium leading-relaxed">
              I confirm that all provided documents, credentials, crop expertise, and contact details are accurate, complete, and authentic. I agree to KrishiAI&apos;s agricultural code of conduct.
            </span>
          </label>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={prevStep}
            disabled={isSubmitting}
            className="px-4 py-2.5 border border-[#E2E8E3] hover:bg-slate-50 text-[#17201A] font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-[#166534] hover:bg-[#14532d] text-white font-bold text-xs rounded-xl transition-all shadow-2xs hover:shadow-xs flex items-center justify-center gap-2 cursor-pointer group disabled:opacity-75"
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
