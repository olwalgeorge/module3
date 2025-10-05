// Enhanced Customer Data Updater
// This script can be run from the browser console or as a module
// to update customer data with full CRM functionality

// Enhanced customer data from mocks with proper typing
const enhancedCustomers = [
  {
    id: '01912f4e-1234-7890-abcd-000000000001',
    name: 'John Smith',
    email: 'contact@techsolutions.com',
    phone: '+1 (555) 123-4567',
    address: '123 Business Park, Suite 100, San Francisco, CA 94105',
    company: 'Tech Solutions Inc.',
    position: 'CTO',
    website: 'https://techsolutions.com',
    industry: 'Technology',
    customer_type: 'enterprise',
    status: 'active',
    priority: 'high',
    source: 'Website',
    assigned_to: 'John Smith',
    total_orders: 15,
    total_value: 45750.00,
    last_order_date: '2024-01-15T00:00:00Z',
    created_date: '2023-06-15T00:00:00Z',
    last_contact: '2024-01-14T00:00:00Z',
    next_follow_up: '2024-01-20T00:00:00Z',
    tags: ['VIP', 'Enterprise', 'Technology'],
    notes: 'Long-term client with consistent large orders. Prefers bulk purchases.',
    avatar_url: '/images/avatar001_100x100.jpg'
  },
  {
    id: '01912f4e-1234-7890-abcd-000000000002',
    name: 'Sarah Johnson',
    email: 'sarah@creativeagency.com',
    phone: '+1 (555) 987-6543',
    address: '456 Design Street, Floor 3, New York, NY 10001',
    company: 'Creative Agency Ltd.',
    position: 'Creative Director',
    website: 'https://creativeagency.com',
    industry: 'Marketing',
    customer_type: 'business',
    status: 'active',
    priority: 'medium',
    source: 'Referral',
    assigned_to: 'Sarah Johnson',
    total_orders: 8,
    total_value: 12450.00,
    last_order_date: '2024-01-12T00:00:00Z',
    created_date: '2023-09-20T00:00:00Z',
    last_contact: '2024-01-10T00:00:00Z',
    next_follow_up: '2024-01-18T00:00:00Z',
    tags: ['Creative', 'Design', 'Regular'],
    notes: 'Focuses on design equipment and creative tools. Seasonal ordering patterns.',
    avatar_url: '/images/avatar002_100x100.jpg'
  },
  {
    id: '01912f4e-1234-7890-abcd-000000000003',
    name: 'Michael Chen',
    email: 'mike@startuphub.com',
    phone: '+1 (555) 456-7890',
    address: '789 Innovation Drive, Austin, TX 78701',
    company: 'StartUp Hub',
    position: 'Founder',
    website: 'https://startuphub.com',
    industry: 'Technology',
    customer_type: 'business',
    status: 'active',
    priority: 'high',
    source: 'Trade Show',
    assigned_to: 'Mike Chen',
    total_orders: 12,
    total_value: 28900.00,
    last_order_date: '2024-01-13T00:00:00Z',
    created_date: '2023-11-05T00:00:00Z',
    last_contact: '2024-01-13T00:00:00Z',
    next_follow_up: '2024-01-22T00:00:00Z',
    tags: ['Startup', 'Growth', 'Tech'],
    notes: 'Fast-growing startup with increasing order frequency. Potential for partnership.',
    avatar_url: '/images/avatar003_100x100.jpg'
  },
  {
    id: '01912f4e-1234-7890-abcd-000000000004',
    name: 'Lisa Rodriguez',
    email: 'lisa@digitalmarketing.com',
    phone: '+1 (555) 234-5678',
    address: '321 Marketing Plaza, Los Angeles, CA 90028',
    company: 'Digital Marketing Pro',
    position: 'Marketing Manager',
    website: 'https://digitalmarketing.com',
    industry: 'Marketing',
    customer_type: 'business',
    status: 'active',
    priority: 'medium',
    source: 'Cold Call',
    assigned_to: 'Lisa Wong',
    total_orders: 0,
    total_value: 0,
    last_order_date: null,
    created_date: '2024-01-10T00:00:00Z',
    last_contact: '2024-01-10T00:00:00Z',
    next_follow_up: '2024-01-17T00:00:00Z',
    tags: ['Prospect', 'Marketing', 'Qualified'],
    notes: 'Interested in bulk orders for team equipment. Currently evaluating options.',
    avatar_url: '/images/avatar004_100x100.jpg'
  },
  {
    id: '01912f4e-1234-7890-abcd-000000000005',
    name: 'David Kim',
    email: 'david@enterprise.com',
    phone: '+1 (555) 345-6789',
    address: '654 Corporate Center, Chicago, IL 60601',
    company: 'Enterprise Solutions Corp',
    position: 'Procurement Manager',
    website: 'https://enterprise.com',
    industry: 'Enterprise',
    customer_type: 'enterprise',
    status: 'active',
    priority: 'high',
    source: 'LinkedIn',
    assigned_to: 'David Kim',
    total_orders: 22,
    total_value: 67800.00,
    last_order_date: '2024-01-12T00:00:00Z',
    created_date: '2023-03-12T00:00:00Z',
    last_contact: '2024-01-11T00:00:00Z',
    next_follow_up: '2024-01-19T00:00:00Z',
    tags: ['Enterprise', 'Procurement', 'Volume'],
    notes: 'Large enterprise client with quarterly bulk orders. Contract renewal due Q2.',
    avatar_url: '/images/avatar005_100x100.jpg'
  },
  {
    id: '01912f4e-1234-7890-abcd-000000000006',
    name: 'Emma Wilson',
    email: 'emma@freelancers.com',
    phone: '+1 (555) 567-8901',
    address: '987 Remote Work Ave, Seattle, WA 98101',
    company: 'Freelancer Network',
    position: 'Community Manager',
    website: 'https://freelancers.com',
    industry: 'Services',
    customer_type: 'business',
    status: 'inactive',
    priority: 'low',
    source: 'Website',
    assigned_to: 'Emma Rodriguez',
    total_orders: 3,
    total_value: 2850.00,
    last_order_date: '2023-11-20T00:00:00Z',
    created_date: '2023-08-15T00:00:00Z',
    last_contact: '2023-12-05T00:00:00Z',
    next_follow_up: '2024-01-25T00:00:00Z',
    tags: ['Freelancer', 'Remote', 'Inactive'],
    notes: 'Irregular ordering pattern. Last contact showed interest in remote work equipment.',
    avatar_url: '/images/avatar006_100x100.jpg'
  }
];

// Function to update customers using Supabase client (for use in app)
async function updateCustomersData(supabaseClient) {
  console.log('🔄 Starting customer data update...');
  
  try {
    // Step 1: Clear existing customer data (optional)
    console.log('🗑️ Clearing existing customer data...');
    const { error: deleteError } = await supabaseClient
      .from('customers')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
    
    if (deleteError) {
      console.warn('⚠️ Warning clearing customers:', deleteError.message);
    }
    
    // Step 2: Insert enhanced customer data
    console.log(`📊 Inserting ${enhancedCustomers.length} enhanced customers...`);
    
    // Remove the 'id' field to let the database generate new IDs
    const customersWithoutId = enhancedCustomers.map(customer => {
      const { id, ...customerData } = customer;
      return customerData;
    });
    
    const { data, error } = await supabaseClient
      .from('customers')
      .insert(customersWithoutId)
      .select();
    
    if (error) {
      throw error;
    }
    
    console.log(`✅ Successfully updated ${data.length} customers:`);
    data.forEach((customer, index) => {
      console.log(`   ${index + 1}. ${customer.name} (${customer.company}) - ${customer.status} - $${customer.total_value}`);
    });
    
    // Step 3: Verify update
    const { data: verification, error: verifyError } = await supabaseClient
      .from('customers')
      .select('count');
    
    if (!verifyError && verification) {
      console.log(`📈 Total customers in database: ${verification.length}`);
    }
    
    // Step 4: Show summary statistics
    const { data: stats } = await supabaseClient
      .from('customers')
      .select('customer_type, status, priority');
    
    if (stats) {
      const summary = {
        total: stats.length,
        enterprise: stats.filter(c => c.customer_type === 'enterprise').length,
        business: stats.filter(c => c.customer_type === 'business').length,
        active: stats.filter(c => c.status === 'active').length,
        high_priority: stats.filter(c => c.priority === 'high').length
      };
      
      console.log('📊 Customer Summary:', summary);
    }
    
    console.log('🎉 Customer data update completed successfully!');
    return { success: true, count: data.length };
    
  } catch (error) {
    console.error('❌ Error updating customer data:', error.message);
    return { success: false, error: error.message };
  }
}

// Function to run from browser console (with window.supabase)
async function updateCustomersFromConsole() {
  if (typeof window !== 'undefined' && window.supabase) {
    return await updateCustomersData(window.supabase);
  } else {
    console.error('❌ Supabase client not available. Make sure you are running this in the browser with the app loaded.');
    return { success: false, error: 'Supabase client not available' };
  }
}

// Export for use as module
export { updateCustomersData, enhancedCustomers, updateCustomersFromConsole };

// Instructions for manual execution
console.log(`
🚀 CUSTOMER DATA UPDATER LOADED
========================================

To update customer data, you can:

1. From browser console (when app is loaded):
   updateCustomersFromConsole()

2. From React component:
   import { updateCustomersData } from './path/to/this/file'
   import { supabase } from './path/to/supabase'
   updateCustomersData(supabase)

3. Run the SQL script instead:
   Execute database/update-customers.sql in your database

This will populate your customers table with:
- 6 detailed customer records
- Full CRM data (position, website, industry, etc.)
- Customer types: enterprise, business
- Various priority levels and statuses
- Rich metadata (tags, notes, contact history)
`);
