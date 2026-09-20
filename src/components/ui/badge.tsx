import React from "react";
import { cn } from "@/utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "success" | "warning" | "danger" | "info" | "neutral";
  dot?: boolean;
}

export function Badge({
  className,
  variant = "neutral",
  dot = false,
  children,
  ...props
}: BadgeProps) {
  const variants = {
    success: "bg-[#E8F5E9] text-[#2E7D32] border-[#A5D6A7]",
    warning: "bg-[#FEF3C7] text-[#F59E0B] border-[#FCD34D]",
    danger: "bg-[#FEE2E2] text-[#DC2626] border-[#FCA5A5]",
    info: "bg-[#DBEAFE] text-[#2563EB] border-[#93C5FD]",
    neutral: "bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB]",
  };

  const dotColors = {
    success: "bg-[#2E7D32]",
    warning: "bg-[#F59E0B]",
    danger: "bg-[#DC2626]",
    info: "bg-[#2563EB]",
    neutral: "bg-[#6B7280]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-[11px] font-semibold tracking-tight",
        variants[variant],
        className
      )}
      {...props}
    >
      {dot && <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotColors[variant])} />}
      {children}
    </span>
  );
}
