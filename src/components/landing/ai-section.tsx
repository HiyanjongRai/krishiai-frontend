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
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xl space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
                  
                  <div className="sm:col-span-6 space-y-3">
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
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
                              ? "border-emerald-600 ring-2 ring-emerald-500/20"
                              : "border-slate-200 hover:border-slate-300"
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
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                        <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                        <span>AI Analysis Result</span>
                      </div>
                      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        Potato Leaf
                      </p>
                      <h3 className="text-lg font-extrabold text-slate-900 leading-tight">
                        Possible Early Blight
                      </h3>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">Confidence</span>
                        <span className="font-bold text-slate-800">78%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex gap-0.5">
                        <div className="h-full bg-emerald-600 w-[20%]" />
                        <div className="h-full bg-emerald-600 w-[20%]" />
                        <div className="h-full bg-emerald-600 w-[20%]" />
                        <div className="h-full bg-amber-400 w-[18%]" />
                        <div className="h-full bg-slate-200 flex-1" />
                      </div>
                      <div className="flex items-center gap-2 pt-0.5">
                        <span className="text-[11px] font-medium text-slate-500">Severity:</span>
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                          Medium
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                      <p className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                        Recommended Action
                      </p>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Remove affected leaves, improve air circulation and monitor closely.
                      </p>
                    </div>

                    <Link href="/farmer/analysis" className="block text-center w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#0f3d26] hover:bg-[#14532d] rounded-xl transition-colors shadow-xs">
                      View Full Report
                    </Link>
                  </div>

                </div>
              </div>
            </div>

            {/* Right Column: Copy & Checklist */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/90 text-emerald-800 text-xs font-semibold tracking-wide">
                <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                <span>AI CROP ANALYSIS</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Understand What <br />
                Your Crop Is Telling You.
              </h2>

              <p className="text-base text-slate-600 leading-relaxed max-w-lg">
                Upload an image of your crop and receive an AI-assisted health
                analysis with confidence information and practical next steps.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {checkmarks.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-sm font-medium text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={openRegister}
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#0f3d26] hover:bg-[#14532d] rounded-xl transition-all shadow-md hover:shadow-lg group cursor-pointer"
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
      <section className="py-16 sm:py-20 bg-[#fafcf9]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            
            {/* Left Card: AI Advisor */}
            <div className="bg-[#0b271b] rounded-3xl p-6 sm:p-8 text-white flex flex-col justify-between shadow-xl border border-emerald-900/40 relative overflow-hidden">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-700/60 text-emerald-300 text-xs font-semibold tracking-wide">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>AI ADVISOR</span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                    Your Agricultural Questions, <br />
                    One AI Advisor Away.
                  </h3>
                  <p className="text-sm text-emerald-100/70 leading-relaxed max-w-md">
                    Ask questions about crops, pests, soil, irrigation, weather, and more.
                  </p>
                </div>

                <div className="pt-4 space-y-3.5">
                  <div className="flex items-start justify-end">
                    <div className="max-w-[85%] bg-white/10 border border-white/15 rounded-2xl rounded-tr-xs px-4 py-2.5 text-xs sm:text-[13px] text-white/95 leading-relaxed backdrop-blur-xs">
                      <p className="font-semibold text-emerald-300 text-[11px] mb-0.5">Farmer</p>
                      My tomato leaves are turning yellow.
                    </div>
                  </div>

                  <div className="flex items-start justify-start">
                    <div className="max-w-[92%] bg-white text-slate-800 rounded-2xl rounded-tl-xs p-4 text-xs sm:text-[13px] leading-relaxed shadow-lg">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-800 text-[12px] mb-1.5">
                        <Sprout className="w-3.5 h-3.5 text-emerald-600" />
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
                    className="w-full py-3.5 pl-4 pr-12 text-xs sm:text-sm bg-white/10 border border-white/20 rounded-xl text-white placeholder-emerald-100/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white/15 transition-all"
                  />
                  <button
                    aria-label="Send message"
                    className="absolute right-2 p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Card: Weather Intelligence */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/90 text-emerald-800 text-xs font-semibold tracking-wide">
                  <CloudSun className="w-3.5 h-3.5 text-amber-500" />
                  <span>WEATHER INTELLIGENCE</span>
                </div>

                <div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
                    Know the Weather. <br />
                    Plan Your Farm.
                  </h3>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Sun className="w-10 h-10 text-amber-500" />
                    <div>
                      <div className="text-3xl font-extrabold text-slate-900 leading-none">
                        24°c
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-1">Sunny</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-xs">
                    <div>
                      <p className="text-slate-400 text-[11px] font-medium">Humidity</p>
                      <p className="font-bold text-slate-800 text-sm">56%</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-[11px] font-medium">Rain Probability</p>
                      <p className="font-bold text-slate-800 text-sm">20%</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-[11px] font-medium">Wind</p>
                      <p className="font-bold text-slate-800 text-sm">12 km/h</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1.5 sm:gap-2 pt-1 text-center">
                  {forecast.map((f, i) => {
                    const FIcon = f.icon;
                    return (
                      <div
                        key={i}
                        className={`p-2 rounded-xl border ${
                          i === 0
                            ? "bg-emerald-50/60 border-emerald-200"
                            : "bg-slate-50/50 border-slate-100"
                        } space-y-1`}
                      >
                        <p className="text-[10px] sm:text-[11px] font-semibold text-slate-600">
                          {f.day}
                        </p>
                        <div className="flex justify-center my-0.5">
                          <FIcon
                            className={`w-4 h-4 ${
                              f.isRain ? "text-blue-500" : "text-amber-500"
                            }`}
                          />
                        </div>
                        <div className="text-[10px] sm:text-[11px] font-bold text-slate-800">
                          {f.tempHigh}
                        </div>
                        <div className="text-[9px] sm:text-[10px] text-slate-400">
                          {f.tempLow}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-2.5">
                  <Sprout className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-700 leading-relaxed">
                    <span className="font-bold text-emerald-900 block mb-0.5">
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
                  className="inline-flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold text-white bg-[#0f3d26] hover:bg-[#14532d] rounded-xl transition-all shadow-xs"
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
