export const users = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@company.com',
    phone: '+1 (555) 123-4567',
    avatar: '/images/user1_400x400.jpg',
    role: 'Administrator',
    department: 'IT',
    status: 'Active',
    lastLogin: '2024-01-15T10:30:00Z',
    createdAt: '2025-10-05T21:22:37.263328Z',
    permissions: ['all'],
    location: 'New York, NY',
    employeeId: 'EMP001',
    manager: null,
    salary: 85000,
    hireDate: '2023-06-15',
    notes: 'System administrator with full access to all modules.'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    phone: '+1 (555) 234-5678',
    avatar: '/images/user2_400x400.jpg',
    role: 'Manager',
    department: 'Operations',
    status: 'Active',
    lastLogin: '2024-01-15T09:15:00Z',
    createdAt: '2025-10-05T21:22:37.263328Z',
    permissions: ['manage', 'view', 'edit', 'create'],
    location: 'New York, NY',
    employeeId: 'EMP002',
    manager: null,
    salary: 75000,
    hireDate: '2023-05-10',
    notes: 'Operations manager overseeing daily inventory operations.'
  },
  {
    id: 3,
    name: 'Mike Chen',
    email: 'mike.chen@company.com',
    phone: '+1 (555) 345-6789',
    avatar: '/images/user3_400x400.jpg',
    role: 'Warehouse Staff',
    department: 'Warehouse',
    status: 'Active',
    lastLogin: '2024-01-15T08:45:00Z',
    createdAt: '2025-10-05T21:22:37.263328Z',
    permissions: ['inventory', 'orders', 'view'],
    location: 'Los Angeles, CA',
    employeeId: 'EMP003',
    manager: null,
    salary: 45000,
    hireDate: '2023-08-20',
    notes: 'Warehouse specialist responsible for inventory management.'
  },
  {
    id: 4,
    name: 'Emily Davis',
    email: 'emily.davis@company.com',
    phone: '+1 (555) 456-7890',
    avatar: '/images/user4_400x400.jpg',
    role: 'Sales Representative',
    department: 'Sales',
    status: 'Active',
    lastLogin: '2024-01-15T11:20:00Z',
    createdAt: '2025-10-05T21:22:37.263328Z',
    permissions: ['customers', 'orders', 'view'],
    location: 'Chicago, IL',
    employeeId: 'EMP004',
    manager: null,
    salary: 55000,
    hireDate: '2023-07-01',
    notes: 'Sales representative managing key customer accounts.'
  },
  {
    id: 5,
    name: 'David Wilson',
    email: 'david.wilson@company.com',
    phone: '+1 (555) 567-8901',
    avatar: '/images/user5_400x400.jpg',
    role: 'Accountant',
    department: 'Accounting',
    status: 'Active',
    lastLogin: '2024-01-14T16:30:00Z',
    createdAt: '2025-10-05T21:22:37.263328Z',
    permissions: ['accounting', 'reports', 'view'],
    location: 'New York, NY',
    employeeId: 'EMP005',
    manager: null,
    salary: 60000,
    hireDate: '2023-04-15',
    notes: 'Senior accountant handling financial reporting.'
  }
];

export const roles = [
  {
    id: 1,
    name: 'Administrator',
    description: 'Full system access with all permissions',
    permissions: ['all'],
    userCount: 1,
    color: 'red'
  },
  {
    id: 2,
    name: 'Manager',
    description: 'Management level access to operations and reporting',
    permissions: ['dashboard', 'products', 'orders', 'reports', 'crm', 'accounting'],
    userCount: 1,
    color: 'blue'
  },
  {
    id: 3,
    name: 'Warehouse Staff',
    description: 'Access to inventory and warehouse operations',
    permissions: ['products', 'movements', 'warehouses'],
    userCount: 1,
    color: 'green'
  },
  {
    id: 4,
    name: 'Sales Representative',
    description: 'Access to customer management and sales operations',
    permissions: ['crm', 'orders', 'customers'],
    userCount: 1,
    color: 'purple'
  },
  {
    id: 5,
    name: 'Accountant',
    description: 'Access to financial and accounting operations',
    permissions: ['accounting', 'reports', 'purchases'],
    userCount: 1,
    color: 'yellow'
  },
  {
    id: 6,
    name: 'Purchasing Agent',
    description: 'Access to procurement and supplier management',
    permissions: ['purchases', 'suppliers', 'products'],
    userCount: 1,
    color: 'indigo'
  },
  {
    id: 7,
    name: 'Quality Control',
    description: 'Access to product quality and compliance',
    permissions: ['products', 'reports'],
    userCount: 1,
    color: 'pink'
  },
  {
    id: 8,
    name: 'Customer Service',
    description: 'Access to customer support operations',
    permissions: ['crm', 'orders'],
    userCount: 1,
    color: 'orange'
  }
];

export const departments = [
  { id: 1, name: 'IT', userCount: 1, manager: 'John Smith' },
  { id: 2, name: 'Operations', userCount: 1, manager: 'Sarah Johnson' },
  { id: 3, name: 'Warehouse', userCount: 1, manager: 'Mike Chen' },
  { id: 4, name: 'Sales', userCount: 1, manager: 'Emily Davis' },
  { id: 5, name: 'Finance', userCount: 1, manager: 'David Wilson' },
  { id: 6, name: 'Procurement', userCount: 1, manager: 'Lisa Rodriguez' },
  { id: 7, name: 'Quality', userCount: 1, manager: 'Robert Taylor' },
  { id: 8, name: 'Support', userCount: 1, manager: 'Jennifer Brown' }
];

export const userStats = {
  totalUsers: 8,
  activeUsers: 7,
  inactiveUsers: 1,
  newUsersThisMonth: 2,
  totalRoles: 8,
  totalDepartments: 8,
  averageLoginFrequency: 4.2,
  lastUserAdded: '2023-11-22'
};

export const permissions = [
  { id: 'dashboard', name: 'Dashboard', description: 'View system overview and analytics' },
  { id: 'products', name: 'Products', description: 'Manage inventory products and items' },
  { id: 'orders', name: 'Orders', description: 'Process and manage customer orders' },
  { id: 'purchases', name: 'Purchases', description: 'Handle purchase orders and procurement' },
  { id: 'accounting', name: 'Accounting', description: 'Access financial and accounting features' },
  { id: 'crm', name: 'CRM', description: 'Manage customer relationships and leads' },
  { id: 'suppliers', name: 'Suppliers', description: 'Manage supplier relationships' },
  { id: 'warehouses', name: 'Warehouses', description: 'Manage warehouse operations' },
  { id: 'categories', name: 'Categories', description: 'Organize product categories' },
  { id: 'movements', name: 'Stock Movements', description: 'Track inventory movements' },
  { id: 'reports', name: 'Reports', description: 'Generate and view reports' },
  { id: 'settings', name: 'Settings', description: 'Configure system settings' },
  { id: 'users', name: 'User Management', description: 'Manage users and permissions' },
  { id: 'all', name: 'All Permissions', description: 'Full system access' }
];