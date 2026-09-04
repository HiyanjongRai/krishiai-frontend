"use client";

import React, { useState } from "react";
import { useExpertApplication } from "@/providers/expert-application-provider";
import { CROPS_CATALOG, SPECIALIZATIONS_CATALOG } from "@/data/expert-options";
import {
  Sprout,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Layers,
  AlertCircle,
} from "lucide-react";

export function ExpertiseStep() {
  const { application, toggleCrop, toggleSpecialization, nextStep, prevStep } =
    useExpertApplication();
  const { crops, specializations } = application.expertise;

  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const hasCrops = crops.length > 0;
  const hasSpecializations = specializations.length > 0;
  const isValid = hasCrops && hasSpecializations;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAttemptedSubmit(true);
    if (isValid) {
      nextStep();
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E2E8E3] shadow-xs space-y-5 animate-in fade-in duration-200">
      {/* Step Header */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F0FDF4] border border-emerald-200/80 text-[#166534] text-[10px] font-bold">
          <Sprout className="w-3 h-3 text-[#166534]" />
          <span>Step 3 • Agricultural Domain</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h2 className="text-lg sm:text-xl font-bold text-[#17201A] tracking-tight">
            What are you an expert in?
          </h2>
          <div className="inline-flex items-center gap-1.5 bg-[#F0FDF4] text-[#166534] font-bold text-[11px] px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
            <Sparkles className="w-3 h-3 text-[#65A30D]" />
            <span>
              {crops.length} crops & {specializations.length} specializations selected
            </span>
          </div>
        </div>
        <p className="text-xs text-[#647067] leading-relaxed">
          Select the crops and agricultural areas where you have professional knowledge.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Section 1: Crops Expertise */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#17201A]">
                Crop Expertise <span className="text-rose-500">*</span>
              </h3>
              <p className="text-xs text-[#647067]">
                Choose the staple or commercial crops you advise on (select all that apply).
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500">
              {crops.length} Selected
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-1">
            {CROPS_CATALOG.map((crop) => {
              const isSelected = crops.includes(crop.id);

              return (
                <button
                  type="button"
                  key={crop.id}
                  onClick={() => toggleCrop(crop.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between gap-3 cursor-pointer group select-none ${
                    isSelected
                      ? "bg-[#F0FDF4] border-[#166534] ring-2 ring-emerald-200/80 shadow-xs scale-[1.02]"
                      : "bg-[#F7F9F4] hover:bg-white border-[#E2E8E3] hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-2xl sm:text-3xl filter group-hover:scale-110 transition-transform">
                      {crop.emoji}
                    </span>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                        isSelected
                          ? "bg-[#166534] text-white shadow-2xs"
                          : "border-2 border-slate-300 bg-white"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>

                  <div>
                    <h4
                      className={`text-xs sm:text-sm font-bold leading-tight ${
                        isSelected ? "text-[#166534]" : "text-[#17201A]"
                      }`}
                    >
                      {crop.name}
                    </h4>
                    {crop.nepaliName && (
                      <p className="text-[11px] text-slate-400 font-medium">
                        {crop.nepaliName}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {attemptedSubmit && !hasCrops && (
            <p className="text-xs font-medium text-rose-600 flex items-center gap-1.5 pt-1">
              <AlertCircle className="w-4 h-4" />
              <span>Please select at least one crop where you have practical knowledge.</span>
            </p>
          )}
        </div>

        {/* Section 2: Specializations */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#17201A]">
                Agricultural Specializations <span className="text-rose-500">*</span>
              </h3>
              <p className="text-xs text-[#647067]">
                Areas of advisory mastery where you can answer farmer queries.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500">
              {specializations.length} Selected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {SPECIALIZATIONS_CATALOG.map((spec) => {
              const isSelected = specializations.includes(spec.id);

              return (
                <button
                  type="button"
                  key={spec.id}
                  onClick={() => toggleSpecialization(spec.id)}
                  className={`p-4 rounded-2xl border text-left transition-all relative flex items-start gap-3.5 cursor-pointer select-none ${
                    isSelected
                      ? "bg-[#F0FDF4] border-[#166534] ring-2 ring-emerald-200/80 shadow-xs"
                      : "bg-[#F7F9F4] hover:bg-white border-[#E2E8E3] hover:border-slate-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md mt-0.5 flex items-center justify-center shrink-0 transition-all ${
                      isSelected
                        ? "bg-[#166534] text-white shadow-2xs"
                        : "border-2 border-slate-300 bg-white"
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>

                  <div className="space-y-1">
                    <h4
                      className={`text-xs sm:text-sm font-bold ${
                        isSelected ? "text-[#166534]" : "text-[#17201A]"
                      }`}
                    >
                      {spec.name}
                    </h4>
                    <p className="text-[11px] text-[#647067] leading-relaxed">
                      {spec.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {attemptedSubmit && !hasSpecializations && (
            <p className="text-xs font-medium text-rose-600 flex items-center gap-1.5 pt-1">
              <AlertCircle className="w-4 h-4" />
              <span>Please select at least one agricultural specialization.</span>
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={prevStep}
            className="px-4 py-2.5 border border-[#E2E8E3] hover:bg-slate-50 text-[#17201A] font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 bg-[#166534] hover:bg-[#14532d] text-white font-bold text-xs rounded-xl transition-all shadow-2xs hover:shadow-xs flex items-center justify-center gap-2 cursor-pointer group"
          >
            <span>Continue to Document Verification</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </form>
    </div>
  );
}
