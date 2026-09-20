"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  ShieldCheck,
  Sprout,
  Leaf,
  FileCheck,
  MessageSquare,
  BookOpen,
  Settings,
  LogOut,
  X,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ADMIN_NAV_SECTIONS } from "@/components/admin/admin-navigation";
import { useAuth } from "@/providers/auth-provider";
import { useToast } from "@/providers/toast-provider";
import { UserAvatar } from "@/components/ui/avatar";

function isActivePath(pathname: string, href: string) {
  const [hrefPath] = href.split("?");
  if (hrefPath === "/admin/dashboard") return pathname === hrefPath;
  return pathname === hrefPath || pathname.startsWith(`${hrefPath}/`);
}

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Persist collapsed state across page navigation
  useEffect(() => {
    const stored = localStorage.getItem("admin-sidebar-collapsed");
    if (stored === "true") setCollapsed(true);
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      localStorage.setItem("admin-sidebar-collapsed", String(!prev));
      return !prev;
    });
  };

  useEffect(() => {
    const openMobileDrawer = () => setMobileOpen(true);
    window.addEventListener("open-mobile-drawer", openMobileDrawer);
    return () => {
      window.removeEventListener("open-mobile-drawer", openMobileDrawer);
    };
  }, []);

  const handleLogout = () => {
    logout();
    toast.success({ title: "Signed out successfully." });
  };

  const primaryNavItems = [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      isActive: pathname === "/admin/dashboard",
    },
    {
      label: "Farmers",
      href: "/admin/users",
      icon: Users,
      isActive: pathname.startsWith("/admin/users"),
    },
    {
      label: "Experts",
      href: "/admin/experts?status=active",
      icon: UserCheck,
      isActive: pathname.startsWith("/admin/experts"),
    },
    {
      label: "Verification",
      href: "/admin/verification",
      icon: ShieldCheck,
      isActive: pathname.startsWith("/admin/verification"),
    },
    {
      label: "Analytics",
      href: "/admin/analytics",
      icon: Sprout,
      isActive: pathname.startsWith("/admin/analytics"),
    },
    {
      label: "Crops",
      href: "/admin/crops",
      icon: Leaf,
      isActive: pathname.startsWith("/admin/crops"),
    },
    {
      label: "Diseases",
      href: "/admin/diseases",
      icon: FileCheck,
      isActive: pathname.startsWith("/admin/diseases"),
    },
  ];

  const secondaryNavItems = [
    {
      label: "Consultations",
      href: "/admin/consultations",
      icon: MessageSquare,
      isActive: pathname.startsWith("/admin/consultations"),
    },
    {
      label: "Knowledge",
      href: "/admin/knowledge",
      icon: BookOpen,
      isActive: pathname.startsWith("/admin/knowledge"),
    },
  ];

  return (
    <>
      {/* Desktop Collapsible Sidebar */}
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
                  <ShieldCheck className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0">
                  <span className="block text-sm font-bold tracking-tight text-[#1F2937] truncate">KrishiAI</span>
                  <span className="block text-[10px] font-medium text-[#9CA3AF]">Admin</span>
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
              <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF]">Tools</p>
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
          {/* Profile */}
          <Link
            href="/admin/settings"
            title={collapsed ? user?.fullName || "Admin" : undefined}
            className={`group relative flex items-center rounded-xl hover:bg-[#F1F5F2] transition-colors ${
              collapsed ? "w-10 h-10 justify-center" : "gap-2.5 px-2.5 py-2"
            }`}
          >
            <UserAvatar
              src={user?.profileImage}
              name={user?.fullName || "Admin"}
              size="xs"
              className="ring-2 ring-transparent group-hover:ring-[#2E7D32] transition-all shrink-0"
            />
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-[#1F2937] truncate">{user?.fullName || "Administrator"}</p>
                <p className="text-[10px] text-[#9CA3AF]">Admin</p>
              </div>
            )}
            {collapsed && (
              <span className="pointer-events-none absolute left-full ml-3 z-50 whitespace-nowrap rounded-lg bg-[#1F2937] px-2.5 py-1.5 text-[11px] font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-lg">
                {user?.fullName || "Administrator"}
                <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 bg-[#1F2937]" />
              </span>
            )}
          </Link>

          {/* Settings */}
          <Link
            href="/admin/settings"
            title={collapsed ? "Settings" : undefined}
            className={`group relative flex items-center rounded-xl transition-all duration-150 ${
              collapsed ? "w-10 h-10 justify-center" : "gap-2.5 px-3 py-2.5"
            } ${
              pathname === "/admin/settings"
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
            onClick={handleLogout}
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

      {/* Mobile Drawer (opened via AdminBottomNav Menu button) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            aria-label="Close admin navigation"
            className="absolute inset-0 bg-[#1F2937]/40 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative flex h-full w-[min(320px,86vw)] flex-col border-r border-[#E5E7EB] bg-white shadow-2xl p-4">
            <div className="flex h-12 items-center justify-between gap-3 border-b border-[#EEF0EE] pb-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#2E7D32] text-white shadow-sm">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <div>
                  <span className="block truncate text-base font-bold tracking-tight text-[#1F2937]">KrishiAI</span>
                  <span className="block text-[11px] font-medium text-[#6B7280]">Admin console</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="rounded-lg p-2 text-[#6B7280] hover:bg-[#F1F5F2] hover:text-[#2E7D32]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1 space-y-4">
              {ADMIN_NAV_SECTIONS.map((section) => (
                <div key={section.title}>
                  <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#9CA3AF]">
                    {section.title}
                  </p>
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const active = isActivePath(pathname, item.href);
                      return (
                        <Link
                          key={`${section.title}-${item.label}`}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={`group flex min-h-10 items-center gap-3 rounded-xl px-3 text-xs transition-colors ${
                            active
                              ? "bg-[#E8F5E9] text-[#2E7D32] font-semibold border border-[#C8E6C9]"
                              : "text-[#4B5563] hover:bg-[#F1F5F2] hover:text-[#2E7D32]"
                          }`}
                        >
                          <Icon className={`h-4 w-4 shrink-0 ${active ? "text-[#2E7D32]" : "text-[#6B7280] group-hover:text-[#2E7D32]"}`} />
                          <span className="truncate">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            <div className="mt-4 border-t border-[#E5E7EB] pt-4 space-y-2">
              <div className="flex items-center gap-2.5 rounded-xl border border-[#E5E7EB] bg-[#F8FAF8] p-2.5">
                <UserAvatar src={user?.profileImage} name={user?.fullName || "Administrator"} size="xs" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-[#1F2937]">{user?.fullName || "Administrator"}</p>
                  <p className="truncate text-[10px] text-[#6B7280]">{user?.email || "admin@krishiai.org"}</p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1">
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#E5E7EB] bg-white py-2 text-xs font-semibold text-[#4B5563] hover:bg-[#F1F5F2]"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Public Site</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] px-3 py-2 text-xs font-semibold text-[#DC2626] hover:bg-[#FEE2E2]"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
