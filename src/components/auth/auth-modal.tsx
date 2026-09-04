"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthModal } from "@/providers/auth-modal-provider";
import { useAuth, getDashboardRoute } from "@/providers/auth-provider";
import { ApiError } from "@/lib/api";
import type { RegisterRequest } from "@/types/auth";
import {
  Sprout,
  Leaf,
  Wheat,
  CloudSun,
  X,
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

export function AuthModal() {
  const router = useRouter();
  const { isOpen, mode, closeModal, setMode } = useAuthModal();
  const { login, register } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<string[]>([]);

  // Reset all states when modal opens or closes or mode changes
  useEffect(() => {
    setLoading(false);
    setRedirecting(false);
    setErrorMessage("");
    setFieldErrors([]);
  }, [isOpen, mode]);

  const handleClose = () => {
    setLoading(false);
    setRedirecting(false);
    setErrorMessage("");
    setFieldErrors([]);
    closeModal();
  };

  // ESC to close + lock body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Full-screen Blur & Circle Loading Screen (No white modal box during loading)
  if (loading || redirecting) {
    return (
      <div className="fixed inset-0 z-50 backdrop-blur-xl bg-slate-900/30 flex items-center justify-center p-4 animate-in fade-in duration-200">
        {/* Ambient soft green aura */}
        <div className="absolute w-72 h-72 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none" />

        {/* Circular Glass Capsule */}
        <div className="relative w-52 h-52 rounded-full bg-white/90 backdrop-blur-2xl border border-white/80 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col items-center justify-center p-5 text-center animate-in zoom-in-95 duration-200">
          
          {/* Outer circular spinning gradient arc */}
          <div
            className="absolute -inset-1.5 rounded-full border-[3px] border-transparent border-t-emerald-500 border-r-lime-400 animate-spin pointer-events-none"
            style={{ animationDuration: "1.2s" }}
          />

          {/* Center circular icon */}
          <div className="relative z-10 w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-600/30 text-white mb-2">
            <Leaf className="w-6 h-6 text-white" strokeWidth={2.2} />
          </div>

          {/* Title inside circle */}
          <h4 className="relative z-10 text-sm font-bold text-[#17201A] tracking-tight leading-tight px-1">
            {redirecting
              ? mode === "login"
                ? "Welcome Back! 🌿"
                : "Account Created! 🌱"
              : mode === "login"
              ? "Signing You In..."
              : "Creating Account..."}
          </h4>

          {/* Subtitle inside circle */}
          <p className="relative z-10 text-[11px] text-[#647067] mt-1 max-w-[140px] truncate leading-tight">
            {redirecting ? "Loading dashboard..." : "Please wait a moment..."}
          </p>

          {/* Bouncing progress dots */}
          <div className="relative z-10 flex gap-1.5 mt-2.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setFieldErrors([]);

    try {
      if (mode === "login") {
        const res = await login(email, password);
        setRedirecting(true);
        setTimeout(() => {
          setLoading(false);
          setRedirecting(false);
          closeModal();
          router.push(getDashboardRoute(res.user.role));
        }, 1100);
      } else {
        const payload: RegisterRequest = {
          email,
          password,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phone: phone.trim() || undefined,
          role: "ROLE_FARMER",
        };
        const res = await register(payload);
        setRedirecting(true);
        setTimeout(() => {
          setLoading(false);
          setRedirecting(false);
          closeModal();
          router.push(getDashboardRoute(res.role));
        }, 1100);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
        if (err.errors && err.errors.length > 0) {
          setFieldErrors(err.errors);
        }
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
      setLoading(false);
    }
  };

  const handleOAuthDemo = (provider: string) => {
    setErrorMessage(`Single Sign-On with ${provider} will be available in production.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      />

      {/* Modern SaaS Modal Container */}
      <div className="relative w-full max-w-[380px] h-[515px] bg-white rounded-2xl p-4 sm:p-5 border border-[#E2E8E3] shadow-[0_20px_45px_-12px_rgba(0,0,0,0.15)] z-10 overflow-hidden animate-in zoom-in-95 duration-150 text-[#17201A] flex flex-col">
        
        {/* Subtle Accent Glow */}
        <div className="absolute -top-12 -right-12 w-28 h-28 rounded-full bg-emerald-50/70 -z-0 pointer-events-none" />

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3.5 right-3.5 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors z-20 cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Brand Header */}
        <div className="space-y-2 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-[#F0FDF4] border border-emerald-200/90 flex items-center justify-center text-[#166534] shadow-2xs">
              <Sprout className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#17201A] tracking-tight leading-none">
                Krishi<span className="text-[#166534]">AI</span>
              </h3>
              <span className="text-[9px] font-bold text-[#166534] uppercase tracking-wider">
                Agricultural Advisory
              </span>
            </div>
          </div>

          <div className="h-[36px] flex flex-col justify-center">
            <h2 className="text-base font-bold text-[#17201A] tracking-tight leading-tight">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-[11px] text-[#647067] truncate">
              {mode === "login"
                ? "Sign in to access farm intelligence & advisory"
                : "Join Nepal's leading platform for smarter agriculture"}
            </p>
          </div>

          {/* Segmented Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-0.5 bg-[#F4F6F1] border border-[#E2E8E3] rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`py-1.5 rounded-lg transition-all cursor-pointer text-xs ${
                mode === "login"
                  ? "bg-white text-[#17201A] font-bold shadow-2xs border border-slate-200/60"
                  : "text-[#647067] hover:text-[#17201A]"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`py-1.5 rounded-lg transition-all cursor-pointer text-xs ${
                mode === "register"
                  ? "bg-white text-[#17201A] font-bold shadow-2xs border border-slate-200/60"
                  : "text-[#647067] hover:text-[#17201A]"
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Login / Register Form (Centered in middle zone) */}
        <div className="flex-1 flex flex-col justify-center my-auto py-1">
          <form onSubmit={handleSubmit} className={mode === "register" ? "space-y-1.5" : "space-y-2.5"}>

            {/* Error Banner */}
            {(errorMessage || fieldErrors.length > 0) && (
              <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2 text-xs text-rose-800 animate-in fade-in">
                <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  {errorMessage && <p className="font-bold text-[11px]">{errorMessage}</p>}
                  {fieldErrors.map((err, idx) => (
                    <p key={idx} className="text-[10px]">• {err}</p>
                  ))}
                </div>
              </div>
            )}

            {/* First + Last Name (Register only) */}
            {mode === "register" && (
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-0.5">
                  <label className="block text-[9px] font-bold text-[#17201A] uppercase tracking-wide">First Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-3 h-3" />
                    </div>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Ram"
                      className="w-full pl-7 pr-2 py-1.5 rounded-lg border border-[#E2E8E3] text-xs text-[#17201A] placeholder-slate-400 bg-[#F7F9F4] focus:bg-white focus:outline-none focus:border-[#166534] focus:ring-1 focus:ring-emerald-200 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-0.5">
                  <label className="block text-[9px] font-bold text-[#17201A] uppercase tracking-wide">Last Name</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Sharma"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[#E2E8E3] text-xs text-[#17201A] placeholder-slate-400 bg-[#F7F9F4] focus:bg-white focus:outline-none focus:border-[#166534] focus:ring-1 focus:ring-emerald-200 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="space-y-0.5">
              <label className="block text-[9px] font-bold text-[#17201A] uppercase tracking-wide">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-3 h-3" />
                </div>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={mode === "login" ? "farmer@example.com" : "your@email.com"}
                  className="w-full pl-7 pr-3 py-1.5 rounded-lg border border-[#E2E8E3] text-xs text-[#17201A] placeholder-slate-400 bg-[#F7F9F4] focus:bg-white focus:outline-none focus:border-[#166534] focus:ring-1 focus:ring-emerald-200 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-0.5">
              <label className="block text-[9px] font-bold text-[#17201A] uppercase tracking-wide">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-3 h-3" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={mode === "register" ? 8 : undefined}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-7 pr-8 py-1.5 rounded-lg border border-[#E2E8E3] text-xs text-[#17201A] placeholder-slate-400 bg-[#F7F9F4] focus:bg-white focus:outline-none focus:border-[#166534] focus:ring-1 focus:ring-emerald-200 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {/* Phone Number (Register only — optional) */}
            {mode === "register" && (
              <div className="space-y-0.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[9px] font-bold text-[#17201A] uppercase tracking-wide">Phone Number</label>
                  <span className="text-[9px] text-slate-400 font-medium">Optional</span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-3 h-3" />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+977 9801234567"
                    className="w-full pl-7 pr-3 py-1.5 rounded-lg border border-[#E2E8E3] text-xs text-[#17201A] placeholder-slate-400 bg-[#F7F9F4] focus:bg-white focus:outline-none focus:border-[#166534] focus:ring-1 focus:ring-emerald-200 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Remember Me & Forgot Password in one line (Login only) */}
            {mode === "login" && (
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-1.5 text-[11px] text-[#647067] font-medium cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-[#E2E8E3] text-[#166534] accent-[#166534] cursor-pointer"
                  />
                  <span>Remember me</span>
                </label>
                <Link href="/forgot-password" onClick={closeModal} className="text-[11px] font-semibold text-[#166534] hover:underline">
                  Forgot password?
                </Link>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || redirecting}
              className="w-full py-2 px-3 bg-[#0f3d26] hover:bg-[#14532d] text-white font-bold text-xs rounded-xl transition-all shadow-xs hover:shadow flex items-center justify-center gap-1.5 cursor-pointer group disabled:opacity-75 mt-1"
            >
              {loading || redirecting ? (
                <>
                  <span className="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>
                    {redirecting
                      ? "Success! Redirecting..."
                      : mode === "login"
                      ? "Signing In..."
                      : "Creating Account..."}
                  </span>
                </>
              ) : (
                <>
                  <span>{mode === "login" ? "Sign In to Dashboard" : "Create My Account"}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Bottom Section - pinned to bottom */}
        <div className="mt-auto shrink-0 space-y-2 pt-1">
          {/* Social / OR Section */}
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-slate-200" />
            <span className="absolute bg-white px-2 text-[9px] font-bold uppercase tracking-wider text-slate-400">or</span>
          </div>

          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => handleOAuthDemo("Google")}
              className="py-1.5 px-2 rounded-lg border border-[#E2E8E3] bg-[#F7F9F4] hover:bg-white text-[11px] font-semibold text-[#17201A] flex items-center justify-center gap-1.5 transition-all hover:border-slate-300 cursor-pointer"
            >
              <svg className="w-3 h-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={() => handleOAuthDemo("Phone OTP")}
              className="py-1.5 px-2 rounded-lg border border-[#E2E8E3] bg-[#F7F9F4] hover:bg-white text-[11px] font-semibold text-[#17201A] flex items-center justify-center gap-1 transition-all hover:border-slate-300 cursor-pointer"
            >
              <span>📱 Phone OTP</span>
            </button>
          </div>

          {/* Footer switch */}
          <div className="h-[28px] flex items-center justify-center text-center text-[11px]">
            {mode === "login" ? (
              <p className="text-[#647067]">
                Don&apos;t have an account?{" "}
                <button type="button" onClick={() => setMode("register")} className="font-bold text-[#166534] hover:underline cursor-pointer">
                  Register now
                </button>
              </p>
            ) : (
              <p className="text-[#647067]">
                Already have an account?{" "}
                <button type="button" onClick={() => setMode("login")} className="font-bold text-[#166534] hover:underline cursor-pointer">
                  Sign in
                </button>
                {" · "}
                <Link
                  href="/expert-register"
                  onClick={closeModal}
                  className="font-bold text-[#166534] hover:underline"
                >
                  Expert Apply →
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
