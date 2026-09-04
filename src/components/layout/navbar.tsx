"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  Bell,
  ChevronDown,
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  User,
  ArrowRight,
  Settings,
  Sprout,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeaf } from "@fortawesome/free-solid-svg-icons";
import { useAuthModal } from "@/providers/auth-modal-provider";
import { useAuth, getDashboardRoute } from "@/providers/auth-provider";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { openLogin, openRegister } = useAuthModal();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Check if current route is any dashboard (farmer, expert, admin)
  // NOTE: use "/expert/" (with trailing slash) so /experts (public page) is NOT matched
  const isDashboard =
    pathname.startsWith("/farmer") ||
    pathname.startsWith("/expert/") ||
    pathname === "/expert" ||
    pathname.startsWith("/admin");

  const dashboardRoute = user ? getDashboardRoute(user.role) : "/farmer/dashboard";
  const farmerName = user?.fullName || "Ram Bahadur";

  // Public Landing Page links
  const publicLinks = [
    { label: "Home", href: "/" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Features", href: "/#features" },
    { label: "AI Analysis", href: "/#ai-analysis" },
    { label: "Experts", href: "/experts" },
    { label: "About", href: "/about" },
  ];

  // Dashboard links
  const dashboardLinks = [
    { label: "Overview", href: "/farmer/dashboard" },
    { label: "Crops", href: "/farmer/crops" },
    { label: "AI Diagnostics", href: "/farmer/analysis" },
    { label: "Weather", href: "/farmer/dashboard#weather" },
    { label: "Advisories", href: "/farmer/dashboard#history" },
  ];

  const handleLogout = () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#E5E9E2] transition-all">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* ── Brand Logo ──────────────────────────────────────────────────────── */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-9 h-9 rounded-xl bg-[#166534] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
            <FontAwesomeIcon icon={faLeaf} className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-[#17201A]">
              Krishi<span className="text-[#166534]">AI</span>
            </span>
            <span className="hidden sm:inline-block text-[10px] text-slate-400 font-medium ml-2">
              Smart Farming, Better Future
            </span>
          </div>
        </Link>

        {/* ── Center Segmented Pill Navigation Bar (Switches by Route) ─────────── */}
        <nav className="hidden md:flex items-center bg-[#F0F3EE] p-1.5 rounded-full text-xs font-semibold text-slate-600 gap-1 shadow-inner">
          {!isDashboard ? (
            /* Public / Homepage Links */
            publicLinks.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href) ||
                    (typeof window !== "undefined" && window.location.hash === item.href.replace("/", ""));
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`px-4 py-2 rounded-full transition-all duration-200 ${
                    isActive
                      ? "bg-white text-[#17201A] font-bold shadow-xs"
                      : "hover:text-[#17201A] hover:bg-white/50"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })
          ) : (
            /* Dashboard Links */
            dashboardLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`px-4 py-2 rounded-full transition-all duration-200 ${
                    isActive
                      ? "bg-white text-[#17201A] font-bold shadow-xs"
                      : "hover:text-[#17201A] hover:bg-white/50"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })
          )}
        </nav>

        {/* ── Right Action Controls ───────────────────────────────────────────── */}
        <div className="hidden md:flex items-center gap-3">
          {isDashboard ? (
            /* Dashboard Action Controls */
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="w-10 h-10 rounded-full bg-[#F0F3EE] hover:bg-slate-200/80 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
                title="Search"
              >
                <Search className="w-4 h-4" />
              </button>

              <button
                type="button"
                className="w-10 h-10 rounded-full bg-[#F0F3EE] hover:bg-slate-200/80 flex items-center justify-center text-slate-600 transition-colors relative cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center absolute -top-1 -right-1 shadow-xs">
                  3
                </span>
              </button>

              {/* User Profile Dropdown Pill */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-1 cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-200 group-hover:border-[#166534] transition-colors relative bg-emerald-50">
                    <Image
                      src="/images/farmers/ram-bahadur.jpg"
                      alt={farmerName}
                      width={40}
                      height={40}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-[#17201A] leading-tight">{farmerName}</p>
                    <p className="text-[10px] text-slate-400">Kathmandu, Nepal</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-[#17201A]">{farmerName}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user?.email || "farmer@krishiai.org"}</p>
                    </div>

                    <Link
                      href="/"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-[#166534] transition-colors"
                    >
                      <Sprout className="w-4 h-4 text-emerald-600" />
                      <span>Back to Homepage</span>
                    </Link>

                    <Link
                      href="/farmer/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-[#166534] transition-colors"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      href="/farmer/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-[#166534] transition-colors"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      <span>Farm Settings</span>
                    </Link>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Public Page Action Controls */
            <div className="flex items-center gap-3">
              {isLoading ? (
                <div className="w-24 h-8 bg-slate-100 rounded-full animate-pulse" />
              ) : isAuthenticated && user ? (
                /* Authenticated User on Public Page */
                <div className="flex items-center gap-3">
                  <Link
                    href={dashboardRoute}
                    className="flex items-center gap-1.5 bg-[#166534] hover:bg-[#15803d] text-white px-4 py-2 rounded-full text-xs font-bold shadow-xs transition-all active:scale-95"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Dashboard</span>
                  </Link>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-300 relative bg-slate-100">
                        <Image
                          src="/images/farmers/ram-bahadur.jpg"
                          alt={farmerName}
                          width={36}
                          height={36}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    </button>

                    {userDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                        <div className="px-4 py-2 border-b border-slate-100">
                          <p className="text-xs font-bold text-[#17201A]">{farmerName}</p>
                          <p className="text-[10px] text-slate-400">{user.role}</p>
                        </div>

                        <Link
                          href={dashboardRoute}
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-emerald-700"
                        >
                          <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                          <span>My Dashboard</span>
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Guest User on Public Page */
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={openLogin}
                    className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-[#166534] hover:bg-[#F0F3EE] rounded-full transition-colors cursor-pointer"
                  >
                    Sign In
                  </button>

                  <button
                    type="button"
                    onClick={openRegister}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-[#166534] hover:bg-[#15803d] text-white rounded-full shadow-xs transition-all active:scale-95 cursor-pointer"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Mobile Hamburger Button ────────────────────────────────────────── */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden w-10 h-10 rounded-full bg-[#F0F3EE] flex items-center justify-center text-slate-700 cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

      </div>

      {/* ── Mobile Navigation Drawer ─────────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#E5E9E2] px-5 py-4 space-y-3 animate-in slide-in-from-top-2 duration-150">
          <div className="space-y-1">
            {!isDashboard ? (
              publicLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-[#F0F3EE] hover:text-[#166534]"
                >
                  {link.label}
                </Link>
              ))
            ) : (
              dashboardLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-[#F0F3EE] hover:text-[#166534]"
                >
                  {link.label}
                </Link>
              ))
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="w-full py-2.5 rounded-full bg-rose-50 text-rose-600 text-xs font-bold text-center"
              >
                Sign Out
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openLogin();
                  }}
                  className="py-2.5 rounded-full border border-slate-200 text-xs font-bold text-slate-700"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openRegister();
                  }}
                  className="py-2.5 rounded-full bg-[#166534] text-white text-xs font-bold"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
