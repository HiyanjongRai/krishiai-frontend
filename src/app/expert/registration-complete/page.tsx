/**
 * Expert Registration Completion Page
 * Shown immediately after expert completes registration and submits their application
 * This is a transient page - expert proceeds to dashboard after viewing
 */

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";

export default function ExpertRegistrationCompletionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [autoRedirect, setAutoRedirect] = useState(false);

  // Auto-redirect after 5 seconds (unless user interacts)
  useEffect(() => {
    const timer = setTimeout(() => {
      setAutoRedirect(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (autoRedirect) {
      router.push("/expert/dashboard");
    }
  }, [autoRedirect, router]);

  const handleProceedToDashboard = () => {
    router.push("/expert/dashboard");
  };

  const handleViewApplication = () => {
    router.push("/expert/application");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Success Animation Container */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              {/* Animated circle background */}
              <div className="absolute inset-0 bg-emerald-100 rounded-full animate-pulse" />
              <div className="relative flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full shadow-lg">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            🎉 Application Submitted
          </h1>
          <p className="text-base text-slate-600 mb-2">
            Welcome to KrishiAI, {user?.fullName?.split(" ")[0] || "Expert"}!
          </p>
          <p className="text-sm text-slate-500">
            Your professional information and documents have been submitted successfully.
          </p>
        </div>

        {/* Main Message Card */}
        <div className="bg-white border border-emerald-200 rounded-2xl p-6 mb-6 shadow-sm">
          <h2 className="font-semibold text-slate-900 mb-3">What's Next?</h2>

          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 flex-shrink-0 font-bold text-emerald-700 text-sm">
                1
              </div>
              <div>
                <div className="font-medium text-sm text-slate-900">
                  Verification Review
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  Our admin team will review your application and expertise
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 flex-shrink-0 font-bold text-emerald-700 text-sm">
                2
              </div>
              <div>
                <div className="font-medium text-sm text-slate-900">
                  Track Progress
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  Monitor your verification status from your dashboard
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 flex-shrink-0 font-bold text-emerald-700 text-sm">
                3
              </div>
              <div>
                <div className="font-medium text-sm text-slate-900">
                  Get Verified
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  Once approved, start providing professional guidance
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Progress Preview */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 mb-6">
          <div className="text-xs font-bold text-amber-900 uppercase tracking-wide mb-3">
            Your Verification Journey
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col items-center flex-1">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-sm font-bold mb-1">
                ✓
              </div>
              <div className="text-[10px] font-semibold text-slate-900 text-center">
                Submitted
              </div>
            </div>

            <div className="flex-1 h-1 bg-amber-300 mx-1" />

            <div className="flex flex-col items-center flex-1">
              <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white text-sm font-bold mb-1 animate-pulse">
                ⏳
              </div>
              <div className="text-[10px] font-semibold text-slate-900 text-center">
                Under Review
              </div>
            </div>

            <div className="flex-1 h-1 bg-slate-300 mx-1" />

            <div className="flex flex-col items-center flex-1">
              <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center text-slate-600 text-sm font-bold mb-1">
                ○
              </div>
              <div className="text-[10px] font-semibold text-slate-900 text-center">
                Verified
              </div>
            </div>
          </div>
        </div>

        {/* Key Information Cards */}
        <div className="space-y-3 mb-6">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
              Account Status
            </div>
            <div className="text-sm font-semibold text-emerald-700">
              ✓ Active
            </div>
            <div className="text-xs text-slate-600 mt-1">
              Your account is ready to use immediately
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
              Application Status
            </div>
            <div className="text-sm font-semibold text-amber-700">
              ⏳ Under Review
            </div>
            <div className="text-xs text-slate-600 mt-1">
              We'll notify you via email when verification is complete
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleProceedToDashboard}
            className="w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            Go to Expert Dashboard
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleViewApplication}
            className="w-full px-6 py-3 bg-white border border-slate-300 hover:border-slate-400 text-slate-900 font-semibold rounded-xl transition-colors hover:bg-slate-50"
          >
            View Application Status
          </button>
        </div>

        {/* Auto-redirect message */}
        <div className="mt-6 text-center text-xs text-slate-500">
          {autoRedirect ? (
            <div>Redirecting to dashboard...</div>
          ) : (
            <div>
              Redirecting automatically in{" "}
              <span className="font-semibold text-slate-700">5 seconds</span>
            </div>
          )}
        </div>

        {/* Footer Help */}
        <div className="mt-8 pt-6 border-t border-slate-200 text-center">
          <div className="text-xs text-slate-600 mb-2">Need help?</div>
          <Link
            href="/contact"
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            Contact support
          </Link>
        </div>
      </div>
    </div>
  );
}
