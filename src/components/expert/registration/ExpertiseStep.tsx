"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useExpertApplication } from "@/providers/expert-application-provider";
import { useToast } from "@/providers/toast-provider";
import {
  SPECIALIZATIONS_CATALOG,
  EXPERTISE_AREAS_CATALOG,
} from "@/data/expert-options";
import { masterDataService } from "@/services/master-data";
import type { CropResponse, LocationResponse } from "@/types/master-data";
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
  X,
  HelpCircle,
} from "lucide-react";
import type { ExpertiseLevel, ExpertiseSourceType } from "@/types/expert-application";

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
  const [cropQuery, setCropQuery] = useState("");
  const [cropCatalog, setCropCatalog] = useState<CropResponse[]>([]);
  const [cropLoadError, setCropLoadError] = useState<string | null>(null);
  const [isLoadingCrops, setIsLoadingCrops] = useState(true);
  const [provinces, setProvinces] = useState<LocationResponse[]>([]);
  const [districts, setDistricts] = useState<LocationResponse[]>([]);
  const [municipalities, setMunicipalities] = useState<LocationResponse[]>([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState("");
  const [selectedDistrictId, setSelectedDistrictId] = useState("");
  const [selectedMunicipalityId, setSelectedMunicipalityId] = useState("");
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(true);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  const [isLoadingMunicipalities, setIsLoadingMunicipalities] = useState(false);
  const [locationLoadError, setLocationLoadError] = useState<string | null>(null);

  const hasPrimaryCrops = primaryCrops.length > 0;
  const hasExpertiseOrSpec = expertiseAreas.length > 0 || specializations.length > 0;
  const isValid = hasPrimaryCrops;

  useEffect(() => {
    let alive = true;
    const timer = window.setTimeout(() => {
      setIsLoadingCrops(true);
      masterDataService.getCrops({ size: 200 })
        .then((page) => {
          if (!alive) return;
          setCropCatalog(page.content ?? []);
          setCropLoadError(null);
        })
        .catch(() => {
          if (!alive) return;
          setCropCatalog([]);
          setCropLoadError("Unable to load crops from the server.");
        })
        .finally(() => {
          if (alive) setIsLoadingCrops(false);
        });

      setIsLoadingProvinces(true);
      masterDataService.getProvinces()
        .then((data) => {
          if (!alive) return;
          setProvinces(data);
          setLocationLoadError(null);
        })
        .catch(() => {
          if (!alive) return;
          setProvinces([]);
          setLocationLoadError("Unable to load locations from the server.");
        })
        .finally(() => {
          if (alive) setIsLoadingProvinces(false);
        });
    }, 0);

    return () => {
      alive = false;
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    let alive = true;
    const timer = window.setTimeout(() => {
      if (!selectedProvinceId) {
        setDistricts([]);
        setSelectedDistrictId("");
        return;
      }
      setIsLoadingDistricts(true);
      setSelectedDistrictId("");
      setSelectedMunicipalityId("");
      setMunicipalities([]);
      masterDataService.getDistricts(Number(selectedProvinceId))
        .then((data) => {
          if (alive) setDistricts(data);
        })
        .catch(() => {
          if (!alive) return;
          setDistricts([]);
          setLocationLoadError("Unable to load districts for the selected province.");
        })
        .finally(() => {
          if (alive) setIsLoadingDistricts(false);
        });
    }, 0);

    return () => {
      alive = false;
      window.clearTimeout(timer);
    };
  }, [selectedProvinceId]);

  useEffect(() => {
    let alive = true;
    const timer = window.setTimeout(() => {
      if (!selectedDistrictId) {
        setMunicipalities([]);
        setSelectedMunicipalityId("");
        return;
      }
      setIsLoadingMunicipalities(true);
      setSelectedMunicipalityId("");
      masterDataService.getMunicipalities(Number(selectedDistrictId))
        .then((data) => {
          if (alive) setMunicipalities(data);
        })
        .catch(() => {
          if (!alive) return;
          setMunicipalities([]);
          setLocationLoadError("Unable to load municipalities for the selected district.");
        })
        .finally(() => {
          if (alive) setIsLoadingMunicipalities(false);
        });
    }, 0);

    return () => {
      alive = false;
      window.clearTimeout(timer);
    };
  }, [selectedDistrictId]);

  const cropNameById = useMemo(() => new Map(cropCatalog.map((crop) => [String(crop.id), crop.name])), [cropCatalog]);
  const locationNameById = useMemo(() => {
    const all = [...provinces, ...districts, ...municipalities];
    return new Map(all.map((location) => [String(location.id), location.name]));
  }, [provinces, districts, municipalities]);

  const filteredCrops = useMemo(() => {
    const query = cropQuery.trim().toLowerCase();
    return cropCatalog.filter((crop) => {
      if (!query) return true;
      return crop.name.toLowerCase().includes(query)
        || crop.nepaliName?.toLowerCase().includes(query)
        || crop.categoryName?.toLowerCase().includes(query);
    });
  }, [cropCatalog, cropQuery]);

  const cropsByCategory = useMemo(() => {
    return filteredCrops.reduce<Record<string, CropResponse[]>>((acc, crop) => {
      const category = crop.categoryName || "Uncategorized";
      acc[category] = [...(acc[category] ?? []), crop];
      return acc;
    }, {});
  }, [filteredCrops]);

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
    ...primaryCrops.map((c) => ({ key: c, name: cropNameById.get(c) ?? c, type: "PRIMARY CROP" as const })),
    ...secondaryCrops.map((c) => ({ key: c, name: cropNameById.get(c) ?? c, type: "SECONDARY CROP" as const })),
    ...expertiseAreas.map((a) => {
      const item = EXPERTISE_AREAS_CATALOG.find((x) => x.id === a);
      return { key: a, name: item ? item.name : a, type: "DOMAIN AREA" as const };
    }),
  ];

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-7 border border-[#E5E7EB] shadow-xs space-y-7 animate-in fade-in duration-200">
      {/* Step Header */}
      <div className="space-y-2 border-b border-[#E5E7EB] pb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#E8F5E9] border border-[#A5D6A7]/80 text-[#1B5E20] text-[11px] font-bold">
          <Sprout className="w-3.5 h-3.5 text-[#1B5E20]" />
          <span>Step 3 • Specialization & Domains</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h1 className="text-xl sm:text-2xl font-black text-[#1F2937] tracking-tight">
            Your Expertise
          </h1>
          <div className="inline-flex items-center gap-1.5 bg-[#E8F5E9] text-[#1B5E20] font-bold text-xs px-3 py-1 rounded-full border border-[#A5D6A7] self-start sm:self-auto">
            <Sparkles className="w-3.5 h-3.5 text-[#2E7D32]" />
            <span>
              {primaryCrops.length}/3 primary • {secondaryCrops.length} secondary • {expertiseAreas.length} areas
            </span>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed">
          Tell farmers what crops and agricultural areas you specialize in. You can add more expertise later from your dashboard.
        </p>
      </div>

      {/* Informational Card: How verification works */}
      <div className="rounded-2xl border border-[#C8E6C9] bg-gradient-to-r from-[#E8F5E9] to-[#E8F5E9]/50 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#2E7D32] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xs sm:text-sm font-bold text-[#1B5E20]">How verification works</h3>
            <ol className="text-[11px] sm:text-xs text-[#1F2937] space-y-1 list-decimal list-inside leading-relaxed">
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
                <h2 className="text-sm sm:text-base font-bold text-[#1F2937]">
                  Primary Crops <span className="text-[#DC2626]">*</span>
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-[#E8F5E9] border border-[#A5D6A7] text-[#1B5E20] text-[11px] font-bold">
                  {primaryCrops.length} of 3 primary crops selected
                </span>
              </div>
              <p className="text-xs text-[#6B7280] mt-0.5">
                Select up to 3 core crops where you have deep advisory focus and primary experience.
              </p>
            </div>
          </div>

          {primaryLimitWarning && (
            <div className="p-3 bg-[#FEF3C7] border border-[#FCD34D] rounded-xl text-xs text-[#F59E0B] flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-[#F59E0B] shrink-0" />
              <span>You can select a maximum of 3 primary crops. Click another primary crop to deselect it first.</span>
            </div>
          )}

          <div className="relative">
            <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={cropQuery}
              onChange={(event) => setCropQuery(event.target.value)}
              placeholder="Search crops by name, Nepali name, or category"
              aria-label="Search crops"
              className="w-full rounded-lg border border-[#E5E7EB] bg-white py-2 pl-9 pr-3 text-xs text-[#1F2937] outline-none transition-colors focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/10"
            />
          </div>

          {isLoadingCrops ? (
            <div className="rounded-xl border border-[#E5E7EB] bg-[#F8FAF8] p-6 text-center text-xs text-[#6B7280]">
              Loading crops from catalog...
            </div>
          ) : cropLoadError ? (
            <div className="rounded-xl border border-[#FCA5A5] bg-[#FEE2E2] p-4 text-xs text-[#DC2626]">
              {cropLoadError}
            </div>
          ) : Object.keys(cropsByCategory).length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#E5E7EB] bg-[#F8FAF8] p-6 text-center text-xs text-[#6B7280]">
              No active crops match your search.
            </div>
          ) : (
            <div className="space-y-5">
              {Object.entries(cropsByCategory).map(([category, categoryCrops]) => (
                <div key={category} className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">{category}</h3>
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                    {categoryCrops.map((crop) => {
                      const cropId = String(crop.id);
                      const isSelected = primaryCrops.includes(cropId);
                      const isSecondary = secondaryCrops.includes(cropId);
                      return (
                        <button
                          key={crop.id}
                          type="button"
                          onClick={() => handlePrimaryCropClick(cropId)}
                          className={`flex min-h-[88px] items-center gap-3 rounded-xl border p-3 text-left transition-colors ${
                            isSelected
                              ? "border-[#C8E6C9] bg-[#E8F5E9]"
                              : isSecondary
                              ? "border-[#A5D6A7] bg-white opacity-70 hover:opacity-100"
                              : "border-[#E5E7EB] bg-white hover:border-[#A5D6A7]"
                          }`}
                        >
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-[#E5E7EB] bg-[#F8FAF8]">
                            {crop.imageUrl ? (
                              <Image src={crop.imageUrl} alt={crop.name} fill sizes="48px" className="object-contain p-1.5" unoptimized />
                            ) : (
                              <Sprout className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className={`truncate text-xs font-bold ${isSelected ? "text-[#1B5E20]" : "text-[#1F2937]"}`}>{crop.name}</p>
                            {crop.nepaliName && <p className="truncate text-[11px] text-[#6B7280]">{crop.nepaliName}</p>}
                            <p className="mt-0.5 truncate text-[10px] font-medium text-[#9CA3AF]">{crop.categoryName}</p>
                          </div>
                          {isSelected && (
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#2E7D32] text-white">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
          {attemptedSubmit && !hasPrimaryCrops && (
            <p className="text-xs text-[#DC2626] flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" /> Please select at least one primary crop.
            </p>
          )}
        </div>

        {/* SECTION 2 — SECONDARY CROPS */}
        <div className="space-y-3 pt-4 border-t border-[#E5E7EB]">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-[#1F2937]">
              Secondary Crops (Supporting Knowledge)
            </h2>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Select crops you have working knowledge in. You can advise on these as self-declared or submit evidence anytime.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {cropCatalog.map((crop) => {
              const cropId = String(crop.id);
              const isPrimary = primaryCrops.includes(cropId);
              const isSecondary = secondaryCrops.includes(cropId);
              if (isPrimary) return null; // Don't show in secondary if primary

              return (
                <button
                  key={`sec-${crop.id}`}
                  type="button"
                  onClick={() => toggleSecondaryCrop(cropId)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                    isSecondary
                      ? "bg-[#E8F5E9] border-[#A5D6A7] text-[#1B5E20] font-bold"
                      : "bg-white border-[#E5E7EB] text-[#4B5563] hover:border-[#A5D6A7] hover:bg-[#FCFEFC]"
                  }`}
                >
                  <span>{crop.name}</span>
                  {isSecondary && <Check className="w-3 h-3 text-[#1B5E20]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 3 — EXPERTISE AREAS */}
        <div className="space-y-3 pt-4 border-t border-[#E5E7EB]">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-[#1F2937]">
              Agricultural Expertise Areas
            </h2>
            <p className="text-xs text-[#6B7280] mt-0.5">
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
                      ? "border-[#1B5E20] bg-[#E8F5E9] shadow-xs"
                      : "border-[#E5E7EB] bg-white hover:border-[#A5D6A7] hover:bg-[#FCFEFC]"
                  }`}
                >
                  <div>
                    <p className={`text-xs font-bold ${isSelected ? "text-[#1B5E20]" : "text-[#1F2937]"}`}>
                      {area.name}
                    </p>
                    <p className="text-[11px] text-[#6B7280] leading-relaxed mt-0.5">
                      {area.description}
                    </p>
                  </div>
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected ? "bg-[#1B5E20] text-white" : "border border-[#D1D5DB] bg-white"
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
          <div className="space-y-3 pt-4 border-t border-[#E5E7EB]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#1F2937]">
                  Expertise Details (Optional)
                </h2>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  Provide experience level, years in practice, or notes for your claimed expertise.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {allSelectedClaims.map((claim) => {
                const isExpanded = expandedClaim === claim.key;
                const detail = claimDetails[claim.key] || {};

                return (
                  <div key={`detail-${claim.key}`} className="border border-[#E5E7EB] rounded-xl overflow-hidden bg-white">
                    <button
                      type="button"
                      onClick={() => setExpandedClaim(isExpanded ? null : claim.key)}
                      className="w-full px-4 py-2.5 flex items-center justify-between text-left hover:bg-[#F8FAF8] transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#1F2937]">{claim.name}</span>
                        <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-[#F1F5F2] text-[#4B5563]">
                          {claim.type}
                        </span>
                        {detail.level && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#E8F5E9] text-[#2E7D32] border border-[#A5D6A7]">
                            {detail.level}
                          </span>
                        )}
                        {detail.yearsOfExperience !== undefined && (
                          <span className="text-[10px] text-[#6B7280] font-medium">
                            {detail.yearsOfExperience} yrs exp
                          </span>
                        )}
                      </div>
                      <div className="text-[#9CA3AF]">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="p-4 border-t border-[#EEF0EE] bg-[#F8FAF8] space-y-3 animate-in fade-in">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-[#4B5563] mb-1">
                              Expertise Level
                            </label>
                            <select
                              value={detail.level || "INTERMEDIATE"}
                              onChange={(e) => updateClaimDetail(claim.key, {
                                level: e.target.value as ExpertiseLevel,
                                name: claim.name,
                              })}
                              className="w-full text-xs rounded-lg border border-[#E5E7EB] bg-white px-2.5 py-1.5 font-medium text-[#1F2937] focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
                            >
                              {EXPERTISE_LEVEL_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label} — {opt.desc}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-[#4B5563] mb-1">
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
                              className="w-full text-xs rounded-lg border border-[#E5E7EB] bg-white px-2.5 py-1.5 font-medium text-[#1F2937] focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-[#4B5563] mb-1">
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
                            className="w-full text-xs rounded-lg border border-[#E5E7EB] bg-white p-2 text-[#1F2937] focus:outline-none focus:ring-1 focus:ring-[#2E7D32] leading-relaxed"
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
        <div className="space-y-3 pt-4 border-t border-[#E5E7EB]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-[#1F2937]">
                Supporting Evidence (Optional)
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-[#F1F5F2] text-[#4B5563] text-[10px] font-bold">
                Optional
              </span>
            </div>
            <p className="text-xs text-[#6B7280] mt-0.5 leading-relaxed">
              You may provide evidence supporting your expertise. You do not need to upload a separate document for every crop.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-[#E5E7EB] bg-[#F8FAF8] space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#4B5563] mb-1">
                  Evidence Document Type
                </label>
                <select
                  value={evidenceType}
                  onChange={(e) => setEvidenceType(e.target.value as ExpertiseSourceType)}
                  className="w-full text-xs rounded-lg border border-[#E5E7EB] bg-white px-2.5 py-1.5 font-medium text-[#1F2937] focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
                >
                  {EVIDENCE_TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#4B5563] mb-1">
                  Certificate / Document Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Advanced Vegetable Production Certificate"
                  value={evidenceTitle}
                  onChange={(e) => setEvidenceTitle(e.target.value)}
                  className="w-full text-xs rounded-lg border border-[#E5E7EB] bg-white px-2.5 py-1.5 font-medium text-[#1F2937] focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#4B5563] mb-1">
                Upload Certificate / Letter (PDF or Image, max 15MB)
              </label>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#A5D6A7] bg-white text-[#2E7D32] hover:bg-[#E8F5E9] text-xs font-bold transition-all shadow-xs">
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
                  <span className="text-xs text-[#4B5563] flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-[#2E7D32]" />
                    <strong>{evidenceFileName}</strong>
                  </span>
                ) : (
                  <span className="text-[11px] text-[#9CA3AF]">No document attached yet</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 6 — COVERAGE LOCATIONS */}
        <div className="space-y-3 pt-4 border-t border-[#E5E7EB]">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-[#1F2937]">
              Service Coverage Locations
            </h2>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Select the districts and provinces where you are available for farmer consultations and field visits.
            </p>
          </div>

          {locationLoadError && (
            <div className="rounded-xl border border-[#FCA5A5] bg-[#FEE2E2] p-3 text-xs text-[#DC2626]">
              {locationLoadError}
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-[11px] font-bold text-[#4B5563]">Province</label>
              <select
                value={selectedProvinceId}
                onChange={(event) => setSelectedProvinceId(event.target.value)}
                disabled={isLoadingProvinces}
                className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-xs text-[#1F2937] outline-none transition-colors focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/10 disabled:bg-[#F8FAF8]"
              >
                <option value="">{isLoadingProvinces ? "Loading provinces..." : "Select province"}</option>
                {provinces.map((province) => (
                  <option key={province.id} value={province.id}>{province.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-bold text-[#4B5563]">District</label>
              <select
                value={selectedDistrictId}
                onChange={(event) => setSelectedDistrictId(event.target.value)}
                disabled={!selectedProvinceId || isLoadingDistricts}
                className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-xs text-[#1F2937] outline-none transition-colors focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/10 disabled:bg-[#F8FAF8]"
              >
                <option value="">{isLoadingDistricts ? "Loading districts..." : "Select district"}</option>
                {districts.map((district) => (
                  <option key={district.id} value={district.id}>{district.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-bold text-[#4B5563]">Municipality / Local Level</label>
              <select
                value={selectedMunicipalityId}
                onChange={(event) => setSelectedMunicipalityId(event.target.value)}
                disabled={!selectedDistrictId || isLoadingMunicipalities}
                className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-xs text-[#1F2937] outline-none transition-colors focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/10 disabled:bg-[#F8FAF8]"
              >
                <option value="">{isLoadingMunicipalities ? "Loading local levels..." : "Select local level"}</option>
                {municipalities.map((municipality) => (
                  <option key={municipality.id} value={municipality.id}>{municipality.name}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="button"
            disabled={!selectedMunicipalityId}
            onClick={() => {
              if (selectedMunicipalityId) toggleLocation(selectedMunicipalityId);
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#A5D6A7] bg-[#E8F5E9] px-3 py-2 text-xs font-bold text-[#2E7D32] transition-colors hover:bg-[#E8F5E9] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <MapPin className="h-3.5 w-3.5" />
            {selectedMunicipalityId && locations.includes(selectedMunicipalityId) ? "Remove selected location" : "Add selected location"}
          </button>

          <div className="rounded-xl border border-[#E5E7EB] bg-[#F8FAF8]/40 p-3">
            {locations.length === 0 ? (
              <p className="text-xs text-[#6B7280]">No service coverage locations selected.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {locations.map((locationId) => (
                  <button
                    key={locationId}
                    type="button"
                    onClick={() => toggleLocation(locationId)}
                    className="inline-flex items-center gap-1 rounded-lg border border-[#A5D6A7] bg-white px-2.5 py-1 text-xs font-semibold text-[#2E7D32] hover:bg-[#E8F5E9]"
                    title="Remove location"
                  >
                    <MapPin className="w-2.5 h-2.5" />
                    <span>{locationNameById.get(locationId) ?? `Location #${locationId}`}</span>
                    <X className="w-2.5 h-2.5" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Wizard Navigation Footer */}
        <div className="flex items-center justify-between pt-6 border-t border-[#E5E7EB]">
          <button
            type="button"
            onClick={prevStep}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-[#4B5563] hover:text-[#1F2937] hover:bg-[#F1F5F2] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous Step</span>
          </button>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1B5E20] hover:bg-[#1B5E20] text-white text-xs font-bold transition-all shadow-md hover:shadow-lg cursor-pointer"
          >
            <span>Continue to Documents</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
}
