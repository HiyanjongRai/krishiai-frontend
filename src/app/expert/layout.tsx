import React from "react";
import { Navbar } from "@/components/shared/layout/navbar";
import { ExpertSidebar } from "@/components/expert/ExpertSidebar";
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
      <div className="min-h-screen bg-[#F4F4F6] text-[#171717] font-sans antialiased">
        {/* Persistent Unified Navbar */}
        <Navbar />

        {/* Main Container: Fixed Sidebar + Dynamic Content */}
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex gap-5 lg:gap-6 items-start">
            {/* Expert Sidebar */}
            <ExpertSidebar />

            {/* Dynamic Expert Page Content */}
            <main className="flex-1 min-w-0">
              <ExpertVerificationGuard>
                {children}
              </ExpertVerificationGuard>
            </main>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
