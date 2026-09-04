import { Disease } from "@/types/disease";

export const sampleDiseases: Disease[] = [
  {
    id: "dis-1",
    name: "Early Blight",
    scientificName: "Alternaria solani",
    cropCategory: "Solanaceae (Tomato, Potato)",
    symptoms: [
      "Circular brown concentric target spots on older leaves",
      "Yellowing halo surrounding lesions",
      "Stem lesions with dark concentric rings",
    ],
    preventions: [
      "Ensure proper plant spacing for air circulation",
      "Drip irrigation rather than overhead spraying",
      "Rotate crops with non-solanaceous plants",
    ],
    treatments: [
      "Remove and safely dispose of infected foliage",
      "Apply copper-based fungicides or bio-fungicides (Trichoderma)",
      "Avoid handling wet plants",
    ],
    severity: "MEDIUM",
  },
  {
    id: "dis-2",
    name: "Late Blight",
    scientificName: "Phytophthora infestans",
    cropCategory: "Potato, Tomato",
    symptoms: [
      "Water-soaked dark lesions",
      "White fungal fuzzy growth on leaf undersides during humid weather",
    ],
    preventions: ["Use certified disease-free seeds", "Avoid excessive moisture"],
    treatments: ["Immediate systemic fungicide application", "Pruning"],
    severity: "HIGH",
  },
];
