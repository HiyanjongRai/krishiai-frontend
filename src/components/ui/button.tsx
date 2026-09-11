import React from "react";
import { cn } from "@/utils/cn";
import { LoadingSpinner } from "./loading-spinner";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  rounded?: "default" | "full";
  isLoading?: boolean;
  loadingText?: string;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  rounded = "full",
  isLoading = false,
  loadingText,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-semibold transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9F68]/30 active:scale-[0.98]";

  const roundedStyles = rounded === "full" ? "rounded-full" : "rounded-xl";

  const variants = {
    primary: "bg-[#0F9F68] hover:bg-[#0D8A5A] text-white shadow-sm hover:shadow",
    secondary: "bg-[#DDF4EA] hover:bg-[#c9efde] text-[#0F9F68] border border-[#BCE9D5]",
    outline: "bg-white hover:bg-gray-50 text-[#171717] border border-gray-200 shadow-xs",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
    danger: "bg-rose-600 hover:bg-rose-700 text-white shadow-xs",
  };

  const sizes = {
    sm: "text-xs px-3.5 py-1.5 gap-1.5 min-h-[32px]",
    md: "text-xs sm:text-sm px-4.5 py-2 gap-2 min-h-[38px]",
    lg: "text-sm sm:text-base px-6 py-2.5 gap-2.5 min-h-[44px]",
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
      className={cn(base, roundedStyles, variants[variant], sizes[size], className)}
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
