import React from "react";
import { Star, CheckCircle2, ArrowRight, ShieldCheck, MapPin, Award } from "lucide-react";
import Image from "next/image";

interface ExpertCardProps {
  name: string;
  role: string;
  rating?: number;
  avatarUrl?: string;
  organization?: string;
  specialties?: string[];
  experienceYears?: number;
  verified?: boolean;
}

export function ExpertCard({
  name,
  role,
  rating = 0,
  avatarUrl = "",
  organization,
  specialties,
  experienceYears,
  verified = true,
}: ExpertCardProps) {
  const defaultSpecialties = ["Plant Health", "Soil Nutrition", "Crop Advisory"];
  const displaySpecialties = specialties && specialties.length > 0 ? specialties : defaultSpecialties;

  return (
    <div className="group rounded-[24px] border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-[0_4px_20px_-2px_#EEF0EE,0_2px_6px_-1px_#EEF0EE] hover:shadow-[0_8px_30px_-4px_#E8F5E9] hover:border-[#A5D6A7] transition-all duration-300 flex flex-col justify-between h-full cursor-pointer">
      <div className="space-y-4">
        {/* Top Header: Avatar + Verification + Rating */}
        <div className="flex items-start justify-between gap-3">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#E8F5E9] bg-[#F1F5F2] relative shadow-xs">
              {avatarUrl ? (
                <Image src={avatarUrl} alt={name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-lg font-black text-[#2E7D32]">
                  {name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            {verified && (
              <span
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#2E7D32] text-white border-2 border-white flex items-center justify-center shadow-xs"
                title="Verified Agricultural Specialist"
              >
                <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
              </span>
            )}
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-[10px] font-bold border border-[#C8E6C9]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] animate-pulse" />
              Available for Chat
            </span>
            <div className="flex items-center gap-1 text-xs font-bold text-[#D97706] bg-[#FEF3C7]/60 px-2 py-0.5 rounded-md">
              <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
              <span>{rating > 0 ? rating.toFixed(1) : "5.0 (New)"}</span>
            </div>
          </div>
        </div>

        {/* Name & Title */}
        <div>
          <h4 className="text-base font-black text-[#1F2937] group-hover:text-[#2E7D32] transition-colors line-clamp-1">
            {name}
          </h4>
          <p className="text-xs font-bold text-[#2E7D32] mt-0.5">{role}</p>
          {organization && (
            <p className="text-[11px] text-[#6B7280] font-medium truncate mt-0.5">
              {organization}
            </p>
          )}
        </div>

        {/* Specialization Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {displaySpecialties.slice(0, 3).map((spec, i) => (
            <span
              key={i}
              className="text-[10px] font-semibold text-[#4B5563] bg-[#F8FAF8] border border-[#EEF0EE] px-2.5 py-1 rounded-lg"
            >
              {spec}
            </span>
          ))}
        </div>
      </div>

      {/* Card Footer Action */}
      <div className="pt-4 mt-4 border-t border-[#F3F4F6] flex items-center justify-between">
        <span className="text-[11px] font-bold text-[#6B7280] flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D32]" />
          <span>Certified Advisor</span>
        </span>

        <span className="text-xs font-bold text-[#2E7D32] group-hover:translate-x-1 transition-transform flex items-center gap-1">
          <span>Consult Specialist</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
}
