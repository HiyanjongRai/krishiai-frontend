import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
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
      <div className="min-h-screen bg-[#F8FAF6] text-[#17201A] font-sans antialiased">
        {/* Persistent Unified Navbar */}
        <Navbar />

        {/* Main Container: Fixed Sidebar + Dynamic Content */}
        <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex gap-5 lg:gap-6 items-start">
            {/* Persistent Admin Sidebar */}
            <AdminSidebar />

            {/* Dynamic Admin Page Content */}
            <main className="flex-1 min-w-0">{children}</main>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
