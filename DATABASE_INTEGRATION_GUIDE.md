# Database Integration Guide
# Complete Component Integration with Supabase Database

## Overview
This guide shows how each component in the inventory management system integrates with the database, replacing mock data with real-time database operations.

## Component Integration Examples

### 1. Dashboard Component Integration
```typescript
// src/pages/inventory/components/Dashboard.tsx
import { useDashboardStats, useProducts } from '../../../hooks/useDatabase';

export default function Dashboard() {
  const { stats, loading, error } = useDashboardStats();
  const { products } = useProducts();
  
  // Real-time calculated alerts
  const lowStockProducts = products.filter(p => 
    p.quantity <= p.min_stock_level && p.quantity > 0
  );
  const outOfStockProducts = products.filter(p => p.quantity === 0);
  
  // Display real statistics with loading states
  return (
    <div className="dashboard">
      {loading ? <LoadingSkeleton /> : <StatsDisplay stats={stats} />}
      {error && <ErrorBanner error={error} />}
      <AlertsSection lowStock={lowStockProducts} outOfStock={outOfStockProducts} />
    </div>
  );
}
```

### 2. Product List Integration
```typescript
// src/pages/inventory/components/ProductList.tsx
import { useProducts, useCategories, useSuppliers } from '../../../hooks/useDatabase';

export default function ProductList() {
  const { products, loading, addProduct, updateProduct, deleteProduct } = useProducts();
  const { categories } = useCategories();
  const { suppliers } = useSuppliers();
  
  const handleAddProduct = async (productData) => {
    try {
      await addProduct({
        name: productData.name,
        sku: productData.sku,
        category_id: productData.categoryId,
        supplier_id: productData.supplierId,
        price: productData.price,
        cost: productData.cost,
        quantity: productData.quantity,
        min_stock_level: productData.minStock,
        description: productData.description
      });
      toast.success('Product added successfully!');
    } catch (error) {
      toast.error('Failed to add product: ' + error.message);
    }
  };
  
  return (
    <div className="product-list">
      <ProductFilters categories={categories} suppliers={suppliers} />
      <ProductTable 
        products={products} 
        loading={loading}
        onUpdate={updateProduct}
        onDelete={deleteProduct}
      />
      <AddProductModal onSubmit={handleAddProduct} />
    </div>
  );
}
```

### 3. Orders Management Integration
```typescript
// src/pages/inventory/components/Orders.tsx
import { useOrders, useCustomers, useProducts } from '../../../hooks/useDatabase';

export default function Orders() {
  const { orders, loading, addOrder } = useOrders();
  const { customers } = useCustomers();
  const { products } = useProducts();
  
  const handleCreateOrder = async (orderData) => {
    try {
      // Create order with items
      const order = await addOrder({
        order_number: generateOrderNumber(),
        type: 'sale',
        status: 'pending',
        customer_name: orderData.customerName,
        customer_email: orderData.customerEmail,
        total_amount: orderData.totalAmount,
        tax_amount: orderData.taxAmount,
        order_date: new Date().toISOString(),
        notes: orderData.notes
      });
      
      // Add order items
      for (const item of orderData.items) {
        await addOrderItem({
          order_id: order.id,
          product_id: item.productId,
          quantity: item.quantity,
          unit_price: item.price,
          total_price: item.quantity * item.price
        });
      }
      
      toast.success('Order created successfully!');
    } catch (error) {
      toast.error('Failed to create order: ' + error.message);
    }
  };
  
  return (
    <div className="orders">
      <OrderFilters />
      <OrderTable orders={orders} loading={loading} />
      <CreateOrderModal 
        customers={customers}
        products={products}
        onSubmit={handleCreateOrder}
      />
    </div>
  );
}
```

### 4. CRM Integration
```typescript
// src/pages/inventory/components/CRM.tsx
import { useCustomers } from '../../../hooks/useDatabase';

export default function CRM() {
  const { customers, loading, addCustomer, updateCustomer } = useCustomers();
  
  const handleAddCustomer = async (customerData) => {
    try {
      await addCustomer({
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        company: customerData.company,
        position: customerData.position,
        address: customerData.address,
        customer_type: customerData.type,
        status: 'active',
        priority: customerData.priority,
        source: customerData.source,
        notes: customerData.notes
      });
      toast.success('Customer added successfully!');
    } catch (error) {
      toast.error('Failed to add customer: ' + error.message);
    }
  };
  
  return (
    <div className="crm">
      <CustomerFilters />
      <CustomerTable 
        customers={customers} 
        loading={loading}
        onUpdate={updateCustomer}
      />
      <AddCustomerModal onSubmit={handleAddCustomer} />
    </div>
  );
}
```

### 5. Stock Movements Integration
```typescript
// src/pages/inventory/components/StockMovements.tsx
import { useStockMovements, useProducts } from '../../../hooks/useDatabase';

export default function StockMovements() {
  const { stockMovements, loading, addStockMovement } = useStockMovements();
  const { products } = useProducts();
  
  const handleStockAdjustment = async (adjustmentData) => {
    try {
      await addStockMovement({
        product_id: adjustmentData.productId,
        movement_type: adjustmentData.type, // 'in', 'out', 'adjustment'
        quantity: adjustmentData.quantity,
        reference_type: 'adjustment',
        reason: adjustmentData.reason,
        notes: adjustmentData.notes,
        created_by: 'Current User' // TODO: Get from auth context
      });
      toast.success('Stock movement recorded successfully!');
    } catch (error) {
      toast.error('Failed to record movement: ' + error.message);
    }
  };
  
  return (
    <div className="stock-movements">
      <MovementFilters />
      <MovementTable movements={stockMovements} loading={loading} />
      <StockAdjustmentModal 
        products={products}
        onSubmit={handleStockAdjustment}
      />
    </div>
  );
}
```

## Real-time Features Implementation

### 1. Live Dashboard Updates
```typescript
// Dashboard automatically updates when inventory changes
useEffect(() => {
  const subscription = supabase
    .channel('dashboard_updates')
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'products' 
    }, (payload) => {
      // Refresh dashboard stats when products change
      refreshStats();
    })
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'stock_movements' 
    }, (payload) => {
      // Update inventory levels in real-time
      refreshStats();
    })
    .subscribe();

  return () => subscription.unsubscribe();
}, []);
```

### 2. Multi-user Inventory Updates
```typescript
// Products update across all connected clients
useEffect(() => {
  const subscription = supabase
    .channel('product_updates')
    .on('postgres_changes', { 
      event: 'UPDATE', 
      schema: 'public', 
      table: 'products' 
    }, (payload) => {
      // Update local state with new product data
      setProducts(prev => prev.map(p => 
        p.id === payload.new.id ? payload.new : p
      ));
      
      // Show notification
      toast.info(`Product ${payload.new.name} was updated by another user`);
    })
    .subscribe();

  return () => subscription.unsubscribe();
}, []);
```

## Database Query Optimizations

### 1. Efficient Product Queries
```sql
-- View for optimized product listing with aggregated data
CREATE VIEW product_inventory_summary AS
SELECT 
    p.*,
    c.name as category_name,
    s.name as supplier_name,
    CASE 
        WHEN p.quantity = 0 THEN 'Out of Stock'
        WHEN p.quantity <= p.min_stock_level THEN 'Low Stock'
        ELSE 'In Stock'
    END as stock_status,
    (p.price * p.quantity) as total_value,
    COALESCE(warehouse_qty.total_warehouse_qty, 0) as warehouse_total
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN suppliers s ON p.supplier_id = s.id
LEFT JOIN (
    SELECT 
        product_id, 
        SUM(quantity) as total_warehouse_qty
    FROM product_warehouse_inventory 
    GROUP BY product_id
) warehouse_qty ON p.id = warehouse_qty.product_id;
```

### 2. Dashboard Statistics Materialized View
```sql
-- Materialized view for fast dashboard queries
CREATE MATERIALIZED VIEW dashboard_cache AS
SELECT 
    (SELECT COUNT(*) FROM products WHERE status = 'active') as total_products,
    (SELECT COUNT(*) FROM products WHERE quantity <= min_stock_level AND quantity > 0) as low_stock,
    (SELECT COUNT(*) FROM products WHERE quantity = 0) as out_of_stock,
    (SELECT SUM(price * quantity) FROM products WHERE status = 'active') as total_value,
    (SELECT COUNT(*) FROM orders WHERE status = 'pending') as pending_orders,
    CURRENT_TIMESTAMP as last_updated;

-- Refresh function
CREATE OR REPLACE FUNCTION refresh_dashboard_cache()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW dashboard_cache;
END;
$$ LANGUAGE plpgsql;

-- Auto-refresh trigger
CREATE OR REPLACE FUNCTION trigger_dashboard_refresh()
RETURNS trigger AS $$
BEGIN
    PERFORM refresh_dashboard_cache();
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_changed 
    AFTER INSERT OR UPDATE OR DELETE ON products
    FOR EACH STATEMENT EXECUTE FUNCTION trigger_dashboard_refresh();
```

## Error Handling and Fallbacks

### 1. Graceful Degradation
```typescript
const { data, error, loading } = useProducts();

if (error) {
  console.warn('Database error, using cached data:', error);
  // Fall back to localStorage or static data
  const cachedProducts = localStorage.getItem('products');
  return cachedProducts ? JSON.parse(cachedProducts) : [];
}

if (loading) {
  return <ProductSkeleton />;
}

// Cache successful data
localStorage.setItem('products', JSON.stringify(data));
return data;
```

### 2. Retry Logic
```typescript
const useProductsWithRetry = () => {
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  
  const { data, error, loading } = useProducts();
  
  useEffect(() => {
    if (error && retryCount < maxRetries) {
      const timeout = setTimeout(() => {
        setRetryCount(prev => prev + 1);
        // Trigger retry
      }, 2000 * Math.pow(2, retryCount)); // Exponential backoff
      
      return () => clearTimeout(timeout);
    }
  }, [error, retryCount]);
  
  return { data, error, loading, retryCount };
};
```

## Performance Monitoring

### 1. Query Performance Tracking
```typescript
const useQueryPerformance = (queryName: string) => {
  const [metrics, setMetrics] = useState({ duration: 0, timestamp: null });
  
  const trackQuery = async (queryFn: () => Promise<any>) => {
    const start = performance.now();
    try {
      const result = await queryFn();
      const duration = performance.now() - start;
      setMetrics({ duration, timestamp: new Date() });
      
      // Log slow queries
      if (duration > 1000) {
        console.warn(`Slow query detected: ${queryName} took ${duration}ms`);
      }
      
      return result;
    } catch (error) {
      console.error(`Query failed: ${queryName}`, error);
      throw error;
    }
  };
  
  return { trackQuery, metrics };
};
```

### 2. Connection Health Monitoring
```typescript
const useConnectionHealth = () => {
  const [isHealthy, setIsHealthy] = useState(true);
  const [lastCheck, setLastCheck] = useState(new Date());
  
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id')
          .limit(1);
        
        setIsHealthy(!error);
        setLastCheck(new Date());
      } catch (error) {
        setIsHealthy(false);
        console.error('Connection health check failed:', error);
      }
    };
    
    // Check every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    checkHealth(); // Initial check
    
    return () => clearInterval(interval);
  }, []);
  
  return { isHealthy, lastCheck };
};
```

This comprehensive integration plan transforms the inventory management system from a mock-data application into a fully functional, real-time database-driven system with proper error handling, performance optimization, and user experience considerations.
