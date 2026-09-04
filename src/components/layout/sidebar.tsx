"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";
import {
  LayoutDashboard,
  Sprout,
  Users,
  User,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/providers/auth-provider";

interface SidebarProps {
  role?: "farmer" | "expert" | "admin";
}

export function Sidebar({ role = "farmer" }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const links = [
    { label: "Dashboard", href: `/${role}/dashboard`, icon: LayoutDashboard },
    { label: "Crops", href: `/${role}/crops`, icon: Sprout },
    { label: "Consultations", href: `/${role}/consultations`, icon: Users },
    { label: "Profile", href: `/${role}/profile`, icon: User },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 bg-white min-h-screen p-5 flex flex-col justify-between">
      <div className="space-y-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            🌱
          </div>
          <span className="font-extrabold text-slate-900 tracking-tight text-lg">
            Krishi<span className="text-emerald-600">AI</span>
          </span>
        </Link>

        <nav className="space-y-1">
          {links.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors",
                  active
                    ? "bg-emerald-50 text-emerald-800"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
