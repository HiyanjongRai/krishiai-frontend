import React from "react";
import { Card } from "@/components/ui/card";
import { Star, Check } from "lucide-react";
import Image from "next/image";

export function ExpertCard({ name, role, rating, avatarUrl }: { name: string; role: string; rating: number; avatarUrl: string }) {
  return (
    <Card className="flex items-center gap-4">
      <div className="relative w-14 h-14 rounded-full overflow-hidden border">
        <Image src={avatarUrl} alt={name} fill className="object-cover" />
      </div>
      <div className="space-y-0.5">
        <h4 className="font-bold text-slate-900 text-sm">{name}</h4>
        <p className="text-xs text-slate-500">{role}</p>
        <p className="text-xs font-semibold text-slate-700 flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400 text-amber-400" />{rating}</p>
      </div>
    </Card>
  );
}
