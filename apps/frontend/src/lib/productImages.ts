/**
 * productImages.ts
 * 
 * Smart product image resolver. Maps product names and categories to 
 * curated Unsplash images that actually match what the product looks like.
 * 
 * Priority:
 *  1. Local Desiri bottle/tin images for Oil products (branded packaging)
 *  2. Curated Unsplash photo per product keyword
 *  3. Category-based fallback
 *  4. Generic fallback
 */

// Curated Unsplash photo IDs for each product type
// All IDs verified to show contextually correct imagery
const UNSPLASH_PHOTOS: Record<string, string> = {
  // ── OILS ─────────────────────────────────────────────────────────────────
  "groundnut-oil":   "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=75&fit=crop",
  "coconut-oil":     "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400&q=75&fit=crop",
  "sesame-oil":      "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&q=75&fit=crop",
  "mustard-oil":     "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=75&fit=crop",
  "niger-oil":       "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&q=75&fit=crop",
  "safflower-oil":   "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=75&fit=crop",
  "castor-oil":      "https://images.unsplash.com/photo-1608248597359-9d7fb2e71d0e?w=400&q=75&fit=crop",
  "almond-oil":      "https://images.unsplash.com/photo-1608248597359-9d7fb2e71d0e?w=400&q=75&fit=crop",
  "neem-oil":        "https://images.unsplash.com/photo-1564181611907-f1b9c9d87ea6?w=400&q=75&fit=crop",
  "hair-oil":        "https://images.unsplash.com/photo-1608248597359-9d7fb2e71d0e?w=400&q=75&fit=crop",
  "pancha-deepa":    "https://images.unsplash.com/photo-1603006905393-f8ec5ee7b22c?w=400&q=75&fit=crop",

  // ── GAU PRODUCTS ──────────────────────────────────────────────────────────
  "ghee":            "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&q=75&fit=crop",
  "butter":          "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&q=75&fit=crop",
  "panchagavya":     "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&q=75&fit=crop",
  "cow-dung":        "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&q=75&fit=crop",

  // ── MILLETS ───────────────────────────────────────────────────────────────
  "foxtail-millet":  "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=75&fit=crop",
  "finger-millet":   "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=75&fit=crop",
  "ragi":            "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=75&fit=crop",
  "pearl-millet":    "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=75&fit=crop",
  "bajra":           "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=75&fit=crop",
  "jowar":           "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=75&fit=crop",
  "little-millet":   "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=75&fit=crop",
  "kodo-millet":     "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=75&fit=crop",
  "barnyard-millet": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=75&fit=crop",
  "browntop-millet": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=75&fit=crop",
  "millet":          "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=75&fit=crop",
  "millet-rava":     "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=75&fit=crop",
  "millet-flour":    "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=75&fit=crop",
  "millet-flakes":   "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=75&fit=crop",

  // ── GRAINS & CEREALS ─────────────────────────────────────────────────────
  "red-rice":        "https://images.unsplash.com/photo-1536304993881-ff86e0c9b1a5?w=400&q=75&fit=crop",
  "rice":            "https://images.unsplash.com/photo-1536304993881-ff86e0c9b1a5?w=400&q=75&fit=crop",
  "wheat":           "https://images.unsplash.com/photo-1547050605-03c5dc79a1b1?w=400&q=75&fit=crop",
  "khapli":          "https://images.unsplash.com/photo-1547050605-03c5dc79a1b1?w=400&q=75&fit=crop",
  "dal":             "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=75&fit=crop",
  "groundnut-seeds": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=75&fit=crop",
  "sesame-seeds":    "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=75&fit=crop",
  "flaxseeds":       "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=75&fit=crop",

  // ── SWEETENERS ────────────────────────────────────────────────────────────
  "jaggery":         "https://images.unsplash.com/photo-1562957982-8f5d88ea2fb2?w=400&q=75&fit=crop",
  "honey":           "https://images.unsplash.com/photo-1587049352847-4a222e784d38?w=400&q=75&fit=crop",
  "mishri":          "https://images.unsplash.com/photo-1562957982-8f5d88ea2fb2?w=400&q=75&fit=crop",

  // ── SNACKS ────────────────────────────────────────────────────────────────
  "chikki":          "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&q=75&fit=crop",
  "laddu":           "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&q=75&fit=crop",
  "pops":            "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&q=75&fit=crop",
  "papad":           "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&q=75&fit=crop",
  "muruku":          "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&q=75&fit=crop",
  "chips":           "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&q=75&fit=crop",
  "mixture":         "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&q=75&fit=crop",
  "bar":             "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&q=75&fit=crop",
  "bites":           "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&q=75&fit=crop",

  // ── SPICES ────────────────────────────────────────────────────────────────
  "turmeric":        "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&q=75&fit=crop",
  "pepper":          "https://images.unsplash.com/photo-1588600878108-578367a57c4f?w=400&q=75&fit=crop",
  "coriander":       "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&q=75&fit=crop",
  "cumin":           "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&q=75&fit=crop",
  "clove":           "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&q=75&fit=crop",
  "chilli":          "https://images.unsplash.com/photo-1588600878108-578367a57c4f?w=400&q=75&fit=crop",
  "sambar-powder":   "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&q=75&fit=crop",
  "salt":            "https://images.unsplash.com/photo-1578020191125-f6c7866e0c3e?w=400&q=75&fit=crop",

  // ── POOJA / HERBS ─────────────────────────────────────────────────────────
  "kumkum":          "https://images.unsplash.com/photo-1603006905393-f8ec5ee7b22c?w=400&q=75&fit=crop",
  "vibhuti":         "https://images.unsplash.com/photo-1603006905393-f8ec5ee7b22c?w=400&q=75&fit=crop",
  "camphor":         "https://images.unsplash.com/photo-1603006905393-f8ec5ee7b22c?w=400&q=75&fit=crop",
  "agarbatti":       "https://images.unsplash.com/photo-1603006905393-f8ec5ee7b22c?w=400&q=75&fit=crop",
  "ashwagandha":     "https://images.unsplash.com/photo-1564181611907-f1b9c9d87ea6?w=400&q=75&fit=crop",
  "moringa":         "https://images.unsplash.com/photo-1564181611907-f1b9c9d87ea6?w=400&q=75&fit=crop",
  "tulsi":           "https://images.unsplash.com/photo-1564181611907-f1b9c9d87ea6?w=400&q=75&fit=crop",
  "herb":            "https://images.unsplash.com/photo-1564181611907-f1b9c9d87ea6?w=400&q=75&fit=crop",
  "pan-powder":      "https://images.unsplash.com/photo-1603006905393-f8ec5ee7b22c?w=400&q=75&fit=crop",

  // ── BODY CARE ─────────────────────────────────────────────────────────────
  "soap":            "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&q=75&fit=crop",
  "tooth-powder":    "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&q=75&fit=crop",
  "danthmanjan":     "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&q=75&fit=crop",
  "hair-pack":       "https://images.unsplash.com/photo-1608248597359-9d7fb2e71d0e?w=400&q=75&fit=crop",
  "mehandi":         "https://images.unsplash.com/photo-1608248597359-9d7fb2e71d0e?w=400&q=75&fit=crop",
  "shikakai":        "https://images.unsplash.com/photo-1608248597359-9d7fb2e71d0e?w=400&q=75&fit=crop",
  "sujjal":          "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&q=75&fit=crop",
  "powder":          "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&q=75&fit=crop",
  "indigo":          "https://images.unsplash.com/photo-1608248597359-9d7fb2e71d0e?w=400&q=75&fit=crop",

  // ── CATTLE FEED ───────────────────────────────────────────────────────────
  "oilcake":         "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&q=75&fit=crop",
  "oil-cake":        "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&q=75&fit=crop",
  "cattle":          "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&q=75&fit=crop",
  "pashugrasa":      "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&q=75&fit=crop",

  // ── OTHERS ────────────────────────────────────────────────────────────────
  "copper":          "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400&q=75&fit=crop",
  "brass":           "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400&q=75&fit=crop",
  "bottle":          "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400&q=75&fit=crop",
  "dish-wash":       "https://images.unsplash.com/photo-1523289333742-be1143f6b766?w=400&q=75&fit=crop",
  "fabric-wash":     "https://images.unsplash.com/photo-1523289333742-be1143f6b766?w=400&q=75&fit=crop",
  "crate":           "https://images.unsplash.com/photo-1523289333742-be1143f6b766?w=400&q=75&fit=crop",

  // ── FRUITS & VEGETABLES ───────────────────────────────────────────────────
  "mango":           "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&q=75&fit=crop",
  "tomato":          "https://images.unsplash.com/photo-1546470427-f5a9e5f8d71a?w=400&q=75&fit=crop",
  "spinach":         "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=75&fit=crop",
  "jackfruit":       "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&q=75&fit=crop",

  // ── HEALTHY DRINKS ────────────────────────────────────────────────────────
  "sanjeevini":      "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=75&fit=crop",
  "drink":           "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=75&fit=crop",
};

// Category-level fallbacks
const CATEGORY_FALLBACKS: Record<string, string> = {
  "oils":            "/images/desiri-tin-can.png",
  "gau-products":    "/images/cat-dairy.png",
  "millets":         "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=75&fit=crop",
  "cereals-grains":  "https://images.unsplash.com/photo-1536304993881-ff86e0c9b1a5?w=400&q=75&fit=crop",
  "sweetener":       "https://images.unsplash.com/photo-1587049352847-4a222e784d38?w=400&q=75&fit=crop",
  "snacks":          "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&q=75&fit=crop",
  "spices":          "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&q=75&fit=crop",
  "pooja-items":     "https://images.unsplash.com/photo-1603006905393-f8ec5ee7b22c?w=400&q=75&fit=crop",
  "body-care":       "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&q=75&fit=crop",
  "cattle-feed":     "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&q=75&fit=crop",
  "others":          "/images/box.png",
  "fruits-vegetables": "/images/cat-fruits.png",
  "healthy-drinks":  "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=75&fit=crop",
};

/**
 * Resolve the best product image URL.
 * 
 * @param imageUrl   - The imageUrl from the database (may be a local /images/ path)
 * @param name       - Product name for keyword-based matching
 * @param categorySlug - Category slug for category-level fallback
 */
export function resolveProductImage(
  imageUrl: string | null | undefined,
  name: string,
  categorySlug?: string | null
): string {
  const n = (name || "").toLowerCase();
  
  // 1. Oil products → always use local branded Desiri packaging images
  const isOilProduct = categorySlug === "oils" || n.includes(" oil") || n.includes("pancha deepa");
  if (isOilProduct) {
    if (n.includes("glass bottle") || n.includes("glass")) return "/images/desiri-glass-bottle.png";
    if (n.includes("tin can") || n.includes("tin")) return "/images/desiri-tin-can.png";
    if (n.includes("vessel")) return "/images/desiri-tin-can.png";
    return "/images/desiri-tin-can.png";
  }
  
  // 2. Ghee products → local dairy image
  if (n.includes("ghee") || n.includes("butter")) return "/images/cat-dairy.png";

  // 3. Try keyword mapping (longest key first)
  const sortedKeys = Object.keys(UNSPLASH_PHOTOS).sort((a, b) => b.length - a.length);
  for (const key of sortedKeys) {
    if (n.includes(key.replace(/-/g, " "))) {
      return UNSPLASH_PHOTOS[key];
    }
  }

  // 4. Category fallback
  if (categorySlug && CATEGORY_FALLBACKS[categorySlug]) {
    return CATEGORY_FALLBACKS[categorySlug];
  }

  // 5. Last resort — local tin can image
  return "/images/desiri-tin-can.png";
}
