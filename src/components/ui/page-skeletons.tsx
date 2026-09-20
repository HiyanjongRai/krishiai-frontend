import React from "react";
import { Skeleton } from "./skeleton";
import { TableSkeleton } from "./table-skeleton";
import { cn } from "@/utils/cn";

export function PageHeaderSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-2 border-b border-[#E5E7EB] pb-4", className)}>
      <Skeleton className="h-3 w-28" />
      <Skeleton className="h-8 w-72 max-w-full" />
      <Skeleton className="h-4 w-[520px] max-w-full" />
    </div>
  );
}

export function DashboardCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm", className)} aria-busy="true">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-7 w-20" />
        </div>
        <Skeleton className="h-9 w-9 rounded-xl" />
      </div>
      <Skeleton className="mt-4 h-3 w-36" />
    </div>
  );
}

export function DashboardSkeleton({ cards = 4, table = true }: { cards?: number; table?: boolean }) {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading dashboard">
      <PageHeaderSkeleton />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: cards }).map((_, index) => (
          <DashboardCardSkeleton key={index} />
        ))}
      </div>
      {table && <TableSkeleton rows={5} columns={5} />}
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-5" aria-busy="true" aria-label="Loading profile">
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <Skeleton className="h-20 w-20 rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-56" />
            <Skeleton className="h-4 w-72" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-40 rounded-2xl" />
      </div>
      <Skeleton className="h-72 rounded-2xl" />
    </div>
  );
}

export function FormSkeleton({ fields = 5 }: { fields?: number }) {
  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm" aria-busy="true">
      <Skeleton className="h-5 w-48" />
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {Array.from({ length: fields }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-11 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function MessageSkeleton() {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Loading messages">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className={cn("flex items-start gap-2.5", index % 2 ? "justify-end" : "")}>
          {index % 2 === 0 && <Skeleton className="h-8 w-8 rounded-full" />}
          <Skeleton className={cn("h-14 rounded-2xl", index % 2 ? "w-64" : "w-80 max-w-full")} />
        </div>
      ))}
    </div>
  );
}
