"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import {
  ExpertApplication,
  ApplicationStatus,
  AccountData,
  ProfessionalData,
  UploadedDocument,
} from "@/types/expert-application";
import { submitFullExpertApplication } from "@/lib/expert-api";

const STORAGE_KEY = "krishiai_expert_application_v2";

const INITIAL_APPLICATION: ExpertApplication = {
  id: "",
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
    title: "",
    organization: "",
    yearsOfExperience: "",
    highestQualification: "",
    institution: "",
    graduationYear: "",
    registrationNumber: "",
    bio: "",
  },
  expertise: {
    crops: [],
    primaryCrops: [],
    secondaryCrops: [],
    specializations: [],
    locations: [],
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
  togglePrimaryCrop: (cropId: string) => boolean;
  toggleSecondaryCrop: (cropId: string) => void;
  toggleSpecialization: (specId: string) => void;
  toggleLocation: (locationId: string) => void;
  uploadDocument: (
    type: "identity" | "education" | "license" | "experience",
    file: File
  ) => Promise<void>;
  removeDocument: (type: "identity" | "education" | "license" | "experience") => void;
  setAgreedToTerms: (agreed: boolean) => void;
  submitApplication: () => Promise<void>;
  resetDraft: () => void;
  resumeDraft: () => void;
}

const ExpertApplicationContext = createContext<ExpertApplicationContextType | undefined>(undefined);

function calculatePercentage(completedSteps: number[], status: ApplicationStatus): number {
  if (status === "APPROVED" || status === "SUBMITTED" || status === "UNDER_REVIEW") {
    return 100;
  }
  const uniqueSteps = new Set(completedSteps.filter((s) => s >= 1 && s <= 5));
  return Math.min(100, uniqueSteps.size * 20);
}

function normalizeCompletedSteps(completedSteps: number[]): number[] {
  const completed = new Set(completedSteps.filter((step) => step >= 1 && step <= 5));
  const contiguous: number[] = [];
  for (let step = 1; step <= 5; step += 1) {
    if (!completed.has(step)) break;
    contiguous.push(step);
  }
  return contiguous;
}

function getFirstIncompleteStep(completedSteps: number[]): number {
  return Math.min(5, normalizeCompletedSteps(completedSteps).length + 1);
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
          const completedSteps = normalizeCompletedSteps(parsed.completedSteps || []);
          const firstIncompleteStep = getFirstIncompleteStep(completedSteps);
          const currentStep = Math.min(
            Math.max(1, parsed.currentStep || firstIncompleteStep),
            firstIncompleteStep
          );
          const normalized = { ...parsed, currentStep, completedSteps };
          window.setTimeout(() => {
            setApplication(normalized);
            if (normalized.status === "DRAFT" && (completedSteps.length > 0 || normalized.account.fullName)) {
              setHasExistingDraft(true);
            }
          }, 0);
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
      const completedSteps = normalizeCompletedSteps(prev.completedSteps);
      const firstIncompleteStep = getFirstIncompleteStep(completedSteps);
      const requestedStep = Math.min(Math.max(1, step), 5);
      const nextStep = requestedStep <= firstIncompleteStep
        ? requestedStep
        : prev.currentStep;
      const next = { ...prev, currentStep: nextStep, completedSteps };
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

  const togglePrimaryCrop = useCallback((cropId: string): boolean => {
    let succeeded = false;
    setApplication((prev) => {
      const currentPrimary = prev.expertise.primaryCrops || [];
      const currentSecondary = prev.expertise.secondaryCrops || [];
      const currentAll = prev.expertise.crops || [];

      if (currentPrimary.includes(cropId)) {
        // Remove from primary
        const updatedPrimary = currentPrimary.filter((id) => id !== cropId);
        const updatedAll = currentAll.filter((id) => id !== cropId);
        const next = {
          ...prev,
          expertise: {
            ...prev.expertise,
            primaryCrops: updatedPrimary,
            crops: updatedAll,
          },
        };
        persistState(next);
        succeeded = true;
        return next;
      }

      // If already at max 3 primary crops, reject
      if (currentPrimary.length >= 3) {
        succeeded = false;
        return prev;
      }

      // Add to primary, remove from secondary if present
      const updatedPrimary = [...currentPrimary, cropId];
      const updatedSecondary = currentSecondary.filter((id) => id !== cropId);
      const updatedAll = Array.from(new Set([...currentAll, cropId]));
      const next = {
        ...prev,
        expertise: {
          ...prev.expertise,
          primaryCrops: updatedPrimary,
          secondaryCrops: updatedSecondary,
          crops: updatedAll,
        },
      };
      persistState(next);
      succeeded = true;
      return next;
    });
    return succeeded;
  }, [persistState]);

  const toggleSecondaryCrop = useCallback((cropId: string) => {
    setApplication((prev) => {
      const currentPrimary = prev.expertise.primaryCrops || [];
      const currentSecondary = prev.expertise.secondaryCrops || [];
      const currentAll = prev.expertise.crops || [];

      if (currentSecondary.includes(cropId)) {
        const updatedSecondary = currentSecondary.filter((id) => id !== cropId);
        const updatedAll = currentAll.filter((id) => id !== cropId);
        const next = {
          ...prev,
          expertise: {
            ...prev.expertise,
            secondaryCrops: updatedSecondary,
            crops: updatedAll,
          },
        };
        persistState(next);
        return next;
      }

      // If it is in primary, remove from primary and add to secondary
      const updatedPrimary = currentPrimary.filter((id) => id !== cropId);
      const updatedSecondary = [...currentSecondary, cropId];
      const updatedAll = Array.from(new Set([...currentAll, cropId]));
      const next = {
        ...prev,
        expertise: {
          ...prev.expertise,
          primaryCrops: updatedPrimary,
          secondaryCrops: updatedSecondary,
          crops: updatedAll,
        },
      };
      persistState(next);
      return next;
    });
  }, [persistState]);

  const toggleLocation = useCallback((locId: string) => {
    setApplication((prev) => {
      const current = prev.expertise.locations || [];
      const updated = current.includes(locId)
        ? current.filter((id) => id !== locId)
        : [...current, locId];
      const next = {
        ...prev,
        expertise: { ...prev.expertise, locations: updated },
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

  const uploadDocument = useCallback(
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
    await submitFullExpertApplication(application);

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
  }, [application]);

  const resetDraft = useCallback(() => {
    const fresh: ExpertApplication = {
      ...INITIAL_APPLICATION,
      id: "",
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
      togglePrimaryCrop,
      toggleSecondaryCrop,
      toggleSpecialization,
      toggleLocation,
      uploadDocument,
      removeDocument,
      setAgreedToTerms,
      submitApplication,
      resetDraft,
      resumeDraft,
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
      togglePrimaryCrop,
      toggleSecondaryCrop,
      toggleSpecialization,
      toggleLocation,
      uploadDocument,
      removeDocument,
      setAgreedToTerms,
      submitApplication,
      resetDraft,
      resumeDraft,
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
