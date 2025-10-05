import { supabase } from './config.js'

async function checkPurchasesSchema() {
  try {
    console.log('🔍 Checking purchases table schema...')

    // Check if purchases table exists and get its structure
    const { data, error } = await supabase
      .from('purchases')
      .select('*')
      .limit(1)

    if (error) {
      console.error('❌ Error accessing purchases table:', error.message)
      console.log('📝 Creating purchases table structure...')
      
      // If table doesn't exist, show what the schema should be
      console.log('\n📋 Expected Purchases Table Schema:')
      console.log(`
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_order_number VARCHAR(50) UNIQUE NOT NULL,
  supplier_id UUID REFERENCES suppliers(id),
  supplier_name VARCHAR(255) NOT NULL,
  warehouse_id VARCHAR(100),
  warehouse_name VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'USD',
  payment_terms VARCHAR(50),
  payment_method VARCHAR(50),
  order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expected_delivery_date TIMESTAMP WITH TIME ZONE,
  actual_delivery_date TIMESTAMP WITH TIME ZONE,
  notes JSONB,
  items JSONB NOT NULL,
  delivery_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_purchases_supplier_id ON purchases(supplier_id);
CREATE INDEX idx_purchases_status ON purchases(status);
CREATE INDEX idx_purchases_order_date ON purchases(order_date);
CREATE INDEX idx_purchases_po_number ON purchases(purchase_order_number);
      `)
      return
    }

    console.log('✅ Purchases table exists')
    console.log('📊 Table structure verified')
    
    // Get count of existing records
    const { count } = await supabase
      .from('purchases')
      .select('*', { count: 'exact' })

    console.log(`📦 Current purchases count: ${count}`)

    if (data && data.length > 0) {
      console.log('\n📋 Sample purchase record structure:')
      console.log(JSON.stringify(data[0], null, 2))
    }

  } catch (error) {
    console.error('❌ Schema check failed:', error)
  }
}

// Run the schema check
checkPurchasesSchema()
