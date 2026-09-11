"use client";

import React, { useState } from "react";
import Link from "next/link";
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
  Sprout,
  KeyRound,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeaf } from "@fortawesome/free-solid-svg-icons";
import { useAuthModal } from "@/providers/auth-modal-provider";
import { useAuth, getDashboardRoute } from "@/providers/auth-provider";
import { useToast } from "@/providers/toast-provider";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ChangePasswordModal } from "@/components/auth/ChangePasswordModal";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { openLogin, openRegister } = useAuthModal();
  const { user, isAuthenticated, isLoading, isLoggingOut, logout } = useAuth();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  // Check if current route is any dashboard (farmer, expert, admin)
  const isDashboard =
    pathname.startsWith("/farmer") ||
    pathname.startsWith("/expert/") ||
    pathname === "/expert" ||
    pathname.startsWith("/admin");

  const dashboardRoute = user ? getDashboardRoute(user.role) : "/farmer/dashboard";

  // Public Landing Page links
  const publicLinks = [
    { label: "Home", href: "/" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Features", href: "/#features" },
    { label: "AI Analysis", href: "/#ai-analysis" },
    { label: "Experts", href: "/experts" },
    { label: "About", href: "/about" },
  ];

  // Dynamic Dashboard Links based on the authenticated user's role
  const getRoleDashboardLinks = () => {
    switch (user?.role) {
      case "ROLE_ADMIN":
        return [
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Farmers", href: "/admin/users" },
          { label: "Experts", href: "/admin/experts" },
          { label: "Verification", href: "/admin/verification" },
          { label: "Crops", href: "/admin/crops" },
          { label: "Analytics", href: "/admin/analytics" },
        ];
      case "ROLE_EXPERT":
        return [
          { label: "Dashboard", href: "/expert/dashboard" },
          { label: "Inquiries", href: "/expert/consultations" },
          { label: "AI Reviews", href: "/expert/ai-reviews" },
          { label: "Availability", href: "/expert/availability" },
          { label: "Profile", href: "/expert/profile" },
        ];
      case "ROLE_FARMER":
      default:
        return [
          { label: "Overview", href: "/farmer/dashboard" },
          { label: "Crops", href: "/farmer/crops" },
          { label: "AI Diagnostics", href: "/farmer/analysis" },
          { label: "Weather", href: "/farmer/dashboard#weather" },
          { label: "Advisories", href: "/farmer/dashboard#history" },
        ];
    }
  };

  const dashboardLinks = getRoleDashboardLinks();

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case "ROLE_ADMIN":
        return "Platform Admin";
      case "ROLE_EXPERT":
        return "Agricultural Expert";
      case "ROLE_FARMER":
        return "Farmer";
      default:
        return role ? role.replace("ROLE_", "") : "Member";
    }
  };

  const getProfileLink = () => {
    switch (user?.role) {
      case "ROLE_ADMIN":
        return "/admin/settings";
      case "ROLE_EXPERT":
        return "/expert/profile";
      case "ROLE_FARMER":
      default:
        return "/farmer/profile";
    }
  };

  const getUserInitials = () => {
    if (!user?.fullName) return "KA";
    return user.fullName
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const handleLogout = () => {
    if (isLoggingOut) return; // prevent duplicate
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    logout();
    toast.success({
      title: "Signed out successfully.",
      description: "You have been safely logged out.",
    });
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-transparent px-3 pt-3 sm:px-6 lg:px-8">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between rounded-[24px] border border-[rgba(234,234,236,0.85)] bg-white px-4 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04),0_2px_6px_-1px_rgba(0,0,0,0.02)] sm:px-6">
        
        {/* ── Brand Logo ──────────────────────────────────────────────────────── */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0F9F68] text-white shadow-sm transition-transform group-hover:scale-105">
            <FontAwesomeIcon icon={faLeaf} className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-[#171717]">
              Krishi<span className="text-[#166534]">AI</span>
            </span>
            <span className="ml-2 hidden text-[10px] font-medium text-slate-400 sm:inline-block">
              Platform workspace
            </span>
          </div>
        </Link>

        {/* ── Center Segmented Pill Navigation Bar (Switches by Route & Role) ───── */}
        <nav className="hidden items-center gap-1 rounded-full bg-[#F4F4F6] p-1 text-xs font-semibold text-gray-600 md:flex">
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
                  className={`px-4 py-2 rounded-full font-semibold transition-colors duration-150 ${
                    isActive
                      ? "bg-white text-[#171717] shadow-xs"
                      : "text-gray-500 hover:text-[#171717] hover:bg-white/60"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })
          ) : (
            /* Role-Appropriate Dashboard Links */
            dashboardLinks.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href) && item.href !== "/admin/dashboard" && item.href !== "/expert/dashboard" && item.href !== "/farmer/dashboard");
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`px-4 py-2 rounded-full font-semibold transition-colors duration-150 ${
                    isActive
                      ? "bg-white text-[#171717] shadow-xs"
                      : "text-gray-500 hover:text-[#171717] hover:bg-white/60"
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
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#F4F4F6] text-gray-600 transition-colors hover:bg-[#DDF4EA] hover:text-[#0F9F68]"
                title="Search"
              >
                <Search className="w-4 h-4" />
              </button>

              <button
                type="button"
                className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#F4F4F6] text-gray-600 transition-colors hover:bg-[#DDF4EA] hover:text-[#0F9F68]"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#0F9F68]" aria-label="Notifications available" />
              </button>

              {/* User Profile Dropdown Pill */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 pl-1 cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-[#0F9F68] transition-colors relative bg-[#0F9F68] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {getUserInitials()}
                  </div>
                  <div className="text-left min-w-0 max-w-[130px]">
                    <p className="text-xs font-bold text-[#171717] leading-tight truncate">
                      {user?.fullName || "User"}
                    </p>
                    <p className="text-[10px] text-gray-400 font-medium truncate">
                      {getRoleLabel(user?.role)}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-[#17201A] truncate">{user?.fullName || "User"}</p>
                      <p className="text-[10px] text-emerald-700 font-semibold">{getRoleLabel(user?.role)}</p>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">{user?.email}</p>
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
                      href={dashboardRoute}
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-[#166534] transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                      <span>My Dashboard</span>
                    </Link>

                    <Link
                      href={getProfileLink()}
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-[#166534] transition-colors"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>Profile & Settings</span>
                    </Link>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isLoggingOut ? (
                          <LoadingSpinner size="xs" color="current" className="text-rose-500" />
                        ) : (
                          <LogOut className="w-4 h-4" />
                        )}
                        <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
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
                <Skeleton className="w-24 h-8 rounded-full" />
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
                      <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-300 relative bg-[#166534] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                        {getUserInitials()}
                      </div>
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    </button>

                    {userDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                        <div className="px-4 py-2 border-b border-slate-100">
                          <p className="text-xs font-bold text-[#17201A] truncate">{user.fullName || "User"}</p>
                          <p className="text-[10px] text-emerald-700 font-semibold">{getRoleLabel(user.role)}</p>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">{user.email}</p>
                        </div>

                        <Link
                          href={dashboardRoute}
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-emerald-700"
                        >
                          <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                          <span>My Dashboard</span>
                        </Link>

                        <Link
                          href={getProfileLink()}
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-emerald-700"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          <span>Profile & Settings</span>
                        </Link>

                        <button
                          type="button"
                          onClick={() => {
                            setUserDropdownOpen(false);
                            setChangePasswordOpen(true);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-emerald-700 cursor-pointer text-left"
                        >
                          <KeyRound className="w-4 h-4 text-slate-400" />
                          <span>Change Password</span>
                        </button>

                        <div className="pt-1 border-t border-slate-100">
                          <button
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {isLoggingOut ? (
                              <LoadingSpinner size="xs" color="current" className="text-rose-500" />
                            ) : (
                              <LogOut className="w-4 h-4" />
                            )}
                            <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
                          </button>
                        </div>
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
              <div className="space-y-2">
                <div className="p-3 bg-slate-50 rounded-2xl flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#166534] text-white flex items-center justify-center font-bold text-xs">
                    {getUserInitials()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{user?.fullName}</p>
                    <p className="text-[10px] text-emerald-700 font-semibold">{getRoleLabel(user?.role)}</p>
                  </div>
                </div>

                <Link
                  href={dashboardRoute}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full block py-2.5 rounded-xl bg-[#166534] text-white text-xs font-bold text-center"
                >
                  Go to Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-50 text-rose-600 text-xs font-bold text-center disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoggingOut && <LoadingSpinner size="xs" color="current" className="text-rose-500" />}
                  {isLoggingOut ? "Signing out..." : "Sign Out"}
                </button>
              </div>
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

      <ChangePasswordModal
        isOpen={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
      />
    </header>
  );
}
