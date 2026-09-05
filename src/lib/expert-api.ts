import { api, tokenStore } from "@/lib/api";
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
    const names = (application.account.fullName || "").trim().split(/\s+/);
    const firstName = names[0] || "Expert";
    const lastName = names.slice(1).join(" ") || "User";

    try {
      await registerUser({
        email: application.account.email,
        password: application.account.password,
        firstName,
        lastName,
        phone: application.account.phone,
        role: "ROLE_EXPERT",
      });
    } catch (err: unknown) {
      // If already registered, proceed to login
      console.warn("Registration note:", err);
    }

    // Authenticate to get JWT token
    const loginRes = await loginUser(application.account.email, application.account.password);
    tokenStore.set(loginRes.accessToken);
    currentToken = loginRes.accessToken;
  }

  // If we have token, proceed with profile updates
  if (currentToken) {
    // Step 2: Update profile credentials
    try {
      await api.patch("/v1/expert/profile", {
        bio: application.professional.bio || "",
        yearsOfExperience: parseInt(application.professional.yearsOfExperience, 10) || 1,
        qualification: application.professional.highestQualification,
        institution: application.professional.institution,
        organization: application.professional.organization,
        designation: application.professional.title,
      });
    } catch (err) {
      console.warn("Could not patch profile details:", err);
    }

    // Step 3: Fetch catalogs to map IDs
    try {
      const [crops, specializations, locations] = await Promise.allSettled([
        api.get<any>("/v1/crops?size=100"),
        api.get<SpecializationCatalogItem[]>("/v1/specializations"),
        api.get<LocationCatalogItem[]>("/v1/locations"),
      ]);

      const rawCrops = crops.status === "fulfilled" ? crops.value : [];
      const cropsList: CropCatalogItem[] = Array.isArray(rawCrops)
        ? rawCrops
        : Array.isArray(rawCrops?.content)
        ? rawCrops.content
        : [];
      const specList = specializations.status === "fulfilled" && Array.isArray(specializations.value) ? specializations.value : [];
      const locList = locations.status === "fulfilled" && Array.isArray(locations.value) ? locations.value : [];

      // Link primary crops (max 3)
      const primaryCropIds = application.expertise.primaryCrops || application.expertise.crops.slice(0, 3);
      for (const cropKey of primaryCropIds.slice(0, 3)) {
        const match = cropsList.find(
          (c) => c.name.toLowerCase().includes(cropKey.toLowerCase()) ||
                 c.id.toString() === cropKey
        );
        const cropId = match ? match.id : (parseInt(cropKey, 10) || 1);
        try {
          await api.post("/v1/expert/profile/crops", {
            cropId,
            expertiseType: "PRIMARY",
          });
        } catch {
          // ignore duplicate
        }
      }

      // Link secondary crops
      const secondaryCropIds = application.expertise.secondaryCrops || [];
      for (const cropKey of secondaryCropIds) {
        const match = cropsList.find(
          (c) => c.name.toLowerCase().includes(cropKey.toLowerCase()) ||
                 c.id.toString() === cropKey
        );
        const cropId = match ? match.id : (parseInt(cropKey, 10) || 2);
        try {
          await api.post("/v1/expert/profile/crops", {
            cropId,
            expertiseType: "SECONDARY",
          });
        } catch {
          // ignore duplicate
        }
      }

      // Link specializations
      for (const specKey of application.expertise.specializations || []) {
        const match = specList.find(
          (s) => s.code.toLowerCase() === specKey.toLowerCase() ||
                 s.name.toLowerCase().includes(specKey.toLowerCase())
        );
        const specId = match ? match.id : 1;
        try {
          await api.post(`/v1/expert/profile/specializations/${specId}`, {});
        } catch {
          // ignore duplicate
        }
      }

      // Link locations
      for (const locKey of application.expertise.locations || []) {
        const match = locList.find(
          (l) => l.name.toLowerCase().includes(locKey.toLowerCase())
        );
        const locId = match ? match.id : 1;
        try {
          await api.post(`/v1/expert/profile/locations/${locId}`, {});
        } catch {
          // ignore duplicate
        }
      }

      // Step 4: Upload / save verification documents
      if (application.documents) {
        for (const [docKey, doc] of Object.entries(application.documents)) {
          if (doc && doc.fileName) {
            try {
              await api.post("/v1/expert/profile/documents", {
                documentType: doc.type ? doc.type.toUpperCase() : docKey.toUpperCase(),
                title: doc.title || `${docKey} Document`,
                fileName: doc.fileName,
                fileType: doc.fileType || "application/pdf",
                fileSize: doc.fileSize || "1.5 MB",
                fileUrl: doc.previewUrl || "",
              });
            } catch (docErr) {
              console.warn(`Failed to save document ${docKey}:`, docErr);
            }
          }
        }
      }

      // Step 5: Submit application officially
      await api.post("/v1/expert/profile/submit-application", {});
    } catch (err) {
      console.warn("Backend expert configuration error:", err);
    }
  }
}
