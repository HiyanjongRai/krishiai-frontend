import React from "react";
import { cn } from "@/utils/cn";

export function Card({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs hover:border-slate-300 transition-colors",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
