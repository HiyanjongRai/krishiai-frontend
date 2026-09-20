import React from "react";
import { Bot, Image as ImageIcon, Loader2 } from "lucide-react";

interface AIProcessingStateProps {
  title?: string;
  steps?: string[];
  imagePreviewUrl?: string | null;
}

export function AIProcessingState({
  title = "Analyzing your crop",
  steps = ["Checking visible symptoms", "Comparing crop patterns", "Preparing recommendations"],
  imagePreviewUrl,
}: AIProcessingStateProps) {
  return (
    <div className="rounded-2xl border border-[#C7D2FE] bg-[#EEF2FF] p-5 text-[#3730A3]" role="status" aria-live="polite">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex h-28 w-full items-center justify-center overflow-hidden rounded-2xl border border-[#C7D2FE] bg-white sm:w-36">
          {imagePreviewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imagePreviewUrl} alt="Crop selected for analysis" className="h-full w-full object-cover" />
          ) : (
            <ImageIcon className="h-8 w-8 text-[#4F46E5]" aria-hidden="true" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" aria-hidden="true" />
            <h3 className="text-sm font-bold">{title}</h3>
          </div>
          <div className="mt-3 space-y-2">
            {steps.map((step) => (
              <div key={step} className="flex items-center gap-2 text-xs font-medium">
                <Loader2 className="h-3.5 w-3.5 animate-spin motion-reduce:animate-none" aria-hidden="true" />
                <span>{step}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-[#4338CA]">Please wait. Do not close this page while processing.</p>
        </div>
      </div>
    </div>
  );
}
