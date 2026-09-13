import { api } from "@/lib/api";
import type { ConsultationMessage, SendMessageRequest } from "@/types/consultation";

export const consultationMessageService = {
  /**
   * GET /api/v1/farmer/consultations/{consultationId}/messages
   * Retrieves chronological messages for the consultation thread.
   */
  getMessages: async (
    consultationId: number | string
  ): Promise<ConsultationMessage[]> => {
    return api.get<ConsultationMessage[]>(
      `/v1/farmer/consultations/${consultationId}/messages`
    );
  },

  /**
   * POST /api/v1/farmer/consultations/{consultationId}/messages
   * Sends a message to the consultation thread.
   */
  sendMessage: async (
    consultationId: number | string,
    request: SendMessageRequest
  ): Promise<ConsultationMessage> => {
    return api.post<ConsultationMessage>(
      `/v1/farmer/consultations/${consultationId}/messages`,
      request
    );
  },
};
