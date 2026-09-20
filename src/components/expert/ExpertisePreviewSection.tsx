"use client";

import React from "react";
import Link from "next/link";
import { Award, CheckCircle2, ChevronRight, Clock3, FileText, Leaf, Plus, XCircle } from "lucide-react";
import { ExpertExpertise, ExpertiseStatus } from "@/types/expert-verification";

interface ExpertisePreviewProps {
  expertise: ExpertExpertise[];
  maxDisplay?: number;
}

function getStatusColor(
  status: ExpertiseStatus | string
): { bg: string; text: string; border: string } {
  switch (status) {
    case "VERIFIED":
      return { bg: "bg-[#E8F5E9]", text: "text-[#2E7D32]", border: "border-[#A5D6A7]" };
    case "EVIDENCE_SUBMITTED":
      return { bg: "bg-[#FEF3C7]", text: "text-[#F59E0B]", border: "border-[#FCD34D]" };
    case "REJECTED":
      return { bg: "bg-[#FEE2E2]", text: "text-[#DC2626]", border: "border-[#FCA5A5]" };
    case "SELF_DECLARED":
    case "PENDING":
    default:
      return { bg: "bg-[#F8FAF8]", text: "text-[#4B5563]", border: "border-[#E5E7EB]" };
  }
}

function StatusIcon({ status }: { status: ExpertiseStatus | string }) {
  if (status === "VERIFIED") return <CheckCircle2 className="h-3.5 w-3.5" />;
  if (status === "EVIDENCE_SUBMITTED") return <FileText className="h-3.5 w-3.5" />;
  if (status === "REJECTED") return <XCircle className="h-3.5 w-3.5" />;
  return <Clock3 className="h-3.5 w-3.5" />;
}

export function ExpertisePreviewSection({
  expertise,
  maxDisplay = 4,
}: ExpertisePreviewProps) {
  const displayedExpertise = expertise.slice(0, maxDisplay);
  const remainingCount = expertise.length - maxDisplay;

  if (expertise.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-bold text-[#1F2937]">Your Expertise</h3>
          <Link
            href="/expert/expertise"
            className="text-sm font-semibold text-[#2E7D32] hover:text-[#2E7D32] flex items-center gap-1"
          >
            Add Expertise
            <Plus className="w-4 h-4" />
          </Link>
        </div>
        <div className="text-center py-8">
          <div className="text-[#9CA3AF] mb-3">
            <Leaf className="mx-auto mb-2 h-8 w-8 text-[#9CA3AF]" />
            <p className="text-sm font-medium">No expertise areas added yet</p>
          </div>
          <p className="text-xs text-[#4B5563] mb-4">
            Add your areas of expertise to help farmers find you
          </p>
          <Link
            href="/expert/expertise"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#2E7D32] hover:bg-[#2E7D32] text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Add Expertise Areas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-bold text-[#1F2937]">Your Expertise</h3>
        <Link
          href="/expert/expertise"
          className="text-sm font-semibold text-[#2E7D32] hover:text-[#2E7D32] flex items-center gap-1 group"
        >
          Manage
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {displayedExpertise.map((exp) => {
          const colors = getStatusColor(exp.status);
          const ItemIcon = exp.category === "CROP" ? Leaf : Award;

          return (
            <div
              key={exp.id}
              className={`rounded-xl p-4 border bg-white ${colors.border}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#E5E7EB] bg-[#F8FAF8] text-[#6B7280]">
                  <ItemIcon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-[#1F2937]">
                    {exp.name}
                  </div>
                  <div className="text-xs text-[#4B5563] mt-0.5">
                    {exp.category === "CROP" ? "Primary Crop" : "Professional Expertise"}
                  </div>
                  <div className={`inline-flex items-center gap-1 text-[11px] font-semibold mt-2 px-2.5 py-0.5 rounded-md border ${colors.bg} ${colors.border} ${colors.text}`}>
                    <StatusIcon status={exp.status} />
                    {exp.status === "VERIFIED" ? "Verified" :
                     exp.status === "EVIDENCE_SUBMITTED" ? "Evidence submitted" :
                     exp.status === "REJECTED" ? "Rejected" :
                     "Self-declared"}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {remainingCount > 0 && (
        <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
          <Link
            href="/expert/expertise"
            className="text-sm font-semibold text-[#2E7D32] hover:text-[#2E7D32]"
          >
            View all {expertise.length} areas of expertise →
          </Link>
        </div>
      )}
    </div>
  );
}
