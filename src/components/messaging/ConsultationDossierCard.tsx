"use client";

import React, { useState } from "react";
import {
  Sparkles,
  ExternalLink,
  MessageSquare,
  Leaf,
  X,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Camera,
  FlaskConical,
  ClipboardList,
  CheckCircle2,
  ChevronRight,
  Bug,
  CloudRain,
  ShieldAlert,
  Stethoscope,
  HelpCircle,
} from "lucide-react";

interface ConsultationDossierCardProps {
  subject?: string | null;
  cropName?: string | null;
  description: string;
  farmerName?: string | null;
}

// Parse a bullet-point list section from the description text
function parseListSection(text: string, heading: string): string[] {
  const regex = new RegExp(`• ${heading}:\\n([\\s\\S]*?)(?=\\n•|\\nFarmer|$)`);
  const match = text.match(regex);
  if (!match) return [];
  return match[1]
    .split("\n")
    .map((l) => l.replace(/^\s*-\s*/, "").trim())
    .filter(Boolean);
}

export function ConsultationDossierCard({
  subject,
  cropName,
  description,
  farmerName,
}: ConsultationDossierCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  if (!description || !description.trim()) return null;

  const isAiReport = description.includes("AI Diagnostic Report");

  // ── Parse all fields ───────────────────────────────────────────
  let parsedCrop = cropName || null;
  let parsedDisease: string | null = null;
  let parsedConfidence: string | null = null;
  let parsedRecommendation: string | null = null;
  let parsedImageUrl: string | null = null;
  let parsedFarmerNote: string | null = null;
  let parsedSymptoms: string[] = [];
  let parsedCauses: string[] = [];
  let parsedPrevention: string[] = [];
  let parsedManagement: string[] = [];
  let parsedExpertHelp: string | null = null;

  if (isAiReport) {
    const cropMatch = description.match(/• Crop:\s*([^\n]+)/);
    if (cropMatch) parsedCrop = cropMatch[1].trim();

    const diseaseMatch = description.match(/• Disease:\s*([^\n]+)/);
    if (diseaseMatch) parsedDisease = diseaseMatch[1].trim();

    const confMatch = description.match(/• Confidence:\s*([^\n]+)/);
    if (confMatch) parsedConfidence = confMatch[1].trim();

    const recMatch = description.match(/• AI Recommendation:\s*([\s\S]*?)(?=\n•|\nFarmer|$)/);
    if (recMatch) parsedRecommendation = recMatch[1].trim();

    const imgMatch = description.match(/• Leaf Image:\s*(https?:\/\/[^\s]+)/);
    if (imgMatch) parsedImageUrl = imgMatch[1].trim();

    parsedSymptoms = parseListSection(description, "Symptoms");
    parsedCauses = parseListSection(description, "Causes");
    parsedPrevention = parseListSection(description, "Prevention Measures");
    parsedManagement = parseListSection(description, "Management Steps");

    const expertHelpMatch = description.match(/• When To Seek Expert Help:\s*([\s\S]*?)(?=\n•|\nFarmer|$)/);
    if (expertHelpMatch) parsedExpertHelp = expertHelpMatch[1].trim();

    const noteMatch = description.match(/Farmer's Note & Questions:\s*([\s\S]*)$/);
    if (noteMatch && noteMatch[1].trim()) parsedFarmerNote = noteMatch[1].trim();
  }

  const confNum = parsedConfidence ? parseFloat(parsedConfidence.replace("%", "")) : null;
  const confidenceBg =
    confNum !== null
      ? confNum >= 80 ? "from-emerald-500 to-green-600"
      : confNum >= 50 ? "from-amber-400 to-orange-500"
      : "from-red-400 to-red-600"
      : "from-emerald-500 to-green-600";
  const confidenceLabel =
    confNum !== null
      ? confNum >= 80 ? "High Confidence"
      : confNum >= 50 ? "Moderate Confidence"
      : "Low Confidence"
      : "Confidence";

  const hasDetailedAdvice = parsedSymptoms.length > 0 || parsedPrevention.length > 0 || parsedManagement.length > 0;

  return (
    <>
      {/* ── Compact Trigger ──────────────────────────────────────── */}
      <div className="mx-4 sm:mx-6 my-2">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#E8F5E9] to-[#F1F8F1] border border-[#A5D6A7] hover:border-[#2E7D32] hover:shadow-sm transition-all cursor-pointer"
        >
          <div className="w-7 h-7 rounded-lg bg-[#2E7D32] text-white flex items-center justify-center shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-xs font-black text-[#1B5E20]">AI Diagnostic Report</p>
            {parsedDisease && (
              <p className="text-[10px] text-[#4CAF50] truncate">
                {parsedDisease}{parsedConfidence ? ` · ${parsedConfidence} confidence` : ""}
                {hasDetailedAdvice && " · Symptoms, Prevention & Management included"}
              </p>
            )}
          </div>
          <span className="text-[10px] font-bold text-[#2E7D32] flex items-center gap-0.5 shrink-0 group-hover:gap-1.5 transition-all">
            View Full Report <ChevronRight className="w-3 h-3" />
          </span>
        </button>
      </div>

      {/* ── Modal Overlay ─────────────────────────────────────────── */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl z-10 max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">

            {/* Header */}
            <div className="bg-gradient-to-r from-[#1a3c1e] to-[#2E7D32] px-5 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm font-black text-white leading-tight">AI Crop Diagnosis Report</h2>
                  <p className="text-[11px] text-white/60 mt-0.5 truncate">
                    {farmerName || "Farmer"}{parsedCrop ? ` · ${parsedCrop}` : ""}
                    {hasDetailedAdvice && " · Full advisory included"}
                  </p>
                </div>
              </div>
              <button type="button" onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center shrink-0 transition-colors cursor-pointer">
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="overflow-y-auto flex-1 divide-y divide-[#F3F4F6]">

              {/* ── Section 1: Photo Evidence ───────────────────── */}
              {parsedImageUrl && (
                <div className="px-5 py-4">
                  <SectionHeader icon={<Camera className="w-3.5 h-3.5 text-[#2E7D32]" />} title="Photo Evidence" />
                  <div
                    onClick={() => setPreviewImage(parsedImageUrl)}
                    className="group relative w-full h-44 rounded-2xl overflow-hidden border border-[#E5E7EB] cursor-pointer bg-black mt-3"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={parsedImageUrl} alt="Submitted crop leaf" className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white">
                      <Camera className="w-3.5 h-3.5" />
                      <span className="text-xs font-bold">Submitted Leaf Sample</span>
                    </div>
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 backdrop-blur-sm px-2 py-1 rounded-lg text-white text-[10px] font-bold flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" /> Enlarge
                    </div>
                  </div>
                </div>
              )}

              {/* ── Section 2: Diagnosis Overview ──────────────── */}
              <div className="px-5 py-4">
                <SectionHeader icon={<FlaskConical className="w-3.5 h-3.5 text-[#2E7D32]" />} title="Diagnosis Overview" />
                <div className="space-y-2.5 mt-3">
                  <div className="grid grid-cols-2 gap-2.5">
                    <InfoCard label="Crop Type" value={parsedCrop || "—"} />
                    <InfoCard label="Subject" value={subject || parsedCrop || "—"} small />
                  </div>

                  {/* Disease highlight */}
                  <div className="p-3.5 rounded-2xl bg-[#FFF8F0] border border-[#FED7AA] flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-[#EA580C] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#EA580C] block">Detected Disease / Condition</span>
                      <span className="text-base font-black text-[#9A3412] mt-0.5 block">{parsedDisease || "No condition detected"}</span>
                    </div>
                  </div>

                  {/* Confidence bar */}
                  {parsedConfidence && (
                    <div className="p-3.5 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0]">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
                          <span className="text-[9px] font-black uppercase tracking-widest text-[#15803D]">AI Confidence Score</span>
                        </div>
                        <span className="text-lg font-black text-[#15803D]">{parsedConfidence}</span>
                      </div>
                      <div className="h-2 rounded-full bg-[#DCFCE7] overflow-hidden">
                        <div className={`h-full rounded-full bg-gradient-to-r ${confidenceBg} transition-all duration-700`} style={{ width: parsedConfidence }} />
                      </div>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[10px] text-[#15803D] font-semibold">{confidenceLabel}</span>
                        {confNum !== null && confNum < 70 && (
                          <span className="text-[10px] text-amber-600 font-bold">Expert verification needed</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Section 3: AI Summary ───────────────────────── */}
              {parsedRecommendation && (
                <div className="px-5 py-4">
                  <SectionHeader icon={<Leaf className="w-3.5 h-3.5 text-[#2E7D32]" />} title="AI Advisory Summary" />
                  <div className="p-4 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] mt-3">
                    <p className="text-sm text-[#374151] leading-relaxed whitespace-pre-wrap">{parsedRecommendation}</p>
                  </div>
                </div>
              )}

              {/* ── Section 4: Symptoms ─────────────────────────── */}
              {parsedSymptoms.length > 0 && (
                <div className="px-5 py-4">
                  <SectionHeader icon={<Bug className="w-3.5 h-3.5 text-[#DC2626]" />} title="Observed Symptoms" badge={`${parsedSymptoms.length} signs`} badgeColor="red" />
                  <ul className="mt-3 space-y-2">
                    {parsedSymptoms.map((s, i) => (
                      <BulletItem key={i} text={s} color="red" />
                    ))}
                  </ul>
                </div>
              )}

              {/* ── Section 5: Causes ───────────────────────────── */}
              {parsedCauses.length > 0 && (
                <div className="px-5 py-4">
                  <SectionHeader icon={<CloudRain className="w-3.5 h-3.5 text-[#7C3AED]" />} title="Contributing Causes" badge={`${parsedCauses.length} factors`} badgeColor="purple" />
                  <ul className="mt-3 space-y-2">
                    {parsedCauses.map((s, i) => (
                      <BulletItem key={i} text={s} color="purple" />
                    ))}
                  </ul>
                </div>
              )}

              {/* ── Section 6: Prevention Measures ─────────────── */}
              {parsedPrevention.length > 0 && (
                <div className="px-5 py-4">
                  <SectionHeader icon={<ShieldAlert className="w-3.5 h-3.5 text-[#0369A1]" />} title="Prevention Measures" badge={`${parsedPrevention.length} steps`} badgeColor="blue" />
                  <ul className="mt-3 space-y-2">
                    {parsedPrevention.map((s, i) => (
                      <BulletItem key={i} text={s} color="blue" icon={<CheckCircle2 className="w-4 h-4 text-[#0369A1]" />} />
                    ))}
                  </ul>
                </div>
              )}

              {/* ── Section 7: Management Steps ─────────────────── */}
              {parsedManagement.length > 0 && (
                <div className="px-5 py-4">
                  <SectionHeader icon={<Stethoscope className="w-3.5 h-3.5 text-[#0D9488]" />} title="Management Steps" badge={`${parsedManagement.length} actions`} badgeColor="teal" />
                  <ol className="mt-3 space-y-2">
                    {parsedManagement.map((s, i) => (
                      <li key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#F0FDFA] border border-[#99F6E4]">
                        <span className="w-5 h-5 rounded-full bg-[#0D9488] text-white text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                        <span className="text-xs text-[#134E4A] leading-snug">{s}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* ── Section 8: When to Seek Expert Help ─────────── */}
              {parsedExpertHelp && (
                <div className="px-5 py-4">
                  <SectionHeader icon={<HelpCircle className="w-3.5 h-3.5 text-[#D97706]" />} title="When to Seek Expert Help" />
                  <div className="p-4 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] mt-3">
                    <p className="text-sm text-[#78350F] leading-relaxed">{parsedExpertHelp}</p>
                  </div>
                </div>
              )}

              {/* ── Section 9: Farmer's Concern ─────────────────── */}
              {parsedFarmerNote && (
                <div className="px-5 py-4">
                  <SectionHeader icon={<MessageSquare className="w-3.5 h-3.5 text-[#D97706]" />} title="Farmer's Specific Concern" />
                  <div className="p-4 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] mt-3">
                    <p className="text-sm font-medium text-[#78350F] whitespace-pre-wrap leading-relaxed">&quot;{parsedFarmerNote}&quot;</p>
                  </div>
                </div>
              )}

              {/* Fallback */}
              {!isAiReport && (
                <div className="px-5 py-4">
                  <p className="text-sm text-[#374151] whitespace-pre-wrap leading-relaxed">{description}</p>
                </div>
              )}

              {/* Expert review checklist — always shown */}
              <div className="px-5 py-4">
                <SectionHeader icon={<ClipboardList className="w-3.5 h-3.5 text-[#2E7D32]" />} title="Expert Review Checklist" />
                <div className="mt-3 space-y-2">
                  {[
                    "Verify the AI-detected disease against visual symptoms above",
                    "Confirm crop variety and growth stage suitability",
                    "Review and validate prevention & management steps",
                    "Address the farmer's specific concern directly",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
                      <CheckCircle2 className="w-4 h-4 text-[#9CA3AF] shrink-0 mt-0.5" />
                      <span className="text-xs text-[#374151] leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 bg-[#F9FAFB] border-t border-[#E5E7EB] flex items-center justify-between shrink-0">
              <p className="text-[10px] text-[#9CA3AF]">Auto-generated by KrishiAI · Submitted for expert review</p>
              <button type="button" onClick={() => setIsOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold transition-colors cursor-pointer">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {previewImage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setPreviewImage(null)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewImage} alt="Full size leaf" className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain" />
          <button type="button" onClick={() => setPreviewImage(null)}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </>
  );
}

// ── Sub-components ─────────────────────────────────────────────────

function SectionHeader({
  icon,
  title,
  badge,
  badgeColor = "green",
}: {
  icon: React.ReactNode;
  title: string;
  badge?: string;
  badgeColor?: "green" | "red" | "blue" | "purple" | "teal";
}) {
  const badgeStyles: Record<string, string> = {
    green:  "bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]",
    red:    "bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]",
    blue:   "bg-[#EFF6FF] text-[#0369A1] border-[#BFDBFE]",
    purple: "bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]",
    teal:   "bg-[#F0FDFA] text-[#0D9488] border-[#99F6E4]",
  };
  return (
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 rounded-lg bg-[#F3F4F6] flex items-center justify-center">{icon}</div>
      <h3 className="text-[11px] font-black uppercase tracking-widest text-[#374151]">{title}</h3>
      {badge && (
        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${badgeStyles[badgeColor]}`}>{badge}</span>
      )}
    </div>
  );
}

function InfoCard({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <div className="p-3 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB]">
      <span className="text-[9px] font-black uppercase tracking-widest text-[#9CA3AF] block">{label}</span>
      <span className={`${small ? "text-xs" : "text-sm"} font-black text-[#111827] mt-0.5 block`}>{value}</span>
    </div>
  );
}

function BulletItem({
  text,
  color = "green",
  icon,
}: {
  text: string;
  color?: "green" | "red" | "blue" | "purple";
  icon?: React.ReactNode;
}) {
  const styles: Record<string, string> = {
    green:  "bg-[#F0FDF4] border-[#BBF7D0] text-[#14532D]",
    red:    "bg-[#FEF2F2] border-[#FECACA] text-[#7F1D1D]",
    blue:   "bg-[#EFF6FF] border-[#BFDBFE] text-[#1E3A5F]",
    purple: "bg-[#F5F3FF] border-[#DDD6FE] text-[#3B0764]",
  };
  const dotStyles: Record<string, string> = {
    green:  "bg-[#16A34A]",
    red:    "bg-[#DC2626]",
    blue:   "bg-[#0369A1]",
    purple: "bg-[#7C3AED]",
  };
  return (
    <li className={`flex items-start gap-2.5 p-2.5 rounded-xl border list-none ${styles[color]}`}>
      {icon ?? <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${dotStyles[color]}`} />}
      <span className="text-xs leading-snug">{text}</span>
    </li>
  );
}
