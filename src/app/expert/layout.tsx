import React from "react";
import { Navbar } from "@/components/shared/layout/navbar";
import { ExpertSidebar } from "@/components/expert/ExpertSidebar";
import { MobileBottomNav } from "@/components/shared/layout/mobile-bottom-nav";
import { RoleGuard, ExpertVerificationGuard } from "@/components/auth/RoleGuard";

export const metadata = {
  title: "Expert Dashboard | KrishiAI",
  description: "KrishiAI Expert Diagnostic Portal & Farmer Advisory Workspace",
};

export default function ExpertLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["ROLE_EXPERT"]}>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
        <div className="flex min-h-screen">
          <ExpertSidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <Navbar />
            <main className="mx-auto w-full max-w-[1500px] flex-1 px-3.5 py-4 sm:px-6 sm:py-6 lg:px-8 pb-24 lg:pb-8">
              <ExpertVerificationGuard>
                {children}
              </ExpertVerificationGuard>
            </main>
          </div>
        </div>

        {/* Mobile & Tablet Bottom Navigation */}
        <MobileBottomNav />
      </div>
    </RoleGuard>
  );
}
