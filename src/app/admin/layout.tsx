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
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
        <div className="flex min-h-screen">
          <AdminSidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <Navbar />
            <main className="mx-auto w-full max-w-[1500px] flex-1 px-3.5 py-4 sm:px-6 sm:py-6 lg:px-8 pb-20 md:pb-6">
              {children}
            </main>
          </div>
        </div>
        <AdminBottomNav />
      </div>
    </RoleGuard>
  );
}
