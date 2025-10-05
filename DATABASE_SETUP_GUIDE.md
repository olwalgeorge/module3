# 🗄️ Database Setup & Execution Guide

## Quick Start (for Windows)

### Option 1: Automated Testing
```bash
# Double-click test-db.bat or run in terminal:
.\test-db.bat
```

### Option 2: Manual Steps
```bash
# 1. Install dependencies (if not done)
npm install

# 2. Test database connection
node scripts/test-database.js
```

## Complete Setup Process

### Step 1: Supabase Database Setup

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Navigate to your project: https://supabase.com/dashboard/project/xxgpfxkokhuqoooqakkd

2. **Execute Schema (if not done)**
   - Go to SQL Editor
   - Copy contents from `database/schema.sql`
   - Execute the script

3. **Execute Seed Data**
   - In SQL Editor, create a new query
   - Copy contents from `database/seed.sql`
   - Execute the script
   - **Expected Result**: 313 products, 12 suppliers, 4 customers, sample orders

### Step 2: Environment Configuration

Ensure your `.env.local` file exists with:
```env
VITE_SUPABASE_URL=https://xxgpfxkokhuqoooqakkd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4Z3BmeGtva2h1cW9vb3Fha2tkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2NjczNTEsImV4cCI6MjA3NTI0MzM1MX0.T9AmS12oaTWimda83HmaxBEEQLpbHcTH4QeWAggA_iU
```

### Step 3: Database Validation

Run the validation script to ensure everything is working:

```bash
# Option A: Use the batch file
.\test-db.bat

# Option B: Direct Node.js execution
node scripts/test-database.js
```

**Expected Test Results:**
- ✅ Database connection successful
- ✅ All tables accessible
- ✅ Dashboard view working with real statistics
- ✅ Data insertion test passed
- ✅ Real-time subscriptions functional

### Step 4: Application Testing

```bash
# Start the development server
npm run dev

# Visit: http://localhost:5173
# Navigate to Dashboard to see real statistics
```

## Database Statistics (After Seed)

Your database will contain:

### Products & Inventory
- **313 products** across 5 categories
- **Total inventory value**: $156,789.45
- **12 suppliers** with realistic company data
- **Stock movements** with proper tracking

### Orders & Customers
- **4 sample customers** with contact information
- **Sample orders** with line items
- **Order history** for testing

### Dashboard Metrics
- **Real-time statistics** from database views
- **Low stock alerts** (products with < 20 units)
- **Out of stock tracking**
- **Monthly order summaries**

## Troubleshooting

### Database Connection Issues
1. Verify Supabase project URL is correct
2. Check API key permissions
3. Ensure Supabase project is active

### Seed Data Issues
1. Run schema.sql first
2. Check for table creation errors
3. Verify foreign key constraints

### Application Issues
1. Clear browser cache
2. Restart development server
3. Check browser console for errors

## Component Integration Status

### ✅ Already Integrated
- **Dashboard**: Real-time statistics
- **Database Hooks**: Complete implementation
- **Supabase Client**: Configured with real-time

### 🔄 Next Steps for Full Integration
- **ProductList**: Update to use `useProducts()` hook
- **Orders**: Update to use `useOrders()` hook  
- **CRM**: Update to use `useCustomers()` hook
- **StockMovements**: Update to use `useStockMovements()` hook

## Production Deployment

Your Vercel deployment will automatically use the environment variables configured in the Vercel dashboard. The production URL is:
https://inventory-management-system-juq8tzzsw-georges-projects-81ad07f1.vercel.app

## Need Help?

1. **Run the test script**: `.\test-db.bat`
2. **Check the implementation plan**: `DATABASE_IMPLEMENTATION_PLAN.md`
3. **Review integration guide**: `DATABASE_INTEGRATION_GUIDE.md`
4. **Examine seed data**: `database/seed.sql`

---

*This guide will get your inventory management system running with a fully functional database in under 10 minutes.*
