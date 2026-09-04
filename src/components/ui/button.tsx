import React from "react";
import { cn } from "@/utils/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  children,
  ...props
}: ButtonProps) {
  const base = "inline-flex items-center justify-center font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-[#0f3d26] hover:bg-[#14532d] text-white shadow-xs hover:shadow",
    secondary: "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200",
    outline: "bg-white hover:bg-slate-50 text-slate-800 border border-slate-300",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-700",
  };

  const sizes = {
    sm: "text-xs px-3 py-1.5 gap-1.5",
    md: "text-sm px-4.5 py-2.5 gap-2",
    lg: "text-base px-6 py-3.5 gap-2.5",
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
