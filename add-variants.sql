-- Add Product Variants to Existing Database
-- This script adds product variants without resetting the entire database

-- Clear existing variants first
TRUNCATE TABLE product_variants CASCADE;

-- ===================================================================
-- PRODUCT VARIANTS
-- ===================================================================
-- MacBook Pro variants
INSERT INTO product_variants (id, product_id, variant_name, variant_value, sku_suffix, price_adjustment, stock_quantity, status) VALUES
-- MacBook Pro 16" variants
('01912f4v-1234-7890-abcd-000000000001', '01912f4d-1234-7890-abcd-000000000001', 'Color', 'Silver', '-SLV', 0.00, 12, 'active'),
('01912f4v-1234-7890-abcd-000000000002', '01912f4d-1234-7890-abcd-000000000001', 'Color', 'Space Gray', '-SG', 0.00, 13, 'active'),
('01912f4v-1234-7890-abcd-000000000003', '01912f4d-1234-7890-abcd-000000000001', 'Storage', '512GB', '-512', 0.00, 15, 'active'),
('01912f4v-1234-7890-abcd-000000000004', '01912f4d-1234-7890-abcd-000000000001', 'Storage', '1TB', '-1TB', 500.00, 10, 'active'),

-- iPhone 15 Pro variants
('01912f4v-1234-7890-abcd-000000000005', '01912f4d-1234-7890-abcd-000000000002', 'Color', 'Natural Titanium', '-NAT', 0.00, 3, 'active'),
('01912f4v-1234-7890-abcd-000000000006', '01912f4d-1234-7890-abcd-000000000002', 'Color', 'Blue Titanium', '-BLU', 0.00, 2, 'active'),
('01912f4v-1234-7890-abcd-000000000007', '01912f4d-1234-7890-abcd-000000000002', 'Color', 'White Titanium', '-WHT', 0.00, 3, 'active'),
('01912f4v-1234-7890-abcd-000000000008', '01912f4d-1234-7890-abcd-000000000002', 'Storage', '128GB', '-128', 0.00, 2, 'active'),
('01912f4v-1234-7890-abcd-000000000009', '01912f4d-1234-7890-abcd-000000000002', 'Storage', '256GB', '-256', 100.00, 3, 'active'),
('01912f4v-1234-7890-abcd-000000000010', '01912f4d-1234-7890-abcd-000000000002', 'Storage', '512GB', '-512', 200.00, 3, 'active'),

-- Dell Monitor variants
('01912f4v-1234-7890-abcd-000000000011', '01912f4d-1234-7890-abcd-000000000003', 'Resolution', '4K', '-4K', 0.00, 25, 'active'),
('01912f4v-1234-7890-abcd-000000000012', '01912f4d-1234-7890-abcd-000000000003', 'Resolution', '1440p', '-1440', -50.00, 20, 'active'),
('01912f4v-1234-7890-abcd-000000000013', '01912f4d-1234-7890-abcd-000000000003', 'Panel Type', 'IPS', '-IPS', 0.00, 30, 'active'),
('01912f4v-1234-7890-abcd-000000000014', '01912f4d-1234-7890-abcd-000000000003', 'Panel Type', 'OLED', '-OLED', 200.00, 15, 'active'),

-- Wireless Mouse variants
('01912f4v-1234-7890-abcd-000000000015', '01912f4d-1234-7890-abcd-000000000004', 'Color', 'Graphite', '-GRA', 0.00, 0, 'active'),
('01912f4v-1234-7890-abcd-000000000016', '01912f4d-1234-7890-abcd-000000000004', 'Color', 'Pale Gray', '-PAL', 0.00, 0, 'active'),
('01912f4v-1234-7890-abcd-000000000017', '01912f4d-1234-7890-abcd-000000000004', 'Connectivity', 'Bluetooth', '-BT', 0.00, 0, 'active'),
('01912f4v-1234-7890-abcd-000000000018', '01912f4d-1234-7890-abcd-000000000004', 'Connectivity', 'USB-C', '-USBC', 10.00, 0, 'active'),

-- Gaming Keyboard variants
('01912f4v-1234-7890-abcd-000000000019', '01912f4d-1234-7890-abcd-000000000005', 'Switch Type', 'Green', '-GRN', 0.00, 16, 'active'),
('01912f4v-1234-7890-abcd-000000000020', '01912f4d-1234-7890-abcd-000000000005', 'Switch Type', 'Orange', '-ORG', 0.00, 16, 'active'),
('01912f4v-1234-7890-abcd-000000000021', '01912f4d-1234-7890-abcd-000000000005', 'Layout', 'Full Size', '-FULL', 0.00, 20, 'active'),
('01912f4v-1234-7890-abcd-000000000022', '01912f4d-1234-7890-abcd-000000000005', 'Layout', 'Tenkeyless', '-TKL', -30.00, 12, 'active');

-- ===================================================================
-- VERIFICATION
-- ===================================================================
SELECT 'Product Variants Added: ' || COUNT(*) as message FROM product_variants;

-- Show variants by product
SELECT 
    p.name as product_name,
    pv.variant_name,
    pv.variant_value,
    pv.sku_suffix,
    pv.price_adjustment,
    pv.stock_quantity
FROM product_variants pv
JOIN products p ON pv.product_id = p.id
ORDER BY p.name, pv.variant_name, pv.variant_value;
