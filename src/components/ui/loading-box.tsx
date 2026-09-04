"use client";

import React from "react";
import { Leaf, Sprout, Wheat, CloudSun } from "lucide-react";

interface LoadingBoxProps {
  title?: string;
  subtitle?: string;
  fullScreen?: boolean;
}

export default function AgricultureLoader({
  title = "Cultivating Your Data",
  subtitle = "Please wait while we prepare the fields",
  fullScreen = true,
}: LoadingBoxProps) {
  return (
    <div
      className={`flex items-center justify-center ${
        fullScreen
          ? "fixed inset-0 z-[9999] min-h-screen w-full"
          : "absolute inset-0 rounded-3xl overflow-hidden"
      }`}
    >
      {/* Blurred backdrop — blurs the actual page content visible behind it */}
      <div className="absolute inset-0 backdrop-blur-xl bg-white/30" />

      {/* Glass card sits above the blurred backdrop */}
      <div className="relative z-10 flex flex-col items-center gap-8 bg-white/60 backdrop-blur-2xl border border-white/50 rounded-3xl shadow-2xl shadow-black/10 px-10 sm:px-16 py-12 sm:py-14 max-w-md mx-4">
        {/* Rotating circle loader */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          {/* soft glow behind ring */}
          <div className="absolute inset-0 rounded-full bg-emerald-400/20 blur-xl" />

          {/* outer track */}
          <div className="absolute inset-0 rounded-full border-[6px] border-emerald-100/60" />

          {/* spinning arc */}
          <div
            className="absolute inset-0 rounded-full border-[6px] border-transparent border-t-emerald-500 border-r-lime-400"
            style={{ animation: "spin 1.4s linear infinite" }}
          />

          {/* inner pulsing glow */}
          <div className="absolute inset-3 rounded-full bg-emerald-300/20 animate-ping opacity-50" />

          {/* center icon */}
          <div className="relative z-10 w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/40 ring-4 ring-white/30">
            <Leaf className="w-7 h-7 text-white" strokeWidth={2.2} />
          </div>

          {/* orbiting small icons */}
          <div className="absolute inset-0" style={{ animation: "spin 3s linear infinite" }}>
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-md">
              <Sprout className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <div className="absolute inset-0" style={{ animation: "spin 3s linear infinite reverse" }}>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-md">
              <Wheat className="w-4 h-4 text-lime-600" />
            </div>
          </div>
          <div className="absolute inset-0" style={{ animation: "spin 5s linear infinite" }}>
            <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-md">
              <CloudSun className="w-3.5 h-3.5 text-teal-500" />
            </div>
          </div>
        </div>

        {/* text */}
        <div className="text-center">
          <h2 className="text-[#17201A] font-semibold text-xl tracking-wide">
            {title}
          </h2>
          <p className="text-slate-500 text-sm mt-1.5 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* progress dots */}
        <div className="flex gap-2.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-emerald-500"
              style={{
                animation: "bounce 1.2s ease-in-out infinite",
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes bounce {
          0%,
          80%,
          100% {
            transform: translateY(0);
            opacity: 0.4;
          }
          40% {
            transform: translateY(-6px);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export { AgricultureLoader as LoadingBox };
