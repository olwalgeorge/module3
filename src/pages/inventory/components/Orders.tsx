
import { useState } from 'react';
import { useOrders, useProducts, useProductVariants } from '../../../hooks/useDatabase';
import { warehouses, locations } from '../../../mocks/inventory';
import { useCurrency } from '../../../hooks/useCurrency';
import Button from '../../../components/base/Button';
import Input from '../../../components/base/Input';
import Modal from '../../../components/base/Modal';

interface OrderItem {
  productName: string;
  variantId?: number;
  variantName?: string;
  quantity: number;
  price: number;
  warehouseId?: number;
  locationId?: number;
}

interface NewOrder {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  status: string;
  items: OrderItem[];
}

export default function Orders() {
  // Database hooks for real-time data
  const { orders, loading: ordersLoading } = useOrders();
  const { products } = useProducts();
  const { variants: productVariants } = useProductVariants();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedWarehouse, setSelectedWarehouse] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [newOrder, setNewOrder] = useState<NewOrder>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
    status: 'Pending',
    items: [{ productName: '', quantity: 1, price: 0 }]
  });

  const { formatCurrency, convertCurrency, displayCurrency, availableCurrencies } = useCurrency();

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.order_number.toString().includes(searchTerm);
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    
    // Filter by warehouse if selected
    let matchesWarehouse = true;
    if (selectedWarehouse !== 'all') {
      // Check if any order items are from the selected warehouse
      matchesWarehouse = order.items.some((item: any) => {
        const productLocations = locations.filter(l => l.productName === item.productName);
        return productLocations.some(l => l.warehouseId.toString() === selectedWarehouse);
      });
    }
    
    return matchesSearch && matchesStatus && matchesWarehouse;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return 'ri-check-line';
      case 'Processing': return 'ri-time-line';
      case 'Shipped': return 'ri-truck-line';
      case 'Cancelled': return 'ri-close-line';
      case 'Pending': return 'ri-pause-line';
      default: return 'ri-file-list-line';
    }
  };

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  const handleEditOrder = (order: any) => {
    setSelectedOrder(order);
    setNewOrder({
      customerName: order.customerName,
      customerEmail: order.customerEmail || '',
      customerPhone: order.customerPhone || '',
      shippingAddress: order.shippingAddress || '',
      status: order.status,
      items: order.items
    });
    setIsEditModalOpen(true);
  };

  const addOrderItem = () => {
    setNewOrder(prev => ({
      ...prev,
      items: [...prev.items, { productName: '', quantity: 1, price: 0 }]
    }));
  };

  const removeOrderItem = (index: number) => {
    setNewOrder(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateOrderItem = (index: number, field: keyof OrderItem, value: any) => {
    setNewOrder(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleProductSelect = (index: number, productName: string) => {
    const product = products.find(p => p.name === productName);
    if (product) {
      updateOrderItem(index, 'productName', productName);
      updateOrderItem(index, 'price', product.price);
      // Clear variant and location selection when product changes
      updateOrderItem(index, 'variantId', undefined);
      updateOrderItem(index, 'variantName', undefined);
      updateOrderItem(index, 'warehouseId', undefined);
      updateOrderItem(index, 'locationId', undefined);
    }
  };

  const handleVariantSelect = (index: number, variantId: number) => {
    const variant = productVariants.find(v => v.id === variantId);
    if (variant) {
      updateOrderItem(index, 'variantId', variantId);
      updateOrderItem(index, 'variantName', `${variant.variant_name}: ${variant.variant_value}`);
      // Calculate price with adjustment from base product price
      const product = products.find(p => p.id === variant.product_id);
      const finalPrice = product ? product.price + (variant.price_adjustment || 0) : variant.price_adjustment || 0;
      updateOrderItem(index, 'price', finalPrice);
      // Clear location selection when variant changes
      updateOrderItem(index, 'warehouseId', undefined);
      updateOrderItem(index, 'locationId', undefined);
    }
  };

  const handleWarehouseSelect = (index: number, warehouseId: number) => {
    updateOrderItem(index, 'warehouseId', warehouseId);
    // Clear location selection when warehouse changes
    updateOrderItem(index, 'locationId', undefined);
  };

  const getProductVariants = (productName: string) => {
    const product = products.find(p => p.name === productName);
    return product ? productVariants.filter(variant => variant.product_id === product.id) : [];
  };

  const getAvailableLocations = (productName: string, variantId?: number) => {
    if (variantId) {
      const variant = productVariants.find(v => v.id === variantId);
      if (variant) {
        // For variants, we need to construct the full SKU (base product SKU + variant suffix)
        const product = products.find(p => p.id === variant.product_id);
        const fullSku = product ? `${product.sku}${variant.sku_suffix || ''}` : variant.sku_suffix;
        return locations.filter(l => l.productSku === fullSku && l.currentStock > 0);
      }
    }
    return locations.filter(l => l.productName === productName && l.currentStock > 0);
  };

  const getWarehouseLocations = (warehouseId: number, productName: string, variantId?: number) => {
    const availableLocations = getAvailableLocations(productName, variantId);
    return availableLocations.filter(l => l.warehouseId === warehouseId);
  };

  const calculateOrderTotal = () => {
    return newOrder.items.reduce((total, item) => total + (item.quantity * item.price), 0);
  };

  const resetForm = () => {
    setNewOrder({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      shippingAddress: '',
      status: 'Pending',
      items: [{ productName: '', quantity: 1, price: 0 }]
    });
  };

  const handleCreateOrder = () => {
    console.log('Creating order:', newOrder);
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleUpdateOrder = () => {
    console.log('Updating order:', selectedOrder?.id, newOrder);
    setIsEditModalOpen(false);
    resetForm();
    setSelectedOrder(null);
  };

  // Loading state
  if (ordersLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
            <p className="text-gray-600">Loading orders...</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Loading orders from database...</span>
        </div>
      </div>
    );
  }

  const handlePrintInvoice = (order: any) => {
    console.log('Printing invoice for order:', order.order_number);
  };

  // Calculate statistics with currency conversion
  const totalOrders = orders.length;
  const completedOrders = orders.filter(order => order.status === 'completed').length;
  const processingOrders = orders.filter(order => order.status === 'processing' || order.status === 'pending').length;
  const totalRevenue = orders.reduce((sum, order) => {
    return sum + (order.total_amount || 0);
  }, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="ri-shopping-cart-line text-blue-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{completedOrders}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="ri-check-line text-green-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Processing</p>
              <p className="text-2xl font-bold text-blue-600">{processingOrders}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="ri-time-line text-blue-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-purple-600">{formatCurrency(totalRevenue)}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <i className="ri-money-dollar-circle-line text-purple-600 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
          <p className="text-gray-600">Track and manage customer orders with multi-currency support</p>
        </div>
        <div className="flex items-center space-x-3">
          <div>
            <select
              value={displayCurrency}
              onChange={() => {/* Handle currency change */}}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
            >
              {availableCurrencies.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <i className="ri-add-line mr-2"></i>
            New Order
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Search orders or customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <select
              value={selectedWarehouse}
              onChange={(e) => setSelectedWarehouse(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
            >
              <option value="all">All Warehouses</option>
              {warehouses.map(warehouse => (
                <option key={warehouse.id} value={warehouse.id.toString()}>{warehouse.name}</option>
              ))}
            </select>
          </div>
          
          <Button variant="secondary">
            <i className="ri-download-line mr-2"></i>
            Export Orders
          </Button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Warehouses</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Currency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => {
                const orderWarehouses = new Set();
                order.items.forEach((item: any) => {
                  const itemLocations = locations.filter(l => l.productName === item.productName);
                  itemLocations.forEach(l => {
                    const warehouse = warehouses.find(w => w.id === l.warehouseId);
                    if (warehouse) orderWarehouses.add(warehouse.name);
                  });
                });
                
                const convertedTotal = convertCurrency(order.total, order.currency, displayCurrency);
                
                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">#{order.order_number}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white text-sm font-medium">
                            {order.customer_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{order.customer_name}</div>
                          <div className="text-sm text-gray-500">{order.customer_email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">Order Items</div>
                      <div className="text-sm text-gray-500">
                        {formatCurrency(order.total_amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {orderWarehouses.size} warehouse{orderWarehouses.size !== 1 ? 's' : ''}
                      </div>
                      <div className="text-sm text-gray-500">
                        {Array.from(orderWarehouses).slice(0, 2).join(', ')}
                        {orderWarehouses.size > 2 && ` +${orderWarehouses.size - 2} more`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{formatCurrency(convertedTotal)}</div>
                      {order.currency !== displayCurrency && (
                        <div className="text-xs text-gray-500">
                          {formatCurrency(order.total, order.currency)} {order.currency}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {order.currency}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        <i className={`${getStatusIcon(order.status)} mr-1`}></i>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(order.deliveryDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewOrder(order)}
                          className="w-8 h-8 flex items-center justify-center text-blue-600 hover:text-blue-900 cursor-pointer"
                          title="View Order"
                        >
                          <i className="ri-eye-line"></i>
                        </button>
                        <button 
                          onClick={() => handleEditOrder(order)}
                          className="w-8 h-8 flex items-center justify-center text-green-600 hover:text-green-900 cursor-pointer"
                          title="Edit Order"
                        >
                          <i className="ri-edit-line"></i>
                        </button>
                        <button 
                          onClick={() => handlePrintInvoice(order)}
                          className="w-8 h-8 flex items-center justify-center text-purple-600 hover:text-purple-900 cursor-pointer"
                          title="Print Invoice"
                        >
                          <i className="ri-printer-line"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Order Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          resetForm();
        }}
        title="Create New Order"
        size="xl"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Customer Name" 
              placeholder="Enter customer name"
              value={newOrder.customerName}
              onChange={(e) => setNewOrder(prev => ({ ...prev, customerName: e.target.value }))}
            />
            <Input 
              label="Customer Email" 
              type="email" 
              placeholder="customer@example.com"
              value={newOrder.customerEmail}
              onChange={(e) => setNewOrder(prev => ({ ...prev, customerEmail: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Phone Number" 
              placeholder="+1 (555) 123-4567"
              value={newOrder.customerPhone}
              onChange={(e) => setNewOrder(prev => ({ ...prev, customerPhone: e.target.value }))}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order Status</label>
              <select 
                value={newOrder.status}
                onChange={(e) => setNewOrder(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address</label>
            <textarea 
              value={newOrder.shippingAddress}
              onChange={(e) => setNewOrder(prev => ({ ...prev, shippingAddress: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Enter shipping address"
            />
          </div>
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Order Items</h4>
            <div className="space-y-4">
              {newOrder.items.map((item, index) => {
                const selectedProductVariants = getProductVariants(item.productName);
                const availableLocations = getAvailableLocations(item.productName, item.variantId);
                const warehouseLocations = item.warehouseId ? getWarehouseLocations(item.warehouseId, item.productName, item.variantId) : [];
                
                return (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Product</label>
                        <select 
                          value={item.productName}
                          onChange={(e) => handleProductSelect(index, e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                        >
                          <option value="">Select Product</option>
                          {products.map(product => (
                            <option key={product.id} value={product.name}>{product.name}</option>
                          ))}
                        </select>
                      </div>
                      
                      {selectedProductVariants.length > 0 && (
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Variant</label>
                          <select 
                            value={item.variantId || ''}
                            onChange={(e) => handleVariantSelect(index, parseInt(e.target.value))}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                          >
                            <option value="">Select Variant</option>
                            {selectedProductVariants.map(variant => {
                              const product = products.find(p => p.id === variant.product_id);
                              const finalPrice = product ? product.price + (variant.price_adjustment || 0) : variant.price_adjustment || 0;
                              return (
                                <option key={variant.id} value={variant.id}>
                                  {variant.variant_name}: {variant.variant_value} - ${finalPrice.toFixed(2)}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      )}
                    </div>

                    {/* Warehouse and Location Selection */}
                    {item.productName && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Warehouse</label>
                          <select 
                            value={item.warehouseId || ''}
                            onChange={(e) => handleWarehouseSelect(index, parseInt(e.target.value))}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                          >
                            <option value="">Select Warehouse</option>
                            {warehouses
                              .filter(w => availableLocations.some(l => l.warehouseId === w.id))
                              .map(warehouse => (
                                <option key={warehouse.id} value={warehouse.id}>
                                  {warehouse.name}
                                </option>
                              ))}
                          </select>
                        </div>
                        
                        {item.warehouseId && (
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
                            <select 
                              value={item.locationId || ''}
                              onChange={(e) => updateOrderItem(index, 'locationId', parseInt(e.target.value))}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                            >
                              <option value="">Select Location</option>
                              {warehouseLocations.map(location => (
                                <option key={location.id} value={location.id}>
                                  {location.locationCode} (Stock: {location.currentStock})
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-3">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Quantity</label>
                        <Input 
                          type="number" 
                          placeholder="Qty" 
                          value={item.quantity}
                          onChange={(e) => updateOrderItem(index, 'quantity', parseInt(e.target.value) || 1)}
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Price</label>
                        <Input 
                          placeholder="Price" 
                          value={item.price}
                          onChange={(e) => updateOrderItem(index, 'price', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      {newOrder.items.length > 1 && (
                        <div className="pt-6">
                          <button 
                            onClick={() => removeOrderItem(index)}
                            className="w-8 h-8 flex items-center justify-center text-red-600 hover:text-red-900 cursor-pointer"
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {/* Item Summary */}
                    {(item.variantName || item.locationId) && (
                      <div className="mt-3 p-2 bg-blue-50 rounded-md">
                        <div className="text-xs text-blue-700 space-y-1">
                          {item.variantName && <p>Variant: {item.variantName}</p>}
                          {item.locationId && (
                            <p>Location: {locations.find(l => l.id === item.locationId)?.locationCode} - {warehouses.find(w => w.id === item.warehouseId)?.name}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <Button variant="secondary" className="mt-3" onClick={addOrderItem}>
              <i className="ri-add-line mr-2"></i>
              Add Item
            </Button>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">Order Total:</span>
                <span className="text-lg font-bold text-gray-900">${calculateOrderTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => {
              setIsAddModalOpen(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button onClick={handleCreateOrder}>
              Create Order
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Order Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          resetForm();
          setSelectedOrder(null);
        }}
        title={`Edit Order #${selectedOrder?.id}`}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Customer Name" 
              placeholder="Enter customer name"
              value={newOrder.customerName}
              onChange={(e) => setNewOrder(prev => ({ ...prev, customerName: e.target.value }))}
            />
            <Input 
              label="Customer Email" 
              type="email" 
              placeholder="customer@example.com"
              value={newOrder.customerEmail}
              onChange={(e) => setNewOrder(prev => ({ ...prev, customerEmail: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Phone Number" 
              placeholder="+1 (555) 123-4567"
              value={newOrder.customerPhone}
              onChange={(e) => setNewOrder(prev => ({ ...prev, customerPhone: e.target.value }))}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order Status</label>
              <select 
                value={newOrder.status}
                onChange={(e) => setNewOrder(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address</label>
            <textarea 
              value={newOrder.shippingAddress}
              onChange={(e) => setNewOrder(prev => ({ ...prev, shippingAddress: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Enter shipping address"
            />
          </div>
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Order Items</h4>
            <div className="space-y-3">
              {newOrder.items.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <select 
                    value={item.productName}
                    onChange={(e) => handleProductSelect(index, e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                  >
                    <option value="">Select Product</option>
                    {products.map(product => (
                      <option key={product.id} value={product.name}>{product.name}</option>
                    ))}
                  </select>
                  <Input 
                    type="number" 
                    placeholder="Qty" 
                    className="w-20"
                    value={item.quantity}
                    onChange={(e) => updateOrderItem(index, 'quantity', parseInt(e.target.value) || 1)}
                  />
                  <Input 
                    placeholder="Price" 
                    className="w-24"
                    value={item.price}
                    onChange={(e) => updateOrderItem(index, 'price', parseFloat(e.target.value) || 0)}
                  />
                  {newOrder.items.length > 1 && (
                    <button 
                      onClick={() => removeOrderItem(index)}
                      className="w-8 h-8 flex items-center justify-center text-red-600 hover:text-red-900 cursor-pointer"
                    >
                      <i className="ri-delete-bin-line"></i>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <Button variant="secondary" className="mt-3" onClick={addOrderItem}>
              <i className="ri-add-line mr-2"></i>
              Add Item
            </Button>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">Order Total:</span>
                <span className="text-lg font-bold text-gray-900">${calculateOrderTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => {
              setIsEditModalOpen(false);
              resetForm();
              setSelectedOrder(null);
            }}>
              Cancel
            </Button>
            <Button onClick={handleUpdateOrder}>
              Update Order
            </Button>
          </div>
        </div>
      </Modal>

      {/* View Order Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={`Order #${selectedOrder?.id}`}
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Order Header */}
            <div className="flex items-center justify-between pb-4 border-b">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Order Details</h3>
                <p className="text-sm text-gray-600">Created on {new Date(selectedOrder.orderDate).toLocaleDateString()}</p>
              </div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                <i className={`${getStatusIcon(selectedOrder.status)} mr-1`}></i>
                {selectedOrder.status}
              </span>
            </div>

            {/* Customer Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Customer Information</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium text-gray-900">{selectedOrder.customerName}</p>
                  <p className="text-sm text-gray-600">Customer ID: #{selectedOrder.id}</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Delivery Information</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Expected Delivery</p>
                  <p className="font-medium text-gray-900">{new Date(selectedOrder.deliveryDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Order Items</h4>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedOrder.items.map((item: any, index: number) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.productName}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.quantity}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">${item.price}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">${(item.quantity * item.price).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Order Total */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Order Total</span>
                <span className="text-2xl font-bold text-gray-900">${selectedOrder.total.toLocaleString()}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="secondary" onClick={() => handlePrintInvoice(selectedOrder)}>
                <i className="ri-printer-line mr-2"></i>
                Print Invoice
              </Button>
              <Button onClick={() => {
                setIsViewModalOpen(false);
                handleEditOrder(selectedOrder);
              }}>
                <i className="ri-edit-line mr-2"></i>
                Edit Order
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
