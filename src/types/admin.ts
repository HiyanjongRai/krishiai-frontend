import type { UserRole, UserStatus } from "./auth";

// Mirrors Java record: com.krishiai.admin.dto.UpdateUserStatusRequest
export interface UpdateUserStatusRequest {
  status: UserStatus;
  reason?: string;
}

// Mirrors Java record: com.krishiai.admin.dto.UserStatusResponse
export interface UserStatusResponse {
  userId: number;
  email: string;
  fullName: string;
  role: UserRole;
  status: UserStatus;
  updatedAt?: string;
}

// Mirrors Java record: com.krishiai.admin.dto.FarmerSummaryResponse
export interface FarmerSummary {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  status: string;
  emailVerified: boolean;
  profileImage?: string;
  createdAt?: string;
  cropsCount?: number;
  aiAnalysesCount?: number;
}

// Mirrors Java record: com.krishiai.admin.dto.AdminDashboardStatsResponse
export interface AdminDashboardStats {
  totalFarmers: number;
  totalExperts: number;
  pendingVerifications: number;
  totalConsultations: number;
  activeConsultations: number;
}

// Mirrors Java record: com.krishiai.common.response.PageResponse<T>
export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

// Mirrors Java record: com.krishiai.admin.dto.UpdateUserRoleRequest
export interface UpdateUserRoleRequest {
  role: UserRole;
  reason?: string;
}

