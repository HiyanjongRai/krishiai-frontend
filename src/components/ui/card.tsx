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
        "rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-[0_12px_34px_-28px_#E5E7EB] transition-colors hover:border-[#C8E6C9] hover:bg-[#FCFEFC] sm:p-5 md:p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
