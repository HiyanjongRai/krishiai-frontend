import React from "react";
import { FarmerDashboardView } from "@/components/farmer/FarmerDashboardView";

export const metadata = {
  title: "Farmer Dashboard | KrishiAI",
  description:
    "Intelligent farm management dashboard featuring smart farm card, crop health rate, soil moisture analytics, and recent advisories.",
};

export default function FarmerDashboard() {
  return <FarmerDashboardView />;
}

