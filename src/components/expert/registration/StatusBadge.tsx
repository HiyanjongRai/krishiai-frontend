import React from "react";
import { ApplicationStatus } from "@/types/expert-application";
import {
  FileEdit,
  Send,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface StatusBadgeProps {
  status: ApplicationStatus;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function StatusBadge({ status, size = "md", className = "" }: StatusBadgeProps) {
  const config: Record<
    ApplicationStatus,
    {
      label: string;
      icon: React.ComponentType<{ className?: string }>;
      bg: string;
      text: string;
      border: string;
      dot: string;
    }
  > = {
    DRAFT: {
      label: "Draft Application",
      icon: FileEdit,
      bg: "bg-slate-100",
      text: "text-slate-700",
      border: "border-slate-300",
      dot: "bg-slate-400",
    },
    SUBMITTED: {
      label: "Application Submitted",
      icon: Send,
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      dot: "bg-blue-500",
    },
    UNDER_REVIEW: {
      label: "Under Verification",
      icon: Clock,
      bg: "bg-amber-50",
      text: "text-amber-800",
      border: "border-amber-200",
      dot: "bg-amber-500",
    },
    ADDITIONAL_INFORMATION_REQUIRED: {
      label: "Action Required",
      icon: AlertCircle,
      bg: "bg-orange-50",
      text: "text-orange-800",
      border: "border-orange-300",
      dot: "bg-orange-500",
    },
    APPROVED: {
      label: "Verified Expert",
      icon: CheckCircle2,
      bg: "bg-emerald-50",
      text: "text-emerald-800",
      border: "border-emerald-200",
      dot: "bg-emerald-500",
    },
    REJECTED: {
      label: "Requires Changes",
      icon: XCircle,
      bg: "bg-rose-50",
      text: "text-rose-800",
      border: "border-rose-200",
      dot: "bg-rose-500",
    },
  };

  const { label, icon: Icon, bg, text, border, dot } = config[status] || config.DRAFT;

  const sizeClasses = {
    sm: "px-2.5 py-0.5 text-xs gap-1.5",
    md: "px-3 py-1 text-xs sm:text-sm gap-2 font-semibold",
    lg: "px-4 py-1.5 text-sm sm:text-base gap-2.5 font-bold",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-2xs ${bg} ${text} ${border} ${sizeClasses[size]} ${className}`}
    >
      <span className={`w-2 h-2 rounded-full ${dot} animate-pulse shrink-0`} />
      <Icon className="w-4 h-4 shrink-0" />
      <span>{label}</span>
    </span>
  );
}
