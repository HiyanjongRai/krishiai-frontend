"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthModal } from "@/providers/auth-modal-provider";
import { useAuth, getDashboardRoute } from "@/providers/auth-provider";
import { useToast } from "@/providers/toast-provider";
import { getApiErrorMessage } from "@/lib/toast-utils";
import { ApiError } from "@/lib/api";
import type { RegisterRequest } from "@/types/auth";
import {
  Sprout,
  X,
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Leaf,
  ShieldCheck,
} from "lucide-react";

export function AuthModal() {
  const router = useRouter();
  const { isOpen, mode, closeModal, setMode } = useAuthModal();
  const { login, register } = useAuth();
  const { toast } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<string[]>([]);

  // Reset all states when modal opens/closes or mode changes
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoading(false);
      setRedirecting(false);
      setErrorMessage("");
      setFieldErrors([]);
    }, 0);

    return () => window.clearTimeout(timer);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setFieldErrors([]);

    try {
      if (mode === "login") {
        const res = await login(email, password);
        toast.success({
          title: "Signed in successfully.",
          description: `Welcome back, ${res.user.firstName || "User"}!`,
        });
        closeModal();
        router.push(getDashboardRoute(res.user.role));
      } else {
        const trimmedFullName = fullName.trim();
        if (!trimmedFullName) {
          setErrorMessage("Full name is required.");
          setLoading(false);
          return;
        }
        if (trimmedFullName.length < 2) {
          setErrorMessage("Please enter your full name.");
          setLoading(false);
          return;
        }

        const payload: RegisterRequest = {
          email,
          password,
          phone: phone.trim() || undefined,
          role: "ROLE_FARMER",
          fullName: trimmedFullName,
        };
        const res = await register(payload);
        toast.success({
          title: "Account created successfully.",
          description: "Welcome to KrishiAI!",
        });
        closeModal();
        router.push(getDashboardRoute(res.role));
      }
    } catch (err) {
      const safeMsg = getApiErrorMessage(err);
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
        if (err.errors && err.errors.length > 0) {
          setFieldErrors(err.errors);
        }
      } else {
        setErrorMessage(safeMsg);
      }
      toast.error({
        title: mode === "login" ? "Unable to sign in." : "Registration failed.",
        description: safeMsg,
      });
      setLoading(false);
    }
  };

  const handleOAuthDemo = (provider: string) => {
    setErrorMessage(`Single Sign-On with ${provider} will be available in production.`);
  };

  const inputBase =
    "w-full py-2.5 rounded-[14px] border text-sm text-[#171717] placeholder-gray-400 bg-[#F4F4F6] focus:bg-white focus:outline-none transition-all";
  const inputNormal =
    "border-[rgba(234,234,236,0.85)] focus:border-[#0F9F68] focus:ring-2 focus:ring-[#DDF4EA]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-[#171717]/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      />

      {/* Modal card */}
      <div className="relative w-full max-w-[400px] bg-white rounded-[28px] border border-[rgba(234,234,236,0.85)] shadow-[0_24px_60px_-12px_rgba(0,0,0,0.18),0_8px_24px_-6px_rgba(0,0,0,0.08)] z-10 overflow-hidden animate-in zoom-in-95 duration-150 text-[#171717] flex flex-col">

        {/* Subtle top gradient accent */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#0F9F68] via-[#BCE9D5] to-[#0F9F68] opacity-80" />

        {/* Decorative bg circle */}
        <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-[#DDF4EA]/40 pointer-events-none" />

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-[#171717] hover:bg-[#F4F4F6] transition-colors z-20 cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-7 flex flex-col gap-5">
          {/* Brand header */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-[14px] bg-[#DDF4EA] border border-[#BCE9D5] flex items-center justify-center text-[#0F9F68] shadow-[0_2px_8px_rgba(15,159,104,0.15)]">
                <Sprout className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-[#171717] tracking-tight leading-none">
                  Krishi<span className="text-[#0F9F68]">AI</span>
                </h3>
                <span className="text-[9px] font-black text-[#0F9F68] uppercase tracking-[0.16em]">
                  Agricultural Advisory
                </span>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#171717] tracking-tight leading-tight">
                {mode === "login" ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {mode === "login"
                  ? "Sign in to access farm intelligence & advisory"
                  : "Join Nepal's leading platform for smarter agriculture"}
              </p>
            </div>

            {/* Mode switcher */}
            <div className="grid grid-cols-2 p-1 bg-[#F4F4F6] border border-[rgba(234,234,236,0.85)] rounded-[16px] text-xs font-bold gap-1">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`py-2 rounded-[12px] transition-all cursor-pointer text-xs ${
                  mode === "login"
                    ? "bg-white text-[#171717] shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-[rgba(234,234,236,0.85)]"
                    : "text-gray-400 hover:text-[#171717]"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode("register")}
                className={`py-2 rounded-[12px] transition-all cursor-pointer text-xs ${
                  mode === "register"
                    ? "bg-white text-[#171717] shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-[rgba(234,234,236,0.85)]"
                    : "text-gray-400 hover:text-[#171717]"
                }`}
              >
                Create Account
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Error Banner */}
            {(errorMessage || fieldErrors.length > 0) && (
              <div className="p-3 rounded-[14px] bg-rose-50 border border-rose-200 flex items-start gap-2 text-xs text-rose-800 animate-in fade-in">
                <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  {errorMessage && <p className="font-bold text-[11px]">{errorMessage}</p>}
                  {fieldErrors.map((err, idx) => (
                    <p key={idx} className="text-[10px]">• {err}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Full Name (Register only) */}
            {mode === "register" && (
              <div className="space-y-1">
                <label className="block text-[10px] font-black text-[#171717] uppercase tracking-[0.12em]">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ram Bhattarai"
                    className={`${inputBase} pl-9 pr-3.5 ${inputNormal}`}
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1">
              <label className="block text-[10px] font-black text-[#171717] uppercase tracking-[0.12em]">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={mode === "login" ? "farmer@example.com" : "your@email.com"}
                  className={`${inputBase} pl-9 pr-3.5 ${inputNormal}`}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="block text-[10px] font-black text-[#171717] uppercase tracking-[0.12em]">
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={mode === "register" ? 8 : undefined}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`${inputBase} pl-9 pr-10 ${inputNormal}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Phone (Register only — optional) */}
            {mode === "register" && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-[10px] font-black text-[#171717] uppercase tracking-[0.12em]">
                    Phone Number
                  </label>
                  <span className="text-[9px] font-bold text-gray-400 bg-[#F4F4F6] px-2 py-0.5 rounded-full border border-[rgba(234,234,236,0.85)]">
                    Optional
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+977 9801234567"
                    className={`${inputBase} pl-9 pr-3.5 ${inputNormal}`}
                  />
                </div>
              </div>
            )}

            {/* Remember me & Forgot password (Login only) */}
            {mode === "login" && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-1.5 text-xs text-gray-500 font-medium cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-[rgba(234,234,236,0.85)] accent-[#0F9F68] cursor-pointer"
                  />
                  <span>Remember me</span>
                </label>
                <Link
                  href="/forgot-password"
                  onClick={closeModal}
                  className="text-xs font-bold text-[#0F9F68] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || redirecting}
              className="w-full py-2.5 px-4 bg-[#0F9F68] hover:bg-[#0D8A5A] text-white font-bold text-sm rounded-full transition-all shadow-[0_4px_16px_rgba(15,159,104,0.3)] hover:shadow-[0_6px_20px_rgba(15,159,104,0.4)] flex items-center justify-center gap-2 cursor-pointer group disabled:opacity-70 mt-1"
            >
              {loading || redirecting ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>
                    {redirecting
                      ? "Redirecting..."
                      : mode === "login"
                      ? "Signing In..."
                      : "Creating Account..."}
                  </span>
                </>
              ) : (
                <>
                  <span>{mode === "login" ? "Sign In to Dashboard" : "Create My Account"}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-[rgba(234,234,236,0.85)]" />
            <span className="absolute bg-white px-2.5 text-[9px] font-black uppercase tracking-[0.16em] text-gray-400">or continue with</span>
          </div>

          {/* OAuth buttons */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleOAuthDemo("Google")}
              className="py-2.5 px-3 rounded-[14px] border border-[rgba(234,234,236,0.85)] bg-[#F4F4F6] hover:bg-white text-xs font-bold text-[#171717] flex items-center justify-center gap-2 transition-all hover:border-gray-300 hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
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
              className="py-2.5 px-3 rounded-[14px] border border-[rgba(234,234,236,0.85)] bg-[#F4F4F6] hover:bg-white text-xs font-bold text-[#171717] flex items-center justify-center gap-1.5 transition-all hover:border-gray-300 hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Phone OTP</span>
            </button>
          </div>

          {/* Footer trust badge + switch link */}
          <div className="space-y-3">
            {/* Trust badge */}
            <div className="flex items-center justify-center gap-1.5 py-2 rounded-[12px] bg-[#F4F4F6] border border-[rgba(234,234,236,0.85)]">
              <ShieldCheck className="w-3 h-3 text-[#0F9F68]" />
              <span className="text-[10px] font-bold text-gray-400">Secure & encrypted connection</span>
            </div>

            {/* Switch mode */}
            <div className="text-center text-xs text-gray-400">
              {mode === "login" ? (
                <p>
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("register")}
                    className="font-bold text-[#0F9F68] hover:underline cursor-pointer"
                  >
                    Register now
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="font-bold text-[#0F9F68] hover:underline cursor-pointer"
                  >
                    Sign in
                  </button>
                  {" · "}
                  <Link
                    href="/expert-register"
                    onClick={closeModal}
                    className="font-bold text-[#0F9F68] hover:underline"
                  >
                    Expert Apply →
                  </Link>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
