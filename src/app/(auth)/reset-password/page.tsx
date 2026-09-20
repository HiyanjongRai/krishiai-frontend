"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, KeyRound, Lock, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resetPassword } from "@/services/auth/authService";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Reset token is missing or invalid. Please request a new password reset link.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (!/(?=.*[A-Za-z])(?=.*\d)/.test(newPassword)) {
      setError("Password must contain at least one letter and one number.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await resetPassword({
        token,
        newPassword,
        confirmPassword,
      });
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Password reset failed. The link may have expired.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-[#E5E7EB] shadow-xl space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-[#E8F5E9] text-[#2E7D32] rounded-2xl flex items-center justify-center mx-auto border border-[#C8E6C9]">
          <KeyRound className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black text-[#1F2937]">Set New Password</h1>
        <p className="text-xs text-[#6B7280] max-w-xs mx-auto">
          Choose a secure password with at least 8 characters, including letters and numbers.
        </p>
      </div>

      {!token && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FEF3C7] border border-[#FCD34D] text-[#F59E0B] text-xs font-medium">
          <ShieldAlert className="w-4 h-4 text-[#F59E0B]0 shrink-0 mt-0.5" />
          <span>No reset token detected in link. Please click the full link sent to your email.</span>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FEE2E2] border border-[#FCA5A5] text-[#DC2626] text-xs font-medium">
          <ShieldAlert className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {isSuccess ? (
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#E8F5E9] border border-[#A5D6A7] text-[#1B5E20] text-xs leading-relaxed">
            <CheckCircle2 className="w-5 h-5 text-[#2E7D32] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-[#1B5E20]">Password Reset Complete</p>
              <p className="mt-0.5 text-[#2E7D32]">
                Your password has been successfully updated! Redirecting to sign in...
              </p>
            </div>
          </div>
          <Button className="w-full" onClick={() => router.push("/")}>
            Sign In Now
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="New Password"
            type="password"
            placeholder="At least 8 chars (letters & numbers)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            disabled={!token || isLoading}
          />

          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Repeat new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={!token || isLoading}
          />

          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
            loadingText="Resetting Password..."
            disabled={!token || isLoading}
          >
            Update Password
          </Button>
        </form>
      )}

      <div className="pt-2 border-t border-[#EEF0EE] text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2E7D32] hover:text-[#1B5E20] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Home</span>
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F8FAF8]">
      <Suspense
        fallback={
          <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-[#E5E7EB] shadow-xl text-center py-16">
            <p className="text-sm font-semibold text-[#6B7280]">Loading reset session...</p>
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
