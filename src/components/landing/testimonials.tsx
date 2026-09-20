import React from "react";
import { sampleTestimonials } from "@/data/testimonials";
import { Quote } from "lucide-react";

export function Testimonials() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-[#F1F5F2] border-t border-[#E5E7EB]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#2E7D32] mb-2.5">
            Testimonials
          </p>
          <h2 className="text-2xl sm:text-3xl font-black text-[#1F2937] tracking-tight">
            Trusted by Farmers Across Nepal.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {sampleTestimonials.map((t, idx) => (
            <div
              key={idx}
              className="rounded-[22px] sm:rounded-[24px] border border-[#E5E7EB] bg-white p-5 sm:p-7 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE] hover:shadow-[0_8px_30px_-4px_#E5E7EB] transition-shadow relative space-y-3.5"
            >
              <Quote className="w-7 h-7 text-[#E8F5E9]" />
              <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="pt-2 border-t border-[#E5E7EB]">
                <p className="text-xs sm:text-sm font-bold text-[#1F2937]">{t.author}</p>
                <p className="text-[11px] sm:text-xs text-[#9CA3AF]">{t.crop} • {t.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
