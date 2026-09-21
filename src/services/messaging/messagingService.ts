import { tokenStore } from '@/lib/api';
import type {
  ConversationSummaryResponse,
  CursorPageResponse,
  MessageResponse,
  SendMessageRequest,
} from '@/types/messaging';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api';

async function authFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const token = tokenStore.get();
  const res = await fetch(`${BASE}${url}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message ?? `Request failed (${res.status})`);
  }
  return json.data as T;
}

export const messagingService = {
  // ─── Conversations ────────────────────────────────────────────────────────────
  getConversations(): Promise<ConversationSummaryResponse[]> {
    return authFetch('/v1/conversations');
  },

  getMessages(
    conversationId: number,
    before?: number,
    limit = 30,
  ): Promise<CursorPageResponse<MessageResponse>> {
    const params = new URLSearchParams({ limit: String(limit) });
    if (before) params.set('before', String(before));
    return authFetch(`/v1/conversations/${conversationId}/messages?${params}`);
  },

  sendMessage(
    conversationId: number,
    request: SendMessageRequest,
  ): Promise<MessageResponse> {
    return authFetch(`/v1/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  markRead(conversationId: number, upToMessageId: number): Promise<void> {
    return authFetch(`/v1/conversations/${conversationId}/read?upToMessageId=${upToMessageId}`, {
      method: 'POST',
    });
  },

  deleteMessage(messageId: number): Promise<void> {
    return authFetch(`/v1/messages/${messageId}`, { method: 'DELETE' });
  },

  reportMessage(messageId: number, reason: string): Promise<void> {
    return authFetch(`/v1/messages/${messageId}/report`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },

  uploadAndSendImage(
    conversationId: number,
    file: File,
    clientMessageId?: string,
  ): Promise<MessageResponse> {
    const token = tokenStore.get();
    const form = new FormData();
    form.append('file', file);
    if (clientMessageId) form.append('clientMessageId', clientMessageId);

    return fetch(`${BASE}/v1/conversations/${conversationId}/messages/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    }).then(async (res) => {
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message ?? 'Upload failed');
      return json.data as MessageResponse;
    });
  },
};
