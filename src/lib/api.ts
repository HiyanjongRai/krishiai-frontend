import type { ApiResponse, TokenResponse } from "@/types/auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";

// ─── Token helpers ────────────────────────────────────────────────────────────
const TOKEN_KEY = "krishiai_access_token";
const REQUEST_TIMEOUT_MS = 15_000;
let refreshTokenMemory: string | null = null;

export const tokenStore = {
  get: (): string | null => {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem(TOKEN_KEY);
  },
  set: (token: string): void => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(TOKEN_KEY, token);
    }
  },
  getRefreshToken: (): string | null => {
    return refreshTokenMemory;
  },
  setRefreshToken: (token: string): void => {
    refreshTokenMemory = token;
  },
  clear: (): void => {
    refreshTokenMemory = null;
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(TOKEN_KEY);
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

// ─── Refresh lock to prevent concurrent refresh requests ─────────────────────
let isRefreshing = false;
let refreshSubscribers: ((newToken: string | null) => void)[] = [];

function subscribeTokenRefresh(cb: (newToken: string | null) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(newToken: string | null) {
  refreshSubscribers.forEach((cb) => cb(newToken));
  refreshSubscribers = [];
}

async function attemptTokenRefresh(): Promise<string | null> {
  const currentRefreshToken = tokenStore.getRefreshToken();
  if (!currentRefreshToken) return null;

  try {
    const res = await fetchWithTimeout(`${BASE_URL}/v1/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: currentRefreshToken }),
    });

    if (!res.ok) return null;

    const data: ApiResponse<TokenResponse> = await res.json();
    if (data.data?.accessToken) {
      tokenStore.set(data.data.accessToken);
      if (data.data.refreshToken) {
        tokenStore.setRefreshToken(data.data.refreshToken);
      }
      return data.data.accessToken;
    }
    return null;
  } catch {
    return null;
  }
}

// ─── Core fetch wrapper ────────────────────────────────────────────────────────
async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  isRetry = false
): Promise<T> {
  const token = tokenStore.get();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetchWithTimeout(`${BASE_URL}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new ApiError(0, "Unable to connect to the server");
  }

  // Handle 401 Unauthorized with automatic token refresh
  const isAuthEndpoint =
    path.startsWith("/v1/auth/login") ||
    path.startsWith("/v1/auth/refresh") ||
    path.startsWith("/v1/auth/register");

  if (res.status === 401 && !isAuthEndpoint && !isRetry) {
    const refreshToken = tokenStore.getRefreshToken();
    if (refreshToken) {
      if (!isRefreshing) {
        isRefreshing = true;
        const newAccessToken = await attemptTokenRefresh();
        isRefreshing = false;
        onRefreshed(newAccessToken);

        if (newAccessToken) {
          return apiFetch<T>(path, options, true);
        }
      } else {
        // Wait for active refresh to finish
        const retryPromise = new Promise<T>((resolve, reject) => {
          subscribeTokenRefresh((newToken) => {
            if (newToken) {
              resolve(apiFetch<T>(path, options, true));
            } else {
              reject(new ApiError(401, "Session expired. Please log in again."));
            }
          });
        });
        return retryPromise;
      }
    }

    // Refresh failed or no refresh token → clear & notify
    tokenStore.clear();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("krishiai:auth-expired"));
    }
  }

  // Parse JSON (backend returns ApiResponse<T> for normal responses).
  let body: ApiResponse<T>;
  try {
    body = await res.json();
  } catch {
    if (!res.ok) {
      throw new ApiError(res.status, "Request failed");
    }
    throw new ApiError(res.status, "Failed to parse server response");
  }

  if (!res.ok) {
    if (res.status === 401 && !isAuthEndpoint && isRetry) {
      tokenStore.clear();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("krishiai:auth-expired"));
      }
    }
    throw new ApiError(res.status, body.message ?? "Request failed", body.errors);
  }

  return body.data;
}

async function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit = {},
  timeoutMs = REQUEST_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const timeout = globalThis.setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(input, {
      ...init,
      signal: init.signal ?? controller.signal,
    });
  } finally {
    globalThis.clearTimeout(timeout);
  }
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

  put: <T>(path: string, body: unknown = {}) =>
    apiFetch<T>(path, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  delete: <T>(path: string) =>
    apiFetch<T>(path, { method: "DELETE" }),
};
