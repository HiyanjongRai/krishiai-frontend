"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Mail, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { forgotPassword } from "@/services/auth/authService";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your registered email address.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await forgotPassword(email.trim());
      setIsSuccess(true);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to send reset link. Please try again.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F8FAF8]">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-[#E5E7EB] shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#E8F5E9] text-[#2E7D32] rounded-2xl flex items-center justify-center mx-auto border border-[#C8E6C9]">
            <Mail className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-[#1F2937]">Reset Password</h1>
          <p className="text-xs text-[#6B7280] max-w-xs mx-auto">
            Enter your email and we will send you secure instructions to reset your account password.
          </p>
        </div>

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
                <p className="font-bold text-[#1B5E20]">Check your inbox</p>
                <p className="mt-0.5 text-[#2E7D32]">
                  If an account exists for <span className="font-semibold">{email}</span>, you will receive a password reset link shortly. Please check your spam folder as well.
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setIsSuccess(false);
                setEmail("");
              }}
            >
              Send another email
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Registered Email Address"
              type="email"
              placeholder="e.g. ram.shrestha@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />

            <Button type="submit" className="w-full" isLoading={isLoading} loadingText="Sending Instructions...">
              Send Reset Link
            </Button>
          </form>
        )}

        <div className="pt-2 border-t border-[#EEF0EE] text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2E7D32] hover:text-[#1B5E20] hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Home &amp; Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
