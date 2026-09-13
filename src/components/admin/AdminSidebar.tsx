"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  Clock3,
  FileSearch,
  HelpCircle,
  LayoutDashboard,
  Leaf,
  LogOut,
  ShieldCheck,
  Sprout,
  UserCheck,
  Users,
  Settings,
  XCircle,
} from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { useToast } from "@/providers/toast-provider";
import { UserAvatar } from "@/components/ui/avatar";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  isVerification?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Users & Accreditation",
    items: [
      { label: "Farmers Directory", href: "/admin/users", icon: Users },
      { label: "Verified Experts", href: "/admin/experts?status=active", icon: UserCheck },
      { label: "Expert Verification", href: "/admin/verification", icon: ShieldCheck, isVerification: true },
    ],
  },
  {
    title: "Agricultural Catalog",
    items: [
      { label: "Crops Management", href: "/admin/crops", icon: Leaf },
      { label: "AI & Telemetry", href: "/admin/analytics", icon: Sprout },
    ],
  },
  {
    title: "Settings",
    items: [
      { label: "Platform Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [collapsed, setCollapsed] = useState(false);
  const [verificationOpen, setVerificationOpen] = useState(
    pathname.startsWith("/admin/verification") || searchParams.has("status")
  );

  // Automatically default to collapsed rail on tablet screens (768px - 1023px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && window.innerWidth < 1024) {
        setCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const currentStatus = searchParams.get("status");

  const handleLogout = () => {
    logout();
    toast.success({ title: "Signed out successfully." });
  };

  return (
    <aside
      className={`hidden shrink-0 select-none bg-white border-r border-slate-200 transition-[width] duration-200 md:flex flex-col ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="sticky top-0 flex h-screen flex-col justify-between p-3.5">
        {/* ── Brand Logo Header ─────────────────────────────────────────────────── */}
        <div className="flex flex-col">
          <div
            className={`flex h-12 items-center border-b border-slate-100 pb-3 ${
              collapsed ? "justify-center" : "gap-2.5 px-2"
            }`}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-700 text-white shadow-xs">
              <Leaf className="h-4 w-4" />
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold tracking-tight text-slate-900">KrishiAI</span>
                  <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800 border border-emerald-200">
                    Admin
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* ── Navigation Links ─────────────────────────────────────────────────── */}
          <nav className="mt-4 flex-1 space-y-5 overflow-y-auto pr-1">
            {NAV_SECTIONS.map((section) => (
              <div key={section.title}>
                {!collapsed && (
                  <p className="mb-1.5 px-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {section.title}
                  </p>
                )}
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isVerification = item.isVerification;
                    const isVerifiedExperts = item.href.includes("/admin/experts");

                    const isItemActive = isVerifiedExperts
                      ? pathname.startsWith("/admin/experts") && (!currentStatus || currentStatus === "active")
                      : isVerification
                      ? pathname.startsWith("/admin/verification")
                      : pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(`${item.href}/`));

                    return (
                      <div key={item.label}>
                        <div
                          className={`flex items-center rounded-lg transition-colors ${
                            isItemActive
                              ? "bg-emerald-700 text-white font-semibold"
                              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                          }`}
                        >
                          <Link
                            href={item.href}
                            title={collapsed ? item.label : undefined}
                            className={`flex min-w-0 flex-1 items-center ${
                              collapsed ? "justify-center p-2.5" : "gap-2.5 px-2.5 py-2 text-xs font-medium"
                            }`}
                          >
                            <Icon
                              className={`h-4 w-4 shrink-0 transition-colors ${
                                isItemActive ? "text-white" : "text-slate-400"
                              }`}
                            />
                            {!collapsed && <span className="truncate flex-1">{item.label}</span>}
                          </Link>

                          {/* Expand/Collapse sub-menu for Verification */}
                          {isVerification && !collapsed && (
                            <button
                              type="button"
                              onClick={() => setVerificationOpen((v) => !v)}
                              className={`mr-1.5 p-1 rounded transition-colors cursor-pointer ${
                                isItemActive ? "text-white/80 hover:bg-white/20" : "text-slate-400 hover:bg-slate-200"
                              }`}
                              aria-label={verificationOpen ? "Collapse sub-navigation" : "Expand sub-navigation"}
                            >
                              <ChevronDown
                                className={`h-3.5 w-3.5 transition-transform duration-150 ${
                                  verificationOpen ? "rotate-180" : ""
                                }`}
                              />
                            </button>
                          )}
                        </div>

                        {/* Sub-navigation items for verification */}
                        {isVerification && verificationOpen && !collapsed && (
                          <div className="ml-4 my-1 space-y-0.5 border-l border-slate-200 pl-2">
                            {[
                              { label: "Pending Review", status: "pending", icon: Clock3 },
                              { label: "Under Review", status: "review", icon: FileSearch },
                              { label: "Rejected", status: "rejected", icon: XCircle },
                            ].map((sub) => {
                              const SubIcon = sub.icon;
                              const isSubActive =
                                pathname === `/admin/verification/${sub.status}` ||
                                (pathname.startsWith("/admin/verification") &&
                                  (currentStatus === sub.status ||
                                    (sub.status === "pending" && !currentStatus && pathname === "/admin/verification")));

                              return (
                                <Link
                                  key={sub.status}
                                  href={`/admin/verification/${sub.status}`}
                                  className={`flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                                    isSubActive
                                      ? "bg-emerald-50 text-emerald-800 font-semibold"
                                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                                  }`}
                                >
                                  <SubIcon
                                    className={`h-3.5 w-3.5 shrink-0 ${
                                      isSubActive ? "text-emerald-700" : "text-slate-400"
                                    }`}
                                  />
                                  <span>{sub.label}</span>
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* ── User Footer & Collapse ────────────────────────────────────────────── */}
        <div className="border-t border-slate-200 pt-3">
          {!collapsed ? (
            <div className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50 p-2.5 mb-2">
              <UserAvatar
                src={user?.profileImage}
                name={user?.fullName || "Administrator"}
                size="xs"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-slate-900">
                  {user?.fullName || "Administrator"}
                </p>
                <p className="truncate text-[11px] text-slate-500">
                  {user?.email || "admin@krishiai.org"}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center mb-2">
              <UserAvatar
                src={user?.profileImage}
                name={user?.fullName || "Administrator"}
                size="xs"
              />
            </div>
          )}

          <div className="flex items-center justify-between gap-1">
            <button
              type="button"
              onClick={() => setCollapsed((c) => !c)}
              className="flex items-center gap-1.5 rounded-md p-1.5 text-xs text-slate-500 hover:bg-slate-100 hover:text-slate-900 cursor-pointer transition-colors"
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
              {!collapsed && <span className="text-xs">Collapse</span>}
            </button>

            {!collapsed && (
              <div className="flex items-center gap-2">
                <Link
                  href="/"
                  title="Public Website"
                  className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                >
                  <HelpCircle className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Sign Out"
                  className="flex items-center gap-1 rounded-md p-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
