// Simple customer seeding test
import { createClient } from '@supabase/supabase-js'

// Use the same configuration as the app
const supabaseUrl = 'https://ctlcpcgjnozjdskbgsul.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0bGNwY2dqbm96amRza2Jnc3VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMzNjUzNTQsImV4cCI6MjA0ODk0MTM1NH0.HwOaDvjCpkwbDz1zcR5XDKE8bAG8jE8N3m2ZS0lhfU8'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    console.log('Testing Supabase connection...')
    
    // Test simple query
    const { data, error } = await supabase
      .from('customers')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('Connection test failed:', error)
      return false
    }
    
    console.log('✅ Connection successful!')
    return true
    
  } catch (err) {
    console.error('❌ Connection error:', err.message)
    return false
  }
}

testConnection()
