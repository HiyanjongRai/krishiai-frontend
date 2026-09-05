"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  ShieldCheck,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Users,
  MessageSquareText,
  Sprout,
  Activity,
  CalendarCheck,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Search,
  Filter,
  RefreshCw,
  Send,
  X,
  FileCheck2,
  Award,
  Video,
  PhoneCall,
  MessageSquare,
  AlertCircle,
  HelpCircle,
  TrendingUp,
} from "lucide-react";
import { useToast } from "@/providers/toast-provider";
import { getApiErrorMessage } from "@/lib/toast-utils";
import { ExpertEditAndResubmitModal } from "./ExpertEditAndResubmitModal";

export interface FarmerInquiry {
  id: number;
  farmerId: number;
  farmerName: string;
  farmerPhone?: string;
  farmerLocation: string;
  cropName: string;
  cropEmoji: string;
  category: string;
  issueTitle: string;
  issueDescription: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  status: "PENDING_REVIEW" | "IN_PROGRESS" | "RESOLVED";
  submittedAt: string;
  aiDiagnosisHint?: string;
  expertNotes?: string;
}

export interface CropAdvisory {
  id: number;
  cropName: string;
  cropEmoji: string;
  alertTitle: string;
  severity: "ALERT" | "WARNING" | "INFO";
  description: string;
  recommendedAction: string;
  issuedDate: string;
}

export interface ScheduleSlot {
  id: number;
  dayOfWeek: string;
  timeRange: string;
  slotType: "VIDEO" | "AUDIO" | "CHAT";
  status: "AVAILABLE" | "BOOKED";
  bookedFarmerName?: string;
}

export interface ExpertStats {
  totalConsultations: number;
  pendingInquiries: number;
  activeCases: number;
  totalFarmersAssisted: number;
  assignedCropsCount: number;
  specializationsCount: number;
  locationsCount: number;
  profileCompletionPercentage: number;
  averageRating: number;
  totalReviews: number;
  applicationStatus: string;
  verifiedExpert: boolean;
  responseTimeHours: number;
}

export interface ExpertProfileData {
  id: number;
  user: {
    id: number;
    fullName: string;
    email: string;
    phone?: string;
    role: string;
  };
  bio?: string;
  yearsOfExperience?: number;
  qualification?: string;
  institution?: string;
  organization?: string;
  designation?: string;
  websiteUrl?: string;
  verifiedExpert: boolean;
  applicationStatus: "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED";
  submittedAt?: string;
  reviewedAt?: string;
  adminNotes?: string;
  crops: Array<{
    cropId: number;
    cropName: string;
    cropCategory: string;
    expertiseType: string;
  }>;
  specializations: Array<{
    id: number;
    name: string;
    code: string;
  }>;
  locations: Array<{
    id: number;
    name: string;
    type: string;
  }>;
}

export interface DashboardResponse {
  profile: ExpertProfileData;
  stats: ExpertStats;
  recentInquiries: FarmerInquiry[];
  cropAdvisories: CropAdvisory[];
  upcomingSchedule: ScheduleSlot[];
}

export function ExpertDashboardView() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Interactive review modal
  const [activeInquiry, setActiveInquiry] = useState<FarmerInquiry | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyStatus, setReplyStatus] = useState<"IN_PROGRESS" | "RESOLVED">("RESOLVED");
  const [submittingReply, setSubmittingReply] = useState(false);
  const [replySuccess, setReplySuccess] = useState<string | null>(null);

  // Application submission state
  const [submittingApp, setSubmittingApp] = useState(false);
  const [appMessage, setAppMessage] = useState<string | null>(null);
  const [showResubmitModal, setShowResubmitModal] = useState(false);

  // Load dynamic data from backend
  const fetchDashboardData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const res = await api.get<DashboardResponse>("/v1/expert/dashboard");
      if (res) {
        setData(res);
      }
    } catch (err: any) {
      console.error("Failed to load expert dashboard data:", err);
      setError(err?.message || "Failed to load dashboard data from backend.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Filtered inquiries
  const filteredInquiries = useMemo(() => {
    if (!data?.recentInquiries) return [];
    return data.recentInquiries.filter((item) => {
      const matchesSearch =
        item.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.issueTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.farmerLocation.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSeverity =
        severityFilter === "ALL" || item.severity === severityFilter;

      const matchesStatus =
        statusFilter === "ALL" || item.status === statusFilter;

      return matchesSearch && matchesSeverity && matchesStatus;
    });
  }, [data?.recentInquiries, searchQuery, severityFilter, statusFilter]);

  // Handle inquiry prescription reply
  const handleSendReply = async () => {
    if (!activeInquiry || !replyText.trim()) return;
    setSubmittingReply(true);
    setReplySuccess(null);

    try {
      await api.post(`/v1/expert/dashboard/inquiries/${activeInquiry.id}/reply`, {
        status: replyStatus,
        expertNotes: replyText.trim(),
      });

      setReplySuccess("Recommendation dispatched successfully to farmer!");
      toast.success({
        title: "Recommendation sent",
        description: "Your agricultural recommendation has been dispatched to the farmer.",
      });

      // Update in local state immediately
      setData((prev) => {
        if (!prev) return prev;
        const updated = prev.recentInquiries.map((inq) =>
          inq.id === activeInquiry.id
            ? { ...inq, status: replyStatus, expertNotes: replyText.trim() }
            : inq
        );
        return { ...prev, recentInquiries: updated };
      });

      setTimeout(() => {
        setActiveInquiry(null);
        setReplyText("");
        setReplySuccess(null);
      }, 1200);
    } catch (err: any) {
      const msg = getApiErrorMessage(err, "Failed to submit recommendation.");
      toast.error({
        title: "Recommendation failed",
        description: msg,
      });
    } finally {
      setSubmittingReply(false);
    }
  };

  // Handle submit verification application
  const handleSubmitVerification = async () => {
    setSubmittingApp(true);
    setAppMessage(null);

    try {
      await api.post("/v1/expert/profile/submit-application", {});
      toast.success({
        title: "Application submitted",
        description: "Your expert application has been submitted for review.",
      });
      setAppMessage("Application submitted! KrishiAI Administration will review your credentials.");
      // Refresh dashboard state
      await fetchDashboardData(true);
    } catch (err: any) {
      const msg = getApiErrorMessage(err, "Ensure your profile is complete.");
      toast.error({
        title: "Submission failed",
        description: msg,
      });
      setAppMessage("Could not submit application: " + msg);
    } finally {
      setSubmittingApp(false);
    }
  };

  const profile = data?.profile;
  const stats = data?.stats;
  const isVerified = profile?.verifiedExpert || stats?.verifiedExpert;
  const appStatus = profile?.applicationStatus || stats?.applicationStatus || "DRAFT";

  if (loading) {
    return (
      <div className="space-y-6" aria-busy="true" aria-label="Loading expert workspace">
        {/* Header greeting & action skeleton */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="space-y-2">
            <Skeleton className="h-7 w-64 rounded-xl" />
            <Skeleton className="h-4 w-96 rounded-md" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-28 rounded-xl" />
            <Skeleton className="h-9 w-32 rounded-xl" />
          </div>
        </div>

        {/* 4 Core Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white border border-slate-200/80 rounded-3xl p-5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <Skeleton className="w-10 h-10 rounded-2xl" />
                <Skeleton className="h-4 w-12 rounded-full" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-8 w-20 rounded-lg" />
                <Skeleton className="h-3.5 w-32 rounded-md" />
              </div>
            </div>
          ))}
        </div>

        {/* Main 2-column layout: 2 cols inquiries, 1 col schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-3xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-48 rounded-lg" />
              <Skeleton className="h-8 w-64 rounded-xl" />
            </div>
            <div className="space-y-3 pt-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-40 rounded" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>
                  <Skeleton className="h-3 w-full rounded" />
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-4 shadow-xs">
            <Skeleton className="h-6 w-36 rounded-lg" />
            <div className="space-y-3 pt-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2">
                  <Skeleton className="h-4 w-32 rounded" />
                  <Skeleton className="h-3 w-24 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Approval Gate ─────────────────────────────────────────────────────────
  // Non-approved experts see a full-page status view, NOT the operational dashboard
  if (!isVerified && appStatus !== "APPROVED") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-12">
        <div className="max-w-lg w-full mx-auto px-4">
          {appStatus === "SUBMITTED" ? (
            <div className="bg-white border border-sky-200 rounded-3xl p-10 shadow-sm text-center space-y-6">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-sky-50 border border-sky-200 flex items-center justify-center">
                <Clock className="w-10 h-10 text-sky-500 animate-spin" style={{ animationDuration: "3s" }} />
              </div>
              <div>
                <span className="text-[11px] font-bold text-sky-700 bg-sky-50 border border-sky-200 px-3 py-1 rounded-full uppercase tracking-wider">
                  Status: Submitted
                </span>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-3">Application Submitted</h2>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                  Your expert application has been submitted successfully and is queued for verification by our KrishiAI administrators.
                </p>
              </div>
              <div className="bg-sky-50 border border-sky-100 rounded-2xl p-4 text-left space-y-2">
                <p className="text-xs font-bold text-sky-800 uppercase tracking-wider">What happens next?</p>
                <ul className="text-xs text-sky-700 space-y-1.5">
                  <li className="flex items-start gap-2"><span className="mt-0.5">📋</span> Admin reviews your credentials &amp; documents</li>
                  <li className="flex items-start gap-2"><span className="mt-0.5">✅</span> Review typically completes within 24–48 hours</li>
                  <li className="flex items-start gap-2"><span className="mt-0.5">🌿</span> Full advisory &amp; consultation access is unlocked upon approval</li>
                </ul>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => fetchDashboardData(true)}
                  disabled={refreshing}
                  className="px-5 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                  {refreshing ? "Checking..." : "Check Status"}
                </button>
                <a
                  href="/expert/profile"
                  className="px-5 py-2.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold flex items-center gap-2 transition-all"
                >
                  <Award className="w-4 h-4" />
                  View Profile
                </a>
              </div>
            </div>
          ) : appStatus === "UNDER_REVIEW" ? (
            <div className="bg-white border border-indigo-200 rounded-3xl p-10 shadow-sm text-center space-y-6">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-indigo-50 border border-indigo-200 flex items-center justify-center">
                <Clock className="w-10 h-10 text-indigo-600 animate-pulse" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full uppercase tracking-wider">
                  Status: Under Review
                </span>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-3">Application Under Review</h2>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                  An administrator is actively reviewing your educational credentials, council licensing, and selected crop specializations.
                </p>
              </div>
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 text-left space-y-2">
                <p className="text-xs font-bold text-indigo-900 uppercase tracking-wider">Review in Progress</p>
                <p className="text-xs text-indigo-700 leading-relaxed">
                  Verification checks are currently being performed. You will be notified as soon as an approval decision is made or if further details are requested.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => fetchDashboardData(true)}
                  disabled={refreshing}
                  className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                  {refreshing ? "Checking..." : "Refresh Status"}
                </button>
              </div>
            </div>
          ) : appStatus === "ADDITIONAL_INFORMATION_REQUIRED" ? (
            <div className="bg-white border border-amber-300 rounded-3xl p-10 shadow-sm text-center space-y-6">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-amber-600" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full uppercase tracking-wider">
                  Status: Action Required
                </span>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-3">Action Required</h2>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                  The verification team reviewed your application and requested additional information or updated credentials.
                </p>
              </div>
              {profile?.adminNotes && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-left">
                  <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">Admin Request / Notes</p>
                  <p className="text-sm text-amber-900 font-medium">&ldquo;{profile.adminNotes}&rdquo;</p>
                </div>
              )}
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowResubmitModal(true)}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white text-sm font-bold flex items-center gap-2 transition-all shadow-md hover:shadow-lg cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  Update Profile &amp; Resubmit
                </button>
              </div>
            </div>
          ) : appStatus === "REJECTED" ? (
            <div className="bg-white border border-rose-200 rounded-3xl p-10 shadow-sm text-center space-y-6">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-rose-50 border border-rose-200 flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-rose-500" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full uppercase tracking-wider">
                  Status: Application Not Approved
                </span>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-3">Application Requires Updates</h2>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                  Your expert application was reviewed and was not approved with the currently provided credentials.
                </p>
              </div>
              {profile?.adminNotes && (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-left">
                  <p className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-1">Admin Feedback</p>
                  <p className="text-sm text-rose-700">&ldquo;{profile.adminNotes}&rdquo;</p>
                </div>
              )}
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowResubmitModal(true)}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white text-sm font-bold flex items-center gap-2 transition-all shadow-md hover:shadow-lg cursor-pointer active:scale-98"
                >
                  <Award className="w-4 h-4" />
                  Update Profile &amp; Resubmit
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-amber-200 rounded-3xl p-10 shadow-sm text-center space-y-6">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                <ShieldCheck className="w-10 h-10 text-amber-500" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full uppercase tracking-wider">
                  Status: Application Not Verified
                </span>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-3">Complete Profile to Submit</h2>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                  Welcome to KrishiAI, {profile?.user.fullName || user?.fullName || "Expert"}! Complete your expert profile, select your specialty crops, and submit your verification application.
                </p>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-left space-y-2">
                <p className="text-xs font-bold text-amber-800 uppercase tracking-wider">Steps to Get Verified</p>
                <ul className="text-xs text-amber-700 space-y-1.5">
                  <li className="flex items-start gap-2"><span className="mt-0.5">👤</span> Complete your professional profile</li>
                  <li className="flex items-start gap-2"><span className="mt-0.5">🌾</span> Select crop expertise (Max 3 Primary crops)</li>
                  <li className="flex items-start gap-2"><span className="mt-0.5">📄</span> Upload accreditation &amp; experience documents</li>
                  <li className="flex items-start gap-2"><span className="mt-0.5">📤</span> Submit for admin review</li>
                </ul>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleSubmitVerification}
                  disabled={submittingApp}
                  className="px-5 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <FileCheck2 className="w-4 h-4" />
                  {submittingApp ? "Submitting..." : "Submit Application"}
                </button>
                <a
                  href="/expert/profile"
                  className="px-5 py-2.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold flex items-center gap-2 transition-all"
                >
                  <Award className="w-4 h-4" />
                  Continue Application
                </a>
              </div>
              {appMessage && (
                <div className="text-xs font-semibold text-emerald-700 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 mt-2">
                  {appMessage}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* ─── Top Header Card ─────────────────────────────────────────────────── */}
      <div className="bg-white border border-[#E2E8E3] rounded-3xl p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                Expert Diagnostic Workspace
              </span>
              {isVerified ? (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-600 text-white flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Verified
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {appStatus === "SUBMITTED" ? "Review Pending" : "Verification Required"}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#17201A] tracking-tight">
              Namaste, {profile?.user.fullName || user?.fullName || "Expert"} 👋
            </h1>
            <p className="text-xs text-slate-500 max-w-2xl">
              {profile?.designation || "Senior Agricultural Specialist"} •{" "}
              {profile?.organization || "Agricultural Research & Extension"} •{" "}
              {profile?.qualification || "M.Sc. Agriculture"}
            </p>
          </div>

          {/* Actions & Refresh */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => fetchDashboardData(true)}
              disabled={refreshing}
              className="px-3.5 py-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              title="Refresh dynamic data from KrishiAI backend"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-emerald-600" : ""}`} />
              <span>{refreshing ? "Syncing..." : "Refresh"}</span>
            </button>

            <Link
              href="/expert/profile"
              className="px-4 py-2.5 rounded-2xl bg-[#166534] hover:bg-[#14532d] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Edit Credentials</span>
            </Link>
          </div>
        </div>

        {/* Verification Callout Banners */}
        {!isVerified && (
          <div className="mt-5 pt-4 border-t border-slate-100">
            {appStatus === "DRAFT" && (
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-xs text-amber-950">
                      Your expert application is in Draft status
                    </h4>
                    <p className="text-[11px] text-amber-800/90 mt-0.5 leading-relaxed">
                      Submit your application for administrator review to receive verified certification, gain public trust, and unlock high-priority farmer advisory queues.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleSubmitVerification}
                  disabled={submittingApp}
                  className="px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold shrink-0 transition-colors shadow-xs cursor-pointer flex items-center gap-1.5 self-start sm:self-center"
                >
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>{submittingApp ? "Submitting..." : "Submit for Verification"}</span>
                </button>
              </div>
            )}

            {appStatus === "SUBMITTED" && (
              <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-200 flex items-center gap-3 text-sky-900">
                <Clock className="w-5 h-5 text-sky-600 shrink-0 animate-spin" />
                <div>
                  <h4 className="font-bold text-xs text-sky-950">
                    Application submitted and pending administrator verification
                  </h4>
                  <p className="text-[11px] text-sky-800/90 mt-0.5">
                    Our platform administrators are currently verifying your institutional credentials and crop specialties. Turnaround is typically within 24–48 hours.
                  </p>
                </div>
              </div>
            )}

            {appStatus === "REJECTED" && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-rose-900">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-xs text-rose-950">Application requires updates</h4>
                    <p className="text-[11px] text-rose-800 mt-0.5">
                      {profile?.adminNotes
                        ? `Admin notes: "${profile.adminNotes}"`
                        : "Please update your professional credentials and crop expertise before resubmitting."}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowResubmitModal(true)}
                  className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold shrink-0 transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Update Profile &amp; Resubmit</span>
                </button>
              </div>
            )}

            {appMessage && (
              <div className="mt-2 text-xs font-semibold text-emerald-700 p-2 rounded-xl bg-emerald-50 border border-emerald-200">
                {appMessage}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ─── Metric Statistics Row ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Consultations */}
        <div className="bg-white border border-[#E2E8E3] rounded-3xl p-4 sm:p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
              Consultations
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-[#17201A]">
                {stats?.totalConsultations ?? 14}
              </span>
              <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +18%
              </span>
            </div>
            <span className="text-[10px] text-slate-500 block truncate mt-0.5">
              Farmers assisted across districts
            </span>
          </div>
        </div>

        {/* Pending Inquiries */}
        <div className="bg-white border border-[#E2E8E3] rounded-3xl p-4 sm:p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <MessageSquareText className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
              Pending Cases
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-amber-700">
                {stats?.pendingInquiries ?? 2}
              </span>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded-md">
                Active Queue
              </span>
            </div>
            <span className="text-[10px] text-slate-500 block truncate mt-0.5">
              Requires expert review & advice
            </span>
          </div>
        </div>

        {/* Specialty Crops */}
        <div className="bg-white border border-[#E2E8E3] rounded-3xl p-4 sm:p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
            <Sprout className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
              Specialty Crops
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-[#17201A]">
                {stats?.assignedCropsCount ?? (profile?.crops?.length || 3)}
              </span>
              <span className="text-[10px] font-semibold text-slate-400">
                / 3 Primary
              </span>
            </div>
            <span className="text-[10px] text-slate-500 block truncate mt-0.5">
              Assigned agronomy domains
            </span>
          </div>
        </div>

        {/* Profile Completion */}
        <div className="bg-white border border-[#E2E8E3] rounded-3xl p-4 sm:p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
                Profile Readiness
              </span>
              <span className="text-xs font-black text-indigo-700">
                {stats?.profileCompletionPercentage ?? 80}%
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-emerald-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${stats?.profileCompletionPercentage ?? 80}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500 block truncate mt-1">
              Rating: {stats?.averageRating ?? 4.9} ★ ({stats?.totalReviews ?? 38} reviews)
            </span>
          </div>
        </div>
      </div>

      {/* ─── Main Content Layout: 2 Columns ──────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Assigned Farmer Diagnostic Inquiries (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-[#E2E8E3] rounded-3xl p-5 sm:p-6 shadow-xs space-y-5">
            {/* Header & Filter Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-lg text-[#17201A] tracking-tight flex items-center gap-2">
                  <MessageSquareText className="w-5 h-5 text-emerald-700" />
                  Assigned Farmer Diagnostic Inquiries
                </h3>
                <p className="text-xs text-slate-500">
                  Review crop symptoms submitted by farmers, verify AI vision diagnostics, and prescribe treatment.
                </p>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 self-start sm:self-center">
                {filteredInquiries.length} Cases Listed
              </span>
            </div>

            {/* Search & Filter Toolbar */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by farmer, crop, symptom or district..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9.5 pr-4 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
                />
              </div>

              {/* Severity Filter */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((sev) => (
                  <button
                    key={sev}
                    onClick={() => setSeverityFilter(sev)}
                    className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-colors cursor-pointer shrink-0 ${
                      severityFilter === sev
                        ? "bg-[#166534] text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {sev === "ALL" ? "All Severities" : sev}
                  </button>
                ))}
              </div>
            </div>

            {/* Inquiries List */}
            {filteredInquiries.length === 0 ? (
              <div className="py-12 text-center space-y-2 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm text-slate-800">No Inquiries Found</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  No cases match your filter criteria. All clear in this queue!
                </p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {filteredInquiries.map((inq) => {
                  const isCritical = inq.severity === "CRITICAL";
                  const isHigh = inq.severity === "HIGH";
                  const isResolved = inq.status === "RESOLVED";

                  return (
                    <div
                      key={inq.id}
                      className="p-4 sm:p-5 rounded-2xl border border-slate-200/90 hover:border-emerald-300 transition-all bg-white hover:shadow-xs space-y-3"
                    >
                      {/* Top Bar: Crop + Severity + Status */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                            <span className="text-sm">{inq.cropEmoji}</span>
                            <span>{inq.cropName}</span>
                          </span>

                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
                              isCritical
                                ? "bg-rose-100 text-rose-800 border border-rose-200"
                                : isHigh
                                ? "bg-amber-100 text-amber-800 border border-amber-200"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {inq.severity} Severity
                          </span>
                        </div>

                        {/* Status Badge */}
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isResolved
                              ? "bg-emerald-100 text-emerald-800"
                              : inq.status === "IN_PROGRESS"
                              ? "bg-sky-100 text-sky-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {inq.status === "PENDING_REVIEW"
                            ? "Pending Review"
                            : inq.status === "IN_PROGRESS"
                            ? "In Progress"
                            : "Resolved"}
                        </span>
                      </div>

                      {/* Issue Headline & Description */}
                      <div>
                        <h4 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug">
                          {inq.issueTitle}
                        </h4>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {inq.issueDescription}
                        </p>
                      </div>

                      {/* AI Vision Hint Card */}
                      {inq.aiDiagnosisHint && (
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2 text-xs text-slate-700">
                          <Activity className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="leading-snug text-[11px]">
                            <strong className="text-slate-900">AI Diagnostic Hint:</strong>{" "}
                            {inq.aiDiagnosisHint}
                          </span>
                        </div>
                      )}

                      {/* Expert Notes if already prescribed */}
                      {inq.expertNotes && (
                        <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900">
                          <span className="font-bold text-[11px] block">Your Prescribed Treatment:</span>
                          <span className="text-[11px] mt-0.5 block leading-relaxed">
                            {inq.expertNotes}
                          </span>
                        </div>
                      )}

                      {/* Footer: Farmer info + Action Button */}
                      <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2 text-slate-500">
                          <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                            {inq.farmerName[0]}
                          </div>
                          <span className="font-semibold text-slate-800">{inq.farmerName}</span>
                          <span>•</span>
                          <span>{inq.farmerLocation}</span>
                          {inq.farmerPhone && (
                            <>
                              <span>•</span>
                              <span className="font-mono text-[11px] text-slate-600">{inq.farmerPhone}</span>
                            </>
                          )}
                        </div>

                        <button
                          onClick={() => {
                            setActiveInquiry(inq);
                            setReplyText(inq.expertNotes || "");
                            setReplyStatus(inq.status === "RESOLVED" ? "RESOLVED" : "RESOLVED");
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-[#166534] hover:bg-[#14532d] text-white text-xs font-bold transition-all shadow-xs self-start sm:self-center cursor-pointer flex items-center gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{inq.status === "RESOLVED" ? "Update Advice" : "Review & Prescribe"}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Specialties, Advisories, Schedule (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* 1. My Specialty Crops */}
          <div className="bg-white border border-[#E2E8E3] rounded-3xl p-5 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-[#17201A] flex items-center gap-2">
                <Sprout className="w-4 h-4 text-emerald-700" />
                My Specialty Crops
              </h3>
              <Link
                href="/expert/profile"
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5"
              >
                Manage <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {profile?.crops && profile.crops.length > 0 ? (
              <div className="space-y-2">
                {profile.crops.map((c) => (
                  <div
                    key={c.cropId}
                    className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-xl bg-emerald-100/70 text-emerald-800 flex items-center justify-center font-bold text-xs">
                        🌱
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-xs text-slate-900 block truncate">
                          {c.cropName}
                        </span>
                        <span className="text-[10px] text-slate-500 block truncate">
                          {c.cropCategory}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.expertiseType === "PRIMARY"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {c.expertiseType}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-slate-50 text-center space-y-1">
                <p className="text-xs text-slate-500">No crops linked yet.</p>
                <Link
                  href="/expert/profile"
                  className="text-xs font-bold text-emerald-700 hover:underline block"
                >
                  + Add Primary Crops
                </Link>
              </div>
            )}
          </div>

          {/* 2. Crop Protection Advisories */}
          <div className="bg-white border border-[#E2E8E3] rounded-3xl p-5 shadow-xs space-y-3.5">
            <h3 className="font-extrabold text-sm text-[#17201A] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Agricultural Advisories
            </h3>

            <div className="space-y-3">
              {data?.cropAdvisories?.map((adv) => (
                <div
                  key={adv.id}
                  className="p-3 rounded-2xl border border-slate-100 bg-[#FAFBF9] space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{adv.cropEmoji}</span>
                      <span>{adv.alertTitle}</span>
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                        adv.severity === "ALERT"
                          ? "bg-rose-100 text-rose-800"
                          : adv.severity === "WARNING"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-sky-100 text-sky-800"
                      }`}
                    >
                      {adv.severity}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {adv.description}
                  </p>

                  <div className="pt-1 text-[10px] text-emerald-800 font-medium">
                    <strong>Action:</strong> {adv.recommendedAction}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Upcoming Consultation Schedule */}
          <div className="bg-white border border-[#E2E8E3] rounded-3xl p-5 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-[#17201A] flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-emerald-700" />
                Consultation Schedule
              </h3>
              <Link
                href="/expert/availability"
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5"
              >
                Calendar <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-2">
              {data?.upcomingSchedule?.map((slot) => {
                const isBooked = slot.status === "BOOKED";
                const isVideo = slot.slotType === "VIDEO";

                return (
                  <div
                    key={slot.id}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                          isVideo
                            ? "bg-purple-100 text-purple-700"
                            : "bg-sky-100 text-sky-700"
                        }`}
                      >
                        {isVideo ? (
                          <Video className="w-3.5 h-3.5" />
                        ) : (
                          <PhoneCall className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-xs text-slate-900 block truncate">
                          {slot.dayOfWeek} • {slot.timeRange}
                        </span>
                        <span className="text-[10px] text-slate-500 block truncate">
                          {isBooked
                            ? `With ${slot.bookedFarmerName}`
                            : "Open Booking Slot"}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                        isBooked
                          ? "bg-amber-100 text-amber-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {isBooked ? "Booked" : "Available"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Interactive Prescription & Review Modal ─────────────────────────── */}
      {activeInquiry && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {activeInquiry.cropEmoji} {activeInquiry.cropName}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      activeInquiry.severity === "CRITICAL"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {activeInquiry.severity}
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900 leading-snug">
                  {activeInquiry.issueTitle}
                </h3>
                <p className="text-xs text-slate-500">
                  Farmer: <strong className="text-slate-800">{activeInquiry.farmerName}</strong> • {activeInquiry.farmerLocation} • {activeInquiry.farmerPhone}
                </p>
              </div>

              <button
                onClick={() => setActiveInquiry(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Farmer's Symptoms & Description */}
            <div className="space-y-1.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Field Observation Notes
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">
                {activeInquiry.issueDescription}
              </p>
            </div>

            {/* AI Diagnosis Context */}
            {activeInquiry.aiDiagnosisHint && (
              <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5">
                <Activity className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <strong>AI Preliminary Vision Analysis:</strong>{" "}
                  {activeInquiry.aiDiagnosisHint}
                </div>
              </div>
            )}

            {/* Expert Prescription Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 block">
                Expert Agronomic Recommendation & Treatment Plan:
              </label>
              <textarea
                rows={4}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Prescribe specific fungicides, biological treatments, dosage (e.g. 2g per liter water), cultural prevention, irrigation modifications..."
                className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
              />
            </div>

            {/* Status Selection */}
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-700">Update Status:</span>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="replyStatus"
                  value="RESOLVED"
                  checked={replyStatus === "RESOLVED"}
                  onChange={() => setReplyStatus("RESOLVED")}
                  className="accent-emerald-600"
                />
                <span>Resolved & Prescribed</span>
              </label>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="replyStatus"
                  value="IN_PROGRESS"
                  checked={replyStatus === "IN_PROGRESS"}
                  onChange={() => setReplyStatus("IN_PROGRESS")}
                  className="accent-emerald-600"
                />
                <span>Under Follow-up</span>
              </label>
            </div>

            {replySuccess && (
              <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                {replySuccess}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveInquiry(null)}
                className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSendReply}
                disabled={submittingReply || !replyText.trim()}
                className="px-5 py-2.5 rounded-2xl bg-[#166534] hover:bg-[#14532d] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-2 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submittingReply ? "Dispatching..." : "Submit Recommendation"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit & Resubmit Application Modal */}
      <ExpertEditAndResubmitModal
        isOpen={showResubmitModal}
        onClose={() => setShowResubmitModal(false)}
        profile={profile || null}
        onSuccess={() => {
          fetchDashboardData(true);
        }}
      />
    </div>
  );
}
