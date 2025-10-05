-- Inventory Management System Database Schema
-- This script creates the necessary tables for the inventory system

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table (must be created first due to foreign key reference)
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    parent_id UUID REFERENCES categories(id),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Suppliers table (must be created before products)
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    country VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active',
    payment_terms TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(50),
    address TEXT,
    company VARCHAR(255),
    position VARCHAR(255),
    website VARCHAR(255),
    industry VARCHAR(100),
    customer_type VARCHAR(50) DEFAULT 'individual', -- 'individual', 'business', 'enterprise'
    status VARCHAR(20) DEFAULT 'active',
    priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high'
    source VARCHAR(100),
    assigned_to VARCHAR(255),
    total_orders INTEGER DEFAULT 0,
    total_value DECIMAL(15,2) DEFAULT 0,
    last_order_date TIMESTAMP WITH TIME ZONE,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_contact TIMESTAMP WITH TIME ZONE,
    next_follow_up TIMESTAMP WITH TIME ZONE,
    tags TEXT[], -- Array of tags
    notes TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    category_id UUID REFERENCES categories(id),
    supplier_id UUID REFERENCES suppliers(id),
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    cost DECIMAL(10,2) NOT NULL DEFAULT 0,
    quantity INTEGER NOT NULL DEFAULT 0,
    min_stock_level INTEGER DEFAULT 0,
    max_stock_level INTEGER DEFAULT 1000,
    status VARCHAR(20) DEFAULT 'active',
    image_url TEXT,
    barcode VARCHAR(100),
    weight DECIMAL(8,2),
    dimensions JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_number VARCHAR(100) UNIQUE NOT NULL,
    type VARCHAR(20) NOT NULL, -- 'purchase', 'sale', 'transfer'
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'
    supplier_id UUID REFERENCES suppliers(id),
    customer_name VARCHAR(255),
    customer_email VARCHAR(255),
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    shipping_cost DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expected_delivery TIMESTAMP WITH TIME ZONE,
    actual_delivery TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stock movements table
CREATE TABLE IF NOT EXISTS stock_movements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID REFERENCES products(id),
    movement_type VARCHAR(20) NOT NULL, -- 'in', 'out', 'adjustment'
    quantity INTEGER NOT NULL,
    reference_type VARCHAR(50), -- 'order', 'adjustment', 'transfer'
    reference_id UUID,
    reason VARCHAR(255),
    notes TEXT,
    created_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Warehouses table
CREATE TABLE IF NOT EXISTS warehouses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    address TEXT,
    manager VARCHAR(255),
    capacity INTEGER,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product warehouse inventory table
CREATE TABLE IF NOT EXISTS product_warehouse_inventory (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID REFERENCES products(id),
    warehouse_id UUID REFERENCES warehouses(id),
    quantity INTEGER NOT NULL DEFAULT 0,
    reserved_quantity INTEGER DEFAULT 0,
    location VARCHAR(100),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(product_id, warehouse_id)
);

-- Dashboard metrics table for storing calculated statistics
CREATE TABLE IF NOT EXISTS dashboard_metrics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15,2) NOT NULL DEFAULT 0,
    metric_type VARCHAR(20) NOT NULL, -- 'count', 'currency', 'percentage'
    period_type VARCHAR(20) NOT NULL, -- 'daily', 'weekly', 'monthly', 'yearly'
    period_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(metric_name, period_type, period_date)
);

-- Product variants table for storing product variations
CREATE TABLE IF NOT EXISTS product_variants (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    variant_name VARCHAR(255) NOT NULL,
    variant_value VARCHAR(255) NOT NULL,
    sku_suffix VARCHAR(50),
    price_adjustment DECIMAL(10,2) DEFAULT 0,
    stock_quantity INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_supplier ON products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_date ON orders(order_date);
CREATE INDEX IF NOT EXISTS idx_stock_movements_product ON stock_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_date ON stock_movements(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_suppliers_updated_at ON suppliers;
CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON suppliers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_customers_updated_at ON customers;
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_warehouses_updated_at ON warehouses;
CREATE TRIGGER update_warehouses_updated_at BEFORE UPDATE ON warehouses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_dashboard_metrics_updated_at ON dashboard_metrics;
CREATE TRIGGER update_dashboard_metrics_updated_at BEFORE UPDATE ON dashboard_metrics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_product_variants_updated_at ON product_variants;
CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON product_variants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO categories (name, description) VALUES
    ('Electronics', 'Electronic devices and accessories'),
    ('Office Supplies', 'General office supplies and equipment'),
    ('Furniture', 'Office and home furniture'),
    ('Software', 'Software licenses and digital products')
ON CONFLICT (name) DO NOTHING;

INSERT INTO suppliers (name, contact_person, email, phone, address, country) VALUES
    ('Tech Solutions Inc', 'John Smith', 'john@techsolutions.com', '+1-555-0101', '123 Tech Street, Silicon Valley, CA', 'USA'),
    ('Office Depot', 'Sarah Johnson', 'sarah@officedepot.com', '+1-555-0102', '456 Office Blvd, New York, NY', 'USA'),
    ('Furniture World', 'Mike Wilson', 'mike@furnitureworld.com', '+1-555-0103', '789 Furniture Ave, Chicago, IL', 'USA')
ON CONFLICT DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_warehouse_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all operations for now - adjust based on your auth requirements)
DROP POLICY IF EXISTS "Allow all operations" ON products;
CREATE POLICY "Allow all operations" ON products FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all operations" ON categories;
CREATE POLICY "Allow all operations" ON categories FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all operations" ON suppliers;
CREATE POLICY "Allow all operations" ON suppliers FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all operations" ON customers;
CREATE POLICY "Allow all operations" ON customers FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all operations" ON orders;
CREATE POLICY "Allow all operations" ON orders FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all operations" ON order_items;
CREATE POLICY "Allow all operations" ON order_items FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all operations" ON stock_movements;
CREATE POLICY "Allow all operations" ON stock_movements FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all operations" ON warehouses;
CREATE POLICY "Allow all operations" ON warehouses FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all operations" ON product_warehouse_inventory;
CREATE POLICY "Allow all operations" ON product_warehouse_inventory FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all operations" ON dashboard_metrics;
CREATE POLICY "Allow all operations" ON dashboard_metrics FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all operations" ON product_variants;
CREATE POLICY "Allow all operations" ON product_variants FOR ALL USING (true);

-- Create dashboard summary view for real-time statistics
CREATE OR REPLACE VIEW dashboard_summary AS
SELECT 
    (SELECT COUNT(*) FROM products WHERE status = 'active') as total_products,
    (SELECT COUNT(*) FROM products WHERE quantity < min_stock_level AND status = 'active') as low_stock_items,
    (SELECT COUNT(*) FROM products WHERE quantity = 0 AND status = 'active') as out_of_stock_items,
    (SELECT COALESCE(SUM(price * quantity), 0) FROM products WHERE status = 'active') as total_inventory_value,
    (SELECT COUNT(*) FROM orders WHERE DATE_TRUNC('month', order_date) = DATE_TRUNC('month', CURRENT_DATE)) as monthly_orders,
    (SELECT COUNT(*) FROM orders WHERE status = 'pending') as pending_orders,
    (SELECT COUNT(*) FROM customers WHERE status = 'active') as total_customers,
    (SELECT COUNT(*) FROM suppliers WHERE status = 'active') as total_suppliers;
