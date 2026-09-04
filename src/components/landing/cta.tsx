"use client";

import React from "react";
import { ArrowRight, Sprout } from "lucide-react";
import { useAuthModal } from "@/providers/auth-modal-provider";

export function CTA() {
  const { openRegister } = useAuthModal();

  return (
    <section className="py-16 bg-[#0f3d26] text-white text-center relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-emerald-300 text-xs font-semibold">
          <Sprout className="w-3.5 h-3.5" />
          <span>Start Today</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
          Ready to Make Smarter Farming Decisions?
        </h2>
        <p className="text-base text-emerald-100/80 max-w-xl mx-auto">
          Join KrishiAI to monitor your crops, anticipate changing weather, and get verified agronomist guidance.
        </p>
        <div className="pt-2 flex justify-center gap-4">
          <button
            type="button"
            onClick={openRegister}
            className="px-6 py-3.5 text-sm font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer"
          >
            <span>Create Free Farm Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
