"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sprout,
  ArrowRight,
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  User,
} from "lucide-react";
import { useAuthModal } from "@/providers/auth-modal-provider";
import { useAuth, getDashboardRoute } from "@/providers/auth-provider";

export function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { openLogin, openRegister } = useAuthModal();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const dashboardRoute = user ? getDashboardRoute(user.role) : "/";

  const handleLogout = () => {
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    logout();
  };

  const handleDashboard = () => {
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    router.push(dashboardRoute);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600 group-hover:scale-105 transition-transform shadow-xs">
            <Sprout className="w-5 h-5 text-emerald-600" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900">
            Krishi<span className="text-emerald-600">AI</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium text-slate-600">
          <Link
            href="/"
            className="text-emerald-700 font-semibold relative after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:w-full after:h-0.5 after:bg-emerald-600 after:rounded-full"
          >
            Home
          </Link>
          <Link href="/#how-it-works" className="hover:text-emerald-700 transition-colors">
            How It Works
          </Link>
          <Link href="/#features" className="hover:text-emerald-700 transition-colors">
            Features
          </Link>
          <Link href="/#ai-analysis" className="hover:text-emerald-700 transition-colors">
            AI Analysis
          </Link>
          <Link href="/experts" className="hover:text-emerald-700 transition-colors">
            Experts
          </Link>
          <Link href="/about" className="hover:text-emerald-700 transition-colors">
            About
          </Link>
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isLoading ? (
            /* Skeleton while restoring session */
            <div className="flex items-center gap-3">
              <div className="w-16 h-8 bg-slate-100 rounded-lg animate-pulse" />
              <div className="w-28 h-8 bg-slate-100 rounded-lg animate-pulse" />
            </div>
          ) : isAuthenticated && user ? (
            /* ── Logged-in state ── */
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all text-sm font-semibold text-slate-700 cursor-pointer"
              >
                {/* Avatar / initials */}
                <span className="w-7 h-7 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-xs font-bold text-emerald-800 shrink-0">
                  {user.firstName.charAt(0).toUpperCase()}
                  {user.lastName.charAt(0).toUpperCase()}
                </span>
                <span className="max-w-[100px] truncate">{user.firstName}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown */}
              {userMenuOpen && (
                <>
                  {/* Click-away overlay */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl border border-slate-200 shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                    {/* User info header */}
                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      <span className="mt-1 inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {user.role === "ROLE_FARMER"
                          ? "Farmer"
                          : user.role === "ROLE_EXPERT"
                          ? "Expert"
                          : "Admin"}
                      </span>
                    </div>

                    {/* Menu items */}
                    <div className="py-1.5">
                      <button
                        type="button"
                        onClick={handleDashboard}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors cursor-pointer"
                      >
                        <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                        <span>My Dashboard</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false);
                          router.push(`${dashboardRoute}/profile`);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        <span>My Profile</span>
                      </button>
                    </div>

                    <div className="py-1.5 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            /* ── Guest state ── */
            <>
              <button
                type="button"
                onClick={openLogin}
                className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
              >
                Login
              </button>
              <button
                type="button"
                onClick={openRegister}
                className="px-4 py-2 text-sm font-semibold text-white bg-[#0f3d26] hover:bg-[#14532d] rounded-lg transition-all flex items-center gap-1.5 shadow-sm hover:shadow cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-5 py-4 space-y-3">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-emerald-700 font-semibold">
            Home
          </Link>
          <Link href="/#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-600 hover:text-emerald-700">
            How It Works
          </Link>
          <Link href="/#features" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-600 hover:text-emerald-700">
            Features
          </Link>
          <Link href="/#ai-analysis" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-600 hover:text-emerald-700">
            AI Analysis
          </Link>
          <Link href="/experts" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-600 hover:text-emerald-700">
            Experts
          </Link>
          <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-600 hover:text-emerald-700">
            About
          </Link>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {isLoading ? (
              <div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
            ) : isAuthenticated && user ? (
              /* ── Mobile: Logged-in ── */
              <>
                {/* User info */}
                <div className="flex items-center gap-3 px-1 py-2">
                  <span className="w-9 h-9 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-sm font-bold text-emerald-800 shrink-0">
                    {user.firstName.charAt(0).toUpperCase()}
                    {user.lastName.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleDashboard}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white bg-[#0f3d26] rounded-lg cursor-pointer"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Go to Dashboard</span>
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              /* ── Mobile: Guest ── */
              <>
                <button
                  type="button"
                  onClick={() => { setMobileMenuOpen(false); openLogin(); }}
                  className="w-full text-center py-2.5 text-sm font-semibold text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => { setMobileMenuOpen(false); openRegister(); }}
                  className="w-full text-center py-2.5 text-sm font-semibold text-white bg-[#0f3d26] rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
