"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useExpertApplication } from "@/providers/expert-application-provider";
import { useToast } from "@/providers/toast-provider";
import {
  CROPS_CATALOG,
  SPECIALIZATIONS_CATALOG,
  EXPERTISE_AREAS_CATALOG,
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
  FileCheck2,
  Upload,
  Info,
  ChevronDown,
  ChevronUp,
  FileText,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";
import type { ExpertiseLevel, ExpertiseSourceType } from "@/types/expert-application";

type LocationFilter = "ALL" | "PROVINCE" | "DISTRICT" | "MUNICIPALITY";

const EVIDENCE_TYPE_OPTIONS: { value: ExpertiseSourceType; label: string }[] = [
  { value: "CERTIFICATE", label: "Training / Academic Certificate" },
  { value: "EXPERIENCE", label: "Experience Letter / Reference" },
  { value: "LICENSE", label: "Professional License" },
  { value: "ORGANIZATION", label: "Organization / Employment Evidence" },
  { value: "QUALIFICATION", label: "Degree / Diploma Credential" },
  { value: "SELF_DECLARED", label: "Other Supporting Evidence" },
];

const EXPERTISE_LEVEL_OPTIONS: { value: ExpertiseLevel; label: string; desc: string }[] = [
  { value: "BEGINNER", label: "Beginner", desc: "Basic working knowledge" },
  { value: "INTERMEDIATE", label: "Intermediate", desc: "Practical advisory experience" },
  { value: "ADVANCED", label: "Advanced", desc: "Extensive diagnostic & agronomic skills" },
  { value: "SPECIALIST", label: "Specialist", desc: "Recognized domain authority or researcher" },
];

export function ExpertiseStep() {
  const {
    application,
    togglePrimaryCrop,
    toggleSecondaryCrop,
    toggleExpertiseArea,
    toggleSpecialization,
    toggleLocation,
    updateClaimDetail,
    setSupportingEvidence,
    nextStep,
    prevStep,
  } = useExpertApplication();

  const { toast } = useToast();

  const primaryCrops = application.expertise.primaryCrops || application.expertise.crops.slice(0, 3);
  const secondaryCrops = application.expertise.secondaryCrops || [];
  const expertiseAreas = application.expertise.expertiseAreas || [];
  const specializations = application.expertise.specializations || [];
  const locations = application.expertise.locations || [];
  const claimDetails = application.expertise.claimDetails || {};
  const supportingEvidence = application.expertise.supportingEvidence;

  const [expandedClaim, setExpandedClaim] = useState<string | null>(null);
  const [evidenceTitle, setEvidenceTitle] = useState(supportingEvidence?.title || "");
  const [evidenceType, setEvidenceType] = useState<ExpertiseSourceType>(supportingEvidence?.sourceType || "CERTIFICATE");
  const [evidenceFileName, setEvidenceFileName] = useState(supportingEvidence?.fileName || "");
  const [evidenceFileUrl, setEvidenceFileUrl] = useState(supportingEvidence?.fileUrl || "");
  const [isUploadingEvidence, setIsUploadingEvidence] = useState(false);

  const [primaryLimitWarning, setPrimaryLimitWarning] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [locationQuery, setLocationQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState<LocationFilter>("ALL");

  const hasPrimaryCrops = primaryCrops.length > 0;
  const hasExpertiseOrSpec = expertiseAreas.length > 0 || specializations.length > 0;
  const isValid = hasPrimaryCrops;

  const normalizedLocationQuery = locationQuery.trim().toLowerCase();
  const visibleLocations = LOCATIONS_CATALOG.filter((location) => {
    const matchesType = locationFilter === "ALL" || location.type === locationFilter;
    const matchesQuery = !normalizedLocationQuery
      || location.name.toLowerCase().includes(normalizedLocationQuery)
      || location.nepaliName?.toLowerCase().includes(normalizedLocationQuery);
    return matchesType && matchesQuery;
  });

  const handlePrimaryCropClick = (cropId: string) => {
    const isCurrentlySelected = primaryCrops.includes(cropId);
    if (!isCurrentlySelected && primaryCrops.length >= 3) {
      setPrimaryLimitWarning(true);
      setTimeout(() => setPrimaryLimitWarning(false), 4000);
      toast.warning({
        title: "Primary crop limit reached",
        description: "You can select up to 3 primary crops.",
      });
      return;
    }
    setPrimaryLimitWarning(false);
    togglePrimaryCrop(cropId);
  };

  const handleEvidenceFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      toast.error({ title: "File too large", description: "Supporting document must be under 15MB." });
      return;
    }

    setIsUploadingEvidence(true);
    setEvidenceFileName(file.name);

    // Read preview or create object URL
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setEvidenceFileUrl(dataUrl);
      setSupportingEvidence({
        title: evidenceTitle || file.name.replace(/\.[^/.]+$/, ""),
        sourceType: evidenceType,
        fileName: file.name,
        fileUrl: dataUrl,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        fileType: file.type,
      });
      setIsUploadingEvidence(false);
      toast.success({ title: "Evidence attached", description: "Optional evidence file uploaded." });
    };
    reader.onerror = () => {
      setIsUploadingEvidence(false);
      toast.error({ title: "Upload failed", description: "Could not read the selected file." });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAttemptedSubmit(true);
    if (!hasPrimaryCrops) {
      toast.warning({
        title: "Primary crops required",
        description: "Please select at least one primary crop for your advisory profile.",
      });
      return;
    }
    nextStep();
  };

  // List of all selected claim keys for Section 4 details
  const allSelectedClaims = [
    ...primaryCrops.map((c) => ({ key: c, name: c, type: "PRIMARY CROP" as const })),
    ...secondaryCrops.map((c) => ({ key: c, name: c, type: "SECONDARY CROP" as const })),
    ...expertiseAreas.map((a) => {
      const item = EXPERTISE_AREAS_CATALOG.find((x) => x.id === a);
      return { key: a, name: item ? item.name : a, type: "DOMAIN AREA" as const };
    }),
  ];

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-7 border border-[#E2E8E3] shadow-xs space-y-7 animate-in fade-in duration-200">
      {/* Step Header */}
      <div className="space-y-2 border-b border-[#E2E8E3] pb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#F0FDF4] border border-emerald-200/80 text-[#166534] text-[11px] font-bold">
          <Sprout className="w-3.5 h-3.5 text-[#166534]" />
          <span>Step 3 • Specialization & Domains</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h1 className="text-xl sm:text-2xl font-black text-[#17201A] tracking-tight">
            Your Expertise
          </h1>
          <div className="inline-flex items-center gap-1.5 bg-[#F0FDF4] text-[#166534] font-bold text-xs px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
            <Sparkles className="w-3.5 h-3.5 text-[#65A30D]" />
            <span>
              {primaryCrops.length}/3 primary • {secondaryCrops.length} secondary • {expertiseAreas.length} areas
            </span>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-[#647067] leading-relaxed">
          Tell farmers what crops and agricultural areas you specialize in. You can add more expertise later from your dashboard.
        </p>
      </div>

      {/* Informational Card: How verification works */}
      <div className="rounded-2xl border border-emerald-100 bg-gradient-to-r from-[#F0FDF4] to-emerald-50/50 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xs sm:text-sm font-bold text-[#166534]">How verification works</h3>
            <ol className="text-[11px] sm:text-xs text-[#2A4333] space-y-1 list-decimal list-inside leading-relaxed">
              <li><strong>Professional Verification:</strong> We verify your professional credentials, degrees, and identity documents.</li>
              <li><strong>Expertise Claims:</strong> You can add multiple crops and agricultural domains anytime.</li>
              <li><strong>Initial Status:</strong> Your expertise starts as self-declared unless supporting evidence is reviewed.</li>
              <li><strong>Verified Badge:</strong> Verified expertise receives a verified badge and priority in farmer matching.</li>
              <li><strong>Continuous Growth:</strong> You can add new expertise claims later from your dashboard without resetting your professional standing.</li>
            </ol>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION 1 — PRIMARY CROPS */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-[#17201A]">
                  Primary Crops <span className="text-rose-500">*</span>
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#166534] text-[11px] font-bold">
                  {primaryCrops.length} of 3 primary crops selected
                </span>
              </div>
              <p className="text-xs text-[#647067] mt-0.5">
                Select up to 3 core crops where you have deep advisory focus and primary experience.
              </p>
            </div>
          </div>

          {primaryLimitWarning && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>You can select a maximum of 3 primary crops. Click another primary crop to deselect it first.</span>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {CROPS_CATALOG.map((crop) => {
              const isSelected = primaryCrops.includes(crop.id);
              const isSecondary = secondaryCrops.includes(crop.id);
              return (
                <button
                  key={crop.id}
                  type="button"
                  onClick={() => handlePrimaryCropClick(crop.id)}
                  className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between min-h-[96px] ${
                    isSelected
                      ? "border-[#166534] bg-[#F0FDF4] shadow-xs"
                      : isSecondary
                      ? "border-emerald-200/60 bg-white opacity-60 hover:opacity-100"
                      : "border-[#E2E8E3] bg-white hover:border-emerald-300 hover:bg-[#FAFDFB]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="text-xl">{crop.emoji || "🌱"}</span>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-[#166534] text-white flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <div>
                    <p className={`text-xs font-bold ${isSelected ? "text-[#166534]" : "text-[#17201A]"}`}>
                      {crop.name}
                    </p>
                    {crop.nepaliName && (
                      <p className="text-[10px] text-gray-400">{crop.nepaliName}</p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          {attemptedSubmit && !hasPrimaryCrops && (
            <p className="text-xs text-rose-600 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" /> Please select at least one primary crop.
            </p>
          )}
        </div>

        {/* SECTION 2 — SECONDARY CROPS */}
        <div className="space-y-3 pt-4 border-t border-[#E2E8E3]">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-[#17201A]">
              Secondary Crops (Supporting Knowledge)
            </h2>
            <p className="text-xs text-[#647067] mt-0.5">
              Select crops you have working knowledge in. You can advise on these as self-declared or submit evidence anytime.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {CROPS_CATALOG.map((crop) => {
              const isPrimary = primaryCrops.includes(crop.id);
              const isSecondary = secondaryCrops.includes(crop.id);
              if (isPrimary) return null; // Don't show in secondary if primary

              return (
                <button
                  key={`sec-${crop.id}`}
                  type="button"
                  onClick={() => toggleSecondaryCrop(crop.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all flex items-center gap-1.5 ${
                    isSecondary
                      ? "bg-emerald-50 border-emerald-300 text-[#166534] font-bold shadow-xs"
                      : "bg-white border-[#E2E8E3] text-[#425046] hover:border-emerald-300 hover:bg-[#FAFDFB]"
                  }`}
                >
                  <span>{crop.emoji || "🌱"}</span>
                  <span>{crop.name}</span>
                  {isSecondary && <Check className="w-3 h-3 text-[#166534]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 3 — EXPERTISE AREAS */}
        <div className="space-y-3 pt-4 border-t border-[#E2E8E3]">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-[#17201A]">
              Agricultural Expertise Areas
            </h2>
            <p className="text-xs text-[#647067] mt-0.5">
              Select broader agricultural disciplines where you provide advisory support.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {EXPERTISE_AREAS_CATALOG.map((area) => {
              const isSelected = expertiseAreas.includes(area.id);
              return (
                <button
                  key={area.id}
                  type="button"
                  onClick={() => toggleExpertiseArea(area.id)}
                  className={`p-3 rounded-xl border text-left transition-all flex items-start justify-between gap-2 ${
                    isSelected
                      ? "border-[#166534] bg-[#F0FDF4] shadow-xs"
                      : "border-[#E2E8E3] bg-white hover:border-emerald-300 hover:bg-[#FAFDFB]"
                  }`}
                >
                  <div>
                    <p className={`text-xs font-bold ${isSelected ? "text-[#166534]" : "text-[#17201A]"}`}>
                      {area.name}
                    </p>
                    <p className="text-[11px] text-[#647067] leading-relaxed mt-0.5">
                      {area.description}
                    </p>
                  </div>
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected ? "bg-[#166534] text-white" : "border border-gray-300 bg-white"
                  }`}>
                    {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 4 — EXPERTISE DETAILS (Optional) */}
        {allSelectedClaims.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-[#E2E8E3]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#17201A]">
                  Expertise Details (Optional)
                </h2>
                <p className="text-xs text-[#647067] mt-0.5">
                  Provide experience level, years in practice, or notes for your claimed expertise.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {allSelectedClaims.map((claim) => {
                const isExpanded = expandedClaim === claim.key;
                const detail = claimDetails[claim.key] || {};

                return (
                  <div key={`detail-${claim.key}`} className="border border-[#E2E8E3] rounded-xl overflow-hidden bg-white">
                    <button
                      type="button"
                      onClick={() => setExpandedClaim(isExpanded ? null : claim.key)}
                      className="w-full px-4 py-2.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800">{claim.name}</span>
                        <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          {claim.type}
                        </span>
                        {detail.level && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {detail.level}
                          </span>
                        )}
                        {detail.yearsOfExperience !== undefined && (
                          <span className="text-[10px] text-slate-500 font-medium">
                            {detail.yearsOfExperience} yrs exp
                          </span>
                        )}
                      </div>
                      <div className="text-slate-400">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-3 animate-in fade-in">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              Expertise Level
                            </label>
                            <select
                              value={detail.level || "INTERMEDIATE"}
                              onChange={(e) => updateClaimDetail(claim.key, {
                                level: e.target.value as ExpertiseLevel,
                                name: claim.name,
                              })}
                              className="w-full text-xs rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            >
                              {EXPERTISE_LEVEL_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label} — {opt.desc}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              Years of Experience in this domain
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="60"
                              placeholder="e.g. 5"
                              value={detail.yearsOfExperience ?? ""}
                              onChange={(e) => updateClaimDetail(claim.key, {
                                yearsOfExperience: e.target.value ? parseInt(e.target.value, 10) : undefined,
                                name: claim.name,
                              })}
                              className="w-full text-xs rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Short Description / Practice Note
                          </label>
                          <textarea
                            rows={2}
                            maxLength={500}
                            placeholder={`e.g. Specialized in ${claim.name} disease identification, pest mitigation, and high-yield crop rotation.`}
                            value={detail.description || ""}
                            onChange={(e) => updateClaimDetail(claim.key, {
                              description: e.target.value,
                              name: claim.name,
                            })}
                            className="w-full text-xs rounded-lg border border-slate-200 bg-white p-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION 5 — OPTIONAL SUPPORTING EVIDENCE */}
        <div className="space-y-3 pt-4 border-t border-[#E2E8E3]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-[#17201A]">
                Supporting Evidence (Optional)
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                Optional
              </span>
            </div>
            <p className="text-xs text-[#647067] mt-0.5 leading-relaxed">
              You may provide evidence supporting your expertise. You do not need to upload a separate document for every crop.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Evidence Document Type
                </label>
                <select
                  value={evidenceType}
                  onChange={(e) => setEvidenceType(e.target.value as ExpertiseSourceType)}
                  className="w-full text-xs rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  {EVIDENCE_TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Certificate / Document Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Advanced Vegetable Production Certificate"
                  value={evidenceTitle}
                  onChange={(e) => setEvidenceTitle(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Upload Certificate / Letter (PDF or Image, max 15MB)
              </label>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-300 bg-white text-emerald-700 hover:bg-emerald-50 text-xs font-bold transition-all shadow-xs">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploadingEvidence ? "Reading file..." : "Choose Document"}</span>
                  <input
                    type="file"
                    accept=".pdf,image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={handleEvidenceFileUpload}
                  />
                </label>
                {evidenceFileName ? (
                  <span className="text-xs text-slate-600 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-emerald-600" />
                    <strong>{evidenceFileName}</strong>
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400">No document attached yet</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 6 — COVERAGE LOCATIONS */}
        <div className="space-y-3 pt-4 border-t border-[#E2E8E3]">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-[#17201A]">
              Service Coverage Locations
            </h2>
            <p className="text-xs text-[#647067] mt-0.5">
              Select the districts and provinces where you are available for farmer consultations and field visits.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                placeholder="Search district or province..."
                className="w-full text-xs rounded-lg border border-slate-200 pl-8 pr-3 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div className="flex gap-1">
              {(["ALL", "PROVINCE", "DISTRICT"] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setLocationFilter(filter)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                    locationFilter === filter
                      ? "bg-slate-800 text-white border-slate-800"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-2 border border-slate-200 rounded-xl bg-slate-50/40">
            {visibleLocations.map((loc) => {
              const isSelected = locations.includes(loc.id);
              return (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => toggleLocation(loc.id)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors flex items-center gap-1 ${
                    isSelected
                      ? "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold"
                      : "bg-white text-slate-600 border-slate-200 hover:border-emerald-300"
                  }`}
                >
                  <MapPin className="w-2.5 h-2.5" />
                  <span>{loc.name}</span>
                  {isSelected && <Check className="w-2.5 h-2.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Wizard Navigation Footer */}
        <div className="flex items-center justify-between pt-6 border-t border-[#E2E8E3]">
          <button
            type="button"
            onClick={prevStep}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous Step</span>
          </button>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#166534] hover:bg-[#14532D] text-white text-xs font-bold transition-all shadow-md hover:shadow-lg cursor-pointer"
          >
            <span>Continue to Documents</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
}
