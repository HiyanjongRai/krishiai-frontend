import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Scan } from "lucide-react";
import { CropAvatar } from "@/components/ui/crop-avatar";

export function CropCard({
  name,
  variety,
  stage,
  health,
  imageUrl,
}: {
  name: string;
  variety: string;
  stage: string;
  health: "HEALTHY" | "ATTENTION" | "HIGH_RISK";
  imageUrl?: string | null;
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
    <Card className="space-y-3.5 hover:border-[#C8E6C9] transition-all">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <CropAvatar name={name} imageUrl={imageUrl} size="md" />
          <div className="min-w-0">
            <h4 className="font-bold text-[#1F2937] text-sm sm:text-base leading-tight truncate">
              {name}
            </h4>
            <p className="text-xs text-[#6B7280] font-medium truncate">{variety}</p>
          </div>
        </div>

        <Badge variant={badgeVariants[health]} className="shrink-0 text-[10px]">
          {healthLabels[health]}
        </Badge>
      </div>

      <div className="p-2.5 rounded-xl bg-[#F8FAF8] border border-[#EEF0EE] text-xs">
        <span className="text-[#9CA3AF] font-medium block text-[10px] uppercase tracking-wider">
          Growth Stage
        </span>
        <span className="font-semibold text-[#1F2937] truncate block mt-0.5">{stage}</span>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-[#EEF0EE]">
        <Link
          href="/farmer/analysis"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2E7D32] hover:text-[#256B2A] transition-colors py-1"
        >
          <Scan className="w-3.5 h-3.5" />
          <span>Diagnose Crop</span>
        </Link>
        <Link
          href="/farmer/dashboard"
          className="w-7 h-7 rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#9CA3AF] hover:text-[#2E7D32] hover:border-[#C8E6C9] transition-colors"
          title="View farm metrics"
        >
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </Card>
  );
}
