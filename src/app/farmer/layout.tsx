import React from "react";
import { Navbar } from "@/components/shared/layout/navbar";
import { FarmerSidebar } from "@/components/farmer/FarmerSidebar";
import { RoleGuard } from "@/components/auth/RoleGuard";

export default function FarmerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["ROLE_FARMER"]}>
      <div className="min-h-screen bg-[#F4F4F6] text-[#171717] font-sans antialiased">
        {/* Persistent Top Navbar */}
        <Navbar />

        {/* Main Container: Slim Floating Sidebar + Content */}
        <div className="max-w-[1600px] mx-auto px-3 sm:px-5 lg:px-7 py-4 sm:py-5">
          <div className="flex gap-4 sm:gap-5 items-start">
            {/* Slim Icon Rail Sidebar */}
            <FarmerSidebar />

            {/* Dynamic Page Content */}
            <main className="flex-1 min-w-0">{children}</main>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
