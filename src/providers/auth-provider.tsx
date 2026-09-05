"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { tokenStore, api } from "@/lib/api";
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
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isVerifiedExpert, setIsVerifiedExpert] = useState<boolean | null>(null);
  const [verificationStatusLoading, setVerificationStatusLoading] = useState(false);

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

  // ─── Check / Cache Expert Verification ───────────────────────────────────────
  const checkExpertVerification = useCallback(async (): Promise<boolean> => {
    // Return cached value if already verified or rejected
    if (isVerifiedExpert !== null) {
      return isVerifiedExpert;
    }

    setVerificationStatusLoading(true);
    try {
      const res = await api.get<any>("/v1/expert/profile");
      const verified =
        res?.verificationStatus === "VERIFIED" ||
        res?.verifiedExpert === true ||
        res?.applicationStatus === "APPROVED";
      setIsVerifiedExpert(verified);
      return verified;
    } catch {
      setIsVerifiedExpert(false);
      return false;
    } finally {
      setVerificationStatusLoading(false);
    }
  }, [isVerifiedExpert]);

  // ─── Login ─────────────────────────────────────────────────────────────────
  const login = useCallback(
    async (email: string, password: string): Promise<LoginResponse> => {
      const response = await loginUser(email, password);
      tokenStore.set(response.accessToken);
      setToken(response.accessToken);
      setUser(response.user);
      setIsVerifiedExpert(null);
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
      setIsVerifiedExpert(null);
      return newUser;
    },
    []
  );

  // ─── Logout ────────────────────────────────────────────────────────────────
  // Navigation is handled by the caller (navbar) to avoid double push.
  const logout = useCallback(() => {
    setIsLoggingOut(true);
    tokenStore.clear();
    setToken(null);
    setUser(null);
    setIsVerifiedExpert(null);
    // Briefly keep isLoggingOut=true so the navbar button stays disabled
    // during the navigation animation, then reset.
    setTimeout(() => setIsLoggingOut(false), 600);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token,
        isLoggingOut,
        isVerifiedExpert,
        verificationStatusLoading,
        checkExpertVerification,
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
