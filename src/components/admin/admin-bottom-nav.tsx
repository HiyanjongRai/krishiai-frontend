"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  ShieldCheck,
  Menu,
} from "lucide-react";

export function AdminBottomNav() {
  const pathname = usePathname();

  const handleOpenMenu = () => {
    window.dispatchEvent(new CustomEvent("open-mobile-drawer"));
  };

  const isDashboard = pathname === "/admin/dashboard";
  const isUsers = pathname.startsWith("/admin/users");
  const isExperts = pathname.startsWith("/admin/experts");
  const isVerification = pathname.startsWith("/admin/verification");

  return (
    <div
      aria-label="Admin Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-[max(0.375rem,env(safe-area-inset-bottom))]"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Dashboard */}
        <Link
          href="/admin/dashboard"
          className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-2 rounded-xl transition-all cursor-pointer ${
            isDashboard
              ? "text-emerald-700 font-bold"
              : "text-slate-500 hover:text-slate-900 font-medium"
          }`}
        >
          <div className={`p-1 rounded-full transition-colors ${isDashboard ? "bg-emerald-50" : ""}`}>
            <LayoutDashboard className="w-4 h-4" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Overview</span>
        </Link>

        {/* Cultivators */}
        <Link
          href="/admin/users"
          className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-2 rounded-xl transition-all cursor-pointer ${
            isUsers
              ? "text-emerald-700 font-bold"
              : "text-slate-500 hover:text-slate-900 font-medium"
          }`}
        >
          <div className={`p-1 rounded-full transition-colors ${isUsers ? "bg-emerald-50" : ""}`}>
            <Users className="w-4 h-4" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Farmers</span>
        </Link>

        {/* Experts */}
        <Link
          href="/admin/experts?status=active"
          className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-2 rounded-xl transition-all cursor-pointer ${
            isExperts
              ? "text-emerald-700 font-bold"
              : "text-slate-500 hover:text-slate-900 font-medium"
          }`}
        >
          <div className={`p-1 rounded-full transition-colors ${isExperts ? "bg-emerald-50" : ""}`}>
            <UserCheck className="w-4 h-4" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Experts</span>
        </Link>

        {/* Verification */}
        <Link
          href="/admin/verification"
          className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-2 rounded-xl transition-all cursor-pointer ${
            isVerification
              ? "text-emerald-700 font-bold"
              : "text-slate-500 hover:text-slate-900 font-medium"
          }`}
        >
          <div className={`p-1 rounded-full transition-colors ${isVerification ? "bg-emerald-50" : ""}`}>
            <ShieldCheck className="w-4 h-4" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Verify</span>
        </Link>

        {/* Menu / Drawer */}
        <button
          type="button"
          onClick={handleOpenMenu}
          aria-label="Open admin navigation menu"
          className="flex flex-col items-center justify-center min-w-[56px] py-1 px-2 rounded-xl text-slate-600 hover:text-slate-900 font-medium transition-all cursor-pointer active:scale-95"
        >
          <div className="p-1 rounded-full hover:bg-slate-100">
            <Menu className="w-4 h-4" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Menu</span>
        </button>
      </div>
    </div>
  );
}
