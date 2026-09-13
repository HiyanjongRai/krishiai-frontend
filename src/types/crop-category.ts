// Mirrors Java record: com.krishiai.crop.dto.CropCategoryResponse
export interface CropCategoryResponse {
  id: number;
  name: string;
  code: string;
  description: string | null;
  icon: string | null;
  active: boolean;
}

// Mirrors Java record: com.krishiai.crop.dto.CreateCropCategoryRequest
export interface CreateCropCategoryRequest {
  name: string;
  code: string;
  description?: string;
  icon?: string;
}

// Mirrors Java record: com.krishiai.crop.dto.UpdateCropCategoryRequest
export interface UpdateCropCategoryRequest {
  name?: string;
  code?: string;
  description?: string;
  icon?: string;
  active?: boolean;
}
