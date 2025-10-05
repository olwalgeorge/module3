# Database Configuration

This inventory management system is now configured to use Supabase as the remote PostgreSQL database.

## Setup Instructions

### 1. Environment Variables
The project is configured with the following environment variables:

- **VITE_SUPABASE_URL**: Public Supabase URL for client-side access
- **VITE_SUPABASE_ANON_KEY**: Public anonymous key for client-side authentication
- **DATABASE_URL**: Server-side database connection string
- **SUPABASE_SERVICE_ROLE_KEY**: Server-side service role key for admin operations

### 2. Database Schema
Run the SQL schema in `database/schema.sql` to create the necessary tables:

1. Open your Supabase dashboard
2. Go to SQL Editor
3. Copy and paste the contents of `database/schema.sql`
4. Execute the script

### 3. Tables Created
- **products**: Product inventory with SKU, pricing, and stock levels
- **categories**: Product categories with hierarchical support
- **suppliers**: Supplier information and contact details
- **orders**: Purchase and sales orders
- **order_items**: Individual items within orders
- **stock_movements**: Track inventory changes
- **warehouses**: Multiple warehouse support
- **product_warehouse_inventory**: Product quantities per warehouse

### 4. Features Enabled
- ✅ **Real-time updates**: Using Supabase real-time subscriptions
- ✅ **Authentication**: Built-in user authentication
- ✅ **Row Level Security**: Database-level security policies
- ✅ **Automatic timestamps**: Created/updated timestamps
- ✅ **UUID primary keys**: Secure, non-sequential identifiers

### 5. Usage in Components
The system provides React hooks for easy database interaction:

```typescript
// Use products
const { products, loading, addProduct, updateProduct } = useProducts()

// Use orders
const { orders, loading, addOrder } = useOrders()

// Authentication
const { user, loading, signOut } = useAuth()
```

### 6. Fallback Behavior
If the database is not available, the application will:
- Display a warning in the console
- Fall back to empty arrays for data
- Continue to function with the existing UI

### 7. Development vs Production
- **Development**: Uses `.env.local` for local development
- **Production**: Vercel deployment uses environment variables in `vercel.json`

### 8. Security Notes
- All sensitive keys are properly managed through environment variables
- Row Level Security is enabled on all tables
- Anonymous key allows safe client-side operations
- Service role key is only used server-side when needed

## Next Steps
1. Execute the database schema in Supabase
2. Test the connection by restarting the development server
3. Verify real-time updates work correctly
4. Add authentication UI if user management is needed
