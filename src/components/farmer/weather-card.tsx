import React from "react";
import { Card } from "@/components/ui/card";
import { Sun, CloudRain } from "lucide-react";

export function WeatherCard({ city, temp, condition, humidity }: { city: string; temp: string; condition: string; humidity: string }) {
  return (
    <Card className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500">{city}</p>
          <p className="text-2xl font-black text-slate-900">{temp}</p>
        </div>
        <Sun className="w-8 h-8 text-amber-500" />
      </div>
      <p className="text-xs text-slate-600">{condition} • Humidity: {humidity}</p>
    </Card>
  );
}
