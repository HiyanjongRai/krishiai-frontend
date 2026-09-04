import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function CropCard({ name, variety, stage, health }: { name: string; variety: string; stage: string; health: "HEALTHY" | "ATTENTION" | "HIGH_RISK" }) {
  const badgeVariants = {
    HEALTHY: "success",
    ATTENTION: "warning",
    HIGH_RISK: "danger",
  } as const;

  return (
    <Card className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-slate-900">{name}</h4>
        <Badge variant={badgeVariants[health]}>{health}</Badge>
      </div>
      <p className="text-xs text-slate-500">Variety: {variety}</p>
      <p className="text-xs text-slate-600 font-medium">Stage: {stage}</p>
    </Card>
  );
}
