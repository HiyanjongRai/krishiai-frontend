"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, FileText, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { ExpertDocument } from "@/types/expert-verification";

interface DocumentsPreviewProps {
  documents: ExpertDocument[];
  maxDisplay?: number;
}

function getDocumentIcon(type: string): React.ReactNode {
  return <FileText className="w-4 h-4" />;
}

function getStatusIcon(status: "PENDING" | "VERIFIED" | "REJECTED" | "ADDITIONAL_INFO_REQUIRED") {
  switch (status) {
    case "VERIFIED":
      return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
    case "REJECTED":
      return <AlertCircle className="w-4 h-4 text-red-600" />;
    case "ADDITIONAL_INFO_REQUIRED":
      return <AlertCircle className="w-4 h-4 text-blue-600" />;
    case "PENDING":
    default:
      return <Clock className="w-4 h-4 text-amber-600" />;
  }
}

function getStatusColor(
  status: "PENDING" | "VERIFIED" | "REJECTED" | "ADDITIONAL_INFO_REQUIRED"
): { bg: string; text: string } {
  switch (status) {
    case "VERIFIED":
      return { bg: "bg-emerald-50", text: "text-emerald-700" };
    case "REJECTED":
      return { bg: "bg-red-50", text: "text-red-700" };
    case "ADDITIONAL_INFO_REQUIRED":
      return { bg: "bg-blue-50", text: "text-blue-700" };
    case "PENDING":
    default:
      return { bg: "bg-amber-50", text: "text-amber-700" };
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
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Documents</h3>
        <div className="text-center py-6">
          <p className="text-sm text-slate-600 mb-3">No documents uploaded yet</p>
          <Link
            href="/expert/documents"
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
          >
            Upload Documents →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Documents</h3>
          <div className="flex gap-3 text-xs">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-emerald-700">{verifiedCount}</span>
              <span className="text-slate-600">Verified</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-amber-700">{pendingCount}</span>
              <span className="text-slate-600">Pending</span>
            </div>
            {rejectedCount > 0 && (
              <div className="flex items-center gap-1">
                <span className="font-semibold text-red-700">{rejectedCount}</span>
                <span className="text-slate-600">Rejected</span>
              </div>
            )}
          </div>
        </div>
        <Link
          href="/expert/documents"
          className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group"
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
              className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="text-slate-400 mt-0.5 flex-shrink-0">
                  {getDocumentIcon(doc.type)}
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-sm text-slate-900">
                    {doc.name}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
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
        <div className="mt-4 pt-4 border-t border-slate-200">
          <Link
            href="/expert/documents"
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
          >
            View all {documents.length} documents →
          </Link>
        </div>
      )}
    </div>
  );
}
