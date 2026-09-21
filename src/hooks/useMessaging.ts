"use client";

import { useMessagingContext } from '@/providers/messaging';

export function useMessaging() {
  return useMessagingContext();
}
