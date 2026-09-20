import React from "react";
import { Card } from "@/components/ui/card";
import { MapPin, Sprout } from "lucide-react";

export function FarmCard({ name, location, area, cropsCount }: { name: string; location: string; area: number; cropsCount: number }) {
  return (
    <Card className="space-y-3">
      <div className="flex items-start justify-between">
        <h4 className="font-bold text-[#1F2937] text-base">{name}</h4>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#E8F5E9] text-[#1B5E20] border border-[#A5D6A7]">{cropsCount} Crops</span>
      </div>
      <div className="text-xs text-[#6B7280] space-y-1">
        <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#2E7D32]" />{location}</p>
        <p className="flex items-center gap-1.5"><Sprout className="w-3.5 h-3.5 text-[#2E7D32]" />{area} Hectares</p>
      </div>
    </Card>
  );
}
