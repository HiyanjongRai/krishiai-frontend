"use client";

import React, { useState } from "react";
import Image from "next/image";
import { User } from "lucide-react";

// ─── Size map ─────────────────────────────────────────────────────────────────
const sizeMap = {
  xs:  { px: 24,  cls: "w-6 h-6 text-[9px] rounded-[6px]"   },
  sm:  { px: 36,  cls: "w-9 h-9 text-xs rounded-[10px]"      },
  md:  { px: 48,  cls: "w-12 h-12 text-sm rounded-[14px]"    },
  lg:  { px: 64,  cls: "w-16 h-16 text-base rounded-[18px]"  },
  xl:  { px: 96,  cls: "w-24 h-24 text-xl rounded-[24px]"    },
} as const;

type AvatarSize = keyof typeof sizeMap;

// ─── Default Realistic Professional Portraits ────────────────────────────────
// Assigned deterministically by name so that each person consistently gets a proper photo
const DEFAULT_AVATARS = [
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80",
];

export function getDefaultAvatar(name?: string | null): string {
  if (!name || !name.trim()) return DEFAULT_AVATARS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return DEFAULT_AVATARS[Math.abs(hash) % DEFAULT_AVATARS.length];
}

// ─── Gradient pool for initials fallback ──────────────────────────────────────
const GRADIENTS = [
  "from-[#2E7D32] to-[#1B5E20]",
  "from-[#E8F5E9] to-[#E8F5E9]",
  "from-[#E8F5E9]0 to-[#E8F5E9]",
  "from-[#DBEAFE] to-[#DBEAFE]",
  "from-[#4F46E5] to-[#4338CA]",
  "from-[#E8F5E9] to-[#E8F5E9]",
];

function pickGradient(name?: string | null): string {
  if (!name) return GRADIENTS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
}

function getInitials(name?: string | null): string {
  if (!name?.trim()) return "";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

// ─── Component ────────────────────────────────────────────────────────────────
export interface UserAvatarProps {
  /** Cloudinary secureUrl or any image URL */
  src?: string | null;
  /** User display name — used for deterministic avatar assignment and alt text */
  name?: string | null;
  size?: AvatarSize;
  className?: string;
  /** Whether to show a realistic default photo if no custom photo uploaded. Defaults to true. */
  fallbackPhoto?: boolean;
}

export function UserAvatar({
  src,
  name,
  size = "md",
  className = "",
  fallbackPhoto = true,
}: UserAvatarProps) {
  const [imgError, setImgError] = useState(false);
  const { px, cls } = sizeMap[size];
  const initials = getInitials(name);
  const gradient = pickGradient(name);
  const altText = name ? `Profile photo of ${name}` : "User avatar";

  const base = `relative shrink-0 flex items-center justify-center overflow-hidden font-black select-none ${cls} ${className}`;

  // Priority 1: custom uploaded photo (Cloudinary, etc.) or default professional portrait
  const photoUrl = src || (fallbackPhoto ? getDefaultAvatar(name) : null);

  if (photoUrl && !imgError) {
    return (
      <div className={base} aria-label={altText}>
        <Image
          src={photoUrl}
          alt={altText}
          fill
          sizes={`${px}px`}
          className="object-cover"
          onError={() => setImgError(true)}
          unoptimized={!photoUrl.includes("cloudinary.com")}
          priority={size === "xl" || size === "lg"}
        />
      </div>
    );
  }

  // Priority 2: initials with gradient
  if (initials) {
    return (
      <div
        className={`${base} bg-gradient-to-br ${gradient} text-white shadow-xs`}
        aria-label={altText}
        role="img"
      >
        {initials}
      </div>
    );
  }

  // Priority 3: generic user icon
  return (
    <div
      className={`${base} bg-gradient-to-br from-[#F3F4F6] to-[#F3F4F6] text-white`}
      aria-label={altText}
      role="img"
    >
      <User className="w-[55%] h-[55%]" />
    </div>
  );
}
