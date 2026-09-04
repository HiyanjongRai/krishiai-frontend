export interface Disease {
  id: string;
  name: string;
  scientificName?: string;
  cropCategory: string;
  symptoms: string[];
  preventions: string[];
  treatments: string[];
  severity: "LOW" | "MEDIUM" | "HIGH";
}
