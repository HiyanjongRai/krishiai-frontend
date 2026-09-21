import { tokenStore } from "@/lib/api";
import type { VerifiedExpert } from "@/types/expert-directory";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";

async function publicFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const token = tokenStore.get();
  const res = await fetch(`${BASE}${url}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
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

export const expertDirectoryService = {
  async getExperts(crop?: string): Promise<VerifiedExpert[]> {
    const query = crop ? `?crop=${encodeURIComponent(crop)}` : "";
    return publicFetch<VerifiedExpert[]>(`/v1/experts${query}`);
  },

  async getExpertDetail(id: number): Promise<VerifiedExpert> {
    return publicFetch<VerifiedExpert>(`/v1/experts/${id}`);
  },

  async searchByCrop(crop: string): Promise<VerifiedExpert[]> {
    return publicFetch<VerifiedExpert[]>(`/v1/experts/search?crop=${encodeURIComponent(crop)}`);
  },
};
