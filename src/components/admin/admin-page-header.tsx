"use client";

import React from "react";
import { Calendar, ChevronDown } from "lucide-react";

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
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-1">
      <div>
        <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#171717]">
          {title || greeting}
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-gray-500 font-normal">
          {subtitle}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 sm:self-center">
        {/* Date Filter Pill matching reference screenshot */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(234,234,236,0.85)] bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.03)] hover:bg-gray-50 transition-colors">
          <Calendar className="h-3.5 w-3.5 text-gray-400" />
          <span>{dateStr}</span>
          <ChevronDown className="h-3 w-3 text-gray-400 ml-0.5" />
        </div>

        {actions}
      </div>
    </div>
  );
}
