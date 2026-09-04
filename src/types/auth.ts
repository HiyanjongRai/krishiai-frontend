// Mirrors Java enum: com.krishiai.user.entity.UserRole
export type UserRole = "ROLE_FARMER" | "ROLE_EXPERT" | "ROLE_ADMIN";

// Mirrors Java enum: com.krishiai.user.entity.UserStatus
export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING_VERIFICATION";

// Mirrors Java record: com.krishiai.user.dto.UserResponse
export interface UserResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string | null;
  profileImage: string | null;
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

// Mirrors Java record: com.krishiai.auth.dto.LoginResponse
export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresInMs: number;
  user: UserResponse;
}

// Mirrors Java record: com.krishiai.auth.dto.RegisterRequest
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
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
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<LoginResponse>;
  register: (data: RegisterRequest) => Promise<UserResponse>;
  logout: () => void;
}
