import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DashboardCard } from "@/components/farmer/dashboard-card";
import { WeatherCard } from "@/components/farmer/weather-card";
import { Sprout, AlertTriangle, Scan, Calendar } from "lucide-react";

export default function FarmerDashboard() {
  return (
    <DashboardLayout role="farmer">
      <div className="space-y-6">
        <h1 className="text-2xl font-black text-slate-900">Farmer Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard title="Active Crops" value="8" subtitle="Across 2 farms" icon={<Sprout className="w-6 h-6" />} />
          <DashboardCard title="Health Alerts" value="2" subtitle="Requires attention" icon={<AlertTriangle className="w-6 h-6 text-amber-600" />} />
          <DashboardCard title="AI Scans" value="14" subtitle="This month" icon={<Scan className="w-6 h-6" />} />
          <DashboardCard title="Next Consultation" value="Tomorrow" subtitle="Dr. Sita Karki" icon={<Calendar className="w-6 h-6" />} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <WeatherCard city="Kathmandu, Nepal" temp="24°C" condition="Sunny" humidity="58%" />
        </div>
      </div>
    </DashboardLayout>
  );
}
