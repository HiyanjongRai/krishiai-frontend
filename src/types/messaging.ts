// ─── Messaging & Consultation Types ──────────────────────────────────────────

export type MessageType = 'TEXT' | 'IMAGE' | 'SYSTEM';
export type ConversationType = 'CONSULTATION' | 'ADMIN_SUPPORT' | 'ANNOUNCEMENT';
export type ConsultationStatus =
  | 'REQUESTED'
  | 'PENDING'
  | 'PAYMENT_PENDING'
  | 'ACCEPTED'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REJECTED'
  | 'EXPIRED';
export type ReportStatus = 'PENDING' | 'REVIEWED' | 'DISMISSED';

export interface UserPublicSummaryDto {
  id: number;
  fullName: string;
  profileImageUrl: string | null;
  role: string;
  online: boolean;
  verifiedExpert: boolean;
  specialization: string | null;
}

export interface MessageResponse {
  id: number;
  conversationId: number;
  sender: UserPublicSummaryDto;
  content: string;
  messageType: MessageType;
  attachmentUrl: string | null;
  attachmentPublicId: string | null;
  attachmentMimeType: string | null;
  attachmentFileSize: number | null;
  deleted: boolean;
  senderOnline: boolean;
  deliveryStatus: string;
  clientMessageId: string | null;
  createdAt: string;
}

export interface ConversationSummaryResponse {
  id: number;
  type: ConversationType;
  consultationId: number | null;
  title: string | null;
  otherParticipant: UserPublicSummaryDto | null;
  lastMessage: MessageResponse | null;
  unreadCount: number;
  updatedAt: string;
}

export interface CursorPageResponse<T> {
  items: T[];
  nextCursor: number | null;
  hasMore: boolean;
  limit: number;
}

export interface ConsultationDetailDto {
  id: number;
  farmer: UserPublicSummaryDto;
  expert: UserPublicSummaryDto | null;
  cropName: string | null;
  cropId: number | null;
  status: ConsultationStatus;
  subject: string | null;
  description: string | null;
  conversationId: number | null;
  packageId?: number | null;
  priceAtPurchase?: number | null;
  currency?: string | null;
  durationHours?: number | null;
  createdAt: string;
  acceptedAt: string | null;
  paymentVerifiedAt?: string | null;
  startedAt?: string | null;
  expiresAt?: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
}

export interface ConsultationRequestDto {
  expertId: number;
  cropId?: number;
  packageId?: number;
  subject: string;
  description?: string;
}

export interface SendMessageRequest {
  content?: string;
  messageType?: MessageType;
  attachmentUrl?: string;
  attachmentPublicId?: string;
  attachmentMimeType?: string;
  attachmentFileSize?: number;
  clientMessageId?: string;
}

export interface TypingEventDto {
  conversationId: number;
  userId: number;
  displayName: string;
  typing: boolean;
}

export interface PresenceEventDto {
  userId: number;
  displayName: string;
  online: boolean;
}

export interface AnnouncementDto {
  id: number;
  title: string;
  content: string;
  createdByName: string;
  targetRole: string | null;
  createdAt: string;
  expiresAt: string | null;
}

export interface ReadReceiptEvent {
  conversationId: number;
  userId: number;
  lastReadMessageId: number;
}
