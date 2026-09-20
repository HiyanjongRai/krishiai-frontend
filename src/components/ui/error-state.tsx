import React from "react";
import { AlertTriangle, RefreshCw, ShieldAlert } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/utils/cn";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
  retryLabel?: string;
  variant?: "error" | "warning" | "restricted";
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this information. Please try again.",
  onRetry,
  isRetrying = false,
  retryLabel = "Try Again",
  variant = "error",
  className,
}: ErrorStateProps) {
  const isRestricted = variant === "restricted";
  const Icon = isRestricted ? ShieldAlert : AlertTriangle;
  const tone =
    variant === "warning"
      ? "border-[#FCD34D] bg-[#FEF3C7]/35 text-[#F59E0B]"
      : isRestricted
        ? "border-[#93C5FD] bg-[#DBEAFE]/35 text-[#2563EB]"
        : "border-[#FCA5A5] bg-[#FEE2E2]/35 text-[#DC2626]";

  return (
    <div className={cn("rounded-2xl border bg-white p-6 text-center shadow-sm", tone, className)} role="alert">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-sm font-bold text-[#1F2937]">{title}</h3>
      <p className="mx-auto mt-1.5 max-w-md text-xs leading-relaxed text-[#4B5563]">{message}</p>
      {onRetry && (
        <Button
          type="button"
          size="sm"
          variant={variant === "error" ? "danger" : "secondary"}
          className="mt-4"
          onClick={onRetry}
          isLoading={isRetrying}
          loadingText="Retrying..."
        >
          <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
