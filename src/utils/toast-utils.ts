import { ApiError } from "@/lib/api";

/**
 * Extracts a safe, user-friendly error message from any caught error.
 * Handles ApiError with HTTP status-specific fallbacks, standard Error,
 * arrays of backend validation error strings, or fallback strings.
 */
export function getApiErrorMessage(error: unknown, fallbackMessage = "Something went wrong. Please try again."): string {
  if (error instanceof ApiError) {
    if (error.status === 401) {
      return "Your session has expired. Please log in again.";
    }
    if (error.status === 0) {
      return "Unable to connect to the server. Check your connection and try again.";
    }
    if (error.status === 403) {
      return "You don't have permission to access this area.";
    }
    if (error.status === 404) {
      return "The requested resource was not found.";
    }
    if (error.status === 409) {
      return "This action conflicts with the current resource state.";
    }
    if (error.status === 422) {
      return error.errors?.join(". ") || "Please check the submitted information.";
    }
    if (error.status >= 500) {
      return "Something went wrong on the server. Please try again.";
    }
    if (error.errors && error.errors.length > 0) {
      return error.errors.join(". ");
    }
    if (error.message && error.message.trim().length > 0) {
      return error.message;
    }
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
