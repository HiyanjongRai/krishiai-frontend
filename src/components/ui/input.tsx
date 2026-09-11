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
        <label className="block text-xs font-semibold text-[#171717]">
          {label}
        </label>
      )}
      <input
        className={cn(
          "w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-[#171717] placeholder:text-[#A3A3A3] focus:border-[#0F9F68] focus:outline-none focus:ring-3 focus:ring-[#0F9F68]/15 transition-all shadow-2xs",
          error && "border-rose-400 focus:border-rose-500 focus:ring-rose-500/15",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
    </div>
  );
}
