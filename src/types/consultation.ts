export interface Consultation {
  id: string | number;
  farmerId: string | number;
  expertId: string | number;
  cropId?: string | number;
  status: "PENDING" | "SCHEDULED" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  scheduledAt?: string;
  notes?: string;
  fee?: number;
}

// Mirrors Java record: com.krishiai.consultation.dto.MessageResponse
export interface ConsultationMessage {
  id: number;
  consultationId: number;
  senderId: number;
  senderName: string;
  senderRole: string;
  message: string;
  sentAt: string;
}

// Mirrors Java record: com.krishiai.consultation.dto.SendMessageRequest
export interface SendMessageRequest {
  message: string;
}
