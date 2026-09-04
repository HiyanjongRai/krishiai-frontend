import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { FarmerSidebar } from "@/components/farmer/FarmerSidebar";

export default function FarmerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8FAF6] text-[#17201A] font-sans antialiased">
      {/* Persistent Unified Navbar */}
      <Navbar />

      {/* Main Container: Fixed Sidebar + Dynamic Content */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-5 lg:gap-6 items-start">
          {/* Persistent Sidebar (stays in identical position on every route) */}
          <FarmerSidebar />

          {/* Dynamic Page Content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
