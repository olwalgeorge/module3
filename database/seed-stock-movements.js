import { supabase } from './config.js'

// Enhanced stock movements with comprehensive business metadata
const enhancedStockMovements = [
  // Recent Inbound Movements
  {
    id: '01912f51-abcd-1234-5678-900000000101',
    product_id: '01912f4d-1234-7890-abcd-000000000001', // MacBook Pro
    movement_type: 'in',
    quantity: 15,
    reference_type: 'purchase',
    reference_id: '01912f4f-1234-7890-abcd-000000000101',
    reason: 'Bulk Purchase Order',
    notes: JSON.stringify({
      supplier: 'Apple Inc.',
      purchase_order: 'PO-2024-0015',
      unit_cost: 2399.99,
      total_cost: 35999.85,
      shipping_cost: 299.99,
      received_by: 'Michael Chen',
      quality_check: 'passed',
      location: 'Warehouse A - Section 1',
      batch_number: 'APLMB240115',
      expiry_date: null,
      serial_numbers: ['MBP2024001', 'MBP2024002', 'MBP2024003'],
      condition: 'new',
      packaging_condition: 'excellent',
      documentation: 'complete',
      warranty_period: '1 year',
      priority: 'high',
      project_code: 'PROJ-2024-001'
    }),
    created_by: 'Michael Chen',
    created_at: '2024-01-15T10:30:00Z'
  },
  {
    id: '01912f51-abcd-1234-5678-900000000102',
    product_id: '01912f4d-1234-7890-abcd-000000000002', // iPhone 15 Pro
    movement_type: 'in',
    quantity: 30,
    reference_type: 'purchase',
    reference_id: '01912f4f-1234-7890-abcd-000000000102',
    reason: 'Restock - High Demand Item',
    notes: JSON.stringify({
      supplier: 'Apple Inc.',
      purchase_order: 'PO-2024-0016',
      unit_cost: 999.99,
      total_cost: 29999.70,
      shipping_cost: 149.99,
      received_by: 'Sarah Johnson',
      quality_check: 'passed',
      location: 'Warehouse B - Premium Section',
      batch_number: 'APLIPH240115',
      expiry_date: null,
      serial_numbers: ['IP15P001', 'IP15P002', 'IP15P003'],
      condition: 'new',
      packaging_condition: 'excellent',
      documentation: 'complete',
      warranty_period: '1 year',
      priority: 'critical',
      project_code: 'MOBILE-2024-001'
    }),
    created_by: 'Sarah Johnson',
    created_at: '2024-01-15T14:20:00Z'
  },
  {
    id: '01912f51-abcd-1234-5678-900000000103',
    product_id: '01912f4d-1234-7890-abcd-000000000003', // Dell Monitor
    movement_type: 'in',
    quantity: 20,
    reference_type: 'purchase',
    reference_id: '01912f4f-1234-7890-abcd-000000000103',
    reason: 'Monthly Inventory Replenishment',
    notes: JSON.stringify({
      supplier: 'Dell Technologies',
      purchase_order: 'PO-2024-0017',
      unit_cost: 299.99,
      total_cost: 5999.80,
      shipping_cost: 89.99,
      received_by: 'David Kim',
      quality_check: 'passed',
      location: 'Warehouse A - Electronics',
      batch_number: 'DELLMON240115',
      expiry_date: null,
      serial_numbers: ['DM24001', 'DM24002', 'DM24003'],
      condition: 'new',
      packaging_condition: 'good',
      documentation: 'complete',
      warranty_period: '3 years',
      priority: 'medium',
      project_code: 'OFFICE-2024-001'
    }),
    created_by: 'David Kim',
    created_at: '2024-01-16T09:45:00Z'
  },

  // Outbound Movements (Sales)
  {
    id: '01912f51-abcd-1234-5678-900000000201',
    product_id: '01912f4d-1234-7890-abcd-000000000001', // MacBook Pro
    movement_type: 'out',
    quantity: 3,
    reference_type: 'sale',
    reference_id: '01912f4f-1234-7890-abcd-000000000201',
    reason: 'Customer Order - Enterprise Sale',
    notes: JSON.stringify({
      customer: 'TechStartup Inc.',
      order_number: 'ORD-2024-0045',
      unit_price: 2499.99,
      total_revenue: 7499.97,
      picked_by: 'Lisa Wong',
      packed_by: 'Emma Rodriguez',
      shipped_via: 'FedEx Express',
      tracking_number: 'FDX123456789',
      shipping_address: '123 Tech Street, San Francisco, CA',
      expected_delivery: '2024-01-18',
      priority: 'high',
      sales_rep: 'Jennifer Lee',
      commission_rate: 0.05,
      discount_applied: 0,
      payment_terms: 'Net 30',
      project_code: 'ENTERPRISE-2024-001'
    }),
    created_by: 'Lisa Wong',
    created_at: '2024-01-16T15:30:00Z'
  },
  {
    id: '01912f51-abcd-1234-5678-900000000202',
    product_id: '01912f4d-1234-7890-abcd-000000000002', // iPhone 15 Pro
    movement_type: 'out',
    quantity: 5,
    reference_type: 'sale',
    reference_id: '01912f4f-1234-7890-abcd-000000000202',
    reason: 'Retail Sale - Walk-in Customer',
    notes: JSON.stringify({
      customer: 'Premium Electronics Store',
      order_number: 'ORD-2024-0046',
      unit_price: 1099.99,
      total_revenue: 5499.95,
      picked_by: 'Robert Taylor',
      packed_by: 'Michael Chen',
      shipped_via: 'UPS Next Day',
      tracking_number: 'UPS987654321',
      shipping_address: '456 Retail Plaza, Los Angeles, CA',
      expected_delivery: '2024-01-17',
      priority: 'high',
      sales_rep: 'Sarah Johnson',
      commission_rate: 0.03,
      discount_applied: 0.05,
      payment_terms: 'Immediate',
      project_code: 'RETAIL-2024-001'
    }),
    created_by: 'Robert Taylor',
    created_at: '2024-01-16T16:45:00Z'
  },

  // Adjustments
  {
    id: '01912f51-abcd-1234-5678-900000000301',
    product_id: '01912f4d-1234-7890-abcd-000000000004', // Logitech Mouse
    movement_type: 'in',
    quantity: 2,
    reference_type: 'adjustment',
    reference_id: '01912f4f-1234-7890-abcd-000000000301',
    reason: 'Cycle Count Adjustment - Found Items',
    notes: JSON.stringify({
      adjustment_type: 'positive',
      counted_by: 'Emma Rodriguez',
      verified_by: 'David Kim',
      original_count: 48,
      actual_count: 50,
      variance: 2,
      variance_value: 39.98,
      location: 'Warehouse A - Accessories',
      count_date: '2024-01-17',
      reason_code: 'FOUND_ITEMS',
      approval_required: false,
      approved_by: null,
      cycle_count_id: 'CC-2024-001',
      audit_trail: 'Items found during routine cycle count',
      cost_impact: 39.98,
      priority: 'low'
    }),
    created_by: 'Emma Rodriguez',
    created_at: '2024-01-17T11:15:00Z'
  },
  {
    id: '01912f51-abcd-1234-5678-900000000302',
    product_id: '01912f4d-1234-7890-abcd-000000000005', // Gaming Keyboard
    movement_type: 'out',
    quantity: 1,
    reference_type: 'adjustment',
    reference_id: '01912f4f-1234-7890-abcd-000000000302',
    reason: 'Damage Write-off',
    notes: JSON.stringify({
      adjustment_type: 'negative',
      inspected_by: 'Michael Chen',
      approved_by: 'David Kim',
      damage_type: 'water_damage',
      damage_description: 'Water damage from roof leak during storm',
      insurance_claim: 'INS-2024-003',
      cost_impact: 129.99,
      location: 'Warehouse B - Gaming Section',
      incident_date: '2024-01-16',
      incident_report: 'IR-2024-008',
      disposal_method: 'recycling',
      disposal_date: '2024-01-18',
      approval_required: true,
      priority: 'medium'
    }),
    created_by: 'Michael Chen',
    created_at: '2024-01-17T13:30:00Z'
  },

  // Transfers
  {
    id: '01912f51-abcd-1234-5678-900000000401',
    product_id: '01912f4d-1234-7890-abcd-000000000003', // Dell Monitor
    movement_type: 'out',
    quantity: 5,
    reference_type: 'transfer',
    reference_id: '01912f4f-1234-7890-abcd-000000000401',
    reason: 'Inter-warehouse Transfer',
    notes: JSON.stringify({
      transfer_type: 'inter_warehouse',
      from_warehouse: 'Warehouse A',
      to_warehouse: 'Warehouse C',
      from_location: 'A-Electronics-Rack-3',
      to_location: 'C-Display-Section-1',
      transfer_order: 'TRF-2024-005',
      authorized_by: 'Jennifer Lee',
      shipped_by: 'Robert Taylor',
      received_by: 'Lisa Wong',
      shipping_method: 'Company Truck',
      transfer_date: '2024-01-18',
      reason_code: 'DEMAND_BALANCING',
      cost_per_unit: 299.99,
      total_value: 1499.95,
      tracking_number: 'INT-TRF-001',
      priority: 'medium',
      expected_arrival: '2024-01-19'
    }),
    created_by: 'Robert Taylor',
    created_at: '2024-01-18T08:20:00Z'
  },

  // Returns
  {
    id: '01912f51-abcd-1234-5678-900000000501',
    product_id: '01912f4d-1234-7890-abcd-000000000002', // iPhone 15 Pro
    movement_type: 'in',
    quantity: 1,
    reference_type: 'return',
    reference_id: '01912f4f-1234-7890-abcd-000000000501',
    reason: 'Customer Return - Defective Unit',
    notes: JSON.stringify({
      return_type: 'customer_return',
      original_order: 'ORD-2024-0035',
      customer: 'Tech Enthusiast LLC',
      return_reason: 'defective_screen',
      return_condition: 'defective',
      rma_number: 'RMA-2024-012',
      received_by: 'Sarah Johnson',
      inspected_by: 'Michael Chen',
      inspection_result: 'confirmed_defective',
      refund_amount: 1099.99,
      restocking_fee: 0,
      warranty_claim: 'WCL-2024-008',
      disposition: 'return_to_vendor',
      vendor_rma: 'APPLE-RMA-456789',
      cost_recovery: 1099.99,
      priority: 'high'
    }),
    created_by: 'Sarah Johnson',
    created_at: '2024-01-18T14:10:00Z'
  },

  // Manufacturing/Assembly
  {
    id: '01912f51-abcd-1234-5678-900000000601',
    product_id: '01912f4d-1234-7890-abcd-000000000004', // Logitech Mouse
    movement_type: 'out',
    quantity: 10,
    reference_type: 'assembly',
    reference_id: '01912f4f-1234-7890-abcd-000000000601',
    reason: 'Component for Bundle Assembly',
    notes: JSON.stringify({
      assembly_type: 'product_bundle',
      work_order: 'WO-2024-003',
      bundle_sku: 'OFFICE-BUNDLE-001',
      assembled_by: 'Production Team A',
      supervisor: 'Emma Rodriguez',
      assembly_location: 'Assembly Line 2',
      bom_revision: 'BOM-v2.1',
      quality_check: 'passed',
      assembly_date: '2024-01-19',
      completion_time: '2.5 hours',
      labor_cost: 125.00,
      overhead_cost: 45.00,
      total_assembly_cost: 170.00,
      priority: 'medium'
    }),
    created_by: 'Emma Rodriguez',
    created_at: '2024-01-19T10:00:00Z'
  }
]

async function seedStockMovementsDatabase() {
  try {
    console.log('🌱 Starting stock movements database seeding...')

    // Check connection
    const { data: testData, error: testError } = await supabase
      .from('stock_movements')
      .select('*')
      .limit(1)

    if (testError) {
      console.error('❌ Database connection failed:', testError.message)
      return
    }

    console.log('✅ Database connection successful')

    // Check if we should clear existing enhanced data
    const { data: existingEnhanced, error: checkError } = await supabase
      .from('stock_movements')
      .select('id')
      .in('id', enhancedStockMovements.map(m => m.id))

    if (checkError) {
      console.error('❌ Failed to check existing data:', checkError.message)
      return
    }

    if (existingEnhanced && existingEnhanced.length > 0) {
      console.log(`⚠️ Found ${existingEnhanced.length} existing enhanced stock movements, removing them...`)
      const { error: deleteError } = await supabase
        .from('stock_movements')
        .delete()
        .in('id', enhancedStockMovements.map(m => m.id))

      if (deleteError) {
        console.error('❌ Failed to clear existing enhanced data:', deleteError.message)
        return
      }
      console.log('✅ Existing enhanced data cleared')
    }

    // Insert enhanced stock movements
    console.log('📦 Inserting enhanced stock movements...')
    const { data: insertedMovements, error: insertError } = await supabase
      .from('stock_movements')
      .insert(enhancedStockMovements)
      .select()

    if (insertError) {
      console.error('❌ Failed to insert stock movements:', insertError.message)
      console.error('Details:', insertError)
      return
    }

    console.log(`✅ Successfully inserted ${insertedMovements.length} stock movements`)

    // Verify the data with product information
    console.log('🔍 Verifying inserted stock movements...')
    const { data: verifyData, error: verifyError } = await supabase
      .from('stock_movements')
      .select(`
        *,
        products (
          name,
          sku,
          price
        )
      `)
      .order('created_at', { ascending: false })

    if (verifyError) {
      console.error('❌ Failed to verify stock movements:', verifyError.message)
      return
    }

    console.log(`✅ Verification complete: ${verifyData.length} stock movements in database`)
    
    // Show summary
    console.log('\n📊 Stock Movements Summary:')
    const movementsByType = {}
    let totalValue = 0

    verifyData.forEach(movement => {
      const type = movement.movement_type
      if (!movementsByType[type]) {
        movementsByType[type] = { count: 0, quantity: 0 }
      }
      movementsByType[type].count++
      movementsByType[type].quantity += movement.quantity

      // Parse notes for enhanced movements
      if (movement.notes && movement.notes.startsWith('{')) {
        try {
          const notes = JSON.parse(movement.notes)
          if (notes.total_cost) totalValue += notes.total_cost
          if (notes.total_revenue) totalValue += notes.total_revenue
        } catch {}
      }

      const productName = movement.products?.name || 'Unknown Product'
      const movementIcon = movement.movement_type === 'in' ? '⬆️' : '⬇️'
      console.log(`  ${movementIcon} ${movement.reference_type.toUpperCase()}: ${movement.quantity}x ${productName}`)
      console.log(`    Reason: ${movement.reason} | By: ${movement.created_by}`)
      console.log(`    Date: ${new Date(movement.created_at).toLocaleDateString()}`)
    })

    console.log('\n📈 Movement Statistics:')
    Object.entries(movementsByType).forEach(([type, stats]) => {
      const icon = type === 'in' ? '📈' : '📉'
      console.log(`  ${icon} ${type.toUpperCase()}: ${stats.count} movements, ${stats.quantity} total quantity`)
    })

    console.log(`\n💰 Total Transaction Value: $${totalValue.toLocaleString()}`)

    console.log('\n🎉 Stock movements database seeding completed successfully!')

  } catch (error) {
    console.error('❌ Seeding failed:', error)
  }
}

// Run the seeding
seedStockMovementsDatabase()
