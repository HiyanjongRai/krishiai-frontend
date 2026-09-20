"use client";

import { useCallback, useEffect, useState } from "react";
import { Sprout } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CropCard } from "@/components/farmer/crop-card";
import { masterDataService } from "@/services/master-data";
import type { CropResponse } from "@/types/master-data";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { DashboardSkeleton } from "@/components/ui/page-skeletons";
import { normalizeApiError } from "@/utils/api-response";

export default function CropsPage() {
  const [crops, setCrops] = useState<CropResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCrops = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const page = await masterDataService.getCrops({ size: 100 });
      setCrops(page.content ?? []);
    } catch (requestError) {
      setError(normalizeApiError(requestError, "Unable to load crops.").message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadCrops(), 0);
    return () => window.clearTimeout(timer);
  }, [loadCrops]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto px-4 py-16 space-y-8">
        <h1 className="text-3xl font-extrabold text-[#1F2937]">Supported Crops</h1>
        {isLoading ? (
          <DashboardSkeleton cards={3} table={false} />
        ) : error ? (
          <ErrorState title="Unable to load crops" message={error} onRetry={loadCrops} isRetrying={isLoading} />
        ) : crops.length === 0 ? (
          <EmptyState
            title="No crops available"
            description="The crop catalog is empty right now. Please check back later."
            icon={<Sprout className="h-6 w-6" aria-hidden="true" />}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {crops.map((c) => (
              <CropCard
                key={c.id}
                name={c.name}
                variety={c.categoryName ?? "Crop"}
                stage={c.active ? "Active" : "Inactive"}
                health="HEALTHY"
                imageUrl={c.imageUrl}
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
