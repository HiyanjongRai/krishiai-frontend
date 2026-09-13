import type { UserResponse } from "./auth";

export type FarmAreaUnit = "HECTARE" | "ACRE" | "ROPANI" | "BIGHA" | "SQUARE_METER";

export type FarmType =
  | "CROP_FARM"
  | "LIVESTOCK"
  | "MIXED"
  | "HORTICULTURE"
  | "AQUACULTURE"
  | "OTHER";

export interface FarmLocationSummary {
  id: number;
  name: string;
  type?: string | null;
}

// Mirrors Java record: com.krishiai.farm.dto.FarmResponse
export interface FarmResponse {
  id: number;
  farmerId: number;
  farmerName: string;
  farmName: string;
  location: FarmLocationSummary | null;
  area: number;
  areaUnit: FarmAreaUnit;
  farmType: FarmType;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  updatedAt: string;
}

// Mirrors Java record: com.krishiai.farm.dto.CreateFarmRequest
export interface CreateFarmRequest {
  farmName: string;
  locationId?: number | null;
  area?: number | null;
  areaUnit?: FarmAreaUnit;
  farmType?: FarmType;
  description?: string;
  latitude?: number | null;
  longitude?: number | null;
}

// Mirrors Java record: com.krishiai.farm.dto.UpdateFarmRequest
export interface UpdateFarmRequest {
  farmName?: string;
  locationId?: number | null;
  area?: number | null;
  areaUnit?: FarmAreaUnit;
  farmType?: FarmType;
  description?: string;
  latitude?: number | null;
  longitude?: number | null;
}

// Mirrors Java record: com.krishiai.farm.dto.FarmerDashboardResponse
export interface DashboardActivityDto {
  title: string;
  description: string;
  timeAgo: string;
  type: string;
}

export interface DashboardNotificationDto {
  id: string;
  message: string;
  type: string;
  read: boolean;
}

export interface FarmerDashboardResponse {
  farmer: UserResponse;
  primaryFarm: FarmResponse | null;
  totalFarms: number;
  cropCount: number;
  activeConsultations: number;
  recentActivity: DashboardActivityDto[];
  notifications: DashboardNotificationDto[];
}

// Legacy interface retained for backward compatibility
export interface Farm {
  id: string | number;
  farmerId: string | number;
  name: string;
  location: string;
  coordinates: { lat: number; lng: number };
  totalArea: number;
  cropsCount: number;
}
