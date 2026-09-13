import { tokenStore, ApiError } from "@/lib/api";
import type { UserResponse } from "@/types/auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";

// Allowed MIME types — must match the backend (CloudinaryServiceImpl.ALLOWED_IMAGE_TYPES)
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

// Max size — 10 MB (matches backend MAX_IMAGE_SIZE)
export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
export const MAX_IMAGE_SIZE_LABEL = "10 MB";

// Friendly type list for display
export const ALLOWED_TYPE_LABELS = "JPG, PNG, WEBP";

/**
 * Validate a file before upload. Returns an error string or null if valid.
 */
export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return `Unsupported file type (${file.type || "unknown"}). Please choose a ${ALLOWED_TYPE_LABELS} image.`;
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return `This image is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Please choose an image smaller than ${MAX_IMAGE_SIZE_LABEL}.`;
  }
  return null;
}

/**
 * Upload a profile image for the currently authenticated user.
 * Calls: POST /api/v1/users/me/profile-image (multipart/form-data, field name "file")
 * Returns the updated UserResponse.
 */
export async function uploadProfileImage(file: File): Promise<UserResponse> {
  const token = tokenStore.get();
  if (!token) {
    throw new ApiError(401, "Your session has expired. Please log in again.");
  }

  const formData = new FormData();
  formData.append("file", file);

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/v1/users/me/profile-image`, {
      method: "POST",
      headers: {
        // Do NOT set Content-Type — browser sets multipart/form-data boundary automatically
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
  } catch {
    throw new ApiError(0, "Unable to connect to the server. Please check your connection and try again.");
  }

  let body: { status: number; message: string; data: UserResponse; errors: string[] | null };
  try {
    body = await res.json();
  } catch {
    throw new ApiError(res.status, "Request failed");
  }

  if (res.status === 401) {
    tokenStore.clear();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("krishiai:auth-expired"));
    }
    throw new ApiError(401, "Your session has expired. Please log in again.");
  }

  if (!res.ok) {
    throw new ApiError(res.status, body.message ?? "Failed to upload profile image.", body.errors);
  }

  return body.data;
}

/**
 * Remove the current user's profile image.
 * Calls: DELETE /api/v1/users/me/profile-image
 * Returns the updated UserResponse (profileImage will be null).
 */
export async function removeProfileImage(): Promise<UserResponse> {
  const token = tokenStore.get();
  if (!token) {
    throw new ApiError(401, "Your session has expired. Please log in again.");
  }

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/v1/users/me/profile-image`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch {
    throw new ApiError(0, "Unable to connect to the server. Please check your connection and try again.");
  }

  let body: { status: number; message: string; data: UserResponse; errors: string[] | null };
  try {
    body = await res.json();
  } catch {
    throw new ApiError(res.status, "Request failed");
  }

  if (res.status === 401) {
    tokenStore.clear();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("krishiai:auth-expired"));
    }
    throw new ApiError(401, "Your session has expired. Please log in again.");
  }

  if (!res.ok) {
    throw new ApiError(res.status, body.message ?? "Failed to remove profile image.", body.errors);
  }

  return body.data;
}

export const mediaService = {
  uploadProfileImage,
  removeProfileImage,
  validateImageFile,
};
