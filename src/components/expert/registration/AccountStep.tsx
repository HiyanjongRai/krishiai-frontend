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

  const normalizedPhone = account.phone.replace(/[\s-]/g, "");
  const phoneRegex = /^\+?[1-9]\d{6,14}$/;
  if (!account.phone.trim()) {
    errors.phone = "Phone number is required";
  } else if (!phoneRegex.test(normalizedPhone)) {
    errors.phone = "Enter a valid phone number, e.g. +9779801234567";
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

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: "None", color: "bg-[#F4F4F6]", text: "text-gray-400" };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 1;
    if (/\d/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    switch (score) {
      case 1: return { score: 1, label: "Weak", color: "bg-rose-500", text: "text-rose-600" };
      case 2: return { score: 2, label: "Fair", color: "bg-amber-500", text: "text-amber-600" };
      case 3: return { score: 3, label: "Good", color: "bg-blue-500", text: "text-blue-600" };
      case 4: return { score: 4, label: "Strong", color: "bg-[#0F9F68]", text: "text-[#0F9F68]" };
      default: return { score: 0, label: "None", color: "bg-[#F4F4F6]", text: "text-gray-400" };
    }
  };

  const strength = getPasswordStrength(account.password);

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ fullName: true, email: true, phone: true, password: true, confirmPassword: true });
    if (Object.keys(errors).length === 0) {
      nextStep();
    }
  };

  const inputBase =
    "w-full pl-9 pr-3.5 py-2.5 rounded-[14px] border text-sm text-[#171717] placeholder-gray-400 bg-[#F4F4F6] focus:bg-white focus:outline-none transition-all";
  const inputNormal = "border-[rgba(234,234,236,0.85)] focus:border-[#0F9F68] focus:ring-2 focus:ring-[#DDF4EA]";
  const inputError = "border-rose-400 ring-2 ring-rose-100";

  return (
    <div className="rounded-[28px] border border-[rgba(234,234,236,0.85)] bg-white p-6 sm:p-8 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04),0_2px_6px_-1px_rgba(0,0,0,0.02)] space-y-6 animate-in fade-in duration-200">
      {/* Step Header */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DDF4EA] border border-[#BCE9D5] text-[#0F9F68] text-[10px] font-black tracking-[0.12em] uppercase">
          <ShieldCheck className="w-3 h-3" />
          <span>Step 1 of 5 — Expert Account</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-[#171717] tracking-tight">
          Become a KrishiAI Expert
        </h2>
        <p className="text-sm text-gray-400 leading-relaxed">
          Join a trusted network of agricultural professionals and help farmers make better decisions.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-black text-[#171717] uppercase tracking-[0.12em]">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <User className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={account.fullName}
              onChange={(e) => updateAccount({ fullName: e.target.value })}
              onBlur={() => handleBlur("fullName")}
              placeholder="e.g. Dr. Ram Prasad Sharma"
              className={`${inputBase} ${touched.fullName && errors.fullName ? inputError : inputNormal}`}
            />
          </div>
          {touched.fullName && errors.fullName && (
            <p className="text-[11px] font-medium text-rose-600 flex items-center gap-1">
              <X className="w-3 h-3" /><span>{errors.fullName}</span>
            </p>
          )}
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-black text-[#171717] uppercase tracking-[0.12em]">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Mail className="w-3.5 h-3.5" />
              </div>
              <input
                type="email"
                value={account.email}
                onChange={(e) => updateAccount({ email: e.target.value })}
                onBlur={() => handleBlur("email")}
                placeholder="ram.sharma@narc.gov.np"
                className={`${inputBase} ${touched.email && errors.email ? inputError : inputNormal}`}
              />
            </div>
            {touched.email && errors.email && (
              <p className="text-[11px] font-medium text-rose-600 flex items-center gap-1">
                <X className="w-3 h-3" /><span>{errors.email}</span>
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-black text-[#171717] uppercase tracking-[0.12em]">
              Phone Number <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <input
                type="tel"
                value={account.phone}
                onChange={(e) => updateAccount({ phone: e.target.value })}
                onBlur={() => handleBlur("phone")}
                placeholder="9841234567"
                className={`${inputBase} ${touched.phone && errors.phone ? inputError : inputNormal}`}
              />
            </div>
            {touched.phone && errors.phone && (
              <p className="text-[11px] font-medium text-rose-600 flex items-center gap-1">
                <X className="w-3 h-3" /><span>{errors.phone}</span>
              </p>
            )}
          </div>
        </div>

        {/* Password & Confirm */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-black text-[#171717] uppercase tracking-[0.12em]">
              Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-3.5 h-3.5" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={account.password}
                onChange={(e) => updateAccount({ password: e.target.value })}
                onBlur={() => handleBlur("password")}
                placeholder="At least 8 characters"
                className={`${inputBase} pr-10 ${touched.password && errors.password ? inputError : inputNormal}`}
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
            {touched.password && errors.password && (
              <p className="text-[11px] font-medium text-rose-600 flex items-center gap-1">
                <X className="w-3 h-3" /><span>{errors.password}</span>
              </p>
            )}
            {account.password && (
              <div className="pt-1 space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-gray-400">Security strength:</span>
                  <span className={`font-bold ${strength.text}`}>{strength.label}</span>
                </div>
                <div className="grid grid-cols-4 gap-1 h-1 w-full">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-full rounded-full transition-all ${strength.score >= level ? strength.color : "bg-[#F4F4F6]"}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-black text-[#171717] uppercase tracking-[0.12em]">
              Confirm Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-3.5 h-3.5" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={account.confirmPassword}
                onChange={(e) => updateAccount({ confirmPassword: e.target.value })}
                onBlur={() => handleBlur("confirmPassword")}
                placeholder="Re-enter password"
                className={`${inputBase} pr-10 ${touched.confirmPassword && errors.confirmPassword ? inputError : inputNormal}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                aria-label="Toggle confirm password visibility"
              >
                {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            {touched.confirmPassword && errors.confirmPassword && (
              <p className="text-[11px] font-medium text-rose-600 flex items-center gap-1">
                <X className="w-3 h-3" /><span>{errors.confirmPassword}</span>
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-[rgba(234,234,236,0.85)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-gray-400 flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-[#0F9F68]" />
            <span>Credentials are securely encrypted and private.</span>
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 bg-[#0F9F68] hover:bg-[#0D8A5A] text-white font-bold text-sm rounded-full transition-all shadow-[0_4px_12px_rgba(15,159,104,0.3)] flex items-center justify-center gap-2 cursor-pointer group"
          >
            <span>Continue to Professional Background</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </form>

      {/* Sign-in link */}
      <div className="pt-4 border-t border-[rgba(234,234,236,0.85)] text-center">
        <p className="text-xs text-gray-400">
          Already have an account?{" "}
          <button
            type="button"
            onClick={openLogin}
            className="font-bold text-[#0F9F68] hover:underline cursor-pointer"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
