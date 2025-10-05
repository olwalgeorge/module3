-- ===================================================================
-- COMPREHENSIVE PRODUCT & VARIANT IMAGE UPDATE
-- ===================================================================
-- This script sets up distinct images for products and variants

-- First, let's see what we have:
SELECT id, name, sku, image_url FROM products ORDER BY name;

-- Check if product_variants has image_url column
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'product_variants' AND column_name = 'image_url';

-- Add image_url column to product_variants if it doesn't exist
ALTER TABLE product_variants 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- ===================================================================
-- PART 1: UPDATE PRODUCT BASE IMAGES
-- ===================================================================
-- Products get their base/default images

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop' 
WHERE name ILIKE '%macbook%' OR name ILIKE '%laptop%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop' 
WHERE name ILIKE '%iphone%' OR name ILIKE '%phone%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop' 
WHERE name ILIKE '%monitor%' OR name ILIKE '%display%' OR name ILIKE '%screen%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop' 
WHERE name ILIKE '%mouse%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=300&fit=crop' 
WHERE name ILIKE '%keyboard%';

-- ===================================================================
-- PART 2: UPDATE VARIANT-SPECIFIC IMAGES
-- ===================================================================
-- Variants get their own distinct images based on attributes

-- Silver/White color variants
UPDATE product_variants SET image_url = 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop'
WHERE variant_name ILIKE '%color%' AND (variant_value ILIKE '%silver%' OR variant_value ILIKE '%white%');

-- Space Gray/Black color variants  
UPDATE product_variants SET image_url = 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop'
WHERE variant_name ILIKE '%color%' AND (variant_value ILIKE '%space%' OR variant_value ILIKE '%gray%' OR variant_value ILIKE '%black%');

-- Blue color variants
UPDATE product_variants SET image_url = 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop'
WHERE variant_name ILIKE '%color%' AND variant_value ILIKE '%blue%';

-- Red color variants  
UPDATE product_variants SET image_url = 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=300&fit=crop'
WHERE variant_name ILIKE '%color%' AND variant_value ILIKE '%red%';

-- Natural/Titanium variants
UPDATE product_variants SET image_url = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop'
WHERE variant_name ILIKE '%color%' AND (variant_value ILIKE '%natural%' OR variant_value ILIKE '%titanium%');

-- Storage variants (different angles/perspectives)
UPDATE product_variants SET image_url = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop'
WHERE variant_name ILIKE '%storage%';

-- Resolution variants (monitor close-ups)
UPDATE product_variants SET image_url = 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=400&h=300&fit=crop'
WHERE variant_name ILIKE '%resolution%';

-- Panel type variants
UPDATE product_variants SET image_url = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'
WHERE variant_name ILIKE '%panel%';

-- Connectivity variants
UPDATE product_variants SET image_url = 'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=400&h=300&fit=crop'
WHERE variant_name ILIKE '%connectivity%';

-- Switch type variants (keyboard details)
UPDATE product_variants SET image_url = 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop'
WHERE variant_name ILIKE '%switch%';

-- Layout variants
UPDATE product_variants SET image_url = 'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=400&h=300&fit=crop'
WHERE variant_name ILIKE '%layout%';

-- Verify the updates
SELECT 
    name,
    sku,
    CASE 
        WHEN image_url LIKE '%unsplash%' THEN '✅ Updated'
        ELSE '❌ Not Updated'
    END as status,
    LEFT(image_url, 60) as image_preview
FROM products 
ORDER BY name;
