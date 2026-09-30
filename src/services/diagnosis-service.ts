import { api } from "@/lib/api";

export interface DiagnosisRecord {
  id: number | null;
  crop: string | null;
  predictedDisease: string | null;
  confidence: number;
  formattedConfidence: string;
  imageUrl?: string | null;
  severity: "Low" | "Moderate" | "High" | "Uncertain" | "N/A";
  recommendation?: string;
  isLowConfidence: boolean;
  adviceHint?: string;
  modelVersion?: string;
  modelArchitecture?: string;
  requestId?: string;
  /** Pipeline status: DIAGNOSIS | UNCERTAIN | NOT_A_PLANT */
  status?: "DIAGNOSIS" | "UNCERTAIN" | "NOT_A_PLANT" | "ERROR";
  predictedClass?: string | null;
  confidencePercent?: number;
  isReliable?: boolean;
  topPredictions?: Array<{
    className?: string;
    crop: string | null;
    disease: string | null;
    confidence: number;
    confidencePercent: number;
  }>;
  detector?: {
    isPlant: boolean;
    plantConfidence: number | null;
    nonPlantConfidence: number | null;
  };
  modelInfo?: { model: string; numClasses: number; crops: string[]; classNames: string[]; device: string; plantDetectorEnabled?: boolean } | null;
  advice?: AgriculturalAdvice | null;
  createdAt: string;
}

export interface AgriculturalAdvice {
  summary: string;
  symptoms?: string[];
  causes?: string[];
  prevention?: string[];
  management?: string[];
  whenToSeekExpertHelp?: string;
}

export interface PaginatedDiagnosisResponse {
  content: DiagnosisRecord[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export async function predictCropDisease(
  file: File,
  crop?: string
): Promise<DiagnosisRecord> {
  const formData = new FormData();
  formData.append("file", file);
  if (crop && crop !== "auto" && crop.trim()) {
    formData.append("crop", crop.trim());
  }

  return await api.upload<DiagnosisRecord>("/v1/diagnoses/predict", formData);
}

export async function getDiagnosisHistory(
  page = 0,
  size = 12
): Promise<PaginatedDiagnosisResponse> {
  return await api.get<PaginatedDiagnosisResponse>(
    `/v1/diagnoses?page=${page}&size=${size}`
  );
}

export async function getDiagnosisById(
  id: number
): Promise<DiagnosisRecord> {
  return await api.get<DiagnosisRecord>(`/v1/diagnoses/${id}`);
}

export async function deleteDiagnosis(id: number): Promise<void> {
  return await api.delete<void>(`/v1/diagnoses/${id}`);
}

export interface SendDiagnosisToExpertPayload {
  diagnosisId?: number | null;
  expertUserId: number;
  crop?: string | null;
  disease?: string | null;
  confidence?: number | null;
  imageUrl?: string | null;
  recommendation?: string | null;
  farmerNote?: string;
}

export async function sendDiagnosisToExpert(
  payload: SendDiagnosisToExpertPayload
): Promise<any> {
  return await api.post<any>("/v1/diagnoses/send-to-expert", payload);
}

