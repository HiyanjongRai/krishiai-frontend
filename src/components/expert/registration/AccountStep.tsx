"use client";

import React, { useState, useEffect } from "react";
import { useExpertApplication } from "@/providers/expert-application-provider";
import { useAuthModal } from "@/providers/auth-modal-provider";
import { useAuth } from "@/providers/auth-provider";
import { ProfileImageUpload } from "@/components/ui/profile-image-upload";
import {
  ALLOWED_TYPE_LABELS,
  MAX_IMAGE_SIZE_LABEL,
  validateImageFile,
} from "@/services/media/mediaService";
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
  Camera,
} from "lucide-react";

export function AccountStep() {
  const { application, updateAccount, nextStep } = useExpertApplication();
  const { openLogin } = useAuthModal();
  const { user, updateUser } = useAuth();
  const account = application.account;

  useEffect(() => {
    if (user) {
      if (!account.fullName && user.fullName) updateAccount({ fullName: user.fullName });
      if (!account.email && user.email) updateAccount({ email: user.email });
      if (!account.phone && user.phone) updateAccount({ phone: user.phone });
    }
  }, [user]);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [photoError, setPhotoError] = useState<string | null>(null);

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

  if (!user?.profileImage && !account.profilePhotoFile) {
    errors.profilePhoto = "Professional profile photo is required";
  }

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: "None", color: "bg-[#F1F5F2]", text: "text-[#9CA3AF]" };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 1;
    if (/\d/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    switch (score) {
      case 1: return { score: 1, label: "Weak", color: "bg-[#DC2626]", text: "text-[#DC2626]" };
      case 2: return { score: 2, label: "Fair", color: "bg-[#F59E0B]", text: "text-[#F59E0B]" };
      case 3: return { score: 3, label: "Good", color: "bg-[#2563EB]", text: "text-[#2563EB]" };
      case 4: return { score: 4, label: "Strong", color: "bg-[#2E7D32]", text: "text-[#2E7D32]" };
      default: return { score: 0, label: "None", color: "bg-[#F1F5F2]", text: "text-[#9CA3AF]" };
    }
  };

  const strength = getPasswordStrength(account.password);

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ fullName: true, email: true, phone: true, password: true, confirmPassword: true, profilePhoto: true });
    if (Object.keys(errors).length === 0) {
      nextStep();
    }
  };

  const handlePendingPhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      setPhotoError(validationError);
      updateAccount({ profilePhotoFile: undefined, profilePhotoPreviewUrl: undefined });
      event.target.value = "";
      return;
    }

    if (account.profilePhotoPreviewUrl) {
      URL.revokeObjectURL(account.profilePhotoPreviewUrl);
    }
    setPhotoError(null);
    updateAccount({
      profilePhotoFile: file,
      profilePhotoPreviewUrl: URL.createObjectURL(file),
    });
    event.target.value = "";
  };

  const clearPendingPhoto = () => {
    if (account.profilePhotoPreviewUrl) {
      URL.revokeObjectURL(account.profilePhotoPreviewUrl);
    }
    updateAccount({ profilePhotoFile: undefined, profilePhotoPreviewUrl: undefined });
  };

  const inputBase =
    "w-full pl-9 pr-3.5 py-2.5 rounded-[14px] border text-sm text-[#1F2937] placeholder-[#9CA3AF] bg-[#F1F5F2] focus:bg-white focus:outline-none transition-all";
  const inputNormal = "border-[#E5E7EB] focus:border-[#2E7D32] focus:ring-2 focus:ring-[#E8F5E9]";
  const inputError = "border-[#DC2626] ring-2 ring-rose-100";

  return (
    <div className="rounded-[28px] border border-[#E5E7EB] bg-white p-6 sm:p-8 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE] space-y-6 animate-in fade-in duration-200">
      {/* Step Header */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F5E9] border border-[#C8E6C9] text-[#2E7D32] text-[10px] font-black tracking-[0.12em] uppercase">
          <ShieldCheck className="w-3 h-3" />
          <span>Step 1 of 5 — Expert Account</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-[#1F2937] tracking-tight">
          Become a KrishiAI Expert
        </h2>
        <p className="text-sm text-[#9CA3AF] leading-relaxed">
          Join a trusted network of agricultural professionals and help farmers make better decisions.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Profile Picture Section */}
        <div className={`p-4 rounded-[20px] border flex flex-col sm:flex-row items-center gap-4 ${
          touched.profilePhoto && errors.profilePhoto
            ? "bg-[#FEE2E2] border-[#FCA5A5]"
            : "bg-[#F1F5F2] border-[#E5E7EB]"
        }`}>
          {user ? (
            <ProfileImageUpload
              currentImageUrl={user.profileImage}
              userName={user.fullName || account.fullName}
              onUploadSuccess={(updated) => updateUser(updated)}
              onRemoveSuccess={(updated) => updateUser(updated)}
              size="md"
            />
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="relative h-20 w-20 overflow-hidden rounded-full border border-[#E5E7EB] bg-white">
                {account.profilePhotoPreviewUrl ? (
                  // A blob preview cannot use Next/Image reliably across all browsers.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={account.profilePhotoPreviewUrl}
                    alt="Selected profile preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[#9CA3AF]">
                    <Camera className="h-6 w-6" />
                  </div>
                )}
              </div>
              <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[#2E7D32] px-3.5 py-1.5 text-[11px] font-bold text-white shadow-xs transition-colors hover:bg-[#256B2A]">
                <Camera className="h-3.5 w-3.5" />
                {account.profilePhotoFile ? "Change Photo" : "Upload Photo"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  onChange={handlePendingPhotoChange}
                />
              </label>
              {account.profilePhotoFile && (
                <button
                  type="button"
                  onClick={clearPendingPhoto}
                  className="text-[10px] font-semibold text-[#DC2626] transition-colors hover:text-[#DC2626]"
                >
                  Remove photo
                </button>
              )}
            </div>
          )}

          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-xs font-black text-[#1F2937] uppercase tracking-[0.12em]">
              Profile Photo <span className="text-[#DC2626]">*</span>
            </h4>
            <p className="text-xs text-[#6B7280]">
              Upload a clear professional headshot for admin verification and farmer trust.
            </p>
            <p className="text-[10px] text-[#9CA3AF]">
              {ALLOWED_TYPE_LABELS} &bull; Max {MAX_IMAGE_SIZE_LABEL}
            </p>
            {(photoError || (touched.profilePhoto && errors.profilePhoto)) && (
              <p className="text-[11px] font-medium text-[#DC2626] flex items-center justify-center gap-1 sm:justify-start">
                <X className="w-3 h-3" />
                <span>{photoError || errors.profilePhoto}</span>
              </p>
            )}
          </div>
        </div>

        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-black text-[#1F2937] uppercase tracking-[0.12em]">
            Full Name <span className="text-[#DC2626]">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9CA3AF]">
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
            <p className="text-[11px] font-medium text-[#DC2626] flex items-center gap-1">
              <X className="w-3 h-3" /><span>{errors.fullName}</span>
            </p>
          )}
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-black text-[#1F2937] uppercase tracking-[0.12em]">
              Email Address <span className="text-[#DC2626]">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9CA3AF]">
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
              <p className="text-[11px] font-medium text-[#DC2626] flex items-center gap-1">
                <X className="w-3 h-3" /><span>{errors.email}</span>
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-black text-[#1F2937] uppercase tracking-[0.12em]">
              Phone Number <span className="text-[#DC2626]">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9CA3AF]">
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
              <p className="text-[11px] font-medium text-[#DC2626] flex items-center gap-1">
                <X className="w-3 h-3" /><span>{errors.phone}</span>
              </p>
            )}
          </div>
        </div>

        {/* Password & Confirm */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-black text-[#1F2937] uppercase tracking-[0.12em]">
              Password <span className="text-[#DC2626]">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9CA3AF]">
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
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#9CA3AF] hover:text-[#4B5563] cursor-pointer"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            {touched.password && errors.password && (
              <p className="text-[11px] font-medium text-[#DC2626] flex items-center gap-1">
                <X className="w-3 h-3" /><span>{errors.password}</span>
              </p>
            )}
            {account.password && (
              <div className="pt-1 space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-[#9CA3AF]">Security strength:</span>
                  <span className={`font-bold ${strength.text}`}>{strength.label}</span>
                </div>
                <div className="grid grid-cols-4 gap-1 h-1 w-full">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-full rounded-full transition-all ${strength.score >= level ? strength.color : "bg-[#F1F5F2]"}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-black text-[#1F2937] uppercase tracking-[0.12em]">
              Confirm Password <span className="text-[#DC2626]">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9CA3AF]">
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
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#9CA3AF] hover:text-[#4B5563] cursor-pointer"
                aria-label="Toggle confirm password visibility"
              >
                {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            {touched.confirmPassword && errors.confirmPassword && (
              <p className="text-[11px] font-medium text-[#DC2626] flex items-center gap-1">
                <X className="w-3 h-3" /><span>{errors.confirmPassword}</span>
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-[#9CA3AF] flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-[#2E7D32]" />
            <span>Credentials are securely encrypted and private.</span>
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 bg-[#2E7D32] hover:bg-[#256B2A] text-white font-bold text-sm rounded-full transition-all shadow-[0_4px_12px_#E5E7EB] flex items-center justify-center gap-2 cursor-pointer group"
          >
            <span>Continue to Professional Background</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </form>

      {/* Sign-in link */}
      <div className="pt-4 border-t border-[#E5E7EB] text-center">
        <p className="text-xs text-[#9CA3AF]">
          Already have an account?{" "}
          <button
            type="button"
            onClick={openLogin}
            className="font-bold text-[#2E7D32] hover:underline cursor-pointer"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
