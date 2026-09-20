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
    <section id="home" className="relative pt-8 pb-14 overflow-hidden bg-gradient-to-b from-[#F8FAF8] via-white to-white">
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#E8F5E9]/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-32 right-10 w-96 h-96 bg-[#FEF3C7]/40 rounded-full blur-3xl pointer-events-none -z-10" />


      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F5E9] border border-[#A5D6A7]/90 text-[#1B5E20] text-xs font-semibold tracking-wide shadow-2xs">
              <Sprout className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>AI-Powered Agriculture</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[54px] font-extrabold tracking-tight text-[#1F2937] leading-[1.15]">
              Smarter Farming <br className="hidden sm:block" />
              Starts with <br className="hidden sm:block" />
              <span className="text-[#1B5E20]">Better Insights.</span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-[#4B5563] leading-relaxed max-w-xl">
              KrishiAI helps farmers understand crop health, weather conditions, and
              farming challenges using AI-powered analysis, personalized
              recommendations, and verified experts.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2">
              <button
                type="button"
                onClick={handleCTA}
                className="w-full sm:w-auto px-6 py-3.5 text-sm sm:text-[15px] font-semibold text-white bg-[#1B5E20] hover:bg-[#1B5E20] rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 group cursor-pointer min-h-[48px] active:scale-98"
              >
                <span>{isAuthenticated ? "Go to Dashboard" : "Get Started"}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <Link
                href="/#how-it-works"
                className="w-full sm:w-auto px-6 py-3.5 text-sm sm:text-[15px] font-semibold text-[#1F2937] bg-white hover:bg-[#F8FAF8] border border-[#D1D5DB] rounded-xl transition-all shadow-2xs hover:border-[#E5E7EB] flex items-center justify-center min-h-[48px]"
              >
                See How It Works
              </Link>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-medium text-[#4B5563]">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E8F5E9]/80 border border-[#C8E6C9] text-[#1B5E20]">
                <Bot className="w-3.5 h-3.5 text-[#2E7D32] shrink-0" />
                <span>AI-assisted</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FEF3C7]/80 border border-[#FCD34D] text-[#F59E0B]">
                <CloudSun className="w-3.5 h-3.5 text-[#F59E0B]0 shrink-0" />
                <span>Weather-aware</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E8F5E9]/80 border border-[#C8E6C9] text-[#1B5E20]">
                <UserCheck className="w-3.5 h-3.5 text-[#2E7D32] shrink-0" />
                <span>Expert-supported</span>
              </span>
            </div>
          </div>

          {/* Right Visual Composition */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl p-3 sm:p-5 lg:p-6 overflow-hidden bg-gradient-to-br from-[#E8F5E9]/60 to-[#F1F5F2]/80 border border-[#E5E7EB] shadow-xl">
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

              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 items-start">
                
                {/* Left Card: Tomato Leaf AI Analysis */}
                <div className="sm:col-span-7 bg-white rounded-2xl p-3.5 sm:p-4 border border-[#E5E7EB] shadow-lg space-y-3">
                  <div className="relative h-40 sm:h-44 w-full rounded-xl overflow-hidden border border-[#EEF0EE] bg-[#F1F5F2]">
                    <Image
                      src="/images/crops/tomato-crop.jpg"
                      alt="Tomato crop on vine"
                      fill
                      sizes="(max-width: 640px) 100vw, 300px"
                      className="object-cover"
                      priority
                    />
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[11px] font-semibold text-[#1B5E20] flex items-center gap-1.5 shadow-xs">
                      <Sprout className="w-3.5 h-3.5 text-[#2E7D32]" />
                      <span>KrishiAI Analysis</span>
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                      Tomato Leaf
                    </p>
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-[#1F2937]">
                        Possible Disease Detected
                      </h3>
                      <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#6B7280] font-medium">AI Confidence</span>
                      <span className="font-bold text-[#1F2937]">82%</span>
                    </div>
                    <div className="h-2 w-full bg-[#F1F5F2] rounded-full overflow-hidden flex gap-0.5">
                      <div className="h-full bg-[#2E7D32] w-[20%]" />
                      <div className="h-full bg-[#2E7D32] w-[20%]" />
                      <div className="h-full bg-[#2E7D32] w-[20%]" />
                      <div className="h-full bg-[#2E7D32] w-[15%]" />
                      <div className="h-full bg-[#FEF3C7] w-[7%]" />
                      <div className="h-full bg-[#E5E7EB] flex-1" />
                    </div>
                    <p className="text-[11px] font-semibold text-[#F59E0B]">
                      Medium Confidence
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#F8FAF8] border border-[#EEF0EE] text-[#4B5563] text-xs leading-relaxed">
                    <p className="font-semibold text-[#1F2937] text-[11px] uppercase tracking-wide mb-0.5">
                      Recommendation
                    </p>
                    Monitor affected leaves and consider expert review.
                  </div>

                  <Link href="/farmer/analysis" className="block w-full py-2.5 px-3 text-xs font-semibold text-white bg-[#1B5E20] hover:bg-[#1B5E20] rounded-lg transition-colors text-center shadow-xs min-h-[40px]">
                    View Full Analysis
                  </Link>
                </div>

                {/* Right Column Cards */}
                <div className="sm:col-span-5 space-y-3">
                  <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-[#E5E7EB] shadow-md space-y-2.5">
                    <div className="flex items-center justify-between text-xs text-[#6B7280] font-medium">
                      <span className="flex items-center gap-1 text-[#4B5563] font-semibold">
                        <MapPin className="w-3.5 h-3.5 text-[#2E7D32]" />
                        Kathmandu, Nepal
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        <Sun className="w-7 h-7 text-[#F59E0B]0" />
                        <div>
                          <p className="text-xl font-extrabold text-[#1F2937] leading-none">24°c</p>
                          <p className="text-[11px] text-[#6B7280] font-medium">Sunny</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#EEF0EE] grid grid-cols-1 gap-1.5 text-[11px] text-[#4B5563]">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-[#6B7280]">
                          <CloudRain className="w-3 h-3 text-[#2563EB]0" /> Rain
                        </span>
                        <span className="font-semibold text-[#1F2937]">20%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-[#6B7280]">
                          <Droplets className="w-3 h-3 text-[#2E7D32]0" /> Humidity
                        </span>
                        <span className="font-semibold text-[#1F2937]">58%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-[#6B7280]">
                          <Wind className="w-3 h-3 text-[#9CA3AF]" /> Wind
                        </span>
                        <span className="font-semibold text-[#1F2937]">12 km/h</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-3 sm:p-3.5 border border-[#E5E7EB] shadow-md space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#1B5E20]">
                      <Sprout className="w-3.5 h-3.5 text-[#2E7D32]" />
                      <span>Farm Insight</span>
                    </div>
                    <p className="text-[11px] text-[#4B5563] leading-snug">
                      Rain is expected tomorrow. Consider reviewing your irrigation and crop protection plans.
                    </p>
                  </div>

                  <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 border border-[#E5E7EB] shadow-md">
                    <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-2">
                      Crop Health Status
                    </p>
                    <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 text-[11px] font-medium text-[#4B5563]">
                      <span className="inline-flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#2E7D32]" />
                        Healthy <strong className="text-[#2E7D32] ml-0.5">7</strong>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#FEF3C7]" />
                        Attention <strong className="text-[#F59E0B] ml-0.5">2</strong>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#DC2626]" />
                        High Risk <strong className="text-[#DC2626] ml-0.5">1</strong>
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* 4 Feature Badges Strip */}
        <div className="mt-10 sm:mt-14 pt-6 sm:pt-8 border-t border-[#EEF0EE]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-6">
            <div className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-[#F8FAF8] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] border border-[#C8E6C9] flex items-center justify-center shrink-0 text-[#2E7D32]">
                <Bot className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-[#1F2937]">AI-Powered</h4>
                <p className="text-xs text-[#6B7280] leading-relaxed">
                  Computer vision and intelligent recommendations.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-[#F8FAF8] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] border border-[#C8E6C9] flex items-center justify-center shrink-0 text-[#2E7D32]">
                <CloudSun className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-[#1F2937]">Weather-Aware</h4>
                <p className="text-xs text-[#6B7280] leading-relaxed">
                  Weather information and agricultural alerts.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-[#F8FAF8] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] border border-[#C8E6C9] flex items-center justify-center shrink-0 text-[#2E7D32]">
                <UserCheck className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-[#1F2937]">Expert-Supported</h4>
                <p className="text-xs text-[#6B7280] leading-relaxed">
                  Connect with verified agricultural professionals.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-[#F8FAF8] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] border border-[#C8E6C9] flex items-center justify-center shrink-0 text-[#2E7D32]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-[#1F2937]">Farmer-Focused</h4>
                <p className="text-xs text-[#6B7280] leading-relaxed">
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
