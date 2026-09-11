import React from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
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
      <div className="min-h-screen bg-[#F4F4F6] text-[#171717] font-sans antialiased">
        <div className="flex min-h-screen">
          <AdminSidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <Navbar />
            <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">{children}</main>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
