#!/usr/bin/env node
/**
 * 🎯 AUTOMATED DATABASE SETUP SCRIPT
 * ==================================
 * This script will guide you through the complete database setup process
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = 'https://xxgpfxkokhuqoooqakkd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4Z3BmeGtva2h1cW9vb3Fha2tkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2NjczNTEsImV4cCI6MjA3NTI0MzM1MX0.T9AmS12oaTWimda83HmaxBEEQLpbHcTH4QeWAggA_iU';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log(`
🚀 INVENTORY MANAGEMENT SYSTEM - COMPLETE SETUP
===============================================

This script will help you set up your database with real data.

📋 WHAT WE'LL DO:
1. Check database connection
2. Execute schema (create tables)  
3. Load sample data (313 products)
4. Verify everything works

Let's get started!
`);

async function checkConnection() {
  console.log('🔌 Step 1: Testing connection...');
  try {
    const { data, error } = await supabase.from('categories').select('count').limit(1);
    if (error && error.code === '42P01') {
      console.log('✅ Connection successful (tables need to be created)');
      return true;
    } else if (error) {
      throw error;
    } else {
      console.log('✅ Connection successful (tables already exist)');
      return true;
    }
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    return false;
  }
}

async function executeSchema() {
  console.log('\n📋 Step 2: Setting up database schema...');
  
  try {
    const schemaPath = path.join(process.cwd(), 'database', 'schema.sql');
    if (!fs.existsSync(schemaPath)) {
      throw new Error('schema.sql file not found');
    }
    
    console.log('📁 Found schema.sql file');
    console.log('⚠️  MANUAL STEP REQUIRED:');
    console.log('   1. Go to: https://supabase.com/dashboard/project/xxgpfxkokhuqoooqakkd');
    console.log('   2. Click "SQL Editor"');
    console.log('   3. Copy the contents of database/schema.sql');
    console.log('   4. Paste and click "Run"');
    console.log('   5. Press Enter here when complete...');
    
    // Wait for user input
    await new Promise(resolve => {
      process.stdin.once('data', resolve);
    });
    
    // Test if schema was created
    const { data, error } = await supabase.from('categories').select('count').limit(1);
    if (error) {
      throw new Error('Schema not found. Please make sure you executed the schema.sql file.');
    }
    
    console.log('✅ Schema setup complete!');
    return true;
    
  } catch (error) {
    console.error('❌ Schema setup failed:', error.message);
    return false;
  }
}

async function loadSampleData() {
  console.log('\n📊 Step 3: Loading sample data...');
  
  try {
    const seedPath = path.join(process.cwd(), 'database', 'seed.sql');
    if (!fs.existsSync(seedPath)) {
      throw new Error('seed.sql file not found');
    }
    
    console.log('📁 Found seed.sql file');
    console.log('⚠️  MANUAL STEP REQUIRED:');
    console.log('   1. In the same Supabase SQL Editor');
    console.log('   2. Create a new query');
    console.log('   3. Copy the contents of database/seed.sql');
    console.log('   4. Paste and click "Run"');
    console.log('   5. Press Enter here when complete...');
    
    // Wait for user input
    await new Promise(resolve => {
      process.stdin.once('data', resolve);
    });
    
    // Test if data was loaded
    const { data: products, error: prodError } = await supabase
      .from('products')
      .select('count')
      .limit(1);
    
    if (prodError || !products || products.length === 0) {
      throw new Error('Sample data not found. Please make sure you executed the seed.sql file.');
    }
    
    console.log('✅ Sample data loaded successfully!');
    return true;
    
  } catch (error) {
    console.error('❌ Sample data loading failed:', error.message);
    return false;
  }
}

async function verifySetup() {
  console.log('\n🧪 Step 4: Verifying complete setup...');
  
  try {
    // Check dashboard statistics
    const { data: dashboard, error: dashError } = await supabase
      .from('dashboard_summary')
      .select('*')
      .limit(1);
    
    if (dashError) {
      throw new Error('Dashboard view not working: ' + dashError.message);
    }
    
    if (dashboard && dashboard.length > 0) {
      const stats = dashboard[0];
      console.log('\n🎉 SETUP COMPLETE! Your inventory system is ready!');
      console.log('======================================================');
      console.log('📊 DASHBOARD STATISTICS:');
      console.log(`   🛍️  Total Products: ${stats.total_products}`);
      console.log(`   🏢 Total Suppliers: ${stats.total_suppliers}`);
      console.log(`   👥 Active Categories: ${stats.active_categories}`);
      console.log(`   💰 Inventory Value: $${Number(stats.total_inventory_value || 0).toLocaleString()}`);
      console.log(`   ⚠️  Low Stock Items: ${stats.low_stock_items}`);
      console.log(`   📦 Out of Stock: ${stats.out_of_stock_items}`);
      console.log(`   📋 Pending Orders: ${stats.pending_orders}`);
      console.log('======================================================');
      console.log('\n🚀 READY TO LAUNCH:');
      console.log('   1. Run: npm run dev');
      console.log('   2. Visit: http://localhost:5173');
      console.log('   3. Navigate to Dashboard to see live statistics!');
      console.log('\n🌐 PRODUCTION DEPLOYMENT:');
      console.log('   Your app is already deployed at:');
      console.log('   https://inventory-management-system-juq8tzzsw-georges-projects-81ad07f1.vercel.app');
      
      return true;
    } else {
      throw new Error('Dashboard view exists but returned no data');
    }
    
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    console.log('\n🔧 TROUBLESHOOTING:');
    console.log('   1. Make sure both schema.sql and seed.sql were executed successfully');
    console.log('   2. Check for any error messages in the Supabase SQL Editor');
    console.log('   3. Try running the scripts again');
    return false;
  }
}

async function main() {
  console.log('Starting database setup process...\n');
  
  // Step 1: Check connection
  const connectionOk = await checkConnection();
  if (!connectionOk) {
    console.log('\n❌ Cannot proceed without database connection.');
    process.exit(1);
  }
  
  // Step 2: Execute schema
  const schemaOk = await executeSchema();
  if (!schemaOk) {
    console.log('\n❌ Cannot proceed without schema setup.');
    process.exit(1);
  }
  
  // Step 3: Load sample data
  const dataOk = await loadSampleData();
  if (!dataOk) {
    console.log('\n❌ Cannot proceed without sample data.');
    process.exit(1);
  }
  
  // Step 4: Verify everything
  const verifyOk = await verifySetup();
  if (!verifyOk) {
    console.log('\n⚠️  Setup completed but verification failed.');
    console.log('Your database might still work - try running the app.');
  }
  
  console.log('\n✨ Database setup process complete!');
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n\n👋 Setup cancelled by user');
  process.exit(0);
});

// Run the setup
main().catch(error => {
  console.error('\n❌ Setup failed:', error.message);
  process.exit(1);
});
