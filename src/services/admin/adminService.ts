import { api } from "@/lib/api";
import type {
  AdminDashboardStats,
  FarmerSummary,
  UpdateUserStatusRequest,
  UserStatusResponse,
} from "@/types/admin";

export const adminService = {
  /**
   * GET /api/v1/admin/dashboard/stats
   */
  getDashboardStats: async (): Promise<AdminDashboardStats> => {
    return api.get<AdminDashboardStats>("/v1/admin/dashboard/stats");
  },

  /**
   * GET /api/v1/admin/farmers
   */
  getFarmers: async (): Promise<FarmerSummary[]> => {
    return api.get<FarmerSummary[]>("/v1/admin/farmers");
  },

  /**
   * GET /api/v1/admin/experts/all
   */
  getAllExperts: async <T = unknown>(): Promise<T[]> => {
    return api.get<T[]>("/v1/admin/experts/all");
  },

  /**
   * GET /api/v1/admin/experts/pending
   */
  getPendingExperts: async <T = unknown>(): Promise<T[]> => {
    return api.get<T[]>("/v1/admin/experts/pending");
  },

  /**
   * GET /api/v1/admin/experts/{profileId}
   */
  getExpertDetails: async <T = unknown>(profileId: number): Promise<T> => {
    return api.get<T>(`/v1/admin/experts/${profileId}`);
  },

  /**
   * PATCH /api/v1/admin/users/{userId}/status
   */
  updateUserStatus: async (
    userId: number,
    request: UpdateUserStatusRequest
  ): Promise<UserStatusResponse> => {
    return api.patch<UserStatusResponse>(`/v1/admin/users/${userId}/status`, request);
  },

  /**
   * POST /api/v1/admin/users/{userId}/block
   */
  blockUser: async (
    userId: number,
    reason?: string
  ): Promise<UserStatusResponse> => {
    return api.post<UserStatusResponse>(`/v1/admin/users/${userId}/block`, {
      status: "BLOCKED",
      reason: reason ?? "Blocked by platform administrator",
    });
  },

  /**
   * POST /api/v1/admin/users/{userId}/unblock
   */
  unblockUser: async (
    userId: number,
    reason?: string
  ): Promise<UserStatusResponse> => {
    return api.post<UserStatusResponse>(`/v1/admin/users/${userId}/unblock`, {
      status: "ACTIVE",
      reason: reason ?? "Unblocked by platform administrator",
    });
  },

  /**
   * POST /api/v1/admin/experts/{profileId}/start-review
   */
  startReview: async <T = unknown>(profileId: number): Promise<T> => {
    return api.post<T>(`/v1/admin/experts/${profileId}/start-review`);
  },

  /**
   * POST /api/v1/admin/experts/{profileId}/request-info
   */
  requestAdditionalInfo: async <T = unknown>(
    profileId: number,
    notes?: string
  ): Promise<T> => {
    return api.post<T>(`/v1/admin/experts/${profileId}/request-info`, { notes });
  },

  /**
   * POST /api/v1/admin/experts/{profileId}/approve
   */
  approveExpertApplication: async <T = unknown>(
    profileId: number,
    notes?: string
  ): Promise<T> => {
    return api.post<T>(`/v1/admin/experts/${profileId}/approve`, { notes });
  },

  /**
   * POST /api/v1/admin/experts/{profileId}/reject
   */
  rejectExpertApplication: async <T = unknown>(
    profileId: number,
    notes?: string
  ): Promise<T> => {
    return api.post<T>(`/v1/admin/experts/${profileId}/reject`, { notes });
  },

  /**
   * POST /api/v1/admin/experts/{profileId}/crops/{cropId}/verify
   */
  verifyCropExpertise: async <T = unknown>(
    profileId: number,
    cropId: number,
    verified: boolean,
    notes?: string
  ): Promise<T> => {
    return api.post<T>(`/v1/admin/experts/${profileId}/crops/${cropId}/verify`, {
      verified,
      notes,
    });
  },
};
