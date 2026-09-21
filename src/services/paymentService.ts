import { tokenStore } from '@/lib/api';
import type {
  PaymentInitiationResponse,
  PaymentResponseDto,
  VerifyPaymentRequest,
} from '@/types/payment';

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

export const paymentService = {
  /**
   * Farmer initiates eSewa payment for a consultation.
   */
  initiatePayment(
    consultationId: number,
    successUrl?: string,
    failureUrl?: string
  ): Promise<PaymentInitiationResponse> {
    const params = new URLSearchParams({
      consultationId: consultationId.toString(),
    });
    if (successUrl) params.append('successUrl', successUrl);
    if (failureUrl) params.append('failureUrl', failureUrl);

    return authFetch(`/v1/payments/initiate?${params.toString()}`, {
      method: 'POST',
    });
  },

  /**
   * Verifies eSewa Base64-encoded response payload after payment redirect.
   */
  verifyPayment(payload: VerifyPaymentRequest): Promise<PaymentResponseDto> {
    return authFetch('/v1/payments/verify', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Check status of a payment.
   */
  getPaymentStatus(id: number): Promise<PaymentResponseDto> {
    return authFetch(`/v1/payments/${id}/status`);
  },
};
