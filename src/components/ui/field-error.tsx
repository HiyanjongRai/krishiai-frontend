import React from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/utils/cn";

export function FieldError({
  id,
  children,
  className,
}: {
  id?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  if (!children) return null;

  return (
    <p
      id={id}
      role="alert"
      className={cn("flex items-start gap-1.5 text-xs font-medium leading-relaxed text-[#DC2626]", className)}
    >
      <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}
