import React from "react";
import { cn } from "@/utils/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ className, label, error, ...props }: InputProps) {
  return (
    <div className="w-full space-y-1">
      {label && (
        <label className="block text-xs font-semibold text-slate-700">
          {label}
        </label>
      )}
      <input
        className={cn(
          "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all",
          error && "border-rose-400 focus:border-rose-500 focus:ring-rose-200",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-rose-500">{error}</p>}
    </div>
  );
}
