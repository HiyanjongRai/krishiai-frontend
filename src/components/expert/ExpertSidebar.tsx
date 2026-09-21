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
  Settings,
  ChevronLeft,
  ChevronRight,
  Users,
  MessageSquare,
  Tag,
  Wallet,
} from "lucide-react";
import { UserAvatar } from "@/components/ui/avatar";
import { useMessaging } from "@/hooks/useMessaging";

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
  const { totalUnreadCount } = useMessaging();
  const [profileData, setProfileData] = useState<ExpertQuickProfile | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  // Persist collapsed state across page navigation
  useEffect(() => {
    const stored = localStorage.getItem("expert-sidebar-collapsed");
    if (stored === "true") setCollapsed(true);
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      localStorage.setItem("expert-sidebar-collapsed", String(!prev));
      return !prev;
    });
  };

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

  const primaryNavItems = [
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
      isActive: pathname.startsWith("/expert/consultations"),
    },
    {
      label: "Messages",
      href: "/expert/messages",
      icon: MessageSquare,
      badge: totalUnreadCount > 0 ? String(totalUnreadCount) : undefined,
      badgeColor: "bg-[#2E7D32] text-white",
      isActive: pathname.startsWith("/expert/messages"),
    },
    {
      label: "Pricing Packages",
      href: "/expert/pricing",
      icon: Tag,
      isActive: pathname.startsWith("/expert/pricing"),
    },
    {
      label: "Earnings & Wallet",
      href: "/expert/earnings",
      icon: Wallet,
      isActive: pathname.startsWith("/expert/earnings"),
    },
    {
      label: "Crop Expertise",
      href: "/expert/expertise",
      icon: Sprout,
      isActive: pathname.startsWith("/expert/expertise"),
    },
    {
      label: "Documents",
      href: "/expert/documents",
      icon: FileText,
      isActive: pathname.startsWith("/expert/documents"),
    },
    {
      label: "AI Reviews",
      href: "/expert/ai-reviews",
      icon: Bot,
      badge: "AI",
      badgeColor: "bg-[#DBEAFE] text-[#2563EB] border-[#93C5FD]",
      isActive: pathname.startsWith("/expert/ai-reviews"),
    },
    {
      label: "Availability",
      href: "/expert/availability",
      icon: CalendarCheck,
      isActive: pathname.startsWith("/expert/availability"),
    },
  ];

  const secondaryNavItems = [
    {
      label: "Credentials",
      href: "/expert/profile",
      icon: Award,
      isActive: pathname.startsWith("/expert/profile"),
    },
    {
      label: "Public Directory",
      href: "/experts",
      icon: Users,
      isActive: false,
    },
  ];

  const isVerified = profileData?.verifiedExpert;
  const appStatus = profileData?.applicationStatus || "DRAFT";

  return (
    <aside
      className={`hidden md:flex flex-col justify-between bg-white border border-[#E5E7EB] rounded-[24px] shrink-0 sticky top-24 min-h-[calc(100vh-120px)] max-h-[calc(100vh-120px)] overflow-y-auto no-scrollbar shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE] transition-all duration-300 ease-in-out ${
        collapsed ? "w-[60px] p-2" : "w-56 p-3"
      }`}
    >
      <div className="space-y-3 flex-1">
        {/* Brand + Toggle row */}
        <div
          className={`flex items-center border-b border-[#F1F5F2] pb-2 ${
            collapsed ? "justify-center" : "justify-between px-1"
          }`}
        >
          {!collapsed && (
            <div className="flex items-center gap-2 min-w-0">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#2E7D32] text-white">
                <Sparkles className="h-3.5 w-3.5" />
              </span>
              <div className="min-w-0">
                <span className="block text-sm font-bold tracking-tight text-[#1F2937] truncate">KrishiAI</span>
                <span className="block text-[10px] font-medium text-[#9CA3AF]">Specialist</span>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={toggleCollapsed}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={`flex items-center justify-center rounded-xl transition-colors cursor-pointer text-[#9CA3AF] hover:bg-[#F1F5F2] hover:text-[#2E7D32] ${
              collapsed ? "w-9 h-9" : "w-7 h-7 shrink-0"
            }`}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Verification Status Banner */}
        {!collapsed ? (
          <div>
            {isVerified ? (
              <div
                title="Verified Expert - Licensed Agronomist"
                className="flex items-center gap-2.5 p-2 rounded-xl bg-[#E8F5E9] border border-[#A5D6A7]/80 text-[#1B5E20]"
              >
                <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-[#2E7D32] shadow-2xs shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-bold block leading-tight text-[#1F2937] truncate">
                    Verified Expert
                  </span>
                  <span className="text-[10px] text-[#2E7D32] font-medium block truncate">Licensed Agronomist</span>
                </div>
              </div>
            ) : appStatus === "SUBMITTED" || appStatus === "UNDER_REVIEW" ? (
              <div
                title="Under Admin Review"
                className="flex items-center gap-2.5 p-2 rounded-xl bg-[#DBEAFE] border border-[#93C5FD] text-[#2563EB]"
              >
                <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-[#2563EB] shadow-2xs shrink-0">
                  <Clock className="w-3.5 h-3.5 animate-pulse" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-bold block leading-tight text-[#1F2937] truncate">
                    Under Review
                  </span>
                  <span className="text-[10px] text-[#2563EB] font-medium block truncate">Review in progress</span>
                </div>
              </div>
            ) : (
              <Link
                href="/expert/profile"
                title="Complete Verification"
                className="flex items-center gap-2.5 p-2 rounded-xl bg-[#F8FAF8] border border-[#E5E7EB] hover:bg-[#E8F5E9] hover:border-[#A5D6A7] transition-colors text-[#4B5563] group"
              >
                <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-[#F59E0B] shadow-2xs shrink-0">
                  <AlertCircle className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-bold block leading-tight text-[#1F2937] group-hover:text-[#2E7D32] truncate">
                    Verification Pending
                  </span>
                  <span className="text-[10px] text-[#6B7280] font-medium block truncate">Submit credentials</span>
                </div>
                <ExternalLink className="w-3 h-3 text-[#9CA3AF] group-hover:text-[#2E7D32] shrink-0" />
              </Link>
            )}
          </div>
        ) : (
          <div className="flex justify-center">
            {isVerified ? (
              <div
                title="Verified Expert"
                className="w-8 h-8 rounded-xl bg-[#E8F5E9] border border-[#A5D6A7] flex items-center justify-center text-[#2E7D32]"
              >
                <ShieldCheck className="w-4 h-4" />
              </div>
            ) : appStatus === "SUBMITTED" || appStatus === "UNDER_REVIEW" ? (
              <div
                title="Under Review"
                className="w-8 h-8 rounded-xl bg-[#DBEAFE] border border-[#93C5FD] flex items-center justify-center text-[#2563EB]"
              >
                <Clock className="w-4 h-4 animate-pulse" />
              </div>
            ) : (
              <Link
                href="/expert/profile"
                title="Verification Pending"
                className="w-8 h-8 rounded-xl bg-[#FEF3C7] border border-[#FCD34D] flex items-center justify-center text-[#F59E0B]"
              >
                <AlertCircle className="w-4 h-4" />
              </Link>
            )}
          </div>
        )}

        {/* Primary nav */}
        <nav className={`flex flex-col gap-1 ${collapsed ? "items-center" : ""}`}>
          {primaryNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={`group relative flex items-center rounded-xl transition-all duration-150 ${
                  collapsed ? "w-10 h-10 justify-center" : "gap-2.5 px-3 py-2.5"
                } ${
                  item.isActive
                    ? "bg-[#2E7D32] text-white shadow-sm"
                    : "text-[#6B7280] hover:bg-[#F1F5F2] hover:text-[#1F2937]"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!collapsed && (
                  <span className="truncate text-xs font-semibold flex-1">{item.label}</span>
                )}
                {!collapsed && item.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border shrink-0 ${
                      item.isActive
                        ? "bg-white/20 text-white border-white/30"
                        : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {/* Tooltip — only when collapsed */}
                {collapsed && (
                  <span className="pointer-events-none absolute left-full ml-3 z-50 whitespace-nowrap rounded-lg bg-[#1F2937] px-2.5 py-1.5 text-[11px] font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-lg">
                    {item.label}
                    <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 bg-[#1F2937]" />
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Separator */}
        <div className={`h-px bg-[#F1F5F2] ${collapsed ? "w-6 mx-auto" : "mx-2"}`} />

        {/* Secondary nav */}
        <nav className={`flex flex-col gap-1 ${collapsed ? "items-center" : ""}`}>
          {!collapsed && (
            <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF]">Account &amp; More</p>
          )}
          {secondaryNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={`group relative flex items-center rounded-xl transition-all duration-150 ${
                  collapsed ? "w-10 h-10 justify-center" : "gap-2.5 px-3 py-2.5"
                } ${
                  item.isActive
                    ? "bg-[#2E7D32] text-white shadow-sm"
                    : "text-[#6B7280] hover:bg-[#F1F5F2] hover:text-[#1F2937]"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!collapsed && (
                  <span className="truncate text-xs font-semibold">{item.label}</span>
                )}
                {collapsed && (
                  <span className="pointer-events-none absolute left-full ml-3 z-50 whitespace-nowrap rounded-lg bg-[#1F2937] px-2.5 py-1.5 text-[11px] font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-lg">
                    {item.label}
                    <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 bg-[#1F2937]" />
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom: Profile + Settings + Logout */}
      <div className={`flex flex-col gap-1 pt-3 border-t border-[#E5E7EB] ${collapsed ? "items-center" : ""}`}>
        {/* Profile row */}
        <Link
          href="/expert/profile"
          title={collapsed ? user?.fullName || "Profile" : undefined}
          className={`group relative flex items-center rounded-xl hover:bg-[#F1F5F2] transition-colors ${
            collapsed ? "w-10 h-10 justify-center" : "gap-2.5 px-2.5 py-2"
          }`}
        >
          <UserAvatar
            src={user?.profileImage}
            name={user?.fullName || "Expert"}
            size="xs"
            className="ring-2 ring-transparent group-hover:ring-[#2E7D32] transition-all shrink-0"
          />
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-[#1F2937] truncate">{user?.fullName || "Specialist"}</p>
              <p className="text-[10px] text-[#9CA3AF] truncate">
                {profileData?.designation || "Expert"}
              </p>
            </div>
          )}
          {collapsed && (
            <span className="pointer-events-none absolute left-full ml-3 z-50 whitespace-nowrap rounded-lg bg-[#1F2937] px-2.5 py-1.5 text-[11px] font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-lg">
              {user?.fullName || "Profile"}
              <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 bg-[#1F2937]" />
            </span>
          )}
        </Link>

        {/* Settings */}
        <Link
          href="/expert/profile"
          title={collapsed ? "Settings" : undefined}
          className={`group relative flex items-center rounded-xl transition-all duration-150 ${
            collapsed ? "w-10 h-10 justify-center" : "gap-2.5 px-3 py-2.5"
          } ${
            pathname === "/expert/profile"
              ? "bg-[#2E7D32] text-white shadow-sm"
              : "text-[#6B7280] hover:bg-[#F1F5F2] hover:text-[#1F2937]"
          }`}
        >
          <Settings className="w-4 h-4 shrink-0" />
          {!collapsed && <span className="text-xs font-semibold">Settings</span>}
          {collapsed && (
            <span className="pointer-events-none absolute left-full ml-3 z-50 whitespace-nowrap rounded-lg bg-[#1F2937] px-2.5 py-1.5 text-[11px] font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-lg">
              Settings
              <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 bg-[#1F2937]" />
            </span>
          )}
        </Link>

        {/* Sign out */}
        <button
          type="button"
          onClick={logout}
          title={collapsed ? "Sign Out" : undefined}
          className={`group relative flex items-center rounded-xl text-[#6B7280] hover:bg-[#FEE2E2] hover:text-[#DC2626] transition-all duration-150 cursor-pointer ${
            collapsed ? "w-10 h-10 justify-center" : "gap-2.5 px-3 py-2.5 w-full"
          }`}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span className="text-xs font-semibold">Sign Out</span>}
          {collapsed && (
            <span className="pointer-events-none absolute left-full ml-3 z-50 whitespace-nowrap rounded-lg bg-[#1F2937] px-2.5 py-1.5 text-[11px] font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-lg">
              Sign Out
              <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 bg-[#1F2937]" />
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
