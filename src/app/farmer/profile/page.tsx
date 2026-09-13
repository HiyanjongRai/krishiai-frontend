"use client";

import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { ProfileImageUpload } from "@/components/ui/profile-image-upload";
import { ChangePasswordModal } from "@/components/auth/ChangePasswordModal";

export default function FarmerProfilePage() {
  const { user, updateUser } = useAuth();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-5">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-[#0F9F68]">
          Farmer Account
        </p>
        <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-[#171717]">
          Profile &amp; Settings
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-gray-500 font-medium">
          Manage your contact details, profile photo, and account security.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Account info (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Account info card */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 shadow-2xs border border-emerald-100">
                <User className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Account Information</h3>
                <p className="text-xs text-slate-500 font-medium">Your personal details on KrishiAI</p>
              </div>
            </div>

            <div className="space-y-2.5 pt-1">
              <div className="flex items-center gap-3 p-3.5 rounded-lg bg-slate-50/60 border border-slate-200/80">
                <User className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Full Name</p>
                  <p className="text-sm font-semibold text-slate-900">{user?.fullName || "—"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-lg bg-slate-50/60 border border-slate-200/80">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Email Address</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900">{user?.email || "—"}</p>
                    {user?.emailVerified && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-lg bg-slate-50/60 border border-slate-200/80">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Phone Number</p>
                  <p className="text-sm font-semibold text-slate-900">{user?.phone || "Not provided"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Security card */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-700 shadow-2xs border border-amber-100">
                <KeyRound className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Account Security</h3>
                <p className="text-xs text-slate-500 font-medium">Manage your credentials</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg bg-slate-50/60 border border-slate-200/80">
              <div>
                <p className="text-xs font-bold text-slate-900">Account Password</p>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  Update your password to keep your account secure.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(true)}
                className="w-full sm:w-auto rounded-lg bg-emerald-700 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-800 transition-colors cursor-pointer shrink-0 min-h-[40px] text-center"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Profile Photo (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 shadow-2xs border border-emerald-100">
                <ShieldCheck className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Profile Photo</h3>
                <p className="text-xs text-slate-500 font-medium">Avatar displayed to specialists and advisors</p>
              </div>
            </div>

            <div className="flex justify-center py-3">
              <ProfileImageUpload
                currentImageUrl={user?.profileImage}
                userName={user?.fullName}
                onUploadSuccess={updateUser}
                onRemoveSuccess={updateUser}
                size="lg"
              />
            </div>
          </div>

          {/* Role info card */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Account Type</span>
                <span className="font-semibold text-emerald-700">Farmer</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Account Status</span>
                <span className="font-semibold text-slate-900">{user?.status || "—"}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 font-medium">Member Since</span>
                <span className="font-bold text-gray-800">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "—"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
}
