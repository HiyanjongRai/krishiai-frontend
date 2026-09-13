export interface ExpertProfileData {
  id: number;
  user: {
    id: number;
    fullName: string;
    email: string;
    phone?: string | null;
    profileImage?: string | null;
    role: string;
  };
  bio?: string;
  yearsOfExperience?: number;
  qualification?: string;
  institution?: string;
  organization?: string;
  designation?: string;
  websiteUrl?: string;
  verifiedExpert: boolean;
  applicationStatus: "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED";
  submittedAt?: string;
  reviewedAt?: string;
  adminNotes?: string;
  crops: Array<{
    cropId: number;
    cropName: string;
    cropCategory: string;
    expertiseType: string;
  }>;
  specializations: Array<{
    id: number;
    name: string;
    code: string;
  }>;
  locations: Array<{
    id: number;
    name: string;
    type: string;
  }>;
}