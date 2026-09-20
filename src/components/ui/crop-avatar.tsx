"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Award, Leaf, Sprout } from "lucide-react";
import { getCropImageUrl } from "@/utils/crop-utils";

export interface CropAvatarProps {
  name?: string | null;
  imageUrl?: string | null;
  emoji?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  isArea?: boolean;
}

const SIZE_MAP = {
  xs: {
    container: "w-6 h-6 rounded-md",
    imgSizes: "24px",
    icon: "w-3 h-3",
    emoji: "text-xs",
  },
  sm: {
    container: "w-8 h-8 rounded-lg",
    imgSizes: "32px",
    icon: "w-3.5 h-3.5",
    emoji: "text-sm",
  },
  md: {
    container: "w-10 h-10 rounded-xl",
    imgSizes: "40px",
    icon: "w-4 h-4",
    emoji: "text-base",
  },
  lg: {
    container: "w-12 h-12 rounded-2xl",
    imgSizes: "48px",
    icon: "w-5 h-5",
    emoji: "text-xl",
  },
  xl: {
    container: "w-16 h-16 rounded-2xl",
    imgSizes: "64px",
    icon: "w-7 h-7",
    emoji: "text-2xl",
  },
};

export function CropAvatar({
  name,
  imageUrl,
  emoji,
  size = "md",
  className = "",
  isArea = false,
}: CropAvatarProps) {
  const [imgError, setImgError] = useState(false);
  const resolvedUrl = !imgError ? getCropImageUrl({ name: name ?? undefined, imageUrl }) : null;
  const config = SIZE_MAP[size] || SIZE_MAP.md;

  if (isArea) {
    return (
      <div
        className={`flex shrink-0 items-center justify-center border border-[#E5E7EB] bg-[#F8FAF8] text-[#2E7D32] ${config.container} ${className}`}
      >
        <Award className={config.icon} />
      </div>
    );
  }

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden border border-[#E5E7EB] bg-[#F8FAF8] ${config.container} ${className}`}
    >
      {resolvedUrl ? (
        <Image
          src={resolvedUrl}
          alt={name || "Crop"}
          fill
          sizes={config.imgSizes}
          className="object-contain p-1"
          unoptimized
          onError={() => setImgError(true)}
        />
      ) : emoji && emoji.trim().length > 0 && emoji.length <= 4 ? (
        <span className={`leading-none select-none ${config.emoji}`}>{emoji}</span>
      ) : (
        <Leaf className={`${config.icon} text-[#2E7D32]`} />
      )}
    </div>
  );
}
