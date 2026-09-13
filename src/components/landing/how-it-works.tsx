import React from "react";
import { Sprout, Scan, BarChart3, Users } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      step: "Step 01",
      title: "Add Your Farm",
      description: "Create your farm profile and add your crops.",
      icon: Sprout,
    },
    {
      step: "Step 02",
      title: "Analyze Your Crop",
      description: "Upload a crop image and let KrishiAI analyse it.",
      icon: Scan,
    },
    {
      step: "Step 03",
      title: "Understand the Situation",
      description:
        "Receive AI prediction, confidence level, weather context, and practical recommendations.",
      icon: BarChart3,
    },
    {
      step: "Step 04",
      title: "Get Expert Help",
      description:
        "If you need additional support, connect with a verified agricultural expert.",
      icon: Users,
    },
  ];

  return (
    <section id="how-it-works" className="py-14 sm:py-20 bg-white border-y border-[rgba(234,234,236,0.85)]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#0F9F68] mb-2.5">
            Simple Process
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#171717] tracking-tight">
            From Crop to Clearer Decisions.
          </h2>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-9 left-20 right-20 h-0.5 border-t-2 border-dashed border-[rgba(234,234,236,0.85)] -z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 lg:gap-6 relative z-10">
            {steps.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="flex flex-col items-center text-center p-5 sm:p-4 rounded-2xl bg-slate-50/50 sm:bg-transparent border border-slate-100 sm:border-transparent group transition-all"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[18px] sm:rounded-[20px] border border-[rgba(234,234,236,0.85)] bg-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)] flex items-center justify-center text-[#0F9F68] mb-4 sm:mb-5 group-hover:bg-[#DDF4EA] group-hover:shadow-[0_8px_30px_-4px_rgba(15,159,104,0.15)] transition-all">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <span className="text-[10px] font-black text-[#0F9F68] tracking-[0.16em] uppercase mb-1.5">
                    {item.step}
                  </span>
                  <h3 className="text-sm font-bold text-[#171717] mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed max-w-xs">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
