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
    <div className="flex border-b border-slate-200 gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleClick(tab.id)}
          className={cn(
            "px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors",
            active === tab.id
              ? "border-emerald-600 text-emerald-700"
              : "border-transparent text-slate-500 hover:text-slate-700"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
