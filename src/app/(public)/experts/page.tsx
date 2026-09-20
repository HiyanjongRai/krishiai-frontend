"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Users, Search, Filter, ShieldCheck, CheckCircle2, ArrowRight, Sparkles, Sprout, Award, UserPlus } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ExpertCard } from "@/components/expert/expert-card";
import Link from "next/link";
import { api } from "@/lib/api";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { DashboardSkeleton } from "@/components/ui/page-skeletons";
import { normalizeApiError } from "@/utils/api-response";

type PublicExpert = {
  id?: number;
  expertProfileId?: number;
  profileId?: number;
  fullName?: string;
  name?: string;
  title?: string;
  designation?: string;
  organization?: string;
  profileImage?: string | null;
  photoUrl?: string | null;
  rating?: number;
  specializations?: string[];
  yearsOfExperience?: number;
};

const CATEGORIES = [
  "All Specialists",
  "Agronomists",
  "Plant Pathology",
  "Soil Science",
  "Horticulture",
  "Crop Protection",
];

export default function ExpertsDirectoryPage() {
  const [experts, setExperts] = useState<PublicExpert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Specialists");

  const loadExperts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get<PublicExpert[] | { content?: PublicExpert[] }>("/v1/experts");
      setExperts(Array.isArray(response) ? response : response.content ?? []);
    } catch (requestError) {
      setError(normalizeApiError(requestError, "Unable to load experts.").message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadExperts(), 0);
    return () => window.clearTimeout(timer);
  }, [loadExperts]);

  const filteredExperts = useMemo(() => {
    return experts.filter((exp) => {
      const name = (exp.fullName ?? exp.name ?? "").toLowerCase();
      const role = (exp.designation ?? exp.title ?? "").toLowerCase();
      const org = (exp.organization ?? "").toLowerCase();
      const query = searchQuery.toLowerCase().trim();

      const matchesSearch = !query || name.includes(query) || role.includes(query) || org.includes(query);

      if (!matchesSearch) return false;
      if (selectedCategory === "All Specialists") return true;

      const catLower = selectedCategory.toLowerCase();
      return role.includes(catLower) || (exp.specializations && exp.specializations.some(s => s.toLowerCase().includes(catLower)));
    });
  }, [experts, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAF9]">
      <Navbar />
      
      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-8 w-full">
        {/* ─── Hero Header & Recruitment Banner ─────────────────────────────── */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#1B5E20] via-[#256B2A] to-[#1E6023] rounded-[28px] p-6 sm:p-10 text-white shadow-xl">
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-[#E8F5E9] text-xs font-bold uppercase tracking-wider border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-[#81C784]" />
                <span>Agronomists &amp; Agricultural Scientists</span>
              </div>
              
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                Are you an agricultural specialist?
              </h1>
              
              <p className="text-sm sm:text-base text-white/90 leading-relaxed font-normal">
                Join KrishiAI as a verified advisor. Review field diagnostic cases, provide expert prescriptions, and guide thousands of farmers with trusted science-backed knowledge.
              </p>

              {/* Trust highlights */}
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-white/80 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#81C784]" /> Verified Credentials
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#81C784]" /> Direct Consultation Requests
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#81C784]" /> AI-Assisted Diagnostics
                </span>
              </div>
            </div>

            <div className="shrink-0 self-start lg:self-center">
              <Link
                href="/expert-register"
                className="inline-flex items-center gap-2 px-6 py-4 bg-white text-[#1B5E20] hover:bg-[#F1F8F3] hover:shadow-xl font-black text-sm rounded-2xl transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <span>Apply as KrishiAI Expert</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* ─── Search, Filter & Directory Header ───────────────────────────── */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-[0.16em] text-[#2E7D32]">
                  Certified Directory
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-[11px] font-bold border border-[#C8E6C9]">
                  {experts.length} Verified
                </span>
              </div>
              <h2 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-[#1F2937]">
                Verified Agricultural Experts
              </h2>
              <p className="mt-0.5 text-xs sm:text-sm text-[#6B7280]">
                Certified specialists ready to assist with crop diseases, soil health, and farm planning.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search specialists..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-xs text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] transition-all shadow-xs"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#2E7D32] text-white shadow-xs"
                    : "bg-white text-[#4B5563] border border-[#E5E7EB] hover:bg-[#F8FAF8] hover:border-[#C8E6C9]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ─── Experts Grid ─────────────────────────────────────────────────── */}
        {isLoading ? (
          <DashboardSkeleton cards={3} table={false} />
        ) : error ? (
          <ErrorState title="Unable to load experts" message={error} onRetry={loadExperts} isRetrying={isLoading} />
        ) : filteredExperts.length === 0 && searchQuery ? (
          <EmptyState
            title="No matching specialists found"
            description={`No agricultural specialists matched "${searchQuery}". Try a different name or specialty.`}
            icon={<Search className="h-6 w-6 text-[#9CA3AF]" aria-hidden="true" />}
          />
        ) : filteredExperts.length === 0 ? (
          <EmptyState
            title="No verified experts available yet"
            description="Our verification committee is currently reviewing candidate expert applications."
            icon={<Users className="h-6 w-6 text-[#9CA3AF]" aria-hidden="true" />}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExperts.map((exp, index) => {
              const id = exp.expertProfileId ?? exp.profileId ?? exp.id;
              const key = id != null ? `expert-${id}` : `expert-${index}`;
              const href = id != null ? `/experts/${id}` : "/experts";

              return (
                <Link key={key} href={href} className="block h-full">
                  <ExpertCard
                    name={exp.fullName ?? exp.name ?? "Verified Expert"}
                    role={exp.designation ?? exp.title ?? "Agricultural Specialist"}
                    organization={exp.organization}
                    rating={exp.rating ?? 0}
                    avatarUrl={exp.profileImage ?? exp.photoUrl ?? ""}
                    specialties={exp.specializations}
                    experienceYears={exp.yearsOfExperience}
                    verified={true}
                  />
                </Link>
              );
            })}

            {/* Always-Visible "Join the Panel" Card for Visual Balance */}
            <div className="rounded-[24px] border-2 border-dashed border-[#C8E6C9] bg-gradient-to-br from-white to-[#F1F8F3] p-6 flex flex-col justify-between items-center text-center space-y-4 hover:border-[#2E7D32] transition-colors shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center shadow-xs">
                <UserPlus className="w-7 h-7" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base font-black text-[#1F2937]">
                  Are You an Agricultural Scientist?
                </h3>
                <p className="text-xs text-[#6B7280] leading-relaxed max-w-xs">
                  Expand your reach, review field disease cases, and earn by advising farmers through KrishiAI.
                </p>
              </div>

              <Link
                href="/expert-register"
                className="w-full py-3 px-4 rounded-xl bg-[#2E7D32] hover:bg-[#256B2A] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Join Expert Panel</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
