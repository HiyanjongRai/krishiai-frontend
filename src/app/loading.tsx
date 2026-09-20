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
        <div className="relative w-14 h-14 rounded-2xl bg-[#E8F5E9] border border-[#A5D6A7]/80 flex items-center justify-center text-[#1B5E20] shadow-xs">
          <Sprout className="w-7 h-7 animate-pulse text-[#1B5E20] motion-reduce:animate-none" />
          <div
            className="absolute -inset-1 rounded-2xl border-2 border-transparent border-t-[#1B5E20] animate-spin motion-reduce:animate-none"
            style={{ animationDuration: "1.2s" }}
            aria-hidden="true"
          />
        </div>

        <div className="space-y-1">
          <p className="text-xs font-bold text-[#1F2937] tracking-wide uppercase">
            KrishiAI
          </p>
          <p className="text-xs text-[#6B7280] font-medium">
            Cultivating page insights...
          </p>
        </div>
      </div>
    </div>
  );
}
