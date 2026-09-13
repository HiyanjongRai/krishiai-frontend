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
  {
    id: "Rice (Paddy)",
    name: "Rice (Paddy)",
    nepaliName: "धान",
    image: "/images/crops/rice.png",
    category: "Cereals",
  },
  {
    id: "Tomato",
    name: "Tomato",
    nepaliName: "गोलभेंडा",
    image: "/images/crops/tomato.png",
    category: "Vegetables",
  },
  {
    id: "Maize (Corn)",
    name: "Maize (Corn)",
    nepaliName: "मकै",
    image: "/images/crops/maize.png",
    category: "Cereals",
  },
  {
    id: "Potato",
    name: "Potato",
    nepaliName: "आलु",
    image: "/images/crops/patato1.png",
    category: "Vegetables",
  },
  {
    id: "Wheat",
    name: "Wheat",
    nepaliName: "गहुँ",
    image: "/images/crops/wheat.png",
    category: "Cereals",
  },
  {
    id: "Apple",
    name: "Apple",
    nepaliName: "स्याउ",
    image: "/images/crops/apple.png",
    category: "Fruits",
  },
  {
    id: "Mandarin Orange",
    name: "Mandarin Orange",
    nepaliName: "सुन्तला",
    image: "/images/crops/orange.png",
    category: "Fruits",
  },
  {
    id: "Large Cardamom",
    name: "Large Cardamom",
    nepaliName: "अलैँची",
    image: "/images/crops/cardamom.png",
    category: "Cash Crops",
  },
  {
    id: "Tea",
    name: "Tea",
    nepaliName: "चिया",
    image: "/images/crops/tea.png",
    category: "Cash Crops",
  },
  {
    id: "Mustard",
    name: "Mustard",
    nepaliName: "तोरी",
    image: "/images/crops/mustard.png",
    category: "Cash Crops",
  },
  {
    id: "Lentil",
    name: "Lentil",
    nepaliName: "मुसुरो",
    image: "/images/crops/lentil.png",
    category: "Legumes",
  },
  {
    id: "Cauliflower",
    name: "Cauliflower",
    nepaliName: "काउली",
    image: "/images/crops/cauliflower.png",
    category: "Vegetables",
  },
];

export const SPECIALIZATIONS_CATALOG: SpecializationItem[] = [
  {
    id: "PEST_DISEASE",
    name: "Crop Disease Management",
    description: "Diagnosis and remediation of fungal, bacterial, and viral plant pathogens.",
  },
  {
    id: "SOIL_HEALTH",
    name: "Soil Health & Nutrient Management",
    description: "Soil pH balancing, organic matter enhancement, and micronutrient calibration.",
  },
  {
    id: "ORGANIC_FARMING",
    name: "Organic & Sustainable Farming",
    description: "Drip systems, precision moisture monitoring, and furrow management.",
  },
  {
    id: "IRRIGATION",
    name: "Irrigation & Water Conservation",
    description: "Drip irrigation, rainwater harvesting, drought management.",
  },
  {
    id: "AGRONOMY",
    name: "Agronomy & Crop Production",
    description: "Crop rotation, varietal selection, optimal sowing and harvesting.",
  },
  {
    id: "HORTICULTURE",
    name: "Horticulture & Greenhouse Farming",
    description: "Protected polyhouse cultivation, nursery management, grafting.",
  },
  {
    id: "POST_HARVEST",
    name: "Post-Harvest Technology",
    description: "High-yield hybrid varieties, seed treatment, and nursery management.",
  },
  {
    id: "AGRI_ECONOMICS",
    name: "Agri-Economics & Market Linkage",
    description: "Yield forecasting, labor optimization, and operational budgeting.",
  },
];

export const LOCATIONS_CATALOG = [
  { id: "koshi", name: "Koshi Province", nepaliName: "कोशी प्रदेश", type: "PROVINCE" as const },
  { id: "Jhapa", name: "Jhapa", nepaliName: "झापा", type: "DISTRICT" as const },
  { id: "Ilam", name: "Ilam", nepaliName: "इलाम", type: "DISTRICT" as const },
  { id: "Morang", name: "Morang", nepaliName: "मोरङ", type: "DISTRICT" as const },
  { id: "madhesh", name: "Madhesh Province", nepaliName: "मधेश प्रदेश", type: "PROVINCE" as const },
  { id: "Dhanusha", name: "Dhanusha", nepaliName: "धनुषा", type: "DISTRICT" as const },
  { id: "Sarlahi", name: "Sarlahi", nepaliName: "सर्लाही", type: "DISTRICT" as const },
  { id: "bagmati", name: "Bagmati Province", nepaliName: "बागमती प्रदेश", type: "PROVINCE" as const },
  { id: "Kathmandu", name: "Kathmandu", nepaliName: "काठमाडौँ", type: "DISTRICT" as const },
  { id: "Lalitpur", name: "Lalitpur", nepaliName: "ललितपुर", type: "DISTRICT" as const },
  { id: "Bhaktapur", name: "Bhaktapur", nepaliName: "भक्तपुर", type: "DISTRICT" as const },
  { id: "Chitwan", name: "Chitwan", nepaliName: "चितवन", type: "DISTRICT" as const },
  { id: "Kavrepalanchok", name: "Kavrepalanchok", nepaliName: "काभ्रेपलाञ्चोक", type: "DISTRICT" as const },
  { id: "gandaki", name: "Gandaki Province", nepaliName: "गण्डकी प्रदेश", type: "PROVINCE" as const },
  { id: "Kaski", name: "Kaski", nepaliName: "कास्की", type: "DISTRICT" as const },
  { id: "Mustang", name: "Mustang", nepaliName: "मुस्ताङ", type: "DISTRICT" as const },
  { id: "lumbini", name: "Lumbini Province", nepaliName: "लुम्बिनी प्रदेश", type: "PROVINCE" as const },
  { id: "Rupandehi", name: "Rupandehi", nepaliName: "रुपन्देही", type: "DISTRICT" as const },
  { id: "Kapilvastu", name: "Kapilvastu", nepaliName: "कपिलवस्तु", type: "DISTRICT" as const },
  { id: "karnali", name: "Karnali Province", nepaliName: "कर्णाली प्रदेश", type: "PROVINCE" as const },
  { id: "Jumla", name: "Jumla", nepaliName: "जुम्ला", type: "DISTRICT" as const },
  { id: "sudurpashchim", name: "Sudurpashchim Province", nepaliName: "सुदूरपश्चिम प्रदेश", type: "PROVINCE" as const },
  { id: "Kailali", name: "Kailali", nepaliName: "कैलाली", type: "DISTRICT" as const },
];

export interface ExpertiseAreaItem {
  id: string;
  name: string;
  description: string;
  iconName?: string;
}

export const EXPERTISE_AREAS_CATALOG: ExpertiseAreaItem[] = [
  {
    id: "CROP_PRODUCTION",
    name: "Crop Production",
    description: "Field crops, seed selection, planting schedules, and agronomic management.",
  },
  {
    id: "PEST_MANAGEMENT",
    name: "Pest Management",
    description: "Integrated pest management (IPM), biological controls, and safe pesticide usage.",
  },
  {
    id: "DISEASE_MANAGEMENT",
    name: "Disease Management",
    description: "Early diagnosis, fungicide programs, and pathogen containment in fields & greenhouses.",
  },
  {
    id: "SOIL_MANAGEMENT",
    name: "Soil Management",
    description: "Soil fertility testing, pH correction, organic matter, and compost enrichment.",
  },
  {
    id: "IRRIGATION",
    name: "Irrigation",
    description: "Drip, sprinkler, moisture conservation, and seasonal drainage systems.",
  },
  {
    id: "HORTICULTURE",
    name: "Horticulture",
    description: "High-value fruits, vegetables, floriculture, grafting, and nursery cultivation.",
  },
  {
    id: "ORGANIC_FARMING",
    name: "Organic Farming",
    description: "Bio-fertilizers, natural repellents, organic certification standards, and composting.",
  },
  {
    id: "PLANT_NUTRITION",
    name: "Plant Nutrition",
    description: "NPK ratios, micronutrient deficiency correction, and foliar spray schedules.",
  },
  {
    id: "PROTECTED_CULTIVATION",
    name: "Protected Cultivation",
    description: "Polyhouse design, greenhouse climate control, and tunnel farming techniques.",
  },
  {
    id: "OTHER",
    name: "Other",
    description: "Customized or specialized agricultural disciplines.",
  },
];

