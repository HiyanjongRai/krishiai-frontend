"use client";

import React, { useState } from "react";
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth } from "@/providers/auth-provider";
import { useToast } from "@/providers/toast-provider";
import { getApiErrorMessage } from "@/lib/toast-utils";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const { changePassword } = useAuth();
  const { toast } = useToast();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resetForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);
    setErrorMessage(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!currentPassword) {
      setErrorMessage("Please enter your current password.");
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      setErrorMessage("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("New password and confirm password do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setErrorMessage("New password must be different from your current password.");
      return;
    }

    setIsSubmitting(true);
    try {
      await changePassword({ currentPassword, newPassword, confirmPassword });
      toast.success({
        title: "Password updated",
        description: "Your password has been changed successfully. Active sessions on other devices were revoked.",
      });
      handleClose();
    } catch (err) {
      const msg = getApiErrorMessage(err, "Failed to change password. Please try again.");
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Change Password">
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        {errorMessage && (
          <div className="flex items-start gap-2.5 rounded-2xl bg-rose-50 border border-rose-200 p-3.5 text-xs text-rose-800">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <p className="font-medium">{errorMessage}</p>
          </div>
        )}

        {/* Current Password */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isSubmitting}
              className="h-10 w-full rounded-2xl border border-gray-200 bg-gray-50/50 px-3.5 pr-10 text-xs font-medium text-gray-900 outline-none focus:border-[#0F9F68] focus:bg-white focus:ring-3 focus:ring-[#0F9F68]/15 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">
            New Password
          </label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              disabled={isSubmitting}
              className="h-10 w-full rounded-2xl border border-gray-200 bg-gray-50/50 px-3.5 pr-10 text-xs font-medium text-gray-900 outline-none focus:border-[#0F9F68] focus:bg-white focus:ring-3 focus:ring-[#0F9F68]/15 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="mt-1 text-[11px] text-gray-400">Must be at least 8 characters</p>
        </div>

        {/* Confirm New Password */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-type new password"
              disabled={isSubmitting}
              className="h-10 w-full rounded-2xl border border-gray-200 bg-gray-50/50 px-3.5 pr-10 text-xs font-medium text-gray-900 outline-none focus:border-[#0F9F68] focus:bg-white focus:ring-3 focus:ring-[#0F9F68]/15 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="rounded-full px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-full bg-[#0F9F68] px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#0D8A5A] transition-all cursor-pointer disabled:opacity-50 active:scale-95"
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="xs" color="white" />
                <span>Updating...</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>Update Password</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
