import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ctlcpcgjnozjdskbgsul.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0bGNwY2dqbm96amRza2Jnc3VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMzNjUzNTQsImV4cCI6MjA0ODk0MTM1NH0.HwOaDvjCpkwbDz1zcR5XDKE8bAG8jE8N3m2ZS0lhfU8'

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Database helper functions
export const db = {
  // Products
  async getProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async createProduct(product: any) {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async updateProduct(id: string, updates: any) {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  async deleteProduct(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Orders
  async getOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (*)
        )
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async createOrder(order: any) {
    const { data, error } = await supabase
      .from('orders')
      .insert([order])
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Categories
  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data
  },

  // Product Variants
  async getProductVariants(productId?: string) {
    let query = supabase
      .from('product_variants')
      .select(`
        *,
        products (
          name,
          sku,
          image_url
        )
      `)
      .order('created_at')
    
    if (productId) {
      query = query.eq('product_id', productId)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data
  },

  async createProductVariant(variant: any) {
    const { data, error } = await supabase
      .from('product_variants')
      .insert([variant])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async updateProductVariant(id: string, updates: any) {
    const { data, error } = await supabase
      .from('product_variants')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  async deleteProductVariant(id: string) {
    const { error } = await supabase
      .from('product_variants')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Suppliers
  async getSuppliers() {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data
  },

  // Stock movements
  async getStockMovements() {
    const { data, error } = await supabase
      .from('stock_movements')
      .select(`
        *,
        products (name, sku)
      `)
      .order('created_at', { ascending: false })
      .limit(100)
    
    if (error) throw error
    return data
  },

  async createStockMovement(movement: any) {
    const { data, error } = await supabase
      .from('stock_movements')
      .insert([movement])
      .select()
    
    if (error) throw error
    return data[0]
  }
}

// Authentication helpers
export const auth = {
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })
    
    if (error) throw error
    return data
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

export default supabase
