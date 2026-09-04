import React from "react";
import { ExpertApplicationProvider } from "@/providers/expert-application-provider";
import { ExpertRegistrationWizard } from "@/components/expert-register/ExpertRegistrationWizard";

export const metadata = {
  title: "Expert Registration & Verification | KrishiAI",
  description:
    "Join KrishiAI's trusted network of verified agronomists, plant pathologists, and agricultural scientists. Multi-step registration and credential verification.",
};

export default function ExpertRegisterPage() {
  return (
    <ExpertApplicationProvider>
      <ExpertRegistrationWizard />
    </ExpertApplicationProvider>
  );
}
