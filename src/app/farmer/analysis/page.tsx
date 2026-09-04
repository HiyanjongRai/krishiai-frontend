import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AnalysisCard } from "@/components/farmer/analysis-card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export default function FarmerAnalysisPage() {
  return (
    <DashboardLayout role="farmer">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black text-slate-900">AI Crop Analysis</h1>
          <Button><Upload className="w-4 h-4 mr-2" /> Upload New Photo</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AnalysisCard crop="Tomato" disease="Early Blight" confidence={82} date="Today" />
          <AnalysisCard crop="Potato" disease="Late Blight" confidence={78} date="Yesterday" />
        </div>
      </div>
    </DashboardLayout>
  );
}
