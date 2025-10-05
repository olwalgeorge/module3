import { supabase } from './config.js'

async function checkOrdersTableSchema() {
  try {
    console.log('🔍 Checking orders table schema...')

    // First, let's try to see if the table exists and get sample data
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .limit(1)

    if (error) {
      console.error('❌ Error accessing orders table:', error.message)
      
      // Try to get table info from information_schema
      const { data: tableInfo, error: tableError } = await supabase
        .rpc('get_table_columns', { table_name: 'orders' })
      
      if (tableError) {
        console.error('❌ Could not get table info:', tableError.message)
      } else {
        console.log('📋 Table columns:', tableInfo)
      }
      return
    }

    console.log('✅ Orders table exists')
    console.log('📊 Sample data structure:', data.length > 0 ? Object.keys(data[0]) : 'No data found')

    // Get all orders to see current structure
    const { data: allOrders, error: allError } = await supabase
      .from('orders')
      .select('*')

    if (allError) {
      console.error('❌ Error getting all orders:', allError.message)
      return
    }

    console.log(`📦 Found ${allOrders.length} orders in database`)
    
    if (allOrders.length > 0) {
      console.log('🏗️ Current table structure:')
      const columns = Object.keys(allOrders[0])
      columns.forEach(col => {
        const sampleValue = allOrders[0][col]
        const valueType = typeof sampleValue
        const displayValue = valueType === 'string' && sampleValue ? 
          '(e.g., "' + sampleValue.substring(0, 50) + (sampleValue.length > 50 ? '...' : '') + '")' : ''
        console.log('  • ' + col + ': ' + valueType + ' ' + displayValue)
      })

      console.log('\n📋 Sample order:')
      console.log(JSON.stringify(allOrders[0], null, 2))
    }

  } catch (error) {
    console.error('❌ Failed to check schema:', error)
  }
}

// Run the check
checkOrdersTableSchema()
