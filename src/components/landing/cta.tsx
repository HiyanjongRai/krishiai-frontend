"use client";

import React from "react";
import { ArrowRight, Sprout } from "lucide-react";
import { useAuthModal } from "@/providers/auth-modal-provider";

export function CTA() {
  const { openRegister } = useAuthModal();

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-br from-[#0F9F68] via-[#0D8A5A] to-[#0A6B45] text-white text-center relative overflow-hidden">
      <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 h-60 w-60 rounded-full bg-black/10 blur-2xl pointer-events-none" />
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-5 sm:space-y-6 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-white text-xs font-bold tracking-wide">
          <Sprout className="w-3.5 h-3.5" />
          <span>Start Today</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
          Ready to Make Smarter Farming Decisions?
        </h2>
        <p className="text-xs sm:text-sm text-white/80 max-w-xl mx-auto leading-relaxed">
          Join KrishiAI to monitor your crops, anticipate changing weather, and get verified agronomist guidance.
        </p>
        <div className="pt-2 flex justify-center">
          <button
            type="button"
            onClick={openRegister}
            className="w-full sm:w-auto px-6 py-3.5 text-sm font-bold text-[#0F9F68] bg-white hover:bg-[#F4F4F6] rounded-full transition-all shadow-[0_4px_20px_rgba(0,0,0,0.15)] flex items-center justify-center gap-2 cursor-pointer min-h-[48px] active:scale-98"
          >
            <span>Create Free Farm Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
