"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Leaf, Loader2, Plus, RefreshCw, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/toast-utils";
import { useToast } from "@/providers/toast-provider";

interface Crop { id: number; name: string; emoji?: string; categoryName?: string; }
interface Specialization { id: number; name: string; code: string; }
interface ProfileCrop { id: number; cropId: number; cropName: string; cropEmoji?: string; categoryName?: string; expertiseType: "PRIMARY" | "SECONDARY"; verificationStatus: string; }
interface Profile { crops: ProfileCrop[]; specializations: Specialization[]; applicationStatus?: string; verifiedExpert: boolean; }

const statusClasses: Record<string, string> = { VERIFIED: "bg-emerald-50 text-emerald-700 border-emerald-200", REJECTED: "bg-rose-50 text-rose-700 border-rose-200", PENDING: "bg-amber-50 text-amber-700 border-amber-200" };

export default function ExpertExpertisePage() {
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [selectedCrop, setSelectedCrop] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [removing, setRemoving] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const [profileResponse, cropResponse, specializationResponse] = await Promise.all([
        api.get<Profile>("/v1/expert/profile"),
        api.get<Crop[] | { content?: Crop[] }>("/v1/crops?size=100"),
        api.get<Specialization[]>("/v1/specializations"),
      ]);
      setProfile(profileResponse);
      setCrops(Array.isArray(cropResponse) ? cropResponse : cropResponse.content ?? []);
      setSpecializations(specializationResponse);
    } catch (requestError) {
      const message = getApiErrorMessage(requestError, "Unable to load your expertise.");
      setError(message);
      toast.error({ title: "Unable to load expertise", description: message });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => { const timer = window.setTimeout(() => { void load(); }, 0); return () => window.clearTimeout(timer); }, [load]);

  const primaryCrops = useMemo(() => profile?.crops.filter((crop) => crop.expertiseType === "PRIMARY") ?? [], [profile]);
  const availableCrops = crops.filter((crop) => !profile?.crops.some((item) => item.cropId === crop.id));
  const availableSpecializations = specializations.filter((item) => !profile?.specializations.some((selected) => selected.id === item.id));

  const addCrop = async () => {
    const cropId = Number(selectedCrop);
    if (!cropId) return;
    if (primaryCrops.length >= 3) { toast.warning({ title: "Primary crop limit reached", description: "You can select up to 3 primary crops." }); return; }
    setIsSaving(true);
    try {
      await api.post("/v1/expert/profile/crops", { cropId, expertiseType: "PRIMARY" });
      toast.success({ title: "Expertise added", description: "Your crop expertise was saved for verification." });
      setSelectedCrop("");
      await load();
    } catch (requestError) { toast.error({ title: "Unable to add expertise", description: getApiErrorMessage(requestError, "Please try again.") }); }
    finally { setIsSaving(false); }
  };

  const addSpecialization = async () => {
    const id = Number(selectedSpecialization);
    if (!id) return;
    setIsSaving(true);
    try {
      await api.post(`/v1/expert/profile/specializations/${id}`, {});
      toast.success({ title: "Specialization added", description: "Your specialization was saved for verification." });
      setSelectedSpecialization("");
      await load();
    } catch (requestError) { toast.error({ title: "Unable to add specialization", description: getApiErrorMessage(requestError, "Please try again.") }); }
    finally { setIsSaving(false); }
  };

  const removeCrop = async (cropId: number) => {
    setRemoving(cropId);
    try { await api.delete(`/v1/expert/profile/crops/${cropId}`); toast.success({ title: "Expertise removed" }); await load(); }
    catch (requestError) { toast.error({ title: "Unable to remove expertise", description: getApiErrorMessage(requestError, "Please try again.") }); }
    finally { setRemoving(null); }
  };

  if (isLoading) return <div className="flex min-h-64 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-emerald-600" /></div>;
  if (error || !profile) return <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center"><AlertCircle className="mx-auto h-8 w-8 text-rose-600" /><p className="mt-3 text-sm font-semibold text-rose-900">{error ?? "Expertise is unavailable."}</p><button type="button" onClick={() => { setIsLoading(true); void load(); }} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-rose-700 px-3 py-2 text-xs font-bold text-white"><RefreshCw className="h-3.5 w-3.5" />Try again</button></div>;

  return <div className="space-y-6"><header><p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Professional profile</p><h1 className="mt-1 text-2xl font-bold text-slate-900">Expertise &amp; Specializations</h1><p className="mt-1 text-sm text-slate-500">Add only the areas you can support with professional experience. Verification is controlled by KrishiAI administration.</p></header><div className="flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900"><AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" /><p>Your account can save expertise while your professional verification is pending. Added expertise remains pending until an administrator reviews it.</p></div>
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="flex items-center justify-between"><div><h2 className="flex items-center gap-2 text-lg font-bold text-slate-900"><Leaf className="h-5 w-5 text-emerald-600" />Primary crops</h2><p className="mt-1 text-sm text-slate-500">Select up to 3 primary crops.</p></div><span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">{primaryCrops.length} / 3</span></div><div className="mt-5 flex flex-col gap-2 sm:flex-row"><select value={selectedCrop} onChange={(event) => setSelectedCrop(event.target.value)} className="h-10 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-emerald-400"><option value="">Select a crop from the backend catalog</option>{availableCrops.map((crop) => <option key={crop.id} value={crop.id}>{crop.emoji ? `${crop.emoji} ` : ""}{crop.name}</option>)}</select><button type="button" onClick={addCrop} disabled={!selectedCrop || isSaving || primaryCrops.length >= 3} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 text-sm font-bold text-white disabled:opacity-50"><Plus className="h-4 w-4" />Add crop</button></div><div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">{primaryCrops.length === 0 ? <p className="col-span-full rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-400">No crop expertise submitted yet.</p> : primaryCrops.map((crop) => <ExpertiseCard key={crop.id} name={`${crop.cropEmoji ? `${crop.cropEmoji} ` : ""}${crop.cropName}`} detail={crop.categoryName || crop.expertiseType} status={crop.verificationStatus} onRemove={() => removeCrop(crop.cropId)} removing={removing === crop.cropId} />)}</div></section>
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div><h2 className="text-lg font-bold text-slate-900">Professional specializations</h2><p className="mt-1 text-sm text-slate-500">Choose from the specializations returned by the backend catalog.</p></div><div className="mt-5 flex flex-col gap-2 sm:flex-row"><select value={selectedSpecialization} onChange={(event) => setSelectedSpecialization(event.target.value)} className="h-10 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-emerald-400"><option value="">Select a specialization</option>{availableSpecializations.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select><button type="button" onClick={addSpecialization} disabled={!selectedSpecialization || isSaving} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 text-sm font-bold text-white disabled:opacity-50"><Plus className="h-4 w-4" />Add specialization</button></div><div className="mt-5 flex flex-wrap gap-2">{profile.specializations.length === 0 ? <p className="w-full rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-400">No professional specializations submitted yet.</p> : profile.specializations.map((item) => <span key={item.id} className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800"><CheckCircle2 className="h-3.5 w-3.5" />{item.name} · Pending review</span>)}</div></section></div>;
}

function ExpertiseCard({ name, detail, status, onRemove, removing }: { name: string; detail: string; status: string; onRemove: () => void; removing: boolean }) { return <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-4"><div><p className="text-sm font-semibold text-slate-800">{name}</p><p className="mt-1 text-xs text-slate-500">{detail}</p><span className={`mt-2 inline-flex rounded-full border px-2 py-1 text-[10px] font-bold ${statusClasses[status] || statusClasses.PENDING}`}>{status.replaceAll("_", " ")}</span></div><button type="button" onClick={onRemove} disabled={removing} aria-label={`Remove ${name}`} className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"><Trash2 className="h-4 w-4" /></button></div>; }
