"use client";

import React, { useState } from "react";
import Image from "next/image";
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
import { UserAvatar } from "@/components/ui/avatar";
import { CropAvatar } from "@/components/ui/crop-avatar";

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
  cropId?: number;
  expertiseId?: number;
  cropName?: string;
  expertiseArea?: string;
  cropEmoji?: string;
  cropImageUrl?: string;
  categoryName?: string;
  expertiseType: "PRIMARY" | "SECONDARY" | "AREA";
  verificationStatus: "VERIFIED" | "PENDING" | "REJECTED" | "SELF_DECLARED" | "EVIDENCE_SUBMITTED";
  expertiseLevel?: string;
  yearsOfExperience?: number;
  description?: string;
  evidenceDocumentFileName?: string;
  evidenceDocumentTitle?: string;
  verifiedAt?: string;
  rejectionReason?: string;
}

export interface DetailedExpert {
  profileId: number;
  userId?: number;
  fullName: string;
  email: string;
  phone?: string;
  profileImage?: string;
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
  | { kind: "verify-crop" | "reject-crop"; expertiseId: number };

export function AdminExpertDetailsModal({
  isOpen,
  onClose,
  expert,
  onStatusChanged,
}: Props) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"details" | "documents" | "crops" | "history">("details");
  const [viewingDoc, setViewingDoc] = useState<ExpertDoc | null>(null);

  // Approval / Rejection / Action states
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ text: string; success: boolean } | null>(null);
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showInfoInput, setShowInfoInput] = useState(false);
  const [infoReason, setInfoReason] = useState("");
  const [cropsState, setCropsState] = useState<DetailedCropExpertise[]>(expert?.cropDetails || []);

  // Account block/unblock state (optimistic — null means unknown/derive from expert)
  const [accountStatus, setAccountStatus] = useState<"ACTIVE" | "BLOCKED" | null>(null);
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  const [blockReason, setBlockReason] = useState("");

  // Crop review panel state
  const [activeCrop, setActiveCrop] = useState<number | null>(null);
  const [cropNotes, setCropNotes] = useState<Record<number, string>>({});
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<"ALL" | "PRIMARY" | "SECONDARY" | "AREA">("ALL");
  const [cropProcessing, setCropProcessing] = useState<number | null>(null);
  const [confirmation, setConfirmation] = useState<ConfirmationAction | null>(null);

  // Batch selection
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [showBatchRejectInput, setShowBatchRejectInput] = useState(false);
  const [batchRejectReason, setBatchRejectReason] = useState("");
  const [batchProcessing, setBatchProcessing] = useState(false);

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      setCropsState(expert?.cropDetails ?? []);
      setActiveCrop(null);
      setCropNotes({});
      setCategoryFilter("ALL");
      setTypeFilter("ALL");
      setSelectedIds(new Set());
      setShowBatchRejectInput(false);
      setBatchRejectReason("");
    }, 0);
    return () => window.clearTimeout(timer);
  }, [expert]);

  const handleBatchVerify = async () => {
    if (selectedIds.size === 0) return;
    setBatchProcessing(true);
    try {
      await api.post("/v1/admin/expertise-verifications/batch", {
        items: Array.from(selectedIds).map((expertiseId) => ({
          expertiseId,
          decision: "VERIFY",
          verificationMethod: "ADMIN_REVIEW",
        })),
        notes: "Batch verified by admin.",
      });
      setCropsState((prev) =>
        prev.map((c) =>
          selectedIds.has(c.id)
            ? { ...c, verificationStatus: "VERIFIED", verifiedAt: new Date().toISOString() }
            : c
        )
      );
      toast.success({ title: "Expertise verified", description: `${selectedIds.size} claim(s) verified.` });
      setActionMessage({ text: `✓ ${selectedIds.size} claim(s) verified.`, success: true });
      setSelectedIds(new Set());
      if (onStatusChanged) onStatusChanged();
      setTimeout(() => setActionMessage(null), 4000);
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, "Failed to batch verify.");
      toast.error({ title: "Batch verify failed", description: msg });
    } finally {
      setBatchProcessing(false);
    }
  };

  const handleBatchReject = async () => {
    if (selectedIds.size === 0) return;
    if (!batchRejectReason.trim()) {
      toast.warning({ title: "Rejection reason required", description: "Please provide a reason." });
      return;
    }
    setBatchProcessing(true);
    try {
      await api.post("/v1/admin/expertise-verifications/batch", {
        items: Array.from(selectedIds).map((expertiseId) => ({
          expertiseId,
          decision: "REJECT",
          reason: batchRejectReason.trim(),
          verificationMethod: "ADMIN_REVIEW",
        })),
        notes: batchRejectReason.trim(),
      });
      setCropsState((prev) =>
        prev.map((c) =>
          selectedIds.has(c.id)
            ? { ...c, verificationStatus: "REJECTED", rejectionReason: batchRejectReason.trim() }
            : c
        )
      );
      toast.warning({ title: "Claims rejected", description: `${selectedIds.size} claim(s) rejected.` });
      setActionMessage({ text: `✕ ${selectedIds.size} claim(s) rejected.`, success: false });
      setSelectedIds(new Set());
      setShowBatchRejectInput(false);
      setBatchRejectReason("");
      if (onStatusChanged) onStatusChanged();
      setTimeout(() => setActionMessage(null), 4000);
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, "Failed to batch reject.");
      toast.error({ title: "Batch reject failed", description: msg });
    } finally {
      setBatchProcessing(false);
    }
  };

  // Sanitize bio: remove consecutive repeated substrings (frontend defensive fix for API concatenation bugs)
  function sanitizeBio(bio?: string): string | undefined {
    if (!bio) return bio;
    // Remove consecutively repeated phrases of 5+ chars
    // e.g. "Aadim National CollegeAadim National College" -> "Aadim National College"
    const deduped = bio
      .replace(/(.{5,})\1+/g, "$1")
      .replace(/\s{2,}/g, " ")
      .trim();
    return deduped || bio;
  }

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

  const handleBlockExpertAccount = async (reason?: string) => {
    if (!expert.userId) {
      toast.warning({
        title: "User ID not found",
        description: "Cannot block expert without associated user account ID.",
      });
      return;
    }
    setIsProcessing(true);
    setShowBlockConfirm(false);
    setBlockReason("");
    try {
      await adminService.blockUser(expert.userId, reason?.trim() || "Expert account blocked by administrator");
      setAccountStatus("BLOCKED");
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
      setAccountStatus("ACTIVE");
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

  const handleVerifyCrop = async (expertiseId: number) => {
    setCropProcessing(expertiseId);
    try {
      await api.post("/v1/admin/expertise-verifications/batch", {
        items: [{
          expertiseId,
          decision: "VERIFY",
          reason: cropNotes[expertiseId]?.trim() || undefined,
          verificationMethod: "ADMIN_REVIEW",
        }],
        notes: cropNotes[expertiseId]?.trim() || "Verified by platform administrator",
      });
      setCropsState((prev) =>
        prev.map((c) =>
          c.id === expertiseId
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

  const handleRejectCrop = async (expertiseId: number) => {
    setCropProcessing(expertiseId);
    try {
      const reason = cropNotes[expertiseId]?.trim() || "Rejected by platform administrator";
      await api.post("/v1/admin/expertise-verifications/batch", {
        items: [{
          expertiseId,
          decision: "REJECT",
          reason,
          verificationMethod: "ADMIN_REVIEW",
        }],
        notes: reason,
      });
      setCropsState((prev) =>
        prev.map((c) =>
          c.id === expertiseId ? { ...c, verificationStatus: "REJECTED", rejectionReason: reason } : c
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
    if (action.kind === "verify-crop") await handleVerifyCrop(action.expertiseId);
    if (action.kind === "reject-crop") await handleRejectCrop(action.expertiseId);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
        <div className="bg-white rounded-[24px] shadow-2xl border border-[#E5E7EB] w-full max-w-4xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
          
          {/* Hero Header */}
          <div className="relative overflow-hidden">
            {/* Gradient banner */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  status === "VERIFIED"
                    ? "linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #388E3C 100%)"
                    : status === "UNDER_REVIEW" || status === "ADDITIONAL_INFORMATION_REQUIRED"
                    ? "linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 50%, #2563EB 100%)"
                    : status === "REJECTED"
                    ? "linear-gradient(135deg, #7f1d1d 0%, #dc2626 50%, #ef4444 100%)"
                    : "linear-gradient(135deg, #1a2e1a 0%, #2E7D32 60%, #4CAF50 100%)",
              }}
            />
            {/* Subtle dot pattern */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />

            <div className="relative px-6 pt-5 pb-5 flex items-start justify-between">
              <div className="flex items-start gap-4">
                {/* Avatar ring */}
                <div className="shrink-0 p-1 rounded-[20px] bg-white/20 backdrop-blur-sm">
                  <UserAvatar
                    src={expert.profileImage}
                    name={formatFullName(expert.fullName)}
                    size="lg"
                    className="ring-2 ring-white/50 rounded-[16px]"
                  />
                </div>

                <div className="space-y-1.5 pt-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight drop-shadow-sm">
                      {formatFullName(expert.fullName)}
                    </h3>
                    {status === "VERIFIED" ? (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#1B5E20] bg-white/90 px-3 py-1 rounded-full shadow-sm">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified Expert
                      </span>
                    ) : status === "UNDER_REVIEW" ? (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#1e40af] bg-white/90 px-3 py-1 rounded-full shadow-sm">
                        <Clock className="w-3 h-3" />
                        Under Review
                      </span>
                    ) : status === "REJECTED" ? (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#991b1b] bg-white/90 px-3 py-1 rounded-full shadow-sm">
                        <XCircle className="w-3 h-3" />
                        Rejected
                      </span>
                    ) : status === "ADDITIONAL_INFORMATION_REQUIRED" ? (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#92400e] bg-white/90 px-3 py-1 rounded-full shadow-sm">
                        <Clock className="w-3 h-3" />
                        Action Required
                      </span>
                    ) : status === "DRAFT" ? (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#374151] bg-white/90 px-3 py-1 rounded-full shadow-sm">
                        <Clock className="w-3 h-3" />
                        Draft
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#92400e] bg-white/90 px-3 py-1 rounded-full shadow-sm">
                        <Clock className="w-3 h-3" />
                        Pending
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-white/80 font-medium">
                    {expert.designation || "No designation"}
                    {expert.organization ? ` · ${expert.organization}` : ""}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 border border-white/30 px-3 py-1 text-[11px] text-white font-medium backdrop-blur-sm">
                      <Mail className="w-3 h-3" />
                      {expert.email}
                    </span>
                    {expert.phone && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 border border-white/30 px-3 py-1 text-[11px] text-white font-medium backdrop-blur-sm">
                        <Phone className="w-3 h-3" />
                        {expert.phone}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/20 border border-white/30 px-3 py-1 text-[11px] font-bold text-white font-mono backdrop-blur-sm">
                      #{expert.profileId}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                aria-label="Close expert details"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors cursor-pointer backdrop-blur-sm shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action notification */}
          {actionMessage && (
            <div
              className={`mx-5 mt-4 p-3 rounded-[12px] text-xs font-semibold border flex items-center gap-2 ${
                actionMessage.success
                  ? "bg-[#E8F5E9] text-[#1B5E20] border-[#A5D6A7]"
                  : "bg-[#FEE2E2] text-[#DC2626] border-[#FCA5A5]"
              }`}
            >
              {actionMessage.success ? (
                <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-[#DC2626] shrink-0" />
              )}
              <span>{actionMessage.text}</span>
            </div>
          )}

          {/* Admin notes callout — color is contextual based on verification status */}
          {expert.adminNotes && (() => {
            const isApprovedState = status === "VERIFIED" || status === "APPROVED";
            const isRejectedState = status === "REJECTED";
            const noteStyle = isApprovedState
              ? "bg-[#E8F5E9] border-[#A5D6A7] text-[#1B5E20]"
              : isRejectedState
              ? "bg-[#FEE2E2] border-[#FCA5A5] text-[#DC2626]"
              : "bg-[#FEF3C7] border-[#FCD34D] text-[#92400e]";
            const NoteIcon = isApprovedState ? CheckCircle2 : isRejectedState ? AlertTriangle : Clock;
            return (
              <div className={`mx-5 mt-4 p-4 rounded-[12px] border space-y-1 ${noteStyle}`}>
                <div className="flex items-center gap-2">
                  <NoteIcon className="w-4 h-4 shrink-0" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    Admin Evaluation Feedback:
                  </span>
                </div>
                <p className="text-xs font-medium pl-6">&ldquo;{expert.adminNotes}&rdquo;</p>
              </div>
            );
          })()}

          {/* Pill Tab Bar */}
          <div className="px-5 pt-4 pb-2">
            <div className="flex overflow-x-auto gap-1.5 bg-[#F1F5F9] p-1.5 rounded-full no-scrollbar">
              <button
                type="button"
                onClick={() => setActiveTab("details")}
                className={`flex-1 min-w-max px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === "details"
                    ? "bg-white text-[#1F2937] shadow-sm"
                    : "text-[#6B7280] hover:text-[#1F2937]"
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 text-[#2E7D32]" />
                <span>Overview</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("documents")}
                className={`flex-1 min-w-max px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === "documents"
                    ? "bg-white text-[#1F2937] shadow-sm"
                    : "text-[#6B7280] hover:text-[#1F2937]"
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-[#2E7D32]" />
                <span>Documents</span>
                <span className="text-[10px] px-1.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] font-bold border border-[#A5D6A7]">
                  {docsList.length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("crops")}
                className={`flex-1 min-w-max px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === "crops"
                    ? "bg-white text-[#1F2937] shadow-sm"
                    : "text-[#6B7280] hover:text-[#1F2937]"
                }`}
              >
                <Sprout className="w-3.5 h-3.5 text-[#2E7D32]" />
                <span>Expertise &amp; Crops</span>
                {(() => {
                  const total = (expert.cropDetails || []).length;
                  const verified = (expert.cropDetails || []).filter(c => c.verificationStatus === "VERIFIED").length;
                  return total > 0 ? (
                    <span className={`text-[10px] px-1.5 rounded-full font-bold ${
                      verified === total
                        ? "bg-[#E8F5E9] text-[#2E7D32] border border-[#A5D6A7]"
                        : "bg-[#DBEAFE] text-[#2563EB] border border-[#93C5FD]"
                    }`}>
                      {verified}/{total}
                    </span>
                  ) : null;
                })()}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("history")}
                className={`flex-1 min-w-max px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === "history"
                    ? "bg-white text-[#1F2937] shadow-sm"
                    : "text-[#6B7280] hover:text-[#1F2937]"
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-[#2E7D32]" />
                <span>Verification History</span>
              </button>
            </div>
          </div>

          {/* Body Content — independently scrollable; pb-6 prevents footer from covering last items */}
          <div className="px-5 pb-6 pt-3 overflow-y-auto flex-1 space-y-4">
            
            {/* TAB 1: Details */}
            {activeTab === "details" && (
              <div className="space-y-4">
                {/* Quick Summary Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* Card 1: Attached Documents */}
                  <div className="p-4 rounded-[16px] bg-[#F8FAF8] border border-[#E5E7EB]">
                    <div className="w-8 h-8 rounded-full bg-[#E8F5E9] border border-[#C8E6C9] flex items-center justify-center mb-2">
                      <FileText className="w-4 h-4 text-[#2E7D32]" />
                    </div>
                    <p className="text-[10px] uppercase font-semibold text-[#9CA3AF]">Attached Documents</p>
                    <p className="text-lg font-bold text-[#1F2937] mt-0.5">{docsList.length}</p>
                    <p className="text-[11px] text-[#9CA3AF] mt-0.5">Certificates &amp; supporting docs</p>
                  </div>
                  {/* Card 2: Specializations */}
                  <div className="p-4 rounded-[16px] bg-[#F8FAF8] border border-[#E5E7EB]">
                    <div className="w-8 h-8 rounded-full bg-[#E8F5E9] border border-[#C8E6C9] flex items-center justify-center mb-2">
                      <Sprout className="w-4 h-4 text-[#2E7D32]" />
                    </div>
                    <p className="text-[10px] uppercase font-semibold text-[#9CA3AF]">Specializations</p>
                    <p className="text-lg font-bold text-[#1F2937] mt-0.5">
                      {(expert.specializations || []).length || (expert.cropDetails || []).length || (expert.primaryCrops || []).length || 0}
                    </p>
                    {(expert.specializations || []).length > 0 && (
                      <p className="text-[11px] text-[#9CA3AF] mt-0.5 truncate">{expert.specializations!.slice(0, 2).join(" / ")}</p>
                    )}
                  </div>
                  {/* Card 3: Field Experience */}
                  <div className="p-4 rounded-[16px] bg-[#F8FAF8] border border-[#E5E7EB]">
                    <div className="w-8 h-8 rounded-full bg-[#E8F5E9] border border-[#C8E6C9] flex items-center justify-center mb-2">
                      <Briefcase className="w-4 h-4 text-[#2E7D32]" />
                    </div>
                    <p className="text-[10px] uppercase font-semibold text-[#9CA3AF]">Field Experience</p>
                    {expert.yearsOfExperience != null ? (
                      <p className="text-lg font-bold text-[#1F2937] mt-0.5">{expert.yearsOfExperience} yrs</p>
                    ) : (
                      <>
                        <p className="text-sm font-bold text-[#9CA3AF] mt-0.5">Not provided</p>
                        <p className="text-[11px] text-[#9CA3AF] mt-0.5">No information submitted</p>
                      </>
                    )}
                  </div>
                  {/* Card 4: Application Submitted */}
                  <div className="p-4 rounded-[16px] bg-[#F8FAF8] border border-[#E5E7EB]">
                    <div className="w-8 h-8 rounded-full bg-[#E8F5E9] border border-[#C8E6C9] flex items-center justify-center mb-2">
                      <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
                    </div>
                    <p className="text-[10px] uppercase font-semibold text-[#9CA3AF]">Application Submitted</p>
                    {expert.submittedAt ? (
                      <>
                        <p className="text-sm font-bold text-[#1F2937] mt-0.5">
                          {new Date(expert.submittedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                        {expert.createdAt && (
                          <p className="text-[11px] text-[#9CA3AF] mt-0.5">
                            Created: {new Date(expert.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="text-sm font-bold text-[#9CA3AF] mt-0.5">Not provided</p>
                    )}
                  </div>
                </div>

                {/* Main 3 Credential Dossier Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Academic Qualification — structured display */}
                  <div className="p-4 rounded-[16px] bg-[#F8FAF8] border border-[#E5E7EB] space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-[#E8F5E9] border border-[#A5D6A7] flex items-center justify-center text-[#2E7D32]">
                        <GraduationCap className="w-4 h-4" />
                      </span>
                      <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">
                        Academic Qualification
                      </span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-bold text-[#1F2937]">
                        {expert.qualification || "Not provided"}
                      </p>
                      {expert.specializations && expert.specializations.length > 0 && (
                        <div>
                          <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Specialization</p>
                          <p className="text-xs text-[#4B5563] font-medium mt-0.5">{expert.specializations.join(" / ")}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Institution</p>
                        <p className="text-xs text-[#4B5563] font-medium mt-0.5">{expert.institution || "Not provided"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="p-4 rounded-[16px] bg-[#F8FAF8] border border-[#E5E7EB] space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-[#E8F5E9] border border-[#A5D6A7] flex items-center justify-center text-[#2E7D32]">
                        <Briefcase className="w-4 h-4" />
                      </span>
                      <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">
                        Experience
                      </span>
                    </div>
                    {expert.yearsOfExperience != null ? (
                      <div>
                        <p className="text-sm font-bold text-[#1F2937]">{expert.yearsOfExperience} Years</p>
                        <p className="text-xs text-[#6B7280] font-medium mt-0.5">
                          {expert.designation || expert.organization || "No additional details provided"}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-bold text-[#9CA3AF]">Not provided</p>
                        <p className="text-xs text-[#9CA3AF] mt-0.5">No work experience information submitted.</p>
                      </div>
                    )}
                  </div>

                  {/* Employer / Organization */}
                  <div className="p-4 rounded-[16px] bg-[#F8FAF8] border border-[#E5E7EB] space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-[#E8F5E9] border border-[#A5D6A7] flex items-center justify-center text-[#2E7D32]">
                        <Building2 className="w-4 h-4" />
                      </span>
                      <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">
                        Employer / Organization
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#1F2937] truncate">
                        {expert.organization || "Not provided"}
                      </p>
                      <p className="text-xs text-[#6B7280] font-medium truncate mt-0.5">
                        {expert.designation || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>

                {expert.websiteUrl && (
                  <div className="p-3.5 rounded-xl bg-[#F1F5F2]/50 border border-[#E5E7EB] flex items-center gap-2 text-xs">
                    <Globe className="w-4 h-4 text-[#2E7D32] shrink-0" />
                    <span className="text-[#6B7280] font-medium">Public Profile / Website:</span>
                    <a
                      href={expert.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#2E7D32] hover:underline truncate font-bold"
                    >
                      {expert.websiteUrl}
                    </a>
                  </div>
                )}

                {/* Professional Biography & Experience */}
                <div className="rounded-xl border border-[#E5E7EB] bg-[#F8FAF8] p-4 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#2E7D32] shrink-0" />
                    <p className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                      Professional Biography &amp; Experience
                    </p>
                  </div>
                  {sanitizeBio(expert.bio) ? (
                    <p className="text-xs sm:text-sm text-[#1F2937] leading-relaxed bg-white p-3.5 rounded-lg border border-[#E5E7EB] shadow-2xs">
                      {sanitizeBio(expert.bio)}
                    </p>
                  ) : (
                    <div className="p-5 rounded-lg bg-white border border-dashed border-[#E5E7EB] text-center space-y-1">
                      <p className="text-xs text-[#6B7280] font-semibold">
                        No biography was provided by this applicant.
                      </p>
                      <p className="text-[11px] text-[#9CA3AF]">
                        Review uploaded credentials and certificates in the Documents tab.
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
                    <h4 className="text-sm font-bold text-[#1F2937]">
                      Uploaded Verification Credentials
                    </h4>
                    <p className="text-xs text-[#6B7280] mt-0.5">
                      Inspect uploaded certificates, degrees, licenses, and verification credentials.
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-[#2E7D32] bg-[#E8F5E9] border border-[#A5D6A7] px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{docsList.length} Attached</span>
                  </span>
                </div>

                {docsList.length === 0 ? (
                  <div className="p-8 text-center bg-[#F8FAF8] border border-[#E5E7EB] rounded-xl space-y-1">
                    <FileText className="w-8 h-8 text-[#9CA3AF] mx-auto mb-2" />
                    <p className="text-xs font-bold text-[#1F2937]">No verification documents uploaded</p>
                    <p className="text-[11px] text-[#9CA3AF]">This applicant has not uploaded any credentials or certificates yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {docsList.map((doc, idx) => (
                      <div
                        key={doc.id || idx}
                        className="p-4 rounded-[16px] border border-[#E5E7EB] bg-[#F8FAF8] hover:bg-white hover:border-[#C8E6C9] hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white text-[#4B5563] border border-[#E5E7EB]">
                              {doc.documentType || "CREDENTIAL"}
                            </span>
                            <span className="text-[10px] font-semibold text-[#2E7D32] bg-[#E8F5E9] border border-[#A5D6A7] px-2.5 py-1 rounded-full">
                              Uploaded
                            </span>
                          </div>
                          <h5 className="font-bold text-sm text-[#1F2937]">
                            {doc.title}
                          </h5>
                          <div className="flex items-center gap-2 text-xs text-[#9CA3AF] font-mono">
                            <FileText className="w-3.5 h-3.5 text-[#2E7D32] shrink-0" />
                            <span className="truncate">{doc.fileName}</span>
                            {doc.fileSize && (
                              <span className="text-[#9CA3AF] shrink-0">({doc.fileSize})</span>
                            )}
                          </div>
                        </div>

                        <div className="pt-2.5 border-t border-[#E5E7EB] flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setViewingDoc(doc)}
                            className="flex-1 py-2 px-3 rounded-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              if (!doc.id) return;
                              try {
                                await adminService.approveDocument(Number(doc.id));
                                toast.success({
                                  title: "Document Approved",
                                  description: `"${doc.title || doc.fileName}" has been verified.`,
                                });
                                if (onStatusChanged) onStatusChanged();
                              } catch {
                                toast.error({
                                  title: "Action Failed",
                                  description: "Could not approve document.",
                                });
                              }
                            }}
                            className="py-2 px-3 rounded-full bg-[#E8F5E9] border border-[#A5D6A7] hover:bg-[#D7F0D7] text-[#2E7D32] text-xs font-bold transition-colors cursor-pointer"
                            title="Approve Credential"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              toast.info({
                                title: "Document Ready",
                                description: `Document "${doc.fileName}" is ready in verified storage.`,
                              })
                            }
                            className="py-2 px-3 rounded-full border border-[#E5E7EB] bg-white hover:bg-[#F8FAF8] text-[#4B5563] text-xs font-bold transition-colors cursor-pointer"
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
                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-2xs">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-xs font-bold text-[#1F2937] uppercase tracking-wider">
                            Expertise Verification Progress
                          </p>
                          <p className="text-[11px] text-[#6B7280] mt-0.5">
                            Only VERIFIED claims appear in farmer matching &amp; consultations.
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xl font-bold text-[#1F2937]">{verifiedCount}</span>
                          <span className="text-sm font-semibold text-[#6B7280]"> / {totalCount}</span>
                          <p className="text-[10px] font-semibold text-[#6B7280] mt-0.5">verified</p>
                        </div>
                      </div>
                      {/* Progress bar */}
                      <div className="w-full bg-[#F1F5F2] rounded-md h-2 overflow-hidden">
                        <div
                          className="h-2 rounded-md bg-[#2E7D32] transition-all duration-300"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-1.5 text-[10px] font-semibold">
                        <span className="text-[#2E7D32]">{progressPct}% complete</span>
                        <div className="flex items-center gap-3">
                          <span className="text-[#2E7D32]">{verifiedCount} verified</span>
                          <span className="text-[#F59E0B]">{cropsState.filter(c => c.verificationStatus === "EVIDENCE_SUBMITTED").length} evidence</span>
                          <span className="text-[#6B7280]">{cropsState.filter(c => c.verificationStatus === "SELF_DECLARED" || c.verificationStatus === "PENDING").length} self-declared</span>
                          <span className="text-[#DC2626]">{cropsState.filter(c => c.verificationStatus === "REJECTED").length} rejected</span>
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
                            className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer border ${
                              categoryFilter === cat
                                ? "bg-[#1F2937] text-white border-[#E5E7EB]"
                                : "bg-white text-[#4B5563] border-[#E5E7EB] hover:border-[#D1D5DB]"
                            }`}
                          >
                            {cat === "ALL" ? "All Categories" : cat}
                          </button>
                        ))}
                      </div>
                      <div className="w-px h-5 bg-[#E5E7EB] hidden sm:block" />
                      {/* Type filter */}
                      {(["ALL", "PRIMARY", "SECONDARY", "AREA"] as const).map(t => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTypeFilter(t)}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer border ${
                            typeFilter === t
                              ? t === "ALL"
                                ? "bg-[#1F2937] text-white border-[#E5E7EB]"
                                : "bg-[#2E7D32] text-white border-[#C8E6C9]"
                              : "bg-white text-[#4B5563] border-[#E5E7EB] hover:border-[#D1D5DB]"
                          }`}
                        >
                          {t === "ALL" ? "All Types" : t === "PRIMARY" ? "Primary" : t === "SECONDARY" ? "Secondary" : "Domain"}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* ── Batch Action Toolbar ─────────────────────────── */}
                  {filteredCrops.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl border border-[#E5E7EB] bg-[#F8FAF8]">
                      <label className="flex items-center gap-2 text-xs font-semibold text-[#4B5563] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filteredCrops.every(c => selectedIds.has(c.id))}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedIds(new Set(filteredCrops.map(c => c.id)));
                            } else {
                              setSelectedIds(new Set());
                            }
                          }}
                          className="h-3.5 w-3.5 rounded accent-[#2E7D32]"
                        />
                        Select All ({filteredCrops.length})
                      </label>
                      {selectedIds.size > 0 && (
                        <>
                          <span className="text-[10px] font-bold text-[#6B7280]">{selectedIds.size} selected</span>
                          <button
                            type="button"
                            onClick={() => void handleBatchVerify()}
                            disabled={batchProcessing}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#2E7D32] px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#1B5E20] disabled:opacity-50 transition-colors"
                          >
                            {batchProcessing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                            Verify Selected
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowBatchRejectInput(true)}
                            disabled={batchProcessing}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-[#FCA5A5] bg-[#FEE2E2] px-3 py-1.5 text-xs font-bold text-[#DC2626] hover:bg-[#FEE2E2] disabled:opacity-50 transition-colors"
                          >
                            <X className="h-3 w-3" />
                            Reject Selected
                          </button>
                        </>
                      )}
                    </div>
                  )}

                  {/* Batch reject reason input */}
                  {showBatchRejectInput && (
                    <div className="rounded-xl border border-[#FCA5A5] bg-[#FEE2E2] p-3 space-y-2">
                      <p className="text-xs font-bold text-[#DC2626]">Rejection reason (required for all {selectedIds.size} selected)</p>
                      <textarea
                        rows={2}
                        value={batchRejectReason}
                        onChange={(e) => setBatchRejectReason(e.target.value)}
                        placeholder="Enter reason for rejection..."
                        className="w-full text-xs rounded-lg border border-[#FCA5A5] bg-white px-3 py-2 resize-none outline-none focus:ring-1 focus:ring-[#FEE2E2]"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => void handleBatchReject()}
                          disabled={batchProcessing || !batchRejectReason.trim()}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-[#DC2626] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#B91C1C] disabled:opacity-50 transition-colors"
                        >
                          {batchProcessing ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
                          Confirm Reject
                        </button>
                        <button
                          type="button"
                          onClick={() => { setShowBatchRejectInput(false); setBatchRejectReason(""); }}
                          className="rounded-lg border border-[#E5E7EB] px-3 py-1.5 text-xs font-semibold text-[#4B5563] hover:bg-[#F8FAF8]"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ── Crop Cards ───────────────────────────────────── */}
                  {totalCount === 0 ? (
                    // Legacy fallback when no cropDetails available
                    <div className="space-y-3">
                      <p className="text-xs font-bold text-[#4B5563] uppercase tracking-wider">
                        Primary Crops (Legacy — no per-crop verification data)
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {(expert.primaryCrops || []).length > 0 ? (
                          expert.primaryCrops?.map((c) => (
                            <span key={c} className="px-3 py-1.5 rounded-lg bg-[#E8F5E9] text-[#1B5E20] border border-[#A5D6A7] text-xs font-semibold flex items-center gap-1.5">
                              <Sprout className="h-3.5 w-3.5" />
                              <span>{c}</span>
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-[#9CA3AF]">No crop data available</span>
                        )}
                      </div>
                    </div>
                  ) : filteredCrops.length === 0 ? (
                    <div className="py-10 text-center bg-[#F8FAF8] rounded-xl border border-[#E5E7EB]">
                      <Sprout className="w-7 h-7 text-[#9CA3AF] mx-auto mb-2" />
                      <p className="text-xs font-bold text-[#4B5563]">No crops match current filters</p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      <p className="text-xs font-bold text-[#4B5563] uppercase tracking-wider">
                        Claimed Crop Expertise — Individual Review
                      </p>
                      {filteredCrops.map((c) => {
                        const isCropVerified = c.verificationStatus === "VERIFIED";
                        const isCropRejected = c.verificationStatus === "REJECTED";
                        const isEvidenceSubmitted = c.verificationStatus === "EVIDENCE_SUBMITTED";
                        const isExpanded = activeCrop === c.id;
                        const isThisCropProcessing = cropProcessing === c.id;
                        const note = cropNotes[c.id] || "";
                        const displayName = c.cropName ?? c.expertiseArea ?? "Domain";
                        const isSelected = selectedIds.has(c.id);
                        const ClaimIcon = c.expertiseType === "AREA" ? Award : Sprout;

                        return (
                          <div
                            key={c.id}
                            className={`rounded-xl border transition-colors duration-150 overflow-hidden ${
                              isSelected
                                ? "border-[#A5D6A7] ring-1 ring-[#E8F5E9]"
                                : isExpanded
                                ? "border-[#A5D6A7] ring-1 ring-[#E8F5E9]"
                                : "border-[#E5E7EB] bg-white hover:border-[#D1D5DB]"
                            } bg-white`}
                          >
                            {/* Card Header */}
                            <div className="flex items-center gap-2 px-3 pt-2 pb-0">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                  const next = new Set(selectedIds);
                                  if (e.target.checked) next.add(c.id); else next.delete(c.id);
                                  setSelectedIds(next);
                                }}
                                className="h-3.5 w-3.5 rounded accent-[#2E7D32] shrink-0 mt-3"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <button
                                type="button"
                                onClick={() => setActiveCrop(isExpanded ? null : c.id)}
                                className="flex-1 flex items-center justify-between p-3 cursor-pointer text-left"
                              >
                                <div className="flex items-center gap-3">
                                  <CropAvatar
                                    name={c.cropName ?? displayName}
                                    imageUrl={c.cropImageUrl}
                                    emoji={c.cropEmoji}
                                    isArea={c.expertiseType === "AREA"}
                                    size="md"
                                  />
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h5 className="font-semibold text-sm text-[#1F2937]">{displayName}</h5>
                                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                                        c.expertiseType === "PRIMARY"
                                          ? "bg-[#E8F5E9] text-[#2E7D32] border-[#A5D6A7]"
                                        : c.expertiseType === "AREA"
                                          ? "bg-[#F1F5F2] text-[#4B5563] border-[#E5E7EB]"
                                          : "bg-[#DBEAFE] text-[#2563EB] border-[#93C5FD]"
                                      }`}>
                                        {c.expertiseType === "PRIMARY" ? "PRIMARY" : c.expertiseType === "AREA" ? "DOMAIN" : "SECONDARY"}
                                      </span>
                                    </div>
                                    <span className="text-[11px] text-[#9CA3AF] font-medium">
                                      {c.categoryName || (c.expertiseType === "AREA" ? "Agricultural Domain" : "General")}{c.verifiedAt ? ` • Verified ${new Date(c.verifiedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}` : ""}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-md border ${
                                    isCropVerified
                                      ? "bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]"
                                      : isCropRejected
                                      ? "bg-[#FEE2E2] text-[#DC2626] border-[#FCA5A5]"
                                      : isEvidenceSubmitted
                                      ? "bg-[#FEF3C7] text-[#F59E0B] border-[#FCD34D]"
                                      : "bg-[#F1F5F2] text-[#4B5563] border-[#E5E7EB]"
                                  }`}>
                                    {isCropVerified ? "Verified" : isCropRejected ? "Rejected" : isEvidenceSubmitted ? "Evidence submitted" : "Self-declared"}
                                  </span>
                                  <svg
                                    className={`w-4 h-4 text-[#9CA3AF] transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                  </svg>
                                </div>
                              </button>
                            </div>

                            {/* Expanded Review Panel */}
                            {isExpanded && (
                              <div className="px-5 pb-5 border-t border-[#E5E7EB] pt-4 space-y-3 animate-in fade-in duration-150">
                                {/* Status context */}
                                {isCropVerified && (
                                  <div className="flex items-center gap-2 p-3 rounded-lg bg-[#E8F5E9] border border-[#A5D6A7] text-[#1B5E20] text-xs font-semibold">
                                    <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0" />
                                    <span>This crop expertise is currently <strong>verified</strong> and active for farmer consultations.</span>
                                  </div>
                                )}
                                {isCropRejected && (
                                  <div className="flex items-center gap-2 p-3 rounded-lg bg-[#FEE2E2] border border-[#FCA5A5] text-[#DC2626] text-xs font-semibold">
                                    <AlertTriangle className="w-4 h-4 text-[#DC2626] shrink-0" />
                                    <span>This crop expertise was <strong>rejected</strong>. You can re-open it to Pending or verify directly.</span>
                                  </div>
                                )}
                                {!isCropVerified && !isCropRejected && (
                                  <div className="flex items-center gap-2 p-3 rounded-lg bg-[#FEF3C7] border border-[#FCD34D] text-[#F59E0B] text-xs font-semibold">
                                    <Clock className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
                                    <span>Awaiting admin review. Verify or reject this expertise claim below.</span>
                                  </div>
                                )}

                                {/* Admin notes textarea */}
                                <div>
                                  <label className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wide mb-1 block">
                                    Admin Review Notes (optional — recorded with verification action)
                                  </label>
                                  <textarea
                                    rows={2}
                                    value={note}
                                    onChange={(e) => setCropNotes(prev => ({ ...prev, [c.id]: e.target.value }))}
                                    placeholder={`e.g. Verified ${c.cropName} expertise via submitted degree and field experience certificate...`}
                                    className="w-full text-xs text-[#1F2937] bg-white border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/15 focus:border-[#2E7D32] placeholder:text-[#9CA3AF]"
                                  />
                                </div>

                                {/* Action buttons */}
                                <div className="flex items-center gap-2 pt-1 flex-wrap">
                                  {/* Verify button — shown when not yet verified */}
                                  {!isCropVerified && (
                                    <button
                                      type="button"
                                      disabled={isThisCropProcessing}
                                      onClick={() => setConfirmation({ kind: "verify-crop", expertiseId: c.id })}
                                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-4 rounded-lg bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
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
                                      onClick={() => setConfirmation({ kind: "reject-crop", expertiseId: c.id })}
                                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-4 rounded-lg border border-[#FCA5A5] bg-white hover:bg-[#FEE2E2] text-[#DC2626] text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
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
                                      onClick={() => setConfirmation({ kind: "reject-crop", expertiseId: c.id })}
                                      className="flex items-center gap-1.5 py-2 px-4 rounded-lg border border-[#FCD34D] bg-[#FEF3C7] hover:bg-[#FEF3C7] text-[#F59E0B] text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
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
                                      onClick={() => setConfirmation({ kind: "verify-crop", expertiseId: c.id })}
                                      className="flex items-center gap-1.5 py-2 px-4 rounded-lg border border-[#93C5FD] bg-[#DBEAFE] hover:bg-[#DBEAFE] text-[#2563EB] text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                                    >
                                      {isThisCropProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                                      Re-open &amp; Verify
                                    </button>
                                  )}

                                  <button
                                    type="button"
                                    onClick={() => setActiveCrop(null)}
                                    className="py-2 px-4 rounded-lg border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F8FAF8] text-xs font-semibold transition-colors cursor-pointer"
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
                    <p className="text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-2">
                      Domain Specializations
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {(expert.specializations || []).length > 0 ? (
                        expert.specializations?.map((s) => (
                          <span key={s} className="px-3 py-1.5 rounded-lg bg-[#E8F5E9] text-[#2E7D32] border border-[#A5D6A7] text-xs font-semibold flex items-center gap-1.5">
                            <Award className="w-3 h-3 text-[#2E7D32]" />
                            <span>{s}</span>
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-[#9CA3AF]">No specializations specified</span>
                      )}
                    </div>
                  </div>

                  {/* ── Locations ─────────────────────────────────────── */}
                  <div>
                    <p className="text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-2">
                      Designated Service Locations
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {(expert.locations || []).length > 0 ? (
                        expert.locations?.map((l) => (
                          <span key={l} className="px-3 py-1.5 rounded-lg bg-white text-[#4B5563] border border-[#E5E7EB] text-xs font-semibold flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#2E7D32]" />
                            <span>{l}</span>
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-[#9CA3AF]">No service locations provided</span>
                      )}
                    </div>
                  </div>

                </div>
              );
            })()}

            {/* Additional Info drawer if triggered */}
            {showInfoInput && (
              <div className="p-5 rounded-xl bg-[#FEF3C7]/70 border border-[#FCD34D] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#F59E0B] block">
                    Request Additional Information or Updated Documents
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowInfoInput(false)}
                    className="text-xs font-semibold text-[#6B7280] hover:text-[#1F2937] cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={infoReason}
                  onChange={(e) => setInfoReason(e.target.value)}
                  placeholder="e.g. Please re-upload clearer degree transcripts and provide valid license registration details..."
                  className="w-full text-xs text-[#1F2937] bg-white border border-[#FCD34D] rounded-lg p-3.5 focus:outline-none focus:ring-2 focus:ring-[#FEF3C7]/20 resize-none"
                />
                <button
                  type="button"
                  onClick={handleRequestInfo}
                  disabled={isProcessing || !infoReason.trim()}
                  className="px-5 py-2.5 rounded-lg bg-[#F59E0B] hover:bg-[#F59E0B] text-white text-xs font-semibold transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  {isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Clock className="w-3.5 h-3.5" />}
                  <span>Send Request to Candidate</span>
                </button>
              </div>
            )}

            {/* Rejection input drawer if triggered */}
            {showRejectInput && (
              <div className="p-5 rounded-xl bg-[#FEE2E2]/70 border border-[#FCA5A5] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#DC2626] block">
                    Rejection Feedback &amp; Required Remediation
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowRejectInput(false)}
                    className="text-xs font-semibold text-[#6B7280] hover:text-[#1F2937] cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g. Qualifications do not meet accredited criteria for specialized agricultural consultation..."
                  className="w-full text-xs text-[#1F2937] bg-white border border-[#FCA5A5] rounded-lg p-3.5 focus:outline-none focus:ring-2 focus:ring-[#FEE2E2]/20 resize-none"
                />
                <button
                  type="button"
                  onClick={handleReject}
                  disabled={isProcessing || !rejectReason.trim()}
                  className="px-5 py-2.5 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-semibold transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  {isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <X className="w-3.5 h-3.5" />}
                  <span>Confirm Application Rejection</span>
                </button>
              </div>
            )}
            {/* TAB 4: Verification History */}
            {activeTab === "history" && (() => {
              const hasHistory = !!(expert.adminNotes || expert.submittedAt || expert.createdAt || expert.rejectionReason);
              return (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-[#1F2937]">Verification History</h4>
                    <p className="text-xs text-[#6B7280] mt-0.5">Administrative actions and status changes for this expert profile.</p>
                  </div>

                  {!hasHistory ? (
                    <div className="py-12 text-center bg-[#F8FAF8] rounded-xl border border-[#E5E7EB] space-y-2">
                      <Clock className="w-8 h-8 text-[#9CA3AF] mx-auto" />
                      <p className="text-xs font-bold text-[#4B5563]">No verification history available</p>
                      <p className="text-[11px] text-[#9CA3AF]">No administrative actions have been recorded for this profile yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Application Timeline */}
                      <div className="bg-white border border-[#E5E7EB] rounded-xl divide-y divide-[#F1F5F2]">
                        {expert.createdAt && (
                          <div className="flex items-start gap-3 p-4">
                            <div className="w-8 h-8 rounded-full bg-[#E8F5E9] border border-[#A5D6A7] flex items-center justify-center shrink-0 mt-0.5">
                              <FileText className="w-4 h-4 text-[#2E7D32]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-xs font-bold text-[#1F2937]">Application Created</p>
                                <span className="text-[10px] text-[#9CA3AF] font-mono shrink-0">
                                  {new Date(expert.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                </span>
                              </div>
                              <p className="text-[11px] text-[#6B7280] mt-0.5">Expert profile application was initiated.</p>
                            </div>
                          </div>
                        )}
                        {expert.submittedAt && (
                          <div className="flex items-start gap-3 p-4">
                            <div className="w-8 h-8 rounded-full bg-[#E8F5E9] border border-[#A5D6A7] flex items-center justify-center shrink-0 mt-0.5">
                              <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-xs font-bold text-[#1F2937]">Application Submitted</p>
                                <span className="text-[10px] text-[#9CA3AF] font-mono shrink-0">
                                  {new Date(expert.submittedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                </span>
                              </div>
                              <p className="text-[11px] text-[#6B7280] mt-0.5">Application submitted for admin review.</p>
                            </div>
                          </div>
                        )}
                        {expert.adminNotes && (
                          <div className="flex items-start gap-3 p-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                              status === "VERIFIED" || status === "APPROVED"
                                ? "bg-[#E8F5E9] border border-[#A5D6A7]"
                                : status === "REJECTED"
                                ? "bg-[#FEE2E2] border border-[#FCA5A5]"
                                : "bg-[#FEF3C7] border border-[#FCD34D]"
                            }`}>
                              {status === "VERIFIED" || status === "APPROVED" ? (
                                <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
                              ) : status === "REJECTED" ? (
                                <AlertTriangle className="w-4 h-4 text-[#DC2626]" />
                              ) : (
                                <Clock className="w-4 h-4 text-[#F59E0B]" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-xs font-bold text-[#1F2937]">Admin Evaluation</p>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                                  status === "VERIFIED" || status === "APPROVED"
                                    ? "bg-[#E8F5E9] text-[#2E7D32] border-[#A5D6A7]"
                                    : status === "REJECTED"
                                    ? "bg-[#FEE2E2] text-[#DC2626] border-[#FCA5A5]"
                                    : "bg-[#FEF3C7] text-[#F59E0B] border-[#FCD34D]"
                                }`}>
                                  {status}
                                </span>
                              </div>
                              <p className="text-[11px] text-[#6B7280] mt-0.5 italic">&ldquo;{expert.adminNotes}&rdquo;</p>
                              <p className="text-[10px] text-[#9CA3AF] mt-0.5">Recorded by platform administrator</p>
                            </div>
                          </div>
                        )}
                        {expert.rejectionReason && (
                          <div className="flex items-start gap-3 p-4">
                            <div className="w-8 h-8 rounded-full bg-[#FEE2E2] border border-[#FCA5A5] flex items-center justify-center shrink-0 mt-0.5">
                              <XCircle className="w-4 h-4 text-[#DC2626]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-[#DC2626]">Rejection Reason</p>
                              <p className="text-[11px] text-[#6B7280] mt-0.5">{expert.rejectionReason}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

          {/* Footer — state-aware block/unblock + primary verification actions */}
          <div className="px-5 py-4 border-t border-[#E5E7EB] bg-gradient-to-r from-[#F8FAF8] to-[#F1F5F9] flex items-center justify-between gap-3 flex-wrap">
            {/* Left: Close + conditional single Block OR Unblock */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full border border-[#E5E7EB] bg-white text-[#4B5563] hover:bg-[#F8FAF8] text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <X className="w-3.5 h-3.5" />
                Close
              </button>

              {expert.userId && (() => {
                const isBlocked = accountStatus === "BLOCKED";
                return isBlocked ? (
                  <button
                    type="button"
                    onClick={() => void handleUnblockExpertAccount()}
                    disabled={isProcessing}
                    className="px-3 py-2 rounded-full border border-[#A5D6A7] bg-white hover:bg-[#E8F5E9] text-[#2E7D32] text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                    title="Unblock and restore expert account"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    <span>Unblock Expert</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowBlockConfirm(true)}
                    disabled={isProcessing}
                    className="px-3 py-2 rounded-full border border-[#FCA5A5] bg-white hover:bg-[#FEE2E2] text-[#DC2626] text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                    title="Block expert account and revoke active refresh tokens"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Block Expert</span>
                  </button>
                );
              })()}
            </div>

            {/* Right: Account status pill + verification action buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              {(status === "VERIFIED" || expert.verifiedExpert) && (
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${
                  accountStatus === "BLOCKED"
                    ? "bg-[#FEE2E2] text-[#DC2626] border-[#FCA5A5]"
                    : "bg-[#E8F5E9] text-[#2E7D32] border-[#A5D6A7]"
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    accountStatus === "BLOCKED" ? "bg-[#DC2626]" : "bg-[#2E7D32]"
                  }`} />
                  {accountStatus === "BLOCKED" ? "Blocked" : "Active"}
                </span>
              )}

              {status === "REJECTED" ? (
                <>
                  <button
                    type="button"
                    onClick={handleStartReview}
                    disabled={isProcessing}
                    className="px-4 py-2 rounded-full border border-[#93C5FD] bg-[#DBEAFE] hover:bg-[#BFDBFE] text-[#2563EB] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Re-open for Review</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmation({ kind: "approve" })}
                    disabled={isProcessing}
                    className="px-4 py-2 rounded-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
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
                    className="px-4 py-2 rounded-full border border-[#FCD34D] bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#92400e] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Request Info</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowRejectInput(true);
                      setShowInfoInput(false);
                    }}
                    disabled={isProcessing}
                    className="px-4 py-2 rounded-full border border-[#FCA5A5] bg-white hover:bg-[#FEE2E2] text-[#DC2626] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmation({ kind: "approve" })}
                    disabled={isProcessing}
                    className="px-5 py-2 rounded-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 shadow-sm"
                  >
                    {isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    <span>Approve Expert</span>
                  </button>
                </>
              ) : status === "VERIFIED" || expert.verifiedExpert ? null : (
                <>
                  <button
                    type="button"
                    onClick={handleStartReview}
                    disabled={isProcessing}
                    className="px-4 py-2 rounded-full bg-[#1F2937] hover:bg-[#374151] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Clock className="w-3.5 h-3.5" />}
                    <span>Start Review</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowInfoInput(true);
                      setShowRejectInput(false);
                    }}
                    disabled={isProcessing}
                    className="px-4 py-2 rounded-full border border-[#FCD34D] bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#92400e] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Request Info</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowRejectInput(true);
                      setShowInfoInput(false);
                    }}
                    disabled={isProcessing}
                    className="px-4 py-2 rounded-full border border-[#FCA5A5] bg-white hover:bg-[#FEE2E2] text-[#DC2626] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reject</span>
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
        <p className="text-sm leading-relaxed text-[#4B5563]">
          {confirmation?.kind === "approve"
            ? `This will approve ${formatFullName(expert.fullName)} as a verified expert.`
            : confirmation?.kind === "verify-crop"
              ? "This expertise will become available for verified agricultural consultations."
              : "This expertise claim will be rejected and removed from the verified set."}
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={() => setConfirmation(null)} className="rounded-xl border border-[#E5E7EB] px-4 py-2 text-sm font-semibold text-[#4B5563] hover:bg-[#F8FAF8]">Cancel</button>
          <button type="button" onClick={confirmAction} disabled={isProcessing || cropProcessing !== null} className={`rounded-xl px-4 py-2 text-sm font-bold text-white disabled:opacity-50 ${confirmation?.kind === "reject-crop" ? "bg-[#B91C1C] hover:bg-[#B91C1C]" : "bg-[#2E7D32] hover:bg-[#1B5E20]"}`}>
            {confirmation?.kind === "reject-crop" ? "Reject" : "Confirm"}
          </button>
        </div>
      </Modal>

      {/* Block Expert Confirmation Modal */}
      <Modal
        isOpen={showBlockConfirm}
        onClose={() => {
          setShowBlockConfirm(false);
          setBlockReason("");
        }}
        title="Block Expert?"
      >
        <p className="text-sm text-[#4B5563] leading-relaxed">
          Are you sure you want to block <strong>{formatFullName(expert.fullName)}</strong>?
          The expert will lose access to expert-only platform features and all active sessions will be revoked.
        </p>
        <div className="mt-4 space-y-2">
          <label className="text-xs font-semibold text-[#6B7280] block">Reason (optional)</label>
          <textarea
            rows={2}
            value={blockReason}
            onChange={(e) => setBlockReason(e.target.value)}
            placeholder="e.g. Violation of platform guidelines..."
            className="w-full text-xs text-[#1F2937] bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#FCA5A5]/30 focus:border-[#FCA5A5]"
          />
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              setShowBlockConfirm(false);
              setBlockReason("");
            }}
            className="rounded-xl border border-[#E5E7EB] px-4 py-2 text-sm font-semibold text-[#4B5563] hover:bg-[#F8FAF8] cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void handleBlockExpertAccount(blockReason)}
            disabled={isProcessing}
            className="rounded-xl px-4 py-2 text-sm font-bold text-white bg-[#DC2626] hover:bg-[#B91C1C] disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
          >
            {isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
            Block Expert
          </button>
        </div>
      </Modal>

      {/* Embedded Document Preview Modal */}
      {viewingDoc && expert && (
        <div className="fixed inset-0 z-60 bg-[#1F2937]/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-xl border border-[#E5E7EB] w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="px-6 py-4 border-b border-[#EEF0EE] flex items-center justify-between bg-[#F8FAF8]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#E8F5E9] border border-[#A5D6A7] flex items-center justify-center text-[#2E7D32] shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1F2937] leading-tight">
                    {viewingDoc.title}
                  </h4>
                  <p className="text-xs text-[#6B7280] mt-0.5">
                    {formatFullName(expert.fullName)} • {viewingDoc.fileName}{viewingDoc.fileSize ? ` (${viewingDoc.fileSize})` : ""}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingDoc(null)}
                className="w-7 h-7 rounded-lg text-[#9CA3AF] hover:text-[#4B5563] hover:bg-[#E5E7EB] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content view */}
            <div className="p-6 overflow-y-auto flex-1 bg-[#F8FAF8]">
              {viewingDoc.fileUrl && viewingDoc.fileUrl.startsWith("data:image") ? (
                <div className="relative h-[500px] max-h-[65vh] w-full rounded-xl border border-[#E5E7EB] bg-white">
                  <Image
                    src={viewingDoc.fileUrl}
                    alt={viewingDoc.title}
                    fill
                    sizes="min(100vw, 768px)"
                    className="object-contain p-4"
                    unoptimized
                  />
                </div>
              ) : viewingDoc.fileUrl && viewingDoc.fileUrl.startsWith("data:application/pdf") ? (
                <iframe
                  src={viewingDoc.fileUrl}
                  title={viewingDoc.title}
                  className="w-full h-[500px] rounded-xl border border-[#E5E7EB] bg-white"
                />
              ) : (
                <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-xs relative overflow-hidden space-y-5">
                  <div className="text-center space-y-1 border-b border-[#EEF0EE] pb-4">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#E8F5E9] text-[#1B5E20] border border-[#A5D6A7] text-[10px] font-semibold uppercase tracking-wider mb-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D32]" />
                      <span>KrishiAI Verification Record • ID: KAI-DOC-{expert.profileId}-{viewingDoc.documentType || "01"}</span>
                    </div>
                    <h5 className="text-lg font-bold text-[#1F2937] tracking-tight">
                      {viewingDoc.title}
                    </h5>
                    <p className="text-xs text-[#6B7280]">
                      Official Candidate Verification Document &amp; Agricultural Certification
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs bg-[#F8FAF8] p-4 rounded-lg border border-[#E5E7EB]">
                    <div>
                      <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Candidate Name</p>
                      <p className="font-semibold text-[#1F2937] mt-0.5 text-sm">{formatFullName(expert.fullName)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Email Address</p>
                      <p className="font-medium text-[#1F2937] mt-0.5">{expert.email}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Qualification / Title</p>
                      <p className="font-medium text-[#1F2937] mt-0.5">{expert.qualification || expert.designation || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Organization / University</p>
                      <p className="font-medium text-[#1F2937] mt-0.5">{expert.institution || expert.organization || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">File Details</p>
                      <p className="font-mono text-[11px] text-[#4B5563] mt-0.5">{viewingDoc.fileSize ? `${viewingDoc.fileName} • ${viewingDoc.fileSize}` : viewingDoc.fileName}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Submission Date</p>
                      <p className="font-medium text-[#1F2937] mt-0.5">{expert.submittedAt || "Not provided"}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#EEF0EE]">
                    <div className="flex items-center gap-2 text-[#1B5E20] text-xs font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
                      <span>Validated for Administrator Review</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-[#9CA3AF] font-mono">STATUS: {status}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-[#E5E7EB] bg-white flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
                <span>Encrypted Document Preview</span>
              </div>
              <button
                type="button"
                onClick={() => setViewingDoc(null)}
                className="px-4 py-1.5 rounded-lg bg-[#1F2937] hover:bg-[#1F2937] text-white text-xs font-semibold transition-colors cursor-pointer"
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
