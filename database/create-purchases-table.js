import { supabase } from './config.js'

async function createPurchasesTable() {
  try {
    console.log('🏗️ Creating purchases table...')

    // Create the purchases table with comprehensive schema
    const { error: createError } = await supabase.rpc('sql', {
      query: `
        CREATE TABLE IF NOT EXISTS purchases (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          purchase_order_number VARCHAR(50) UNIQUE NOT NULL,
          supplier_id UUID,
          supplier_name VARCHAR(255) NOT NULL,
          warehouse_id VARCHAR(100),
          warehouse_name VARCHAR(255),
          status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'ordered', 'in_transit', 'delivered', 'rejected', 'cancelled')),
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
        
        -- Create indexes for better performance
        CREATE INDEX IF NOT EXISTS idx_purchases_supplier_id ON purchases(supplier_id);
        CREATE INDEX IF NOT EXISTS idx_purchases_status ON purchases(status);
        CREATE INDEX IF NOT EXISTS idx_purchases_order_date ON purchases(order_date);
        CREATE INDEX IF NOT EXISTS idx_purchases_po_number ON purchases(purchase_order_number);
        CREATE INDEX IF NOT EXISTS idx_purchases_total_amount ON purchases(total_amount);
        
        -- Create updated_at trigger
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
        END;
        $$ language 'plpgsql';
        
        DROP TRIGGER IF EXISTS update_purchases_updated_at ON purchases;
        CREATE TRIGGER update_purchases_updated_at
          BEFORE UPDATE ON purchases
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
      `
    })

    if (createError) {
      console.error('❌ Failed to create purchases table:', createError.message)
      return false
    }

    console.log('✅ Purchases table created successfully')

    // Verify table creation
    const { data: verifyData, error: verifyError } = await supabase
      .from('purchases')
      .select('*')
      .limit(1)

    if (verifyError) {
      console.error('❌ Failed to verify table creation:', verifyError.message)
      return false
    }

    console.log('✅ Table verification successful')
    console.log('\n📋 Purchases table schema created with:')
    console.log('- Comprehensive purchase order tracking')
    console.log('- Financial fields: amounts, taxes, shipping, discounts')
    console.log('- Status workflow management')
    console.log('- JSONB fields for flexible metadata and items')
    console.log('- Proper indexing for performance')
    console.log('- Auto-updating timestamps')

    return true

  } catch (error) {
    console.error('❌ Table creation failed:', error)
    return false
  }
}

// Run the table creation
createPurchasesTable().then(success => {
  if (success) {
    console.log('\n🎉 Ready to run seed-purchases-database.js!')
  }
})
