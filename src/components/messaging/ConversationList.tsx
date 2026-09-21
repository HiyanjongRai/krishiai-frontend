"use client";

import React, { useState } from 'react';
import { Search, MessageSquare, ImageIcon } from 'lucide-react';
import { UserAvatar } from '@/components/ui/avatar';
import type { ConversationSummaryResponse } from '@/types/messaging';

interface ConversationListProps {
  conversations: ConversationSummaryResponse[];
  selectedId: number | null;
  onSelect: (conversation: ConversationSummaryResponse) => void;
  isLoading?: boolean;
}

export function ConversationList({
  conversations,
  selectedId,
  onSelect,
  isLoading = false,
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = conversations.filter((c) => {
    if (!searchQuery.trim()) return true;
    const name = c.otherParticipant?.fullName?.toLowerCase() ?? '';
    const title = c.title?.toLowerCase() ?? '';
    const query = searchQuery.toLowerCase();
    return name.includes(query) || title.includes(query);
  });

  const formatTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      const now = new Date();
      if (d.toDateString() === now.toDateString()) {
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border border-[#E5E7EB] rounded-2xl shadow-xs overflow-hidden">
      {/* ─── Header & Search ────────────────────────────────────────────── */}
      <div className="p-4 border-b border-[#EEF0EE] space-y-3 shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#1F2937] tracking-tight">
            Messages
          </h2>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32]">
            {conversations.length}
          </span>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] placeholder-[#9CA3AF] text-[#1F2937] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] transition-all"
          />
        </div>
      </div>

      {/* ─── List ───────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#F1F5F2]">
        {isLoading && conversations.length === 0 ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-11 h-11 rounded-xl bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 rounded-sm w-1/2" />
                  <div className="h-2.5 bg-gray-100 rounded-sm w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-[#6B7280]">
            <MessageSquare className="w-8 h-8 text-gray-300 mb-2" />
            <p className="text-xs font-medium">No conversations found</p>
          </div>
        ) : (
          filtered.map((conv) => {
            const isSelected = selectedId === conv.id;
            const displayName =
              conv.otherParticipant?.fullName ?? conv.title ?? 'Consultation';
            const isOnline = conv.otherParticipant?.online ?? false;
            const isExpert = conv.otherParticipant?.role === 'ROLE_EXPERT';

            return (
              <button
                key={conv.id}
                type="button"
                onClick={() => onSelect(conv)}
                className={`w-full text-left p-3.5 flex items-start gap-3 transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#E8F5E9]/60 border-l-4 border-[#2E7D32]'
                    : 'hover:bg-[#F9FAFB]'
                }`}
              >
                {/* Avatar with presence */}
                <div className="relative shrink-0">
                  <UserAvatar
                    src={conv.otherParticipant?.profileImageUrl}
                    name={displayName}
                    size="sm"
                  />
                  {conv.otherParticipant && (
                    <span
                      className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-white ${
                        isOnline ? 'bg-emerald-500' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span
                      className={`text-xs truncate ${
                        conv.unreadCount > 0 ? 'font-bold text-[#1F2937]' : 'font-semibold text-[#374151]'
                      }`}
                    >
                      {displayName}
                    </span>
                    <span className="text-[10px] text-[#9CA3AF] shrink-0">
                      {formatTime(conv.updatedAt)}
                    </span>
                  </div>

                  {/* Subtitle / Role */}
                  {isExpert && conv.otherParticipant?.specialization && (
                    <span className="text-[10px] text-[#2E7D32] font-medium block truncate mb-0.5">
                      {conv.otherParticipant.specialization}
                    </span>
                  )}

                  {/* Last message preview */}
                  <div className="flex items-center justify-between gap-2">
                    <p
                      className={`text-xs truncate flex items-center gap-1 ${
                        conv.unreadCount > 0
                          ? 'text-[#1F2937] font-medium'
                          : 'text-[#6B7280]'
                      }`}
                    >
                      {conv.lastMessage?.messageType === 'IMAGE' ? (
                        <>
                          <ImageIcon className="w-3 h-3 text-[#2E7D32] shrink-0" />
                          <span>Photo</span>
                        </>
                      ) : (
                        conv.lastMessage?.content || 'No messages yet'
                      )}
                    </p>

                    {conv.unreadCount > 0 && (
                      <span className="shrink-0 px-1.5 py-0.2 rounded-full bg-[#2E7D32] text-white text-[10px] font-bold min-w-[18px] text-center">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
