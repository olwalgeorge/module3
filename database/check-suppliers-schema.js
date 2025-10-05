import { supabase } from './config.js'

async function checkSuppliersTableSchema() {
  try {
    console.log('🔍 Checking suppliers table schema...')

    // Test with minimal data first
    const testSupplier = {
      name: 'Test Supplier',
      email: 'test@example.com'
    }

    console.log('📦 Inserting test supplier...')
    const { data: insertedSupplier, error: insertError } = await supabase
      .from('suppliers')
      .insert([testSupplier])
      .select()

    if (insertError) {
      console.error('❌ Failed to insert test supplier:', insertError.message)
      console.error('Details:', insertError)
      return
    }

    console.log('✅ Test supplier inserted successfully:', insertedSupplier[0])

    // Get the full structure from the inserted record
    console.log('🏗️ Available columns:')
    const columns = Object.keys(insertedSupplier[0])
    columns.forEach(col => {
      console.log('  • ' + col + ': ' + typeof insertedSupplier[0][col])
    })

    // Check existing suppliers
    const { data: allSuppliers, error: allError } = await supabase
      .from('suppliers')
      .select('*')

    if (allError) {
      console.error('❌ Error getting all suppliers:', allError.message)
      return
    }

    console.log(`📊 Found ${allSuppliers.length} suppliers in database`)

  } catch (error) {
    console.error('❌ Schema check failed:', error)
  }
}

// Run the check
checkSuppliersTableSchema()
