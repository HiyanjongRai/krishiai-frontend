"use client";

import React, { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthModal } from "@/providers/auth-modal-provider";
import { useAuth, getDashboardRoute } from "@/providers/auth-provider";
import { useToast } from "@/providers/toast-provider";
import { getApiErrorMessage } from "@/lib/toast-utils";
import { normalizeApiError } from "@/utils/api-response";
import { FieldError } from "@/components/ui/field-error";
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
  ShieldCheck,
  Leaf,
  Sun,
  CloudRain,
  Wheat,
  CheckCircle2,
} from "lucide-react";

function FloatingIcon({
  icon: Icon,
  className,
}: {
  icon: React.ElementType;
  className?: string;
}) {
  return (
    <div className={`absolute flex items-center justify-center rounded-2xl shadow-lg pointer-events-none select-none ${className}`}>
      <Icon className="w-5 h-5" />
    </div>
  );
}

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
  const [redirecting, setRedirecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoading(false);
      setRedirecting(false);
      setErrorMessage("");
      setFieldErrors({});
      setTouched({});
    }, 0);
    return () => window.clearTimeout(timer);
  }, [isOpen, mode]);

  const handleClose = useCallback(() => {
    setLoading(false);
    setRedirecting(false);
    setErrorMessage("");
    setFieldErrors({});
    setTouched({});
    closeModal();
  }, [closeModal]);

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
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const emailError =
    fieldErrors.email ||
    (touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ? "Please enter a valid email address."
      : "");
  const passwordError =
    fieldErrors.password ||
    (touched.password && mode === "register" && password.length > 0 && password.length < 8
      ? "Password must contain at least 8 characters."
      : "");
  const fullNameError =
    fieldErrors.fullName ||
    (touched.fullName && mode === "register" && fullName.trim().length < 2
      ? "Please enter your full name."
      : "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setFieldErrors({});
    setTouched({ email: true, password: true, fullName: true });

    try {
      if (mode === "login") {
        if (!email || !password || emailError) {
          setErrorMessage("Please enter your email and password.");
          setLoading(false);
          return;
        }
        const res = await login(email, password);
        toast.success({
          title: "Signed in successfully.",
          description: `Welcome back, ${res.user.firstName || "User"}!`,
        });
        closeModal();
        router.push(getDashboardRoute(res.user.role));
      } else {
        const trimmedFullName = fullName.trim();
        if (!trimmedFullName || fullNameError || emailError || password.length < 8) {
          setErrorMessage("Please correct the highlighted fields.");
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
      const normalized = normalizeApiError(err);
      const safeMsg = getApiErrorMessage(err);
      setErrorMessage(normalized.message);
      setFieldErrors(normalized.fieldErrors);
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
    "w-full py-3 rounded-2xl border text-sm text-[#1F2937] placeholder-[#9CA3AF] bg-[#F8FAF8] focus:bg-white focus:outline-none transition-all duration-200";
  const inputNormal =
    "border-[#E5E7EB] focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/15";
  const inputErr = "border-[#FCA5A5] bg-[#FEF2F2] focus:border-[#DC2626]";

  const trustFeatures = [
    "AI-powered crop disease detection",
    "Real-time GPS weather forecasting",
    "Expert agronomist consultations",
    "Free for smallholder farmers",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-[#0F1C0F]/60 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
      />
      <div className="relative w-full max-w-[860px] bg-white rounded-[32px] shadow-[0_32px_80px_-12px_rgba(0,0,0,0.25),0_12px_32px_-8px_rgba(0,0,0,0.12)] z-10 overflow-hidden animate-in zoom-in-95 duration-200 text-[#1F2937] flex flex-col md:flex-row">
        {/* Left Panel */}
        <div className="hidden md:flex md:w-[42%] bg-gradient-to-br from-[#1B5E20] via-[#2E7D32] to-[#388E3C] flex-col justify-between p-8 relative overflow-hidden">
          <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute bottom-10 -right-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
          <FloatingIcon icon={Sun} className="top-16 right-10 w-11 h-11 bg-[#F59E0B]/20 text-[#FDE68A] border border-[#F59E0B]/20" />
          <FloatingIcon icon={CloudRain} className="top-36 right-4 w-9 h-9 bg-white/10 text-white border border-white/10" />
          <FloatingIcon icon={Wheat} className="bottom-32 right-12 w-10 h-10 bg-white/10 text-[#86EFAC] border border-white/10" />
          <FloatingIcon icon={Leaf} className="bottom-52 right-3 w-8 h-8 bg-white/10 text-[#BBF7D0] border border-white/10" />
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shadow-lg">
                <Sprout className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="block text-lg font-black text-white tracking-tight leading-none">
                  Krishi<span className="text-[#86EFAC]">AI</span>
                </span>
                <span className="block text-[10px] font-bold text-white/50 uppercase tracking-[0.2em] mt-0.5">
                  Agricultural Advisory
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white leading-tight whitespace-pre-line">
                {mode === "login" ? "Welcome back,\nFarmer 👋" : "Join 50,000+\nSmart Farmers"}
              </h2>
              <p className="text-sm text-white/60 leading-relaxed">
                {mode === "login"
                  ? "Your farm intelligence dashboard and AI advisor are waiting."
                  : "Nepal's most trusted AI-powered agriculture advisory platform."}
              </p>
            </div>
          </div>
          <div className="space-y-2.5">
            {trustFeatures.map((feat) => (
              <div key={feat} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#22C55E]/20 border border-[#22C55E]/30 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3 h-3 text-[#86EFAC]" />
                </div>
                <span className="text-xs font-medium text-white/75">{feat}</span>
              </div>
            ))}
            <div className="pt-3 mt-1 border-t border-white/10 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#86EFAC]" />
              <span className="text-[11px] font-bold text-white/50">256-bit encrypted · Data stays in Nepal</span>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 p-7 sm:p-9 flex flex-col gap-5 overflow-y-auto max-h-[90vh] md:max-h-none relative">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#2E7D32] to-transparent opacity-60 md:hidden" />
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full text-[#9CA3AF] hover:text-[#1F2937] hover:bg-[#F1F5F2] transition-colors z-20 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2.5 md:hidden">
            <div className="w-9 h-9 rounded-[14px] bg-[#E8F5E9] border border-[#C8E6C9] flex items-center justify-center text-[#2E7D32]">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-sm font-black text-[#1F2937] tracking-tight">
                Krishi<span className="text-[#2E7D32]">AI</span>
              </span>
              <span className="block text-[9px] font-bold text-[#2E7D32] uppercase tracking-[0.16em]">
                Agricultural Advisory
              </span>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <h2 className="text-2xl font-black text-[#1F2937] tracking-tight leading-tight">
                {mode === "login" ? "Sign in to your account" : "Create your account"}
              </h2>
              <p className="text-xs text-[#9CA3AF] mt-1.5 font-medium">
                {mode === "login"
                  ? "Enter your credentials to access your farm dashboard"
                  : "Join KrishiAI and start growing smarter today"}
              </p>
            </div>
            <div className="grid grid-cols-2 p-1 bg-[#F1F5F2] border border-[#E5E7EB] rounded-2xl text-xs font-bold gap-1">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`py-2.5 rounded-xl transition-all duration-200 cursor-pointer text-xs ${
                  mode === "login"
                    ? "bg-white text-[#1F2937] shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-[#E5E7EB]"
                    : "text-[#9CA3AF] hover:text-[#1F2937]"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode("register")}
                className={`py-2.5 rounded-xl transition-all duration-200 cursor-pointer text-xs ${
                  mode === "register"
                    ? "bg-white text-[#1F2937] shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-[#E5E7EB]"
                    : "text-[#9CA3AF] hover:text-[#1F2937]"
                }`}
              >
                Create Account
              </button>
            </div>
          </div>

          {(errorMessage || Object.keys(fieldErrors).length > 0) && (
            <div className="p-3.5 rounded-2xl bg-[#FEF2F2] border border-[#FCA5A5] flex items-start gap-2.5 text-xs text-[#DC2626] animate-in fade-in slide-in-from-top-2 duration-200">
              <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                {errorMessage && <p className="font-bold text-[11px]">{errorMessage}</p>}
                {Object.entries(fieldErrors).map(([field, err]) => (
                  <p key={field} className="text-[10px]">• {err}</p>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 flex-1">
            {mode === "register" && (
              <div className="space-y-1.5 animate-in slide-in-from-top-4 duration-200">
                <label className="block text-[10px] font-black text-[#4B5563] uppercase tracking-[0.12em]">
                  Full Name <span className="text-[#DC2626]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9CA3AF]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, fullName: true }))}
                    aria-invalid={!!fullNameError}
                    aria-describedby={fullNameError ? "auth-full-name-error" : undefined}
                    placeholder="Ram Bhattarai"
                    className={`${inputBase} pl-10 pr-4 ${fullNameError ? inputErr : inputNormal}`}
                  />
                </div>
                <FieldError id="auth-full-name-error">{fullNameError}</FieldError>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-[#4B5563] uppercase tracking-[0.12em]">
                Email Address <span className="text-[#DC2626]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9CA3AF]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? "auth-email-error" : undefined}
                  placeholder={mode === "login" ? "farmer@example.com" : "your@email.com"}
                  className={`${inputBase} pl-10 pr-4 ${emailError ? inputErr : inputNormal}`}
                />
              </div>
              <FieldError id="auth-email-error">{emailError}</FieldError>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[10px] font-black text-[#4B5563] uppercase tracking-[0.12em]">
                  Password <span className="text-[#DC2626]">*</span>
                </label>
                {mode === "login" && (
                  <Link
                    href="/forgot-password"
                    onClick={closeModal}
                    className="text-[10px] font-bold text-[#2E7D32] hover:underline"
                  >
                    Forgot password?
                  </Link>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9CA3AF]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={mode === "register" ? 8 : undefined}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                  aria-invalid={!!passwordError}
                  aria-describedby={passwordError ? "auth-password-error" : undefined}
                  placeholder="••••••••"
                  className={`${inputBase} pl-10 pr-11 ${passwordError ? inputErr : inputNormal}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#9CA3AF] hover:text-[#4B5563] cursor-pointer transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <FieldError id="auth-password-error">{passwordError}</FieldError>
            </div>

            {mode === "register" && password.length > 0 && (
              <div className="flex items-center gap-1.5 -mt-2">
                {[...Array(4)].map((_, i) => {
                  const strength = Math.min(4, Math.floor(password.length / 3));
                  return (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        i < strength
                          ? strength <= 1
                            ? "bg-[#DC2626]"
                            : strength <= 2
                            ? "bg-[#F59E0B]"
                            : strength <= 3
                            ? "bg-[#84CC16]"
                            : "bg-[#2E7D32]"
                          : "bg-[#E5E7EB]"
                      }`}
                    />
                  );
                })}
                <span className="text-[10px] font-semibold text-[#9CA3AF] ml-1 shrink-0">
                  {password.length < 4 ? "Weak" : password.length < 7 ? "Fair" : password.length < 10 ? "Good" : "Strong"}
                </span>
              </div>
            )}

            {mode === "register" && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[10px] font-black text-[#4B5563] uppercase tracking-[0.12em]">
                    Phone Number
                  </label>
                  <span className="text-[9px] font-bold text-[#9CA3AF] bg-[#F1F5F2] px-2 py-0.5 rounded-full border border-[#E5E7EB]">
                    Optional
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9CA3AF]">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+977 9801234567"
                    className={`${inputBase} pl-10 pr-4 ${inputNormal}`}
                  />
                </div>
              </div>
            )}

            {mode === "login" && (
              <label className="flex items-center gap-2 text-xs text-[#6B7280] font-medium cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#E5E7EB] accent-[#2E7D32] cursor-pointer"
                />
                <span>Keep me signed in</span>
              </label>
            )}

            <button
              type="submit"
              disabled={loading || redirecting}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-[#2E7D32] to-[#388E3C] hover:from-[#256B2A] hover:to-[#2E7D32] text-white font-bold text-sm rounded-2xl transition-all duration-200 shadow-[0_4px_20px_rgba(46,125,50,0.4)] hover:shadow-[0_6px_28px_rgba(46,125,50,0.5)] flex items-center justify-center gap-2.5 cursor-pointer group disabled:opacity-70 active:scale-[0.98]"
            >
              {loading || redirecting ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>
                    {redirecting
                      ? "Redirecting to dashboard..."
                      : mode === "login"
                      ? "Signing In..."
                      : "Creating Account..."}
                  </span>
                </>
              ) : (
                <>
                  <span>{mode === "login" ? "Sign In to Dashboard" : "Create My Account"}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </button>
          </form>

          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-[#E5E7EB]" />
            <span className="absolute bg-white px-3 text-[9px] font-black uppercase tracking-[0.18em] text-[#9CA3AF]">
              or continue with
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleOAuthDemo("Google")}
              className="py-3 px-3 rounded-2xl border border-[#E5E7EB] bg-[#F8FAF8] hover:bg-white text-xs font-bold text-[#1F2937] flex items-center justify-center gap-2 transition-all duration-200 hover:border-[#D1D5DB] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#2563EB" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#2E7D32" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#F59E0B" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#DC2626" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={() => handleOAuthDemo("Phone OTP")}
              className="py-3 px-3 rounded-2xl border border-[#E5E7EB] bg-[#F8FAF8] hover:bg-white text-xs font-bold text-[#1F2937] flex items-center justify-center gap-2 transition-all duration-200 hover:border-[#D1D5DB] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] cursor-pointer"
            >
              <Phone className="w-4 h-4 text-[#2E7D32]" />
              <span>Phone OTP</span>
            </button>
          </div>

          <div className="space-y-2">
            <div className="text-center text-xs text-[#9CA3AF]">
              {mode === "login" ? (
                <p>
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("register")}
                    className="font-bold text-[#2E7D32] hover:underline cursor-pointer"
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
                    className="font-bold text-[#2E7D32] hover:underline cursor-pointer"
                  >
                    Sign in
                  </button>
                  {" · "}
                  <Link
                    href="/expert-register"
                    onClick={closeModal}
                    className="font-bold text-[#2E7D32] hover:underline"
                  >
                    Expert Apply →
                  </Link>
                </p>
              )}
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-[#9CA3AF]" />
              <span className="text-[10px] font-semibold text-[#9CA3AF]">Secure &amp; encrypted connection</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
