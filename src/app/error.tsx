"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
      <h2 className="text-2xl font-bold text-slate-900">Something went wrong!</h2>
      <p className="text-sm text-slate-500 max-w-md">An unexpected error occurred while loading this page.</p>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
