
import { useState } from 'react';
import { useProducts, useProductVariants, useCategories, useOrders, useSuppliers, useCustomers } from '../../../hooks/useDatabase';
// Note: warehouses and locations are infrastructure/configuration data that don't change frequently
// and don't have corresponding database tables yet, so we keep them as mock data for now
import { warehouses, locations } from '../../../mocks/inventory';
import Button from '../../../components/base/Button';
import Input from '../../../components/base/Input';

export default function Reports() {
  // Database hooks for real-time data
  const { products } = useProducts();
  const { variants: productVariants } = useProductVariants();
  const { categories } = useCategories();
  const { orders } = useOrders();
  const { suppliers } = useSuppliers();
  const { customers } = useCustomers();
  
  const [selectedReport, setSelectedReport] = useState('overview');
  const [dateRange, setDateRange] = useState('30');
  const [selectedWarehouse, setSelectedWarehouse] = useState('all');

  const reportTypes = [
    { id: 'overview', label: 'Overview', icon: 'ri-dashboard-line', description: 'Key metrics and performance indicators' },
    { id: 'inventory', label: 'Inventory Analysis', icon: 'ri-box-line', description: 'Stock levels and product performance' },
    { id: 'sales', label: 'Sales Performance', icon: 'ri-line-chart-line', description: 'Revenue and order analytics' },
    { id: 'customers', label: 'Customer Analytics', icon: 'ri-user-line', description: 'Customer behavior and segmentation' },
    { id: 'suppliers', label: 'Supplier Analysis', icon: 'ri-truck-line', description: 'Supplier performance and relationships' },
    { id: 'warehouse', label: 'Warehouse Utilization', icon: 'ri-building-line', description: 'Space usage and efficiency metrics' }
  ];

  const getReportContent = () => {
    switch (selectedReport) {
      case 'overview':
        return <OverviewReport dateRange={dateRange} products={products} productVariants={productVariants} orders={orders} />;
      case 'inventory':
        return <InventoryReport selectedWarehouse={selectedWarehouse} products={products} categories={categories} />;
      case 'sales':
        return <SalesReport dateRange={dateRange} orders={orders} customers={customers} />;
      case 'customers':
        return <CustomerReport dateRange={dateRange} customers={customers} />;
      case 'suppliers':
        return <SupplierReport dateRange={dateRange} suppliers={suppliers} />;
      case 'warehouse':
        return <WarehouseReport selectedWarehouse={selectedWarehouse} />;
      default:
        return <OverviewReport dateRange={dateRange} products={products} productVariants={productVariants} orders={orders} />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
          <p className="text-gray-600">Comprehensive business intelligence and insights</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary">
            <i className="ri-download-line mr-2"></i>
            Export Report
          </Button>
          <Button variant="secondary">
            <i className="ri-printer-line mr-2"></i>
            Print
          </Button>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Report Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTypes.map((report) => (
            <button
              key={report.id}
              onClick={() => setSelectedReport(report.id)}
              className={`p-4 rounded-lg border-2 text-left transition-all cursor-pointer ${
                selectedReport === report.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center mb-2">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                  selectedReport === report.id ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <i className={`${report.icon} text-lg ${
                    selectedReport === report.id ? 'text-blue-600' : 'text-gray-600'
                  }`}></i>
                </div>
                <h4 className={`font-medium ${
                  selectedReport === report.id ? 'text-blue-900' : 'text-gray-900'
                }`}>
                  {report.label}
                </h4>
              </div>
              <p className={`text-sm ${
                selectedReport === report.id ? 'text-blue-700' : 'text-gray-600'
              }`}>
                {report.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 3 months</option>
              <option value="365">Last year</option>
            </select>
          </div>
          
          {(selectedReport === 'inventory' || selectedReport === 'warehouse') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse</label>
              <select
                value={selectedWarehouse}
                onChange={(e) => setSelectedWarehouse(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
              >
                <option value="all">All Warehouses</option>
                {warehouses.map(warehouse => (
                  <option key={warehouse.id} value={warehouse.id.toString()}>{warehouse.name}</option>
                ))}
              </select>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Custom Date From</label>
            <Input type="date" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Custom Date To</label>
            <Input type="date" />
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {getReportContent()}
      </div>
    </div>
  );
}

// Overview Report Component
function OverviewReport({ dateRange, products, productVariants, orders }: any) {
  const totalProducts = products.length + productVariants.length;
  const totalInventoryValue = products.reduce((sum: number, p: any) => sum + (p.price * (p.quantity || 0)), 0) + 
                             productVariants.reduce((sum: number, v: any) => {
                               const product = products.find((p: any) => p.id === v.product_id);
                               const finalPrice = product ? product.price + (v.price_adjustment || 0) : 0;
                               return sum + (finalPrice * (v.stock_quantity || 0));
                             }, 0);
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.total_amount || 0), 0);
  const lowStockItems = products.filter((p: any) => (p.quantity || 0) <= (p.min_stock_level || 0)).length + 
                       productVariants.filter((v: any) => (v.stock_quantity || 0) <= 5).length; // Default min stock for variants
  const outOfStockItems = products.filter((p: any) => (p.quantity || 0) === 0).length + 
                         productVariants.filter((v: any) => (v.stock_quantity || 0) === 0).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Business Overview</h3>
        <span className="text-sm text-gray-600">Last {dateRange} days</span>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blue-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Products</p>
              <p className="text-3xl font-bold text-blue-900">{totalProducts}</p>
              <p className="text-xs text-blue-600">Including variants</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="ri-box-line text-blue-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Inventory Value</p>
              <p className="text-3xl font-bold text-green-900">${totalInventoryValue.toLocaleString()}</p>
              <p className="text-xs text-green-600">Current stock value</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="ri-money-dollar-circle-line text-green-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Total Orders</p>
              <p className="text-3xl font-bold text-purple-900">{totalOrders}</p>
              <p className="text-xs text-purple-600">All time orders</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <i className="ri-shopping-cart-line text-purple-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Total Revenue</p>
              <p className="text-3xl font-bold text-orange-900">${totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-orange-600">From all orders</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <i className="ri-line-chart-line text-orange-600 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Stock Health */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Stock Health Overview</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm font-medium text-gray-900">Healthy Stock</span>
              </div>
              <span className="text-sm font-bold text-green-600">{totalProducts - lowStockItems - outOfStockItems}</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                <span className="text-sm font-medium text-gray-900">Low Stock</span>
              </div>
              <span className="text-sm font-bold text-yellow-600">{lowStockItems}</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                <span className="text-sm font-medium text-gray-900">Out of Stock</span>
              </div>
              <span className="text-sm font-bold text-red-600">{outOfStockItems}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Top Products by Value</h4>
          <div className="space-y-3">
            {products
              .sort((a: any, b: any) => (b.price * b.quantity) - (a.price * a.quantity))
              .slice(0, 5)
              .map((product: any, index: any) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.quantity} units</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-gray-900">${(product.price * product.quantity).toLocaleString()}</span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Warehouse Utilization */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Warehouse Utilization</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {warehouses.map((warehouse) => {
            const utilizationRate = (warehouse.currentStock / warehouse.capacity) * 100;
            return (
              <div key={warehouse.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-gray-900">{warehouse.name}</h5>
                  <span className="text-sm text-gray-600">{utilizationRate.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className={`h-2 rounded-full ${
                      utilizationRate > 90 ? 'bg-red-500' : 
                      utilizationRate > 70 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${utilizationRate}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>{warehouse.currentStock} used</span>
                  <span>{warehouse.capacity} capacity</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Inventory Report Component
function InventoryReport({ selectedWarehouse, products, categories }: any) {
  const filteredProducts = selectedWarehouse === 'all' ? products : 
    products.filter((p: any) => {
      const productLocations = locations.filter((l: any) => l.productSku === p.sku);
      return productLocations.some((l: any) => l.warehouseId.toString() === selectedWarehouse);
    });

  const totalValue = filteredProducts.reduce((sum: any, p: any) => sum + (p.price * p.quantity), 0);
  const lowStockCount = filteredProducts.filter((p: any) => p.quantity <= p.minStock).length;
  const outOfStockCount = filteredProducts.filter((p: any) => p.quantity === 0).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Inventory Analysis</h3>
        <span className="text-sm text-gray-600">
          {selectedWarehouse === 'all' ? 'All Warehouses' : warehouses.find(w => w.id.toString() === selectedWarehouse)?.name}
        </span>
      </div>

      {/* Inventory Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-blue-50 rounded-lg p-6">
          <div className="text-2xl font-bold text-blue-600">{filteredProducts.length}</div>
          <div className="text-sm text-blue-600">Total Products</div>
        </div>
        <div className="bg-green-50 rounded-lg p-6">
          <div className="text-2xl font-bold text-green-600">${totalValue.toLocaleString()}</div>
          <div className="text-sm text-green-600">Total Value</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-6">
          <div className="text-2xl font-bold text-yellow-600">{lowStockCount}</div>
          <div className="text-sm text-yellow-600">Low Stock Items</div>
        </div>
        <div className="bg-red-50 rounded-lg p-6">
          <div className="text-2xl font-bold text-red-600">{outOfStockCount}</div>
          <div className="text-sm text-red-600">Out of Stock</div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Inventory by Category</h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Products</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Quantity</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Value</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categories.map((category: any) => {
                const categoryProducts = filteredProducts.filter((p: any) => p.category === category.name);
                const totalQuantity = categoryProducts.reduce((sum: any, p: any) => sum + p.quantity, 0);
                const categoryValue = categoryProducts.reduce((sum: any, p: any) => sum + (p.price * p.quantity), 0);
                const avgPrice = categoryProducts.length > 0 ? categoryValue / totalQuantity : 0;
                
                return (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{category.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{categoryProducts.length}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{totalQuantity}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">${categoryValue.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">${avgPrice.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Sales Report Component
function SalesReport({ dateRange, orders, customers }: any) {
  const totalRevenue = orders.reduce((sum: any, order: any) => sum + order.total, 0);
  const completedOrders = orders.filter((order: any) => order.status === 'Completed');
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
  const conversionRate = orders.length > 0 ? (completedOrders.length / orders.length) * 100 : 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Sales Performance</h3>
        <span className="text-sm text-gray-600">Last {dateRange} days</span>
      </div>

      {/* Sales Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-green-50 rounded-lg p-6">
          <div className="text-2xl font-bold text-green-600">${totalRevenue.toLocaleString()}</div>
          <div className="text-sm text-green-600">Total Revenue</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-6">
          <div className="text-2xl font-bold text-blue-600">{orders.length}</div>
          <div className="text-sm text-blue-600">Total Orders</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-6">
          <div className="text-2xl font-bold text-purple-600">${avgOrderValue.toFixed(2)}</div>
          <div className="text-sm text-purple-600">Avg Order Value</div>
        </div>
        <div className="bg-orange-50 rounded-lg p-6">
          <div className="text-2xl font-bold text-orange-600">{conversionRate.toFixed(1)}%</div>
          <div className="text-sm text-orange-600">Conversion Rate</div>
        </div>
      </div>

      {/* Order Status Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Orders by Status</h4>
          <div className="space-y-3">
            {['Completed', 'Processing', 'Shipped', 'Pending', 'Cancelled'].map((status) => {
              const statusOrders = orders.filter((order: any) => order.status === status);
              const percentage = orders.length > 0 ? (statusOrders.length / orders.length) * 100 : 0;
              
              return (
                <div key={status} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      status === 'Completed' ? 'bg-green-500' :
                      status === 'Processing' ? 'bg-blue-500' :
                      status === 'Shipped' ? 'bg-purple-500' :
                      status === 'Pending' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <span className="text-sm font-medium text-gray-900">{status}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-900">{statusOrders.length}</div>
                    <div className="text-xs text-gray-500">{percentage.toFixed(1)}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Top Customers by Revenue</h4>
          <div className="space-y-3">
            {customers
              .sort((a: any, b: any) => b.totalValue - a.totalValue)
              .slice(0, 5)
              .map((customer: any, index: any) => (
                <div key={customer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                      <p className="text-xs text-gray-500">{customer.totalOrders} orders</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-gray-900">${customer.totalValue.toLocaleString()}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Customer Report Component
function CustomerReport({ dateRange, customers }: any) {
  const activeCustomers = customers.filter((c: any) => c.status === 'Active').length;
  const totalCustomerValue = customers.reduce((sum: any, c: any) => sum + c.totalValue, 0);
  const avgCustomerValue = customers.length > 0 ? totalCustomerValue / customers.length : 0;
  const retentionRate = customers.length > 0 ? (activeCustomers / customers.length) * 100 : 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Customer Analytics</h3>
        <span className="text-sm text-gray-600">Last {dateRange} days</span>
      </div>

      {/* Customer Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-blue-50 rounded-lg p-6">
          <div className="text-2xl font-bold text-blue-600">{customers.length}</div>
          <div className="text-sm text-blue-600">Total Customers</div>
        </div>
        <div className="bg-green-50 rounded-lg p-6">
          <div className="text-2xl font-bold text-green-600">{activeCustomers}</div>
          <div className="text-sm text-green-600">Active Customers</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-6">
          <div className="text-2xl font-bold text-purple-600">${avgCustomerValue.toFixed(2)}</div>
          <div className="text-sm text-purple-600">Avg Customer Value</div>
        </div>
        <div className="bg-orange-50 rounded-lg p-6">
          <div className="text-2xl font-bold text-orange-600">{retentionRate.toFixed(1)}%</div>
          <div className="text-sm text-orange-600">Retention Rate</div>
        </div>
      </div>

      {/* Customer Segmentation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Customer by Type</h4>
          <div className="space-y-3">
            {['Enterprise', 'SMB', 'Startup'].map((type) => {
              const typeCustomers = customers.filter((c: any) => c.customerType === type);
              const percentage = customers.length > 0 ? (typeCustomers.length / customers.length) * 100 : 0;
              
              return (
                <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-900">{type}</span>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-900">{typeCustomers.length}</div>
                    <div className="text-xs text-gray-500">{percentage.toFixed(1)}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Customer by Industry</h4>
          <div className="space-y-3">
            {['Technology', 'Marketing', 'Healthcare', 'Finance'].map((industry) => {
              const industryCustomers = customers.filter((c: any) => c.industry === industry);
              const percentage = customers.length > 0 ? (industryCustomers.length / customers.length) * 100 : 0;
              
              return (
                <div key={industry} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-900">{industry}</span>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-900">{industryCustomers.length}</div>
                    <div className="text-xs text-gray-500">{percentage.toFixed(1)}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Supplier Report Component
function SupplierReport({ dateRange, suppliers }: any) {
  const activeSuppliers = suppliers.filter((s: any) => s.status === 'Active').length;
  const totalSupplierValue = suppliers.reduce((sum: any, s: any) => sum + s.totalValue, 0);
  const avgSupplierValue = suppliers.length > 0 ? totalSupplierValue / suppliers.length : 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Supplier Analysis</h3>
        <span className="text-sm text-gray-600">Last {dateRange} days</span>
      </div>

      {/* Supplier Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-blue-50 rounded-lg p-6">
          <div className="text-2xl font-bold text-blue-600">{suppliers.length}</div>
          <div className="text-sm text-blue-600">Total Suppliers</div>
        </div>
        <div className="bg-green-50 rounded-lg p-6">
          <div className="text-2xl font-bold text-green-600">{activeSuppliers}</div>
          <div className="text-sm text-green-600">Active Suppliers</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-6">
          <div className="text-2xl font-bold text-purple-600">${totalSupplierValue.toLocaleString()}</div>
          <div className="text-sm text-purple-600">Total Value</div>
        </div>
        <div className="bg-orange-50 rounded-lg p-6">
          <div className="text-2xl font-bold text-orange-600">${avgSupplierValue.toFixed(2)}</div>
          <div className="text-sm text-orange-600">Avg Supplier Value</div>
        </div>
      </div>

      {/* Top Suppliers */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Top Suppliers by Value</h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Value</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {suppliers
                .sort((a: any, b: any) => b.totalValue - a.totalValue)
                .slice(0, 10)
                .map((supplier: any) => (
                  <tr key={supplier.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{supplier.name}</div>
                        <div className="text-xs text-gray-500">{supplier.contactPerson}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{supplier.category}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{supplier.totalOrders}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">${supplier.totalValue.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        supplier.status === 'Active' ? 'bg-green-100 text-green-800' :
                        supplier.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {supplier.status}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Warehouse Report Component
function WarehouseReport({ selectedWarehouse }: any) {
  const filteredWarehouses = selectedWarehouse === 'all' ? warehouses : 
    warehouses.filter(w => w.id.toString() === selectedWarehouse);

  const totalCapacity = filteredWarehouses.reduce((sum, w) => sum + w.capacity, 0);
  const totalUsed = filteredWarehouses.reduce((sum, w) => sum + w.currentStock, 0);
  const utilizationRate = totalCapacity > 0 ? (totalUsed / totalCapacity) * 100 : 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Warehouse Utilization</h3>
        <span className="text-sm text-gray-600">
          {selectedWarehouse === 'all' ? 'All Warehouses' : warehouses.find(w => w.id.toString() === selectedWarehouse)?.name}
        </span>
      </div>

      {/* Warehouse Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-blue-50 rounded-lg p-6">
          <div className="text-2xl font-bold text-blue-600">{filteredWarehouses.length}</div>
          <div className="text-sm text-blue-600">Total Warehouses</div>
        </div>
        <div className="bg-green-50 rounded-lg p-6">
          <div className="text-2xl font-bold text-green-600">{totalCapacity.toLocaleString()}</div>
          <div className="text-sm text-green-600">Total Capacity</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-6">
          <div className="text-2xl font-bold text-purple-600">{totalUsed.toLocaleString()}</div>
          <div className="text-sm text-purple-600">Space Used</div>
        </div>
        <div className="bg-orange-50 rounded-lg p-6">
          <div className="text-2xl font-bold text-orange-600">{utilizationRate.toFixed(1)}%</div>
          <div className="text-sm text-orange-600">Utilization Rate</div>
        </div>
      </div>

      {/* Warehouse Details */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Warehouse Performance</h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Warehouse</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacity</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Used</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilization</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredWarehouses.map((warehouse) => {
                const utilization = (warehouse.currentStock / warehouse.capacity) * 100;
                return (
                  <tr key={warehouse.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{warehouse.name}</div>
                        <div className="text-xs text-gray-500">{warehouse.manager}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{warehouse.type}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{warehouse.capacity.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{warehouse.currentStock.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${
                              utilization > 90 ? 'bg-red-500' : 
                              utilization > 70 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${utilization}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600">{utilization.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        warehouse.status === 'Active' ? 'bg-green-100 text-green-800' :
                        warehouse.status === 'Maintenance' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {warehouse.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
