import React from "react";
import { sampleTestimonials } from "@/data/testimonials";
import { Quote } from "lucide-react";

export function Testimonials() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-[#F4F4F6] border-t border-[rgba(234,234,236,0.85)]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#0F9F68] mb-2.5">
            Testimonials
          </p>
          <h2 className="text-2xl sm:text-3xl font-black text-[#171717] tracking-tight">
            Trusted by Farmers Across Nepal.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {sampleTestimonials.map((t, idx) => (
            <div
              key={idx}
              className="rounded-[22px] sm:rounded-[24px] border border-[rgba(234,234,236,0.85)] bg-white p-5 sm:p-7 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04),0_2px_6px_-1px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.07)] transition-shadow relative space-y-3.5"
            >
              <Quote className="w-7 h-7 text-[#DDF4EA]" />
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="pt-2 border-t border-[rgba(234,234,236,0.85)]">
                <p className="text-xs sm:text-sm font-bold text-[#171717]">{t.author}</p>
                <p className="text-[11px] sm:text-xs text-gray-400">{t.crop} • {t.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
