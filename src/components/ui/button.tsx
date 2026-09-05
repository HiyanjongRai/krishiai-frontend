import React from "react";
import { cn } from "@/utils/cn";
import { LoadingSpinner } from "./loading-spinner";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  loadingText?: string;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  isLoading = false,
  loadingText,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed select-none";

  const variants = {
    primary: "bg-[#0f3d26] hover:bg-[#14532d] text-white shadow-xs hover:shadow",
    secondary: "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200",
    outline: "bg-white hover:bg-slate-50 text-slate-800 border border-slate-300",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-700",
    danger: "bg-rose-600 hover:bg-rose-700 text-white shadow-xs",
  };

  const sizes = {
    sm: "text-xs px-3 py-1.5 gap-1.5 min-h-[32px]",
    md: "text-sm px-4.5 py-2.5 gap-2 min-h-[40px]",
    lg: "text-base px-6 py-3.5 gap-2.5 min-h-[48px]",
  };

  const spinnerSizes = {
    sm: "xs" as const,
    md: "sm" as const,
    lg: "md" as const,
  };

  const spinnerColors = {
    primary: "white" as const,
    secondary: "primary" as const,
    outline: "primary" as const,
    ghost: "primary" as const,
    danger: "white" as const,
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      aria-busy={isLoading ? "true" : undefined}
      {...props}
    >
      {isLoading ? (
        <>
          <LoadingSpinner
            size={spinnerSizes[size]}
            color={spinnerColors[variant]}
          />
          <span>{loadingText || children}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

