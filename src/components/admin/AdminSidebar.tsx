"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  Clock3,
  FileSearch,
  HelpCircle,
  LogOut,
  ShieldCheck,
  Sparkles,
  XCircle,
} from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { useToast } from "@/providers/toast-provider";
import { ADMIN_NAV_SECTIONS } from "@/components/admin/admin-navigation";

export function AdminSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [collapsed, setCollapsed] = useState(false);
  const [verificationOpen, setVerificationOpen] = useState(
    pathname.startsWith("/admin/verification") || searchParams.has("status")
  );

  const initials = (user?.fullName || "Administrator")
    .split(" ")
    .map((name) => name[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleLogout = () => {
    logout();
    toast.success({ title: "Signed out successfully." });
  };

  return (
    <aside className={`hidden shrink-0 select-none transition-[width] duration-200 lg:block ${collapsed ? "w-[76px]" : "w-[264px]"}`}>
      <div className="sticky top-4 mx-2 flex h-[calc(100vh-2rem)] flex-col rounded-[28px] border border-[rgba(234,234,236,0.85)] bg-white p-3.5 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04),0_2px_6px_-1px_rgba(0,0,0,0.02)]">
        
        {/* ── Brand Logo ──────────────────────────────────────────────────────── */}
        <div className={`flex shrink-0 items-center border-b border-gray-100 pb-3.5 ${collapsed ? "justify-center" : "gap-3 px-1"}`}>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#0F9F68] text-white shadow-xs">
            <Sparkles className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-base font-black leading-none tracking-tight text-[#171717]">
                Krishi<span className="text-[#0F9F68]">AI</span>
              </p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[#0F9F68]">Admin Console</p>
            </div>
          )}
        </div>

        {/* ── Admin Badge ─────────────────────────────────────────────────────── */}
        {!collapsed && (
          <div className="my-3 flex items-center gap-2 rounded-2xl border border-[#BCE9D5] bg-[#DDF4EA]/60 px-3 py-2 text-[#0F9F68]">
            <ShieldCheck className="h-4 w-4 shrink-0 text-[#0F9F68]" />
            <div className="min-w-0">
              <span className="block text-[11px] font-bold leading-tight">Master Administrator</span>
              <span className="block text-[9px] font-medium opacity-80">Full Operational Controls</span>
            </div>
          </div>
        )}

        {/* ── Navigation Links ─────────────────────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto py-2 space-y-4">
          {ADMIN_NAV_SECTIONS.map((section) => (
            <div key={section.title}>
              {!collapsed && (
                <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  {section.title}
                </p>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isVerificationItem = item.label === "Expert Verification";
                  const isVerifiedExpertsItem = item.label === "Verified Experts";
                  const currentStatus = searchParams.get("status");

                  const verifiedExpertsActive =
                    pathname.startsWith("/admin/experts") &&
                    (!currentStatus || currentStatus === "active");

                  const verificationActive =
                    pathname.startsWith("/admin/verification");

                  const active = isVerifiedExpertsItem
                    ? verifiedExpertsActive
                    : isVerificationItem
                    ? verificationActive
                    : pathname === item.href ||
                      (item.href !== "/admin/dashboard" &&
                        pathname.startsWith(`${item.href}/`));

                  return (
                    <React.Fragment key={`${section.title}-${item.label}`}>
                      <div
                        className={`flex items-center rounded-2xl transition-all duration-150 ${
                          active
                            ? "bg-[#0F9F68] text-white shadow-xs font-bold"
                            : "text-gray-600 hover:bg-[#F4F4F6] hover:text-[#171717]"
                        }`}
                      >
                        <Link
                          href={item.href}
                          title={collapsed ? item.label : undefined}
                          className={`group flex min-w-0 flex-1 items-center rounded-2xl ${
                            collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2 text-xs font-semibold"
                          }`}
                        >
                          <Icon
                            className={`h-4 w-4 shrink-0 transition-colors ${
                              active ? "text-white" : "text-gray-400 group-hover:text-[#0F9F68]"
                            }`}
                          />
                          {!collapsed && (
                            <span className="truncate flex-1">{item.label}</span>
                          )}
                        </Link>

                        {/* Interactive toggle for Verification sub-options */}
                        {isVerificationItem && !collapsed && (
                          <button
                            type="button"
                            onClick={() => setVerificationOpen((prev) => !prev)}
                            aria-label={verificationOpen ? "Collapse verification options" : "Expand verification options"}
                            className={`mr-2 p-1 rounded-lg transition-colors cursor-pointer ${
                              active ? "text-white/80 hover:bg-white/20" : "text-gray-400 hover:bg-gray-200"
                            }`}
                          >
                            <ChevronDown
                              className={`h-3.5 w-3.5 transition-transform duration-200 ${
                                verificationOpen ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                        )}
                      </div>

                      {/* Verification Sub-options: Under Review, Pending, Rejected */}
                      {isVerificationItem && verificationOpen && !collapsed && (
                        <div className="ml-3 my-1 space-y-1 border-l-2 border-[#BCE9D5] pl-2.5 py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                          {[
                            { label: "Pending", status: "pending", icon: Clock3 },
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
                                className={`flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-[11px] font-semibold transition-all ${
                                  isSubActive
                                    ? "bg-[#DDF4EA] text-[#0F9F68] font-bold shadow-2xs"
                                    : "text-gray-500 hover:bg-[#F4F4F6] hover:text-[#171717]"
                                }`}
                              >
                                <SubIcon
                                  className={`h-3.5 w-3.5 shrink-0 ${
                                    isSubActive ? "text-[#0F9F68]" : "text-gray-400"
                                  }`}
                                />
                                <span>{sub.label}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* ── Footer / User Profile & Actions ─────────────────────────────────── */}
        <div className="shrink-0 border-t border-gray-100 pt-3">
          {!collapsed && (
            <div className="mb-2.5 flex items-center gap-2.5 rounded-2xl border border-gray-100 bg-[#F4F4F6]/70 px-3 py-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0F9F68] text-xs font-bold text-white shadow-2xs">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-[#171717]">{user?.fullName || "Administrator"}</p>
                <p className="flex items-center gap-1 truncate text-[10px] text-gray-400 font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0F9F68]" />
                  Active Session
                </p>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            className={`mb-1.5 flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-xs font-semibold text-gray-500 transition-colors hover:bg-[#F4F4F6] hover:text-gray-800 cursor-pointer ${
              collapsed ? "justify-center" : ""
            }`}
            aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
          >
            {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
            {!collapsed && <span>Collapse</span>}
          </button>

          <div className={`flex ${collapsed ? "justify-center" : "items-center justify-between px-1"}`}>
            {!collapsed && (
              <Link
                href="/"
                className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-400 transition-colors hover:text-[#0F9F68]"
              >
                <HelpCircle className="h-3.5 w-3.5" />
                Public Site
              </Link>
            )}
            <button
              type="button"
              onClick={handleLogout}
              title={collapsed ? "Logout" : undefined}
              className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-500 transition-colors hover:text-rose-600 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              {!collapsed && "Logout"}
            </button>
          </div>
        </div>

      </div>
    </aside>
  );
}
