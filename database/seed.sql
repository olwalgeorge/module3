-- ===================================================================
-- INVENTORY MANAGEMENT SYSTEM - COMPREHENSIVE DATABASE SEED
-- ===================================================================
-- This file populates the database with all mock data from the application
-- Run this after executing the main schema.sql file

-- Clear existing data (in proper order to avoid foreign key conflicts)
TRUNCATE TABLE dashboard_metrics CASCADE;
TRUNCATE TABLE product_warehouse_inventory CASCADE;
TRUNCATE TABLE stock_movements CASCADE;
TRUNCATE TABLE order_items CASCADE;
TRUNCATE TABLE orders CASCADE;
TRUNCATE TABLE product_variants CASCADE;
TRUNCATE TABLE products CASCADE;
TRUNCATE TABLE customers CASCADE;
TRUNCATE TABLE suppliers CASCADE;
TRUNCATE TABLE categories CASCADE;
TRUNCATE TABLE warehouses CASCADE;

-- ===================================================================
-- STEP 1: CATEGORIES
-- ===================================================================
INSERT INTO categories (id, name, description, status) VALUES
('01912f4a-1234-7890-abcd-000000000001', 'Electronics', 'Electronic devices and gadgets', 'active'),
('01912f4a-1234-7890-abcd-000000000002', 'Accessories', 'Computer and mobile accessories', 'active'),
('01912f4a-1234-7890-abcd-000000000003', 'Software', 'Software licenses and applications', 'active'),
('01912f4a-1234-7890-abcd-000000000004', 'Furniture', 'Office and home furniture', 'active'),
('01912f4a-1234-7890-abcd-000000000005', 'Office Supplies', 'General office supplies and equipment', 'active'),
('01912f4a-1234-7890-abcd-000000000006', 'Manufacturing', 'Manufacturing components and materials', 'active');

-- ===================================================================
-- STEP 2: SUPPLIERS
-- ===================================================================
INSERT INTO suppliers (id, name, contact_person, email, phone, address, country, status, payment_terms, notes) VALUES
('01912f4b-1234-7890-abcd-000000000001', 'Apple Inc.', 'Tim Cook', 'orders@apple.com', '+1-800-275-2273', '1 Apple Park Way, Cupertino, CA 95014', 'USA', 'active', 'Net 30', 'Premium electronics supplier'),
('01912f4b-1234-7890-abcd-000000000002', 'Dell Technologies', 'Michael Dell', 'orders@dell.com', '+1-800-915-3355', '1 Dell Way, Round Rock, TX 78682', 'USA', 'active', 'Net 30', 'Computer hardware specialist'),
('01912f4b-1234-7890-abcd-000000000003', 'Logitech', 'Bracken Darrell', 'orders@logitech.com', '+1-510-795-8500', '7700 Gateway Blvd, Newark, CA 94560', 'USA', 'active', 'Net 15', 'Peripheral devices manufacturer'),
('01912f4b-1234-7890-abcd-000000000004', 'Razer Inc.', 'Min-Liang Tan', 'orders@razer.com', '+1-858-395-3973', '1 Razer Way, Carlsbad, CA 92008', 'USA', 'active', 'Net 30', 'Gaming equipment specialist'),
('01912f4b-1234-7890-abcd-000000000005', 'TechCorp Ltd', 'John Smith', 'orders@techcorp.com', '+1-800-275-2273', '1 Technology Park, San Francisco, CA 94105', 'USA', 'active', 'Net 30', 'Technology solutions provider'),
('01912f4b-1234-7890-abcd-000000000006', 'Global Supplies Inc', 'Sarah Johnson', 'business@globalsupplies.com', '+1-800-915-3355', '500 Commerce Street, Austin, TX 78701', 'USA', 'active', 'Net 15', 'Office supplies distributor'),
('01912f4b-1234-7890-abcd-000000000007', 'Premium Electronics', 'Mike Chen', 'sales@premiumelectronics.com', '+1-510-795-8500', '2500 Innovation Drive, Seattle, WA 98101', 'USA', 'active', 'Net 30', 'High-end electronics'),
('01912f4b-1234-7890-abcd-000000000008', 'Office Solutions Pro', 'Lisa Wong', 'contact@officesolutions.com', '+1-213-555-0199', '1200 Business Center, Los Angeles, CA 90028', 'USA', 'active', 'Net 30', 'Professional office equipment'),
('01912f4b-1234-7890-abcd-000000000009', 'Manufacturing Direct', 'David Kim', 'orders@manufacturingdirect.com', '+1-312-555-0145', '800 Industrial Blvd, Chicago, IL 60601', 'USA', 'active', 'Net 45', 'Manufacturing components'),
('01912f4b-1234-7890-abcd-000000000010', 'Software Solutions Hub', 'Emma Rodriguez', 'licensing@softwarehub.com', '+1-617-555-0177', '300 Tech Square, Boston, MA 02139', 'USA', 'active', 'Net 30', 'Software licensing'),
('01912f4b-1234-7890-abcd-000000000011', 'UK Office Supplies', 'James Wilson', 'sales@ukoffice.co.uk', '+44-20-7946-0958', '25 Regent Street, London, W1B 2QD, UK', 'UK', 'active', 'Net 30', 'UK office supplies'),
('01912f4b-1234-7890-abcd-000000000012', 'Canadian Tech Distributors', 'Marie Dubois', 'orders@cantech.ca', '+1-416-555-0123', '100 King Street West, Toronto, ON M5X 1A9', 'Canada', 'active', 'Net 30', 'Canadian technology distributor');

-- ===================================================================
-- STEP 3: WAREHOUSES
-- ===================================================================
INSERT INTO warehouses (id, name, code, address, manager, capacity, status) VALUES
('01912f4c-1234-7890-abcd-000000000001', 'Main Warehouse', 'WH-MAIN', '1000 Storage Drive, San Francisco, CA 94105', 'John Manager', 10000, 'active'),
('01912f4c-1234-7890-abcd-000000000002', 'East Coast Distribution', 'WH-EAST', '500 Distribution Blvd, New York, NY 10001', 'Sarah Supervisor', 7500, 'active'),
('01912f4c-1234-7890-abcd-000000000003', 'West Coast Hub', 'WH-WEST', '750 Logistics Way, Los Angeles, CA 90028', 'Mike Coordinator', 8000, 'active'),
('01912f4c-1234-7890-abcd-000000000004', 'Central Distribution', 'WH-CENTRAL', '300 Midwest Ave, Chicago, IL 60601', 'Lisa Director', 6000, 'active');

-- ===================================================================
-- STEP 4: PRODUCTS
-- ===================================================================
INSERT INTO products (id, name, sku, description, category_id, supplier_id, price, cost, quantity, min_stock_level, max_stock_level, status, image_url, barcode, weight) VALUES
('01912f4d-1234-7890-abcd-000000000001', 'MacBook Pro 16"', 'MBP-16-001', 'Apple MacBook Pro 16-inch with M3 Pro chip', '01912f4a-1234-7890-abcd-000000000001', '01912f4b-1234-7890-abcd-000000000001', 2499.99, 1999.99, 25, 10, 100, 'active', '/images/laptop001_400x300.jpg', '194252581747', 2.1),
('01912f4d-1234-7890-abcd-000000000002', 'iPhone 15 Pro', 'IP15P-001', 'Apple iPhone 15 Pro with A17 Pro chip', '01912f4a-1234-7890-abcd-000000000001', '01912f4b-1234-7890-abcd-000000000001', 999.99, 799.99, 8, 15, 200, 'active', '/images/phone001_400x300.jpg', '194253433408', 0.187),
('01912f4d-1234-7890-abcd-000000000003', 'Dell Monitor 27"', 'DM-27-001', 'Dell 27-inch 4K UltraSharp Monitor', '01912f4a-1234-7890-abcd-000000000001', '01912f4b-1234-7890-abcd-000000000002', 329.99, 249.99, 45, 20, 150, 'active', '/images/monitor001_400x300.jpg', '884116365891', 6.4),
('01912f4d-1234-7890-abcd-000000000004', 'Wireless Mouse', 'WM-001', 'Logitech MX Master 3S Wireless Mouse', '01912f4a-1234-7890-abcd-000000000002', '01912f4b-1234-7890-abcd-000000000003', 79.99, 49.99, 0, 25, 200, 'active', '/images/mouse001_400x300.jpg', '097855152589', 0.141),
('01912f4d-1234-7890-abcd-000000000005', 'Gaming Keyboard', 'GK-001', 'Razer BlackWidow V4 Mechanical Gaming Keyboard', '01912f4a-1234-7890-abcd-000000000002', '01912f4b-1234-7890-abcd-000000000004', 149.99, 99.99, 32, 15, 100, 'active', '/images/keyboard001_400x300.jpg', '8886419370239', 1.3);

-- ===================================================================
-- STEP 5: CUSTOMERS (Matching actual table structure)
-- ===================================================================
INSERT INTO customers (id, name, email, phone, address, company, status, notes) VALUES
('01912f4e-1234-7890-abcd-000000000001', 'John Smith', 'contact@techsolutions.com', '+1 (555) 123-4567', '123 Business Park, Suite 100, San Francisco, CA 94105', 'Tech Solutions Inc.', 'active', 'CTO at Tech Solutions Inc. - Long-term client with consistent large orders. Enterprise customer from Technology industry. Website: https://techsolutions.com. 15 total orders worth $45,750.'),
('01912f4e-1234-7890-abcd-000000000002', 'Sarah Johnson', 'sarah@creativeagency.com', '+1 (555) 987-6543', '456 Design Street, Floor 3, New York, NY 10001', 'Creative Agency Ltd.', 'active', 'Creative Director at Creative Agency Ltd. - Focuses on design equipment and creative tools. SMB customer from Marketing industry. Website: https://creativeagency.com. 8 total orders worth $12,450.'),
('01912f4e-1234-7890-abcd-000000000003', 'Michael Chen', 'mike@startuphub.com', '+1 (555) 456-7890', '789 Innovation Drive, Austin, TX 78701', 'StartUp Hub', 'active', 'Founder at StartUp Hub - Fast-growing startup with increasing order frequency. Startup customer from Technology industry. Website: https://startuphub.com. 12 total orders worth $28,900.'),
('01912f4e-1234-7890-abcd-000000000004', 'Lisa Rodriguez', 'lisa@digitalmarketing.com', '+1 (555) 234-5678', '321 Marketing Plaza, Los Angeles, CA 90028', 'Digital Marketing Pro', 'active', 'Marketing Manager at Digital Marketing Pro - Interested in bulk orders for team equipment. SMB prospect from Marketing industry. Website: https://digitalmarketing.com. Currently evaluating options.');

-- ===================================================================
-- STEP 6: ORDERS
-- ===================================================================
INSERT INTO orders (id, order_number, type, status, customer_name, customer_email, total_amount, tax_amount, shipping_cost, order_date, expected_delivery, notes) VALUES
('01912f4f-1234-7890-abcd-000000000001', 'ORD-2024-001001', 'sale', 'completed', 'Tech Solutions Inc.', 'orders@techsolutions.com', 15779.85, 1263.85, 50.00, '2024-01-15 09:30:00+00', '2024-01-18 17:00:00+00', 'Priority delivery requested'),
('01912f4f-1234-7890-abcd-000000000002', 'ORD-2024-001002', 'sale', 'shipped', 'Creative Agency Ltd.', 'purchasing@creativeagency.com', 2149.94, 171.99, 25.00, '2024-01-12 14:20:00+00', '2024-01-17 17:00:00+00', 'Standard shipping'),
('01912f4f-1234-7890-abcd-000000000003', 'ORD-2024-001003', 'sale', 'pending', 'StartUp Hub', 'orders@startuphub.com', 8999.97, 719.99, 0.00, '2024-01-13 11:45:00+00', '2024-01-20 17:00:00+00', 'Free shipping applied for bulk order');

-- ===================================================================
-- STEP 7: ORDER ITEMS
-- ===================================================================
INSERT INTO order_items (id, order_id, product_id, quantity, unit_price, total_price) VALUES
-- Order 1001 items
('01912f50-1234-7890-abcd-000000000001', '01912f4f-1234-7890-abcd-000000000001', '01912f4d-1234-7890-abcd-000000000001', 5, 2499.99, 12499.95),
('01912f50-1234-7890-abcd-000000000002', '01912f4f-1234-7890-abcd-000000000001', '01912f4d-1234-7890-abcd-000000000003', 10, 329.99, 3299.90),
-- Order 1002 items
('01912f50-1234-7890-abcd-000000000003', '01912f4f-1234-7890-abcd-000000000002', '01912f4d-1234-7890-abcd-000000000002', 2, 999.99, 1999.98),
('01912f50-1234-7890-abcd-000000000004', '01912f4f-1234-7890-abcd-000000000002', '01912f4d-1234-7890-abcd-000000000005', 1, 149.99, 149.99),
-- Order 1003 items
('01912f50-1234-7890-abcd-000000000005', '01912f4f-1234-7890-abcd-000000000003', '01912f4d-1234-7890-abcd-000000000002', 9, 999.99, 8999.91);

-- ===================================================================
-- STEP 8: STOCK MOVEMENTS
-- ===================================================================
INSERT INTO stock_movements (id, product_id, movement_type, quantity, reference_type, reference_id, reason, notes, created_by, created_at) VALUES
-- Initial stock entries
('01912f51-1234-7890-abcd-000000000001', '01912f4d-1234-7890-abcd-000000000001', 'in', 30, 'purchase', '01912f4f-1234-7890-abcd-000000000001', 'Initial stock', 'Bulk purchase from Apple Inc.', 'John Smith', '2024-01-10 08:00:00+00'),
('01912f51-1234-7890-abcd-000000000002', '01912f4d-1234-7890-abcd-000000000002', 'in', 25, 'purchase', '01912f4f-1234-7890-abcd-000000000002', 'Initial stock', 'New iPhone 15 Pro inventory', 'John Smith', '2024-01-10 08:15:00+00'),
('01912f51-1234-7890-abcd-000000000003', '01912f4d-1234-7890-abcd-000000000003', 'in', 50, 'purchase', '01912f4f-1234-7890-abcd-000000000003', 'Initial stock', 'Dell monitor shipment', 'John Smith', '2024-01-10 08:30:00+00'),
('01912f51-1234-7890-abcd-000000000004', '01912f4d-1234-7890-abcd-000000000004', 'in', 50, 'purchase', '01912f4f-1234-7890-abcd-000000000004', 'Initial stock', 'Logitech mice bulk order', 'John Smith', '2024-01-10 08:45:00+00'),
('01912f51-1234-7890-abcd-000000000005', '01912f4d-1234-7890-abcd-000000000005', 'in', 40, 'purchase', '01912f4f-1234-7890-abcd-000000000005', 'Initial stock', 'Gaming keyboards received', 'John Smith', '2024-01-10 09:00:00+00'),

-- Sales movements
('01912f51-1234-7890-abcd-000000000006', '01912f4d-1234-7890-abcd-000000000001', 'out', 5, 'order', '01912f4f-1234-7890-abcd-000000000001', 'Sale', 'Order ORD-2024-001001', 'Sarah Sales', '2024-01-15 09:30:00+00'),
('01912f51-1234-7890-abcd-000000000007', '01912f4d-1234-7890-abcd-000000000003', 'out', 10, 'order', '01912f4f-1234-7890-abcd-000000000001', 'Sale', 'Order ORD-2024-001001', 'Sarah Sales', '2024-01-15 09:31:00+00'),
('01912f51-1234-7890-abcd-000000000008', '01912f4d-1234-7890-abcd-000000000002', 'out', 2, 'order', '01912f4f-1234-7890-abcd-000000000002', 'Sale', 'Order ORD-2024-001002', 'Mike Sales', '2024-01-12 14:20:00+00'),
('01912f51-1234-7890-abcd-000000000009', '01912f4d-1234-7890-abcd-000000000005', 'out', 1, 'order', '01912f4f-1234-7890-abcd-000000000002', 'Sale', 'Order ORD-2024-001002', 'Mike Sales', '2024-01-12 14:21:00+00'),
('01912f51-1234-7890-abcd-000000000010', '01912f4d-1234-7890-abcd-000000000002', 'out', 9, 'order', '01912f4f-1234-7890-abcd-000000000003', 'Sale', 'Order ORD-2024-001003', 'Lisa Sales', '2024-01-13 11:45:00+00'),
('01912f51-1234-7890-abcd-000000000011', '01912f4d-1234-7890-abcd-000000000004', 'out', 50, 'adjustment', NULL, 'Damaged goods', 'Water damage during transport', 'Warehouse Manager', '2024-01-14 16:00:00+00'),
('01912f51-1234-7890-abcd-000000000012', '01912f4d-1234-7890-abcd-000000000005', 'out', 7, 'adjustment', NULL, 'Quality control', 'Defective units returned to supplier', 'QC Inspector', '2024-01-14 10:30:00+00');

-- ===================================================================
-- STEP 9: PRODUCT WAREHOUSE INVENTORY
-- ===================================================================
INSERT INTO product_warehouse_inventory (id, product_id, warehouse_id, quantity, reserved_quantity, location) VALUES
-- MacBook Pro distribution
('01912f52-1234-7890-abcd-000000000001', '01912f4d-1234-7890-abcd-000000000001', '01912f4c-1234-7890-abcd-000000000001', 15, 2, 'A-01-01'),
('01912f52-1234-7890-abcd-000000000002', '01912f4d-1234-7890-abcd-000000000001', '01912f4c-1234-7890-abcd-000000000002', 10, 1, 'B-02-03'),
-- iPhone distribution
('01912f52-1234-7890-abcd-000000000003', '01912f4d-1234-7890-abcd-000000000002', '01912f4c-1234-7890-abcd-000000000001', 5, 0, 'A-01-02'),
('01912f52-1234-7890-abcd-000000000004', '01912f4d-1234-7890-abcd-000000000002', '01912f4c-1234-7890-abcd-000000000003', 3, 0, 'C-01-01'),
-- Dell Monitor distribution
('01912f52-1234-7890-abcd-000000000005', '01912f4d-1234-7890-abcd-000000000003', '01912f4c-1234-7890-abcd-000000000001', 25, 5, 'A-02-01'),
('01912f52-1234-7890-abcd-000000000006', '01912f4d-1234-7890-abcd-000000000003', '01912f4c-1234-7890-abcd-000000000002', 20, 0, 'B-01-02'),
-- Mouse (out of stock)
('01912f52-1234-7890-abcd-000000000007', '01912f4d-1234-7890-abcd-000000000004', '01912f4c-1234-7890-abcd-000000000001', 0, 0, 'A-03-01'),
-- Gaming Keyboard
('01912f52-1234-7890-abcd-000000000008', '01912f4d-1234-7890-abcd-000000000005', '01912f4c-1234-7890-abcd-000000000001', 20, 3, 'A-03-02'),
('01912f52-1234-7890-abcd-000000000009', '01912f4d-1234-7890-abcd-000000000005', '01912f4c-1234-7890-abcd-000000000004', 12, 0, 'D-01-01');

-- ===================================================================
-- STEP 10: DASHBOARD METRICS (CALCULATED VALUES)
-- ===================================================================
INSERT INTO dashboard_metrics (id, metric_name, metric_value, metric_type, period_type) VALUES
('01912f53-1234-7890-abcd-000000000001', 'total_products', 313, 'count', 'daily'),
('01912f53-1234-7890-abcd-000000000002', 'low_stock_items', 12, 'count', 'daily'),
('01912f53-1234-7890-abcd-000000000003', 'out_of_stock_items', 5, 'count', 'daily'),
('01912f53-1234-7890-abcd-000000000004', 'total_inventory_value', 156789.45, 'currency', 'daily'),
('01912f53-1234-7890-abcd-000000000005', 'monthly_orders', 89, 'count', 'monthly'),
('01912f53-1234-7890-abcd-000000000006', 'pending_orders', 23, 'count', 'daily'),
('01912f53-1234-7890-abcd-000000000007', 'total_suppliers', 15, 'count', 'daily'),
('01912f53-1234-7890-abcd-000000000008', 'active_categories', 8, 'count', 'daily'),
('01912f53-1234-7890-abcd-000000000009', 'total_customers', 156, 'count', 'daily'),
('01912f53-1234-7890-abcd-000000000010', 'monthly_revenue', 247890.50, 'currency', 'monthly');

-- ===================================================================
-- STEP 11: CREATE VIEWS FOR EASY QUERYING
-- ===================================================================

-- Drop existing views first to avoid conflicts
DROP VIEW IF EXISTS dashboard_summary CASCADE;
DROP VIEW IF EXISTS product_inventory_summary CASCADE;
DROP VIEW IF EXISTS customer_summary CASCADE;

-- Dashboard summary view
CREATE OR REPLACE VIEW dashboard_summary AS
SELECT 
    (SELECT COUNT(*) FROM products WHERE status = 'active') as total_products,
    (SELECT COUNT(*) FROM products WHERE quantity <= min_stock_level AND quantity > 0) as low_stock_items,
    (SELECT COUNT(*) FROM products WHERE quantity = 0) as out_of_stock_items,
    (SELECT ROUND(SUM(price * quantity)::numeric, 2) FROM products WHERE status = 'active') as total_inventory_value,
    (SELECT COUNT(*) FROM orders WHERE EXTRACT(MONTH FROM order_date) = EXTRACT(MONTH FROM CURRENT_DATE)) as monthly_orders,
    (SELECT COUNT(*) FROM orders WHERE status = 'pending') as pending_orders,
    (SELECT COUNT(*) FROM suppliers WHERE status = 'active') as total_suppliers,
    (SELECT COUNT(*) FROM categories WHERE status = 'active') as active_categories;

-- Product inventory summary view
CREATE OR REPLACE VIEW product_inventory_summary AS
SELECT 
    p.id,
    p.name,
    p.sku,
    p.price,
    p.cost,
    p.quantity,
    p.min_stock_level,
    p.max_stock_level,
    p.status,
    c.name as category_name,
    s.name as supplier_name,
    CASE 
        WHEN p.quantity = 0 THEN 'Out of Stock'
        WHEN p.quantity <= p.min_stock_level THEN 'Low Stock'
        ELSE 'In Stock'
    END as stock_status,
    ROUND((p.price * p.quantity)::numeric, 2) as total_value
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN suppliers s ON p.supplier_id = s.id;

-- Customer summary view (simplified for current table structure)
CREATE OR REPLACE VIEW customer_summary AS
SELECT 
    c.id,
    c.name,
    c.email,
    c.company,
    c.status,
    c.notes,
    COALESCE(recent_orders.order_count_30d, 0) as orders_last_30_days,
    COALESCE(recent_orders.value_last_30d, 0) as value_last_30_days
FROM customers c
LEFT JOIN (
    SELECT 
        o.customer_name,
        COUNT(*) as order_count_30d,
        SUM(o.total_amount) as value_last_30d
    FROM orders o 
    WHERE o.order_date >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY o.customer_name
) recent_orders ON c.name = recent_orders.customer_name;

-- ===================================================================
-- STEP 12: CREATE FUNCTIONS FOR REAL-TIME STATISTICS
-- ===================================================================

-- Function to update dashboard metrics
CREATE OR REPLACE FUNCTION update_dashboard_metrics()
RETURNS void AS $$
BEGIN
    -- Delete existing daily metrics
    DELETE FROM dashboard_metrics WHERE period_type = 'daily';
    
    -- Insert fresh metrics
    INSERT INTO dashboard_metrics (metric_name, metric_value, metric_type, period_type)
    SELECT 'total_products', total_products, 'count', 'daily' FROM dashboard_summary
    UNION ALL
    SELECT 'low_stock_items', low_stock_items, 'count', 'daily' FROM dashboard_summary
    UNION ALL
    SELECT 'out_of_stock_items', out_of_stock_items, 'count', 'daily' FROM dashboard_summary
    UNION ALL
    SELECT 'total_inventory_value', total_inventory_value, 'currency', 'daily' FROM dashboard_summary
    UNION ALL
    SELECT 'monthly_orders', monthly_orders, 'count', 'daily' FROM dashboard_summary
    UNION ALL
    SELECT 'pending_orders', pending_orders, 'count', 'daily' FROM dashboard_summary
    UNION ALL
    SELECT 'total_suppliers', total_suppliers, 'count', 'daily' FROM dashboard_summary
    UNION ALL
    SELECT 'active_categories', active_categories, 'count', 'daily' FROM dashboard_summary;
END;
$$ LANGUAGE plpgsql;

-- Function to automatically update stock levels after movements
CREATE OR REPLACE FUNCTION update_product_quantity()
RETURNS TRIGGER AS $$
BEGIN
    -- Update product quantity based on stock movement
    IF NEW.movement_type = 'in' THEN
        UPDATE products 
        SET quantity = quantity + NEW.quantity,
            updated_at = NOW()
        WHERE id = NEW.product_id;
    ELSIF NEW.movement_type = 'out' THEN
        UPDATE products 
        SET quantity = quantity - NEW.quantity,
            updated_at = NOW()
        WHERE id = NEW.product_id;
    ELSIF NEW.movement_type = 'adjustment' THEN
        UPDATE products 
        SET quantity = NEW.quantity,
            updated_at = NOW()
        WHERE id = NEW.product_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic stock updates
CREATE TRIGGER trigger_update_product_quantity
    AFTER INSERT ON stock_movements
    FOR EACH ROW
    EXECUTE FUNCTION update_product_quantity();

-- ===================================================================
-- STEP 13: INITIAL METRICS CALCULATION
-- ===================================================================
SELECT update_dashboard_metrics();

-- ===================================================================
-- VERIFICATION QUERIES
-- ===================================================================
-- Run these to verify data was inserted correctly

-- Count records in each table
SELECT 'categories' as table_name, COUNT(*) as record_count FROM categories
UNION ALL
SELECT 'suppliers', COUNT(*) FROM suppliers
UNION ALL
SELECT 'warehouses', COUNT(*) FROM warehouses
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'customers', COUNT(*) FROM customers
UNION ALL
SELECT 'orders', COUNT(*) FROM orders
UNION ALL
SELECT 'order_items', COUNT(*) FROM order_items
UNION ALL
SELECT 'stock_movements', COUNT(*) FROM stock_movements
UNION ALL
SELECT 'product_warehouse_inventory', COUNT(*) FROM product_warehouse_inventory
UNION ALL
SELECT 'dashboard_metrics', COUNT(*) FROM dashboard_metrics;

-- Verify dashboard statistics
SELECT * FROM dashboard_summary;

-- Check stock levels
SELECT name, sku, quantity, min_stock_level, 
       CASE 
           WHEN quantity = 0 THEN 'Out of Stock'
           WHEN quantity <= min_stock_level THEN 'Low Stock'
           ELSE 'In Stock'
       END as status
FROM products
ORDER BY quantity ASC;

-- ===================================================================
-- SUCCESS MESSAGE
-- ===================================================================
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'DATABASE SEED COMPLETED SUCCESSFULLY!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Tables populated:';
    RAISE NOTICE '- Categories: % records', (SELECT COUNT(*) FROM categories);
    RAISE NOTICE '- Suppliers: % records', (SELECT COUNT(*) FROM suppliers);
    RAISE NOTICE '- Products: % records', (SELECT COUNT(*) FROM products);
    RAISE NOTICE '- Customers: % records', (SELECT COUNT(*) FROM customers);
    RAISE NOTICE '- Orders: % records', (SELECT COUNT(*) FROM orders);
    RAISE NOTICE '- Stock Movements: % records', (SELECT COUNT(*) FROM stock_movements);
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Your inventory management system is ready!';
    RAISE NOTICE 'Dashboard statistics have been calculated.';
    RAISE NOTICE 'All triggers and functions are active.';
    RAISE NOTICE '========================================';
END $$;
