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
   * Admin: Get pending withdrawal requests (backward compat).
   */
  getPendingWithdrawals(): Promise<WithdrawalRequest[]> {
    return authFetch('/v1/admin/withdrawals/pending');
  },

  /**
   * Admin: List all withdrawals with optional status filter.
   */
  listAllWithdrawals(status?: string): Promise<WithdrawalRequest[]> {
    const query = status && status !== 'ALL' ? `?status=${encodeURIComponent(status)}` : '';
    return authFetch(`/v1/admin/withdrawals${query}`);
  },

  /**
   * Admin: Approve a PENDING withdrawal request.
   */
  approveWithdrawal(id: number): Promise<WithdrawalRequest> {
    return authFetch(`/v1/admin/withdrawals/${id}/approve`, {
      method: 'POST',
    });
  },

  /**
   * Admin: Reject a withdrawal request (PENDING or APPROVED).
   */
  rejectWithdrawal(id: number, notes?: string): Promise<WithdrawalRequest> {
    return authFetch(`/v1/admin/withdrawals/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    });
  },

  /**
   * Admin: Mark an APPROVED withdrawal as PROCESSING.
   */
  markWithdrawalProcessing(id: number): Promise<WithdrawalRequest> {
    return authFetch(`/v1/admin/withdrawals/${id}/mark-processing`, {
      method: 'POST',
    });
  },

  /**
   * Admin: Mark a PROCESSING withdrawal as COMPLETED with payout reference and optional notes.
   */
  markWithdrawalCompleted(id: number, payoutReference: string, notes?: string): Promise<WithdrawalRequest> {
    return authFetch(`/v1/admin/withdrawals/${id}/mark-completed`, {
      method: 'POST',
      body: JSON.stringify({ payoutReference, notes }),
    });
  },

  /**
   * Admin: Mark a PROCESSING withdrawal as FAILED / CANCELLED.
   */
  markWithdrawalFailed(id: number, notes?: string): Promise<WithdrawalRequest> {
    return authFetch(`/v1/admin/withdrawals/${id}/mark-failed`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    });
  },
};
