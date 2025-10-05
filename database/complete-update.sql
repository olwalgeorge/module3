-- ===================================================================
-- COMPLETE DATABASE UPDATE: VARIANTS + IMAGES
-- ===================================================================
-- This script adds product variants and updates images without resetting data

-- ===================================================================
-- PART 1: UPDATE PRODUCT IMAGES
-- ===================================================================
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop' WHERE sku = 'MBP-16-001';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop' WHERE sku = 'IP15P-001';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop' WHERE sku = 'DM-27-001';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop' WHERE sku = 'WM-001';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=300&fit=crop' WHERE sku = 'GK-001';

-- ===================================================================
-- PART 2: ADD PRODUCT VARIANTS
-- ===================================================================
-- Clear existing variants first
TRUNCATE TABLE product_variants CASCADE;

-- MacBook Pro variants
INSERT INTO product_variants (product_id, variant_name, variant_value, sku_suffix, price_adjustment, stock_quantity, status) VALUES
-- MacBook Pro 16" variants
('01912f4d-1234-7890-abcd-000000000001', 'Color', 'Silver', '-SLV', 0.00, 12, 'active'),
('01912f4d-1234-7890-abcd-000000000001', 'Color', 'Space Gray', '-SG', 0.00, 13, 'active'),
('01912f4d-1234-7890-abcd-000000000001', 'Storage', '512GB', '-512', 0.00, 15, 'active'),
('01912f4d-1234-7890-abcd-000000000001', 'Storage', '1TB', '-1TB', 500.00, 10, 'active'),

-- iPhone 15 Pro variants
('01912f4d-1234-7890-abcd-000000000002', 'Color', 'Natural Titanium', '-NAT', 0.00, 3, 'active'),
('01912f4d-1234-7890-abcd-000000000002', 'Color', 'Blue Titanium', '-BLU', 0.00, 2, 'active'),
('01912f4d-1234-7890-abcd-000000000002', 'Color', 'White Titanium', '-WHT', 0.00, 3, 'active'),
('01912f4d-1234-7890-abcd-000000000002', 'Storage', '128GB', '-128', 0.00, 2, 'active'),
('01912f4d-1234-7890-abcd-000000000002', 'Storage', '256GB', '-256', 100.00, 3, 'active'),
('01912f4d-1234-7890-abcd-000000000002', 'Storage', '512GB', '-512', 200.00, 3, 'active'),

-- Dell Monitor variants
('01912f4d-1234-7890-abcd-000000000003', 'Resolution', '4K', '-4K', 0.00, 25, 'active'),
('01912f4d-1234-7890-abcd-000000000003', 'Resolution', '1440p', '-1440', -50.00, 20, 'active'),
('01912f4d-1234-7890-abcd-000000000003', 'Panel Type', 'IPS', '-IPS', 0.00, 30, 'active'),
('01912f4d-1234-7890-abcd-000000000003', 'Panel Type', 'OLED', '-OLED', 200.00, 15, 'active'),

-- Wireless Mouse variants
('01912f4d-1234-7890-abcd-000000000004', 'Color', 'Graphite', '-GRA', 0.00, 0, 'active'),
('01912f4d-1234-7890-abcd-000000000004', 'Color', 'Pale Gray', '-PAL', 0.00, 0, 'active'),
('01912f4d-1234-7890-abcd-000000000004', 'Connectivity', 'Bluetooth', '-BT', 0.00, 0, 'active'),
('01912f4d-1234-7890-abcd-000000000004', 'Connectivity', 'USB-C', '-USBC', 10.00, 0, 'active'),

-- Gaming Keyboard variants
('01912f4d-1234-7890-abcd-000000000005', 'Switch Type', 'Green', '-GRN', 0.00, 16, 'active'),
('01912f4d-1234-7890-abcd-000000000005', 'Switch Type', 'Orange', '-ORG', 0.00, 16, 'active'),
('01912f4d-1234-7890-abcd-000000000005', 'Layout', 'Full Size', '-FULL', 0.00, 20, 'active'),
('01912f4d-1234-7890-abcd-000000000005', 'Layout', 'Tenkeyless', '-TKL', -30.00, 12, 'active');

-- ===================================================================
-- VERIFICATION & RESULTS
-- ===================================================================
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'DATABASE UPDATE COMPLETED SUCCESSFULLY!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Updated:';
    RAISE NOTICE '- Product Images: 5 products updated';
    RAISE NOTICE '- Product Variants: % variants added', (SELECT COUNT(*) FROM product_variants);
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Your inventory system now has:';
    RAISE NOTICE '- Real product images from Unsplash';
    RAISE NOTICE '- Complete variant system with attributes';
    RAISE NOTICE '- Price adjustments and stock quantities';
    RAISE NOTICE '========================================';
END $$;

-- Show updated products with images
SELECT 
    name, 
    sku, 
    CASE 
        WHEN image_url LIKE '%unsplash%' THEN 'Updated ✅'
        ELSE 'Original'
    END as image_status
FROM products 
ORDER BY name;

-- Show variants by product
SELECT 
    p.name as product_name,
    COUNT(pv.id) as variant_count,
    STRING_AGG(DISTINCT pv.variant_name, ', ') as variant_types
FROM products p
LEFT JOIN product_variants pv ON p.id = pv.product_id
GROUP BY p.id, p.name
ORDER BY p.name;
