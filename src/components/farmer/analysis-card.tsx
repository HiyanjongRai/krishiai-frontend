import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scan, ShieldAlert, CheckCircle2, ArrowRight } from "lucide-react";
import { CropAvatar } from "@/components/ui/crop-avatar";

export function AnalysisCard({
  crop,
  disease,
  confidence,
  date,
  severity = "Moderate",
  recommendation = "Apply copper fungicide spray during morning hours.",
}: {
  crop: string;
  disease: string;
  confidence: number;
  date: string;
  severity?: "Low" | "Moderate" | "High";
  recommendation?: string;
}) {
  const isHighConfidence = confidence >= 80;

  return (
    <Card className="space-y-3.5 hover:border-[#C8E6C9] transition-all">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <CropAvatar name={crop} size="md" />
          <div className="min-w-0">
            <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider block truncate">
              {crop}
            </span>
            <h4 className="font-bold text-[#1F2937] text-sm sm:text-base leading-tight truncate">
              {disease}
            </h4>
          </div>
        </div>

        <Badge
          variant={isHighConfidence ? "success" : "warning"}
          className="shrink-0 text-[10px]"
        >
          {confidence}% Confidence
        </Badge>
      </div>

      {/* Confidence meter */}
      <div className="space-y-1">
        <div className="flex justify-between text-[11px] text-[#6B7280] font-medium">
          <span>AI Diagnostic Match</span>
          <span className="font-bold text-[#1F2937]">{confidence}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-[#F1F5F2] overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isHighConfidence ? "bg-[#2E7D32]" : "bg-[#F59E0B]"
            }`}
            style={{ width: `${confidence}%` }}
          />
        </div>
      </div>

      <div className="p-2.5 rounded-xl bg-[#F8FAF8] border border-[#EEF0EE] text-xs">
        <p className="text-[#9CA3AF] font-medium text-[10px] uppercase tracking-wider">
          Advisory Recommendation
        </p>
        <p className="text-[#4B5563] font-medium mt-0.5 text-xs line-clamp-2 leading-relaxed">
          {recommendation}
        </p>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-[#EEF0EE] text-xs text-[#9CA3AF] font-medium">
        <span>Analyzed on {date}</span>
        <Link
          href="/farmer/consultations"
          className="inline-flex items-center gap-1 font-bold text-[#2E7D32] hover:text-[#256B2A] transition-colors"
        >
          <span>Ask Agronomist</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </Card>
  );
}
