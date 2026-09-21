import { tokenStore } from '@/lib/api';
import type {
  CreateWithdrawalRequest,
  ExpertEarningsSummary,
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

export const earningsService = {
  /**
   * Expert: Fetch earnings overview (gross, commission, net available, transactions).
   */
  getMyEarnings(): Promise<ExpertEarningsSummary> {
    return authFetch('/v1/expert/earnings');
  },

  /**
   * Expert: Submit withdrawal payout request.
   */
  requestWithdrawal(request: CreateWithdrawalRequest): Promise<WithdrawalRequest> {
    return authFetch('/v1/expert/withdrawals', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  /**
   * Expert: List own withdrawal requests.
   */
  listWithdrawals(): Promise<WithdrawalRequest[]> {
    return authFetch('/v1/expert/withdrawals');
  },
};
