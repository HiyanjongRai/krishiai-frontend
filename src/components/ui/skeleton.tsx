import React from "react";
import { cn } from "@/utils/cn";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse motion-reduce:animate-none rounded-xl bg-[#E5E7EB]",
        className
      )}
      {...props}
    />
  );
}
