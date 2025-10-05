-- ===================================================================
-- CUSTOMER DATA UPDATE SCRIPT
-- ===================================================================
-- This script updates the customers table with enhanced CRM data from mocks
-- Run this to update existing customer records with full CRM functionality
-- Safe to run multiple times - uses UPSERT (INSERT ... ON CONFLICT)

-- Start transaction for atomicity
BEGIN;

-- Create a temporary function to handle the upsert safely
CREATE OR REPLACE FUNCTION update_customer_data() RETURNS void AS $$
BEGIN
    -- Clear existing customers first (optional - comment out if you want to preserve existing data)
    DELETE FROM customers;
    
    -- Insert enhanced customer data with full CRM fields
    INSERT INTO customers (
        id, name, email, phone, address, company, position, website, 
        industry, customer_type, status, priority, source, assigned_to, 
        total_orders, total_value, last_order_date, created_date, 
        last_contact, next_follow_up, tags, notes, avatar_url
    ) VALUES
    (
        '01912f4e-1234-7890-abcd-000000000001', 
        'John Smith', 
        'contact@techsolutions.com', 
        '+1 (555) 123-4567', 
        '123 Business Park, Suite 100, San Francisco, CA 94105', 
        'Tech Solutions Inc.', 
        'CTO', 
        'https://techsolutions.com', 
        'Technology', 
        'enterprise', 
        'active', 
        'high', 
        'Website', 
        'John Smith', 
        15, 
        45750.00, 
        '2024-01-15T00:00:00Z', 
        '2023-06-15T00:00:00Z', 
        '2024-01-14T00:00:00Z', 
        '2024-01-20T00:00:00Z', 
        ARRAY['VIP', 'Enterprise', 'Technology'], 
        'Long-term client with consistent large orders. Prefers bulk purchases.', 
        '/images/avatar001_100x100.jpg'
    ),
    (
        '01912f4e-1234-7890-abcd-000000000002', 
        'Sarah Johnson', 
        'sarah@creativeagency.com', 
        '+1 (555) 987-6543', 
        '456 Design Street, Floor 3, New York, NY 10001', 
        'Creative Agency Ltd.', 
        'Creative Director', 
        'https://creativeagency.com', 
        'Marketing', 
        'business', 
        'active', 
        'medium', 
        'Referral', 
        'Sarah Johnson', 
        8, 
        12450.00, 
        '2024-01-12T00:00:00Z', 
        '2023-09-20T00:00:00Z', 
        '2024-01-10T00:00:00Z', 
        '2024-01-18T00:00:00Z', 
        ARRAY['Creative', 'Design', 'Regular'], 
        'Focuses on design equipment and creative tools. Seasonal ordering patterns.', 
        '/images/avatar002_100x100.jpg'
    ),
    (
        '01912f4e-1234-7890-abcd-000000000003', 
        'Michael Chen', 
        'mike@startuphub.com', 
        '+1 (555) 456-7890', 
        '789 Innovation Drive, Austin, TX 78701', 
        'StartUp Hub', 
        'Founder', 
        'https://startuphub.com', 
        'Technology', 
        'business', 
        'active', 
        'high', 
        'Trade Show', 
        'Mike Chen', 
        12, 
        28900.00, 
        '2024-01-13T00:00:00Z', 
        '2023-11-05T00:00:00Z', 
        '2024-01-13T00:00:00Z', 
        '2024-01-22T00:00:00Z', 
        ARRAY['Startup', 'Growth', 'Tech'], 
        'Fast-growing startup with increasing order frequency. Potential for partnership.', 
        '/images/avatar003_100x100.jpg'
    ),
    (
        '01912f4e-1234-7890-abcd-000000000004', 
        'Lisa Rodriguez', 
        'lisa@digitalmarketing.com', 
        '+1 (555) 234-5678', 
        '321 Marketing Plaza, Los Angeles, CA 90028', 
        'Digital Marketing Pro', 
        'Marketing Manager', 
        'https://digitalmarketing.com', 
        'Marketing', 
        'business', 
        'active', 
        'medium', 
        'Cold Call', 
        'Lisa Wong', 
        0, 
        0, 
        NULL, 
        '2024-01-10T00:00:00Z', 
        '2024-01-10T00:00:00Z', 
        '2024-01-17T00:00:00Z', 
        ARRAY['Prospect', 'Marketing', 'Qualified'], 
        'Interested in bulk orders for team equipment. Currently evaluating options.', 
        '/images/avatar004_100x100.jpg'
    ),
    (
        '01912f4e-1234-7890-abcd-000000000005', 
        'David Kim', 
        'david@enterprise.com', 
        '+1 (555) 345-6789', 
        '654 Corporate Center, Chicago, IL 60601', 
        'Enterprise Solutions Corp', 
        'Procurement Manager', 
        'https://enterprise.com', 
        'Enterprise', 
        'enterprise', 
        'active', 
        'high', 
        'LinkedIn', 
        'David Kim', 
        22, 
        67800.00, 
        '2024-01-12T00:00:00Z', 
        '2023-03-12T00:00:00Z', 
        '2024-01-11T00:00:00Z', 
        '2024-01-19T00:00:00Z', 
        ARRAY['Enterprise', 'Procurement', 'Volume'], 
        'Large enterprise client with quarterly bulk orders. Contract renewal due Q2.', 
        '/images/avatar005_100x100.jpg'
    ),
    (
        '01912f4e-1234-7890-abcd-000000000006', 
        'Emma Wilson', 
        'emma@freelancers.com', 
        '+1 (555) 567-8901', 
        '987 Remote Work Ave, Seattle, WA 98101', 
        'Freelancer Network', 
        'Community Manager', 
        'https://freelancers.com', 
        'Services', 
        'business', 
        'inactive', 
        'low', 
        'Website', 
        'Emma Rodriguez', 
        3, 
        2850.00, 
        '2023-11-20T00:00:00Z', 
        '2023-08-15T00:00:00Z', 
        '2023-12-05T00:00:00Z', 
        '2024-01-25T00:00:00Z', 
        ARRAY['Freelancer', 'Remote', 'Inactive'], 
        'Irregular ordering pattern. Last contact showed interest in remote work equipment.', 
        '/images/avatar006_100x100.jpg'
    )
    ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        email = EXCLUDED.email,
        phone = EXCLUDED.phone,
        address = EXCLUDED.address,
        company = EXCLUDED.company,
        position = EXCLUDED.position,
        website = EXCLUDED.website,
        industry = EXCLUDED.industry,
        customer_type = EXCLUDED.customer_type,
        status = EXCLUDED.status,
        priority = EXCLUDED.priority,
        source = EXCLUDED.source,
        assigned_to = EXCLUDED.assigned_to,
        total_orders = EXCLUDED.total_orders,
        total_value = EXCLUDED.total_value,
        last_order_date = EXCLUDED.last_order_date,
        created_date = EXCLUDED.created_date,
        last_contact = EXCLUDED.last_contact,
        next_follow_up = EXCLUDED.next_follow_up,
        tags = EXCLUDED.tags,
        notes = EXCLUDED.notes,
        avatar_url = EXCLUDED.avatar_url,
        updated_at = NOW();
        
    RAISE NOTICE 'Successfully updated customer data';
END;
$$ LANGUAGE plpgsql;

-- Execute the update function
SELECT update_customer_data();

-- Clean up the temporary function
DROP FUNCTION update_customer_data();

-- Verify the update
DO $$
DECLARE
    customer_count INTEGER;
    enterprise_count INTEGER;
    active_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO customer_count FROM customers;
    SELECT COUNT(*) INTO enterprise_count FROM customers WHERE customer_type = 'enterprise';
    SELECT COUNT(*) INTO active_count FROM customers WHERE status = 'active';
    
    RAISE NOTICE '=== CUSTOMER UPDATE SUMMARY ===';
    RAISE NOTICE 'Total customers: %', customer_count;
    RAISE NOTICE 'Enterprise customers: %', enterprise_count;
    RAISE NOTICE 'Active customers: %', active_count;
    RAISE NOTICE 'Customer types: Business (%), Enterprise (%), Individual (%)', 
        (SELECT COUNT(*) FROM customers WHERE customer_type = 'business'),
        (SELECT COUNT(*) FROM customers WHERE customer_type = 'enterprise'),
        (SELECT COUNT(*) FROM customers WHERE customer_type = 'individual');
    RAISE NOTICE 'Priority distribution: High (%), Medium (%), Low (%)',
        (SELECT COUNT(*) FROM customers WHERE priority = 'high'),
        (SELECT COUNT(*) FROM customers WHERE priority = 'medium'),
        (SELECT COUNT(*) FROM customers WHERE priority = 'low');
    RAISE NOTICE '=== UPDATE COMPLETE ===';
END;
$$;

-- Refresh any materialized views that might depend on customer data
-- (Uncomment if you have materialized views)
-- REFRESH MATERIALIZED VIEW customer_summary;

COMMIT;

-- Final verification query (optional - run this separately to see results)
-- SELECT 
--     name, 
--     company, 
--     customer_type, 
--     status, 
--     priority, 
--     total_orders, 
--     total_value,
--     array_length(tags, 1) as tag_count
-- FROM customers 
-- ORDER BY total_value DESC;
