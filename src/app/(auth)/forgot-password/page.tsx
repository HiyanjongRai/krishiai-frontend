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
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f8faf7]">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto border border-emerald-100">
            <Mail className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Reset Password</h1>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Enter your email and we will send you secure instructions to reset your account password.
          </p>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
            <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {isSuccess ? (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs leading-relaxed">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-emerald-900">Check your inbox</p>
                <p className="mt-0.5 text-emerald-700">
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

        <div className="pt-2 border-t border-slate-100 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Home &amp; Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
