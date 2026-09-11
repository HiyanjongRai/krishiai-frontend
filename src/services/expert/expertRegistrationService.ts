import { api, tokenStore, ApiError } from "@/lib/api";
import { loginUser, registerUser } from "@/lib/auth";
import type { ExpertApplication } from "@/types/expert-application";

interface CropCatalogItem {
  id: number;
  name: string;
  nepaliName?: string;
  emoji?: string;
}

interface SpecializationCatalogItem {
  id: number;
  name: string;
  code: string;
}

interface LocationCatalogItem {
  id: number;
  name: string;
  type: string;
}

interface CropCatalogResponse {
  content?: CropCatalogItem[];
}

/**
 * Submits the complete expert application to the backend:
 * 1. Registers the user as ROLE_EXPERT (if not already logged in)
 * 2. Authenticates and stores the JWT token
 * 3. Updates the ExpertProfile with professional details
 * 4. Links primary & secondary crops
 * 5. Links professional specializations
 * 6. Links geographic locations
 * 7. Submits the application for admin review
 */
export async function submitFullExpertApplication(application: ExpertApplication): Promise<void> {
  // Step 1: Ensure authentication
  let currentToken = tokenStore.get();

  if (!currentToken && application.account.email && application.account.password) {
    const trimmedFullName = (application.account.fullName || "").trim();

    try {
      await registerUser({
        email: application.account.email,
        password: application.account.password,
        fullName: trimmedFullName || "Expert User",
        phone: application.account.phone.replace(/[\s-]/g, ""),
        role: "ROLE_EXPERT",
      });
    } catch (err: unknown) {
      if (!(err instanceof ApiError) || err.status !== 409) throw err;
    }

    // Authenticate to get JWT token
    const loginRes = await loginUser(application.account.email, application.account.password);
    tokenStore.set(loginRes.accessToken);
    currentToken = loginRes.accessToken;
  }

  // If we have token, proceed with profile updates
  if (!currentToken) {
    throw new Error("Please sign in before submitting your expert application.");
  }

  // Step 2: Update profile credentials
  await api.patch("/v1/expert/profile", {
        bio: application.professional.bio || "",
        yearsOfExperience: application.professional.yearsOfExperience
          ? parseInt(application.professional.yearsOfExperience, 10)
          : undefined,
        qualification: application.professional.highestQualification,
        institution: application.professional.institution,
        organization: application.professional.organization,
        designation: application.professional.title,
      });

  // Step 3: Fetch catalogs to map IDs
  const [crops, specializations, locations] = await Promise.all([
        api.get<CropCatalogItem[] | CropCatalogResponse>("/v1/crops?size=100"),
        api.get<SpecializationCatalogItem[]>("/v1/specializations"),
        api.get<LocationCatalogItem[]>("/v1/locations"),
  ]);

      const rawCrops = crops;
      const cropsList: CropCatalogItem[] = Array.isArray(rawCrops)
        ? rawCrops
        : rawCrops.content ?? [];
      const specList = specializations;
      const locList = locations;

      // Link primary crops (max 3)
      const primaryCropIds = application.expertise.primaryCrops || application.expertise.crops.slice(0, 3);
      for (const cropKey of primaryCropIds.slice(0, 3)) {
        const match = cropsList.find(
          (c) => c.name.toLowerCase().includes(cropKey.toLowerCase()) ||
                 c.id.toString() === cropKey
        );
        if (!match) throw new Error(`Crop catalog item not found: ${cropKey}`);
        await api.post("/v1/expert/profile/crops", { cropId: match.id, expertiseType: "PRIMARY" });
      }

      // Link secondary crops
      const secondaryCropIds = application.expertise.secondaryCrops || [];
      for (const cropKey of secondaryCropIds) {
        const match = cropsList.find(
          (c) => c.name.toLowerCase().includes(cropKey.toLowerCase()) ||
                 c.id.toString() === cropKey
        );
        if (!match) throw new Error(`Crop catalog item not found: ${cropKey}`);
        await api.post("/v1/expert/profile/crops", { cropId: match.id, expertiseType: "SECONDARY" });
      }

      // Link specializations
      for (const specKey of application.expertise.specializations || []) {
        const match = specList.find(
          (s) => s.code.toLowerCase() === specKey.toLowerCase() ||
                 s.name.toLowerCase().includes(specKey.toLowerCase())
        );
        if (!match) throw new Error(`Specialization catalog item not found: ${specKey}`);
        await api.post(`/v1/expert/profile/specializations/${match.id}`, {});
      }

      // Link locations
      for (const locKey of application.expertise.locations || []) {
        const match = locList.find(
          (l) => l.name.toLowerCase().includes(locKey.toLowerCase())
        );
        if (!match) throw new Error(`Location catalog item not found: ${locKey}`);
        await api.post(`/v1/expert/profile/locations/${match.id}`, {});
      }

      // Step 4: Upload / save verification documents
      if (application.documents) {
        for (const [docKey, doc] of Object.entries(application.documents)) {
          if (doc && doc.fileName) {
            await api.post("/v1/expert/profile/documents", {
                documentType: doc.type ? doc.type.toUpperCase() : docKey.toUpperCase(),
                title: doc.title || `${docKey} Document`,
                fileName: doc.fileName,
                fileType: doc.fileType || "application/pdf",
                fileSize: doc.fileSize || "1.5 MB",
                fileUrl: doc.previewUrl || "",
              });
          }
        }
      }

  // Step 5: Submit application officially
  await api.post("/v1/expert/profile/submit-application", {});
}
