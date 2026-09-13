import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scan, ShieldAlert, CheckCircle2, ArrowRight } from "lucide-react";

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
    <Card className="space-y-3.5 hover:border-[#BCE9D5] transition-all">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
            <Scan className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block truncate">
              {crop}
            </span>
            <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-tight truncate">
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
        <div className="flex justify-between text-[11px] text-slate-500 font-medium">
          <span>AI Diagnostic Match</span>
          <span className="font-bold text-slate-800">{confidence}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isHighConfidence ? "bg-[#0F9F68]" : "bg-amber-500"
            }`}
            style={{ width: `${confidence}%` }}
          />
        </div>
      </div>

      <div className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100 text-xs">
        <p className="text-slate-400 font-medium text-[10px] uppercase tracking-wider">
          Advisory Recommendation
        </p>
        <p className="text-slate-700 font-medium mt-0.5 text-xs line-clamp-2 leading-relaxed">
          {recommendation}
        </p>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs text-slate-400 font-medium">
        <span>Analyzed on {date}</span>
        <Link
          href="/farmer/consultations"
          className="inline-flex items-center gap-1 font-bold text-[#0F9F68] hover:text-[#0D8A5A] transition-colors"
        >
          <span>Ask Agronomist</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </Card>
  );
}
