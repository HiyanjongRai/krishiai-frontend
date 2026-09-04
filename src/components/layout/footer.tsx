"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sprout, Send } from "lucide-react";
import { useAuthModal } from "@/providers/auth-modal-provider";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { openLogin, openRegister } = useAuthModal();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-[#081d13] text-slate-300 border-t border-emerald-950 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-12 border-b border-emerald-900/60">
          
          {/* Brand Col */}
          <div className="lg:col-span-3 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Krishi<span className="text-emerald-400">AI</span>
              </span>
            </Link>

            <div className="text-xs sm:text-sm text-emerald-100/70 space-y-0.5 leading-relaxed font-medium">
              <p>Smarter Farming.</p>
              <p>Healthier Crops.</p>
              <p>Better Decisions.</p>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a href="#" aria-label="Facebook" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-emerald-600/30 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                </svg>
              </a>
              <a href="#" aria-label="Instagram" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-emerald-600/30 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors">
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a href="#" aria-label="YouTube" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-emerald-600/30 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links: Product */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Product</h4>
            <ul className="space-y-2 text-xs font-medium text-emerald-100/70">
              <li><Link href="/#ai-analysis" className="hover:text-white transition-colors">AI Crop Analysis</Link></li>
              <li><Link href="/#features" className="hover:text-white transition-colors">AI Advisor</Link></li>
              <li><Link href="/#features" className="hover:text-white transition-colors">Weather</Link></li>
              <li><Link href="/experts" className="hover:text-white transition-colors">Experts</Link></li>
            </ul>
          </div>

          {/* Links: Resources */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2 text-xs font-medium text-emerald-100/70">
              <li><Link href="/#how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="/knowledge" className="hover:text-white transition-colors">Agricultural Knowledge</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">FAQs</Link></li>
            </ul>
          </div>

          {/* Links: Company */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 text-xs font-medium text-emerald-100/70">
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
            </ul>
          </div>

          {/* Links: Account */}
          <div className="lg:col-span-1 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Account</h4>
            <ul className="space-y-2 text-xs font-medium text-emerald-100/70">
              <li>
                <button
                  type="button"
                  onClick={openLogin}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Login
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={openRegister}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Register
                </button>
              </li>
              <li>
                <Link
                  href="/expert-register"
                  className="hover:text-white transition-colors cursor-pointer text-left block"
                >
                  Expert Registration
                </Link>
              </li>
            </ul>
          </div>

          {/* Stay Updated */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Stay Updated</h4>
            <p className="text-xs text-emerald-100/70 leading-relaxed">
              Get the latest agricultural insights and updates.
            </p>

            {subscribed ? (
              <p className="text-xs text-emerald-400 font-semibold py-2">✓ Thank you for subscribing!</p>
            ) : (
              <form onSubmit={handleSubmit} className="relative flex items-center pt-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full py-2.5 pl-3.5 pr-11 text-xs bg-white/5 border border-white/15 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-emerald-400 transition-all"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="absolute right-1.5 p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-100/50 gap-4">
          <p>© 2026 KrishiAI. All rights reserved.</p>
          <p className="flex items-center gap-1 text-emerald-100/70">
            Built for smarter agriculture. <span className="text-emerald-400">🌱</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
