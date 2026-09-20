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
        return <CheckCircle2 className="w-5 h-5 text-[#2E7D32] shrink-0" />;
      case "REJECTED":
        return <AlertCircle className="w-5 h-5 text-[#DC2626] shrink-0" />;
      case "ADDITIONAL_INFO_REQUIRED":
        return <AlertCircle className="w-5 h-5 text-[#2563EB] shrink-0" />;
      case "PENDING":
      default:
        return <Clock className="w-5 h-5 text-[#F59E0B] shrink-0" />;
    }
  };

  const getStatusColor = (
    status: DocumentStatus
  ): { bg: string; text: string; border: string } => {
    switch (status) {
      case "APPROVED":
      case "VERIFIED":
        return { bg: "bg-[#E8F5E9]", text: "text-[#2E7D32]", border: "border-[#A5D6A7]" };
      case "REJECTED":
        return { bg: "bg-[#FEE2E2]/60", text: "text-[#DC2626]", border: "border-[#FCA5A5]" };
      case "ADDITIONAL_INFO_REQUIRED":
        return { bg: "bg-[#DBEAFE]", text: "text-[#2563EB]", border: "border-[#93C5FD]" };
      case "PENDING":
      default:
        return { bg: "bg-[#FEF3C7]/60", text: "text-[#F59E0B]", border: "border-[#FCD34D]" };
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#1F2937] flex items-center gap-2">
            <span>Professional</span>
            <span className="text-[#2E7D32]">Documents</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
            Manage your credentials, academic degrees, and certifications for platform verification.
          </p>
        </div>
        {!showUploadForm && (
          <div className="flex items-center gap-2.5 flex-wrap w-full sm:w-auto">
            <button
              onClick={() => setShowUploadForm(true)}
              className="flex items-center justify-center gap-2 bg-[#2E7D32] hover:bg-[#256B2A] text-white rounded-full px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-bold shadow-[0_4px_20px_-2px_#EEF0EE] transition-all active:scale-95 flex-1 sm:flex-initial min-h-[40px]"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Document</span>
            </button>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-4 sm:p-5 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE]">
          <p className="text-[11px] font-bold text-[#6B7280]">Total Uploaded</p>
          <p className="text-2xl sm:text-3xl font-black text-[#1F2937] mt-1 tracking-tight">{documents.length}</p>
        </div>
        <div className="rounded-[24px] border border-[#A5D6A7] bg-[#E8F5E9] p-4 sm:p-5 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE]">
          <p className="text-[11px] font-bold text-[#2E7D32]">Verified</p>
          <p className="text-2xl sm:text-3xl font-black text-[#1B5E20] mt-1 tracking-tight">{verifiedCount}</p>
        </div>
        <div className="rounded-[24px] border border-[#FCD34D] bg-[#FEF3C7] p-4 sm:p-5 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE]">
          <p className="text-[11px] font-bold text-[#F59E0B]">Pending</p>
          <p className="text-2xl sm:text-3xl font-black text-[#F59E0B] mt-1 tracking-tight">{pendingCount}</p>
        </div>
        <div className="rounded-[24px] border border-[#FCA5A5] bg-[#FEE2E2]/50 p-4 sm:p-5 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE]">
          <p className="text-[11px] font-bold text-[#DC2626]">Attention</p>
          <p className="text-2xl sm:text-3xl font-black text-[#DC2626] mt-1 tracking-tight">{rejectedCount}</p>
        </div>
      </div>

      {/* Requirements Alert */}
      <div className="rounded-[24px] border border-[#93C5FD] bg-[#DBEAFE] p-4 sm:p-5 text-xs sm:text-sm text-[#2563EB] shadow-[0_4px_20px_-2px_#EEF0EE] flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-[#2563EB] mt-0.5 shrink-0" />
        <div>
          <span className="font-semibold text-[#2563EB]">Document Requirements: </span>
          Upload clear, legible copies of your professional qualifications, certificates, and supporting documents. All documents must be in PDF, JPG, or PNG format (max 10MB).
        </div>
      </div>

      {/* Documents List */}
      <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-[#EEF0EE]">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-[#1F2937]">Your Documents</h2>
            <p className="text-[11px] sm:text-xs text-[#6B7280] font-medium mt-0.5">{documents.length} document{documents.length !== 1 ? "s" : ""} attached</p>
          </div>
          {!showUploadForm && (
            <button
              onClick={() => setShowUploadForm(true)}
              className="sm:hidden inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#2E7D32] px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#1B5E20] transition-colors w-full"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload Document
            </button>
          )}
        </div>

        {/* Upload Form */}
        {showUploadForm && (
          <div className="rounded-xl bg-[#F8FAF8] border border-[#E5E7EB] p-4 sm:p-5 mb-5 space-y-4">
            <h3 className="text-sm font-bold text-[#1F2937]">Upload New Document</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-[#1F2937] mb-1.5">
                  Document Name
                </label>
                <input
                  type="text"
                  value={uploadingDocName}
                  onChange={(e) => setUploadingDocName(e.target.value)}
                  placeholder="E.g., B.Sc. Agriculture Certificate"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-[#D1D5DB] bg-white text-[#1F2937] placeholder-[#9CA3AF] focus:outline-[#2E7D32]"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-[#1F2937] mb-1.5">
                  Document Type
                </label>
                <select
                  value={uploadingDocType}
                  onChange={(e) => setUploadingDocType(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-[#D1D5DB] bg-white text-[#1F2937] focus:outline-[#2E7D32]"
                >
                  <option value="CERTIFICATE">Certificate</option>
                  <option value="LETTER">Experience Letter</option>
                  <option value="IDENTITY">Identity Document</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              {/* File Upload Area */}
              <div className="border-2 border-dashed border-[#D1D5DB] rounded-xl p-5 sm:p-6 text-center hover:border-[#C8E6C9] transition-colors cursor-pointer bg-white">
                <DownloadCloud className="w-8 h-8 text-[#9CA3AF] mx-auto mb-2" />
                <div className="text-xs sm:text-sm font-semibold text-[#1F2937] mb-1">
                  Click to select or drag and drop file
                </div>
                <div className="text-[11px] sm:text-xs text-[#6B7280]">
                  PDF, JPG, or PNG (max 10MB)
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 pt-2">
              <button
                onClick={handleUpload}
                disabled={!uploadingDocName.trim()}
                className="w-full sm:flex-1 py-2.5 px-4 bg-[#2E7D32] hover:bg-[#1B5E20] disabled:bg-[#D1D5DB] text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-xs"
              >
                Upload Document
              </button>
              <button
                onClick={() => {
                  setShowUploadForm(false);
                  setUploadingDocName("");
                }}
                className="w-full sm:flex-1 py-2.5 px-4 bg-[#E5E7EB] hover:bg-[#D1D5DB] text-[#1F2937] rounded-xl text-xs sm:text-sm font-semibold transition-colors"
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
              <FileText className="w-10 h-10 text-[#9CA3AF] mx-auto mb-3" />
              <p className="text-[#4B5563] font-semibold mb-1 text-sm sm:text-base">No documents uploaded yet</p>
              <p className="text-xs sm:text-sm text-[#6B7280] mb-4 max-w-sm mx-auto">
                Upload professional certificates or letters to complete your verification and start consulting.
              </p>
              <button
                onClick={() => setShowUploadForm(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#2E7D32] hover:bg-[#1B5E20] text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-xs"
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
                  className={`border rounded-2xl p-4 sm:p-5 ${colors.border} ${colors.bg} transition-all`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      {/* Icon */}
                      <div className="mt-0.5">
                        {getStatusIcon(doc.status)}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-[#1F2937] text-xs sm:text-sm break-words">
                          {doc.name}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px] text-[#4B5563]">
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
                          <div className="mt-2.5 p-2.5 bg-white/80 rounded-lg border-l-4 border-[#FCA5A5]0 text-xs text-[#4B5563]">
                            <strong className="text-[#DC2626]">Rejection reason:</strong> {doc.rejectionReason}
                          </div>
                        )}

                        {doc.status === "ADDITIONAL_INFO_REQUIRED" &&
                          doc.additionalInfoRequired && (
                            <div className="mt-2.5 p-2.5 bg-white/80 rounded-lg border-l-4 border-[#93C5FD]0 text-xs text-[#4B5563]">
                              <strong className="text-[#2563EB]">Action required:</strong>{" "}
                              {doc.additionalInfoRequired}
                            </div>
                          )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E5E7EB] w-full sm:w-auto justify-end">
                      <button
                        className="inline-flex items-center justify-center p-2 rounded-lg bg-white border border-[#E5E7EB] text-[#4B5563] hover:text-[#2563EB] hover:border-[#93C5FD] transition-colors shadow-xs"
                        title="View document"
                        aria-label="View document"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {doc.status !== "VERIFIED" && doc.status !== "APPROVED" && (
                        <button
                          onClick={() => handleRemoveDocument(doc.id)}
                          className="inline-flex items-center justify-center p-2 rounded-lg bg-white border border-[#E5E7EB] text-[#4B5563] hover:text-[#DC2626] hover:border-[#FCA5A5] transition-colors shadow-xs"
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
      <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE]">
        <h3 className="text-sm sm:text-base font-bold text-[#1F2937] mb-3">Document Guidelines</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="rounded-2xl bg-[#F8FAF8] p-4 border border-[#EEF0EE]">
            <h4 className="text-xs sm:text-sm font-semibold text-[#1F2937] mb-2">Accepted Documents</h4>
            <ul className="space-y-1.5 text-xs text-[#4B5563]">
              <li className="flex items-center gap-1.5">• University degree certificates</li>
              <li className="flex items-center gap-1.5">• Training & certification documents</li>
              <li className="flex items-center gap-1.5">• Experience letters from organizations</li>
              <li className="flex items-center gap-1.5">• Professional identity documents</li>
              <li className="flex items-center gap-1.5">• Government certifications</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-[#F8FAF8] p-4 border border-[#EEF0EE]">
            <h4 className="text-xs sm:text-sm font-semibold text-[#1F2937] mb-2">Quality Requirements</h4>
            <ul className="space-y-1.5 text-xs text-[#4B5563]">
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
