import React from "react";
import { Skeleton } from "./skeleton";
import { cn } from "@/utils/cn";

export interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  className?: string;
}

export function TableSkeleton({
  rows = 5,
  columns = 5,
  showHeader = true,
  className,
}: TableSkeletonProps) {
  // Width presets for realistic staggered data preview
  const colWidths = ["w-32 sm:w-44", "w-24 sm:w-36", "w-28 sm:w-40", "w-20 sm:w-28", "w-16 sm:w-24"];

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm",
        className
      )}
      aria-busy="true"
      aria-label="Loading table data"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          {showHeader && (
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                {Array.from({ length: columns }).map((_, i) => (
                  <th key={i} className="py-3.5 px-4 sm:px-5">
                    <Skeleton className="h-4 w-20 rounded-md bg-slate-200/90" />
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody className="divide-y divide-slate-100">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-slate-50/50 transition-colors">
                {Array.from({ length: columns }).map((_, colIndex) => {
                  const widthClass = colWidths[colIndex % colWidths.length];
                  return (
                    <td key={colIndex} className="py-4 px-4 sm:px-5">
                      {colIndex === 0 ? (
                        <div className="flex items-center gap-3">
                          <Skeleton className="w-9 h-9 rounded-full shrink-0" />
                          <div className="space-y-1.5 flex-1">
                            <Skeleton className={cn("h-3.5 rounded-md", widthClass)} />
                            <Skeleton className="h-2.5 w-24 rounded-md" />
                          </div>
                        </div>
                      ) : (
                        <Skeleton className={cn("h-3.5 rounded-md", widthClass)} />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
