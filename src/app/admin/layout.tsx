import React from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminBottomNav } from "@/components/admin/admin-bottom-nav";
import { Navbar } from "@/components/shared/layout/navbar";
import { RoleGuard } from "@/components/auth/RoleGuard";

export const metadata = {
  title: "Admin Dashboard | KrishiAI",
  description: "KrishiAI Unified Platform Administration and Expert Verification Dashboard",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["ROLE_ADMIN"]}>
      <div className="min-h-screen bg-[#F1F5F2] text-[#1F2937] font-sans antialiased">
        {/* Persistent Top Navbar */}
        <Navbar />

        {/* Main Container: Slim Floating Sidebar + Content */}
        <div className="w-full max-w-[1720px] mx-auto px-3 sm:px-5 lg:px-6 xl:px-8 py-4 sm:py-5 pb-24 lg:pb-8">
          <div className="flex gap-4 sm:gap-5 items-start">
            {/* Slim Icon Rail Sidebar */}
            <AdminSidebar />

            {/* Dynamic Page Content */}
            <main className="flex-1 min-w-0">{children}</main>
          </div>
        </div>

        {/* Mobile & Tablet Bottom Navigation */}
        <AdminBottomNav />
      </div>
    </RoleGuard>
  );
}
