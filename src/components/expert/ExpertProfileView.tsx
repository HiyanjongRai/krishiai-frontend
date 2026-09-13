"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Clock,
  Building2,
  GraduationCap,
  Briefcase,
  Globe,
  Award,
  Sprout,
  FileText,
  RotateCcw,
  Edit3,
  ExternalLink,
  MapPin,
  Mail,
  Phone,
  Check,
  Upload,
  RefreshCw,
  Loader2,
  ArrowRight,
  FileCheck2,
} from "lucide-react";
import { ExpertProfileData } from "@/types/expert-dashboard";
import { ExpertEditAndResubmitModal } from "./ExpertEditAndResubmitModal";
import { ProfileImageUpload } from "@/components/ui/profile-image-upload";

interface ExpertDocumentSummary {
  documentType?: string;
  fileName?: string;
  fileSize?: string;
}

export function ExpertProfileView() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState<ExpertProfileData | null>(null);
  const [documents, setDocuments] = useState<ExpertDocumentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);
    setError(null);

    try {
      const [profRes, docsRes] = await Promise.allSettled([
        api.get<ExpertProfileData>("/v1/expert/profile"),
        api.get<ExpertDocumentSummary[]>("/v1/expert/profile/documents"),
      ]);

      if (profRes.status === "fulfilled" && profRes.value) {
        setProfile(profRes.value);
      }
      if (docsRes.status === "fulfilled" && Array.isArray(docsRes.value)) {
        setDocuments(docsRes.value);
      }
    } catch (err: unknown) {
      console.error("Failed to load expert profile:", err);
      setError("Unable to load profile data. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchProfile();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [fetchProfile]);

  if (loading) {
    return (
      <div className="space-y-6 pb-12" aria-busy="true" aria-label="Loading expert profile">
        {/* Top Header skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-48 rounded" />
            <Skeleton className="h-7 w-80 rounded-xl" />
          </div>
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-9 w-24 rounded-xl" />
            <Skeleton className="h-9 w-32 rounded-xl" />
          </div>
        </div>

        {/* Hero Identity Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Skeleton className="w-20 h-20 rounded-xl shrink-0" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-52 rounded-lg" />
                <Skeleton className="h-4 w-40 rounded" />
                <Skeleton className="h-4 w-60 rounded" />
              </div>
            </div>
            <Skeleton className="h-10 w-40 rounded-2xl" />
          </div>
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>

        {/* 2-Column: Professional Credentials & Specializations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <Skeleton className="h-5 w-44 rounded" />
            <div className="grid grid-cols-2 gap-3.5 pt-2">
              <Skeleton className="h-20 rounded-xl" />
              <Skeleton className="h-20 rounded-xl" />
              <Skeleton className="h-20 rounded-xl" />
              <Skeleton className="h-20 rounded-xl" />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <Skeleton className="h-5 w-48 rounded" />
            <div className="space-y-2.5 pt-2">
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </div>
        </div>

        {/* Documents Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <Skeleton className="h-5 w-52 rounded" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const appStatus = profile?.applicationStatus || "DRAFT";
  const isVerified = profile?.verifiedExpert || appStatus === "APPROVED";

  const getDoc = (type: string) => {
    return documents.find(
      (d) => (d.documentType || "").toUpperCase() === type.toUpperCase()
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/expert" className="hover:text-emerald-700 transition-colors">
              Expert Dashboard
            </Link>
            <span>/</span>
            <span className="font-bold text-slate-900">Profile &amp; Credentials</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 tracking-tight">
            Professional Profile &amp; Accreditation
          </h1>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => fetchProfile(true)}
            disabled={refreshing}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 min-h-[42px]"
            title="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            type="button"
            onClick={() => setShowEditModal(true)}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs hover:shadow transition-all cursor-pointer min-h-[42px]"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{appStatus === "REJECTED" ? "Update Profile & Resubmit" : "Edit Profile"}</span>
          </button>
        </div>
      </div>

      {/* Admin Feedback Banner if REJECTED */}
      {appStatus === "REJECTED" && (
        <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-4 sm:p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-100 border border-rose-200 text-rose-600">
                <AlertCircle className="w-4.5 h-4.5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-rose-950">
                  Application Requires Updates
                </h3>
                <p className="text-xs text-rose-800 leading-relaxed">
                  The administrator reviewed your application and requested changes before granting accreditation.
                </p>
                {profile?.adminNotes && (
                  <div className="mt-2.5 rounded-lg border border-rose-200 bg-white/80 p-3 text-xs">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-rose-600 mb-1">
                      Admin Feedback
                    </p>
                    <p className="font-semibold text-rose-900">
                      &ldquo;{profile.adminNotes}&rdquo;
                    </p>
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowEditModal(true)}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-rose-700 hover:bg-rose-800 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors shrink-0 cursor-pointer w-full sm:w-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Update &amp; Resubmit</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Profile Header Card */}
      <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 border-b border-slate-100 pb-6">
          <div className="flex flex-col xs:flex-row items-start gap-4">
            <div className="shrink-0">
              <ProfileImageUpload
                currentImageUrl={user?.profileImage || profile?.user?.profileImage}
                userName={profile?.user?.fullName || user?.fullName}
                onUploadSuccess={(updated) => {
                  updateUser(updated);
                  if (profile?.user) {
                    setProfile((prev) =>
                      prev
                        ? {
                            ...prev,
                            user: {
                              ...prev.user,
                              fullName: updated.fullName,
                              email: updated.email,
                              phone: updated.phone,
                              profileImage: updated.profileImage,
                            },
                          }
                        : null
                    );
                  }
                }}
                onRemoveSuccess={(updated) => {
                  updateUser(updated);
                  if (profile?.user) {
                    setProfile((prev) =>
                      prev
                        ? {
                            ...prev,
                            user: {
                              ...prev.user,
                              profileImage: null,
                            },
                          }
                        : null
                    );
                  }
                }}
                size="md"
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {profile?.user?.fullName || user?.fullName || "Expert"}
                </h2>
                {isVerified ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Verified Expert
                  </span>
                ) : appStatus === "SUBMITTED" ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-800 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-md">
                    <Clock className="w-3.5 h-3.5 text-sky-600" />
                    Under Review
                  </span>
                ) : appStatus === "REJECTED" ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                    Changes Required
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                    Draft Profile
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-slate-600">
                {profile?.designation || "Agricultural Specialist"}{" "}
                {profile?.organization ? `• ${profile.organization}` : ""}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {profile?.user?.email || user?.email}
                </span>
                {profile?.user?.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {profile.user.phone}
                  </span>
                )}
                {profile?.websiteUrl && (
                  <a
                    href={profile.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-emerald-700 hover:underline"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    Website
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:items-end gap-2">
            <button
              type="button"
              onClick={() => setShowEditModal(true)}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>
          </div>
        </div>

        {/* Bio */}
        {profile?.bio ? (
          <div className="space-y-1.5">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Professional Biography
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
              {profile.bio}
            </p>
          </div>
        ) : (
          <div className="p-4 rounded-lg bg-slate-50 border border-dashed border-slate-200 text-center">
            <p className="text-xs text-slate-400">No professional bio added yet.</p>
            <button
              type="button"
              onClick={() => setShowEditModal(true)}
              className="text-xs font-semibold text-emerald-700 hover:underline mt-1"
            >
              + Add Professional Bio
            </button>
          </div>
        )}

        {/* Academic & Professional Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center gap-2 text-slate-500 text-[11px] font-semibold">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
              <span>Academic Qualification</span>
            </div>
            <p className="text-sm font-bold text-slate-900 mt-1">
              {profile?.qualification || "B.Sc. Agriculture"}
            </p>
            <p className="text-xs text-slate-500">{profile?.institution || "Institution not specified"}</p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center gap-2 text-slate-500 text-[11px] font-semibold">
              <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
              <span>Field Experience</span>
            </div>
            <p className="text-sm font-bold text-slate-900 mt-1">
              {profile?.yearsOfExperience ?? 1} Year{profile?.yearsOfExperience !== 1 ? "s" : ""}
            </p>
            <p className="text-xs text-slate-500">Direct Agricultural Advisory</p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center gap-2 text-slate-500 text-[11px] font-semibold">
              <Building2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Affiliation</span>
            </div>
            <p className="text-sm font-bold text-slate-900 mt-1">
              {profile?.organization || "Independent Consultant"}
            </p>
            <p className="text-xs text-slate-500">{profile?.designation || "Expert Specialist"}</p>
          </div>
        </div>
      </div>

      {/* Verification Documents Section */}
      <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="space-y-0.5">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-emerald-600" />
              Verification Documents &amp; Credentials
            </h3>
            <p className="text-xs text-slate-500">
              Official records uploaded for administrative review and platform accreditation.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowEditModal(true)}
            className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5 border border-emerald-200 transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Re-upload / Replace Documents</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              type: "IDENTITY",
              title: "National ID / Citizenship",
              desc: "Government-issued identity proof",
            },
            {
              type: "EDUCATION",
              title: "Degree Certificate",
              desc: "Highest agricultural degree diploma or transcript",
            },
            {
              type: "LICENSE",
              title: "Agricultural Council License",
              desc: "Professional accreditation board registration",
            },
            {
              type: "EXPERIENCE",
              title: "Experience Certificate",
              desc: "Verified employment letter or service proof",
            },
          ].map((item) => {
            const doc = getDoc(item.type);
            const isUploaded = !!doc;

            return (
              <div
                key={item.type}
                className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 flex flex-col justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200/70 text-slate-600">
                      {item.type}
                    </span>
                    {isUploaded ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                        <CheckCircle2 className="w-3 h-3" />
                        Uploaded
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                        Required
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                  <p className="text-[11px] text-slate-500">{item.desc}</p>
                </div>

                <div className="rounded-lg bg-white border border-slate-200 p-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono text-slate-700 truncate font-medium text-[11px]">
                      {doc ? doc.fileName : "No file uploaded"}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0">
                    {doc?.fileSize || (isUploaded ? "1.5 MB" : "")}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowEditModal(true)}
                  className="w-full py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isUploaded ? "Replace Document" : "Upload Document"}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expertise & Crops Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Crops */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sprout className="w-4 h-4 text-emerald-600" />
              Specialty Crop Expertise
            </h3>
            <button
              type="button"
              onClick={() => setShowEditModal(true)}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
            >
              Edit Crops
            </button>
          </div>

          {profile?.crops && profile.crops.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profile.crops.map((c) => (
                <div
                  key={c.cropId}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 ${
                    c.expertiseType === "PRIMARY"
                      ? "bg-emerald-50 text-emerald-900 border-emerald-200"
                      : "bg-teal-50 text-teal-900 border-teal-200"
                  }`}
                >
                  <span>🌾</span>
                  <span>{c.cropName}</span>
                  <span className="text-[10px] font-bold uppercase opacity-60">
                    ({c.expertiseType})
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400">No crop expertise configured yet.</p>
          )}
        </div>

        {/* Specializations & Locations */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-600" />
              Specializations &amp; Service Zones
            </h3>
            <button
              type="button"
              onClick={() => setShowEditModal(true)}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
            >
              Edit
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Specializations
              </p>
              <div className="flex flex-wrap gap-1.5">
                {(profile?.specializations || []).length > 0 ? (
                  profile?.specializations.map((s) => (
                    <span
                      key={s.id}
                      className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700"
                    >
                      {s.name}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">General Agricultural Advisory</span>
                )}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Service Locations
              </p>
              <div className="flex flex-wrap gap-1.5">
                {(profile?.locations || []).length > 0 ? (
                  profile?.locations.map((l) => (
                    <span
                      key={l.id}
                      className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600 flex items-center gap-1"
                    >
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {l.name}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">All Nepal Regions</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit & Resubmit Modal */}
      <ExpertEditAndResubmitModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        profile={profile}
        onSuccess={() => {
          fetchProfile(true);
        }}
      />
    </div>
  );
}
