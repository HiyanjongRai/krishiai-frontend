"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Sparkles,
  CloudSun,
  Users,
  Menu,
  LayoutDashboard,
  Sprout,
  Scan,
  MessageSquareText,
  FileText,
} from "lucide-react";
import { useAuth } from "@/providers/auth-provider";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuth();
  const [activeHash, setActiveHash] = useState("");

  useEffect(() => {
    const handleHashChange = () => {
      setActiveHash(window.location.hash);
    };
    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleOpenMenu = () => {
    window.dispatchEvent(new CustomEvent("open-mobile-drawer"));
  };

  const isFarmerArea = pathname.startsWith("/farmer") || (isAuthenticated && user?.role === "ROLE_FARMER" && !pathname.startsWith("/expert") && !pathname.startsWith("/admin"));
  const isExpertArea = pathname.startsWith("/expert") || (isAuthenticated && user?.role === "ROLE_EXPERT" && !pathname.startsWith("/farmer") && !pathname.startsWith("/admin"));

  // 1. Farmer Bottom Nav Items
  if (isFarmerArea && pathname.startsWith("/farmer")) {
    const isDashboard = pathname === "/farmer/dashboard";
    const isCrops = pathname.startsWith("/farmer/crops");
    const isAnalysis = pathname.startsWith("/farmer/analysis");
    const isConsultations = pathname.startsWith("/farmer/consultations");

    return (
      <nav
        aria-label="Farmer Mobile Bottom Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-1 py-1 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-[max(0.375rem,env(safe-area-inset-bottom))]"
      >
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {/* Dashboard */}
          <Link
            href="/farmer/dashboard"
            className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] py-1 px-1.5 rounded-xl transition-all cursor-pointer ${
              isDashboard
                ? "text-[#0F9F68] font-bold"
                : "text-slate-500 hover:text-slate-900 font-medium"
            }`}
          >
            <div className={`p-1 rounded-full transition-colors ${isDashboard ? "bg-[#DDF4EA]" : ""}`}>
              <LayoutDashboard className="w-4 h-4" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">Dashboard</span>
          </Link>

          {/* Crops */}
          <Link
            href="/farmer/crops"
            className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] py-1 px-1.5 rounded-xl transition-all cursor-pointer ${
              isCrops
                ? "text-[#0F9F68] font-bold"
                : "text-slate-500 hover:text-slate-900 font-medium"
            }`}
          >
            <div className={`p-1 rounded-full transition-colors ${isCrops ? "bg-[#DDF4EA]" : ""}`}>
              <Sprout className="w-4 h-4" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">My Crops</span>
          </Link>

          {/* AI Scan */}
          <Link
            href="/farmer/analysis"
            className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] py-1 px-1.5 rounded-xl transition-all cursor-pointer ${
              isAnalysis
                ? "text-[#0F9F68] font-bold"
                : "text-slate-500 hover:text-slate-900 font-medium"
            }`}
          >
            <div className={`p-1 rounded-full transition-colors ${isAnalysis ? "bg-[#DDF4EA]" : ""}`}>
              <Scan className="w-4 h-4" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">AI Scan</span>
          </Link>

          {/* Consultations */}
          <Link
            href="/farmer/consultations"
            className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] py-1 px-1.5 rounded-xl transition-all cursor-pointer ${
              isConsultations
                ? "text-[#0F9F68] font-bold"
                : "text-slate-500 hover:text-slate-900 font-medium"
            }`}
          >
            <div className={`p-1 rounded-full transition-colors ${isConsultations ? "bg-[#DDF4EA]" : ""}`}>
              <Users className="w-4 h-4" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">Experts</span>
          </Link>

          {/* Drawer Menu */}
          <button
            type="button"
            onClick={handleOpenMenu}
            aria-label="Open mobile navigation menu"
            className="flex flex-col items-center justify-center min-w-[54px] min-h-[44px] py-1 px-1.5 rounded-xl text-slate-600 hover:text-slate-900 font-medium transition-all cursor-pointer active:scale-95"
          >
            <div className="p-1 rounded-full hover:bg-slate-100">
              <Menu className="w-4 h-4" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">Menu</span>
          </button>
        </div>
      </nav>
    );
  }

  // 2. Expert Bottom Nav Items
  if (isExpertArea && pathname.startsWith("/expert")) {
    const isDashboard = pathname === "/expert/dashboard" || pathname === "/expert";
    const isConsultations = pathname.startsWith("/expert/consultations");
    const isExpertise = pathname.startsWith("/expert/expertise");
    const isDocs = pathname.startsWith("/expert/documents");

    return (
      <nav
        aria-label="Expert Mobile Bottom Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-1 py-1 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-[max(0.375rem,env(safe-area-inset-bottom))]"
      >
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {/* Dashboard */}
          <Link
            href="/expert/dashboard"
            className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] py-1 px-1.5 rounded-xl transition-all cursor-pointer ${
              isDashboard
                ? "text-emerald-700 font-bold"
                : "text-slate-500 hover:text-slate-900 font-medium"
            }`}
          >
            <div className={`p-1 rounded-full transition-colors ${isDashboard ? "bg-emerald-50" : ""}`}>
              <LayoutDashboard className="w-4 h-4" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">Dashboard</span>
          </Link>

          {/* Inquiries / Consultations */}
          <Link
            href="/expert/consultations"
            className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] py-1 px-1.5 rounded-xl transition-all cursor-pointer ${
              isConsultations
                ? "text-emerald-700 font-bold"
                : "text-slate-500 hover:text-slate-900 font-medium"
            }`}
          >
            <div className={`p-1 rounded-full transition-colors ${isConsultations ? "bg-emerald-50" : ""}`}>
              <MessageSquareText className="w-4 h-4" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">Inquiries</span>
          </Link>

          {/* Expertise */}
          <Link
            href="/expert/expertise"
            className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] py-1 px-1.5 rounded-xl transition-all cursor-pointer ${
              isExpertise
                ? "text-emerald-700 font-bold"
                : "text-slate-500 hover:text-slate-900 font-medium"
            }`}
          >
            <div className={`p-1 rounded-full transition-colors ${isExpertise ? "bg-emerald-50" : ""}`}>
              <Sprout className="w-4 h-4" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">Expertise</span>
          </Link>

          {/* Documents */}
          <Link
            href="/expert/documents"
            className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] py-1 px-1.5 rounded-xl transition-all cursor-pointer ${
              isDocs
                ? "text-emerald-700 font-bold"
                : "text-slate-500 hover:text-slate-900 font-medium"
            }`}
          >
            <div className={`p-1 rounded-full transition-colors ${isDocs ? "bg-emerald-50" : ""}`}>
              <FileText className="w-4 h-4" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">Documents</span>
          </Link>

          {/* Drawer Menu */}
          <button
            type="button"
            onClick={handleOpenMenu}
            aria-label="Open mobile navigation menu"
            className="flex flex-col items-center justify-center min-w-[54px] min-h-[44px] py-1 px-1.5 rounded-xl text-slate-600 hover:text-slate-900 font-medium transition-all cursor-pointer active:scale-95"
          >
            <div className="p-1 rounded-full hover:bg-slate-100">
              <Menu className="w-4 h-4" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">Menu</span>
          </button>
        </div>
      </nav>
    );
  }

  // 3. Public / Guest Bottom Nav Items
  const isHome = pathname === "/" && (!activeHash || activeHash === "#home");
  const isAiActive = activeHash === "#ai-analysis" || pathname === "/farmer/analysis";
  const isExpertsActive = pathname.startsWith("/experts");

  const aiHref = isAuthenticated && user?.role === "ROLE_FARMER" ? "/farmer/analysis" : "/#ai-analysis";
  const weatherHref = "/#ai-analysis";

  return (
    <nav
      aria-label="Public Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-1 py-1 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-[max(0.375rem,env(safe-area-inset-bottom))]"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Home */}
        <Link
          href="/"
          onClick={() => setActiveHash("")}
          className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] py-1 px-1.5 rounded-xl transition-all cursor-pointer ${
            isHome
              ? "text-[#0F9F68] font-bold"
              : "text-slate-500 hover:text-slate-900 font-medium"
          }`}
        >
          <div className={`p-1 rounded-full transition-colors ${isHome ? "bg-[#DDF4EA]" : ""}`}>
            <Home className="w-4 h-4" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Home</span>
        </Link>

        {/* AI Analysis */}
        <Link
          href={aiHref}
          onClick={() => setActiveHash("#ai-analysis")}
          className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] py-1 px-1.5 rounded-xl transition-all cursor-pointer ${
            isAiActive
              ? "text-[#0F9F68] font-bold"
              : "text-slate-500 hover:text-slate-900 font-medium"
          }`}
        >
          <div className={`p-1 rounded-full transition-colors ${isAiActive ? "bg-[#DDF4EA]" : ""}`}>
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">AI Scan</span>
        </Link>

        {/* Weather */}
        <Link
          href={weatherHref}
          onClick={() => setActiveHash("#ai-analysis")}
          className="flex flex-col items-center justify-center min-w-[54px] min-h-[44px] py-1 px-1.5 rounded-xl text-slate-500 hover:text-slate-900 font-medium transition-all cursor-pointer"
        >
          <div className="p-1 rounded-full">
            <CloudSun className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Weather</span>
        </Link>

        {/* Experts */}
        <Link
          href="/experts"
          className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] py-1 px-1.5 rounded-xl transition-all cursor-pointer ${
            isExpertsActive
              ? "text-[#0F9F68] font-bold"
              : "text-slate-500 hover:text-slate-900 font-medium"
          }`}
        >
          <div className={`p-1 rounded-full transition-colors ${isExpertsActive ? "bg-[#DDF4EA]" : ""}`}>
            <Users className="w-4 h-4" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Experts</span>
        </Link>

        {/* Menu Drawer Trigger */}
        <button
          type="button"
          onClick={handleOpenMenu}
          aria-label="Open mobile navigation menu"
          className="flex flex-col items-center justify-center min-w-[54px] min-h-[44px] py-1 px-1.5 rounded-xl text-slate-600 hover:text-slate-900 font-medium transition-all cursor-pointer active:scale-95"
        >
          <div className="p-1 rounded-full hover:bg-slate-100">
            <Menu className="w-4 h-4" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Menu</span>
        </button>
      </div>
    </nav>
  );
}
