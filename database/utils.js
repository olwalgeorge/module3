import { supabase } from './config.js'

/**
 * Database utility functions for inventory management system
 */

/**
 * Test database connection
 */
export async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('id')
      .limit(1)
    
    if (error) {
      throw error
    }
    
    console.log('✅ Database connection successful')
    return true
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
    return false
  }
}

/**
 * Check if a table exists
 */
export async function tableExists(tableName) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1)
    
    if (error && error.message.includes('does not exist')) {
      return false
    }
    
    return true
  } catch (error) {
    return false
  }
}

/**
 * Get table row count
 */
export async function getTableCount(tableName) {
  try {
    const { count, error } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true })
    
    if (error) {
      throw error
    }
    
    return count
  } catch (error) {
    console.error(`Error getting count for ${tableName}:`, error.message)
    return 0
  }
}

/**
 * Clear table data (use with caution)
 */
export async function clearTable(tableName) {
  try {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .neq('id', 'impossible-value') // Delete all records
    
    if (error) {
      throw error
    }
    
    console.log(`✅ Cleared table: ${tableName}`)
    return true
  } catch (error) {
    console.error(`❌ Failed to clear table ${tableName}:`, error.message)
    return false
  }
}

/**
 * Database health check
 */
export async function healthCheck() {
  console.log('🏥 Running database health check...')
  
  const tables = [
    'products',
    'categories', 
    'suppliers',
    'stock_movements',
    'orders',
    'customers'
  ]
  
  const results = {}
  
  for (const table of tables) {
    const exists = await tableExists(table)
    const count = exists ? await getTableCount(table) : 0
    
    results[table] = {
      exists,
      count,
      status: exists ? '✅' : '❌'
    }
    
    console.log(`  ${results[table].status} ${table}: ${exists ? `${count} records` : 'not found'}`)
  }
  
  return results
}

/**
 * Generate database report
 */
export async function generateReport() {
  console.log('📊 Generating database report...')
  console.log('=' .repeat(50))
  
  const health = await healthCheck()
  
  console.log('\n📈 Summary:')
  const totalTables = Object.keys(health).length
  const existingTables = Object.values(health).filter(t => t.exists).length
  const totalRecords = Object.values(health).reduce((sum, t) => sum + t.count, 0)
  
  console.log(`  📁 Tables: ${existingTables}/${totalTables} exist`)
  console.log(`  📝 Total Records: ${totalRecords.toLocaleString()}`)
  console.log(`  🎯 Database Health: ${Math.round((existingTables / totalTables) * 100)}%`)
  
  return health
}
