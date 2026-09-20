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
      bg: "bg-[#F1F5F2]",
      text: "text-[#4B5563]",
      border: "border-[#D1D5DB]",
      dot: "bg-[#F1F5F2]",
    },
    SUBMITTED: {
      label: "Application Submitted",
      icon: Send,
      bg: "bg-[#DBEAFE]",
      text: "text-[#2563EB]",
      border: "border-[#93C5FD]",
      dot: "bg-[#2563EB]",
    },
    UNDER_REVIEW: {
      label: "Under Verification",
      icon: Clock,
      bg: "bg-[#FEF3C7]",
      text: "text-[#F59E0B]",
      border: "border-[#FCD34D]",
      dot: "bg-[#F59E0B]",
    },
    ADDITIONAL_INFORMATION_REQUIRED: {
      label: "Action Required",
      icon: AlertCircle,
      bg: "bg-[#FEF3C7]",
      text: "text-[#F59E0B]",
      border: "border-[#FCD34D]",
      dot: "bg-[#FEF3C7]0",
    },
    APPROVED: {
      label: "Verified Expert",
      icon: CheckCircle2,
      bg: "bg-[#E8F5E9]",
      text: "text-[#1B5E20]",
      border: "border-[#A5D6A7]",
      dot: "bg-[#2E7D32]",
    },
    REJECTED: {
      label: "Requires Changes",
      icon: XCircle,
      bg: "bg-[#FEE2E2]",
      text: "text-[#DC2626]",
      border: "border-[#FCA5A5]",
      dot: "bg-[#DC2626]",
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
