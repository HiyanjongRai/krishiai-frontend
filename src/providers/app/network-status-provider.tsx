"use client";

import React, { useEffect, useRef } from "react";
import { useToast } from "@/providers/toast-provider";

export function NetworkStatusProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const wasOffline = useRef(false);

  useEffect(() => {
    const handleOffline = () => {
      if (wasOffline.current) return;
      wasOffline.current = true;
      toast.warning({
        title: "Connection lost",
        description: "You're currently offline. Some features may not work until your connection is restored.",
        duration: 8000,
      });
    };

    const handleOnline = () => {
      if (!wasOffline.current) return;
      wasOffline.current = false;
      toast.success({
        title: "You're back online",
        description: "Your connection has been restored.",
      });
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      handleOffline();
    }

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [toast]);

  return <>{children}</>;
}
