import { api } from "@/lib/api";
import type {
  CreateCropRequest,
  CreateLocationRequest,
  CropCategoryResponse,
  CropPageResponse,
  CropResponse,
  LocationResponse,
  LocationType,
  UpdateCropRequest,
  UpdateLocationRequest,
} from "@/types/master-data";
import type {
  CreateCropCategoryRequest,
  UpdateCropCategoryRequest,
} from "@/types/crop-category";

function queryString(params: Record<string, string | number | boolean | undefined>) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") query.set(key, String(value));
  });
  const encoded = query.toString();
  return encoded ? `?${encoded}` : "";
}

export const masterDataService = {
  getCropCategories: () =>
    api.get<CropCategoryResponse[]>("/v1/crop-categories"),

  getCrops: (params?: { categoryId?: number; search?: string; page?: number; size?: number }) =>
    api.get<CropPageResponse>(`/v1/crops${queryString(params ?? {})}`),

  getCropsByCategory: (categoryId: number) =>
    api.get<CropResponse[]>(`/v1/crop-categories/${categoryId}/crops`),

  getCrop: (id: number) =>
    api.get<CropResponse>(`/v1/crops/${id}`),

  adminGetCropCategories: (activeOnly?: boolean) =>
    api.get<CropCategoryResponse[]>(`/v1/admin/crop-categories${queryString({ activeOnly })}`),

  adminCreateCategory: (data: CreateCropCategoryRequest) =>
    api.post<CropCategoryResponse>("/v1/admin/crop-categories", data),

  adminUpdateCategory: (id: number, data: UpdateCropCategoryRequest) =>
    api.put<CropCategoryResponse>(`/v1/admin/crop-categories/${id}`, data),

  adminUpdateCategoryStatus: (id: number, active: boolean) =>
    api.patch<CropCategoryResponse>(`/v1/admin/crop-categories/${id}/status${queryString({ active })}`),

  adminDeleteCategory: (id: number) =>
    api.delete<void>(`/v1/admin/crop-categories/${id}`),

  adminGetCrops: (params?: { categoryId?: number; search?: string; activeOnly?: boolean; page?: number; size?: number }) =>
    api.get<CropPageResponse>(`/v1/admin/crops${queryString(params ?? {})}`),

  adminCreateCrop: (data: CreateCropRequest) =>
    api.post<CropResponse>("/v1/admin/crops", data),

  adminUpdateCrop: (id: number, data: UpdateCropRequest) =>
    api.put<CropResponse>(`/v1/admin/crops/${id}`, data),

  adminUpdateCropStatus: (id: number, active: boolean) =>
    api.patch<CropResponse>(`/v1/admin/crops/${id}/status${queryString({ active })}`),

  adminDeleteCrop: (id: number) =>
    api.delete<void>(`/v1/admin/crops/${id}`),

  getProvinces: () =>
    api.get<LocationResponse[]>("/v1/locations/provinces"),

  getDistricts: (provinceId: number) =>
    api.get<LocationResponse[]>(`/v1/locations/provinces/${provinceId}/districts`),

  getMunicipalities: (districtId: number) =>
    api.get<LocationResponse[]>(`/v1/locations/districts/${districtId}/municipalities`),

  getLocations: (type?: LocationType) =>
    api.get<LocationResponse[]>(`/v1/locations${queryString({ type })}`),

  adminGetLocations: (params?: { type?: LocationType; parentId?: number; activeOnly?: boolean }) =>
    api.get<LocationResponse[]>(`/v1/admin/locations${queryString(params ?? {})}`),

  adminCreateProvince: (data: CreateLocationRequest) =>
    api.post<LocationResponse>("/v1/admin/locations/provinces", data),

  adminUpdateProvince: (id: number, data: UpdateLocationRequest) =>
    api.put<LocationResponse>(`/v1/admin/locations/provinces/${id}`, data),

  adminDeleteProvince: (id: number) =>
    api.delete<void>(`/v1/admin/locations/provinces/${id}`),

  adminCreateDistrict: (data: CreateLocationRequest) =>
    api.post<LocationResponse>("/v1/admin/locations/districts", data),

  adminUpdateDistrict: (id: number, data: UpdateLocationRequest) =>
    api.put<LocationResponse>(`/v1/admin/locations/districts/${id}`, data),

  adminDeleteDistrict: (id: number) =>
    api.delete<void>(`/v1/admin/locations/districts/${id}`),

  adminCreateMunicipality: (data: CreateLocationRequest) =>
    api.post<LocationResponse>("/v1/admin/locations/municipalities", data),

  adminUpdateMunicipality: (id: number, data: UpdateLocationRequest) =>
    api.put<LocationResponse>(`/v1/admin/locations/municipalities/${id}`, data),

  adminDeleteMunicipality: (id: number) =>
    api.delete<void>(`/v1/admin/locations/municipalities/${id}`),
};
