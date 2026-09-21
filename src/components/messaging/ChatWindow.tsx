"use client";

import React, { useEffect, useRef, useState } from 'react';
import {
  Send,
  Loader2,
  ChevronDown,
  Lock,
  MessageSquare,
  Sprout,
} from 'lucide-react';
import { UserAvatar } from '@/components/ui/avatar';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { ImageUploadButton } from './ImageUploadButton';
import { ConsultationStatusBanner } from './ConsultationStatusBanner';
import { useConversation } from '@/hooks/useConversation';
import { useConsultation } from '@/hooks/useConsultation';
import { useAuth } from '@/providers/auth-provider';
import { toast } from '@/lib/toast-utils';
import type {
  ConsultationDetailDto,
  UserPublicSummaryDto,
} from '@/types/messaging';

interface ChatWindowProps {
  conversationId: number;
  consultationId?: number | null;
  title?: string | null;
  otherParticipant?: UserPublicSummaryDto | null;
  consultation?: ConsultationDetailDto | null;
  onAcceptConsultation?: () => Promise<unknown>;
  onRejectConsultation?: () => Promise<unknown>;
  onCompleteConsultation?: () => Promise<unknown>;
  onCancelConsultation?: () => Promise<unknown>;
  consultationActionLoading?: boolean;
}

export function ChatWindow({
  conversationId,
  consultationId,
  title,
  otherParticipant,
  consultation: consultationProp,
  onAcceptConsultation: onAcceptProp,
  onRejectConsultation: onRejectProp,
  onCompleteConsultation: onCompleteProp,
  onCancelConsultation: onCancelProp,
  consultationActionLoading: consultationActionLoadingProp = false,
}: ChatWindowProps) {
  const { user } = useAuth();
  const {
    messages,
    isLoading,
    isLoadingMore,
    hasMore,
    typingUsers,
    presenceMap,
    loadMore,
    sendMessage,
    sendImage,
    sendTyping,
    deleteMessage,
    reportMessage,
  } = useConversation(conversationId);

  // Auto-fetch consultation if consultationId is provided and no consultation prop was passed
  const {
    consultation: fetchedConsultation,
    actionLoading: fetchedActionLoading,
    accept: fetchedAccept,
    reject: fetchedReject,
    complete: fetchedComplete,
    cancel: fetchedCancel,
  } = useConsultation(consultationProp ? null : consultationId ?? null);

  const consultation = consultationProp ?? fetchedConsultation;
  const onAcceptConsultation = onAcceptProp ?? fetchedAccept;
  const onRejectConsultation = onRejectProp ?? fetchedReject;
  const onCompleteConsultation = onCompleteProp ?? fetchedComplete;
  const onCancelConsultation = onCancelProp ?? fetchedCancel;
  const consultationActionLoading = consultationActionLoadingProp || fetchedActionLoading;

  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isAutoScrollEnabledRef = useRef<boolean>(true);

  const isExpired = consultation?.status === 'EXPIRED';
  const isPaymentPending = consultation?.status === 'PAYMENT_PENDING';
  const isClosed =
    consultation &&
    ['COMPLETED', 'CANCELLED', 'REJECTED', 'EXPIRED', 'PAYMENT_PENDING', 'REQUESTED', 'PENDING'].includes(
      consultation.status
    );

  const isOtherOnline =
    otherParticipant &&
    (presenceMap.has(otherParticipant.id)
      ? presenceMap.get(otherParticipant.id)
      : otherParticipant.online);

  const scrollToBottom = (smooth = true) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    if (smooth) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    } else {
      el.scrollTop = el.scrollHeight;
    }
  };

  // Instant scroll to bottom when conversationId changes (switch conversation) without shaking window
  useEffect(() => {
    isAutoScrollEnabledRef.current = true;
    setShowScrollBottom(false);
    if (typeof window !== 'undefined' && window.scrollY > 0) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
    requestAnimationFrame(() => {
      const el = scrollContainerRef.current;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    });
  }, [conversationId]);

  // Auto scroll to bottom when new messages arrive (inside container only)
  useEffect(() => {
    if (isAutoScrollEnabledRef.current && scrollContainerRef.current) {
      const el = scrollContainerRef.current;
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  // Scroll listener for infinite scroll up + scroll-to-bottom button
  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;

    // If near top and has more messages, load older
    if (el.scrollTop < 60 && hasMore && !isLoadingMore) {
      const prevScrollHeight = el.scrollHeight;
      loadMore().then(() => {
        // Maintain scroll position after prepending older messages
        requestAnimationFrame(() => {
          if (scrollContainerRef.current) {
            const heightDiff = scrollContainerRef.current.scrollHeight - prevScrollHeight;
            scrollContainerRef.current.scrollTop += heightDiff;
          }
        });
      });
    }

    // Check if user is scrolled away from bottom
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const isNearBottom = distanceFromBottom < 120;
    isAutoScrollEnabledRef.current = isNearBottom;
    setShowScrollBottom(!isNearBottom);
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = inputText.trim();
    if (!text || isSending || isClosed) return;

    try {
      setIsSending(true);
      setInputText('');
      sendTyping(false);
      await sendMessage(text, 'TEXT');
      scrollToBottom();
    } catch (err: any) {
      // Revert text on failure
      setInputText(text);
      toast.error('Message Not Sent', {
        description: err?.message || 'This consultation has ended or is not active. Messages cannot be sent.',
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    sendTyping(e.target.value.length > 0);
  };

  // Group messages by date
  const groupedMessages = React.useMemo(() => {
    const groups: { dateLabel: string; items: typeof messages }[] = [];
    let currentDateLabel = '';
    let currentGroup: typeof messages = [];

    messages.forEach((msg) => {
      const date = new Date(msg.createdAt);
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      let label = date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      if (date.toDateString() === today.toDateString()) {
        label = 'Today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        label = 'Yesterday';
      }

      if (label !== currentDateLabel) {
        if (currentGroup.length > 0) {
          groups.push({ dateLabel: currentDateLabel, items: currentGroup });
        }
        currentDateLabel = label;
        currentGroup = [msg];
      } else {
        currentGroup.push(msg);
      }
    });

    if (currentGroup.length > 0) {
      groups.push({ dateLabel: currentDateLabel, items: currentGroup });
    }

    return groups;
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
      {/* ─── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-[#EEF0EE] bg-white shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative">
            <UserAvatar
              src={otherParticipant?.profileImageUrl}
              name={otherParticipant?.fullName ?? title}
              size="md"
              className="ring-2 ring-[#E8F5E9]"
            />
            {otherParticipant && (
              <span
                className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                  isOtherOnline ? 'bg-emerald-500' : 'bg-gray-300'
                }`}
                title={isOtherOnline ? 'Online' : 'Offline'}
              />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-[#1F2937] truncate">
                {otherParticipant?.fullName ?? title ?? 'Consultation Chat'}
              </h2>
              {otherParticipant?.role === 'ROLE_EXPERT' && (
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-[10px] font-bold border border-[#A5D6A7]">
                  {otherParticipant.specialization || 'Agronomist'}
                </span>
              )}
            </div>

            <p className="text-xs text-[#6B7280] flex items-center gap-2 truncate">
              <span>{isOtherOnline ? 'Active now' : 'Offline'}</span>
              {consultation?.cropName && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-[#2E7D32] font-medium">
                    <Sprout className="w-3 h-3" /> {consultation.cropName}
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* ─── Status Banner (if consultation linked) ─────────────────────────── */}
      {consultation && (
        <ConsultationStatusBanner
          consultation={consultation}
          onAccept={onAcceptConsultation}
          onReject={onRejectConsultation}
          onComplete={onCompleteConsultation}
          onCancel={onCancelConsultation}
          actionLoading={consultationActionLoading}
        />
      )}

      {/* ─── Message List Container ────────────────────────────────────────── */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#FAFAF9]"
        style={{ scrollbarGutter: 'stable' }}
      >
        {/* Loading older messages indicator */}
        {isLoadingMore && (
          <div className="flex justify-center py-2">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E5E7EB] text-xs text-[#6B7280] shadow-xs">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#2E7D32]" />
              Loading earlier messages...
            </div>
          </div>
        )}

        {/* Initial Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center h-48 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-[#2E7D32]" />
            <p className="text-xs text-[#6B7280]">Loading conversation...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-center px-4">
            <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32] mb-3">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-[#1F2937]">Start Consultation</h3>
            <p className="text-xs text-[#6B7280] max-w-xs mt-1">
              Ask your question, describe symptoms, or share photos of your crop to receive expert diagnosis.
            </p>
          </div>
        )}

        {/* Grouped Messages */}
        {groupedMessages.map((group) => (
          <div key={group.dateLabel} className="space-y-1">
            {/* Date separator pill */}
            <div className="flex justify-center my-3">
              <span className="px-3 py-1 rounded-full bg-white border border-[#E5E7EB] text-[10px] font-semibold text-[#6B7280] shadow-2xs">
                {group.dateLabel}
              </span>
            </div>

            {/* Messages in group */}
            {group.items.map((msg) => (
              <MessageBubble
                key={msg.id || msg.clientMessageId}
                message={msg}
                isCurrentUser={Boolean(user && msg.sender.id === user.id)}
                onDelete={deleteMessage}
                onReport={reportMessage}
              />
            ))}
          </div>
        ))}

        {/* Ephemeral typing indicator */}
        <TypingIndicator typingUsers={typingUsers} />

        <div ref={messagesEndRef} />
      </div>

      {/* ─── Scroll to Bottom Button ────────────────────────────────────────── */}
      {showScrollBottom && (
        <button
          type="button"
          onClick={() => scrollToBottom(true)}
          className="absolute bottom-24 right-8 p-2.5 rounded-full bg-white border border-[#E5E7EB] text-[#2E7D32] shadow-md hover:bg-[#F3F4F6] transition-all animate-in fade-in zoom-in-95 z-10 cursor-pointer"
          title="Jump to latest"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      )}

      {/* ─── Input Bar or Closed Notice ─────────────────────────────────────── */}
      <div className="p-3 sm:p-4 bg-white border-t border-[#EEF0EE] shrink-0">
        {isPaymentPending ? (
          <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              <span>Expert accepted! Complete payment to unlock live messaging.</span>
            </div>
            <a
              href={`/farmer/payments/${consultation?.id}`}
              className="px-3 py-1 bg-[#2E7D32] hover:bg-[#1B5E20] text-white rounded-lg text-xs font-semibold transition-colors shrink-0"
            >
              Pay via eSewa
            </a>
          </div>
        ) : isExpired ? (
          <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-gray-100 border border-gray-300 text-xs text-[#6B7280]">
            <Lock className="w-3.5 h-3.5" />
            <span>Consultation duration has expired. Conversation is in read-only mode.</span>
          </div>
        ) : isClosed ? (
          <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-[#6B7280]">
            <Lock className="w-3.5 h-3.5" />
            <span>This consultation is completed. Conversation is in read-only mode.</span>
          </div>
        ) : (
          <form onSubmit={handleSend} className="flex items-end gap-2">
            <ImageUploadButton
              onUpload={async (file) => {
                try {
                  await sendImage(file);
                  scrollToBottom();
                } catch (err: any) {
                  toast.error('Upload Failed', {
                    description: err?.message || 'Could not send image. Consultation may be inactive.',
                  });
                }
              }}
              disabled={isSending || Boolean(isClosed)}
            />

            <div className="flex-1 relative rounded-2xl border border-[#D1D5DB] focus-within:border-[#2E7D32] focus-within:ring-2 focus-within:ring-[#2E7D32]/20 transition-all bg-white overflow-hidden">
              <textarea
                value={inputText}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Type your message... (Shift + Enter for new line)"
                rows={1}
                className="w-full px-3.5 py-2.5 text-sm text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none resize-none max-h-32 min-h-[42px] leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={!inputText.trim() || isSending}
              className="p-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] disabled:opacity-40 text-white shadow-xs transition-colors shrink-0 cursor-pointer flex items-center justify-center"
              title="Send message"
            >
              {isSending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
