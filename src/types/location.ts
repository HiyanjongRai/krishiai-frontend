export type LocationType =
  | "COUNTRY"
  | "PROVINCE"
  | "DISTRICT"
  | "MUNICIPALITY"
  | "RURAL_MUNICIPALITY"
  | "WARD";

// Mirrors Java record: com.krishiai.location.dto.LocationResponse
export interface LocationResponse {
  id: number;
  name: string;
  nepaliName?: string | null;
  code?: string | null;
  type: LocationType | string;
  parentId?: number | null;
  active?: boolean;
}
