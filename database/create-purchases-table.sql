-- Create Purchases Table Script
-- Run this SQL in your Supabase SQL Editor to create the purchases table

-- Create the purchases table
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_order_number VARCHAR(50) UNIQUE NOT NULL,
  supplier_id UUID,
  supplier_name VARCHAR(255) NOT NULL,
  warehouse_id VARCHAR(100),
  warehouse_name VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending' 
    CHECK (status IN ('pending', 'approved', 'ordered', 'in_transit', 'delivered', 'rejected', 'cancelled')),
  total_amount DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'USD',
  payment_terms VARCHAR(50),
  payment_method VARCHAR(50),
  order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expected_delivery_date TIMESTAMP WITH TIME ZONE,
  actual_delivery_date TIMESTAMP WITH TIME ZONE,
  notes JSONB,
  items JSONB NOT NULL,
  delivery_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_purchases_supplier_id ON purchases(supplier_id);
CREATE INDEX idx_purchases_status ON purchases(status);
CREATE INDEX idx_purchases_order_date ON purchases(order_date);
CREATE INDEX idx_purchases_po_number ON purchases(purchase_order_number);
CREATE INDEX idx_purchases_total_amount ON purchases(total_amount);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_purchases_updated_at
  BEFORE UPDATE ON purchases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add RLS (Row Level Security) if needed
-- ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- Create a policy for authenticated users (optional)
-- CREATE POLICY "Users can view purchases" ON purchases
--   FOR SELECT USING (auth.role() = 'authenticated');

-- Insert sample data (optional - will be handled by seed script)
/*
INSERT INTO purchases (
  purchase_order_number, supplier_name, status, total_amount, tax_amount, 
  shipping_cost, discount_amount, currency, payment_method, order_date,
  expected_delivery_date, warehouse_name, items, notes
) VALUES 
(
  'PO-2024-001',
  'TechCorp Ltd Enhanced',
  'delivered',
  15750.00,
  1417.50,
  125.00,
  787.50,
  'USD',
  'Bank Transfer',
  '2024-01-15T10:30:00Z',
  '2024-01-22T17:00:00Z',
  'Main Warehouse',
  '[{"product_name": "MacBook Pro 16\"", "sku": "MBP-16-001", "quantity": 10, "unit_cost": 1299.99, "total_cost": 12999.90}]'::jsonb,
  '{"category": "Electronics", "priority": "high", "business_unit": "IT Department"}'::jsonb
);
*/

-- Verify table creation
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'purchases'
ORDER BY ordinal_position;
