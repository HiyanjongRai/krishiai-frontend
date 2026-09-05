import React from "react";
import { Navbar } from "./navbar";
import { FarmerSidebar } from "@/components/farmer/FarmerSidebar";

export function DashboardLayout({
  children,
  role = "farmer",
}: {
  children: React.ReactNode;
  role?: "farmer" | "expert" | "admin";
}) {
  // Farmer, Admin, and Expert routes are wrapped by their respective layout.tsx
  if (role === "farmer" || role === "admin" || role === "expert") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#F8FAF6] text-[#17201A] font-sans antialiased">
      <Navbar />
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-5 lg:gap-6 items-start">
          <FarmerSidebar />
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
