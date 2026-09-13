/**
 * Expert Verification Types & Interfaces
 * Defines the structure for expert account and verification states
 */

export type ExpertAccountStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";
export type VerificationStatus = "PENDING" | "UNDER_REVIEW" | "ADDITIONAL_INFO_REQUIRED" | "APPROVED" | "REJECTED";
export type ExpertiseStatus = "SELF_DECLARED" | "EVIDENCE_SUBMITTED" | "VERIFIED" | "REJECTED" | "PENDING";
export type DocumentStatus = "PENDING" | "APPROVED" | "VERIFIED" | "REJECTED" | "ADDITIONAL_INFO_REQUIRED";

export interface ExpertAccountInfo {
  accountStatus: ExpertAccountStatus; // ACTIVE, even while verification is pending
  verificationStatus: VerificationStatus;
  submittedAt?: string;
  lastUpdated?: string;
  approvedAt?: string;
}

export interface ExpertExpertise {
  id: string;
  name: string;
  category: "CROP" | "PROFESSIONAL_EXPERTISE";
  icon?: string;
  status: ExpertiseStatus;
  rejectionReason?: string;
}

export interface ExpertDocument {
  id: string;
  name: string;
  type: string;
  submittedAt: string;
  status: DocumentStatus;
  rejectionReason?: string;
  additionalInfoRequired?: string;
  verifiedAt?: string;
  url?: string;
}

export interface ExpertProfileInfo {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  profilePhoto?: string;
  location?: string;
  district?: string;
  province?: string;
  
  // Professional Info
  qualification?: string; // JTA, B.Sc. Agriculture, B.Tech Agriculture, etc.
  institution?: string;
  graduationYear?: number;
  specialization?: string;
  yearsOfExperience?: number;
  previousOrganization?: string;
  professionalBio?: string;
  
  profileCompletionPercentage: number;
}

export interface ExpertApplicationProgress {
  currentStage: VerificationStatus;
  submittedAt?: string;
  underReviewSince?: string;
  rejectionReason?: string;
  additionalInfoRequired?: string;
  approvedAt?: string;
  
  submittedExpertise: ExpertExpertise[];
  submittedDocuments: ExpertDocument[];
  adminNotes?: string;
}

export interface ExpertDashboardState {
  accountInfo: ExpertAccountInfo;
  profileInfo: ExpertProfileInfo;
  applicationProgress: ExpertApplicationProgress;
  recentActivity?: DashboardActivity[];
}

export interface DashboardActivity {
  id: string;
  type: "APPLICATION_SUBMITTED" | "DOCUMENT_UPLOADED" | "EXPERTISE_ADDED" | "PROFILE_UPDATED" | "VERIFICATION_APPROVED" | "VERIFICATION_REJECTED" | "ADDITIONAL_INFO_REQUESTED";
  description: string;
  timestamp: string;
  icon?: string;
}

export interface VerificationProgressStep {
  stage: VerificationStatus;
  label: string;
  description: string;
  isCompleted: boolean;
  isCurrent: boolean;
}
