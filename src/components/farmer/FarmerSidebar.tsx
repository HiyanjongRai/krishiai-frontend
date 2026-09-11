"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sprout,
  Scan,
  Bot,
  CloudSun,
  Users,
  History,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/providers/auth-provider";

export function FarmerSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const primaryNavItems = [
    {
      label: "Dashboard",
      href: "/farmer/dashboard",
      icon: LayoutDashboard,
      isActive: pathname === "/farmer/dashboard",
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
      href: "/farmer/dashboard#weather",
      icon: CloudSun,
      isActive: false,
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
      className="hidden lg:flex flex-col justify-between bg-white border border-[rgba(234,234,236,0.85)] rounded-[24px] p-2.5 w-14 shrink-0 sticky top-20 min-h-[calc(100vh-100px)] max-h-[calc(100vh-100px)] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04),0_2px_6px_-1px_rgba(0,0,0,0.02)]"
    >
      {/* Top groups */}
      <div className="space-y-4">
        {/* Primary nav icons */}
        <nav className="flex flex-col items-center gap-1.5">
          {primaryNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                title={item.label}
                className={`group relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150 ${
                  item.isActive
                    ? "bg-[#0F9F68] text-white shadow-sm"
                    : "text-gray-400 hover:bg-[#F4F4F6] hover:text-[#171717]"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {/* Tooltip */}
                <span className="pointer-events-none absolute left-full ml-3 z-50 whitespace-nowrap rounded-lg bg-[#171717] px-2.5 py-1.5 text-[11px] font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-lg">
                  {item.label}
                  <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 bg-[#171717]" />
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Separator pill */}
        <div className="w-6 h-[1px] bg-gray-100 mx-auto" />

        {/* Secondary nav icons */}
        <nav className="flex flex-col items-center gap-1.5">
          {secondaryNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                title={item.label}
                className={`group relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150 ${
                  item.isActive
                    ? "bg-[#0F9F68] text-white shadow-sm"
                    : "text-gray-400 hover:bg-[#F4F4F6] hover:text-[#171717]"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {/* Tooltip */}
                <span className="pointer-events-none absolute left-full ml-3 z-50 whitespace-nowrap rounded-lg bg-[#171717] px-2.5 py-1.5 text-[11px] font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-lg">
                  {item.label}
                  <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 bg-[#171717]" />
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom: Settings + Logout */}
      <div className="flex flex-col items-center gap-1.5 pt-3 border-t border-gray-100">
        <Link
          href="/farmer/profile"
          title="Settings"
          className={`group relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150 ${
            pathname === "/farmer/profile"
              ? "bg-[#0F9F68] text-white shadow-sm"
              : "text-gray-400 hover:bg-[#F4F4F6] hover:text-[#171717]"
          }`}
        >
          <Settings className="w-4 h-4 shrink-0" />
          <span className="pointer-events-none absolute left-full ml-3 z-50 whitespace-nowrap rounded-lg bg-[#171717] px-2.5 py-1.5 text-[11px] font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-lg">
            Settings
            <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 bg-[#171717]" />
          </span>
        </Link>

        <button
          type="button"
          onClick={logout}
          title="Sign Out"
          className="group relative w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:bg-rose-50 hover:text-rose-600 transition-all duration-150 cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span className="pointer-events-none absolute left-full ml-3 z-50 whitespace-nowrap rounded-lg bg-[#171717] px-2.5 py-1.5 text-[11px] font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-lg">
            Sign Out
            <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 bg-[#171717]" />
          </span>
        </button>
      </div>
    </aside>
  );
}
