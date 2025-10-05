
import { useState } from 'react';
import { useStockMovements } from '../../../hooks/useDatabase';
import { warehouses } from '../../../mocks/inventory';
import Button from '../../../components/base/Button';
import Input from '../../../components/base/Input';
import Modal from '../../../components/base/Modal';

export default function StockMovements() {
  // Database hooks for real-time data
  const { stockMovements } = useStockMovements();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedWarehouse, setSelectedWarehouse] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState('all');

  // Helper function to parse movement notes JSON safely
  const parseMovementNotes = (notes: string | null) => {
    if (!notes) return {};
    try {
      return JSON.parse(notes);
    } catch {
      return {};
    }
  };

  const filteredMovements = stockMovements.filter(movement => {
    const productName = movement.products?.name || 'Unknown Product';
    const sku = movement.products?.sku || '';
    
    const matchesSearch = 
      productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (movement.reference_id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (movement.reason || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'all' || movement.reference_type === selectedType.toLowerCase();
    
    // For now, skip warehouse filtering since we'd need warehouse/location data
    const matchesWarehouse = true;
    
    return matchesSearch && matchesType && matchesWarehouse;
  });

  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'purchase': return 'bg-green-100 text-green-800';
      case 'sale': return 'bg-blue-100 text-blue-800';
      case 'adjustment': return 'bg-yellow-100 text-yellow-800';
      case 'transfer': return 'bg-purple-100 text-purple-800';
      case 'return': return 'bg-orange-100 text-orange-800';
      case 'assembly': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'purchase': return 'ri-add-circle-line';
      case 'sale': return 'ri-subtract-line';
      case 'adjustment': return 'ri-edit-line';
      case 'transfer': return 'ri-arrow-left-right-line';
      case 'return': return 'ri-arrow-go-back-line';
      case 'assembly': return 'ri-tools-line';
      default: return 'ri-file-list-line';
    }
  };

  const formatQuantity = (quantity: number, movementType: string) => {
    const sign = movementType === 'in' ? '+' : '-';
    return `${sign}${Math.abs(quantity)}`;
  };

  // Calculate statistics from database movements
  const totalMovements = stockMovements.length;
  const inboundMovements = stockMovements.filter(m => m.movement_type === 'in').length;
  const outboundMovements = stockMovements.filter(m => m.movement_type === 'out').length;
  const totalValue = stockMovements.reduce((sum, movement) => {
    const notes = parseMovementNotes(movement.notes);
    return sum + (notes.total_cost || notes.total_revenue || 0);
  }, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Stock Movements</h2>
          <p className="text-gray-600">Track all inventory stock changes across warehouses</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <i className="ri-add-line mr-2"></i>
          Add Movement
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Movements</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{totalMovements}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <i className="ri-arrow-up-down-line text-white text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Stock In</p>
              <p className="text-2xl font-bold text-green-600 mt-2">{inboundMovements}</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <i className="ri-add-circle-line text-white text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Stock Out</p>
              <p className="text-2xl font-bold text-red-600 mt-2">{outboundMovements}</p>
            </div>
            <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
              <i className="ri-subtract-line text-white text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-purple-600 mt-2">${Math.round(totalValue).toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <i className="ri-money-dollar-circle-line text-white text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Input
            placeholder="Search movements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
            >
              <option value="all">All Types</option>
              <option value="purchase">Purchase</option>
              <option value="sale">Sale</option>
              <option value="adjustment">Adjustment</option>
              <option value="transfer">Transfer</option>
              <option value="return">Return</option>
              <option value="assembly">Assembly</option>
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
                <option key={warehouse.id} value={warehouse.id.toString()}>
                  {warehouse.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
          </div>
          
          <Button variant="secondary">
            <i className="ri-download-line mr-2"></i>
            Export
          </Button>
        </div>
      </div>

      {/* Movements Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Warehouse & Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMovements.map((movement) => {
                const notes = parseMovementNotes(movement.notes);
                const productName = movement.products?.name || 'Unknown Product';
                const productSku = movement.products?.sku || 'N/A';
                const productImage = movement.products?.image_url || '/api/placeholder/40/40';
                const movementDate = new Date(movement.created_at);
                
                return (
                  <tr key={movement.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{movementDate.toLocaleDateString()}</div>
                      <div className="text-xs text-gray-500">{movementDate.toLocaleTimeString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img 
                          src={productImage} 
                          alt={productName}
                          className="w-10 h-10 rounded-lg object-cover object-top mr-3"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{productName}</div>
                          <div className="text-xs text-gray-500">SKU: {productSku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {notes.location || notes.from_warehouse || 'Unknown Location'}
                      </div>
                      {notes.to_warehouse && (
                        <div className="text-xs text-gray-500">
                          → {notes.to_warehouse}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-2 ${getTypeColor(movement.reference_type)}`}>
                          <i className={`${getTypeIcon(movement.reference_type)} text-sm`}></i>
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(movement.reference_type)}`}>
                          {movement.reference_type}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${
                        movement.movement_type === 'in' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatQuantity(movement.quantity, movement.movement_type)}
                      </div>
                      {notes.unit_cost && (
                        <div className="text-xs text-gray-500">
                          @ ${notes.unit_cost}/unit
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{movement.reference_id}</div>
                      {notes.order_number && (
                        <div className="text-xs text-gray-500">{notes.order_number}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{movement.created_by}</div>
                      {notes.approved_by && (
                        <div className="text-xs text-gray-500">Approved by: {notes.approved_by}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {movement.reason}
                      </div>
                      {notes.supplier && (
                        <div className="text-xs text-blue-600">{notes.supplier}</div>
                      )}
                      {notes.customer && (
                        <div className="text-xs text-green-600">{notes.customer}</div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Movement Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Stock Movement"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Movement Type</label>
              <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8">
                <option>Purchase</option>
                <option>Sale</option>
                <option>Adjustment</option>
                <option>Transfer</option>
                <option>Return</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
              <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8">
                <option>MacBook Pro 16"</option>
                <option>iPhone 15 Pro</option>
                <option>Dell Monitor 27"</option>
                <option>Wireless Mouse</option>
                <option>Gaming Keyboard</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse</label>
              <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8">
                <option value="">Select Warehouse</option>
                {warehouses.map(warehouse => (
                  <option key={warehouse.id} value={warehouse.id}>
                    {warehouse.name} ({warehouse.code})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8">
                <option value="">Select Location</option>
                <option>A-01-001-A</option>
                <option>A-01-002-B</option>
                <option>B-02-001-A</option>
                <option>C-05-002-B</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Quantity" type="number" placeholder="Enter quantity" />
            <Input label="Reference" placeholder="PO-001, INV-123, etc." />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Date" type="date" />
            <Input label="Time" type="time" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea 
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Additional notes about this movement"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsAddModalOpen(false)}>
              Add Movement
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
