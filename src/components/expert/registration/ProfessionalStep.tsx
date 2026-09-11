"use client";

import React, { useState } from "react";
import { useExpertApplication } from "@/providers/expert-application-provider";
import {
  PROFESSIONAL_TITLES,
  HIGHEST_QUALIFICATIONS,
} from "@/data/expert-options";
import {
  Briefcase,
  Building2,
  GraduationCap,
  Calendar,
  Award,
  ArrowRight,
  ArrowLeft,
  X,
} from "lucide-react";

export function ProfessionalStep() {
  const { application, updateProfessional, nextStep, prevStep } = useExpertApplication();
  const prof = application.professional;

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [customTitle, setCustomTitle] = useState("");

  const errors: Record<string, string> = {};
  if (!prof.title) errors.title = "Please select a professional title";
  if (!prof.organization.trim()) errors.organization = "Organization or workplace is required";
  if (!prof.highestQualification) errors.highestQualification = "Highest qualification is required";
  if (!prof.institution.trim()) errors.institution = "College or university name is required";
  if (!prof.bio.trim()) {
    errors.bio = "Please provide a short professional bio";
  } else if (prof.bio.trim().length < 40) {
    errors.bio = "Bio should be at least 40 characters to help farmers know you";
  }

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ title: true, organization: true, highestQualification: true, institution: true, bio: true });
    if (Object.keys(errors).length === 0) nextStep();
  };

  const MAX_BIO = 500;
  const currentBioLength = prof.bio?.length || 0;

  const inputBase = "w-full py-2.5 rounded-[14px] border text-sm text-[#171717] placeholder-gray-400 bg-[#F4F4F6] focus:bg-white focus:outline-none transition-all";
  const inputNormal = "border-[rgba(234,234,236,0.85)] focus:border-[#0F9F68] focus:ring-2 focus:ring-[#DDF4EA]";
  const inputError = "border-rose-400 ring-2 ring-rose-100";

  // suppress unused variable warning
  void customTitle;
  void setCustomTitle;

  return (
    <div className="rounded-[28px] border border-[rgba(234,234,236,0.85)] bg-white p-6 sm:p-8 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04),0_2px_6px_-1px_rgba(0,0,0,0.02)] space-y-6 animate-in fade-in duration-200">
      {/* Step Header */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DDF4EA] border border-[#BCE9D5] text-[#0F9F68] text-[10px] font-black tracking-[0.12em] uppercase">
          <Briefcase className="w-3 h-3" />
          <span>Step 2 of 5 — Professional Background</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-[#171717] tracking-tight">
          Professional Background &amp; Credentials
        </h2>
        <p className="text-sm text-gray-400 leading-relaxed">
          This information helps farmers understand your experience and helps KrishiAI verify your expertise.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title & Organization */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-black text-[#171717] uppercase tracking-[0.12em]">
              Professional Title <span className="text-rose-500">*</span>
            </label>
            <select
              value={prof.title}
              onChange={(e) => updateProfessional({ title: e.target.value })}
              onBlur={() => handleBlur("title")}
              className={`${inputBase} px-3.5 cursor-pointer ${touched.title && errors.title ? inputError : inputNormal}`}
            >
              {PROFESSIONAL_TITLES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            {touched.title && errors.title && (
              <p className="text-[11px] font-medium text-rose-600 flex items-center gap-1">
                <X className="w-3 h-3" /><span>{errors.title}</span>
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-black text-[#171717] uppercase tracking-[0.12em]">
              Organization / Institution <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Building2 className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                value={prof.organization}
                onChange={(e) => updateProfessional({ organization: e.target.value })}
                onBlur={() => handleBlur("organization")}
                placeholder="e.g. Nepal Agricultural Research Council"
                className={`${inputBase} pl-9 pr-3.5 ${touched.organization && errors.organization ? inputError : inputNormal}`}
              />
            </div>
            {touched.organization && errors.organization && (
              <p className="text-[11px] font-medium text-rose-600 flex items-center gap-1">
                <X className="w-3 h-3" /><span>{errors.organization}</span>
              </p>
            )}
          </div>
        </div>

        {/* Years of Exp & Highest Qualification */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-black text-[#171717] uppercase tracking-[0.12em]">
              Years of Experience <span className="text-rose-500">*</span>
            </label>
            <select
              value={prof.yearsOfExperience}
              onChange={(e) => updateProfessional({ yearsOfExperience: e.target.value })}
              className={`${inputBase} px-3.5 cursor-pointer ${inputNormal}`}
            >
              <option value="1-2">1 to 2 Years</option>
              <option value="3-5">3 to 5 Years</option>
              <option value="5-8">5 to 8 Years</option>
              <option value="8-12">8 to 12 Years</option>
              <option value="12+">12+ Years</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-black text-[#171717] uppercase tracking-[0.12em]">
              Highest Qualification <span className="text-rose-500">*</span>
            </label>
            <select
              value={prof.highestQualification}
              onChange={(e) => updateProfessional({ highestQualification: e.target.value })}
              onBlur={() => handleBlur("highestQualification")}
              className={`${inputBase} px-3.5 cursor-pointer ${touched.highestQualification && errors.highestQualification ? inputError : inputNormal}`}
            >
              {HIGHEST_QUALIFICATIONS.map((q) => (
                <option key={q} value={q}>{q}</option>
              ))}
            </select>
            {touched.highestQualification && errors.highestQualification && (
              <p className="text-[11px] font-medium text-rose-600 flex items-center gap-1">
                <X className="w-3 h-3" /><span>{errors.highestQualification}</span>
              </p>
            )}
          </div>
        </div>

        {/* Institution & Graduation Year */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2 space-y-1.5">
            <label className="block text-[11px] font-black text-[#171717] uppercase tracking-[0.12em]">
              Graduating Institution / University <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <GraduationCap className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                value={prof.institution}
                onChange={(e) => updateProfessional({ institution: e.target.value })}
                onBlur={() => handleBlur("institution")}
                placeholder="e.g. Agriculture & Forestry University (AFU)"
                className={`${inputBase} pl-9 pr-3.5 ${touched.institution && errors.institution ? inputError : inputNormal}`}
              />
            </div>
            {touched.institution && errors.institution && (
              <p className="text-[11px] font-medium text-rose-600 flex items-center gap-1">
                <X className="w-3 h-3" /><span>{errors.institution}</span>
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-black text-[#171717] uppercase tracking-[0.12em]">
              Graduation Year
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                value={prof.graduationYear}
                onChange={(e) => updateProfessional({ graduationYear: e.target.value })}
                placeholder="2020"
                className={`${inputBase} pl-9 pr-3.5 ${inputNormal}`}
              />
            </div>
          </div>
        </div>

        {/* Registration Number (Optional) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-[11px] font-black text-[#171717] uppercase tracking-[0.12em]">
              License / Reg Number
            </label>
            <span className="text-[10px] font-bold text-gray-400 bg-[#F4F4F6] px-2 py-0.5 rounded-full border border-[rgba(234,234,236,0.85)]">
              Optional
            </span>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Award className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={prof.registrationNumber || ""}
              onChange={(e) => updateProfessional({ registrationNumber: e.target.value })}
              placeholder="e.g. NEC-AGR-4421 / DOA-EXP-90"
              className={`${inputBase} pl-9 pr-3.5 ${inputNormal}`}
            />
          </div>
          <p className="text-[10px] text-gray-400">
            Provide if registered with Nepal Engineering Council, NARC, or relevant agro authority.
          </p>
        </div>

        {/* Professional Bio */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-[11px] font-black text-[#171717] uppercase tracking-[0.12em]">
              Professional Bio <span className="text-rose-500">*</span>
            </label>
            <span className={`text-[10px] font-bold ${currentBioLength > MAX_BIO ? "text-rose-600" : "text-gray-400"}`}>
              {currentBioLength} / {MAX_BIO}
            </span>
          </div>
          <textarea
            rows={3}
            value={prof.bio}
            onChange={(e) => {
              if (e.target.value.length <= MAX_BIO) updateProfessional({ bio: e.target.value });
            }}
            onBlur={() => handleBlur("bio")}
            placeholder="Briefly describe your field experience, major advisory achievements, crop specialities, and how you assist farmers..."
            className={`w-full p-3.5 rounded-[14px] border text-sm text-[#171717] placeholder-gray-400 bg-[#F4F4F6] focus:bg-white focus:outline-none transition-all resize-none leading-relaxed ${
              touched.bio && errors.bio ? inputError : inputNormal
            }`}
          />
          {touched.bio && errors.bio && (
            <p className="text-[11px] font-medium text-rose-600 flex items-center gap-1">
              <X className="w-3 h-3" /><span>{errors.bio}</span>
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-[rgba(234,234,236,0.85)] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={prevStep}
            className="px-4 py-2.5 border border-[rgba(234,234,236,0.85)] hover:bg-[#F4F4F6] text-[#171717] font-bold text-sm rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 bg-[#0F9F68] hover:bg-[#0D8A5A] text-white font-bold text-sm rounded-full transition-all shadow-[0_4px_12px_rgba(15,159,104,0.3)] flex items-center gap-2 cursor-pointer group"
          >
            <span>Continue to Expertise Selection</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </form>
    </div>
  );
}
