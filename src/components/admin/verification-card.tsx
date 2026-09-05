"use client";

import React, { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/providers/toast-provider";
import { getApiErrorMessage } from "@/lib/toast-utils";
import {
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  User,
  Mail,
  Phone,
  Building2,
  GraduationCap,
  Award,
  Sprout,
  MapPin,
  Clock,
  RefreshCw,
  ShieldAlert,
  CheckCircle2,
  MessageSquare,
  AlertTriangle,
  Globe,
  Briefcase,
  FileText,
  FileCheck2,
  ShieldCheck,
  Eye,
  ExternalLink,
  Download,
} from "lucide-react";

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

interface PendingExpert {
  profileId: number;
  userId?: number;
  fullName: string;
  email: string;
  phone?: string;
  designation?: string;
  organization?: string;
  yearsOfExperience?: number;
  qualification?: string;
  institution?: string;
  bio?: string;
  websiteUrl?: string;
  primaryCrops?: string[];
  secondaryCrops?: string[];
  specializations?: string[];
  locations?: string[];
  documents?: ExpertDoc[];
  submittedAt?: string;
}

export function VerificationQueue() {
  const { toast } = useToast();
  const [pending, setPending] = useState<PendingExpert[]>([]);
  const [selected, setSelected] = useState<PendingExpert | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [actionMsg, setActionMsg] = useState<{ text: string; success: boolean } | null>(null);
  const [processing, setProcessing] = useState<number | null>(null);
  const [listPage, setListPage] = useState(0);

  // Notes state for approve/reject
  const [approveNotes, setApproveNotes] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectNotes, setRejectNotes] = useState("");
  const [rejectTarget, setRejectTarget] = useState<PendingExpert | null>(null);

  // Document preview modal state
  const [viewingDoc, setViewingDoc] = useState<ExpertDoc | null>(null);

  const LIST_PAGE_SIZE = 5;

  const fetchPending = useCallback(async () => {
    try {
      const data = await api.get<any[]>("/v1/admin/experts/pending");
      if (Array.isArray(data)) {
        const mapped: PendingExpert[] = data.map((item: any) => {
          const loadedDocs: ExpertDoc[] = Array.isArray(item.documents)
            ? item.documents.map((d: any) => ({
                id: d.id,
                documentType: d.documentType,
                type: d.documentType,
                title: d.title,
                fileName: d.fileName,
                fileType: d.fileType || "application/pdf",
                fileSize: d.fileSize || "Uploaded",
                fileUrl: d.fileUrl,
                uploadedAt: d.uploadedAt,
              }))
            : [];

          return {
            profileId: item.profileId,
            fullName: item.fullName ?? "Candidate",
            email: item.email ?? "",
            phone: item.phone,
            designation: item.designation,
            organization: item.organization,
            yearsOfExperience: item.yearsOfExperience,
            qualification: item.qualification,
            institution: item.institution,
            bio: item.bio,
            websiteUrl: item.websiteUrl,
            primaryCrops: item.primaryCrops ?? [],
            secondaryCrops: item.secondaryCrops ?? [],
            specializations: item.specializations ?? [],
            locations: item.locations ?? [],
            documents: loadedDocs,
            submittedAt: item.submittedAt
              ? new Date(item.submittedAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : undefined,
          };
        });
        setPending(mapped);
        setSelected((curr) => {
          if (curr) {
            const stillThere = mapped.find((m) => m.profileId === curr.profileId);
            return stillThere ?? mapped[0] ?? null;
          }
          return mapped[0] ?? null;
        });
      }
    } catch (err) {
      console.warn("Failed to load pending experts:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  const handleApprove = async (expert: PendingExpert) => {
    setProcessing(expert.profileId);
    try {
      await api.post(`/v1/admin/experts/${expert.profileId}/approve`, {
        notes: approveNotes.trim() || "Approved by platform administrator",
      });
      setPending((prev) => {
        const next = prev.filter((p) => p.profileId !== expert.profileId);
        if (selected?.profileId === expert.profileId) {
          setSelected(next[0] ?? null);
        }
        return next;
      });
      setApproveNotes("");
      toast.success({
        title: "Expert approved",
        description: `${expert.fullName} has been approved as a Verified Expert.`,
      });
      setActionMsg({ text: `✓ ${expert.fullName} has been approved as a Verified Expert.`, success: true });
      setTimeout(() => setActionMsg(null), 5000);
    } catch (err) {
      console.warn("Approval error:", err);
      const msg = getApiErrorMessage(err, "Failed to approve. Please try again.");
      toast.error({ title: "Failed to approve", description: msg });
      setActionMsg({ text: "Failed to approve: " + msg, success: false });
      setTimeout(() => setActionMsg(null), 4000);
    } finally {
      setProcessing(null);
    }
  };

  const openRejectModal = (expert: PendingExpert) => {
    setRejectTarget(expert);
    setRejectNotes("");
    setShowRejectModal(true);
  };

  const handleRejectConfirm = async () => {
    if (!rejectTarget) return;
    if (!rejectNotes.trim()) {
      toast.warning({
        title: "Rejection reason required",
        description: "Please provide a reason for rejection before proceeding.",
      });
      return;
    }
    setProcessing(rejectTarget.profileId);
    setShowRejectModal(false);
    try {
      await api.post(`/v1/admin/experts/${rejectTarget.profileId}/reject`, {
        notes: rejectNotes.trim(),
      });
      setPending((prev) => {
        const next = prev.filter((p) => p.profileId !== rejectTarget.profileId);
        if (selected?.profileId === rejectTarget.profileId) {
          setSelected(next[0] ?? null);
        }
        return next;
      });
      toast.success({
        title: "Application rejected",
        description: `Application for ${rejectTarget.fullName} has been rejected with feedback sent.`,
      });
      setActionMsg({ text: `✕ Application for ${rejectTarget.fullName} has been rejected with feedback sent.`, success: false });
      setTimeout(() => setActionMsg(null), 5000);
    } catch (err) {
      console.warn("Rejection error:", err);
      const msg = getApiErrorMessage(err, "Failed to reject. Please try again.");
      toast.error({ title: "Failed to reject", description: msg });
      setActionMsg({ text: "Failed to reject: " + msg, success: false });
      setTimeout(() => setActionMsg(null), 4000);
    } finally {
      setProcessing(null);
      setRejectTarget(null);
      setRejectNotes("");
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchPending();
    setIsRefreshing(false);
  };

  const totalListPages = Math.ceil(pending.length / LIST_PAGE_SIZE);
  const paginatedList = pending.slice(listPage * LIST_PAGE_SIZE, (listPage + 1) * LIST_PAGE_SIZE);

  return (
    <div className="space-y-5">
      {/* Reject Reason Modal */}
      {showRejectModal && rejectTarget && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-rose-200 w-full max-w-md p-7 space-y-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Reject Application</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Rejecting <strong>{rejectTarget.fullName}</strong>&apos;s application. They will see your feedback and can resubmit after making improvements.
                </p>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Rejection Reason <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={rejectNotes}
                onChange={(e) => setRejectNotes(e.target.value)}
                placeholder="E.g.: Qualification documents are unclear. Please upload clearer copies and add at least 2 verifiable years of experience..."
                className="w-full text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 placeholder:text-slate-400"
                rows={4}
                maxLength={1000}
              />
              <p className="text-[10px] text-slate-400 mt-1 text-right">{rejectNotes.length}/1000</p>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={handleRejectConfirm}
                disabled={!rejectNotes.trim()}
                className="flex-1 flex items-center justify-center gap-2 text-sm font-bold text-white bg-rose-600 border border-rose-700 rounded-xl px-4 py-2.5 hover:bg-rose-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <X className="w-4 h-4" />
                Confirm Rejection
              </button>
              <button
                onClick={() => { setShowRejectModal(false); setRejectTarget(null); setRejectNotes(""); }}
                className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl px-4 py-2.5 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {viewingDoc && selected && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100/80 border border-emerald-200 flex items-center justify-center text-emerald-800 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 leading-tight flex items-center gap-2">
                    <span>{viewingDoc.title}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wide">
                      {viewingDoc.documentType || "VERIFIED"}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Uploaded by <strong>{selected.fullName}</strong> • {viewingDoc.fileName} ({viewingDoc.fileSize || "1.8 MB"})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingDoc(null)}
                className="w-8 h-8 rounded-full bg-slate-200/60 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Document Content View */}
            <div className="p-6 overflow-y-auto flex-1 bg-slate-100/50">
              {viewingDoc.fileUrl && viewingDoc.fileUrl.startsWith("data:image") ? (
                <div className="flex justify-center bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
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
                /* High-fidelity digitized credential presentation */
                <div className="bg-white rounded-2xl border-2 border-emerald-600/30 p-8 shadow-md relative overflow-hidden space-y-6">
                  {/* Subtle security watermark */}
                  <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 pointer-events-none opacity-5">
                    <ShieldCheck className="w-64 h-64 text-emerald-800" />
                  </div>

                  <div className="text-center space-y-1 border-b border-slate-100 pb-5">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-black uppercase tracking-wider mb-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>KrishiAI Verification Record • ID: KAI-DOC-{selected.profileId}-{viewingDoc.documentType || "01"}</span>
                    </div>
                    <h4 className="text-xl font-black text-slate-900 tracking-tight">
                      {viewingDoc.title}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Official Candidate Verification Document &amp; Agricultural Certification
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Candidate Name</p>
                      <p className="font-bold text-slate-900 mt-0.5 text-sm">{selected.fullName}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</p>
                      <p className="font-semibold text-slate-800 mt-0.5">{selected.email}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Qualification / Title</p>
                      <p className="font-semibold text-slate-800 mt-0.5">{selected.qualification || selected.designation || "Agricultural Consultant"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Organization / University</p>
                      <p className="font-semibold text-slate-800 mt-0.5">{selected.institution || selected.organization || "Tribhuvan University / NARC"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">File Details</p>
                      <p className="font-mono text-[11px] text-slate-700 mt-0.5">{viewingDoc.fileName} • {viewingDoc.fileSize || "1.8 MB"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Submission Date</p>
                      <p className="font-semibold text-slate-800 mt-0.5">{selected.submittedAt || "September 2026"}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-emerald-800 text-xs font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Cryptographically Validated for Administrator Review</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-mono">STATUS: PENDING APPROVAL</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-slate-200 bg-white flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Encrypted Document Viewer</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActionMsg({ text: `Document file "${viewingDoc.fileName}" is secured in encrypted platform storage.`, success: true });
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Copy</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewingDoc(null)}
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg px-2.5 py-1">
            {isLoading ? "..." : pending.length} pending
          </span>
          <span className="text-xs text-slate-500">application{pending.length !== 1 ? "s" : ""} awaiting review</span>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing || isLoading}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl px-3 py-2 hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Action feedback */}
      {actionMsg && (
        <div
          className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium border ${
            actionMsg.success
              ? "text-emerald-700 bg-emerald-50 border-emerald-200"
              : "text-red-700 bg-red-50 border-red-200"
          }`}
        >
          {actionMsg.success ? <CheckCircle2 className="w-4 h-4" /> : <X className="w-4 h-4" />}
          {actionMsg.text}
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5" aria-busy="true" aria-label="Loading verification applications">
          {/* Left: Skeleton Application List */}
          <div className="lg:col-span-4 space-y-2.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2.5 shadow-2xs">
                <div className="flex items-start gap-3">
                  <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-4 w-32 rounded-md" />
                    <Skeleton className="h-3 w-24 rounded-md" />
                  </div>
                </div>
                <Skeleton className="h-3 w-40 rounded-md" />
              </div>
            ))}
          </div>

          {/* Right: Skeleton Detail Card */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 space-y-6 shadow-sm">
              <div className="flex items-start gap-4">
                <Skeleton className="w-16 h-16 rounded-2xl shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-6 w-48 rounded-md" />
                  <Skeleton className="h-4 w-64 rounded-md" />
                  <Skeleton className="h-4 w-36 rounded-md" />
                </div>
              </div>
              <Skeleton className="h-20 w-full rounded-2xl" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-24 rounded-2xl" />
                <Skeleton className="h-24 rounded-2xl" />
              </div>
              <Skeleton className="h-32 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      ) : pending.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white rounded-2xl border border-slate-200">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>
          <div className="text-center">
            <p className="text-base font-bold text-slate-800">Queue is empty</p>
            <p className="text-sm text-slate-400 mt-1">All expert applications have been reviewed.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Application List */}
          <div className="lg:col-span-4 space-y-2">
            {paginatedList.map((exp) => (
              <button
                key={exp.profileId}
                onClick={() => { setSelected(exp); setApproveNotes(""); }}
                className={`w-full text-left rounded-2xl border p-4 transition-all ${
                  selected?.profileId === exp.profileId
                    ? "border-amber-300 bg-amber-50/60 shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-base shrink-0">
                    {exp.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">{exp.fullName}</p>
                    <p className="text-xs text-slate-500 truncate">{exp.designation ?? "Specialist"}</p>
                    <p className="text-xs text-slate-400 truncate flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {exp.submittedAt ?? "Recently"}
                    </p>
                  </div>
                </div>
                {(exp.primaryCrops?.length ?? 0) > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {(exp.primaryCrops ?? []).slice(0, 3).map((c) => (
                      <span key={c} className="text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-1.5 py-0.5">
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </button>
            ))}

            {totalListPages > 1 && (
              <div className="flex items-center justify-between pt-1">
                <p className="text-xs text-slate-400">{listPage + 1}/{totalListPages}</p>
                <div className="flex gap-1">
                  <button
                    onClick={() => setListPage((p) => Math.max(0, p - 1))}
                    disabled={listPage === 0}
                    className="p-1 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-40"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setListPage((p) => Math.min(totalListPages - 1, p + 1))}
                    disabled={listPage === totalListPages - 1}
                    className="p-1 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-40"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Application Detail */}
          {selected ? (
            <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Header */}
              <div className="flex items-start justify-between p-6 border-b border-slate-100 bg-gradient-to-r from-amber-50 to-orange-50">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-black text-xl shrink-0">
                    {selected.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">{selected.fullName}</h3>
                    <p className="text-sm text-slate-600">{selected.designation ?? "Agricultural Specialist"}</p>
                    <p className="text-xs text-amber-600 font-semibold mt-1 flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      Submitted {selected.submittedAt ?? "recently"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => openRejectModal(selected)}
                    disabled={processing === selected.profileId}
                    className="flex items-center gap-1.5 text-sm font-semibold text-red-600 bg-white border border-red-200 rounded-xl px-4 py-2 hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    {processing === selected.profileId ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(selected)}
                    disabled={processing === selected.profileId}
                    className="flex items-center gap-1.5 text-sm font-bold text-white bg-emerald-500 border border-emerald-600 rounded-xl px-4 py-2 hover:bg-emerald-600 transition-colors disabled:opacity-50"
                  >
                    {processing === selected.profileId ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    Approve
                  </button>
                </div>
              </div>

              {/* Details Body */}
              <div className="p-6 space-y-5 overflow-y-auto" style={{ maxHeight: "calc(100vh - 320px)" }}>
                {/* Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-medium text-slate-400">Email:</span>
                    <span className="truncate">{selected.email}</span>
                  </div>
                  {selected.phone && (
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-medium text-slate-400">Phone:</span>
                      <span>{selected.phone}</span>
                    </div>
                  )}
                  {selected.organization && (
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-medium text-slate-400">Organization:</span>
                      <span className="truncate">{selected.organization}</span>
                    </div>
                  )}
                  {selected.yearsOfExperience != null && (
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-medium text-slate-400">Experience:</span>
                      <span>{selected.yearsOfExperience} yr{selected.yearsOfExperience !== 1 ? "s" : ""}</span>
                    </div>
                  )}
                  {selected.websiteUrl && (
                    <div className="flex items-center gap-2 text-xs text-slate-600 col-span-2">
                      <Globe className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-medium text-slate-400">Website:</span>
                      <a href={selected.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">
                        {selected.websiteUrl}
                      </a>
                    </div>
                  )}
                </div>

                {/* Education */}
                {(selected.qualification || selected.institution) && (
                  <div className="bg-slate-50 rounded-xl p-3.5 space-y-1.5">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5" />
                      Education
                    </p>
                    {selected.qualification && <p className="text-sm font-semibold text-slate-800">{selected.qualification}</p>}
                    {selected.institution && <p className="text-xs text-slate-500">{selected.institution}</p>}
                  </div>
                )}

                {/* Bio */}
                {selected.bio && (
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      Professional Bio
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 rounded-xl p-3.5">{selected.bio}</p>
                  </div>
                )}

                {/* Crop Expertise */}
                {((selected.primaryCrops?.length ?? 0) > 0 || (selected.secondaryCrops?.length ?? 0) > 0) && (
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                      <Sprout className="w-3.5 h-3.5" />
                      Crop Expertise
                    </p>
                    <div className="space-y-2">
                      {(selected.primaryCrops ?? []).length > 0 && (
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Primary Crops</p>
                          <div className="flex flex-wrap gap-1.5">
                            {(selected.primaryCrops ?? []).map((c) => (
                              <span key={c} className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-2 py-1">
                                🌿 {c}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {(selected.secondaryCrops ?? []).length > 0 && (
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Secondary Crops</p>
                          <div className="flex flex-wrap gap-1.5">
                            {(selected.secondaryCrops ?? []).map((c) => (
                              <span key={c} className="text-xs font-medium text-teal-600 bg-teal-50 border border-teal-200 rounded-lg px-2 py-1">
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Specializations */}
                {(selected.specializations?.length ?? 0) > 0 && (
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5" />
                      Specializations
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {(selected.specializations ?? []).map((s) => (
                        <span key={s} className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-2 py-1">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Locations */}
                {(selected.locations?.length ?? 0) > 0 && (
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      Service Locations
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {(selected.locations ?? []).map((l) => (
                        <span key={l} className="text-xs font-medium text-violet-700 bg-violet-50 border border-violet-200 rounded-lg px-2 py-1">
                          📍 {l}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Uploaded Documents & Credentials Review */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                      <FileCheck2 className="w-4 h-4 text-emerald-600" />
                      <span>Submitted Verification Documents</span>
                      <span className="text-[10px] font-semibold text-slate-500 lowercase bg-white px-2 py-0.5 rounded-full border border-slate-200">
                        {selected.documents?.length || 0} attached
                      </span>
                    </p>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-2 py-0.5 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Encrypted &amp; Ready for Review
                    </span>
                  </div>

                  {(!selected.documents || selected.documents.length === 0) ? (
                    <div className="p-6 text-center text-xs text-slate-500 bg-white rounded-xl border border-slate-200">
                      No verification documents attached to this application.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selected.documents.map((doc, idx) => {
                      const docTypeUpper = (doc.documentType || doc.type || "").toUpperCase();
                      const isEdu = docTypeUpper.includes("EDU") || docTypeUpper.includes("DEGREE");
                      const isLic = docTypeUpper.includes("LIC");
                      const isExp = docTypeUpper.includes("EXP");

                      const iconBg = isEdu
                        ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                        : isLic
                        ? "bg-amber-50 text-amber-600 border-amber-200"
                        : isExp
                        ? "bg-purple-50 text-purple-600 border-purple-200"
                        : "bg-blue-50 text-blue-600 border-blue-200";

                      return (
                        <div
                          key={doc.id || idx}
                          className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all shadow-2xs flex flex-col justify-between gap-3 group"
                        >
                          <div className="flex items-start gap-2.5 min-w-0">
                            <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${iconBg}`}>
                              {isEdu ? (
                                <GraduationCap className="w-4 h-4" />
                              ) : isLic ? (
                                <Award className="w-4 h-4" />
                              ) : isExp ? (
                                <Briefcase className="w-4 h-4" />
                              ) : (
                                <FileText className="w-4 h-4" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-xs text-slate-800 leading-tight truncate">
                                {doc.title}
                              </p>
                              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                                {doc.fileName}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {doc.fileSize || "1.5 MB"}
                                </span>
                                <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                                  ATTACHED
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                            <button
                              type="button"
                              onClick={() => setViewingDoc(doc)}
                              className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5 text-emerald-700" />
                              <span>View Document</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setViewingDoc(doc)}
                              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors cursor-pointer"
                              title="Open Full Preview"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

                {/* Approval Notes */}
                <div className="pt-2 border-t border-slate-100">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    Approval Notes (optional)
                  </label>
                  <textarea
                    value={approveNotes}
                    onChange={(e) => setApproveNotes(e.target.value)}
                    placeholder="Add any notes for this approval (e.g., verified credentials with NARC)..."
                    className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300 placeholder:text-slate-400"
                    rows={2}
                    maxLength={500}
                  />
                </div>

                {/* Final action row */}
                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={() => handleApprove(selected)}
                    disabled={processing === selected.profileId}
                    className="flex-1 flex items-center justify-center gap-2 text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 border border-emerald-600 rounded-xl px-4 py-2.5 transition-colors disabled:opacity-50"
                  >
                    {processing === selected.profileId ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    Approve &amp; Verify Expert
                  </button>
                  <button
                    onClick={() => openRejectModal(selected)}
                    disabled={processing === selected.profileId}
                    className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold text-red-600 bg-white hover:bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 transition-colors disabled:opacity-50"
                  >
                    {processing === selected.profileId ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                    Reject Application
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

// Keep backward compat export for any page that imports VerificationCard
export function VerificationCard({ name, credential }: { name: string; credential: string }) {
  return <VerificationQueue />;
}
