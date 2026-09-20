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

  const fullTitle = title || greeting;
  const words = fullTitle.split(" ");
  const firstPart = words.slice(0, -1).join(" ");
  const lastWord = words[words.length - 1];

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#1F2937] flex items-center gap-2 flex-wrap">
          {words.length > 1 ? (
            <>
              <span>{firstPart}</span>
              <span className="text-[#2E7D32]">{lastWord}</span>
            </>
          ) : (
            <span className="text-[#2E7D32]">{fullTitle}</span>
          )}
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280] mt-1">{subtitle}</p>
      </div>

      <div className="flex items-center gap-2.5 flex-wrap w-full sm:w-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs font-semibold text-[#4B5563] shadow-[0_4px_20px_-2px_#EEF0EE]">
          <Calendar className="h-3.5 w-3.5 text-[#9CA3AF] shrink-0" />
          <span>{dateStr}</span>
        </div>
        {actions}
      </div>
    </div>
  );
}
