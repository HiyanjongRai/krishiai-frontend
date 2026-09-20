type BackendEnvelope = {
  message?: unknown;
  error?: unknown;
  errors?: unknown;
  validationErrors?: unknown;
  fieldErrors?: unknown;
  code?: unknown;
  status?: unknown;
  success?: unknown;
};

const TECHNICAL_PATTERNS = [
  /java\./i,
  /org\.springframework/i,
  /hibernate/i,
  /sql/i,
  /nullpointer/i,
  /stack trace/i,
  /jwt exception/i,
  /fetcherror/i,
  /axioserror/i,
];

export interface NormalizedApiError {
  status: number;
  title: string;
  message: string;
  errors: string[];
  fieldErrors: Record<string, string>;
  retryable: boolean;
}

export interface NormalizedApiSuccess {
  message: string;
}

type ApiErrorLike = Error & {
  status: number;
  errors?: string[] | null;
  fieldErrors?: Record<string, string>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isApiErrorLike(value: unknown): value is ApiErrorLike {
  return (
    value instanceof Error &&
    "status" in value &&
    typeof (value as { status?: unknown }).status === "number"
  );
}

function safeText(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (TECHNICAL_PATTERNS.some((pattern) => pattern.test(trimmed))) return null;
  return trimmed;
}

function flattenMessages(value: unknown): string[] {
  if (!value) return [];
  if (typeof value === "string") {
    const text = safeText(value);
    return text ? [text] : [];
  }
  if (Array.isArray(value)) {
    return value.flatMap(flattenMessages);
  }
  if (isRecord(value)) {
    return Object.values(value).flatMap(flattenMessages);
  }
  return [];
}

export function extractFieldErrors(value: unknown): Record<string, string> {
  const result: Record<string, string> = {};
  if (!isRecord(value)) return result;

  for (const [key, raw] of Object.entries(value)) {
    const messages = flattenMessages(raw);
    if (messages.length > 0) {
      result[key] = messages.join(" ");
    }
  }

  return result;
}

function statusFallback(status: number): Pick<NormalizedApiError, "title" | "message" | "retryable"> {
  switch (status) {
    case 0:
      return {
        title: "Connection problem",
        message: "Unable to connect to the server. Check your connection and try again.",
        retryable: true,
      };
    case 400:
      return {
        title: "Please check the information",
        message: "Some information is missing or invalid. Please review the form and try again.",
        retryable: false,
      };
    case 401:
      return {
        title: "Session expired",
        message: "Your session has expired. Please log in again.",
        retryable: false,
      };
    case 403:
      return {
        title: "Access restricted",
        message: "You don't have permission to perform this action.",
        retryable: false,
      };
    case 404:
      return {
        title: "Not found",
        message: "The requested resource could not be found.",
        retryable: true,
      };
    case 409:
      return {
        title: "Action conflict",
        message: "This action conflicts with the current resource state.",
        retryable: false,
      };
    case 422:
      return {
        title: "Validation failed",
        message: "Please check the submitted information and try again.",
        retryable: false,
      };
    case 429:
      return {
        title: "Too many requests",
        message: "Too many requests. Please wait a moment and try again.",
        retryable: true,
      };
    default:
      if (status >= 500) {
        return {
          title: "Server problem",
          message: "Something went wrong on our server. Please try again.",
          retryable: true,
        };
      }
      return {
        title: "Request failed",
        message: "Something went wrong. Please try again.",
        retryable: true,
      };
  }
}

export function normalizeApiError(error: unknown, fallbackMessage?: string): NormalizedApiError {
  if (isApiErrorLike(error)) {
    const fallback = statusFallback(error.status);
    const backendMessage = safeText(error.message);
    const errors = error.errors?.flatMap(flattenMessages) ?? [];
    return {
      status: error.status,
      title: fallback.title,
      message: backendMessage ?? errors[0] ?? fallbackMessage ?? fallback.message,
      errors,
      fieldErrors: error.fieldErrors ?? {},
      retryable: fallback.retryable,
    };
  }

  if (error instanceof TypeError && /fetch|network|failed/i.test(error.message)) {
    const fallback = statusFallback(0);
    return { status: 0, title: fallback.title, message: fallback.message, errors: [], fieldErrors: {}, retryable: true };
  }

  if (error instanceof Error) {
    const text = safeText(error.message);
    return {
      status: -1,
      title: "Request failed",
      message: text ?? fallbackMessage ?? "Something went wrong. Please try again.",
      errors: [],
      fieldErrors: {},
      retryable: true,
    };
  }

  const text = safeText(error);
  return {
    status: -1,
    title: "Request failed",
    message: text ?? fallbackMessage ?? "Something went wrong. Please try again.",
    errors: [],
    fieldErrors: {},
    retryable: true,
  };
}

export function normalizeApiSuccess(body: unknown, fallback = "Operation completed successfully."): NormalizedApiSuccess {
  if (isRecord(body)) {
    const envelope = body as BackendEnvelope;
    const message = safeText(envelope.message) ?? safeText(envelope.error);
    return { message: message ?? fallback };
  }
  return { message: fallback };
}

export function extractBackendMessage(body: unknown): string | null {
  if (!isRecord(body)) return null;
  return safeText((body as BackendEnvelope).message) ?? safeText((body as BackendEnvelope).error);
}

export function extractBackendErrors(body: unknown): string[] {
  if (!isRecord(body)) return [];
  const envelope = body as BackendEnvelope;
  return [
    ...flattenMessages(envelope.errors),
    ...flattenMessages(envelope.validationErrors),
    ...flattenMessages(envelope.fieldErrors),
  ];
}

export function extractBackendFieldErrors(body: unknown): Record<string, string> {
  if (!isRecord(body)) return {};
  const envelope = body as BackendEnvelope;
  return {
    ...extractFieldErrors(envelope.fieldErrors),
    ...extractFieldErrors(envelope.validationErrors),
  };
}
