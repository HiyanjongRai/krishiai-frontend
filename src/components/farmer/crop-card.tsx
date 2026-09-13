import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sprout, ArrowUpRight, Scan } from "lucide-react";

export function CropCard({
  name,
  variety,
  stage,
  health,
}: {
  name: string;
  variety: string;
  stage: string;
  health: "HEALTHY" | "ATTENTION" | "HIGH_RISK";
}) {
  const badgeVariants = {
    HEALTHY: "success",
    ATTENTION: "warning",
    HIGH_RISK: "danger",
  } as const;

  const healthLabels = {
    HEALTHY: "Optimal",
    ATTENTION: "Review",
    HIGH_RISK: "Critical",
  };

  return (
    <Card className="space-y-3.5 hover:border-[#BCE9D5] transition-all">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#DDF4EA] text-[#0F9F68] flex items-center justify-center shrink-0">
            <Sprout className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-tight truncate">
              {name}
            </h4>
            <p className="text-xs text-slate-500 font-medium truncate">{variety}</p>
          </div>
        </div>

        <Badge variant={badgeVariants[health]} className="shrink-0 text-[10px]">
          {healthLabels[health]}
        </Badge>
      </div>

      <div className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100 text-xs">
        <span className="text-slate-400 font-medium block text-[10px] uppercase tracking-wider">
          Growth Stage
        </span>
        <span className="font-semibold text-slate-800 truncate block mt-0.5">{stage}</span>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
        <Link
          href="/farmer/analysis"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F9F68] hover:text-[#0D8A5A] transition-colors py-1"
        >
          <Scan className="w-3.5 h-3.5" />
          <span>Diagnose Crop</span>
        </Link>
        <Link
          href="/farmer/dashboard"
          className="w-7 h-7 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#0F9F68] hover:border-[#BCE9D5] transition-colors"
          title="View farm metrics"
        >
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </Card>
  );
}
