export interface PublicExpertise {
  cropId?: number | null;
  cropName?: string;
  cropEmoji?: string;
  categoryName?: string;
  expertiseType?: string;
  verificationStatus?: string;
  expertiseArea?: string;
  expertiseLevel?: string;
  yearsOfExperience?: number;
}

export interface VerifiedExpert {
  expertProfileId: number;
  userId?: number;
  fullName: string;
  profileImage?: string | null;
  designation?: string;
  organization?: string;
  yearsOfExperience?: number;
  qualification?: string;
  institution?: string;
  bio?: string;
  professionalVerified: boolean;
  professionalVerificationStatus: string;
  verifiedCrops: PublicExpertise[];
  allExpertises: PublicExpertise[];
  specializations: string[];
  locations: string[];
}
