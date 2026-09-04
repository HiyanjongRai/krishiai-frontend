export interface Consultation {
  id: string;
  farmerId: string;
  expertId: string;
  cropId: string;
  status: "PENDING" | "SCHEDULED" | "COMPLETED" | "CANCELLED";
  scheduledAt?: string;
  notes?: string;
  fee: number;
}
