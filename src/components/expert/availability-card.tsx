import React from "react";
import { Card } from "@/components/ui/card";

export function AvailabilityCard({ day, timeSlots }: { day: string; timeSlots: string[] }) {
  return (
    <Card className="space-y-2">
      <h4 className="font-bold text-[#1F2937] text-sm">{day}</h4>
      <div className="flex flex-wrap gap-1.5">
        {timeSlots.map((slot, i) => (
          <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-[#F1F5F2] text-[#4B5563]">{slot}</span>
        ))}
      </div>
    </Card>
  );
}
