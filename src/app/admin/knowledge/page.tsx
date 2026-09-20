"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Database,
  Download,
  FileCode2,
  FileText,
  Layers,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  UploadCloud,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

export default function AdminKnowledgePage() {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<"ALL" | "RESEARCH" | "GOV" | "BULLETIN" | "FAQ">("ALL");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const sources = [
    { id: "KB-01", title: "NARC Nepal Agricultural Research Council: Cereal Diseases 2025", type: "RESEARCH", chunks: 342, dimension: "1536 dim", status: "INDEXED", updated: "3 days ago" },
    { id: "KB-02", title: "National Seed Board: Certified Seed & Yield Optimization Guidelines", type: "GOV", chunks: 180, dimension: "1536 dim", status: "INDEXED", updated: "1 week ago" },
    { id: "KB-03", title: "Terai & Mid-Hills Soil Nutrient Management & Fertilizer Standards", type: "RESEARCH", chunks: 512, dimension: "1536 dim", status: "INDEXED", updated: "2 weeks ago" },
    { id: "KB-04", title: "Department of Agriculture Seasonal Advisory Bulletin: Monsoonal Prep", type: "BULLETIN", chunks: 94, dimension: "1536 dim", status: "INDEXED", updated: "1 month ago" },
    { id: "KB-05", title: "Integrated Pest Management (IPM) Tomato & Vegetable Guidelines", type: "RESEARCH", chunks: 420, dimension: "1536 dim", status: "INDEXED", updated: "1 month ago" },
    { id: "KB-06", title: "Common Crop Pathologies: Symptoms & Chemical Antidote Compendium", type: "FAQ", chunks: 640, dimension: "1536 dim", status: "SYNCING", updated: "Just now" },
  ];

  const filtered = sources.filter((s) => {
    const matchesType = selectedType === "ALL" || s.type === selectedType;
    const matchesSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="RAG Vector Chunks & Sources"
        subtitle="Manage scientific source grounding, vector database embeddings, and real-time knowledge retrieval for the AI Advisor."
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold text-[#4B5563] shadow-xs hover:bg-[#F1F5F2] hover:text-[#2E7D32] transition-colors cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-[#2E7D32]" : ""}`} />
              Re-sync Index
            </button>
            <button className="inline-flex items-center gap-2 rounded-full bg-[#2E7D32] hover:bg-[#256B2A] text-white px-4 py-2 text-xs font-semibold shadow-xs transition-colors cursor-pointer">
              <UploadCloud className="h-3.5 w-3.5" />
              Upload PDF / Document
            </button>
          </div>
        }
      />

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Indexed Documents</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8F5E9] text-[#2E7D32]">
              <FileText className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-3xl font-black text-[#1F2937] tracking-tight">420</p>
          <p className="mt-1 text-xs text-[#2E7D32] font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]" /> Fully parsed &amp; verified
          </p>
        </div>

        <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Total Vector Chunks</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8F5E9] text-[#2E7D32]">
              <Layers className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-3xl font-black text-[#1F2937] tracking-tight">84,200</p>
          <p className="mt-1 text-xs text-[#2E7D32] font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]" /> 512-token chunking
          </p>
        </div>

        <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Vector Database</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#DBEAFE] text-[#2563EB]">
              <Database className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-2xl font-black text-[#1F2937] tracking-tight">pgvector</p>
          <p className="mt-1 text-xs text-[#2563EB] font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" /> HNSW cosine index
          </p>
        </div>

        <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Grounding Accuracy</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8F5E9] text-[#2E7D32]">
              <Sparkles className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-3xl font-black text-[#1F2937] tracking-tight">99.4%</p>
          <p className="mt-1 text-xs text-[#2E7D32] font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]" /> Zero hallucinations
          </p>
        </div>
      </div>

      {/* Toolbar: Search + Rounded Pill Tabs */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between pt-1">
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Search documents or vector collections..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-full border border-[#E5E7EB] bg-white pl-9 pr-4 text-xs text-[#1F2937] placeholder:text-[#9CA3AF] outline-none transition-colors focus:border-[#2E7D32] focus:ring-2 focus:ring-[#E8F5E9] shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: "ALL", label: "All Collections" },
            { id: "RESEARCH", label: "Research Papers" },
            { id: "GOV", label: "Gov Guidelines" },
            { id: "BULLETIN", label: "Bulletins" },
            { id: "FAQ", label: "Agronomic FAQs" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedType(tab.id as typeof selectedType)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                selectedType === tab.id
                  ? "bg-[#2E7D32] text-white shadow-sm"
                  : "bg-white text-[#4B5563] border border-[#E5E7EB] hover:bg-[#F8FAF8] hover:text-[#2E7D32]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Document Knowledge Table Container */}
      <div className="rounded-[24px] border border-[#E5E7EB] bg-white shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE] overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#EEF0EE] bg-[#F8FAF8]/60 px-6 py-4">
          <div>
            <h3 className="text-sm font-bold text-[#1F2937]">Knowledge Sources &amp; Embeddings</h3>
            <p className="text-xs text-[#6B7280] mt-0.5">Showing {filtered.length} indexed scientific publications</p>
          </div>
          <span className="rounded-full bg-white border border-[#E5E7EB] px-3 py-1 text-xs font-semibold text-[#4B5563] shadow-2xs">
            {filtered.length} documents
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#4B5563]">
            <thead className="border-b border-[#E5E7EB] bg-[#F8FAF8] text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
              <tr>
                <th className="px-5 py-3.5">ID</th>
                <th className="px-5 py-3.5">Document Title</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Chunks</th>
                <th className="px-5 py-3.5">Embedding</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF0EE]">
              {filtered.map((s) => (
                <tr key={s.id} className="transition-colors hover:bg-[#F8FAF8]/70">
                  <td className="px-5 py-3.5 font-mono text-[11px] font-bold text-[#6B7280]">{s.id}</td>
                  <td className="px-5 py-3.5 max-w-md">
                    <p className="font-bold text-[#1F2937] leading-snug">{s.title}</p>
                    <p className="text-[11px] text-[#9CA3AF] mt-0.5">Last indexed: {s.updated}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="rounded-full bg-[#F1F5F2] border border-[#E5E7EB] px-2.5 py-0.5 text-[10px] font-bold text-[#4B5563]">
                      {s.type}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-bold text-[#1F2937]">{s.chunks} chunks</td>
                  <td className="px-5 py-3.5 font-mono text-[11px] text-[#6B7280]">{s.dimension}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        s.status === "SYNCING"
                          ? "bg-[#FEF3C7] text-[#F59E0B] border border-[#FCD34D]"
                          : "bg-[#E8F5E9] text-[#2E7D32] border border-[#A5D6A7]"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          s.status === "SYNCING" ? "bg-[#F59E0B] animate-pulse" : "bg-[#2E7D32]"
                        }`}
                      />
                      {s.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button className="rounded-full border border-[#E5E7EB] bg-white px-3 py-1 text-xs font-semibold text-[#2E7D32] hover:bg-[#E8F5E9] transition-colors cursor-pointer shadow-2xs">
                      Inspect Chunks
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
