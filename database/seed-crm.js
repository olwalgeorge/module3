import { supabase } from './config.js'

async function seedCustomerData() {
  console.log('🌱 Starting database seed for CRM features...')
  
  // First, let's check if we need to add new columns
  console.log('\n🔧 Checking current table structure...')
  
  // Get current customers
  const { data: currentCustomers, error: fetchError } = await supabase
    .from('customers')
    .select('*')
  
  if (fetchError) {
    console.error('❌ Error fetching customers:', fetchError)
    return
  }
  
  console.log(`📋 Found ${currentCustomers.length} existing customers`)
  
  // Enhanced customer data with only existing columns for now
  const enhancedCustomers = [
    {
      id: "01912f4e-1234-7890-abcd-000000000001",
      name: "John Smith",
      email: "contact@techsolutions.com",
      phone: "+1 (555) 123-4567",
      address: "123 Business Park, Suite 100, San Francisco, CA 94105",
      company: "Tech Solutions Inc.",
      status: "Active",
      notes: "CTO at Tech Solutions Inc. - Long-term client with consistent large orders. Position: Chief Technology Officer, Industry: Technology, Priority: High, Total Orders: 15, Total Value: $45,750, Tags: Enterprise/VIP/Technical, Website: https://techsolutions.com, Customer Type: Enterprise, Source: Referral, Assigned To: Sarah Johnson, Last Order: 2024-09-15, Next Follow-up: 2024-10-20"
    },
    {
      id: "01912f4e-1234-7890-abcd-000000000002",
      name: "Sarah Johnson",
      email: "sarah@creativeagency.com",
      phone: "+1 (555) 234-5678",
      address: "456 Creative District, Studio 200, Austin, TX 78701",
      company: "Creative Agency Pro",
      status: "Active",
      notes: "Creative Director with focus on digital marketing solutions. Position: Creative Director, Industry: Marketing, Priority: Medium, Total Orders: 8, Total Value: $22,400, Tags: Creative/Marketing/Seasonal, Website: https://creativeagencypro.com, Customer Type: SMB, Source: Website Form, Assigned To: Mike Chen, Last Order: 2024-09-28, Next Follow-up: 2024-10-15"
    },
    {
      id: "01912f4e-1234-7890-abcd-000000000003",
      name: "Michael Chen",
      email: "mike@startuphub.com", 
      phone: "+1 (555) 345-6789",
      address: "789 Innovation Way, Floor 3, Seattle, WA 98101",
      company: "Startup Hub",
      status: "Active",
      notes: "Startup accelerator program manager. Position: Program Manager, Industry: Technology, Priority: Medium, Total Orders: 12, Total Value: $18,600, Tags: Startup/Bulk/Events, Website: https://startuphub.com, Customer Type: SMB, Source: Trade Show, Assigned To: Lisa Rodriguez, Last Order: 2024-09-22, Next Follow-up: 2024-10-25"
    },
    {
      id: "01912f4e-1234-7890-abcd-000000000004",
      name: "Lisa Rodriguez",
      email: "lisa@digitalmarketing.com",
      phone: "+1 (555) 456-7890", 
      address: "321 Digital Plaza, Unit 150, Denver, CO 80202",
      company: "Digital Marketing Solutions",
      status: "Active",
      notes: "Head of Operations for growing digital marketing firm. Position: Head of Operations, Industry: Marketing, Priority: High, Total Orders: 20, Total Value: $35,200, Tags: Operations/Analytics/Growth, Website: https://digitalmarketingsolutions.com, Customer Type: SMB, Source: LinkedIn, Assigned To: John Smith, Last Order: 2024-10-01, Next Follow-up: 2024-10-18"
    },
    {
      id: "01912f4e-1234-7890-abcd-000000000005",
      name: "David Wilson",
      email: "david@healthtech.com",
      phone: "+1 (555) 567-8901",
      address: "654 Medical Center Dr, Suite 400, Boston, MA 02115", 
      company: "HealthTech Innovation",
      status: "Prospect",
      notes: "VP of Engineering at healthcare technology company. Position: VP of Engineering, Industry: Healthcare, Priority: High, Total Orders: 2, Total Value: $8,900, Tags: Healthcare/Compliance/Enterprise, Website: https://healthtechinnovation.com, Customer Type: Enterprise, Source: Cold Call, Assigned To: Sarah Johnson, Last Order: 2024-09-10, Next Follow-up: 2024-10-12"
    }
  ]
  
  console.log('\n🔄 Updating customer records with enhanced CRM data...')
  
  // Delete existing customers first
  const { error: deleteError } = await supabase
    .from('customers')
    .delete()
    .gt('id', '00000000-0000-0000-0000-000000000000') // This will delete all records
  
  if (deleteError) {
    console.error('❌ Error deleting existing customers:', deleteError)
    return
  }
  
  console.log('🧹 Cleared existing customer data')
  
  // Insert enhanced customer data
  const { data: insertedCustomers, error: insertError } = await supabase
    .from('customers')
    .insert(enhancedCustomers)
    .select()
  
  if (insertError) {
    console.error('❌ Error inserting enhanced customers:', insertError)
    return
  }
  
  console.log(`✅ Successfully inserted ${insertedCustomers.length} enhanced customers`)
  
  // Verify the data
  console.log('\n🔍 Verifying enhanced data...')
  const { data: verifyData, error: verifyError } = await supabase
    .from('customers')
    .select('name, company, status, notes')
  
  if (verifyError) {
    console.error('❌ Error verifying data:', verifyError)
    return
  }
  
  console.log('📊 Enhanced customer summary:')
  verifyData.forEach((customer, index) => {
    console.log(`  ${index + 1}. ${customer.name} at ${customer.company}`)
    console.log(`     Status: ${customer.status}`)
    console.log(`     Notes: ${customer.notes.substring(0, 100)}...`)
    console.log('')
  })
  
  console.log('🎉 Basic database seed completed!')
  console.log('📝 Note: All CRM data is stored in the notes field for now.')
  console.log('💡 To get full CRM functionality, you should add these columns to your Supabase customers table:')
  console.log('   - avatar (text)')
  console.log('   - position (text)')  
  console.log('   - industry (text)')
  console.log('   - priority (text)')
  console.log('   - totalOrders (integer)')
  console.log('   - totalValue (numeric)')
  console.log('   - tags (text[])')
  console.log('   - website (text)')
  console.log('   - customerType (text)')
  console.log('   - source (text)')
  console.log('   - assignedTo (text)')
  console.log('   - lastOrderDate (date)')
  console.log('   - nextFollowUp (date)')
}

seedCustomerData()
