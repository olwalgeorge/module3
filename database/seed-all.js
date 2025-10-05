import { supabase } from './config.js'

// Import all seeding functions
import './seed-categories.js'
import './seed-suppliers.js'
import './seed-stock-movements.js'
import './seed-orders.js'
import './seed-purchases.js'
import './seed-crm.js'

async function runAllSeeds() {
  console.log('🌱 Starting comprehensive database seeding...')
  console.log('=' .repeat(60))

  try {
    // Test database connection first
    console.log('🔍 Testing database connection...')
    const { data: testData, error: testError } = await supabase
      .from('products')
      .select('id')
      .limit(1)

    if (testError) {
      console.error('❌ Database connection failed:', testError.message)
      console.error('Please check your .env file and ensure Supabase credentials are correct')
      return
    }

    console.log('✅ Database connection successful')
    console.log('')

    // List of seed scripts to run
    const seedScripts = [
      { name: 'Categories', file: 'seed-categories.js' },
      { name: 'Suppliers', file: 'seed-suppliers.js' },
      { name: 'Stock Movements', file: 'seed-stock-movements.js' },
      { name: 'Orders', file: 'seed-orders.js' },
      { name: 'Purchases', file: 'seed-purchases.js' },
      { name: 'CRM Data', file: 'seed-crm.js' }
    ]

    console.log('📋 Available seed scripts:')
    seedScripts.forEach((script, index) => {
      console.log(`  ${index + 1}. ${script.name} (${script.file})`)
    })

    console.log('')
    console.log('💡 To run individual seed scripts:')
    console.log('  cd database')
    seedScripts.forEach(script => {
      console.log(`  node ${script.file}`)
    })

    console.log('')
    console.log('🚀 All seed scripts are ready to run!')
    console.log('📝 Make sure to create the necessary tables in Supabase first.')
    console.log('📚 Check the SQL files in the database folder for table creation scripts.')

  } catch (error) {
    console.error('❌ Error during seeding preparation:', error)
  }
}

// Run the preparation
runAllSeeds()
