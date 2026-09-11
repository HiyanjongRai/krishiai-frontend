"use client";

import React, { useState } from "react";
import {
  KeyRound,
  Shield,
  UserCheck,
  Server,
  Sparkles,
  Lock,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { ChangePasswordModal } from "@/components/auth/ChangePasswordModal";

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-5">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-[#0F9F68]">
          Platform Administration
        </p>
        <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-[#171717]">
          System Settings &amp; Security
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-gray-500 font-medium">
          Manage administrator credentials, session rotation policies, and platform configurations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Security & Authentication (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Account Security Card */}
          <div className="rounded-[28px] border border-[rgba(234,234,236,0.85)] bg-white p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#DDF4EA] text-[#0F9F68] shadow-2xs">
                  <KeyRound className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-[#171717]">Authentication &amp; Credentials</h3>
                  <p className="text-[11px] text-gray-400 font-medium">Update password and manage session revocation</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F4F4F6]/60 border border-gray-100">
                <div>
                  <p className="text-xs font-bold text-[#171717]">Account Password</p>
                  <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                    Changing your password immediately revokes active refresh tokens on other devices.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="rounded-full bg-[#0F9F68] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#0D8A5A] transition-all cursor-pointer active:scale-95 shrink-0"
                >
                  Change Password
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-[#F4F4F6]/60 border border-gray-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#171717] flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-[#0F9F68]" />
                    Token Rotation &amp; Session Invalidation
                  </span>
                  <span className="text-[10px] font-bold text-[#0F9F68] bg-[#DDF4EA] border border-[#BCE9D5] px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                  Single active refresh token policy enforced. Automatic token rotation upon silent refresh, and cryptographic SHA-256 hashed storage.
                </p>
              </div>
            </div>
          </div>

          {/* Platform Infrastructure Card */}
          <div className="rounded-[28px] border border-[rgba(234,234,236,0.85)] bg-white p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)] space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-2xs">
                <Server className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-[#171717]">Microservices &amp; Diagnostic Backends</h3>
                <p className="text-[11px] text-gray-400 font-medium">Agricultural AI models and external weather APIs</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-2xl border border-gray-100 bg-[#F4F4F6]/40 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-800">FastAPI AI Engine</span>
                  <span className="w-2 h-2 rounded-full bg-[#0F9F68]" />
                </div>
                <p className="text-[10px] text-gray-400">YOLOv8 &amp; ResNet50 Leaf Diagnostic Service</p>
              </div>

              <div className="p-3.5 rounded-2xl border border-gray-100 bg-[#F4F4F6]/40 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-800">Weather Advisory Feed</span>
                  <span className="w-2 h-2 rounded-full bg-[#0F9F68]" />
                </div>
                <p className="text-[10px] text-gray-400">Microclimate precipitation &amp; advisory sync</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Administrator Profile (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-[28px] border border-[rgba(234,234,236,0.85)] bg-white p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)] space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#0F9F68] to-[#0A6B45] text-white flex items-center justify-center font-black text-lg shadow-sm">
                {user?.fullName
                  ? user.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()
                  : "AD"}
              </div>
              <div>
                <h3 className="text-base font-bold text-[#171717]">{user?.fullName || "Platform Admin"}</h3>
                <p className="text-xs text-gray-500 font-medium">{user?.email}</p>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#DDF4EA] px-2.5 py-0.5 text-[10px] font-black text-[#0F9F68] mt-1 border border-[#BCE9D5]">
                  <CheckCircle2 className="w-3 h-3" />
                  ROLE_ADMIN
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 space-y-2.5 text-xs">
              <div className="flex justify-between py-1">
                <span className="text-gray-400 font-medium">Access Tier</span>
                <span className="font-bold text-gray-800">Full System Governance</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-400 font-medium">User Moderation</span>
                <span className="font-bold text-[#0F9F68]">Block / Unblock Enabled</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-400 font-medium">Expert Certification</span>
                <span className="font-bold text-[#0F9F68]">Audit &amp; Crop Verification</span>
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
