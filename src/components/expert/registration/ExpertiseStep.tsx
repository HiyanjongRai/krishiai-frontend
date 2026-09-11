"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useExpertApplication } from "@/providers/expert-application-provider";
import { useToast } from "@/providers/toast-provider";
import {
  CROPS_CATALOG,
  SPECIALIZATIONS_CATALOG,
  LOCATIONS_CATALOG,
} from "@/data/expert-options";
import {
  Sprout,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  MapPin,
  Award,
  Search,
} from "lucide-react";

type LocationFilter = "ALL" | "PROVINCE" | "DISTRICT" | "MUNICIPALITY";

export function ExpertiseStep() {
  const {
    application,
    togglePrimaryCrop,
    toggleSecondaryCrop,
    toggleSpecialization,
    toggleLocation,
    nextStep,
    prevStep,
  } = useExpertApplication();

  const { toast } = useToast();

  const primaryCrops = application.expertise.primaryCrops || application.expertise.crops.slice(0, 3);
  const secondaryCrops = application.expertise.secondaryCrops || [];
  const specializations = application.expertise.specializations || [];
  const locations = application.expertise.locations || [];

  const [primaryLimitWarning, setPrimaryLimitWarning] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [locationQuery, setLocationQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState<LocationFilter>("ALL");

  const hasPrimaryCrops = primaryCrops.length > 0;
  const hasSpecializations = specializations.length > 0;
  const isValid = hasPrimaryCrops && hasSpecializations;
  const normalizedLocationQuery = locationQuery.trim().toLowerCase();
  const visibleLocations = LOCATIONS_CATALOG.filter((location) => {
    const matchesType = locationFilter === "ALL" || location.type === locationFilter;
    const matchesQuery = !normalizedLocationQuery
      || location.name.toLowerCase().includes(normalizedLocationQuery)
      || location.nepaliName?.toLowerCase().includes(normalizedLocationQuery);
    return matchesType && matchesQuery;
  });
  const selectedLocationDetails = LOCATIONS_CATALOG.filter((location) => locations.includes(location.id));

  const handlePrimaryCropClick = (cropId: string) => {
    const isCurrentlySelected = primaryCrops.includes(cropId);
    if (!isCurrentlySelected && primaryCrops.length >= 3) {
      setPrimaryLimitWarning(true);
      setTimeout(() => setPrimaryLimitWarning(false), 4000);
      toast.warning({
        title: "Primary crop limit reached",
        description: "You can select up to 3 primary crops for verified expertise.",
      });
      return;
    }
    setPrimaryLimitWarning(false);
    togglePrimaryCrop(cropId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAttemptedSubmit(true);
    if (isValid) {
      nextStep();
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E2E8E3] shadow-xs space-y-6 animate-in fade-in duration-200">
      {/* Step Header */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F0FDF4] border border-emerald-200/80 text-[#166534] text-[10px] font-bold">
          <Sprout className="w-3 h-3 text-[#166534]" />
          <span>Step 3 • Agricultural Domain & Expertise</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h2 className="text-lg sm:text-xl font-bold text-[#17201A] tracking-tight">
            What are your core agricultural domains?
          </h2>
          <div className="inline-flex items-center gap-1.5 bg-[#F0FDF4] text-[#166534] font-bold text-[11px] px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
            <Sparkles className="w-3 h-3 text-[#65A30D]" />
            <span>
              {primaryCrops.length} primary crops • {specializations.length} specializations
            </span>
          </div>
        </div>
        <p className="text-xs text-[#647067] leading-relaxed">
          Define your primary agricultural advisory focus, secondary crop knowledge, professional specializations, and service coverage.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Primary Crops (Max 3 Rule) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-[#17201A]">
                  Primary Crops of Advisory Focus <span className="text-rose-500">*</span>
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#166534] text-[11px] font-bold">
                  {primaryCrops.length} / 3 selected
                </span>
              </div>
              <p className="text-xs text-[#647067]">
                Choose up to 3 core crops where you have deep specialist expertise (strict platform limit).
              </p>
            </div>
          </div>

          {primaryLimitWarning && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Maximum 3 primary crops allowed. You can select other crops under <strong>Secondary Crops</strong> below.
              </span>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 pt-1">
            {CROPS_CATALOG.map((crop) => {
              const isSelected = primaryCrops.includes(crop.id);
              const isSecondary = secondaryCrops.includes(crop.id);

              return (
                <button
                  type="button"
                  key={`primary-${crop.id}`}
                  onClick={() => handlePrimaryCropClick(crop.id)}
                  className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between gap-2 cursor-pointer group select-none ${
                    isSelected
                      ? "bg-[#F0FDF4] border-[#166534] ring-2 ring-emerald-200/80 shadow-xs scale-[1.01]"
                      : isSecondary
                      ? "bg-slate-50 border-dashed border-slate-300 opacity-60"
                      : "bg-[#F7F9F4] hover:bg-white border-[#E2E8E3] hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="relative h-10 w-10 overflow-hidden rounded-lg filter group-hover:scale-110 transition-transform">
                      <Image
                        src={crop.image}
                        alt={crop.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </span>
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                        isSelected
                          ? "bg-[#166534] text-white shadow-2xs"
                          : "border-2 border-slate-300 bg-white"
                      }`}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                  </div>

                  <div>
                    <h4
                      className={`text-xs font-bold leading-tight ${
                        isSelected ? "text-[#166534]" : "text-[#17201A]"
                      }`}
                    >
                      {crop.name}
                    </h4>
                    {crop.nepaliName && (
                      <p className="text-[10px] text-slate-400 font-medium">
                        {crop.nepaliName}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {attemptedSubmit && !hasPrimaryCrops && (
            <p className="text-xs font-medium text-rose-600 flex items-center gap-1.5 pt-1">
              <AlertCircle className="w-4 h-4" />
              <span>Please select at least one primary crop (up to 3).</span>
            </p>
          )}
        </div>

        {/* Section 2: Secondary Crops */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#17201A]">
                Secondary Crops Knowledge <span className="text-slate-400 font-normal text-xs">(Optional)</span>
              </h3>
              <p className="text-xs text-[#647067]">
                Additional crops where you possess general diagnostic and advisory knowledge.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500">
              {secondaryCrops.length} Selected
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 pt-1">
            {CROPS_CATALOG.filter((c) => !primaryCrops.includes(c.id)).map((crop) => {
              const isSelected = secondaryCrops.includes(crop.id);

              return (
                <button
                  type="button"
                  key={`secondary-${crop.id}`}
                  onClick={() => toggleSecondaryCrop(crop.id)}
                  className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between gap-2 cursor-pointer group select-none ${
                    isSelected
                      ? "bg-[#F0FDF4] border-[#166534] ring-1 ring-emerald-200/80 shadow-xs"
                      : "bg-[#F7F9F4] hover:bg-white border-[#E2E8E3] hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="relative h-8 w-8 overflow-hidden rounded-lg filter group-hover:scale-105 transition-transform">
                      <Image
                        src={crop.image}
                        alt={crop.name}
                        fill
                        sizes="32px"
                        className="object-cover"
                      />
                    </span>
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                        isSelected
                          ? "bg-[#166534] text-white"
                          : "border-2 border-slate-300 bg-white"
                      }`}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                  </div>

                  <div>
                    <h4
                      className={`text-xs font-bold leading-tight ${
                        isSelected ? "text-[#166534]" : "text-[#17201A]"
                      }`}
                    >
                      {crop.name}
                    </h4>
                    {crop.nepaliName && (
                      <p className="text-[10px] text-slate-400 font-medium">
                        {crop.nepaliName}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Professional Specializations */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#166534]" />
                <h3 className="text-sm sm:text-base font-bold text-[#17201A]">
                  Professional Agricultural Specializations <span className="text-rose-500">*</span>
                </h3>
              </div>
              <p className="text-xs text-[#647067]">
                Areas of scientific, technical, or agronomic mastery beyond individual crops.
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
                  className={`p-3.5 rounded-xl border text-left transition-all relative flex items-start gap-3 cursor-pointer select-none ${
                    isSelected
                      ? "bg-[#F0FDF4] border-[#166534] ring-2 ring-emerald-200/80 shadow-xs"
                      : "bg-[#F7F9F4] hover:bg-white border-[#E2E8E3] hover:border-slate-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-md mt-0.5 flex items-center justify-center shrink-0 transition-all ${
                      isSelected
                        ? "bg-[#166534] text-white shadow-2xs"
                        : "border-2 border-slate-300 bg-white"
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>

                  <div className="space-y-0.5">
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

        {/* Section 4: Geographic Coverage */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#166534]" />
                <h3 className="text-sm sm:text-base font-bold text-[#17201A]">
                  Geographic Advisory Coverage <span className="text-slate-400 font-normal text-xs">(Optional)</span>
                </h3>
              </div>
              <p className="text-xs text-[#647067]">
                Provinces, districts, and municipalities where you provide localized field advisory and consultation.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500">
              {locations.length} Selected
            </span>
          </div>

          <div className="rounded-2xl border border-[#E2E8E3] bg-[#F8FBF8] p-3 sm:p-4 space-y-3">
            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="relative flex-1">
                <span className="sr-only">Search locations</span>
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={locationQuery}
                  onChange={(event) => setLocationQuery(event.target.value)}
                  placeholder="Search province or district"
                  className="h-10 w-full rounded-xl border border-[#DCE8DF] bg-white pl-9 pr-3 text-xs text-[#17201A] outline-none transition focus:border-[#166534] focus:ring-2 focus:ring-emerald-100"
                />
              </label>
              <div className="flex rounded-xl border border-[#DCE8DF] bg-white p-1" role="group" aria-label="Filter locations by type">
                {(["ALL", "PROVINCE", "DISTRICT", "MUNICIPALITY"] as LocationFilter[]).map((filter) => (
                  <button
                    type="button"
                    key={filter}
                    onClick={() => setLocationFilter(filter)}
                    className={`flex-1 rounded-lg px-2 py-1.5 text-[10px] font-bold transition sm:flex-none sm:px-3 ${
                      locationFilter === filter
                        ? "bg-[#166534] text-white shadow-sm"
                        : "text-slate-500 hover:bg-slate-50 hover:text-[#166534]"
                    }`}
                  >
                    {filter === "ALL" ? "All" : filter.charAt(0) + filter.slice(1).toLowerCase() + "s"}
                  </button>
                ))}
              </div>
            </div>

            {selectedLocationDetails.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="mr-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">Selected</span>
                {selectedLocationDetails.slice(0, 4).map((location) => (
                  <button
                    type="button"
                    key={`selected-${location.id}`}
                    onClick={() => toggleLocation(location.id)}
                    className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] font-bold text-[#166534] hover:bg-emerald-100"
                  >
                    {location.name}
                    <span aria-hidden="true">x</span>
                  </button>
                ))}
                {selectedLocationDetails.length > 4 && (
                  <span className="text-[10px] font-semibold text-slate-400">+{selectedLocationDetails.length - 4} more</span>
                )}
              </div>
            )}

            {visibleLocations.length > 0 ? (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {visibleLocations.map((loc) => {
              const isSelected = locations.includes(loc.id);

              return (
                <button
                  type="button"
                  key={loc.id}
                  onClick={() => toggleLocation(loc.id)}
                  aria-pressed={isSelected}
                  className={`min-h-14 rounded-xl border p-2.5 text-left transition-all flex items-center justify-between gap-2 cursor-pointer select-none ${
                    isSelected
                      ? "bg-[#F0FDF4] border-[#166534] text-[#166534] ring-1 ring-emerald-200/80 font-bold"
                      : "bg-white hover:border-emerald-300 hover:bg-[#FCFEFC] border-[#E2E8E3] text-[#17201A] font-medium"
                  }`}
                >
                  <div className="truncate">
                    <span className="text-xs block truncate">{loc.name}</span>
                    <span className="text-[10px] text-slate-400 block">{loc.nepaliName} · {loc.type.toLowerCase()}</span>
                  </div>
                  <div
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${
                      isSelected
                        ? "bg-[#166534] text-white"
                        : "border border-slate-300 bg-white"
                    }`}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-white px-4 py-7 text-center">
                <MapPin className="mx-auto h-5 w-5 text-slate-300" />
                <p className="mt-2 text-xs font-semibold text-slate-500">No locations found</p>
                <p className="mt-1 text-[10px] text-slate-400">
                  {locationFilter === "MUNICIPALITY" ? "Municipalities will appear when they are added to the backend catalog." : "Try a different search or location type."}
                </p>
              </div>
            )}
          </div>
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
