"use client";

import { useCallback, useEffect, useState } from "react";
import type { WeatherData, WeatherErrorDetails } from "./types";
import { fetchWeatherData, getBrowserPosition } from "./weatherService";

export interface UseWeatherResult {
  data: WeatherData | null;
  loading: boolean;
  loadingMsg: string;
  refreshing: boolean;
  error: WeatherErrorDetails | null;
  loadWeather: (force?: boolean) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useWeather(autoFetch = true): UseWeatherResult {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMsg, setLoadingMsg] = useState("Detecting your farm location...");
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<WeatherErrorDetails | null>(null);

  const loadWeather = useCallback(async (force = false) => {
    if (force) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      setLoadingMsg("Requesting GPS coordinates...");
      const coords = await getBrowserPosition();

      setLoadingMsg("Fetching local weather & forecast...");
      const weather = await fetchWeatherData(coords, force);
      setData(weather);
    } catch (err: unknown) {
      const isGeoError = (e: unknown): e is GeolocationPositionError =>
        typeof e === "object" &&
        e !== null &&
        "code" in e &&
        typeof (e as Record<string, unknown>).code === "number";

      const isUnsupported = (e: unknown): boolean =>
        typeof e === "object" &&
        e !== null &&
        (e as Record<string, unknown>).code === "UNSUPPORTED";

      if (isUnsupported(err)) {
        setError({
          type: "unsupported",
          title: "Geolocation Unsupported",
          message:
            "Your current browser does not support GPS geolocation. Please switch to a modern browser like Chrome, Edge, or Firefox.",
          allowRetry: false,
        });
      } else if (isGeoError(err)) {
        if (err.code === err.PERMISSION_DENIED) {
          setError({
            type: "denied",
            title: "Location Permission Denied",
            message:
              "Location permission was denied. Please allow location access in your browser settings to view your local farm weather and field advisories.",
            allowRetry: true,
          });
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setError({
            type: "unavailable",
            title: "Location Unavailable",
            message:
              "Unable to retrieve GPS coordinates. Please verify your device's location service is turned on or check your network connection.",
            allowRetry: true,
          });
        } else if (err.code === err.TIMEOUT) {
          setError({
            type: "timeout",
            title: "Location Request Timed Out",
            message:
              "Finding your location took too long. Check your connection or click retry below.",
            allowRetry: true,
          });
        } else {
          setError({
            type: "unavailable",
            title: "Location Unavailable",
            message: err.message || "Unable to retrieve your location.",
            allowRetry: true,
          });
        }
      } else {
        const errorMsg =
          err instanceof Error ? err.message : "Unable to fetch weather data.";
        setError({
          type: "network",
          title: "Unable to Fetch Weather",
          message: errorMsg,
          allowRetry: true,
        });
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      loadWeather(false);
    }
  }, [autoFetch, loadWeather]);

  const refresh = useCallback(() => loadWeather(true), [loadWeather]);

  return {
    data,
    loading,
    loadingMsg,
    refreshing,
    error,
    loadWeather,
    refresh,
  };
}
