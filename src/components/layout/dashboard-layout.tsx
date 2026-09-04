import React from "react";
import { Sidebar } from "./sidebar";

export function DashboardLayout({
  children,
  role = "farmer",
}: {
  children: React.ReactNode;
  role?: "farmer" | "expert" | "admin";
}) {
  return (
    <div className="min-h-screen flex bg-[#f8faf7]">
      <Sidebar role={role} />
      <main className="flex-1 p-6 sm:p-8 lg:p-10">{children}</main>
    </div>
  );
}
