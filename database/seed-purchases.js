import { supabase } from './config.js'

// Enhanced purchases with comprehensive business metadata and operational context
const enhancedPurchases = [
  {
    id: '660e8400-e29b-41d4-a716-446655440001',
    purchase_order_number: 'PO-2024-001',
    supplier_id: '550e8400-e29b-41d4-a716-446655440011', // TechCorp Ltd Enhanced
    supplier_name: 'TechCorp Ltd Enhanced',
    warehouse_id: 'WH-001',
    warehouse_name: 'Main Warehouse',
    status: 'delivered',
    total_amount: 15750.00,
    tax_amount: 1417.50,
    shipping_cost: 125.00,
    discount_amount: 787.50,
    currency: 'USD',
    payment_terms: 'Net 30',
    payment_method: 'Bank Transfer',
    order_date: '2024-01-15T10:30:00Z',
    expected_delivery_date: '2024-01-22T17:00:00Z',
    actual_delivery_date: '2024-01-21T14:30:00Z',
    delivery_address: '1000 Industrial Way, Austin, TX 78701',
    items: JSON.stringify([
      {
        product_name: 'MacBook Pro 16"',
        sku: 'MBP-16-001',
        quantity: 10,
        unit_cost: 1299.99,
        total_cost: 12999.90,
        specifications: { color: 'Space Gray', storage: '512GB', memory: '16GB' },
        warranty_period: '12 months',
        serial_numbers: ['MB001-010', 'MB001-011', 'MB001-012', 'MB001-013', 'MB001-014']
      },
      {
        product_name: 'Wireless Mouse',
        sku: 'WM-001',
        quantity: 25,
        unit_cost: 49.99,
        total_cost: 1249.75,
        specifications: { type: 'Bluetooth', dpi: '1600', battery: 'Rechargeable' },
        warranty_period: '6 months'
      },
      {
        product_name: 'USB-C Hub',
        sku: 'UCH-001',
        quantity: 15,
        unit_cost: 89.99,
        total_cost: 1349.85,
        specifications: { ports: '7-in-1', power_delivery: '100W', data_speed: '10Gbps' },
        warranty_period: '24 months'
      }
    ]),
    notes: JSON.stringify({
      category: 'Electronics',
      priority: 'high',
      business_unit: 'IT Department',
      cost_center: 'CC-IT-001',
      budget_code: 'BUD-2024-IT-Q1',
      approval_workflow: {
        requested_by: 'John Smith',
        approved_by: 'Sarah Johnson',
        finance_approved_by: 'Mike Chen',
        approval_date: '2024-01-14T16:20:00Z'
      },
      vendor_performance: {
        delivery_rating: 5,
        quality_rating: 5,
        communication_rating: 4,
        overall_satisfaction: 5
      },
      logistics: {
        incoterms: 'FOB Destination',
        tracking_number: 'TRK-TC-240115-001',
        carrier: 'DHL Express',
        freight_class: 'Standard',
        package_count: 3,
        total_weight: '45.2 kg',
        dimensions: '120x80x40 cm'
      },
      quality_control: {
        inspection_required: true,
        inspector: 'Lisa Wong',
        inspection_date: '2024-01-21T15:00:00Z',
        defects_found: 0,
        acceptance_status: 'approved'
      },
      financial_details: {
        budget_remaining: 84250.00,
        discount_reason: 'Volume discount (10+ units)',
        tax_exemption: false,
        currency_rate: 1.0,
        payment_due_date: '2024-02-20T23:59:59Z'
      },
      operational_impact: {
        critical_for_project: 'Q1 Hardware Refresh',
        expected_usage_date: '2024-01-25T09:00:00Z',
        end_users: ['Development Team', 'Design Team'],
        deployment_plan: 'Immediate asset tagging and distribution'
      },
      compliance: {
        certifications_required: ['FCC', 'CE', 'RoHS'],
        documentation_received: true,
        customs_cleared: true,
        import_license_required: false
      },
      tags: ['high_priority', 'bulk_order', 'electronics', 'q1_refresh', 'approved']
    }),
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-21T14:30:00Z'
  },
  {
    id: '660e8400-e29b-41d4-a716-446655440002',
    purchase_order_number: 'PO-2024-002',
    supplier_id: '550e8400-e29b-41d4-a716-446655440012', // Global Supplies Inc Enhanced
    supplier_name: 'Global Supplies Inc Enhanced',
    warehouse_id: 'WH-002',
    warehouse_name: 'Secondary Warehouse',
    status: 'pending',
    total_amount: 8925.00,
    tax_amount: 803.25,
    shipping_cost: 75.00,
    discount_amount: 446.25,
    currency: 'USD',
    payment_terms: 'Net 15',
    payment_method: 'Credit Card',
    order_date: '2024-01-18T14:15:00Z',
    expected_delivery_date: '2024-01-25T17:00:00Z',
    actual_delivery_date: null,
    delivery_address: '2000 Commerce Street, Dallas, TX 75201',
    items: JSON.stringify([
      {
        product_name: 'Office Desk',
        sku: 'OD-001',
        quantity: 12,
        unit_cost: 299.99,
        total_cost: 3599.88,
        specifications: { material: 'Oak Wood', dimensions: '150x75x75cm', adjustable: false },
        warranty_period: '36 months',
        assembly_required: true
      },
      {
        product_name: 'Ergonomic Office Chair',
        sku: 'EOC-001',
        quantity: 12,
        unit_cost: 199.99,
        total_cost: 2399.88,
        specifications: { material: 'Mesh', lumbar_support: true, adjustable_height: true },
        warranty_period: '60 months',
        assembly_required: true
      },
      {
        product_name: 'Desk Lamp',
        sku: 'DL-001',
        quantity: 15,
        unit_cost: 79.99,
        total_cost: 1199.85,
        specifications: { type: 'LED', color_temperature: 'Adjustable', touch_control: true },
        warranty_period: '24 months'
      },
      {
        product_name: 'Cable Management Tray',
        sku: 'CMT-001',
        quantity: 18,
        unit_cost: 29.99,
        total_cost: 539.82,
        specifications: { material: 'Steel', capacity: '20 cables', mounting: 'Under desk' },
        warranty_period: '12 months'
      }
    ]),
    notes: JSON.stringify({
      category: 'Office Furniture',
      priority: 'medium',
      business_unit: 'Human Resources',
      cost_center: 'CC-HR-001',
      budget_code: 'BUD-2024-HR-FURNITURE',
      approval_workflow: {
        requested_by: 'Emily Davis',
        approved_by: 'Robert Taylor',
        finance_approved_by: 'Jennifer Lee',
        approval_date: '2024-01-17T11:45:00Z'
      },
      vendor_performance: {
        previous_orders: 8,
        average_delivery_time: '7 days',
        quality_rating: 4,
        communication_rating: 4
      },
      logistics: {
        incoterms: 'DAP Destination',
        tracking_number: 'TRK-GS-240118-002',
        carrier: 'UPS Freight',
        freight_class: 'Furniture',
        package_count: 15,
        total_weight: '485.6 kg',
        dimensions: 'Multiple packages',
        special_handling: 'Fragile - Office Furniture'
      },
      installation: {
        assembly_service: true,
        installation_date: '2024-01-26T09:00:00Z',
        technician: 'Installation Team A',
        estimated_time: '4 hours',
        space_preparation_required: true
      },
      financial_details: {
        budget_remaining: 15074.75,
        discount_reason: 'Bulk furniture order discount',
        tax_exemption: false,
        payment_due_date: '2024-02-02T23:59:59Z'
      },
      operational_impact: {
        purpose: 'New office space setup',
        affected_departments: ['Marketing', 'Sales'],
        deployment_timeline: 'End of January 2024',
        space_planning_complete: true
      },
      tags: ['office_furniture', 'bulk_order', 'assembly_required', 'new_office']
    }),
    created_at: '2024-01-18T14:15:00Z',
    updated_at: '2024-01-22T09:30:00Z'
  },
  {
    id: '660e8400-e29b-41d4-a716-446655440003',
    purchase_order_number: 'PO-2024-003',
    supplier_id: '550e8400-e29b-41d4-a716-446655440013', // Premium Electronics Enhanced
    supplier_name: 'Premium Electronics Enhanced',
    warehouse_id: 'WH-001',
    warehouse_name: 'Main Warehouse',
    status: 'in_transit',
    total_amount: 24680.00,
    tax_amount: 2221.20,
    shipping_cost: 200.00,
    discount_amount: 1234.00,
    currency: 'USD',
    payment_terms: 'Net 30',
    payment_method: 'Bank Transfer',
    order_date: '2024-01-20T09:45:00Z',
    expected_delivery_date: '2024-01-30T17:00:00Z',
    actual_delivery_date: null,
    delivery_address: '1000 Industrial Way, Austin, TX 78701',
    items: JSON.stringify([
      {
        product_name: 'Gaming Desktop PC',
        sku: 'GDP-001',
        quantity: 8,
        unit_cost: 1899.99,
        total_cost: 15199.92,
        specifications: { cpu: 'Intel i7-13700K', gpu: 'RTX 4070', ram: '32GB DDR5', storage: '1TB NVMe SSD' },
        warranty_period: '36 months',
        configuration: 'Custom gaming build'
      },
      {
        product_name: '4K Gaming Monitor',
        sku: '4KGM-001',
        quantity: 8,
        unit_cost: 599.99,
        total_cost: 4799.92,
        specifications: { size: '27 inch', resolution: '3840x2160', refresh_rate: '144Hz', panel: 'IPS' },
        warranty_period: '24 months'
      },
      {
        product_name: 'Mechanical Gaming Keyboard',
        sku: 'MGK-001',
        quantity: 10,
        unit_cost: 149.99,
        total_cost: 1499.90,
        specifications: { switches: 'Cherry MX Blue', backlight: 'RGB', layout: 'Full size' },
        warranty_period: '24 months'
      },
      {
        product_name: 'Gaming Headset',
        sku: 'GH-001',
        quantity: 10,
        unit_cost: 99.99,
        total_cost: 999.90,
        specifications: { type: 'Over-ear', connection: 'USB + 3.5mm', microphone: 'Detachable' },
        warranty_period: '18 months'
      }
    ]),
    notes: JSON.stringify({
      category: 'Gaming Equipment',
      priority: 'high',
      business_unit: 'Development Team',
      cost_center: 'CC-DEV-001',
      budget_code: 'BUD-2024-DEV-GAMING',
      approval_workflow: {
        requested_by: 'Alex Thompson',
        approved_by: 'David Kim',
        finance_approved_by: 'Emma Rodriguez',
        approval_date: '2024-01-19T14:20:00Z'
      },
      vendor_performance: {
        previous_orders: 5,
        average_delivery_time: '10 days',
        quality_rating: 5,
        communication_rating: 5,
        premium_supplier: true
      },
      logistics: {
        incoterms: 'CIF Destination',
        tracking_number: 'TRK-PE-240120-003',
        carrier: 'FedEx Priority',
        freight_class: 'Electronics',
        package_count: 8,
        total_weight: '156.8 kg',
        insurance_value: 25000.00,
        signature_required: true
      },
      technical_specifications: {
        compatibility_tested: true,
        driver_requirements: 'Windows 11, latest GPU drivers',
        network_requirements: 'Gigabit Ethernet',
        power_consumption: '450W average per setup'
      },
      financial_details: {
        budget_remaining: 75320.00,
        discount_reason: 'Premium partner pricing',
        tax_exemption: false,
        payment_due_date: '2024-02-29T23:59:59Z'
      },
      operational_impact: {
        purpose: 'Game development workstations',
        critical_for_project: 'Q1 Game Release',
        expected_productivity_increase: '25%',
        training_required: false
      },
      compliance: {
        energy_star_certified: true,
        recycling_program: true,
        environmental_impact: 'Carbon neutral shipping'
      },
      tags: ['gaming_equipment', 'high_performance', 'development', 'premium']
    }),
    created_at: '2024-01-20T09:45:00Z',
    updated_at: '2024-01-22T16:15:00Z'
  },
  {
    id: '660e8400-e29b-41d4-a716-446655440004',
    purchase_order_number: 'PO-2024-004',
    supplier_id: '550e8400-e29b-41d4-a716-446655440016', // Software Solutions Hub Enhanced
    supplier_name: 'Software Solutions Hub Enhanced',
    warehouse_id: 'WH-DIGITAL',
    warehouse_name: 'Digital Assets',
    status: 'delivered',
    total_amount: 12500.00,
    tax_amount: 1125.00,
    shipping_cost: 0.00,
    discount_amount: 2500.00,
    currency: 'USD',
    payment_terms: 'Net 30',
    payment_method: 'Bank Transfer',
    order_date: '2024-01-22T11:00:00Z',
    expected_delivery_date: '2024-01-22T17:00:00Z',
    actual_delivery_date: '2024-01-22T15:30:00Z',
    delivery_address: 'Digital Delivery - License Portal',
    items: JSON.stringify([
      {
        product_name: 'Microsoft Office 365 Business Premium',
        sku: 'O365-BP-001',
        quantity: 50,
        unit_cost: 149.99,
        total_cost: 7499.50,
        specifications: { license_type: 'Annual Subscription', users: '1 per license', cloud_storage: '1TB per user' },
        warranty_period: '12 months subscription',
        license_keys: ['Generated automatically']
      },
      {
        product_name: 'Adobe Creative Cloud Teams',
        sku: 'ACC-T-001',
        quantity: 10,
        unit_cost: 599.99,
        total_cost: 5999.90,
        specifications: { license_type: 'Annual Subscription', applications: 'All Creative Apps', cloud_storage: '100GB per user' },
        warranty_period: '12 months subscription'
      },
      {
        product_name: 'Antivirus Enterprise',
        sku: 'AV-ENT-001',
        quantity: 100,
        unit_cost: 29.99,
        total_cost: 2999.90,
        specifications: { license_type: 'Annual License', protection: 'Real-time', management: 'Centralized' },
        warranty_period: '12 months license'
      }
    ]),
    notes: JSON.stringify({
      category: 'Software Licenses',
      priority: 'critical',
      business_unit: 'IT Department',
      cost_center: 'CC-IT-002',
      budget_code: 'BUD-2024-IT-SOFTWARE',
      approval_workflow: {
        requested_by: 'Sarah Johnson',
        approved_by: 'Mike Chen',
        finance_approved_by: 'Lisa Wong',
        approval_date: '2024-01-21T16:30:00Z'
      },
      vendor_performance: {
        digital_delivery: true,
        license_activation_time: '< 1 hour',
        support_quality: 5,
        documentation_quality: 5
      },
      logistics: {
        delivery_method: 'Digital Download + License Portal',
        activation_instructions: 'Automated via enterprise portal',
        license_management: 'Centralized admin console',
        deployment_timeline: 'Immediate'
      },
      license_management: {
        admin_portal: 'https://admin.softwarehub.com',
        license_distribution: 'Automated',
        usage_tracking: 'Real-time',
        compliance_monitoring: 'Enabled'
      },
      financial_details: {
        budget_remaining: 37500.00,
        discount_reason: 'Enterprise volume discount (20%)',
        auto_renewal: true,
        payment_due_date: '2024-02-21T23:59:59Z'
      },
      operational_impact: {
        purpose: 'Annual software license renewal',
        critical_for_operations: true,
        downtime_risk: 'High without renewal',
        user_impact: 'All employees'
      },
      compliance: {
        license_audit_ready: true,
        terms_compliance: 'Verified',
        data_privacy: 'GDPR compliant',
        security_certification: 'SOC 2 Type II'
      },
      tags: ['software_licenses', 'critical', 'enterprise', 'annual_renewal', 'digital_delivery']
    }),
    created_at: '2024-01-22T11:00:00Z',
    updated_at: '2024-01-22T15:30:00Z'
  },
  {
    id: '660e8400-e29b-41d4-a716-446655440005',
    purchase_order_number: 'PO-2024-005',
    supplier_id: '550e8400-e29b-41d4-a716-446655440015', // Manufacturing Direct Enhanced
    supplier_name: 'Manufacturing Direct Enhanced',
    warehouse_id: 'WH-003',
    warehouse_name: 'Raw Materials Warehouse',
    status: 'approved',
    total_amount: 45750.00,
    tax_amount: 4117.50,
    shipping_cost: 450.00,
    discount_amount: 9150.00,
    currency: 'USD',
    payment_terms: 'Net 45',
    payment_method: 'Bank Transfer',
    order_date: '2024-01-23T08:30:00Z',
    expected_delivery_date: '2024-02-15T17:00:00Z',
    actual_delivery_date: null,
    delivery_address: '3000 Manufacturing Row, Houston, TX 77001',
    items: JSON.stringify([
      {
        product_name: 'Aluminum Sheets',
        sku: 'ALU-SH-001',
        quantity: 500,
        unit_cost: 45.99,
        total_cost: 22995.00,
        specifications: { grade: '6061-T6', thickness: '3mm', dimensions: '1000x2000mm' },
        warranty_period: 'N/A - Raw Material',
        quality_certificate: 'Mill Test Certificate included'
      },
      {
        product_name: 'Steel Rods',
        sku: 'STL-RD-001',
        quantity: 200,
        unit_cost: 89.99,
        total_cost: 17998.00,
        specifications: { grade: 'A36', diameter: '25mm', length: '6000mm' },
        warranty_period: 'N/A - Raw Material',
        quality_certificate: 'Mill Test Certificate included'
      },
      {
        product_name: 'Industrial Bolts Set',
        sku: 'IB-SET-001',
        quantity: 50,
        unit_cost: 159.99,
        total_cost: 7999.50,
        specifications: { grade: '8.8', sizes: 'M8-M20', material: 'Alloy Steel', coating: 'Zinc Plated' },
        warranty_period: '24 months'
      }
    ]),
    notes: JSON.stringify({
      category: 'Raw Materials',
      priority: 'medium',
      business_unit: 'Manufacturing',
      cost_center: 'CC-MFG-001',
      budget_code: 'BUD-2024-MFG-MATERIALS',
      approval_workflow: {
        requested_by: 'Robert Taylor',
        approved_by: 'Jennifer Lee',
        finance_approved_by: 'David Kim',
        approval_date: '2024-01-22T17:45:00Z'
      },
      vendor_performance: {
        quality_consistency: 'Excellent',
        delivery_reliability: 'Good',
        bulk_order_specialist: true,
        iso_certified: true
      },
      logistics: {
        incoterms: 'FOB Origin',
        tracking_method: 'Freight tracking',
        carrier: 'Industrial Freight Services',
        freight_class: 'Class 85 - Metals',
        package_count: 25,
        total_weight: '8500 kg',
        special_handling: 'Forklift required',
        delivery_appointment: 'Required'
      },
      quality_requirements: {
        inspection_required: true,
        mil_test_certificates: true,
        dimensional_tolerance: '±0.1mm',
        surface_finish: 'As specified',
        material_traceability: 'Full batch tracking'
      },
      financial_details: {
        budget_remaining: 154250.00,
        discount_reason: 'Bulk raw materials discount (20%)',
        commodity_pricing: 'Fixed for 60 days',
        payment_due_date: '2024-03-10T23:59:59Z'
      },
      operational_impact: {
        production_schedule: 'Q1 Manufacturing Run',
        inventory_turnover: '45 days',
        critical_path_item: false,
        safety_stock_addition: '15%'
      },
      environmental: {
        recycled_content: '25%',
        sustainability_rating: 'Grade A',
        carbon_footprint: 'Offset shipping included'
      },
      tags: ['raw_materials', 'bulk_order', 'manufacturing', 'quality_certified']
    }),
    created_at: '2024-01-23T08:30:00Z',
    updated_at: '2024-01-23T14:20:00Z'
  },
  {
    id: '660e8400-e29b-41d4-a716-446655440006',
    purchase_order_number: 'PO-2024-006',
    supplier_id: '550e8400-e29b-41d4-a716-446655440017', // European Tech Solutions Enhanced
    supplier_name: 'European Tech Solutions Enhanced',
    warehouse_id: 'WH-001',
    warehouse_name: 'Main Warehouse',
    status: 'rejected',
    total_amount: 18900.00,
    tax_amount: 1701.00,
    shipping_cost: 350.00,
    discount_amount: 945.00,
    currency: 'EUR',
    payment_terms: 'Net 30',
    payment_method: 'SEPA Transfer',
    order_date: '2024-01-24T13:20:00Z',
    expected_delivery_date: '2024-02-10T17:00:00Z',
    actual_delivery_date: null,
    delivery_address: '1000 Industrial Way, Austin, TX 78701',
    items: JSON.stringify([
      {
        product_name: 'Industrial IoT Sensors',
        sku: 'IOT-SENS-001',
        quantity: 50,
        unit_cost: 189.99,
        total_cost: 9499.50,
        specifications: { type: 'Temperature/Humidity', protocol: 'LoRaWAN', battery_life: '5 years' },
        warranty_period: '60 months',
        certification: 'CE, FCC'
      },
      {
        product_name: 'Edge Computing Modules',
        sku: 'ECM-001',
        quantity: 15,
        unit_cost: 399.99,
        total_cost: 5999.85,
        specifications: { processor: 'ARM Cortex-A78', memory: '8GB', storage: '64GB eMMC' },
        warranty_period: '36 months',
        certification: 'CE, RoHS'
      },
      {
        product_name: 'Industrial Ethernet Switches',
        sku: 'IES-001',
        quantity: 10,
        unit_cost: 299.99,
        total_cost: 2999.90,
        specifications: { ports: '8x Gigabit', poe: 'PoE+', temperature: '-40°C to +70°C' },
        warranty_period: '60 months',
        certification: 'CE, UL'
      }
    ]),
    notes: JSON.stringify({
      category: 'Industrial IoT',
      priority: 'low',
      business_unit: 'R&D Department',
      cost_center: 'CC-RD-001',
      budget_code: 'BUD-2024-RD-IOT',
      approval_workflow: {
        requested_by: 'Hans Mueller',
        rejected_by: 'Emma Rodriguez',
        rejection_reason: 'Budget constraints - deferred to Q2',
        rejection_date: '2024-01-25T10:15:00Z'
      },
      vendor_performance: {
        international_supplier: true,
        compliance_excellent: true,
        lead_time_long: true,
        currency_risk: 'EUR fluctuation'
      },
      logistics: {
        incoterms: 'DDP Destination',
        international_shipping: true,
        customs_documentation: 'Required',
        import_duties: 'Included in price',
        estimated_transit: '14-21 days'
      },
      technical_evaluation: {
        compatibility_check: 'Pending',
        pilot_program: 'Planned for Q2',
        integration_complexity: 'Medium',
        training_required: true
      },
      financial_details: {
        currency_conversion: 'EUR to USD',
        exchange_rate_risk: 'Hedged',
        budget_availability: 'Q2 2024',
        deferral_reason: 'Q1 budget exhausted'
      },
      compliance: {
        export_controls: 'Verified',
        dual_use_technology: false,
        import_license: 'Not required',
        tariff_classification: 'HS 8517.62.00'
      },
      future_action: {
        reorder_planned: true,
        target_quarter: 'Q2 2024',
        budget_allocation: 'Requested',
        priority_adjustment: 'Medium'
      },
      tags: ['industrial_iot', 'international', 'deferred', 'r_and_d', 'budget_constraint']
    }),
    created_at: '2024-01-24T13:20:00Z',
    updated_at: '2024-01-25T10:15:00Z'
  }
]

async function seedPurchasesDatabase() {
  try {
    console.log('🌱 Starting purchases database seeding...')

    // Check if table exists, if not proceed with inserting sample data
    const { data: testData, error: testError } = await supabase
      .from('purchases')
      .select('*')
      .limit(1)

    if (testError) {
      console.log('📝 Purchases table does not exist yet. This is expected for first run.')
      console.log('🏗️ The table will be created automatically when you run the enhanced Purchases component.')
      console.log('\n📋 Enhanced Purchases Data Structure:')
      console.log('- Purchase Order Management with comprehensive tracking')
      console.log('- Financial tracking: amounts, taxes, shipping, discounts')
      console.log('- Status workflow: pending → approved → ordered → in_transit → delivered')
      console.log('- Supplier integration with performance metrics')
      console.log('- Items management with detailed specifications')
      console.log('- Logistics tracking: carriers, tracking numbers, delivery details')
      console.log('- Approval workflows and business intelligence')
      console.log('- Quality control and compliance documentation')
      
      console.log('\n🚀 Sample Purchase Orders Ready:')
      enhancedPurchases.forEach(purchase => {
        const purchaseData = JSON.parse(purchase.notes)
        const items = JSON.parse(purchase.items)
        console.log(`  • ${purchase.purchase_order_number} - ${purchase.supplier_name}`)
        console.log(`    Status: ${purchase.status} | Amount: ${purchase.currency} ${purchase.total_amount.toLocaleString()} | Items: ${items.length}`)
        console.log(`    Category: ${purchaseData.category} | Priority: ${purchaseData.priority}`)
      })
      
      console.log('\n✅ Purchases component enhancement ready!')
      console.log('🔄 Run the enhanced Purchases component to see the database integration in action.')
      return
    }

    console.log('✅ Database connection successful')

    // Clear existing data
    console.log('🧹 Clearing existing purchases...')
    const { error: clearError } = await supabase
      .from('purchases')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all

    if (clearError) {
      console.warn('⚠️ Could not clear existing data:', clearError.message)
    }

    // Insert enhanced purchases
    console.log('🛒 Inserting enhanced purchases...')
    const { data: insertedPurchases, error: insertError } = await supabase
      .from('purchases')
      .insert(enhancedPurchases)
      .select()

    if (insertError) {
      console.error('❌ Failed to insert purchases:', insertError.message)
      console.error('Details:', insertError)
      return
    }

    console.log(`✅ Successfully inserted ${insertedPurchases.length} purchases`)

    // Verify the data
    console.log('🔍 Verifying inserted purchases...')
    const { data: verifyData, error: verifyError } = await supabase
      .from('purchases')
      .select('*')
      .order('order_date', { ascending: false })

    if (verifyError) {
      console.error('❌ Failed to verify purchases:', verifyError.message)
      return
    }

    console.log(`✅ Verification complete: ${verifyData.length} purchases in database`)
    
    // Show summary
    console.log('\n📊 Purchases Summary:')
    verifyData.forEach(purchase => {
      const purchaseData = JSON.parse(purchase.notes || '{}')
      const items = JSON.parse(purchase.items || '[]')
      console.log(`  • ${purchase.purchase_order_number} - ${purchase.supplier_name}`)
      console.log(`    Status: ${purchase.status} | Amount: ${purchase.currency} ${purchase.total_amount.toLocaleString()} | Items: ${items.length}`)
      console.log(`    Category: ${purchaseData.category || 'N/A'} | Priority: ${purchaseData.priority || 'N/A'} | Order Date: ${new Date(purchase.order_date).toLocaleDateString()}`)
    })

    // Calculate statistics
    const totalValue = verifyData.reduce((sum, purchase) => sum + purchase.total_amount, 0)
    const totalItems = verifyData.reduce((sum, purchase) => {
      const items = JSON.parse(purchase.items || '[]')
      return sum + items.length
    }, 0)
    const statusCounts = verifyData.reduce((counts, purchase) => {
      counts[purchase.status] = (counts[purchase.status] || 0) + 1
      return counts
    }, {})
    
    console.log('\n📈 Overall Statistics:')
    console.log(`  💰 Total Purchase Value: $${totalValue.toLocaleString()}`)
    console.log(`  📦 Total Purchase Items: ${totalItems}`)
    console.log(`  📋 Status Distribution:`)
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`    ${status}: ${count}`)
    })

    console.log('\n🎉 Purchases database seeding completed successfully!')
    console.log('\n🔄 Enhanced Features Included:')
    console.log('- Comprehensive purchase order management with detailed metadata')
    console.log('- Financial tracking: totals, taxes, shipping, discounts')
    console.log('- Logistics integration: tracking, carriers, delivery details')
    console.log('- Approval workflows and vendor performance metrics')
    console.log('- Quality control and compliance documentation')
    console.log('- Operational impact analysis and business intelligence')

  } catch (error) {
    console.error('❌ Seeding failed:', error)
  }
}

// Run the seeding
seedPurchasesDatabase()
