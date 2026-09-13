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
        "rounded-[20px] sm:rounded-[24px] border border-[rgba(234,234,236,0.85)] bg-white p-4 sm:p-5 md:p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04),0_2px_6px_-1px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
