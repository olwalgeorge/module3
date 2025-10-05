import { supabase } from './config.js';

async function createAndSeedUsers() {
  console.log('🔄 Creating users table and seeding data...');

  try {
    // Step 1: Create the users table using raw SQL
    console.log('📝 Creating users table...');
    
    const createTableSQL = `
      -- Create users table if it doesn't exist
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        phone VARCHAR(50),
        avatar TEXT,
        employee_id VARCHAR(100) UNIQUE,
        role VARCHAR(100) DEFAULT 'Employee',
        department VARCHAR(100),
        manager_id INTEGER,
        location VARCHAR(255),
        salary DECIMAL(10,2),
        hire_date DATE,
        status VARCHAR(50) DEFAULT 'Active',
        last_login TIMESTAMP WITH TIME ZONE,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Create indexes for better performance
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_employee_id ON users(employee_id);
      CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
    `;

    // Execute the SQL using a function call approach
    const { error: createError } = await supabase.rpc('exec_sql', { sql: createTableSQL });
    
    if (createError) {
      console.log('⚠️ Note about table creation:', createError.message);
      // Continue anyway - table might already exist
    }

    // Alternative approach: try using the SQL directly
    try {
      await supabase.from('users').select('id').limit(1);
      console.log('✅ Users table is accessible');
    } catch (err) {
      console.log('❌ Users table still not accessible. Please create it manually.');
      console.log('💡 Go to Supabase Dashboard > SQL Editor and run:');
      console.log(createTableSQL);
      return;
    }

    // Step 2: Seed sample users
    console.log('👥 Seeding sample users...');
    
    const sampleUsers = [
      {
        name: 'John Smith',
        email: 'john.smith@company.com',
        phone: '+1 (555) 123-4567',
        avatar: '/images/user1_400x400.jpg',
        employee_id: 'EMP001',
        role: 'Administrator',
        department: 'IT',
        location: 'New York, NY',
        salary: 85000,
        hire_date: '2023-06-15',
        status: 'Active',
        last_login: '2024-01-15T10:30:00Z',
        notes: 'System administrator with full access to all modules.'
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@company.com',
        phone: '+1 (555) 234-5678',
        avatar: '/images/user2_400x400.jpg',
        employee_id: 'EMP002',
        role: 'Manager',
        department: 'Operations',
        location: 'New York, NY',
        salary: 75000,
        hire_date: '2023-05-10',
        status: 'Active',
        last_login: '2024-01-15T09:15:00Z',
        notes: 'Operations manager overseeing daily inventory operations.'
      },
      {
        name: 'Mike Chen',
        email: 'mike.chen@company.com',
        phone: '+1 (555) 345-6789',
        avatar: '/images/user3_400x400.jpg',
        employee_id: 'EMP003',
        role: 'Warehouse Staff',
        department: 'Warehouse',
        location: 'Los Angeles, CA',
        salary: 45000,
        hire_date: '2023-08-20',
        status: 'Active',
        last_login: '2024-01-15T08:45:00Z',
        notes: 'Warehouse specialist responsible for inventory management.'
      },
      {
        name: 'Emily Davis',
        email: 'emily.davis@company.com',
        phone: '+1 (555) 456-7890',
        avatar: '/images/user4_400x400.jpg',
        employee_id: 'EMP004',
        role: 'Sales Representative',
        department: 'Sales',
        location: 'Chicago, IL',
        salary: 55000,
        hire_date: '2023-07-01',
        status: 'Active',
        last_login: '2024-01-15T11:20:00Z',
        notes: 'Sales representative managing key customer accounts.'
      },
      {
        name: 'David Wilson',
        email: 'david.wilson@company.com',
        phone: '+1 (555) 567-8901',
        avatar: '/images/user5_400x400.jpg',
        employee_id: 'EMP005',
        role: 'Accountant',
        department: 'Accounting',
        location: 'New York, NY',
        salary: 60000,
        hire_date: '2023-04-15',
        status: 'Active',
        last_login: '2024-01-14T16:30:00Z',
        notes: 'Senior accountant handling financial reporting.'
      }
    ];

    // Insert users one by one to handle conflicts better
    for (const user of sampleUsers) {
      const { data, error } = await supabase
        .from('users')
        .upsert([user], { 
          onConflict: 'email',
          ignoreDuplicates: false 
        })
        .select();

      if (error) {
        console.log(`❌ Error inserting ${user.name}:`, error.message);
      } else {
        console.log(`✅ Created user: ${user.name} (${user.email})`);
      }
    }

    // Step 3: Verify the seeded data
    console.log('\n📊 Verification:');
    const { data: users, error: queryError } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (queryError) {
      console.log('❌ Error querying users:', queryError.message);
    } else {
      console.log(`✅ Total users in database: ${users?.length || 0}`);
      
      if (users && users.length > 0) {
        console.log('\n👥 Current users:');
        users.forEach(user => {
          console.log(`  • ${user.name} (${user.email}) - ${user.role} - ${user.department}`);
        });
      }
    }

    console.log('\n🎉 User seeding completed successfully!');

  } catch (error) {
    console.error('❌ Fatal error during user creation/seeding:', error);
    console.log('\n💡 Manual Steps:');
    console.log('1. Go to https://supabase.com/dashboard');
    console.log('2. Select your project');
    console.log('3. Go to SQL Editor');
    console.log('4. Run the CREATE TABLE statement above');
    console.log('5. Then run this script again');
  }
}

createAndSeedUsers();
