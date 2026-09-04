import React from "react";
import { Card } from "@/components/ui/card";

export function AnalyticsCard({ title, summary }: { title: string; summary: string }) {
  return (
    <Card className="space-y-2">
      <h4 className="font-bold text-slate-900 text-sm">{title}</h4>
      <p className="text-xs text-slate-500">{summary}</p>
    </Card>
  );
}
