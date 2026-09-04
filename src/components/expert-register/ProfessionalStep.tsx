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
  FileText,
} from "lucide-react";

export function ProfessionalStep() {
  const { application, updateProfessional, nextStep, prevStep } = useExpertApplication();
  const prof = application.professional;

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [customTitle, setCustomTitle] = useState("");

  const errors: Record<string, string> = {};
  if (!prof.title) {
    errors.title = "Please select a professional title";
  }
  if (!prof.organization.trim()) {
    errors.organization = "Organization or workplace is required";
  }
  if (!prof.highestQualification) {
    errors.highestQualification = "Highest qualification is required";
  }
  if (!prof.institution.trim()) {
    errors.institution = "College or university name is required";
  }
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
    setTouched({
      title: true,
      organization: true,
      highestQualification: true,
      institution: true,
      bio: true,
    });

    if (Object.keys(errors).length === 0) {
      nextStep();
    }
  };

  const MAX_BIO = 500;
  const currentBioLength = prof.bio?.length || 0;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E2E8E3] shadow-xs space-y-8 animate-in fade-in duration-200">
      {/* Step Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0FDF4] border border-emerald-200/80 text-[#166534] text-xs font-semibold">
          <Briefcase className="w-3.5 h-3.5 text-[#166534]" />
          <span>Step 2 • Professional Background</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17201A] tracking-tight">
          Tell us about your professional background
        </h2>
        <p className="text-sm sm:text-base text-[#647067] leading-relaxed">
          This information helps farmers understand your experience and helps KrishiAI verify your expertise.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title & Organization */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Professional Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#17201A] uppercase tracking-wide">
              Professional Title <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                value={prof.title}
                onChange={(e) => updateProfessional({ title: e.target.value })}
                onBlur={() => handleBlur("title")}
                className="w-full px-4 py-3 rounded-xl border border-[#E2E8E3] text-sm text-[#17201A] bg-[#F7F9F4] focus:bg-white focus:outline-none focus:border-[#166534] focus:ring-2 focus:ring-emerald-100 transition-all cursor-pointer"
              >
                {PROFESSIONAL_TITLES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            {touched.title && errors.title && (
              <p className="text-xs font-medium text-rose-600 flex items-center gap-1">
                <X className="w-3.5 h-3.5" />
                <span>{errors.title}</span>
              </p>
            )}
          </div>

          {/* Organization */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#17201A] uppercase tracking-wide">
              Organization / Institution <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Building2 className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={prof.organization}
                onChange={(e) => updateProfessional({ organization: e.target.value })}
                onBlur={() => handleBlur("organization")}
                placeholder="e.g. Nepal Agricultural Research Council / Agrovet"
                className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-[#17201A] placeholder-slate-400 bg-[#F7F9F4] focus:bg-white focus:outline-none transition-all ${
                  touched.organization && errors.organization
                    ? "border-rose-400 ring-1 ring-rose-200"
                    : "border-[#E2E8E3] focus:border-[#166534] focus:ring-2 focus:ring-emerald-100"
                }`}
              />
            </div>
            {touched.organization && errors.organization && (
              <p className="text-xs font-medium text-rose-600 flex items-center gap-1">
                <X className="w-3.5 h-3.5" />
                <span>{errors.organization}</span>
              </p>
            )}
          </div>
        </div>

        {/* Years of Exp & Highest Qualification */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Years of Experience */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#17201A] uppercase tracking-wide">
              Years of Experience <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                value={prof.yearsOfExperience}
                onChange={(e) => updateProfessional({ yearsOfExperience: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-[#E2E8E3] text-sm text-[#17201A] bg-[#F7F9F4] focus:bg-white focus:outline-none focus:border-[#166534] focus:ring-2 focus:ring-emerald-100 transition-all cursor-pointer"
              >
                <option value="1-2">1 to 2 Years</option>
                <option value="3-5">3 to 5 Years</option>
                <option value="5-8">5 to 8 Years</option>
                <option value="8-12">8 to 12 Years</option>
                <option value="12+">12+ Years</option>
              </select>
            </div>
          </div>

          {/* Highest Qualification */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#17201A] uppercase tracking-wide">
              Highest Qualification <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                value={prof.highestQualification}
                onChange={(e) => updateProfessional({ highestQualification: e.target.value })}
                onBlur={() => handleBlur("highestQualification")}
                className="w-full px-4 py-3 rounded-xl border border-[#E2E8E3] text-sm text-[#17201A] bg-[#F7F9F4] focus:bg-white focus:outline-none focus:border-[#166534] focus:ring-2 focus:ring-emerald-100 transition-all cursor-pointer"
              >
                {HIGHEST_QUALIFICATIONS.map((q) => (
                  <option key={q} value={q}>
                    {q}
                  </option>
                ))}
              </select>
            </div>
            {touched.highestQualification && errors.highestQualification && (
              <p className="text-xs font-medium text-rose-600 flex items-center gap-1">
                <X className="w-3.5 h-3.5" />
                <span>{errors.highestQualification}</span>
              </p>
            )}
          </div>
        </div>

        {/* Institution & Graduation Year */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Institution */}
          <div className="sm:col-span-2 space-y-1.5">
            <label className="block text-xs font-bold text-[#17201A] uppercase tracking-wide">
              Graduating Institution / University <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <GraduationCap className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={prof.institution}
                onChange={(e) => updateProfessional({ institution: e.target.value })}
                onBlur={() => handleBlur("institution")}
                placeholder="e.g. Agriculture & Forestry University (AFU)"
                className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-[#17201A] placeholder-slate-400 bg-[#F7F9F4] focus:bg-white focus:outline-none transition-all ${
                  touched.institution && errors.institution
                    ? "border-rose-400 ring-1 ring-rose-200"
                    : "border-[#E2E8E3] focus:border-[#166534] focus:ring-2 focus:ring-emerald-100"
                }`}
              />
            </div>
            {touched.institution && errors.institution && (
              <p className="text-xs font-medium text-rose-600 flex items-center gap-1">
                <X className="w-3.5 h-3.5" />
                <span>{errors.institution}</span>
              </p>
            )}
          </div>

          {/* Graduation Year */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#17201A] uppercase tracking-wide">
              Graduation Year
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Calendar className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={prof.graduationYear}
                onChange={(e) => updateProfessional({ graduationYear: e.target.value })}
                placeholder="2020"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E2E8E3] text-sm text-[#17201A] bg-[#F7F9F4] focus:bg-white focus:outline-none focus:border-[#166534] focus:ring-2 focus:ring-emerald-100 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Professional Registration Number (Optional) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-[#17201A] uppercase tracking-wide">
              Professional Registration / License Number
            </label>
            <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
              Optional
            </span>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Award className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={prof.registrationNumber || ""}
              onChange={(e) => updateProfessional({ registrationNumber: e.target.value })}
              placeholder="e.g. NEC-AGR-4421 / DOA-EXP-90"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E2E8E3] text-sm text-[#17201A] placeholder-slate-400 bg-[#F7F9F4] focus:bg-white focus:outline-none focus:border-[#166534] focus:ring-2 focus:ring-emerald-100 transition-all"
            />
          </div>
          <p className="text-[11px] text-slate-500">
            Provide if registered with Nepal Engineering Council, NARC, or relevant agro authority.
          </p>
        </div>

        {/* Professional Bio with Character Counter */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-[#17201A] uppercase tracking-wide">
              Professional Bio <span className="text-rose-500">*</span>
            </label>
            <span
              className={`text-xs font-bold ${
                currentBioLength > MAX_BIO ? "text-rose-600" : "text-slate-400"
              }`}
            >
              {currentBioLength} / {MAX_BIO} characters
            </span>
          </div>
          <textarea
            rows={4}
            value={prof.bio}
            onChange={(e) => {
              if (e.target.value.length <= MAX_BIO) {
                updateProfessional({ bio: e.target.value });
              }
            }}
            onBlur={() => handleBlur("bio")}
            placeholder="Briefly describe your field experience, major advisory achievements, crop specialities, and how you assist farmers..."
            className={`w-full p-4 rounded-xl border text-sm text-[#17201A] placeholder-slate-400 bg-[#F7F9F4] focus:bg-white focus:outline-none transition-all resize-none leading-relaxed ${
              touched.bio && errors.bio
                ? "border-rose-400 ring-1 ring-rose-200"
                : "border-[#E2E8E3] focus:border-[#166534] focus:ring-2 focus:ring-emerald-100"
            }`}
          />
          {touched.bio && errors.bio && (
            <p className="text-xs font-medium text-rose-600 flex items-center gap-1">
              <X className="w-3.5 h-3.5" />
              <span>{errors.bio}</span>
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={prevStep}
            className="px-6 py-3 border border-[#E2E8E3] hover:bg-slate-50 text-[#17201A] font-bold text-sm rounded-xl transition-all flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            type="submit"
            className="px-8 py-3.5 bg-[#166534] hover:bg-[#14532d] text-white font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer group"
          >
            <span>Continue to Expertise Selection</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </form>
    </div>
  );
}
