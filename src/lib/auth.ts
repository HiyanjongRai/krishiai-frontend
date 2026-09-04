import { api } from "@/lib/api";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  UserResponse,
} from "@/types/auth";

/**
 * POST /api/v1/auth/login
 * Returns the full LoginResponse with accessToken + user info.
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
 * GET /api/v1/users/me
 * Requires a valid Bearer token in the API client.
 * Returns the logged-in user's profile.
 */
export async function getMyProfile(): Promise<UserResponse> {
  return api.get<UserResponse>("/v1/users/me");
}
