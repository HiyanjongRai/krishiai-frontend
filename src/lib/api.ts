import type { ApiResponse } from "@/types/auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";

// ─── Token helpers (localStorage) ─────────────────────────────────────────────
const TOKEN_KEY = "krishiai_access_token";

export const tokenStore = {
  get: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  },
  set: (token: string): void => {
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, token);
    }
  },
  clear: (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
    }
  },
};

// ─── Custom API Error ──────────────────────────────────────────────────────────
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly errors: string[] | null = null
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// ─── Core fetch wrapper ────────────────────────────────────────────────────────
async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = tokenStore.get();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  // Parse JSON (backend always returns ApiResponse<T>)
  let body: ApiResponse<T>;
  try {
    body = await res.json();
  } catch {
    throw new ApiError(res.status, "Failed to parse server response");
  }

  if (!res.ok) {
    // Handle 401 → clear stale token
    if (res.status === 401) {
      tokenStore.clear();
    }
    throw new ApiError(
      res.status,
      body.message ?? "Request failed",
      body.errors
    );
  }

  return body.data;
}

// ─── Public API methods ────────────────────────────────────────────────────────
export const api = {
  get: <T>(path: string) =>
    apiFetch<T>(path, { method: "GET" }),

  post: <T>(path: string, body: unknown = {}) =>
    apiFetch<T>(path, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  patch: <T>(path: string, body: unknown = {}) =>
    apiFetch<T>(path, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  delete: <T>(path: string) =>
    apiFetch<T>(path, { method: "DELETE" }),
};
