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
    <section id="experts" className="py-20 sm:py-24 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          <div className="lg:col-span-4 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/90 text-emerald-800 text-xs font-semibold tracking-wide">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>EXPERT SUPPORT</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              When You Need More <br />
              Than AI, Talk to an Expert.
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              AI can help you understand possible crop problems, but some situations
              require professional judgment. KrishiAI helps farmers connect with
              verified agricultural experts.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/experts"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#0f3d26] hover:bg-[#14532d] rounded-xl transition-all shadow-md hover:shadow-lg group cursor-pointer"
              >
                <span>Find an Expert</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/expert-register"
                className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-xl transition-all cursor-pointer"
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
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center space-y-3 group hover:border-emerald-200"
                  >
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-emerald-100 ring-4 ring-slate-50 group-hover:scale-105 transition-transform">
                      <Image
                        src={exp.avatar}
                        alt={exp.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>

                    <div className="space-y-0.5">
                      <h4 className="text-sm font-bold text-slate-900">
                        {exp.name}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        {exp.role}
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200/80 text-[11px] font-medium text-slate-700">
                      <CatIcon className="w-3 h-3 text-emerald-600" />
                      <span>{exp.category}</span>
                    </div>

                    <div className="w-full pt-2 border-t border-slate-100 space-y-1 text-xs">
                      <div className="flex items-center justify-center gap-1 font-semibold text-slate-800">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{exp.rating}</span>
                        <span className="text-slate-400 font-normal">({exp.reviews})</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {exp.experience}
                      </p>
                      
                      <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-emerald-700 pt-0.5">
                        <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                        <span>Verified</span>
                      </div>
                    </div>

                    <div className="pt-2 w-full">
                      <Link
                        href={`/experts/${exp.id}`}
                        className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center justify-center gap-1 transition-colors"
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
