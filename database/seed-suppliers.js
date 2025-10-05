import { supabase } from './config.js'

// Enhanced suppliers with comprehensive metadata
const enhancedSuppliers = [
  {
    id: '550e8400-e29b-41d4-a716-446655440011',
    name: 'TechCorp Ltd Enhanced',
    contact_person: 'John Smith',
    email: 'orders@techcorp.com',
    phone: '+1-800-275-2273',
    address: '1 Technology Park, San Francisco, CA 94105',
    country: 'United States',
    status: 'active',
    payment_terms: 'Net 30',
    notes: JSON.stringify({
      category: 'Electronics',
      website: 'https://techcorp.com',
      taxId: 'TC-123456789',
      contactTitle: 'Senior Sales Manager',
      businessType: 'Corporation',
      industry: 'Technology',
      rating: 5,
      totalOrders: 45,
      totalValue: 125000,
      currency: 'USD',
      certifications: ['ISO 9001', 'ISO 14001'],
      specialties: ['Laptops', 'Desktops', 'Accessories'],
      leadTime: '5-7 business days',
      minimumOrder: 1000,
      volume_discounts: [
        { min_quantity: 100, discount: 0.05 },
        { min_quantity: 500, discount: 0.10 },
        { min_quantity: 1000, discount: 0.15 }
      ],
      lastOrderDate: '2024-01-15',
      preferredShipping: 'DHL Express',
      qualityScore: 95,
      onTimeDelivery: 98,
      communicationRating: 5,
      tags: ['premium', 'electronics', 'reliable', 'fast_shipping'],
      internalNotes: 'Top-tier supplier with excellent quality and reliability',
      contractStatus: 'active',
      contractExpiry: '2024-12-31',
      accountManager: 'Sarah Johnson',
      emergencyContact: '+1-800-275-2274'
    }),
    created_at: '2023-06-15T10:30:00Z',
    updated_at: '2024-01-15T14:20:00Z'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440012',
    name: 'Global Supplies Inc Enhanced',
    contact_person: 'Sarah Johnson',
    email: 'business@globalsupplies.com',
    phone: '+1-800-915-3355',
    address: '500 Commerce Street, Austin, TX 78701',
    country: 'United States',
    status: 'active',
    payment_terms: 'Net 15',
    notes: JSON.stringify({
      category: 'Office Supplies',
      website: 'https://globalsupplies.com',
      taxId: 'GS-987654321',
      contactTitle: 'Business Development Director',
      businessType: 'LLC',
      industry: 'Office Supplies',
      rating: 4,
      totalOrders: 32,
      totalValue: 89500,
      currency: 'USD',
      certifications: ['Green Business Certified', 'Fair Trade'],
      specialties: ['Stationery', 'Office Furniture', 'Printing Supplies'],
      leadTime: '3-5 business days',
      minimumOrder: 500,
      volume_discounts: [
        { min_quantity: 50, discount: 0.03 },
        { min_quantity: 200, discount: 0.07 },
        { min_quantity: 500, discount: 0.12 }
      ],
      lastOrderDate: '2024-01-12',
      preferredShipping: 'UPS Ground',
      qualityScore: 88,
      onTimeDelivery: 92,
      communicationRating: 4,
      tags: ['office_supplies', 'eco_friendly', 'competitive_pricing'],
      internalNotes: 'Great for bulk office supplies, competitive pricing',
      contractStatus: 'active',
      contractExpiry: '2024-08-30',
      accountManager: 'Mike Chen',
      emergencyContact: '+1-800-915-3356'
    }),
    created_at: '2023-08-20T09:15:00Z',
    updated_at: '2024-01-12T11:30:00Z'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440013',
    name: 'Premium Electronics Enhanced',
    contact_person: 'Mike Chen',
    email: 'sales@premiumelectronics.com',
    phone: '+1-510-795-8500',
    address: '2500 Innovation Drive, Seattle, WA 98101',
    country: 'United States',
    status: 'active',
    payment_terms: 'Net 30',
    notes: JSON.stringify({
      category: 'Electronics',
      website: 'https://premiumelectronics.com',
      taxId: 'PE-456789123',
      contactTitle: 'Regional Sales Director',
      businessType: 'Corporation',
      industry: 'Electronics',
      rating: 5,
      totalOrders: 28,
      totalValue: 156000,
      currency: 'USD',
      certifications: ['ISO 9001', 'RoHS Compliant', 'Energy Star Partner'],
      specialties: ['Premium Electronics', 'Gaming Equipment', 'Professional AV'],
      leadTime: '7-10 business days',
      minimumOrder: 2000,
      volume_discounts: [
        { min_quantity: 200, discount: 0.08 },
        { min_quantity: 1000, discount: 0.15 },
        { min_quantity: 2000, discount: 0.20 }
      ],
      lastOrderDate: '2024-01-10',
      preferredShipping: 'FedEx Priority',
      qualityScore: 97,
      onTimeDelivery: 96,
      communicationRating: 5,
      tags: ['premium', 'gaming', 'high_value', 'professional'],
      internalNotes: 'Premium supplier for high-end electronics and gaming equipment',
      contractStatus: 'active',
      contractExpiry: '2025-03-15',
      accountManager: 'Lisa Wong',
      emergencyContact: '+1-510-795-8501'
    }),
    created_at: '2023-09-10T14:45:00Z',
    updated_at: '2024-01-10T16:20:00Z'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440014',
    name: 'Office Solutions Pro Enhanced',
    contact_person: 'Lisa Wong',
    email: 'contact@officesolutions.com',
    phone: '+1-213-555-0199',
    address: '1200 Business Center, Los Angeles, CA 90028',
    country: 'United States',
    status: 'pending',
    payment_terms: 'Net 30',
    notes: JSON.stringify({
      category: 'Office Supplies',
      website: 'https://officesolutions.com',
      taxId: 'OS-789123456',
      contactTitle: 'Account Manager',
      businessType: 'LLC',
      industry: 'Office Solutions',
      rating: 3,
      totalOrders: 15,
      totalValue: 42000,
      currency: 'USD',
      certifications: ['Small Business Certified'],
      specialties: ['Custom Office Solutions', 'Ergonomic Furniture', 'Workspace Design'],
      leadTime: '10-14 business days',
      minimumOrder: 750,
      volume_discounts: [
        { min_quantity: 100, discount: 0.05 },
        { min_quantity: 300, discount: 0.08 }
      ],
      lastOrderDate: '2023-12-20',
      preferredShipping: 'Local Delivery',
      qualityScore: 82,
      onTimeDelivery: 85,
      communicationRating: 3,
      tags: ['office_solutions', 'custom_work', 'local_supplier'],
      internalNotes: 'New supplier under evaluation, custom solutions focus',
      contractStatus: 'trial',
      contractExpiry: '2024-06-30',
      accountManager: 'David Kim',
      emergencyContact: '+1-213-555-0200'
    }),
    created_at: '2023-11-05T10:00:00Z',
    updated_at: '2023-12-20T13:15:00Z'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440015',
    name: 'Manufacturing Direct Enhanced',
    contact_person: 'David Kim',
    email: 'orders@manufacturingdirect.com',
    phone: '+1-312-555-0145',
    address: '800 Industrial Blvd, Chicago, IL 60601',
    country: 'United States',
    status: 'active',
    payment_terms: 'Net 45',
    notes: JSON.stringify({
      category: 'Manufacturing',
      website: 'https://manufacturingdirect.com',
      taxId: 'MD-321654987',
      contactTitle: 'Manufacturing Operations Manager',
      businessType: 'Corporation',
      industry: 'Manufacturing',
      rating: 4,
      totalOrders: 52,
      totalValue: 198000,
      currency: 'USD',
      certifications: ['ISO 9001', 'Six Sigma', 'Lean Manufacturing'],
      specialties: ['Component Manufacturing', 'Assembly Services', 'Quality Control'],
      leadTime: '14-21 business days',
      minimumOrder: 5000,
      volume_discounts: [
        { min_quantity: 1000, discount: 0.10 },
        { min_quantity: 5000, discount: 0.18 },
        { min_quantity: 10000, discount: 0.25 }
      ],
      lastOrderDate: '2024-01-08',
      preferredShipping: 'Freight',
      qualityScore: 94,
      onTimeDelivery: 89,
      communicationRating: 4,
      tags: ['manufacturing', 'bulk_orders', 'industrial', 'components'],
      internalNotes: 'Reliable manufacturing partner for large volume orders',
      contractStatus: 'active',
      contractExpiry: '2024-10-15',
      accountManager: 'Emma Rodriguez',
      emergencyContact: '+1-312-555-0146'
    }),
    created_at: '2023-05-15T08:30:00Z',
    updated_at: '2024-01-08T12:45:00Z'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440016',
    name: 'Software Solutions Hub Enhanced',
    contact_person: 'Emma Rodriguez',
    email: 'licensing@softwarehub.com',
    phone: '+1-617-555-0177',
    address: '300 Tech Square, Boston, MA 02139',
    country: 'United States',
    status: 'active',
    payment_terms: 'Net 30',
    notes: JSON.stringify({
      category: 'Software',
      website: 'https://softwarehub.com',
      taxId: 'SS-654987321',
      contactTitle: 'Licensing Director',
      businessType: 'Corporation',
      industry: 'Software',
      rating: 4,
      totalOrders: 18,
      totalValue: 75000,
      currency: 'USD',
      certifications: ['Microsoft Partner', 'Adobe Authorized Reseller'],
      specialties: ['Software Licensing', 'Enterprise Solutions', 'Cloud Services'],
      leadTime: '1-3 business days',
      minimumOrder: 100,
      volume_discounts: [
        { min_quantity: 10, discount: 0.05 },
        { min_quantity: 50, discount: 0.12 },
        { min_quantity: 100, discount: 0.20 }
      ],
      lastOrderDate: '2024-01-05',
      preferredShipping: 'Digital Delivery',
      qualityScore: 98,
      onTimeDelivery: 99,
      communicationRating: 5,
      tags: ['software', 'digital_delivery', 'enterprise', 'licensing'],
      internalNotes: 'Excellent for software licensing and digital products',
      contractStatus: 'active',
      contractExpiry: '2025-01-31',
      accountManager: 'Robert Taylor',
      emergencyContact: '+1-617-555-0178'
    }),
    created_at: '2023-07-22T11:20:00Z',
    updated_at: '2024-01-05T09:30:00Z'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440017',
    name: 'European Tech Solutions Enhanced',
    contact_person: 'Hans Mueller',
    email: 'orders@eurotech.de',
    phone: '+49-30-12345678',
    address: 'Alexanderplatz 1, 10178 Berlin, Germany',
    country: 'Germany',
    status: 'active',
    payment_terms: 'Net 30',
    notes: JSON.stringify({
      category: 'Electronics',
      website: 'https://eurotech.de',
      taxId: 'DE123456789',
      contactTitle: 'International Sales Manager',
      businessType: 'GmbH',
      industry: 'Technology',
      rating: 4,
      totalOrders: 22,
      totalValue: 118000,
      currency: 'EUR',
      certifications: ['CE Certified', 'ISO 9001', 'GDPR Compliant'],
      specialties: ['European Electronics', 'Compliance Services', 'International Shipping'],
      leadTime: '10-14 business days',
      minimumOrder: 1500,
      volume_discounts: [
        { min_quantity: 100, discount: 0.06 },
        { min_quantity: 500, discount: 0.12 },
        { min_quantity: 1000, discount: 0.18 }
      ],
      lastOrderDate: '2024-01-03',
      preferredShipping: 'DHL International',
      qualityScore: 91,
      onTimeDelivery: 87,
      communicationRating: 4,
      tags: ['international', 'european', 'compliance', 'electronics'],
      internalNotes: 'European supplier for specialized electronics and compliance needs',
      contractStatus: 'active',
      contractExpiry: '2024-09-30',
      accountManager: 'Jennifer Lee',
      emergencyContact: '+49-30-12345679',
      timeZone: 'CET',
      language: 'German/English'
    }),
    created_at: '2023-04-10T15:00:00Z',
    updated_at: '2024-01-03T10:15:00Z'
  }
]

async function seedSuppliersDatabase() {
  try {
    console.log('🌱 Starting suppliers database seeding...')

    // Check connection
    const { data: testData, error: testError } = await supabase
      .from('suppliers')
      .select('*')
      .limit(1)

    if (testError) {
      console.error('❌ Database connection failed:', testError.message)
      return
    }

    console.log('✅ Database connection successful')

    // Skip clearing since some suppliers are referenced by products
    console.log('⚠️ Skipping clear operation due to foreign key constraints')

    // Insert enhanced suppliers
    console.log('🏢 Inserting enhanced suppliers...')
    const { data: insertedSuppliers, error: insertError } = await supabase
      .from('suppliers')
      .insert(enhancedSuppliers)
      .select()

    if (insertError) {
      console.error('❌ Failed to insert suppliers:', insertError.message)
      console.error('Details:', insertError)
      return
    }

    console.log(`✅ Successfully inserted ${insertedSuppliers.length} suppliers`)

    // Verify the data
    console.log('🔍 Verifying inserted suppliers...')
    const { data: verifyData, error: verifyError } = await supabase
      .from('suppliers')
      .select('*')
      .order('name')

    if (verifyError) {
      console.error('❌ Failed to verify suppliers:', verifyError.message)
      return
    }

    console.log(`✅ Verification complete: ${verifyData.length} suppliers in database`)
    
    // Show summary
    console.log('\n📊 Suppliers Summary:')
    verifyData.forEach(supplier => {
      const supplierData = JSON.parse(supplier.notes || '{}')
      console.log(`  • ${supplier.name} - ${supplierData.category || 'Unknown'}`)
      console.log(`    Status: ${supplier.status} | Orders: ${supplierData.totalOrders || 0} | Value: ${supplierData.currency || 'USD'} ${(supplierData.totalValue || 0).toLocaleString()}`)
      console.log(`    Rating: ${supplierData.rating || 'N/A'}/5 | Quality: ${supplierData.qualityScore || 'N/A'}% | On-time: ${supplierData.onTimeDelivery || 'N/A'}%`)
    })

    // Calculate statistics
    const totalValue = verifyData.reduce((sum, supplier) => {
      const supplierData = JSON.parse(supplier.notes || '{}')
      return sum + (supplierData.totalValue || 0)
    }, 0)
    const totalOrders = verifyData.reduce((sum, supplier) => {
      const supplierData = JSON.parse(supplier.notes || '{}')
      return sum + (supplierData.totalOrders || 0)
    }, 0)
    const activeSuppliers = verifyData.filter(s => s.status === 'active').length
    
    console.log('\n📈 Overall Statistics:')
    console.log(`  💰 Total Value: $${totalValue.toLocaleString()}`)
    console.log(`  📦 Total Orders: ${totalOrders}`)
    console.log(`  ✅ Active Suppliers: ${activeSuppliers}/${verifyData.length}`)

    console.log('\n🎉 Suppliers database seeding completed successfully!')

  } catch (error) {
    console.error('❌ Seeding failed:', error)
  }
}

// Run the seeding
seedSuppliersDatabase()
