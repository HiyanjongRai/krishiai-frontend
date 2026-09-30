import { api } from "@/lib/api";

export interface ChatTurn {
  role: "user" | "model";
  text: string;
}

export interface AdvisorChatResponse {
  reply: string;
  fromCache: boolean;
}

export async function sendAdvisorMessage(
  message: string,
  history: ChatTurn[] = []
): Promise<AdvisorChatResponse> {
  return await api.post<AdvisorChatResponse>("/v1/advisor/chat", {
    message,
    history,
  });
}
