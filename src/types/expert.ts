export interface Expert {
  id: string;
  name: string;
  role: string;
  category: string;
  rating: number;
  reviewsCount: number;
  experienceYears: number;
  avatarUrl: string;
  verified: boolean;
  bio?: string;
}
