"use client";

import React, { useState } from "react";
import { AnalysisCard } from "@/components/farmer/analysis-card";
import { Upload, Camera, Sparkles, CheckCircle2, AlertCircle, FileImage } from "lucide-react";
import { useToast } from "@/providers/toast-provider";

export default function FarmerAnalysisPage() {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const [analyses, setAnalyses] = useState<{
    id: string;
    crop: string;
    disease: string;
    confidence: number;
    date: string;
    severity: "Low" | "Moderate" | "High";
    recommendation: string;
  }[]>([
    {
      id: "scan-1",
      crop: "Tomato",
      disease: "Early Blight (Alternaria solani)",
      confidence: 94,
      date: "Today, 10:30 AM",
      severity: "Moderate",
      recommendation: "Apply Mancozeb 75% WP @ 2g/liter of water. Avoid overhead sprinkler irrigation to keep foliage dry.",
    },
    {
      id: "scan-2",
      crop: "Potato",
      disease: "Late Blight (Phytophthora infestans)",
      confidence: 88,
      date: "Yesterday",
      severity: "High",
      recommendation: "Immediate systemic fungicide spray (Metalaxyl + Mancozeb) recommended. Inspect surrounding rows.",
    },
    {
      id: "scan-3",
      crop: "Maize",
      disease: "Fall Armyworm Damage",
      confidence: 82,
      date: "3 days ago",
      severity: "Moderate",
      recommendation: "Apply neem-based azadirachtin or chlorantraniliprole in the leaf whorls during twilight hours.",
    },
  ]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRunDiagnosis = () => {
    if (!selectedFile) return;
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      const newScan = {
        id: `scan-${Date.now()}`,
        crop: "Tomato",
        disease: "Powdery Mildew (Oidium neolycopersici)",
        confidence: 91,
        date: "Just now",
        severity: "Low" as const,
        recommendation: "Spray wettable sulfur @ 2.5g/L water in early morning. Ensure good air circulation.",
      };
      setAnalyses([newScan, ...analyses]);
      setSelectedFile(null);
      setPreviewUrl(null);
      toast.success({
        title: "AI Analysis Complete",
        description: "Diagnosis identified with 91% confidence.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200/80">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#0F9F68]">
            AI Diagnostics
          </p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-[#171717]">
            Crop Health &amp; Leaf Analysis
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-gray-500 font-medium">
            Upload leaf photos to instantly detect pests, blight, or nutrient deficiencies.
          </p>
        </div>
      </div>

      {/* Upload Diagnostic Workbench */}
      <div className="rounded-2xl sm:rounded-3xl border border-[rgba(234,234,236,0.85)] bg-white p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#DDF4EA] text-[#0F9F68] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">New Crop Scan</h2>
              <p className="text-[11px] text-gray-400">Take a photo with your mobile camera or select an image</p>
            </div>
          </div>
        </div>

        {/* Dropzone Container */}
        <div className="relative border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-[#0F9F68] transition-colors bg-slate-50/50">
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            id="leaf-upload"
            className="sr-only"
          />

          {previewUrl ? (
            <div className="space-y-4 max-w-sm mx-auto">
              <div className="w-40 h-40 mx-auto rounded-2xl overflow-hidden border-2 border-[#0F9F68] shadow-md relative bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Crop preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs font-semibold text-slate-700 truncate">
                {selectedFile?.name}
              </p>
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={handleRunDiagnosis}
                  disabled={isScanning}
                  className="px-5 py-2.5 bg-[#0F9F68] hover:bg-[#0D8A5A] text-white text-xs font-bold rounded-full shadow-xs transition-all disabled:opacity-50 cursor-pointer min-h-[44px]"
                >
                  {isScanning ? "Analyzing leaf with AI..." : "Run AI Diagnosis"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-slate-700 text-xs font-semibold rounded-full transition-colors cursor-pointer min-h-[44px]"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <label
              htmlFor="leaf-upload"
              className="flex flex-col items-center justify-center cursor-pointer space-y-2 py-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#DDF4EA] text-[#0F9F68] flex items-center justify-center shadow-xs">
                <Camera className="w-7 h-7" />
              </div>
              <p className="text-sm font-bold text-slate-800">
                Snap or upload infected crop leaf
              </p>
              <p className="text-xs text-gray-400 max-w-xs">
                Tap to use phone camera or browse files (JPG, PNG up to 10MB)
              </p>
              <span className="inline-flex items-center gap-1.5 px-4 py-2 mt-2 rounded-full bg-[#171717] text-white text-xs font-bold shadow-xs">
                <Upload className="w-3.5 h-3.5" />
                <span>Select Image</span>
              </span>
            </label>
          )}
        </div>
      </div>

      {/* Recent Scans Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-slate-900 tracking-tight">
            Recent Diagnostic History
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            {analyses.length} scans saved
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {analyses.map((scan) => (
            <AnalysisCard
              key={scan.id}
              crop={scan.crop}
              disease={scan.disease}
              confidence={scan.confidence}
              date={scan.date}
              severity={scan.severity}
              recommendation={scan.recommendation}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
