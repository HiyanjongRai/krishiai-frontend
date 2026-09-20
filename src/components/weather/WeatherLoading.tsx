import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { CloudSun } from "lucide-react";

interface WeatherLoadingProps {
  statusMessage?: string;
}

export function WeatherLoading({ statusMessage = "Detecting your location..." }: WeatherLoadingProps) {
  return (
    <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 space-y-4 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE]">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32]">
            <CloudSun className="w-4 h-4 animate-spin text-[#2E7D32]" style={{ animationDuration: "3s" }} />
          </div>
          <div>
            <p className="text-xs font-bold text-[#1F2937]">Local Weather</p>
            <p className="text-[10px] text-[#2E7D32] font-semibold animate-pulse">{statusMessage}</p>
          </div>
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      {/* Main Temperature & Condition Skeleton */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F8FAF8] border border-[#EEF0EE]">
        <div className="flex items-center gap-3.5">
          <Skeleton className="w-13 h-13 rounded-2xl" />
          <div className="space-y-1.5">
            <Skeleton className="h-8 w-20 rounded-lg" />
            <Skeleton className="h-3 w-28 rounded-md" />
          </div>
        </div>
        <div className="text-right space-y-1">
          <Skeleton className="h-3 w-16 ml-auto rounded-md" />
          <Skeleton className="h-4 w-24 rounded-md" />
        </div>
      </div>

      {/* Metrics Grid Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-2.5 rounded-xl bg-[#F1F5F2]/60 border border-[#E5E7EB]/60 space-y-1">
            <Skeleton className="h-2.5 w-12 rounded" />
            <Skeleton className="h-4 w-16 rounded" />
          </div>
        ))}
      </div>

      {/* Advisory Skeleton */}
      <div className="p-3 rounded-xl bg-[#FEF3C7]/40 border border-[#FCD34D]/40 flex items-center gap-2.5">
        <Skeleton className="w-4 h-4 rounded-full shrink-0" />
        <div className="space-y-1 flex-1">
          <Skeleton className="h-2.5 w-24 rounded" />
          <Skeleton className="h-3 w-full rounded" />
        </div>
      </div>
    </div>
  );
}
