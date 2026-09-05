import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";

export interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: "primary" | "white" | "muted" | "current";
  label?: string;
}

const sizeClasses = {
  xs: "w-3.5 h-3.5",
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-8 h-8",
  xl: "w-10 h-10",
};

const colorClasses = {
  primary: "text-[#166534]",
  white: "text-white",
  muted: "text-slate-400",
  current: "text-current",
};

export function LoadingSpinner({
  size = "md",
  color = "primary",
  label = "Loading...",
  className,
  ...props
}: LoadingSpinnerProps) {
  return (
    <span
      role="status"
      aria-live="polite"
      className={cn("inline-flex items-center justify-center shrink-0", className)}
      {...props}
    >
      <Loader2
        className={cn(
          "animate-spin motion-reduce:animate-none",
          sizeClasses[size],
          colorClasses[color]
        )}
        aria-hidden="true"
      />
      {label && <span className="sr-only">{label}</span>}
    </span>
  );
}
