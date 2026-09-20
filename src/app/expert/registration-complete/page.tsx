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
    <div className="min-h-screen bg-gradient-to-b from-[#F1F5F2] to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Success Animation Container */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              {/* Animated circle background */}
              <div className="absolute inset-0 bg-[#E8F5E9] rounded-full animate-pulse" />
              <div className="relative flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#E8F5E9] to-[#E8F5E9] rounded-full shadow-lg">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-[#1F2937] mb-2">
            🎉 Application Submitted
          </h1>
          <p className="text-base text-[#4B5563] mb-2">
            Welcome to KrishiAI, {user?.fullName?.split(" ")[0] || "Expert"}!
          </p>
          <p className="text-sm text-[#6B7280]">
            Your professional information and documents have been submitted successfully.
          </p>
        </div>

        {/* Main Message Card */}
        <div className="bg-white border border-[#A5D6A7] rounded-2xl p-6 mb-6 shadow-sm">
          <h2 className="font-semibold text-[#1F2937] mb-3">What&apos;s Next?</h2>

          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#E8F5E9] flex-shrink-0 font-bold text-[#2E7D32] text-sm">
                1
              </div>
              <div>
                <div className="font-medium text-sm text-[#1F2937]">
                  Verification Review
                </div>
                <div className="text-xs text-[#4B5563] mt-0.5">
                  Our admin team will review your application and expertise
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#E8F5E9] flex-shrink-0 font-bold text-[#2E7D32] text-sm">
                2
              </div>
              <div>
                <div className="font-medium text-sm text-[#1F2937]">
                  Track Progress
                </div>
                <div className="text-xs text-[#4B5563] mt-0.5">
                  Monitor your verification status from your dashboard
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#E8F5E9] flex-shrink-0 font-bold text-[#2E7D32] text-sm">
                3
              </div>
              <div>
                <div className="font-medium text-sm text-[#1F2937]">
                  Get Verified
                </div>
                <div className="text-xs text-[#4B5563] mt-0.5">
                  Once approved, start providing professional guidance
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Progress Preview */}
        <div className="bg-gradient-to-r from-[#FEF3C7] to-[#FEF3C7] border border-[#FCD34D] rounded-2xl p-5 mb-6">
          <div className="text-xs font-bold text-[#F59E0B] uppercase tracking-wide mb-3">
            Your Verification Journey
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col items-center flex-1">
              <div className="w-8 h-8 rounded-full bg-[#2E7D32] flex items-center justify-center text-white text-sm font-bold mb-1">
                ✓
              </div>
              <div className="text-[10px] font-semibold text-[#1F2937] text-center">
                Submitted
              </div>
            </div>

            <div className="flex-1 h-1 bg-[#FEF3C7] mx-1" />

            <div className="flex flex-col items-center flex-1">
              <div className="w-8 h-8 rounded-full bg-[#F59E0B] flex items-center justify-center text-white text-sm font-bold mb-1 animate-pulse">
                ⏳
              </div>
              <div className="text-[10px] font-semibold text-[#1F2937] text-center">
                Under Review
              </div>
            </div>

            <div className="flex-1 h-1 bg-[#D1D5DB] mx-1" />

            <div className="flex flex-col items-center flex-1">
              <div className="w-8 h-8 rounded-full bg-[#D1D5DB] flex items-center justify-center text-[#4B5563] text-sm font-bold mb-1">
                ○
              </div>
              <div className="text-[10px] font-semibold text-[#1F2937] text-center">
                Verified
              </div>
            </div>
          </div>
        </div>

        {/* Key Information Cards */}
        <div className="space-y-3 mb-6">
          <div className="bg-[#F8FAF8] border border-[#E5E7EB] rounded-xl p-4">
            <div className="text-xs font-bold text-[#4B5563] uppercase tracking-wide mb-1">
              Account Status
            </div>
            <div className="text-sm font-semibold text-[#2E7D32]">
              ✓ Active
            </div>
            <div className="text-xs text-[#4B5563] mt-1">
              Your account is ready to use immediately
            </div>
          </div>

          <div className="bg-[#F8FAF8] border border-[#E5E7EB] rounded-xl p-4">
            <div className="text-xs font-bold text-[#4B5563] uppercase tracking-wide mb-1">
              Application Status
            </div>
            <div className="text-sm font-semibold text-[#F59E0B]">
              ⏳ Under Review
            </div>
            <div className="text-xs text-[#4B5563] mt-1">
              We&apos;ll notify you via email when verification is complete
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleProceedToDashboard}
            className="w-full px-6 py-3 bg-gradient-to-r from-[#E8F5E9] to-[#E8F5E9] hover:from-[#E8F5E9] hover:to-[#E8F5E9] text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            Go to Expert Dashboard
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleViewApplication}
            className="w-full px-6 py-3 bg-white border border-[#D1D5DB] hover:border-[#E5E7EB] text-[#1F2937] font-semibold rounded-xl transition-colors hover:bg-[#F8FAF8]"
          >
            View Application Status
          </button>
        </div>

        {/* Auto-redirect message */}
        <div className="mt-6 text-center text-xs text-[#6B7280]">
          {autoRedirect ? (
            <div>Redirecting to dashboard...</div>
          ) : (
            <div>
              Redirecting automatically in{" "}
              <span className="font-semibold text-[#4B5563]">5 seconds</span>
            </div>
          )}
        </div>

        {/* Footer Help */}
        <div className="mt-8 pt-6 border-t border-[#E5E7EB] text-center">
          <div className="text-xs text-[#4B5563] mb-2">Need help?</div>
          <Link
            href="/contact"
            className="text-xs font-semibold text-[#2E7D32] hover:text-[#2E7D32] transition-colors"
          >
            Contact support
          </Link>
        </div>
      </div>
    </div>
  );
}
