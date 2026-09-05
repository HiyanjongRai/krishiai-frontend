import React from "react";
import { Sprout } from "lucide-react";

export default function RootLoading() {
  return (
    <div
      className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center"
      role="status"
      aria-label="Loading KrishiAI page content"
    >
      <div className="relative flex flex-col items-center gap-4">
        {/* Subtle branded glowing circle */}
        <div className="relative w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-[#166534] shadow-xs">
          <Sprout className="w-7 h-7 animate-pulse text-[#166534] motion-reduce:animate-none" />
          <div
            className="absolute -inset-1 rounded-2xl border-2 border-transparent border-t-[#166534] animate-spin motion-reduce:animate-none"
            style={{ animationDuration: "1.2s" }}
            aria-hidden="true"
          />
        </div>

        <div className="space-y-1">
          <p className="text-xs font-bold text-slate-800 tracking-wide uppercase">
            KrishiAI
          </p>
          <p className="text-xs text-slate-500 font-medium">
            Cultivating page insights...
          </p>
        </div>
      </div>
    </div>
  );
}
