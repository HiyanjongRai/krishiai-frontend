"use client";

import React, { useState, useEffect } from "react";
import { Wand2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/providers/auth-provider";
import { api } from "@/lib/api";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/providers/toast-provider";
import { getApiErrorMessage } from "@/lib/toast-utils";

// Dashboard Components
import { VerificationBanner } from "./VerificationBanner";
import { DashboardOverviewCards } from "./DashboardOverviewCards";
import { VerificationProgressTracker } from "./VerificationProgressTracker";
import { ExpertisePreviewSection } from "./ExpertisePreviewSection";
import { DocumentsPreviewSection } from "./DocumentsPreviewSection";

// Types
import {
  ExpertAccountStatus,
  VerificationStatus,
  ExpertDashboardState,
  ExpertExpertise,
  ExpertDocument,
} from "@/types/expert-verification";

export function PendingVerificationExpertDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<ExpertDashboardState | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [dismissedBanner, setDismissedBanner] = useState(false);

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // In a real app, this would fetch from your backend API
        // For now, we'll use mock data
        const mockData: ExpertDashboardState = {
          accountInfo: {
            accountStatus: "ACTIVE",
            verificationStatus: "UNDER_REVIEW",
            submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
            lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          },
          profileInfo: {
            id: "1",
            fullName: user?.fullName || "Agricultural Expert",
            email: user?.email || "expert@example.com",
            phone: "+977-1234567890",
            location: "Kathmandu",
            district: "Kathmandu",
            province: "Bagmati",
            qualification: "B.Sc. Agriculture",
            institution: "Tribhuwan University",
            graduationYear: 2018,
            specialization: "Crop Specialist",
            yearsOfExperience: 5,
            previousOrganization: "Ministry of Agriculture",
            professionalBio:
              "Experienced agricultural specialist with focus on vegetable cultivation and soil management.",
            profileCompletionPercentage: 75,
          },
          applicationProgress: {
            currentStage: "UNDER_REVIEW",
            submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            underReviewSince: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            submittedExpertise: [
              {
                id: "1",
                name: "Tomato",
                category: "CROP",
                status: "PENDING",
              },
              {
                id: "2",
                name: "Potato",
                category: "CROP",
                status: "PENDING",
              },
              {
                id: "3",
                name: "Pest Management",
                category: "PROFESSIONAL_EXPERTISE",
                status: "PENDING",
              },
            ],
            submittedDocuments: [
              {
                id: "1",
                name: "B.Sc. Agriculture Certificate",
                type: "CERTIFICATE",
                submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                status: "PENDING",
              },
              {
                id: "2",
                name: "Training Certificate",
                type: "CERTIFICATE",
                submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                status: "VERIFIED",
              },
              {
                id: "3",
                name: "Experience Letter",
                type: "LETTER",
                submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                status: "PENDING",
              },
            ],
          },
          recentActivity: [
            {
              id: "1",
              type: "APPLICATION_SUBMITTED",
              description: "Application submitted",
              timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: "2",
              type: "DOCUMENT_UPLOADED",
              description: "Training Certificate verified",
              timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: "3",
              type: "PROFILE_UPDATED",
              description: "Profile information updated",
              timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
            },
          ],
        };

        setDashboardData(mockData);
      } catch (err) {
        const errorMsg = getApiErrorMessage(err);
        setError(errorMsg);
        toast.error({
          title: "Failed to load dashboard data",
          description: errorMsg,
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
        <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-red-900 mb-1">
          Failed to Load Dashboard
        </h3>
        <p className="text-sm text-red-800 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-semibold transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const {
    accountInfo,
    profileInfo,
    applicationProgress,
    recentActivity,
  } = dashboardData;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-1">
          Welcome back, {profileInfo.fullName.split(" ")[0]} 👋
        </h1>
        <p className="text-base text-slate-600">
          Welcome to your KrishiAI Expert Portal
        </p>
      </div>

      {/* Verification Banner - Only show if not dismissed */}
      {!dismissedBanner && (
        <VerificationBanner
          status={accountInfo.verificationStatus}
          accountStatus={accountInfo.accountStatus}
          submittedAt={accountInfo.submittedAt}
          onDismiss={() => setDismissedBanner(true)}
        />
      )}

      {/* Overview Cards */}
      <DashboardOverviewCards
        accountStatus={accountInfo.accountStatus}
        verificationStatus={accountInfo.verificationStatus}
        expertiseCount={applicationProgress.submittedExpertise.length}
        profileCompletionPercentage={profileInfo.profileCompletionPercentage}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Verification Progress (spans 2 cols on lg) */}
        <div className="lg:col-span-2">
          <VerificationProgressTracker
            currentStatus={accountInfo.verificationStatus}
            submittedAt={accountInfo.submittedAt}
            underReviewSince={applicationProgress.underReviewSince}
            approvedAt={accountInfo.approvedAt}
          />
        </div>

        {/* Right Column - Profile Completion & Quick Actions */}
        <div className="space-y-6">
          {/* Profile Completion Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="text-base font-bold text-slate-900 mb-4">
              Complete Your Profile
            </h3>
            <div className="mb-4">
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                  style={{
                    width: `${profileInfo.profileCompletionPercentage}%`,
                  }}
                />
              </div>
              <div className="text-sm font-semibold text-slate-900 mt-2">
                {profileInfo.profileCompletionPercentage}% Complete
              </div>
            </div>

            <div className="space-y-2 mb-4 text-sm">
              {profileInfo.professionalBio ? (
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="text-emerald-600">✓</span>
                  <span>Professional bio</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="text-slate-300">○</span>
                  <span>Add professional bio</span>
                </div>
              )}

              {profileInfo.yearsOfExperience ? (
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="text-emerald-600">✓</span>
                  <span>Experience information</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="text-slate-300">○</span>
                  <span>Add experience details</span>
                </div>
              )}

              {applicationProgress.submittedDocuments.length > 0 ? (
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="text-emerald-600">✓</span>
                  <span>Documents uploaded</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="text-slate-300">○</span>
                  <span>Upload documents</span>
                </div>
              )}
            </div>

            <Link
              href="/expert/profile"
              className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors text-center"
            >
              Complete Profile
            </Link>
          </div>

          {/* Quick Tips Card */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl border border-emerald-200 p-6">
            <div className="flex items-start gap-3 mb-3">
              <Wand2 className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
              <h3 className="text-base font-bold text-emerald-950">
                Tips to Get Verified Faster
              </h3>
            </div>

            <ul className="space-y-2 text-sm text-emerald-900">
              <li className="flex gap-2">
                <span>✓</span>
                <span>Ensure all documents are clear and valid</span>
              </li>
              <li className="flex gap-2">
                <span>✓</span>
                <span>Add detailed experience in your profile</span>
              </li>
              <li className="flex gap-2">
                <span>✓</span>
                <span>Select the most relevant expertise areas</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Grid - Expertise & Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Expertise Preview */}
        <ExpertisePreviewSection
          expertise={applicationProgress.submittedExpertise}
          maxDisplay={4}
        />

        {/* Documents Preview */}
        <DocumentsPreviewSection
          documents={applicationProgress.submittedDocuments}
          maxDisplay={3}
        />
      </div>

      {/* Recent Activity Section */}
      {recentActivity && recentActivity.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Activity</h3>

          <div className="space-y-3">
            {recentActivity.slice(0, 5).map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 text-xs">
                  {activity.type === "APPLICATION_SUBMITTED" && "📋"}
                  {activity.type === "DOCUMENT_UPLOADED" && "📄"}
                  {activity.type === "EXPERTISE_ADDED" && "🌱"}
                  {activity.type === "PROFILE_UPDATED" && "👤"}
                  {activity.type === "VERIFICATION_APPROVED" && "✓"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-slate-900">
                    {activity.description}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {new Date(activity.timestamp).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
