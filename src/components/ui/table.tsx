import React from "react";
import { cn } from "@/utils/cn";

export function Table({
  className,
  children,
  ...props
}: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto">
      <table
        className={cn("w-full text-left text-sm text-slate-600", className)}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}
