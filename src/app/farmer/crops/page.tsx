"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Sprout,
  ShieldCheck,
  Calendar,
  Sparkles,
  MapPin,
  ArrowRight,
  RefreshCw,
  Clock,
  Layers,
} from "lucide-react";
import { farmCropService } from "@/services/farm/farmCropService";
import type { FarmCropResponse, GrowthStage } from "@/types/farmCrop";

const STAGE_LABELS: Record<GrowthStage, { label: string; emoji: string; color: string }> = {
  SEED: { label: "Seed", emoji: "🌱", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  GERMINATION: { label: "Germination", emoji: "🌿", color: "bg-green-50 text-green-700 border-green-200" },
  SEEDLING: { label: "Seedling", emoji: "🪴", color: "bg-lime-50 text-lime-700 border-lime-200" },
  VEGETATIVE: { label: "Vegetative", emoji: "🍃", color: "bg-teal-50 text-teal-700 border-teal-200" },
  FLOWERING: { label: "Flowering", emoji: "🌸", color: "bg-pink-50 text-pink-700 border-pink-200" },
  FRUITING: { label: "Fruiting", emoji: "🍅", color: "bg-orange-50 text-orange-700 border-orange-200" },
  RIPENING: { label: "Ripening", emoji: "🌾", color: "bg-amber-50 text-amber-700 border-amber-200" },
  HARVESTED: { label: "Harvested", emoji: "✅", color: "bg-slate-100 text-slate-700 border-slate-200" },
};

export default function FarmerCropsPage() {
  const [crops, setCrops] = useState<FarmCropResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStage, setSelectedStage] = useState<string>("ALL");

  const loadCrops = async () => {
    setIsLoading(true);
    try {
      const data = await farmCropService.getAllMyFarmCrops();
      setCrops(data || []);
    } catch {
      setCrops([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCrops();
  }, []);

  const filteredCrops = useMemo(() => {
    return crops.filter((crop) => {
      const cropName = crop.crop?.name?.toLowerCase() || "";
      const farmName = crop.farmName?.toLowerCase() || "";
      const label = crop.label?.toLowerCase() || "";
      const matchesSearch =
        cropName.includes(searchQuery.toLowerCase()) ||
        farmName.includes(searchQuery.toLowerCase()) ||
        label.includes(searchQuery.toLowerCase());
      const matchesStage = selectedStage === "ALL" || crop.growthStage === selectedStage;
      return matchesSearch && matchesStage;
    });
  }, [crops, searchQuery, selectedStage]);

  // Quick stats
  const totalCrops = crops.length;
  const activeCrops = crops.filter((c) => c.growthStage !== "HARVESTED").length;
  const harvestedCrops = crops.filter((c) => c.growthStage === "HARVESTED").length;

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#E5E7EB]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-[#E8F5E9] text-[#2E7D32]">
              <Sprout className="w-4 h-4" />
            </span>
            <h1 className="text-lg sm:text-xl font-bold text-[#1F2937] tracking-tight">
              Active Crops &amp; Plantings
            </h1>
          </div>
          <p className="text-[11px] sm:text-xs text-[#6B7280] mt-0.5">
            Monitor growth cycles, manage smart tasks, and get AI care schedules across your farms.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadCrops}
            disabled={isLoading}
            className="p-2 border border-[#E5E7EB] hover:bg-[#F3F4F6] text-[#4B5563] rounded-lg transition-colors cursor-pointer"
            title="Refresh crops"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          </button>
          <Link
            href="/farmer/farms"
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-[#2E7D32] hover:bg-[#256B2A] text-white text-xs font-bold rounded-lg shadow-xs transition-all active:scale-95 cursor-pointer min-h-[36px]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Plant Crop in Farm</span>
          </Link>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Total Planted</span>
            <div className="w-6 h-6 rounded-lg bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center">
              <Sprout className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl font-bold text-[#1F2937] mt-1">{totalCrops}</p>
          <p className="text-[10px] text-[#9CA3AF] mt-0.5 font-medium">Across all your farms</p>
        </div>

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Active Growth</span>
            <div className="w-6 h-6 rounded-lg bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl font-bold text-[#2E7D32] mt-1">{activeCrops}</p>
          <p className="text-[10px] text-[#2E7D32] font-medium mt-0.5">Growing &amp; maturing</p>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-white rounded-xl border border-[#E5E7EB] p-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Harvested</span>
            <div className="w-6 h-6 rounded-lg bg-[#F3F4F6] text-[#6B7280] flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl font-bold text-[#4B5563] mt-1">{harvestedCrops}</p>
          <p className="text-[10px] text-[#9CA3AF] font-medium mt-0.5">Cycles completed</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#E5E7EB]/80 shadow-2xs">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search crop, farm name, or plot label..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs sm:text-sm pl-9 pr-3.5 py-2 rounded-xl bg-[#F8FAF8] border border-[#E5E7EB] focus:bg-white focus:border-[#2E7D32] focus:outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedStage("ALL")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              selectedStage === "ALL"
                ? "bg-[#2E7D32] text-white shadow-2xs"
                : "bg-[#F8FAF8] border border-[#E5E7EB] text-[#4B5563] hover:bg-white"
            }`}
          >
            All Stages
          </button>
          {Object.entries(STAGE_LABELS).map(([stageKey, info]) => (
            <button
              key={stageKey}
              type="button"
              onClick={() => setSelectedStage(stageKey)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                selectedStage === stageKey
                  ? "bg-[#2E7D32] text-white shadow-2xs"
                  : "bg-[#F8FAF8] border border-[#E5E7EB] text-[#4B5563] hover:bg-white"
              }`}
            >
              <span>{info.emoji}</span>
              <span>{info.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Crops Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-2xl border border-[#E5E7EB] p-5 space-y-3 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-200" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-4 bg-slate-200 rounded w-2/3" />
                  <div className="h-3 bg-slate-100 rounded w-1/3" />
                </div>
              </div>
              <div className="h-10 bg-slate-100 rounded-xl" />
              <div className="h-8 bg-slate-100 rounded-xl" />
            </div>
          ))}
        </div>
      ) : filteredCrops.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#D1D5DB] bg-white p-12 text-center">
          <Sprout className="w-12 h-12 text-[#9CA3AF] mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#1F2937]">No crops found</h3>
          <p className="text-xs text-[#6B7280] mt-1 max-w-sm mx-auto">
            {crops.length === 0
              ? "You haven't planted any crops in your farms yet. Choose a farm to add your first crop and unlock AI-powered recommendations."
              : "No crops match your current search and filter criteria."}
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <Link
              href="/farmer/farms"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2E7D32] hover:bg-[#256B2A] text-white text-xs font-bold rounded-xl transition-all shadow-xs"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Go to My Farms</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCrops.map((c) => {
            const stageInfo = STAGE_LABELS[c.growthStage] || STAGE_LABELS.VEGETATIVE;
            return (
              <div
                key={c.id}
                className="bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#A5D6A7] transition-all p-4.5 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Farm badge & Stage */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#F0FDF4] text-[#166534] border border-[#DCFCE7]">
                      <MapPin className="w-2.5 h-2.5" />
                      <span className="truncate max-w-[130px]">{c.farmName}</span>
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${stageInfo.color}`}
                    >
                      <span>{stageInfo.emoji}</span>
                      <span>{stageInfo.label}</span>
                    </span>
                  </div>

                  {/* Crop Header */}
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#E8F5E9] text-2xl flex items-center justify-center shrink-0 border border-[#C8E6C9]/60">
                      {c.crop?.emoji || "🌱"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-[#1F2937] text-sm truncate">
                        {c.crop?.name}
                      </h3>
                      {c.crop?.nepaliName && (
                        <p className="text-[11px] text-[#6B7280] truncate font-medium">
                          {c.crop.nepaliName}
                        </p>
                      )}
                      {c.label && (
                        <p className="text-[10px] text-[#2E7D32] bg-[#F1F8E9] px-1.5 py-0.2 rounded inline-block mt-0.5 font-medium truncate max-w-full">
                          🏷️ {c.label}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Details grid */}
                  <div className="mt-3.5 grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-[#F8FAF8] border border-[#EEF0EE] text-xs">
                    <div>
                      <span className="text-[10px] text-[#9CA3AF] uppercase font-bold tracking-wider block">
                        Planted Date
                      </span>
                      <span className="text-[11px] font-semibold text-[#374151] flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3 text-[#9CA3AF]" />
                        {c.plantingDate || "Not recorded"}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-[#9CA3AF] uppercase font-bold tracking-wider block">
                        Planted Area
                      </span>
                      <span className="text-[11px] font-semibold text-[#374151] flex items-center gap-1 mt-0.5">
                        <Layers className="w-3 h-3 text-[#9CA3AF]" />
                        {c.areaPlanted ? `${c.areaPlanted} Ropani` : "Whole plot"}
                      </span>
                    </div>
                  </div>

                  {c.notes && (
                    <p className="mt-2 text-[11px] text-[#6B7280] line-clamp-2 italic bg-[#F9FAFB] p-2 rounded-lg border border-[#F3F4F6]">
                      &ldquo;{c.notes}&rdquo;
                    </p>
                  )}
                </div>

                {/* Card Actions */}
                <div className="mt-4 pt-3 border-t border-[#F3F4F6] flex items-center gap-2">
                  <Link
                    href={`/farmer/farms/${c.farmId}?tab=recommendations&cropId=${c.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F0FDF4] hover:bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0] text-xs font-semibold transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>AI Care</span>
                  </Link>

                  <Link
                    href={`/farmer/farms/${c.farmId}?tab=crops`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2E7D32] hover:bg-[#256B2A] text-white text-xs font-semibold transition-colors shadow-2xs"
                  >
                    <span>Manage</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
