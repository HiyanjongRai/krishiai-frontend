"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowUpRight,
  Award,
  Check,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileCheck2,
  FileText,
  HelpCircle,
  Info,
  Layers,
  Plus,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Sprout,
  UserRound,
} from "lucide-react";
import { api } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/toast-utils";
import { formatFullName } from "@/lib/format-utils";
import { useAuth } from "@/providers/auth-provider";
import { useToast } from "@/providers/toast-provider";
import type { UserResponse } from "@/types/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/ui/avatar";

interface CropExpertise {
  id: number;
  cropId?: number;
  expertiseId?: number;
  cropName?: string;
  expertiseArea?: string;
  cropEmoji?: string;
  categoryName?: string;
  expertiseType: string;
  verificationStatus: "SELF_DECLARED" | "EVIDENCE_SUBMITTED" | "VERIFIED" | "REJECTED" | "PENDING";
  expertiseLevel?: string;
  yearsOfExperience?: number;
  verifiedAt?: string;
  rejectionReason?: string;
}

interface ExpertDocument {
  id: number;
  documentType: string;
  title: string;
  fileName: string;
  fileType?: string;
  fileSize?: string;
  fileUrl?: string;
  uploadedAt?: string;
}

interface ExpertProfile {
  id: number;
  user: UserResponse;
  bio?: string;
  yearsOfExperience?: number;
  qualification?: string;
  institution?: string;
  organization?: string;
  designation?: string;
  verifiedExpert: boolean;
  verificationStatus: string;
  applicationStatus?: string;
  submittedAt?: string;
  reviewedAt?: string;
  adminNotes?: string;
  crops: CropExpertise[];
  specializations: { id: number; name: string; code: string }[];
  locations: { id: number; name: string; type: string }[];
  documents: ExpertDocument[];
  createdAt?: string;
  updatedAt?: string;
}

const statusConfig: Record<
  string,
  { label: string; badgeTone: string; bannerTone: string; icon: React.ReactNode; description: string }
> = {
  UNVERIFIED: {
    label: "Not Submitted",
    badgeTone: "bg-slate-100 text-slate-700 border-slate-200",
    bannerTone: "border-slate-200 bg-white",
    icon: <AlertCircle className="h-5 w-5 text-slate-500" />,
    description: "Complete your professional profile and submit credentials for review.",
  },
  DRAFT: {
    label: "Draft Application",
    badgeTone: "bg-slate-100 text-slate-700 border-slate-200",
    bannerTone: "border-slate-200 bg-white",
    icon: <AlertCircle className="h-5 w-5 text-slate-500" />,
    description: "Your application is saved as a draft. Submit when all required details are entered.",
  },
  SUBMITTED: {
    label: "Pending Review",
    badgeTone: "bg-amber-50 text-amber-700 border-amber-200",
    bannerTone: "border-amber-200/80 bg-amber-50/40",
    icon: <Clock3 className="h-5 w-5 text-amber-600" />,
    description: "Your professional application is queued for administrator inspection.",
  },
  UNDER_REVIEW: {
    label: "Under Active Review",
    badgeTone: "bg-blue-50 text-blue-700 border-blue-200",
    bannerTone: "border-blue-200/80 bg-blue-50/40",
    icon: <Clock3 className="h-5 w-5 text-blue-600" />,
    description: "Your credentials and submitted documents are currently being evaluated by our team.",
  },
  ADDITIONAL_INFORMATION_REQUIRED: {
    label: "Action Required",
    badgeTone: "bg-orange-50 text-orange-700 border-orange-200",
    bannerTone: "border-orange-200/80 bg-orange-50/40",
    icon: <AlertCircle className="h-5 w-5 text-orange-600" />,
    description: "The administration team requires additional clarification or documents to proceed.",
  },
  APPROVED: {
    label: "Verified Specialist",
    badgeTone: "bg-emerald-50 text-emerald-700 border-emerald-200",
    bannerTone: "border-emerald-200/80 bg-emerald-50/40",
    icon: <ShieldCheck className="h-5 w-5 text-emerald-600" />,
    description: "Your professional credentials have been authorized. You can advise farmers across assigned crop domains.",
  },
  VERIFIED: {
    label: "Verified Specialist",
    badgeTone: "bg-emerald-50 text-emerald-700 border-emerald-200",
    bannerTone: "border-emerald-200/80 bg-emerald-50/40",
    icon: <ShieldCheck className="h-5 w-5 text-emerald-600" />,
    description: "Your professional credentials have been authorized. You can advise farmers across assigned crop domains.",
  },
  REJECTED: {
    label: "Declined",
    badgeTone: "bg-rose-50 text-rose-700 border-rose-200",
    bannerTone: "border-rose-200/80 bg-rose-50/40",
    icon: <ShieldAlert className="h-5 w-5 text-rose-600" />,
    description: "Your application was declined. Review reviewer feedback and update your profile to resubmit.",
  },
};

function formatDate(value?: string) {
  if (!value) return "Not submitted";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Not submitted"
    : date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getCompletion(profile: ExpertProfile) {
  const checks = [
    Boolean(profile.user.fullName && profile.user.email),
    Boolean(profile.qualification || profile.designation || profile.bio),
    profile.crops.length > 0 || profile.specializations.length > 0,
    profile.documents.length > 0,
    Boolean(profile.submittedAt || profile.applicationStatus === "APPROVED" || profile.verifiedExpert),
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export function PendingVerificationExpertDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<ExpertProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    setError(null);
    try {
      setProfile(await api.get<ExpertProfile>("/v1/expert/profile"));
    } catch (requestError) {
      const message = getApiErrorMessage(requestError, "Unable to load your expert profile.");
      setError(message);
      toast.error({ title: "Unable to load expert dashboard", description: message });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadProfile();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadProfile]);

  if (isLoading) return <DashboardSkeleton />;
  if (error || !profile) {
    return (
      <ErrorState
        message={error ?? "Your expert profile is unavailable."}
        onRetry={() => {
          setIsLoading(true);
          void loadProfile();
        }}
      />
    );
  }

  const applicationStatus = profile.verifiedExpert
    ? "VERIFIED"
    : profile.applicationStatus || profile.verificationStatus || "UNVERIFIED";
  const status = statusConfig[applicationStatus] ?? statusConfig.UNVERIFIED;
  const completion = getCompletion(profile);
  const verifiedCrops = profile.crops.filter((c) => c.verificationStatus === "VERIFIED").length;
  const selfDeclaredCrops = profile.crops.filter((c) => c.verificationStatus === "SELF_DECLARED" || c.verificationStatus === "PENDING").length;
  const evidenceCrops = profile.crops.filter((c) => c.verificationStatus === "EVIDENCE_SUBMITTED").length;
  const pendingCrops = selfDeclaredCrops + evidenceCrops;
  const nextAction =
    applicationStatus === "UNVERIFIED" || applicationStatus === "DRAFT"
      ? "/expert-register"
      : "/expert/profile";

  const firstName = (profile.user.fullName || user?.fullName || "Specialist").split(" ")[0];

  return (
    <div className="space-y-6">
      {/* ─── 1. PAGE HEADER ────────────────────────────────────────────── */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
            Expert Specialist Workspace
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            Welcome back, {firstName}
          </h1>
          <p className="mt-0.5 text-xs text-slate-500 font-medium">
            Monitor your professional credentials, crop accreditations, and verification progress.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/expert/profile"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
          >
            <UserRound className="w-3.5 h-3.5 text-slate-500" />
            <span>Edit Credentials</span>
          </Link>
          <Link
            href={nextAction}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-800 transition-colors"
          >
            {applicationStatus === "VERIFIED" ? "View Profile" : "Manage Application"}
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* ─── 2. VERIFICATION STATUS HERO BANNER ─────────────────────────── */}
      <section className={`rounded-xl border p-5 shadow-xs transition-all ${status.bannerTone}`}>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-2xs border border-slate-200/80">
              {status.icon}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold text-slate-900">
                  Verification Status:
                </span>
                <span className={`rounded-md border px-2 py-0.5 text-xs font-semibold ${status.badgeTone}`}>
                  {status.label}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-600 font-medium leading-relaxed max-w-2xl">
                {status.description}
              </p>
              {profile.adminNotes && (
                <div className="mt-3 rounded-lg border border-slate-200/80 bg-white/80 p-3 text-xs text-slate-800">
                  <span className="font-semibold text-slate-900">Reviewer Note: </span>
                  {profile.adminNotes}
                </div>
              )}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
            <Link
              href={nextAction}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 shadow-2xs hover:bg-slate-50 transition-colors w-full sm:w-auto min-h-[40px]"
            >
              <span>{applicationStatus === "VERIFIED" ? "Credential Details" : "Continue Submission"}</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            </Link>
          </div>
        </div>

        {/* Status Metadata Bar */}
        <div className="mt-4 flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-1.5 border-t border-slate-200/60 pt-3 text-[11px] sm:text-xs text-slate-500 font-medium">
          <span>
            Candidate ID: <strong className="text-slate-900">#{profile.id}</strong>
          </span>
          <span>
            Application Stage: <strong className="text-slate-900">{applicationStatus.replaceAll("_", " ")}</strong>
          </span>
          <span>
            Submitted On: <strong className="text-slate-900">{formatDate(profile.submittedAt)}</strong>
          </span>
          <span>
            Account Standing: <strong className="text-slate-900">{profile.user.status}</strong>
          </span>
        </div>
      </section>

      {/* ─── 3. 4-METRIC STRIP ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <OverviewCard
          icon={<UserRound />}
          value={`${completion}%`}
          label="Profile Completion"
          subtext={completion === 100 ? "All sections complete" : "Required fields recorded"}
        />
        <OverviewCard
          icon={<Sprout />}
          value={profile.crops.length}
          label="Expertise Claims"
          subtext={`${verifiedCrops} verified · ${pendingCrops} awaiting`}
        />
        <OverviewCard
          icon={<FileText />}
          value={profile.documents.length}
          label="Supporting Documents"
          subtext={profile.documents.length > 0 ? "Uploaded for verification" : "No certificates uploaded"}
        />
        <OverviewCard
          icon={<Award />}
          value={profile.verifiedExpert ? "Authorized" : pendingCrops > 0 ? "In Evaluation" : "Drafting"}
          label="Accreditation Stage"
          subtext={profile.verifiedExpert ? "Active advisory status" : "Awaiting review completion"}
        />
      </div>

      {/* ─── 4. TWO-COLUMN MAIN WORKBENCH ────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column (8 cols): Progress Pipeline & Expertise List */}
        <div className="space-y-6 lg:col-span-8">
          {/* Application Progress Stepper */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Application Progress &amp; Audit Trail
                </h2>
                <p className="mt-0.5 text-xs text-slate-500 font-medium">
                  Your account remains active while credential verification is completed.
                </p>
              </div>
              <span className="text-base font-bold text-emerald-700">
                {completion}% Complete
              </span>
            </div>

            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-emerald-600 transition-all duration-300"
                style={{ width: `${completion}%` }}
              />
            </div>

            <div className="mt-5 space-y-3">
              <ProgressItem done label="Specialist account registered" />
              <ProgressItem
                done={Boolean(profile.qualification || profile.designation || profile.bio)}
                label="Professional credentials & experience recorded"
              />
              <ProgressItem
                done={profile.crops.length > 0 || profile.specializations.length > 0}
                label="Crop specializations & domain focus submitted"
              />
              <ProgressItem
                done={profile.documents.length > 0}
                label="Accreditation documents & certificates uploaded"
              />
              <ProgressItem
                done={Boolean(profile.submittedAt)}
                label="Application submitted to administration queue"
              />
              <ProgressItem
                done={
                  applicationStatus === "UNDER_REVIEW" ||
                  applicationStatus === "APPROVED" ||
                  applicationStatus === "VERIFIED"
                }
                active={applicationStatus === "SUBMITTED" || applicationStatus === "UNDER_REVIEW"}
                label="Official credential evaluation by KrishiAI admin"
              />
              <ProgressItem
                done={applicationStatus === "APPROVED" || applicationStatus === "VERIFIED"}
                label="Accreditation confirmed & advisory services enabled"
              />
            </div>
          </section>

          {/* My Expertise Panel */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900">My Expertise Claims</h2>
                <p className="mt-0.5 text-xs text-slate-500 font-medium">
                  Crops and domains you have claimed. Add evidence to boost your profile's visibility.
                </p>
              </div>
              <Link
                href="/expert/expertise"
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-800 transition-colors"
              >
                <Plus className="h-3 w-3" />
                <span>Manage</span>
              </Link>
            </div>

            {/* Status legend */}
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700"><span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />Verified</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700"><span className="h-2 w-2 rounded-full bg-amber-400 shrink-0" />Evidence Submitted</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500"><span className="h-2 w-2 rounded-full bg-slate-400 shrink-0" />Self-declared</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-600"><span className="h-2 w-2 rounded-full bg-rose-400 shrink-0" />Rejected</span>
            </div>

            <div className="mt-3 space-y-2">
              {profile.crops.length === 0 ? (
                <Empty message="No expertise areas submitted yet. Click Manage to add crops and domains." />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {profile.crops.map((crop) => {
                    const displayName = crop.cropEmoji
                      ? `${crop.cropEmoji} ${crop.cropName ?? crop.expertiseArea ?? ""}`
                      : (crop.cropName ?? crop.expertiseArea ?? "Domain");
                    const st = crop.verificationStatus;
                    const badgeTone =
                      st === "VERIFIED"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : st === "EVIDENCE_SUBMITTED"
                        ? "border-amber-200 bg-amber-50 text-amber-700"
                        : st === "REJECTED"
                        ? "border-rose-200 bg-rose-50 text-rose-700"
                        : "border-slate-200 bg-slate-100 text-slate-500";
                    const badgeLabel =
                      st === "VERIFIED" ? "✓ Verified"
                      : st === "EVIDENCE_SUBMITTED" ? "Evidence Submitted"
                      : st === "REJECTED" ? "Rejected"
                      : "Self-declared";
                    return (
                      <div
                        key={crop.id}
                        className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/60 p-3 hover:bg-slate-100/60 transition-colors"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="truncate text-xs font-semibold text-slate-900">{displayName}</p>
                          <p className="truncate text-[11px] text-slate-500 font-medium">
                            {crop.categoryName || crop.expertiseType}
                          </p>
                        </div>
                        <span className={`shrink-0 rounded-md border px-2 py-0.5 text-[10px] font-semibold ${badgeTone}`}>
                          {badgeLabel}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column (4 cols): Profile Snapshot & Documents */}
        <div className="space-y-6 lg:col-span-4">
          {/* Profile Snapshot */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900">Profile Snapshot</h2>
              <Link
                href="/expert/profile"
                className="text-xs font-semibold text-emerald-700 hover:underline"
              >
                Edit Profile
              </Link>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <UserAvatar
                src={profile.user.profileImage}
                name={formatFullName(profile.user.fullName)}
                size="md"
                className="ring-1 ring-slate-200"
              />
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-slate-900">
                  {formatFullName(profile.user.fullName)}
                </p>
                <p className="truncate text-[11px] text-slate-500 font-medium">
                  {profile.designation || "Agricultural Specialist"}
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3 border-t border-slate-100 pt-3">
              <InfoRow label="Organization" value={profile.organization || profile.institution} />
              <InfoRow label="Qualification" value={profile.qualification} />
              <InfoRow
                label="Experience"
                value={profile.yearsOfExperience != null ? `${profile.yearsOfExperience} Years` : undefined}
              />
              <InfoRow
                label="Service Locations"
                value={
                  profile.locations.length > 0
                    ? profile.locations.map((loc) => loc.name).join(", ")
                    : undefined
                }
              />
            </div>
          </section>

          {/* Supporting Documents */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Credentials &amp; Files</h2>
                <p className="text-[11px] text-slate-500 font-medium">
                  {profile.documents.length} document{profile.documents.length === 1 ? "" : "s"} attached
                </p>
              </div>
              <Link
                href="/expert/documents"
                className="text-xs font-semibold text-emerald-700 hover:underline"
              >
                Manage
              </Link>
            </div>

            <div className="mt-3.5 space-y-2">
              {profile.documents.length === 0 ? (
                <Empty message="No supporting documents attached yet. Upload certificates or experience letters." />
              ) : (
                profile.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50/60 p-2.5 hover:bg-slate-100/60 transition-colors"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-white text-emerald-700 border border-slate-200/80 shadow-2xs">
                      <FileText className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-slate-900">
                        {doc.title || doc.fileName}
                      </p>
                      <p className="truncate text-[10px] text-slate-500 font-medium">
                        {doc.fileName} · {doc.fileSize || "Uploaded"}
                      </p>
                    </div>
                    <span className="text-[10px] font-medium text-slate-400 shrink-0">
                      {formatDate(doc.uploadedAt)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function OverviewCard({
  icon,
  value,
  label,
  subtext,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  subtext?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500">{label}</span>
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-2xs">
          {React.cloneElement(icon as React.ReactElement<{ className?: string }>, {
            className: "h-3.5 w-3.5",
          })}
        </div>
      </div>
      <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{value}</p>
      {subtext && <p className="mt-1 text-[11px] text-slate-500 font-medium truncate">{subtext}</p>}
    </div>
  );
}

function ProgressItem({
  label,
  done,
  active,
}: {
  label: string;
  done?: boolean;
  active?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 text-xs">
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] ${
          done
            ? "border-emerald-600 bg-emerald-600 text-white"
            : active
            ? "border-amber-500 bg-amber-50 text-amber-700"
            : "border-slate-200 bg-slate-50 text-slate-300"
        }`}
      >
        {done ? (
          <Check className="h-3 w-3 stroke-[2.5]" />
        ) : active ? (
          <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
        ) : null}
      </span>
      <span
        className={`font-medium ${
          done ? "text-slate-900" : active ? "font-semibold text-amber-800" : "text-slate-400"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-start justify-between gap-3 text-xs">
      <span className="text-slate-500 font-medium">{label}</span>
      <span className={`text-right font-semibold truncate ${value ? "text-slate-900" : "text-slate-400 font-normal"}`}>
        {value || "Not provided"}
      </span>
    </div>
  );
}

function Empty({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/70 p-6 text-center text-xs text-slate-500 font-medium">
      {message}
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-8 text-center space-y-3">
      <AlertCircle className="mx-auto h-8 w-8 text-rose-600" />
      <h3 className="text-sm font-bold text-rose-900">Unable to load your expert dashboard</h3>
      <p className="text-xs text-rose-800 max-w-md mx-auto leading-relaxed">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors cursor-pointer"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        <span>Try Again</span>
      </button>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true">
      <div className="space-y-2">
        <Skeleton className="h-4 w-36 rounded" />
        <Skeleton className="h-7 w-64 rounded-lg" />
        <Skeleton className="h-4 w-80 rounded" />
      </div>

      <Skeleton className="h-32 rounded-xl" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-24 rounded-xl" />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Skeleton className="lg:col-span-8 h-96 rounded-xl" />
        <Skeleton className="lg:col-span-4 h-96 rounded-xl" />
      </div>
    </div>
  );
}
