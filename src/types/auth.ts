// Mirrors Java enum: com.krishiai.user.entity.UserRole
export type UserRole = "ROLE_FARMER" | "ROLE_EXPERT" | "ROLE_ADMIN";

// Mirrors Java enum: com.krishiai.user.entity.UserStatus
export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING" | "PENDING_VERIFICATION" | "BLOCKED";

// Mirrors Java record: com.krishiai.user.dto.UserResponse
export interface UserResponse {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName: string;
  phone: string | null;
  profileImage: string | null;
  profileImagePublicId?: string | null;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

// Mirrors Java record: com.krishiai.auth.dto.LoginRequest
export interface LoginRequest {
  email: string;
  password: string;
}

// Mirrors Java record: com.krishiai.auth.dto.LoginResponse & TokenResponse
export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresInMs: number;
  refreshToken?: string;
  user: UserResponse;
}

export type TokenResponse = LoginResponse;

// Mirrors Java record: com.krishiai.auth.dto.RefreshTokenRequest
export interface RefreshTokenRequest {
  refreshToken: string;
}

// Mirrors Java record: com.krishiai.auth.dto.ChangePasswordRequest
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword?: string;
}

// Mirrors Java record: com.krishiai.auth.dto.ForgotPasswordRequest
export interface ForgotPasswordRequest {
  email: string;
}

// Mirrors Java record: com.krishiai.auth.dto.ResetPasswordRequest
export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

// Mirrors Java record: com.krishiai.auth.dto.RegisterRequest
export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  role: UserRole;
}

// Mirrors Java class: com.krishiai.common.response.ApiResponse<T>
export interface ApiResponse<T> {
  status: number;
  message: string;
  timestamp: string;
  data: T;
  errors: string[] | null;
}

// Auth context types
export interface AuthContextType {
  user: UserResponse | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isLoggingOut: boolean;
  isVerifiedExpert: boolean | null;
  verificationStatusLoading: boolean;
  checkExpertVerification: () => Promise<boolean>;
  login: (email: string, password: string) => Promise<LoginResponse>;
  register: (data: RegisterRequest) => Promise<UserResponse>;
  logout: () => Promise<void>;
  changePassword: (data: ChangePasswordRequest) => Promise<void>;
  /** Push an updated user object into auth state (e.g. after profile image upload) */
  updateUser: (user: UserResponse) => void;
}
