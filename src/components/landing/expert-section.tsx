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
    <section id="experts" className="py-14 sm:py-20 lg:py-24 bg-white border-t border-[#E5E7EB]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

          <div className="lg:col-span-4 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F5E9] border border-[#C8E6C9] text-[#2E7D32] text-xs font-bold tracking-wide">
              <UserCheck className="w-3.5 h-3.5" />
              <span>EXPERT SUPPORT</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1F2937] tracking-tight leading-tight">
              When You Need More <br />
              Than AI, Talk to an Expert.
            </h2>

            <p className="text-sm text-[#6B7280] leading-relaxed">
              AI can help you understand possible crop problems, but some situations
              require professional judgment. KrishiAI helps farmers connect with
              verified agricultural experts.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                href="/experts"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold text-white bg-[#2E7D32] hover:bg-[#256B2A] rounded-full transition-all shadow-[0_4px_12px_#E5E7EB] group cursor-pointer min-h-[44px] active:scale-98 text-center"
              >
                <span>Find an Expert</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/expert-register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold text-[#2E7D32] bg-[#E8F5E9] hover:bg-[#E8F5E9] border border-[#C8E6C9] rounded-full transition-all cursor-pointer min-h-[44px] active:scale-98 text-center"
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
                    className="relative rounded-3xl border border-gray-200/90 bg-white overflow-hidden p-5 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col items-center text-center space-y-3 group"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2E7D32] via-[#43A047] to-[#81C784]" />

                    <div className="relative mt-2 w-20 h-20 rounded-full overflow-hidden border-2 border-emerald-100 ring-4 ring-emerald-50 group-hover:ring-emerald-100 transition-all">
                      <Image
                        src={exp.avatar}
                        alt={exp.name}
                        fill
                        sizes="80px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="space-y-0.5">
                      <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#1B5E20] transition-colors">
                        {exp.name}
                      </h4>
                      <p className="text-xs text-gray-500 font-medium">
                        {exp.role}
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-[#1B5E20]">
                      <CatIcon className="w-3 h-3 text-[#2E7D32]" />
                      <span>{exp.category}</span>
                    </div>

                    <div className="w-full pt-2.5 border-t border-gray-100 space-y-1 text-xs">
                      <div className="flex items-center justify-center gap-1 font-bold text-gray-800">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        <span>{exp.rating}</span>
                        <span className="text-gray-400 font-normal">({exp.reviews})</span>
                      </div>
                      <p className="text-[11px] text-gray-500">
                        {exp.experience}
                      </p>

                      <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-[#2E7D32] pt-0.5">
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>Verified Specialist</span>
                      </div>
                    </div>

                    <div className="pt-2 w-full">
                      <Link
                        href={`/experts/${exp.id}`}
                        className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-gray-50 hover:bg-[#2E7D32] text-xs font-bold text-gray-700 hover:text-white border border-gray-200 hover:border-[#2E7D32] transition-all shadow-2xs group-hover:border-emerald-300"
                      >
                        <span>View Profile</span>
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
