"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Filter,
  Plus,
  RefreshCw,
  Search,
  ShieldAlert,
  Sprout,
  Stethoscope,
  Tag,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

export default function AdminDiseasesPage() {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<"ALL" | "FUNGAL" | "BACTERIAL" | "VIRAL" | "PEST">("ALL");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  // TODO: Replace with real API call when /v1/admin/diseases endpoint is available
  const diseases: {
    id: number; name: string; scientific: string;
    crop: string; type: string; severity: string;
    accuracy: string; status: string;
  }[] = [];

  const filtered = diseases.filter((d) => {
    const matchesType = selectedType === "ALL" || d.type === selectedType;
    const matchesSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.crop.toLowerCase().includes(search.toLowerCase()) ||
      d.scientific.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Disease Knowledge Repository"
        subtitle="Catalog agricultural crop pathologies, symptom classification models, and verified agronomic remediation protocols."
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold text-[#4B5563] shadow-xs hover:bg-[#F1F5F2] hover:text-[#2E7D32] transition-colors cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-[#2E7D32]" : ""}`} />
              Refresh
            </button>
            <button className="inline-flex items-center gap-2 rounded-full bg-[#2E7D32] hover:bg-[#256B2A] text-white px-4 py-2 text-xs font-semibold shadow-xs transition-colors cursor-pointer">
              <Plus className="h-3.5 w-3.5" />
              New Pathology Entry
            </button>
          </div>
        }
      />

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Total Pathologies</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8F5E9] text-[#2E7D32]">
              <Stethoscope className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-3xl font-black text-[#1F2937] tracking-tight">{diseases.length}</p>
          <p className="mt-1 text-xs text-[#2E7D32] font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]" /> Fully cataloged
          </p>
        </div>

        <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Remediation Plans</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8F5E9] text-[#2E7D32]">
              <CheckCircle2 className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-3xl font-black text-[#9CA3AF] tracking-tight">&mdash;</p>
          <p className="mt-1 text-xs text-[#9CA3AF] font-medium">Verified treatments</p>
        </div>

        <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">High Severity Alerts</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FEE2E2] text-[#DC2626]">
              <AlertTriangle className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-3xl font-black text-[#9CA3AF] tracking-tight">&mdash;</p>
          <p className="mt-1 text-xs text-[#9CA3AF] font-medium">Require quarantine alert</p>
        </div>

        <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Covered Crops</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#DBEAFE] text-[#2563EB]">
              <Sprout className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-3xl font-black text-[#9CA3AF] tracking-tight">&mdash;</p>
          <p className="mt-1 text-xs text-[#9CA3AF] font-medium">AI vision supported</p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between pt-1">
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Search disease, pathogen, or crop..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-full border border-[#E5E7EB] bg-white pl-9 pr-4 text-xs text-[#1F2937] placeholder:text-[#9CA3AF] outline-none transition-colors focus:border-[#2E7D32] focus:ring-2 focus:ring-[#E8F5E9] shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: "ALL", label: "All Pathogens" },
            { id: "FUNGAL", label: "Fungal" },
            { id: "BACTERIAL", label: "Bacterial" },
            { id: "VIRAL", label: "Viral" },
            { id: "PEST", label: "Pests / Insects" },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id as typeof selectedType)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                selectedType === type.id
                  ? "bg-[#2E7D32] text-white shadow-sm"
                  : "bg-white text-[#4B5563] border border-[#E5E7EB] hover:bg-[#F8FAF8] hover:text-[#2E7D32]"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Disease Repository Table Container */}
      <div className="rounded-[24px] border border-[#E5E7EB] bg-white shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE] overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#EEF0EE] bg-[#F8FAF8]/60 px-6 py-4">
          <div>
            <h3 className="text-sm font-bold text-[#1F2937]">Registered Diseases &amp; Pests</h3>
            <p className="text-xs text-[#6B7280] mt-0.5">Showing {filtered.length} curated pathology profiles</p>
          </div>
          <span className="rounded-full bg-white border border-[#E5E7EB] px-3 py-1 text-xs font-semibold text-[#4B5563] shadow-2xs">
            {filtered.length} entries
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#4B5563]">
            <thead className="border-b border-[#E5E7EB] bg-[#F8FAF8] text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
              <tr>
                <th className="px-5 py-3.5">Disease &amp; Scientific Name</th>
                <th className="px-5 py-3.5">Target Crop</th>
                <th className="px-5 py-3.5">Type</th>
                <th className="px-5 py-3.5">Severity</th>
                <th className="px-5 py-3.5">Model Accuracy</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF0EE]">
              {filtered.map((d) => (
                <tr key={d.id} className="transition-colors hover:bg-[#F8FAF8]/70">
                  <td className="px-5 py-3.5">
                    <p className="font-bold text-[#1F2937]">{d.name}</p>
                    <p className="text-[11px] text-[#6B7280] italic font-medium">{d.scientific}</p>
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-[#1F2937]">{d.crop}</td>
                  <td className="px-5 py-3.5">
                    <span className="rounded-full bg-[#F1F5F2] border border-[#E5E7EB] px-2.5 py-0.5 text-[10px] font-bold text-[#4B5563]">
                      {d.type}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        d.severity === "HIGH"
                          ? "bg-[#FEE2E2] text-[#DC2626] border border-[#FCA5A5]"
                          : d.severity === "MODERATE"
                          ? "bg-[#FEF3C7] text-[#F59E0B] border border-[#FCD34D]"
                          : "bg-[#E8F5E9] text-[#2E7D32] border border-[#A5D6A7]"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          d.severity === "HIGH" ? "bg-[#DC2626]" : d.severity === "MODERATE" ? "bg-[#F59E0B]" : "bg-[#2E7D32]"
                        }`}
                      />
                      {d.severity}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-bold text-[#2E7D32]">{d.accuracy}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button className="rounded-full border border-[#E5E7EB] bg-white px-3 py-1 text-xs font-semibold text-[#2E7D32] hover:bg-[#E8F5E9] transition-colors cursor-pointer shadow-2xs">
                      View Protocol
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <p className="text-sm font-semibold text-[#9CA3AF]">No disease records found</p>
                    <p className="text-xs text-[#9CA3AF] mt-1">Add a new pathology entry to begin building the disease repository.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
