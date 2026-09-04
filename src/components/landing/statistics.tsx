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
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 bg-[#0b281b] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-emerald-900/50 space-y-6">
            <div className="space-y-2.5">
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                AI That Supports Decisions — <br className="hidden sm:inline" />
                Not Replaces Expertise.
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/75 leading-relaxed">
                KrishiAI provides AI-assisted insights to help farmers make more
                informed decisions. All predictions include confidence information
                and should not be treated as guaranteed diagnoses.
              </p>
            </div>

            <div className="pt-2">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 items-center">
                {flow.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="bg-white rounded-xl p-2.5 flex flex-col items-center justify-center text-center shadow-sm relative text-slate-800"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-1">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-800 leading-tight">
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-4 text-center">
              {metrics.map((m, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs flex flex-col items-center justify-center space-y-1"
                >
                  <div className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                    {m.value}
                  </div>
                  <div className="text-xs font-medium text-slate-500 leading-snug">
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
