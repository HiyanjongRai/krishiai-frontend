"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth, getDashboardRoute } from "@/providers/auth-provider";
import { ShieldAlert, Award, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { Button } from "@/components/ui/button";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

// Routes that strictly require a VERIFIED expert status
export const VERIFIED_EXPERT_ROUTES = [
  "/expert/consultations",
  "/expert/ai-reviews",
  "/expert/availability",
];

/**
 * Strict role-based route guard.
 * Ensures:
 * 1. Unauthenticated users cannot access protected pages.
 * 2. Users cannot cross-access other roles' dashboards.
 * 3. Keeps layout stable without jarring full-page dismounting.
 */
export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    // 1. If not authenticated at all -> redirect to homepage
    if (!isAuthenticated || !user) {
      router.replace("/");
      return;
    }

    // 2. Check if user's role is permitted for this section.
    const hasAccess = allowedRoles.includes(user.role);

    if (!hasAccess) {
      // Unauthorized cross-role access -> redirect immediately to user's assigned dashboard
      const targetDashboard = getDashboardRoute(user.role);
      if (pathname !== targetDashboard) {
        router.replace(targetDashboard);
      }
    }
  }, [isAuthenticated, user, isLoading, allowedRoles, router, pathname]);

  // Initial session hydration skeleton (prevents blank flash without unmounting layout)
  if (isLoading) {
    return (
      <div
        className="min-h-screen bg-[#F8FAF8] flex flex-col"
        aria-busy="true"
        aria-label="Verifying access permissions"
      >
        <div className="h-16 border-b border-[#E5E7EB] bg-white/90 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-32 rounded-xl" />
          </div>
          <Skeleton className="h-8 w-44 rounded-full" />
        </div>
        <div className="max-w-[1680px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6 flex-1">
          <Skeleton className="w-64 h-[75vh] rounded-3xl hidden md:block shrink-0" />
          <div className="flex-1 space-y-6">
            <Skeleton className="h-9 w-64 rounded-xl" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Skeleton className="h-28 rounded-2xl" />
              <Skeleton className="h-28 rounded-2xl" />
              <Skeleton className="h-28 rounded-2xl" />
            </div>
            <Skeleton className="h-80 w-full rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-[#F8FAF8] p-4 flex items-center justify-center">
        <ErrorState
          variant="restricted"
          title="Sign in required"
          message="Please sign in to access this page."
          className="max-w-md w-full"
        />
      </div>
    );
  }

  const hasAccess = allowedRoles.includes(user.role);

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-[#F8FAF8] p-4 flex items-center justify-center">
        <div className="max-w-md w-full space-y-4">
          <ErrorState
            variant="restricted"
            title="Access restricted"
            message="You don't have permission to access this page."
          />
          <Button
            type="button"
            className="w-full"
            onClick={() => router.replace(getDashboardRoute(user.role))}
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * Verification Guard for Expert Sub-routes.
 * Wraps only the main content inside ExpertLayout, ensuring the Navbar
 * and ExpertSidebar remain completely stable when switching between tabs.
 */
export function ExpertVerificationGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isVerifiedExpert, verificationStatusLoading, checkExpertVerification } = useAuth();

  const isVerifiedOnlyRoute = VERIFIED_EXPERT_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  useEffect(() => {
    if (user?.role === "ROLE_EXPERT" && isVerifiedOnlyRoute && isVerifiedExpert === null) {
      checkExpertVerification();
    }
  }, [user?.role, isVerifiedOnlyRoute, isVerifiedExpert, checkExpertVerification]);

  // If not a verified-only route, render immediately without gate
  if (!isVerifiedOnlyRoute) {
    return <>{children}</>;
  }

  // If checking verification status, show main content skeleton (Navbar & Sidebar stay mounted!)
  if (verificationStatusLoading || isVerifiedExpert === null) {
    return (
      <div className="space-y-6 w-full" aria-busy="true" aria-label="Verifying credentials">
        <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 space-y-3 shadow-xs">
          <Skeleton className="h-7 w-60 rounded-xl" />
          <Skeleton className="h-4 w-96 rounded-md" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
        <Skeleton className="h-72 w-full rounded-3xl" />
      </div>
    );
  }

  // If unverified expert accesses a verified-only route -> render gate inside <main>
  if (isVerifiedExpert === false) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-[#FCD34D] rounded-3xl p-8 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#FEF3C7] border border-[#FCD34D] flex items-center justify-center text-[#F59E0B]">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-bold text-[#F59E0B] bg-[#FEF3C7] border border-[#FCD34D] px-3 py-1 rounded-full uppercase tracking-wider">
              Verification Required
            </span>
            <h3 className="text-xl font-black text-[#1F2937] pt-1">
              Verified Expert Feature
            </h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Your expert account has not been approved yet. Complete your application
              and wait for admin verification to access farmer consultations and verified advisory services.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              href="/expert/dashboard"
              className="w-full py-2.5 rounded-xl bg-[#1F2937] text-white text-xs font-bold hover:bg-[#1F2937] transition-colors flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </Link>
            <Link
              href="/expert/profile"
              className="w-full py-2.5 rounded-xl border border-[#E5E7EB] text-[#4B5563] text-xs font-semibold hover:bg-[#F8FAF8] transition-colors flex items-center justify-center gap-1.5"
            >
              <Award className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>Complete Profile &amp; Verification</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Verified expert -> render page content
  return <>{children}</>;
}
