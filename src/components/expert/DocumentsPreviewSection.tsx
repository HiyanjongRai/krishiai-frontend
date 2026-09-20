"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, FileText, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { ExpertDocument, DocumentStatus } from "@/types/expert-verification";

interface DocumentsPreviewProps {
  documents: ExpertDocument[];
  maxDisplay?: number;
}

function getDocumentIcon(type: string): React.ReactNode {
  return <FileText className="w-4 h-4" />;
}

function getStatusIcon(status: DocumentStatus) {
  switch (status) {
    case "APPROVED":
    case "VERIFIED":
      return <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />;
    case "REJECTED":
      return <AlertCircle className="w-4 h-4 text-[#DC2626]" />;
    case "ADDITIONAL_INFO_REQUIRED":
      return <AlertCircle className="w-4 h-4 text-[#2563EB]" />;
    case "PENDING":
    default:
      return <Clock className="w-4 h-4 text-[#F59E0B]" />;
  }
}

function getStatusColor(
  status: DocumentStatus
): { bg: string; text: string } {
  switch (status) {
    case "APPROVED":
    case "VERIFIED":
      return { bg: "bg-[#E8F5E9]", text: "text-[#2E7D32]" };
    case "REJECTED":
      return { bg: "bg-[#FEE2E2]", text: "text-[#DC2626]" };
    case "ADDITIONAL_INFO_REQUIRED":
      return { bg: "bg-[#DBEAFE]", text: "text-[#2563EB]" };
    case "PENDING":
    default:
      return { bg: "bg-[#FEF3C7]", text: "text-[#F59E0B]" };
  }
}

export function DocumentsPreviewSection({
  documents,
  maxDisplay = 3,
}: DocumentsPreviewProps) {
  const displayedDocs = documents.slice(0, maxDisplay);
  const verifiedCount = documents.filter((d) => d.status === "VERIFIED").length;
  const pendingCount = documents.filter((d) => d.status === "PENDING").length;
  const rejectedCount = documents.filter((d) => d.status === "REJECTED").length;

  if (documents.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
        <h3 className="text-lg font-bold text-[#1F2937] mb-4">Documents</h3>
        <div className="text-center py-6">
          <p className="text-sm text-[#4B5563] mb-3">No documents uploaded yet</p>
          <Link
            href="/expert/documents"
            className="text-sm font-semibold text-[#2E7D32] hover:text-[#2E7D32]"
          >
            Upload Documents →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-[#1F2937] mb-2">Documents</h3>
          <div className="flex gap-3 text-xs">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-[#2E7D32]">{verifiedCount}</span>
              <span className="text-[#4B5563]">Verified</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-[#F59E0B]">{pendingCount}</span>
              <span className="text-[#4B5563]">Pending</span>
            </div>
            {rejectedCount > 0 && (
              <div className="flex items-center gap-1">
                <span className="font-semibold text-[#DC2626]">{rejectedCount}</span>
                <span className="text-[#4B5563]">Rejected</span>
              </div>
            )}
          </div>
        </div>
        <Link
          href="/expert/documents"
          className="text-sm font-semibold text-[#2E7D32] hover:text-[#2E7D32] flex items-center gap-1 group"
        >
          View All
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="space-y-2">
        {displayedDocs.map((doc) => {
          const colors = getStatusColor(doc.status);
          const statusLabel =
            doc.status === "VERIFIED"
              ? "Verified"
              : doc.status === "REJECTED"
                ? "Rejected"
                : doc.status === "ADDITIONAL_INFO_REQUIRED"
                  ? "Action Required"
                  : "Pending";

          return (
            <div
              key={doc.id}
              className="flex items-center justify-between p-3 rounded-lg border border-[#E5E7EB] hover:bg-[#F8FAF8] transition-colors"
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="text-[#9CA3AF] mt-0.5 flex-shrink-0">
                  {getDocumentIcon(doc.type)}
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-sm text-[#1F2937]">
                    {doc.name}
                  </div>
                  <div className="text-xs text-[#6B7280] mt-0.5">
                    {new Date(doc.submittedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className={`text-xs font-semibold px-2.5 py-1 rounded-md flex-shrink-0 flex items-center gap-1.5 ${colors.bg} ${colors.text}`}>
                {getStatusIcon(doc.status)}
                {statusLabel}
              </div>
            </div>
          );
        })}
      </div>

      {documents.length > maxDisplay && (
        <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
          <Link
            href="/expert/documents"
            className="text-sm font-semibold text-[#2E7D32] hover:text-[#2E7D32]"
          >
            View all {documents.length} documents →
          </Link>
        </div>
      )}
    </div>
  );
}
