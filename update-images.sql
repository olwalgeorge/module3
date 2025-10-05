-- Update Product Images to Better URLs
-- This script updates the existing product images to use high-quality Unsplash images

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop' WHERE sku = 'MBP-16-001';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop' WHERE sku = 'IP15P-001';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop' WHERE sku = 'DM-27-001';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop' WHERE sku = 'WM-001';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=300&fit=crop' WHERE sku = 'GK-001';

-- Verification
SELECT name, sku, image_url FROM products ORDER BY name;
