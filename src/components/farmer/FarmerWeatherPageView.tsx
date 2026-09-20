"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Bot,
  Calendar,
  CheckCircle2,
  Clock,
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Compass,
  Droplets,
  Eye,
  Info,
  MapPin,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Sprout,
  Sun,
  Sunrise,
  Sunset,
  Thermometer,
  Umbrella,
  Wind,
  Check,
  X,
  Gauge,
  Layers,
} from "lucide-react";
import { getWmoCondition, useWeather } from "@/components/weather";
import { WeatherError } from "@/components/weather/WeatherError";
import { WeatherLoading } from "@/components/weather/WeatherLoading";

function WeatherIcon({
  code,
  isDay = true,
  className = "w-6 h-6",
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

function getWindDirectionCardinal(degrees: number): string {
  const directions = [
    "N (North)",
    "NNE (North-North-East)",
    "NE (North-East)",
    "ENE (East-North-East)",
    "E (East)",
    "ESE (East-South-East)",
    "SE (South-East)",
    "SSE (South-South-East)",
    "S (South)",
    "SSW (South-South-West)",
    "SW (South-West)",
    "WSW (West-South-West)",
    "W (West)",
    "WNW (West-North-West)",
    "NW (North-West)",
    "NNW (North-North-West)",
  ];
  const index = Math.round((degrees % 360) / 22.5);
  return directions[index % 16];
}

export function FarmerWeatherPageView() {
  const { data, loading, loadingMsg, refreshing, error, loadWeather } = useWeather();
  const [activeTab, setActiveTab] = useState<"hourly" | "daily" | "operations" | "protection">("hourly");

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="pb-2 border-b border-[#E5E7EB]/80">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#2E7D32]">
            Microclimate Intelligence
          </p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-[#1F2937]">
            Farm Weather Center
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-[#6B7280] font-medium">
            Acquiring your local GPS satellite and weather radar stream...
          </p>
        </div>
        <WeatherLoading statusMessage={loadingMsg} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="pb-2 border-b border-[#E5E7EB]/80">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#2E7D32]">
            Microclimate Intelligence
          </p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-[#1F2937]">
            Farm Weather Center
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-[#6B7280] font-medium">
            Local weather intelligence and field operation advisories.
          </p>
        </div>
        <WeatherError error={error} onRetry={() => loadWeather(true)} isRetrying={refreshing} />
      </div>
    );
  }

  if (!data) return null;

  const { current, advisory, hourly, daily, coordinates, locationName } = data;
  const todayForecast = daily[0];
  const tomorrowForecast = daily[1];

  // ─── Human-friendly Translations & Plain-Language Computations ────────────
  // Thermal comfort explanation
  const getTempComfort = (temp: number) => {
    if (temp < 10) return { label: "Cold", badge: "bg-blue-100 text-blue-800", advice: "Frost alert: Protect tender nursery saplings and cover sensitive beds." };
    if (temp <= 18) return { label: "Cool & Fresh", badge: "bg-emerald-100 text-emerald-800", advice: "Favorable temperatures for cool-season crops (potatoes, brassicas, peas)." };
    if (temp <= 27) return { label: "Mild & Ideal", badge: "bg-emerald-100 text-emerald-800", advice: "Optimal vegetative temperature range. Excellent for plant photosynthesis." };
    if (temp <= 33) return { label: "Warm & Sunny", badge: "bg-amber-100 text-amber-800", advice: "Ensure soil maintains adequate moisture; irrigate during morning or dusk." };
    return { label: "High Heat", badge: "bg-rose-100 text-rose-800", advice: "Heat stress risk: Irrigate deeply to prevent blossom drop and leaf scorching." };
  };

  const tempComfort = getTempComfort(current.temperature);

  // Rain condition explanation
  const rainProb = todayForecast?.precipitationProbability ?? hourly[0]?.precipitationProbability ?? 0;
  const rainSum = todayForecast?.precipitationSum ?? 0;
  const getRainStatus = (prob: number, sum: number, activeRain: number) => {
    if (activeRain > 0.5) return { status: "Active Rain", badge: "bg-blue-600 text-white", text: "Rain is currently falling. Hold spraying and harvesting until foliage dries." };
    if (prob <= 15) return { status: "Dry Skies", badge: "bg-emerald-100 text-emerald-800", text: "Zero to negligible rain chance. Ideal for outdoor sun-drying and foliar sprays." };
    if (prob <= 40) return { status: "Low Chance", badge: "bg-blue-100 text-blue-800", text: "Passing clouds with minimal rain chance. Outdoor field work remains safe." };
    if (prob <= 70) return { status: "Rain Likely", badge: "bg-amber-100 text-amber-800", text: `High chance of rain (~${prob}%). Postpone pesticide spraying to prevent wash-off.` };
    return { status: "Heavy Rain Expected", badge: "bg-rose-100 text-rose-800", text: `Expect rain (${sum} mm anticipated). Keep farm drainage channels clear.` };
  };
  const rainStatus = getRainStatus(rainProb, rainSum, current.precipitation);

  // Wind speed explanation
  const getWindStatus = (speed: number) => {
    if (speed < 12) return { status: "Calm Breeze", badge: "bg-emerald-100 text-emerald-800", text: "Gentle airflow. Ideal conditions for pesticide, herbicide, and fertilizer spraying." };
    if (speed <= 22) return { status: "Moderate Breeze", badge: "bg-blue-100 text-blue-800", text: "Noticeable breeze. Use coarse spray nozzles close to canopy to avoid drift." };
    if (speed <= 32) return { status: "Breezy / Gusty", badge: "bg-amber-100 text-amber-800", text: "Avoid aerial and backpack spraying. Chemical drift will damage neighboring crops." };
    return { status: "Strong Wind Hazard", badge: "bg-rose-100 text-rose-800", text: "High wind warning. Stake tall crops (maize, bananas, tomatoes) and secure structures." };
  };
  const windStatus = getWindStatus(current.windSpeed);

  // Humidity explanation
  const getHumidityStatus = (hum: number) => {
    if (hum < 50) return { status: "Dry Air", badge: "bg-amber-100 text-amber-800", text: "Dry air speeds up soil evaporation. Monitor vegetable beds for thirst." };
    if (hum <= 75) return { status: "Comfortable", badge: "bg-emerald-100 text-emerald-800", text: "Healthy air moisture levels. Good balance for stomatal transpiration." };
    return { status: "High Moisture", badge: "bg-blue-100 text-blue-800", text: "Moist air increases fungal disease risk (late blight, powdery mildew). Inspect leaf undersides." };
  };
  const humidityStatus = getHumidityStatus(current.relativeHumidity);

  // Agronomic feasibility decisions
  const canSpray = current.precipitation === 0 && rainProb < 35 && current.windSpeed < 18;
  const canDryCrops = rainProb < 25 && current.precipitation === 0 && current.relativeHumidity < 80;
  const needIrrigation = current.precipitation === 0 && rainProb < 40 && rainSum < 2;
  const isBlightRisk = current.temperature >= 14 && current.temperature <= 26 && current.relativeHumidity >= 75;
  const isCanopySafe = current.windSpeed < 28 && current.windGusts < 38;

  // Natural language summary paragraph for farmers
  const plainSummary = `In ${locationName}, today is ${current.condition.toLowerCase()} with a pleasant temperature of ${current.temperature}°C (feels like ${current.apparentTemperature}°C). High temperature will reach ${todayForecast?.maxTemp ?? "--"}°C with an overnight low of ${todayForecast?.minTemp ?? "--"}°C. Rain chance is ${rainProb}% with ${windStatus.status.toLowerCase()} (${current.windSpeed} km/h). ${
    canSpray
      ? "Great weather for fertilizer and pesticide spraying."
      : "Hold off on spraying due to wind or rain risk."
  } ${
    canDryCrops
      ? "Good drying window for harvested grains and seeds."
      : "Keep harvested crops covered in case of damp air."
  }`;

  return (
    <div className="space-y-6">
      {/* ─── Page Header ────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#E5E7EB]/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-[#2E7D32]">
              Microclimate Intelligence
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-[10px] font-bold border border-[#C8E6C9] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] animate-pulse" />
              Live Farm Radar
            </span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-[#1F2937]">
            Farm Weather &amp; Operations Center
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-[#6B7280]">
            <span className="font-bold text-[#1F2937] flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#2E7D32]" />
              {locationName}
            </span>
            <span>•</span>
            <span className="font-medium text-[#4B5563]">
              GPS: {coordinates.latitude.toFixed(2)}°N, {coordinates.longitude.toFixed(2)}°E
            </span>
            <span>•</span>
            <span className="text-[#6B7280]">Updated {data.lastUpdated}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => loadWeather(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E5E7EB] hover:bg-[#F8FAF8] hover:border-[#C8E6C9] text-[#1F2937] text-xs font-bold rounded-full shadow-xs transition-all cursor-pointer disabled:opacity-60"
            title="Refresh local weather data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-[#2E7D32]" : "text-[#6B7280]"}`} />
            <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
          </button>

          <Link
            href="/farmer/ai-advisor?q=How does today's weather affect my crops and what tasks should I do?"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#2E7D32] hover:bg-[#256B2A] text-white text-xs font-bold rounded-full shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <Bot className="w-4 h-4" />
            <span>Ask AI Agronomist</span>
          </Link>
        </div>
      </div>

      {/* ─── "At A Glance" Plain-Language Weather Summary Card ──────────────── */}
      <div className="rounded-[24px] border border-[#C8E6C9] bg-gradient-to-br from-[#F1F8F3] via-white to-[#E8F5E9] p-5 sm:p-6 shadow-[0_4px_24px_-2px_#E8F5E9] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#2E7D32] text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-[#1F2937]">
                Today&apos;s Farm Outlook in Plain Words
              </h2>
              <p className="text-[11px] text-[#6B7280]">
                Easy-to-understand guidance based on real-time microclimate conditions
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${tempComfort.badge}`}>
              {tempComfort.label}
            </span>
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${rainStatus.badge}`}>
              {rainStatus.status}
            </span>
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${windStatus.badge}`}>
              {windStatus.status}
            </span>
          </div>
        </div>

        {/* Natural Language Narrative */}
        <p className="text-xs sm:text-sm leading-relaxed text-[#374151] font-medium bg-white/80 backdrop-blur-xs p-3.5 rounded-2xl border border-[#E5E7EB]">
          {plainSummary}
        </p>

        {/* Quick Go / No-Go Farm Decision Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          {/* Spraying Badge */}
          <div className={`p-3 rounded-xl border flex items-center gap-2.5 ${
            canSpray ? "bg-[#E8F5E9] border-[#A5D6A7] text-[#1B5E20]" : "bg-[#FEF2F2] border-[#FCA5A5] text-[#991B1B]"
          }`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
              canSpray ? "bg-[#2E7D32] text-white" : "bg-[#DC2626] text-white"
            }`}>
              {canSpray ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <X className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider opacity-75">Foliar Spraying</p>
              <p className="text-xs font-black truncate">{canSpray ? "Safe to Spray" : "Delay Spray"}</p>
            </div>
          </div>

          {/* Irrigation Badge */}
          <div className={`p-3 rounded-xl border flex items-center gap-2.5 ${
            needIrrigation ? "bg-[#E8F5E9] border-[#A5D6A7] text-[#1B5E20]" : "bg-[#FEF3C7] border-[#FCD34D] text-[#92400E]"
          }`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
              needIrrigation ? "bg-[#2E7D32] text-white" : "bg-[#D97706] text-white"
            }`}>
              <Droplets className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider opacity-75">Irrigation</p>
              <p className="text-xs font-black truncate">{needIrrigation ? "Water as Usual" : "Hold Water"}</p>
            </div>
          </div>

          {/* Harvesting / Sun Drying Badge */}
          <div className={`p-3 rounded-xl border flex items-center gap-2.5 ${
            canDryCrops ? "bg-[#E8F5E9] border-[#A5D6A7] text-[#1B5E20]" : "bg-[#FEF3C7] border-[#FCD34D] text-[#92400E]"
          }`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
              canDryCrops ? "bg-[#2E7D32] text-white" : "bg-[#D97706] text-white"
            }`}>
              <Sun className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider opacity-75">Sun Drying</p>
              <p className="text-xs font-black truncate">{canDryCrops ? "Good Drying" : "Cover Produce"}</p>
            </div>
          </div>

          {/* Fungal & Blight Risk Badge */}
          <div className={`p-3 rounded-xl border flex items-center gap-2.5 ${
            !isBlightRisk ? "bg-[#E8F5E9] border-[#A5D6A7] text-[#1B5E20]" : "bg-[#FEF2F2] border-[#FCA5A5] text-[#991B1B]"
          }`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
              !isBlightRisk ? "bg-[#2E7D32] text-white" : "bg-[#DC2626] text-white"
            }`}>
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider opacity-75">Crop Disease Risk</p>
              <p className="text-xs font-black truncate">{!isBlightRisk ? "Low Disease Risk" : "Elevated Blight"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 4 Core Weather Parameter Cards with Easy Translations ───────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Temperature & Comfort */}
        <div className="rounded-[22px] border border-[#E5E7EB] bg-white p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#6B7280]">Temperature &amp; Comfort</span>
              <div className="w-7 h-7 rounded-lg bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
                <Thermometer className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <p className="text-3xl font-black text-[#1F2937]">{current.temperature}°C</p>
              <span className="text-xs font-bold text-[#6B7280]">
                Feels {current.apparentTemperature}°C
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-bold text-[#1F2937]">{current.condition}</span>
              <span className="text-[#9CA3AF]">•</span>
              <span className="text-xs text-[#DC2626] font-bold">H: {todayForecast?.maxTemp ?? "--"}°</span>
              <span className="text-xs text-[#2563EB] font-bold">L: {todayForecast?.minTemp ?? "--"}°</span>
            </div>
          </div>
          <p className="text-[11px] text-[#6B7280] mt-3 pt-2.5 border-t border-[#F3F4F6] leading-snug">
            {tempComfort.advice}
          </p>
        </div>

        {/* Card 2: Rain Risk & Moisture */}
        <div className="rounded-[22px] border border-[#E5E7EB] bg-white p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#6B7280]">Rain Chance &amp; Moisture</span>
              <div className="w-7 h-7 rounded-lg bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center">
                <Umbrella className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <p className="text-3xl font-black text-[#1F2937]">{rainProb}%</p>
              <span className="text-xs font-bold text-[#6B7280]">
                {rainSum > 0 ? `${rainSum} mm volume` : "0.0 mm (No rain)"}
              </span>
            </div>
            <p className="text-xs font-bold text-[#2563EB] mt-1">{rainStatus.status}</p>
          </div>
          <p className="text-[11px] text-[#6B7280] mt-3 pt-2.5 border-t border-[#F3F4F6] leading-snug">
            {rainStatus.text}
          </p>
        </div>

        {/* Card 3: Wind & Spray Hazard */}
        <div className="rounded-[22px] border border-[#E5E7EB] bg-white p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#6B7280]">Wind &amp; Spray Safety</span>
              <div className="w-7 h-7 rounded-lg bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center">
                <Wind className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <p className="text-3xl font-black text-[#1F2937]">{current.windSpeed} km/h</p>
              <span className="text-xs font-bold text-[#2E7D32]">
                Gusts {current.windGusts} km/h
              </span>
            </div>
            <p className="text-xs font-semibold text-[#4B5563] mt-1">
              Heading {getWindDirectionCardinal(current.windDirection)}
            </p>
          </div>
          <p className="text-[11px] text-[#6B7280] mt-3 pt-2.5 border-t border-[#F3F4F6] leading-snug">
            {windStatus.text}
          </p>
        </div>

        {/* Card 4: Air Humidity & Plant Health */}
        <div className="rounded-[22px] border border-[#E5E7EB] bg-white p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#6B7280]">Air Humidity &amp; Mold</span>
              <div className="w-7 h-7 rounded-lg bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center">
                <Droplets className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <p className="text-3xl font-black text-[#1F2937]">{current.relativeHumidity}%</p>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${humidityStatus.badge}`}>
                {humidityStatus.status}
              </span>
            </div>
            <p className="text-xs font-semibold text-[#4B5563] mt-1">
              Cloud cover: {current.cloudCover}%
            </p>
          </div>
          <p className="text-[11px] text-[#6B7280] mt-3 pt-2.5 border-t border-[#F3F4F6] leading-snug">
            {humidityStatus.text}
          </p>
        </div>
      </div>

      {/* ─── Main Content Tabs Section ───────────────────────────────────────── */}
      <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE] space-y-5">
        {/* Navigation Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EEF0EE] pb-3">
          <div>
            <h3 className="text-base sm:text-lg font-black text-[#1F2937]">
              {activeTab === "hourly" && "24-Hour Microclimate Progression"}
              {activeTab === "daily" && "7-Day Extended Agricultural Forecast"}
              {activeTab === "operations" && "Field Operations Feasibility Matrix"}
              {activeTab === "protection" && "Crop Pathology & Hazard Protection"}
            </h3>
            <p className="text-xs text-[#6B7280]">
              {activeTab === "hourly" && "Check temperature changes and rain probability hour-by-hour"}
              {activeTab === "daily" && "Plan upcoming planting, weeding, and harvesting windows"}
              {activeTab === "operations" && "Actionable guidance for daily spraying, watering, and soil tilling"}
              {activeTab === "protection" && "Protect crops against fungal blight, heat stress, and wind lodging"}
            </p>
          </div>

          <div className="flex items-center gap-1 bg-[#F1F5F2] p-1 rounded-xl text-xs font-semibold overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab("hourly")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 ${
                activeTab === "hourly"
                  ? "bg-white text-[#2E7D32] shadow-xs font-bold"
                  : "text-[#6B7280] hover:text-[#1F2937]"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Hourly (24h)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("daily")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 ${
                activeTab === "daily"
                  ? "bg-white text-[#2E7D32] shadow-xs font-bold"
                  : "text-[#6B7280] hover:text-[#1F2937]"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>7-Day Outlook</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("operations")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 ${
                activeTab === "operations"
                  ? "bg-white text-[#2E7D32] shadow-xs font-bold"
                  : "text-[#6B7280] hover:text-[#1F2937]"
              }`}
            >
              <Sprout className="w-3.5 h-3.5" />
              <span>Farm Tasks</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("protection")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 ${
                activeTab === "protection"
                  ? "bg-white text-[#2E7D32] shadow-xs font-bold"
                  : "text-[#6B7280] hover:text-[#1F2937]"
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Crop Safety</span>
            </button>
          </div>
        </div>

        {/* ─── TAB 1: Hourly Forecast (24 Hours) ────────────────────────────── */}
        {activeTab === "hourly" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {hourly.slice(0, 16).map((hour, idx) => {
                const isDry = hour.precipitationProbability <= 15;
                const isLowRain = hour.precipitationProbability > 15 && hour.precipitationProbability <= 45;
                const isHighRain = hour.precipitationProbability > 45;

                return (
                  <div
                    key={hour.time}
                    className={`flex flex-col items-center justify-between p-3.5 rounded-2xl border text-center transition-all ${
                      idx === 0
                        ? "bg-[#E8F5E9]/60 border-[#2E7D32] shadow-xs ring-1 ring-[#2E7D32]/30"
                        : "bg-white border-[#E5E7EB] hover:bg-[#F8FAF8] hover:border-[#C8E6C9]"
                    }`}
                  >
                    <span className="text-xs font-bold text-[#1F2937]">
                      {idx === 0 ? "Now" : hour.displayTime}
                    </span>

                    <div className="my-2.5">
                      <WeatherIcon code={hour.weatherCode} className="w-7 h-7" />
                    </div>

                    <span className="text-base font-black text-[#1F2937]">{hour.temperature}°C</span>

                    {/* Rain probability with colored indicator */}
                    <div className={`mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                      isDry ? "bg-[#F3F4F6] text-[#6B7280]" : isLowRain ? "bg-blue-50 text-blue-700" : "bg-blue-600 text-white"
                    }`}>
                      <Umbrella className="w-2.5 h-2.5" />
                      <span>{hour.precipitationProbability}%</span>
                    </div>

                    <span className="text-[10px] text-[#6B7280] font-medium mt-1.5">
                      {hour.windSpeed} km/h
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="p-3 bg-[#F8FAF8] rounded-xl border border-[#EEF0EE] flex flex-wrap items-center justify-between gap-2 text-xs text-[#6B7280]">
              <div className="flex items-center gap-3">
                <span className="font-bold text-[#1F2937]">Rain Probability Guide:</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#E5E7EB]" /> 0-15% (Dry)</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-300" /> 16-45% (Possible Drizzle)</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> 45%+ (Rain Expected)</span>
              </div>
              <span className="text-[11px] font-medium">Scroll to explore upcoming 16 hours</span>
            </div>
          </div>
        )}

        {/* ─── TAB 2: 7-Day Extended Forecast ───────────────────────────────── */}
        {activeTab === "daily" && (
          <div className="space-y-2.5">
            {daily.map((day, idx) => {
              const isToday = idx === 0;
              const isTomorrow = idx === 1;

              // Friendly farm recommendation tag for each day
              const getDayTip = (prob: number, maxT: number) => {
                if (prob > 50) return "Rain expected — plan barn & indoor grading tasks";
                if (prob > 25) return "Scattered drizzle possible — keep harvests covered";
                if (maxT > 32) return "Hot & sunny — irrigate in early morning";
                return "Dry & sunny — ideal for spraying and field aeration";
              };

              return (
                <div
                  key={day.date}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border transition-all gap-3 ${
                    isToday
                      ? "bg-[#E8F5E9]/50 border-[#A5D6A7] shadow-xs"
                      : "bg-white border-[#E5E7EB] hover:bg-[#F8FAF8]"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-[150px]">
                    <WeatherIcon code={day.weatherCode} className="w-6 h-6 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-[#1F2937]">
                        {isToday ? "Today" : isTomorrow ? "Tomorrow" : day.dayName}
                        <span className="font-normal text-[#6B7280] ml-1.5 text-[11px]">{day.date}</span>
                      </p>
                      <p className="text-[11px] text-[#4B5563] font-medium">{day.condition}</p>
                    </div>
                  </div>

                  {/* Practical Farm Advice for the Day */}
                  <div className="flex-1 max-w-md hidden md:block">
                    <span className="text-[11px] font-medium text-[#4B5563] bg-[#F8FAF8] px-3 py-1 rounded-full border border-[#E5E7EB] inline-block">
                      💡 {getDayTip(day.precipitationProbability, day.maxTemp)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-5 shrink-0">
                    {/* Rain probability & volume */}
                    <div className="text-right">
                      <span className={`text-xs font-bold flex items-center justify-end gap-1 ${
                        day.precipitationProbability > 40 ? "text-[#2563EB]" : "text-[#6B7280]"
                      }`}>
                        <Umbrella className="w-3 h-3" />
                        {day.precipitationProbability}%
                      </span>
                      <span className="text-[10px] text-[#9CA3AF] block">
                        {day.precipitationSum > 0 ? `${day.precipitationSum} mm` : "Dry"}
                      </span>
                    </div>

                    {/* Temperature High / Low Bar */}
                    <div className="text-right min-w-[90px]">
                      <div className="flex items-center justify-end gap-1 text-sm font-black text-[#1F2937]">
                        <span className="text-[#DC2626]">{day.maxTemp}°</span>
                        <span className="text-[#9CA3AF] text-xs font-normal">/</span>
                        <span className="text-[#2563EB]">{day.minTemp}°C</span>
                      </div>
                      <span className="text-[10px] text-[#9CA3AF] block font-medium">Max / Min</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ─── TAB 3: Field Operations Feasibility Matrix ───────────────────── */}
        {activeTab === "operations" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Task 1: Foliar Spraying */}
            <div className="p-4 rounded-2xl border border-[#EEF0EE] bg-[#F8FAF8] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    canSpray ? "bg-[#E8F5E9] text-[#2E7D32]" : "bg-[#FEF2F2] text-[#DC2626]"
                  }`}>
                    {canSpray ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1F2937]">Pesticide &amp; Fertilizer Spraying</h4>
                    <p className="text-[10px] text-[#6B7280]">Backpack &amp; tractor boom sprayers</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                  canSpray ? "bg-[#E8F5E9] text-[#2E7D32]" : "bg-[#FEE2E2] text-[#DC2626]"
                }`}>
                  {canSpray ? "Optimal Window" : "Delay Spraying"}
                </span>
              </div>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                {canSpray
                  ? "Wind speed is calm and rain probability is low. Sprays will adhere securely to plant foliage without wind drift or chemical wash-off."
                  : "Postpone spraying. Active wind (>18 km/h) or anticipated rain will wash off expensive chemicals and blow droplets onto non-target plants."}
              </p>
              <div className="text-[11px] text-[#6B7280] bg-white p-2.5 rounded-xl border border-[#E5E7EB]">
                <strong>Rule of Thumb:</strong> Spray early between 6:00 AM – 9:00 AM when wind is minimal and leaves have dried from morning dew.
              </div>
            </div>

            {/* Task 2: Irrigation */}
            <div className="p-4 rounded-2xl border border-[#EEF0EE] bg-[#F8FAF8] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    needIrrigation ? "bg-[#E8F5E9] text-[#2E7D32]" : "bg-[#FEF3C7] text-[#D97706]"
                  }`}>
                    <Droplets className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1F2937]">Field Irrigation &amp; Drip Watering</h4>
                    <p className="text-[10px] text-[#6B7280]">Soil moisture balance</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                  needIrrigation ? "bg-[#E8F5E9] text-[#2E7D32]" : "bg-[#FEF3C7] text-[#D97706]"
                }`}>
                  {needIrrigation ? "Irrigate as Usual" : "Hold Irrigation"}
                </span>
              </div>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                {needIrrigation
                  ? "No significant rainfall in the forecast. Maintain your regular drip or furrow irrigation schedule to protect root development."
                  : "Rainfall is expected soon. Withhold supplemental water to avoid waterlogging root zones and save valuable irrigation energy."}
              </p>
              <div className="text-[11px] text-[#6B7280] bg-white p-2.5 rounded-xl border border-[#E5E7EB]">
                <strong>Rule of Thumb:</strong> Water in early morning or evening. Midday watering loses up to 35% of volume to air evaporation.
              </div>
            </div>

            {/* Task 3: Harvesting */}
            <div className="p-4 rounded-2xl border border-[#EEF0EE] bg-[#F8FAF8] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    canDryCrops ? "bg-[#E8F5E9] text-[#2E7D32]" : "bg-[#FEF3C7] text-[#D97706]"
                  }`}>
                    <Sun className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1F2937]">Harvesting &amp; Post-Harvest Drying</h4>
                    <p className="text-[10px] text-[#6B7280]">Produce moisture reduction</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                  canDryCrops ? "bg-[#E8F5E9] text-[#2E7D32]" : "bg-[#FEF3C7] text-[#D97706]"
                }`}>
                  {canDryCrops ? "Safe to Dry" : "Caution (Damp)"}
                </span>
              </div>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                {canDryCrops
                  ? "Atmosphere has low moisture risk. Ideal conditions for harvesting mature vegetables, cutting hay, and sun-drying maize or paddy."
                  : "Air humidity or rain chance is elevated. Store drying grains under tarpaulin cover to prevent fungal mold and grain spoilage."}
              </p>
              <div className="text-[11px] text-[#6B7280] bg-white p-2.5 rounded-xl border border-[#E5E7EB]">
                <strong>Rule of Thumb:</strong> Grain moisture must be under 14% before long-term storage in silos or airtight hermetic bags.
              </div>
            </div>

            {/* Task 4: Tillage & Soil Prep */}
            <div className="p-4 rounded-2xl border border-[#EEF0EE] bg-[#F8FAF8] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1F2937]">Land Preparation &amp; Tilling</h4>
                    <p className="text-[10px] text-[#6B7280]">Seedbed and plow layer</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32]">
                  Workable
                </span>
              </div>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                Soil moisture balance is currently manageable. Great time for deep plowing, incorporating organic compost, and raising nursery beds.
              </p>
              <div className="text-[11px] text-[#6B7280] bg-white p-2.5 rounded-xl border border-[#E5E7EB]">
                <strong>Rule of Thumb:</strong> Never till saturated or waterlogged clay soil — it creates hard clods that damage root growth for months.
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 4: Crop Safety & Pathology Protection ─────────────────────── */}
        {activeTab === "protection" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Protection Meter 1: Blight */}
              <div className="p-4 rounded-2xl border border-[#EEF0EE] bg-[#F8FAF8] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1F2937]">Late Blight / Fungal Mold</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isBlightRisk ? "bg-[#FEF2F2] text-[#DC2626]" : "bg-[#E8F5E9] text-[#2E7D32]"
                  }`}>
                    {isBlightRisk ? "High Risk" : "Low Risk"}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#E5E7EB] overflow-hidden">
                  <div className={`h-full rounded-full ${isBlightRisk ? "w-4/5 bg-[#DC2626]" : "w-1/4 bg-[#2E7D32]"}`} />
                </div>
                <p className="text-[11px] text-[#4B5563] leading-snug">
                  {isBlightRisk
                    ? "Temperatures between 14-25°C with humidity >75% create the danger zone for potato and tomato blight. Inspect leaf undersides daily for dark lesions."
                    : "Moderate humidity levels prevent fungal spores from germinating easily on dry leaf surfaces."}
                </p>
              </div>

              {/* Protection Meter 2: Thermal Stress */}
              <div className="p-4 rounded-2xl border border-[#EEF0EE] bg-[#F8FAF8] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1F2937]">Heat Stress on Blossoms</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    current.temperature > 32 ? "bg-[#FEF3C7] text-[#D97706]" : "bg-[#E8F5E9] text-[#2E7D32]"
                  }`}>
                    {current.temperature > 32 ? "Heat Stress" : "Optimal"}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#E5E7EB] overflow-hidden">
                  <div className={`h-full rounded-full ${current.temperature > 32 ? "w-3/4 bg-[#D97706]" : "w-1/3 bg-[#2E7D32]"}`} />
                </div>
                <p className="text-[11px] text-[#4B5563] leading-snug">
                  {current.temperature > 32
                    ? "High heat accelerates pollen sterility in tomatoes and peppers. Apply shade nets and ensure mulch keeps the root zone cool."
                    : "Current temperature is in the comfortable growth bracket for most warm- and cool-season vegetables."}
                </p>
              </div>

              {/* Protection Meter 3: Canopy Wind Lodging */}
              <div className="p-4 rounded-2xl border border-[#EEF0EE] bg-[#F8FAF8] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1F2937]">Wind Lodging &amp; Stem Snap</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    !isCanopySafe ? "bg-[#FEF2F2] text-[#DC2626]" : "bg-[#E8F5E9] text-[#2E7D32]"
                  }`}>
                    {!isCanopySafe ? "High Wind Hazard" : "Safe Canopy"}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#E5E7EB] overflow-hidden">
                  <div className={`h-full rounded-full ${!isCanopySafe ? "w-4/5 bg-[#DC2626]" : "w-1/5 bg-[#2E7D32]"}`} />
                </div>
                <p className="text-[11px] text-[#4B5563] leading-snug">
                  {!isCanopySafe
                    ? `Gusts reaching ${current.windGusts} km/h can lodge tall cereal grains and snap heavy tomato vines. Stake trellised plants immediately.`
                    : "Gentle wind velocities protect crop canopies from physical damage and flower shedding."}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#F1F8F3] to-[#E8F5E9] border border-[#C8E6C9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold text-[#1F2937]">Need an AI crop disease diagnosis?</h4>
                <p className="text-[11px] text-[#4B5563]">Upload a photo of discolored leaves or wilting stems for immediate treatment steps.</p>
              </div>
              <Link
                href="/farmer/analysis"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2E7D32] hover:bg-[#256B2A] text-white text-xs font-bold rounded-full transition-colors shrink-0"
              >
                <span>Run Crop Disease Scan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* ─── Bottom Support Links ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/farmer/crops"
          className="p-4 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#C8E6C9] hover:bg-[#F8FAF8] transition-all flex items-center justify-between group shadow-xs cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#1F2937]">Your Registered Crops</p>
              <p className="text-[11px] text-[#6B7280]">Check weather thresholds tailored to your specific farm plots</p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#2E7D32] transition-colors" />
        </Link>

        <Link
          href="/farmer/consultations"
          className="p-4 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#C8E6C9] hover:bg-[#F8FAF8] transition-all flex items-center justify-between group shadow-xs cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#1F2937]">Consult an Agriculture Expert</p>
              <p className="text-[11px] text-[#6B7280]">Ask a verified agronomist for customized weather advice</p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#2563EB] transition-colors" />
        </Link>
      </div>
    </div>
  );
}
