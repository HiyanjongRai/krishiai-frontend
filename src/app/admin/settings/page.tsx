"use client";

import React, { useState } from "react";
import {
  KeyRound,
  Shield,
  Server,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { ChangePasswordModal } from "@/components/auth/ChangePasswordModal";
import { ProfileImageUpload } from "@/components/ui/profile-image-upload";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

export default function AdminSettingsPage() {
  const { user, updateUser } = useAuth();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <AdminPageHeader
        title="System Settings & Security"
        subtitle="Manage administrator credentials, session rotation policies, and platform configurations."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Security & Authentication (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Account Security Card */}
          <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-6 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE] space-y-4">
            <div className="flex items-center justify-between pb-3.5 border-b border-[#EEF0EE]">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8F5E9] text-[#2E7D32]">
                  <KeyRound className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-[#1F2937]">Authentication &amp; Credentials</h3>
                  <p className="text-[11px] text-[#6B7280] font-medium">Update password and manage session revocation</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-[18px] bg-[#F8FAF8] border border-[#E5E7EB]">
                <div>
                  <p className="text-xs font-bold text-[#1F2937]">Account Password</p>
                  <p className="text-[11px] text-[#6B7280] mt-0.5 font-medium">
                    Changing your password immediately revokes active refresh tokens on other devices.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="w-full sm:w-auto rounded-full bg-[#2E7D32] hover:bg-[#256B2A] px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors cursor-pointer shrink-0"
                >
                  Change Password
                </button>
              </div>

              <div className="p-4 rounded-[18px] bg-[#F8FAF8] border border-[#E5E7EB] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1F2937] flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#2E7D32]" />
                    Token Rotation &amp; Session Invalidation
                  </span>
                  <span className="text-[10px] font-bold text-[#2E7D32] bg-[#E8F5E9] border border-[#A5D6A7] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]" />
                    Active
                  </span>
                </div>
                <p className="text-[11px] text-[#6B7280] leading-relaxed font-medium">
                  Single active refresh token policy enforced. Automatic token rotation upon silent refresh, and cryptographic SHA-256 hashed storage.
                </p>
              </div>
            </div>
          </div>

          {/* Platform Infrastructure Card */}
          <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-6 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE] space-y-4">
            <div className="flex items-center gap-3 pb-3.5 border-b border-[#EEF0EE]">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF2FF] text-[#4F46E5]">
                <Server className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-[#1F2937]">Microservices &amp; Diagnostic Backends</h3>
                <p className="text-[11px] text-[#6B7280] font-medium">Agricultural AI models and external weather APIs</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              <div className="p-4 rounded-[18px] border border-[#E5E7EB] bg-[#F8FAF8] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1F2937]">FastAPI AI Engine</span>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-[#2E7D32]">
                    <span className="w-2 h-2 rounded-full bg-[#2E7D32] animate-pulse" /> Live
                  </span>
                </div>
                <p className="text-[11px] text-[#6B7280] font-medium">YOLOv8 &amp; ResNet50 Leaf Diagnostic Service</p>
              </div>

              <div className="p-4 rounded-[18px] border border-[#E5E7EB] bg-[#F8FAF8] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1F2937]">Weather Advisory Feed</span>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-[#2E7D32]">
                    <span className="w-2 h-2 rounded-full bg-[#2E7D32] animate-pulse" /> Live
                  </span>
                </div>
                <p className="text-[11px] text-[#6B7280] font-medium">Microclimate precipitation &amp; advisory sync</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Administrator Profile (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-6 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE] space-y-5">
            <div className="flex items-start gap-4">
              <ProfileImageUpload
                currentImageUrl={user?.profileImage}
                userName={user?.fullName || "Administrator"}
                onUploadSuccess={updateUser}
                onRemoveSuccess={updateUser}
                size="md"
              />
              <div className="flex-1 min-w-0 pt-0.5">
                <h3 className="text-base font-black text-[#1F2937]">{user?.fullName || "Platform Admin"}</h3>
                <p className="text-xs text-[#6B7280] font-medium truncate">{user?.email}</p>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F5E9] px-3 py-1 text-[10px] font-bold text-[#2E7D32] mt-2 border border-[#A5D6A7]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />
                  ROLE_ADMIN
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#EEF0EE] space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-[#EEF0EE]">
                <span className="text-[#6B7280] font-medium">Access Tier</span>
                <span className="font-bold text-[#1F2937]">Full System Governance</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#EEF0EE]">
                <span className="text-[#6B7280] font-medium">User Moderation</span>
                <span className="font-bold text-[#2E7D32]">Block / Unblock Enabled</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-[#6B7280] font-medium">Expert Certification</span>
                <span className="font-bold text-[#2E7D32]">Audit &amp; Crop Verification</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
}
