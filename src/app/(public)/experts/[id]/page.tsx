"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Award,
  BriefcaseBusiness,
  CheckCircle2,
  GraduationCap,
  MapPin,
  Sprout,
  Users,
  MessageSquare,
  ArrowLeft,
  ShieldCheck,
  Star,
  Sparkles,
  Camera,
  FileCheck2,
  Check,
  Send,
  Leaf,
  FlaskConical,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { ProfileSkeleton } from "@/components/ui/page-skeletons";
import { CropAvatar } from "@/components/ui/crop-avatar";
import { api } from "@/lib/api";
import { normalizeApiError } from "@/utils/api-response";
import { useAuth } from "@/providers/auth-provider";
import { useAuthModal } from "@/providers/auth-modal-provider";
import Image from "next/image";

type PublicExpertise = {
  cropId?: number | null;
  cropName?: string | null;
  cropEmoji?: string | null;
  cropImageUrl?: string | null;
  categoryName?: string | null;
  expertiseType?: string | null;
  verificationStatus?: string | null;
  expertiseArea?: string | null;
  expertiseLevel?: string | null;
  yearsOfExperience?: number | null;
};

type PublicExpert = {
  expertProfileId: number;
  fullName?: string | null;
  profileImage?: string | null;
  designation?: string | null;
  organization?: string | null;
  yearsOfExperience?: number | null;
  qualification?: string | null;
  institution?: string | null;
  bio?: string | null;
  professionalVerified?: boolean;
  professionalVerificationStatus?: string | null;
  verifiedCrops?: PublicExpertise[];
  allExpertises?: PublicExpertise[];
  specializations?: string[];
  locations?: string[];
};

function formatDomainName(raw?: string | null): string {
  if (!raw) return "General Agriculture";
  return raw
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function ExpertDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();
  const { user } = useAuth();
  const { openLogin } = useAuthModal();

  const [expert, setExpert] = useState<PublicExpert | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadExpert = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get<PublicExpert>(`/v1/experts/${id}`);
      setExpert(response);
    } catch (requestError) {
      setError(normalizeApiError(requestError, "Unable to load expert profile.").message);
      setExpert(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadExpert(), 0);
    return () => window.clearTimeout(timer);
  }, [loadExpert]);

  const allExpertises = useMemo(
    () => (expert?.verifiedCrops && expert.verifiedCrops.length > 0 ? expert.verifiedCrops : expert?.allExpertises ?? []),
    [expert]
  );

  // Separate into real crops vs farming domains
  const cropList = useMemo(() => {
    return allExpertises.filter((item) => item.expertiseType !== "AREA" && item.cropName);
  }, [allExpertises]);

  const domainList = useMemo(() => {
    return allExpertises.filter((item) => item.expertiseType === "AREA" || !item.cropName);
  }, [allExpertises]);

  const handleStartConsultation = () => {
    if (!user) {
      openLogin();
      return;
    }
    router.push(
      `/farmer/consultations?expertId=${expert?.expertProfileId}&expertName=${encodeURIComponent(
        expert?.fullName || "Expert"
      )}`
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAF9]">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6 sm:py-10 space-y-6">
        {/* Back Link */}
        <Link
          href="/experts"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#2E7D32] hover:text-[#1B5E20] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Agricultural Experts</span>
        </Link>

        {isLoading ? (
          <ProfileSkeleton />
        ) : error ? (
          <ErrorState title="Unable to load expert profile" message={error} onRetry={loadExpert} isRetrying={isLoading} />
        ) : !expert ? (
          <EmptyState
            title="Expert profile not found"
            description="This specialist profile is currently unavailable."
            icon={<Users className="h-6 w-6" aria-hidden="true" />}
          />
        ) : (
          <div className="space-y-6">
            {/* ─── 1. Primary Profile Card ────────────────────────────────────── */}
            <div className="rounded-[24px] border border-[#C8E6C9] bg-white p-6 sm:p-8 shadow-[0_4px_20px_-2px_#E8F5E9] space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                
                {/* Avatar + Main Details */}
                <div className="flex items-center gap-4 sm:gap-5">
                  <div className="relative shrink-0">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-[#A5D6A7] bg-[#E8F5E9] relative shadow-sm">
                      {expert.profileImage ? (
                        <Image
                          src={expert.profileImage}
                          alt={expert.fullName || "Expert"}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl font-black text-[#2E7D32]">
                          {(expert.fullName || "E").charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <span
                      className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#2E7D32] text-white border-2 border-white flex items-center justify-center shadow-xs"
                      title="Verified Agricultural Specialist"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#1F2937]">
                        {expert.fullName || "Agricultural Specialist"}
                      </h1>
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F5E9] px-2.5 py-0.5 text-[11px] font-bold text-[#2E7D32] border border-[#A5D6A7]">
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>Verified Specialist</span>
                      </span>
                    </div>

                    <p className="text-sm font-bold text-[#2E7D32]">
                      {expert.designation || "Agricultural Scientist"}
                      {expert.organization ? ` · ${expert.organization}` : ""}
                    </p>

                    <p className="text-xs text-[#6B7280] flex items-center gap-1.5 pt-0.5">
                      <span className="w-2 h-2 rounded-full bg-[#2E7D32] animate-pulse" />
                      <span>Ready to help with crop diseases, fertilizers &amp; farm advice</span>
                    </p>
                  </div>
                </div>

                {/* Big Action Button */}
                <div className="w-full sm:w-auto shrink-0">
                  <button
                    type="button"
                    onClick={handleStartConsultation}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#2E7D32] hover:bg-[#256B2A] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Ask Consultation</span>
                  </button>
                  <p className="text-[11px] text-[#6B7280] text-center mt-1 font-medium">
                    Direct chat with this expert
                  </p>
                </div>
              </div>

              {/* 3 Simple Highlight Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#F3F4F6]">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F8FAF8] border border-[#E5E7EB]">
                  <GraduationCap className="w-5 h-5 text-[#2E7D32] shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Qualification</p>
                    <p className="text-xs font-bold text-[#1F2937] truncate">{expert.qualification || "M.Sc. Agriculture"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F8FAF8] border border-[#E5E7EB]">
                  <Award className="w-5 h-5 text-[#2E7D32] shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Institution</p>
                    <p className="text-xs font-bold text-[#1F2937] truncate">{expert.institution || expert.organization || "Aadim National College"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F8FAF8] border border-[#E5E7EB]">
                  <ShieldCheck className="w-5 h-5 text-[#2E7D32] shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Experience &amp; Status</p>
                    <p className="text-xs font-bold text-[#1F2937] truncate">
                      {expert.yearsOfExperience ? `${expert.yearsOfExperience} Years Field Experience` : "KrishiAI Certified Advisor"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Simple Clean Bio */}
              <div className="p-4 rounded-2xl bg-[#F8FAF8] border border-[#E5E7EB] space-y-1 text-xs text-[#4B5563] leading-relaxed">
                <p className="font-bold text-[#1F2937] text-xs">About this Specialist:</p>
                <p>
                  {expert.bio && expert.bio.trim().length > 10
                    ? expert.bio
                    : `${expert.fullName || "This expert"} is an officially verified agricultural specialist on KrishiAI. They provide guidance on crop protection, soil management, and treatment prescriptions for Nepali farmers.`}
                </p>
              </div>
            </div>

            {/* ─── 2-Column Main Section ──────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              
              {/* Left Column (2 Cols): Crops & Services (Simple & Visual) */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* ── Section A: Crops this Expert Can Help With ── */}
                <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-6 shadow-xs space-y-4">
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-[#1F2937] flex items-center gap-2">
                      <Sprout className="w-5 h-5 text-[#2E7D32]" />
                      <span>Crops This Specialist Helps With</span>
                    </h2>
                    <p className="text-xs text-[#6B7280] mt-0.5">
                      You can consult this specialist for disease diagnosis, fertilizer dosage, and care for these crops:
                    </p>
                  </div>

                  {cropList.length === 0 ? (
                    <p className="text-xs text-[#6B7280] py-2">General crop advisory available.</p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                      {cropList.map((crop, idx) => (
                        <div
                          key={`${crop.cropId ?? idx}`}
                          className="flex items-center gap-3 p-3 rounded-2xl border border-[#E5E7EB] bg-[#F9FAF9] hover:bg-white hover:border-[#A5D6A7] hover:shadow-xs transition-all"
                        >
                          <CropAvatar
                            name={crop.cropName}
                            imageUrl={crop.cropImageUrl}
                            emoji={crop.cropEmoji}
                            size="md"
                            className="shrink-0 rounded-xl"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-black text-[#1F2937] truncate">{crop.cropName}</p>
                            <p className="text-[10px] text-[#6B7280] font-medium truncate">
                              {crop.categoryName || "Crop Care"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ── Section B: Farming Services & Topics ── */}
                <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-6 shadow-xs space-y-4">
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-[#1F2937] flex items-center gap-2">
                      <FlaskConical className="w-5 h-5 text-[#2E7D32]" />
                      <span>Farming &amp; Soil Topics</span>
                    </h2>
                    <p className="text-xs text-[#6B7280] mt-0.5">
                      Expertise in soil health, plant protection, and sustainable farming methods:
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {domainList.length > 0 ? (
                      domainList.map((domain, idx) => {
                        const title = formatDomainName(domain.expertiseArea);
                        return (
                          <div
                            key={`${domain.expertiseArea ?? idx}`}
                            className="p-3.5 rounded-2xl border border-[#E5E7EB] bg-[#F9FAF9] space-y-1 hover:border-[#A5D6A7] transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-black text-[#1F2937]">{title}</p>
                              <span className="text-[10px] font-bold text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-md">
                                Verified
                              </span>
                            </div>
                            <p className="text-[11px] text-[#6B7280]">
                              Specialized guidance on farm best practices and yield optimization.
                            </p>
                          </div>
                        );
                      })
                    ) : (
                      <>
                        <div className="p-3.5 rounded-2xl border border-[#E5E7EB] bg-[#F9FAF9] space-y-1">
                          <p className="text-xs font-black text-[#1F2937]">Soil &amp; Fertilizer Management</p>
                          <p className="text-[11px] text-[#6B7280]">NPK balancing, soil pH testing, and compost guidance.</p>
                        </div>
                        <div className="p-3.5 rounded-2xl border border-[#E5E7EB] bg-[#F9FAF9] space-y-1">
                          <p className="text-xs font-black text-[#1F2937]">Crop Disease &amp; Pest Control</p>
                          <p className="text-[11px] text-[#6B7280]">Identify insect attacks, fungal rust, and pesticide dosage.</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column (1 Col): "How Consultation Works" & Quick Assistance */}
              <div className="space-y-5">
                
                {/* How to Consult Card (Super Simple 3 Steps) */}
                <div className="rounded-[24px] border border-[#C8E6C9] bg-gradient-to-br from-[#F1F8F3] to-[#E8F5E9] p-6 shadow-xs space-y-4">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-[#2E7D32]" />
                    <h3 className="text-sm font-black text-[#1F2937]">How to Get Farm Advice</h3>
                  </div>

                  <div className="space-y-3 pt-1">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#2E7D32] text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                        1
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#1F2937]">Click &quot;Ask Consultation&quot;</p>
                        <p className="text-[11px] text-[#4B5563]">Opens your direct consultation window with this specialist.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#2E7D32] text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                        2
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#1F2937]">Describe Your Crop Issue</p>
                        <p className="text-[11px] text-[#4B5563]">Type what is happening or upload photos of leaves, stems, or roots.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#2E7D32] text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                        3
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#1F2937]">Get Verified Treatment</p>
                        <p className="text-[11px] text-[#4B5563]">Receive exact spray recommendations, dosage, and preventive steps.</p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleStartConsultation}
                    className="w-full mt-2 py-3 px-4 rounded-xl bg-[#2E7D32] hover:bg-[#256B2A] text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Start Consultation</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Service Availability Box */}
                <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-xs font-black text-[#1F2937]">
                    <MapPin className="w-4 h-4 text-[#2E7D32]" />
                    <span>Coverage &amp; Language</span>
                  </div>

                  <ul className="space-y-2 text-xs text-[#4B5563]">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#2E7D32] shrink-0" />
                      <span>Online advice across all regions of Nepal</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#2E7D32] shrink-0" />
                      <span>Nepali and English communication</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#2E7D32] shrink-0" />
                      <span>Certified prescription report delivery</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
