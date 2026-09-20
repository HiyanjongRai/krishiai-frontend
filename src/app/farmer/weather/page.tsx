import React from "react";
import { FarmerWeatherPageView } from "@/components/farmer/FarmerWeatherPageView";

export const metadata = {
  title: "Weather & Microclimate Intelligence | KrishiAI",
  description:
    "Real-time GPS local weather forecasting, microclimate metrics, field operation feasibility matrix, and AI-driven agricultural advisories for farmers.",
};

export default function FarmerWeatherPage() {
  return <FarmerWeatherPageView />;
}
