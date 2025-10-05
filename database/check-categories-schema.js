import { supabase } from './config.js'

async function checkCategoriesSchema() {
  try {
    console.log('🔍 Checking categories table schema...')

    // Try to get existing data to see the schema
    const { data: existingData, error: selectError } = await supabase
      .from('categories')
      .select('*')
      .limit(5)

    if (selectError) {
      console.error('❌ Select failed:', selectError.message)
      return
    }

    console.log('📋 Existing categories data:', existingData)

    if (existingData && existingData.length > 0) {
      console.log('🏗️ Available columns:')
      Object.keys(existingData[0]).forEach(key => {
        console.log(`  • ${key}: ${typeof existingData[0][key]}`)
      })
    }

    // Get total count
    const { count } = await supabase
      .from('categories')
      .select('*', { count: 'exact', head: true })

    console.log(`📊 Found ${count} categories in database`)

  } catch (error) {
    console.error('❌ Error checking schema:', error.message)
  }
}

checkCategoriesSchema()
