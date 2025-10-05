import { supabase } from './config.js'

// Enhanced categories with comprehensive business metadata
const enhancedCategories = [
  // Main Categories
  {
    id: '01912f4a-abcd-1234-5678-900000000101',
    name: 'Premium Electronics',
    description: 'High-end electronic devices, computers, and advanced technology products for professional and consumer markets',
    parent_id: null,
    status: 'active',
    created_at: '2023-01-15T08:00:00Z',
    updated_at: '2024-01-15T10:30:00Z'
  },
  {
    id: '01912f4a-abcd-1234-5678-900000000102',
    name: 'Mobile Technology',
    description: 'Smartphones, tablets, and mobile accessories for modern connectivity and productivity',
    parent_id: null,
    status: 'active',
    created_at: '2023-01-20T09:15:00Z',
    updated_at: '2024-01-12T14:20:00Z'
  },
  {
    id: '01912f4a-abcd-1234-5678-900000000103',
    name: 'Computer Accessories',
    description: 'Peripheral devices, input/output equipment, and computer enhancement products',
    parent_id: null,
    status: 'active',
    created_at: '2023-02-01T10:30:00Z',
    updated_at: '2024-01-08T16:45:00Z'
  },
  {
    id: '01912f4a-abcd-1234-5678-900000000104',
    name: 'Gaming Equipment',
    description: 'Specialized gaming hardware, peripherals, and entertainment technology',
    parent_id: null,
    status: 'active',
    created_at: '2023-02-15T11:45:00Z',
    updated_at: '2024-01-05T13:10:00Z'
  },
  {
    id: '01912f4a-abcd-1234-5678-900000000105',
    name: 'Display Technology',
    description: 'Monitors, screens, and display solutions for professional and personal use',
    parent_id: null,
    status: 'active',
    created_at: '2023-03-01T08:20:00Z',
    updated_at: '2024-01-03T11:55:00Z'
  },
  {
    id: '01912f4a-abcd-1234-5678-900000000106',
    name: 'Audio Equipment',
    description: 'Professional and consumer audio devices, headphones, and sound systems',
    parent_id: null,
    status: 'active',
    created_at: '2023-03-15T09:30:00Z',
    updated_at: '2023-12-28T15:20:00Z'
  },
  {
    id: '01912f4a-abcd-1234-5678-900000000107',
    name: 'Networking & Communication',
    description: 'Network infrastructure, routers, switches, and communication devices',
    parent_id: null,
    status: 'active',
    created_at: '2023-04-01T10:15:00Z',
    updated_at: '2023-12-20T12:30:00Z'
  },
  {
    id: '01912f4a-abcd-1234-5678-900000000108',
    name: 'Professional Software',
    description: 'Business software, licenses, and professional applications',
    parent_id: null,
    status: 'active',
    created_at: '2023-04-15T11:00:00Z',
    updated_at: '2023-12-15T09:45:00Z'
  },
  {
    id: '01912f4a-abcd-1234-5678-900000000109',
    name: 'Storage Solutions',
    description: 'Data storage devices, cloud solutions, and backup equipment',
    parent_id: null,
    status: 'active',
    created_at: '2023-05-01T08:45:00Z',
    updated_at: '2023-12-10T14:15:00Z'
  },
  {
    id: '01912f4a-abcd-1234-5678-900000000110',
    name: 'Security Systems',
    description: 'Cybersecurity, physical security, and surveillance equipment',
    parent_id: null,
    status: 'active',
    created_at: '2023-05-15T12:20:00Z',
    updated_at: '2023-12-05T16:40:00Z'
  },

  // Subcategories for Premium Electronics
  {
    id: '01912f4a-abcd-1234-5678-900000000201',
    name: 'Laptops & Notebooks',
    description: 'Professional and consumer laptops, ultrabooks, and portable computing devices',
    parent_id: '01912f4a-abcd-1234-5678-900000000101',
    status: 'active',
    created_at: '2023-01-16T09:00:00Z',
    updated_at: '2024-01-14T11:20:00Z'
  },
  {
    id: '01912f4a-abcd-1234-5678-900000000202',
    name: 'Desktop Computers',
    description: 'Workstations, desktop PCs, and all-in-one computer systems',
    parent_id: '01912f4a-abcd-1234-5678-900000000101',
    status: 'active',
    created_at: '2023-01-17T10:15:00Z',
    updated_at: '2024-01-13T15:30:00Z'
  },
  {
    id: '01912f4a-abcd-1234-5678-900000000203',
    name: 'Server Hardware',
    description: 'Enterprise servers, rack systems, and data center equipment',
    parent_id: '01912f4a-abcd-1234-5678-900000000101',
    status: 'active',
    created_at: '2023-01-18T11:30:00Z',
    updated_at: '2024-01-11T12:45:00Z'
  },

  // Subcategories for Mobile Technology
  {
    id: '01912f4a-abcd-1234-5678-900000000301',
    name: 'Smartphones',
    description: 'Premium smartphones and mobile communication devices',
    parent_id: '01912f4a-abcd-1234-5678-900000000102',
    status: 'active',
    created_at: '2023-01-21T08:30:00Z',
    updated_at: '2024-01-11T10:15:00Z'
  },
  {
    id: '01912f4a-abcd-1234-5678-900000000302',
    name: 'Tablets & E-readers',
    description: 'Tablets, e-readers, and portable digital content devices',
    parent_id: '01912f4a-abcd-1234-5678-900000000102',
    status: 'active',
    created_at: '2023-01-22T09:45:00Z',
    updated_at: '2024-01-10T13:20:00Z'
  },
  {
    id: '01912f4a-abcd-1234-5678-900000000303',
    name: 'Mobile Accessories',
    description: 'Cases, chargers, and mobile device enhancement products',
    parent_id: '01912f4a-abcd-1234-5678-900000000102',
    status: 'active',
    created_at: '2023-01-23T11:00:00Z',
    updated_at: '2024-01-09T14:35:00Z'
  },

  // Subcategories for Gaming Equipment
  {
    id: '01912f4a-abcd-1234-5678-900000000401',
    name: 'Gaming Consoles',
    description: 'Gaming systems, controllers, and console accessories',
    parent_id: '01912f4a-abcd-1234-5678-900000000104',
    status: 'active',
    created_at: '2023-02-16T10:30:00Z',
    updated_at: '2024-01-04T11:40:00Z'
  },
  {
    id: '01912f4a-abcd-1234-5678-900000000402',
    name: 'PC Gaming Hardware',
    description: 'Gaming keyboards, mice, headsets, and PC gaming peripherals',
    parent_id: '01912f4a-abcd-1234-5678-900000000104',
    status: 'active',
    created_at: '2023-02-17T12:15:00Z',
    updated_at: '2024-01-02T16:25:00Z'
  },
  {
    id: '01912f4a-abcd-1234-5678-900000000403',
    name: 'VR & AR Equipment',
    description: 'Virtual reality and augmented reality devices and accessories',
    parent_id: '01912f4a-abcd-1234-5678-900000000104',
    status: 'active',
    created_at: '2023-02-18T13:45:00Z',
    updated_at: '2023-12-30T18:10:00Z'
  }
]

async function seedCategoriesDatabase() {
  try {
    console.log('🌱 Starting categories database seeding...')

    // Check connection
    const { data: testData, error: testError } = await supabase
      .from('categories')
      .select('*')
      .limit(1)

    if (testError) {
      console.error('❌ Database connection failed:', testError.message)
      return
    }

    console.log('✅ Database connection successful')

    // Check if we should clear existing enhanced data
    const { data: existingEnhanced, error: checkError } = await supabase
      .from('categories')
      .select('id')
      .in('id', enhancedCategories.map(c => c.id))

    if (checkError) {
      console.error('❌ Failed to check existing data:', checkError.message)
      return
    }

    if (existingEnhanced && existingEnhanced.length > 0) {
      console.log(`⚠️ Found ${existingEnhanced.length} existing enhanced categories, removing them...`)
      const { error: deleteError } = await supabase
        .from('categories')
        .delete()
        .in('id', enhancedCategories.map(c => c.id))

      if (deleteError) {
        console.error('❌ Failed to clear existing enhanced data:', deleteError.message)
        return
      }
      console.log('✅ Existing enhanced data cleared')
    }

    // Insert enhanced categories
    console.log('📂 Inserting enhanced categories...')
    const { data: insertedCategories, error: insertError } = await supabase
      .from('categories')
      .insert(enhancedCategories)
      .select()

    if (insertError) {
      console.error('❌ Failed to insert categories:', insertError.message)
      console.error('Details:', insertError)
      return
    }

    console.log(`✅ Successfully inserted ${insertedCategories.length} categories`)

    // Verify the data with hierarchical structure
    console.log('🔍 Verifying inserted categories...')
    const { data: verifyData, error: verifyError } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (verifyError) {
      console.error('❌ Failed to verify categories:', verifyError.message)
      return
    }

    console.log(`✅ Verification complete: ${verifyData.length} categories in database`)
    
    // Organize categories hierarchically
    const mainCategories = verifyData.filter(c => c.parent_id === null)
    const subCategories = verifyData.filter(c => c.parent_id !== null)

    // Show hierarchical summary
    console.log('\n📊 Categories Hierarchy:')
    mainCategories.forEach(mainCat => {
      console.log(`📁 ${mainCat.name}`)
      console.log(`   ${mainCat.description}`)
      console.log(`   Status: ${mainCat.status} | Created: ${new Date(mainCat.created_at).toLocaleDateString()}`)
      
      const childCategories = subCategories.filter(sub => sub.parent_id === mainCat.id)
      if (childCategories.length > 0) {
        childCategories.forEach(child => {
          console.log(`   ├── ${child.name}`)
          console.log(`       ${child.description}`)
          console.log(`       Status: ${child.status}`)
        })
      }
      console.log('')
    })

    // Calculate statistics
    const activeCategories = verifyData.filter(c => c.status === 'active').length
    const mainCategoriesCount = mainCategories.length
    const subCategoriesCount = subCategories.length
    
    console.log('📈 Category Statistics:')
    console.log(`  📁 Total Categories: ${verifyData.length}`)
    console.log(`  🏢 Main Categories: ${mainCategoriesCount}`)
    console.log(`  📂 Subcategories: ${subCategoriesCount}`)
    console.log(`  ✅ Active Categories: ${activeCategories}`)

    // Show category depth analysis
    const categoryDepth = {}
    mainCategories.forEach(mainCat => {
      const children = subCategories.filter(sub => sub.parent_id === mainCat.id)
      categoryDepth[mainCat.name] = children.length
    })

    console.log('\n🌳 Category Tree Structure:')
    Object.entries(categoryDepth).forEach(([name, childCount]) => {
      console.log(`  ${name}: ${childCount} subcategories`)
    })

    console.log('\n🎉 Categories database seeding completed successfully!')

  } catch (error) {
    console.error('❌ Seeding failed:', error)
  }
}

// Run the seeding
seedCategoriesDatabase()
