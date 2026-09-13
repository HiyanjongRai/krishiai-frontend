import { api } from "@/lib/api";
import type {
  CreateFarmRequest,
  FarmResponse,
  FarmerDashboardResponse,
  UpdateFarmRequest,
} from "@/types/farm";

export const farmService = {
  /**
   * GET /api/v1/farmer/farms
   * Retrieves all non-deleted farms belonging to the authenticated farmer.
   */
  getFarms: async (): Promise<FarmResponse[]> => {
    return api.get<FarmResponse[]>("/v1/farmer/farms");
  },

  /**
   * GET /api/v1/farmer/farms/{id}
   * Retrieves details of a specific farm by ID.
   */
  getFarm: async (id: number): Promise<FarmResponse> => {
    return api.get<FarmResponse>(`/v1/farmer/farms/${id}`);
  },

  /**
   * GET /api/v1/farmer/farm
   * Retrieves primary/legacy farm for the current farmer.
   */
  getPrimaryFarm: async (): Promise<FarmResponse> => {
    return api.get<FarmResponse>("/v1/farmer/farm");
  },

  /**
   * POST /api/v1/farmer/farms
   * Registers a new farm.
   */
  createFarm: async (data: CreateFarmRequest): Promise<FarmResponse> => {
    return api.post<FarmResponse>("/v1/farmer/farms", data);
  },

  /**
   * PUT /api/v1/farmer/farms/{id}
   * Updates an existing farm owned by the current farmer.
   */
  updateFarm: async (id: number, data: UpdateFarmRequest): Promise<FarmResponse> => {
    return api.put<FarmResponse>(`/v1/farmer/farms/${id}`, data);
  },

  /**
   * DELETE /api/v1/farmer/farms/{id}
   * Soft-deletes a farm.
   */
  deleteFarm: async (id: number): Promise<void> => {
    return api.delete<void>(`/v1/farmer/farms/${id}`);
  },

  /**
   * PATCH /api/v1/farmer/farms/{id}/restore
   * Restores a previously soft-deleted farm.
   */
  restoreFarm: async (id: number): Promise<FarmResponse> => {
    return api.patch<FarmResponse>(`/v1/farmer/farms/${id}/restore`);
  },

  /**
   * GET /api/v1/farmer/dashboard
   * Aggregates primary farm, active crops, consultations, activities, and alerts.
   */
  getFarmerDashboard: async (): Promise<FarmerDashboardResponse> => {
    return api.get<FarmerDashboardResponse>("/v1/farmer/dashboard");
  },
};
