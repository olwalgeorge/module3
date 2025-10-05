import { useState, useEffect } from 'react'
import { db, supabase } from '../lib/supabase'

// Hook for managing products
export function useProducts() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const data = await db.getProducts()
      setProducts(data || [])
      setError(null)
    } catch (err: any) {
      setError(err.message)
      // Fallback to mock data if database is not available
      console.warn('Database not available, using mock data:', err.message)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const addProduct = async (product: any) => {
    try {
      const newProduct = await db.createProduct(product)
      setProducts(prev => [newProduct, ...prev])
      return newProduct
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const updateProduct = async (id: string, updates: any) => {
    try {
      const updatedProduct = await db.updateProduct(id, updates)
      setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p))
      return updatedProduct
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const deleteProduct = async (id: string) => {
    try {
      await db.deleteProduct(id)
      setProducts(prev => prev.filter(p => p.id !== id))
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

// Hook for managing orders
export function useOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const data = await db.getOrders()
      setOrders(data || [])
      setError(null)
    } catch (err: any) {
      setError(err.message)
      console.warn('Database not available, using mock data:', err.message)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const addOrder = async (order: any) => {
    try {
      const newOrder = await db.createOrder(order)
      setOrders(prev => [newOrder, ...prev])
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
