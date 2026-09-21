"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { messagingWS, messagingService } from '@/services/messaging';
import type {
  MessageResponse,
  MessageType,
  PresenceEventDto,
  ReadReceiptEvent,
  TypingEventDto,
} from '@/types/messaging';

export function useConversation(conversationId: number | null) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [typingUsers, setTypingUsers] = useState<Map<number, TypingEventDto>>(new Map());
  const [presenceMap, setPresenceMap] = useState<Map<number, boolean>>(new Map());
  const [error, setError] = useState<string | null>(null);

  const typingTimeoutsRef = useRef<Map<number, NodeJS.Timeout>>(new Map());
  const lastTypingSentRef = useRef<number>(0);

  // Load initial messages
  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      setHasMore(false);
      setNextCursor(null);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setError(null);

    messagingService
      .getMessages(conversationId, undefined, 30)
      .then((page) => {
        if (!isMounted) return;
        // Backend returns DESC (newest first). Reverse so items are chronological (oldest to newest)
        const chronological = [...page.items].reverse();
        setMessages(chronological);
        setHasMore(page.hasMore);
        setNextCursor(page.nextCursor);

        // Auto mark read if there are messages
        if (chronological.length > 0) {
          const lastMsg = chronological[chronological.length - 1];
          messagingService.markRead(conversationId, lastMsg.id).catch(() => {});
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Failed to load messages', err);
          setError(err.message ?? 'Failed to load messages');
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
      // Clear typing timeouts
      typingTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
      typingTimeoutsRef.current.clear();
      setTypingUsers(new Map());
    };
  }, [conversationId]);

  // Subscribe to real-time events for this conversation
  useEffect(() => {
    if (!conversationId) return;

    const onMessage = (newMsg: MessageResponse) => {
      setMessages((prev) => {
        // Prevent duplicates (by ID or clientMessageId)
        const exists = prev.some(
          (m) =>
            m.id === newMsg.id ||
            (newMsg.clientMessageId && m.clientMessageId === newMsg.clientMessageId)
        );
        if (exists) {
          return prev.map((m) =>
            m.id === newMsg.id ||
            (newMsg.clientMessageId && m.clientMessageId === newMsg.clientMessageId)
              ? newMsg
              : m
          );
        }
        return [...prev, newMsg];
      });

      // Auto mark read if not sent by current user
      if (user && newMsg.sender.id !== user.id) {
        messagingService.markRead(conversationId, newMsg.id).catch(() => {});
      }
    };

    const onTyping = (evt: TypingEventDto) => {
      if (user && evt.userId === user.id) return; // Ignore own typing

      setTypingUsers((prev) => {
        const next = new Map(prev);
        if (evt.typing) {
          next.set(evt.userId, evt);

          // Auto-clear after 3.5 seconds in case typing=false event was dropped
          const existingTimer = typingTimeoutsRef.current.get(evt.userId);
          if (existingTimer) clearTimeout(existingTimer);

          const timer = setTimeout(() => {
            setTypingUsers((current) => {
              const updated = new Map(current);
              updated.delete(evt.userId);
              return updated;
            });
            typingTimeoutsRef.current.delete(evt.userId);
          }, 3500);

          typingTimeoutsRef.current.set(evt.userId, timer);
        } else {
          next.delete(evt.userId);
          const existingTimer = typingTimeoutsRef.current.get(evt.userId);
          if (existingTimer) {
            clearTimeout(existingTimer);
            typingTimeoutsRef.current.delete(evt.userId);
          }
        }
        return next;
      });
    };

    const onPresence = (evt: PresenceEventDto) => {
      setPresenceMap((prev) => {
        const next = new Map(prev);
        next.set(evt.userId, evt.online);
        return next;
      });
    };

    const onRead = (evt: ReadReceiptEvent) => {
      // Could be used to show "Seen" status
    };

    const unsub = messagingWS.subscribeToConversation(
      conversationId,
      onMessage,
      onTyping,
      onPresence,
      onRead
    );

    return unsub;
  }, [conversationId, user]);

  // Load older messages (cursor pagination)
  const loadMore = useCallback(async () => {
    if (!conversationId || !hasMore || isLoadingMore || messages.length === 0) return;

    try {
      setIsLoadingMore(true);
      const oldestMessageId = messages[0].id;
      const page = await messagingService.getMessages(conversationId, oldestMessageId, 30);
      const olderChronological = [...page.items].reverse();

      setMessages((prev) => {
        const existingIds = new Set(prev.map((m) => m.id));
        const filteredNew = olderChronological.filter((m) => !existingIds.has(m.id));
        return [...filteredNew, ...prev];
      });

      setHasMore(page.hasMore);
      setNextCursor(page.nextCursor);
    } catch (err) {
      console.error('Failed to load older messages', err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [conversationId, hasMore, isLoadingMore, messages]);

  // Send a message
  const sendMessage = useCallback(
    async (
      content: string,
      messageType: MessageType = 'TEXT',
      attachmentUrl?: string
    ): Promise<MessageResponse | null> => {
      if (!conversationId) return null;

      const clientMessageId = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      try {
        const sent = await messagingService.sendMessage(conversationId, {
          content,
          messageType,
          attachmentUrl,
          clientMessageId,
        });

        // Optimistically add to state if not yet delivered via WS
        setMessages((prev) => {
          if (prev.some((m) => m.id === sent.id || m.clientMessageId === clientMessageId)) {
            return prev.map((m) =>
              m.id === sent.id || m.clientMessageId === clientMessageId ? sent : m
            );
          }
          return [...prev, sent];
        });

        return sent;
      } catch (err: any) {
        console.error('Failed to send message', err);
        throw err;
      }
    },
    [conversationId]
  );

  // Send image attachment
  const sendImage = useCallback(
    async (file: File): Promise<MessageResponse | null> => {
      if (!conversationId) return null;

      const clientMessageId = `img-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      try {
        const sent = await messagingService.uploadAndSendImage(
          conversationId,
          file,
          clientMessageId
        );

        setMessages((prev) => {
          if (prev.some((m) => m.id === sent.id || m.clientMessageId === clientMessageId)) {
            return prev.map((m) =>
              m.id === sent.id || m.clientMessageId === clientMessageId ? sent : m
            );
          }
          return [...prev, sent];
        });

        return sent;
      } catch (err: any) {
        console.error('Failed to upload and send image', err);
        throw err;
      }
    },
    [conversationId]
  );

  // Send typing indicator (throttled)
  const sendTyping = useCallback(
    (typing: boolean) => {
      if (!conversationId) return;

      const now = Date.now();
      if (typing) {
        // Send typing=true at most once every 2 seconds
        if (now - lastTypingSentRef.current > 2000) {
          lastTypingSentRef.current = now;
          messagingWS.sendTypingIndicator(conversationId, true);
        }
      } else {
        lastTypingSentRef.current = 0;
        messagingWS.sendTypingIndicator(conversationId, false);
      }
    },
    [conversationId]
  );

  // Soft delete message
  const deleteMessage = useCallback(
    async (messageId: number) => {
      try {
        await messagingService.deleteMessage(messageId);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === messageId
              ? { ...m, deleted: true, content: 'This message was deleted' }
              : m
          )
        );
      } catch (err: any) {
        console.error('Failed to delete message', err);
        throw err;
      }
    },
    []
  );

  // Report message
  const reportMessage = useCallback(
    async (messageId: number, reason: string) => {
      try {
        await messagingService.reportMessage(messageId, reason);
      } catch (err: any) {
        console.error('Failed to report message', err);
        throw err;
      }
    },
    []
  );

  return {
    messages,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    typingUsers: Array.from(typingUsers.values()),
    presenceMap,
    loadMore,
    sendMessage,
    sendImage,
    sendTyping,
    deleteMessage,
    reportMessage,
  };
}
