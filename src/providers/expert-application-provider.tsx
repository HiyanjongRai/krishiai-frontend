"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import {
  ExpertApplication,
  ApplicationStatus,
  AccountData,
  ProfessionalData,
  ExpertiseData,
  DocumentsData,
  UploadedDocument,
} from "@/types/expert-application";

const STORAGE_KEY = "krishiai_expert_application";

const INITIAL_APPLICATION: ExpertApplication = {
  id: "KAI-2026-001284",
  status: "DRAFT",
  currentStep: 1,
  completedSteps: [],
  percentage: 0,
  lastUpdated: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  account: {
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  },
  professional: {
    title: "Agricultural Consultant",
    organization: "",
    yearsOfExperience: "5",
    highestQualification: "B.Sc. Agriculture (Honours)",
    institution: "",
    graduationYear: "2020",
    registrationNumber: "",
    bio: "",
  },
  expertise: {
    crops: ["rice", "tomato"],
    specializations: ["crop_disease", "pest_management"],
  },
  documents: {},
  agreedToTerms: false,
};

interface ExpertApplicationContextType {
  application: ExpertApplication;
  saveStatus: "idle" | "saving" | "saved" | "error";
  hasExistingDraft: boolean;
  isLoading: boolean;
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateAccount: (data: Partial<AccountData>) => void;
  updateProfessional: (data: Partial<ProfessionalData>) => void;
  toggleCrop: (cropId: string) => void;
  toggleSpecialization: (specId: string) => void;
  uploadDocumentSimulated: (
    type: "identity" | "education" | "license" | "experience",
    file: File
  ) => Promise<void>;
  removeDocument: (type: "identity" | "education" | "license" | "experience") => void;
  setAgreedToTerms: (agreed: boolean) => void;
  submitApplication: () => Promise<void>;
  resetDraft: () => void;
  resumeDraft: () => void;
  setMockStatus: (
    status: ApplicationStatus,
    options?: {
      rejectionReason?: string;
      actionRequiredNotes?: string;
      requiredDoc?: "identity" | "education" | "license" | "experience";
      step?: number;
    }
  ) => void;
}

const ExpertApplicationContext = createContext<ExpertApplicationContextType | undefined>(undefined);

function calculatePercentage(completedSteps: number[], status: ApplicationStatus): number {
  if (status === "APPROVED" || status === "SUBMITTED" || status === "UNDER_REVIEW") {
    return 100;
  }
  const uniqueSteps = new Set(completedSteps.filter((s) => s >= 1 && s <= 5));
  return Math.min(100, uniqueSteps.size * 20);
}

export function ExpertApplicationProvider({ children }: { children: React.ReactNode }) {
  const [application, setApplication] = useState<ExpertApplication>(INITIAL_APPLICATION);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [isLoading, setIsLoading] = useState(true);
  const [hasExistingDraft, setHasExistingDraft] = useState(false);

  // Load draft from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as ExpertApplication;
        if (parsed && parsed.account) {
          setApplication(parsed);
          if (parsed.status === "DRAFT" && (parsed.completedSteps?.length > 0 || parsed.account.fullName)) {
            setHasExistingDraft(true);
          }
        }
      }
    } catch (e) {
      console.error("Failed to load expert application draft:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save to localStorage with auto-save indicator
  const persistState = useCallback((newApp: ExpertApplication) => {
    setSaveStatus("saving");
    try {
      const updated = {
        ...newApp,
        lastUpdated: new Date().toISOString(),
        percentage: calculatePercentage(newApp.completedSteps, newApp.status),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setApplication(updated);
      setTimeout(() => {
        setSaveStatus("saved");
      }, 300);
    } catch (e) {
      console.error("Auto-save failed:", e);
      setSaveStatus("error");
    }
  }, []);

  const goToStep = useCallback((step: number) => {
    setApplication((prev) => {
      const next = { ...prev, currentStep: step };
      persistState(next);
      return next;
    });
  }, [persistState]);

  const nextStep = useCallback(() => {
    setApplication((prev) => {
      const current = prev.currentStep;
      const completed = Array.from(new Set([...prev.completedSteps, current]));
      const nextStepNum = Math.min(6, current + 1);
      const next = {
        ...prev,
        currentStep: nextStepNum,
        completedSteps: completed,
      };
      persistState(next);
      return next;
    });
  }, [persistState]);

  const prevStep = useCallback(() => {
    setApplication((prev) => {
      const nextStepNum = Math.max(1, prev.currentStep - 1);
      const next = { ...prev, currentStep: nextStepNum };
      persistState(next);
      return next;
    });
  }, [persistState]);

  const updateAccount = useCallback((data: Partial<AccountData>) => {
    setApplication((prev) => {
      const next = {
        ...prev,
        account: { ...prev.account, ...data },
      };
      persistState(next);
      return next;
    });
  }, [persistState]);

  const updateProfessional = useCallback((data: Partial<ProfessionalData>) => {
    setApplication((prev) => {
      const next = {
        ...prev,
        professional: { ...prev.professional, ...data },
      };
      persistState(next);
      return next;
    });
  }, [persistState]);

  const toggleCrop = useCallback((cropId: string) => {
    setApplication((prev) => {
      const current = prev.expertise.crops || [];
      const updated = current.includes(cropId)
        ? current.filter((id) => id !== cropId)
        : [...current, cropId];
      const next = {
        ...prev,
        expertise: { ...prev.expertise, crops: updated },
      };
      persistState(next);
      return next;
    });
  }, [persistState]);

  const toggleSpecialization = useCallback((specId: string) => {
    setApplication((prev) => {
      const current = prev.expertise.specializations || [];
      const updated = current.includes(specId)
        ? current.filter((id) => id !== specId)
        : [...current, specId];
      const next = {
        ...prev,
        expertise: { ...prev.expertise, specializations: updated },
      };
      persistState(next);
      return next;
    });
  }, [persistState]);

  const uploadDocumentSimulated = useCallback(
    async (type: "identity" | "education" | "license" | "experience", file: File) => {
      const titles: Record<string, string> = {
        identity: "Identity Document (Citizenship / Passport)",
        education: "Highest Educational Degree Certificate",
        license: "Professional Agricultural License / Registration",
        experience: "Work Experience Certificate",
      };

      const formatSize = (bytes: number) => {
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
      };

      const doc: UploadedDocument = {
        id: `doc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        type,
        title: titles[type] || "Verification Document",
        fileName: file.name,
        fileSize: formatSize(file.size),
        fileType: file.type || "application/pdf",
        uploadedAt: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        status: "ready",
        progress: 100,
      };

      setApplication((prev) => {
        const next = {
          ...prev,
          documents: {
            ...prev.documents,
            [type]: doc,
          },
        };
        persistState(next);
        return next;
      });
    },
    [persistState]
  );

  const removeDocument = useCallback(
    (type: "identity" | "education" | "license" | "experience") => {
      setApplication((prev) => {
        const docs = { ...prev.documents };
        delete docs[type];
        const next = {
          ...prev,
          documents: docs,
        };
        persistState(next);
        return next;
      });
    },
    [persistState]
  );

  const setAgreedToTerms = useCallback(
    (agreed: boolean) => {
      setApplication((prev) => {
        const next = { ...prev, agreedToTerms: agreed };
        persistState(next);
        return next;
      });
    },
    [persistState]
  );

  const submitApplication = useCallback(async () => {
    setSaveStatus("saving");
    // Simulate brief network verification delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    setApplication((prev) => {
      const completed = [1, 2, 3, 4, 5];
      const submitted: ExpertApplication = {
        ...prev,
        status: "SUBMITTED",
        currentStep: 6,
        completedSteps: completed,
        percentage: 100,
        submittedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(submitted));
      setSaveStatus("saved");
      return submitted;
    });
  }, []);

  const resetDraft = useCallback(() => {
    const fresh: ExpertApplication = {
      ...INITIAL_APPLICATION,
      id: `KAI-2026-${Math.floor(100000 + Math.random() * 900000)}`,
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    setApplication(fresh);
    setHasExistingDraft(false);
    setSaveStatus("saved");
  }, []);

  const resumeDraft = useCallback(() => {
    // Find first incomplete step
    const completed = new Set(application.completedSteps);
    let target = 1;
    for (let i = 1; i <= 5; i++) {
      if (!completed.has(i)) {
        target = i;
        break;
      }
    }
    // If all 5 completed but not submitted, go to step 5 (Review)
    if (completed.size >= 4) {
      target = 5;
    }
    goToStep(target);
  }, [application.completedSteps, goToStep]);

  // Demo status switcher to preview all states
  const setMockStatus = useCallback(
    (
      status: ApplicationStatus,
      options?: {
        rejectionReason?: string;
        actionRequiredNotes?: string;
        requiredDoc?: "identity" | "education" | "license" | "experience";
        step?: number;
      }
    ) => {
      setApplication((prev) => {
        let completed = [...prev.completedSteps];
        let currentStep = options?.step ?? prev.currentStep;

        if (status === "DRAFT") {
          currentStep = options?.step ?? 4;
          completed = [1, 2, 3];
        } else if (status === "SUBMITTED") {
          currentStep = 6;
          completed = [1, 2, 3, 4, 5];
        } else if (status === "UNDER_REVIEW") {
          currentStep = 6;
          completed = [1, 2, 3, 4, 5];
        } else if (status === "ADDITIONAL_INFORMATION_REQUIRED") {
          currentStep = 4;
          completed = [1, 2, 3];
        } else if (status === "APPROVED") {
          currentStep = 6;
          completed = [1, 2, 3, 4, 5];
        } else if (status === "REJECTED") {
          currentStep = 6;
          completed = [1, 2, 3, 4, 5];
        }

        // Add sample documents if mock is not draft
        const sampleDocs: DocumentsData = {
          identity: {
            id: "doc_mock_id",
            type: "identity",
            title: "Citizenship Certificate",
            fileName: "Citizenship_Front_Back.pdf",
            fileSize: "1.8 MB",
            fileType: "application/pdf",
            uploadedAt: "Sep 2, 2026",
            status: "ready",
            progress: 100,
          },
          education: {
            id: "doc_mock_edu",
            type: "education",
            title: "BSc Agriculture Degree",
            fileName: "BSc_Agriculture_Certificate.pdf",
            fileSize: "2.4 MB",
            fileType: "application/pdf",
            uploadedAt: "Sep 2, 2026",
            status: "ready",
            progress: 100,
          },
          experience: {
            id: "doc_mock_exp",
            type: "experience",
            title: "Experience Certificate",
            fileName: "Experience_Letter_NARC.pdf",
            fileSize: "1.2 MB",
            fileType: "application/pdf",
            uploadedAt: "Sep 2, 2026",
            status: "ready",
            progress: 100,
          },
        };

        const updated: ExpertApplication = {
          ...prev,
          status,
          currentStep,
          completedSteps: completed,
          account: {
            fullName: prev.account.fullName || "Dr. Ram Prasad Sharma",
            email: prev.account.email || "ram.sharma@narc.gov.np",
            phone: prev.account.phone || "+977 9841234567",
            password: "SecurePassword@123",
            confirmPassword: "SecurePassword@123",
          },
          professional: {
            title: prev.professional.title || "Agricultural Scientist",
            organization: prev.professional.organization || "Nepal Agricultural Research Council (NARC)",
            yearsOfExperience: prev.professional.yearsOfExperience || "8",
            highestQualification: prev.professional.highestQualification || "M.Sc. Agriculture (Agronomy)",
            institution: prev.professional.institution || "Tribhuvan University, IAAS Rampur",
            graduationYear: prev.professional.graduationYear || "2018",
            registrationNumber: prev.professional.registrationNumber || "NEC-AGR-4421",
            bio:
              prev.professional.bio ||
              "Specialized in cereal crop pathology and pest resistance mechanisms. Advising hill farmers across Gandaki and Bagmati provinces on sustainable disease remediation.",
          },
          documents: Object.keys(prev.documents).length > 0 ? prev.documents : sampleDocs,
          rejectionReason:
            options?.rejectionReason ??
            (status === "REJECTED"
              ? "The uploaded experience certificate is unclear and official stamp verification could not be completed. Please upload a high-resolution scanned copy."
              : undefined),
          actionRequiredNotes:
            options?.actionRequiredNotes ??
            (status === "ADDITIONAL_INFORMATION_REQUIRED"
              ? "Your experience certificate needs clarification. The seal from Nepal Agricultural Research Council is partly obscured. Please re-upload a clear copy."
              : undefined),
          requiredDocumentUpdate:
            options?.requiredDoc ?? (status === "ADDITIONAL_INFORMATION_REQUIRED" ? "experience" : undefined),
        };

        persistState(updated);
        return updated;
      });
    },
    [persistState]
  );

  const value = useMemo(
    () => ({
      application,
      saveStatus,
      hasExistingDraft,
      isLoading,
      goToStep,
      nextStep,
      prevStep,
      updateAccount,
      updateProfessional,
      toggleCrop,
      toggleSpecialization,
      uploadDocumentSimulated,
      removeDocument,
      setAgreedToTerms,
      submitApplication,
      resetDraft,
      resumeDraft,
      setMockStatus,
    }),
    [
      application,
      saveStatus,
      hasExistingDraft,
      isLoading,
      goToStep,
      nextStep,
      prevStep,
      updateAccount,
      updateProfessional,
      toggleCrop,
      toggleSpecialization,
      uploadDocumentSimulated,
      removeDocument,
      setAgreedToTerms,
      submitApplication,
      resetDraft,
      resumeDraft,
      setMockStatus,
    ]
  );

  return (
    <ExpertApplicationContext.Provider value={value}>
      {children}
    </ExpertApplicationContext.Provider>
  );
}

export function useExpertApplication() {
  const context = useContext(ExpertApplicationContext);
  if (!context) {
    throw new Error("useExpertApplication must be used within an ExpertApplicationProvider");
  }
  return context;
}
