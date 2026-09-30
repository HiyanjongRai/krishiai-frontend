"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Link from "next/link";
import { useToast } from "@/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CropAvatar } from "@/components/ui/crop-avatar";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ErrorState } from "@/components/ui/error-state";
import {
  predictCropDisease,
  getDiagnosisHistory,
  deleteDiagnosis,
  DiagnosisRecord,
} from "@/services/diagnosis-service";
import {
  SendToExpertModal,
  DiagnosisSummaryData,
} from "@/components/farmer/SendToExpertModal";
import { ApiError } from "@/lib/api";
import {
  Scan,
  Sparkles,
  Camera,
  Upload,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  Shield,
  Leaf,
  Activity,
  HelpCircle,
  BookOpen,
  Calendar,
  Send,
  Trash2,
  RefreshCw,
  Search,
  Plus,
  ArrowRight,
  ExternalLink,
  Award,
  Layers,
  LayoutGrid,
  Table as TableIcon,
} from "lucide-react";

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const TARGET_CROPS = [
  { label: "✨ Auto-Detect (All Crops)", value: "auto" },
  { label: "🍎 Apple", value: "Apple" },
  { label: "🫐 Blueberry", value: "Blueberry" },
  { label: "🍒 Cherry", value: "Cherry (including sour)" },
  { label: "🌽 Corn (Maize)", value: "Corn (maize)" },
  { label: "🍇 Grape", value: "Grape" },
  { label: "🍊 Orange", value: "Orange" },
  { label: "🍑 Peach", value: "Peach" },
  { label: "🫑 Pepper (Bell)", value: "Pepper, bell" },
  { label: "🥔 Potato", value: "Potato" },
  { label: "🍇 Raspberry", value: "Raspberry" },
  { label: "🌱 Soybean", value: "Soybean" },
  { label: "🎃 Squash", value: "Squash" },
  { label: "🍓 Strawberry", value: "Strawberry" },
  { label: "🍅 Tomato", value: "Tomato" },
];

export default function FarmerAnalysisPage() {
  const { toast } = useToast();
  const workbenchRef = useRef<HTMLDivElement | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [analysisMessage, setAnalysisMessage] = useState<string | null>(null);
  const [currentResult, setCurrentResult] = useState<DiagnosisRecord | null>(null);

  const [analyses, setAnalyses] = useState<DiagnosisRecord[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [selectedCrop, setSelectedCrop] = useState<string>("auto");

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"ALL" | "CONFIRMED" | "ACTION_NEEDED">("ALL");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  // Delete modal state
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deletingName, setDeletingName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Send to Expert modal state
  const [consultModalData, setConsultModalData] = useState<DiagnosisSummaryData | null>(null);
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);

  const loadHistory = useCallback(async () => {
    setIsLoadingHistory(true);
    try {
      const response = await getDiagnosisHistory(0, 50);
      if (response && Array.isArray(response.content)) {
        setAnalyses(response.content);
      }
    } catch {
      // Non-blocking fallback
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadHistory();
    setIsRefreshing(false);
    toast.success({
      title: "Data Refreshed",
      description: "Diagnostic history updated to latest state.",
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error({
        title: "Invalid file format",
        description: "Please select a JPG, PNG, or WEBP leaf photo.",
      });
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error({
        title: "File too large",
        description: "Image size must be under 15MB.",
      });
      return;
    }

    setSelectedFile(file);
    setCurrentResult(null);
    setAnalysisMessage(null);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleRunDiagnosis = async () => {
    if (!selectedFile) return;

    setIsScanning(true);
    setAnalysisMessage(null);
    setCurrentResult(null);

    try {
      const result = await predictCropDisease(selectedFile, selectedCrop);
      setCurrentResult(result);

      if (result.id) {
        setAnalyses((prev) => [
          result,
          ...prev.filter((item) => item.id !== result.id),
        ]);
      }

      if (result.status === "NOT_A_PLANT") {
        toast.error({
          title: "Not a Plant Leaf",
          description:
            result.adviceHint ||
            "Please upload a clear close-up of a crop leaf for diagnosis.",
        });
      } else if (result.status !== "DIAGNOSIS" || !result.isReliable) {
        toast.warning({
          title: "Low-Confidence Result",
          description:
            result.adviceHint ||
            "Please upload a clearer leaf image or consult an agronomist.",
        });
      } else {
        toast.success({
          title: "Diagnosis Complete",
          description: `${result.predictedDisease} detected (${result.formattedConfidence})`,
        });
      }
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : "AI diagnosis service is temporarily unavailable. Please verify backend status and try again.";
      setAnalysisMessage(msg);
      toast.error({
        title: "Analysis Failed",
        description: msg,
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleResetUpload = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setCurrentResult(null);
    setAnalysisMessage(null);
  };

  const handleOpenConsultModal = (data: DiagnosisSummaryData) => {
    setConsultModalData(data);
    setIsConsultModalOpen(true);
  };

  const handleDeleteDiagnosis = async (id: number) => {
    setIsDeleting(true);
    try {
      await deleteDiagnosis(id);
      setAnalyses((prev) => prev.filter((item) => item.id !== id));
      if (currentResult?.id === id) {
        setCurrentResult(null);
      }
      setDeletingId(null);
      toast.success({
        title: "Record Deleted",
        description: "Diagnosis record removed from your history.",
      });
    } catch (err: any) {
      toast.error({
        title: "Delete Failed",
        description: err?.message || "Could not delete this diagnosis record.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const scrollToWorkbench = () => {
    workbenchRef.current?.scrollIntoView({ behavior: "smooth" });
    document.getElementById("leaf-upload")?.click();
  };

  // Filtered diagnoses
  const filteredAnalyses = useMemo(() => {
    return analyses.filter((scan) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (scan.crop && scan.crop.toLowerCase().includes(q)) ||
        (scan.predictedDisease && scan.predictedDisease.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      const conf = scan.confidence > 1 ? scan.confidence : scan.confidence * 100;
      if (selectedFilter === "CONFIRMED") return conf >= 80;
      if (selectedFilter === "ACTION_NEEDED")
        return scan.severity === "High" || scan.severity === "Moderate";
      return true;
    });
  }, [analyses, searchQuery, selectedFilter]);

  // Metric summaries
  const totalScans = analyses.length;
  const highConfCount = analyses.filter((a) => {
    const c = a.confidence > 1 ? a.confidence : a.confidence * 100;
    return c >= 80;
  }).length;
  const healthyRate = totalScans > 0 ? Math.round((highConfCount / totalScans) * 100) : 95;
  const actionNeededCount = analyses.filter(
    (a) => a.severity === "High" || a.severity === "Moderate"
  ).length;

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* ─── 1. PAGE HEADER (Compact & Clean) ────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#E5E7EB]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-[#E8F5E9] text-[#2E7D32]">
              <Scan className="w-4 h-4" />
            </span>
            <h1 className="text-lg sm:text-xl font-bold text-[#1F2937] tracking-tight">
              Crop Health &amp; AI Diagnostics
            </h1>
          </div>
          <p className="text-[11px] sm:text-xs text-[#6B7280] mt-0.5">
            Upload leaf photos to detect diseases instantly with PyTorch and receive actionable Gemini agronomic advice.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-lg bg-white border border-[#E5E7EB] text-[#4B5563] hover:text-[#2E7D32] hover:border-[#C8E6C9] transition-colors shadow-2xs cursor-pointer"
            title="Refresh records"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[#2E7D32]" : ""}`} />
          </button>

          <Button onClick={scrollToWorkbench} size="sm" className="rounded-lg py-1.5 px-3 text-xs w-full sm:w-auto">
            <Plus className="w-3.5 h-3.5 mr-1" />
            <span>New Leaf Scan</span>
          </Button>
        </div>
      </div>

      {/* ─── 2. METRIC CARDS ROW (Compact & Balanced for 100% zoom) ─────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Metric 1 */}
        <div className="rounded-xl bg-white border border-[#E5E7EB]/80 p-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">
              Total Scans
            </p>
            <div className="w-6 h-6 rounded-lg bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center">
              <Layers className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-[#1F2937] mt-1">
            {totalScans}
          </p>
          <p className="text-[10px] text-[#9CA3AF] mt-0.5">Diagnostic scans</p>
        </div>

        {/* Metric 2 */}
        <div className="rounded-xl bg-white border border-[#E5E7EB]/80 p-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">
              Confidence Index
            </p>
            <div className="w-6 h-6 rounded-lg bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-[#1F2937] mt-1">
            {healthyRate}%
          </p>
          <p className="text-[10px] text-[#9CA3AF] mt-0.5">High-confidence detections</p>
        </div>

        {/* Metric 3 */}
        <div className="rounded-xl bg-white border border-[#E5E7EB]/80 p-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">
              Needs Attention
            </p>
            <div className="w-6 h-6 rounded-lg bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-[#1F2937] mt-1">
            {actionNeededCount}
          </p>
          <p className="text-[10px] text-[#9CA3AF] mt-0.5">Moderate/high severity</p>
        </div>

        {/* Metric 4 */}
        <div className="rounded-xl bg-white border border-[#E5E7EB]/80 p-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">
              Specialist Support
            </p>
            <div className="w-6 h-6 rounded-lg bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-[#1F2937] mt-1">
            8 Online
          </p>
          <p className="text-[10px] text-[#9CA3AF] mt-0.5">Agronomists for verification</p>
        </div>
      </div>

      {/* ─── 3. SCAN DIAGNOSTIC WORKBENCH ────────────────────────────────────── */}
      <div
        ref={workbenchRef}
        className="rounded-2xl border border-[#E5E7EB] bg-white p-4 sm:p-5 shadow-2xs space-y-3.5"
      >

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F1F5F2]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#1F2937]">New Crop Leaf Scan</h2>
              <p className="text-[11px] text-[#6B7280]">
                Take a close-up photo of the affected leaf in good daylight
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="crop-select" className="text-xs font-bold text-[#4B5563] whitespace-nowrap">
              Target Crop:
            </label>
            <select
              id="crop-select"
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#F8FAF8] border border-[#E5E7EB] text-[#1F2937] focus:outline-none focus:border-[#2E7D32] cursor-pointer"
            >
              {TARGET_CROPS.map((crop) => (
                <option key={crop.value} value={crop.value}>
                  {crop.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Helpful Leaf-Focus Tip */}
        <div className="rounded-xl bg-[#F0FDF4] border border-[#DCFCE7] p-3 flex items-start gap-2.5 text-xs text-[#166534]">
          <Leaf className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold">Leaf Focus Tip: </span>
            <span>
              Photograph a <strong>close-up of the crop leaf</strong> (where spots, blight, or discoloration appear). On <strong>Auto-Detect</strong>, Gemini identifies the crop species first, then PyTorch classifies the pathology.
            </span>
          </div>
        </div>

        {/* Dropzone Container */}
        <div className="relative border-2 border-dashed border-[#E5E7EB] rounded-2xl p-6 text-center hover:border-[#2E7D32] transition-colors bg-[#F8FAF8]">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            capture="environment"
            onChange={handleFileChange}
            id="leaf-upload"
            className="sr-only"
            disabled={isScanning}
          />

          {previewUrl ? (
            <div className="space-y-4 max-w-md mx-auto">
              <div className="w-48 h-48 mx-auto rounded-2xl overflow-hidden border-2 border-[#2E7D32] shadow-md relative bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Crop preview"
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <p className="text-xs font-semibold text-[#4B5563] truncate">
                  {selectedFile?.name}
                </p>
                <p className="text-[11px] text-[#9CA3AF]">
                  {((selectedFile?.size || 0) / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 pt-1">
                <Button
                  onClick={handleRunDiagnosis}
                  isLoading={isScanning}
                  loadingText="Analyzing leaf with AI..."
                  className="rounded-full"
                >
                  <Sparkles className="w-4 h-4 mr-1.5" />
                  <span>Run AI Diagnosis</span>
                </Button>

                <button
                  type="button"
                  onClick={handleResetUpload}
                  disabled={isScanning}
                  className="px-4 py-2 bg-[#F1F5F2] hover:bg-[#E5E7EB] text-[#4B5563] text-xs font-semibold rounded-full transition-colors cursor-pointer min-h-[38px] inline-flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          ) : (
            <label
              htmlFor="leaf-upload"
              className="flex flex-col items-center justify-center cursor-pointer space-y-2 py-6"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center shadow-xs">
                <Camera className="w-7 h-7" />
              </div>
              <p className="text-sm font-bold text-[#1F2937]">
                Snap or upload a crop leaf photo
              </p>
              <p className="text-xs text-[#9CA3AF] max-w-xs">
                Tap to use phone camera or browse files (JPG, PNG, WEBP up to 15MB)
              </p>
              <span className="inline-flex items-center gap-1.5 px-5 py-2.5 mt-2 rounded-full bg-[#1F2937] hover:bg-[#111827] text-white text-xs font-bold shadow-xs transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Select Image</span>
              </span>
            </label>
          )}
        </div>

        {/* Scanning 3-Step Progress */}
        {isScanning && (
          <div className="p-5 rounded-2xl border border-[#2E7D32]/30 bg-[#F8FAF8] space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D32] animate-ping" />
              <h4 className="text-sm font-bold text-[#1F2937]">Processing Plant Diagnosis...</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3 rounded-xl border border-[#E5E7EB] bg-white flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center shrink-0 font-bold text-xs">
                  ✓
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">Step 1</p>
                  <p className="text-xs font-bold text-[#1F2937]">Image Verified</p>
                  <p className="text-[11px] text-[#6B7280]">Leaf captured &amp; prepared</p>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-[#2E7D32]/40 bg-[#F0FDF4] flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#2E7D32] text-white flex items-center justify-center shrink-0 font-bold text-xs animate-pulse">
                  ●
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#2E7D32]">Step 2</p>
                  <p className="text-xs font-bold text-[#1F2937]">
                    {selectedCrop === "auto" ? "Gemini Crop Identification" : "PyTorch Classification"}
                  </p>
                  <p className="text-[11px] text-[#2E7D32] font-medium">Detecting leaf patterns...</p>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-[#E5E7EB] bg-white flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#E5E7EB] text-[#9CA3AF] flex items-center justify-center shrink-0 font-bold text-xs">
                  ○
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">Step 3</p>
                  <p className="text-xs font-bold text-[#4B5563]">Agricultural Advisory</p>
                  <p className="text-[11px] text-[#9CA3AF]">Generating treatment advice</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── LIVE RESULT SECTION ─────────────────────────────────────────── */}
        {currentResult && (
          <div className="rounded-2xl border-2 border-[#2E7D32]/40 bg-[#F8FAF8] p-5 sm:p-6 space-y-5">
            {/* Header Result Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2.5">
                {currentResult.status === "DIAGNOSIS" ? (
                  <CheckCircle2 className="w-6 h-6 text-[#2E7D32]" />
                ) : currentResult.status === "NOT_A_PLANT" ? (
                  <XCircle className="w-6 h-6 text-[#DC2626]" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-[#D97706]" />
                )}
                <div>
                  <h3 className="text-lg font-black text-[#1F2937]">
                    {currentResult.status === "DIAGNOSIS"
                      ? "Diagnosis Result"
                      : currentResult.status === "NOT_A_PLANT"
                      ? "Image Not a Plant Leaf"
                      : "Uncertain Prediction"}
                  </h3>
                  <p className="text-xs text-[#6B7280]">
                    {currentResult.status === "DIAGNOSIS"
                      ? "Verified by KrishiAI Dual-Stage ML & Google Gemini"
                      : "Please review guidance below"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    currentResult.status === "DIAGNOSIS"
                      ? "success"
                      : currentResult.status === "NOT_A_PLANT"
                      ? "danger"
                      : "warning"
                  }
                  className="text-xs font-bold px-3 py-1"
                >
                  Status: {currentResult.status === "DIAGNOSIS" ? "Confirmed" : currentResult.status}
                </Badge>
                {currentResult.status === "DIAGNOSIS" && (
                  <Badge variant="neutral" className="text-xs font-bold px-3 py-1">
                    Severity: {currentResult.severity}
                  </Badge>
                )}
              </div>
            </div>

            {currentResult.status === "DIAGNOSIS" ? (
              <>
                {/* 3 Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-xl bg-white border border-[#E5E7EB] p-3.5 shadow-2xs">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">Crop Species</p>
                    <p className="mt-1 text-base font-black text-[#1F2937]">{currentResult.crop ?? "Unknown"}</p>
                  </div>
                  <div className="rounded-xl bg-white border border-[#E5E7EB] p-3.5 shadow-2xs">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">Detected Disease</p>
                    <p className="mt-1 text-base font-black text-[#1F2937]">{currentResult.predictedDisease ?? "Unknown"}</p>
                  </div>
                  <div className="rounded-xl bg-white border border-[#E5E7EB] p-3.5 shadow-2xs">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">AI Confidence</p>
                    <p className="mt-1 text-base font-black text-[#2E7D32]">
                      {(currentResult.confidencePercent ?? currentResult.confidence * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>

                {/* Gemini Agricultural Advice Section */}
                {currentResult.advice ? (
                  <div className="space-y-3.5 pt-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#2E7D32]" />
                        <h4 className="text-sm font-black text-[#1F2937]">Agricultural Guidance &amp; Treatment</h4>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-full border border-[#C8E6C9]">
                        Powered by Google Gemini
                      </span>
                    </div>

                    {/* About Summary */}
                    {currentResult.advice.summary && (
                      <div className="p-4 rounded-xl bg-white border border-[#E5E7EB] shadow-2xs space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#1F2937]">
                          <BookOpen className="w-4 h-4 text-[#2E7D32]" />
                          <span>About This Condition</span>
                        </div>
                        <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
                          {currentResult.advice.summary}
                        </p>
                      </div>
                    )}

                    {/* Symptoms & Causes Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {currentResult.advice.symptoms && currentResult.advice.symptoms.length > 0 && (
                        <div className="p-4 rounded-xl bg-white border border-[#E5E7EB] shadow-2xs space-y-2">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-[#1F2937]">
                            <Activity className="w-4 h-4 text-[#D97706]" />
                            <span>Observed Symptoms</span>
                          </div>
                          <ul className="space-y-1.5 text-xs text-[#4B5563]">
                            {currentResult.advice.symptoms.map((symptom, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-[#D97706] font-bold mt-0.5">•</span>
                                <span className="leading-snug">{symptom}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {currentResult.advice.causes && currentResult.advice.causes.length > 0 && (
                        <div className="p-4 rounded-xl bg-white border border-[#E5E7EB] shadow-2xs space-y-2">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-[#1F2937]">
                            <HelpCircle className="w-4 h-4 text-[#2563EB]" />
                            <span>Contributing Causes</span>
                          </div>
                          <ul className="space-y-1.5 text-xs text-[#4B5563]">
                            {currentResult.advice.causes.map((cause, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-[#2563EB] font-bold mt-0.5">•</span>
                                <span className="leading-snug">{cause}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Prevention & Management Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {currentResult.advice.prevention && currentResult.advice.prevention.length > 0 && (
                        <div className="p-4 rounded-xl bg-white border border-[#E5E7EB] shadow-2xs space-y-2">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-[#1F2937]">
                            <Shield className="w-4 h-4 text-[#2E7D32]" />
                            <span>Prevention Guidelines</span>
                          </div>
                          <ul className="space-y-1.5 text-xs text-[#4B5563]">
                            {currentResult.advice.prevention.map((prev, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-[#2E7D32] font-bold mt-0.5">✓</span>
                                <span className="leading-snug">{prev}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {currentResult.advice.management && currentResult.advice.management.length > 0 && (
                        <div className="p-4 rounded-xl bg-white border border-[#E5E7EB] shadow-2xs space-y-2">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-[#1F2937]">
                            <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                            <span>Actionable Treatment Steps</span>
                          </div>
                          <ol className="space-y-1.5 text-xs text-[#4B5563] list-decimal list-inside">
                            {currentResult.advice.management.map((action, idx) => (
                              <li key={idx} className="leading-snug">
                                <span className="ml-1">{action}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </div>

                    {/* When to Seek Expert Help */}
                    {currentResult.advice.whenToSeekExpertHelp && (
                      <div className="p-4 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#92400E]">
                          <AlertTriangle className="w-4 h-4 text-[#D97706]" />
                          <span>When to Consult an Agronomist</span>
                        </div>
                        <p className="text-xs sm:text-sm text-[#92400E] leading-relaxed">
                          {currentResult.advice.whenToSeekExpertHelp}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-white border border-[#E5E7EB] space-y-2 shadow-2xs">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">Advisory Notice</p>
                    <p className="text-xs sm:text-sm text-[#374151] font-medium leading-relaxed">
                      {currentResult.recommendation ?? "Follow standard crop protection practices and consult a certified agronomist if symptoms spread."}
                    </p>
                  </div>
                )}
              </>
            ) : currentResult.status === "NOT_A_PLANT" ? (
              <div className="p-4 rounded-xl bg-[#FEF2F2] border border-[#FECACA] flex items-start gap-3">
                <Leaf className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" />
                <div className="text-sm text-[#991B1B] space-y-1">
                  <p className="font-bold">No plant leaf detected in this photo.</p>
                  <p>The AI Stage-1 detector could not confirm a crop leaf. Please upload a clear photo of an affected leaf.</p>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
                <div className="text-xs text-[#92400E] space-y-1.5">
                  <p className="font-bold text-sm">Uncertain Prediction</p>
                  <p>
                    Confidence: <strong>{(currentResult.confidencePercent ?? currentResult.confidence * 100).toFixed(1)}%</strong>
                  </p>
                  <p>The AI could not identify this disease with certainty. Please upload a clearer leaf photo or consult a specialist.</p>
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 text-xs border-t border-[#E5E7EB]">
              <p className="text-[#6B7280]">
                {currentResult.id
                  ? `Diagnosis #${currentResult.id} automatically saved to your history.`
                  : "Uncertain predictions are not saved to active history."}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() =>
                    handleOpenConsultModal({
                      id: currentResult.id,
                      crop: currentResult.crop,
                      disease: currentResult.predictedDisease,
                      confidence: currentResult.confidencePercent ?? (currentResult.confidence > 1 ? currentResult.confidence : currentResult.confidence * 100),
                      severity: currentResult.severity,
                      recommendation: currentResult.advice?.summary || currentResult.recommendation,
                      imageUrl: currentResult.imageUrl || previewUrl,
                      advice: currentResult.advice,
                    })
                  }
                  className="rounded-full"
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  <span>Send to Specialist</span>
                </Button>

                <Link href="/farmer/consultations">
                  <Button variant="outline" className="rounded-full">
                    <span>All Consultations</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {analysisMessage && (
          <ErrorState
            variant="warning"
            title="Analysis Note"
            message={analysisMessage}
          />
        )}
      </div>

      {/* ─── 4. FILTER AND SEARCH BAR (Styled like My Farm) ──────────────────── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#E5E7EB]/80 shadow-2xs">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search crop or disease name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs sm:text-sm pl-9 pr-3.5 py-2 rounded-xl bg-[#F8FAF8] border border-[#E5E7EB] focus:bg-white focus:border-[#2E7D32] focus:outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value as any)}
            aria-label="Filter diagnosis results"
            className="text-xs font-semibold px-3 py-2 rounded-xl bg-[#F8FAF8] border border-[#E5E7EB] text-[#4B5563] focus:outline-none focus:border-[#2E7D32] cursor-pointer"
          >
            <option value="ALL">All Diagnostic Records</option>
            <option value="CONFIRMED">High Match (&gt;80%)</option>
            <option value="ACTION_NEEDED">Action Needed (High/Moderate)</option>
          </select>

          <div className="flex items-center bg-[#F1F5F2] rounded-xl p-0.5">
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === "cards" ? "bg-white text-[#2E7D32] shadow-2xs" : "text-[#6B7280]"
              }`}
              title="Cards grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === "table" ? "bg-white text-[#2E7D32] shadow-2xs" : "text-[#6B7280]"
              }`}
              title="Table view"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ─── 5. DIAGNOSTIC HISTORY LIST / GRID (Styled like My Farm) ─────────── */}
      {isLoadingHistory ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-[#E5E7EB] bg-white p-4 space-y-3 animate-pulse"
            >
              <div className="h-5 bg-[#E5E7EB] rounded-md w-3/4" />
              <div className="h-3.5 bg-[#F1F5F2] rounded-md w-1/2" />
              <div className="h-20 bg-[#F8FAF8] rounded-xl" />
            </div>
          ))}
        </div>
      ) : filteredAnalyses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#D1D5DB] bg-white p-8 text-center space-y-3">
          <div className="w-12 h-12 bg-[#E8F5E9] text-[#2E7D32] rounded-xl flex items-center justify-center mx-auto">
            <Leaf className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-[#1F2937]">
              {searchQuery || selectedFilter !== "ALL"
                ? "No matching diagnosis records found"
                : "No leaf scans recorded yet"}
            </h2>
            <p className="text-xs text-[#6B7280] mt-1 max-w-sm mx-auto">
              {searchQuery || selectedFilter !== "ALL"
                ? "Try adjusting your search criteria or resetting filters."
                : "Upload your first crop leaf photo above to detect diseases and receive verified treatment guidelines."}
            </p>
          </div>
          {!searchQuery && selectedFilter === "ALL" && (
            <Button onClick={scrollToWorkbench} size="sm" className="mt-2 rounded-lg">
              <Plus className="w-3.5 h-3.5 mr-1" />
              Upload Leaf Photo
            </Button>
          )}
        </div>
      ) : viewMode === "cards" ? (
        /* My Farm style Card Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredAnalyses.map((scan) => {
            const confNumber = Math.round(
              scan.confidence > 1 ? scan.confidence : scan.confidence * 100
            );
            const dateStr = scan.createdAt
              ? new Date(scan.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Recent";

            const severityBadgeVariant =
              scan.severity === "High"
                ? "danger"
                : scan.severity === "Moderate"
                ? "warning"
                : scan.severity === "Low"
                ? "success"
                : "neutral";

            return (
              <div
                key={scan.id}
                className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-2xs hover:border-[#C8E6C9] transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3.5">
                  {/* Card Header: Avatar / Image + Name + Badges */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {scan.imageUrl ? (
                        <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0 border border-[#E5E7EB] bg-black shadow-2xs group-hover:border-[#2E7D32]/50 transition-colors">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={scan.imageUrl}
                            alt={`${scan.crop} leaf`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                      ) : (
                        <CropAvatar name={scan.crop} size="lg" className="rounded-2xl shrink-0" />
                      )}

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-[10px] font-extrabold uppercase tracking-wider">
                            {scan.crop || "Crop"}
                          </span>
                          <Badge variant={severityBadgeVariant} className="text-[10px] px-2 py-0">
                            {scan.severity || "Standard"}
                          </Badge>
                        </div>

                        <h3 className="text-base font-black text-[#1F2937] tracking-tight group-hover:text-[#2E7D32] transition-colors truncate mt-1">
                          {scan.predictedDisease || "Condition"}
                        </h3>
                      </div>
                    </div>

                    {scan.id && (
                      <button
                        type="button"
                        onClick={() => {
                          setDeletingId(scan.id!);
                          setDeletingName(`${scan.crop} (${scan.predictedDisease})`);
                        }}
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-[#9CA3AF] hover:text-[#DC2626] hover:bg-[#FEF2F2] transition-colors cursor-pointer shrink-0"
                        title="Delete diagnosis"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* AI Confidence Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-xs font-semibold text-[#6B7280]">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-[#2E7D32]" />
                        <span>AI Confidence</span>
                      </span>
                      <span className="font-bold text-[#1F2937]">{confNumber}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-[#F1F5F2] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          confNumber >= 80
                            ? "bg-[#2E7D32]"
                            : confNumber >= 60
                            ? "bg-[#F59E0B]"
                            : "bg-[#9CA3AF]"
                        }`}
                        style={{ width: `${Math.min(100, Math.max(5, confNumber))}%` }}
                      />
                    </div>
                  </div>

                  {/* Advisory Summary Box */}
                  <div className="p-3.5 rounded-2xl bg-[#F8FAF8] border border-[#EEF0EE] space-y-1">
                    <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">
                      Advisory Summary
                    </p>
                    <p className="text-xs text-[#4B5563] font-medium line-clamp-2 leading-relaxed">
                      {scan.recommendation || "Follow standard crop protection and monitor for disease spread."}
                    </p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="pt-4 mt-4 border-t border-[#F1F5F2] flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-[#9CA3AF] font-medium">
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    <span>{dateStr}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleOpenConsultModal({
                        id: scan.id,
                        crop: scan.crop,
                        disease: scan.predictedDisease,
                        confidence: confNumber,
                        severity: scan.severity,
                        recommendation: scan.recommendation,
                        imageUrl: scan.imageUrl,
                      })
                    }
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E8F5E9] hover:bg-[#2E7D32] text-[#2E7D32] hover:text-white font-bold text-xs transition-all cursor-pointer border border-[#C8E6C9] hover:border-transparent"
                  >
                    <Send className="w-3 h-3" />
                    <span>Verify with Expert</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* My Farm style Clean Table View */
        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto -mx-5 sm:-mx-6">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#F1F5F2] text-[10px] uppercase font-bold text-[#9CA3AF] tracking-wider">
                  <th className="py-3 px-5 sm:px-6">Crop &amp; Disease</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Severity</th>
                  <th className="py-3 px-3 text-right">Confidence</th>
                  <th className="py-3 px-5 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F2]">
                {filteredAnalyses.map((scan) => {
                  const confNumber = Math.round(
                    scan.confidence > 1 ? scan.confidence : scan.confidence * 100
                  );
                  const dateStr = scan.createdAt
                    ? new Date(scan.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Recent";

                  return (
                    <tr key={scan.id} className="hover:bg-[#F8FAF8] transition-colors group">
                      <td className="py-3.5 px-5 sm:px-6">
                        <div className="flex items-center gap-3">
                          {scan.imageUrl ? (
                            <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-[#E5E7EB] bg-black">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={scan.imageUrl}
                                alt={scan.crop || "Leaf"}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <CropAvatar name={scan.crop} size="sm" className="rounded-xl shrink-0" />
                          )}
                          <div className="min-w-0">
                            <p className="font-bold text-[#1F2937] group-hover:text-[#2E7D32] transition-colors truncate">
                              {scan.predictedDisease || "Condition"}
                            </p>
                            <span className="text-[10px] font-bold text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-md uppercase">
                              {scan.crop || "Crop"}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-[#6B7280] font-medium whitespace-nowrap">
                        {dateStr}
                      </td>

                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <Badge
                          variant={
                            scan.severity === "High"
                              ? "danger"
                              : scan.severity === "Moderate"
                              ? "warning"
                              : "success"
                          }
                          className="text-[11px] font-bold px-2.5 py-0.5"
                        >
                          {scan.severity || "Standard"}
                        </Badge>
                      </td>

                      <td className="py-3.5 px-3 text-right font-black text-[#1F2937] whitespace-nowrap">
                        {confNumber}%
                      </td>

                      <td className="py-3.5 px-5 sm:px-6 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleOpenConsultModal({
                                id: scan.id,
                                crop: scan.crop,
                                disease: scan.predictedDisease,
                                confidence: confNumber,
                                severity: scan.severity,
                                recommendation: scan.recommendation,
                                imageUrl: scan.imageUrl,
                              })
                            }
                            className="px-3 py-1 rounded-full bg-[#E8F5E9] hover:bg-[#2E7D32] text-[#2E7D32] hover:text-white font-bold text-xs transition-colors border border-[#C8E6C9] hover:border-transparent cursor-pointer"
                          >
                            Verify with Expert
                          </button>

                          {scan.id && (
                            <button
                              type="button"
                              onClick={() => {
                                setDeletingId(scan.id!);
                                setDeletingName(`${scan.crop} (${scan.predictedDisease})`);
                              }}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9CA3AF] hover:text-[#DC2626] hover:bg-[#FEF2F2] transition-colors cursor-pointer"
                              title="Delete diagnosis"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── 6. CONFIRM DELETE DIALOG ────────────────────────────────────────── */}
      <ConfirmDialog
        open={Boolean(deletingId)}
        title="Delete Diagnostic Record?"
        description={`Are you sure you want to delete this diagnosis record for ${deletingName}? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Keep Record"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={() => deletingId && handleDeleteDiagnosis(deletingId)}
        onCancel={() => setDeletingId(null)}
      />

      {/* ─── 7. SEND TO EXPERT MODAL ─────────────────────────────────────────── */}
      <SendToExpertModal
        isOpen={isConsultModalOpen}
        onClose={() => setIsConsultModalOpen(false)}
        diagnosis={consultModalData}
      />
    </div>
  );
}
