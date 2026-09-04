import React from "react";
import { sampleTestimonials } from "@/data/testimonials";
import { Quote } from "lucide-react";

export function Testimonials() {
  return (
    <section className="py-16 sm:py-20 bg-[#fafcf9] border-t border-slate-100">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Trusted by Farmers Across Nepal.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sampleTestimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs relative space-y-4"
            >
              <Quote className="w-8 h-8 text-emerald-500/30" />
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed italic">
                "{t.quote}"
              </p>
              <div className="pt-2 border-t border-slate-100">
                <p className="text-sm font-bold text-slate-900">{t.author}</p>
                <p className="text-xs text-slate-500">{t.crop} • {t.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
