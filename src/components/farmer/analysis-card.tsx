import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function AnalysisCard({ crop, disease, confidence, date }: { crop: string; disease: string; confidence: number; date: string }) {
  return (
    <Card className="space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500">{crop}</span>
        <Badge variant={confidence > 80 ? "success" : "warning"}>{confidence}% Confidence</Badge>
      </div>
      <h4 className="font-bold text-slate-900 text-sm">{disease}</h4>
      <p className="text-[11px] text-slate-400">Analyzed on {date}</p>
    </Card>
  );
}
