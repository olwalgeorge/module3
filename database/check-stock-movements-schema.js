import { supabase } from './config.js'

async function checkStockMovementsSchema() {
  try {
    console.log('🔍 Checking stock_movements table schema...')

    // Insert a test stock movement to see the schema
    const testMovement = {
      product_name: 'Test Product',
      sku: 'TEST-001',
      movement_type: 'adjustment',
      quantity: 10,
      reference: 'TEST-REF-001'
    }

    const { data: insertedMovement, error: insertError } = await supabase
      .from('stock_movements')
      .insert(testMovement)
      .select()
      .single()

    if (insertError) {
      console.error('❌ Insert failed:', insertError.message)
      console.log('🔍 Checking existing data structure...')
      
      // Try to get existing data to see the schema
      const { data: existingData, error: selectError } = await supabase
        .from('stock_movements')
        .select('*')
        .limit(5)

      if (selectError) {
        console.error('❌ Select failed:', selectError.message)
        return
      }

      console.log('📋 Existing stock movements data:', existingData)
      return
    }

    console.log('📦 Test stock movement inserted successfully:', insertedMovement)

    // Check the structure
    console.log('🏗️ Available columns:')
    Object.keys(insertedMovement).forEach(key => {
      console.log(`  • ${key}: ${typeof insertedMovement[key]}`)
    })

    // Get total count
    const { count } = await supabase
      .from('stock_movements')
      .select('*', { count: 'exact', head: true })

    console.log(`📊 Found ${count} stock movements in database`)

    // Clean up test data
    await supabase
      .from('stock_movements')
      .delete()
      .eq('id', insertedMovement.id)

    console.log('🧹 Test data cleaned up')

  } catch (error) {
    console.error('❌ Error checking schema:', error.message)
  }
}

checkStockMovementsSchema()
