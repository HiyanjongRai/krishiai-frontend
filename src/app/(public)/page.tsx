import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { AISection } from "@/components/landing/ai-section";
import { ExpertSection } from "@/components/landing/expert-section";
import { Statistics } from "@/components/landing/statistics";
import { Testimonials } from "@/components/landing/testimonials";
import { CTA } from "@/components/landing/cta";
import { Footer } from "@/components/layout/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
        <AISection />
        <ExpertSection />
        <Statistics />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
