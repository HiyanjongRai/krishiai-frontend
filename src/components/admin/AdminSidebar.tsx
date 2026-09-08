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
  ChevronDown,
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
    <aside className="hidden w-[208px] shrink-0 select-none lg:block">
      <div className="sticky top-24 space-y-5">
        {/* Brand Header */}
        <div className="flex items-center gap-2.5 px-2 pb-4 border-b border-[#E7ECE7]">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EAF6E7] text-[#35A853]">
            <Sprout className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-[15px] font-extrabold tracking-tight text-[#257A3E] leading-none">
              KrishiAI
            </span>
            <span className="mt-1 block text-[10px] font-medium text-slate-400">
              Admin Panel
            </span>
          </div>
          <button type="button" aria-label="Collapse admin navigation" className="ml-auto text-slate-400 hover:text-slate-700">
            <span className="block h-3.5 w-3.5 border-r-2 border-slate-400" />
          </button>
        </div>

        {/* Navigation Sections */}
        <nav className="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-1">
          {sections.map((sec, idx) => (
            <div key={idx} className="space-y-1">
              {sec.title && (
                <div className="px-2 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
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
                    className={`flex items-center justify-between rounded-lg px-2.5 py-2 text-[11px] font-semibold transition-all group ${
                      isActive
                        ? "bg-[#EAF6E7] text-[#168443]"
                        : "text-[#53605A] hover:bg-[#F5F8F3] hover:text-[#17201A]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`h-3.5 w-3.5 shrink-0 transition-colors ${
                          isActive
                            ? "text-[#168443]"
                            : "text-slate-400 group-hover:text-emerald-700"
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${
                            isActive
                              ? "bg-white text-[#168443] border-white"
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
        <div className="space-y-2 border-t border-[#E7ECE7] pt-4">
          <div className="flex items-center gap-2.5 rounded-xl border border-[#E2E8E3] bg-white p-2.5 shadow-xs">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EAF6E7] text-xs font-bold text-[#168443]">
              AD
            </div>
            <div className="min-w-0 flex-1">
              <span className="block truncate text-xs font-bold leading-tight text-slate-800">
                {user?.fullName || "Administrator"}
              </span>
              <span className="block truncate text-[10px] text-slate-400">
                Super Admin
              </span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
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
