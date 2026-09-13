// Mirrors Java record: com.krishiai.media.dto.MediaResponse
export interface MediaResponse {
  id: number;
  publicId: string;
  secureUrl: string;
  originalFilename: string | null;
  format: string | null;
  resourceType: string; // "image" | "video" | "raw"
  bytes: number | null;
  width: number | null;
  height: number | null;
  folder: string | null;
  createdAt: string;
}
