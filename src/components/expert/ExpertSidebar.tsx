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
import { UserAvatar } from "@/components/ui/avatar";

interface ExpertQuickProfile {
  verifiedExpert: boolean;
  applicationStatus: string;
  designation?: string;
  specializations?: Array<{ name: string }>;
}

interface ExpertProfileResponse {
  verifiedExpert?: boolean;
  applicationStatus?: string;
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
      .get<ExpertProfileResponse>("/v1/expert/profile")
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
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
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
    <aside className="hidden shrink-0 select-none bg-white border-r border-slate-200 md:flex flex-col md:w-16 lg:w-64 transition-all duration-200">
      <div className="sticky top-0 flex h-screen flex-col justify-between p-2.5 lg:p-3.5 overflow-y-auto no-scrollbar">
        <div className="space-y-3 lg:space-y-4">
          {/* Brand Header */}
          <div className="flex items-center justify-center lg:justify-start gap-2.5 px-1 py-1 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white shadow-xs shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="min-w-0 hidden lg:block">
              <span className="font-bold text-sm tracking-tight text-slate-900 block leading-tight">
                Krishi<span className="text-emerald-700">AI</span>
              </span>
              <span className="text-[10px] font-semibold text-emerald-700 block tracking-wide uppercase">
                Expert Portal
              </span>
            </div>
          </div>

          {/* Verification Status Banner Pill */}
          <div>
            {isVerified ? (
              <div
                title="Verified Expert - Licensed Agronomist"
                className="flex items-center justify-center lg:justify-start gap-2.5 p-2 lg:p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-900"
              >
                <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-emerald-700 shadow-2xs shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 hidden lg:block">
                  <span className="text-xs font-semibold block leading-tight text-slate-900">
                    Verified Expert
                  </span>
                  <span className="text-[10px] text-emerald-700 font-medium">Licensed Agronomist</span>
                </div>
              </div>
            ) : appStatus === "SUBMITTED" || appStatus === "UNDER_REVIEW" ? (
              <div
                title="Under Admin Review"
                className="flex items-center justify-center lg:justify-start gap-2.5 p-2 lg:p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900"
              >
                <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-blue-600 shadow-2xs shrink-0">
                  <Clock className="w-3.5 h-3.5 animate-pulse" />
                </div>
                <div className="min-w-0 hidden lg:block">
                  <span className="text-xs font-semibold block leading-tight text-slate-900">
                    Under Review
                  </span>
                  <span className="text-[10px] text-blue-700 font-medium">Evaluation pending</span>
                </div>
              </div>
            ) : (
              <Link
                href="/expert/profile"
                title="Complete Verification"
                className="flex items-center justify-center lg:justify-start gap-2.5 p-2 lg:p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-emerald-50/60 hover:border-emerald-200 transition-colors text-slate-700 group"
              >
                <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-amber-500 shadow-2xs shrink-0">
                  <AlertCircle className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-1 hidden lg:block">
                  <span className="text-xs font-semibold block leading-tight text-slate-900 group-hover:text-emerald-700">
                    Complete Verification
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">Submit credentials</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700 shrink-0 hidden lg:block" />
              </Link>
            )}
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1">
            <div className="text-[10px] font-bold text-slate-400 tracking-wider px-2 py-1 uppercase hidden lg:block">
              Workspace
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  title={item.label}
                  className={`flex items-center justify-center lg:justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-colors group min-h-[40px] ${
                    item.isActive
                      ? "bg-emerald-700 text-white font-semibold shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
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
                    <span className="truncate hidden lg:inline">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border shrink-0 hidden lg:inline ${
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
        </div>

        {/* Footer Profile & Logout */}
        <div className="pt-3 border-t border-slate-100 space-y-2.5">
          <div className="p-1.5 lg:p-2 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center lg:justify-start gap-2.5">
            <UserAvatar
              src={user?.profileImage}
              name={user?.fullName || "Expert"}
              size="sm"
            />
            <div className="min-w-0 flex-1 hidden lg:block">
              <span className="font-semibold text-xs text-slate-900 block leading-tight truncate">
                {formatFullName(user?.fullName || "Expert Specialist")}
              </span>
              <span className="text-[10px] text-slate-500 font-medium block truncate">
                {profileData?.designation || "Agricultural Consultant"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-around lg:justify-between text-xs font-medium text-slate-500 px-1 pt-1">
            <Link
              href="/"
              title="Public Portal"
              className="flex items-center gap-1.5 hover:text-emerald-700 transition-colors p-1"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden lg:inline">Public</span>
            </Link>
            <button
              type="button"
              onClick={logout}
              title="Sign Out"
              className="flex items-center gap-1 text-rose-600 hover:text-rose-700 transition-colors cursor-pointer p-1"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden lg:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
