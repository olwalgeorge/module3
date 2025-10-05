-- Enhanced Orders Schema Update Script
-- This script adds useful columns for better order management

-- Add columns if they don't exist
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'USD',
ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50),
ADD COLUMN IF NOT EXISTS shipped_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS tracking_number VARCHAR(100),
ADD COLUMN IF NOT EXISTS shipping_method VARCHAR(50),
ADD COLUMN IF NOT EXISTS customer_phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS shipping_address TEXT,
ADD COLUMN IF NOT EXISTS billing_address TEXT,
ADD COLUMN IF NOT EXISTS order_source VARCHAR(50),
ADD COLUMN IF NOT EXISTS sales_rep VARCHAR(100),
ADD COLUMN IF NOT EXISTS priority VARCHAR(20) DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS customer_type VARCHAR(50);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_customer_name ON orders(customer_name);
CREATE INDEX IF NOT EXISTS idx_orders_order_date ON orders(order_date);
CREATE INDEX IF NOT EXISTS idx_orders_total_amount ON orders(total_amount);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);

-- Create view for order analytics
CREATE OR REPLACE VIEW order_analytics AS
SELECT 
    status,
    COUNT(*) as order_count,
    SUM(total_amount) as total_revenue,
    AVG(total_amount) as avg_order_value,
    MIN(order_date) as first_order,
    MAX(order_date) as last_order
FROM orders 
GROUP BY status;

-- Create view for customer order summary
CREATE OR REPLACE VIEW customer_order_summary AS
SELECT 
    customer_name,
    customer_email,
    COUNT(*) as total_orders,
    SUM(total_amount) as total_spent,
    AVG(total_amount) as avg_order_value,
    MAX(order_date) as last_order_date,
    MIN(order_date) as first_order_date
FROM orders 
GROUP BY customer_name, customer_email
ORDER BY total_spent DESC;

-- Add comments for documentation
COMMENT ON TABLE orders IS 'Enhanced orders table with comprehensive order management fields';
COMMENT ON COLUMN orders.notes IS 'JSON field containing structured order metadata including items, priorities, and customer details';
COMMENT ON VIEW order_analytics IS 'Aggregated analytics by order status';
COMMENT ON VIEW customer_order_summary IS 'Customer-level order analytics and history';
