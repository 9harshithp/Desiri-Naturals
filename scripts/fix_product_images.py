#!/usr/bin/env python3
"""Fix product images in seed_catalog.sql with correct, product-specific images."""

import re
import shutil

PRODUCT_IMAGE_MAP = {
    # OILS - container-specific handled below
    "groundnut oil": "/images/desiri-tin-can.png",
    "coconut oil": "/images/desiri-tin-can.png",
    "sesame": "/images/desiri-glass-bottle.png",
    "niger oil": "/images/desiri-glass-bottle.png",
    "safflower oil": "/images/desiri-glass-bottle.png",
    "mustard oil": "/images/desiri-tin-can.png",
    "castor oil": "/images/desiri-glass-bottle.png",
    "neem oil": "/images/desiri-glass-bottle.png",
    "almond oil": "/images/desiri-glass-bottle.png",
    "flaxseed oil": "/images/desiri-glass-bottle.png",
    "walnut oil": "/images/desiri-glass-bottle.png",
    "cotton seed oil": "/images/desiri-tin-can.png",
    "pancha deepa": "/images/desiri-glass-bottle.png",
    # GAU PRODUCTS
    "ghee": "/images/cat-dairy.png",
    "butter": "/images/milk.png",
    "panchagavya": "/images/cat-dairy.png",
    "cow dung": "/images/phil-zero-waste.png",
    # MILLETS
    "foxtail millet": "/images/phil-chemical-free.png",
    "finger millet": "/images/phil-chemical-free.png",
    "ragi": "/images/phil-chemical-free.png",
    "pearl millet": "/images/phil-chemical-free.png",
    "bajra": "/images/phil-chemical-free.png",
    "jowar": "/images/phil-chemical-free.png",
    "little millet": "/images/phil-chemical-free.png",
    "kodo millet": "/images/phil-chemical-free.png",
    "proso millet": "/images/phil-chemical-free.png",
    "barnyard millet": "/images/phil-chemical-free.png",
    "browntop millet": "/images/phil-chemical-free.png",
    "millet": "/images/phil-chemical-free.png",
    "rava": "/images/phil-water-smart.png",
    "flour": "/images/phil-water-smart.png",
    "flakes": "/images/phil-chemical-free.png",
    # GRAINS
    "red rice": "/images/phil-water-smart.png",
    "rice": "/images/phil-water-smart.png",
    "wheat": "/images/phil-water-smart.png",
    "khapli": "/images/phil-water-smart.png",
    "emmer": "/images/phil-water-smart.png",
    "dal": "/images/phil-water-smart.png",
    # SWEETENERS
    "jaggery": "/images/phil-lab-certified.png",
    "honey": "/images/phil-lab-certified.png",
    "mishri": "/images/phil-lab-certified.png",
    # SNACKS
    "chikki": "/images/phil-women-led.png",
    "laddu": "/images/phil-women-led.png",
    "laddoo": "/images/phil-women-led.png",
    "pops": "/images/phil-women-led.png",
    "papad": "/images/phil-women-led.png",
    "chivda": "/images/phil-women-led.png",
    # SPICES
    "turmeric": "/images/cat-vegetables.png",
    "pepper": "/images/cat-vegetables.png",
    "coriander": "/images/cat-vegetables.png",
    "cumin": "/images/cat-vegetables.png",
    "spice": "/images/cat-vegetables.png",
    "masala": "/images/cat-vegetables.png",
    "salt": "/images/cat-vegetables.png",
    "fenugreek": "/images/cat-vegetables.png",
    # POOJA / HERBS
    "kumkum": "/images/phil-zero-waste.png",
    "vibhuti": "/images/phil-zero-waste.png",
    "camphor": "/images/phil-zero-waste.png",
    "agarbatti": "/images/phil-zero-waste.png",
    "pooja": "/images/phil-zero-waste.png",
    "herb": "/images/cat-vegetables.png",
    "ashwagandha": "/images/cat-vegetables.png",
    "moringa": "/images/cat-vegetables.png",
    "tulsi": "/images/cat-vegetables.png",
    # BODY CARE
    "soap": "/images/farmer.png",
    "shampoo": "/images/farmer.png",
    "lotion": "/images/farmer.png",
    "cream": "/images/farmer.png",
    "balm": "/images/farmer.png",
    "face wash": "/images/farmer.png",
    "scrub": "/images/farmer.png",
    "hair oil": "/images/desiri-glass-bottle.png",
    # CATTLE FEED
    "pashugrasa": "/images/phil-bull-powered.png",
    "cattle": "/images/phil-bull-powered.png",
    "oilcake": "/images/phil-bull-powered.png",
    "oil cake": "/images/phil-bull-powered.png",
    "groundnut cake": "/images/phil-bull-powered.png",
    "coconut cake": "/images/phil-bull-powered.png",
    "sesame cake": "/images/phil-bull-powered.png",
    "niger cake": "/images/phil-bull-powered.png",
    "safflower cake": "/images/phil-bull-powered.png",
    "cotton cake": "/images/phil-bull-powered.png",
    "feed": "/images/phil-bull-powered.png",
    # OTHERS
    "copper": "/images/box.png",
    "brass": "/images/box.png",
    "steel": "/images/box.png",
    "plate": "/images/box.png",
    "bowl": "/images/box.png",
    "tumbler": "/images/box.png",
    "bio-enzyme": "/images/box.png",
    "cleaner": "/images/box.png",
    # FRUITS & VEGETABLES
    "mango": "/images/mangoes.png",
    "tomato": "/images/tomatoes.png",
    "spinach": "/images/spinach.png",
    "vegetable": "/images/cat-vegetables.png",
    "fruit": "/images/cat-fruits.png",
    # HEALTHY DRINKS
    "sanjeevini": "/images/spinach.png",
    "drink": "/images/spinach.png",
    "tonic": "/images/spinach.png",
}

def get_image_for_product(name: str) -> str:
    n = name.lower()
    # Container-specific for oils
    if any(oil in n for oil in ["oil", "ghee", "butter"]):
        if "glass bottle" in n or "glass" in n:
            return "/images/desiri-glass-bottle.png"
        if "tin can" in n or "tin" in n:
            return "/images/desiri-tin-can.png"
        if "vessel" in n:
            return "/images/desiri-tin-can.png"
    # Keyword map (longest match first)
    for key in sorted(PRODUCT_IMAGE_MAP.keys(), key=len, reverse=True):
        if key in n:
            return PRODUCT_IMAGE_MAP[key]
    return "/images/desiri-tin-can.png"

def fix_seed(path: str):
    shutil.copy2(path, path + ".bak")
    print(f"Backup: {path}.bak")

    with open(path) as f:
        lines = f.readlines()

    output = []
    current_name = None
    changed = 0

    for line in lines:
        stripped = line.strip()
        # Detect product name (first string in VALUES line that's not a desc)
        nm = re.match(r"^\s+'([^']{3,80})',\s+'[^']{10,}", line)
        if nm and "Desiri Heritage Groves" not in line and "Mysore Rural" not in line and "bull-driven" not in line:
            current_name = nm.group(1)

        # Detect image_url line: "    false/true, '/images/...', 150, ..."
        img_m = re.match(r"^(\s+(?:true|false),\s+)'(/images/[^']+)'(,\s+\d+.*)$", line)
        if img_m and current_name:
            new_img = get_image_for_product(current_name)
            old_img = img_m.group(2)
            if old_img != new_img:
                line = f"{img_m.group(1)}'{new_img}'{img_m.group(3)}\n"
                changed += 1
                print(f"  [{changed}] {current_name[:45]:<45} {old_img} → {new_img}")

        output.append(line)

    with open(path, "w") as f:
        f.writelines(output)

    print(f"\n✅ Done — {changed} image URLs updated in {path}")

fix_seed("/home/gs/Downloads/desiri/Desiri-Naturals/scripts/seed_catalog.sql")
