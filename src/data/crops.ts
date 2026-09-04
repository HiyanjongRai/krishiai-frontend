import { Crop } from "@/types/crop";

export const sampleCrops: Crop[] = [
  {
    id: "crop-1",
    farmId: "farm-1",
    name: "Tomato",
    variety: "Manisha Hybrid",
    plantedDate: "2026-06-15",
    growthStage: "Fruiting Stage (Day 45)",
    healthStatus: "HEALTHY",
    areaHectares: 1.2,
  },
  {
    id: "crop-2",
    farmId: "farm-1",
    name: "Potato",
    variety: "Kufri Jyoti",
    plantedDate: "2026-07-01",
    growthStage: "Tuber Bulking (Day 35)",
    healthStatus: "ATTENTION",
    areaHectares: 2.0,
  },
  {
    id: "crop-3",
    farmId: "farm-1",
    name: "Rice",
    variety: "Khumal-4",
    plantedDate: "2026-05-20",
    growthStage: "Tillering Stage",
    healthStatus: "HEALTHY",
    areaHectares: 3.5,
  },
];
