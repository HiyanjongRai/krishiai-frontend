import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/providers/auth-provider";
import { AuthModalProvider } from "@/providers/auth-modal-provider";
import { AuthModal } from "@/components/auth/auth-modal";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "KrishiAI — Smarter Farming Starts with Better Insights",
  description:
    "KrishiAI helps farmers understand crop health, weather conditions, and farming challenges using AI-powered analysis, personalized recommendations, and verified experts.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jakarta.variable} scroll-smooth`}>
      <body className="min-h-screen bg-white text-slate-900 flex flex-col font-sans antialiased">
        <AuthProvider>
          <AuthModalProvider>
            {children}
            <AuthModal />
          </AuthModalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
