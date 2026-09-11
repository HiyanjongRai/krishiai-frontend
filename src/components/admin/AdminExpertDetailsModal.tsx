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
  Lock,
  Unlock,
} from "lucide-react";
import { api } from "@/lib/api";
import { adminService } from "@/services/admin";
import { useToast } from "@/providers/toast-provider";
import { getApiErrorMessage } from "@/lib/toast-utils";
import { Modal } from "@/components/ui/modal";
import { formatFullName } from "@/lib/format-utils";

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
  userId?: number;
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

type ConfirmationAction =
  | { kind: "approve" }
  | { kind: "verify-crop" | "reject-crop"; cropId: number };

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
  const [confirmation, setConfirmation] = useState<ConfirmationAction | null>(null);

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      setCropsState(expert?.cropDetails ?? []);
      setActiveCrop(null);
      setCropNotes({});
      setCategoryFilter("ALL");
      setTypeFilter("ALL");
    }, 0);
    return () => window.clearTimeout(timer);
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
        description: `${formatFullName(expert.fullName)} has been approved as a Verified Expert.`,
      });
      setActionMessage({
        text: `✓ ${formatFullName(expert.fullName)} has been approved as a Verified Expert.`,
        success: true,
      });
      if (onStatusChanged) onStatusChanged();
      setTimeout(() => {
        setActionMessage(null);
      }, 4000);
    } catch (err: unknown) {
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
        description: `Application for ${formatFullName(expert.fullName)} was rejected with feedback.`,
      });
      setActionMessage({
        text: `✕ Application for ${formatFullName(expert.fullName)} was rejected with feedback.`,
        success: false,
      });
      setShowRejectInput(false);
      setRejectReason("");
      if (onStatusChanged) onStatusChanged();
      setTimeout(() => {
        setActionMessage(null);
      }, 4000);
    } catch (err: unknown) {
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
    } catch (err: unknown) {
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

  const handleBlockExpertAccount = async () => {
    if (!expert.userId) {
      toast.warning({
        title: "User ID not found",
        description: "Cannot block expert without associated user account ID.",
      });
      return;
    }
    setIsProcessing(true);
    try {
      await adminService.blockUser(expert.userId, "Expert account blocked by administrator");
      toast.success({
        title: "Expert account blocked",
        description: `User account for ${formatFullName(expert.fullName)} has been blocked and sessions revoked.`,
      });
      if (onStatusChanged) onStatusChanged();
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, "Failed to block expert account.");
      toast.error({ title: "Action failed", description: msg });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUnblockExpertAccount = async () => {
    if (!expert.userId) {
      toast.warning({
        title: "User ID not found",
        description: "Cannot unblock expert without associated user account ID.",
      });
      return;
    }
    setIsProcessing(true);
    try {
      await adminService.unblockUser(expert.userId, "Expert account unblocked by administrator");
      toast.success({
        title: "Expert account unblocked",
        description: `User account for ${formatFullName(expert.fullName)} is now active.`,
      });
      if (onStatusChanged) onStatusChanged();
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, "Failed to unblock expert account.");
      toast.error({ title: "Action failed", description: msg });
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
        description: `Additional information requested from ${formatFullName(expert.fullName)}.`,
      });
      setActionMessage({
        text: `✓ Additional information requested from ${formatFullName(expert.fullName)}.`,
        success: true,
      });
      setShowInfoInput(false);
      setInfoReason("");
      if (onStatusChanged) onStatusChanged();
      setTimeout(() => setActionMessage(null), 4000);
    } catch (err: unknown) {
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

  const handleVerifyCrop = async (cropId: number) => {
    setCropProcessing(cropId);
    try {
      await api.post(`/v1/admin/experts/${expert.profileId}/crops/${cropId}/verify`);
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
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, "Failed to verify crop.");
      toast.error({ title: "Verification failed", description: msg });
      setActionMessage({ text: "Failed to verify crop: " + msg, success: false });
    } finally {
      setCropProcessing(null);
    }
  };

  const handleRejectCrop = async (cropId: number) => {
    setCropProcessing(cropId);
    try {
      await api.post(`/v1/admin/experts/${expert.profileId}/crops/${cropId}/reject`);
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
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, "Failed to reject crop.");
      toast.error({ title: "Action failed", description: msg });
      setActionMessage({ text: "Failed to reject crop: " + msg, success: false });
    } finally {
      setCropProcessing(null);
    }
  };

  const confirmAction = async () => {
    const action = confirmation;
    setConfirmation(null);
    if (!action) return;
    if (action.kind === "approve") await handleApprove();
    if (action.kind === "verify-crop") await handleVerifyCrop(action.cropId);
    if (action.kind === "reject-crop") await handleRejectCrop(action.cropId);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
        <div className="bg-white rounded-[32px] shadow-[0_24px_60px_-12px_rgba(0,0,0,0.18)] border border-[rgba(234,234,236,0.85)] w-full max-w-4xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between bg-gradient-to-r from-[#F4F4F6]/80 via-emerald-50/20 to-white">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-[22px] bg-gradient-to-br from-[#0F9F68] to-[#0A6B45] flex items-center justify-center text-white font-black text-2xl shrink-0 shadow-xs ring-4 ring-[#0F9F68]/10">
                {formatFullName(expert.fullName).charAt(0).toUpperCase()}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="text-xl sm:text-2xl font-black text-[#171717] tracking-tight">
                    {formatFullName(expert.fullName)}
                  </h3>
                  {status === "VERIFIED" ? (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#0F9F68] bg-[#DDF4EA] border border-[#BCE9D5] px-3 py-1 rounded-full shadow-2xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0F9F68]" />
                      Verified Expert
                    </span>
                  ) : status === "UNDER_REVIEW" ? (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full shadow-2xs">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      Under Review
                    </span>
                  ) : status === "REJECTED" ? (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full shadow-2xs">
                      <XCircle className="w-3.5 h-3.5 text-rose-600" />
                      Application Rejected
                    </span>
                  ) : status === "ADDITIONAL_INFORMATION_REQUIRED" ? (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-300 px-3 py-1 rounded-full shadow-2xs">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      Action Required
                    </span>
                  ) : status === "DRAFT" ? (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-600 bg-gray-100 border border-gray-200 px-3 py-1 rounded-full shadow-2xs">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      Draft Application
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full shadow-2xs">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      Pending Evaluation
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 font-medium">
                  {expert.designation || "Agricultural Consultant"}
                  {expert.organization ? ` · ${expert.organization}` : ""}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-gray-200/80 px-3 py-0.5 text-gray-600 font-medium shadow-2xs">
                    <Mail className="w-3.5 h-3.5 text-[#0F9F68]" />
                    {expert.email}
                  </span>
                  {expert.phone && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-gray-200/80 px-3 py-0.5 text-gray-600 font-medium shadow-2xs">
                      <Phone className="w-3.5 h-3.5 text-[#0F9F68]" />
                      {expert.phone}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#DDF4EA] px-3 py-0.5 text-[11px] font-black text-[#0F9F68] font-mono">
                    ID: #{expert.profileId}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-[#F4F4F6] hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors cursor-pointer shadow-2xs"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Action notification */}
          {actionMessage && (
            <div
              className={`mx-6 mt-4 p-3.5 rounded-2xl text-xs font-bold border flex items-center gap-2 ${
                actionMessage.success
                  ? "bg-[#DDF4EA] text-[#0F9F68] border-[#BCE9D5]"
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
            <div className="mx-6 mt-4 p-4 rounded-2xl bg-rose-50/80 border border-rose-200 text-rose-950 space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600">
                Current Admin Notes / Evaluation Feedback:
              </span>
              <p className="text-xs font-semibold text-rose-900">&ldquo;{expert.adminNotes}&rdquo;</p>
            </div>
          )}

          {/* Segmented Pill Tab Bar (Quixotic style) */}
          <div className="px-6 pt-4 pb-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#F4F4F6] p-1.5 text-xs font-semibold text-gray-600 flex-wrap">
              <button
                type="button"
                onClick={() => setActiveTab("details")}
                className={`px-4 py-2 rounded-full font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "details"
                    ? "bg-white text-[#171717] font-bold shadow-xs"
                    : "text-gray-500 hover:text-[#171717] hover:bg-white/50"
                }`}
              >
                <GraduationCap className="w-4 h-4 text-[#0F9F68]" />
                <span>Overview &amp; Credentials</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("documents")}
                className={`px-4 py-2 rounded-full font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "documents"
                    ? "bg-white text-[#171717] font-bold shadow-xs"
                    : "text-gray-500 hover:text-[#171717] hover:bg-white/50"
                }`}
              >
                <FileText className="w-4 h-4 text-[#0F9F68]" />
                <span>Verification Documents</span>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-[#DDF4EA] text-[#0F9F68] font-black">
                  {docsList.length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("crops")}
                className={`px-4 py-2 rounded-full font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "crops"
                    ? "bg-white text-[#171717] font-bold shadow-xs"
                    : "text-gray-500 hover:text-[#171717] hover:bg-white/50"
                }`}
              >
                <Sprout className="w-4 h-4 text-[#0F9F68]" />
                <span>Crops &amp; Domains</span>
                {(() => {
                  const total = (expert.cropDetails || []).length;
                  const verified = (expert.cropDetails || []).filter(c => c.verificationStatus === "VERIFIED").length;
                  return total > 0 ? (
                    <span className={`text-[10px] px-2 py-0.2 rounded-full font-black ${
                      verified === total
                        ? "bg-[#DDF4EA] text-[#0F9F68]"
                        : "bg-blue-50 text-blue-700"
                    }`}>
                      {verified}/{total}
                    </span>
                  ) : null;
                })()}
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto flex-1 space-y-5">
            
            {/* TAB 1: Details */}
            {activeTab === "details" && (
              <div className="space-y-4">
                {/* Quick Summary Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-[22px] bg-[#F4F4F6]/60 border border-gray-100 shadow-2xs">
                    <p className="text-[10px] uppercase font-bold text-gray-400">Attached Docs</p>
                    <p className="text-sm font-black text-[#171717] mt-0.5">{docsList.length} Files</p>
                  </div>
                  <div className="p-3.5 rounded-[22px] bg-[#F4F4F6]/60 border border-gray-100 shadow-2xs">
                    <p className="text-[10px] uppercase font-bold text-gray-400">Claimed Crops</p>
                    <p className="text-sm font-black text-[#171717] mt-0.5">
                      {(expert.cropDetails || []).length || (expert.primaryCrops || []).length || 0} Specializations
                    </p>
                  </div>
                  <div className="p-3.5 rounded-[22px] bg-[#F4F4F6]/60 border border-gray-100 shadow-2xs">
                    <p className="text-[10px] uppercase font-bold text-gray-400">Field Practice</p>
                    <p className="text-sm font-black text-[#171717] mt-0.5">
                      {expert.yearsOfExperience != null ? `${expert.yearsOfExperience} Years` : "Specialist"}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-[22px] bg-[#F4F4F6]/60 border border-gray-100 shadow-2xs">
                    <p className="text-[10px] uppercase font-bold text-gray-400">Record ID</p>
                    <p className="text-sm font-black text-[#0F9F68] font-mono mt-0.5">#{expert.profileId}</p>
                  </div>
                </div>

                {/* Main 3 Credential Dossier Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div className="p-4 rounded-[26px] bg-[#F4F4F6]/50 border border-gray-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Academic Degree
                      </span>
                      <span className="w-7 h-7 rounded-full bg-[#DDF4EA] flex items-center justify-center text-[#0F9F68] shadow-2xs">
                        <GraduationCap className="w-3.5 h-3.5" />
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#171717]">
                        {expert.qualification || "B.Sc. Agriculture"}
                      </p>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">
                        {expert.institution || "Tribhuvan University / NARC"}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-[26px] bg-[#F4F4F6]/50 border border-gray-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Experience
                      </span>
                      <span className="w-7 h-7 rounded-full bg-[#DDF4EA] flex items-center justify-center text-[#0F9F68] shadow-2xs">
                        <Briefcase className="w-3.5 h-3.5" />
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#171717]">
                        {expert.yearsOfExperience != null ? `${expert.yearsOfExperience} Years Field Advisory` : "Experienced Specialist"}
                      </p>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">
                        Agricultural Extension &amp; Advisory
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-[26px] bg-[#F4F4F6]/50 border border-gray-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Employer / Affiliation
                      </span>
                      <span className="w-7 h-7 rounded-full bg-[#DDF4EA] flex items-center justify-center text-[#0F9F68] shadow-2xs">
                        <Building2 className="w-3.5 h-3.5" />
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#171717] truncate">
                        {expert.organization || "Not specified"}
                      </p>
                      <p className="text-xs text-gray-500 font-medium truncate mt-0.5">
                        {expert.designation || "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>

                {expert.websiteUrl && (
                  <div className="p-3.5 rounded-2xl bg-[#F4F4F6]/50 border border-gray-100 flex items-center gap-2 text-xs">
                    <Globe className="w-4 h-4 text-[#0F9F68] shrink-0" />
                    <span className="text-gray-500 font-medium">Public Profile / Website:</span>
                    <a
                      href={expert.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#0F9F68] hover:underline truncate font-bold"
                    >
                      {expert.websiteUrl}
                    </a>
                  </div>
                )}

                {/* Professional Biography & Field Scope */}
                <div className="rounded-[28px] border border-gray-100 bg-[#F4F4F6]/50 p-5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#0F9F68]" />
                      Professional Biography &amp; Field Experience
                    </p>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Applicant Dossier
                    </span>
                  </div>
                  {expert.bio ? (
                    <p className="text-xs sm:text-sm text-[#171717] leading-relaxed bg-white p-4 rounded-2xl border border-gray-100/80 shadow-2xs font-medium">
                      &ldquo;{expert.bio}&rdquo;
                    </p>
                  ) : (
                    <div className="p-5 rounded-2xl bg-white border border-dashed border-gray-200 text-center space-y-1">
                      <p className="text-xs text-gray-500 font-semibold">
                        No extended biography statement was provided by this applicant.
                      </p>
                      <p className="text-[11px] text-gray-400">
                        Review uploaded credentials, degrees, and certificates in the Verification Documents tab.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: Documents */}
            {activeTab === "documents" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-[#171717]">
                      Uploaded Verification Credentials
                    </h4>
                    <p className="text-xs text-gray-500">
                      Inspect uploaded certificates, degrees, government licenses, and verification credentials.
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-[#0F9F68] bg-[#DDF4EA] border border-[#BCE9D5] px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#0F9F68]" />
                    <span>{docsList.length} Attached</span>
                  </span>
                </div>

                {docsList.length === 0 ? (
                  <div className="p-8 text-center bg-[#F4F4F6]/60 border border-gray-100 rounded-[28px] space-y-1">
                    <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-xs font-bold text-[#171717]">No verification documents uploaded</p>
                    <p className="text-[11px] text-gray-400">This applicant has not uploaded any credentials or certificates yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {docsList.map((doc, idx) => (
                      <div
                        key={doc.id || idx}
                        className="p-4 rounded-[24px] border border-gray-100 bg-[#F4F4F6]/50 hover:bg-white hover:border-gray-200 hover:shadow-xs transition-all space-y-3 flex flex-col justify-between"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white text-gray-600 border border-gray-100 shadow-2xs">
                              {doc.documentType || "CREDENTIAL"}
                            </span>
                            <span className="text-[10px] font-bold text-[#0F9F68] bg-[#DDF4EA] border border-[#BCE9D5] px-2.5 py-0.5 rounded-full">
                              Uploaded
                            </span>
                          </div>
                          <h5 className="font-bold text-xs sm:text-sm text-[#171717]">
                            {doc.title}
                          </h5>
                          <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                            <FileText className="w-3.5 h-3.5 text-[#0F9F68]" />
                            <span className="truncate">{doc.fileName}</span>
                            {doc.fileSize && (
                              <span className="text-gray-400 shrink-0">({doc.fileSize})</span>
                            )}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-gray-100 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setViewingDoc(doc)}
                            className="flex-1 py-2 px-3 rounded-full bg-[#0F9F68] hover:bg-[#0D8A5A] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
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
                            className="py-2 px-3 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                            title="Download Copy"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
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
                            className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer border ${
                              categoryFilter === cat
                                ? "bg-[#171717] text-white border-[#171717] shadow-2xs"
                                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            {cat === "ALL" ? "All Categories" : cat}
                          </button>
                        ))}
                      </div>
                      <div className="w-px h-5 bg-gray-200 hidden sm:block" />
                      {/* Type filter */}
                      {(["ALL", "PRIMARY", "SECONDARY"] as const).map(t => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTypeFilter(t)}
                          className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer border ${
                            typeFilter === t
                              ? t === "PRIMARY"
                                ? "bg-[#0F9F68] text-white border-[#0F9F68] shadow-2xs"
                                : t === "SECONDARY"
                                ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                                : "bg-[#171717] text-white border-[#171717] shadow-2xs"
                              : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
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
                            className={`rounded-[24px] border transition-all duration-200 overflow-hidden ${
                              isExpanded
                                ? "border-[#BCE9D5] shadow-md ring-1 ring-[#0F9F68]/20"
                                : "border-gray-100 bg-[#F4F4F6]/40 hover:bg-white hover:border-gray-200 shadow-2xs"
                            } bg-white`}
                          >
                            {/* Card Header — always visible, click to expand */}
                            <button
                              type="button"
                              onClick={() => setActiveCrop(isExpanded ? null : c.cropId)}
                              className="w-full flex items-center justify-between p-4 cursor-pointer text-left"
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-2xl shrink-0">{c.cropEmoji || "🌱"}</span>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h5 className="font-bold text-sm text-[#171717]">{c.cropName}</h5>
                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                                      c.expertiseType === "PRIMARY"
                                        ? "bg-[#DDF4EA] text-[#0F9F68] border-[#BCE9D5]"
                                        : "bg-blue-50 text-blue-800 border-blue-200"
                                    }`}>
                                      {c.expertiseType === "PRIMARY" ? "🌟 PRIMARY" : "SECONDARY"}
                                    </span>
                                  </div>
                                  <span className="text-[11px] text-gray-400 font-medium">
                                    {c.categoryName || "General"}{c.verifiedAt ? ` • Verified ${new Date(c.verifiedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}` : ""}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                                  isCropVerified
                                    ? "bg-[#DDF4EA] text-[#0F9F68] border-[#BCE9D5]"
                                    : isCropRejected
                                    ? "bg-rose-50 text-rose-800 border-rose-200"
                                    : "bg-amber-50 text-amber-800 border-amber-200"
                                }`}>
                                  {isCropVerified ? "✓ Verified" : isCropRejected ? "✕ Rejected" : "⏱ Pending"}
                                </span>
                                <svg
                                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </button>

                            {/* Expanded Review Panel */}
                            {isExpanded && (
                              <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-3 animate-in fade-in duration-150">
                                {/* Status context */}
                                {isCropVerified && (
                                  <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#DDF4EA]/60 border border-[#BCE9D5] text-[#0F9F68] text-xs font-semibold">
                                    <CheckCircle2 className="w-4 h-4 text-[#0F9F68] shrink-0" />
                                    <span>This crop expertise is currently <strong>verified</strong> and active for farmer consultations.</span>
                                  </div>
                                )}
                                {isCropRejected && (
                                  <div className="flex items-center gap-2 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                                    <span>This crop expertise was <strong>rejected</strong>. You can re-open it to Pending or verify directly.</span>
                                  </div>
                                )}
                                {!isCropVerified && !isCropRejected && (
                                  <div className="flex items-center gap-2 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
                                    <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                    <span>Awaiting admin review. Verify or reject this expertise claim below.</span>
                                  </div>
                                )}

                                {/* Admin notes textarea */}
                                <div>
                                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1 block">
                                    Admin Review Notes (optional — recorded with verification action)
                                  </label>
                                  <textarea
                                    rows={2}
                                    value={note}
                                    onChange={(e) => setCropNotes(prev => ({ ...prev, [c.cropId]: e.target.value }))}
                                    placeholder={`e.g. Verified ${c.cropName} expertise via submitted degree and field experience certificate...`}
                                    className="w-full text-xs text-[#171717] bg-[#F4F4F6]/50 border border-gray-200 rounded-2xl px-3.5 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-[#0F9F68]/20 focus:border-[#0F9F68] placeholder:text-gray-400"
                                  />
                                </div>

                                {/* Action buttons */}
                                <div className="flex items-center gap-2 pt-1 flex-wrap">
                                  {/* Verify button — shown when not yet verified */}
                                  {!isCropVerified && (
                                    <button
                                      type="button"
                                      disabled={isThisCropProcessing}
                                      onClick={() => setConfirmation({ kind: "verify-crop", cropId: c.cropId })}
                                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-4 rounded-full bg-[#0F9F68] hover:bg-[#0D8A5A] text-white text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
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
                                      onClick={() => setConfirmation({ kind: "reject-crop", cropId: c.cropId })}
                                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-4 rounded-full border border-rose-200 bg-white hover:bg-rose-50 text-rose-700 text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
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
                                      onClick={() => setConfirmation({ kind: "reject-crop", cropId: c.cropId })}
                                      className="flex items-center gap-1.5 py-2 px-4 rounded-full border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
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
                                      onClick={() => setConfirmation({ kind: "verify-crop", cropId: c.cropId })}
                                      className="flex items-center gap-1.5 py-2 px-4 rounded-full border border-sky-200 bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
                                    >
                                      {isThisCropProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                                      Re-open &amp; Verify
                                    </button>
                                  )}

                                  <button
                                    type="button"
                                    onClick={() => setActiveCrop(null)}
                                    className="py-2 px-4 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 text-xs font-semibold transition-colors cursor-pointer"
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
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Domain Specializations
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {(expert.specializations || []).length > 0 ? (
                        expert.specializations?.map((s) => (
                          <span key={s} className="px-3 py-1.5 rounded-full bg-[#DDF4EA] text-[#0F9F68] border border-[#BCE9D5] text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                            <Award className="w-3 h-3 text-[#0F9F68]" />
                            <span>{s}</span>
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">No specializations specified</span>
                      )}
                    </div>
                  </div>

                  {/* ── Locations ─────────────────────────────────────── */}
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Designated Service Locations
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {(expert.locations || []).length > 0 ? (
                        expert.locations?.map((l) => (
                          <span key={l} className="px-3 py-1.5 rounded-full bg-white text-gray-700 border border-gray-200 text-xs font-semibold flex items-center gap-1 shadow-2xs">
                            <MapPin className="w-3 h-3 text-[#0F9F68]" />
                            <span>{l}</span>
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">Bagmati, Gandaki, Koshi Province</span>
                      )}
                    </div>
                  </div>

                </div>
              );
            })()}

            {/* Additional Info drawer if triggered */}
            {showInfoInput && (
              <div className="p-5 rounded-[24px] bg-amber-50/70 border border-amber-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-amber-900 block">
                    Request Additional Information or Updated Documents
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowInfoInput(false)}
                    className="text-xs font-semibold text-gray-500 hover:text-gray-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={infoReason}
                  onChange={(e) => setInfoReason(e.target.value)}
                  placeholder="e.g. Please re-upload clearer degree transcripts and provide valid license registration details..."
                  className="w-full text-xs text-[#171717] bg-white border border-amber-200 rounded-2xl p-3.5 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none shadow-2xs"
                />
                <button
                  type="button"
                  onClick={handleRequestInfo}
                  disabled={isProcessing || !infoReason.trim()}
                  className="px-5 py-2.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  {isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Clock className="w-3.5 h-3.5" />}
                  <span>Send Request to Candidate</span>
                </button>
              </div>
            )}

            {/* Rejection input drawer if triggered */}
            {showRejectInput && (
              <div className="p-5 rounded-[24px] bg-rose-50/70 border border-rose-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-rose-900 block">
                    Rejection Feedback &amp; Required Remediation
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowRejectInput(false)}
                    className="text-xs font-semibold text-gray-500 hover:text-gray-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g. Qualifications do not meet accredited criteria for specialized agricultural consultation..."
                  className="w-full text-xs text-[#171717] bg-white border border-rose-200 rounded-2xl p-3.5 focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none shadow-2xs"
                />
                <button
                  type="button"
                  onClick={handleReject}
                  disabled={isProcessing || !rejectReason.trim()}
                  className="px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  {isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <X className="w-3.5 h-3.5" />}
                  <span>Confirm Application Rejection</span>
                </button>
              </div>
            )}
          </div>

          {/* Footer with Approve / Reject / Review & Close actions */}
          <div className="px-6 py-4 border-t border-gray-100 bg-[#F4F4F6]/50 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-xs font-bold transition-all shadow-2xs cursor-pointer"
              >
                Close
              </button>

              {expert.userId && (
                <>
                  <button
                    type="button"
                    onClick={handleBlockExpertAccount}
                    disabled={isProcessing}
                    className="px-3.5 py-2.5 rounded-full border border-rose-200 bg-white hover:bg-rose-50 text-rose-700 text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                    title="Block expert account and revoke active refresh tokens"
                  >
                    <Lock className="w-3.5 h-3.5 text-rose-600" />
                    <span>Block Account</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleUnblockExpertAccount}
                    disabled={isProcessing}
                    className="px-3.5 py-2.5 rounded-full border border-emerald-200 bg-white hover:bg-emerald-50 text-[#0F9F68] text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                    title="Unblock and restore expert account"
                  >
                    <Unlock className="w-3.5 h-3.5 text-[#0F9F68]" />
                    <span>Unblock</span>
                  </button>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {status === "REJECTED" ? (
                <>
                  <button
                    type="button"
                    onClick={handleStartReview}
                    disabled={isProcessing}
                    className="px-4 py-2.5 rounded-full border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>Re-open for Review</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmation({ kind: "approve" })}
                    disabled={isProcessing}
                    className="px-5 py-2.5 rounded-full bg-[#0F9F68] hover:bg-[#0D8A5A] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs hover:shadow transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    <span>Overturn &amp; Approve</span>
                  </button>
                </>
              ) : status === "UNDER_REVIEW" || status === "ADDITIONAL_INFORMATION_REQUIRED" ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setShowInfoInput(true);
                      setShowRejectInput(false);
                    }}
                    disabled={isProcessing}
                    className="px-4 py-2.5 rounded-full border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
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
                    className="px-4 py-2.5 rounded-full border border-rose-200 bg-white hover:bg-rose-50 text-rose-600 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reject Application</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmation({ kind: "approve" })}
                    disabled={isProcessing}
                    className="px-5 py-2.5 rounded-full bg-[#0F9F68] hover:bg-[#0D8A5A] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs hover:shadow transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    <span>Approve as Verified Expert</span>
                  </button>
                </>
              ) : status === "VERIFIED" || expert.verifiedExpert ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F9F68] bg-[#DDF4EA] border border-[#BCE9D5] px-4 py-2 rounded-full">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verified Expert Active</span>
                </span>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleStartReview}
                    disabled={isProcessing}
                    className="px-4 py-2.5 rounded-full border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>Start Review</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowInfoInput(true);
                      setShowRejectInput(false);
                    }}
                    disabled={isProcessing}
                    className="px-4 py-2.5 rounded-full border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
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
                    className="px-4 py-2.5 rounded-full border border-rose-200 bg-white hover:bg-rose-50 text-rose-600 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reject Application</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmation({ kind: "approve" })}
                    disabled={isProcessing}
                    className="px-5 py-2.5 rounded-full bg-[#0F9F68] hover:bg-[#0D8A5A] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs hover:shadow transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    <span>Approve as Verified Expert</span>
                  </button>
                </>
              )}
            </div>
          </div>

        </div>
      </div>

      <Modal
        isOpen={confirmation !== null}
        onClose={() => setConfirmation(null)}
        title={confirmation?.kind === "approve" ? "Approve expert application?" : confirmation?.kind === "verify-crop" ? "Verify crop expertise?" : "Reject crop expertise?"}
      >
        <p className="text-sm leading-relaxed text-slate-600">
          {confirmation?.kind === "approve"
            ? `This will approve ${formatFullName(expert.fullName)} as a verified expert.`
            : confirmation?.kind === "verify-crop"
              ? "This expertise will become available for verified agricultural consultations."
              : "This expertise claim will be rejected and removed from the verified set."}
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={() => setConfirmation(null)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
          <button type="button" onClick={confirmAction} disabled={isProcessing || cropProcessing !== null} className={`rounded-xl px-4 py-2 text-sm font-bold text-white disabled:opacity-50 ${confirmation?.kind === "reject-crop" ? "bg-rose-700 hover:bg-rose-800" : "bg-emerald-700 hover:bg-emerald-800"}`}>
            {confirmation?.kind === "reject-crop" ? "Reject" : "Confirm"}
          </button>
        </div>
      </Modal>

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
                    {formatFullName(expert.fullName)} • {viewingDoc.fileName} ({viewingDoc.fileSize || "1.8 MB"})
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
                      <p className="font-bold text-slate-900 mt-0.5 text-sm">{formatFullName(expert.fullName)}</p>
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
