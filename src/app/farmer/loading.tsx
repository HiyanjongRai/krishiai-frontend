import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function FarmerLoading() {
  return (
    <div
      className="space-y-6 w-full animate-in fade-in duration-150"
      aria-busy="true"
      aria-label="Loading farmer workspace"
    >
      {/* Hero Greeting Skeleton */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 rounded-xl" />
          <Skeleton className="h-4 w-80 rounded-lg" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-36 rounded-full" />
          <Skeleton className="h-9 w-40 rounded-full" />
        </div>
      </div>

      {/* Grid: 8 Cols Core + 4 Cols Aside */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column: Actions & Cards */}
        <div className="xl:col-span-8 space-y-6">
          {/* Quick Action boxes */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))}
          </div>

          {/* Stats Bar */}
          <Skeleton className="h-32 rounded-3xl" />

          {/* Major Section (Crop Health / Diagnostics) */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-48 rounded-lg" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <Skeleton className="h-40 rounded-2xl" />
              <Skeleton className="h-40 rounded-2xl" />
            </div>
          </div>
        </div>

        {/* Right Column: Weather & Advisories */}
        <div className="xl:col-span-4 space-y-6">
          <Skeleton className="h-56 rounded-3xl" />
          <Skeleton className="h-64 rounded-3xl" />
        </div>
      </div>
    </div>
  );
}
