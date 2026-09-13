import React from "react";
import { Brain, ShieldCheck, FileCheck, UserCheck } from "lucide-react";

export function Statistics() {
  const flow = [
    { label: "AI Prediction", icon: Brain },
    { label: "Confidence", icon: ShieldCheck },
    { label: "Recommendation", icon: FileCheck },
    { label: "Optional Expert Review", icon: UserCheck },
  ];

  const metrics = [
    { value: "10+", label: "Crop Categories" },
    { value: "50+", label: "Agricultural Conditions" },
    { value: "24/7", label: "AI Assistance" },
    { value: "1", label: "Platform For Farm Intelligence" },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-[#F4F4F6]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

          <div className="lg:col-span-7 rounded-[24px] sm:rounded-[28px] bg-gradient-to-br from-[#0F9F68] via-[#0D8A5A] to-[#0A6B45] p-5 sm:p-7 lg:p-8 text-white shadow-[0_10px_30px_-8px_rgba(15,159,104,0.35)] border border-[rgba(15,159,104,0.2)] relative overflow-hidden space-y-5 sm:space-y-6">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            <div className="absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-black/10 blur-lg pointer-events-none" />
            <div className="relative z-10 space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/80">
                AI Intelligence
              </p>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white leading-tight">
                AI That Supports Decisions — <br className="hidden sm:inline" />
                Not Replaces Expertise.
              </h3>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-xl">
                KrishiAI provides AI-assisted insights to help farmers make more
                informed decisions. All predictions include confidence information
                and should not be treated as guaranteed diagnoses.
              </p>
            </div>

            <div className="relative z-10 pt-1 sm:pt-2">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 items-center">
                {flow.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="rounded-[18px] sm:rounded-[20px] border border-white/20 bg-white/15 backdrop-blur-sm p-2.5 sm:p-3 flex flex-col items-center justify-center text-center min-h-[72px]"
                    >
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/20 flex items-center justify-center mb-1 text-white">
                        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </div>
                      <span className="text-[10px] font-bold text-white leading-tight">
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {metrics.map((m, i) => (
                <div
                  key={i}
                  className="p-4 sm:p-5 rounded-[22px] sm:rounded-[24px] border border-[rgba(234,234,236,0.85)] bg-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04),0_2px_6px_-1px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center text-center space-y-1 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.07)] transition-shadow"
                >
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#171717]">
                    {m.value}
                  </div>
                  <div className="text-[11px] sm:text-xs font-medium text-gray-500 leading-snug">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
