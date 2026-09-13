"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Cpu,
  Database,
  ExternalLink,
  HelpCircle,
  Leaf,
  RefreshCw,
  Server,
  ShieldAlert,
  ShieldCheck,
  Sprout,
  UserCheck,
  Users,
} from "lucide-react";
import { api } from "@/lib/api";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { UserAvatar } from "@/components/ui/avatar";
import { formatFullName } from "@/lib/format-utils";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface HealthItem {
  service: string;
  status: string;
  operational: boolean;
  latency?: string;
}

interface AdminStats {
  totalFarmers: number;
  activeFarmers: number;
  newFarmersThisMonth: number;
  totalExperts: number;
  verifiedExperts: number;
  pendingVerifications: number;
  cropAnalyses: number;
  allSystemsOperational: boolean;
  systemHealth?: HealthItem[];
}

interface PendingExpert {
  id: number;
  profileId?: number;
  fullName: string;
  email: string;
  phone?: string;
  profileImage?: string;
  designation?: string;
  qualification?: string;
  organization?: string;
  primaryCrops?: string[];
  submittedAt?: string;
}

export function AdminDashboardView() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [pendingExperts, setPendingExperts] = useState<PendingExpert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setLoadError(null);
    try {
      const [statsResponse, pendingResponse] = await Promise.all([
        api.get<AdminStats>("/v1/admin/dashboard/stats"),
        api.get<PendingExpert[]>("/v1/admin/experts/pending"),
      ]);
      setStats(statsResponse);
      setPendingExperts(
        (pendingResponse ?? []).map((expert, index) => ({
          ...expert,
          id: expert.profileId ?? index + 1,
        }))
      );
    } catch {
      setLoadError("Unable to load live dashboard metrics. Please check connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => { void fetchDashboard(); }, 0);
    return () => window.clearTimeout(timer);
  }, [fetchDashboard]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchDashboard();
    setIsRefreshing(false);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Recently";
    const date = new Date(dateStr);
    return Number.isNaN(date.getTime())
      ? "Recently"
      : date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  if (isLoading) return <DashboardSkeleton />;

  if (loadError || !stats) {
    return (
      <div className="rounded-xl border border-rose-200 bg-white p-8 text-center shadow-xs">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-rose-600">
          <HelpCircle className="h-5 w-5" />
        </div>
        <h3 className="text-sm font-bold text-slate-900">Dashboard Metrics Unavailable</h3>
        <p className="mt-1 text-xs text-slate-500">{loadError ?? "Unable to load telemetry data."}</p>
        <button
          type="button"
          onClick={() => { setIsLoading(true); void fetchDashboard(); }}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-800 transition-colors shadow-2xs cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Retry Connection</span>
        </button>
      </div>
    );
  }

  const systemHealthList = [
    { service: "AI Disease Diagnosis Pipeline", status: "Operational", icon: Cpu },
    { service: "Agronomy Advisory Gateway", status: "Operational", icon: Server },
    { service: "Authentication & RBAC Authority", status: "Operational", icon: ShieldCheck },
    { service: "Crops & Disease Database Cluster", status: "Operational", icon: Database },
  ];

  return (
    <div className="space-y-6">
      {/* ── 1. Page Header ───────────────────────────────────────────────────── */}
      <AdminPageHeader
        greeting="Dashboard Overview"
        subtitle="Operational telemetry, expert accreditation queue, and cultivator network oversight."
        actions={
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 cursor-pointer transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-emerald-700" : "text-slate-400"}`} />
            <span>Refresh</span>
          </button>
        }
      />

      {/* ── 2. Top Metric Cards Grid ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Farmers */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Registered Cultivators</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {stats.totalFarmers.toLocaleString()}
          </p>
          <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
            <span>{stats.activeFarmers} active accounts</span>
            <Link href="/admin/users" className="font-medium text-emerald-700 hover:underline">
              View &rarr;
            </Link>
          </div>
        </div>

        {/* Metric 2: Verified Experts */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Verified Agronomists</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
              <UserCheck className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {stats.verifiedExperts.toLocaleString()}
          </p>
          <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
            <span>{stats.totalExperts} registered total</span>
            <Link href="/admin/experts?status=active" className="font-medium text-emerald-700 hover:underline">
              Directory &rarr;
            </Link>
          </div>
        </div>

        {/* Metric 3: Pending Verifications */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pending Accreditation</span>
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
              stats.pendingVerifications > 0 ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"
            }`}>
              <Clock3 className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {stats.pendingVerifications.toLocaleString()}
          </p>
          <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
            <span>
              {stats.pendingVerifications > 0 ? "Requires review" : "Queue up-to-date"}
            </span>
            <Link href="/admin/verification" className="font-medium text-emerald-700 hover:underline">
              Review &rarr;
            </Link>
          </div>
        </div>

        {/* Metric 4: Crop AI Analyses */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Advisory Evaluations</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
              <Sprout className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {stats.cropAnalyses.toLocaleString()}
          </p>
          <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
            <span>Platform throughput</span>
            <Link href="/admin/crops" className="font-medium text-emerald-700 hover:underline">
              Crops &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* ── 3. Main Two-Column Layout ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Pending Expert Accreditation Queue */}
        <div className="lg:col-span-8 rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3.5 bg-slate-50/50">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">
                Pending Expert Accreditation Applications
              </h2>
              <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-800 border border-amber-200">
                {pendingExperts.length}
              </span>
            </div>
            <Link
              href="/admin/verification"
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
            >
              <span>Full Verification Workbench</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {pendingExperts.length === 0 ? (
            <div className="p-8 text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">All Applications Processed</h3>
              <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                There are currently no new candidate applications waiting in the accreditation queue.
              </p>
              <div className="mt-4">
                <Link
                  href="/admin/experts?status=active"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors"
                >
                  <UserCheck className="h-3.5 w-3.5 text-slate-500" />
                  <span>Browse Verified Experts Directory</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {pendingExperts.slice(0, 6).map((expert) => {
                const displayName = formatFullName(expert.fullName);
                return (
                  <div
                    key={expert.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 hover:bg-slate-50/75 transition-colors"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <UserAvatar
                        src={expert.profileImage}
                        name={displayName}
                        size="md"
                        className="rounded-lg ring-1 ring-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-xs font-bold text-slate-900 truncate">{displayName}</p>
                          <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800 border border-amber-200">
                            Pending Review
                          </span>
                        </div>
                        <p className="mt-0.5 text-[11px] text-slate-500 truncate">
                          {expert.designation || "Agricultural Specialist"}{" "}
                          {expert.organization ? `• ${expert.organization}` : ""}
                        </p>
                        <p className="mt-0.5 text-[11px] text-slate-400">
                          Submitted: {formatDate(expert.submittedAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 sm:self-center">
                      <Link
                        href={`/admin/verification?expertId=${expert.profileId || expert.id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-emerald-800 transition-colors"
                      >
                        <span>Review Application</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {pendingExperts.length > 6 && (
            <div className="border-t border-slate-100 p-3 text-center bg-slate-50/30">
              <Link
                href="/admin/verification"
                className="text-xs font-semibold text-emerald-700 hover:underline"
              >
                View all {pendingExperts.length} applications in verification workbench &rarr;
              </Link>
            </div>
          )}
        </div>

        {/* Right Column (4 cols): Infrastructure Telemetry & Quick Shortcuts */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card 1: Infrastructure Health */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                System Infrastructure
              </h3>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                All Operational
              </span>
            </div>

            <div className="mt-3 divide-y divide-slate-100">
              {systemHealthList.map((svc) => {
                const Icon = svc.icon;
                return (
                  <div key={svc.service} className="flex items-center justify-between py-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className="h-4 w-4 text-slate-400 shrink-0" />
                      <span className="text-xs font-medium text-slate-700 truncate">{svc.service}</span>
                    </div>
                    <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800 border border-emerald-200 shrink-0">
                      {svc.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 2: Quick Administration Shortcuts */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-3">
              Quick Administrative Access
            </h3>

            <div className="mt-3 space-y-1.5">
              <Link
                href="/admin/verification"
                className="flex items-center justify-between rounded-lg p-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-700" />
                  <span>Expert Verification Workbench</span>
                </div>
                <ArrowRight className="h-3 w-3 text-slate-400" />
              </Link>

              <Link
                href="/admin/users"
                className="flex items-center justify-between rounded-lg p-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
              >
                <div className="flex items-center gap-2.5">
                  <Users className="h-4 w-4 text-emerald-700" />
                  <span>Cultivators Directory</span>
                </div>
                <ArrowRight className="h-3 w-3 text-slate-400" />
              </Link>

              <Link
                href="/admin/crops"
                className="flex items-center justify-between rounded-lg p-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
              >
                <div className="flex items-center gap-2.5">
                  <Leaf className="h-4 w-4 text-emerald-700" />
                  <span>Crops Management Catalog</span>
                </div>
                <ArrowRight className="h-3 w-3 text-slate-400" />
              </Link>

              <Link
                href="/admin/settings"
                className="flex items-center justify-between rounded-lg p-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
              >
                <div className="flex items-center gap-2.5">
                  <ExternalLink className="h-4 w-4 text-slate-500" />
                  <span>Platform &amp; Account Settings</span>
                </div>
                <ArrowRight className="h-3 w-3 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-64 rounded-lg bg-slate-200 animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 rounded-xl bg-slate-100 border border-slate-200 animate-pulse" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 h-80 rounded-xl bg-slate-100 border border-slate-200 animate-pulse" />
        <div className="lg:col-span-4 h-80 rounded-xl bg-slate-100 border border-slate-200 animate-pulse" />
      </div>
    </div>
  );
}
