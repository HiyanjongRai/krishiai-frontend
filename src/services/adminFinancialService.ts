import { tokenStore } from '@/lib/api';
import type {
  AdminFinancialSummary,
  PaymentResponseDto,
  WithdrawalRequest,
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

export const adminFinancialService = {
  /**
   * Admin: Get financial statistics and summary.
   */
  getFinancialSummary(): Promise<AdminFinancialSummary> {
    return authFetch('/v1/admin/financials');
  },

  /**
   * Admin: Get all payment transactions with pagination.
   */
  listAllPayments(page: number = 0, size: number = 20): Promise<PaymentResponseDto[]> {
    return authFetch(`/v1/admin/payments?page=${page}&size=${size}`);
  },

  /**
   * Admin: Get pending withdrawal requests.
   */
  getPendingWithdrawals(): Promise<WithdrawalRequest[]> {
    return authFetch('/v1/admin/withdrawals/pending');
  },
};
