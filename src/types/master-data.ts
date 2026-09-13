import type { PageResponse } from "@/types/admin";

export interface CropCategoryResponse {
  id: number;
  name: string;
  code: string;
  description?: string | null;
  icon?: string | null;
  defaultCategory?: boolean;
  cropCount?: number;
  active: boolean;
}

export interface CropResponse {
  id: number;
  categoryId: number;
  categoryName: string;
  name: string;
  scientificName?: string | null;
  nepaliName?: string | null;
  emoji?: string | null;
  imageUrl?: string | null;
  description?: string | null;
  defaultCrop?: boolean;
  active: boolean;
}

export type LocationType = "PROVINCE" | "DISTRICT" | "MUNICIPALITY";

export type MunicipalityType =
  | "METROPOLITAN_CITY"
  | "SUB_METROPOLITAN_CITY"
  | "MUNICIPALITY"
  | "RURAL_MUNICIPALITY";

export interface LocationResponse {
  id: number;
  name: string;
  nepaliName?: string | null;
  code?: string | null;
  type: LocationType;
  municipalityType?: MunicipalityType | null;
  parentId?: number | null;
  parentName?: string | null;
  active: boolean;
}

export interface CreateCropRequest {
  categoryId: number;
  name: string;
  scientificName?: string;
  nepaliName?: string;
  emoji?: string;
  imageUrl?: string;
  description?: string;
  active?: boolean;
}

export type UpdateCropRequest = Partial<CreateCropRequest>;

export interface CreateLocationRequest {
  parentId?: number;
  name: string;
  nepaliName?: string;
  code?: string;
  municipalityType?: MunicipalityType;
  active?: boolean;
}

export type UpdateLocationRequest = Partial<CreateLocationRequest>;

export type CropPageResponse = PageResponse<CropResponse>;
