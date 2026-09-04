"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthModal } from "@/providers/auth-modal-provider";
import { useAuth, getDashboardRoute } from "@/providers/auth-provider";
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
  ShieldCheck,
  UserCheck,
  AlertCircle,
} from "lucide-react";

export function AuthModal() {
  const router = useRouter();
  const { isOpen, mode, closeModal, setMode } = useAuthModal();
  const { login, register } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"ROLE_FARMER" | "ROLE_EXPERT">("ROLE_FARMER");

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<string[]>([]);

  // Reset form when switching modes
  useEffect(() => {
    setErrorMessage("");
    setFieldErrors([]);
    setSuccessMessage("");
  }, [mode]);

  // ESC to close + lock body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, closeModal]);

  if (!isOpen) return null;

  // ─── Submit handler ────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setFieldErrors([]);
    setSuccessMessage("");

    try {
      if (mode === "login") {
        // ── Login ──────────────────────────────────────────────────────────
        const res = await login(email, password);
        setSuccessMessage("Welcome back! Redirecting to your dashboard…");
        setTimeout(() => {
          closeModal();
          router.push(getDashboardRoute(res.user.role));
        }, 900);
      } else {
        // ── Register ───────────────────────────────────────────────────────
        const payload: RegisterRequest = {
          email,
          password,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phone: phone.trim() || undefined,
          role,
        };
        const res = await register(payload);
        setSuccessMessage(`Account created! Welcome to KrishiAI, ${res.firstName}.`);
        setTimeout(() => {
          closeModal();
          router.push(getDashboardRoute(res.role));
        }, 900);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={closeModal}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 animate-in zoom-in-95 duration-200">

        {/* Top Header Strip */}
        <div className="bg-gradient-to-r from-emerald-50 via-[#f0fdf4] to-emerald-50/50 p-6 pb-5 border-b border-emerald-100/70 relative">
          {/* Close button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-white/80 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-xs">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Krishi<span className="text-emerald-600">AI</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {mode === "login"
                  ? "Access your farm intelligence dashboard"
                  : "Join Nepal's leading smart agriculture platform"}
              </p>
            </div>
          </div>

          {/* Mode Switch Tabs */}
          <div className="mt-5 grid grid-cols-2 p-1 bg-slate-200/60 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`py-2 rounded-lg transition-all ${
                mode === "login"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`py-2 rounded-lg transition-all ${
                mode === "register"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Modal Form Body */}
        <div className="p-6 sm:p-7 space-y-5">
          {successMessage ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2 animate-in fade-in">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-emerald-900">{successMessage}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* ── Error Banner ─────────────────────────────────────────── */}
              {(errorMessage || fieldErrors.length > 0) && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <div className="text-xs text-red-700 space-y-1">
                    {errorMessage && <p className="font-semibold">{errorMessage}</p>}
                    {fieldErrors.map((e, i) => (
                      <p key={i}>• {e}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Role Toggle (Register only) ──────────────────────────── */}
              {mode === "register" && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    I am registering as:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole("ROLE_FARMER")}
                      className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                        role === "ROLE_FARMER"
                          ? "border-emerald-600 bg-emerald-50/70 text-emerald-900 ring-1 ring-emerald-500"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <Sprout className="w-4 h-4 text-emerald-600" />
                      <span>Farmer / Grower</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("ROLE_EXPERT")}
                      className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                        role === "ROLE_EXPERT"
                          ? "border-emerald-600 bg-emerald-50/70 text-emerald-900 ring-1 ring-emerald-500"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <UserCheck className="w-4 h-4 text-emerald-600" />
                      <span>Agronomist / Expert</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ── First + Last Name (Register only) ───────────────────── */}
              {mode === "register" && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      First Name
                    </label>
                    <div className="relative flex items-center">
                      <User className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Ram"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Last Name
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Thapa"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ── Email ───────────────────────────────────────────────── */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="farmer@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                  />
                </div>
              </div>

              {/* ── Phone (Register only) ────────────────────────────────── */}
              {mode === "register" && (
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Phone Number{" "}
                    <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <div className="relative flex items-center">
                    <Phone className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+977 98XXXXXXXX"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                    />
                  </div>
                </div>
              )}

              {/* ── Password ─────────────────────────────────────────────── */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-700">
                    Password
                  </label>
                  {mode === "login" && (
                    <button
                      type="button"
                      onClick={() =>
                        alert("Password reset link sent to your registered email.")
                      }
                      className="text-[11px] font-semibold text-emerald-700 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={mode === "register" ? 8 : undefined}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {mode === "register" && (
                  <p className="text-[11px] text-slate-400">Minimum 8 characters required.</p>
                )}
              </div>

              {/* ── Remember Me (Login only) ─────────────────────────────── */}
              {mode === "login" && (
                <div className="flex items-center gap-2 pt-0.5">
                  <input
                    type="checkbox"
                    id="remember"
                    defaultChecked
                    className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <label
                    htmlFor="remember"
                    className="text-xs text-slate-600 font-medium cursor-pointer"
                  >
                    Remember me for 30 days
                  </label>
                </div>
              )}

              {/* ── Submit ──────────────────────────────────────────────── */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-[#0f3d26] hover:bg-[#14532d] transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{mode === "login" ? "Sign In" : "Create Account"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Bottom Switcher */}
          {!successMessage && (
            <div className="pt-2 text-center text-xs text-slate-500">
              {mode === "login" ? (
                <p>
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("register")}
                    className="font-bold text-emerald-700 hover:underline"
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
                    className="font-bold text-emerald-700 hover:underline"
                  >
                    Sign in
                  </button>
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
