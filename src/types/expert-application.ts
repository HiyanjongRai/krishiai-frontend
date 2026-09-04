export type ApplicationStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "ADDITIONAL_INFORMATION_REQUIRED"
  | "APPROVED"
  | "REJECTED";

export type ProfessionalTitle =
  | "Agricultural Consultant"
  | "Agricultural Scientist"
  | "Agriculture Officer"
  | "Agriculture Graduate"
  | "Agrovet Professional"
  | "Researcher"
  | "Experienced Farmer"
  | "Plant Pathologist"
  | "Soil Scientist"
  | "Other";

export interface AccountData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface ProfessionalData {
  title: string;
  organization: string;
  yearsOfExperience: string;
  highestQualification: string;
  institution: string;
  graduationYear: string;
  registrationNumber?: string;
  bio: string;
}

export interface CropExpertiseItem {
  id: string;
  name: string;
  nepaliName?: string;
  emoji: string;
  category: "Cereals" | "Vegetables" | "Fruits" | "Cash Crops" | "Legumes";
}

export interface SpecializationItem {
  id: string;
  name: string;
  description: string;
  iconName?: string;
}

export interface ExpertiseData {
  crops: string[];
  specializations: string[];
}

export interface UploadedDocument {
  id: string;
  type: "identity" | "education" | "license" | "experience";
  title: string;
  fileName: string;
  fileSize: string; // e.g. "2.4 MB"
  fileType: string; // e.g. "application/pdf"
  uploadedAt: string;
  status: "uploading" | "ready" | "error";
  progress: number;
  previewUrl?: string;
  error?: string;
}

export interface DocumentsData {
  identity?: UploadedDocument;
  education?: UploadedDocument;
  license?: UploadedDocument;
  experience?: UploadedDocument;
}

export interface ExpertApplication {
  id: string; // e.g. "KAI-2026-001284"
  status: ApplicationStatus;
  currentStep: number; // 1 to 5 for wizard steps, 6 for submitted
  completedSteps: number[]; // e.g. [1, 2, 3]
  percentage: number; // 0, 20, 40, 60, 80, 100
  lastUpdated: string;
  createdAt: string;
  submittedAt?: string;
  rejectionReason?: string;
  actionRequiredNotes?: string;
  requiredDocumentUpdate?: "identity" | "education" | "license" | "experience";
  
  // Data sections
  account: AccountData;
  professional: ProfessionalData;
  expertise: ExpertiseData;
  documents: DocumentsData;
  agreedToTerms: boolean;
}

export interface TimelineMilestone {
  id: string;
  title: string;
  description: string;
  date?: string;
  status: "completed" | "current" | "pending" | "warning" | "error";
}
