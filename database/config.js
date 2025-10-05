import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables from parent directory
dotenv.config({ path: path.join(__dirname, '..', '.env') })

// Supabase configuration from environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase configuration!')
  console.error('Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file')
  process.exit(1)
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Export configuration for use in seed scripts
export const config = {
  supabaseUrl,
  supabaseAnonKey
}

console.log('✅ Database configuration loaded successfully')
