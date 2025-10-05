# Database Management

This folder contains all database-related files for the inventory management system.

## 📁 File Structure

```
database/
├── config.js                 # Centralized database configuration
├── seed-all.js              # Master seeding script
├── seed-categories.js        # Categories data seeding
├── seed-suppliers.js         # Suppliers data seeding  
├── seed-stock-movements.js   # Stock movements data seeding
├── seed-orders.js           # Orders data seeding
├── seed-purchases.js        # Purchases data seeding
├── seed-crm.js             # CRM data seeding
├── schema.sql              # Main database schema
├── seed.sql                # Basic seed data
└── README.md               # This file
```

## 🔐 Environment Configuration

Before running any database scripts, ensure your `.env` file contains:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🚀 Quick Start

1. **Setup Environment**:
   ```bash
   # Copy environment template
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

2. **Install Dependencies**:
   ```bash
   npm install @supabase/supabase-js dotenv
   ```

3. **Run All Seeds**:
   ```bash
   cd database
   node seed-all.js
   ```

## 📊 Individual Seed Scripts

Run specific seed scripts for targeted data population:

```bash
cd database

# Seed categories (run first)
node seed-categories.js

# Seed suppliers  
node seed-suppliers.js

# Seed stock movements
node seed-stock-movements.js

# Seed orders
node seed-orders.js

# Seed purchases
node seed-purchases.js

# Seed CRM data
node seed-crm.js
```

## 🗄️ Database Schema

The database uses the following main tables:
- `categories` - Product categories with hierarchical structure
- `suppliers` - Vendor/supplier information with performance metrics
- `stock_movements` - Inventory tracking and movement history
- `orders` - Customer orders with comprehensive metadata
- `purchases` - Purchase orders with supplier integration
- `customers` - Customer relationship management data

## 🔧 Configuration Details

### Database Connection
- All seed scripts use the centralized `config.js` for database connection
- Credentials are loaded from environment variables for security
- Automatic connection testing and error handling

### Data Structure
- **Enhanced Business Intelligence**: All seed data includes comprehensive metadata
- **Real-world Scenarios**: Data reflects actual business operations and workflows
- **Performance Metrics**: Includes vendor ratings, delivery times, quality scores
- **Financial Tracking**: Complete cost analysis, taxes, shipping, discounts

### Security Features
- Environment variable-based configuration
- No hardcoded credentials in source code
- Input validation and error handling
- Graceful degradation for missing tables

## 📈 Data Overview

Each seed script populates:

### Categories (15+ categories)
- Electronics, Office Supplies, Industrial Equipment
- Hierarchical structure with subcategories
- Business intelligence and performance tracking

### Suppliers (7 suppliers)
- Comprehensive vendor profiles with ratings
- Performance metrics and contract information
- International and domestic suppliers

### Stock Movements (50+ movements)
- Inbound, outbound, adjustment, and transfer operations
- Real-time inventory tracking
- Quality control and compliance documentation

### Orders (15+ orders)
- Complete customer order lifecycle
- Payment processing and fulfillment tracking
- Customer satisfaction and analytics

### Purchases (6+ purchase orders)
- Vendor purchase order management
- Financial tracking and approval workflows
- Logistics and delivery coordination

### CRM Data (Customer profiles)
- Customer relationship management
- Sales analytics and performance tracking
- Account management and communication history

## 🛠️ Troubleshooting

### Common Issues

1. **Connection Errors**:
   - Verify `.env` file configuration
   - Check Supabase project status
   - Ensure correct URL and API keys

2. **Table Not Found**:
   - Run table creation scripts in Supabase SQL Editor first
   - Check table permissions and RLS policies

3. **Permission Errors**:
   - Verify API key permissions
   - Check Row Level Security (RLS) settings

### Support Commands

```bash
# Test database connection
node -e "import('./config.js')"

# Check environment variables
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY
```

## 📝 Notes

- All seed scripts include comprehensive error handling
- Data includes realistic business scenarios and metrics
- Scripts are idempotent where possible (can be run multiple times)
- Foreign key relationships are maintained across all tables
- Data supports full inventory management workflows

## 🔄 Updates

When updating seed data:
1. Modify the respective seed file
2. Test with a development database first
3. Run the specific seed script
4. Verify data integrity across related tables

For questions or issues, refer to the main project documentation.
