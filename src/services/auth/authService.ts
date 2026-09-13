import { api } from "@/lib/api";
import type {
  ChangePasswordRequest,
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RegisterRequest,
  TokenResponse,
  UserResponse,
} from "@/types/auth";

/**
 * POST /api/v1/auth/login
 * Returns the full LoginResponse with accessToken + refreshToken + user info.
 */
export async function loginUser(
  email: string,
  password: string
): Promise<LoginResponse> {
  const payload: LoginRequest = { email, password };
  return api.post<LoginResponse>("/v1/auth/login", payload);
}

/**
 * POST /api/v1/auth/register
 * Returns the UserResponse for the newly created user.
 */
export async function registerUser(
  data: RegisterRequest
): Promise<UserResponse> {
  return api.post<UserResponse>("/v1/auth/register", data);
}

/**
 * POST /api/v1/auth/refresh
 * Exchanges a valid refresh token for a new access token and rotated refresh token.
 */
export async function refreshToken(
  refreshTokenString: string
): Promise<TokenResponse> {
  const payload: RefreshTokenRequest = { refreshToken: refreshTokenString };
  return api.post<TokenResponse>("/v1/auth/refresh", payload);
}

/**
 * POST /api/v1/auth/logout
 * Notifies the backend to revoke all server-side active refresh tokens for the authenticated user.
 */
export async function logoutUser(): Promise<void> {
  return api.post<void>("/v1/auth/logout");
}

/**
 * POST /api/v1/auth/change-password
 * Changes the authenticated user's password and revokes existing refresh tokens.
 */
export async function changePassword(
  data: ChangePasswordRequest
): Promise<void> {
  return api.post<void>("/v1/auth/change-password", data);
}

/**
 * POST /api/v1/auth/forgot-password
 * Triggers password reset email with a secure token.
 */
export async function forgotPassword(email: string): Promise<void> {
  return api.post<void>("/v1/auth/forgot-password", { email });
}

/**
 * POST /api/v1/auth/reset-password
 * Resets user password using the token provided via email.
 */
export async function resetPassword(data: {
  token: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<void> {
  return api.post<void>("/v1/auth/reset-password", data);
}

/**
 * GET /api/v1/users/me
 * Requires a valid Bearer token in the API client.
 * Returns the logged-in user's profile.
 */
export async function getMyProfile(): Promise<UserResponse> {
  return api.get<UserResponse>("/v1/users/me");
}
