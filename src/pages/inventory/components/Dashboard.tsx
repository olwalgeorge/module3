
import { useProducts, useUsers, useRoles, useDepartments } from '../../../hooks/useDatabase';

export default function Dashboard() {
  // Get real-time data from actual database tables
  const { products, loading: productsLoading, error: productsError } = useProducts();
  const { users, loading: usersLoading, error: usersError } = useUsers();
  const { roles, loading: rolesLoading } = useRoles();
  const { departments, loading: departmentsLoading } = useDepartments();

  // Calculate ALL statistics from real database data - no fallbacks to mock data
  const isDataLoading = productsLoading || usersLoading || rolesLoading || departmentsLoading;
  // Remove unused hasDataErrors since we now calculate everything from real data
  // All statistics come directly from database arrays - no error fallbacks needed

  // Debug logging - show real data vs mock
  console.log('Dashboard Real Data:', {
    products: products?.length || 0,
    users: users?.length || 0,
    roles: roles?.length || 0,
    departments: departments?.length || 0,
    productsError,
    usersError,
    isDataLoading
  });

  // Navigation handler for quick actions
  const onNavigate = (section: string) => {
    console.log(`Navigate to ${section}`);
    // TODO: Implement navigation logic or integrate with router
  };

  // Calculate dynamic product alerts from database - FIXED FIELD NAMES
  const lowStockProducts = products?.filter(p => {
    const minStock = p.min_stock_level || 0;  // Database uses min_stock_level
    const currentStock = p.quantity || 0;
    return currentStock <= minStock && currentStock > 0;
  }) || [];
  
  const outOfStockProducts = products?.filter(p => (p.quantity || 0) === 0) || [];

  // Calculate user management statistics
  const activeUsers = users?.filter((user: any) => user.status === 'active').length || 0;
  const totalUsers = users?.length || 0;
  const newUsersThisMonth = users?.filter((user: any) => {
    if (!user.created_at) return false;
    const createdAt = new Date(user.created_at);
    const now = new Date();
    return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear();
  }).length || 0;

  // Calculate ALL statistics from real database data - NO MOCK DATA
  const calculatedStats = {
    total_products: products?.length || 0,
    low_stock_items: lowStockProducts.length,
    out_of_stock_items: outOfStockProducts.length,
    total_inventory_value: products?.reduce((sum, p) => sum + ((p.price || 0) * (p.quantity || 0)), 0) || 0,
    // Note: Orders data would need to be added via useOrders hook when available
    monthly_orders: 0, // TODO: Implement when orders table is connected
    pending_orders: 0   // TODO: Implement when orders table is connected
  };

  // Always use calculated stats from real database - no fallbacks to mock data
  const displayStats = calculatedStats;

  const statsConfig = [
    {
      title: 'Total Products',
      value: displayStats.total_products,
      icon: 'ri-box-3-line',
      color: 'bg-blue-500',
      change: `${products?.length > 0 ? 'Real-time' : 'Cached'}`,
      loading: productsLoading
    },
    {
      title: 'Low Stock Items',
      value: displayStats.low_stock_items,
      icon: 'ri-error-warning-line',
      color: 'bg-yellow-500',
      change: `${lowStockProducts.length > 0 ? lowStockProducts.length + ' critical' : 'All good'}`,
      loading: productsLoading
    },
    {
      title: 'Out of Stock',
      value: displayStats.out_of_stock_items,
      icon: 'ri-close-circle-line',
      color: 'bg-red-500',
      change: `${outOfStockProducts.length > 0 ? 'Requires attention' : 'All stocked'}`,
      loading: productsLoading
    },
    {
      title: 'Total Value',
      value: `$${Number(displayStats.total_inventory_value || 0).toLocaleString()}`,
      icon: 'ri-money-dollar-circle-line',
      color: 'bg-green-500',
      change: `${products?.length > 0 ? 'Calculated' : 'Estimated'}`,
      loading: productsLoading
    },
    {
      title: 'Active Users',
      value: activeUsers,
      icon: 'ri-user-check-line',
      color: 'bg-indigo-500',
      change: newUsersThisMonth > 0 ? `+${newUsersThisMonth} this month` : 'No new users',
      loading: usersLoading
    },
    {
      title: 'Total Users',
      value: totalUsers,
      icon: 'ri-team-line',
      color: 'bg-purple-500',
      change: `${roles?.length || 0} roles available`,
      loading: usersLoading
    },
    {
      title: 'Departments',
      value: departments?.length || 0,
      icon: 'ri-building-line',
      color: 'bg-teal-500',
      change: departments?.length > 0 ? 'Active departments' : 'Setup needed',
      loading: usersLoading
    },
    {
      title: 'Monthly Orders',
      value: displayStats.monthly_orders,
      icon: 'ri-shopping-cart-line',
      color: 'bg-orange-500',
      change: displayStats.pending_orders > 0 ? `${displayStats.pending_orders} pending` : 'All processed',
      loading: false // No orders data connected yet
    }
  ];

  return (
    <div className="p-6 space-y-6">
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
                    <p className="text-xs text-gray-600 mt-1">{stat.change}</p>
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
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
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
            onClick={() => onNavigate('users')}
            className="flex flex-col items-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors cursor-pointer"
          >
            <i className="ri-user-add-line text-2xl text-indigo-600 mb-2"></i>
            <span className="text-sm font-medium text-indigo-900">Add User</span>
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

      {/* Alerts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                  <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center mr-3">
                    <i className="ri-box-line text-yellow-600 text-lg"></i>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-yellow-600">{product.quantity || 0} left</p>
                  <p className="text-xs text-gray-500">Min: {product.min_stock_level || 0}</p>
                </div>
              </div>
            ))}
            {lowStockProducts.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                <i className="ri-check-line text-green-500 text-2xl mb-2"></i>
                <p className="text-sm">All products well stocked!</p>
              </div>
            )}
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
                  <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center mr-3">
                    <i className="ri-close-circle-line text-red-600 text-lg"></i>
                  </div>
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
            {outOfStockProducts.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                <i className="ri-check-line text-green-500 text-2xl mb-2"></i>
                <p className="text-sm">No stock-outs detected!</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent User Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
              <i className="ri-team-line text-indigo-600 text-lg"></i>
            </div>
          </div>
          <div className="space-y-3">
            {users?.slice(0, 3).map((user: any) => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                    <span className="text-indigo-600 font-medium text-sm">
                      {user.full_name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user.full_name || 'Unknown User'}</p>
                    <p className="text-sm text-gray-500">{user.role?.name || 'No Role'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${user.status === 'active' ? 'text-green-600' : 'text-gray-600'}`}>
                    {user.status === 'active' ? 'Active' : 'Inactive'}
                  </p>
                  <p className="text-xs text-gray-500">{user.department?.name || 'No Dept'}</p>
                </div>
              </div>
            ))}
            {(!users || users.length === 0) && (
              <div className="text-center py-4 text-gray-500">
                {usersLoading ? (
                  <>
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
                    </div>
                  </>
                ) : (
                  <>
                    <i className="ri-user-add-line text-gray-400 text-2xl mb-2"></i>
                    <p className="text-sm">No users found</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
