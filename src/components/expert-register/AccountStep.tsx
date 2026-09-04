"use client";

import React, { useState } from "react";
import { useExpertApplication } from "@/providers/expert-application-provider";
import { useAuthModal } from "@/providers/auth-modal-provider";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  Lock,
  ArrowRight,
  Check,
  X,
  ShieldCheck,
} from "lucide-react";

export function AccountStep() {
  const { application, updateAccount, nextStep } = useExpertApplication();
  const { openLogin } = useAuthModal();
  const account = application.account;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validation
  const errors: Record<string, string> = {};
  if (!account.fullName.trim()) {
    errors.fullName = "Full name is required";
  } else if (account.fullName.trim().length < 3) {
    errors.fullName = "Name should be at least 3 characters";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!account.email.trim()) {
    errors.email = "Email address is required";
  } else if (!emailRegex.test(account.email)) {
    errors.email = "Please enter a valid email address";
  }

  const phoneRegex = /^(\+?977)?[9][6-8]\d{8}$/;
  if (!account.phone.trim()) {
    errors.phone = "Phone number is required";
  } else if (account.phone.replace(/[\s-]/g, "").length < 10) {
    errors.phone = "Enter a valid 10-digit mobile number";
  }

  if (!account.password) {
    errors.password = "Password is required";
  } else if (account.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  if (!account.confirmPassword) {
    errors.confirmPassword = "Confirm password is required";
  } else if (account.password !== account.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  // Password strength meter
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: "None", color: "bg-slate-200" };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 1;
    if (/\d/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    switch (score) {
      case 1:
        return { score: 1, label: "Weak", color: "bg-rose-500", text: "text-rose-600" };
      case 2:
        return { score: 2, label: "Fair", color: "bg-amber-500", text: "text-amber-600" };
      case 3:
        return { score: 3, label: "Good", color: "bg-blue-500", text: "text-blue-600" };
      case 4:
        return { score: 4, label: "Strong", color: "bg-emerald-600", text: "text-emerald-700" };
      default:
        return { score: 0, label: "None", color: "bg-slate-200", text: "text-slate-400" };
    }
  };

  const strength = getPasswordStrength(account.password);

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      fullName: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true,
    });

    if (Object.keys(errors).length === 0) {
      nextStep();
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E2E8E3] shadow-xs space-y-5 animate-in fade-in duration-200">
      {/* Step Header */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F0FDF4] border border-emerald-200/80 text-[#166534] text-[10px] font-bold">
          <ShieldCheck className="w-3 h-3 text-[#166534]" />
          <span>Step 1 • Expert Account</span>
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-[#17201A] tracking-tight">
          Become a KrishiAI Expert
        </h2>
        <p className="text-xs text-[#647067] leading-relaxed">
          Join a trusted network of agricultural professionals and help farmers make better decisions.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1">
          <label className="block text-[11px] font-bold text-[#17201A] uppercase tracking-wider">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <User className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={account.fullName}
              onChange={(e) => updateAccount({ fullName: e.target.value })}
              onBlur={() => handleBlur("fullName")}
              placeholder="e.g. Dr. Ram Prasad Sharma"
              className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-xs sm:text-sm text-[#17201A] placeholder-slate-400 bg-[#F7F9F4] focus:bg-white focus:outline-none transition-all ${
                touched.fullName && errors.fullName
                  ? "border-rose-400 ring-1 ring-rose-200"
                  : "border-[#E2E8E3] focus:border-[#166534] focus:ring-2 focus:ring-emerald-100"
              }`}
            />
          </div>
          {touched.fullName && errors.fullName && (
            <p className="text-[11px] font-medium text-rose-600 flex items-center gap-1">
              <X className="w-3 h-3" />
              <span>{errors.fullName}</span>
            </p>
          )}
        </div>

        {/* Email Address & Phone Number Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Email */}
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-[#17201A] uppercase tracking-wider">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-3.5 h-3.5" />
              </div>
              <input
                type="email"
                value={account.email}
                onChange={(e) => updateAccount({ email: e.target.value })}
                onBlur={() => handleBlur("email")}
                placeholder="ram.sharma@narc.gov.np"
                className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-xs sm:text-sm text-[#17201A] placeholder-slate-400 bg-[#F7F9F4] focus:bg-white focus:outline-none transition-all ${
                  touched.email && errors.email
                    ? "border-rose-400 ring-1 ring-rose-200"
                    : "border-[#E2E8E3] focus:border-[#166534] focus:ring-2 focus:ring-emerald-100"
                }`}
              />
            </div>
            {touched.email && errors.email && (
              <p className="text-[11px] font-medium text-rose-600 flex items-center gap-1">
                <X className="w-3 h-3" />
                <span>{errors.email}</span>
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-[#17201A] uppercase tracking-wider">
              Phone Number <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <input
                type="tel"
                value={account.phone}
                onChange={(e) => updateAccount({ phone: e.target.value })}
                onBlur={() => handleBlur("phone")}
                placeholder="9841234567"
                className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-xs sm:text-sm text-[#17201A] placeholder-slate-400 bg-[#F7F9F4] focus:bg-white focus:outline-none transition-all ${
                  touched.phone && errors.phone
                    ? "border-rose-400 ring-1 ring-rose-200"
                    : "border-[#E2E8E3] focus:border-[#166534] focus:ring-2 focus:ring-emerald-100"
                }`}
              />
            </div>
            {touched.phone && errors.phone && (
              <p className="text-[11px] font-medium text-rose-600 flex items-center gap-1">
                <X className="w-3 h-3" />
                <span>{errors.phone}</span>
              </p>
            )}
          </div>
        </div>

        {/* Password & Confirm Password Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Password */}
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-[#17201A] uppercase tracking-wider">
              Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-3.5 h-3.5" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={account.password}
                onChange={(e) => updateAccount({ password: e.target.value })}
                onBlur={() => handleBlur("password")}
                placeholder="At least 8 characters"
                className={`w-full pl-9 pr-9 py-2.5 rounded-xl border text-xs sm:text-sm text-[#17201A] placeholder-slate-400 bg-[#F7F9F4] focus:bg-white focus:outline-none transition-all ${
                  touched.password && errors.password
                    ? "border-rose-400 ring-1 ring-rose-200"
                    : "border-[#E2E8E3] focus:border-[#166534] focus:ring-2 focus:ring-emerald-100"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            {touched.password && errors.password && (
              <p className="text-[11px] font-medium text-rose-600 flex items-center gap-1">
                <X className="w-3 h-3" />
                <span>{errors.password}</span>
              </p>
            )}

            {/* Strength indicator */}
            {account.password && (
              <div className="pt-1 space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-500">Security strength:</span>
                  <span className={`font-bold ${strength.text}`}>{strength.label}</span>
                </div>
                <div className="grid grid-cols-4 gap-1 h-1 w-full">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-full rounded-full transition-all ${
                        strength.score >= level ? strength.color : "bg-slate-200"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-[#17201A] uppercase tracking-wider">
              Confirm Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-3.5 h-3.5" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={account.confirmPassword}
                onChange={(e) => updateAccount({ confirmPassword: e.target.value })}
                onBlur={() => handleBlur("confirmPassword")}
                placeholder="Re-enter password"
                className={`w-full pl-9 pr-9 py-2.5 rounded-xl border text-xs sm:text-sm text-[#17201A] placeholder-slate-400 bg-[#F7F9F4] focus:bg-white focus:outline-none transition-all ${
                  touched.confirmPassword && errors.confirmPassword
                    ? "border-rose-400 ring-1 ring-rose-200"
                    : "border-[#E2E8E3] focus:border-[#166534] focus:ring-2 focus:ring-emerald-100"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label="Toggle confirm password visibility"
              >
                {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            {touched.confirmPassword && errors.confirmPassword && (
              <p className="text-[11px] font-medium text-rose-600 flex items-center gap-1">
                <X className="w-3 h-3" />
                <span>{errors.confirmPassword}</span>
              </p>
            )}
          </div>
        </div>

        {/* Submit & Navigation */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-[#647067]">
            🔒 Credentials are securely encrypted and private.
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 bg-[#166534] hover:bg-[#14532d] text-white font-bold text-xs rounded-xl transition-all shadow-2xs hover:shadow-xs flex items-center justify-center gap-2 cursor-pointer group"
          >
            <span>Continue to Professional Background</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </form>

      {/* Bottom Sign-in link */}
      <div className="pt-3 border-t border-slate-100 text-center">
        <p className="text-xs text-[#647067]">
          Already have an account?{" "}
          <button
            type="button"
            onClick={openLogin}
            className="font-bold text-[#166534] hover:underline cursor-pointer"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
