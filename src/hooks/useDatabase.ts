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
      const { data, error } = await supabase
        .from('customer_summary')
        .select('*')
        .order('name')
      
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

  return {
    customers,
    loading,
    error,
    addCustomer,
    updateCustomer,
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
