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
import {
  getMyProfile,
  loginUser,
  registerUser,
  logoutUser,
  changePassword as changePasswordApi,
} from "@/services/auth";
import type {
  AuthContextType,
  ChangePasswordRequest,
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
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isVerifiedExpert, setIsVerifiedExpert] = useState<boolean | null>(null);
  const [verificationStatusLoading, setVerificationStatusLoading] = useState(false);

  // On mount: restore session from localStorage
  useEffect(() => {
    const handleExpiredSession = () => {
      tokenStore.clear();
      setToken(null);
      setRefreshToken(null);
      setUser(null);
      setIsVerifiedExpert(null);
      router.replace("/");
    };
    window.addEventListener("krishiai:auth-expired", handleExpiredSession);

    const storedToken = tokenStore.get();
    const storedRefreshToken = tokenStore.getRefreshToken();

    if (!storedToken) {
      const timer = window.setTimeout(() => setIsLoading(false), 0);
      return () => {
        window.clearTimeout(timer);
        window.removeEventListener("krishiai:auth-expired", handleExpiredSession);
      };
    }

    const hydrationTimer = window.setTimeout(() => {
      setToken(storedToken);
      setRefreshToken(storedRefreshToken);
    }, 0);

    // Validate token by fetching the user profile
    getMyProfile()
      .then((profile) => setUser(profile))
      .catch(() => {
        // Stale or invalid token → clear it
        tokenStore.clear();
        setToken(null);
        setRefreshToken(null);
        setUser(null);
      })
      .finally(() => setIsLoading(false));

    return () => {
      window.clearTimeout(hydrationTimer);
      window.removeEventListener("krishiai:auth-expired", handleExpiredSession);
    };
  }, [router]);

  // ─── Check / Cache Expert Verification ───────────────────────────────────────
  const checkExpertVerification = useCallback(async (): Promise<boolean> => {
    if (isVerifiedExpert !== null) {
      return isVerifiedExpert;
    }

    setVerificationStatusLoading(true);
    try {
      const res = await api.get<{
        verificationStatus?: string;
        verifiedExpert?: boolean;
        applicationStatus?: string;
      }>("/v1/expert/profile");
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

      if (response.refreshToken) {
        tokenStore.setRefreshToken(response.refreshToken);
        setRefreshToken(response.refreshToken);
      }

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

      if (loginResponse.refreshToken) {
        tokenStore.setRefreshToken(loginResponse.refreshToken);
        setRefreshToken(loginResponse.refreshToken);
      }

      setUser(loginResponse.user);
      setIsVerifiedExpert(null);
      return newUser;
    },
    []
  );

  // ─── Logout ────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      await logoutUser();
    } catch {
      // Ignore network errors on logout; proceed with local session cleanup
    } finally {
      tokenStore.clear();
      setToken(null);
      setRefreshToken(null);
      setUser(null);
      setIsVerifiedExpert(null);
      setTimeout(() => setIsLoggingOut(false), 600);
    }
  }, []);

  // ─── Change Password ───────────────────────────────────────────────────────
  const changePassword = useCallback(
    async (data: ChangePasswordRequest): Promise<void> => {
      await changePasswordApi(data);
    },
    []
  );

  // ─── Update User ───────────────────────────────────────────────────────────
  const updateUser = useCallback((updatedUser: UserResponse) => {
    setUser(updatedUser);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        refreshToken,
        isLoading,
        isAuthenticated: !!user && !!token,
        isLoggingOut,
        isVerifiedExpert,
        verificationStatusLoading,
        checkExpertVerification,
        login,
        register,
        logout,
        changePassword,
        updateUser,
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
