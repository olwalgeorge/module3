import { supabase } from './config.js'

// Enhanced orders with comprehensive metadata
const enhancedOrders = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    order_number: 'ORD-2024-0001',
    customer_name: 'Tech Solutions Inc.',
    customer_email: 'orders@techsolutions.com',
    customer_phone: '+1 (555) 123-4567',
    shipping_address: '123 Business Park, Suite 100, San Francisco, CA 94105',
    billing_address: '123 Business Park, Suite 100, San Francisco, CA 94105',
    total_amount: 15779.85,
    currency: 'USD',
    status: 'completed',
    payment_status: 'paid',
    payment_method: 'credit_card',
    order_date: '2024-01-15T10:30:00Z',
    delivery_date: '2024-01-18T14:00:00Z',
    shipped_date: '2024-01-17T09:15:00Z',
    tracking_number: 'TRK123456789',
    shipping_method: 'standard',
    tax_amount: 1262.39,
    discount_amount: 0,
    notes: JSON.stringify({
      priority: 'high',
      customerType: 'enterprise',
      salesRep: 'John Smith',
      source: 'website',
      tags: ['bulk_order', 'repeat_customer', 'enterprise'],
      internalNotes: 'Large enterprise order - expedited processing requested',
      shippingInstructions: 'Deliver to reception desk, require signature',
      items: [
        { 
          productName: 'MacBook Pro 16"', 
          sku: 'MBPR16-001',
          quantity: 5, 
          unitPrice: 2499.99, 
          totalPrice: 12499.95,
          warehouse: 'San Francisco Main',
          location: 'A1-B2'
        },
        { 
          productName: 'Dell Monitor 27"', 
          sku: 'DELL27-001',
          quantity: 10, 
          unitPrice: 329.99, 
          totalPrice: 3299.90,
          warehouse: 'San Francisco Main',
          location: 'C3-D4'
        }
      ]
    }),
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-18T14:00:00Z'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    order_number: 'ORD-2024-0002',
    customer_name: 'Creative Agency Ltd.',
    customer_email: 'purchasing@creativeagency.com',
    customer_phone: '+1 (555) 987-6543',
    shipping_address: '456 Design Street, Floor 3, New York, NY 10001',
    billing_address: '456 Design Street, Floor 3, New York, NY 10001',
    total_amount: 3399.92,
    currency: 'USD',
    status: 'processing',
    payment_status: 'paid',
    payment_method: 'bank_transfer',
    order_date: '2024-01-14T15:45:00Z',
    delivery_date: '2024-01-17T16:00:00Z',
    shipped_date: null,
    tracking_number: null,
    shipping_method: 'express',
    tax_amount: 271.99,
    discount_amount: 100.00,
    notes: JSON.stringify({
      priority: 'medium',
      customerType: 'smb',
      salesRep: 'Sarah Johnson',
      source: 'referral',
      tags: ['creative_agency', 'design_tools', 'regular_customer'],
      internalNotes: 'Creative agency order - fast turnaround required',
      shippingInstructions: 'Call before delivery, business hours only',
      discountReason: 'Repeat customer discount 3%',
      items: [
        { 
          productName: 'iPhone 15 Pro', 
          sku: 'IPH15P-001',
          quantity: 3, 
          unitPrice: 999.99, 
          totalPrice: 2999.97,
          warehouse: 'New York East',
          location: 'E5-F6'
        },
        { 
          productName: 'Wireless Mouse', 
          sku: 'WMSE-001',
          quantity: 5, 
          unitPrice: 79.99, 
          totalPrice: 399.95,
          warehouse: 'New York East',
          location: 'G7-H8'
        }
      ]
    }),
    created_at: '2024-01-14T15:45:00Z',
    updated_at: '2024-01-16T10:20:00Z'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    order_number: 'ORD-2024-0003',
    customer_name: 'StartUp Hub',
    customer_email: 'admin@startuphub.com',
    customer_phone: '+1 (555) 456-7890',
    shipping_address: '789 Innovation Drive, Austin, TX 78701',
    billing_address: '789 Innovation Drive, Austin, TX 78701',
    total_amount: 1199.92,
    currency: 'USD',
    status: 'shipped',
    payment_status: 'paid',
    payment_method: 'credit_card',
    order_date: '2024-01-13T09:20:00Z',
    delivery_date: '2024-01-16T12:00:00Z',
    shipped_date: '2024-01-15T08:30:00Z',
    tracking_number: 'TRK987654321',
    shipping_method: 'overnight',
    tax_amount: 95.99,
    discount_amount: 50.00,
    notes: JSON.stringify({
      priority: 'high',
      customerType: 'startup',
      salesRep: 'Mike Chen',
      source: 'trade_show',
      tags: ['startup', 'tech_equipment', 'growth_potential'],
      internalNotes: 'Fast-growing startup - potential for larger future orders',
      shippingInstructions: 'Startup office, ask for reception',
      discountReason: 'New customer welcome discount',
      items: [
        { 
          productName: 'Gaming Keyboard', 
          sku: 'GMKB-001',
          quantity: 8, 
          unitPrice: 149.99, 
          totalPrice: 1199.92,
          warehouse: 'Austin Central',
          location: 'I9-J10'
        }
      ]
    }),
    created_at: '2024-01-13T09:20:00Z',
    updated_at: '2024-01-16T12:00:00Z'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    order_number: 'ORD-2024-0004',
    customer_name: 'Digital Marketing Pro',
    customer_email: 'orders@digitalmarketing.com',
    customer_phone: '+1 (555) 234-5678',
    shipping_address: '321 Marketing Plaza, Los Angeles, CA 90028',
    billing_address: '321 Marketing Plaza, Los Angeles, CA 90028',
    total_amount: 8999.94,
    currency: 'USD',
    status: 'pending',
    payment_status: 'pending',
    payment_method: 'net_30',
    order_date: '2024-01-16T14:15:00Z',
    delivery_date: '2024-01-20T10:00:00Z',
    shipped_date: null,
    tracking_number: null,
    shipping_method: 'standard',
    tax_amount: 719.99,
    discount_amount: 200.00,
    notes: JSON.stringify({
      priority: 'medium',
      customerType: 'prospect',
      salesRep: 'Lisa Wong',
      source: 'cold_call',
      tags: ['new_prospect', 'marketing_agency', 'trial_order'],
      internalNotes: 'First order from new prospect - handle with care',
      shippingInstructions: 'Marketing agency office, flexible delivery time',
      discountReason: 'First-time customer discount',
      items: [
        { 
          productName: 'MacBook Pro 16"', 
          sku: 'MBPR16-001',
          quantity: 2, 
          unitPrice: 2499.99, 
          totalPrice: 4999.98,
          warehouse: 'Los Angeles West',
          location: 'K11-L12'
        },
        { 
          productName: 'iPhone 15 Pro', 
          sku: 'IPH15P-001',
          quantity: 4, 
          unitPrice: 999.99, 
          totalPrice: 3999.96,
          warehouse: 'Los Angeles West',
          location: 'M13-N14'
        }
      ]
    }),
    created_at: '2024-01-16T14:15:00Z',
    updated_at: '2024-01-16T14:15:00Z'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    order_number: 'ORD-2024-0005',
    customer_name: 'Enterprise Solutions Corp',
    customer_email: 'procurement@enterprise.com',
    customer_phone: '+1 (555) 345-6789',
    shipping_address: '654 Corporate Center, Chicago, IL 60601',
    billing_address: '654 Corporate Center, Chicago, IL 60601',
    total_amount: 8399.55,
    currency: 'USD',
    status: 'processing',
    payment_status: 'paid',
    payment_method: 'purchase_order',
    order_date: '2024-01-12T11:00:00Z',
    delivery_date: '2024-01-19T13:30:00Z',
    shipped_date: null,
    tracking_number: null,
    shipping_method: 'freight',
    tax_amount: 671.96,
    discount_amount: 500.00,
    notes: JSON.stringify({
      priority: 'high',
      customerType: 'enterprise',
      salesRep: 'Robert Davis',
      source: 'direct_sales',
      tags: ['enterprise', 'bulk_order', 'office_setup'],
      internalNotes: 'Large enterprise bulk order for new office setup',
      shippingInstructions: 'Corporate loading dock, requires appointment',
      discountReason: 'Volume discount for bulk order',
      purchaseOrderNumber: 'PO-2024-ESC-001',
      items: [
        { 
          productName: 'Dell Monitor 27"', 
          sku: 'DELL27-001',
          quantity: 15, 
          unitPrice: 329.99, 
          totalPrice: 4949.85,
          warehouse: 'Chicago North',
          location: 'O15-P16'
        },
        { 
          productName: 'Gaming Keyboard', 
          sku: 'GMKB-001',
          quantity: 15, 
          unitPrice: 149.99, 
          totalPrice: 2249.85,
          warehouse: 'Chicago North',
          location: 'Q17-R18'
        },
        { 
          productName: 'Wireless Mouse', 
          sku: 'WMSE-001',
          quantity: 15, 
          unitPrice: 79.99, 
          totalPrice: 1199.85,
          warehouse: 'Chicago North',
          location: 'S19-T20'
        }
      ]
    }),
    created_at: '2024-01-12T11:00:00Z',
    updated_at: '2024-01-18T09:45:00Z'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440006',
    order_number: 'ORD-2024-0006',
    customer_name: 'Freelancer Network',
    customer_email: 'support@freelancers.com',
    customer_phone: '+1 (555) 567-8901',
    shipping_address: '987 Remote Work Ave, Seattle, WA 98101',
    billing_address: '987 Remote Work Ave, Seattle, WA 98101',
    total_amount: 999.99,
    currency: 'USD',
    status: 'cancelled',
    payment_status: 'refunded',
    payment_method: 'credit_card',
    order_date: '2024-01-11T16:30:00Z',
    delivery_date: null,
    shipped_date: null,
    tracking_number: null,
    shipping_method: 'standard',
    tax_amount: 79.99,
    discount_amount: 0,
    notes: JSON.stringify({
      priority: 'low',
      customerType: 'individual',
      salesRep: 'Jennifer Liu',
      source: 'online',
      tags: ['freelancer', 'individual_buyer', 'cancelled'],
      internalNotes: 'Order cancelled due to customer budget constraints',
      shippingInstructions: 'Residential delivery',
      cancellationReason: 'Customer requested cancellation - budget issues',
      refundProcessed: true,
      refundDate: '2024-01-12T10:00:00Z',
      items: [
        { 
          productName: 'iPhone 15 Pro', 
          sku: 'IPH15P-001',
          quantity: 1, 
          unitPrice: 999.99, 
          totalPrice: 999.99,
          warehouse: 'Seattle Port',
          location: 'U21-V22'
        }
      ]
    }),
    created_at: '2024-01-11T16:30:00Z',
    updated_at: '2024-01-12T10:00:00Z'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440007',
    order_number: 'ORD-2024-0007',
    customer_name: 'European Design Studio',
    customer_email: 'orders@eurodesign.de',
    customer_phone: '+49-30-12345678',
    shipping_address: 'Unter den Linden 1, 10117 Berlin, Germany',
    billing_address: 'Unter den Linden 1, 10117 Berlin, Germany',
    total_amount: 8751.21,
    currency: 'EUR',
    status: 'completed',
    payment_status: 'paid',
    payment_method: 'sepa_transfer',
    order_date: '2024-01-14T08:00:00Z',
    delivery_date: '2024-01-18T11:00:00Z',
    shipped_date: '2024-01-16T14:30:00Z',
    tracking_number: 'EURTRK789123456',
    shipping_method: 'international_express',
    tax_amount: 1662.73,
    discount_amount: 0,
    notes: JSON.stringify({
      priority: 'medium',
      customerType: 'international',
      salesRep: 'Hans Mueller',
      source: 'website',
      tags: ['international', 'design_studio', 'european_customer'],
      internalNotes: 'International order to Germany - customs documentation required',
      shippingInstructions: 'Design studio, business delivery only',
      customsInfo: 'Electronics for commercial use',
      vatNumber: 'DE123456789',
      items: [
        { 
          productName: 'MacBook Pro 16"', 
          sku: 'MBPR16-001',
          quantity: 3, 
          unitPrice: 2307.49, 
          totalPrice: 6922.47,
          warehouse: 'International Hub',
          location: 'W23-X24'
        },
        { 
          productName: 'Dell Monitor 27"', 
          sku: 'DELL27-001',
          quantity: 6, 
          unitPrice: 304.79, 
          totalPrice: 1828.74,
          warehouse: 'International Hub',
          location: 'Y25-Z26'
        }
      ]
    }),
    created_at: '2024-01-14T08:00:00Z',
    updated_at: '2024-01-18T11:00:00Z'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440008',
    order_number: 'ORD-2024-0008',
    customer_name: 'Tokyo Tech Solutions',
    customer_email: 'purchasing@tokyotech.jp',
    customer_phone: '+81-3-1234-5678',
    shipping_address: '1-1-1 Shibuya, Tokyo 150-0002, Japan',
    billing_address: '1-1-1 Shibuya, Tokyo 150-0002, Japan',
    total_amount: 1604370,
    currency: 'JPY',
    status: 'processing',
    payment_status: 'paid',
    payment_method: 'bank_transfer',
    order_date: '2024-01-13T05:00:00Z',
    delivery_date: '2024-01-20T09:00:00Z',
    shipped_date: null,
    tracking_number: null,
    shipping_method: 'international_standard',
    tax_amount: 160437,
    discount_amount: 0,
    notes: JSON.stringify({
      priority: 'high',
      customerType: 'international',
      salesRep: 'Yuki Tanaka',
      source: 'partner_referral',
      tags: ['international', 'japan', 'tech_company'],
      internalNotes: 'Japanese tech company order - special handling for customs',
      shippingInstructions: 'Tokyo office, Japanese business hours delivery',
      customsInfo: 'Technology equipment for business use',
      items: [
        { 
          productName: 'iPhone 15 Pro', 
          sku: 'IPH15P-001',
          quantity: 10, 
          unitPrice: 149250, 
          totalPrice: 1492500,
          warehouse: 'International Hub',
          location: 'AA27-BB28'
        },
        { 
          productName: 'Gaming Keyboard', 
          sku: 'GMKB-001',
          quantity: 5, 
          unitPrice: 22374, 
          totalPrice: 111870,
          warehouse: 'International Hub',
          location: 'CC29-DD30'
        }
      ]
    }),
    created_at: '2024-01-13T05:00:00Z',
    updated_at: '2024-01-19T03:30:00Z'
  }
]

async function seedOrdersDatabase() {
  try {
    console.log('🌱 Starting orders database seeding...')

    // Check connection
    const { data: testData, error: testError } = await supabase
      .from('orders')
      .select('*')
      .limit(1)

    if (testError) {
      console.error('❌ Database connection failed:', testError.message)
      return
    }

    console.log('✅ Database connection successful')

    // Clear existing orders (optional - remove this in production)
    console.log('🧹 Clearing existing orders...')
    const { error: deleteError } = await supabase
      .from('orders')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all

    if (deleteError) {
      console.warn('⚠️ Could not clear existing orders:', deleteError.message)
    }

    // Insert enhanced orders
    console.log('📦 Inserting enhanced orders...')
    const { data: insertedOrders, error: insertError } = await supabase
      .from('orders')
      .insert(enhancedOrders)
      .select()

    if (insertError) {
      console.error('❌ Failed to insert orders:', insertError.message)
      console.error('Details:', insertError)
      return
    }

    console.log(`✅ Successfully inserted ${insertedOrders.length} orders`)

    // Verify the data
    console.log('🔍 Verifying inserted orders...')
    const { data: verifyData, error: verifyError } = await supabase
      .from('orders')
      .select('*')
      .order('order_date', { ascending: false })

    if (verifyError) {
      console.error('❌ Failed to verify orders:', verifyError.message)
      return
    }

    console.log(`✅ Verification complete: ${verifyData.length} orders in database`)
    
    // Show summary
    console.log('\n📊 Orders Summary:')
    verifyData.forEach(order => {
      const orderData = JSON.parse(order.notes || '{}')
      console.log(`  • ${order.order_number} - ${order.customer_name} - ${order.status} - ${order.currency} ${order.total_amount}`)
      console.log(`    Items: ${orderData.items?.length || 0} items, Priority: ${orderData.priority || 'unknown'}`)
    })

    console.log('\n🎉 Orders database seeding completed successfully!')

  } catch (error) {
    console.error('❌ Seeding failed:', error)
  }
}

// Run the seeding
seedOrdersDatabase()
