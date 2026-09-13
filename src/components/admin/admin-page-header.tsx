"use client";

import React from "react";
import { Calendar } from "lucide-react";

interface AdminPageHeaderProps {
  title?: string;
  greeting?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function AdminPageHeader({
  title,
  greeting = "Welcome Back, Administrator",
  subtitle = "KrishiAI Platform Operations & Network Oversight",
  actions,
}: AdminPageHeaderProps) {
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-slate-200">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          {title || greeting}
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 font-normal">
          {subtitle}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 sm:self-center">
        <div className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-2xs">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          <span>{dateStr}</span>
        </div>

        {actions}
      </div>
    </div>
  );
}
