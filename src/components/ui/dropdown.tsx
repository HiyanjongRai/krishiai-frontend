"use client";
import React, { useState } from "react";

interface DropdownItem {
  label: string;
  onClick: () => void;
}

export function Dropdown({
  trigger,
  items,
}: {
  trigger: React.ReactNode;
  items: DropdownItem[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl border border-[#E5E7EB] bg-white p-1.5 shadow-lg z-50">
          {items.map((it, idx) => (
            <button
              key={idx}
              onClick={() => {
                it.onClick();
                setOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-xs rounded-lg text-[#4B5563] hover:bg-[#F1F5F2] hover:text-[#2E7D32]"
            >
              {it.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
