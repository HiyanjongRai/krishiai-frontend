import { api } from "@/lib/api";
import type {
  CreateFarmCropRequest,
  CreateCropTaskRequest,
  CreateCropJournalRequest,
  CropCareRecommendationResponse,
  CropJournalResponse,
  CropTaskResponse,
  FarmCropResponse,
  TaskStatus,
  UpdateCropTaskRequest,
  UpdateFarmCropRequest,
} from "@/types/farmCrop";

// ── Farm Crop CRUD ─────────────────────────────────────────────────────────────

export const farmCropService = {
  /** Add a crop to one of the farmer's farms */
  addCropToFarm: (data: CreateFarmCropRequest): Promise<FarmCropResponse> =>
    api.post<FarmCropResponse>("/v1/farmer/farm-crops", data),

  /** Get all planted crops across all farms */
  getAllMyFarmCrops: (): Promise<FarmCropResponse[]> =>
    api.get<FarmCropResponse[]>("/v1/farmer/farm-crops"),

  /** Get all planted crops for a specific farm */
  getCropsForFarm: (farmId: number): Promise<FarmCropResponse[]> =>
    api.get<FarmCropResponse[]>(`/v1/farmer/farm-crops/farm/${farmId}`),

  /** Get a specific farm crop by ID */
  getFarmCropById: (id: number): Promise<FarmCropResponse> =>
    api.get<FarmCropResponse>(`/v1/farmer/farm-crops/${id}`),

  /** Update planting details, growth stage, or notes */
  updateFarmCrop: (id: number, data: UpdateFarmCropRequest): Promise<FarmCropResponse> =>
    api.put<FarmCropResponse>(`/v1/farmer/farm-crops/${id}`, data),

  /** Remove a crop from a farm (soft delete) */
  removeCropFromFarm: (id: number): Promise<void> =>
    api.delete<void>(`/v1/farmer/farm-crops/${id}`),
};

// ── Crop Tasks ─────────────────────────────────────────────────────────────────

export const cropTaskService = {
  /** Create a task for a specific farm crop */
  createTask: (farmCropId: number, data: CreateCropTaskRequest): Promise<CropTaskResponse> =>
    api.post<CropTaskResponse>(`/v1/farmer/crop-tasks/farm-crop/${farmCropId}`, data),

  /** Get all tasks for a specific farm crop */
  getTasksForFarmCrop: (farmCropId: number): Promise<CropTaskResponse[]> =>
    api.get<CropTaskResponse[]>(`/v1/farmer/crop-tasks/farm-crop/${farmCropId}`),

  /** Get all pending tasks across all farms */
  getAllPendingTasks: (): Promise<CropTaskResponse[]> =>
    api.get<CropTaskResponse[]>("/v1/farmer/crop-tasks/pending"),

  /** Get all tasks across all farms */
  getAllTasks: (): Promise<CropTaskResponse[]> =>
    api.get<CropTaskResponse[]>("/v1/farmer/crop-tasks"),

  /** Update a task */
  updateTask: (id: number, data: UpdateCropTaskRequest): Promise<CropTaskResponse> =>
    api.put<CropTaskResponse>(`/v1/farmer/crop-tasks/${id}`, data),

  /** Mark a task status */
  markTaskStatus: (id: number, status: TaskStatus): Promise<CropTaskResponse> =>
    api.patch<CropTaskResponse>(`/v1/farmer/crop-tasks/${id}/status?status=${status}`, {}),

  /** Delete a task */
  deleteTask: (id: number): Promise<void> =>
    api.delete<void>(`/v1/farmer/crop-tasks/${id}`),
};

// ── Crop Journal ───────────────────────────────────────────────────────────────

export const cropJournalService = {
  /** Add a journal entry for a farm crop */
  addJournalEntry: (farmCropId: number, data: CreateCropJournalRequest): Promise<CropJournalResponse> =>
    api.post<CropJournalResponse>(`/v1/farmer/crop-journals/farm-crop/${farmCropId}`, data),

  /** Get all journal entries for a farm crop */
  getJournal: (farmCropId: number): Promise<CropJournalResponse[]> =>
    api.get<CropJournalResponse[]>(`/v1/farmer/crop-journals/farm-crop/${farmCropId}`),

  /** Delete a journal entry */
  deleteJournalEntry: (id: number): Promise<void> =>
    api.delete<void>(`/v1/farmer/crop-journals/${id}`),
};

// ── AI Recommendations ─────────────────────────────────────────────────────────

export const cropRecommendationService = {
  /** Get AI-powered crop care recommendation for a farm crop */
  getRecommendation: (farmCropId: number): Promise<CropCareRecommendationResponse> =>
    api.get<CropCareRecommendationResponse>(`/v1/farmer/recommendations/farm-crop/${farmCropId}`),
};
