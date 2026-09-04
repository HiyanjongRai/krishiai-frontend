import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function ConsultationCard({ farmer, crop, status, time }: { farmer: string; crop: string; status: "PENDING" | "SCHEDULED" | "COMPLETED"; time: string }) {
  return (
    <Card className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-slate-900 text-sm">{farmer}</h4>
        <Badge variant={status === "COMPLETED" ? "success" : "warning"}>{status}</Badge>
      </div>
      <p className="text-xs text-slate-500">Crop Inquiry: {crop} • {time}</p>
      <div className="flex gap-2 pt-1">
        <Button size="sm" variant="secondary">View Details</Button>
      </div>
    </Card>
  );
}
