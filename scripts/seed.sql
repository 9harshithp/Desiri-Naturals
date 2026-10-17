-- Clear existing sample data
TRUNCATE TABLE users, categories, farms, products, subscription_boxes RESTART IDENTITY CASCADE;

-- Insert Users (admin and demo customer)
INSERT INTO users (name, email, password_hash, role, phone) VALUES
('Admin User', 'admin@farm2me.in', '$2b$10$TUHJPoFlBJrCuC0MwtBPZukwiUWXnHKQObxZgD9akoIenLcX0.CgO', 'admin', '+91 98765 43210'),
('Demo Customer', 'demo@farm2me.in', '$2b$10$IVCtWecJ7Btv0qI6FhYEpehPBDFvdyryCdDA7N1R66NSyW2846jXO', 'customer', '+91 98765 12345');

-- Insert Categories
INSERT INTO categories (name, slug, image_url, product_count, description) VALUES
('Cold Pressed Oils', 'cold-pressed-oils', '/images/cat-oils.png', 6, 'Authentic bull-driven wooden ghani oils extracted at 2-3 RPM without heat or solvents'),
('Desi Ghee & Dairy', 'dairy', '/images/cat-dairy.png', 2, 'Vedic bilona churned A2 Gir cow ghee and pure grass-fed dairy products'),
('Natural Sweeteners', 'natural-sweeteners', '/images/cat-fruits.png', 2, 'Unheated wild forest raw honey and mineral-rich organic sugarcane jaggery'),
('Whole Grains & Millets', 'grains-millets', '/images/cat-vegetables.png', 2, 'Unpolished indigenous millets and stone-ground ancient grains'),
('Fresh Farm Produce', 'fresh-produce', '/images/cat-vegetables.png', 3, 'Harvested at dawn and delivered within 24 hours directly from partner farms');

-- Insert Farms
INSERT INTO farms (name, location, state, description, story, image_url, cover_image_url, established, certifications, product_count, farmer_name, farmer_image_url) VALUES
('Desiri Heritage Groves', 'Mysore Rural', 'Karnataka', 'Dedicated to traditional bull-driven oil extraction and chemical-free heritage farming.', 'Founded with a mission to revive ancestral bull-powered ghani oil pressing, keeping micro-nutrients completely unharmed and supporting local indigenous cattle breeds.', '/images/farmer.png', '/images/farm-landscape.png', 2017, ARRAY['Jaivik Bharat', 'India Organic', 'Vedic Certified', 'FSSAI Approved'], 5, 'Ramesh Gowda', '/images/farmer.png'),
('Krishna Valley Organics', 'Guntur', 'Andhra Pradesh', 'Specializing in natural heirloom pulses, cold-pressed mustard oil, and indigenous greens.', 'Three generations of regenerative farming using Jeevamrutha, Ghana Jeevamrutha, and zero synthetic inputs.', '/images/farmer.png', '/images/farm-landscape.png', 2014, ARRAY['Participatory Guarantee System (PGS)', 'NPOP Certified'], 4, 'Srinivasa Rao', '/images/farmer.png'),
('Sahyadri Flora Bio-Reserve', 'Satara', 'Maharashtra', 'Nestled in the Western Ghats producing pure unheated raw honey and native Alphonso mangoes.', 'Beekeeping and sustainable forest foraging supporting biodiversity and indigenous tribal bee foragers.', '/images/farmer.png', '/images/farm-landscape.png', 2019, ARRAY['EcoCert Organic', 'FSSAI Certified'], 3, 'Aniket Patil', '/images/farmer.png');

-- Insert Products
INSERT INTO products (name, description, price, unit, category_slug, category_name, farm_id, farm_name, farm_location, is_organic, is_seasonal, is_featured, image_url, stock, rating, review_count, badges, freshness_score) VALUES
-- Bull Driven Oils
('Bull-Driven Cold Pressed Groundnut Oil', 'Extracted using traditional wooden expellers (Vaagai mara chekku) powered by indigenous desi bulls at 2-3 RPM. Frictional heat stays under 35°C to preserve natural antioxidants, nutty aroma, and heart-healthy phytosterols.', 420.00, '1 Litre', 'cold-pressed-oils', 'Cold Pressed Oils', 1, 'Desiri Heritage Groves', 'Mysore Rural, Karnataka', true, false, true, '/images/phil-bull-powered.png', 150, 4.9, 48, ARRAY['Bull-Driven', 'Cold-Pressed', 'Chemical-Free', 'Unrefined'], 98),
('Bull-Driven Virgin Coconut Oil', 'Crafted from sun-dried sulphur-free copra of coastal coconuts using bull-powered ghani. Mild, fresh aroma ideal for raw consumption, Kerala cooking, and skin wellness.', 480.00, '1 Litre', 'cold-pressed-oils', 'Cold Pressed Oils', 1, 'Desiri Heritage Groves', 'Mysore Rural, Karnataka', true, false, true, '/images/cat-oils.png', 110, 4.9, 36, ARRAY['Bull-Driven', 'Raw Copra', 'Unbleached'], 96),
('Bull-Driven Black Sesame Oil (Til / Gingelly)', 'Traditional Kari Ellu oil extracted with organic jaggery in wooden ghani. Packed with sesamol and calcium, known for body cooling and authentic South Indian tempering.', 560.00, '1 Litre', 'cold-pressed-oils', 'Cold Pressed Oils', 1, 'Desiri Heritage Groves', 'Mysore Rural, Karnataka', true, false, true, '/images/cat-oils.png', 85, 4.8, 29, ARRAY['Bull-Driven', 'High Calcium', 'Traditional Til'], 95),
('Wood-Pressed Kachi Ghani Mustard Oil', 'Slowly pressed from whole black mustard seeds. Unfiltered with its natural pungent allyl isothiocyanate preserved, offering high smoke point and traditional punch.', 340.00, '1 Litre', 'cold-pressed-oils', 'Cold Pressed Oils', 2, 'Krishna Valley Organics', 'Guntur, Andhra Pradesh', true, false, true, '/images/cat-oils.png', 120, 4.8, 24, ARRAY['Wood-Pressed', 'Unrefined', 'Pungent'], 95),
('Bull-Driven Safflower Oil (Kusube Enne)', 'Ancestral heart-friendly cooking oil with high linoleic acid and light texture. Pressed without solvent extraction from chemical-free safflower seeds.', 390.00, '1 Litre', 'cold-pressed-oils', 'Cold Pressed Oils', 1, 'Desiri Heritage Groves', 'Mysore Rural, Karnataka', true, false, false, '/images/cat-oils.png', 70, 4.7, 18, ARRAY['Bull-Driven', 'Heart-Friendly'], 93),
('Traditional Boiled Castor Oil (Haralu Enne)', 'Prepared following ancient Ayurvedic methodology using slow woodfire heating. Highly viscous and soothing for digestive wellness, hair roots, and joint massage.', 260.00, '500 ml', 'cold-pressed-oils', 'Cold Pressed Oils', 1, 'Desiri Heritage Groves', 'Mysore Rural, Karnataka', true, false, false, '/images/cat-oils.png', 60, 4.8, 15, ARRAY['Ayurvedic Grade', 'Zero Chemicals'], 92),

-- Desi Ghee & Dairy
('A2 Desi Cow Bilona Cultured Ghee', 'Handcrafted from whole curd of free-grazing indigenous Gir & Hallikar cows using the Vedic bi-directional bilona method in earthen pots. Rich in butyric acid with a golden granular texture and heavenly aroma.', 850.00, '500 ml', 'dairy', 'Desi Ghee & Dairy', 1, 'Desiri Heritage Groves', 'Mysore Rural, Karnataka', true, false, true, '/images/milk.png', 80, 5.0, 72, ARRAY['A2 Cultured', 'Bilona Churned', 'Grass-Fed', 'Lab-Certified'], 99),
('Farm Fresh Raw A2 Cow Milk', 'Single-origin unhomogenized whole milk collected at 5 AM from pasture-fed desi cows, chilled immediately and delivered raw within 6 hours.', 75.00, '1 Litre', 'dairy', 'Desi Ghee & Dairy', 1, 'Desiri Heritage Groves', 'Mysore Rural, Karnataka', true, false, true, '/images/milk.png', 40, 4.9, 31, ARRAY['Same Day', 'Unhomogenized', 'A2 Beta-Casein'], 100),

-- Natural Sweeteners
('Wild Forest Raw Unpasteurized Honey', 'Single-origin multifloral honey gathered from deep Western Ghat forests by indigenous bee foragers. Unfiltered, unheated, and rich in natural bee pollen and enzymes.', 490.00, '500 g', 'natural-sweeteners', 'Natural Sweeteners', 3, 'Sahyadri Flora Bio-Reserve', 'Satara, Maharashtra', true, false, true, '/images/mangoes.png', 90, 4.9, 34, ARRAY['Wild Forest', 'Unpasteurized', 'Raw Pollen'], 96),
('Organic Sugarcane Jaggery Powder (Bella)', 'Naturally clarified using plant okra extract without sodium hydrosulphite or chemical bleach. Pure, dark, mineral-rich iron alternative to refined white sugar.', 140.00, '1 kg', 'natural-sweeteners', 'Natural Sweeteners', 2, 'Krishna Valley Organics', 'Guntur, Andhra Pradesh', true, false, true, '/images/cat-fruits.png', 150, 4.8, 22, ARRAY['No Chemical Bleach', 'Iron Rich'], 94),

-- Millets & Ancient Grains
('Stone-Ground Khapli (Emmer) Wheat Flour', 'Ancient low-GI heirloom wheat milled on slow stone chakkis to retain the germ and bran. Easy to digest and rich in natural minerals.', 160.00, '1 kg', 'grains-millets', 'Whole Grains & Millets', 2, 'Krishna Valley Organics', 'Guntur, Andhra Pradesh', true, false, false, '/images/cat-vegetables.png', 100, 4.8, 19, ARRAY['Low GI', 'Stone-Ground', 'Heirloom'], 95),
('Unpolished Organic Foxtail Millet (Navane)', 'Traditionally de-husked without chemical polishing to preserve dietary fiber and B-complex vitamins. Ideal for diabetic-friendly khichdi, idli, and porridge.', 120.00, '1 kg', 'grains-millets', 'Whole Grains & Millets', 2, 'Krishna Valley Organics', 'Guntur, Andhra Pradesh', true, false, false, '/images/cat-vegetables.png', 90, 4.7, 14, ARRAY['Unpolished', 'High Fiber', 'Gluten-Free'], 93),

-- Fresh Produce
('Organic Alphonso Mangoes (GI Tagged Devgad)', 'Naturally ripened in farm hay grass with zero calcium carbide. Incredibly fragrant, dense golden saffron pulp with unforgettable sweet heritage flavor.', 799.00, '1 Dozen', 'fresh-produce', 'Fresh Farm Produce', 3, 'Sahyadri Flora Bio-Reserve', 'Satara, Maharashtra', true, true, true, '/images/mangoes.png', 50, 4.9, 64, ARRAY['GI Tagged', 'Carbide-Free', 'Naturally Ripened in Hay'], 97),
('Country Vine-Ripened Desi Tomatoes', 'Native heirloom desi tomatoes grown with Jeevamrutha compost, full of rich tangy flavor and dense lycopene.', 65.00, '1 kg', 'fresh-produce', 'Fresh Farm Produce', 1, 'Desiri Heritage Groves', 'Mysore Rural, Karnataka', true, false, false, '/images/tomatoes.png', 200, 4.7, 15, ARRAY['Heirloom', 'Farm Fresh'], 94),
('Fresh Tender Baby Spinach Leaves', 'Tender baby spinach leaves freshly cut at 5 AM and delivered crisp to preserve vitamins, chlorophyll, and organic plant iron.', 45.00, '250 g', 'fresh-produce', 'Fresh Farm Produce', 2, 'Krishna Valley Organics', 'Guntur, Andhra Pradesh', true, false, true, '/images/spinach.png', 100, 4.8, 12, ARRAY['Harvested Today', 'Zero Pesticides'], 100);

-- Insert Subscription Boxes
INSERT INTO subscription_boxes (name, description, price, frequency, image_url, items, highlight, is_popular) VALUES
('Weekly Farm Harvest Box', 'A curated selection of hand-picked seasonal organic vegetables and greens fresh from the farm.', 649.00, 'weekly', '/images/box.png', ARRAY['Desi Tomatoes 1kg', 'Baby Spinach 250g', 'Organic Cucumbers 500g', 'Fresh Coriander & Mint', 'Bell Peppers 500g'], 'Saves 20% compared to individual items', true),
('Desiri Heritage Oil & Wellness Box', 'Monthly delivery of pure bull-driven cooking oils and handcrafted A2 cow bilona ghee.', 1699.00, 'monthly', '/images/box.png', ARRAY['Bull-Driven Groundnut Oil 1L', 'Wood-Pressed Mustard Oil 1L', 'A2 Desi Cow Bilona Ghee 500ml'], 'Essential pure pantry staples for healthy living', true),
('Seasonal Orchard Fruit Basket', 'Premium handpicked fruits ripened naturally on trees, delivered weekly.', 999.00, 'weekly', '/images/box.png', ARRAY['Alphonso Mangoes 6 pcs', 'Organic Pomegranates 1kg', 'Mountain Apples 1kg'], '100% pesticide and chemical-free guaranteed', false);
