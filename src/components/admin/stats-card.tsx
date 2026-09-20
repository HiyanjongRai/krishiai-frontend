import React from "react";
import { Card } from "@/components/ui/card";

export function StatsCard({ title, count, change }: { title: string; count: string | number; change?: string }) {
  return (
    <Card className="space-y-1">
      <p className="text-xs font-semibold text-[#6B7280] uppercase">{title}</p>
      <p className="text-3xl font-black text-[#1F2937]">{count}</p>
      {change && <p className="text-xs text-[#2E7D32] font-medium">{change}</p>}
    </Card>
  );
}
