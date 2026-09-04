"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Home,
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

  const navItems = [
    {
      label: "Dashboard",
      href: "/farmer/dashboard",
      icon: LayoutDashboard,
      isActive: pathname === "/farmer/dashboard",
    },
    {
      label: "Homepage",
      href: "/",
      icon: Home,
      isActive: false,
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
      label: "Advisories",
      href: "/farmer/dashboard#history",
      icon: History,
      isActive: false,
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col justify-between bg-white border border-slate-100 rounded-3xl p-3.5 shadow-2xs min-h-[720px] w-52 shrink-0 sticky top-24">
      {/* Top Navigation Items with Clear Text Labels */}
      <div className="flex flex-col gap-1.5 w-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                item.isActive
                  ? "bg-[#166534] text-white font-bold shadow-xs"
                  : "text-slate-600 hover:text-[#166534] hover:bg-emerald-50/60"
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  item.isActive ? "text-white" : "text-slate-500"
                }`}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Bottom Controls: Settings & Logout */}
      <div className="flex flex-col gap-1.5 w-full pt-3 border-t border-slate-100">
        <Link
          href="/farmer/profile"
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-colors ${
            pathname === "/farmer/profile"
              ? "bg-[#166534] text-white font-bold shadow-xs"
              : "text-slate-600 hover:text-[#166534] hover:bg-slate-50"
          }`}
        >
          <Settings className="w-4 h-4 shrink-0 text-slate-400" />
          <span>Settings</span>
        </Link>

        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
