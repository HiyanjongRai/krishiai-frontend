"use client";

import React, { useState, useEffect } from "react";
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
  BookOpen,
  HelpCircle,
  Sparkles,
  Users,
  Compass,
  MessageSquareText,
  Bot,
  CalendarCheck,
  Award,
  FileText,
  Scan,
  ShieldCheck,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeaf } from "@fortawesome/free-solid-svg-icons";
import { useAuthModal } from "@/providers/auth-modal-provider";
import { useAuth, getDashboardRoute } from "@/providers/auth-provider";
import { useToast } from "@/providers/toast-provider";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ChangePasswordModal } from "@/components/auth/ChangePasswordModal";
import { UserAvatar } from "@/components/ui/avatar";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { openLogin, openRegister } = useAuthModal();
  const { user, isAuthenticated, isLoading, isLoggingOut, logout } = useAuth();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  // Prevent body scrolling when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Handle Escape key and custom events from Mobile Bottom Nav
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        setUserDropdownOpen(false);
      }
    };
    const handleOpenDrawer = () => setMobileMenuOpen(true);
    const handleToggleDrawer = () => setMobileMenuOpen((prev) => !prev);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-mobile-drawer", handleOpenDrawer);
    window.addEventListener("toggle-mobile-drawer", handleToggleDrawer);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-mobile-drawer", handleOpenDrawer);
      window.removeEventListener("toggle-mobile-drawer", handleToggleDrawer);
    };
  }, []);

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
          { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
          { label: "Farmers", href: "/admin/users", icon: Users },
          { label: "Experts", href: "/admin/experts", icon: Award },
          { label: "Verification", href: "/admin/verification", icon: ShieldCheck },
          { label: "Crops", href: "/admin/crops", icon: Sprout },
          { label: "Analytics", href: "/admin/analytics", icon: Compass },
        ];
      case "ROLE_EXPERT":
        return [
          { label: "Dashboard", href: "/expert/dashboard", icon: LayoutDashboard },
          { label: "Farmer Inquiries", href: "/expert/consultations", icon: MessageSquareText, badge: "5", badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200" },
          { label: "Crop Expertise", href: "/expert/expertise", icon: Sprout },
          { label: "Documents", href: "/expert/documents", icon: FileText },
          { label: "AI Reviews", href: "/expert/ai-reviews", icon: Bot, badge: "AI", badgeColor: "bg-blue-50 text-blue-700 border-blue-200" },
          { label: "Availability", href: "/expert/availability", icon: CalendarCheck },
          { label: "Application Status", href: "/expert/application", icon: ShieldCheck },
          { label: "Profile", href: "/expert/profile", icon: Award },
        ];
      case "ROLE_FARMER":
      default:
        return [
          { label: "Dashboard", href: "/farmer/dashboard", icon: LayoutDashboard },
          { label: "My Crops", href: "/farmer/crops", icon: Sprout },
          { label: "AI Diagnostics", href: "/farmer/analysis", icon: Scan },
          { label: "AI Advisor", href: "/farmer/ai-advisor", icon: Bot, badge: "AI", badgeColor: "bg-teal-50 text-teal-700 border-teal-200" },
          { label: "Consultations", href: "/farmer/consultations", icon: Users },
          { label: "Weather", href: "/farmer/dashboard#weather", icon: Compass },
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
        <nav className="hidden items-center gap-1 rounded-full bg-[#F4F4F6] p-1 text-xs font-semibold text-gray-600 lg:flex">
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
                  <UserAvatar
                    src={user?.profileImage}
                    name={user?.fullName}
                    size="sm"
                    className="rounded-full ring-2 ring-gray-200 group-hover:ring-[#0F9F68] transition-all shadow-xs"
                  />
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
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                      <UserAvatar
                        src={user?.profileImage}
                        name={user?.fullName}
                        size="sm"
                        className="rounded-full ring-2 ring-emerald-500/20"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-[#17201A] truncate">{user?.fullName || "User"}</p>
                        <p className="text-[10px] text-emerald-700 font-semibold">{getRoleLabel(user?.role)}</p>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">{user?.email}</p>
                      </div>
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
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <UserAvatar
                        src={user.profileImage}
                        name={user.fullName}
                        size="sm"
                        className="rounded-full ring-2 ring-slate-200 group-hover:ring-emerald-600 transition-all shadow-2xs"
                      />
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    </button>

                    {userDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                        <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                          <UserAvatar
                            src={user.profileImage}
                            name={user.fullName}
                            size="sm"
                            className="rounded-full ring-2 ring-emerald-500/20"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-[#17201A] truncate">{user.fullName || "User"}</p>
                            <p className="text-[10px] text-emerald-700 font-semibold">{getRoleLabel(user.role)}</p>
                            <p className="text-[10px] text-slate-400 truncate mt-0.5">{user.email}</p>
                          </div>
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

        {/* ── Mobile Header Actions ────────────────────────────────────────── */}
        <div className="flex items-center gap-2 lg:hidden">
          {isAuthenticated && user ? (
            <Link
              href={dashboardRoute}
              className="flex items-center gap-1.5 p-1 rounded-full ring-1 ring-slate-200 hover:ring-emerald-500 transition-all cursor-pointer"
              title="Dashboard"
            >
              <UserAvatar
                src={user.profileImage}
                name={user.fullName}
                size="sm"
                className="w-8 h-8 rounded-full"
              />
            </Link>
          ) : (
            <button
              type="button"
              onClick={openLogin}
              className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-[#166534] rounded-full transition-colors cursor-pointer"
            >
              Sign In
            </button>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            className="w-10 h-10 rounded-full bg-[#F0F3EE] hover:bg-[#e4eae0] flex items-center justify-center text-slate-700 cursor-pointer active:scale-95 transition-all"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* ── Full Mobile Navigation Drawer (Sheet + Backdrop) ─────────────────── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Sheet */}
          <div className="fixed top-0 right-0 bottom-0 w-[86%] max-w-sm bg-white shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300 z-10">
            
            {/* Drawer Top Header */}
            <div>
              <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 group cursor-pointer"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0F9F68] text-white shadow-xs">
                    <FontAwesomeIcon icon={faLeaf} className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-base font-bold tracking-tight text-[#171717]">
                      Krishi<span className="text-[#166534]">AI</span>
                    </span>
                    <span className="block text-[10px] font-medium text-slate-400">
                      Farm Intelligence
                    </span>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close navigation"
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Identity / Quick Status Banner */}
              {isAuthenticated && user && (
                <div className="p-4 mx-4 mt-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-slate-50 border border-emerald-100/80 space-y-2.5">
                  <div className="flex items-center gap-3">
                    <UserAvatar
                      src={user.profileImage}
                      name={user.fullName}
                      size="sm"
                      className="w-10 h-10 rounded-full ring-2 ring-emerald-500/30"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900 truncate">{user.fullName}</p>
                      <span className="inline-block text-[10px] font-semibold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full mt-0.5">
                        {getRoleLabel(user.role)}
                      </span>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">{user.email}</p>
                    </div>
                  </div>

                  <Link
                    href={dashboardRoute}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#166534] hover:bg-[#15803d] text-white text-xs font-bold shadow-xs transition-all text-center"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Go to Dashboard</span>
                  </Link>
                </div>
              )}

              {/* Navigation Sections */}
              <div className="px-4 py-4 space-y-6">
                {/* Primary Destination Links */}
                <div className="space-y-1">
                  <p className="px-3 text-[10px] font-black uppercase tracking-[0.14em] text-slate-400 mb-2">
                    {isDashboard ? "Workspace Links" : "Navigation"}
                  </p>
                  {!isDashboard ? (
                    publicLinks.map((link) => {
                      const isActive =
                        link.href === "/"
                          ? pathname === "/"
                          : pathname.startsWith(link.href);
                      return (
                        <Link
                          key={link.label}
                          href={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all min-h-[44px] ${
                            isActive
                              ? "bg-[#DDF4EA] text-[#0F9F68]"
                              : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                          }`}
                        >
                          <span>{link.label}</span>
                          {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#0F9F68]" />}
                        </Link>
                      );
                    })
                  ) : (
                    dashboardLinks.map((link) => {
                      const Icon = link.icon || LayoutDashboard;
                      const isActive = pathname === link.href || (link.href !== "/expert/dashboard" && link.href !== "/farmer/dashboard" && pathname.startsWith(link.href));
                      return (
                        <Link
                          key={link.label}
                          href={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all min-h-[44px] ${
                            isActive
                              ? "bg-[#DDF4EA] text-[#0F9F68]"
                              : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#0F9F68]" : "text-slate-400"}`} />
                            <span className="truncate">{link.label}</span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {link.badge && (
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${link.badgeColor || "bg-slate-100 text-slate-700 border-slate-200"}`}>
                                {link.badge}
                              </span>
                            )}
                            {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#0F9F68]" />}
                          </div>
                        </Link>
                      );
                    })
                  )}
                </div>

                {/* Secondary / Resources Links */}
                {!isDashboard && (
                  <div className="space-y-1 pt-3 border-t border-slate-100">
                    <p className="px-3 text-[10px] font-black uppercase tracking-[0.14em] text-slate-400 mb-2">
                      Resources & Support
                    </p>
                    <Link
                      href="/knowledge"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors min-h-[40px]"
                    >
                      <BookOpen className="w-4 h-4 text-emerald-600" />
                      <span>Agricultural Knowledge</span>
                    </Link>
                    <Link
                      href="/contact"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors min-h-[40px]"
                    >
                      <HelpCircle className="w-4 h-4 text-slate-500" />
                      <span>Help Center & FAQ</span>
                    </Link>
                  </div>
                )}

                {/* Account & Profile Actions */}
                {isAuthenticated && (
                  <div className="space-y-1 pt-3 border-t border-slate-100">
                    <p className="px-3 text-[10px] font-black uppercase tracking-[0.14em] text-slate-400 mb-2">
                      Account & Settings
                    </p>
                    <Link
                      href={getProfileLink()}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors min-h-[40px]"
                    >
                      <User className="w-4 h-4 text-slate-500" />
                      <span>Profile & Settings</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setChangePasswordOpen(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors min-h-[40px] text-left cursor-pointer"
                    >
                      <KeyRound className="w-4 h-4 text-slate-500" />
                      <span>Change Password</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Drawer Bottom Actions */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-2">
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold text-center transition-colors min-h-[44px] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoggingOut ? (
                    <LoadingSpinner size="xs" color="current" className="text-rose-500" />
                  ) : (
                    <LogOut className="w-4 h-4" />
                  )}
                  <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
                </button>
              ) : (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openLogin();
                    }}
                    className="w-full py-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors min-h-[44px] cursor-pointer"
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openRegister();
                    }}
                    className="w-full py-3 rounded-xl bg-[#166534] hover:bg-[#14532d] text-white text-xs font-bold shadow-xs transition-colors min-h-[44px] cursor-pointer"
                  >
                    Create Free Account
                  </button>
                </div>
              )}

              <p className="text-center text-[10px] text-slate-400 pt-1">
                KrishiAI Platform • Smarter Farming Decisions
              </p>
            </div>

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
