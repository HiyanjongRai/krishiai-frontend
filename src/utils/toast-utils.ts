import { ApiError } from "@/lib/api";
import { normalizeApiError } from "@/utils/api-response";

/**
 * Extracts a safe, user-friendly error message from any caught error.
 * Handles ApiError with HTTP status-specific fallbacks, standard Error,
 * arrays of backend validation error strings, or fallback strings.
 */
export function getApiErrorMessage(error: unknown, fallbackMessage = "Something went wrong. Please try again."): string {
  if (error instanceof ApiError) {
    return normalizeApiError(error, fallbackMessage).message;
  }

  if (error instanceof TypeError && /fetch|network|failed/i.test(error.message)) {
    return "Unable to connect to the server. Check your connection and try again.";
  }

  if (error instanceof Error) {
    if (error.message && error.message.trim().length > 0) {
      return error.message;
    }
  }

  if (typeof error === "string" && error.trim().length > 0) {
    return error;
  }

  return fallbackMessage;
}
