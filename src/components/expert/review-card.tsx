import React from "react";
import { Card } from "@/components/ui/card";

export function ReviewCard({ crop, farmerIssue, aiPrediction }: { crop: string; farmerIssue: string; aiPrediction: string }) {
  return (
    <Card className="space-y-2">
      <h4 className="font-bold text-[#1F2937] text-sm">Review AI Diagnostic: {crop}</h4>
      <p className="text-xs text-[#4B5563]">Farmer Observation: {farmerIssue}</p>
      <p className="text-xs text-[#1B5E20] font-semibold">AI Prediction: {aiPrediction}</p>
    </Card>
  );
}
