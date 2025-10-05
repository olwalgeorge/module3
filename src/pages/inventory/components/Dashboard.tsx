
import { useDashboardStats, useProducts } from '../../../hooks/useDatabase';

export default function Dashboard() {
  // Get real-time dashboard statistics
  const { stats, loading: statsLoading, error: statsError } = useDashboardStats();
  const { products } = useProducts();

  // Navigation handler for quick actions
  const onNavigate = (section: string) => {
    console.log(`Navigate to ${section}`);
    // TODO: Implement navigation logic or integrate with router
  };

  // Calculate dynamic product alerts from database
  const lowStockProducts = products.filter(p => 
    p.quantity <= p.min_stock_level && p.quantity > 0
  );
  const outOfStockProducts = products.filter(p => p.quantity === 0);

  // Use real statistics or fallback to loading state
  const displayStats = stats || {
    total_products: 0,
    low_stock_items: 0,
    out_of_stock_items: 0,
    total_inventory_value: 0,
    monthly_orders: 0,
    pending_orders: 0
  };

  const statsConfig = [
    {
      title: 'Total Products',
      value: displayStats.total_products,
      icon: 'ri-box-3-line',
      color: 'bg-blue-500',
      change: '+12%',
      loading: statsLoading
    },
    {
      title: 'Low Stock Items',
      value: displayStats.low_stock_items,
      icon: 'ri-error-warning-line',
      color: 'bg-yellow-500',
      change: '-5%',
      loading: statsLoading
    },
    {
      title: 'Out of Stock',
      value: displayStats.out_of_stock_items,
      icon: 'ri-close-circle-line',
      color: 'bg-red-500',
      change: '+2%',
      loading: statsLoading
    },
    {
      title: 'Total Value',
      value: `$${Number(displayStats.total_inventory_value || 0).toLocaleString()}`,
      icon: 'ri-money-dollar-circle-line',
      color: 'bg-green-500',
      change: '+8%',
      loading: statsLoading
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Error Display */}
      {statsError && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <i className="ri-alert-line text-yellow-400 text-xl mr-3"></i>
            <div>
              <p className="text-sm font-medium text-yellow-800">Database Connection Issue</p>
              <p className="text-sm text-yellow-700 mt-1">
                Using cached data. Some statistics may not be current. {statsError}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsConfig.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                {stat.loading ? (
                  <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-16 mt-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-12 mt-1"></div>
                  </div>
                ) : (
                  <>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
                  </>
                )}
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <i className={`${stat.icon} text-white text-xl`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button 
            onClick={() => onNavigate('products')}
            className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
          >
            <i className="ri-box-3-line text-2xl text-blue-600 mb-2"></i>
            <span className="text-sm font-medium text-blue-900">Add Product</span>
          </button>
          <button 
            onClick={() => onNavigate('orders')}
            className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors cursor-pointer"
          >
            <i className="ri-shopping-cart-line text-2xl text-green-600 mb-2"></i>
            <span className="text-sm font-medium text-green-900">New Order</span>
          </button>
          <button 
            onClick={() => onNavigate('purchases')}
            className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer"
          >
            <i className="ri-shopping-bag-3-line text-2xl text-purple-600 mb-2"></i>
            <span className="text-sm font-medium text-purple-900">Purchase Order</span>
          </button>
          <button 
            onClick={() => onNavigate('accounting')}
            className="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors cursor-pointer"
          >
            <i className="ri-calculator-line text-2xl text-orange-600 mb-2"></i>
            <span className="text-sm font-medium text-orange-900">Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alert */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Low Stock Alert</h3>
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <i className="ri-error-warning-line text-yellow-600 text-lg"></i>
            </div>
          </div>
          <div className="space-y-3">
            {lowStockProducts.slice(0, 3).map((product) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-10 h-10 rounded-lg object-cover object-top mr-3"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-yellow-600">{product.quantity} left</p>
                  <p className="text-xs text-gray-500">Min: {product.minStock}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Out of Stock Alert */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Out of Stock</h3>
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <i className="ri-close-circle-line text-red-600 text-lg"></i>
            </div>
          </div>
          <div className="space-y-3">
            {outOfStockProducts.slice(0, 3).map((product) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-10 h-10 rounded-lg object-cover object-top mr-3"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-red-600">Out of Stock</p>
                  <p className="text-xs text-gray-500">Reorder needed</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
