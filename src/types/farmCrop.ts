export type GrowthStage =
  | "SEED"
  | "GERMINATION"
  | "SEEDLING"
  | "VEGETATIVE"
  | "FLOWERING"
  | "FRUITING"
  | "RIPENING"
  | "HARVESTED";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type TaskStatus = "PENDING" | "IN_PROGRESS" | "DONE" | "SKIPPED";

// ── FarmCrop ──────────────────────────────────────────────────────────────────

export interface FarmCropCropSummary {
  id: number;
  name: string;
  nepaliName: string | null;
  emoji: string | null;
  categoryName: string | null;
}

export interface FarmCropResponse {
  id: number;
  farmId: number;
  farmName: string;
  farmerId: number;
  crop: FarmCropCropSummary;
  label: string | null;
  plantingDate: string | null;   // ISO date "YYYY-MM-DD"
  expectedHarvestDate: string | null;
  growthStage: GrowthStage;
  areaPlanted: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFarmCropRequest {
  farmId: number;
  cropId: number;
  label?: string;
  plantingDate?: string;
  expectedHarvestDate?: string;
  growthStage?: GrowthStage;
  areaPlanted?: number;
  notes?: string;
}

export interface UpdateFarmCropRequest {
  label?: string;
  plantingDate?: string;
  expectedHarvestDate?: string;
  growthStage?: GrowthStage;
  areaPlanted?: number;
  notes?: string;
}

// ── CropTask ─────────────────────────────────────────────────────────────────

export interface CropTaskResponse {
  id: number;
  farmCropId: number;
  farmCropLabel: string | null;
  cropName: string | null;
  cropEmoji: string | null;
  farmId: number;
  farmName: string | null;
  title: string;
  description: string | null;
  dueDate: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  systemGenerated: boolean;
  category: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCropTaskRequest {
  title: string;
  description?: string;
  dueDate?: string;
  priority?: TaskPriority;
  category?: string;
}

export interface UpdateCropTaskRequest {
  title?: string;
  description?: string;
  dueDate?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  category?: string;
}

// ── CropJournal ───────────────────────────────────────────────────────────────

export interface CropJournalResponse {
  id: number;
  farmCropId: number;
  cropName: string | null;
  cropEmoji: string | null;
  farmId: number;
  farmName: string | null;
  entryDate: string;
  content: string;
  weatherNote: string | null;
  growthStageAtEntry: GrowthStage | null;
  createdAt: string;
}

export interface CreateCropJournalRequest {
  entryDate: string;
  content: string;
  weatherNote?: string;
  growthStageAtEntry?: GrowthStage;
}

// ── Crop Care Recommendation ─────────────────────────────────────────────────

export interface RecommendationSection {
  category: string;
  icon: string;
  urgency: "NOW" | "THIS_WEEK" | "MONITOR" | "INFO";
  title: string;
  detail: string;
}

export interface CropCareRecommendationResponse {
  farmCropId: number;
  cropName: string;
  cropEmoji: string;
  farmName: string;
  growthStage: string;
  plantingDateInfo: string | null;
  sections: RecommendationSection[];
  aiNarrative: string;
  aiAvailable: boolean;
  generatedAt: string;
}
