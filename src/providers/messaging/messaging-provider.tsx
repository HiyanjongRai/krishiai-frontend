"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useAuth } from '@/providers/auth-provider';
import { messagingWS, messagingService, consultationService } from '@/services/messaging';
import type {
  AnnouncementDto,
  ConversationSummaryResponse,
  MessageResponse,
} from '@/types/messaging';
import { toast } from '@/lib/toast-utils';

interface MessagingContextType {
  isConnected: boolean;
  conversations: ConversationSummaryResponse[];
  isLoadingConversations: boolean;
  totalUnreadCount: number;
  refreshConversations: () => Promise<void>;
  announcements: AnnouncementDto[];
  refreshAnnouncements: () => Promise<void>;
  activeConversationId: number | null;
  setActiveConversationId: (id: number | null) => void;
}

const MessagingContext = createContext<MessagingContextType | undefined>(undefined);

export function MessagingProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [isConnected, setIsConnected] = useState(messagingWS.isConnected);
  const [conversations, setConversations] = useState<ConversationSummaryResponse[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [announcements, setAnnouncements] = useState<AnnouncementDto[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);

  // Sync connection state
  useEffect(() => {
    const unsub = messagingWS.onConnectionChange(setIsConnected);
    return unsub;
  }, []);

  // Connect on authentication
  useEffect(() => {
    if (isAuthenticated) {
      messagingWS.connect().catch((err) => {
        console.warn('[WS] Auto-connect error', err);
      });
    } else {
      messagingWS.disconnect();
      setConversations([]);
      setAnnouncements([]);
    }
  }, [isAuthenticated]);

  const refreshConversations = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setIsLoadingConversations(true);
      const list = await messagingService.getConversations();
      setConversations(list);
    } catch (err) {
      console.error('Failed to load conversations', err);
    } finally {
      setIsLoadingConversations(false);
    }
  }, [isAuthenticated]);

  const refreshAnnouncements = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const list = await consultationService.getMyAnnouncements();
      setAnnouncements(list);
    } catch (err) {
      console.error('Failed to load announcements', err);
    }
  }, [isAuthenticated]);

  // Initial load
  useEffect(() => {
    if (isAuthenticated) {
      refreshConversations();
      refreshAnnouncements();
    }
  }, [isAuthenticated, refreshConversations, refreshAnnouncements]);

  // Listen for global notifications over WS
  useEffect(() => {
    if (!isConnected) return;
    const unsub = messagingWS.subscribeToNotifications((payload: any) => {
      // Invalidate/refresh conversations or trigger notification toast
      if (payload?.type === 'NEW_MESSAGE' || payload?.type === 'CONVERSATION_UPDATED') {
        refreshConversations();
      } else if (payload?.type === 'ANNOUNCEMENT') {
        refreshAnnouncements();
        if (payload?.title) {
          toast.info(payload.title, { description: payload.content });
        }
      }
    });
    return unsub;
  }, [isConnected, refreshConversations, refreshAnnouncements]);

  const totalUnreadCount = conversations.reduce(
    (acc, curr) => acc + (curr.unreadCount || 0),
    0
  );

  return (
    <MessagingContext.Provider
      value={{
        isConnected,
        conversations,
        isLoadingConversations,
        totalUnreadCount,
        refreshConversations,
        announcements,
        refreshAnnouncements,
        activeConversationId,
        setActiveConversationId,
      }}
    >
      {children}
    </MessagingContext.Provider>
  );
}

export function useMessagingContext() {
  const ctx = useContext(MessagingContext);
  if (!ctx) {
    throw new Error('useMessagingContext must be used within a MessagingProvider');
  }
  return ctx;
}
