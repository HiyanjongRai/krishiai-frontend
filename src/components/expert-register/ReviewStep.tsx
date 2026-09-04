"use client";

import React, { useState } from "react";
import { useExpertApplication } from "@/providers/expert-application-provider";
import { CROPS_CATALOG, SPECIALIZATIONS_CATALOG } from "@/data/expert-options";
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
  Loader2,
} from "lucide-react";
import AgricultureLoader from "@/components/ui/loading-box";

export function ReviewStep() {
  const {
    application,
    goToStep,
    prevStep,
    setAgreedToTerms,
    submitApplication,
  } = useExpertApplication();

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
    } catch (e) {
      setErrorMsg("Submission failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  const selectedCropsDetails = CROPS_CATALOG.filter((c) =>
    expertise.crops.includes(c.id)
  );

  const selectedSpecDetails = SPECIALIZATIONS_CATALOG.filter((s) =>
    expertise.specializations.includes(s.id)
  );

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
          <span>Step 5 • Final Review</span>
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-[#17201A] tracking-tight">
          Review your application
        </h2>
        <p className="text-xs text-[#647067] leading-relaxed">
          Please check your information before submitting your application. You can edit any section if needed.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Card 1: Account Information */}
        <div className="p-5 rounded-2xl border border-[#E2E8E3] bg-[#F7F9F4] space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800">
                <User className="w-4 h-4" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[#17201A]">
                Account & Contact
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm pt-1">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Full Name
              </p>
              <p className="font-semibold text-[#17201A] mt-0.5">
                {account.fullName || "—"}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Email Address
              </p>
              <p className="font-semibold text-[#17201A] mt-0.5">
                {account.email || "—"}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Phone Number
              </p>
              <p className="font-semibold text-[#17201A] mt-0.5">
                {account.phone || "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Professional Information */}
        <div className="p-5 rounded-2xl border border-[#E2E8E3] bg-[#F7F9F4] space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800">
                <Briefcase className="w-4 h-4" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[#17201A]">
                Professional Background
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

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs sm:text-sm pt-1">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Professional Title
              </p>
              <p className="font-semibold text-[#17201A] mt-0.5">
                {professional.title || "—"}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Organization / Institution
              </p>
              <p className="font-semibold text-[#17201A] mt-0.5">
                {professional.organization || "—"}
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
                Graduating Institution
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
              Professional Bio
            </p>
            <p className="text-xs text-[#647067] mt-1 leading-relaxed italic bg-white p-3 rounded-xl border border-slate-200">
              "{professional.bio || "No bio provided"}"
            </p>
          </div>
        </div>

        {/* Card 3: Expertise */}
        <div className="p-5 rounded-2xl border border-[#E2E8E3] bg-[#F7F9F4] space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800">
                <Sprout className="w-4 h-4" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[#17201A]">
                Expertise & Crops
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
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Crops ({selectedCropsDetails.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedCropsDetails.map((crop) => (
                  <span
                    key={crop.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-bold text-[#17201A]"
                  >
                    <span>{crop.emoji}</span>
                    <span>{crop.name}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/50">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Specializations ({selectedSpecDetails.length})
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
          </div>
        </div>

        {/* Card 4: Documents */}
        <div className="p-5 rounded-2xl border border-[#E2E8E3] bg-[#F7F9F4] space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[#17201A]">
                Verification Documents
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
            <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <p className="font-bold text-[#17201A]">Identity Document</p>
                <p className="text-slate-500 truncate max-w-[180px]">
                  {documents.identity?.fileName || "Missing"}
                </p>
              </div>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Uploaded</span>
              </span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <p className="font-bold text-[#17201A]">Educational Certificate</p>
                <p className="text-slate-500 truncate max-w-[180px]">
                  {documents.education?.fileName || "Missing"}
                </p>
              </div>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Uploaded</span>
              </span>
            </div>

            {documents.license && (
              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <p className="font-bold text-[#17201A]">Professional License</p>
                  <p className="text-slate-500 truncate max-w-[180px]">
                    {documents.license.fileName}
                  </p>
                </div>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Uploaded</span>
                </span>
              </div>
            )}

            {documents.experience && (
              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <p className="font-bold text-[#17201A]">Experience Certificate</p>
                  <p className="text-slate-500 truncate max-w-[180px]">
                    {documents.experience.fileName}
                  </p>
                </div>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Uploaded</span>
                </span>
              </div>
            )}
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
              I confirm that the information provided is accurate, complete, and belongs to me. I agree to KrishiAI's code of conduct for agricultural advisory services.
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
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Submitting Application...</span>
              </>
            ) : (
              <>
                <span>Submit Application</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
