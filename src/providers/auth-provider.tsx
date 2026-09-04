"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { tokenStore } from "@/lib/api";
import { getMyProfile, loginUser, registerUser } from "@/lib/auth";
import type {
  AuthContextType,
  LoginResponse,
  RegisterRequest,
  UserResponse,
} from "@/types/auth";

// ─── Context ───────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Role → Dashboard route map ───────────────────────────────────────────────
function getDashboardRoute(role: string): string {
  switch (role) {
    case "ROLE_ADMIN":
      return "/admin/dashboard";
    case "ROLE_EXPERT":
      return "/expert/dashboard";
    case "ROLE_FARMER":
    default:
      return "/farmer/dashboard";
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<UserResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount: restore session from localStorage
  useEffect(() => {
    const storedToken = tokenStore.get();
    if (!storedToken) {
      setIsLoading(false);
      return;
    }
    setToken(storedToken);
    // Validate token by fetching the user profile
    getMyProfile()
      .then((profile) => setUser(profile))
      .catch(() => {
        // Token is expired or invalid → clear it
        tokenStore.clear();
        setToken(null);
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // ─── Login ─────────────────────────────────────────────────────────────────
  const login = useCallback(
    async (email: string, password: string): Promise<LoginResponse> => {
      const response = await loginUser(email, password);
      tokenStore.set(response.accessToken);
      setToken(response.accessToken);
      setUser(response.user);
      return response;
    },
    []
  );

  // ─── Register ──────────────────────────────────────────────────────────────
  const register = useCallback(
    async (data: RegisterRequest): Promise<UserResponse> => {
      const newUser = await registerUser(data);
      // Auto-login after registration
      const loginResponse = await loginUser(data.email, data.password);
      tokenStore.set(loginResponse.accessToken);
      setToken(loginResponse.accessToken);
      setUser(loginResponse.user);
      return newUser;
    },
    []
  );

  // ─── Logout ────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    tokenStore.clear();
    setToken(null);
    setUser(null);
    router.push("/");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}

// ─── Helper: redirect to role-appropriate dashboard ───────────────────────────
export { getDashboardRoute };
