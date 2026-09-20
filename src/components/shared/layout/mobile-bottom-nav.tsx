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
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB]/90 px-1 py-1 shadow-[0_-4px_20px_#E5E7EB] pb-[max(0.375rem,env(safe-area-inset-bottom))]"
      >
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {/* Dashboard */}
          <Link
            href="/farmer/dashboard"
            className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] py-1 px-1.5 rounded-xl transition-all cursor-pointer ${
              isDashboard
                ? "text-[#2E7D32] font-bold"
                : "text-[#6B7280] hover:text-[#1F2937] font-medium"
            }`}
          >
            <div className={`p-1 rounded-full transition-colors ${isDashboard ? "bg-[#E8F5E9]" : ""}`}>
              <LayoutDashboard className="w-4 h-4" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">Dashboard</span>
          </Link>

          {/* Crops */}
          <Link
            href="/farmer/crops"
            className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] py-1 px-1.5 rounded-xl transition-all cursor-pointer ${
              isCrops
                ? "text-[#2E7D32] font-bold"
                : "text-[#6B7280] hover:text-[#1F2937] font-medium"
            }`}
          >
            <div className={`p-1 rounded-full transition-colors ${isCrops ? "bg-[#E8F5E9]" : ""}`}>
              <Sprout className="w-4 h-4" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">My Crops</span>
          </Link>

          {/* AI Scan */}
          <Link
            href="/farmer/analysis"
            className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] py-1 px-1.5 rounded-xl transition-all cursor-pointer ${
              isAnalysis
                ? "text-[#2E7D32] font-bold"
                : "text-[#6B7280] hover:text-[#1F2937] font-medium"
            }`}
          >
            <div className={`p-1 rounded-full transition-colors ${isAnalysis ? "bg-[#E8F5E9]" : ""}`}>
              <Scan className="w-4 h-4" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">AI Scan</span>
          </Link>

          {/* Consultations */}
          <Link
            href="/farmer/consultations"
            className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] py-1 px-1.5 rounded-xl transition-all cursor-pointer ${
              isConsultations
                ? "text-[#2E7D32] font-bold"
                : "text-[#6B7280] hover:text-[#1F2937] font-medium"
            }`}
          >
            <div className={`p-1 rounded-full transition-colors ${isConsultations ? "bg-[#E8F5E9]" : ""}`}>
              <Users className="w-4 h-4" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">Experts</span>
          </Link>

          {/* Drawer Menu */}
          <button
            type="button"
            onClick={handleOpenMenu}
            aria-label="Open mobile navigation menu"
            className="flex flex-col items-center justify-center min-w-[54px] min-h-[44px] py-1 px-1.5 rounded-xl text-[#4B5563] hover:text-[#1F2937] font-medium transition-all cursor-pointer active:scale-95"
          >
            <div className="p-1 rounded-full hover:bg-[#F1F5F2]">
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
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB]/90 px-1 py-1 shadow-[0_-4px_20px_#E5E7EB] pb-[max(0.375rem,env(safe-area-inset-bottom))]"
      >
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {/* Dashboard */}
          <Link
            href="/expert/dashboard"
            className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] py-1 px-1.5 rounded-xl transition-all cursor-pointer ${
              isDashboard
                ? "text-[#2E7D32] font-bold"
                : "text-[#6B7280] hover:text-[#1F2937] font-medium"
            }`}
          >
            <div className={`p-1 rounded-full transition-colors ${isDashboard ? "bg-[#E8F5E9]" : ""}`}>
              <LayoutDashboard className="w-4 h-4" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">Dashboard</span>
          </Link>

          {/* Inquiries / Consultations */}
          <Link
            href="/expert/consultations"
            className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] py-1 px-1.5 rounded-xl transition-all cursor-pointer ${
              isConsultations
                ? "text-[#2E7D32] font-bold"
                : "text-[#6B7280] hover:text-[#1F2937] font-medium"
            }`}
          >
            <div className={`p-1 rounded-full transition-colors ${isConsultations ? "bg-[#E8F5E9]" : ""}`}>
              <MessageSquareText className="w-4 h-4" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">Inquiries</span>
          </Link>

          {/* Expertise */}
          <Link
            href="/expert/expertise"
            className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] py-1 px-1.5 rounded-xl transition-all cursor-pointer ${
              isExpertise
                ? "text-[#2E7D32] font-bold"
                : "text-[#6B7280] hover:text-[#1F2937] font-medium"
            }`}
          >
            <div className={`p-1 rounded-full transition-colors ${isExpertise ? "bg-[#E8F5E9]" : ""}`}>
              <Sprout className="w-4 h-4" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">Expertise</span>
          </Link>

          {/* Documents */}
          <Link
            href="/expert/documents"
            className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] py-1 px-1.5 rounded-xl transition-all cursor-pointer ${
              isDocs
                ? "text-[#2E7D32] font-bold"
                : "text-[#6B7280] hover:text-[#1F2937] font-medium"
            }`}
          >
            <div className={`p-1 rounded-full transition-colors ${isDocs ? "bg-[#E8F5E9]" : ""}`}>
              <FileText className="w-4 h-4" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">Documents</span>
          </Link>

          {/* Drawer Menu */}
          <button
            type="button"
            onClick={handleOpenMenu}
            aria-label="Open mobile navigation menu"
            className="flex flex-col items-center justify-center min-w-[54px] min-h-[44px] py-1 px-1.5 rounded-xl text-[#4B5563] hover:text-[#1F2937] font-medium transition-all cursor-pointer active:scale-95"
          >
            <div className="p-1 rounded-full hover:bg-[#F1F5F2]">
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
  const weatherHref = isAuthenticated && user?.role === "ROLE_FARMER" ? "/farmer/weather" : "/#ai-analysis";

  return (
    <nav
      aria-label="Public Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] px-1 py-1 shadow-[0_-4px_20px_#E5E7EB] pb-[max(0.375rem,env(safe-area-inset-bottom))]"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Home */}
        <Link
          href="/"
          onClick={() => setActiveHash("")}
          className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] py-1 px-1.5 rounded-xl transition-all cursor-pointer ${
            isHome
              ? "text-[#2E7D32] font-bold"
              : "text-[#6B7280] hover:text-[#1F2937] font-medium"
          }`}
        >
          <div className={`p-1 rounded-full transition-colors ${isHome ? "bg-[#E8F5E9]" : ""}`}>
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
              ? "text-[#2E7D32] font-bold"
              : "text-[#6B7280] hover:text-[#1F2937] font-medium"
          }`}
        >
          <div className={`p-1 rounded-full transition-colors ${isAiActive ? "bg-[#E8F5E9]" : ""}`}>
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">AI Scan</span>
        </Link>

        {/* Weather */}
        <Link
          href={weatherHref}
          onClick={() => setActiveHash("#ai-analysis")}
          className="flex flex-col items-center justify-center min-w-[54px] min-h-[44px] py-1 px-1.5 rounded-xl text-[#6B7280] hover:text-[#1F2937] font-medium transition-all cursor-pointer"
        >
          <div className="p-1 rounded-full">
            <CloudSun className="w-4 h-4 text-[#F59E0B]0" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Weather</span>
        </Link>

        {/* Experts */}
        <Link
          href="/experts"
          className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] py-1 px-1.5 rounded-xl transition-all cursor-pointer ${
            isExpertsActive
              ? "text-[#2E7D32] font-bold"
              : "text-[#6B7280] hover:text-[#1F2937] font-medium"
          }`}
        >
          <div className={`p-1 rounded-full transition-colors ${isExpertsActive ? "bg-[#E8F5E9]" : ""}`}>
            <Users className="w-4 h-4" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Experts</span>
        </Link>

        {/* Menu Drawer Trigger */}
        <button
          type="button"
          onClick={handleOpenMenu}
          aria-label="Open mobile navigation menu"
          className="flex flex-col items-center justify-center min-w-[54px] min-h-[44px] py-1 px-1.5 rounded-xl text-[#4B5563] hover:text-[#1F2937] font-medium transition-all cursor-pointer active:scale-95"
        >
          <div className="p-1 rounded-full hover:bg-[#F1F5F2]">
            <Menu className="w-4 h-4" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Menu</span>
        </button>
      </div>
    </nav>
  );
}
