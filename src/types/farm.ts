export interface Farm {
  id: string;
  farmerId: string;
  name: string;
  location: string;
  coordinates: { lat: number; lng: number };
  totalArea: number;
  cropsCount: number;
}
