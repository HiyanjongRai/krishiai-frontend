import { tokenStore } from '@/lib/api';
import type {
  ConsultationPackage,
  CreateConsultationPackageRequest,
  UpdateConsultationPackageRequest,
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

export const packageService = {
  /**
   * Expert: Create a new consultation package.
   */
  createPackage(request: CreateConsultationPackageRequest): Promise<ConsultationPackage> {
    return authFetch('/v1/expert/consultation-packages', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  /**
   * Expert: List all packages owned by the logged-in expert.
   */
  listMyPackages(): Promise<ConsultationPackage[]> {
    return authFetch('/v1/expert/consultation-packages');
  },

  /**
   * Expert: Update a package.
   */
  updatePackage(
    id: number,
    request: UpdateConsultationPackageRequest
  ): Promise<ConsultationPackage> {
    return authFetch(`/v1/expert/consultation-packages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(request),
    });
  },

  /**
   * Expert: Deactivate a package.
   */
  deletePackage(id: number): Promise<void> {
    return authFetch(`/v1/expert/consultation-packages/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Public / Farmer: List active packages for a specific expert.
   */
  listExpertPackages(expertId: number): Promise<ConsultationPackage[]> {
    return authFetch(`/v1/experts/${expertId}/consultation-packages`);
  },

  /**
   * Public / Farmer: Get detail of a package.
   */
  getPackageDetail(id: number): Promise<ConsultationPackage> {
    return authFetch(`/v1/consultation-packages/${id}`);
  },
};
