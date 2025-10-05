import { useState, useEffect } from 'react'
import { db, supabase } from '../lib/supabase'

// Enhanced hook for managing products with real-time updates
export function useProducts() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadProducts()
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('products_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'products' 
        }, 
        () => {
          loadProducts() // Reload when products change
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('product_inventory_summary')
        .select('*')
        .order('name')
      
      if (error) throw error
      setProducts(data || [])
      setError(null)
    } catch (err: any) {
      setError(err.message)
      console.warn('Database not available, using fallback:', err.message)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const addProduct = async (product: any) => {
    try {
      const newProduct = await db.createProduct(product)
      await loadProducts() // Reload to get updated data
      return newProduct
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const updateProduct = async (id: string, updates: any) => {
    try {
      const updatedProduct = await db.updateProduct(id, updates)
      await loadProducts() // Reload to get updated data
      return updatedProduct
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const deleteProduct = async (id: string) => {
    try {
      await db.deleteProduct(id)
      await loadProducts() // Reload to get updated data
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    refresh: loadProducts
  }
}

// Enhanced hook for managing orders
export function useOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadOrders()
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('orders_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'orders' 
        }, 
        () => {
          loadOrders()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const data = await db.getOrders()
      setOrders(data || [])
      setError(null)
    } catch (err: any) {
      setError(err.message)
      console.warn('Database not available for orders:', err.message)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const addOrder = async (order: any) => {
    try {
      const newOrder = await db.createOrder(order)
      await loadOrders()
      return newOrder
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  return {
    orders,
    loading,
    error,
    addOrder,
    refresh: loadOrders
  }
}

// Hook for dashboard statistics with real-time updates
export function useDashboardStats() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadStats()
    
    // Set up real-time subscriptions for tables that affect dashboard stats
    const subscription = supabase
      .channel('dashboard_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'products' 
        }, 
        () => {
          loadStats()
        }
      )
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'orders' 
        }, 
        () => {
          loadStats()
        }
      )
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'stock_movements' 
        }, 
        () => {
          loadStats()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('dashboard_summary')
        .select('*')
        .limit(1)
      
      if (error) throw error
      
      if (data && data.length > 0) {
        setStats(data[0])
      } else {
        // Fallback to mock data structure
        setStats({
          total_products: 313,
          low_stock_items: 12,
          out_of_stock_items: 5,
          total_inventory_value: 156789.45,
          monthly_orders: 89,
          pending_orders: 23,
          total_suppliers: 15,
          active_categories: 8
        })
      }
      setError(null)
    } catch (err: any) {
      setError(err.message)
      console.warn('Database not available for stats, using fallback:', err.message)
      // Fallback stats matching mock data
      setStats({
        total_products: 313,
        low_stock_items: 12,
        out_of_stock_items: 5,
        total_inventory_value: 156789.45,
        monthly_orders: 89,
        pending_orders: 23,
        total_suppliers: 15,
        active_categories: 8
      })
    } finally {
      setLoading(false)
    }
  }

  return {
    stats,
    loading,
    error,
    refresh: loadStats
  }
}

// Hook for categories
export function useCategories() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const data = await db.getCategories()
      setCategories(data || [])
      setError(null)
    } catch (err: any) {
      setError(err.message)
      console.warn('Database not available for categories:', err.message)
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  return {
    categories,
    loading,
    error,
    refresh: loadCategories
  }
}

// Hook for suppliers
export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadSuppliers()
  }, [])

  const loadSuppliers = async () => {
    try {
      setLoading(true)
      const data = await db.getSuppliers()
      setSuppliers(data || [])
      setError(null)
    } catch (err: any) {
      setError(err.message)
      console.warn('Database not available for suppliers:', err.message)
      setSuppliers([])
    } finally {
      setLoading(false)
    }
  }

  return {
    suppliers,
    loading,
    error,
    refresh: loadSuppliers
  }
}

// Hook for customers
export function useCustomers() {
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCustomers()
    
    // Real-time subscription
    const subscription = supabase
      .channel('customers_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'customers' 
        }, 
        () => {
          loadCustomers()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const loadCustomers = async () => {
    try {
      setLoading(true)
      // Try customer_summary view first, fallback to customers table
      let { data, error } = await supabase
        .from('customer_summary')
        .select('*')
        .order('name')
      
      // If customer_summary view doesn't exist, try customers table directly
      if (error && error.message?.includes('does not exist')) {
        console.log('customer_summary view not found, using customers table directly')
        const fallbackQuery = await supabase
          .from('customers')
          .select(`
            id, name, email, phone, address, company, position, website, 
            industry, customer_type, status, priority, source, assigned_to,
            total_orders, total_value, last_order_date, created_date, 
            last_contact, next_follow_up, tags, notes, avatar_url,
            created_at, updated_at
          `)
          .order('name')
        
        data = fallbackQuery.data
        error = fallbackQuery.error
      }
      
      if (error) throw error
      setCustomers(data || [])
      setError(null)
    } catch (err: any) {
      setError(err.message)
      console.warn('Database not available for customers:', err.message)
      setCustomers([])
    } finally {
      setLoading(false)
    }
  }

  const addCustomer = async (customer: any) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .insert([customer])
        .select()
      
      if (error) throw error
      await loadCustomers()
      return data[0]
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const updateCustomer = async (id: string, updates: any) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .update(updates)
        .eq('id', id)
        .select()
      
      if (error) throw error
      await loadCustomers()
      return data[0]
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const seedCustomers = async () => {
    const enhancedCustomers = [
      {
        name: 'John Smith',
        email: 'contact@techsolutions.com',
        phone: '+1 (555) 123-4567',
        address: '123 Business Park, Suite 100, San Francisco, CA 94105',
        company: 'Tech Solutions Inc.',
        position: 'CTO',
        website: 'https://techsolutions.com',
        industry: 'Technology',
        customer_type: 'enterprise',
        status: 'active',
        priority: 'high',
        source: 'Website',
        assigned_to: 'John Smith',
        total_orders: 15,
        total_value: 45750.00,
        last_order_date: '2024-01-15T00:00:00Z',
        created_date: '2023-06-15T00:00:00Z',
        last_contact: '2024-01-14T00:00:00Z',
        next_follow_up: '2024-01-20T00:00:00Z',
        tags: ['VIP', 'Enterprise', 'Technology'],
        notes: 'Long-term client with consistent large orders. Prefers bulk purchases.',
        avatar_url: '/images/avatar001_100x100.jpg'
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah@creativeagency.com',
        phone: '+1 (555) 987-6543',
        address: '456 Design Street, Floor 3, New York, NY 10001',
        company: 'Creative Agency Ltd.',
        position: 'Creative Director',
        website: 'https://creativeagency.com',
        industry: 'Marketing',
        customer_type: 'business',
        status: 'active',
        priority: 'medium',
        source: 'Referral',
        assigned_to: 'Sarah Johnson',
        total_orders: 8,
        total_value: 12450.00,
        last_order_date: '2024-01-12T00:00:00Z',
        created_date: '2023-09-20T00:00:00Z',
        last_contact: '2024-01-10T00:00:00Z',
        next_follow_up: '2024-01-18T00:00:00Z',
        tags: ['Creative', 'Design', 'Regular'],
        notes: 'Focuses on design equipment and creative tools. Seasonal ordering patterns.',
        avatar_url: '/images/avatar002_100x100.jpg'
      },
      {
        name: 'Michael Chen',
        email: 'mike@startuphub.com',
        phone: '+1 (555) 456-7890',
        address: '789 Innovation Drive, Austin, TX 78701',
        company: 'StartUp Hub',
        position: 'Founder',
        website: 'https://startuphub.com',
        industry: 'Technology',
        customer_type: 'business',
        status: 'active',
        priority: 'high',
        source: 'Trade Show',
        assigned_to: 'Mike Chen',
        total_orders: 12,
        total_value: 28900.00,
        last_order_date: '2024-01-13T00:00:00Z',
        created_date: '2023-11-05T00:00:00Z',
        last_contact: '2024-01-13T00:00:00Z',
        next_follow_up: '2024-01-22T00:00:00Z',
        tags: ['Startup', 'Growth', 'Tech'],
        notes: 'Fast-growing startup with increasing order frequency. Potential for partnership.',
        avatar_url: '/images/avatar003_100x100.jpg'
      },
      {
        name: 'Lisa Rodriguez',
        email: 'lisa@digitalmarketing.com',
        phone: '+1 (555) 234-5678',
        address: '321 Marketing Plaza, Los Angeles, CA 90028',
        company: 'Digital Marketing Pro',
        position: 'Marketing Manager',
        website: 'https://digitalmarketing.com',
        industry: 'Marketing',
        customer_type: 'business',
        status: 'active',
        priority: 'medium',
        source: 'Cold Call',
        assigned_to: 'Lisa Wong',
        total_orders: 0,
        total_value: 0,
        last_order_date: null,
        created_date: '2024-01-10T00:00:00Z',
        last_contact: '2024-01-10T00:00:00Z',
        next_follow_up: '2024-01-17T00:00:00Z',
        tags: ['Prospect', 'Marketing', 'Qualified'],
        notes: 'Interested in bulk orders for team equipment. Currently evaluating options.',
        avatar_url: '/images/avatar004_100x100.jpg'
      },
      {
        name: 'David Kim',
        email: 'david@enterprise.com',
        phone: '+1 (555) 345-6789',
        address: '654 Corporate Center, Chicago, IL 60601',
        company: 'Enterprise Solutions Corp',
        position: 'Procurement Manager',
        website: 'https://enterprise.com',
        industry: 'Enterprise',
        customer_type: 'enterprise',
        status: 'active',
        priority: 'high',
        source: 'LinkedIn',
        assigned_to: 'David Kim',
        total_orders: 22,
        total_value: 67800.00,
        last_order_date: '2024-01-12T00:00:00Z',
        created_date: '2023-03-12T00:00:00Z',
        last_contact: '2024-01-11T00:00:00Z',
        next_follow_up: '2024-01-19T00:00:00Z',
        tags: ['Enterprise', 'Procurement', 'Volume'],
        notes: 'Large enterprise client with quarterly bulk orders. Contract renewal due Q2.',
        avatar_url: '/images/avatar005_100x100.jpg'
      },
      {
        name: 'Emma Wilson',
        email: 'emma@freelancers.com',
        phone: '+1 (555) 567-8901',
        address: '987 Remote Work Ave, Seattle, WA 98101',
        company: 'Freelancer Network',
        position: 'Community Manager',
        website: 'https://freelancers.com',
        industry: 'Services',
        customer_type: 'business',
        status: 'inactive',
        priority: 'low',
        source: 'Website',
        assigned_to: 'Emma Rodriguez',
        total_orders: 3,
        total_value: 2850.00,
        last_order_date: '2023-11-20T00:00:00Z',
        created_date: '2023-08-15T00:00:00Z',
        last_contact: '2023-12-05T00:00:00Z',
        next_follow_up: '2024-01-25T00:00:00Z',
        tags: ['Freelancer', 'Remote', 'Inactive'],
        notes: 'Irregular ordering pattern. Last contact showed interest in remote work equipment.',
        avatar_url: '/images/avatar006_100x100.jpg'
      }
    ];

    try {
      // Clear existing customers
      await supabase.from('customers').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      // Insert enhanced customers
      const { data, error } = await supabase
        .from('customers')
        .insert(enhancedCustomers)
        .select();
      
      if (error) throw error;
      
      await loadCustomers();
      return { success: true, count: data.length };
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    customers,
    loading,
    error,
    addCustomer,
    updateCustomer,
    seedCustomers,
    refresh: loadCustomers
  }
}

// Hook for stock movements
export function useStockMovements() {
  const [stockMovements, setStockMovements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadStockMovements()
    
    // Real-time subscription
    const subscription = supabase
      .channel('stock_movements_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'stock_movements' 
        }, 
        () => {
          loadStockMovements()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const loadStockMovements = async () => {
    try {
      setLoading(true)
      const data = await db.getStockMovements()
      setStockMovements(data || [])
      setError(null)
    } catch (err: any) {
      setError(err.message)
      console.warn('Database not available for stock movements:', err.message)
      setStockMovements([])
    } finally {
      setLoading(false)
    }
  }

  const addStockMovement = async (movement: any) => {
    try {
      const newMovement = await db.createStockMovement(movement)
      await loadStockMovements()
      return newMovement
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  return {
    stockMovements,
    loading,
    error,
    addStockMovement,
    refresh: loadStockMovements
  }
}

// Hook for real-time subscriptions
export function useRealtimeSubscription(table: string, callback: (payload: any) => void) {
  useEffect(() => {
    const subscription = supabase
      .channel(`${table}_changes`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: table 
        }, 
        callback
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [table, callback])
}

// Hook for product variants
export function useProductVariants(productId?: string) {
  const [variants, setVariants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadVariants()
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('product_variants_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'product_variants' 
        }, 
        () => {
          loadVariants()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [productId])

  const loadVariants = async () => {
    try {
      setLoading(true)
      const data = await db.getProductVariants(productId)
      setVariants(data || [])
      setError(null)
    } catch (err: any) {
      setError(err.message)
      console.warn('Database not available, using fallback:', err.message)
      setVariants([])
    } finally {
      setLoading(false)
    }
  }

  const addVariant = async (variant: any) => {
    try {
      const newVariant = await db.createProductVariant(variant)
      await loadVariants()
      return newVariant
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const updateVariant = async (id: string, updates: any) => {
    try {
      const updatedVariant = await db.updateProductVariant(id, updates)
      await loadVariants()
      return updatedVariant
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const deleteVariant = async (id: string) => {
    try {
      await db.deleteProductVariant(id)
      await loadVariants()
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  return {
    variants,
    loading,
    error,
    addVariant,
    updateVariant,
    deleteVariant,
    refresh: loadVariants
  }
}

// Hook for authentication state
export function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return {
    user,
    loading,
    signOut: () => supabase.auth.signOut()
  }
}

// Enhanced hook for managing users with real-time updates
export function useUsers() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadUsers()
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('users_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'users' 
        }, 
        () => {
          loadUsers() // Reload when users change
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          roles(name, color),
          departments(name)
        `)
        .order('name')
      
      if (error) throw error
      setUsers(data || [])
      setError(null)
    } catch (err: any) {
      setError(err.message)
      console.warn('Database not available, using fallback:', err.message)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const addUser = async (user: any) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([user])
        .select()
      
      if (error) throw error
      return data[0]
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const updateUser = async (id: number, updates: any) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
      
      if (error) throw error
      return data[0]
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const deleteUser = async (id: number) => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  return {
    users,
    loading,
    error,
    addUser,
    updateUser,
    deleteUser,
    reload: loadUsers
  }
}

// Enhanced hook for managing roles with real-time updates
export function useRoles() {
  const [roles, setRoles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadRoles()
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('roles_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'roles' 
        }, 
        () => {
          loadRoles() // Reload when roles change
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const loadRoles = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('roles')
        .select(`
          *,
          role_permissions(
            permissions(*)
          )
        `)
        .order('name')
      
      if (error) throw error
      setRoles(data || [])
      setError(null)
    } catch (err: any) {
      setError(err.message)
      console.warn('Database not available, using fallback:', err.message)
      setRoles([])
    } finally {
      setLoading(false)
    }
  }

  const addRole = async (role: any) => {
    try {
      const { data, error } = await supabase
        .from('roles')
        .insert([role])
        .select()
      
      if (error) throw error
      return data[0]
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const updateRole = async (id: number, updates: any) => {
    try {
      const { data, error } = await supabase
        .from('roles')
        .update(updates)
        .eq('id', id)
        .select()
      
      if (error) throw error
      return data[0]
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const deleteRole = async (id: number) => {
    try {
      const { error } = await supabase
        .from('roles')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  return {
    roles,
    loading,
    error,
    addRole,
    updateRole,
    deleteRole,
    reload: loadRoles
  }
}

// Enhanced hook for managing departments with real-time updates
export function useDepartments() {
  const [departments, setDepartments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDepartments()
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('departments_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'departments' 
        }, 
        () => {
          loadDepartments() // Reload when departments change
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const loadDepartments = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('departments')
        .select(`
          *,
          users!departments_manager_id_fkey(name)
        `)
        .order('name')
      
      if (error) throw error
      setDepartments(data || [])
      setError(null)
    } catch (err: any) {
      setError(err.message)
      console.warn('Database not available, using fallback:', err.message)
      setDepartments([])
    } finally {
      setLoading(false)
    }
  }

  const addDepartment = async (department: any) => {
    try {
      const { data, error } = await supabase
        .from('departments')
        .insert([department])
        .select()
      
      if (error) throw error
      return data[0]
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const updateDepartment = async (id: number, updates: any) => {
    try {
      const { data, error } = await supabase
        .from('departments')
        .update(updates)
        .eq('id', id)
        .select()
      
      if (error) throw error
      return data[0]
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const deleteDepartment = async (id: number) => {
    try {
      const { error } = await supabase
        .from('departments')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  return {
    departments,
    loading,
    error,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    reload: loadDepartments
  }
}

// Enhanced hook for managing permissions with real-time updates
export function usePermissions() {
  const [permissions, setPermissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadPermissions()
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('permissions_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'permissions' 
        }, 
        () => {
          loadPermissions() // Reload when permissions change
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const loadPermissions = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('permissions')
        .select('*')
        .order('name')
      
      if (error) throw error
      setPermissions(data || [])
      setError(null)
    } catch (err: any) {
      setError(err.message)
      console.warn('Database not available, using fallback:', err.message)
      setPermissions([])
    } finally {
      setLoading(false)
    }
  }

  const addPermission = async (permission: any) => {
    try {
      const { data, error } = await supabase
        .from('permissions')
        .insert([permission])
        .select()
      
      if (error) throw error
      return data[0]
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const updatePermission = async (id: number, updates: any) => {
    try {
      const { data, error } = await supabase
        .from('permissions')
        .update(updates)
        .eq('id', id)
        .select()
      
      if (error) throw error
      return data[0]
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const deletePermission = async (id: number) => {
    try {
      const { error } = await supabase
        .from('permissions')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  return {
    permissions,
    loading,
    error,
    addPermission,
    updatePermission,
    deletePermission,
    reload: loadPermissions
  }
}
