import { ApiError } from "@/lib/api";

/**
 * Extracts a safe, user-friendly error message from any caught error.
 * Handles ApiError with HTTP status-specific fallbacks, standard Error,
 * arrays of backend validation error strings, or fallback strings.
 */
export function getApiErrorMessage(error: unknown, fallbackMessage = "Something went wrong. Please try again."): string {
  if (error instanceof ApiError) {
    if (error.errors && Array.isArray(error.errors) && error.errors.length > 0) {
      return error.errors.join(". ");
    }
    if (error.message && error.message.trim().length > 0) {
      return error.message;
    }
    if (error.status === 401) {
      return "Your session has expired. Please sign in again.";
    }
    if (error.status === 403) {
      return "You do not have permission to perform this action.";
    }
    if (error.status === 404) {
      return "The requested resource was not found.";
    }
    if (error.status >= 500) {
      return "A server error occurred. Please try again shortly.";
    }
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
