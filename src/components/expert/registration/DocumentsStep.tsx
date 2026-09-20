"use client";

import React, { useState, useRef } from "react";
import { useExpertApplication } from "@/providers/expert-application-provider";
import { UploadedDocument } from "@/types/expert-application";
import {
  UploadCloud,
  CheckCircle2,
  Trash2,
  Lock,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  FileCheck,
  Shield,
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
          ? "border-[#FCD34D] bg-[#FEF3C7]/50 ring-2 ring-[#FEF3C7]"
          : isProcessing
          ? "border-[#A5D6A7] bg-[#E8F5E9]/40"
          : uploadedDoc
          ? "border-[#A5D6A7] bg-[#E8F5E9]/50"
          : "border-[#E5E7EB] bg-[#F8FAF8] hover:bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-xs sm:text-sm font-bold text-[#1F2937]">{title}</h4>
            {required ? (
              <span className="text-[10px] font-bold text-[#1B5E20] bg-[#E8F5E9]/70 px-2 py-0.5 rounded-full">
                Required
              </span>
            ) : (
              <span className="text-[10px] font-medium text-[#9CA3AF] bg-[#F1F5F2] px-2 py-0.5 rounded-full">
                Optional
              </span>
            )}
            {isHighlighted && (
              <span className="text-[10px] font-extrabold text-[#F59E0B] bg-[#FEF3C7] px-2 py-0.5 rounded-full animate-pulse">
                Update Requested
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#6B7280] mt-0.5 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {isProcessing ? (
        /* Document Processing Local Feedback */
        <div className="bg-white rounded-xl p-4 border border-[#A5D6A7] shadow-2xs flex items-center gap-3">
          <LoadingSpinner size="sm" color="primary" />
          <div className="min-w-0 space-y-0.5">
            <p className="text-xs sm:text-sm font-bold text-[#1F2937] truncate">{processingName}</p>
            <p className="text-[11px] text-[#2E7D32] font-medium">Encrypting &amp; attaching document...</p>
          </div>
        </div>
      ) : uploadedDoc ? (
        /* Uploaded File Card */
        <div className="bg-white rounded-xl p-4 border border-[#A5D6A7] shadow-2xs flex items-center justify-between gap-3 transition-all">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-lg bg-[#E8F5E9]/70 border border-[#A5D6A7] flex items-center justify-center text-[#2E7D32] shrink-0">
              <FileCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32] shrink-0" />
                <p className="text-xs sm:text-sm font-bold text-[#1F2937] truncate">
                  {uploadedDoc.fileName}
                </p>
              </div>
              <p className="text-[11px] text-[#6B7280]">
                {uploadedDoc.fileSize} • Uploaded {uploadedDoc.uploadedAt}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onRemove(type)}
            className="px-3 py-1.5 text-xs font-semibold text-[#DC2626] hover:text-[#DC2626] hover:bg-[#FEE2E2] rounded-lg transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
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
                ? "border-[#1B5E20] bg-[#E8F5E9]"
                : isHighlighted
                ? "border-[#FCD34D] bg-white hover:border-[#FCD34D]0"
                : "border-[#D1D5DB] bg-white hover:border-[#1B5E20] hover:bg-[#F8FAF8]"
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
                    ? "bg-[#FEF3C7] text-[#F59E0B]"
                    : "bg-[#E8F5E9] text-[#1B5E20]"
                }`}
              >
                <UploadCloud className="w-5 h-5" />
              </div>
              <p className="text-xs sm:text-sm font-bold text-[#1F2937]">
                <span className="text-[#1B5E20] underline">Click to upload</span> or drag and drop
              </p>
              <p className="text-[11px] text-[#6B7280]">
                PDF, PNG, or JPG (maximum 10 MB)
              </p>
            </div>
          </div>

          {error && (
            <p className="text-xs font-medium text-[#DC2626] flex items-center gap-1.5 mt-2">
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
    uploadDocument,
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

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E5E7EB] shadow-xs space-y-5 animate-in fade-in duration-200">
      {/* Step Header */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E8F5E9] border border-[#A5D6A7]/80 text-[#1B5E20] text-[10px] font-bold">
          <Shield className="w-3 h-3 text-[#1B5E20]" />
          <span>Step 4 • Verification Documents</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h2 className="text-lg sm:text-xl font-bold text-[#1F2937] tracking-tight">
            Verify your expertise
          </h2>
        </div>
        <p className="text-xs text-[#6B7280] leading-relaxed">
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
          onUpload={uploadDocument}
          onRemove={removeDocument}
        />

        {/* Document 2: Education */}
        <UploadZone
          type="education"
          title="Highest Educational Certificate"
          description="Official Degree Certificate or University Transcript (B.Sc., M.Sc., or Ph.D.)."
          required
          uploadedDoc={docs.education}
          onUpload={uploadDocument}
          onRemove={removeDocument}
        />

        {/* Document 3: License (Optional) */}
        <UploadZone
          type="license"
          title="Professional License / Council Registration"
          description="Nepal Engineering Council (NEC), Veterinary Council, or relevant professional council ID."
          uploadedDoc={docs.license}
          onUpload={uploadDocument}
          onRemove={removeDocument}
        />

        {/* Document 4: Experience */}
        <UploadZone
          type="experience"
          title="Work Experience Certificate"
          description="Appointment letter, service certificate, or recommendation from an agricultural entity."
          uploadedDoc={docs.experience}
          isHighlighted={application.requiredDocumentUpdate === "experience"}
          onUpload={uploadDocument}
          onRemove={removeDocument}
        />

        {attemptedSubmit && !isComplete && (
          <div className="p-3 rounded-xl bg-[#FEE2E2] border border-[#FCA5A5] text-[#DC2626] text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0" />
            <span>
              Please upload both your <strong>Identity Document</strong> and{" "}
              <strong>Educational Certificate</strong> before proceeding.
            </span>
          </div>
        )}

        {/* Security Reassurance Notice */}
        <div className="p-3 rounded-xl bg-[#E8F5E9] border border-[#A5D6A7] flex items-start gap-2.5 text-[#1B5E20]">
          <Lock className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#1B5E20]" />
          <div className="text-xs leading-relaxed">
            <p className="font-bold text-[#1F2937]">
              🔒 Your documents are securely used only for verification.
            </p>
            <p className="text-[#6B7280] text-[11px] mt-0.5">
              KrishiAI follows strict data privacy standards. Your identity documents will never be shared publicly or displayed to farmers.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-3 border-t border-[#EEF0EE] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={prevStep}
            className="px-4 py-2.5 border border-[#E5E7EB] hover:bg-[#F8FAF8] text-[#1F2937] font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 bg-[#1B5E20] hover:bg-[#1B5E20] text-white font-bold text-xs rounded-xl transition-all shadow-2xs hover:shadow-xs flex items-center justify-center gap-2 cursor-pointer group"
          >
            <span>Continue to Review Application</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </form>
    </div>
  );
}
