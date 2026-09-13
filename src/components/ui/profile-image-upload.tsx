"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { Camera, X, Loader2, AlertCircle, CheckCircle2, Trash2 } from "lucide-react";
import { UserAvatar } from "@/components/ui/avatar";
import {
  uploadProfileImage,
  removeProfileImage,
  validateImageFile,
  ALLOWED_TYPE_LABELS,
  MAX_IMAGE_SIZE_LABEL,
} from "@/services/media/mediaService";
import type { UserResponse } from "@/types/auth";
import { ApiError } from "@/lib/api";

// ─── Size variants ────────────────────────────────────────────────────────────
const sizeConfig = {
  md: { avatar: "lg" as const, wrapperCls: "w-20 h-20" },
  lg: { avatar: "xl" as const, wrapperCls: "w-24 h-24" },
};

type UploadSize = keyof typeof sizeConfig;

interface ProfileImageUploadProps {
  /** Current Cloudinary secureUrl (from user.profileImage) */
  currentImageUrl?: string | null;
  /** User display name for alt text and initials fallback */
  userName?: string | null;
  /** Called with the updated UserResponse after a successful upload */
  onUploadSuccess: (updatedUser: UserResponse) => void;
  /** Called with the updated UserResponse after successful removal */
  onRemoveSuccess?: (updatedUser: UserResponse) => void;
  /** Show "Remove photo" option */
  allowRemove?: boolean;
  size?: UploadSize;
}

type UploadState = "idle" | "uploading" | "removing" | "success" | "error";

export function ProfileImageUpload({
  currentImageUrl,
  userName,
  onUploadSuccess,
  onRemoveSuccess,
  allowRemove = true,
  size = "md",
}: ProfileImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Cleanup object URL on unmount or when preview changes
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const displayUrl = previewUrl ?? currentImageUrl ?? null;
  const { avatar: avatarSize, wrapperCls } = sizeConfig[size];
  const isProcessing = uploadState === "uploading" || uploadState === "removing";

  // ─── Handle file select ───────────────────────────────────────────────────
  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Reset
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setErrorMsg(null);
      setUploadState("idle");

      // Frontend validation
      const validationError = validateImageFile(file);
      if (validationError) {
        setErrorMsg(validationError);
        setUploadState("error");
        e.target.value = "";
        return;
      }

      // Preview immediately
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      setUploadState("uploading");

      try {
        const updatedUser = await uploadProfileImage(file);
        // Replace local preview with the real Cloudinary URL
        URL.revokeObjectURL(objectUrl);
        setPreviewUrl(null);
        setUploadState("success");
        onUploadSuccess(updatedUser);
        // Reset success indicator after 2 s
        setTimeout(() => setUploadState("idle"), 2000);
      } catch (err) {
        URL.revokeObjectURL(objectUrl);
        setPreviewUrl(null);
        setUploadState("error");
        if (err instanceof ApiError) {
          setErrorMsg(err.message);
        } else {
          setErrorMsg("Unable to upload the image. Please try again.");
        }
      } finally {
        e.target.value = "";
      }
    },
    [previewUrl, onUploadSuccess]
  );

  // ─── Handle remove ────────────────────────────────────────────────────────
  const handleRemove = useCallback(async () => {
    if (!currentImageUrl || isProcessing) return;
    setErrorMsg(null);
    setUploadState("removing");

    try {
      const updatedUser = await removeProfileImage();
      setUploadState("idle");
      onRemoveSuccess?.(updatedUser);
    } catch (err) {
      setUploadState("error");
      if (err instanceof ApiError) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Unable to remove the image. Please try again.");
      }
    }
  }, [currentImageUrl, isProcessing, onRemoveSuccess]);

  const openPicker = () => {
    if (!isProcessing) fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {/* ── Avatar with overlay button ───────────────────────────────── */}
      <div className={`relative group ${wrapperCls}`}>
        <UserAvatar
          src={displayUrl}
          name={userName}
          size={avatarSize}
          className="w-full h-full"
        />

        {/* Overlay — camera button */}
        <button
          type="button"
          onClick={openPicker}
          disabled={isProcessing}
          aria-label="Change profile photo"
          className={`
            absolute inset-0 rounded-[inherit] flex items-center justify-center
            bg-black/40 opacity-0 group-hover:opacity-100
            transition-opacity duration-200 cursor-pointer
            disabled:cursor-not-allowed focus-visible:opacity-100
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0F9F68]
          `}
        >
          {uploadState === "uploading" ? (
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          ) : (
            <Camera className="w-5 h-5 text-white" />
          )}
        </button>
      </div>

      {/* ── Action buttons ────────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-1.5">
        <button
          type="button"
          onClick={openPicker}
          disabled={isProcessing}
          className={`
            inline-flex items-center gap-1.5 text-[11px] font-bold px-3.5 py-1.5 rounded-full
            transition-all duration-150 cursor-pointer active:scale-95
            disabled:opacity-50 disabled:cursor-not-allowed
            ${uploadState === "uploading"
              ? "bg-[#DDF4EA] text-[#0F9F68] border border-[#BCE9D5]"
              : "bg-[#0F9F68] text-white hover:bg-[#0D8A5A] shadow-xs"
            }
          `}
        >
          {uploadState === "uploading" ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Uploading…
            </>
          ) : uploadState === "success" ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              Photo Updated!
            </>
          ) : (
            <>
              <Camera className="w-3.5 h-3.5" />
              {currentImageUrl ? "Change Photo" : "Upload Photo"}
            </>
          )}
        </button>

        {/* Remove button */}
        {allowRemove && currentImageUrl && uploadState !== "uploading" && (
          <button
            type="button"
            onClick={handleRemove}
            disabled={isProcessing}
            className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-500 hover:text-rose-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Remove profile photo"
          >
            {uploadState === "removing" ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Trash2 className="w-3 h-3" />
            )}
            {uploadState === "removing" ? "Removing…" : "Remove photo"}
          </button>
        )}

        {/* Hint text */}
        {uploadState !== "uploading" && uploadState !== "removing" && (
          <p className="text-[10px] text-gray-400 text-center">
            {ALLOWED_TYPE_LABELS} &bull; Max {MAX_IMAGE_SIZE_LABEL}
          </p>
        )}
      </div>

      {/* ── Error message ─────────────────────────────────────────────── */}
      {uploadState === "error" && errorMsg && (
        <div
          className="flex items-start gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] text-rose-700 font-medium max-w-xs"
          role="alert"
          aria-live="assertive"
        >
          <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-rose-500" />
          <span>{errorMsg}</span>
          <button
            type="button"
            onClick={() => { setErrorMsg(null); setUploadState("idle"); }}
            className="ml-auto text-rose-400 hover:text-rose-600 transition-colors cursor-pointer"
            aria-label="Dismiss error"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={["image/jpeg", "image/png", "image/webp"].join(",")}
        className="sr-only"
        aria-label="Select profile photo"
        onChange={handleFileChange}
        disabled={isProcessing}
      />
    </div>
  );
}
