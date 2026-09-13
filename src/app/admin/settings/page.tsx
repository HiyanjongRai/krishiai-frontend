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

export default function AdminSettingsPage() {
  const { user, updateUser } = useAuth();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          System Settings &amp; Security
        </h1>
        <p className="mt-0.5 text-xs text-slate-500">
          Manage administrator credentials, session rotation policies, and platform configurations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Security & Authentication (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Account Security Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                  <KeyRound className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Authentication &amp; Credentials</h3>
                  <p className="text-[11px] text-slate-500">Update password and manage session revocation</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <p className="text-xs font-semibold text-slate-900">Account Password</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Changing your password immediately revokes active refresh tokens on other devices.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="w-full sm:w-auto rounded-lg bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition-colors cursor-pointer shrink-0"
                >
                  Change Password
                </button>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-emerald-600" />
                    Token Rotation &amp; Session Invalidation
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                    Active
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Single active refresh token policy enforced. Automatic token rotation upon silent refresh, and cryptographic SHA-256 hashed storage.
                </p>
              </div>
            </div>
          </div>

          {/* Platform Infrastructure Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-200/60">
                <Server className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Microservices &amp; Diagnostic Backends</h3>
                <p className="text-[11px] text-slate-500">Agricultural AI models and external weather APIs</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-800">FastAPI AI Engine</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                </div>
                <p className="text-[10px] text-slate-500">YOLOv8 &amp; ResNet50 Leaf Diagnostic Service</p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-800">Weather Advisory Feed</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                </div>
                <p className="text-[10px] text-slate-500">Microclimate precipitation &amp; advisory sync</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Administrator Profile (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-start gap-3.5">
              <ProfileImageUpload
                currentImageUrl={user?.profileImage}
                userName={user?.fullName || "Administrator"}
                onUploadSuccess={updateUser}
                onRemoveSuccess={updateUser}
                size="md"
              />
              <div className="flex-1 min-w-0 pt-0.5">
                <h3 className="text-sm font-bold text-slate-900">{user?.fullName || "Platform Admin"}</h3>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 mt-1.5 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  ROLE_ADMIN
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Access Tier</span>
                <span className="font-semibold text-slate-800">Full System Governance</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">User Moderation</span>
                <span className="font-semibold text-emerald-700">Block / Unblock Enabled</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Expert Certification</span>
                <span className="font-semibold text-emerald-700">Audit &amp; Crop Verification</span>
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
