import React from "react";
import Image from "next/image";
import Link from "next/link";
import { UserCheck, Star, Check, ArrowRight, Sprout, Shield, Layers } from "lucide-react";

export function ExpertSection() {
  const experts = [
    {
      id: "1",
      name: "Dr. Anil Sharma",
      role: "Agronomist",
      category: "Vegetable Crops",
      catIcon: Sprout,
      rating: "4.8",
      reviews: "124",
      experience: "8+ Years Experience",
      avatar: "/images/experts/expert-anil.jpg",
    },
    {
      id: "2",
      name: "Dr. Sita Karki",
      role: "Plant Pathologist",
      category: "Crop Protection",
      catIcon: Shield,
      rating: "4.7",
      reviews: "98",
      experience: "6+ Years Experience",
      avatar: "/images/experts/expert-sita.jpg",
    },
    {
      id: "3",
      name: "Er. Dinesh Rai",
      role: "Soil Specialist",
      category: "Soil & Fertility",
      catIcon: Layers,
      rating: "4.6",
      reviews: "76",
      experience: "10+ Years Experience",
      avatar: "/images/experts/expert-dinesh.jpg",
    },
  ];

  return (
    <section id="experts" className="py-20 sm:py-24 bg-white border-t border-[rgba(234,234,236,0.85)]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">

          <div className="lg:col-span-4 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DDF4EA] border border-[#BCE9D5] text-[#0F9F68] text-xs font-bold tracking-wide">
              <UserCheck className="w-3.5 h-3.5" />
              <span>EXPERT SUPPORT</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-[#171717] tracking-tight leading-tight">
              When You Need More <br />
              Than AI, Talk to an Expert.
            </h2>

            <p className="text-sm text-gray-500 leading-relaxed">
              AI can help you understand possible crop problems, but some situations
              require professional judgment. KrishiAI helps farmers connect with
              verified agricultural experts.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/experts"
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-bold text-white bg-[#0F9F68] hover:bg-[#0D8A5A] rounded-full transition-all shadow-[0_4px_12px_rgba(15,159,104,0.3)] group cursor-pointer"
              >
                <span>Find an Expert</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/expert-register"
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-bold text-[#0F9F68] bg-[#DDF4EA] hover:bg-[#cbf1e1] border border-[#BCE9D5] rounded-full transition-all cursor-pointer"
              >
                <span>Join as Expert</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {experts.map((exp) => {
                const CatIcon = exp.catIcon;
                return (
                  <div
                    key={exp.id}
                    className="rounded-[24px] border border-[rgba(234,234,236,0.85)] bg-white p-5 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04),0_2px_6px_-1px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.07)] hover:border-[#BCE9D5] transition-all flex flex-col items-center text-center space-y-3 group"
                  >
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[rgba(234,234,236,0.85)] ring-4 ring-[#F4F4F6] group-hover:ring-[#DDF4EA] transition-all">
                      <Image
                        src={exp.avatar}
                        alt={exp.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>

                    <div className="space-y-0.5">
                      <h4 className="text-sm font-bold text-[#171717]">
                        {exp.name}
                      </h4>
                      <p className="text-xs text-gray-400 font-medium">
                        {exp.role}
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#DDF4EA] border border-[#BCE9D5] text-[11px] font-bold text-[#0F9F68]">
                      <CatIcon className="w-3 h-3" />
                      <span>{exp.category}</span>
                    </div>

                    <div className="w-full pt-2 border-t border-[rgba(234,234,236,0.85)] space-y-1 text-xs">
                      <div className="flex items-center justify-center gap-1 font-bold text-[#171717]">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{exp.rating}</span>
                        <span className="text-gray-400 font-normal">({exp.reviews})</span>
                      </div>
                      <p className="text-[11px] text-gray-400">
                        {exp.experience}
                      </p>

                      <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-[#0F9F68] pt-0.5">
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>Verified</span>
                      </div>
                    </div>

                    <div className="pt-2 w-full">
                      <Link
                        href={`/experts/${exp.id}`}
                        className="text-xs font-bold text-[#0F9F68] hover:text-[#0D8A5A] flex items-center justify-center gap-1 transition-colors"
                      >
                        <span>View Expert</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
