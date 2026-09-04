import React from "react";
import Image from "next/image";
import { Sprout, Sun, UserCheck, BookOpen } from "lucide-react";

export function Features() {
  const problems = [
    {
      title: "Crop Problems",
      description: "Farmers may struggle to identify crop health problems early.",
      icon: Sprout,
      iconBg: "bg-emerald-50 text-emerald-700 border-emerald-100",
    },
    {
      title: "Changing Weather",
      description: "Weather conditions can affect irrigation, crop protection, and planning.",
      icon: Sun,
      iconBg: "bg-amber-50 text-amber-600 border-amber-100",
    },
    {
      title: "Limited Expert Access",
      description: "Professional agricultural guidance may not always be easily accessible.",
      icon: UserCheck,
      iconBg: "bg-orange-50 text-orange-600 border-orange-100",
    },
    {
      title: "Information Overload",
      description: "Finding reliable agricultural information can be difficult.",
      icon: BookOpen,
      iconBg: "bg-indigo-50 text-indigo-600 border-indigo-100",
    },
  ];

  return (
    <section id="features" className="py-16 sm:py-20 bg-white">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          <div className="lg:col-span-6 space-y-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Farming Decisions <br />
                Shouldn’t Have to Be Guesswork.
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {problems.map((prob, idx) => {
                const Icon = prob.icon;
                return (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl border border-slate-100 bg-white shadow-xs hover:border-slate-200 transition-colors space-y-3"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl border flex items-center justify-center ${prob.iconBg}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-slate-900">
                        {prob.title}
                      </h3>
                      <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed">
                        {prob.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 aspect-[4/3] sm:aspect-[16/11]">
              <Image
                src="/images/hero/farmer-tablet.jpg"
                alt="Nepali farmer using KrishiAI tablet in field"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 max-w-xs bg-[#0f3d26]/95 backdrop-blur-md text-white p-4 rounded-2xl border border-emerald-500/20 shadow-xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0 text-emerald-300">
                  <Sprout className="w-5 h-5" />
                </div>
                <p className="text-xs sm:text-[13px] font-medium leading-snug">
                  KrishiAI brings these tools together in{" "}
                  <span className="text-emerald-300 font-semibold">one simple platform.</span>
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
