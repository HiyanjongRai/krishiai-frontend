import React from "react";
import { ExpertApplicationProvider } from "@/providers/expert-application-provider";
import { ApplicationStatusView } from "@/components/expert-register/ApplicationStatusView";

export const metadata = {
  title: "Expert Application Status | KrishiAI",
  description:
    "Track the real-time status of your KrishiAI Expert Registration and document verification.",
};

export default function ExpertApplicationStatusPage() {
  return (
    <ExpertApplicationProvider>
      <ApplicationStatusView />
    </ExpertApplicationProvider>
  );
}
