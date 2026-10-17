-- Clean and re-seed categories and products
DELETE FROM cart_items;
DELETE FROM products;
DELETE FROM categories;
INSERT INTO categories (name, slug, image_url, product_count, description)
VALUES ('Oils', 'oils', '/images/desiri-tin-can.png', 31, 'Traditional wooden expeller (Vaagai mara chekku) cold-pressed oils powered by indigenous desi bulls at 2-3 RPM.')
ON CONFLICT (slug) DO UPDATE SET product_count = 31;
INSERT INTO categories (name, slug, image_url, product_count, description)
VALUES ('Gau Products', 'gau-products', '/images/cat-dairy.png', 4, 'Vedic Bilona A2 Desi Ghee prepared using traditional curd-churning method from grass-fed indigenous cows.')
ON CONFLICT (slug) DO UPDATE SET product_count = 4;
INSERT INTO categories (name, slug, image_url, product_count, description)
VALUES ('Millets', 'millets', '/images/phil-chemical-free.png', 25, 'Ancient unpolished millets, ravas, flours and flakes rich in dietary fibre and low glycemic index.')
ON CONFLICT (slug) DO UPDATE SET product_count = 25;
INSERT INTO categories (name, slug, image_url, product_count, description)
VALUES ('Grains', 'cereals-grains', '/images/phil-water-smart.png', 15, 'Heirloom unpolished red rice, ancient Khapli emmer wheat flours, and indigenous pulses.')
ON CONFLICT (slug) DO UPDATE SET product_count = 15;
INSERT INTO categories (name, slug, image_url, product_count, description)
VALUES ('Sweetener', 'sweetener', '/images/phil-lab-certified.png', 7, 'Chemical-free natural sugarcane jaggery, date palm jaggery, and raw wild multiflora honey.')
ON CONFLICT (slug) DO UPDATE SET product_count = 7;
INSERT INTO categories (name, slug, image_url, product_count, description)
VALUES ('Snacks', 'snacks', '/images/phil-women-led.png', 14, 'Wholesome nutritious snacks, cold-pressed chikkis, jowar pops, and traditional papads.')
ON CONFLICT (slug) DO UPDATE SET product_count = 14;
INSERT INTO categories (name, slug, image_url, product_count, description)
VALUES ('Spices', 'spices', '/images/cat-vegetables.png', 10, 'Stone-ground naturally processed turmeric, single-origin Malabar black pepper, and unrefined salts.')
ON CONFLICT (slug) DO UPDATE SET product_count = 10;
INSERT INTO categories (name, slug, image_url, product_count, description)
VALUES ('Pooja Items', 'pooja-items', '/images/phil-zero-waste.png', 6, 'Pancha Deepa sacred lamp oils, natural kumkum, and desi cow dung cakes for traditional havans.')
ON CONFLICT (slug) DO UPDATE SET product_count = 6;
INSERT INTO categories (name, slug, image_url, product_count, description)
VALUES ('Body Care', 'body-care', '/images/farmer.png', 19, 'Chemical-free handmade herbal soaps, cold-pressed almond oils, and therapeutic Ayurvedic pain balms.')
ON CONFLICT (slug) DO UPDATE SET product_count = 19;
INSERT INTO categories (name, slug, image_url, product_count, description)
VALUES ('Cattle Feed', 'cattle-feed', '/images/phil-bull-powered.png', 11, 'Nutritious oilcake Pashugrasa from cold-press expellers supporting indigenous livestock welfare.')
ON CONFLICT (slug) DO UPDATE SET product_count = 11;
INSERT INTO categories (name, slug, image_url, product_count, description)
VALUES ('Others', 'others', '/images/box.png', 9, 'Handcrafted pure copper plates, food-grade steel vessels, and eco-friendly bio-enzyme natural cleaners.')
ON CONFLICT (slug) DO UPDATE SET product_count = 9;
INSERT INTO categories (name, slug, image_url, product_count, description)
VALUES ('Fruits & Vegetables', 'fruits-vegetables', '/images/mangoes.png', 1, 'Naturally ripened carbide-free fruits directly harvested from Western Ghats orchards.')
ON CONFLICT (slug) DO UPDATE SET product_count = 1;
INSERT INTO categories (name, slug, image_url, product_count, description)
VALUES ('Healthy Drinks', 'healthy-drinks', '/images/spinach.png', 1, 'Traditional herbal tonics and multi-millet Sanjeevini health drink mixes.')
ON CONFLICT (slug) DO UPDATE SET product_count = 1;
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Groundnut Oil Glass Bottle (500ml)', '100% pure traditional bull-driven cold-pressed oil (2-3 RPM). Extracted in Vaagai wood expellers under 35°C without chemicals, heat, or preservatives.', 245.00, '500ml', 'oils', 'Oils',
    1, 'Desiri Heritage Groves', 'Mysore Rural, Karnataka', true, false,
    false, '/images/desiri-glass-bottle.png', 150, 4.9, 32, ARRAY['Bull-Driven', 'Wood-Pressed', 'Chemical-Free', 'Unrefined'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Groundnut Oil(Tin can)/ 1000 ml', '100% pure traditional bull-driven cold-pressed oil (2-3 RPM). Extracted in Vaagai wood expellers under 35°C without chemicals, heat, or preservatives.', 500.00, 'Tin can', 'oils', 'Oils',
    1, 'Desiri Heritage Groves', 'Mysore Rural, Karnataka', true, false,
    true, '/images/desiri-tin-can.png', 150, 4.9, 32, ARRAY['Bull-Driven', 'Wood-Pressed', 'Chemical-Free', 'Unrefined'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Groundnut Oil - Vessel/ 1000 ml', '100% pure traditional bull-driven cold-pressed oil (2-3 RPM). Extracted in Vaagai wood expellers under 35°C without chemicals, heat, or preservatives.', 460.00, '1000 ml', 'oils', 'Oils',
    1, 'Desiri Heritage Groves', 'Mysore Rural, Karnataka', true, false,
    false, '/images/desiri-tin-can.png', 150, 4.9, 32, ARRAY['Bull-Driven', 'Wood-Pressed', 'Chemical-Free', 'Unrefined'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Coconut Oil Glass Bottle (500 ml)', '100% pure traditional bull-driven cold-pressed oil (2-3 RPM). Extracted in Vaagai wood expellers under 35°C without chemicals, heat, or preservatives.', 315.00, '500 ml', 'oils', 'Oils',
    1, 'Desiri Heritage Groves', 'Mysore Rural, Karnataka', true, false,
    false, '/images/desiri-glass-bottle.png', 150, 4.9, 32, ARRAY['Bull-Driven', 'Wood-Pressed', 'Chemical-Free', 'Unrefined'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Coconut Oil Tin can (1000 ml)', '100% pure traditional bull-driven cold-pressed oil (2-3 RPM). Extracted in Vaagai wood expellers under 35°C without chemicals, heat, or preservatives.', 640.00, '1000 ml', 'oils', 'Oils',
    1, 'Desiri Heritage Groves', 'Mysore Rural, Karnataka', true, false,
    true, '/images/desiri-tin-can.png', 150, 4.9, 32, ARRAY['Bull-Driven', 'Wood-Pressed', 'Chemical-Free', 'Unrefined'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Coconut Oil - Vessel (1000 ml)', '100% pure traditional bull-driven cold-pressed oil (2-3 RPM). Extracted in Vaagai wood expellers under 35°C without chemicals, heat, or preservatives.', 600.00, '1000 ml', 'oils', 'Oils',
    1, 'Desiri Heritage Groves', 'Mysore Rural, Karnataka', true, false,
    false, '/images/desiri-tin-can.png', 150, 4.9, 32, ARRAY['Bull-Driven', 'Wood-Pressed', 'Chemical-Free', 'Unrefined'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Sesame (Black) Oil Glass Bottle (500 ml)', '100% pure traditional bull-driven cold-pressed oil (2-3 RPM). Extracted in Vaagai wood expellers under 35°C without chemicals, heat, or preservatives.', 340.00, 'Black', 'oils', 'Oils',
    1, 'Desiri Heritage Groves', 'Mysore Rural, Karnataka', true, false,
    false, '/images/desiri-glass-bottle.png', 150, 4.9, 32, ARRAY['Bull-Driven', 'Wood-Pressed', 'Chemical-Free', 'Unrefined'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Sesame (Black) Oil - Tin (1000 ml)', '100% pure traditional bull-driven cold-pressed oil (2-3 RPM). Extracted in Vaagai wood expellers under 35°C without chemicals, heat, or preservatives.', 710.00, 'Black', 'oils', 'Oils',
    1, 'Desiri Heritage Groves', 'Mysore Rural, Karnataka', true, false,
    false, '/images/desiri-tin-can.png', 150, 4.9, 32, ARRAY['Bull-Driven', 'Wood-Pressed', 'Chemical-Free', 'Unrefined'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Sesame (Black) Oil - Vessel (1000 ml)', '100% pure traditional bull-driven cold-pressed oil (2-3 RPM). Extracted in Vaagai wood expellers under 35°C without chemicals, heat, or preservatives.', 660.00, 'Black', 'oils', 'Oils',
    1, 'Desiri Heritage Groves', 'Mysore Rural, Karnataka', true, false,
    false, '/images/desiri-tin-can.png', 150, 4.9, 32, ARRAY['Bull-Driven', 'Wood-Pressed', 'Chemical-Free', 'Unrefined'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Sesame (Black) oil Glass Bottle (200 ml)', '100% pure traditional bull-driven cold-pressed oil (2-3 RPM). Extracted in Vaagai wood expellers under 35°C without chemicals, heat, or preservatives.', 195.00, 'Black', 'oils', 'Oils',
    1, 'Desiri Heritage Groves', 'Mysore Rural, Karnataka', true, false,
    false, '/images/desiri-glass-bottle.png', 150, 4.9, 32, ARRAY['Bull-Driven', 'Wood-Pressed', 'Chemical-Free', 'Unrefined'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Niger Oil Glass Bottle (500 ml)', '100% pure traditional bull-driven cold-pressed oil (2-3 RPM). Extracted in Vaagai wood expellers under 35°C without chemicals, heat, or preservatives.', 450.00, '500 ml', 'oils', 'Oils',
    1, 'Desiri Heritage Groves', 'Mysore Rural, Karnataka', true, false,
    false, '/images/desiri-glass-bottle.png', 150, 4.9, 32, ARRAY['Bull-Driven', 'Wood-Pressed', 'Chemical-Free', 'Unrefined'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Niger Oil - Tin (1000 ml)', '100% pure traditional bull-driven cold-pressed oil (2-3 RPM). Extracted in Vaagai wood expellers under 35°C without chemicals, heat, or preservatives.', 930.00, '1000 ml', 'oils', 'Oils',
    1, 'Desiri Heritage Groves', 'Mysore Rural, Karnataka', true, false,
    false, '/images/desiri-tin-can.png', 150, 4.9, 32, ARRAY['Bull-Driven', 'Wood-Pressed', 'Chemical-Free', 'Unrefined'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Niger Oil - Vessel (1000 ml)', '100% pure traditional bull-driven cold-pressed oil (2-3 RPM). Extracted in Vaagai wood expellers under 35°C without chemicals, heat, or preservatives.', 875.00, '1000 ml', 'oils', 'Oils',
    1, 'Desiri Heritage Groves', 'Mysore Rural, Karnataka', true, false,
    false, '/images/desiri-tin-can.png', 150, 4.9, 32, ARRAY['Bull-Driven', 'Wood-Pressed', 'Chemical-Free', 'Unrefined'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Niger Oil Glass Bottle (200ml)', '100% pure traditional bull-driven cold-pressed oil (2-3 RPM). Extracted in Vaagai wood expellers under 35°C without chemicals, heat, or preservatives.', 225.00, '200ml', 'oils', 'Oils',
    1, 'Desiri Heritage Groves', 'Mysore Rural, Karnataka', true, false,
    false, '/images/desiri-glass-bottle.png', 150, 4.9, 32, ARRAY['Bull-Driven', 'Wood-Pressed', 'Chemical-Free', 'Unrefined'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Safflower Oil Glass Bottle (500 ml)', '100% pure traditional bull-driven cold-pressed oil (2-3 RPM). Extracted in Vaagai wood expellers under 35°C without chemicals, heat, or preservatives.', 355.00, '500 ml', 'oils', 'Oils',
    1, 'Desiri Heritage Groves', 'Mysore Rural, Karnataka', true, false,
    false, '/images/desiri-glass-bottle.png', 150, 4.9, 32, ARRAY['Bull-Driven', 'Wood-Pressed', 'Chemical-Free', 'Unrefined'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Safflower Oil Tin can (1000 ml)', '100% pure traditional bull-driven cold-pressed oil (2-3 RPM). Extracted in Vaagai wood expellers under 35°C without chemicals, heat, or preservatives.', 720.00, '1000 ml', 'oils', 'Oils',
    1, 'Desiri Heritage Groves', 'Mysore Rural, Karnataka', true, false,
    false, '/images/desiri-tin-can.png', 150, 4.9, 32, ARRAY['Bull-Driven', 'Wood-Pressed', 'Chemical-Free', 'Unrefined'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Safflower Oil - Vessel (1000 ml)', '100% pure traditional bull-driven cold-pressed oil (2-3 RPM). Extracted in Vaagai wood expellers under 35°C without chemicals, heat, or preservatives.', 690.00, '1000 ml', 'oils', 'Oils',
    1, 'Desiri Heritage Groves', 'Mysore Rural, Karnataka', true, false,
    false, '/images/desiri-tin-can.png', 150, 4.9, 32, ARRAY['Bull-Driven', 'Wood-Pressed', 'Chemical-Free', 'Unrefined'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Castor Oil- Glass Bottle (500 ml)', '100% pure traditional bull-driven cold-pressed oil (2-3 RPM). Extracted in Vaagai wood expellers under 35°C without chemicals, heat, or preservatives.', 340.00, '500 ml', 'oils', 'Oils',
    1, 'Desiri Heritage Groves', 'Mysore Rural, Karnataka', true, false,
    false, '/images/desiri-glass-bottle.png', 150, 4.9, 32, ARRAY['Bull-Driven', 'Wood-Pressed', 'Chemical-Free', 'Unrefined'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Castor Oil - Tin Can (1000 ml)', '100% pure traditional bull-driven cold-pressed oil (2-3 RPM). Extracted in Vaagai wood expellers under 35°C without chemicals, heat, or preservatives.', 710.00, '1000 ml', 'oils', 'Oils',
    1, 'Desiri Heritage Groves', 'Mysore Rural, Karnataka', true, false,
    false, '/images/desiri-tin-can.png', 150, 4.9, 32, ARRAY['Bull-Driven', 'Wood-Pressed', 'Chemical-Free', 'Unrefined'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Castor Oil - Vessel/ 1000 ml', '100% pure traditional bull-driven cold-pressed oil (2-3 RPM). Extracted in Vaagai wood expellers under 35°C without chemicals, heat, or preservatives.', 660.00, '1000 ml', 'oils', 'Oils',
    1, 'Desiri Heritage Groves', 'Mysore Rural, Karnataka', true, false,
    false, '/images/desiri-tin-can.png', 150, 4.9, 32, ARRAY['Bull-Driven', 'Wood-Pressed', 'Chemical-Free', 'Unrefined'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Castor Oil Glass Bottle (200 ml)', '100% pure traditional bull-driven cold-pressed oil (2-3 RPM). Extracted in Vaagai wood expellers under 35°C without chemicals, heat, or preservatives.', 200.00, '200 ml', 'oils', 'Oils',
    1, 'Desiri Heritage Groves', 'Mysore Rural, Karnataka', true, false,
    false, '/images/desiri-glass-bottle.png', 150, 4.9, 32, ARRAY['Bull-Driven', 'Wood-Pressed', 'Chemical-Free', 'Unrefined'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Mustard Oil Glass Bottle (500 ml)', '100% pure traditional bull-driven cold-pressed oil (2-3 RPM). Extracted in Vaagai wood expellers under 35°C without chemicals, heat, or preservatives.', 375.00, '500 ml', 'oils', 'Oils',
    1, 'Desiri Heritage Groves', 'Mysore Rural, Karnataka', true, false,
    false, '/images/desiri-glass-bottle.png', 150, 4.9, 32, ARRAY['Bull-Driven', 'Wood-Pressed', 'Chemical-Free', 'Unrefined'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Mustard Oil - Tin (1000 ml)', '100% pure traditional bull-driven cold-pressed oil (2-3 RPM). Extracted in Vaagai wood expellers under 35°C without chemicals, heat, or preservatives.', 780.00, '1000 ml', 'oils', 'Oils',
    1, 'Desiri Heritage Groves', 'Mysore Rural, Karnataka', true, false,
    false, '/images/desiri-tin-can.png', 150, 4.9, 32, ARRAY['Bull-Driven', 'Wood-Pressed', 'Chemical-Free', 'Unrefined'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Mustard Oil - Vessel (1000 ml)', '100% pure traditional bull-driven cold-pressed oil (2-3 RPM). Extracted in Vaagai wood expellers under 35°C without chemicals, heat, or preservatives.', 713.00, '1000 ml', 'oils', 'Oils',
    1, 'Desiri Heritage Groves', 'Mysore Rural, Karnataka', true, false,
    false, '/images/desiri-tin-can.png', 150, 4.9, 32, ARRAY['Bull-Driven', 'Wood-Pressed', 'Chemical-Free', 'Unrefined'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Mustard Oil Glass Bottle (200 ml)', '100% pure traditional bull-driven cold-pressed oil (2-3 RPM). Extracted in Vaagai wood expellers under 35°C without chemicals, heat, or preservatives.', 190.00, '200 ml', 'oils', 'Oils',
    1, 'Desiri Heritage Groves', 'Mysore Rural, Karnataka', true, false,
    false, '/images/desiri-glass-bottle.png', 150, 4.9, 32, ARRAY['Bull-Driven', 'Wood-Pressed', 'Chemical-Free', 'Unrefined'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Sunflower Oil Glass Bottle(500 ml)', '100% pure traditional bull-driven cold-pressed oil (2-3 RPM). Extracted in Vaagai wood expellers under 35°C without chemicals, heat, or preservatives.', 390.00, '500 ml', 'oils', 'Oils',
    1, 'Desiri Heritage Groves', 'Mysore Rural, Karnataka', true, false,
    false, '/images/desiri-glass-bottle.png', 150, 4.9, 32, ARRAY['Bull-Driven', 'Wood-Pressed', 'Chemical-Free', 'Unrefined'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Sunflower Oil Tin Can (1000ml)', '100% pure traditional bull-driven cold-pressed oil (2-3 RPM). Extracted in Vaagai wood expellers under 35°C without chemicals, heat, or preservatives.', 790.00, '1000ml', 'oils', 'Oils',
    1, 'Desiri Heritage Groves', 'Mysore Rural, Karnataka', true, false,
    false, '/images/desiri-tin-can.png', 150, 4.9, 32, ARRAY['Bull-Driven', 'Wood-Pressed', 'Chemical-Free', 'Unrefined'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Sunflower Oil - Vessel (1000 ml)', '100% pure traditional bull-driven cold-pressed oil (2-3 RPM). Extracted in Vaagai wood expellers under 35°C without chemicals, heat, or preservatives.', 760.00, '1000 ml', 'oils', 'Oils',
    1, 'Desiri Heritage Groves', 'Mysore Rural, Karnataka', true, false,
    false, '/images/desiri-tin-can.png', 150, 4.9, 32, ARRAY['Bull-Driven', 'Wood-Pressed', 'Chemical-Free', 'Unrefined'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Flaxseed Oil -Glass Bottle (500 ml)', '100% pure traditional bull-driven cold-pressed oil (2-3 RPM). Extracted in Vaagai wood expellers under 35°C without chemicals, heat, or preservatives.', 600.00, '500 ml', 'oils', 'Oils',
    1, 'Desiri Heritage Groves', 'Mysore Rural, Karnataka', true, false,
    false, '/images/desiri-glass-bottle.png', 150, 4.9, 32, ARRAY['Bull-Driven', 'Wood-Pressed', 'Chemical-Free', 'Unrefined'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Flaxseed Oil - Tin can (200 ml)', '100% pure traditional bull-driven cold-pressed oil (2-3 RPM). Extracted in Vaagai wood expellers under 35°C without chemicals, heat, or preservatives.', 310.00, '200 ml', 'oils', 'Oils',
    1, 'Desiri Heritage Groves', 'Mysore Rural, Karnataka', true, false,
    false, '/images/desiri-tin-can.png', 150, 4.9, 32, ARRAY['Bull-Driven', 'Wood-Pressed', 'Chemical-Free', 'Unrefined'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Flaxseed Oil Glass Bottle (200 ml)', '100% pure traditional bull-driven cold-pressed oil (2-3 RPM). Extracted in Vaagai wood expellers under 35°C without chemicals, heat, or preservatives.', 300.00, '200 ml', 'oils', 'Oils',
    1, 'Desiri Heritage Groves', 'Mysore Rural, Karnataka', true, false,
    false, '/images/desiri-glass-bottle.png', 150, 4.9, 32, ARRAY['Bull-Driven', 'Wood-Pressed', 'Chemical-Free', 'Unrefined'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Hallikar Cow A2 Desi Ghee (470 gms) - Bottle', 'Prepared from pure A2 milk of free-grazing Hallikar/Gir desi cows using the ancient Vedic Bilona clockwise-anticlockwise wooden churning method.', 1125.00, '470 gms', 'gau-products', 'Gau Products',
    2, 'Vedic Gir Gaushala', 'Nelamangala, Karnataka', true, false,
    true, '/images/cat-dairy.png', 150, 4.9, 32, ARRAY['A2 Desi Cow', 'Bilona Churned', 'Laban Cultured', 'Grass-Fed'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Hallikar Cow A2 Desi Ghee (235 gms) - Bottle', 'Prepared from pure A2 milk of free-grazing Hallikar/Gir desi cows using the ancient Vedic Bilona clockwise-anticlockwise wooden churning method.', 570.00, '235 gms', 'gau-products', 'Gau Products',
    2, 'Vedic Gir Gaushala', 'Nelamangala, Karnataka', true, false,
    false, '/images/cat-dairy.png', 150, 4.9, 32, ARRAY['A2 Desi Cow', 'Bilona Churned', 'Laban Cultured', 'Grass-Fed'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Hallikar Cow A2 Desi Ghee (470 gms) - Tin', 'Prepared from pure A2 milk of free-grazing Hallikar/Gir desi cows using the ancient Vedic Bilona clockwise-anticlockwise wooden churning method.', 1125.00, '470 gms', 'gau-products', 'Gau Products',
    2, 'Vedic Gir Gaushala', 'Nelamangala, Karnataka', true, false,
    false, '/images/desiri-tin-can.png', 150, 4.9, 32, ARRAY['A2 Desi Cow', 'Bilona Churned', 'Laban Cultured', 'Grass-Fed'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Compost (1 kg)', 'Prepared from pure A2 milk of free-grazing Hallikar/Gir desi cows using the ancient Vedic Bilona clockwise-anticlockwise wooden churning method.', 25.00, '1 kg', 'gau-products', 'Gau Products',
    2, 'Vedic Gir Gaushala', 'Nelamangala, Karnataka', true, false,
    false, '/images/desiri-tin-can.png', 150, 4.9, 32, ARRAY['A2 Desi Cow', 'Bilona Churned', 'Laban Cultured', 'Grass-Fed'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Barnyard Millet (1 kg)', 'Unpolished native millet traditionally cultivated under rain-fed dryland farming. Rich in micronutrients, plant proteins and dietary fiber.', 235.00, '1 kg', 'millets', 'Millets',
    3, 'Deccan Drylands Collective', 'Bellary, Karnataka', true, false,
    false, '/images/phil-chemical-free.png', 150, 4.9, 32, ARRAY['Unpolished', 'Rain-Fed', 'Zero Pesticide', 'Gluten-Free'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Browntop Millet (1 kg)', 'Unpolished native millet traditionally cultivated under rain-fed dryland farming. Rich in micronutrients, plant proteins and dietary fiber.', 260.00, '1 kg', 'millets', 'Millets',
    3, 'Deccan Drylands Collective', 'Bellary, Karnataka', true, false,
    false, '/images/phil-chemical-free.png', 150, 4.9, 32, ARRAY['Unpolished', 'Rain-Fed', 'Zero Pesticide', 'Gluten-Free'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Little Millet (1 kg)', 'Unpolished native millet traditionally cultivated under rain-fed dryland farming. Rich in micronutrients, plant proteins and dietary fiber.', 250.00, '1 kg', 'millets', 'Millets',
    3, 'Deccan Drylands Collective', 'Bellary, Karnataka', true, false,
    false, '/images/phil-chemical-free.png', 150, 4.9, 32, ARRAY['Unpolished', 'Rain-Fed', 'Zero Pesticide', 'Gluten-Free'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Kodo Millet (1 kg)', 'Unpolished native millet traditionally cultivated under rain-fed dryland farming. Rich in micronutrients, plant proteins and dietary fiber.', 160.00, '1 kg', 'millets', 'Millets',
    3, 'Deccan Drylands Collective', 'Bellary, Karnataka', true, false,
    false, '/images/phil-chemical-free.png', 150, 4.9, 32, ARRAY['Unpolished', 'Rain-Fed', 'Zero Pesticide', 'Gluten-Free'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Foxtail Millet (1 kg)', 'Unpolished native millet traditionally cultivated under rain-fed dryland farming. Rich in micronutrients, plant proteins and dietary fiber.', 140.00, '1 kg', 'millets', 'Millets',
    3, 'Deccan Drylands Collective', 'Bellary, Karnataka', true, false,
    true, '/images/phil-chemical-free.png', 150, 4.9, 32, ARRAY['Unpolished', 'Rain-Fed', 'Zero Pesticide', 'Gluten-Free'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Finger Millet (1 kg)', 'Unpolished native millet traditionally cultivated under rain-fed dryland farming. Rich in micronutrients, plant proteins and dietary fiber.', 110.00, '1 kg', 'millets', 'Millets',
    3, 'Deccan Drylands Collective', 'Bellary, Karnataka', true, false,
    false, '/images/phil-chemical-free.png', 150, 4.9, 32, ARRAY['Unpolished', 'Rain-Fed', 'Zero Pesticide', 'Gluten-Free'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Jowar (1 kg pack)', 'Unpolished native millet traditionally cultivated under rain-fed dryland farming. Rich in micronutrients, plant proteins and dietary fiber.', 80.00, '1 kg pack', 'millets', 'Millets',
    3, 'Deccan Drylands Collective', 'Bellary, Karnataka', true, false,
    false, '/images/phil-chemical-free.png', 150, 4.9, 32, ARRAY['Unpolished', 'Rain-Fed', 'Zero Pesticide', 'Gluten-Free'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Barnyard Rava (500 gms)', 'Unpolished native millet traditionally cultivated under rain-fed dryland farming. Rich in micronutrients, plant proteins and dietary fiber.', 150.00, '500 gms', 'millets', 'Millets',
    3, 'Deccan Drylands Collective', 'Bellary, Karnataka', true, false,
    false, '/images/phil-water-smart.png', 150, 4.9, 32, ARRAY['Unpolished', 'Rain-Fed', 'Zero Pesticide', 'Gluten-Free'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Browntop Rava (500 gms)', 'Unpolished native millet traditionally cultivated under rain-fed dryland farming. Rich in micronutrients, plant proteins and dietary fiber.', 160.00, '500 gms', 'millets', 'Millets',
    3, 'Deccan Drylands Collective', 'Bellary, Karnataka', true, false,
    false, '/images/phil-water-smart.png', 150, 4.9, 32, ARRAY['Unpolished', 'Rain-Fed', 'Zero Pesticide', 'Gluten-Free'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Little Rava (500 gms)', 'Unpolished native millet traditionally cultivated under rain-fed dryland farming. Rich in micronutrients, plant proteins and dietary fiber.', 155.00, '500 gms', 'millets', 'Millets',
    3, 'Deccan Drylands Collective', 'Bellary, Karnataka', true, false,
    false, '/images/phil-water-smart.png', 150, 4.9, 32, ARRAY['Unpolished', 'Rain-Fed', 'Zero Pesticide', 'Gluten-Free'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Kodo Rava (500 gms)', 'Unpolished native millet traditionally cultivated under rain-fed dryland farming. Rich in micronutrients, plant proteins and dietary fiber.', 100.00, '500 gms', 'millets', 'Millets',
    3, 'Deccan Drylands Collective', 'Bellary, Karnataka', true, false,
    false, '/images/phil-water-smart.png', 150, 4.9, 32, ARRAY['Unpolished', 'Rain-Fed', 'Zero Pesticide', 'Gluten-Free'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Foxtail Rava (500 gms)', 'Unpolished native millet traditionally cultivated under rain-fed dryland farming. Rich in micronutrients, plant proteins and dietary fiber.', 90.00, '500 gms', 'millets', 'Millets',
    3, 'Deccan Drylands Collective', 'Bellary, Karnataka', true, false,
    false, '/images/phil-water-smart.png', 150, 4.9, 32, ARRAY['Unpolished', 'Rain-Fed', 'Zero Pesticide', 'Gluten-Free'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Barnyard Flour (500 gms)', 'Unpolished native millet traditionally cultivated under rain-fed dryland farming. Rich in micronutrients, plant proteins and dietary fiber.', 125.00, '500 gms', 'millets', 'Millets',
    3, 'Deccan Drylands Collective', 'Bellary, Karnataka', true, false,
    false, '/images/phil-water-smart.png', 150, 4.9, 32, ARRAY['Unpolished', 'Rain-Fed', 'Zero Pesticide', 'Gluten-Free'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Browntop Flour (500 gms)', 'Unpolished native millet traditionally cultivated under rain-fed dryland farming. Rich in micronutrients, plant proteins and dietary fiber.', 135.00, '500 gms', 'millets', 'Millets',
    3, 'Deccan Drylands Collective', 'Bellary, Karnataka', true, false,
    false, '/images/phil-water-smart.png', 150, 4.9, 32, ARRAY['Unpolished', 'Rain-Fed', 'Zero Pesticide', 'Gluten-Free'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Little Flour (500 gms)', 'Unpolished native millet traditionally cultivated under rain-fed dryland farming. Rich in micronutrients, plant proteins and dietary fiber.', 105.00, '500 gms', 'millets', 'Millets',
    3, 'Deccan Drylands Collective', 'Bellary, Karnataka', true, false,
    false, '/images/phil-water-smart.png', 150, 4.9, 32, ARRAY['Unpolished', 'Rain-Fed', 'Zero Pesticide', 'Gluten-Free'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Kodo Flour (500 gms)', 'Unpolished native millet traditionally cultivated under rain-fed dryland farming. Rich in micronutrients, plant proteins and dietary fiber.', 98.00, '500 gms', 'millets', 'Millets',
    3, 'Deccan Drylands Collective', 'Bellary, Karnataka', true, false,
    false, '/images/phil-water-smart.png', 150, 4.9, 32, ARRAY['Unpolished', 'Rain-Fed', 'Zero Pesticide', 'Gluten-Free'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Foxtail Flour (500 gms)', 'Unpolished native millet traditionally cultivated under rain-fed dryland farming. Rich in micronutrients, plant proteins and dietary fiber.', 80.00, '500 gms', 'millets', 'Millets',
    3, 'Deccan Drylands Collective', 'Bellary, Karnataka', true, false,
    false, '/images/phil-water-smart.png', 150, 4.9, 32, ARRAY['Unpolished', 'Rain-Fed', 'Zero Pesticide', 'Gluten-Free'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Ragi Dosa Mix (250 gms)', 'Unpolished native millet traditionally cultivated under rain-fed dryland farming. Rich in micronutrients, plant proteins and dietary fiber.', 50.00, '250 gms', 'millets', 'Millets',
    3, 'Deccan Drylands Collective', 'Bellary, Karnataka', true, false,
    false, '/images/phil-chemical-free.png', 150, 4.9, 32, ARRAY['Unpolished', 'Rain-Fed', 'Zero Pesticide', 'Gluten-Free'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Export-Ragi Dosa Mix', 'Unpolished native millet traditionally cultivated under rain-fed dryland farming. Rich in micronutrients, plant proteins and dietary fiber.', 51.00, '1 Pack', 'millets', 'Millets',
    3, 'Deccan Drylands Collective', 'Bellary, Karnataka', true, false,
    false, '/images/phil-chemical-free.png', 150, 4.9, 32, ARRAY['Unpolished', 'Rain-Fed', 'Zero Pesticide', 'Gluten-Free'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Finger Millet (Raagi) Flour (500 gms pack)', 'Unpolished native millet traditionally cultivated under rain-fed dryland farming. Rich in micronutrients, plant proteins and dietary fiber.', 65.00, 'Raagi', 'millets', 'Millets',
    3, 'Deccan Drylands Collective', 'Bellary, Karnataka', true, false,
    false, '/images/phil-chemical-free.png', 150, 4.9, 32, ARRAY['Unpolished', 'Rain-Fed', 'Zero Pesticide', 'Gluten-Free'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Barnyard Flakes (250 gms)', 'Unpolished native millet traditionally cultivated under rain-fed dryland farming. Rich in micronutrients, plant proteins and dietary fiber.', 70.00, '250 gms', 'millets', 'Millets',
    3, 'Deccan Drylands Collective', 'Bellary, Karnataka', true, false,
    false, '/images/phil-chemical-free.png', 150, 4.9, 32, ARRAY['Unpolished', 'Rain-Fed', 'Zero Pesticide', 'Gluten-Free'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Little Flakes (250 gms)', 'Unpolished native millet traditionally cultivated under rain-fed dryland farming. Rich in micronutrients, plant proteins and dietary fiber.', 70.00, '250 gms', 'millets', 'Millets',
    3, 'Deccan Drylands Collective', 'Bellary, Karnataka', true, false,
    false, '/images/phil-chemical-free.png', 150, 4.9, 32, ARRAY['Unpolished', 'Rain-Fed', 'Zero Pesticide', 'Gluten-Free'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Kodo Flakes (250 gms)', 'Unpolished native millet traditionally cultivated under rain-fed dryland farming. Rich in micronutrients, plant proteins and dietary fiber.', 65.00, '250 gms', 'millets', 'Millets',
    3, 'Deccan Drylands Collective', 'Bellary, Karnataka', true, false,
    false, '/images/phil-chemical-free.png', 150, 4.9, 32, ARRAY['Unpolished', 'Rain-Fed', 'Zero Pesticide', 'Gluten-Free'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Foxtail Flakes (250 gms)', 'Unpolished native millet traditionally cultivated under rain-fed dryland farming. Rich in micronutrients, plant proteins and dietary fiber.', 65.00, '250 gms', 'millets', 'Millets',
    3, 'Deccan Drylands Collective', 'Bellary, Karnataka', true, false,
    false, '/images/phil-chemical-free.png', 150, 4.9, 32, ARRAY['Unpolished', 'Rain-Fed', 'Zero Pesticide', 'Gluten-Free'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Finger Millet Flakes (250 gms)', 'Unpolished native millet traditionally cultivated under rain-fed dryland farming. Rich in micronutrients, plant proteins and dietary fiber.', 50.00, '250 gms', 'millets', 'Millets',
    3, 'Deccan Drylands Collective', 'Bellary, Karnataka', true, false,
    false, '/images/phil-chemical-free.png', 150, 4.9, 32, ARRAY['Unpolished', 'Rain-Fed', 'Zero Pesticide', 'Gluten-Free'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Dry Fruits Bar (40 gms)', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 60.00, '40 gms', 'snacks', 'Snacks',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/cat-fruits.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Peanut Chikki (40 gms)', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 25.00, '40 gms', 'snacks', 'Snacks',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/phil-women-led.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Puffed Bites (35 gms)', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 25.00, '35 gms', 'snacks', 'Snacks',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/desiri-tin-can.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Crunch Bar (50 gms)', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 25.00, '50 gms', 'snacks', 'Snacks',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/desiri-tin-can.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Beaten Rice Mixture (100 gms)', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 50.00, '100 gms', 'snacks', 'Snacks',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/phil-water-smart.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Jackfruit Chips (250 gms)', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 400.00, '250 gms', 'snacks', 'Snacks',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/cat-fruits.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Millet Raagi Choco (15 gms)', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 10.00, '15 gms', 'snacks', 'Snacks',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/phil-chemical-free.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Nutri Seed Ball (60 gms)', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 80.00, '60 gms', 'snacks', 'Snacks',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/desiri-tin-can.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Horsegram Papad (20 pcs pack)', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 140.00, '20 pcs pack', 'snacks', 'Snacks',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/phil-women-led.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Jackfruit Papad (20 pcs pack)', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 160.00, '20 pcs pack', 'snacks', 'Snacks',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/phil-women-led.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Fried Avarebele (200 gms)', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 340.00, '200 gms', 'snacks', 'Snacks',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/desiri-tin-can.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Millet Muruku (250 gms)', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 220.00, '250 gms', 'snacks', 'Snacks',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/phil-chemical-free.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Jowar Pops Masala Mixture (100 gms pack)', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 95.00, '100 gms pack', 'snacks', 'Snacks',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/cat-vegetables.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Ragi Pops Masala Crunch (100 gms pack)', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 85.00, '100 gms pack', 'snacks', 'Snacks',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/cat-vegetables.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Multi Flora Honey (250 grms) Bottle', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 275.00, '250 grms', 'sweetener', 'Sweetener',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    true, '/images/phil-lab-certified.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Sugar Cane Jaggery (Chemical free) (1kg)', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 130.00, 'Chemical free', 'sweetener', 'Sweetener',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/phil-lab-certified.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Sugar Cane Jaggery Powder (Chemical free) (1kg)', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 145.00, 'Chemical free', 'sweetener', 'Sweetener',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/phil-lab-certified.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Date Palm Jaggery (500 gms)', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 195.00, '500 gms', 'sweetener', 'Sweetener',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/phil-lab-certified.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Date Palm Jaggery (500 gms)-Granuale', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 265.00, '500 gms', 'sweetener', 'Sweetener',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/phil-lab-certified.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Pan Powder (Tamboola) - 50 grams', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 50.00, 'Tamboola', 'sweetener', 'Sweetener',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/desiri-tin-can.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Pan Powder (Tamboola) without Sweetner- 50 grams', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 50.00, 'Tamboola', 'sweetener', 'Sweetener',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/desiri-tin-can.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Pancha Deepa Oil Glass Bottle (500 ml)', '100% pure traditional bull-driven cold-pressed oil (2-3 RPM). Extracted in Vaagai wood expellers under 35°C without chemicals, heat, or preservatives.', 175.00, '500 ml', 'pooja-items', 'Pooja Items',
    1, 'Desiri Heritage Groves', 'Mysore Rural, Karnataka', true, false,
    false, '/images/desiri-tin-can.png', 150, 4.9, 32, ARRAY['Bull-Driven', 'Wood-Pressed', 'Chemical-Free', 'Unrefined'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Pancha Deepa Oil - Tin (1000 ml)', '100% pure traditional bull-driven cold-pressed oil (2-3 RPM). Extracted in Vaagai wood expellers under 35°C without chemicals, heat, or preservatives.', 375.00, '1000 ml', 'pooja-items', 'Pooja Items',
    1, 'Desiri Heritage Groves', 'Mysore Rural, Karnataka', true, false,
    false, '/images/desiri-tin-can.png', 150, 4.9, 32, ARRAY['Bull-Driven', 'Wood-Pressed', 'Chemical-Free', 'Unrefined'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Pancha Deepa Oil - Vessel (1000ml)', '100% pure traditional bull-driven cold-pressed oil (2-3 RPM). Extracted in Vaagai wood expellers under 35°C without chemicals, heat, or preservatives.', 325.00, '1000ml', 'pooja-items', 'Pooja Items',
    1, 'Desiri Heritage Groves', 'Mysore Rural, Karnataka', true, false,
    false, '/images/desiri-tin-can.png', 150, 4.9, 32, ARRAY['Bull-Driven', 'Wood-Pressed', 'Chemical-Free', 'Unrefined'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Deepam Sesame Oil in Tin can (1000 ml)', '100% pure traditional bull-driven cold-pressed oil (2-3 RPM). Extracted in Vaagai wood expellers under 35°C without chemicals, heat, or preservatives.', 470.00, '1000 ml', 'pooja-items', 'Pooja Items',
    1, 'Desiri Heritage Groves', 'Mysore Rural, Karnataka', true, false,
    false, '/images/desiri-tin-can.png', 150, 4.9, 32, ARRAY['Bull-Driven', 'Wood-Pressed', 'Chemical-Free', 'Unrefined'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Kumkum-Chemical Free (50 gms)', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 80.00, '50 gms', 'pooja-items', 'Pooja Items',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/phil-zero-waste.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Cow Dung Cake for Havanas (Pack of 12)', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 60.00, 'Pack of 12', 'pooja-items', 'Pooja Items',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/phil-zero-waste.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Mulika Soap', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 65.00, '1 Pack', 'body-care', 'Body Care',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/farmer.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Besan Flour Bath Soap', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 65.00, '1 Pack', 'body-care', 'Body Care',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/phil-water-smart.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Turmeric Bath Soap', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 65.00, '1 Pack', 'body-care', 'Body Care',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/cat-vegetables.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Lemon Peel Soap', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 65.00, '1 Pack', 'body-care', 'Body Care',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/farmer.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Neem Soap', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 65.00, '1 Pack', 'body-care', 'Body Care',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/farmer.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Tulsi Bathing Soap', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 65.00, '1 Pack', 'body-care', 'Body Care',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/cat-vegetables.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Kashmiri Mamra Almond Oil (25 ml pack)', '100% pure traditional bull-driven cold-pressed oil (2-3 RPM). Extracted in Vaagai wood expellers under 35°C without chemicals, heat, or preservatives.', 130.00, '25 ml pack', 'body-care', 'Body Care',
    1, 'Desiri Heritage Groves', 'Mysore Rural, Karnataka', true, false,
    false, '/images/cat-vegetables.png', 150, 4.9, 32, ARRAY['Bull-Driven', 'Wood-Pressed', 'Chemical-Free', 'Unrefined'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Almond Oil (100 ml pack)', '100% pure traditional bull-driven cold-pressed oil (2-3 RPM). Extracted in Vaagai wood expellers under 35°C without chemicals, heat, or preservatives.', 490.00, '100 ml pack', 'body-care', 'Body Care',
    1, 'Desiri Heritage Groves', 'Mysore Rural, Karnataka', true, false,
    false, '/images/cat-vegetables.png', 150, 4.9, 32, ARRAY['Bull-Driven', 'Wood-Pressed', 'Chemical-Free', 'Unrefined'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Nivarana Pain Oil (25 ml)', '100% pure traditional bull-driven cold-pressed oil (2-3 RPM). Extracted in Vaagai wood expellers under 35°C without chemicals, heat, or preservatives.', 100.00, '25 ml', 'body-care', 'Body Care',
    1, 'Desiri Heritage Groves', 'Mysore Rural, Karnataka', true, false,
    false, '/images/cat-vegetables.png', 150, 4.9, 32, ARRAY['Bull-Driven', 'Wood-Pressed', 'Chemical-Free', 'Unrefined'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Krishna Suchi Tooth Powder (100 gms)', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 100.00, '100 gms', 'body-care', 'Body Care',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/desiri-tin-can.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Bala Danthmanjan (50 gms)', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 100.00, '50 gms', 'body-care', 'Body Care',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/desiri-tin-can.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Danta Rakshak (50 gms)', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 105.00, '50 gms', 'body-care', 'Body Care',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/desiri-tin-can.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Keshasindu Herbal Dry Shampoo (200 gms)', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 100.00, '200 gms', 'body-care', 'Body Care',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/farmer.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Kesha Siri Hair Pack (200 gms)', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 130.00, '200 gms', 'body-care', 'Body Care',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/desiri-tin-can.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Mehandi (100 gms)', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 80.00, '100 gms', 'body-care', 'Body Care',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/desiri-tin-can.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Indigo Powder (Neeli Pudi)-100gms', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 80.00, 'Neeli Pudi', 'body-care', 'Body Care',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/desiri-tin-can.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Sujjal Powder (250 grms)', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 50.00, '250 grms', 'body-care', 'Body Care',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/desiri-tin-can.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Shikakai Powder (250 gms)', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 70.00, '250 gms', 'body-care', 'Body Care',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/desiri-tin-can.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Hair Oil (100 ml)', '100% pure traditional bull-driven cold-pressed oil (2-3 RPM). Extracted in Vaagai wood expellers under 35°C without chemicals, heat, or preservatives.', 155.00, '100 ml', 'body-care', 'Body Care',
    1, 'Desiri Heritage Groves', 'Mysore Rural, Karnataka', true, false,
    false, '/images/desiri-tin-can.png', 150, 4.9, 32, ARRAY['Bull-Driven', 'Wood-Pressed', 'Chemical-Free', 'Unrefined'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Unpolished Tur Dal (1kg)', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 260.00, '1kg', 'cereals-grains', 'Grains',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/phil-water-smart.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Moong Dal - (500 gms pack)', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 150.00, '500 gms pack', 'cereals-grains', 'Grains',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/phil-water-smart.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Urad dal Spilt (500 gms)', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 95.00, '500 gms', 'cereals-grains', 'Grains',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/phil-water-smart.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Chana Dal(Kadle bele)-500gms', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 115.00, 'Kadle bele', 'cereals-grains', 'Grains',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/phil-water-smart.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Rajmudi Red Rice unpolished (1 kg pack)', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 149.00, '1 kg pack', 'cereals-grains', 'Grains',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/phil-water-smart.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Khapli Wheat (Jave godi) Flour (500 gms)', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 105.00, 'Jave godi', 'cereals-grains', 'Grains',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/phil-water-smart.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Pearl Millet Flour (Bajra/Sajje) - 500 gms', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 60.00, 'Bajra/Sajje', 'cereals-grains', 'Grains',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/phil-chemical-free.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Jowar Flour (Jola Hittu) - 500 gms', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 55.00, 'Jola Hittu', 'cereals-grains', 'Grains',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/phil-chemical-free.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Groundnut Seeds (500 gms pack)', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 130.00, '500 gms pack', 'cereals-grains', 'Grains',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/desiri-tin-can.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Sesame Seeds (250 gms pack)', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 75.00, '250 gms pack', 'cereals-grains', 'Grains',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/desiri-glass-bottle.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Niger Seeds (250 gms pack)', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 65.00, '250 gms pack', 'cereals-grains', 'Grains',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/desiri-tin-can.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Flaxseeds (100 gms pack)', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 40.00, '100 gms pack', 'cereals-grains', 'Grains',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/desiri-tin-can.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Bangal Gram (Kadle Kaalu)-500gms', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 100.00, 'Kadle Kaalu', 'cereals-grains', 'Grains',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/desiri-tin-can.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Green Gram Whole (500 gms)', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 100.00, '500 gms', 'cereals-grains', 'Grains',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/desiri-tin-can.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Horsegram (500 gms pack)', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 55.00, '500 gms pack', 'cereals-grains', 'Grains',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/desiri-tin-can.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Black Pepper (50 gms pack)', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 55.00, '50 gms pack', 'spices', 'Spices',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/cat-vegetables.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Saanekatte Sea Salt (1 kg pack)', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 60.00, '1 kg pack', 'spices', 'Spices',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/cat-vegetables.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Natural Pink Salt Crystals (500 gms)', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 60.00, '500 gms', 'spices', 'Spices',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/cat-vegetables.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Natural Pink Salt Powder (500 gms)', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 60.00, '500 gms', 'spices', 'Spices',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/cat-vegetables.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Clove Whole (50 gms)', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 180.00, '50 gms', 'spices', 'Spices',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/desiri-tin-can.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Naturally Processed Turmeric Powder (50 gms)', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 50.00, '50 gms', 'spices', 'Spices',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/cat-vegetables.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Sambar Powder (100 gms pouch)', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 85.00, '100 gms pouch', 'spices', 'Spices',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/desiri-tin-can.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Coriander Powder (100 gms pouch)', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 65.00, '100 gms pouch', 'spices', 'Spices',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/cat-vegetables.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Chilli Powder (100 gms pouch)', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 75.00, '100 gms pouch', 'spices', 'Spices',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/desiri-tin-can.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Black Pepper Powder(50 Grams pack)', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 80.00, '50 Grams pack', 'spices', 'Spices',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/cat-vegetables.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Groundnut Pashugrasa (1kg)', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 65.00, '1kg', 'cattle-feed', 'Cattle Feed',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/phil-bull-powered.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Coconut Pashugrasa', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 30.00, '1 Pack', 'cattle-feed', 'Cattle Feed',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/phil-bull-powered.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Sesame Pashugrasa (1kg)', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 30.00, '1kg', 'cattle-feed', 'Cattle Feed',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/phil-bull-powered.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Niger Pashugrasa (1kg)', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 30.00, '1kg', 'cattle-feed', 'Cattle Feed',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/phil-bull-powered.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Flaxseed Pashugrasa', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 30.00, '1 Pack', 'cattle-feed', 'Cattle Feed',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/phil-bull-powered.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Mustard Pashugrasa (1kg)', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 30.00, '1kg', 'cattle-feed', 'Cattle Feed',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/phil-bull-powered.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Castor Pashugrasa', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 30.00, '1 Pack', 'cattle-feed', 'Cattle Feed',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/phil-bull-powered.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Safflower Pashugrasa (1kg)', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 30.00, '1kg', 'cattle-feed', 'Cattle Feed',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/phil-bull-powered.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Sunflower Pashugrasa (1kg)', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 30.00, '1kg', 'cattle-feed', 'Cattle Feed',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/phil-bull-powered.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Mixed Pashugrasa', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 48.00, '1 Pack', 'cattle-feed', 'Cattle Feed',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/phil-bull-powered.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Almond Pashugrasa', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 30.00, '1 Pack', 'cattle-feed', 'Cattle Feed',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/phil-bull-powered.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Copper Plate (3 in * 12 in)', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 610.00, '3 in * 12 in', 'others', 'Others',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/box.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Copper Plate (2 in * 9.75 in)', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 320.00, '2 in * 9.75 in', 'others', 'Others',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/box.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Steel Vessel', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 1000.00, '1 Pack', 'others', 'Others',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/box.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Empty Glass Bottles', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 10.00, '1 Pack', 'others', 'Others',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/desiri-tin-can.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Natural Fabric Wash (500ml)', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 200.00, '500ml', 'others', 'Others',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/desiri-tin-can.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Natural Dish Wash (550ml)', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 180.00, '550ml', 'others', 'Others',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/desiri-tin-can.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Natural Surface Cleaner (500ml)', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 90.00, '500ml', 'others', 'Others',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/box.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Natural Toilet Cleaner 500ml', '100% pure traditional bull-driven cold-pressed oil (2-3 RPM). Extracted in Vaagai wood expellers under 35°C without chemicals, heat, or preservatives.', 120.00, '500 g', 'others', 'Others',
    1, 'Desiri Heritage Groves', 'Mysore Rural, Karnataka', true, false,
    false, '/images/box.png', 150, 4.9, 32, ARRAY['Bull-Driven', 'Wood-Pressed', 'Chemical-Free', 'Unrefined'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Plastic Crate for Transportation', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 1.00, '1 Pack', 'others', 'Others',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/desiri-tin-can.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Mango - Rathnagiri', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 140.00, '1 Pack', 'fruits-vegetables', 'Fruits & Vegetables',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    false, '/images/mangoes.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);
INSERT INTO products (
    name, description, price, unit, category_slug, category_name,
    farm_id, farm_name, farm_location, is_organic, is_seasonal,
    is_featured, image_url, stock, rating, review_count, badges, freshness_score
) VALUES (
    'Sanjeevini Health Mix (250 gms)', 'Pure indigenous heritage produce hand-harvested by local farming communities following zero-budget natural farming principles.', 250.00, '250 gms', 'healthy-drinks', 'Healthy Drinks',
    4, 'Malnad Organic Valley', 'Shimoga, Karnataka', true, false,
    true, '/images/spinach.png', 150, 4.9, 32, ARRAY['Natural Farming', 'Direct Trade', 'Fresh Harvest'], 98
);