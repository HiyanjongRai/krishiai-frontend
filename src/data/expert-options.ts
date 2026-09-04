import { CropExpertiseItem, SpecializationItem, ProfessionalTitle } from "@/types/expert-application";

export const PROFESSIONAL_TITLES: ProfessionalTitle[] = [
  "Agricultural Consultant",
  "Agricultural Scientist",
  "Agriculture Officer",
  "Agriculture Graduate",
  "Agrovet Professional",
  "Researcher",
  "Experienced Farmer",
  "Plant Pathologist",
  "Soil Scientist",
  "Other",
];

export const HIGHEST_QUALIFICATIONS = [
  "B.Sc. Agriculture (Honours)",
  "M.Sc. Agriculture (Agronomy / Pathology / Entomology)",
  "Ph.D. in Agricultural Sciences",
  "Diploma in Agriculture (I.Sc. Ag / CTEVT)",
  "B.Tech / B.E. Agricultural Engineering",
  "M.Sc. Soil Science",
  "Master of Veterinary Science (M.V.Sc)",
  "Other Certified Agricultural Training",
];

export const CROPS_CATALOG: CropExpertiseItem[] = [
  { id: "rice", name: "Rice (Paddy)", nepaliName: "धान", emoji: "🌾", category: "Cereals" },
  { id: "tomato", name: "Tomato", nepaliName: "गोलभेंडा", emoji: "🍅", category: "Vegetables" },
  { id: "maize", name: "Maize (Corn)", nepaliName: "मकै", emoji: "🌽", category: "Cereals" },
  { id: "potato", name: "Potato", nepaliName: "आलु", emoji: "🥔", category: "Vegetables" },
  { id: "wheat", name: "Wheat", nepaliName: "गहुँ", emoji: "🌾", category: "Cereals" },
  { id: "pulses", name: "Pulses & Lentils", nepaliName: "दाल / गेडागुडी", emoji: "🫘", category: "Legumes" },
  { id: "leafy_veg", name: "Leafy Vegetables", nepaliName: "सागपात", emoji: "🥬", category: "Vegetables" },
  { id: "fruits", name: "Apples & Citrus Fruits", nepaliName: "फलफूल", emoji: "🍎", category: "Fruits" },
  { id: "coffee", name: "Highland Coffee", nepaliName: "कफी", emoji: "☕", category: "Cash Crops" },
  { id: "tea", name: "Tea Leaves", nepaliName: "चिया", emoji: "🍵", category: "Cash Crops" },
  { id: "onion_garlic", name: "Onion & Garlic", nepaliName: "प्याज र लसुन", emoji: "🧅", category: "Vegetables" },
  { id: "spices", name: "Ginger & Cardamom", nepaliName: "अदुवा र अलैंची", emoji: "🫚", category: "Cash Crops" },
];

export const SPECIALIZATIONS_CATALOG: SpecializationItem[] = [
  {
    id: "crop_disease",
    name: "Crop Disease Management",
    description: "Diagnosis and remediation of fungal, bacterial, and viral plant pathogens.",
  },
  {
    id: "pest_management",
    name: "Integrated Pest Management (IPM)",
    description: "Biological, cultural, and targeted chemical control of destructive crop pests.",
  },
  {
    id: "soil_management",
    name: "Soil Health & Nutrient Management",
    description: "Soil pH balancing, organic matter enhancement, and micronutrient calibration.",
  },
  {
    id: "irrigation",
    name: "Smart Irrigation & Water Harvesting",
    description: "Drip systems, precision moisture monitoring, and furrow management.",
  },
  {
    id: "organic_farming",
    name: "Organic Farming & Bio-fertilizers",
    description: "Zero-chemical cultivation, vermicomposting, and organic certification standards.",
  },
  {
    id: "greenhouse",
    name: "Greenhouse & Polyhouse Cultivation",
    description: "Controlled environment agriculture, climate tuning, and off-season production.",
  },
  {
    id: "crop_nutrition",
    name: "Crop Nutrition & Foliar Sprays",
    description: "Targeted NPK application schedules and physiological stress recovery.",
  },
  {
    id: "seed_selection",
    name: "Seed Selection & Germination",
    description: "High-yield hybrid varieties, seed treatment, and nursery management.",
  },
  {
    id: "farm_management",
    name: "Commercial Farm Management",
    description: "Yield forecasting, labor optimization, and operational budgeting.",
  },
  {
    id: "post_harvest",
    name: "Post-Harvest Handling & Storage",
    description: "Cold storage techniques, moisture testing, sorting, and packaging standards.",
  },
];
