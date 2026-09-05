"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { api } from "@/lib/api";
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
    // Attempt to fetch expert profile state for dynamic badges
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
        // graceful fallback if offline
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
      badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
      isActive: pathname.startsWith("/expert/consultations"),
    },
    {
      label: "AI Reviews",
      href: "/expert/ai-reviews",
      icon: Bot,
      badge: "New",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
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
    <aside className="w-64 shrink-0 hidden lg:block select-none">
      <div className="bg-white rounded-3xl border border-[#E2E8E3] shadow-xs p-4 space-y-4 sticky top-24">
        {/* Brand / Role Banner */}
        <div className="flex items-center gap-3 px-2 py-2 border-b border-slate-100">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#166534] to-[#15803d] flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="font-black text-sm tracking-tight text-[#17201A] block leading-none">
              Krishi<span className="text-emerald-600">AI</span>
            </span>
            <span className="text-[10px] font-bold text-emerald-700 block mt-0.5 tracking-wide uppercase">
              Expert Portal
            </span>
          </div>
        </div>

        {/* Verification Status Banner Pill */}
        <div className="px-1">
          {isVerified ? (
            <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="min-w-0">
                <span className="text-[11px] font-bold block leading-tight">Verified Expert</span>
                <span className="text-[9px] text-emerald-600 font-medium">Licensed Agricultural Advisor</span>
              </div>
            </div>
          ) : appStatus === "SUBMITTED" ? (
            <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-800">
              <Clock className="w-4 h-4 text-amber-600 shrink-0 animate-pulse" />
              <div className="min-w-0">
                <span className="text-[11px] font-bold block leading-tight">Under Admin Review</span>
                <span className="text-[9px] text-amber-600 font-medium">Verification in progress</span>
              </div>
            </div>
          ) : (
            <Link
              href="/expert/profile"
              className="flex items-center gap-2 p-2.5 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-emerald-50/50 hover:border-emerald-300 transition-colors text-slate-700 group"
            >
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-bold block leading-tight text-slate-900 group-hover:text-emerald-700">
                  Complete Verification
                </span>
                <span className="text-[9px] text-slate-500">Submit documents to activate</span>
              </div>
              <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-emerald-600 shrink-0" />
            </Link>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1.5">
          <div className="text-[10px] font-bold text-slate-400 tracking-wider px-3 py-1 uppercase">
            Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all group ${
                  item.isActive
                    ? "bg-[#166534] text-white font-bold shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      item.isActive
                        ? "text-white"
                        : "text-slate-400 group-hover:text-emerald-700"
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${
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
        <div className="pt-3 border-t border-slate-100 space-y-2.5">
          <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-700 border border-emerald-500/40 flex items-center justify-center font-bold text-xs text-white shrink-0">
              {user?.fullName
                ? user.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()
                : "EX"}
            </div>
            <div className="min-w-0 flex-1">
              <span className="font-bold text-xs text-slate-900 block leading-tight truncate">
                {user?.fullName || "Expert Specialist"}
              </span>
              <span className="text-[10px] text-slate-500 block truncate">
                {profileData?.designation || "Agricultural Consultant"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 px-2">
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-emerald-700 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Public Site</span>
            </Link>
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-1 text-rose-600 hover:text-rose-700 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
