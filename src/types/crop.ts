export interface Crop {
  id: string;
  farmId: string;
  name: string;
  variety: string;
  plantedDate: string;
  growthStage: string;
  healthStatus: "HEALTHY" | "ATTENTION" | "HIGH_RISK";
  areaHectares: number;
}
