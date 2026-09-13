/**
 * Expert Documents Management Page
 * Allows experts to upload, view, and manage their professional documents
 */

"use client";

import React, { useState } from "react";
import {
  Upload,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Trash2,
  Eye,
  DownloadCloud,
} from "lucide-react";
import { ExpertDocument, DocumentStatus } from "@/types/expert-verification";

const DEMO_SUBMITTED_AT = "2026-09-10T00:00:00.000Z";
const DEMO_VERIFIED_AT = "2026-09-11T00:00:00.000Z";

export default function ExpertDocumentsPage() {
  const [documents, setDocuments] = useState<ExpertDocument[]>([
    {
      id: "1",
      name: "B.Sc. Agriculture Certificate",
      type: "CERTIFICATE",
      submittedAt: DEMO_SUBMITTED_AT,
      status: "PENDING",
    },
    {
      id: "2",
      name: "Training Certificate - Integrated Pest Management",
      type: "CERTIFICATE",
      submittedAt: DEMO_SUBMITTED_AT,
      status: "VERIFIED",
      verifiedAt: DEMO_VERIFIED_AT,
    },
    {
      id: "3",
      name: "Experience Letter from Ministry",
      type: "LETTER",
      submittedAt: DEMO_SUBMITTED_AT,
      status: "PENDING",
    },
  ]);

  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadingDocName, setUploadingDocName] = useState("");
  const [uploadingDocType, setUploadingDocType] = useState("CERTIFICATE");

  const getStatusIcon = (status: DocumentStatus) => {
    switch (status) {
      case "APPROVED":
      case "VERIFIED":
        return <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
      case "REJECTED":
        return <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />;
      case "ADDITIONAL_INFO_REQUIRED":
        return <AlertCircle className="w-5 h-5 text-blue-600 shrink-0" />;
      case "PENDING":
      default:
        return <Clock className="w-5 h-5 text-amber-600 shrink-0" />;
    }
  };

  const getStatusColor = (
    status: DocumentStatus
  ): { bg: string; text: string; border: string } => {
    switch (status) {
      case "APPROVED":
      case "VERIFIED":
        return { bg: "bg-emerald-50/60", text: "text-emerald-700", border: "border-emerald-200" };
      case "REJECTED":
        return { bg: "bg-red-50/60", text: "text-red-700", border: "border-red-200" };
      case "ADDITIONAL_INFO_REQUIRED":
        return { bg: "bg-blue-50/60", text: "text-blue-700", border: "border-blue-200" };
      case "PENDING":
      default:
        return { bg: "bg-amber-50/60", text: "text-amber-700", border: "border-amber-200" };
    }
  };

  const getStatusLabel = (status: DocumentStatus): string => {
    switch (status) {
      case "APPROVED":
      case "VERIFIED":
        return "Verified & Approved";
      case "REJECTED":
        return "Rejected";
      case "ADDITIONAL_INFO_REQUIRED":
        return "Action Required";
      case "PENDING":
      default:
        return "Pending Review";
    }
  };

  const handleUpload = () => {
    if (!uploadingDocName.trim()) return;

    const newDoc: ExpertDocument = {
      id: Date.now().toString(),
      name: uploadingDocName,
      type: uploadingDocType,
      submittedAt: new Date().toISOString(),
      status: "PENDING",
    };

    setDocuments([...documents, newDoc]);
    setUploadingDocName("");
    setUploadingDocType("CERTIFICATE");
    setShowUploadForm(false);
  };

  const handleRemoveDocument = (id: string) => {
    setDocuments(documents.filter((d) => d.id !== id));
  };

  const pendingCount = documents.filter((d) => d.status === "PENDING").length;
  const verifiedCount = documents.filter((d) => d.status === "VERIFIED").length;
  const rejectedCount = documents.filter((d) => d.status === "REJECTED").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
            Expert Workspace
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Professional Documents</h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600">
            Manage your credentials, academic degrees, and certifications for platform verification.
          </p>
        </div>
        {!showUploadForm && (
          <button
            onClick={() => setShowUploadForm(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-emerald-800 transition-colors w-full sm:w-auto shrink-0"
          >
            <Upload className="w-4 h-4" />
            Upload Document
          </button>
        )}
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 sm:p-4 shadow-xs">
          <p className="text-[11px] font-medium text-slate-500">Total Uploaded</p>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">{documents.length}</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3.5 sm:p-4 shadow-xs">
          <p className="text-[11px] font-medium text-emerald-700">Verified</p>
          <p className="text-xl sm:text-2xl font-bold text-emerald-800 mt-1">{verifiedCount}</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3.5 sm:p-4 shadow-xs">
          <p className="text-[11px] font-medium text-amber-700">Pending</p>
          <p className="text-xl sm:text-2xl font-bold text-amber-800 mt-1">{pendingCount}</p>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50/50 p-3.5 sm:p-4 shadow-xs">
          <p className="text-[11px] font-medium text-red-700">Attention</p>
          <p className="text-xl sm:text-2xl font-bold text-red-800 mt-1">{rejectedCount}</p>
        </div>
      </div>

      {/* Requirements Alert */}
      <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-3.5 sm:p-4 text-xs sm:text-sm text-blue-900 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
        <div>
          <span className="font-semibold text-blue-950">Document Requirements: </span>
          Upload clear, legible copies of your professional qualifications, certificates, and supporting documents. All documents must be in PDF, JPG, or PNG format (max 10MB).
        </div>
      </div>

      {/* Documents List */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">Your Documents</h2>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">{documents.length} document{documents.length !== 1 ? "s" : ""} attached</p>
          </div>
          {!showUploadForm && (
            <button
              onClick={() => setShowUploadForm(true)}
              className="sm:hidden inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-700 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-800 transition-colors w-full"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload Document
            </button>
          )}
        </div>

        {/* Upload Form */}
        {showUploadForm && (
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 sm:p-5 mb-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Upload New Document</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1.5">
                  Document Name
                </label>
                <input
                  type="text"
                  value={uploadingDocName}
                  onChange={(e) => setUploadingDocName(e.target.value)}
                  placeholder="E.g., B.Sc. Agriculture Certificate"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1.5">
                  Document Type
                </label>
                <select
                  value={uploadingDocType}
                  onChange={(e) => setUploadingDocType(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-emerald-600"
                >
                  <option value="CERTIFICATE">Certificate</option>
                  <option value="LETTER">Experience Letter</option>
                  <option value="IDENTITY">Identity Document</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              {/* File Upload Area */}
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-5 sm:p-6 text-center hover:border-emerald-400 transition-colors cursor-pointer bg-white">
                <DownloadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <div className="text-xs sm:text-sm font-semibold text-slate-900 mb-1">
                  Click to select or drag and drop file
                </div>
                <div className="text-[11px] sm:text-xs text-slate-500">
                  PDF, JPG, or PNG (max 10MB)
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 pt-2">
              <button
                onClick={handleUpload}
                disabled={!uploadingDocName.trim()}
                className="w-full sm:flex-1 py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-xs"
              >
                Upload Document
              </button>
              <button
                onClick={() => {
                  setShowUploadForm(false);
                  setUploadingDocName("");
                }}
                className="w-full sm:flex-1 py-2.5 px-4 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs sm:text-sm font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Documents Table/List */}
        <div className="space-y-3">
          {documents.length === 0 ? (
            <div className="text-center py-10 px-4">
              <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-700 font-semibold mb-1 text-sm sm:text-base">No documents uploaded yet</p>
              <p className="text-xs sm:text-sm text-slate-500 mb-4 max-w-sm mx-auto">
                Upload professional certificates or letters to complete your verification and start consulting.
              </p>
              <button
                onClick={() => setShowUploadForm(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-xs"
              >
                <Upload className="w-4 h-4" />
                Upload First Document
              </button>
            </div>
          ) : (
            documents.map((doc) => {
              const colors = getStatusColor(doc.status);

              return (
                <div
                  key={doc.id}
                  className={`border rounded-xl p-3.5 sm:p-4 ${colors.border} ${colors.bg} transition-all`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      {/* Icon */}
                      <div className="mt-0.5">
                        {getStatusIcon(doc.status)}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-900 text-xs sm:text-sm break-words">
                          {doc.name}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px] text-slate-600">
                          <span>
                            {new Date(doc.submittedAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                          <span>•</span>
                          <span className={`font-semibold px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] ${colors.text} bg-white/70 border border-current/20`}>
                            {getStatusLabel(doc.status)}
                          </span>
                        </div>

                        {/* Rejection Reason or Additional Info */}
                        {doc.status === "REJECTED" && doc.rejectionReason && (
                          <div className="mt-2.5 p-2.5 bg-white/80 rounded-lg border-l-4 border-red-500 text-xs text-slate-700">
                            <strong className="text-red-800">Rejection reason:</strong> {doc.rejectionReason}
                          </div>
                        )}

                        {doc.status === "ADDITIONAL_INFO_REQUIRED" &&
                          doc.additionalInfoRequired && (
                            <div className="mt-2.5 p-2.5 bg-white/80 rounded-lg border-l-4 border-blue-500 text-xs text-slate-700">
                              <strong className="text-blue-800">Action required:</strong>{" "}
                              {doc.additionalInfoRequired}
                            </div>
                          )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60 w-full sm:w-auto justify-end">
                      <button
                        className="inline-flex items-center justify-center p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-300 transition-colors shadow-xs"
                        title="View document"
                        aria-label="View document"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {doc.status !== "VERIFIED" && doc.status !== "APPROVED" && (
                        <button
                          onClick={() => handleRemoveDocument(doc.id)}
                          className="inline-flex items-center justify-center p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-300 transition-colors shadow-xs"
                          title="Remove document"
                          aria-label="Remove document"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Document Guidelines */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-3">Document Guidelines</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-100">
            <h4 className="text-xs sm:text-sm font-semibold text-slate-800 mb-2">Accepted Documents</h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li className="flex items-center gap-1.5">• University degree certificates</li>
              <li className="flex items-center gap-1.5">• Training & certification documents</li>
              <li className="flex items-center gap-1.5">• Experience letters from organizations</li>
              <li className="flex items-center gap-1.5">• Professional identity documents</li>
              <li className="flex items-center gap-1.5">• Government certifications</li>
            </ul>
          </div>
          <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-100">
            <h4 className="text-xs sm:text-sm font-semibold text-slate-800 mb-2">Quality Requirements</h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li className="flex items-center gap-1.5">• Clear, legible scans or photos</li>
              <li className="flex items-center gap-1.5">• Full document visible (all pages)</li>
              <li className="flex items-center gap-1.5">• PDF, JPG, or PNG format</li>
              <li className="flex items-center gap-1.5">• File size under 10MB</li>
              <li className="flex items-center gap-1.5">• Minimum resolution 300 DPI</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
