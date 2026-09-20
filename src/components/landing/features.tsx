import React from "react";
import Image from "next/image";
import { Sprout, Sun, UserCheck, BookOpen } from "lucide-react";

export function Features() {
  const problems = [
    {
      title: "Crop Problems",
      description: "Farmers may struggle to identify crop health problems early.",
      icon: Sprout,
      iconBg: "bg-[#E8F5E9] text-[#2E7D32]",
    },
    {
      title: "Changing Weather",
      description: "Weather conditions can affect irrigation, crop protection, and planning.",
      icon: Sun,
      iconBg: "bg-[#FEF3C7] text-[#F59E0B]",
    },
    {
      title: "Limited Expert Access",
      description: "Professional agricultural guidance may not always be easily accessible.",
      icon: UserCheck,
      iconBg: "bg-[#DBEAFE] text-[#2563EB]",
    },
    {
      title: "Information Overload",
      description: "Finding reliable agricultural information can be difficult.",
      icon: BookOpen,
      iconBg: "bg-[#E8F5E9] text-[#2E7D32]",
    },
  ];

  return (
    <section id="features" className="py-12 sm:py-16 lg:py-20 bg-[#F1F5F2]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          <div className="lg:col-span-6 space-y-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#2E7D32] mb-2">
                Why KrishiAI
              </p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1F2937] tracking-tight leading-tight">
                Farming Decisions <br />
                Shouldn&apos;t Have to Be Guesswork.
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              {problems.map((prob, idx) => {
                const Icon = prob.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 sm:p-5 rounded-[22px] sm:rounded-[24px] border border-[#E5E7EB] bg-white shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE] hover:shadow-[0_8px_30px_-4px_#E5E7EB] transition-shadow space-y-2.5"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${prob.iconBg}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-[#1F2937]">
                        {prob.title}
                      </h3>
                      <p className="text-xs text-[#6B7280] leading-relaxed">
                        {prob.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-[24px] sm:rounded-[28px] overflow-hidden shadow-[0_10px_40px_-8px_#E5E7EB] border border-[#E5E7EB] aspect-[4/3] sm:aspect-[16/11]">
              <Image
                src="/images/hero/farmer-tablet.jpg"
                alt="Nepali farmer using KrishiAI tablet in field"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute bottom-3 left-3 right-3 sm:left-auto sm:bottom-6 sm:right-6 sm:max-w-xs bg-[#2E7D32]/95 backdrop-blur-md text-white p-3.5 sm:p-4 rounded-[18px] sm:rounded-[20px] shadow-xl flex items-center gap-3">
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
