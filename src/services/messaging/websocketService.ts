import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { tokenStore } from '@/lib/api';
import type {
  MessageResponse,
  TypingEventDto,
  PresenceEventDto,
  ReadReceiptEvent,
} from '@/types/messaging';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? 'http://localhost:8080/ws';

type MessageHandler = (msg: MessageResponse) => void;
type TypingHandler = (evt: TypingEventDto) => void;
type PresenceHandler = (evt: PresenceEventDto) => void;
type ReadHandler = (evt: ReadReceiptEvent) => void;
type ConnectionHandler = (connected: boolean) => void;

class MessagingWebSocketService {
  private client: Client | null = null;
  private activeSubs: Map<string, StompSubscription> = new Map();
  private pendingListeners: Map<string, Set<(msg: IMessage) => void>> = new Map();
  private connectionHandlers: Set<ConnectionHandler> = new Set();
  private reconnectAttempts = 0;

  // ─── Public API ──────────────────────────────────────────────────────────────

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const token = tokenStore.get();
      if (!token) {
        reject(new Error('No auth token - cannot connect to WebSocket'));
        return;
      }

      if (this.client?.connected) {
        resolve();
        return;
      }

      this.client = new Client({
        webSocketFactory: () => new SockJS(WS_URL) as WebSocket,
        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },
        heartbeatIncoming: 10000,
        heartbeatOutgoing: 10000,
        reconnectDelay: Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000),

        onConnect: () => {
          console.log('[WS] Connected to KrishiAI STOMP Broker');
          this.reconnectAttempts = 0;
          this.connectionHandlers.forEach(h => h(true));
          this._resubscribeAll();
          resolve();
        },

        onDisconnect: () => {
          console.log('[WS] Disconnected from KrishiAI STOMP Broker');
          this.activeSubs.clear();
          this.connectionHandlers.forEach(h => h(false));
        },

        onStompError: (frame) => {
          console.error('[WS] STOMP error', frame.headers['message']);
          this.reconnectAttempts++;
          reject(new Error(frame.headers['message'] ?? 'STOMP connection error'));
        },

        onWebSocketError: (evt) => {
          console.error('[WS] WebSocket error', evt);
        },
      });

      this.client.activate();
    });
  }

  disconnect(): void {
    this.activeSubs.forEach(sub => {
      try { sub.unsubscribe(); } catch { /* ignore */ }
    });
    this.activeSubs.clear();
    this.pendingListeners.clear();
    this.client?.deactivate();
    this.client = null;
    this.connectionHandlers.forEach(h => h(false));
  }

  get isConnected(): boolean {
    return this.client?.connected ?? false;
  }

  onConnectionChange(handler: ConnectionHandler): () => void {
    this.connectionHandlers.add(handler);
    return () => this.connectionHandlers.delete(handler);
  }

  // ─── Conversation Subscriptions ───────────────────────────────────────────────

  subscribeToConversation(
    conversationId: number,
    onMessage: MessageHandler,
    onTyping?: TypingHandler,
    onPresence?: PresenceHandler,
    onRead?: ReadHandler,
  ): () => void {
    const unsubs: Array<() => void> = [];

    // New messages
    unsubs.push(this._subscribe(
      `/topic/conversation.${conversationId}`,
      (msg: IMessage) => {
        try {
          const data: MessageResponse = JSON.parse(msg.body);
          onMessage(data);
        } catch (e) {
          console.error('[WS] Failed to parse message', e);
        }
      },
    ));

    // Typing indicators (ephemeral)
    if (onTyping) {
      unsubs.push(this._subscribe(
        `/topic/conversation.${conversationId}.typing`,
        (msg: IMessage) => {
          try {
            const data: TypingEventDto = JSON.parse(msg.body);
            onTyping(data);
          } catch (e) {
            console.error('[WS] Failed to parse typing event', e);
          }
        },
      ));
    }

    // Presence events
    if (onPresence) {
      unsubs.push(this._subscribe(
        `/topic/conversation.${conversationId}.presence`,
        (msg: IMessage) => {
          try {
            const data: PresenceEventDto = JSON.parse(msg.body);
            onPresence(data);
          } catch (e) {
            console.error('[WS] Failed to parse presence event', e);
          }
        },
      ));
    }

    // Read receipts
    if (onRead) {
      unsubs.push(this._subscribe(
        `/topic/conversation.${conversationId}.read`,
        (msg: IMessage) => {
          try {
            const data: ReadReceiptEvent = JSON.parse(msg.body);
            onRead(data);
          } catch (e) {
            console.error('[WS] Failed to parse read receipt', e);
          }
        },
      ));
    }

    return () => unsubs.forEach(u => u());
  }

  subscribeToNotifications(
    onNotification: (payload: unknown) => void,
  ): () => void {
    return this._subscribe('/user/queue/notifications', (msg: IMessage) => {
      try {
        const data = JSON.parse(msg.body);
        onNotification(data);
      } catch (e) {
        console.error('[WS] Failed to parse notification', e);
      }
    });
  }

  // ─── Publish Events ───────────────────────────────────────────────────────────

  sendTypingIndicator(conversationId: number, typing: boolean): void {
    if (!this.isConnected) return;
    this.client!.publish({
      destination: `/app/conversation.${conversationId}.typing`,
      body: JSON.stringify({ conversationId, typing }),
    });
  }

  // ─── Private ─────────────────────────────────────────────────────────────────

  private _subscribe(destination: string, callback: (msg: IMessage) => void): () => void {
    if (!this.pendingListeners.has(destination)) {
      this.pendingListeners.set(destination, new Set());
    }
    const listeners = this.pendingListeners.get(destination)!;
    listeners.add(callback);

    // If already connected and not subscribed on STOMP, subscribe now
    if (this.client?.connected && !this.activeSubs.has(destination)) {
      this._subscribeStomp(destination);
    }

    return () => {
      listeners.delete(callback);
      if (listeners.size === 0) {
        this.pendingListeners.delete(destination);
        const sub = this.activeSubs.get(destination);
        if (sub) {
          try { sub.unsubscribe(); } catch { /* ignore */ }
          this.activeSubs.delete(destination);
        }
      }
    };
  }

  private _subscribeStomp(destination: string): void {
    if (!this.client?.connected) return;
    const sub = this.client.subscribe(destination, (msg: IMessage) => {
      const listeners = this.pendingListeners.get(destination);
      if (listeners) {
        listeners.forEach(cb => {
          try { cb(msg); } catch (err) { console.error('[WS] Listener error', err); }
        });
      }
    });
    this.activeSubs.set(destination, sub);
  }

  private _resubscribeAll(): void {
    this.activeSubs.forEach(sub => {
      try { sub.unsubscribe(); } catch { /* ignore */ }
    });
    this.activeSubs.clear();

    for (const dest of this.pendingListeners.keys()) {
      this._subscribeStomp(dest);
    }
  }
}

// Singleton - one WS connection per browser tab
export const messagingWS = new MessagingWebSocketService();
