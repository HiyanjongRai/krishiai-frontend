"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { api } from "@/lib/api";
import { formatFullName } from "@/lib/format-utils";
import {
  LayoutDashboard,
  MessageSquareText,
  Bot,
  CalendarCheck,
  Award,
  ShieldCheck,
  Clock,
  AlertCircle,
  HelpCircle,
  LogOut,
  Sparkles,
  ExternalLink,
  FileText,
  Sprout,
} from "lucide-react";

interface ExpertQuickProfile {
  verifiedExpert: boolean;
  applicationStatus: string;
  designation?: string;
  specializations?: Array<{ name: string }>;
}

export function ExpertSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [profileData, setProfileData] = useState<ExpertQuickProfile | null>(null);

  useEffect(() => {
    let isMounted = true;
    api
      .get<any>("/v1/expert/profile")
      .then((data) => {
        if (isMounted && data) {
          setProfileData({
            verifiedExpert: Boolean(data.verifiedExpert),
            applicationStatus: data.applicationStatus || "DRAFT",
            designation: data.designation || "Agricultural Specialist",
            specializations: data.specializations || [],
          });
        }
      })
      .catch(() => {
        // graceful fallback
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const navItems = [
    {
      label: "Dashboard",
      href: "/expert/dashboard",
      icon: LayoutDashboard,
      isActive: pathname === "/expert/dashboard",
    },
    {
      label: "Farmer Inquiries",
      href: "/expert/consultations",
      icon: MessageSquareText,
      badge: "5",
      badgeColor: "bg-[#DDF4EA] text-[#0F9F68] border-[#BCE9D5]",
      isActive: pathname.startsWith("/expert/consultations"),
    },
    {
      label: "Crop Expertise",
      href: "/expert/expertise",
      icon: Sprout,
      isActive: pathname.startsWith("/expert/expertise"),
    },
    {
      label: "Verification Documents",
      href: "/expert/documents",
      icon: FileText,
      isActive: pathname.startsWith("/expert/documents"),
    },
    {
      label: "AI Diagnostic Reviews",
      href: "/expert/ai-reviews",
      icon: Bot,
      badge: "AI",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      isActive: pathname.startsWith("/expert/ai-reviews"),
    },
    {
      label: "Availability & Slots",
      href: "/expert/availability",
      icon: CalendarCheck,
      isActive: pathname.startsWith("/expert/availability"),
    },
    {
      label: "Profile & Credentials",
      href: "/expert/profile",
      icon: Award,
      isActive: pathname.startsWith("/expert/profile"),
    },
  ];

  const isVerified = profileData?.verifiedExpert;
  const appStatus = profileData?.applicationStatus || "DRAFT";

  return (
    <aside className="w-68 shrink-0 hidden lg:block select-none">
      <div className="bg-white rounded-[28px] border border-[rgba(234,234,236,0.85)] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] p-4 space-y-4 sticky top-24">
        {/* Brand / Role Banner */}
        <div className="flex items-center gap-3 px-2 py-2 border-b border-gray-100">
          <div className="w-10 h-10 rounded-[14px] bg-gradient-to-br from-[#0F9F68] to-[#0A6B45] flex items-center justify-center text-white shadow-2xs ring-2 ring-[#0F9F68]/15">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="font-bold text-base tracking-tight text-[#171717] block leading-none">
              Krishi<span className="text-[#0F9F68]">AI</span>
            </span>
            <span className="text-[10px] font-bold text-[#0F9F68] block mt-1 tracking-wide uppercase">
              Expert Specialist Portal
            </span>
          </div>
        </div>

        {/* Verification Status Banner Pill */}
        <div className="px-1">
          {isVerified ? (
            <div className="flex items-center gap-2.5 p-3 rounded-[20px] bg-[#DDF4EA]/80 border border-[#BCE9D5] text-[#0F9F68]">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#0F9F68] shadow-2xs shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold block leading-tight text-[#171717]">Verified Expert</span>
                <span className="text-[10px] text-[#0F9F68] font-semibold">Licensed Field Agronomist</span>
              </div>
            </div>
          ) : appStatus === "SUBMITTED" || appStatus === "UNDER_REVIEW" ? (
            <div className="flex items-center gap-2.5 p-3 rounded-[20px] bg-blue-50 border border-blue-200 text-blue-800">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-2xs shrink-0">
                <Clock className="w-4 h-4 animate-pulse" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold block leading-tight text-[#171717]">Under Admin Review</span>
                <span className="text-[10px] text-blue-600 font-medium">Verification in progress</span>
              </div>
            </div>
          ) : (
            <Link
              href="/expert/profile"
              className="flex items-center gap-2.5 p-3 rounded-[20px] bg-[#F4F4F6] border border-gray-200/80 hover:bg-[#DDF4EA]/50 hover:border-[#BCE9D5] transition-colors text-gray-700 group"
            >
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-amber-500 shadow-2xs shrink-0">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold block leading-tight text-[#171717] group-hover:text-[#0F9F68]">
                  Complete Verification
                </span>
                <span className="text-[10px] text-gray-500 font-medium">Submit documents to activate</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#0F9F68] shrink-0" />
            </Link>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          <div className="text-[10px] font-bold text-gray-400 tracking-wider px-3 py-1 uppercase">
            Workspace
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-full text-xs font-semibold transition-all group ${
                  item.isActive
                    ? "bg-[#0F9F68] text-white font-bold shadow-xs"
                    : "text-gray-600 hover:text-[#171717] hover:bg-[#F4F4F6]"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      item.isActive
                        ? "text-white"
                        : "text-gray-400 group-hover:text-[#0F9F68]"
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black border shrink-0 ${
                      item.isActive
                        ? "bg-white/20 text-white border-white/30"
                        : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Profile & Logout */}
        <div className="pt-3 border-t border-gray-100 space-y-3">
          <div className="p-2.5 rounded-[20px] bg-[#F4F4F6]/70 border border-gray-200/60 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-[12px] bg-gradient-to-br from-[#0F9F68] to-[#0A6B45] flex items-center justify-center font-black text-xs text-white shrink-0 shadow-2xs">
              {formatFullName(user?.fullName || "Expert").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <span className="font-bold text-xs text-[#171717] block leading-tight truncate">
                {formatFullName(user?.fullName || "Expert Specialist")}
              </span>
              <span className="text-[10px] text-gray-500 font-medium block truncate">
                {profileData?.designation || "Agricultural Consultant"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-semibold text-gray-500 px-2">
            <Link
              href="/"
              className="flex items-center gap-1.5 hover:text-[#0F9F68] transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Public Portal</span>
            </Link>
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-1 text-rose-600 hover:text-rose-700 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
