import React from "react";
import { Card } from "@/components/ui/card";

export function DashboardCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
}) {
  return (
    <Card className="flex items-center justify-between p-5">
      <div>
        <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">{title}</p>
        <p className="text-2xl font-bold text-[#1F2937] mt-1">{value}</p>
        {subtitle && <p className="text-xs text-[#9CA3AF] mt-0.5">{subtitle}</p>}
      </div>
      {icon && <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center">{icon}</div>}
    </Card>
  );
}
