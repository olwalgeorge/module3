-- User Management Database Schema
-- Run this in your Supabase SQL editor or database management tool

-- Create departments table
CREATE TABLE IF NOT EXISTS departments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  manager_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(50) DEFAULT 'blue',
  is_system BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create permissions table
CREATE TABLE IF NOT EXISTS permissions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  module VARCHAR(100),
  action VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50),
  avatar TEXT,
  employee_id VARCHAR(100) UNIQUE,
  role_id INTEGER REFERENCES roles(id),
  department_id INTEGER REFERENCES departments(id),
  manager_id INTEGER REFERENCES users(id),
  location VARCHAR(255),
  salary DECIMAL(10,2),
  hire_date DATE,
  status VARCHAR(50) DEFAULT 'Active',
  last_login TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create role_permissions junction table
CREATE TABLE IF NOT EXISTS role_permissions (
  id SERIAL PRIMARY KEY,
  role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
  permission_id INTEGER REFERENCES permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(role_id, permission_id)
);

-- Create user_permissions junction table (for individual user permissions)
CREATE TABLE IF NOT EXISTS user_permissions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  permission_id INTEGER REFERENCES permissions(id) ON DELETE CASCADE,
  granted BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, permission_id)
);

-- Add foreign key constraints that reference users table
-- (These need to be added after users table is created)
ALTER TABLE departments 
ADD CONSTRAINT fk_departments_manager 
FOREIGN KEY (manager_id) REFERENCES users(id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_employee_id ON users(employee_id);
CREATE INDEX IF NOT EXISTS idx_users_role_id ON users(role_id);
CREATE INDEX IF NOT EXISTS idx_users_department_id ON users(department_id);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id ON role_permissions(permission_id);
CREATE INDEX IF NOT EXISTS idx_user_permissions_user_id ON user_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_permissions_permission_id ON user_permissions(permission_id);

-- Create triggers to update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_permissions_updated_at BEFORE UPDATE ON permissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default permissions
INSERT INTO permissions (name, description, module, action) VALUES
('dashboard.view', 'View dashboard', 'dashboard', 'view'),
('products.view', 'View products', 'products', 'view'),
('products.create', 'Create products', 'products', 'create'),
('products.edit', 'Edit products', 'products', 'edit'),
('products.delete', 'Delete products', 'products', 'delete'),
('orders.view', 'View orders', 'orders', 'view'),
('orders.create', 'Create orders', 'orders', 'create'),
('orders.edit', 'Edit orders', 'orders', 'edit'),
('orders.delete', 'Delete orders', 'orders', 'delete'),
('customers.view', 'View customers', 'customers', 'view'),
('customers.create', 'Create customers', 'customers', 'create'),
('customers.edit', 'Edit customers', 'customers', 'edit'),
('customers.delete', 'Delete customers', 'customers', 'delete'),
('suppliers.view', 'View suppliers', 'suppliers', 'view'),
('suppliers.create', 'Create suppliers', 'suppliers', 'create'),
('suppliers.edit', 'Edit suppliers', 'suppliers', 'edit'),
('suppliers.delete', 'Delete suppliers', 'suppliers', 'delete'),
('inventory.view', 'View inventory', 'inventory', 'view'),
('inventory.manage', 'Manage inventory', 'inventory', 'manage'),
('reports.view', 'View reports', 'reports', 'view'),
('reports.export', 'Export reports', 'reports', 'export'),
('accounting.view', 'View accounting', 'accounting', 'view'),
('accounting.manage', 'Manage accounting', 'accounting', 'manage'),
('users.view', 'View users', 'users', 'view'),
('users.create', 'Create users', 'users', 'create'),
('users.edit', 'Edit users', 'users', 'edit'),
('users.delete', 'Delete users', 'users', 'delete'),
('roles.view', 'View roles', 'roles', 'view'),
('roles.create', 'Create roles', 'roles', 'create'),
('roles.edit', 'Edit roles', 'roles', 'edit'),
('roles.delete', 'Delete roles', 'roles', 'delete'),
('settings.view', 'View settings', 'settings', 'view'),
('settings.manage', 'Manage settings', 'settings', 'manage'),
('system.admin', 'System administration', 'system', 'admin')
ON CONFLICT (name) DO NOTHING;

-- Insert default departments
INSERT INTO departments (name, description) VALUES
('IT', 'Information Technology'),
('Operations', 'Operations and Logistics'),
('Warehouse', 'Warehouse Management'),
('Sales', 'Sales and Customer Relations'),
('Accounting', 'Finance and Accounting'),
('HR', 'Human Resources'),
('Management', 'Executive Management')
ON CONFLICT (name) DO NOTHING;

-- Insert default roles
INSERT INTO roles (name, description, color, is_system) VALUES
('Administrator', 'System administrator with full access', 'red', true),
('Manager', 'Department manager with broad access', 'blue', true),
('Warehouse Staff', 'Warehouse operations staff', 'green', true),
('Sales Representative', 'Sales and customer service', 'purple', true),
('Accountant', 'Financial and accounting staff', 'yellow', true),
('Employee', 'General employee access', 'gray', true),
('Viewer', 'Read-only access', 'indigo', true)
ON CONFLICT (name) DO NOTHING;

-- Assign permissions to Administrator role (all permissions)
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
    (SELECT id FROM roles WHERE name = 'Administrator'),
    id
FROM permissions
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Assign permissions to Manager role
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
    (SELECT id FROM roles WHERE name = 'Manager'),
    id
FROM permissions
WHERE name IN (
    'dashboard.view', 'products.view', 'products.create', 'products.edit',
    'orders.view', 'orders.create', 'orders.edit',
    'customers.view', 'customers.create', 'customers.edit',
    'suppliers.view', 'suppliers.create', 'suppliers.edit',
    'inventory.view', 'inventory.manage',
    'reports.view', 'reports.export',
    'accounting.view'
)
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Assign permissions to Warehouse Staff role
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
    (SELECT id FROM roles WHERE name = 'Warehouse Staff'),
    id
FROM permissions
WHERE name IN (
    'dashboard.view', 'products.view',
    'orders.view', 'orders.edit',
    'inventory.view', 'inventory.manage'
)
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Assign permissions to Sales Representative role
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
    (SELECT id FROM roles WHERE name = 'Sales Representative'),
    id
FROM permissions
WHERE name IN (
    'dashboard.view', 'products.view',
    'orders.view', 'orders.create', 'orders.edit',
    'customers.view', 'customers.create', 'customers.edit',
    'reports.view'
)
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Assign permissions to Accountant role
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
    (SELECT id FROM roles WHERE name = 'Accountant'),
    id
FROM permissions
WHERE name IN (
    'dashboard.view', 'orders.view',
    'customers.view', 'suppliers.view',
    'reports.view', 'reports.export',
    'accounting.view', 'accounting.manage'
)
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Assign permissions to Employee role
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
    (SELECT id FROM roles WHERE name = 'Employee'),
    id
FROM permissions
WHERE name IN (
    'dashboard.view', 'products.view',
    'orders.view', 'customers.view'
)
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Assign permissions to Viewer role
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
    (SELECT id FROM roles WHERE name = 'Viewer'),
    id
FROM permissions
WHERE name IN (
    'dashboard.view', 'products.view',
    'orders.view', 'customers.view',
    'reports.view'
)
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Insert sample users
INSERT INTO users (name, email, phone, avatar, employee_id, role_id, department_id, location, salary, hire_date, status, last_login, notes) VALUES
(
    'John Smith',
    'john.smith@company.com',
    '+1 (555) 123-4567',
    '/images/user1_400x400.jpg',
    'EMP001',
    (SELECT id FROM roles WHERE name = 'Administrator'),
    (SELECT id FROM departments WHERE name = 'IT'),
    'New York, NY',
    85000,
    '2023-06-15',
    'Active',
    '2024-01-15T10:30:00Z',
    'System administrator with full access to all modules. Responsible for user management and system maintenance.'
),
(
    'Sarah Johnson',
    'sarah.johnson@company.com',
    '+1 (555) 234-5678',
    '/images/user2_400x400.jpg',
    'EMP002',
    (SELECT id FROM roles WHERE name = 'Manager'),
    (SELECT id FROM departments WHERE name = 'Operations'),
    'New York, NY',
    75000,
    '2023-05-10',
    'Active',
    '2024-01-15T09:15:00Z',
    'Operations manager overseeing daily inventory operations and customer relationships.'
),
(
    'Mike Chen',
    'mike.chen@company.com',
    '+1 (555) 345-6789',
    '/images/user3_400x400.jpg',
    'EMP003',
    (SELECT id FROM roles WHERE name = 'Warehouse Staff'),
    (SELECT id FROM departments WHERE name = 'Warehouse'),
    'Los Angeles, CA',
    45000,
    '2023-08-20',
    'Active',
    '2024-01-15T08:45:00Z',
    'Warehouse specialist responsible for inventory management and order fulfillment.'
),
(
    'Emily Davis',
    'emily.davis@company.com',
    '+1 (555) 456-7890',
    '/images/user4_400x400.jpg',
    'EMP004',
    (SELECT id FROM roles WHERE name = 'Sales Representative'),
    (SELECT id FROM departments WHERE name = 'Sales'),
    'Chicago, IL',
    55000,
    '2023-07-01',
    'Active',
    '2024-01-15T11:20:00Z',
    'Sales representative managing key customer accounts and new business development.'
),
(
    'David Wilson',
    'david.wilson@company.com',
    '+1 (555) 567-8901',
    '/images/user5_400x400.jpg',
    'EMP005',
    (SELECT id FROM roles WHERE name = 'Accountant'),
    (SELECT id FROM departments WHERE name = 'Accounting'),
    'New York, NY',
    60000,
    '2023-04-15',
    'Active',
    '2024-01-14T16:30:00Z',
    'Senior accountant handling financial reporting and budget management.'
)
ON CONFLICT (email) DO NOTHING;

-- Update department managers
UPDATE departments SET manager_id = (SELECT id FROM users WHERE email = 'john.smith@company.com') WHERE name = 'IT';
UPDATE departments SET manager_id = (SELECT id FROM users WHERE email = 'sarah.johnson@company.com') WHERE name = 'Operations';
UPDATE departments SET manager_id = (SELECT id FROM users WHERE email = 'mike.chen@company.com') WHERE name = 'Warehouse';
UPDATE departments SET manager_id = (SELECT id FROM users WHERE email = 'emily.davis@company.com') WHERE name = 'Sales';
UPDATE departments SET manager_id = (SELECT id FROM users WHERE email = 'david.wilson@company.com') WHERE name = 'Accounting';

-- Update user managers
UPDATE users SET manager_id = (SELECT id FROM users WHERE email = 'john.smith@company.com') WHERE email = 'sarah.johnson@company.com';
UPDATE users SET manager_id = (SELECT id FROM users WHERE email = 'sarah.johnson@company.com') WHERE email IN ('mike.chen@company.com', 'emily.davis@company.com');
UPDATE users SET manager_id = (SELECT id FROM users WHERE email = 'john.smith@company.com') WHERE email = 'david.wilson@company.com';

-- Enable Row Level Security (RLS) for better security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Users can view all users" ON users FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can view all roles" ON roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can view all departments" ON departments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can view all permissions" ON permissions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can view role permissions" ON role_permissions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can view user permissions" ON user_permissions FOR SELECT TO authenticated USING (true);

-- Only administrators can modify user data
CREATE POLICY "Only admins can insert users" ON users FOR INSERT TO authenticated 
USING (EXISTS (
    SELECT 1 FROM users u 
    JOIN roles r ON u.role_id = r.id 
    WHERE u.id = auth.uid() AND r.name = 'Administrator'
));

CREATE POLICY "Only admins can update users" ON users FOR UPDATE TO authenticated 
USING (EXISTS (
    SELECT 1 FROM users u 
    JOIN roles r ON u.role_id = r.id 
    WHERE u.id = auth.uid() AND r.name = 'Administrator'
));

CREATE POLICY "Only admins can delete users" ON users FOR DELETE TO authenticated 
USING (EXISTS (
    SELECT 1 FROM users u 
    JOIN roles r ON u.role_id = r.id 
    WHERE u.id = auth.uid() AND r.name = 'Administrator'
));
