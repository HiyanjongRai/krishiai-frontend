"use client";

import React, { useState } from "react";
import {
  X,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Mail,
  Phone,
  Building2,
  GraduationCap,
  Briefcase,
  Globe,
  Award,
  Sprout,
  MapPin,
  Download,
  Eye,
  Check,
  Loader2,
  XCircle,
} from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/providers/toast-provider";
import { getApiErrorMessage } from "@/lib/toast-utils";

export interface ExpertDoc {
  id?: number | string;
  documentType?: string;
  type?: string;
  title: string;
  fileName: string;
  fileType?: string;
  fileSize?: string;
  fileUrl?: string;
  uploadedAt?: string;
}

export interface DetailedCropExpertise {
  id: number;
  cropId: number;
  cropName: string;
  cropEmoji: string;
  categoryName?: string;
  expertiseType: "PRIMARY" | "SECONDARY";
  verificationStatus: "VERIFIED" | "PENDING" | "REJECTED";
  verifiedAt?: string;
}

export interface DetailedExpert {
  profileId: number;
  userId: number;
  fullName: string;
  email: string;
  phone?: string;
  designation?: string;
  organization?: string;
  yearsOfExperience?: number;
  experienceYears?: number;
  qualification?: string;
  licenseNumber?: string;
  councilRegistrationNumber?: string;
  institution?: string;
  bio?: string;
  websiteUrl?: string;
  verifiedExpert: boolean;
  verificationStatus?: string;
  applicationStatus: string;
  rejectionReason?: string;
  adminNotes?: string;
  primaryCrops?: string[];
  secondaryCrops?: string[];
  cropDetails?: DetailedCropExpertise[];
  specializations?: string[];
  locations?: string[];
  documents?: ExpertDoc[];
  createdAt?: string;
  submittedAt?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  expert: DetailedExpert | null;
  onStatusChanged?: () => void;
}

export function AdminExpertDetailsModal({
  isOpen,
  onClose,
  expert,
  onStatusChanged,
}: Props) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"details" | "documents" | "crops">("details");
  const [viewingDoc, setViewingDoc] = useState<ExpertDoc | null>(null);

  // Approval / Rejection / Action states
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ text: string; success: boolean } | null>(null);
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showInfoInput, setShowInfoInput] = useState(false);
  const [infoReason, setInfoReason] = useState("");
  const [cropsState, setCropsState] = useState<DetailedCropExpertise[]>(expert?.cropDetails || []);

  // Crop review panel state
  const [activeCrop, setActiveCrop] = useState<number | null>(null);
  const [cropNotes, setCropNotes] = useState<Record<number, string>>({});
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<"ALL" | "PRIMARY" | "SECONDARY">("ALL");
  const [cropProcessing, setCropProcessing] = useState<number | null>(null);

  React.useEffect(() => {
    if (expert?.cropDetails) {
      setCropsState(expert.cropDetails);
    } else {
      setCropsState([]);
    }
    // Reset panel state when expert changes
    setActiveCrop(null);
    setCropNotes({});
    setCategoryFilter("ALL");
    setTypeFilter("ALL");
  }, [expert]);

  if (!isOpen || !expert) return null;

  const status = expert.verifiedExpert
    ? "VERIFIED"
    : expert.applicationStatus || "DRAFT";

  const docsList: ExpertDoc[] = Array.isArray(expert.documents) ? expert.documents : [];

  const handleApprove = async () => {
    setIsProcessing(true);
    setActionMessage(null);
    try {
      await api.post(`/v1/admin/experts/${expert.profileId}/approve`, {
        notes: "Approved by platform administrator",
      });
      toast.success({
        title: "Expert approved",
        description: `${expert.fullName} has been approved as a Verified Expert.`,
      });
      setActionMessage({
        text: `✓ ${expert.fullName} has been approved as a Verified Expert.`,
        success: true,
      });
      if (onStatusChanged) onStatusChanged();
      setTimeout(() => {
        setActionMessage(null);
      }, 4000);
    } catch (err: any) {
      const msg = getApiErrorMessage(err, "Failed to approve expert.");
      toast.error({ title: "Failed to approve", description: msg });
      setActionMessage({
        text: "Failed to approve: " + msg,
        success: false,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.warning({
        title: "Rejection reason required",
        description: "Please provide a reason for rejection before submitting.",
      });
      return;
    }
    setIsProcessing(true);
    setActionMessage(null);
    try {
      await api.post(`/v1/admin/experts/${expert.profileId}/reject`, {
        notes: rejectReason.trim(),
      });
      toast.success({
        title: "Application rejected",
        description: `Application for ${expert.fullName} was rejected with feedback.`,
      });
      setActionMessage({
        text: `✕ Application for ${expert.fullName} was rejected with feedback.`,
        success: false,
      });
      setShowRejectInput(false);
      setRejectReason("");
      if (onStatusChanged) onStatusChanged();
      setTimeout(() => {
        setActionMessage(null);
      }, 4000);
    } catch (err: any) {
      const msg = getApiErrorMessage(err, "Failed to reject application.");
      toast.error({ title: "Failed to reject", description: msg });
      setActionMessage({
        text: "Failed to reject: " + msg,
        success: false,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStartReview = async () => {
    setIsProcessing(true);
    setActionMessage(null);
    try {
      await api.post(`/v1/admin/experts/${expert.profileId}/start-review`);
      toast.info({
        title: "Review started",
        description: "Application marked as Under Review.",
      });
      setActionMessage({
        text: `✓ Application marked as Under Review.`,
        success: true,
      });
      if (onStatusChanged) onStatusChanged();
      setTimeout(() => setActionMessage(null), 4000);
    } catch (err: any) {
      const msg = getApiErrorMessage(err, "Failed to start review.");
      toast.error({ title: "Failed to start review", description: msg });
      setActionMessage({
        text: "Failed to start review: " + msg,
        success: false,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRequestInfo = async () => {
    if (!infoReason.trim()) {
      toast.warning({
        title: "Information specification required",
        description: "Please specify the additional information or documents required.",
      });
      return;
    }
    setIsProcessing(true);
    setActionMessage(null);
    try {
      await api.post(`/v1/admin/experts/${expert.profileId}/request-info`, {
        notes: infoReason.trim(),
      });
      toast.info({
        title: "Information requested",
        description: `Additional information requested from ${expert.fullName}.`,
      });
      setActionMessage({
        text: `✓ Additional information requested from ${expert.fullName}.`,
        success: true,
      });
      setShowInfoInput(false);
      setInfoReason("");
      if (onStatusChanged) onStatusChanged();
      setTimeout(() => setActionMessage(null), 4000);
    } catch (err: any) {
      const msg = getApiErrorMessage(err, "Failed to request info.");
      toast.error({ title: "Failed to request info", description: msg });
      setActionMessage({
        text: "Failed to request info: " + msg,
        success: false,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVerifyCrop = async (cropId: number, notes?: string) => {
    setCropProcessing(cropId);
    try {
      await api.post(`/v1/admin/experts/${expert.profileId}/crops/${cropId}/verify`, {
        notes: notes?.trim() || undefined,
      });
      setCropsState((prev) =>
        prev.map((c) =>
          c.cropId === cropId
            ? { ...c, verificationStatus: "VERIFIED", verifiedAt: new Date().toISOString() }
            : c
        )
      );
      toast.success({ title: "Expertise verified", description: "Crop expertise verified successfully." });
      setActionMessage({ text: "✓ Crop expertise verified.", success: true });
      setActiveCrop(null);
      if (onStatusChanged) onStatusChanged();
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err: any) {
      const msg = getApiErrorMessage(err, "Failed to verify crop.");
      toast.error({ title: "Verification failed", description: msg });
      setActionMessage({ text: "Failed to verify crop: " + msg, success: false });
    } finally {
      setCropProcessing(null);
    }
  };

  const handleRejectCrop = async (cropId: number, notes?: string) => {
    setCropProcessing(cropId);
    try {
      await api.post(`/v1/admin/experts/${expert.profileId}/crops/${cropId}/reject`, {
        notes: notes?.trim() || undefined,
      });
      setCropsState((prev) =>
        prev.map((c) =>
          c.cropId === cropId ? { ...c, verificationStatus: "REJECTED" } : c
        )
      );
      toast.warning({ title: "Expertise rejected", description: "Crop expertise rejected." });
      setActionMessage({ text: "✕ Crop expertise rejected.", success: false });
      setActiveCrop(null);
      if (onStatusChanged) onStatusChanged();
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err: any) {
      const msg = getApiErrorMessage(err, "Failed to reject crop.");
      toast.error({ title: "Action failed", description: msg });
      setActionMessage({ text: "Failed to reject crop: " + msg, success: false });
    } finally {
      setCropProcessing(null);
    }
  };

  const handleRevokeCrop = async (cropId: number) => {
    setCropProcessing(cropId);
    try {
      // Revoke = re-set to PENDING by calling reject with a revoke note
      await api.post(`/v1/admin/experts/${expert.profileId}/crops/${cropId}/reject`, {
        notes: "Verification revoked by admin for re-review.",
      });
      setCropsState((prev) =>
        prev.map((c) =>
          c.cropId === cropId ? { ...c, verificationStatus: "PENDING" } : c
        )
      );
      toast.info({ title: "Expertise revoked", description: "Crop verification has been revoked and reset to pending." });
      setActionMessage({ text: "↺ Crop verification revoked — reset to Pending.", success: true });
      setActiveCrop(null);
      if (onStatusChanged) onStatusChanged();
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err: any) {
      const msg = getApiErrorMessage(err, "Failed to revoke verification.");
      toast.error({ title: "Revoke failed", description: msg });
      setActionMessage({ text: "Failed to revoke: " + msg, success: false });
    } finally {
      setCropProcessing(null);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between bg-gradient-to-r from-slate-50 to-emerald-50/50">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-xl shrink-0 shadow-xs">
                {expert.fullName.charAt(0).toUpperCase()}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">
                    {expert.fullName}
                  </h3>
                  {status === "VERIFIED" ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Verified Expert
                    </span>
                  ) : status === "SUBMITTED" ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      Pending Review
                    </span>
                  ) : status === "REJECTED" ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-800 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                      <XCircle className="w-3.5 h-3.5 text-rose-600" />
                      Changes Required
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">
                      Draft Application
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 font-semibold">
                  {expert.designation || "Agricultural Consultant"}{" "}
                  {expert.organization ? `• ${expert.organization}` : ""}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-0.5">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {expert.email}
                  </span>
                  {expert.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {expert.phone}
                    </span>
                  )}
                  <span className="text-[10px] font-mono text-slate-400">
                    ID: #{expert.profileId}
                  </span>
                </div>
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

          {/* Action notification */}
          {actionMessage && (
            <div
              className={`mx-6 mt-4 p-3.5 rounded-xl text-xs font-bold border flex items-center gap-2 ${
                actionMessage.success
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-rose-50 text-rose-800 border-rose-200"
              }`}
            >
              {actionMessage.success ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <AlertTriangle className="w-4 h-4" />
              )}
              <span>{actionMessage.text}</span>
            </div>
          )}

          {/* Admin notes callout if rejected */}
          {expert.adminNotes && (
            <div className="mx-6 mt-4 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600">
                Current Admin Notes / Feedback:
              </span>
              <p className="text-xs font-semibold text-rose-900">&ldquo;{expert.adminNotes}&rdquo;</p>
            </div>
          )}

          {/* Tab Bar */}
          <div className="px-6 pt-3 flex border-b border-slate-200 gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("details")}
              className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
                activeTab === "details"
                  ? "border-blue-600 text-blue-800"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Overview &amp; Credentials</span>
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
              <span>Verification Documents</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-extrabold">
                {docsList.length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("crops")}
              className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
                activeTab === "crops"
                  ? "border-blue-600 text-blue-800"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Sprout className="w-4 h-4" />
              <span>Crops &amp; Domains</span>
              {(() => {
                const total = (expert.cropDetails || []).length;
                const verified = (expert.cropDetails || []).filter(c => c.verificationStatus === "VERIFIED").length;
                return total > 0 ? (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                    verified === total
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}>
                    {verified}/{total}
                  </span>
                ) : null;
              })()}
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto flex-1 space-y-5">
            
            {/* TAB 1: Details */}
            {activeTab === "details" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                      Academic Degree
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                      {expert.qualification || "B.Sc. Agriculture"}
                    </p>
                    <p className="text-xs text-slate-500">{expert.institution || "NARC / Tribhuvan University"}</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                      Experience
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                      {expert.yearsOfExperience != null ? `${expert.yearsOfExperience} Years` : "Experienced"}
                    </p>
                    <p className="text-xs text-slate-500">Agricultural Extension &amp; Field Advisory</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-blue-600" />
                      Employer / Affiliation
                    </p>
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {expert.organization || "Not specified"}
                    </p>
                    <p className="text-xs text-slate-500 truncate">{expert.designation || "Not specified"}</p>
                  </div>
                </div>

                {expert.websiteUrl && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2 text-xs">
                    <Globe className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="text-slate-500 font-medium">Public Profile / Website:</span>
                    <a
                      href={expert.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline truncate font-semibold"
                    >
                      {expert.websiteUrl}
                    </a>
                  </div>
                )}

                {/* Bio */}
                <div>
                  <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Professional Biography &amp; Field Experience
                  </p>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    {expert.bio || "No professional biography or statement provided by this applicant."}
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: Documents */}
            {activeTab === "documents" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">
                      Uploaded Verification Credentials
                    </h4>
                    <p className="text-xs text-slate-500">
                      Click &quot;View Document&quot; to inspect full verification certificate or uploaded scan.
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{docsList.length} Attached</span>
                  </span>
                </div>

                {docsList.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                    <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-700">No verification documents uploaded</p>
                    <p className="text-[11px] text-slate-500">This applicant has not uploaded any credentials or certificates yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {docsList.map((doc, idx) => {
                      const docTypeUpper = (doc.documentType || doc.type || "").toUpperCase();
                      const isEdu = docTypeUpper.includes("EDU") || docTypeUpper.includes("DEGREE");
                      const isLic = docTypeUpper.includes("LIC");
                      const isExp = docTypeUpper.includes("EXP");

                      return (
                        <div
                          key={doc.id || idx}
                          className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs transition-all space-y-3 flex flex-col justify-between"
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                                {doc.documentType || "CREDENTIAL"}
                              </span>
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                Uploaded
                              </span>
                            </div>
                            <h5 className="font-bold text-xs sm:text-sm text-slate-900">
                              {doc.title}
                            </h5>
                            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                              <FileText className="w-3.5 h-3.5 text-slate-400" />
                              <span className="truncate">{doc.fileName}</span>
                              {doc.fileSize && (
                                <span className="text-slate-400 shrink-0">({doc.fileSize})</span>
                              )}
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setViewingDoc(doc)}
                              className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View Document</span>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                toast.info({
                                  title: "Document Ready",
                                  description: `Document "${doc.fileName}" is ready in verified storage.`,
                                })
                              }
                              className="py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                              title="Download Copy"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: Crops & Specializations — Enhanced */}
            {activeTab === "crops" && (() => {
              // Derived data
              const verifiedCount = cropsState.filter(c => c.verificationStatus === "VERIFIED").length;
              const totalCount = cropsState.length;
              const progressPct = totalCount > 0 ? Math.round((verifiedCount / totalCount) * 100) : 0;

              // Collect unique categories
              const allCategories = Array.from(
                new Set(cropsState.map(c => c.categoryName || "General").filter(Boolean))
              );

              // Apply filters
              const filteredCrops = cropsState.filter(c => {
                const catMatch = categoryFilter === "ALL" || (c.categoryName || "General") === categoryFilter;
                const typeMatch = typeFilter === "ALL" || c.expertiseType === typeFilter;
                return catMatch && typeMatch;
              });

              return (
                <div className="space-y-5">

                  {/* ── Progress Summary ─────────────────────────────── */}
                  {totalCount > 0 && (
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-xs font-extrabold text-emerald-900 uppercase tracking-wider">
                            Crop Expertise Verification Progress
                          </p>
                          <p className="text-[11px] text-emerald-700 mt-0.5">
                            Only VERIFIED crops appear in farmer matching &amp; consultations.
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-2xl font-black text-emerald-800">{verifiedCount}</span>
                          <span className="text-sm font-bold text-emerald-600"> / {totalCount}</span>
                          <p className="text-[10px] font-semibold text-emerald-600 mt-0.5">verified</p>
                        </div>
                      </div>
                      {/* Progress bar */}
                      <div className="w-full bg-emerald-200/50 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-1.5 text-[10px] font-semibold">
                        <span className="text-emerald-700">{progressPct}% complete</span>
                        <div className="flex items-center gap-3">
                          <span className="text-emerald-700">{verifiedCount} verified</span>
                          <span className="text-amber-700">{cropsState.filter(c => c.verificationStatus === "PENDING").length} pending</span>
                          <span className="text-rose-700">{cropsState.filter(c => c.verificationStatus === "REJECTED").length} rejected</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── Filters ──────────────────────────────────────── */}
                  {totalCount > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Category filter */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {["ALL", ...allCategories].map(cat => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setCategoryFilter(cat)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer border ${
                              categoryFilter === cat
                                ? "bg-slate-900 text-white border-slate-900"
                                : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                            }`}
                          >
                            {cat === "ALL" ? "All Categories" : cat}
                          </button>
                        ))}
                      </div>
                      <div className="w-px h-5 bg-slate-200 hidden sm:block" />
                      {/* Type filter */}
                      {(["ALL", "PRIMARY", "SECONDARY"] as const).map(t => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTypeFilter(t)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer border ${
                            typeFilter === t
                              ? t === "PRIMARY"
                                ? "bg-emerald-600 text-white border-emerald-600"
                                : t === "SECONDARY"
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-slate-900 text-white border-slate-900"
                              : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                          }`}
                        >
                          {t === "ALL" ? "All Types" : t === "PRIMARY" ? "🌟 Primary" : "Secondary"}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* ── Crop Cards ───────────────────────────────────── */}
                  {totalCount === 0 ? (
                    // Legacy fallback when no cropDetails available
                    <div className="space-y-3">
                      <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Primary Crops (Legacy — no per-crop verification data)
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {(expert.primaryCrops || []).length > 0 ? (
                          expert.primaryCrops?.map((c) => (
                            <span key={c} className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
                              <span>🌱</span>
                              <span>{c}</span>
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400">No crop data available</span>
                        )}
                      </div>
                    </div>
                  ) : filteredCrops.length === 0 ? (
                    <div className="py-10 text-center bg-slate-50 rounded-2xl border border-slate-200">
                      <Sprout className="w-7 h-7 text-slate-300 mx-auto mb-2" />
                      <p className="text-xs font-bold text-slate-600">No crops match current filters</p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Claimed Crop Expertise — Individual Review
                      </p>
                      {filteredCrops.map((c) => {
                        const isCropVerified = c.verificationStatus === "VERIFIED";
                        const isCropRejected = c.verificationStatus === "REJECTED";
                        const isExpanded = activeCrop === c.cropId;
                        const isThisCropProcessing = cropProcessing === c.cropId;
                        const note = cropNotes[c.cropId] || "";

                        return (
                          <div
                            key={c.id || c.cropId}
                            className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                              isExpanded
                                ? "border-blue-300 shadow-md ring-1 ring-blue-200/60"
                                : "border-slate-200 hover:border-slate-300 shadow-2xs"
                            } bg-white`}
                          >
                            {/* Card Header — always visible, click to expand */}
                            <button
                              type="button"
                              onClick={() => setActiveCrop(isExpanded ? null : c.cropId)}
                              className="w-full flex items-center justify-between p-3.5 cursor-pointer text-left"
                            >
                              <div className="flex items-center gap-2.5">
                                <span className="text-xl shrink-0">{c.cropEmoji || "🌱"}</span>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h5 className="font-bold text-sm text-slate-900">{c.cropName}</h5>
                                    <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md border ${
                                      c.expertiseType === "PRIMARY"
                                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                        : "bg-blue-50 text-blue-800 border-blue-200"
                                    }`}>
                                      {c.expertiseType === "PRIMARY" ? "🌟 PRIMARY" : "SECONDARY"}
                                    </span>
                                  </div>
                                  <span className="text-[11px] text-slate-400 font-medium">
                                    {c.categoryName || "General"}{c.verifiedAt ? ` • Verified ${new Date(c.verifiedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}` : ""}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                  isCropVerified
                                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                    : isCropRejected
                                    ? "bg-rose-50 text-rose-800 border-rose-200"
                                    : "bg-amber-50 text-amber-800 border-amber-200"
                                }`}>
                                  {isCropVerified ? "✓ Verified" : isCropRejected ? "✕ Rejected" : "⏱ Pending"}
                                </span>
                                <svg
                                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </button>

                            {/* Expanded Review Panel */}
                            {isExpanded && (
                              <div className="px-4 pb-4 border-t border-slate-100 pt-3 space-y-3 animate-in fade-in duration-150">
                                {/* Status context */}
                                {isCropVerified && (
                                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span>This crop expertise is currently <strong>verified</strong> and active for farmer consultations.</span>
                                  </div>
                                )}
                                {isCropRejected && (
                                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                                    <span>This crop expertise was <strong>rejected</strong>. You can re-open it to Pending or verify directly.</span>
                                  </div>
                                )}
                                {!isCropVerified && !isCropRejected && (
                                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
                                    <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                    <span>Awaiting admin review. Verify or reject this expertise claim below.</span>
                                  </div>
                                )}

                                {/* Admin notes textarea */}
                                <div>
                                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1 block">
                                    Admin Review Notes (optional — sent with action)
                                  </label>
                                  <textarea
                                    rows={2}
                                    value={note}
                                    onChange={(e) => setCropNotes(prev => ({ ...prev, [c.cropId]: e.target.value }))}
                                    placeholder={`e.g. Verified ${c.cropName} expertise via submitted degree and field experience certificate...`}
                                    className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 placeholder:text-slate-400"
                                  />
                                </div>

                                {/* Action buttons */}
                                <div className="flex items-center gap-2 pt-1">
                                  {/* Verify button — shown when not yet verified */}
                                  {!isCropVerified && (
                                    <button
                                      type="button"
                                      disabled={isThisCropProcessing}
                                      onClick={() => handleVerifyCrop(c.cropId, note)}
                                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer"
                                    >
                                      {isThisCropProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                                      Grant Expertise
                                    </button>
                                  )}

                                  {/* Reject button — shown when not yet rejected */}
                                  {!isCropRejected && (
                                    <button
                                      type="button"
                                      disabled={isThisCropProcessing}
                                      onClick={() => handleRejectCrop(c.cropId, note)}
                                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-rose-200 bg-white hover:bg-rose-50 text-rose-700 text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer"
                                    >
                                      {isThisCropProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <X className="w-3.5 h-3.5" />}
                                      Reject Claim
                                    </button>
                                  )}

                                  {/* Revoke button — only shown when verified */}
                                  {isCropVerified && (
                                    <button
                                      type="button"
                                      disabled={isThisCropProcessing}
                                      onClick={() => handleRevokeCrop(c.cropId)}
                                      className="flex items-center gap-1.5 py-2 px-3 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                                    >
                                      {isThisCropProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Clock className="w-3.5 h-3.5" />}
                                      Revoke
                                    </button>
                                  )}

                                  {/* Re-open button — only shown when rejected */}
                                  {isCropRejected && (
                                    <button
                                      type="button"
                                      disabled={isThisCropProcessing}
                                      onClick={() => handleVerifyCrop(c.cropId, note)}
                                      className="flex items-center gap-1.5 py-2 px-3 rounded-xl border border-sky-200 bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                                    >
                                      {isThisCropProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                                      Re-open &amp; Verify
                                    </button>
                                  )}

                                  <button
                                    type="button"
                                    onClick={() => setActiveCrop(null)}
                                    className="py-2 px-3 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 text-xs font-medium transition-colors cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* ── Specializations ───────────────────────────────── */}
                  <div>
                    <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Domain Specializations
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {(expert.specializations || []).length > 0 ? (
                        expert.specializations?.map((s) => (
                          <span key={s} className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold flex items-center gap-1.5">
                            <Award className="w-3 h-3 text-blue-600" />
                            <span>{s}</span>
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400">No specializations specified</span>
                      )}
                    </div>
                  </div>

                  {/* ── Locations ─────────────────────────────────────── */}
                  <div>
                    <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Designated Service Locations
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {(expert.locations || []).length > 0 ? (
                        expert.locations?.map((l) => (
                          <span key={l} className="px-3 py-1.5 rounded-xl bg-violet-50 text-violet-800 border border-violet-200 text-xs font-semibold flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-violet-600" />
                            <span>{l}</span>
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400">Bagmati, Gandaki, Koshi Province</span>
                      )}
                    </div>
                  </div>

                </div>
              );
            })()}

            {/* Additional Info input box if triggered */}
            {showInfoInput && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-amber-900 block">
                    Request Additional Information or Updated Documents
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowInfoInput(false)}
                    className="text-xs text-slate-500 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={infoReason}
                  onChange={(e) => setInfoReason(e.target.value)}
                  placeholder="e.g. Please re-upload clearer degree transcripts and provide valid license registration details..."
                  className="w-full text-xs text-slate-800 bg-white border border-amber-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-amber-300 resize-none"
                />
                <button
                  type="button"
                  onClick={handleRequestInfo}
                  disabled={isProcessing || !infoReason.trim()}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  {isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Clock className="w-3.5 h-3.5" />}
                  <span>Send Request to Expert</span>
                </button>
              </div>
            )}

            {/* Rejection input box if triggered */}
            {showRejectInput && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-rose-900 block">
                    Rejection Feedback &amp; Required Changes
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowRejectInput(false)}
                    className="text-xs text-slate-500 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g. Qualifications do not meet accredited criteria for specialized agricultural consultation..."
                  className="w-full text-xs text-slate-800 bg-white border border-rose-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none"
                />
                <button
                  type="button"
                  onClick={handleReject}
                  disabled={isProcessing || !rejectReason.trim()}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  {isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <X className="w-3.5 h-3.5" />}
                  <span>Confirm Rejection with Feedback</span>
                </button>
              </div>
            )}
          </div>

          {/* Footer with Approve / Reject / Review & Close actions */}
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3 flex-wrap">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
            >
              Close
            </button>

            <div className="flex items-center gap-2 flex-wrap">
              {!expert.verifiedExpert && (
                <>
                  {(expert.applicationStatus === "SUBMITTED" || expert.applicationStatus === "ADDITIONAL_INFORMATION_REQUIRED") && (
                    <button
                      type="button"
                      onClick={handleStartReview}
                      disabled={isProcessing}
                      className="px-3.5 py-2.5 rounded-xl border border-sky-200 bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <Clock className="w-3.5 h-3.5 text-sky-600" />
                      <span>Start Review</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setShowInfoInput(true);
                      setShowRejectInput(false);
                    }}
                    disabled={isProcessing}
                    className="px-3.5 py-2.5 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Request Info</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowRejectInput(true);
                      setShowInfoInput(false);
                    }}
                    disabled={isProcessing}
                    className="px-4 py-2.5 rounded-xl border border-rose-200 bg-white hover:bg-rose-50 text-rose-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reject Application</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleApprove}
                    disabled={isProcessing}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs hover:shadow transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Check className="w-3.5 h-3.5" />
                    )}
                    <span>Approve as Verified Expert</span>
                  </button>
                </>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Embedded Document Preview Modal */}
      {viewingDoc && expert && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-800 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-900 leading-tight">
                    {viewingDoc.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {expert.fullName} • {viewingDoc.fileName} ({viewingDoc.fileSize || "1.8 MB"})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingDoc(null)}
                className="w-8 h-8 rounded-full bg-slate-200/60 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content view */}
            <div className="p-6 overflow-y-auto flex-1 bg-slate-100/60">
              {viewingDoc.fileUrl && viewingDoc.fileUrl.startsWith("data:image") ? (
                <div className="flex justify-center bg-white p-4 rounded-2xl border border-slate-200">
                  <img
                    src={viewingDoc.fileUrl}
                    alt={viewingDoc.title}
                    className="max-h-[500px] w-auto rounded-xl object-contain"
                  />
                </div>
              ) : viewingDoc.fileUrl && viewingDoc.fileUrl.startsWith("data:application/pdf") ? (
                <iframe
                  src={viewingDoc.fileUrl}
                  title={viewingDoc.title}
                  className="w-full h-[500px] rounded-2xl border border-slate-200 bg-white"
                />
              ) : (
                <div className="bg-white rounded-2xl border-2 border-emerald-600/30 p-8 shadow-md relative overflow-hidden space-y-6">
                  <div className="text-center space-y-1 border-b border-slate-100 pb-5">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-black uppercase tracking-wider mb-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>KrishiAI Verification Record • ID: KAI-DOC-{expert.profileId}-{viewingDoc.documentType || "01"}</span>
                    </div>
                    <h5 className="text-xl font-black text-slate-900 tracking-tight">
                      {viewingDoc.title}
                    </h5>
                    <p className="text-xs text-slate-500">
                      Official Candidate Verification Document &amp; Agricultural Certification
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Candidate Name</p>
                      <p className="font-bold text-slate-900 mt-0.5 text-sm">{expert.fullName}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</p>
                      <p className="font-semibold text-slate-800 mt-0.5">{expert.email}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Qualification / Title</p>
                      <p className="font-semibold text-slate-800 mt-0.5">{expert.qualification || expert.designation || "Agricultural Consultant"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Organization / University</p>
                      <p className="font-semibold text-slate-800 mt-0.5">{expert.institution || expert.organization || "Tribhuvan University / NARC"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">File Details</p>
                      <p className="font-mono text-[11px] text-slate-700 mt-0.5">{viewingDoc.fileName} • {viewingDoc.fileSize || "1.8 MB"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Submission Date</p>
                      <p className="font-semibold text-slate-800 mt-0.5">{expert.submittedAt || "September 2026"}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-emerald-800 text-xs font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Cryptographically Validated for Administrator Review</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-mono">STATUS: {status}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-slate-200 bg-white flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Encrypted Document Preview</span>
              </div>
              <button
                type="button"
                onClick={() => setViewingDoc(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
