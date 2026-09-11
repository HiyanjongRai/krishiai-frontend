import React from "react";
import Image from "next/image";
import { Sprout, Sun, UserCheck, BookOpen } from "lucide-react";

export function Features() {
  const problems = [
    {
      title: "Crop Problems",
      description: "Farmers may struggle to identify crop health problems early.",
      icon: Sprout,
      iconBg: "bg-[#DDF4EA] text-[#0F9F68]",
    },
    {
      title: "Changing Weather",
      description: "Weather conditions can affect irrigation, crop protection, and planning.",
      icon: Sun,
      iconBg: "bg-amber-50 text-amber-600",
    },
    {
      title: "Limited Expert Access",
      description: "Professional agricultural guidance may not always be easily accessible.",
      icon: UserCheck,
      iconBg: "bg-blue-50 text-blue-600",
    },
    {
      title: "Information Overload",
      description: "Finding reliable agricultural information can be difficult.",
      icon: BookOpen,
      iconBg: "bg-teal-50 text-teal-600",
    },
  ];

  return (
    <section id="features" className="py-16 sm:py-20 bg-[#F4F4F6]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">

          <div className="lg:col-span-6 space-y-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#0F9F68] mb-2">
                Why KrishiAI
              </p>
              <h2 className="text-3xl sm:text-4xl font-black text-[#171717] tracking-tight leading-tight">
                Farming Decisions <br />
                Shouldn&apos;t Have to Be Guesswork.
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {problems.map((prob, idx) => {
                const Icon = prob.icon;
                return (
                  <div
                    key={idx}
                    className="p-5 rounded-[24px] border border-[rgba(234,234,236,0.85)] bg-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04),0_2px_6px_-1px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.07)] transition-shadow space-y-3"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${prob.iconBg}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-[#171717]">
                        {prob.title}
                      </h3>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {prob.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-[28px] overflow-hidden shadow-[0_10px_40px_-8px_rgba(0,0,0,0.12)] border border-[rgba(234,234,236,0.85)] aspect-[4/3] sm:aspect-[16/11]">
              <Image
                src="/images/hero/farmer-tablet.jpg"
                alt="Nepali farmer using KrishiAI tablet in field"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 max-w-xs bg-[#0F9F68]/95 backdrop-blur-md text-white p-4 rounded-[20px] shadow-xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0 text-white">
                  <Sprout className="w-5 h-5" />
                </div>
                <p className="text-xs font-medium leading-snug">
                  KrishiAI brings these tools together in{" "}
                  <span className="font-black">one simple platform.</span>
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
