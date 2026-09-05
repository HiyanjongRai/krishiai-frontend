"use client";

import React, { useState, useEffect, useRef } from "react";
import { api } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  X,
  AlertCircle,
  FileCheck2,
  Upload,
  CheckCircle2,
  Loader2,
  Building2,
  GraduationCap,
  Briefcase,
  Globe,
  Award,
  Sprout,
  FileText,
  ShieldCheck,
  RotateCcw,
  Check,
  HelpCircle,
  MapPin,
} from "lucide-react";
import { useToast } from "@/providers/toast-provider";
import { getApiErrorMessage } from "@/lib/toast-utils";
import { CROPS_CATALOG } from "@/data/expert-options";
import { ExpertProfileData } from "./ExpertDashboardView";

export interface DocUploadItem {
  documentType: "IDENTITY" | "EDUCATION" | "LICENSE" | "EXPERIENCE";
  title: string;
  description: string;
  existingFileName?: string;
  existingFileSize?: string;
  existingFileUrl?: string;
  newFile?: File | null;
  newFileName?: string;
  newFileSize?: string;
  newFileUrl?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  profile: ExpertProfileData | null;
  onSuccess: () => void;
}

export function ExpertEditAndResubmitModal({
  isOpen,
  onClose,
  profile,
  onSuccess,
}: Props) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"credentials" | "documents" | "crops">("credentials");

  // Form State - Professional Details
  const [designation, setDesignation] = useState(profile?.designation || "");
  const [organization, setOrganization] = useState(profile?.organization || "");
  const [yearsOfExperience, setYearsOfExperience] = useState<number>(profile?.yearsOfExperience || 1);
  const [qualification, setQualification] = useState(profile?.qualification || "");
  const [institution, setInstitution] = useState(profile?.institution || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [websiteUrl, setWebsiteUrl] = useState(profile?.websiteUrl || "");

  // Documents state
  const [documents, setDocuments] = useState<Record<string, DocUploadItem>>({
    IDENTITY: {
      documentType: "IDENTITY",
      title: "National ID / Citizenship / Passport",
      description: "Official government-issued identity credential (PDF or image).",
    },
    EDUCATION: {
      documentType: "EDUCATION",
      title: "Highest Educational Degree Certificate",
      description: "Degree transcript or certificate in Agriculture / Horticulture / Pathology.",
    },
    LICENSE: {
      documentType: "LICENSE",
      title: "Professional Agricultural License",
      description: "Nepal Agricultural Council or equivalent certified council membership.",
    },
    EXPERIENCE: {
      documentType: "EXPERIENCE",
      title: "Work Experience Certificate",
      description: "Official employment letter or service proof showing verifiable years.",
    },
  });

  // Catalogs
  const [availableCrops, setAvailableCrops] = useState<Array<{ id: number; name: string; emoji?: string }>>([]);
  const [availableSpecs, setAvailableSpecs] = useState<Array<{ id: number; name: string; code: string }>>([]);
  const [availableLocations, setAvailableLocations] = useState<Array<{ id: number; name: string; type: string }>>([]);
  const [selectedPrimaryCrops, setSelectedPrimaryCrops] = useState<number[]>([]);
  const [selectedSecondaryCrops, setSelectedSecondaryCrops] = useState<number[]>([]);
  const [selectedSpecs, setSelectedSpecs] = useState<number[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<number[]>([]);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [processingDocType, setProcessingDocType] = useState<string | null>(null);
  const [isLoadingCatalogs, setIsLoadingCatalogs] = useState(false);

  // Hidden file input refs
  const fileInputRefs = {
    IDENTITY: useRef<HTMLInputElement>(null),
    EDUCATION: useRef<HTMLInputElement>(null),
    LICENSE: useRef<HTMLInputElement>(null),
    EXPERIENCE: useRef<HTMLInputElement>(null),
  };

  // Sync profile data when opened
  useEffect(() => {
    if (!profile) return;
    setDesignation(profile.designation || "");
    setOrganization(profile.organization || "");
    setYearsOfExperience(profile.yearsOfExperience || 1);
    setQualification(profile.qualification || "");
    setInstitution(profile.institution || "");
    setBio(profile.bio || "");
    setWebsiteUrl(profile.websiteUrl || "");

    const prim = (profile.crops || [])
      .filter((c) => c.expertiseType === "PRIMARY")
      .map((c) => c.cropId);
    const sec = (profile.crops || [])
      .filter((c) => c.expertiseType === "SECONDARY")
      .map((c) => c.cropId);
    setSelectedPrimaryCrops(prim);
    setSelectedSecondaryCrops(sec);

    const specs = (profile.specializations || []).map((s) => s.id);
    setSelectedSpecs(specs);

    const locs = (profile.locations || []).map((l) => l.id);
    setSelectedLocations(locs);

    // Fetch existing documents from backend
    api.get<any[]>("/v1/expert/profile/documents")
      .then((docs) => {
        if (Array.isArray(docs)) {
          setDocuments((prev) => {
            const next = { ...prev };
            docs.forEach((d) => {
              const dt = (d.documentType || "").toUpperCase() as keyof typeof next;
              if (next[dt]) {
                next[dt] = {
                  ...next[dt],
                  existingFileName: d.fileName || d.title || "Uploaded Document",
                  existingFileSize: d.fileSize,
                  existingFileUrl: d.fileUrl,
                };
              }
            });
            return next;
          });
        }
      })
      .catch((e) => console.warn("Could not load current documents:", e));
  }, [profile, isOpen]);

  // Load catalogs
  useEffect(() => {
    if (!isOpen) return;
    setIsLoadingCatalogs(true);
    Promise.allSettled([
      api.get<any>("/v1/crops?size=100"),
      api.get<any[]>("/v1/specializations"),
      api.get<any[]>("/v1/locations"),
    ]).then(([cropsRes, specsRes, locsRes]) => {
      if (cropsRes.status === "fulfilled" && cropsRes.value) {
        const val = cropsRes.value as any;
        const list = Array.isArray(val)
          ? val
          : Array.isArray(val?.content)
          ? val.content
          : [];
        if (list.length > 0) {
          setAvailableCrops(list);
        } else {
          setAvailableCrops(
            CROPS_CATALOG.map((c, idx) => ({ id: idx + 1, name: c.name, emoji: c.emoji }))
          );
        }
      } else {
        setAvailableCrops(
          CROPS_CATALOG.map((c, idx) => ({ id: idx + 1, name: c.name, emoji: c.emoji }))
        );
      }

      if (specsRes.status === "fulfilled" && Array.isArray(specsRes.value)) {
        setAvailableSpecs(specsRes.value);
      }
      if (locsRes.status === "fulfilled" && Array.isArray(locsRes.value)) {
        setAvailableLocations(locsRes.value);
      }
    }).catch(() => {
      setAvailableCrops(
        CROPS_CATALOG.map((c, idx) => ({ id: idx + 1, name: c.name, emoji: c.emoji }))
      );
    }).finally(() => {
      setIsLoadingCatalogs(false);
    });
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileSelect = (
    type: "IDENTITY" | "EDUCATION" | "LICENSE" | "EXPERIENCE",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formatSize = (bytes: number) => {
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    setProcessingDocType(type);
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setDocuments((prev) => ({
        ...prev,
        [type]: {
          ...prev[type],
          newFile: file,
          newFileName: file.name,
          newFileSize: formatSize(file.size),
          newFileUrl: dataUrl,
        },
      }));
      setProcessingDocType(null);
    };
    reader.onerror = () => {
      setErrorMessage(`Failed to read file ${file.name}. Please try again.`);
      setProcessingDocType(null);
    };
    reader.readAsDataURL(file);
  };

  const handlePrimaryCropToggle = (cropId: number) => {
    if (selectedPrimaryCrops.includes(cropId)) {
      setSelectedPrimaryCrops((prev) => prev.filter((id) => id !== cropId));
    } else {
      if (selectedPrimaryCrops.length >= 3) {
        setErrorMessage("You can select up to 3 primary crops.");
        toast.warning({
          title: "Primary crop limit reached",
          description: "You can select up to 3 primary crops.",
        });
        return;
      }
      setSelectedPrimaryCrops((prev) => [...prev, cropId]);
      // Remove from secondary if present
      setSelectedSecondaryCrops((prev) => prev.filter((id) => id !== cropId));
    }
  };

  const handleSecondaryCropToggle = (cropId: number) => {
    if (selectedPrimaryCrops.includes(cropId)) return;
    if (selectedSecondaryCrops.includes(cropId)) {
      setSelectedSecondaryCrops((prev) => prev.filter((id) => id !== cropId));
    } else {
      setSelectedSecondaryCrops((prev) => [...prev, cropId]);
    }
  };

  const handleSpecToggle = (specId: number) => {
    if (selectedSpecs.includes(specId)) {
      setSelectedSpecs((prev) => prev.filter((id) => id !== specId));
    } else {
      setSelectedSpecs((prev) => [...prev, specId]);
    }
  };

  const handleLocationToggle = (locId: number) => {
    if (selectedLocations.includes(locId)) {
      setSelectedLocations((prev) => prev.filter((id) => id !== locId));
    } else {
      setSelectedLocations((prev) => [...prev, locId]);
    }
  };

  const handleSaveAndResubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // 1. Update Professional Credentials via PATCH
      await api.patch("/v1/expert/profile", {
        designation: designation.trim() || undefined,
        organization: organization.trim() || undefined,
        yearsOfExperience: Number(yearsOfExperience) || 1,
        qualification: qualification.trim() || undefined,
        institution: institution.trim() || undefined,
        bio: bio.trim() || undefined,
        websiteUrl: websiteUrl.trim() || undefined,
      });

      // 2. Save any new / updated documents via POST /v1/expert/profile/documents
      for (const item of Object.values(documents)) {
        if (item.newFileName) {
          await api.post("/v1/expert/profile/documents", {
            documentType: item.documentType,
            title: item.title,
            fileName: item.newFileName,
            fileType: item.newFile?.type || "application/pdf",
            fileSize: item.newFileSize || "1.5 MB",
            fileUrl: item.newFileUrl || "",
          });
        }
      }

      // 3. Update Crops (remove deselected, add/update selected)
      const previousCropIds = (profile?.crops || []).map((c) => c.cropId);
      for (const oldCropId of previousCropIds) {
        if (!selectedPrimaryCrops.includes(oldCropId) && !selectedSecondaryCrops.includes(oldCropId)) {
          try {
            await api.delete(`/v1/expert/profile/crops/${oldCropId}`);
          } catch {}
        }
      }
      for (const cropId of selectedPrimaryCrops) {
        try {
          await api.post("/v1/expert/profile/crops", {
            cropId,
            expertiseType: "PRIMARY",
          });
        } catch {}
      }
      for (const cropId of selectedSecondaryCrops) {
        try {
          await api.post("/v1/expert/profile/crops", {
            cropId,
            expertiseType: "SECONDARY",
          });
        } catch {}
      }

      // 4. Update Specializations (remove deselected, add selected)
      const previousSpecIds = (profile?.specializations || []).map((s) => s.id);
      for (const oldSpecId of previousSpecIds) {
        if (!selectedSpecs.includes(oldSpecId)) {
          try {
            await api.delete(`/v1/expert/profile/specializations/${oldSpecId}`);
          } catch {}
        }
      }
      for (const specId of selectedSpecs) {
        try {
          await api.post(`/v1/expert/profile/specializations/${specId}`, {});
        } catch {}
      }

      // 5. Update Locations (remove deselected, add selected)
      const previousLocIds = (profile?.locations || []).map((l) => l.id);
      for (const oldLocId of previousLocIds) {
        if (!selectedLocations.includes(oldLocId)) {
          try {
            await api.delete(`/v1/expert/profile/locations/${oldLocId}`);
          } catch {}
        }
      }
      for (const locId of selectedLocations) {
        try {
          await api.post(`/v1/expert/profile/locations/${locId}`, {});
        } catch {}
      }

      // 6. Submit the verification application — only if status allows it.
      //    DRAFT, REJECTED, ADDITIONAL_INFORMATION_REQUIRED → submit
      //    SUBMITTED, UNDER_REVIEW → profile updated but no re-submission needed
      const canSubmit = !profile?.applicationStatus ||
        ["DRAFT", "REJECTED", "ADDITIONAL_INFORMATION_REQUIRED"].includes(profile.applicationStatus);

      if (canSubmit) {
        await api.post("/v1/expert/profile/submit-application", {});
        toast.success({
          title: "Application resubmitted",
          description: "Your updated information has been submitted for review.",
        });
        setSuccessMessage("Application submitted successfully! KrishiAI Administration will review your updated documents.");
      } else {
        toast.success({
          title: "Profile updated",
          description: "Your expert profile has been updated successfully.",
        });
        setSuccessMessage("Profile updated successfully! Your application is already under review — no re-submission needed.");
      }

      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error("Resubmit error:", err);
      const msg = getApiErrorMessage(err, "Failed to save profile. Please verify your details and try again.");
      toast.error({
        title: "Submission failed",
        description: msg,
      });
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-emerald-50/40">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
              ["SUBMITTED", "UNDER_REVIEW"].includes(profile?.applicationStatus || "")
                ? "bg-blue-100 border border-blue-200 text-blue-600"
                : "bg-rose-100 border border-rose-200 text-rose-600"
            }`}>
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 leading-tight">
                {["SUBMITTED", "UNDER_REVIEW"].includes(profile?.applicationStatus || "")
                  ? "Edit Profile"
                  : "Update Profile & Resubmit Verification"}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {["SUBMITTED", "UNDER_REVIEW"].includes(profile?.applicationStatus || "")
                  ? "Update your credentials and documents. No re-submission required — your application is under review."
                  : "Edit your credentials, re-upload documents, and resubmit for administrator review."}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-200/60 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Admin Feedback Banner if rejected */}
        {profile?.adminNotes && (
          <div className="mx-6 mt-4 p-4 rounded-2xl bg-rose-50 border-2 border-rose-200 flex items-start gap-3 text-rose-950">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-200/80 text-rose-900">
                  Admin Feedback to Address
                </span>
              </div>
              <p className="text-sm font-semibold text-rose-900">
                &ldquo;{profile.adminNotes}&rdquo;
              </p>
              <p className="text-xs text-rose-700">
                Please update your qualifications or re-upload clearer copies of your credentials below according to this review.
              </p>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="px-6 pt-3 flex border-b border-slate-200 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("credentials")}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === "credentials"
                ? "border-emerald-600 text-emerald-800"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>1. Professional Details</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("documents")}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === "documents"
                ? "border-emerald-600 text-emerald-800"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>2. Re-upload Documents</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 font-extrabold">
              Important
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("crops")}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === "crops"
                ? "border-emerald-600 text-emerald-800"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Sprout className="w-4 h-4" />
            <span>3. Crop Expertise</span>
          </button>
        </div>

        {/* Tab Content Container */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: Professional Details */}
          {activeTab === "credentials" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Designation / Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. Senior Agronomist / Plant Pathologist"
                    className="w-full text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Organization / Current Employer
                  </label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="e.g. NARC, Tribhuvan University, Agrovet"
                    className="w-full text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Highest Qualification <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    placeholder="e.g. M.Sc. Agriculture / Plant Protection"
                    className="w-full text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Graduating University / Institution <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="e.g. IAAS Rampur, AFU Chitwan"
                    className="w-full text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Years of Field Experience <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={60}
                    value={yearsOfExperience}
                    onChange={(e) => setYearsOfExperience(parseInt(e.target.value, 10) || 0)}
                    className="w-full text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    LinkedIn / Official Website URL
                  </label>
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Professional Bio &amp; Background <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Detail your agricultural specialization, major crop pathology field experience, and how you assist farmers..."
                  maxLength={500}
                  className="w-full text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
                />
                <p className="text-[10px] text-slate-400 text-right mt-1">{bio.length}/500</p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveTab("documents")}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
                >
                  Continue to Documents →
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Re-upload Documents */}
          {activeTab === "documents" && (
            <div className="space-y-4">
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3 text-emerald-950">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed space-y-1">
                  <p className="font-bold">Credential Verification Requirement</p>
                  <p className="text-emerald-800">
                    To satisfy admin review, upload clear, legible scans or photos (PDF, PNG, JPG, up to 10MB each).
                    Replacing a document will automatically update it in the verification queue.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(Object.keys(documents) as Array<keyof typeof documents>).map((docKey) => {
                  const item = documents[docKey];
                  const hasNew = !!item.newFileName;
                  const hasExisting = !!item.existingFileName;

                  return (
                    <div
                      key={docKey}
                      className={`p-4 rounded-2xl border transition-all space-y-3 ${
                        hasNew
                          ? "border-emerald-400 bg-emerald-50/30"
                          : hasExisting
                          ? "border-slate-200 bg-white"
                          : "border-dashed border-amber-300 bg-amber-50/30"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                            {item.documentType}
                          </span>
                          <h4 className="font-bold text-sm text-slate-900">{item.title}</h4>
                          <p className="text-[11px] text-slate-500 leading-tight">
                            {item.description}
                          </p>
                        </div>
                        {hasNew ? (
                          <span className="p-1 rounded-full bg-emerald-100 text-emerald-700">
                            <CheckCircle2 className="w-4 h-4" />
                          </span>
                        ) : hasExisting ? (
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                            Current
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                            Missing
                          </span>
                        )}
                      </div>

                      {/* Current / New file status badge */}
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                          <span className="font-medium text-slate-700 truncate">
                            {item.newFileName
                              ? `New: ${item.newFileName}`
                              : item.existingFileName
                              ? `Uploaded: ${item.existingFileName}`
                              : "No file uploaded yet"}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 shrink-0">
                          {item.newFileSize || item.existingFileSize || ""}
                        </span>
                      </div>

                      {/* Hidden File Input */}
                      <input
                        type="file"
                        ref={fileInputRefs[item.documentType]}
                        className="hidden"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={(e) => handleFileSelect(item.documentType, e)}
                      />

                      {/* Upload Trigger Button */}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          disabled={processingDocType === item.documentType}
                          onClick={() => fileInputRefs[item.documentType].current?.click()}
                          className="flex-1 py-2 px-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-60"
                        >
                          {processingDocType === item.documentType ? (
                            <>
                              <LoadingSpinner size="xs" color="primary" />
                              <span>Processing file...</span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{hasExisting || hasNew ? "Replace Document" : "Upload Document"}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setActiveTab("credentials")}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  ← Back to Details
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("crops")}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Continue to Crop Expertise →
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Crops & Specializations */}
          {activeTab === "crops" && (
            <div className="space-y-5">
              {/* Primary Crops */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Primary Crops <span className="text-emerald-700 font-semibold">(Max 3)</span>
                  </label>
                  <span className="text-[11px] font-bold text-slate-500">
                    {selectedPrimaryCrops.length}/3 selected
                  </span>
                </div>
                {isLoadingCatalogs && availableCrops.length === 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Skeleton key={i} className="h-7 w-20 rounded-xl" />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {availableCrops.map((c) => {
                      const isPrimary = selectedPrimaryCrops.includes(c.id);
                      return (
                        <button
                          type="button"
                          key={`prim-${c.id}`}
                          onClick={() => handlePrimaryCropToggle(c.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                            isPrimary
                              ? "bg-emerald-600 text-white border-emerald-700 shadow-xs"
                              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          <span>{c.emoji || "🌾"}</span>
                          <span>{c.name}</span>
                          {isPrimary && <Check className="w-3 h-3" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Secondary Crops */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Secondary Supporting Crops
                </label>
                {isLoadingCatalogs && availableCrops.length === 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-7 w-24 rounded-xl" />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {availableCrops.map((c) => {
                      const isPrimary = selectedPrimaryCrops.includes(c.id);
                      if (isPrimary) return null;
                      const isSec = selectedSecondaryCrops.includes(c.id);
                      return (
                        <button
                          type="button"
                          key={`sec-${c.id}`}
                          onClick={() => handleSecondaryCropToggle(c.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 cursor-pointer ${
                            isSec
                              ? "bg-teal-700 text-white border-teal-800 shadow-xs"
                              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          <span>{c.name}</span>
                          {isSec && <Check className="w-3 h-3" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Specializations */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Domain Specializations
                </label>
                {isLoadingCatalogs && availableSpecs.length === 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-7 w-28 rounded-xl" />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {availableSpecs.map((s) => {
                      const isSelected = selectedSpecs.includes(s.id);
                      return (
                        <button
                          type="button"
                          key={`spec-${s.id}`}
                          onClick={() => handleSpecToggle(s.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-blue-600 text-white border-blue-700 shadow-xs"
                              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          {s.name}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Service Locations */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-violet-600" />
                    Service Locations
                  </label>
                  <span className="text-[11px] font-bold text-slate-500">
                    {selectedLocations.length} selected
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Select the provinces or districts where you can provide advisory services.
                </p>
                {isLoadingCatalogs && availableLocations.length === 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Skeleton key={i} className="h-7 w-24 rounded-xl" />
                    ))}
                  </div>
                ) : availableLocations.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No locations available from server.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {availableLocations.map((l) => {
                      const isSelected = selectedLocations.includes(l.id);
                      return (
                        <button
                          type="button"
                          key={`loc-${l.id}`}
                          onClick={() => handleLocationToggle(l.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                            isSelected
                              ? "bg-violet-600 text-white border-violet-700 shadow-xs"
                              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          <MapPin className={`w-3 h-3 ${isSelected ? "text-violet-200" : "text-violet-500"}`} />
                          {l.name}
                          {isSelected && <Check className="w-3 h-3" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Nav: Back button at bottom of crops tab */}
              <div className="pt-3 border-t border-slate-100 flex justify-start">
                <button
                  type="button"
                  onClick={() => setActiveTab("documents")}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  ← Back to Documents
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Feedback messages */}
        {errorMessage && (
          <div className="mx-6 mb-2 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mx-6 mb-2 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors disabled:opacity-50"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSaveAndResubmit}
              disabled={isSubmitting || !qualification.trim() || !designation.trim()}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{["SUBMITTED", "UNDER_REVIEW"].includes(profile?.applicationStatus || "") ? "Saving..." : "Submitting Application..."}</span>
                </>
              ) : (
                <>
                  <FileCheck2 className="w-4 h-4" />
                  <span>{["SUBMITTED", "UNDER_REVIEW"].includes(profile?.applicationStatus || "") ? "Save Changes" : "Save & Resubmit Application"}</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
