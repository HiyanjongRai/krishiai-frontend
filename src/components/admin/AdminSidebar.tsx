"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  ShieldCheck,
  Bot,
  Activity,
  Sprout,
  Bug,
  Lightbulb,
  BookOpen,
  FileText,
  Bookmark,
  MessageSquare,
  Bell,
  BarChart3,
  History,
  HeartPulse,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeColor?: string;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const sections: NavSection[] = [
    {
      items: [
        {
          label: "Dashboard",
          href: "/admin/dashboard",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: "USERS",
      items: [
        {
          label: "Farmers",
          href: "/admin/users",
          icon: Users,
        },
        {
          label: "Experts",
          href: "/admin/experts",
          icon: UserCheck,
        },
        {
          label: "Expert Verification",
          href: "/admin/verification",
          icon: ShieldCheck,
          badge: "18",
          badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
        },
      ],
    },
    {
      title: "AI & AGRICULTURE",
      items: [
        {
          label: "AI Analyses",
          href: "/admin/analytics",
          icon: Bot,
        },
        {
          label: "AI Performance",
          href: "/admin/analytics",
          icon: Activity,
        },
        {
          label: "Crops",
          href: "/admin/crops",
          icon: Sprout,
        },
        {
          label: "Diseases & Conditions",
          href: "/admin/diseases",
          icon: Bug,
        },
        {
          label: "Recommendations",
          href: "/admin/analytics",
          icon: Lightbulb,
        },
      ],
    },
    {
      title: "KNOWLEDGE",
      items: [
        {
          label: "Knowledge Base",
          href: "/admin/knowledge",
          icon: BookOpen,
        },
        {
          label: "Articles",
          href: "/admin/knowledge",
          icon: FileText,
        },
        {
          label: "Agricultural Guidelines",
          href: "/admin/knowledge",
          icon: Bookmark,
        },
      ],
    },
    {
      title: "PLATFORM",
      items: [
        {
          label: "Consultations",
          href: "/admin/consultations",
          icon: MessageSquare,
        },
        {
          label: "Notifications",
          href: "/admin/dashboard",
          icon: Bell,
        },
        {
          label: "Reports",
          href: "/admin/analytics",
          icon: BarChart3,
        },
        {
          label: "Activity Logs",
          href: "/admin/dashboard",
          icon: History,
        },
      ],
    },
    {
      title: "SYSTEM",
      items: [
        {
          label: "System Health",
          href: "/admin/dashboard",
          icon: HeartPulse,
        },
        {
          label: "Settings",
          href: "/admin/settings",
          icon: Settings,
        },
      ],
    },
  ];

  return (
    <aside className="w-64 shrink-0 hidden lg:block select-none">
      <div className="bg-white rounded-2xl border border-[#E2E8E3] shadow-xs p-3 space-y-4 sticky top-24">
        {/* Brand Header */}
        <div className="flex items-center gap-2.5 px-3 py-2 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#166534] to-[#15803d] flex items-center justify-center text-white shadow-xs">
            <Sprout className="w-4 h-4" />
          </div>
          <div>
            <span className="font-extrabold text-sm tracking-tight text-[#17201A] block leading-none">
              KrishiAI
            </span>
            <span className="text-[10px] font-semibold text-emerald-700 block mt-0.5">
              Admin Dashboard
            </span>
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-1">
          {sections.map((sec, idx) => (
            <div key={idx} className="space-y-1">
              {sec.title && (
                <div className="text-[10px] font-bold text-slate-400 tracking-wider px-3 py-1 uppercase">
                  {sec.title}
                </div>
              )}
              {sec.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                      isActive
                        ? "bg-[#166534] text-white shadow-xs"
                        : "text-[#4A554D] hover:text-[#17201A] hover:bg-[#F7F9F4]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive
                            ? "text-white"
                            : "text-slate-400 group-hover:text-emerald-700"
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${
                          isActive
                            ? "bg-white/20 text-white border-white/30"
                            : item.badgeColor || "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Admin User Card & Actions */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <div className="p-2.5 rounded-xl bg-[#166534] text-white flex items-center gap-2.5 shadow-2xs">
            <div className="w-8 h-8 rounded-full bg-emerald-800 border border-emerald-400/40 flex items-center justify-center font-bold text-xs text-white shrink-0">
              AD
            </div>
            <div className="min-w-0 flex-1">
              <span className="font-bold text-xs block leading-tight truncate">
                {user?.fullName || "Administrator"}
              </span>
              <span className="text-[10px] text-emerald-200 block truncate">
                Super Admin
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 px-2 pt-1">
            <Link
              href="/admin/settings"
              className="flex items-center gap-1 hover:text-emerald-700 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Help Center</span>
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
