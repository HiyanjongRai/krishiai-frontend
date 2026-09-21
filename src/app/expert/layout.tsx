import React from "react";
import { Navbar } from "@/components/shared/layout/navbar";
import { ExpertSidebar } from "@/components/expert/ExpertSidebar";
import { MobileBottomNav } from "@/components/shared/layout/mobile-bottom-nav";
import { RoleGuard, ExpertVerificationGuard } from "@/components/auth/RoleGuard";
import { MessagingProvider } from "@/providers/messaging";

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
      <MessagingProvider>
        <div className="min-h-screen bg-[#F1F5F2] text-[#1F2937] font-sans antialiased">
          {/* Persistent Top Navbar */}
          <Navbar />

          {/* Main Container: Slim Floating Sidebar + Content */}
          <div className="w-full max-w-[1720px] mx-auto px-3 sm:px-5 lg:px-6 xl:px-8 py-4 sm:py-5 pb-24 lg:pb-8">
            <div className="flex gap-4 sm:gap-5 items-start">
              {/* Slim Icon Rail Sidebar */}
              <ExpertSidebar />

              {/* Dynamic Page Content */}
              <main className="flex-1 min-w-0">
                <ExpertVerificationGuard>
                  {children}
                </ExpertVerificationGuard>
              </main>
            </div>
          </div>

          {/* Mobile & Tablet Bottom Navigation */}
          <MobileBottomNav />
        </div>
      </MessagingProvider>
    </RoleGuard>
  );
}

