"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { MessageSquare, ArrowLeft } from 'lucide-react';
import { useMessaging } from '@/hooks/useMessaging';
import { ConversationList, ChatWindow } from '@/components/messaging';
import type { ConversationSummaryResponse } from '@/types/messaging';

export default function ExpertMessagesPage() {
  const searchParams = useSearchParams();
  const initialConvId = searchParams.get('id');

  const {
    conversations,
    isLoadingConversations,
    activeConversationId,
    setActiveConversationId,
  } = useMessaging();

  const [selectedConv, setSelectedConv] = useState<ConversationSummaryResponse | null>(null);
  const [mobileShowChat, setMobileShowChat] = useState(false);

  useEffect(() => {
    if (initialConvId) {
      const found = conversations.find((c) => c.id === Number(initialConvId));
      if (found) {
        setSelectedConv(found);
        setActiveConversationId(found.id);
        setMobileShowChat(true);
      }
    } else if (!selectedConv && conversations.length > 0) {
      setSelectedConv(conversations[0]);
      setActiveConversationId(conversations[0].id);
    }
  }, [conversations, initialConvId, selectedConv, setActiveConversationId]);

  const handleSelect = (conv: ConversationSummaryResponse) => {
    setSelectedConv(conv);
    setActiveConversationId(conv.id);
    setMobileShowChat(true);
    if (typeof window !== 'undefined' && window.scrollY > 0) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 148px)' }}>
      {/* ─── Dual Pane Layout — stable flex, no reflow on conversation switch */}
      <div className="flex-1 flex gap-4 min-h-0 overflow-hidden">
        {/* Left pane */}
        <div
          className={`flex-shrink-0 flex flex-col transition-none ${
            mobileShowChat ? 'hidden md:flex' : 'flex'
          } w-full md:w-[320px] lg:w-[340px]`}
          style={{ minWidth: 0 }}
        >
          <ConversationList
            conversations={conversations}
            selectedId={selectedConv?.id ?? null}
            onSelect={handleSelect}
            isLoading={isLoadingConversations}
          />
        </div>

        {/* Right pane */}
        <div
          className={`flex-1 flex flex-col min-w-0 ${
            !mobileShowChat ? 'hidden md:flex' : 'flex'
          }`}
        >
          {selectedConv ? (
            <ChatWindow
              conversationId={selectedConv.id}
              consultationId={selectedConv.consultationId}
              title={selectedConv.title}
              otherParticipant={selectedConv.otherParticipant}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-white border border-[#E5E7EB] rounded-2xl p-8 text-center shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32] mb-3">
                <MessageSquare className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-[#1F2937]">Select a conversation</h3>
              <p className="text-xs text-[#6B7280] max-w-sm mt-1">
                Select a farmer inquiry to view consultation history, diagnostic images, and provide advisory.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Back Button — below grid so it never shifts pane heights */}
      {mobileShowChat && (
        <div className="md:hidden mt-2 shrink-0">
          <button
            type="button"
            onClick={() => setMobileShowChat(false)}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#2E7D32] bg-white px-3 py-1.5 rounded-xl border border-[#E5E7EB] shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to conversations
          </button>
        </div>
      )}
    </div>
  );
}
