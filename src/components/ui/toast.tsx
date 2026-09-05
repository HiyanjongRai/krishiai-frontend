"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  X,
  Loader2,
  Sprout,
} from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info" | "loading";

export interface ToastAction {
  label: string;
  onClick: () => void;
  primary?: boolean;
}

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
  action?: ToastAction;
  createdAt: number;
  isDismissing?: boolean;
}

interface ToastCardProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

const TYPE_CONFIG = {
  success: {
    icon: Sprout,
    containerClass:
      "border-emerald-200 bg-white shadow-emerald-950/10 text-slate-800",
    iconBg: "bg-emerald-50 text-emerald-600 border border-emerald-200/60",
    barColor: "bg-emerald-500",
    badge: "Success",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    role: "status" as const,
  },
  error: {
    icon: XCircle,
    containerClass:
      "border-rose-200 bg-white shadow-rose-950/10 text-slate-800",
    iconBg: "bg-rose-50 text-rose-600 border border-rose-200/60",
    barColor: "bg-rose-500",
    badge: "Attention",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
    role: "alert" as const,
  },
  warning: {
    icon: AlertTriangle,
    containerClass:
      "border-amber-200 bg-white shadow-amber-950/10 text-slate-800",
    iconBg: "bg-amber-50 text-amber-600 border border-amber-200/60",
    barColor: "bg-amber-500",
    badge: "Note",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
    role: "alert" as const,
  },
  info: {
    icon: Info,
    containerClass:
      "border-sky-200 bg-white shadow-sky-950/10 text-slate-800",
    iconBg: "bg-sky-50 text-sky-600 border border-sky-200/60",
    barColor: "bg-sky-500",
    badge: "Info",
    badgeClass: "bg-sky-50 text-sky-700 border-sky-200",
    role: "status" as const,
  },
  loading: {
    icon: Loader2,
    containerClass:
      "border-emerald-200 bg-white shadow-emerald-950/10 text-slate-800",
    iconBg: "bg-emerald-50 text-emerald-600 border border-emerald-200/60",
    barColor: "bg-emerald-500",
    badge: "Processing",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    role: "status" as const,
  },
};

export function ToastCard({ toast, onDismiss }: ToastCardProps) {
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [swipeOffset, setSwipeOffset] = useState(0);

  const duration = toast.duration ?? (toast.type === "loading" ? Infinity : 4000);
  const isInfinite = duration === Infinity || duration <= 0;
  const config = TYPE_CONFIG[toast.type] || TYPE_CONFIG.info;
  const IconComponent = config.icon;

  const remainingTimeRef = useRef(duration);
  const lastTickRef = useRef<number | null>(null);

  // Auto-dismiss countdown with pause support
  useEffect(() => {
    if (isInfinite || toast.isDismissing) return;

    lastTickRef.current = Date.now();

    const interval = setInterval(() => {
      if (isPaused) {
        lastTickRef.current = Date.now();
        return;
      }

      const now = Date.now();
      const delta = now - (lastTickRef.current ?? now);
      lastTickRef.current = now;

      remainingTimeRef.current = Math.max(0, remainingTimeRef.current - delta);
      const pct = (remainingTimeRef.current / duration) * 100;
      setProgress(pct);

      if (remainingTimeRef.current <= 0) {
        clearInterval(interval);
        onDismiss(toast.id);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isInfinite, isPaused, duration, toast.id, toast.isDismissing, onDismiss]);

  // Touch swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - touchStartX;
    if (diff > 0) {
      // Only permit swiping right to dismiss
      setSwipeOffset(diff);
    }
  };

  const handleTouchEnd = () => {
    if (swipeOffset > 90) {
      onDismiss(toast.id);
    } else {
      setSwipeOffset(0);
    }
    setTouchStartX(null);
    setIsPaused(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onDismiss(toast.id);
    }
  };

  return (
    <div
      role={config.role}
      aria-live={config.role === "alert" ? "assertive" : "polite"}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: swipeOffset > 0 ? `translateX(${swipeOffset}px)` : undefined,
        opacity: swipeOffset > 0 ? Math.max(0, 1 - swipeOffset / 200) : undefined,
        transition: swipeOffset > 0 ? "none" : "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      className={`
        relative overflow-hidden rounded-2xl border shadow-lg ring-1 ring-black/5
        p-4 w-full sm:max-w-md pointer-events-auto select-none
        transition-all duration-200 ease-out
        ${config.containerClass}
        ${toast.isDismissing ? "opacity-0 translate-x-4 scale-95" : "opacity-100 translate-x-0 scale-100"}
      `}
    >
      <div className="flex items-start gap-3">
        {/* Left Status Icon */}
        <div
          className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${config.iconBg}`}
        >
          <IconComponent
            className={`w-5 h-5 ${toast.type === "loading" ? "animate-spin" : ""}`}
          />
        </div>

        {/* Content Body */}
        <div className="flex-1 min-w-0 pt-0.5">
          <div className="flex items-center gap-2 mb-0.5">
            <h4 className="text-sm font-semibold text-slate-900 leading-snug">
              {toast.title}
            </h4>
            <span
              className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full border ${config.badgeClass}`}
            >
              {config.badge}
            </span>
          </div>

          {toast.description && (
            <p className="text-xs text-slate-600 leading-relaxed break-words mt-1">
              {toast.description}
            </p>
          )}

          {/* Optional Action Button */}
          {toast.action && (
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toast.action?.onClick();
                  onDismiss(toast.id);
                }}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                  toast.action.primary
                    ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                }`}
              >
                {toast.action.label}
              </button>
            </div>
          )}
        </div>

        {/* Dismiss Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDismiss(toast.id);
          }}
          aria-label="Dismiss notification"
          className="shrink-0 p-1.5 -mr-1 -mt-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress countdown bar */}
      {!isInfinite && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100 overflow-hidden">
          <div
            className={`h-full transition-all ease-linear ${config.barColor}`}
            style={{
              width: `${progress}%`,
              transitionDuration: isPaused ? "0ms" : "50ms",
            }}
          />
        </div>
      )}
    </div>
  );
}

interface ToastViewportProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export function ToastViewport({ toasts, onDismiss }: ToastViewportProps) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      aria-label="Notifications"
      className="fixed z-[9999] bottom-4 inset-x-4 sm:inset-x-auto sm:right-6 sm:bottom-6 flex flex-col gap-2.5 pointer-events-none items-center sm:items-end"
    >
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
