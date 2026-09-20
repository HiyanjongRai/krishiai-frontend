import React from "react";
import { Sprout } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/utils/cn";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  className,
  children,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-dashed border-[#D1D5DB] bg-white p-8 text-center shadow-sm",
        className
      )}
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-[#C8E6C9] bg-[#E8F5E9] text-[#2E7D32]">
        {icon ?? <Sprout className="h-6 w-6" aria-hidden="true" />}
      </div>
      <h3 className="mt-4 text-sm font-bold text-[#1F2937]">{title}</h3>
      {description && (
        <p className="mx-auto mt-1.5 max-w-md text-xs leading-relaxed text-[#6B7280]">{description}</p>
      )}
      {children}
      {actionLabel && onAction && (
        <Button type="button" size="sm" className="mt-4" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
