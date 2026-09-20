import React from "react";
import { cn } from "@/utils/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ className, label, error, ...props }: InputProps) {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-xs font-semibold text-[#1F2937]">
          {label}
        </label>
      )}
      <input
        className={cn(
          "w-full rounded-xl border border-[#D1D5DB] bg-white px-4 py-2.5 text-sm text-[#1F2937] placeholder:text-[#9CA3AF] transition-all focus:border-[#2E7D32] focus:outline-none focus:ring-3 focus:ring-[#E8F5E9] disabled:bg-[#F3F4F6] disabled:text-[#9CA3AF]",
          error && "border-[#DC2626] bg-[#FEF2F2] focus:border-[#DC2626] focus:ring-[#FEE2E2]",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-[#DC2626] font-medium">{error}</p>}
    </div>
  );
}
