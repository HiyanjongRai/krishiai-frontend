"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Award,
  CheckCircle2,
  GraduationCap,
  Building2,
  Clock,
  Sparkles,
  ShieldCheck,
  Loader2,
  AlertCircle,
  Sprout,
  Filter,
  X,
  Star,
} from "lucide-react";
import { UserAvatar } from "@/components/ui/avatar";
import { CropAvatar } from "@/components/ui/crop-avatar";
import { Modal } from "@/components/ui/modal";
import { ConsultationRequestModal } from "@/components/messaging/ConsultationRequestModal";
import { expertDirectoryService } from "@/services/expert";
import { packageService } from "@/services/packageService";
import type { VerifiedExpert } from "@/types/expert-directory";
import type { ConsultationPackage } from "@/types/payment";

const TOPIC_CHIPS = [
  { id: "all", label: "All Specialists" },
  { id: "vegetables", label: "Vegetables", query: "Vegetable" },
  { id: "cereals", label: "Cereals / Rice", query: "Rice" },
  { id: "pathology", label: "Pest & Disease", query: "Pathology" },
  { id: "soil", label: "Soil Health", query: "Soil" },
  { id: "organic", label: "Organic Farming", query: "Organic" },
  { id: "fruits", label: "Fruits & Orchards", query: "Fruit" },
  { id: "irrigation", label: "Smart Irrigation", query: "Irrigation" },
];

const EXP_OPTIONS = [
  { label: "Any Experience", value: 0 },
  { label: "3+ Years", value: 3 },
  { label: "5+ Years", value: 5 },
  { label: "10+ Years", value: 10 },
];

export default function FarmerFindExpertsPage() {
  const router = useRouter();

  const [experts, setExperts] = useState<VerifiedExpert[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [minExperience, setMinExperience] = useState<number>(0);
  const [onlyVerifiedCrops, setOnlyVerifiedCrops] = useState(false);
  const [detailExpert, setDetailExpert] = useState<VerifiedExpert | null>(null);
  const [expertPackages, setExpertPackages] = useState<ConsultationPackage[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(false);
  const [bookingExpert, setBookingExpert] = useState<VerifiedExpert | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    async function loadExperts() {
      try {
        setLoading(true);
        const data = await expertDirectoryService.getExperts();
        setExperts(data ?? []);
      } catch {
        setExperts([]);
      } finally {
        setLoading(false);
      }
    }
    loadExperts();
  }, []);

  useEffect(() => {
    if (detailExpert?.userId) {
      setLoadingPackages(true);
      packageService
        .listExpertPackages(detailExpert.userId)
        .then((pkgs) => setExpertPackages(pkgs))
        .catch(() => setExpertPackages([]))
        .finally(() => setLoadingPackages(false));
    } else {
      setExpertPackages([]);
    }
  }, [detailExpert]);

  const handleBook = (exp: VerifiedExpert) => {
    const uid = exp.userId || (exp.expertProfileId ? exp.expertProfileId + 1 : 2);
    setBookingExpert({ ...exp, userId: uid });
    setIsBookingOpen(true);
  };

  const filteredExperts = useMemo(() => {
    return experts.filter((exp) => {
      if (selectedTopic !== "all") {
        const chip = TOPIC_CHIPS.find((c) => c.id === selectedTopic);
        if (chip && "query" in chip && chip.query) {
          const q = chip.query.toLowerCase();
          const ok =
            exp.specializations?.some((s) => s.toLowerCase().includes(q)) ||
            exp.verifiedCrops?.some(
              (c) =>
                c.cropName?.toLowerCase().includes(q) ||
                c.categoryName?.toLowerCase().includes(q) ||
                c.expertiseArea?.toLowerCase().includes(q)
            ) ||
            exp.designation?.toLowerCase().includes(q) ||
            exp.bio?.toLowerCase().includes(q);
          if (!ok) return false;
        }
      }
      if (minExperience > 0 && (exp.yearsOfExperience || 0) < minExperience) return false;
      if (onlyVerifiedCrops && (!exp.verifiedCrops || exp.verifiedCrops.length === 0)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const ok =
          exp.fullName?.toLowerCase().includes(q) ||
          exp.designation?.toLowerCase().includes(q) ||
          exp.organization?.toLowerCase().includes(q) ||
          exp.institution?.toLowerCase().includes(q) ||
          exp.bio?.toLowerCase().includes(q) ||
          exp.specializations?.some((s) => s.toLowerCase().includes(q)) ||
          exp.verifiedCrops?.some(
            (c) =>
              c.cropName?.toLowerCase().includes(q) ||
              c.expertiseArea?.toLowerCase().includes(q) ||
              c.categoryName?.toLowerCase().includes(q)
          ) ||
          exp.locations?.some((l) => l.toLowerCase().includes(q));
        if (!ok) return false;
      }
      return true;
    });
  }, [experts, selectedTopic, minExperience, onlyVerifiedCrops, searchQuery]);

  const topRated = useMemo(
    () =>
      [...experts]
        .sort((a, b) => (b.yearsOfExperience || 0) - (a.yearsOfExperience || 0))
        .slice(0, 6),
    [experts]
  );

  const hasActiveFilter = searchQuery || selectedTopic !== "all" || minExperience > 0 || onlyVerifiedCrops;

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedTopic("all");
    setMinExperience(0);
    setOnlyVerifiedCrops(false);
  };

  function ExpertCard({ exp, featured = false }: { exp: VerifiedExpert; featured?: boolean }) {
    return (
      <div
        className={`group rounded-2xl border bg-white p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
          featured ? "border-[#A5D6A7] ring-1 ring-[#C8E6C9]" : "border-[#E5E7EB] hover:border-[#A5D6A7]"
        }`}
      >
        <div>
          <div className="flex items-start gap-3">
            <div className="relative shrink-0">
              <UserAvatar src={exp.profileImage || undefined} name={exp.fullName} size="lg" />
              {exp.professionalVerified && (
                <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#2E7D32] rounded-full text-white flex items-center justify-center ring-2 ring-white" title="Verified">
                  <CheckCircle2 className="w-3 h-3" />
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-sm font-bold text-[#1F2937] truncate">{exp.fullName}</h3>
                {featured && (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200">
                    <Star className="w-2.5 h-2.5" /> Top Rated
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold text-[#2E7D32] truncate">{exp.designation || "Agricultural Consultant"}</p>
              {exp.organization && (
                <p className="text-[11px] text-[#6B7280] truncate flex items-center gap-1 mt-0.5">
                  <Building2 className="w-3 h-3 shrink-0 text-[#9CA3AF]" />
                  {exp.organization}
                </p>
              )}
            </div>
          </div>

          <div className="mt-2.5 flex items-center gap-2 flex-wrap text-[11px]">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#F1F8F1] text-[#2E7D32] font-bold border border-[#C8E6C9]">
              <Award className="w-3 h-3" />
              {exp.yearsOfExperience ? `${exp.yearsOfExperience}+ Yrs` : "Verified"}
            </span>
            {exp.qualification && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-50 text-[#4B5563] font-medium border border-[#E5E7EB] truncate max-w-[160px]" title={exp.qualification}>
                <GraduationCap className="w-3 h-3 shrink-0 text-[#6B7280]" />
                <span className="truncate">{exp.qualification}</span>
              </span>
            )}
          </div>

          <p className="mt-2.5 text-xs text-[#4B5563] leading-relaxed line-clamp-2">
            {exp.bio || "Experienced agricultural specialist offering direct advisory, pest management, and cultivation optimization."}
          </p>

          {exp.verifiedCrops && exp.verifiedCrops.length > 0 && (
            <div className="mt-3 pt-2.5 border-t border-[#EEF0EE]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] mb-1.5">Crop Expertise</p>
              <div className="flex flex-wrap gap-1">
                {exp.verifiedCrops.slice(0, 4).map((c, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-[#E8F5E9] text-[#1B5E20] text-[11px] font-semibold">
                    <CropAvatar name={c.cropName} imageUrl={c.cropImageUrl} emoji={c.cropEmoji} size="xs" />
                    <span>{c.cropName}</span>
                  </span>
                ))}
                {exp.verifiedCrops.length > 4 && (
                  <span className="text-[11px] text-[#6B7280] self-center">+{exp.verifiedCrops.length - 4}</span>
                )}
              </div>
            </div>
          )}

          {exp.specializations && exp.specializations.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {exp.specializations.slice(0, 3).map((spec, sIdx) => (
                <span key={sIdx} className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">#{spec}</span>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-[#EEF0EE] flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDetailExpert(exp)}
            className="flex-1 px-3 py-2 rounded-full border border-[#D1D5DB] text-xs font-bold text-[#374151] hover:bg-[#F8FAF8] transition-colors text-center cursor-pointer"
          >
            View Profile
          </button>
          <button
            type="button"
            onClick={() => handleBook(exp)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <Sprout className="w-3.5 h-3.5" /> Consult Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 sm:space-y-5 pb-12">
      {/* ─── 1. PAGE HEADER (Matches 'My Farm' Standard) ───────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#E5E7EB]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-[#E8F5E9] text-[#2E7D32]">
              <Award className="w-4 h-4" />
            </span>
            <h1 className="text-lg sm:text-xl font-bold text-[#1F2937] tracking-tight">
              Find Agricultural Experts
            </h1>
          </div>
          <p className="text-[11px] sm:text-xs text-[#6B7280] mt-0.5">
            Connect directly with verified agronomists, soil doctors, and crop protection specialists.
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E8F5E9] border border-[#C8E6C9] text-[#2E7D32] text-xs font-semibold shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Credential-Verified Specialists</span>
        </div>
      </div>

      {/* ─── 2. METRIC CARDS ROW ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl bg-white border border-[#E5E7EB]/80 p-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Available Experts</p>
            <div className="w-6 h-6 rounded-lg bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-[#1F2937] mt-1">{experts.length}</p>
          <p className="text-[10px] text-[#9CA3AF] mt-0.5">Certified agronomists</p>
        </div>

        <div className="rounded-xl bg-white border border-[#E5E7EB]/80 p-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Crop Specialties</p>
            <div className="w-6 h-6 rounded-lg bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center">
              <Sprout className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-[#1F2937] mt-1">15+ Crops</p>
          <p className="text-[10px] text-[#9CA3AF] mt-0.5">Vegetables, fruits &amp; cereals</p>
        </div>

        <div className="rounded-xl bg-white border border-[#E5E7EB]/80 p-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Avg Experience</p>
            <div className="w-6 h-6 rounded-lg bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-[#1F2937] mt-1">6.5+ Yrs</p>
          <p className="text-[10px] text-[#9CA3AF] mt-0.5">Field &amp; research experience</p>
        </div>

        <div className="rounded-xl bg-white border border-[#E5E7EB]/80 p-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Response Speed</p>
            <div className="w-6 h-6 rounded-lg bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-[#1F2937] mt-1">&lt; 2 Hours</p>
          <p className="text-[10px] text-[#9CA3AF] mt-0.5">Fast advisory turnaround</p>
        </div>
      </div>

      {/* ─── 3. FILTER AND SEARCH BAR (Matches 'My Farm') ──────────────────────── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#E5E7EB]/80 shadow-2xs">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by specialist name, crop, or discipline..."
            className="w-full text-xs sm:text-sm pl-9 pr-8 py-2 rounded-xl bg-[#F8FAF8] border border-[#E5E7EB] focus:bg-white focus:border-[#2E7D32] focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#1F2937] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <select
            value={minExperience}
            onChange={(e) => setMinExperience(Number(e.target.value))}
            className="text-xs font-semibold px-3 py-2 rounded-xl bg-[#F8FAF8] border border-[#E5E7EB] text-[#4B5563] focus:outline-none focus:border-[#2E7D32] cursor-pointer"
          >
            {EXP_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          <label className="flex items-center gap-1.5 text-xs text-[#4B5563] bg-[#F8FAF8] border border-[#E5E7EB] rounded-xl px-3 py-2 cursor-pointer whitespace-nowrap">
            <input
              type="checkbox"
              checked={onlyVerifiedCrops}
              onChange={(e) => setOnlyVerifiedCrops(e.target.checked)}
              className="rounded border-[#D1D5DB] text-[#2E7D32] focus:ring-[#2E7D32]"
            />
            <span className="font-semibold text-xs">Verified Badges Only</span>
          </label>

          {hasActiveFilter && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs font-bold text-red-600 hover:text-red-700 underline cursor-pointer px-1 whitespace-nowrap"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Topic Chips & Results Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {TOPIC_CHIPS.map((chip) => {
            const isSelected = selectedTopic === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => setSelectedTopic(chip.id)}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? "bg-[#2E7D32] text-white shadow-2xs"
                    : "bg-white border border-[#E5E7EB] text-[#4B5563] hover:bg-[#F8FAF8]"
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        <div className="text-xs text-[#6B7280] font-medium shrink-0">
          {loading ? (
            <span className="flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Loading...</span>
          ) : (
            <span><strong className="text-[#1F2937]">{filteredExperts.length}</strong> specialist{filteredExperts.length !== 1 ? "s" : ""} found</span>
          )}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#2E7D32]" />
          <p className="text-xs font-medium text-[#6B7280]">Loading verified agricultural consultants...</p>
        </div>
      ) : filteredExperts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredExperts.map((exp) => (
            <ExpertCard key={exp.expertProfileId} exp={exp} />
          ))}
        </div>
      ) : (
        <>
          <div className="rounded-2xl border border-dashed border-[#D1D5DB] bg-white p-8 text-center max-w-lg mx-auto">
            <AlertCircle className="w-9 h-9 text-[#9CA3AF] mx-auto mb-3" />
            <h3 className="text-sm font-bold text-[#1F2937]">No specialists match your criteria</h3>
            <p className="text-xs text-[#6B7280] mt-1 mb-4">Try a different keyword, crop name, or topic chip. Showing our top-rated specialists below.</p>
            <button type="button" onClick={resetFilters} className="px-4 py-2 bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold rounded-full transition-colors cursor-pointer">
              Show All Specialists
            </button>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h2 className="text-sm font-bold text-[#1F2937]">Top Rated Specialists</h2>
              <span className="text-[11px] text-[#6B7280]">— Most experienced advisors</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {topRated.map((exp) => (
                <ExpertCard key={exp.expertProfileId} exp={exp} featured />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Detail Modal */}
      {detailExpert && (
        <Modal isOpen={Boolean(detailExpert)} onClose={() => setDetailExpert(null)} title="Specialist Profile & Packages">
          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <UserAvatar src={detailExpert.profileImage || undefined} name={detailExpert.fullName} size="lg" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-[#1F2937]">{detailExpert.fullName}</h3>
                  {detailExpert.professionalVerified && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#E8F5E9] text-[#2E7D32] text-[10px] font-bold">
                      <CheckCircle2 className="w-3 h-3" /> Verified
                    </span>
                  )}
                </div>
                <p className="text-xs font-semibold text-[#2E7D32]">{detailExpert.designation || "Agricultural Consultant"}</p>
                <p className="text-xs text-[#6B7280]">{detailExpert.organization}</p>
                {detailExpert.qualification && (
                  <p className="text-xs text-[#4B5563] mt-0.5">🎓 {detailExpert.qualification}{detailExpert.institution ? ` — ${detailExpert.institution}` : ""}</p>
                )}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B7280] mb-1">About</h4>
              <p className="text-xs text-[#374151] leading-relaxed bg-[#F8FAF8] p-3 rounded-xl border border-[#EEF0EE]">{detailExpert.bio || "No biography provided."}</p>
            </div>
            {detailExpert.verifiedCrops && detailExpert.verifiedCrops.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B7280] mb-2">Verified Crop Expertise</h4>
                <div className="grid grid-cols-2 gap-2">
                  {detailExpert.verifiedCrops.map((c, i) => (
                    <div key={i} className="p-2.5 rounded-xl border border-[#C8E6C9] bg-[#F1F8F1] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <CropAvatar name={c.cropName} imageUrl={c.cropImageUrl} emoji={c.cropEmoji} size="sm" />
                        <div>
                          <p className="font-bold text-[#1B5E20]">{c.cropName}</p>
                          <p className="text-[10px] text-[#4B5563]">{c.expertiseArea || c.categoryName || "Specialist"}</p>
                        </div>
                      </div>
                      {c.yearsOfExperience && (
                        <span className="text-[10px] font-bold text-[#2E7D32] bg-white px-2 py-0.5 rounded-md border border-[#A5D6A7]">{c.yearsOfExperience} yrs</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Advisory Packages</h4>
                <span className="text-[10px] text-[#2E7D32] font-semibold">eSewa Checkout</span>
              </div>
              {loadingPackages ? (
                <div className="p-4 text-center"><Loader2 className="w-5 h-5 animate-spin text-[#2E7D32] mx-auto" /></div>
              ) : expertPackages.length === 0 ? (
                <div className="p-3 bg-slate-50 rounded-xl text-xs text-[#6B7280] border border-slate-200">Standard consultation package available upon booking (Platform commission 5%).</div>
              ) : (
                <div className="space-y-2">
                  {expertPackages.map((pkg) => (
                    <div key={pkg.id} className="p-3 rounded-xl border border-[#E5E7EB] bg-white hover:border-[#2E7D32] transition-colors flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#1F2937]">{pkg.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-green-50 text-[#2E7D32] font-semibold">{pkg.durationHours}h window</span>
                        </div>
                        {pkg.description && <p className="text-[11px] text-[#6B7280] mt-0.5">{pkg.description}</p>}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-[#2E7D32]">Rs. {pkg.price}</p>
                        <p className="text-[10px] text-[#9CA3AF]">NPR</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="pt-3 border-t border-[#EEF0EE] flex items-center justify-end gap-3">
              <button type="button" onClick={() => setDetailExpert(null)} className="px-4 py-2 rounded-full border border-[#D1D5DB] text-xs font-bold text-[#4B5563] hover:bg-[#F8FAF8] cursor-pointer">Close</button>
              <button
                type="button"
                onClick={() => {
                  const target = detailExpert;
                  setDetailExpert(null);
                  handleBook(target);
                }}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <Sprout className="w-4 h-4" /> Book Consultation
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Consultation Request Modal */}
      {bookingExpert && (
        <ConsultationRequestModal
          isOpen={isBookingOpen}
          onClose={() => { setIsBookingOpen(false); setBookingExpert(null); }}
          expertId={bookingExpert.userId || 2}
          expertName={bookingExpert.fullName}
          onSuccess={(consultation) => {
            setIsBookingOpen(false);
            setBookingExpert(null);
            router.push(`/farmer/consultations/${consultation.id}`);
          }}
        />
      )}
    </div>
  );
}
