import { api } from "@/lib/api";
import type {
  AdminDashboardStats,
  FarmerSummary,
  PageResponse,
  UpdateUserRoleRequest,
  UpdateUserStatusRequest,
  UserStatusResponse,
} from "@/types/admin";
import type { UserResponse, UserRole, UserStatus } from "@/types/auth";
import type {
  CreateCropCategoryRequest,
  CropCategoryResponse,
  UpdateCropCategoryRequest,
} from "@/types/crop-category";

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
   * GET /api/v1/admin/users
   * Paginated and filtered users list
   */
  getUsers: async (params?: {
    search?: string;
    role?: UserRole | string;
    status?: UserStatus | string;
    page?: number;
    size?: number;
  }): Promise<PageResponse<UserResponse>> => {
    const query = new URLSearchParams();
    if (params?.search) query.set("search", params.search);
    if (params?.role && params.role !== "ALL") query.set("role", params.role);
    if (params?.status && params.status !== "ALL") query.set("status", params.status);
    if (params?.page !== undefined) query.set("page", params.page.toString());
    if (params?.size !== undefined) query.set("size", params.size.toString());
    const qs = query.toString() ? `?${query.toString()}` : "";
    return api.get<PageResponse<UserResponse>>(`/v1/admin/users${qs}`);
  },

  /**
   * GET /api/v1/admin/users/{userId}
   */
  getUserById: async (userId: number): Promise<UserResponse> => {
    return api.get<UserResponse>(`/v1/admin/users/${userId}`);
  },

  /**
   * PATCH /api/v1/admin/users/{userId}/role
   */
  updateUserRole: async (
    userId: number,
    request: UpdateUserRoleRequest
  ): Promise<UserResponse> => {
    return api.patch<UserResponse>(`/v1/admin/users/${userId}/role`, request);
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

  /**
   * GET /api/v1/admin/documents
   * Get all expert credentials/documents with optional status filter
   */
  getDocuments: async <T = unknown>(params?: {
    status?: string;
    page?: number;
    size?: number;
  }): Promise<PageResponse<T>> => {
    const query = new URLSearchParams();
    if (params?.status && params.status !== "ALL") query.set("status", params.status);
    if (params?.page !== undefined) query.set("page", params.page.toString());
    if (params?.size !== undefined) query.set("size", params.size.toString());
    const qs = query.toString() ? `?${query.toString()}` : "";
    return api.get<PageResponse<T>>(`/v1/admin/documents${qs}`);
  },

  /**
   * GET /api/v1/admin/documents/{documentId}
   */
  getDocumentById: async <T = unknown>(documentId: number): Promise<T> => {
    return api.get<T>(`/v1/admin/documents/${documentId}`);
  },

  /**
   * POST /api/v1/admin/documents/{documentId}/approve
   */
  approveDocument: async <T = unknown>(documentId: number): Promise<T> => {
    return api.post<T>(`/v1/admin/documents/${documentId}/approve`);
  },

  /**
   * POST /api/v1/admin/documents/{documentId}/reject
   */
  rejectDocument: async <T = unknown>(
    documentId: number,
    reason: string
  ): Promise<T> => {
    return api.post<T>(`/v1/admin/documents/${documentId}/reject`, { reason });
  },

  /**
   * GET /api/v1/admin/crop-categories
   */
  getCropCategories: async (): Promise<CropCategoryResponse[]> => {
    return api.get<CropCategoryResponse[]>("/v1/admin/crop-categories");
  },

  /**
   * GET /api/v1/admin/crop-categories/{id}
   */
  getCropCategory: async (id: number): Promise<CropCategoryResponse> => {
    return api.get<CropCategoryResponse>(`/v1/admin/crop-categories/${id}`);
  },

  /**
   * POST /api/v1/admin/crop-categories
   */
  createCropCategory: async (
    data: CreateCropCategoryRequest
  ): Promise<CropCategoryResponse> => {
    return api.post<CropCategoryResponse>("/v1/admin/crop-categories", data);
  },

  /**
   * PUT /api/v1/admin/crop-categories/{id}
   */
  updateCropCategory: async (
    id: number,
    data: UpdateCropCategoryRequest
  ): Promise<CropCategoryResponse> => {
    return api.put<CropCategoryResponse>(`/v1/admin/crop-categories/${id}`, data);
  },

  /**
   * DELETE /api/v1/admin/crop-categories/{id}
   */
  deleteCropCategory: async (id: number): Promise<void> => {
    return api.delete<void>(`/v1/admin/crop-categories/${id}`);
  },
};
