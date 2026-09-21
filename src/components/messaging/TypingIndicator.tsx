"use client";

import React from 'react';
import type { TypingEventDto } from '@/types/messaging';

interface TypingIndicatorProps {
  typingUsers: TypingEventDto[];
}

export function TypingIndicator({ typingUsers }: TypingIndicatorProps) {
  if (!typingUsers || typingUsers.length === 0) return null;

  const names = typingUsers.map((u) => u.displayName).join(', ');
  const text =
    typingUsers.length === 1
      ? `${names} is typing...`
      : `${names} are typing...`;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 text-xs text-[#6B7280] animate-in fade-in duration-200">
      <div className="flex items-center gap-1 bg-white border border-[#E5E7EB] px-2.5 py-1 rounded-full shadow-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] animate-bounce [animation-delay:-0.3s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] animate-bounce [animation-delay:-0.15s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] animate-bounce" />
        <span className="ml-1.5 text-[11px] font-medium text-[#4B5563]">{text}</span>
      </div>
    </div>
  );
}
