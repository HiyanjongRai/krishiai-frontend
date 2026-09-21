"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Users,
  Award,
  CheckCircle2,
  Sprout,
  GraduationCap,
  Building2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
  Loader2,
  AlertCircle,
  Star,
  X,
  BadgeCheck,
  Leaf,
  FlaskConical,
  Droplets,
} from "lucide-react";
import { Navbar } from "@/components/shared/layout/navbar";
import { Footer } from "@/components/shared/layout/footer";
import { UserAvatar } from "@/components/ui/avatar";
import { Modal } from "@/components/ui/modal";
import { ConsultationRequestModal } from "@/components/messaging/ConsultationRequestModal";
import { useAuth } from "@/providers/auth-provider";
import { useAuthModal } from "@/providers/auth-modal-provider";
import { toast } from "@/lib/toast-utils";
import { expertDirectoryService } from "@/services/expert";
import { packageService } from "@/services/packageService";
import { defaultVerifiedExperts } from "@/data/experts";
import type { VerifiedExpert } from "@/types/expert-directory";
import type { ConsultationPackage } from "@/types/payment";

// Topic categories for quick navigation & search
const TOPIC_CHIPS = [
  { id: "all", label: "All Specialists", icon: Users },
  { id: "vegetables", label: "Vegetables & Greenhouses", query: "Vegetable" },
  { id: "cereals", label: "Cereals (Rice, Wheat, Maize)", query: "Rice" },
  { id: "pathology", label: "Pest & Disease Diagnosis", query: "Pathology" },
  { id: "soil", label: "Soil Health & Nutrients", query: "Soil" },
  { id: "organic", label: "Organic & Sustainable", query: "Organic" },
  { id: "fruits", label: "Fruits & Orchards", query: "Fruit" },
  { id: "irrigation", label: "Smart Irrigation & Climate", query: "Irrigation" },
];

export default function ExpertsDirectoryPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { openLogin } = useAuthModal();

  const [experts, setExperts] = useState<VerifiedExpert[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [minExperience, setMinExperience] = useState<number>(0);
  const [onlyVerifiedCrops, setOnlyVerifiedCrops] = useState(false);

  // Selected expert for details modal
  const [detailExpert, setDetailExpert] = useState<VerifiedExpert | null>(null);
  const [expertPackages, setExpertPackages] = useState<ConsultationPackage[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(false);

  // Consultation booking modal state
  const [bookingExpert, setBookingExpert] = useState<VerifiedExpert | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Load experts from API, fallback to defaultVerifiedExperts
  useEffect(() => {
    async function loadExperts() {
      try {
        setLoading(true);
        const data = await expertDirectoryService.getExperts();
        if (data && data.length > 0) {
          // Merge API data with default verified list if count is low
          const existingIds = new Set(data.map((d) => d.expertProfileId));
          const supplementary = defaultVerifiedExperts.filter(
            (d) => !existingIds.has(d.expertProfileId)
          );
          setExperts([...data, ...supplementary]);
        } else {
          setExperts(defaultVerifiedExperts);
        }
      } catch (err) {
        console.warn("Could not fetch experts from backend API, using verified catalog", err);
        setExperts(defaultVerifiedExperts);
      } finally {
        setLoading(false);
      }
    }
    loadExperts();
  }, []);

  // When opening expert detail, load active pricing packages
  useEffect(() => {
    if (detailExpert && detailExpert.userId) {
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

  // Handle consultation booking click
  const handleInitiateConsultation = (exp: VerifiedExpert) => {
    if (!isAuthenticated) {
      toast.info("Sign in required", {
        description: "Please log in to consult verified agricultural specialists.",
      });
      openLogin();
      return;
    }

    if (user?.role !== "ROLE_FARMER" && user?.role !== "ROLE_ADMIN") {
      toast.warning("Farmer Account Required", {
        description: "Expert consultations can only be requested from a farmer account.",
      });
      return;
    }

    // Expert must have a valid user ID to book
    const bookingUserId = exp.userId || (exp.expertProfileId ? exp.expertProfileId + 1 : 2);
    setBookingExpert({
      ...exp,
      userId: bookingUserId,
    });
    setIsBookingOpen(true);
  };

  // Filtered expert list
  const filteredExperts = useMemo(() => {
    return experts.filter((exp) => {
      // 1. Topic chip filter
      if (selectedTopic !== "all") {
        const chip = TOPIC_CHIPS.find((c) => c.id === selectedTopic);
        if (chip?.query) {
          const q = chip.query.toLowerCase();
          const matchesSpec = exp.specializations?.some((s) => s.toLowerCase().includes(q));
          const matchesCrop = exp.verifiedCrops?.some(
            (c) =>
              c.cropName?.toLowerCase().includes(q) ||
              c.categoryName?.toLowerCase().includes(q) ||
              c.expertiseArea?.toLowerCase().includes(q)
          );
          const matchesDesignation = exp.designation?.toLowerCase().includes(q);
          const matchesBio = exp.bio?.toLowerCase().includes(q);
          if (!matchesSpec && !matchesCrop && !matchesDesignation && !matchesBio) {
            return false;
          }
        }
      }

      // 2. Minimum experience filter
      if (minExperience > 0 && (exp.yearsOfExperience || 0) < minExperience) {
        return false;
      }

      // 3. Verified crops only filter
      if (onlyVerifiedCrops && (!exp.verifiedCrops || exp.verifiedCrops.length === 0)) {
        return false;
      }

      // 4. Free text search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const inName = exp.fullName?.toLowerCase().includes(query);
        const inDesignation = exp.designation?.toLowerCase().includes(query);
        const inOrg = exp.organization?.toLowerCase().includes(query);
        const inInstitution = exp.institution?.toLowerCase().includes(query);
        const inBio = exp.bio?.toLowerCase().includes(query);
        const inSpecs = exp.specializations?.some((s) => s.toLowerCase().includes(query));
        const inCrops = exp.verifiedCrops?.some(
          (c) =>
            c.cropName?.toLowerCase().includes(query) ||
            c.expertiseArea?.toLowerCase().includes(query) ||
            c.categoryName?.toLowerCase().includes(query)
        );
        const inLocations = exp.locations?.some((l) => l.toLowerCase().includes(query));

        if (
          !inName &&
          !inDesignation &&
          !inOrg &&
          !inInstitution &&
          !inBio &&
          !inSpecs &&
          !inCrops &&
          !inLocations
        ) {
          return false;
        }
      }

      return true;
    });
  }, [experts, selectedTopic, minExperience, onlyVerifiedCrops, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F8FAF8] text-[#1F2937] flex flex-col">
      <Navbar />

      <main className="flex-1 pb-20">
        {/* ─── Hero Section ────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#1B5E20] via-[#2E7D32] to-[#1e5a24] pt-12 pb-16 text-white border-b border-emerald-800/30">
          {/* Ambient Glows */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 -right-20 w-80 h-80 bg-green-300/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-100 text-xs font-bold tracking-wide shadow-xs">
                <BadgeCheck className="w-4 h-4 text-emerald-300" />
                <span>Credential-Verified Agricultural Consultants</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.15]">
                Connect with Certified <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-green-100 to-emerald-300">Crop Specialists</span>
              </h1>

              <p className="text-sm sm:text-base text-emerald-50/90 leading-relaxed max-w-2xl mx-auto">
                Find verified agronomists, soil doctors, and plant pathologists across Nepal. Review tailored advisory packages and consult directly with secure escrow protection.
              </p>
            </div>

            {/* ─── Search Bar ──────────────────────────────────────────────────────── */}
            <div className="mt-8 max-w-3xl mx-auto">
              <div className="relative flex items-center bg-white rounded-2xl shadow-xl border border-white/30 focus-within:ring-4 focus-within:ring-emerald-400/30 transition-all p-2">
                <Search className="w-5 h-5 text-gray-400 ml-3 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by specialist name, crop (e.g. Tomato, Rice), pest, university..."
                  className="w-full px-3.5 py-2.5 text-sm bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors mr-2 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold transition-all shrink-0 shadow-xs cursor-pointer active:scale-95"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Search</span>
                </button>
              </div>
            </div>

            {/* ─── Topic Chips ─────────────────────────────────────────────────────── */}
            <div className="mt-6 flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar pb-2">
              {TOPIC_CHIPS.map((chip) => {
                const isSelected = selectedTopic === chip.id;
                return (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => setSelectedTopic(chip.id)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      isSelected
                        ? "bg-white text-[#1B5E20] shadow-md scale-105"
                        : "bg-white/10 hover:bg-white/20 text-white/95 border border-white/15 backdrop-blur-sm"
                    }`}
                  >
                    <span>{chip.label}</span>
                  </button>
                );
              })}
            </div>

            {/* ─── Trust Stats Grid ───────────────────────────────────────────────── */}
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto pt-6 border-t border-white/15">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 text-center border border-white/15">
                <p className="text-xl sm:text-2xl font-black text-white">50+</p>
                <p className="text-[11px] font-medium text-emerald-100/90 mt-0.5">Verified Specialists</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 text-center border border-white/15">
                <p className="text-xl sm:text-2xl font-black text-white">120+</p>
                <p className="text-[11px] font-medium text-emerald-100/90 mt-0.5">Crop Varieties</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 text-center border border-white/15">
                <p className="text-xl sm:text-2xl font-black text-white">2,400+</p>
                <p className="text-[11px] font-medium text-emerald-100/90 mt-0.5">Advisory Consults</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 text-center border border-white/15">
                <p className="text-xl sm:text-2xl font-black text-white">&lt; 2 hrs</p>
                <p className="text-[11px] font-medium text-emerald-100/90 mt-0.5">Response Time</p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Filters & Main Catalog ────────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          {/* Active Filter Summary Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-200">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-gray-900">
                  Available Agricultural Consultants
                </h2>
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#1B5E20] border border-emerald-200">
                  {filteredExperts.length} Specialists
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Select a consultant to review packages and initiate a direct advisory request.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Experience Filter */}
              <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-2xs">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <span className="font-medium">Experience:</span>
                <select
                  value={minExperience}
                  onChange={(e) => setMinExperience(Number(e.target.value))}
                  className="bg-transparent font-bold text-gray-800 focus:outline-none cursor-pointer"
                >
                  <option value={0}>All Levels</option>
                  <option value={5}>5+ Years</option>
                  <option value={8}>8+ Years</option>
                  <option value={10}>10+ Years</option>
                </select>
              </div>

              {/* Verified Crops Toggle */}
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-2xs cursor-pointer select-none hover:border-emerald-300 transition-colors">
                <input
                  type="checkbox"
                  checked={onlyVerifiedCrops}
                  onChange={(e) => setOnlyVerifiedCrops(e.target.checked)}
                  className="rounded border-gray-300 text-[#2E7D32] focus:ring-[#2E7D32]"
                />
                <span>Verified Crop Badges Only</span>
              </label>

              {(searchQuery || selectedTopic !== "all" || minExperience > 0 || onlyVerifiedCrops) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedTopic("all");
                    setMinExperience(0);
                    setOnlyVerifiedCrops(false);
                  }}
                  className="text-xs font-bold text-red-600 hover:text-red-700 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* ─── Experts Grid ──────────────────────────────────────────────────────── */}
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#2E7D32]" />
              <p className="text-xs font-bold text-gray-500">
                Loading verified agricultural consultants...
              </p>
            </div>
          ) : filteredExperts.length === 0 ? (
            <div className="my-16 rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center max-w-lg mx-auto shadow-sm">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-base font-extrabold text-gray-900">No specialists match your criteria</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Try clearing search terms or selecting &quot;All Specialists&quot; to view our full verified
                directory.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedTopic("all");
                  setMinExperience(0);
                  setOnlyVerifiedCrops(false);
                }}
                className="mt-5 px-5 py-2.5 bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold rounded-full transition-all shadow-sm cursor-pointer"
              >
                Show All Specialists
              </button>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExperts.map((exp) => {
                const experience = exp.yearsOfExperience
                  ? `${exp.yearsOfExperience}+ Yrs Experience`
                  : "Verified Specialist";
                const isTopRated = (exp.yearsOfExperience || 0) >= 10;

                return (
                  <div
                    key={exp.expertProfileId}
                    className="group relative rounded-3xl border border-gray-200/90 bg-white overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between"
                  >
                    {/* Top gradient accent line */}
                    <div className="h-1.5 w-full bg-gradient-to-r from-[#2E7D32] via-[#43A047] to-[#81C784]" />

                    <div className="p-5 sm:p-6 flex flex-col flex-1">
                      {/* Top profile header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3.5 min-w-0">
                          <div className="relative shrink-0">
                            <UserAvatar
                              src={exp.profileImage || undefined}
                              name={exp.fullName}
                              size="lg"
                            />
                            {exp.professionalVerified && (
                              <span
                                className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#2E7D32] rounded-full text-white flex items-center justify-center ring-2 ring-white shadow-2xs"
                                title="Verified Professional Specialist"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </span>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <h3 className="text-base font-bold text-gray-900 group-hover:text-[#1B5E20] transition-colors truncate">
                              {exp.fullName}
                            </h3>

                            <p className="text-xs font-semibold text-[#2E7D32] truncate">
                              {exp.designation || "Agricultural Consultant"}
                            </p>

                            {exp.organization && (
                              <p className="text-[11px] text-gray-500 truncate flex items-center gap-1 mt-0.5">
                                <Building2 className="w-3 h-3 shrink-0 text-gray-400" />
                                <span>{exp.organization}</span>
                              </p>
                            )}
                          </div>
                        </div>

                        {isTopRated && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-extrabold shrink-0 shadow-2xs">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                            Top Rated
                          </span>
                        )}
                      </div>

                      {/* Credentials Pill Row */}
                      <div className="mt-3.5 flex items-center gap-2 flex-wrap text-[11px]">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#F1F8F1] text-[#1B5E20] font-bold border border-[#C8E6C9]">
                          <Award className="w-3 h-3 text-[#2E7D32]" />
                          <span>{experience}</span>
                        </span>

                        {exp.qualification && (
                          <span
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-gray-50 text-gray-600 font-medium border border-gray-200 truncate max-w-[190px]"
                            title={exp.qualification}
                          >
                            <GraduationCap className="w-3 h-3 shrink-0 text-gray-500" />
                            <span className="truncate">{exp.qualification}</span>
                          </span>
                        )}
                      </div>

                      {/* Bio preview */}
                      <p className="mt-3 text-xs text-gray-600 leading-relaxed line-clamp-2">
                        {exp.bio ||
                          "Experienced agricultural specialist offering direct advisory, pest management, and cultivation optimization."}
                      </p>

                      {/* Spacer to push tags down uniformly */}
                      <div className="flex-1 min-h-[8px]" />

                      {/* Verified Crops Section */}
                      {exp.verifiedCrops && exp.verifiedCrops.length > 0 && (
                        <div className="mt-4 pt-3.5 border-t border-gray-100">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5 flex items-center gap-1">
                            <Leaf className="w-3 h-3 text-[#2E7D32]" />
                            <span>Verified Crop Expertise</span>
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {exp.verifiedCrops.slice(0, 4).map((c, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-50 text-[#1B5E20] text-xs font-semibold border border-emerald-100"
                              >
                                <span>{c.cropEmoji || "🌱"}</span>
                                <span>{c.cropName}</span>
                              </span>
                            ))}
                            {exp.verifiedCrops.length > 4 && (
                              <span className="text-[11px] font-medium text-gray-500 self-center">
                                +{exp.verifiedCrops.length - 4} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Specialization Tags */}
                      {exp.specializations && exp.specializations.length > 0 && (
                        <div className="mt-2.5 flex flex-wrap gap-1">
                          {exp.specializations.slice(0, 3).map((spec, sIdx) => (
                            <span
                              key={sIdx}
                              className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium"
                            >
                              #{spec}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Card Actions */}
                    <div className="p-5 sm:px-6 pt-3 pb-5 border-t border-gray-100 bg-gray-50/50 flex items-center gap-2">
                      <Link
                        href={`/experts/${exp.expertProfileId}`}
                        className="flex-1 px-3 py-2.5 rounded-xl border border-gray-300 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors text-center cursor-pointer shadow-2xs"
                      >
                        View Profile
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleInitiateConsultation(exp)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer"
                      >
                        <Sprout className="w-3.5 h-3.5" />
                        <span>Consult Now</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ─── Bottom CTA: Expert Recruitment ───────────────────────────────────── */}
          <div className="mt-16 rounded-3xl bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-emerald-200 text-xs font-bold backdrop-blur-xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Agricultural Specialists Wanted</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black">Are you an Agricultural Specialist?</h2>
                <p className="text-sm text-emerald-100/90 leading-relaxed">
                  Join KrishiAI to monetize your agricultural expertise, advise farmers across Nepal, set your own advisory packages, and receive instant automated payouts via eSewa.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                <Link
                  href="/expert-register"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-[#1B5E20] text-sm font-black hover:bg-emerald-50 transition-all shadow-lg active:scale-95 cursor-pointer"
                >
                  <span>Apply as Expert</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* ─── Expert Detail Modal ───────────────────────────────────────────────── */}
      {detailExpert && (
        <Modal
          isOpen={Boolean(detailExpert)}
          onClose={() => setDetailExpert(null)}
          title="Specialist Profile & Packages"
        >
          <div className="space-y-5">
            {/* Header info */}
            <div className="flex items-start gap-4">
              <UserAvatar
                src={detailExpert.profileImage || undefined}
                name={detailExpert.fullName}
                size="lg"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-[#1F2937]">{detailExpert.fullName}</h3>
                  {detailExpert.professionalVerified && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#E8F5E9] text-[#2E7D32] text-[10px] font-bold">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-xs font-semibold text-[#2E7D32]">
                  {detailExpert.designation || "Agricultural Consultant"}
                </p>
                <p className="text-xs text-[#6B7280]">{detailExpert.organization}</p>
                {detailExpert.qualification && (
                  <p className="text-xs text-[#4B5563] mt-0.5">
                    🎓 {detailExpert.qualification} {detailExpert.institution ? `— ${detailExpert.institution}` : ""}
                  </p>
                )}
              </div>
            </div>

            {/* Bio */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B7280] mb-1">
                About Specialist
              </h4>
              <p className="text-xs text-[#374151] leading-relaxed bg-[#F8FAF8] p-3 rounded-xl border border-[#EEF0EE]">
                {detailExpert.bio || "No biography provided."}
              </p>
            </div>

            {/* Verified Crops */}
            {detailExpert.verifiedCrops && detailExpert.verifiedCrops.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B7280] mb-2">
                  Verified Crop Focus &amp; Years Experience
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {detailExpert.verifiedCrops.map((c, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl border border-[#C8E6C9] bg-[#F1F8F1] flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">{c.cropEmoji || "🌱"}</span>
                        <div>
                          <p className="font-bold text-[#1B5E20]">{c.cropName}</p>
                          <p className="text-[10px] text-[#4B5563]">{c.expertiseArea || c.categoryName || "Specialist"}</p>
                        </div>
                      </div>
                      {c.yearsOfExperience && (
                        <span className="text-[10px] font-bold text-[#2E7D32] bg-white px-2 py-0.5 rounded-md border border-[#A5D6A7]">
                          {c.yearsOfExperience} yrs
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Consultation Packages Preview */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                  Advisory Pricing Packages
                </h4>
                <span className="text-[10px] text-[#2E7D32] font-semibold">eSewa Instant Checkout</span>
              </div>

              {loadingPackages ? (
                <div className="p-4 text-center">
                  <Loader2 className="w-5 h-5 animate-spin text-[#2E7D32] mx-auto" />
                </div>
              ) : expertPackages.length === 0 ? (
                <div className="p-3 bg-slate-50 rounded-xl text-xs text-[#6B7280] border border-slate-200">
                  Standard consultation package available upon booking (Platform commission 5%).
                </div>
              ) : (
                <div className="space-y-2">
                  {expertPackages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="p-3 rounded-xl border border-[#E5E7EB] bg-white hover:border-[#2E7D32] transition-colors flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#1F2937]">{pkg.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-green-50 text-[#2E7D32] font-semibold">
                            {pkg.durationHours}h Chat Window
                          </span>
                        </div>
                        {pkg.description && (
                          <p className="text-[11px] text-[#6B7280] mt-0.5">{pkg.description}</p>
                        )}
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

            {/* Modal Bottom CTA */}
            <div className="pt-3 border-t border-[#EEF0EE] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDetailExpert(null)}
                className="px-4 py-2 rounded-full border border-[#D1D5DB] text-xs font-bold text-[#4B5563] hover:bg-[#F8FAF8]"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  const target = detailExpert;
                  setDetailExpert(null);
                  handleInitiateConsultation(target);
                }}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold shadow-xs transition-colors"
              >
                <Sprout className="w-4 h-4" />
                <span>Book Consultation with {detailExpert.fullName.split(" ")[0]}</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ─── Consultation Request Modal ─────────────────────────────────────────── */}
      {bookingExpert && (
        <ConsultationRequestModal
          isOpen={isBookingOpen}
          onClose={() => {
            setIsBookingOpen(false);
            setBookingExpert(null);
          }}
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
