"use client";

import React, { useState, useRef } from "react";
import { useExpertApplication } from "@/providers/expert-application-provider";
import { UploadedDocument } from "@/types/expert-application";
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  Trash2,
  Lock,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  FileCheck,
  Shield,
  Clock,
  Sparkles,
} from "lucide-react";

import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface UploadZoneProps {
  type: "identity" | "education" | "license" | "experience";
  title: string;
  description: string;
  required?: boolean;
  uploadedDoc?: UploadedDocument;
  isHighlighted?: boolean;
  onUpload: (type: "identity" | "education" | "license" | "experience", file: File) => void | Promise<void>;
  onRemove: (type: "identity" | "education" | "license" | "experience") => void;
}

function UploadZone({
  type,
  title,
  description,
  required = false,
  uploadedDoc,
  isHighlighted = false,
  onUpload,
  onRemove,
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingName, setProcessingName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    // File validation
    const validTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a PDF, PNG, or JPG document.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB limit.");
      return;
    }

    setError(null);
    setIsProcessing(true);
    setProcessingName(file.name);
    try {
      await onUpload(type, file);
    } catch {
      setError("Failed to process document. Please try again.");
    } finally {
      setIsProcessing(false);
      setProcessingName(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div
      className={`p-3.5 rounded-xl border transition-all ${
        isHighlighted
          ? "border-orange-400 bg-orange-50/50 ring-2 ring-orange-200"
          : isProcessing
          ? "border-emerald-300 bg-emerald-50/40"
          : uploadedDoc
          ? "border-emerald-200 bg-[#F0FDF4]/50"
          : "border-[#E2E8E3] bg-[#F7F9F4] hover:bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-xs sm:text-sm font-bold text-[#17201A]">{title}</h4>
            {required ? (
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                Required
              </span>
            ) : (
              <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                Optional
              </span>
            )}
            {isHighlighted && (
              <span className="text-[10px] font-extrabold text-orange-800 bg-orange-200 px-2 py-0.5 rounded-full animate-pulse">
                Update Requested
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#647067] mt-0.5 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {isProcessing ? (
        /* Document Processing Local Feedback */
        <div className="bg-white rounded-xl p-4 border border-emerald-200 shadow-2xs flex items-center gap-3">
          <LoadingSpinner size="sm" color="primary" />
          <div className="min-w-0 space-y-0.5">
            <p className="text-xs sm:text-sm font-bold text-[#17201A] truncate">{processingName}</p>
            <p className="text-[11px] text-emerald-700 font-medium">Encrypting &amp; attaching document...</p>
          </div>
        </div>
      ) : uploadedDoc ? (
        /* Uploaded File Card */
        <div className="bg-white rounded-xl p-4 border border-emerald-200 shadow-2xs flex items-center justify-between gap-3 transition-all">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-lg bg-emerald-100/70 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
              <FileCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <p className="text-xs sm:text-sm font-bold text-[#17201A] truncate">
                  {uploadedDoc.fileName}
                </p>
              </div>
              <p className="text-[11px] text-slate-500">
                {uploadedDoc.fileSize} • Uploaded {uploadedDoc.uploadedAt}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onRemove(type)}
            className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Remove</span>
          </button>
        </div>
      ) : (
        /* Dropzone */
        <div>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer group ${
              isDragging
                ? "border-[#166534] bg-emerald-50/50"
                : isHighlighted
                ? "border-orange-400 bg-white hover:border-orange-500"
                : "border-slate-300 bg-white hover:border-[#166534] hover:bg-slate-50/70"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleFiles(e.target.files)}
              accept=".pdf,.png,.jpg,.jpeg"
              className="hidden"
            />
            <div className="flex flex-col items-center justify-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${
                  isHighlighted
                    ? "bg-orange-100 text-orange-700"
                    : "bg-emerald-50 text-[#166534]"
                }`}
              >
                <UploadCloud className="w-5 h-5" />
              </div>
              <p className="text-xs sm:text-sm font-bold text-[#17201A]">
                <span className="text-[#166534] underline">Click to upload</span> or drag and drop
              </p>
              <p className="text-[11px] text-slate-500">
                PDF, PNG, or JPG (maximum 10 MB)
              </p>
            </div>
          </div>

          {error && (
            <p className="text-xs font-medium text-rose-600 flex items-center gap-1.5 mt-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export function DocumentsStep() {
  const {
    application,
    uploadDocumentSimulated,
    removeDocument,
    nextStep,
    prevStep,
  } = useExpertApplication();
  const docs = application.documents;

  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  // Both Identity and Education are required
  const hasIdentity = !!docs.identity;
  const hasEducation = !!docs.education;
  const isComplete = hasIdentity && hasEducation;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAttemptedSubmit(true);
    if (isComplete) {
      nextStep();
    }
  };

  // Quick fill sample documents for fast user testing
  const handleQuickFill = () => {
    const mockFile1 = new File(["dummy"], "Citizenship_Front_Back.pdf", {
      type: "application/pdf",
    });
    Object.defineProperty(mockFile1, "size", { value: 1.8 * 1024 * 1024 });

    const mockFile2 = new File(["dummy"], "BSc_Agriculture_Certificate.pdf", {
      type: "application/pdf",
    });
    Object.defineProperty(mockFile2, "size", { value: 2.4 * 1024 * 1024 });

    const mockFile3 = new File(["dummy"], "NARC_Work_Experience_Letter.pdf", {
      type: "application/pdf",
    });
    Object.defineProperty(mockFile3, "size", { value: 1.1 * 1024 * 1024 });

    uploadDocumentSimulated("identity", mockFile1);
    uploadDocumentSimulated("education", mockFile2);
    uploadDocumentSimulated("experience", mockFile3);
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E2E8E3] shadow-xs space-y-5 animate-in fade-in duration-200">
      {/* Step Header */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F0FDF4] border border-emerald-200/80 text-[#166534] text-[10px] font-bold">
          <Shield className="w-3 h-3 text-[#166534]" />
          <span>Step 4 • Verification Documents</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h2 className="text-lg sm:text-xl font-bold text-[#17201A] tracking-tight">
            Verify your expertise
          </h2>
          <button
            type="button"
            onClick={handleQuickFill}
            className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 self-start sm:self-auto flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>Fill Sample Documents (Demo)</span>
          </button>
        </div>
        <p className="text-xs text-[#647067] leading-relaxed">
          Upload documents that help us verify your professional background. Your documents are securely reviewed by KrishiAI.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Document 1: Identity */}
        <UploadZone
          type="identity"
          title="Identity Document"
          description="Clear scan or photo of your Citizenship Card, Passport, or National ID."
          required
          uploadedDoc={docs.identity}
          onUpload={uploadDocumentSimulated}
          onRemove={removeDocument}
        />

        {/* Document 2: Education */}
        <UploadZone
          type="education"
          title="Highest Educational Certificate"
          description="Official Degree Certificate or University Transcript (B.Sc., M.Sc., or Ph.D.)."
          required
          uploadedDoc={docs.education}
          onUpload={uploadDocumentSimulated}
          onRemove={removeDocument}
        />

        {/* Document 3: License (Optional) */}
        <UploadZone
          type="license"
          title="Professional License / Council Registration"
          description="Nepal Engineering Council (NEC), Veterinary Council, or relevant professional council ID."
          uploadedDoc={docs.license}
          onUpload={uploadDocumentSimulated}
          onRemove={removeDocument}
        />

        {/* Document 4: Experience */}
        <UploadZone
          type="experience"
          title="Work Experience Certificate"
          description="Appointment letter, service certificate, or recommendation from an agricultural entity."
          uploadedDoc={docs.experience}
          isHighlighted={application.requiredDocumentUpdate === "experience"}
          onUpload={uploadDocumentSimulated}
          onRemove={removeDocument}
        />

        {attemptedSubmit && !isComplete && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>
              Please upload both your <strong>Identity Document</strong> and{" "}
              <strong>Educational Certificate</strong> before proceeding.
            </span>
          </div>
        )}

        {/* Security Reassurance Notice */}
        <div className="p-3 rounded-xl bg-[#F0FDF4] border border-emerald-200 flex items-start gap-2.5 text-[#166534]">
          <Lock className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#166534]" />
          <div className="text-xs leading-relaxed">
            <p className="font-bold text-[#17201A]">
              🔒 Your documents are securely used only for verification.
            </p>
            <p className="text-[#647067] text-[11px] mt-0.5">
              KrishiAI follows strict data privacy standards. Your identity documents will never be shared publicly or displayed to farmers.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={prevStep}
            className="px-4 py-2.5 border border-[#E2E8E3] hover:bg-slate-50 text-[#17201A] font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 bg-[#166534] hover:bg-[#14532d] text-white font-bold text-xs rounded-xl transition-all shadow-2xs hover:shadow-xs flex items-center justify-center gap-2 cursor-pointer group"
          >
            <span>Continue to Review Application</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </form>
    </div>
  );
}
