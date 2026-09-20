"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  Award,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText,
  Layers,
  Info,
  Leaf,
  Loader2,
  Plus,
  RefreshCw,
  ShieldCheck,
  Trash2,
  Upload,
  X,
  XCircle,
} from "lucide-react";
import { ApiError, api, tokenStore } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/toast-utils";
import { useToast } from "@/providers/toast-provider";
import { CropAvatar } from "@/components/ui/crop-avatar";

/* types */
interface Crop { id: number; name: string; emoji?: string; imageUrl?: string; categoryName?: string; }
interface MediaUploadResponse {
  secureUrl: string;
  fileName?: string;
  format?: string;
  bytes?: number;
}

interface ExpertiseClaim {
  id: number; cropId?: number; cropName?: string; cropEmoji?: string; cropImageUrl?: string;
  categoryName?: string; expertiseArea?: string;
  expertiseType: "PRIMARY" | "SECONDARY" | "AREA";
  expertiseLevel?: string; yearsOfExperience?: number; description?: string;
  verificationStatus: "SELF_DECLARED" | "EVIDENCE_SUBMITTED" | "VERIFIED" | "REJECTED" | "PENDING";
  evidenceDocumentTitle?: string; evidenceDocumentFileName?: string;
  verifiedAt?: string; rejectionReason?: string; createdAt?: string;
}
interface ExpertProfile {
  verifiedExpert: boolean; verificationStatus?: string; applicationStatus?: string;
  crops: ExpertiseClaim[];
  specializations: { id: number; name: string; code: string }[];
}

const EXPERTISE_AREAS = [
  "Soil Health & Fertility Management","Integrated Pest Management (IPM)","Irrigation & Water Management",
  "Post-Harvest & Storage","Organic & Sustainable Farming","Greenhouse & Controlled Environment",
  "Seed Selection & Agronomy","Farm Business & Market Linkage","Climate-Smart Agriculture","Animal-Plant Integrated Systems",
];
const EXPERTISE_LEVELS = [
  { value: "BEGINNER", label: "Beginner" },{ value: "INTERMEDIATE", label: "Intermediate" },
  { value: "ADVANCED", label: "Advanced" },{ value: "SPECIALIST", label: "Specialist" },
];
const SOURCE_TYPES = [
  { value: "SELF_DECLARED", label: "Self-declared experience" },{ value: "QUALIFICATION", label: "Academic qualification" },
  { value: "CERTIFICATE", label: "Professional certificate" },{ value: "EXPERIENCE", label: "Field experience" },
  { value: "ORGANIZATION", label: "Organization affiliation" },{ value: "LICENSE", label: "Government license" },
];

async function uploadEvidenceFile(file: File, title: string): Promise<number> {
  const token = tokenStore.get();
  if (!token) {
    throw new ApiError(401, "Your session has expired. Please log in again.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", "EXPERT_DOCUMENTS");
  formData.append("resourceType", "document");

  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";
  const uploadResponse = await fetch(`${baseUrl}/v1/media/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const uploadBody = await uploadResponse.json().catch(() => null) as { message?: string; data?: MediaUploadResponse } | null;

  if (!uploadResponse.ok || !uploadBody?.data?.secureUrl) {
    throw new ApiError(uploadResponse.status, uploadBody?.message ?? "Failed to upload evidence file.");
  }

  const document = await api.post<{ id: number }>("/v1/expert/profile/documents", {
    documentType: "EXPERTISE_EVIDENCE",
    title,
    fileName: file.name,
    fileType: file.type || "application/octet-stream",
    fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
    fileUrl: uploadBody.data.secureUrl,
  });

  return document.id;
}

function statusBadge(status: ExpertiseClaim["verificationStatus"]) {
  switch (status) {
    case "VERIFIED": return { label: "\u2713 Verified", cls: "border-[#A5D6A7] bg-[#E8F5E9] text-[#2E7D32]" };
    case "EVIDENCE_SUBMITTED": return { label: "Evidence Submitted", cls: "border-[#FCD34D] bg-[#FEF3C7] text-[#F59E0B]" };
    case "REJECTED": return { label: "\u2715 Rejected", cls: "border-[#FCA5A5] bg-[#FEE2E2] text-[#DC2626]" };
    default: return { label: "Self-declared", cls: "border-[#E5E7EB] bg-[#F1F5F2] text-[#6B7280]" };
  }
}

function ClaimCard({ claim, onRemove, removing }: { claim: ExpertiseClaim; onRemove: () => void; removing: boolean; }) {
  const [expanded, setExpanded] = useState(false);
  const badge = statusBadge(claim.verificationStatus);
  const displayName = claim.cropName ?? claim.expertiseArea ?? "Domain";
  const ClaimIcon = claim.expertiseType === "AREA" ? Award : Leaf;
  return (
    <div className={`rounded-xl border bg-white shadow-xs transition-all ${expanded ? "border-[#A5D6A7]" : "border-[#E5E7EB]"}`}>
      <button type="button" onClick={() => setExpanded((p) => !p)} className="flex w-full items-center justify-between gap-3 p-4 text-left">
        <div className="min-w-0 flex flex-1 items-center gap-3">
          <CropAvatar
            name={claim.cropName ?? displayName}
            imageUrl={claim.cropImageUrl}
            emoji={claim.cropEmoji}
            isArea={claim.expertiseType === "AREA"}
            size="md"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[#1F2937]">{displayName}</p>
            <p className="mt-0.5 truncate text-xs text-[#6B7280]">
              {claim.categoryName ?? claim.expertiseType}{claim.expertiseLevel ? ` \u00b7 ${claim.expertiseLevel.toLowerCase()}` : ""}{claim.yearsOfExperience ? ` \u00b7 ${claim.yearsOfExperience} yrs` : ""}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold ${badge.cls}`}>{badge.label}</span>
          {expanded ? <ChevronUp className="h-4 w-4 text-[#9CA3AF]" /> : <ChevronDown className="h-4 w-4 text-[#9CA3AF]" />}
        </div>
      </button>
      {expanded && (
        <div className="border-t border-[#EEF0EE] px-4 pb-4 pt-3 space-y-3">
          {claim.verificationStatus === "REJECTED" && claim.rejectionReason && (
            <div className="flex gap-2 rounded-lg border border-[#FCA5A5] bg-[#FEE2E2] p-3 text-xs text-[#DC2626]">
              <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#DC2626]" />
              <span><strong>Rejection reason:</strong> {claim.rejectionReason}</span>
            </div>
          )}
          {claim.verificationStatus === "VERIFIED" && claim.verifiedAt && (
            <div className="flex gap-2 rounded-lg border border-[#A5D6A7] bg-[#E8F5E9] p-3 text-xs text-[#1B5E20]">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2E7D32]" />
              <span>Verified on {new Date(claim.verifiedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
            </div>
          )}
          {claim.description && (
            <p className="text-xs text-[#4B5563] leading-relaxed bg-[#F8FAF8] p-3 rounded-lg border border-[#EEF0EE]">{claim.description}</p>
          )}
          {claim.evidenceDocumentFileName && (
            <div className="flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white p-2.5 text-xs">
              <FileText className="h-3.5 w-3.5 text-[#2E7D32] shrink-0" />
              <span className="truncate text-[#4B5563] font-medium">{claim.evidenceDocumentTitle ?? claim.evidenceDocumentFileName}</span>
              <span className="ml-auto shrink-0 rounded-md border border-[#FCD34D] bg-[#FEF3C7] px-1.5 py-0.5 text-[10px] font-semibold text-[#F59E0B]">Evidence</span>
            </div>
          )}
          <button type="button" onClick={onRemove} disabled={removing} className="inline-flex items-center gap-1.5 rounded-lg border border-[#FCA5A5] bg-[#FEE2E2] px-3 py-1.5 text-xs font-semibold text-[#DC2626] hover:bg-[#FEE2E2] disabled:opacity-50 transition-colors">
            {removing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
            Remove
          </button>
        </div>
      )}
    </div>
  );
}

function AddExpertiseModal({ crops, existingClaims, primaryCount, onClose, onSaved }: {
  crops: Crop[]; existingClaims: ExpertiseClaim[]; primaryCount: number; onClose: () => void; onSaved: () => void;
}) {
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<"crop" | "area">("crop");
  const [cropId, setCropId] = useState("");
  const [expertiseType, setExpertiseType] = useState<"PRIMARY" | "SECONDARY">("PRIMARY");
  const [areaName, setAreaName] = useState("");
  const [level, setLevel] = useState("");
  const [years, setYears] = useState("");
  const [description, setDescription] = useState("");
  const [sourceType, setSourceType] = useState("SELF_DECLARED");
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const availableCrops = crops.filter((c) => !existingClaims.some((ex) => ex.cropId === c.id));

  const handleSubmit = async () => {
    if (tab === "crop" && !cropId) { toast.warning({ title: "Select a crop" }); return; }
    if (tab === "area" && !areaName) { toast.warning({ title: "Select a domain area" }); return; }
    if (tab === "crop" && expertiseType === "PRIMARY" && primaryCount >= 3) {
      toast.warning({ title: "Primary limit reached", description: "Max 3 primary crops. Choose Secondary." }); return;
    }
    setIsSaving(true);
    try {
      let evidenceDocumentId: number | undefined;
      if (evidenceFile) {
        evidenceDocumentId = await uploadEvidenceFile(
          evidenceFile,
          `Evidence: ${tab === "crop" ? availableCrops.find(c => c.id === Number(cropId))?.name ?? "Crop" : areaName}`
        );
      }
      const payload: Record<string, unknown> = {
        expertiseType: tab === "area" ? "AREA" : expertiseType,
        expertiseLevel: level || undefined, yearsOfExperience: years ? Number(years) : undefined,
        description: description.trim() || undefined, sourceType, evidenceDocumentId,
      };
      if (tab === "crop") payload.cropId = Number(cropId); else payload.expertiseArea = areaName;
      await api.post("/v1/expert/profile/crops", payload);
      toast.success({ title: "Expertise added" });
      onSaved(); onClose();
    } catch (err: unknown) {
      toast.error({ title: "Could not save", description: getApiErrorMessage(err, "Please try again.") });
    } finally { setIsSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-150">
      <div className="w-full sm:max-w-lg bg-white sm:rounded-xl rounded-t-xl border border-[#E5E7EB] shadow-xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#EEF0EE]">
          <div><h3 className="text-base font-bold text-[#1F2937]">Add Expertise Claim</h3><p className="text-xs text-[#6B7280] mt-0.5">Your professional verification status is not affected.</p></div>
          <button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F1F5F2]"><X className="h-4 w-4" /></button>
        </div>
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
          <div className="flex gap-1 rounded-lg bg-[#F1F5F2] p-1">
            {(["crop", "area"] as const).map((t) => (
              <button key={t} type="button" onClick={() => setTab(t)} className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition-colors ${tab === t ? "bg-white text-[#1F2937] shadow-xs" : "text-[#6B7280] hover:text-[#4B5563]"}`}>
                {t === "crop" ? "Crop Expertise" : "Domain Area"}
              </button>
            ))}
          </div>
          {tab === "crop" ? (
            <>
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#4B5563]">Crop *</label>
                <select value={cropId} onChange={(e) => setCropId(e.target.value)} className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 text-xs text-[#4B5563] outline-none focus:border-[#2E7D32]">
                  <option value="">Choose a crop...</option>
                  {availableCrops.map((c) => <option key={c.id} value={c.id}>{c.name}{c.categoryName ? ` (${c.categoryName})` : ""}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#4B5563]">Type</label>
                <div className="flex gap-2">
                  {(["PRIMARY", "SECONDARY"] as const).map((t) => (
                    <button key={t} type="button" onClick={() => setExpertiseType(t)} className={`flex-1 rounded-lg border py-2 text-xs font-semibold transition-colors ${expertiseType === t ? "border-[#2E7D32] bg-[#E8F5E9] text-[#2E7D32]" : "border-[#E5E7EB] bg-white text-[#4B5563] hover:bg-[#F8FAF8]"}`}>
                      {t === "PRIMARY" ? "Primary" : "Secondary"}
                    </button>
                  ))}
                </div>
                {expertiseType === "PRIMARY" && <p className="mt-1 text-[11px] text-[#6B7280]">{primaryCount}/3 used.{primaryCount >= 3 && <span className="text-[#F59E0B] font-semibold ml-1">Limit reached.</span>}</p>}
              </div>
            </>
          ) : (
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#4B5563]">Domain *</label>
              <select value={areaName} onChange={(e) => setAreaName(e.target.value)} className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 text-xs text-[#4B5563] outline-none focus:border-[#2E7D32]">
                <option value="">Choose a domain...</option>
                {EXPERTISE_AREAS.filter((a) => !existingClaims.some((ex) => ex.expertiseArea === a)).map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#4B5563]">Level</label>
              <select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-xs text-[#4B5563] outline-none focus:border-[#2E7D32]">
                <option value="">Not specified</option>
                {EXPERTISE_LEVELS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#4B5563]">Years Exp.</label>
              <input type="number" min="0" max="50" value={years} onChange={(e) => setYears(e.target.value)} placeholder="e.g. 5" className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-xs text-[#4B5563] outline-none focus:border-[#2E7D32]" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-[#4B5563]">Source / Basis</label>
            <select value={sourceType} onChange={(e) => setSourceType(e.target.value)} className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-xs text-[#4B5563] outline-none focus:border-[#2E7D32]">
              {SOURCE_TYPES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-[#4B5563]">Brief Description (optional)</label>
            <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your experience..." className="w-full resize-none rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-xs text-[#4B5563] outline-none focus:border-[#2E7D32] placeholder:text-[#9CA3AF]" />
          </div>
          <div className="rounded-xl border border-dashed border-[#E5E7EB] bg-[#F8FAF8] p-3">
            <p className="text-xs font-semibold text-[#4B5563] mb-1">Supporting Evidence (optional)</p>
            <p className="text-[11px] text-[#6B7280] mb-3">Upload a certificate, degree, or letter to boost your claim status to Evidence Submitted.</p>
            <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setEvidenceFile(e.target.files?.[0] ?? null)} className="hidden" id="expertise-evidence-upload" />
            {evidenceFile ? (
              <div className="flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-xs">
                <FileText className="h-3.5 w-3.5 text-[#2E7D32] shrink-0" />
                <span className="truncate flex-1 text-[#4B5563]">{evidenceFile.name}</span>
                <button type="button" onClick={() => setEvidenceFile(null)} className="text-[#9CA3AF] hover:text-[#DC2626]"><X className="h-3.5 w-3.5" /></button>
              </div>
            ) : (
              <button type="button" onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-xs font-semibold text-[#4B5563] hover:border-[#C8E6C9] hover:text-[#2E7D32] transition-colors">
                <Upload className="h-3.5 w-3.5" />Choose File
              </button>
            )}
          </div>
        </div>
        <div className="flex gap-2 border-t border-[#EEF0EE] px-5 py-4">
          <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-[#E5E7EB] py-2.5 text-xs font-semibold text-[#4B5563] hover:bg-[#F8FAF8] transition-colors">Cancel</button>
          <button type="button" onClick={handleSubmit} disabled={isSaving} className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#2E7D32] py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#1B5E20] disabled:opacity-50 transition-colors">
            {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
            {isSaving ? "Saving..." : "Add Expertise"}
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptySection({ message, onAdd }: { message: string; onAdd: () => void }) {
  return (
    <div className="rounded-xl border border-dashed border-[#E5E7EB] bg-[#F8FAF8] p-6 text-center">
      <p className="text-xs text-[#6B7280]">{message}</p>
      <button type="button" onClick={onAdd} className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-[#A5D6A7] bg-[#E8F5E9] px-3 py-1.5 text-xs font-semibold text-[#2E7D32] hover:bg-[#E8F5E9] transition-colors">
        <Plus className="h-3.5 w-3.5" />Add one
      </button>
    </div>
  );
}

export default function ExpertExpertisePage() {
  const { toast } = useToast();
  const [profile, setProfile] = useState<ExpertProfile | null>(null);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removing, setRemoving] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    try {
      const [profileRes, cropsRes] = await Promise.all([
        api.get<ExpertProfile>("/v1/expert/profile"),
        api.get<Crop[] | { content?: Crop[] }>("/v1/crops?size=200"),
      ]);
      setProfile(profileRes);
      setCrops(Array.isArray(cropsRes) ? cropsRes : (cropsRes.content ?? []));
    } catch (err: unknown) {
      const message = getApiErrorMessage(err, "Unable to load your expertise.");
      setError(message);
      toast.error({ title: "Load failed", description: message });
    } finally { setIsLoading(false); }
  }, [toast]);

  useEffect(() => { const t = window.setTimeout(() => void load(), 0); return () => window.clearTimeout(t); }, [load]);

  const handleRemove = async (id: number, cropId?: number) => {
    setRemoving(id);
    try {
      try { await api.delete(`/v1/expert/profile/expertises/${id}`); }
      catch { if (cropId) await api.delete(`/v1/expert/profile/crops/${cropId}`); else throw new Error("No endpoint"); }
      toast.success({ title: "Removed" });
      await load();
    } catch (err: unknown) {
      toast.error({ title: "Could not remove", description: getApiErrorMessage(err, "Please try again.") });
    } finally { setRemoving(null); }
  };

  const claims = useMemo(() => profile?.crops ?? [], [profile?.crops]);
  const primaryCrops = useMemo(() => claims.filter((c) => c.expertiseType === "PRIMARY"), [claims]);
  const secondaryCrops = useMemo(() => claims.filter((c) => c.expertiseType === "SECONDARY"), [claims]);
  const areaClaims = useMemo(() => claims.filter((c) => c.expertiseType === "AREA"), [claims]);
  const pendingEvidence = useMemo(() => claims.filter((c) => c.verificationStatus === "EVIDENCE_SUBMITTED"), [claims]);
  const professionalStatus = profile?.verifiedExpert ? "VERIFIED" : (profile?.applicationStatus ?? profile?.verificationStatus ?? "UNVERIFIED");

  if (isLoading) return <div className="flex min-h-64 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-[#2E7D32]" /></div>;
  if (error || !profile) return (
    <div className="rounded-xl border border-[#FCA5A5] bg-[#FEE2E2] p-8 text-center space-y-3">
      <AlertCircle className="mx-auto h-8 w-8 text-[#DC2626]" />
      <p className="text-sm font-bold text-[#DC2626]">{error ?? "Expertise is unavailable."}</p>
      <button type="button" onClick={() => { setIsLoading(true); void load(); }} className="inline-flex items-center gap-2 rounded-xl bg-[#B91C1C] px-4 py-2 text-xs font-bold text-white"><RefreshCw className="h-3.5 w-3.5" />Try again</button>
    </div>
  );

  return (
    <>
      {showAddModal && (
        <AddExpertiseModal crops={crops} existingClaims={claims} primaryCount={primaryCrops.length}
          onClose={() => setShowAddModal(false)} onSaved={() => { setIsLoading(true); void load(); }} />
      )}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#1F2937] flex items-center gap-2">
              <span>My</span>
              <span className="text-[#2E7D32]">Expertise</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
              Manage crop expertise and domain specializations. Adding expertise never changes your professional verification status.
            </p>
          </div>
          <div className="flex items-center gap-2.5 flex-wrap w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-2 bg-[#2E7D32] hover:bg-[#256B2A] text-white rounded-full px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-bold shadow-[0_4px_20px_-2px_#EEF0EE] transition-all active:scale-95 flex-1 sm:flex-initial min-h-[40px]"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Expertise</span>
            </button>
          </div>
        </div>

        {/* Professional Verification Status - read-only */}
        <section className={`rounded-xl border p-4 flex items-start gap-3.5 shadow-xs ${professionalStatus === "VERIFIED" ? "border-[#A5D6A7] bg-[#E8F5E9]" : professionalStatus === "REJECTED" ? "border-[#FCA5A5] bg-[#FEE2E2]" : "border-[#E5E7EB] bg-white"}`}>
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border shadow-2xs ${professionalStatus === "VERIFIED" ? "border-[#A5D6A7] bg-white" : "border-[#E5E7EB] bg-[#F8FAF8]"}`}>
            {professionalStatus === "VERIFIED" ? <ShieldCheck className="h-5 w-5 text-[#2E7D32]" /> : <Info className="h-5 w-5 text-[#9CA3AF]" />}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold text-[#1F2937]">Professional Verification</span>
              <span className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold ${professionalStatus === "VERIFIED" ? "border-[#A5D6A7] bg-[#E8F5E9] text-[#2E7D32]" : professionalStatus === "REJECTED" ? "border-[#FCA5A5] bg-[#FEE2E2] text-[#DC2626]" : "border-[#E5E7EB] bg-[#F1F5F2] text-[#4B5563]"}`}>{professionalStatus.replaceAll("_", " ")}</span>
            </div>
            <p className="mt-0.5 text-xs text-[#4B5563]">{professionalStatus === "VERIFIED" ? "Your credentials are verified. Adding or editing expertise claims does not affect this status." : "Your professional application is under review. Expertise claims appear as self-declared until admin review."}</p>
          </div>
        </section>

        <div className="flex items-start gap-2.5 rounded-[24px] border border-[#93C5FD] bg-[#DBEAFE]/80 p-4 text-xs text-[#2563EB] shadow-[0_4px_20px_-2px_#EEF0EE]">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#2563EB]" />
          <p><strong>How it works:</strong> Claims start as <em>Self-declared</em>. Upload evidence to reach <em>Evidence Submitted</em>. Admins batch-review and grant <em>Verified</em> status. Only verified claims appear in farmer search with a checkmark.</p>
        </div>

        <section className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE]">
          <div className="flex items-center justify-between pb-3 border-b border-[#EEF0EE]">
            <div><h2 className="flex items-center gap-2 text-sm font-bold text-[#1F2937]"><Leaf className="h-4 w-4 text-[#2E7D32] shrink-0" />Primary Crops</h2><p className="mt-0.5 text-xs text-[#6B7280]">Up to 3 crops where you have deepest expertise.</p></div>
            <span className="rounded-full bg-[#F1F5F2] px-3 py-1 text-xs font-bold text-[#4B5563]">{primaryCrops.length} / 3</span>
          </div>
          <div className="mt-4 space-y-2.5">
            {primaryCrops.length === 0 ? <EmptySection message="No primary crops added yet." onAdd={() => setShowAddModal(true)} /> : primaryCrops.map((c) => <ClaimCard key={c.id} claim={c} onRemove={() => handleRemove(c.id, c.cropId)} removing={removing === c.id} />)}
          </div>
        </section>

        <section className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE]">
          <div className="flex items-center justify-between pb-3 border-b border-[#EEF0EE]">
            <div><h2 className="flex items-center gap-2 text-sm font-bold text-[#1F2937]"><Leaf className="h-4 w-4 text-[#9CA3AF] shrink-0" />Secondary Crops</h2><p className="mt-0.5 text-xs text-[#6B7280]">Additional crops you can advise on. No limit.</p></div>
            <span className="rounded-full bg-[#F1F5F2] px-3 py-1 text-xs font-bold text-[#4B5563]">{secondaryCrops.length}</span>
          </div>
          <div className="mt-4 space-y-2.5">
            {secondaryCrops.length === 0 ? <EmptySection message="No secondary crops added yet." onAdd={() => setShowAddModal(true)} /> : secondaryCrops.map((c) => <ClaimCard key={c.id} claim={c} onRemove={() => handleRemove(c.id, c.cropId)} removing={removing === c.id} />)}
          </div>
        </section>

        <section className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE]">
          <div className="flex items-center justify-between pb-3 border-b border-[#EEF0EE]">
            <div><h2 className="flex items-center gap-2 text-sm font-bold text-[#1F2937]"><Layers className="h-4 w-4 text-[#2E7D32] shrink-0" />Agricultural Domain Areas</h2><p className="mt-0.5 text-xs text-[#6B7280]">Functional domains from the agronomy catalog.</p></div>
            <span className="rounded-full bg-[#F1F5F2] px-3 py-1 text-xs font-bold text-[#4B5563]">{areaClaims.length}</span>
          </div>
          <div className="mt-4 space-y-2.5">
            {areaClaims.length === 0 ? <EmptySection message="No domain areas added yet." onAdd={() => setShowAddModal(true)} /> : areaClaims.map((c) => <ClaimCard key={c.id} claim={c} onRemove={() => handleRemove(c.id)} removing={removing === c.id} />)}
          </div>
        </section>

        {pendingEvidence.length > 0 && (
          <section className="rounded-xl border border-[#FCD34D] bg-[#FEF3C7]/60 p-5 shadow-xs">
            <h2 className="flex items-center gap-2 text-sm font-bold text-[#F59E0B] pb-3 border-b border-[#FCD34D]"><FileText className="h-4 w-4 shrink-0" />Awaiting Admin Review</h2>
            <p className="mt-2 text-xs text-[#F59E0B]">These claims have evidence attached and are in the admin review queue:</p>
            <div className="mt-3 space-y-2">
              {pendingEvidence.map((c) => {
                const name = c.cropName ?? c.expertiseArea ?? "Domain";
                return (
                  <div key={c.id} className="flex items-center gap-3 rounded-lg border border-[#FCD34D] bg-white p-3">
                    <CropAvatar name={name} imageUrl={c.cropImageUrl} emoji={c.cropEmoji} isArea={c.expertiseType === "AREA"} size="sm" />
                    <span className="flex-1 text-xs font-semibold text-[#1F2937]">{name}</span>
                    <span className="rounded-md border border-[#FCD34D] bg-[#FEF3C7] px-2 py-0.5 text-[10px] font-semibold text-[#F59E0B]">In Review</span>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
