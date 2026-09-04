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
    <section id="how-it-works" className="py-20 bg-[#fafcf9] border-y border-slate-100">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            From Crop to Clearer Decisions.
          </h2>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-7 left-12 right-12 h-0.5 border-t-2 border-dashed border-slate-300 -z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 relative z-10">
            {steps.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex flex-col items-center text-center group">
                  <div className="w-14 h-14 rounded-full bg-white border-2 border-emerald-500/80 shadow-md flex items-center justify-center text-emerald-700 mb-5 group-hover:scale-110 group-hover:bg-emerald-50 transition-all">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 tracking-wider uppercase mb-1.5">
                    {item.step}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed max-w-xs">
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
