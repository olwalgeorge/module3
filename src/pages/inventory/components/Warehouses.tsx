
import { useState } from 'react';
import { useProductVariants, useProducts } from '../../../hooks/useDatabase';
import { warehouses, locations } from '../../../mocks/inventory';
import Button from '../../../components/base/Button';
import Input from '../../../components/base/Input';
import Modal from '../../../components/base/Modal';

export default function Warehouses() {
  // Database hooks for real-time data
  const { variants: productVariants } = useProductVariants();
  const { products } = useProducts();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [isAddWarehouseModalOpen, setIsAddWarehouseModalOpen] = useState(false);
  const [isEditWarehouseModalOpen, setIsEditWarehouseModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isVariantLocationModalOpen, setIsVariantLocationModalOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'warehouses' | 'locations'>('warehouses');

  const filteredWarehouses = warehouses.filter(warehouse => {
    const matchesSearch = warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         warehouse.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         warehouse.manager.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || warehouse.status === selectedStatus;
    const matchesType = selectedType === 'all' || warehouse.type === selectedType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const filteredLocations = locations.filter(location => {
    const matchesSearch = location.locationCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (location.productName && location.productName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         location.warehouseName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'Inactive': return 'bg-red-100 text-red-800';
      case 'Empty': return 'bg-gray-100 text-gray-800';
      case 'Reserved': return 'bg-blue-100 text-blue-800';
      case 'Processing': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Distribution Center': return 'ri-building-line';
      case 'Regional Hub': return 'ri-community-line';
      case 'Cold Storage': return 'ri-temp-cold-line';
      case 'Returns Center': return 'ri-arrow-go-back-line';
      case 'Overflow Storage': return 'ri-archive-line';
      default: return 'ri-building-2-line';
    }
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return 'text-red-600';
    if (utilization >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  const handleEditWarehouse = (warehouse: any) => {
    setSelectedWarehouse(warehouse);
    setIsEditWarehouseModalOpen(true);
  };

  const handleViewLocations = (warehouse: any) => {
    setSelectedWarehouse(warehouse);
    setIsLocationModalOpen(true);
  };

  const handleViewVariantLocations = () => {
    setIsVariantLocationModalOpen(true);
  };

  const getWarehouseStats = () => {
    const totalWarehouses = warehouses.length;
    const activeWarehouses = warehouses.filter(w => w.status === 'Active').length;
    const totalCapacity = warehouses.reduce((sum, w) => sum + w.capacity, 0);
    const totalStock = warehouses.reduce((sum, w) => sum + w.currentStock, 0);
    const utilization = totalCapacity > 0 ? Math.round((totalStock / totalCapacity) * 100) : 0;

    return { totalWarehouses, activeWarehouses, totalCapacity, totalStock, utilization };
  };

  const getVariantFullSku = (variant: any) => {
    const product = products.find(p => p.id === variant.product_id);
    return product ? `${product.sku}${variant.sku_suffix || ''}` : variant.sku_suffix || '';
  };

  const getLocationStats = () => {
    const totalLocations = locations.length;
    const occupiedLocations = locations.filter(l => l.status === 'Active').length;
    const emptyLocations = locations.filter(l => l.status === 'Empty').length;
    const variantLocations = locations.filter(l => l.productSku && productVariants.some(v => getVariantFullSku(v) === l.productSku)).length;

    return { totalLocations, occupiedLocations, emptyLocations, variantLocations };
  };

  const getVariantsByLocation = () => {
    return productVariants.map(variant => {
      const fullSku = getVariantFullSku(variant);
      const location = locations.find(l => l.productSku === fullSku);
      return {
        ...variant,
        location: location || null
      };
    });
  };

  const warehouseStats = getWarehouseStats();
  const locationStats = getLocationStats();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Warehouses & Locations</h2>
          <p className="text-gray-600">Manage warehouse facilities, storage locations, and variant tracking</p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="secondary"
            onClick={handleViewVariantLocations}
          >
            <i className="ri-list-check mr-2"></i>
            Variant Locations
          </Button>
          <Button 
            variant="secondary"
            onClick={() => setViewMode(viewMode === 'warehouses' ? 'locations' : 'warehouses')}
          >
            <i className={`${viewMode === 'warehouses' ? 'ri-map-pin-line' : 'ri-building-line'} mr-2`}></i>
            {viewMode === 'warehouses' ? 'View Locations' : 'View Warehouses'}
          </Button>
          <Button onClick={() => setIsAddWarehouseModalOpen(true)}>
            <i className="ri-add-line mr-2"></i>
            Add {viewMode === 'warehouses' ? 'Warehouse' : 'Location'}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {viewMode === 'warehouses' ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="ri-building-line text-blue-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Warehouses</p>
                <p className="text-2xl font-bold text-gray-900">{warehouseStats.totalWarehouses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="ri-checkbox-circle-line text-green-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">{warehouseStats.activeWarehouses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="ri-archive-line text-purple-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Capacity</p>
                <p className="text-2xl font-bold text-gray-900">{warehouseStats.totalCapacity.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <i className="ri-box-3-line text-orange-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Current Stock</p>
                <p className="text-2xl font-bold text-gray-900">{warehouseStats.totalStock.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <i className="ri-pie-chart-line text-yellow-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Utilization</p>
                <p className={`text-2xl font-bold ${getUtilizationColor(warehouseStats.utilization)}`}>
                  {warehouseStats.utilization}%
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="ri-map-pin-line text-blue-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Locations</p>
                <p className="text-2xl font-bold text-gray-900">{locationStats.totalLocations}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="ri-checkbox-circle-line text-green-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Occupied</p>
                <p className="text-2xl font-bold text-gray-900">{locationStats.occupiedLocations}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <i className="ri-inbox-line text-gray-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Empty</p>
                <p className="text-2xl font-bold text-gray-900">{locationStats.emptyLocations}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="ri-list-check text-purple-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Variant Locations</p>
                <p className="text-2xl font-bold text-gray-900">{locationStats.variantLocations}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder={`Search ${viewMode}...`}
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
              <option value="Active">Active</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Inactive">Inactive</option>
              {viewMode === 'locations' && (
                <>
                  <option value="Empty">Empty</option>
                  <option value="Reserved">Reserved</option>
                  <option value="Processing">Processing</option>
                </>
              )}
            </select>
          </div>

          {viewMode === 'warehouses' && (
            <div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
              >
                <option value="all">All Types</option>
                <option value="Distribution Center">Distribution Center</option>
                <option value="Regional Hub">Regional Hub</option>
                <option value="Cold Storage">Cold Storage</option>
                <option value="Returns Center">Returns Center</option>
                <option value="Overflow Storage">Overflow Storage</option>
              </select>
            </div>
          )}
          
          <Button variant="secondary">
            <i className="ri-download-line mr-2"></i>
            Export
          </Button>
        </div>
      </div>

      {/* Content Display */}
      {viewMode === 'warehouses' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredWarehouses.map((warehouse) => {
            const utilization = warehouse.capacity > 0 ? Math.round((warehouse.currentStock / warehouse.capacity) * 100) : 0;
            const warehouseLocations = locations.filter(l => l.warehouseId === warehouse.id);
            const variantCount = warehouseLocations.filter(l => l.productSku && productVariants.some(v => getVariantFullSku(v) === l.productSku)).length;
            
            return (
              <div key={warehouse.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                      <i className={`${getTypeIcon(warehouse.type)} text-white text-xl`}></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{warehouse.name}</h3>
                      <p className="text-sm text-gray-600">{warehouse.code}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleViewLocations(warehouse)}
                      className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-600 cursor-pointer"
                    >
                      <i className="ri-map-pin-line"></i>
                    </button>
                    <button 
                      onClick={() => handleEditWarehouse(warehouse)}
                      className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-600 cursor-pointer"
                    >
                      <i className="ri-edit-line"></i>
                    </button>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(warehouse.status)}`}>
                      {warehouse.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Type</span>
                    <span className="text-sm font-medium text-gray-900">{warehouse.type}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Manager</span>
                    <span className="text-sm font-medium text-gray-900">{warehouse.manager}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Capacity</span>
                    <span className="text-sm font-medium text-gray-900">{warehouse.capacity.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Current Stock</span>
                    <span className="text-sm font-medium text-gray-900">{warehouse.currentStock.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Utilization</span>
                    <span className={`text-sm font-medium ${getUtilizationColor(utilization)}`}>
                      {utilization}%
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Storage Utilization</span>
                    <span>{utilization}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        utilization >= 90 ? 'bg-red-500' : 
                        utilization >= 75 ? 'bg-yellow-500' : 
                        'bg-green-500'
                      }`}
                      style={{ width: `${utilization}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 text-center pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{warehouse.zones}</p>
                    <p className="text-xs text-gray-600">Zones</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{warehouseLocations.length}</p>
                    <p className="text-xs text-gray-600">Locations</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{variantCount}</p>
                    <p className="text-xs text-gray-600">Variants</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{warehouse.temperature}</p>
                    <p className="text-xs text-gray-600">Climate</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Warehouse</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product/Variant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLocations.map((location) => {
                  const isVariant = location.productSku && productVariants.some(v => getVariantFullSku(v) === location.productSku);
                  const variant = isVariant ? productVariants.find(v => getVariantFullSku(v) === location.productSku) : null;
                  
                  return (
                    <tr key={location.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{location.locationCode}</div>
                        <div className="text-xs text-gray-500">Zone {location.zone} • Aisle {location.aisle}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{location.warehouseName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {location.productName ? (
                          <div>
                            <div className="flex items-center">
                              <div className="text-sm font-medium text-gray-900">{location.productName}</div>
                              {isVariant && (
                                <span className="ml-2 inline-flex px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                                  Variant
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500">{location.productSku}</div>
                            {variant && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                <span className="inline-flex px-1 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">
                                  {variant.variant_name}: {variant.variant_value}
                                </span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">Empty</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{location.capacity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{location.currentStock}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(location.status)}`}>
                          {location.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="w-8 h-8 flex items-center justify-center text-blue-600 hover:text-blue-900 cursor-pointer">
                            <i className="ri-edit-line"></i>
                          </button>
                          <button className="w-8 h-8 flex items-center justify-center text-red-600 hover:text-red-900 cursor-pointer">
                            <i className="ri-delete-bin-line"></i>
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
      )}

      {/* Variant Locations Modal */}
      <Modal
        isOpen={isVariantLocationModalOpen}
        onClose={() => setIsVariantLocationModalOpen(false)}
        title="Product Variant Locations"
        size="xl"
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">Track all product variants across warehouse locations</p>
            <Button size="sm">
              <i className="ri-download-line mr-2"></i>
              Export Report
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Variant</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parent Product</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attributes</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Warehouse</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {getVariantsByLocation().map((variant) => (
                  <tr key={variant.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <img 
                          src={variant.image_url || 'https://images.unsplash.com/photo-1560472355-536de3962603?w=400&h=300&fit=crop'} 
                          alt={`${variant.variant_name}: ${variant.variant_value}`}
                          className="w-10 h-10 rounded-lg object-cover object-top mr-3"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{variant.variant_name}: {variant.variant_value}</div>
                          <div className="text-xs text-gray-500">{getVariantFullSku(variant)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{products.find(p => p.id === variant.product_id)?.name}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        <span className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          {variant.variant_name}: {variant.variant_value}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {variant.location ? variant.location.locationCode : 'Not assigned'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {variant.location ? variant.location.warehouseName : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{variant.stock_quantity || 0}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${variant.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {variant.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>

      {/* Add Warehouse Modal */}
      <Modal
        isOpen={isAddWarehouseModalOpen}
        onClose={() => setIsAddWarehouseModalOpen(false)}
        title="Add New Warehouse"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Warehouse Name" placeholder="Enter warehouse name" />
            <Input label="Warehouse Code" placeholder="WH-001" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea 
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
              placeholder="Enter complete address"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Manager Name" placeholder="Enter manager name" />
            <Input label="Phone" placeholder="+1 (555) 123-4567" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Email" type="email" placeholder="warehouse@company.com" />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse Type</label>
              <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8">
                <option>Distribution Center</option>
                <option>Regional Hub</option>
                <option>Cold Storage</option>
                <option>Returns Center</option>
                <option>Overflow Storage</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Capacity" type="number" placeholder="10000" />
            <Input label="Number of Zones" type="number" placeholder="12" />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Temperature Control</label>
              <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8">
                <option>Ambient</option>
                <option>Refrigerated</option>
                <option>Frozen</option>
                <option>Climate Controlled</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setIsAddWarehouseModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsAddWarehouseModalOpen(false)}>
              Add Warehouse
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Warehouse Modal */}
      <Modal
        isOpen={isEditWarehouseModalOpen}
        onClose={() => setIsEditWarehouseModalOpen(false)}
        title="Edit Warehouse"
        size="lg"
      >
        {selectedWarehouse && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Warehouse Name" defaultValue={selectedWarehouse.name} />
              <Input label="Warehouse Code" defaultValue={selectedWarehouse.code} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea 
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                defaultValue={selectedWarehouse.address}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Manager Name" defaultValue={selectedWarehouse.manager} />
              <Input label="Phone" defaultValue={selectedWarehouse.phone} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Email" type="email" defaultValue={selectedWarehouse.email} />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select 
                  defaultValue={selectedWarehouse.status}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                >
                  <option>Active</option>
                  <option>Maintenance</option>
                  <option>Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="secondary" onClick={() => setIsEditWarehouseModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsEditWarehouseModalOpen(false)}>
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Warehouse Locations Modal */}
      <Modal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        title={selectedWarehouse ? `${selectedWarehouse.name} - Locations` : 'Warehouse Locations'}
        size="xl"
      >
        {selectedWarehouse && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {locations
                .filter(location => location.warehouseId === selectedWarehouse.id)
                .map((location) => (
                  <div key={location.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{location.locationCode}</h4>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(location.status)}`}>
                        {location.status}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>Zone: {location.zone} • Aisle: {location.aisle}</p>
                      <p>Capacity: {location.capacity}</p>
                      <p>Stock: {location.currentStock}</p>
                      {location.productName && (
                        <p className="font-medium text-gray-900">{location.productName}</p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
