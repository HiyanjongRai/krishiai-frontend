import React from "react";
import { Card } from "@/components/ui/card";

export function ReviewCard({ crop, farmerIssue, aiPrediction }: { crop: string; farmerIssue: string; aiPrediction: string }) {
  return (
    <Card className="space-y-2">
      <h4 className="font-bold text-slate-900 text-sm">Review AI Diagnostic: {crop}</h4>
      <p className="text-xs text-slate-600">Farmer Observation: {farmerIssue}</p>
      <p className="text-xs text-emerald-800 font-semibold">AI Prediction: {aiPrediction}</p>
    </Card>
  );
}
