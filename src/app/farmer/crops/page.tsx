"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CropCard } from "@/components/farmer/crop-card";
import { sampleCrops } from "@/data/crops";
import { Plus, Search, Sprout, Filter, ShieldCheck, AlertTriangle } from "lucide-react";

export default function FarmerCropsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"ALL" | "HEALTHY" | "ATTENTION">("ALL");

  const filteredCrops = sampleCrops.filter((crop) => {
    const matchesSearch =
      crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crop.variety.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedFilter === "ALL" || crop.healthStatus === selectedFilter;
    return matchesSearch && matchesStatus;
  });

  const healthyCount = sampleCrops.filter((c) => c.healthStatus === "HEALTHY").length;
  const attentionCount = sampleCrops.filter((c) => c.healthStatus === "ATTENTION" || c.healthStatus === "HIGH_RISK").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E7EB]/80">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#2E7D32]">
            Farm Inventory
          </p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-[#1F2937]">
            Active Crops
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-[#6B7280] font-medium">
            Monitor growth cycles, cultivation areas, and plant vitality.
          </p>
        </div>

        <Link
          href="/farmer/analysis"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#2E7D32] hover:bg-[#256B2A] text-white text-xs font-bold rounded-full shadow-xs transition-all active:scale-95 cursor-pointer min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span>New Crop Scan</span>
        </Link>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Total Crops</span>
            <div className="w-7 h-7 rounded-lg bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center">
              <Sprout className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#1F2937] mt-1">{sampleCrops.length}</p>
          <p className="text-[10px] text-[#9CA3AF] mt-0.5 font-medium">Cultivated across farms</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Optimal Vitality</span>
            <div className="w-7 h-7 rounded-lg bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#2E7D32] mt-1">{healthyCount}</p>
          <p className="text-[10px] text-[#2E7D32] font-medium mt-0.5">Healthy & disease-free</p>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Requires Attention</span>
            <div className="w-7 h-7 rounded-lg bg-[#FEF3C7] text-[#F59E0B] flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#F59E0B] mt-1">{attentionCount}</p>
          <p className="text-[10px] text-[#F59E0B] font-medium mt-0.5">Alerts pending review</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search crops or varieties..."
            className="w-full pl-9 pr-4 py-2.5 rounded-full border border-[#E5E7EB] bg-white text-xs text-[#1F2937] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/15 transition-all min-h-[44px]"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          {(["ALL", "HEALTHY", "ATTENTION"] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setSelectedFilter(filter)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap min-h-[36px] ${
                selectedFilter === filter
                  ? "bg-[#2E7D32] text-white shadow-xs"
                  : "bg-white border border-[#E5E7EB] text-[#4B5563] hover:bg-[#F8FAF8]"
              }`}
            >
              {filter === "ALL" ? "All Crops" : filter === "HEALTHY" ? "Healthy" : "Needs Review"}
            </button>
          ))}
        </div>
      </div>

      {/* Crops Grid */}
      {filteredCrops.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#D1D5DB] bg-white p-12 text-center">
          <Sprout className="w-10 h-10 text-[#6B7280] mx-auto mb-2" />
          <p className="text-sm font-bold text-[#4B5563]">No matching crops found</p>
          <p className="text-xs text-[#9CA3AF] mt-0.5">Try adjusting your search query or status filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCrops.map((c) => (
            <CropCard
              key={c.id}
              name={c.name}
              variety={c.variety}
              stage={c.growthStage}
              health={c.healthStatus as "HEALTHY" | "ATTENTION" | "HIGH_RISK"}
            />
          ))}
        </div>
      )}
    </div>
  );
}
