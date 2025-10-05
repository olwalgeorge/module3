-- ===================================================================
-- DIAGNOSTIC: CHECK CURRENT PRODUCTS AND THEIR IMAGES
-- ===================================================================
-- This query will show us the current products and their image status

SELECT 
    id,
    name,
    sku,
    CASE 
        WHEN image_url IS NULL THEN 'NULL'
        WHEN image_url = '' THEN 'EMPTY'
        WHEN image_url LIKE '%unsplash%' THEN 'Updated ✅'
        WHEN image_url LIKE '%placeholder%' THEN 'Placeholder'
        ELSE 'Other: ' || LEFT(image_url, 50)
    END as image_status,
    image_url
FROM products 
ORDER BY name;

-- Also show count of variants
SELECT 
    'Variants' as type,
    COUNT(*) as count
FROM product_variants;
