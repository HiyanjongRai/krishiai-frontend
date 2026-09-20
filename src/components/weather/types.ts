export type GeolocationStatus =
  | "idle"
  | "prompting"
  | "loading"
  | "success"
  | "denied"
  | "unavailable"
  | "timeout"
  | "unsupported"
  | "error";

export interface GeoCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: number;
}

export interface GeolocationState {
  status: GeolocationStatus;
  coords: GeoCoordinates | null;
  errorMessage: string | null;
}

export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  relativeHumidity: number;
  precipitation: number;
  rain: number;
  showers: number;
  snowfall: number;
  weatherCode: number;
  cloudCover: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  condition: string;
  isDay: boolean;
  time: string;
}

export interface HourlyForecastItem {
  time: string; // ISO string
  displayTime: string; // "14:00" or "2 PM"
  temperature: number;
  relativeHumidity: number;
  precipitationProbability: number;
  precipitation: number;
  rain: number;
  weatherCode: number;
  condition: string;
  windSpeed: number;
  cloudCover: number;
}

export interface DailyForecastItem {
  date: string; // "2026-09-20"
  dayName: string; // "Today", "Mon", "Tue"
  maxTemp: number;
  minTemp: number;
  precipitationSum: number;
  rainSum: number;
  precipitationProbability: number;
  maxWindSpeed: number;
  sunrise: string;
  sunset: string;
  weatherCode: number;
  condition: string;
}

export interface FarmAdvisory {
  level: "good" | "info" | "warning";
  title: string;
  message: string;
}

export interface WeatherMetadata {
  provider: string;
  fetchedAt: string;
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  locationName: string;
  coordinates: GeoCoordinates;
  timezone: string;
  lastUpdated: string;
  advisory: FarmAdvisory;
  metadata?: WeatherMetadata;
}

export interface WeatherErrorDetails {
  type: "denied" | "unavailable" | "timeout" | "unsupported" | "network" | "unknown";
  title: string;
  message: string;
  allowRetry: boolean;
}
