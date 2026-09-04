import React from "react";
import { Card } from "@/components/ui/card";
import { MapPin, Sprout } from "lucide-react";

export function FarmCard({ name, location, area, cropsCount }: { name: string; location: string; area: number; cropsCount: number }) {
  return (
    <Card className="space-y-3">
      <div className="flex items-start justify-between">
        <h4 className="font-bold text-slate-900 text-base">{name}</h4>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">{cropsCount} Crops</span>
      </div>
      <div className="text-xs text-slate-500 space-y-1">
        <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-emerald-600" />{location}</p>
        <p className="flex items-center gap-1.5"><Sprout className="w-3.5 h-3.5 text-emerald-600" />{area} Hectares</p>
      </div>
    </Card>
  );
}
