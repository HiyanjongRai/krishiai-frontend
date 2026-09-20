import type {
  CurrentWeather,
  DailyForecastItem,
  FarmAdvisory,
  GeoCoordinates,
  HourlyForecastItem,
  WeatherData,
  WeatherMetadata,
} from "./types";
import { api } from "@/lib/api";

// ─── WMO Weather Interpretation Helper ────────────────────────────────────────
export interface WmoCondition {
  label: string;
  iconType: "sun" | "cloud" | "cloud-sun" | "cloud-rain" | "cloud-drizzle" | "cloud-snow" | "cloud-lightning" | "cloud-fog";
  isRain: boolean;
  isStorm: boolean;
}

export function getWmoCondition(code: number, isDay = true): WmoCondition {
  switch (code) {
    case 0:
      return {
        label: isDay ? "Clear Sky" : "Clear Night",
        iconType: isDay ? "sun" : "cloud-sun",
        isRain: false,
        isStorm: false,
      };
    case 1:
      return { label: "Mainly Clear", iconType: isDay ? "cloud-sun" : "cloud", isRain: false, isStorm: false };
    case 2:
      return { label: "Partly Cloudy", iconType: "cloud-sun", isRain: false, isStorm: false };
    case 3:
      return { label: "Overcast", iconType: "cloud", isRain: false, isStorm: false };
    case 45:
      return { label: "Foggy", iconType: "cloud-fog", isRain: false, isStorm: false };
    case 48:
      return { label: "Depositing Rime Fog", iconType: "cloud-fog", isRain: false, isStorm: false };
    case 51:
      return { label: "Light Drizzle", iconType: "cloud-drizzle", isRain: true, isStorm: false };
    case 53:
      return { label: "Moderate Drizzle", iconType: "cloud-drizzle", isRain: true, isStorm: false };
    case 55:
      return { label: "Dense Drizzle", iconType: "cloud-drizzle", isRain: true, isStorm: false };
    case 56:
    case 57:
      return { label: "Freezing Drizzle", iconType: "cloud-snow", isRain: true, isStorm: false };
    case 61:
      return { label: "Slight Rain", iconType: "cloud-rain", isRain: true, isStorm: false };
    case 63:
      return { label: "Moderate Rain", iconType: "cloud-rain", isRain: true, isStorm: false };
    case 65:
      return { label: "Heavy Rain", iconType: "cloud-rain", isRain: true, isStorm: false };
    case 66:
    case 67:
      return { label: "Freezing Rain", iconType: "cloud-snow", isRain: true, isStorm: false };
    case 71:
      return { label: "Slight Snow", iconType: "cloud-snow", isRain: false, isStorm: false };
    case 73:
      return { label: "Moderate Snow", iconType: "cloud-snow", isRain: false, isStorm: false };
    case 75:
      return { label: "Heavy Snow", iconType: "cloud-snow", isRain: false, isStorm: false };
    case 77:
      return { label: "Snow Grains", iconType: "cloud-snow", isRain: false, isStorm: false };
    case 80:
      return { label: "Slight Showers", iconType: "cloud-rain", isRain: true, isStorm: false };
    case 81:
      return { label: "Moderate Showers", iconType: "cloud-rain", isRain: true, isStorm: false };
    case 82:
      return { label: "Violent Showers", iconType: "cloud-rain", isRain: true, isStorm: false };
    case 85:
    case 86:
      return { label: "Snow Showers", iconType: "cloud-snow", isRain: false, isStorm: false };
    case 95:
      return { label: "Thunderstorm", iconType: "cloud-lightning", isRain: true, isStorm: true };
    case 96:
    case 99:
      return { label: "Thunderstorm with Hail", iconType: "cloud-lightning", isRain: true, isStorm: true };
    default:
      return { label: "Fair", iconType: "cloud-sun", isRain: false, isStorm: false };
  }
}

// ─── Farm Advisory Generator ──────────────────────────────────────────────────
export function deriveFarmAdvisory(current: CurrentWeather, daily: DailyForecastItem[]): FarmAdvisory {
  const tomorrow = daily[1];
  const today = daily[0];

  if (current.weatherCode >= 95 || (today && today.weatherCode >= 95)) {
    return {
      level: "warning",
      title: "Storm Alert",
      message: "Thunderstorms detected in your region. Secure greenhouses, shelter livestock, and suspend aerial spraying.",
    };
  }

  if (current.precipitation > 2 || (today && today.precipitationProbability > 65)) {
    return {
      level: "warning",
      title: "Precipitation Warning",
      message: "Rain is active or imminent today. Delay foliar fertilizer spraying and ensure farm drainage channels are open.",
    };
  }

  if (tomorrow && (tomorrow.precipitationProbability > 60 || tomorrow.precipitationSum > 5)) {
    return {
      level: "info",
      title: "Rain Expected Tomorrow",
      message: `Expect rain (${Math.round(tomorrow.precipitationProbability)}% chance). Complete pending harvests or pesticide treatments today.`,
    };
  }

  if (current.windSpeed > 30) {
    return {
      level: "warning",
      title: "High Wind Alert",
      message: `Gusts reaching ${Math.round(current.windGusts || current.windSpeed)} km/h. Avoid pesticide dusting and stake tall crop varieties.`,
    };
  }

  if (current.temperature > 32) {
    return {
      level: "info",
      title: "Heat Stress Advisory",
      message: "Elevated temperatures detected. Irrigate crops during early morning or dusk to minimize evaporative water loss.",
    };
  }

  if (current.relativeHumidity > 85) {
    return {
      level: "info",
      title: "High Humidity Advisory",
      message: "Prolonged high humidity increases fungal disease risks (e.g. blight). Inspect leaf undersides regularly.",
    };
  }

  return {
    level: "good",
    title: "Optimal Farm Window",
    message: "Clear conditions prevailing. Excellent window for fertilizer application, field aeration, or crop inspection.",
  };
}

// ─── Geolocation Promise Wrapper ──────────────────────────────────────────────
export function getBrowserPosition(): Promise<GeoCoordinates> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      const err = new Error("Geolocation is not supported by your current browser.");
      (err as unknown as { code: string }).code = "UNSUPPORTED";
      return reject(err);
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes cache for GPS
      }
    );
  });
}

// ─── Reverse Geocoding with Fallback ──────────────────────────────────────────
const geocodeCache = new Map<string, string>();

export async function reverseGeocode(lat: number, lon: number): Promise<string> {
  const cacheKey = `${lat.toFixed(2)},${lon.toFixed(2)}`;
  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey)!;
  }

  // Fallback string formatted as coordinates
  const formatCoords = () => {
    const latDir = lat >= 0 ? "N" : "S";
    const lonDir = lon >= 0 ? "E" : "W";
    return `${Math.abs(lat).toFixed(2)}° ${latDir}, ${Math.abs(lon).toFixed(2)}° ${lonDir}`;
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const place = data.city || data.locality || data.principalSubdivision || "";
      const country = data.countryName || "";
      let label = "";

      if (place && country) {
        label = `${place}, ${country}`;
      } else if (place) {
        label = place;
      } else if (country) {
        label = country;
      }

      if (label) {
        geocodeCache.set(cacheKey, label);
        return label;
      }
    }
  } catch {
    // Graceful fallback on network abort or error
  }

  const fallback = formatCoords();
  geocodeCache.set(cacheKey, fallback);
  return fallback;
}

// ─── Open-Meteo Weather Fetcher with Session Cache ────────────────────────────
const CACHE_DURATION_MS = 15 * 60 * 1000; // 15 minutes TTL

interface CacheEntry {
  timestamp: number;
  data: WeatherData;
}

function getCacheKey(lat: number, lon: number): string {
  return `krishiai_weather_${lat.toFixed(2)}_${lon.toFixed(2)}`;
}

export async function fetchWeatherData(
  coords: GeoCoordinates,
  forceRefresh = false
): Promise<WeatherData> {
  const { latitude, longitude } = coords;

  if (
    typeof latitude !== "number" ||
    typeof longitude !== "number" ||
    isNaN(latitude) ||
    isNaN(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    throw new Error("Invalid geographic coordinates provided.");
  }

  const cacheKey = getCacheKey(latitude, longitude);

  // Check sessionStorage cache
  if (!forceRefresh && typeof window !== "undefined") {
    try {
      const cachedStr = sessionStorage.getItem(cacheKey);
      if (cachedStr) {
        const cached: CacheEntry = JSON.parse(cachedStr);
        if (Date.now() - cached.timestamp < CACHE_DURATION_MS) {
          return cached.data;
        }
      }
    } catch {
      // sessionStorage unavailable or parse error; proceed to fetch
    }
  }

  // Fetch weather from Spring Boot backend gateway
  let raw: {
    coordinates: GeoCoordinates;
    location: { name: string; region: string; country: string };
    timezone: string;
    current: CurrentWeather;
    hourly: HourlyForecastItem[];
    daily: DailyForecastItem[];
    metadata?: WeatherMetadata;
  };

  try {
    raw = await api.get<{
      coordinates: GeoCoordinates;
      location: { name: string; region: string; country: string };
      timezone: string;
      current: CurrentWeather;
      hourly: HourlyForecastItem[];
      daily: DailyForecastItem[];
      metadata?: WeatherMetadata;
    }>(`/v1/weather?latitude=${latitude}&longitude=${longitude}`);
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error("Unable to connect to the weather service. Please check your internet connection.");
  }

  if (!raw || !raw.current || !raw.daily || !raw.hourly) {
    throw new Error("Incomplete weather data received from service.");
  }

  // Reverse geocode locality in parallel (with fallback to backend city name or coordinates)
  const geocoded = await reverseGeocode(latitude, longitude);
  const locationName = geocoded.includes("°") && raw.location?.name
    ? `${raw.location.name}${raw.location.country ? ", " + raw.location.country : ""}`
    : geocoded;

  // Calculate deterministic agricultural advisory from normalized values
  const advisory = deriveFarmAdvisory(raw.current, raw.daily);

  const weatherData: WeatherData = {
    current: raw.current,
    hourly: raw.hourly,
    daily: raw.daily,
    locationName,
    coordinates: coords,
    timezone: raw.timezone || "auto",
    lastUpdated: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    advisory,
    metadata: raw.metadata,
  };

  // Save to sessionStorage (15-minute TTL)
  if (typeof window !== "undefined") {
    try {
      const entry: CacheEntry = {
        timestamp: Date.now(),
        data: weatherData,
      };
      sessionStorage.setItem(cacheKey, JSON.stringify(entry));
    } catch {
      // ignore storage quota errors
    }
  }

  return weatherData;
}
