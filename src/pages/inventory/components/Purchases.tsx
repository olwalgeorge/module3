
import { useState } from 'react';
import { purchases, suppliers, warehouses, locations, products } from '../../../mocks/inventory';
import { useCurrency } from '../../../hooks/useCurrency';
import Button from '../../../components/base/Button';
import Input from '../../../components/base/Input';
import Modal from '../../../components/base/Modal';

interface PurchaseItem {
  productName: string;
  sku: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  locationId?: number;
  locationCode?: string;
}

interface NewPurchase {
  supplierId: number;
  supplierName: string;
  warehouseId: number;
  warehouseName: string;
  expectedDelivery: string;
  items: PurchaseItem[];
  notes: string;
  paymentMethod: string;
}

export default function Purchases() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSupplier, setSelectedSupplier] = useState('all');
  const [selectedWarehouse, setSelectedWarehouse] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<any>(null);
  const [newPurchase, setNewPurchase] = useState<NewPurchase>({
    supplierId: 0,
    supplierName: '',
    warehouseId: 0,
    warehouseName: '',
    expectedDelivery: '',
    items: [{ productName: '', sku: '', quantity: 1, unitCost: 0, totalCost: 0 }],
    notes: '',
    paymentMethod: 'Bank Transfer'
  });

  const { formatCurrency, convertCurrency, displayCurrency, availableCurrencies } = useCurrency();

  const filteredPurchases = purchases.filter(purchase => {
    const matchesSearch = purchase.purchaseOrderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         purchase.supplierName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || purchase.status === selectedStatus;
    const matchesSupplier = selectedSupplier === 'all' || purchase.supplierId.toString() === selectedSupplier;
    const matchesWarehouse = selectedWarehouse === 'all' || purchase.warehouseId.toString() === selectedWarehouse;
    
    return matchesSearch && matchesStatus && matchesSupplier && matchesWarehouse;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Partially Received': return 'bg-orange-100 text-orange-800';
      case 'Pending Approval': return 'bg-purple-100 text-purple-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered': return 'ri-check-line';
      case 'Shipped': return 'ri-truck-line';
      case 'Processing': return 'ri-time-line';
      case 'Partially Received': return 'ri-inbox-line';
      case 'Pending Approval': return 'ri-pause-line';
      case 'Cancelled': return 'ri-close-line';
      default: return 'ri-file-list-line';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Partially Paid': return 'bg-yellow-100 text-yellow-800';
      case 'Pending': return 'bg-orange-100 text-orange-800';
      case 'Refunded': return 'bg-blue-100 text-blue-800';
      case 'Not Paid': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewPurchase = (purchase: any) => {
    setSelectedPurchase(purchase);
    setIsViewModalOpen(true);
  };

  const handleEditPurchase = (purchase: any) => {
    console.log('Edit purchase', purchase);
    // Placeholder for edit functionality
  };

  const handleReceiveItems = (purchase: any) => {
    setSelectedPurchase(purchase);
    setIsReceiveModalOpen(true);
  };

  const addPurchaseItem = () => {
    setNewPurchase(prev => ({
      ...prev,
      items: [...prev.items, { productName: '', sku: '', quantity: 1, unitCost: 0, totalCost: 0 }]
    }));
  };

  const removePurchaseItem = (index: number) => {
    setNewPurchase(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updatePurchaseItem = (index: number, field: keyof PurchaseItem, value: any) => {
    setNewPurchase(prev => ({
      ...prev,
      items: prev.items.map((item, i) => {
        if (i === index) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'quantity' || field === 'unitCost') {
            updatedItem.totalCost = updatedItem.quantity * updatedItem.unitCost;
          }
          return updatedItem;
        }
        return item;
      })
    }));
  };

  const handleProductSelect = (index: number, productName: string) => {
    const product = products.find(p => p.name === productName);
    if (product) {
      updatePurchaseItem(index, 'productName', productName);
      updatePurchaseItem(index, 'sku', product.sku);
      updatePurchaseItem(index, 'unitCost', product.cost || 0);
    }
  };

  const handleSupplierSelect = (supplierId: number) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    if (supplier) {
      setNewPurchase(prev => ({
        ...prev,
        supplierId,
        supplierName: supplier.name
      }));
    }
  };

  const handleWarehouseSelect = (warehouseId: number) => {
    const warehouse = warehouses.find(w => w.id === warehouseId);
    if (warehouse) {
      setNewPurchase(prev => ({
        ...prev,
        warehouseId,
        warehouseName: warehouse.name
      }));
    }
  };

  const getWarehouseLocations = (warehouseId: number) => {
    return locations.filter(l => l.warehouseId === warehouseId && l.status === 'Active');
  };

  const calculatePurchaseTotal = () => {
    const subtotal = newPurchase.items.reduce((sum, item) => sum + item.totalCost, 0);
    const tax = subtotal * 0.08;
    const shipping = subtotal > 5000 ? 0 : 50;
    return { subtotal, tax, shipping, total: subtotal + tax + shipping };
  };

  const resetForm = () => {
    setNewPurchase({
      supplierId: 0,
      supplierName: '',
      warehouseId: 0,
      warehouseName: '',
      expectedDelivery: '',
      items: [{ productName: '', sku: '', quantity: 1, unitCost: 0, totalCost: 0 }],
      notes: '',
      paymentMethod: 'Bank Transfer'
    });
  };

  const handleCreatePurchase = () => {
    console.log('Creating purchase order:', newPurchase);
    setIsAddModalOpen(false);
    resetForm();
  };

  // Calculate statistics with currency conversion
  const totalPurchases = purchases.length;
  const pendingPurchases = purchases.filter(purchase => purchase.status === 'Pending Approval').length;
  const totalValue = purchases.reduce((sum, purchase) => {
    const convertedAmount = convertCurrency(purchase.total, purchase.currency, displayCurrency);
    return sum + convertedAmount;
  }, 0);
  const pendingPayments = purchases.filter(purchase => purchase.paymentStatus === 'Pending').length;

  return (
    <div className="p-6 space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Purchase Orders</p>
              <p className="text-2xl font-bold text-gray-900">{totalPurchases}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="ri-shopping-bag-3-line text-blue-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold text-orange-600">{pendingPurchases}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <i className="ri-time-line text-orange-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalValue)}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="ri-money-dollar-circle-line text-green-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Payments</p>
              <p className="text-2xl font-bold text-red-600">{pendingPayments}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <i className="ri-alert-line text-red-600 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Purchase Orders</h2>
          <p className="text-gray-600">Manage purchase orders with multi-currency support and warehouse integration</p>
        </div>
        <div className="flex items-center space-x-3">
          <div>
            <select
              value={displayCurrency}
              onChange={(e) => {/* Handle currency change */}}
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
            New Purchase Order
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Input
            placeholder="Search purchase orders..."
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
              <option value="Pending Approval">Pending Approval</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Partially Received">Partially Received</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <select
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
            >
              <option value="all">All Suppliers</option>
              {suppliers.map(supplier => (
                <option key={supplier.id} value={supplier.id.toString()}>{supplier.name}</option>
              ))}
            </select>
          </div>

          <div>
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
          
          <Button variant="secondary">
            <i className="ri-download-line mr-2"></i>
            Export
          </Button>
        </div>
      </div>

      {/* Purchases Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PO Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Warehouse</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Currency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expected</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPurchases.map((purchase) => {
                const convertedTotal = convertCurrency(purchase.total, purchase.currency, displayCurrency);
                
                return (
                  <tr key={purchase.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{purchase.purchaseOrderNumber}</div>
                      <div className="text-sm text-gray-500">#{purchase.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white text-sm font-medium">
                            {purchase.supplierName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{purchase.supplierName}</div>
                          <div className="text-sm text-gray-500">Supplier</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{purchase.items.length} items</div>
                      <div className="text-sm text-gray-500">
                        {purchase.items[0].productName}
                        {purchase.items.length > 1 && ` +${purchase.items.length - 1} more`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{purchase.warehouseName}</div>
                      <div className="text-sm text-gray-500">Delivery location</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{formatCurrency(convertedTotal)}</div>
                      {purchase.currency !== displayCurrency && (
                        <div className="text-xs text-gray-500">
                          {formatCurrency(purchase.total, purchase.currency)} {purchase.currency}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                        {purchase.currency}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(purchase.status)}`}>
                        <i className={`${getStatusIcon(purchase.status)} mr-1`}></i>
                        {purchase.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(purchase.paymentStatus)}`}>
                        {purchase.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(purchase.expectedDelivery).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewPurchase(purchase)}
                          className="w-8 h-8 flex items-center justify-center text-blue-600 hover:text-blue-900 cursor-pointer"
                          title="View Purchase Order"
                        >
                          <i className="ri-eye-line"></i>
                        </button>
                        <button 
                          onClick={() => handleEditPurchase(purchase)}
                          className="w-8 h-8 flex items-center justify-center text-green-600 hover:text-green-900 cursor-pointer"
                          title="Edit Purchase Order"
                        >
                          <i className="ri-edit-line"></i>
                        </button>
                        <button 
                          onClick={() => handleReceiveItems(purchase)}
                          className="w-8 h-8 flex items-center justify-center text-purple-600 hover:text-purple-900 cursor-pointer"
                          title="Receive Items"
                        >
                          <i className="ri-inbox-line"></i>
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

      {/* Add Purchase Order Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          resetForm();
        }}
        title="Create New Purchase Order"
        size="xl"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
              <select 
                value={newPurchase.supplierId}
                onChange={(e) => handleSupplierSelect(parseInt(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
              >
                <option value={0}>Select Supplier</option>
                {suppliers.filter(s => s.status === 'Active').map(supplier => (
                  <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Warehouse</label>
              <select 
                value={newPurchase.warehouseId}
                onChange={(e) => handleWarehouseSelect(parseInt(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
              >
                <option value={0}>Select Warehouse</option>
                {warehouses.filter(w => w.status === 'Active').map(warehouse => (
                  <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Expected Delivery Date" 
              type="date"
              value={newPurchase.expectedDelivery}
              onChange={(e) => setNewPurchase(prev => ({ ...prev, expectedDelivery: e.target.value }))}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
              <select 
                value={newPurchase.paymentMethod}
                onChange={(e) => setNewPurchase(prev => ({ ...prev, paymentMethod: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
              >
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Check">Check</option>
                <option value="Cash">Cash</option>
              </select>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Purchase Items</h4>
            <div className="space-y-4">
              {newPurchase.items.map((item, index) => {
                const warehouseLocations = newPurchase.warehouseId ? getWarehouseLocations(newPurchase.warehouseId) : [];
                
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
                      
                      {warehouseLocations.length > 0 && (
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Storage Location</label>
                          <select 
                            value={item.locationId || ''}
                            onChange={(e) => {
                              const locationId = parseInt(e.target.value);
                              const location = locations.find(l => l.id === locationId);
                              updatePurchaseItem(index, 'locationId', locationId);
                              updatePurchaseItem(index, 'locationCode', location?.locationCode || '');
                            }}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                          >
                            <option value="">Select Location</option>
                            {warehouseLocations.map(location => (
                              <option key={location.id} value={location.id}>
                                {location.locationCode} (Available: {location.capacity - location.currentStock})
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Quantity</label>
                        <Input 
                          type="number" 
                          placeholder="Qty" 
                          value={item.quantity}
                          onChange={(e) => updatePurchaseItem(index, 'quantity', parseInt(e.target.value) || 1)}
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Unit Cost</label>
                        <Input 
                          type="number"
                          step="0.01"
                          placeholder="Cost" 
                          value={item.unitCost}
                          onChange={(e) => updatePurchaseItem(index, 'unitCost', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Total</label>
                        <Input 
                          placeholder="Total" 
                          value={item.totalCost.toFixed(2)}
                          readOnly
                        />
                      </div>
                      {newPurchase.items.length > 1 && (
                        <div className="pt-6">
                          <button 
                            onClick={() => removePurchaseItem(index)}
                            className="w-8 h-8 flex items-center justify-center text-red-600 hover:text-red-900 cursor-pointer"
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <Button variant="secondary" className="mt-3" onClick={addPurchaseItem}>
              <i className="ri-add-line mr-2"></i>
              Add Item
            </Button>
            
            {/* Purchase Summary */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium text-gray-900">${calculatePurchaseTotal().subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (8%):</span>
                  <span className="font-medium text-gray-900">${calculatePurchaseTotal().tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-medium text-gray-900">${calculatePurchaseTotal().shipping.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Total:</span>
                    <span className="text-lg font-bold text-gray-900">${calculatePurchaseTotal().total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea 
              value={newPurchase.notes}
              onChange={(e) => setNewPurchase(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Additional notes for this purchase order"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => {
              setIsAddModalOpen(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button onClick={handleCreatePurchase}>
              Create Purchase Order
            </Button>
          </div>
        </div>
      </Modal>

      {/* View Purchase Order Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={selectedPurchase ? `Purchase Order ${selectedPurchase.purchaseOrderNumber}` : 'Purchase Order Details'}
        size="xl"
      >
        {selectedPurchase && (
          <div className="space-y-6">
            {/* Purchase Header */}
            <div className="flex items-center justify-between pb-4 border-b">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedPurchase.purchaseOrderNumber}</h3>
                <p className="text-sm text-gray-600">Created on {new Date(selectedPurchase.orderDate).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedPurchase.status)}`}>
                  <i className={`${getStatusIcon(selectedPurchase.status)} mr-1`}></i>
                  {selectedPurchase.status}
                </span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(selectedPurchase.paymentStatus)}`}>
                  {selectedPurchase.paymentStatus}
                </span>
              </div>
            </div>

            {/* Supplier and Delivery Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Supplier Information</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium text-gray-900">{selectedPurchase.supplierName}</p>
                  <p className="text-sm text-gray-600">{selectedPurchase.supplierEmail}</p>
                  <p className="text-sm text-gray-600">{selectedPurchase.supplierPhone}</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Delivery Information</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium text-gray-900">{selectedPurchase.warehouseName}</p>
                  <p className="text-sm text-gray-600">Expected: {new Date(selectedPurchase.expectedDelivery).toLocaleDateString()}</p>
                  {selectedPurchase.actualDelivery && (
                    <p className="text-sm text-gray-600">Delivered: {new Date(selectedPurchase.actualDelivery).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Purchase Items */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Purchase Items</h4>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit Cost</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Received</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedPurchase.items.map((item: any, index: number) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.productName}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{item.sku}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.quantity}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">${item.unitCost}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">${item.totalCost.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          <span className={item.received === item.quantity ? 'text-green-600' : item.received > 0 ? 'text-orange-600' : 'text-gray-600'}>
                            {item.received}/{item.quantity}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {item.locationCode || 'Not assigned'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Purchase Summary */}
            <div className="border-t pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Payment Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="text-gray-900">{selectedPurchase.paymentMethod}</span>
                    </div>
                    {selectedPurchase.paymentDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Date:</span>
                        <span className="text-gray-900">{new Date(selectedPurchase.paymentDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Order Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="text-gray-900">{selectedPurchase.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax:</span>
                      <span className="text-gray-900">{selectedPurchase.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping:</span>
                      <span className="text-gray-900">{selectedPurchase.shipping.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-semibold">
                        <span className="text-gray-900">Total:</span>
                        <span className="text-gray-900">{selectedPurchase.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {selectedPurchase.notes && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Notes</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700">{selectedPurchase.notes}</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="secondary">
                <i className="ri-printer-line mr-2"></i>
                Print PO
              </Button>
              {['Shipped', 'Partially Received'].includes(selectedPurchase.status) && (
                <Button onClick={() => {
                  setIsViewModalOpen(false);
                  handleReceiveItems(selectedPurchase);
                }}>
                  <i className="ri-inbox-line mr-2"></i>
                  Receive Items
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Receive Items Modal */}
      <Modal
        isOpen={isReceiveModalOpen}
        onClose={() => setIsReceiveModalOpen(false)}
        title={selectedPurchase ? `Receive Items - ${selectedPurchase.purchaseOrderNumber}` : 'Receive Items'}
        size="lg"
      >
        {selectedPurchase && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <i className="ri-information-line text-blue-600 mr-2"></i>
                <p className="text-sm text-blue-800">
                  Update the received quantities for each item. Items will be automatically added to inventory.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {selectedPurchase.items.map((item: any, index: number) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{item.productName}</h4>
                      <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Ordered: {item.quantity}</p>
                      <p className="text-sm text-gray-600">Previously Received: {item.received}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Receiving Quantity</label>
                      <Input 
                        type="number" 
                        placeholder="0"
                        max={item.quantity - item.received}
                        defaultValue={item.quantity - item.received}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Storage Location</label>
                      <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8">
                        <option value="">Select Location</option>
                        {getWarehouseLocations(selectedPurchase.warehouseId).map(location => (
                          <option key={location.id} value={location.id}>
                            {location.locationCode} (Available: {location.capacity - location.currentStock})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Condition Notes</label>
                    <textarea 
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={2}
                      placeholder="Any notes about item condition, damages, etc."
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="secondary" onClick={() => setIsReceiveModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                console.log('Processing item receipt for PO:', selectedPurchase.purchaseOrderNumber);
                setIsReceiveModalOpen(false);
              }}>
                <i className="ri-check-line mr-2"></i>
                Confirm Receipt
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
