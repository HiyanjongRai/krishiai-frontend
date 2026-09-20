"use client";
import React, { useState } from "react";
import { cn } from "@/utils/cn";

interface TabItem {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
}

export function Tabs({ tabs, defaultTab, onChange }: TabsProps) {
  const [active, setActive] = useState(defaultTab || tabs[0]?.id);

  const handleClick = (id: string) => {
    setActive(id);
    onChange?.(id);
  };

  return (
    <div className="flex border-b border-[#E5E7EB] gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleClick(tab.id)}
          className={cn(
            "px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors",
            active === tab.id
              ? "border-[#2E7D32] text-[#2E7D32]"
              : "border-transparent text-[#6B7280] hover:text-[#4B5563]"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
