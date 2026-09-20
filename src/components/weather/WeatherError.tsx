import React from "react";
import { AlertCircle, Compass, Lock, RefreshCw, WifiOff } from "lucide-react";
import type { WeatherErrorDetails } from "./types";

interface WeatherErrorProps {
  error: WeatherErrorDetails;
  onRetry: () => void;
  isRetrying?: boolean;
}

export function WeatherError({ error, onRetry, isRetrying = false }: WeatherErrorProps) {
  const isPermissionDenied = error.type === "denied";
  const isNetwork = error.type === "network";

  return (
    <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 space-y-4 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#FEE2E2] flex items-center justify-center text-[#DC2626]">
            {isPermissionDenied ? (
              <Lock className="w-4 h-4" />
            ) : isNetwork ? (
              <WifiOff className="w-4 h-4" />
            ) : (
              <Compass className="w-4 h-4" />
            )}
          </div>
          <div>
            <p className="text-xs font-bold text-[#1F2937]">Local Weather</p>
            <p className="text-[10px] text-[#DC2626] font-semibold">Location unavailable</p>
          </div>
        </div>

        {error.allowRetry && (
          <button
            type="button"
            onClick={onRetry}
            disabled={isRetrying}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-[#2E7D32] bg-[#E8F5E9] hover:bg-[#C8E6C9] transition-colors cursor-pointer disabled:opacity-60"
          >
            <RefreshCw className={`w-3 h-3 ${isRetrying ? "animate-spin" : ""}`} />
            <span>{isRetrying ? "Retrying..." : "Retry"}</span>
          </button>
        )}
      </div>

      {/* Message Card */}
      <div className="p-4 rounded-2xl bg-[#FFF5F5] border border-[#FEE2E2] space-y-2.5">
        <div className="flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs font-bold text-[#991B1B]">{error.title}</p>
            <p className="text-[11px] leading-relaxed text-[#7F1D1D]">{error.message}</p>
          </div>
        </div>

        {isPermissionDenied && (
          <div className="pt-2 border-t border-[#FEE2E2] text-[10px] text-[#7F1D1D] space-y-1">
            <p className="font-semibold text-[#991B1B]">To enable weather access:</p>
            <ol className="list-decimal list-inside space-y-0.5 opacity-90 pl-1">
              <li>Click the lock or site settings icon beside the browser address bar.</li>
              <li>Toggle <strong className="font-bold">Location</strong> to &quot;Allow&quot;.</li>
              <li>Click <strong className="font-bold">&quot;Retry Location&quot;</strong> below.</li>
            </ol>
          </div>
        )}
      </div>

      {/* Action footer */}
      {error.allowRetry && (
        <div className="pt-1">
          <button
            type="button"
            onClick={onRetry}
            disabled={isRetrying}
            className="w-full py-2.5 px-4 rounded-xl bg-[#2E7D32] hover:bg-[#256B2A] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? "animate-spin" : ""}`} />
            <span>{isRetrying ? "Checking Permission..." : "Retry Location"}</span>
          </button>
        </div>
      )}
    </div>
  );
}
