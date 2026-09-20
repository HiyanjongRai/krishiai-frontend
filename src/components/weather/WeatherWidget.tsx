"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  Calendar,
  Clock,
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Droplets,
  Eye,
  MapPin,
  RefreshCw,
  Sprout,
  Sun,
  Umbrella,
  Wind,
} from "lucide-react";
import { getWmoCondition } from "./weatherService";
import { WeatherError } from "./WeatherError";
import { WeatherLoading } from "./WeatherLoading";
import { useWeather } from "./useWeather";

interface WeatherWidgetProps {
  id?: string;
  className?: string;
}

// Helper to render appropriate weather icon
function WeatherIcon({
  code,
  isDay = true,
  className = "w-5 h-5",
}: {
  code: number;
  isDay?: boolean;
  className?: string;
}) {
  const cond = getWmoCondition(code, isDay);
  switch (cond.iconType) {
    case "sun":
      return <Sun className={`${className} text-[#F59E0B] fill-[#F59E0B]/30`} />;
    case "cloud-sun":
      return <CloudSun className={`${className} text-[#F59E0B]`} />;
    case "cloud":
      return <Cloud className={`${className} text-[#6B7280] fill-[#6B7280]/20`} />;
    case "cloud-rain":
      return <CloudRain className={`${className} text-[#2563EB]`} />;
    case "cloud-drizzle":
      return <CloudDrizzle className={`${className} text-[#0284C7]`} />;
    case "cloud-snow":
      return <CloudSnow className={`${className} text-[#38BDF8]`} />;
    case "cloud-lightning":
      return <CloudLightning className={`${className} text-[#D97706]`} />;
    case "cloud-fog":
      return <CloudFog className={`${className} text-[#9CA3AF]`} />;
    default:
      return <Sun className={`${className} text-[#F59E0B]`} />;
  }
}

export function WeatherWidget({ id, className = "" }: WeatherWidgetProps) {
  const { data, loading, loadingMsg, refreshing, error, loadWeather } = useWeather();
  const [activeTab, setActiveTab] = useState<"hourly" | "daily">("hourly");

  if (loading) {
    return <WeatherLoading statusMessage={loadingMsg} />;
  }

  if (error) {
    return <WeatherError error={error} onRetry={() => loadWeather(true)} isRetrying={refreshing} />;
  }

  if (!data) {
    return null;
  }

  const { current, advisory, hourly, daily } = data;

  return (
    <div
      id={id}
      className={`rounded-[24px] border border-[#E5E7EB] bg-white p-5 space-y-4 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE] transition-all ${className}`}
    >
      {/* ─── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32] shrink-0">
            <Sprout className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-[#1F2937] leading-none">Today&apos;s Weather</p>
            <span
              className="text-[10px] font-semibold text-[#6B7280] flex items-center gap-1 mt-1 truncate"
              title={data.locationName}
            >
              <MapPin className="w-3 h-3 text-[#2E7D32] shrink-0" />
              <span className="truncate">{data.locationName}</span>
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => loadWeather(true)}
          disabled={refreshing}
          className="w-7 h-7 rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#9CA3AF] hover:text-[#2E7D32] hover:border-[#C8E6C9] hover:bg-[#F1F5F2] transition-colors cursor-pointer disabled:opacity-50 shrink-0"
          title={`Refresh weather (updated ${data.lastUpdated})`}
          aria-label="Refresh weather data"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-[#2E7D32]" : ""}`} />
        </button>
      </div>

      {/* ─── Hero Temperature & Condition ───────────────────────────────────── */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-br from-[#F8FAF8] to-[#F1F5F2] border border-[#EEF0EE]">
        <div className="flex items-center gap-3">
          <div className="w-13 h-13 rounded-2xl bg-white shadow-xs border border-[#E5E7EB] flex items-center justify-center">
            <WeatherIcon code={current.weatherCode} isDay={current.isDay} className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-baseline">
              <span className="text-3xl font-black text-[#1F2937] tracking-tight">
                {current.temperature}°
              </span>
              <span className="text-base text-[#6B7280] font-bold ml-0.5">C</span>
            </div>
            <p className="text-xs font-semibold text-[#4B5563]">{current.condition}</p>
          </div>
        </div>

        <div className="text-right space-y-1">
          <span className="text-[10px] font-bold text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-full border border-[#C8E6C9] inline-block">
            Feels {current.apparentTemperature}°C
          </span>
          <p className="text-[10px] text-[#9CA3AF]">
            Updated {data.lastUpdated}
          </p>
        </div>
      </div>

      {/* ─── Agricultural Metrics Grid ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-0.5">
        <div className="p-2.5 rounded-xl bg-white border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center gap-1.5 text-[#6B7280] mb-1">
            <Droplets className="w-3.5 h-3.5 text-[#0284C7]" />
            <span className="text-[10px] font-medium">Humidity</span>
          </div>
          <p className="text-xs font-black text-[#1F2937]">{current.relativeHumidity}%</p>
        </div>

        <div className="p-2.5 rounded-xl bg-white border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center gap-1.5 text-[#6B7280] mb-1">
            <Umbrella className="w-3.5 h-3.5 text-[#2563EB]" />
            <span className="text-[10px] font-medium">Rain Prob.</span>
          </div>
          <p className="text-xs font-black text-[#1F2937]">
            {hourly[0]?.precipitationProbability ?? 0}%
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-white border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center gap-1.5 text-[#6B7280] mb-1">
            <Wind className="w-3.5 h-3.5 text-[#059669]" />
            <span className="text-[10px] font-medium">Wind</span>
          </div>
          <p className="text-xs font-black text-[#1F2937]">{current.windSpeed} km/h</p>
        </div>

        <div className="p-2.5 rounded-xl bg-white border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center gap-1.5 text-[#6B7280] mb-1">
            <Eye className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span className="text-[10px] font-medium">Cloud Cover</span>
          </div>
          <p className="text-xs font-black text-[#1F2937]">{current.cloudCover}%</p>
        </div>
      </div>

      {/* ─── Smart Farm Alert Banner ────────────────────────────────────────── */}
      <div
        className={`p-3 rounded-xl border flex items-start gap-2.5 transition-colors ${
          advisory.level === "warning"
            ? "bg-[#FEF2F2] border-[#FCA5A5] text-[#991B1B]"
            : advisory.level === "info"
            ? "bg-[#FEF3C7] border-[#FCD34D] text-[#92400E]"
            : "bg-[#E8F5E9] border-[#A5D6A7] text-[#1B5E20]"
        }`}
      >
        {advisory.level === "warning" ? (
          <AlertTriangle className="w-3.5 h-3.5 text-[#DC2626] shrink-0 mt-0.5" />
        ) : advisory.level === "info" ? (
          <CloudRain className="w-3.5 h-3.5 text-[#D97706] shrink-0 mt-0.5" />
        ) : (
          <Sprout className="w-3.5 h-3.5 text-[#2E7D32] shrink-0 mt-0.5" />
        )}
        <div className="text-[11px] leading-snug">
          <span className="font-bold mr-1">Farm Advisory:</span>
          <span className="opacity-95">{advisory.message}</span>
        </div>
      </div>

      {/* ─── Forecast Tabs (24h vs 7-Day) ────────────────────────────────────── */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between border-b border-[#EEF0EE] pb-2">
          <span className="text-[11px] font-bold text-[#1F2937]">Agricultural Forecast</span>
          <div className="flex items-center gap-1 bg-[#F1F5F2] p-0.5 rounded-lg text-[10px] font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab("hourly")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                activeTab === "hourly"
                  ? "bg-white text-[#2E7D32] shadow-xs font-bold"
                  : "text-[#6B7280] hover:text-[#1F2937]"
              }`}
            >
              <Clock className="w-3 h-3" />
              <span>24 Hours</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("daily")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                activeTab === "daily"
                  ? "bg-white text-[#2E7D32] shadow-xs font-bold"
                  : "text-[#6B7280] hover:text-[#1F2937]"
              }`}
            >
              <Calendar className="w-3 h-3" />
              <span>7 Days</span>
            </button>
          </div>
        </div>

        {/* Hourly Forecast Carousel */}
        {activeTab === "hourly" && (
          <div className="flex gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar scroll-smooth">
            {hourly.slice(0, 12).map((item, idx) => (
              <div
                key={item.time}
                className={`flex flex-col items-center justify-between p-2 rounded-xl min-w-[58px] text-center border shrink-0 transition-all ${
                  idx === 0
                    ? "bg-[#E8F5E9]/70 border-[#C8E6C9]"
                    : "bg-[#F8FAF8] border-[#E5E7EB]/80 hover:bg-[#F1F5F2]"
                }`}
              >
                <span className="text-[10px] font-semibold text-[#6B7280]">{item.displayTime}</span>
                <div className="my-1">
                  <WeatherIcon code={item.weatherCode} className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-[#1F2937]">{item.temperature}°</span>
                <span className="text-[9px] text-[#2563EB] font-bold mt-0.5">
                  {item.precipitationProbability}%
                </span>
              </div>
            ))}
          </div>
        )}

        {/* 7-Day Forecast Rows */}
        {activeTab === "daily" && (
          <div className="space-y-1.5 pt-1">
            {daily.map((day, idx) => (
              <div
                key={day.date}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs border ${
                  idx === 0
                    ? "bg-[#E8F5E9]/50 border-[#C8E6C9]"
                    : "bg-white border-[#EEF0EE] hover:bg-[#F8FAF8]"
                }`}
              >
                <div className="w-20 font-bold text-[#1F2937] text-[11px] truncate">
                  {day.dayName}
                </div>

                <div className="flex items-center gap-1.5">
                  <WeatherIcon code={day.weatherCode} className="w-4 h-4" />
                  <span className="text-[10px] text-[#6B7280] hidden sm:inline max-w-[80px] truncate">
                    {day.condition}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-right">
                  <span className="text-[10px] text-[#2563EB] font-semibold w-10 text-right">
                    {day.precipitationProbability}%
                  </span>
                  <div className="flex items-center gap-1 text-[11px]">
                    <span className="font-black text-[#1F2937]">{day.maxTemp}°</span>
                    <span className="text-[#9CA3AF] text-[10px]">/</span>
                    <span className="text-[#6B7280] font-medium">{day.minTemp}°</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
