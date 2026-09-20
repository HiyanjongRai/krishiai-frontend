/**
 * Default crop image mappings matching the backend seed data in DataInitializer.java.
 * These URLs are verified and seeded directly by the KrishiAI backend.
 */
export const BACKEND_CROP_IMAGES: Record<string, string> = {
  apple: "https://w7.pngwing.com/pngs/973/255/png-transparent-red-apple-apple-fruit-apple-natural-foods-food-grocery-store-thumbnail.png",
  mango: "https://w7.pngwing.com/pngs/446/952/png-transparent-ripe-mangos-banganapalle-alphonso-mango-fruit-benishan-mango-natural-foods-food-citrus-thumbnail.png",
  papaya: "https://w7.pngwing.com/pngs/118/507/png-transparent-several-ripe-papaya-fruits-papaya-auglis-seed-food-fruit-papaya-nutrition-eating-green-papaya-thumbnail.png",
  rice: "https://w7.pngwing.com/pngs/914/984/png-transparent-paddy-rice-rice-rice-hedao-paddy-rice-hedao-thumbnail.png",
  maize: "https://w7.pngwing.com/pngs/639/23/png-transparent-crop-maize-cereal-barrix-agro-sciences-private-limited-vegetable-corn-maize-s-food-pumpkin-millet-thumbnail.png",
  wheat: "https://w7.pngwing.com/pngs/979/140/png-transparent-brown-wheats-illustration-common-wheat-wheat-germ-oil-gluten-cereal-germ-food-wheat-oat-nutrition-whole-grain-thumbnail.png",
  millet: "https://w7.pngwing.com/pngs/419/116/png-transparent-finger-millet-cereal-seed-popcorn-popcorn-food-five-spice-powder-millet-thumbnail.png",
  potato: "https://w7.pngwing.com/pngs/74/390/png-transparent-mashed-potato-french-fries-potato-wedges-baked-potato-potato-chip-vegetable-food-baking-tomato-thumbnail.png",
  mustard: "https://w7.pngwing.com/pngs/350/543/png-transparent-mustard-plant-rapeseed-brassica-rapa-brassica-juncea-mustard-plant-stem-cabbage-flower-thumbnail.png",
  lentil: "https://w7.pngwing.com/pngs/551/510/png-transparent-legume-vegetarian-cuisine-mung-bean-lentil-mung-thumbnail.png",
  sugarcane: "https://w7.pngwing.com/pngs/525/609/png-transparent-green-sugarcane-sugarcane-saccharum-officinarum-icon-green-cane-cane-sugar-cane-real-shot-chart-food-green-apple-fruit-thumbnail.png",
  tomato: "https://w7.pngwing.com/pngs/689/481/png-transparent-tomato-tomato-natural-foods-food-nightshade-family-thumbnail.png",
  cauliflower: "https://w7.pngwing.com/pngs/31/763/png-transparent-white-cauliflower-frutti-di-bosco-vegetable-fruit-cauliflower-cauliflower-leaf-vegetable-food-cooking-thumbnail.png",
  "large cardamom": "https://w1.pngwing.com/pngs/306/989/png-transparent-green-tea-cardamom-true-cardamom-spice-black-cardamom-garam-masala-food-nutmeg-thumbnail.png",
  cardamom: "https://w1.pngwing.com/pngs/306/989/png-transparent-green-tea-cardamom-true-cardamom-spice-black-cardamom-garam-masala-food-nutmeg-thumbnail.png",
  tea: "https://w7.pngwing.com/pngs/644/368/png-transparent-green-tea-herbal-tea-tea-bag-green-tea-leaf-tea-herbal-tea-thumbnail.png",
};

/**
 * Returns a valid crop image URL either from the provided imageUrl or resolved by crop name.
 */
export function getCropImageUrl(
  nameOrCrop?: string | { name?: string; cropName?: string; imageUrl?: string | null } | null
): string | null {
  if (!nameOrCrop) return null;

  if (typeof nameOrCrop === "object") {
    if (nameOrCrop.imageUrl && nameOrCrop.imageUrl.trim().length > 0) {
      return nameOrCrop.imageUrl.trim();
    }
    const name = nameOrCrop.name || nameOrCrop.cropName;
    if (!name) return null;
    return resolveByName(name);
  }

  return resolveByName(nameOrCrop);
}

function resolveByName(name: string): string | null {
  const clean = name.trim().toLowerCase();
  if (BACKEND_CROP_IMAGES[clean]) {
    return BACKEND_CROP_IMAGES[clean];
  }

  // Partial match checks (e.g., "Rice (Paddy)" -> "rice", "Maize (Corn)" -> "maize")
  for (const [key, url] of Object.entries(BACKEND_CROP_IMAGES)) {
    if (clean.includes(key) || key.includes(clean)) {
      return url;
    }
  }

  return null;
}
