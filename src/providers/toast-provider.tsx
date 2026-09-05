"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import {
  ToastItem,
  ToastType,
  ToastAction,
  ToastViewport,
} from "@/components/ui/toast";

export interface ToastInputOptions {
  title: string;
  description?: string;
  duration?: number;
  action?: ToastAction;
}

export type ToastInput = string | ToastInputOptions;

export interface PromiseToastOptions<T> {
  loading: string | { title: string; description?: string };
  success: string | { title: string; description?: string } | ((data: T) => string | { title: string; description?: string });
  error: string | { title: string; description?: string } | ((err: unknown) => string | { title: string; description?: string });
}

export interface ToastContextValue {
  toast: {
    success: (input: ToastInput) => string;
    error: (input: ToastInput) => string;
    warning: (input: ToastInput) => string;
    info: (input: ToastInput) => string;
    loading: (input: ToastInput) => string;
    promise: <T>(promise: Promise<T>, options: PromiseToastOptions<T>) => Promise<T>;
    dismiss: (id: string) => void;
  };
}

const ToastContext = createContext<ToastContextValue | null>(null);

const DEFAULT_DURATIONS: Record<ToastType, number> = {
  success: 3500,
  info: 3800,
  warning: 5000,
  error: 6000,
  loading: Infinity,
};

const MAX_VISIBLE = 4;
const DISMISS_ANIMATION_MS = 200;

export function KrishiToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const countRef = useRef(0);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isDismissing: true } : t))
    );

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, DISMISS_ANIMATION_MS);
  }, []);

  const addToast = useCallback(
    (type: ToastType, input: ToastInput): string => {
      countRef.current += 1;
      const id = `toast-${countRef.current}-${Date.now()}`;

      const options: ToastInputOptions =
        typeof input === "string" ? { title: input } : input;

      const duration = options.duration ?? DEFAULT_DURATIONS[type];

      const newToast: ToastItem = {
        id,
        type,
        title: options.title,
        description: options.description,
        action: options.action,
        duration,
        createdAt: Date.now(),
      };

      setToasts((prev) => {
        // Keep at most MAX_VISIBLE, evicting oldest if necessary
        const updated = [...prev, newToast];
        if (updated.length > MAX_VISIBLE) {
          return updated.slice(updated.length - MAX_VISIBLE);
        }
        return updated;
      });

      return id;
    },
    []
  );

  const updateToast = useCallback(
    (
      id: string,
      updates: {
        type?: ToastType;
        title?: string;
        description?: string;
        duration?: number;
      }
    ) => {
      setToasts((prev) =>
        prev.map((t) => {
          if (t.id !== id) return t;
          const nextType = updates.type ?? t.type;
          return {
            ...t,
            type: nextType,
            title: updates.title ?? t.title,
            description: updates.description ?? t.description,
            duration: updates.duration ?? DEFAULT_DURATIONS[nextType],
            createdAt: Date.now(),
          };
        })
      );
    },
    []
  );

  const promise = useCallback(
    <T,>(
      prom: Promise<T>,
      options: PromiseToastOptions<T>
    ): Promise<T> => {
      const loadingInput =
        typeof options.loading === "string"
          ? { title: options.loading }
          : options.loading;

      const toastId = addToast("loading", loadingInput);

      return prom
        .then((result) => {
          const successInput =
            typeof options.success === "function"
              ? options.success(result)
              : options.success;

          const { title, description } =
            typeof successInput === "string"
              ? { title: successInput, description: undefined }
              : successInput;

          updateToast(toastId, {
            type: "success",
            title,
            description,
          });

          return result;
        })
        .catch((err) => {
          const errorInput =
            typeof options.error === "function"
              ? options.error(err)
              : options.error;

          const { title, description } =
            typeof errorInput === "string"
              ? { title: errorInput, description: undefined }
              : errorInput;

          updateToast(toastId, {
            type: "error",
            title,
            description,
          });

          throw err;
        });
    },
    [addToast, updateToast]
  );

  const toastMethods = {
    success: (input: ToastInput) => addToast("success", input),
    error: (input: ToastInput) => addToast("error", input),
    warning: (input: ToastInput) => addToast("warning", input),
    info: (input: ToastInput) => addToast("info", input),
    loading: (input: ToastInput) => addToast("loading", input),
    promise,
    dismiss,
  };

  return (
    <ToastContext.Provider value={{ toast: toastMethods }}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a KrishiToastProvider");
  }
  return context;
}
