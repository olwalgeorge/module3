-- SQL Script to Add CRM Columns to Customers Table
-- Run this in your Supabase SQL Editor to add all the missing columns

-- Add CRM-specific columns to the customers table
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS avatar TEXT,
ADD COLUMN IF NOT EXISTS position TEXT,
ADD COLUMN IF NOT EXISTS industry TEXT,
ADD COLUMN IF NOT EXISTS priority TEXT CHECK (priority IN ('High', 'Medium', 'Low')),
ADD COLUMN IF NOT EXISTS totalOrders INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS totalValue NUMERIC(10,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS customerType TEXT CHECK (customerType IN ('Enterprise', 'SMB', 'Individual')),
ADD COLUMN IF NOT EXISTS source TEXT,
ADD COLUMN IF NOT EXISTS assignedTo TEXT,
ADD COLUMN IF NOT EXISTS lastOrderDate DATE,
ADD COLUMN IF NOT EXISTS nextFollowUp DATE;

-- Add some default profile pictures and sample data
UPDATE customers SET 
  avatar = CASE 
    WHEN name = 'John Smith' THEN 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    WHEN name = 'Sarah Johnson' THEN 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    WHEN name = 'Michael Chen' THEN 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    WHEN name = 'Lisa Rodriguez' THEN 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    WHEN name = 'David Wilson' THEN 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
    ELSE 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150&h=150&fit=crop&crop=face'
  END,
  position = CASE 
    WHEN name = 'John Smith' THEN 'Chief Technology Officer'
    WHEN name = 'Sarah Johnson' THEN 'Creative Director'
    WHEN name = 'Michael Chen' THEN 'Program Manager'
    WHEN name = 'Lisa Rodriguez' THEN 'Head of Operations'
    WHEN name = 'David Wilson' THEN 'VP of Engineering'
    ELSE 'Manager'
  END,
  industry = CASE 
    WHEN name = 'John Smith' THEN 'Technology'
    WHEN name = 'Sarah Johnson' THEN 'Marketing'
    WHEN name = 'Michael Chen' THEN 'Technology'
    WHEN name = 'Lisa Rodriguez' THEN 'Marketing'
    WHEN name = 'David Wilson' THEN 'Healthcare'
    ELSE 'Business'
  END,
  priority = CASE 
    WHEN name = 'John Smith' THEN 'High'
    WHEN name = 'Sarah Johnson' THEN 'Medium'
    WHEN name = 'Michael Chen' THEN 'Medium'
    WHEN name = 'Lisa Rodriguez' THEN 'High'
    WHEN name = 'David Wilson' THEN 'High'
    ELSE 'Low'
  END,
  totalOrders = CASE 
    WHEN name = 'John Smith' THEN 15
    WHEN name = 'Sarah Johnson' THEN 8
    WHEN name = 'Michael Chen' THEN 12
    WHEN name = 'Lisa Rodriguez' THEN 20
    WHEN name = 'David Wilson' THEN 2
    ELSE 1
  END,
  totalValue = CASE 
    WHEN name = 'John Smith' THEN 45750.00
    WHEN name = 'Sarah Johnson' THEN 22400.00
    WHEN name = 'Michael Chen' THEN 18600.00
    WHEN name = 'Lisa Rodriguez' THEN 35200.00
    WHEN name = 'David Wilson' THEN 8900.00
    ELSE 1000.00
  END,
  tags = CASE 
    WHEN name = 'John Smith' THEN ARRAY['Enterprise', 'VIP', 'Technical']
    WHEN name = 'Sarah Johnson' THEN ARRAY['Creative', 'Marketing', 'Seasonal']
    WHEN name = 'Michael Chen' THEN ARRAY['Startup', 'Bulk', 'Events']
    WHEN name = 'Lisa Rodriguez' THEN ARRAY['Operations', 'Analytics', 'Growth']
    WHEN name = 'David Wilson' THEN ARRAY['Healthcare', 'Compliance', 'Enterprise']
    ELSE ARRAY['Standard']
  END,
  website = CASE 
    WHEN name = 'John Smith' THEN 'https://techsolutions.com'
    WHEN name = 'Sarah Johnson' THEN 'https://creativeagencypro.com'
    WHEN name = 'Michael Chen' THEN 'https://startuphub.com'
    WHEN name = 'Lisa Rodriguez' THEN 'https://digitalmarketingsolutions.com'
    WHEN name = 'David Wilson' THEN 'https://healthtechinnovation.com'
    ELSE 'https://example.com'
  END,
  customerType = CASE 
    WHEN name = 'John Smith' THEN 'Enterprise'
    WHEN name = 'Sarah Johnson' THEN 'SMB'
    WHEN name = 'Michael Chen' THEN 'SMB'
    WHEN name = 'Lisa Rodriguez' THEN 'SMB'
    WHEN name = 'David Wilson' THEN 'Enterprise'
    ELSE 'Individual'
  END,
  source = CASE 
    WHEN name = 'John Smith' THEN 'Referral'
    WHEN name = 'Sarah Johnson' THEN 'Website Form'
    WHEN name = 'Michael Chen' THEN 'Trade Show'
    WHEN name = 'Lisa Rodriguez' THEN 'LinkedIn'
    WHEN name = 'David Wilson' THEN 'Cold Call'
    ELSE 'Website'
  END,
  assignedTo = CASE 
    WHEN name = 'John Smith' THEN 'Sarah Johnson'
    WHEN name = 'Sarah Johnson' THEN 'Mike Chen'
    WHEN name = 'Michael Chen' THEN 'Lisa Rodriguez'
    WHEN name = 'Lisa Rodriguez' THEN 'John Smith'
    WHEN name = 'David Wilson' THEN 'Sarah Johnson'
    ELSE 'Sales Team'
  END,
  lastOrderDate = CASE 
    WHEN name = 'John Smith' THEN '2024-09-15'::DATE
    WHEN name = 'Sarah Johnson' THEN '2024-09-28'::DATE
    WHEN name = 'Michael Chen' THEN '2024-09-22'::DATE
    WHEN name = 'Lisa Rodriguez' THEN '2024-10-01'::DATE
    WHEN name = 'David Wilson' THEN '2024-09-10'::DATE
    ELSE '2024-09-01'::DATE
  END,
  nextFollowUp = CASE 
    WHEN name = 'John Smith' THEN '2024-10-20'::DATE
    WHEN name = 'Sarah Johnson' THEN '2024-10-15'::DATE
    WHEN name = 'Michael Chen' THEN '2024-10-25'::DATE
    WHEN name = 'Lisa Rodriguez' THEN '2024-10-18'::DATE
    WHEN name = 'David Wilson' THEN '2024-10-12'::DATE
    ELSE '2024-10-30'::DATE
  END;

-- Update the customer_summary view to include new fields
DROP VIEW IF EXISTS customer_summary;
CREATE VIEW customer_summary AS
SELECT 
  c.id,
  c.name,
  c.email,
  c.company,
  c.status,
  c.notes,
  c.avatar,
  c.position,
  c.industry,
  c.priority,
  c.totalOrders,
  c.totalValue,
  c.tags,
  c.website,
  c.customerType,
  c.source,
  c.assignedTo,
  c.lastOrderDate,
  c.nextFollowUp,
  COALESCE((SELECT COUNT(*) FROM orders o WHERE o.customer_id = c.id AND o.created_at > NOW() - INTERVAL '30 days'), 0) as orders_last_30_days,
  COALESCE((SELECT SUM(o.total) FROM orders o WHERE o.customer_id = c.id AND o.created_at > NOW() - INTERVAL '30 days'), 0) as value_last_30_days
FROM customers c
ORDER BY c.totalValue DESC;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customers_priority ON customers(priority);
CREATE INDEX IF NOT EXISTS idx_customers_industry ON customers(industry);
CREATE INDEX IF NOT EXISTS idx_customers_customerType ON customers(customerType);
CREATE INDEX IF NOT EXISTS idx_customers_assignedTo ON customers(assignedTo);
CREATE INDEX IF NOT EXISTS idx_customers_nextFollowUp ON customers(nextFollowUp);

-- Grant necessary permissions (adjust as needed for your RLS policies)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON customers TO authenticated;
-- GRANT SELECT ON customer_summary TO authenticated;

SELECT 'CRM database schema update completed successfully!' as status;
