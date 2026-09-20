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

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant = "primary",
    size = "md",
    rounded = "default",
    isLoading = false,
    loadingText,
    disabled,
    children,
    ...props
  },
  ref
) {
  const base =
    "inline-flex items-center justify-center font-semibold transition-all duration-150 cursor-pointer disabled:border-[#E5E7EB] disabled:bg-[#E5E7EB] disabled:text-[#9CA3AF] disabled:opacity-100 disabled:cursor-not-allowed select-none focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#E8F5E9] active:scale-[0.98]";

  const roundedStyles = rounded === "full" ? "rounded-full" : "rounded-xl";

  const variants = {
    primary: "bg-[#2E7D32] hover:bg-[#256B2A] text-white shadow-sm",
    secondary: "bg-white hover:bg-[#E8F5E9] text-[#2E7D32] border border-[#2E7D32]",
    outline: "bg-white hover:bg-[#F1F5F2] text-[#1F2937] border border-[#E5E7EB] shadow-sm",
    ghost: "bg-transparent hover:bg-[#F1F5F2] text-[#4B5563] hover:text-[#2E7D32]",
    danger: "bg-[#DC2626] hover:bg-[#B91C1C] text-white shadow-sm",
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
      ref={ref}
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
});
