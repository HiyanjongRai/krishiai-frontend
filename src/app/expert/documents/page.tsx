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

interface DocumentInput {
  id: string;
  name: string;
  type: string;
  file?: File;
}

export default function ExpertDocumentsPage() {
  const [documents, setDocuments] = useState<ExpertDocument[]>([
    {
      id: "1",
      name: "B.Sc. Agriculture Certificate",
      type: "CERTIFICATE",
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: "PENDING",
    },
    {
      id: "2",
      name: "Training Certificate - Integrated Pest Management",
      type: "CERTIFICATE",
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: "VERIFIED",
      verifiedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "3",
      name: "Experience Letter from Ministry",
      type: "LETTER",
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: "PENDING",
    },
  ]);

  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadingDocName, setUploadingDocName] = useState("");
  const [uploadingDocType, setUploadingDocType] = useState("CERTIFICATE");

  const getStatusIcon = (status: DocumentStatus) => {
    switch (status) {
      case "VERIFIED":
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case "REJECTED":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case "ADDITIONAL_INFO_REQUIRED":
        return <AlertCircle className="w-5 h-5 text-blue-600" />;
      case "PENDING":
      default:
        return <Clock className="w-5 h-5 text-amber-600" />;
    }
  };

  const getStatusColor = (
    status: DocumentStatus
  ): { bg: string; text: string; border: string } => {
    switch (status) {
      case "VERIFIED":
        return { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" };
      case "REJECTED":
        return { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" };
      case "ADDITIONAL_INFO_REQUIRED":
        return { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" };
      case "PENDING":
      default:
        return { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" };
    }
  };

  const getStatusLabel = (status: DocumentStatus): string => {
    switch (status) {
      case "VERIFIED":
        return "✓ Verified";
      case "REJECTED":
        return "✗ Rejected";
      case "ADDITIONAL_INFO_REQUIRED":
        return "⚠ Action Required";
      case "PENDING":
      default:
        return "⏳ Pending";
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Professional Documents</h1>
          <p className="text-slate-600 mt-1">
            Upload and manage your professional documentation
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-sm font-semibold text-slate-600 mb-1">Total Documents</div>
          <div className="text-3xl font-bold text-slate-900">{documents.length}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-sm font-semibold text-emerald-600 mb-1">Verified</div>
          <div className="text-3xl font-bold text-emerald-700">{verifiedCount}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-sm font-semibold text-amber-600 mb-1">Pending</div>
          <div className="text-3xl font-bold text-amber-700">{pendingCount}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-sm font-semibold text-red-600 mb-1">Rejected</div>
          <div className="text-3xl font-bold text-red-700">{rejectedCount}</div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-900">
          <span className="font-semibold">Document Requirements:</span> Upload clear, legible copies of your professional qualifications, certificates, and supporting documents. All documents must be in PDF, JPG, or PNG format.
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Your Documents</h2>
          {!showUploadForm && (
            <button
              onClick={() => setShowUploadForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors"
            >
              <Upload className="w-4 h-4" />
              Upload Document
            </button>
          )}
        </div>

        {/* Upload Form */}
        {showUploadForm && (
          <div className="bg-slate-50 rounded-2xl p-6 mb-6 border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4">Upload New Document</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Document Name
                </label>
                <input
                  type="text"
                  value={uploadingDocName}
                  onChange={(e) => setUploadingDocName(e.target.value)}
                  placeholder="E.g., B.Sc. Agriculture Certificate"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Document Type
                </label>
                <select
                  value={uploadingDocType}
                  onChange={(e) => setUploadingDocType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900"
                >
                  <option value="CERTIFICATE">Certificate</option>
                  <option value="LETTER">Experience Letter</option>
                  <option value="IDENTITY">Identity Document</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              {/* File Upload Area */}
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-emerald-400 transition-colors cursor-pointer">
                <DownloadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <div className="text-sm font-semibold text-slate-900 mb-1">
                  Click to upload or drag and drop
                </div>
                <div className="text-xs text-slate-600">
                  PDF, JPG, or PNG (max 10MB)
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleUpload}
                disabled={!uploadingDocName.trim()}
                className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-lg font-semibold transition-colors"
              >
                Upload Document
              </button>
              <button
                onClick={() => {
                  setShowUploadForm(false);
                  setUploadingDocName("");
                }}
                className="flex-1 px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Documents Table/List */}
        <div className="space-y-3">
          {documents.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600 font-medium mb-2">No documents yet</p>
              <p className="text-sm text-slate-500 mb-4">
                Upload professional documents to support your verification
              </p>
              <button
                onClick={() => setShowUploadForm(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors"
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
                  className={`border rounded-xl p-4 ${colors.border} ${colors.bg}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Icon */}
                      <div className="flex-shrink-0 mt-0.5">
                        {getStatusIcon(doc.status)}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-900 mb-1">
                          {doc.name}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-600">
                          <span>
                            {new Date(doc.submittedAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                          <span className={`font-semibold px-2.5 py-1 rounded-md ${colors.text}`}>
                            {getStatusLabel(doc.status)}
                          </span>
                        </div>

                        {/* Rejection Reason or Additional Info */}
                        {doc.status === "REJECTED" && doc.rejectionReason && (
                          <div className="mt-2 p-2 bg-white/60 rounded border-l-4 border-red-500 text-xs text-slate-700">
                            <strong>Rejection reason:</strong> {doc.rejectionReason}
                          </div>
                        )}

                        {doc.status === "ADDITIONAL_INFO_REQUIRED" &&
                          doc.additionalInfoRequired && (
                            <div className="mt-2 p-2 bg-white/60 rounded border-l-4 border-blue-500 text-xs text-slate-700">
                              <strong>Action required:</strong>{" "}
                              {doc.additionalInfoRequired}
                            </div>
                          )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 ml-4 flex-shrink-0">
                      <button
                        className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                        title="View document"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {doc.status !== "VERIFIED" && (
                        <button
                          onClick={() => handleRemoveDocument(doc.id)}
                          className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                          title="Remove document"
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
      <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl border border-emerald-200 p-6">
        <h3 className="font-semibold text-emerald-950 mb-4">Document Guidelines</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-emerald-900 text-sm mb-2">Accepted Documents</h4>
            <ul className="space-y-1 text-sm text-emerald-900">
              <li>• University degree certificates</li>
              <li>• Training & certification documents</li>
              <li>• Experience letters from organizations</li>
              <li>• Professional identity documents</li>
              <li>• Government certifications</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-emerald-900 text-sm mb-2">Quality Requirements</h4>
            <ul className="space-y-1 text-sm text-emerald-900">
              <li>• Clear, legible scans or photos</li>
              <li>• Full document visible (all pages)</li>
              <li>• PDF, JPG, or PNG format</li>
              <li>• File size under 10MB</li>
              <li>• Minimum resolution 300 DPI</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
