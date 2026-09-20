"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sprout,
  Scan,
  Bot,
  MapPin,
  CloudSun,
  Users,
  History,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { UserAvatar } from "@/components/ui/avatar";

export function FarmerSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  // Persist collapsed state across page navigation
  useEffect(() => {
    const stored = localStorage.getItem("farmer-sidebar-collapsed");
    if (stored === "true") setCollapsed(true);
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      localStorage.setItem("farmer-sidebar-collapsed", String(!prev));
      return !prev;
    });
  };

  const primaryNavItems = [
    {
      label: "Dashboard",
      href: "/farmer/dashboard",
      icon: LayoutDashboard,
      isActive: pathname === "/farmer/dashboard",
    },
    {
      label: "My Farms",
      href: "/farmer/farms",
      icon: MapPin,
      isActive: pathname.startsWith("/farmer/farms"),
    },
    {
      label: "My Crops",
      href: "/farmer/crops",
      icon: Sprout,
      isActive: pathname.startsWith("/farmer/crops"),
    },
    {
      label: "AI Diagnostics",
      href: "/farmer/analysis",
      icon: Scan,
      isActive: pathname.startsWith("/farmer/analysis"),
    },
    {
      label: "AI Advisor",
      href: "/farmer/ai-advisor",
      icon: Bot,
      isActive: pathname.startsWith("/farmer/ai-advisor"),
    },
  ];

  const secondaryNavItems = [
    {
      label: "Weather",
      href: "/farmer/weather",
      icon: CloudSun,
      isActive: pathname.startsWith("/farmer/weather"),
    },
    {
      label: "Consultations",
      href: "/farmer/consultations",
      icon: Users,
      isActive: pathname.startsWith("/farmer/consultations"),
    },
    {
      label: "History",
      href: "/farmer/dashboard#history",
      icon: History,
      isActive: false,
    },
  ];

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
                <Sprout className="h-3.5 w-3.5" />
              </span>
              <div className="min-w-0">
                <span className="block text-sm font-bold tracking-tight text-[#1F2937] truncate">KrishiAI</span>
                <span className="block text-[10px] font-medium text-[#9CA3AF]">Farmer</span>
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
                  <span className="truncate text-xs font-semibold">{item.label}</span>
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
            <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF]">More</p>
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
          href="/farmer/profile"
          title={collapsed ? user?.fullName || "Profile" : undefined}
          className={`group relative flex items-center rounded-xl hover:bg-[#F1F5F2] transition-colors ${
            collapsed ? "w-10 h-10 justify-center" : "gap-2.5 px-2.5 py-2"
          }`}
        >
          <UserAvatar
            src={user?.profileImage}
            name={user?.fullName}
            size="xs"
            className="ring-2 ring-transparent group-hover:ring-[#2E7D32] transition-all shrink-0"
          />
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-[#1F2937] truncate">{user?.fullName || "My Account"}</p>
              <p className="text-[10px] text-[#9CA3AF]">Farmer</p>
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
          href="/farmer/profile"
          title={collapsed ? "Settings" : undefined}
          className={`group relative flex items-center rounded-xl transition-all duration-150 ${
            collapsed ? "w-10 h-10 justify-center" : "gap-2.5 px-3 py-2.5"
          } ${
            pathname === "/farmer/profile"
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
