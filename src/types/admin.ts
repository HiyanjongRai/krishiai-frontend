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
