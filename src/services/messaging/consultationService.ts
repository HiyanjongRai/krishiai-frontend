import { tokenStore } from '@/lib/api';
import type {
  AnnouncementDto,
  ConsultationDetailDto,
  ConsultationRequestDto,
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

export const consultationService = {
  requestConsultation(data: ConsultationRequestDto): Promise<ConsultationDetailDto> {
    return authFetch('/v1/consultations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  listConsultations(): Promise<ConsultationDetailDto[]> {
    return authFetch('/v1/consultations');
  },

  getConsultation(id: number): Promise<ConsultationDetailDto> {
    return authFetch(`/v1/consultations/${id}`);
  },

  acceptConsultation(id: number): Promise<ConsultationDetailDto> {
    return authFetch(`/v1/consultations/${id}/accept`, {
      method: 'POST',
    });
  },

  rejectConsultation(id: number): Promise<ConsultationDetailDto> {
    return authFetch(`/v1/consultations/${id}/reject`, {
      method: 'POST',
    });
  },

  completeConsultation(id: number): Promise<ConsultationDetailDto> {
    return authFetch(`/v1/consultations/${id}/complete`, {
      method: 'POST',
    });
  },

  cancelConsultation(id: number): Promise<ConsultationDetailDto> {
    return authFetch(`/v1/consultations/${id}/cancel`, {
      method: 'POST',
    });
  },

  getMyAnnouncements(): Promise<AnnouncementDto[]> {
    return authFetch('/v1/announcements');
  },
};
