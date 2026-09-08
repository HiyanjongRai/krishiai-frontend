"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthModal } from "@/providers/auth-modal-provider";
import { getDashboardRoute, useAuth } from "@/providers/auth-provider";
import { useToast } from "@/providers/toast-provider";
import { ApiError } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/toast-utils";
import type { RegisterRequest } from "@/types/auth";
import {
  AlertCircle,
  ArrowRight,
  Check,
  CloudSun,
  Eye,
  EyeOff,
  Leaf,
  Lock,
  Mail,
  Phone,
  Sprout,
  User,
  Wheat,
  X,
} from "lucide-react";

export function AuthModal() {
  const router = useRouter();
  const { isOpen, mode, closeModal, setMode } = useAuthModal();
  const { login, register } = useAuth();
  const { toast } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<string[]>([]);

  const resetTransientState = useCallback(() => {
    setLoading(false);
    setErrorMessage("");
    setFieldErrors([]);
    setShowPassword(false);
  }, []);

  const handleClose = useCallback(() => {
    resetTransientState();
    closeModal();
  }, [closeModal, resetTransientState]);

  const handleModeChange = (nextMode: "login" | "register") => {
    resetTransientState();
    setMode(nextMode);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setFieldErrors([]);

    try {
      if (mode === "login") {
        const response = await login(email, password);
        toast.success({
          title: "Signed in successfully.",
          description: `Welcome back, ${response.user.firstName || "User"}!`,
        });
        closeModal();
        router.push(getDashboardRoute(response.user.role));
        return;
      }

      const trimmedFullName = fullName.trim();
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
      const response = await register(payload);
      toast.success({
        title: "Account created successfully.",
        description: "Welcome to KrishiAI!",
      });
      closeModal();
      router.push(getDashboardRoute(response.role));
    } catch (error) {
      const safeMessage = getApiErrorMessage(error);
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
        setFieldErrors(error.errors ?? []);
      } else {
        setErrorMessage(safeMessage);
      }
      toast.error({
        title: mode === "login" ? "Unable to sign in." : "Registration failed.",
        description: safeMessage,
      });
      setLoading(false);
    }
  };

  const handleOAuthDemo = (provider: string) => {
    setErrorMessage(`Single Sign-On with ${provider} will be available in production.`);
  };

  const isLogin = mode === "login";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/65 p-3 backdrop-blur-sm sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <button
        type="button"
        onClick={handleClose}
        className="absolute inset-0 cursor-default"
        aria-label="Close authentication dialog"
      />

      <div className="relative z-10 grid w-full max-w-4xl overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-[0_30px_90px_-24px_rgba(15,61,38,0.45)] animate-in zoom-in-95 duration-200 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="relative hidden min-h-[620px] overflow-hidden bg-[#0f3d26] p-9 text-white lg:flex lg:flex-col">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-400/20 blur-2xl" />
          <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-lime-300/10 blur-2xl" />
          <div className="relative flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
              <Sprout className="h-6 w-6 text-lime-300" />
            </div>
            <div>
              <p className="text-lg font-extrabold tracking-tight">
                Krishi<span className="text-lime-300">AI</span>
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-100/70">
                Smarter farming
              </p>
            </div>
          </div>

          <div className="relative mt-auto space-y-6">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-lime-300">
                Your farm, understood
              </p>
              <h2 className="max-w-sm text-3xl font-extrabold leading-tight tracking-tight">
                Better decisions start with better insights.
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-6 text-emerald-50/75">
                Bring your crops, weather, and expert advice together in one simple workspace.
              </p>
            </div>

            <div className="space-y-3">
              {[
                [Leaf, "AI-powered crop health insights"],
                [CloudSun, "Weather-aware recommendations"],
                [Wheat, "Support from verified experts"],
              ].map(([Icon, text]) => (
                <div key={text as string} className="flex items-center gap-3 text-sm text-emerald-50/90">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10">
                    <Icon className="h-4 w-4 text-lime-300" />
                  </span>
                  <span>{text as string}</span>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-lime-200">
                <span className="h-2 w-2 rounded-full bg-lime-300" />
                Built for farmers
              </div>
              <p className="mt-2 text-xs leading-5 text-emerald-50/70">
                Practical tools and guidance, wherever your farm is growing.
              </p>
            </div>
          </div>
        </aside>

        <section className="relative max-h-[calc(100vh-1.5rem)] overflow-y-auto p-5 sm:p-9">
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-5 top-5 rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="mx-auto max-w-md">
            <div className="mb-7 lg:hidden">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <Sprout className="h-5 w-5" />
                </span>
                <p className="text-lg font-extrabold tracking-tight text-slate-900">
                  Krishi<span className="text-emerald-700">AI</span>
                </p>
              </div>
            </div>

            <div className="mb-7 pr-8">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
                {isLogin ? "Welcome back" : "Start growing smarter"}
              </p>
              <h1 id="auth-modal-title" className="text-3xl font-extrabold tracking-tight text-slate-900">
                {isLogin ? "Sign in to KrishiAI" : "Create your farmer account"}
              </h1>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {isLogin
                  ? "Pick up where you left off with your farm insights."
                  : "Get personalized crop insights and practical guidance in minutes."}
              </p>
            </div>

            <div className="mb-7 grid grid-cols-2 rounded-2xl bg-slate-100 p-1">
              {(["login", "register"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => handleModeChange(tab)}
                  className={`rounded-xl px-3 py-2.5 text-sm font-bold transition-all ${
                    mode === tab
                      ? "bg-white text-[#0f3d26] shadow-sm ring-1 ring-slate-200"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {tab === "login" ? "Sign in" : "Create account"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {(errorMessage || fieldErrors.length > 0) && (
                <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
                  <div>
                    {errorMessage && <p className="font-semibold">{errorMessage}</p>}
                    {fieldErrors.map((error, index) => (
                      <p key={index} className="mt-1 text-xs">• {error}</p>
                    ))}
                  </div>
                </div>
              )}

              {!isLogin && (
                <label className="block">
                  <span className="mb-1.5 block text-xs font-bold text-slate-700">Full name</span>
                  <span className="relative block">
                    <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      autoComplete="name"
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      placeholder="Ram Bhattarai"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                    />
                  </span>
                </label>
              )}

              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-slate-700">Email address</span>
                <span className="relative block">
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                  />
                </span>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-slate-700">Password</span>
                <span className="relative block">
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={isLogin ? undefined : 8}
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder={isLogin ? "Enter your password" : "At least 8 characters"}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-11 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="absolute right-3 top-2.5 rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </span>
                {!isLogin && (
                  <span className="mt-1.5 flex items-center gap-1.5 text-[11px] text-slate-500">
                    <Check className="h-3.5 w-3.5 text-emerald-600" /> Use a mix of letters and numbers
                  </span>
                )}
              </label>

              {!isLogin && (
                <label className="block">
                  <span className="mb-1.5 flex items-center justify-between text-xs font-bold text-slate-700">
                    Phone number <span className="font-medium text-slate-400">Optional</span>
                  </span>
                  <span className="relative block">
                    <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                    <input
                      type="tel"
                      autoComplete="tel"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      placeholder="+977 9801234567"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                    />
                  </span>
                </label>
              )}

              {isLogin && (
                <div className="flex items-center justify-between text-xs">
                  <label className="flex cursor-pointer items-center gap-2 text-slate-500">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(event) => setRememberMe(event.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 accent-emerald-700"
                    />
                    Remember me
                  </label>
                  <Link href="/forgot-password" onClick={closeModal} className="font-bold text-emerald-700 hover:underline">
                    Forgot password?
                  </Link>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#0f3d26] px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-950/10 transition hover:bg-[#14532d] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {isLogin ? "Signing in..." : "Creating account..."}
                  </>
                ) : (
                  <>
                    {isLogin ? "Sign in to dashboard" : "Create my account"}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              <span className="h-px flex-1 bg-slate-200" /> or continue with <span className="h-px flex-1 bg-slate-200" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleOAuthDemo("Google")}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <span className="text-base font-extrabold text-[#4285F4]">G</span> Google
              </button>
              <button
                type="button"
                onClick={() => handleOAuthDemo("Phone OTP")}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <Phone className="h-3.5 w-3.5 text-emerald-700" /> Phone OTP
              </button>
            </div>

            <p className="mt-6 text-center text-xs text-slate-500">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button type="button" onClick={() => handleModeChange(isLogin ? "register" : "login")} className="font-bold text-emerald-700 hover:underline">
                {isLogin ? "Create one now" : "Sign in"}
              </button>
              {!isLogin && (
                <>
                  <span className="mx-2 text-slate-300">·</span>
                  <Link href="/expert-register" onClick={closeModal} className="font-bold text-emerald-700 hover:underline">
                    Apply as an expert
                  </Link>
                </>
              )}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
