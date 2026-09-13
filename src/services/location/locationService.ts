import { api } from "@/lib/api";
import type { LocationResponse } from "@/types/location";

export const locationService = {
  /**
   * GET /api/v1/locations
   * Retrieves all active locations, optionally filtered by type.
   */
  getLocations: async (type?: string): Promise<LocationResponse[]> => {
    const query = type ? `?type=${encodeURIComponent(type)}` : "";
    return api.get<LocationResponse[]>(`/v1/locations${query}`);
  },

  /**
   * GET /api/v1/locations/roots
   * Retrieves top-level (province/country) locations.
   */
  getRootLocations: async (): Promise<LocationResponse[]> => {
    return api.get<LocationResponse[]>("/v1/locations/roots");
  },

  /**
   * GET /api/v1/locations/{parentId}/children
   * Retrieves child locations under a specific parent location.
   */
  getChildren: async (parentId: number): Promise<LocationResponse[]> => {
    return api.get<LocationResponse[]>(`/v1/locations/${parentId}/children`);
  },

  /**
   * GET /api/v1/locations/{locationId}
   * Retrieves detailed location by ID.
   */
  getLocationById: async (locationId: number): Promise<LocationResponse> => {
    return api.get<LocationResponse>(`/v1/locations/${locationId}`);
  },
};
