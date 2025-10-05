// Simple test to check customer data using the app's configuration
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ctlcpcgjnozjdskbgsul.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0bGNwY2dqbm96amRza2Jnc3VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMzNjUzNTQsImV4cCI6MjA0ODk0MTM1NH0.HwOaDvjCpkwbDz1zcR5XDKE8bAG8jE8N3m2ZS0lhfU8'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testCustomerData() {
  console.log('Testing customer data...')
  
  try {
    // Test 1: Check if customer_summary table exists and has data
    const { data: customerSummary, error: summaryError } = await supabase
      .from('customer_summary')
      .select('*')
      .limit(5)
    
    console.log('Customer Summary Table:')
    console.log('Error:', summaryError)
    console.log('Data:', customerSummary)
    
    // Test 2: Check if customers table exists 
    const { data: customers, error: customersError } = await supabase
      .from('customers')
      .select('*')
      .limit(5)
    
    console.log('\nCustomers Table:')
    console.log('Error:', customersError)
    console.log('Data:', customers)
    
    // Test 3: Check all tables
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .ilike('table_name', '%customer%')
    
    console.log('\nCustomer-related Tables:')
    console.log('Error:', tablesError)
    console.log('Tables:', tables)
    
  } catch (error) {
    console.error('Test failed:', error)
  }
}

testCustomerData()
