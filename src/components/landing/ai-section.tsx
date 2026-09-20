"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuthModal } from "@/providers/auth-modal-provider";
import {
  Sprout,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  CloudSun,
  Send,
  Sun,
  CloudRain,
  Droplets,
  Wind,
} from "lucide-react";

export function AISection() {
  const { openRegister } = useAuthModal();
  const [chatInput, setChatInput] = useState("");

  const checkmarks = [
    "Crop image analysis",
    "Severity indication",
    "Possible disease identification",
    "Recommended actions",
    "Confidence score",
    "Analysis history",
  ];

  const thumbnails = [
    "/images/diseases/thumb-1.jpg",
    "/images/diseases/thumb-2.jpg",
    "/images/diseases/thumb-3.jpg",
    "/images/diseases/thumb-4.jpg",
  ];

  const forecast = [
    { day: "Today", icon: Sun, tempHigh: "24°", tempLow: "16°", isRain: false },
    { day: "Sat", icon: CloudRain, tempHigh: "23°", tempLow: "15°", isRain: true },
    { day: "Sun", icon: CloudRain, tempHigh: "22°", tempLow: "14°", isRain: true },
    { day: "Mon", icon: Sun, tempHigh: "23°", tempLow: "16°", isRain: false },
    { day: "Tue", icon: Sun, tempHigh: "24°", tempLow: "16°", isRain: false },
    { day: "Wed", icon: Sun, tempHigh: "25°", tempLow: "17°", isRain: false },
    { day: "Thu", icon: Sun, tempHigh: "26°", tempLow: "17°", isRain: false },
  ];

  return (
    <div id="ai-analysis" className="space-y-16">
      {/* 1. Crop Health & Disease Analysis Section */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            
            {/* Left Column: Interactive AI Analysis Card */}
            <div className="lg:col-span-6">
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E5E7EB] shadow-xl space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
                  
                  <div className="sm:col-span-6 space-y-3">
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#E5E7EB] bg-[#F1F5F2]">
                      <Image
                        src="/images/diseases/crop-disease-leaf.jpg"
                        alt="Potato leaf infected with Early Blight"
                        fill
                        sizes="(max-width: 640px) 100vw, 280px"
                        className="object-cover"
                      />
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      {thumbnails.map((src, i) => (
                        <div
                          key={i}
                          className={`relative aspect-square rounded-lg overflow-hidden border ${
                            i === 0
                              ? "border-[#2E7D32] ring-2 ring-[#E8F5E9]"
                              : "border-[#E5E7EB] hover:border-[#D1D5DB]"
                          } cursor-pointer transition-all`}
                        >
                          <Image
                            src={src}
                            alt={`Crop leaf sample ${i + 1}`}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="sm:col-span-6 space-y-4 text-left">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#1B5E20]">
                        <Sprout className="w-3.5 h-3.5 text-[#2E7D32]" />
                        <span>AI Analysis Result</span>
                      </div>
                      <p className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">
                        Potato Leaf
                      </p>
                      <h3 className="text-lg font-extrabold text-[#1F2937] leading-tight">
                        Possible Early Blight
                      </h3>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#6B7280] font-medium">Confidence</span>
                        <span className="font-bold text-[#1F2937]">78%</span>
                      </div>
                      <div className="h-2 w-full bg-[#F1F5F2] rounded-full overflow-hidden flex gap-0.5">
                        <div className="h-full bg-[#2E7D32] w-[20%]" />
                        <div className="h-full bg-[#2E7D32] w-[20%]" />
                        <div className="h-full bg-[#2E7D32] w-[20%]" />
                        <div className="h-full bg-[#FEF3C7] w-[18%]" />
                        <div className="h-full bg-[#E5E7EB] flex-1" />
                      </div>
                      <div className="flex items-center gap-2 pt-0.5">
                        <span className="text-[11px] font-medium text-[#6B7280]">Severity:</span>
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#FEF3C7] text-[#F59E0B] border border-[#FCD34D]">
                          Medium
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#F8FAF8] border border-[#EEF0EE] space-y-1">
                      <p className="text-[11px] font-bold text-[#1F2937] uppercase tracking-wider">
                        Recommended Action
                      </p>
                      <p className="text-xs text-[#4B5563] leading-relaxed">
                        Remove affected leaves, improve air circulation and monitor closely.
                      </p>
                    </div>

                    <Link href="/farmer/analysis" className="block text-center w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#1B5E20] hover:bg-[#1B5E20] rounded-xl transition-colors shadow-xs">
                      View Full Report
                    </Link>
                  </div>

                </div>
              </div>
            </div>

            {/* Right Column: Copy & Checklist */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F5E9] border border-[#A5D6A7]/90 text-[#1B5E20] text-xs font-semibold tracking-wide">
                <Sprout className="w-3.5 h-3.5 text-[#2E7D32]" />
                <span>AI CROP ANALYSIS</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] tracking-tight leading-tight">
                Understand What <br />
                Your Crop Is Telling You.
              </h2>

              <p className="text-base text-[#4B5563] leading-relaxed max-w-lg">
                Upload an image of your crop and receive an AI-assisted health
                analysis with confidence information and practical next steps.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {checkmarks.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-sm font-medium text-[#4B5563]">
                    <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={openRegister}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#1B5E20] hover:bg-[#1B5E20] rounded-xl transition-all shadow-md hover:shadow-lg group cursor-pointer min-h-[44px] active:scale-98"
                >
                  <span>Try AI Analysis</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Dual AI Advisor & Weather Cards */}
      <section className="py-16 sm:py-20 bg-[#FCFEFC]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            
            {/* Left Card: AI Advisor */}
            <div className="bg-[#1B5E20] rounded-3xl p-6 sm:p-8 text-white flex flex-col justify-between shadow-xl border border-[#C8E6C9]/40 relative overflow-hidden">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F5E9]/60 border border-[#C8E6C9]/60 text-[#2E7D32] text-xs font-semibold tracking-wide">
                  <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>AI ADVISOR</span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                    Your Agricultural Questions, <br />
                    One AI Advisor Away.
                  </h3>
                  <p className="text-sm text-[#2E7D32]/70 leading-relaxed max-w-md">
                    Ask questions about crops, pests, soil, irrigation, weather, and more.
                  </p>
                </div>

                <div className="pt-4 space-y-3.5">
                  <div className="flex items-start justify-end">
                    <div className="max-w-[85%] bg-white/10 border border-white/15 rounded-2xl rounded-tr-xs px-4 py-2.5 text-xs sm:text-[13px] text-white/95 leading-relaxed backdrop-blur-xs">
                      <p className="font-semibold text-[#2E7D32] text-[11px] mb-0.5">Farmer</p>
                      My tomato leaves are turning yellow.
                    </div>
                  </div>

                  <div className="flex items-start justify-start">
                    <div className="max-w-[92%] bg-white text-[#1F2937] rounded-2xl rounded-tl-xs p-4 text-xs sm:text-[13px] leading-relaxed shadow-lg">
                      <div className="flex items-center gap-1.5 font-bold text-[#1B5E20] text-[12px] mb-1.5">
                        <Sprout className="w-3.5 h-3.5 text-[#2E7D32]" />
                        <span>KrishiAI</span>
                      </div>
                      There can be several possible causes, including nutrient issues,
                      watering problems, or disease. Check the lower leaves first and
                      compare the soil moisture before changing your watering schedule.
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask KrishiAI something..."
                    className="w-full py-3.5 pl-4 pr-12 text-xs sm:text-sm bg-white/10 border border-white/20 rounded-xl text-white placeholder-[#E8F5E9]/50 focus:outline-none focus:ring-2 focus:ring-[#E8F5E9] focus:bg-white/15 transition-all"
                  />
                  <button
                    aria-label="Send message"
                    className="absolute right-2 p-2 rounded-lg bg-[#2E7D32] hover:bg-[#256B2A] text-white transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Card: Weather Intelligence */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E7EB] shadow-xl flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F5E9] border border-[#A5D6A7]/90 text-[#1B5E20] text-xs font-semibold tracking-wide">
                  <CloudSun className="w-3.5 h-3.5 text-[#F59E0B]0" />
                  <span>WEATHER INTELLIGENCE</span>
                </div>

                <div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1F2937] leading-tight">
                    Know the Weather. <br />
                    Plan Your Farm.
                  </h3>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8FAF8] border border-[#EEF0EE] flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Sun className="w-10 h-10 text-[#F59E0B]0" />
                    <div>
                      <div className="text-3xl font-extrabold text-[#1F2937] leading-none">
                        24°c
                      </div>
                      <p className="text-xs text-[#6B7280] font-medium mt-1">Sunny</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-xs">
                    <div>
                      <p className="text-[#9CA3AF] text-[11px] font-medium">Humidity</p>
                      <p className="font-bold text-[#1F2937] text-sm">56%</p>
                    </div>
                    <div>
                      <p className="text-[#9CA3AF] text-[11px] font-medium">Rain Probability</p>
                      <p className="font-bold text-[#1F2937] text-sm">20%</p>
                    </div>
                    <div>
                      <p className="text-[#9CA3AF] text-[11px] font-medium">Wind</p>
                      <p className="font-bold text-[#1F2937] text-sm">12 km/h</p>
                    </div>
                  </div>
                </div>

                <div className="flex sm:grid sm:grid-cols-7 gap-2 overflow-x-auto pb-2 pt-1 text-center scrollbar-none snap-x -mx-1 px-1">
                  {forecast.map((f, i) => {
                    const FIcon = f.icon;
                    return (
                      <div
                        key={i}
                        className={`min-w-[68px] sm:min-w-0 flex-1 shrink-0 p-2.5 sm:p-2 rounded-xl border snap-start ${
                          i === 0
                            ? "bg-[#E8F5E9]/70 border-[#A5D6A7] ring-1 ring-[#E8F5E9]"
                            : "bg-[#F8FAF8] border-[#EEF0EE]"
                        } space-y-1 transition-all`}
                      >
                        <p className="text-[11px] font-semibold text-[#4B5563]">
                          {f.day}
                        </p>
                        <div className="flex justify-center my-0.5">
                          <FIcon
                            className={`w-4 h-4 ${
                              f.isRain ? "text-[#2563EB]0" : "text-[#F59E0B]0"
                            }`}
                          />
                        </div>
                        <div className="text-[11px] sm:text-xs font-bold text-[#1F2937]">
                          {f.tempHigh}
                        </div>
                        <div className="text-[10px] text-[#9CA3AF]">
                          {f.tempLow}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-3.5 rounded-xl bg-[#E8F5E9]/70 border border-[#A5D6A7]/80 flex items-start gap-2.5">
                  <Sprout className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />
                  <div className="text-xs text-[#4B5563] leading-relaxed">
                    <span className="font-bold text-[#1B5E20] block mb-0.5">
                      Farm Insight
                    </span>
                    Rain is expected tomorrow. Consider reviewing your irrigation and
                    crop protection plans.
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/farmer/dashboard"
                  className="inline-flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold text-white bg-[#1B5E20] hover:bg-[#1B5E20] rounded-xl transition-all shadow-xs"
                >
                  <span>Check Weather</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
