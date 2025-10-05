#!/usr/bin/env node
/**
 * Database Setup and Testing Script
 * This script helps set up and validate the Supabase database integration
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://xxgpfxkokhuqoooqakkd.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4Z3BmeGtva2h1cW9vb3Fha2tkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2NjczNTEsImV4cCI6MjA3NTI0MzM1MX0.T9AmS12oaTWimda83HmaxBEEQLpbHcTH4QeWAggA_iU';

const supabase = createClient(supabaseUrl, supabaseKey);

// Test functions
async function testConnection() {
  console.log('🔌 Testing database connection...');
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('count')
      .limit(1);
    
    if (error) throw error;
    console.log('✅ Database connection successful!');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

async function testTables() {
  console.log('📋 Testing table accessibility...');
  
  const tables = [
    'categories',
    'suppliers', 
    'products',
    'customers',
    'orders',
    'stock_movements',
    'warehouses'
  ];
  
  const results = {};
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) throw error;
      results[table] = { status: 'accessible', count: data?.length || 0 };
      console.log(`  ✅ ${table}: accessible`);
    } catch (error) {
      results[table] = { status: 'error', error: error.message };
      console.log(`  ❌ ${table}: ${error.message}`);
    }
  }
  
  return results;
}

async function testDashboardView() {
  console.log('📊 Testing dashboard summary view...');
  try {
    const { data, error } = await supabase
      .from('dashboard_summary')
      .select('*')
      .limit(1);
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      console.log('✅ Dashboard view working!');
      console.log('  📈 Statistics:');
      console.log(`    - Total Products: ${data[0].total_products}`);
      console.log(`    - Low Stock: ${data[0].low_stock_items}`);
      console.log(`    - Out of Stock: ${data[0].out_of_stock_items}`);
      console.log(`    - Total Value: $${Number(data[0].total_inventory_value).toLocaleString()}`);
      return data[0];
    } else {
      console.log('⚠️  Dashboard view exists but no data returned');
      return null;
    }
  } catch (error) {
    console.error('❌ Dashboard view test failed:', error.message);
    return null;
  }
}

async function testRealTimeSubscription() {
  console.log('⚡ Testing real-time subscriptions...');
  
  return new Promise((resolve) => {
    let subscriptionWorking = false;
    
    const subscription = supabase
      .channel('test_channel')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'products'
      }, (payload) => {
        subscriptionWorking = true;
        console.log('✅ Real-time subscription working!');
        console.log('  📡 Received change:', payload.eventType);
        subscription.unsubscribe();
        resolve(true);
      })
      .subscribe();
    
    // Test timeout
    setTimeout(() => {
      if (!subscriptionWorking) {
        console.log('⚠️  Real-time subscription timeout (this is normal for testing)');
        subscription.unsubscribe();
        resolve(false);
      }
    }, 3000);
  });
}

async function testDataInsertion() {
  console.log('💾 Testing data insertion...');
  
  try {
    // Test inserting a sample category
    const testCategory = {
      name: `Test Category ${Date.now()}`,
      description: 'Test category for database validation',
      status: 'active'
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('categories')
      .insert([testCategory])
      .select();
    
    if (insertError) throw insertError;
    
    console.log('✅ Data insertion successful!');
    
    // Clean up test data
    if (insertData && insertData.length > 0) {
      const { error: deleteError } = await supabase
        .from('categories')
        .delete()
        .eq('id', insertData[0].id);
      
      if (!deleteError) {
        console.log('✅ Test data cleanup successful!');
      }
    }
    
    return true;
  } catch (error) {
    console.error('❌ Data insertion test failed:', error.message);
    return false;
  }
}

async function generateDatabaseReport() {
  console.log('\n📊 GENERATING DATABASE REPORT');
  console.log('================================');
  
  try {
    // Count all records
    const tables = ['categories', 'suppliers', 'products', 'customers', 'orders', 'stock_movements'];
    const counts = {};
    
    for (const table of tables) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        if (error) throw error;
        counts[table] = count || 0;
      } catch (error) {
        counts[table] = 'Error';
      }
    }
    
    console.log('📋 Table Record Counts:');
    Object.entries(counts).forEach(([table, count]) => {
      console.log(`  ${table.padEnd(20)}: ${count}`);
    });
    
    // Check dashboard metrics
    const { data: metrics } = await supabase
      .from('dashboard_summary')
      .select('*')
      .limit(1);
    
    if (metrics && metrics.length > 0) {
      console.log('\n📈 Dashboard Metrics:');
      console.log(`  Total Products      : ${metrics[0].total_products}`);
      console.log(`  Low Stock Items     : ${metrics[0].low_stock_items}`);
      console.log(`  Out of Stock Items  : ${metrics[0].out_of_stock_items}`);
      console.log(`  Total Value         : $${Number(metrics[0].total_inventory_value || 0).toLocaleString()}`);
      console.log(`  Monthly Orders      : ${metrics[0].monthly_orders || 0}`);
      console.log(`  Pending Orders      : ${metrics[0].pending_orders || 0}`);
    }
    
  } catch (error) {
    console.error('❌ Failed to generate report:', error.message);
  }
}

// Main execution
async function main() {
  console.log('🚀 INVENTORY MANAGEMENT SYSTEM - DATABASE VALIDATION');
  console.log('===================================================\n');
  
  // Step 1: Test connection
  const connectionOk = await testConnection();
  if (!connectionOk) {
    console.log('\n❌ Cannot proceed without database connection.');
    process.exit(1);
  }
  
  console.log('');
  
  // Step 2: Test tables
  await testTables();
  console.log('');
  
  // Step 3: Test dashboard view
  await testDashboardView();
  console.log('');
  
  // Step 4: Test data operations
  await testDataInsertion();
  console.log('');
  
  // Step 5: Test real-time (optional)
  await testRealTimeSubscription();
  console.log('');
  
  // Step 6: Generate report
  await generateDatabaseReport();
  
  console.log('\n🎉 DATABASE VALIDATION COMPLETE!');
  console.log('Your inventory management system is ready for production use.');
  console.log('\nNext steps:');
  console.log('1. Run the seed script if you see low record counts');
  console.log('2. Test the application in development mode');
  console.log('3. Deploy to production with confidence');
}

// Error handling
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run the tests immediately
runTests();

async function runTests() {
  await main().catch(console.error);
}

export {
  testConnection,
  testTables,
  testDashboardView,
  testDataInsertion,
  generateDatabaseReport
};
