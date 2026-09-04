"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthModal } from "@/providers/auth-modal-provider";
import { useAuth, getDashboardRoute } from "@/providers/auth-provider";
import {
  Sprout,
  ArrowRight,
  Bot,
  CloudSun,
  ShieldCheck,
  UserCheck,
  MapPin,
  Sun,
  Droplets,
  Wind,
  CloudRain,
} from "lucide-react";

export function Hero() {
  const router = useRouter();
  const { openRegister } = useAuthModal();
  const { isAuthenticated, user } = useAuth();

  const handleCTA = () => {
    if (isAuthenticated && user) {
      router.push(getDashboardRoute(user.role));
    } else {
      openRegister();
    }
  };

  return (
    <section id="home" className="relative pt-8 pb-14 overflow-hidden bg-gradient-to-b from-[#f8faf7] via-white to-white">
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-32 right-10 w-96 h-96 bg-amber-50/40 rounded-full blur-3xl pointer-events-none -z-10" />


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/90 text-emerald-800 text-xs font-semibold tracking-wide shadow-2xs">
              <Sprout className="w-3.5 h-3.5 text-emerald-600" />
              <span>AI-Powered Agriculture</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight text-slate-900 leading-[1.14]">
              Smarter Farming <br className="hidden sm:block" />
              Starts with <br className="hidden sm:block" />
              <span className="text-[#0f3d26]">Better Insights.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
              KrishiAI helps farmers understand crop health, weather conditions, and
              farming challenges using AI-powered analysis, personalized
              recommendations, and verified experts.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={handleCTA}
                className="px-6 py-3.5 text-[15px] font-semibold text-white bg-[#0f3d26] hover:bg-[#14532d] rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2.5 group cursor-pointer"
              >
                <span>{isAuthenticated ? "Go to Dashboard" : "Get Started"}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <Link
                href="/#how-it-works"
                className="px-6 py-3.5 text-[15px] font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-all shadow-2xs hover:border-slate-400"
              >
                See How It Works
              </Link>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600">
              <span className="inline-flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-emerald-600" />
                <span>AI-assisted</span>
              </span>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-1.5">
                <CloudSun className="w-4 h-4 text-amber-500" />
                <span>Weather-aware</span>
              </span>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-emerald-700" />
                <span>Expert-supported</span>
              </span>
            </div>
          </div>

          {/* Right Visual Composition */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl p-4 sm:p-6 overflow-hidden bg-gradient-to-br from-emerald-50/60 to-slate-100/80 border border-slate-200/80 shadow-xl">
              <div className="absolute inset-0 z-0">
                <Image
                  src="/images/hero/hero-terrace-bg.jpg"
                  alt="Terraced farming landscape"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover opacity-25"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/50 to-transparent" />
              </div>

              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
                
                {/* Left Card: Tomato Leaf AI Analysis */}
                <div className="sm:col-span-7 bg-white rounded-2xl p-4 border border-slate-200 shadow-lg space-y-3">
                  <div className="relative h-44 w-full rounded-xl overflow-hidden border border-slate-100 bg-slate-100">
                    <Image
                      src="/images/crops/tomato-crop.jpg"
                      alt="Tomato crop on vine"
                      fill
                      sizes="(max-width: 640px) 100vw, 300px"
                      className="object-cover"
                      priority
                    />
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[11px] font-semibold text-emerald-800 flex items-center gap-1.5 shadow-xs">
                      <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                      <span>KrishiAI Analysis</span>
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Tomato Leaf
                    </p>
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-900">
                        Possible Disease Detected
                      </h3>
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">AI Confidence</span>
                      <span className="font-bold text-slate-800">82%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex gap-0.5">
                      <div className="h-full bg-emerald-600 w-[20%]" />
                      <div className="h-full bg-emerald-600 w-[20%]" />
                      <div className="h-full bg-emerald-600 w-[20%]" />
                      <div className="h-full bg-emerald-500 w-[15%]" />
                      <div className="h-full bg-amber-400 w-[7%]" />
                      <div className="h-full bg-slate-200 flex-1" />
                    </div>
                    <p className="text-[11px] font-semibold text-amber-600">
                      Medium Confidence
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-600 text-xs leading-relaxed">
                    <p className="font-semibold text-slate-800 text-[11px] uppercase tracking-wide mb-0.5">
                      Recommendation
                    </p>
                    Monitor affected leaves and consider expert review.
                  </div>

                  <Link href="/farmer/analysis" className="block w-full py-2 px-3 text-xs font-semibold text-white bg-[#0f3d26] hover:bg-[#14532d] rounded-lg transition-colors text-center shadow-xs">
                    View Full Analysis
                  </Link>
                </div>

                {/* Right Column Cards */}
                <div className="sm:col-span-5 space-y-3.5">
                  <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-md space-y-2.5">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1 text-slate-700 font-semibold">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        Kathmandu, Nepal
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        <Sun className="w-7 h-7 text-amber-500" />
                        <div>
                          <p className="text-xl font-extrabold text-slate-900 leading-none">24°c</p>
                          <p className="text-[11px] text-slate-500 font-medium">Sunny</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 grid grid-cols-1 gap-1.5 text-[11px] text-slate-600">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-slate-500">
                          <CloudRain className="w-3 h-3 text-blue-500" /> Rain
                        </span>
                        <span className="font-semibold text-slate-800">20%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-slate-500">
                          <Droplets className="w-3 h-3 text-cyan-500" /> Humidity
                        </span>
                        <span className="font-semibold text-slate-800">58%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-slate-500">
                          <Wind className="w-3 h-3 text-slate-400" /> Wind
                        </span>
                        <span className="font-semibold text-slate-800">12 km/h</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-md space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                      <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Farm Insight</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-snug">
                      Rain is expected tomorrow. Consider reviewing your irrigation and crop protection plans.
                    </p>
                  </div>

                  <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 border border-slate-200 shadow-md">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Crop Health Status
                    </p>
                    <div className="flex items-center justify-between text-[11px] font-medium text-slate-700">
                      <span className="inline-flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        Healthy <strong className="text-emerald-700 ml-0.5">7</strong>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        Attention <strong className="text-amber-700 ml-0.5">2</strong>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                        High Risk <strong className="text-rose-700 ml-0.5">1</strong>
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* 4 Feature Badges Strip */}
        <div className="mt-14 pt-8 border-t border-slate-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-slate-50/80 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 text-emerald-700">
                <Bot className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-slate-900">AI-Powered</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Computer vision and intelligent recommendations.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-slate-50/80 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 text-emerald-700">
                <CloudSun className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-slate-900">Weather-Aware</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Weather information and agricultural alerts.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-slate-50/80 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 text-emerald-700">
                <UserCheck className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-slate-900">Expert-Supported</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Connect with verified agricultural professionals.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-slate-50/80 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 text-emerald-700">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-slate-900">Farmer-Focused</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Designed around practical farming needs.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
