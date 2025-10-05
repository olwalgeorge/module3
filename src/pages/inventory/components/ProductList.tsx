
import { useState } from 'react';
import { products, productVariants, warehouses, locations } from '../../../mocks/inventory';
import Button from '../../../components/base/Button';
import Input from '../../../components/base/Input';
import Modal from '../../../components/base/Modal';

export default function ProductList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedWarehouse, setSelectedWarehouse] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [expandedProducts, setExpandedProducts] = useState<Set<number>>(new Set());
  const [viewMode, setViewMode] = useState<'products' | 'variants'>('products');

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    
    // Filter by warehouse if selected
    let matchesWarehouse = true;
    if (selectedWarehouse !== 'all') {
      const productLocations = locations.filter(l => l.productSku === product.sku);
      matchesWarehouse = productLocations.some(l => l.warehouseId.toString() === selectedWarehouse);
    }
    
    return matchesSearch && matchesCategory && matchesWarehouse;
  });

  const filteredVariants = productVariants.filter(variant => {
    const matchesSearch = variant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         variant.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         variant.parentProduct.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by warehouse if selected
    let matchesWarehouse = true;
    if (selectedWarehouse !== 'all') {
      const variantLocations = locations.filter(l => l.productSku === variant.sku);
      matchesWarehouse = variantLocations.some(l => l.warehouseId.toString() === selectedWarehouse);
    }
    
    return matchesSearch && matchesWarehouse;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock': return 'bg-green-100 text-green-800';
      case 'Low Stock': return 'bg-yellow-100 text-yellow-800';
      case 'Out of Stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleViewVariants = (product: any) => {
    setSelectedProduct(product);
    setIsVariantModalOpen(true);
  };

  const handleViewLocations = (product: any) => {
    setSelectedProduct(product);
    setIsLocationModalOpen(true);
  };

  const toggleProductExpansion = (productId: number) => {
    const newExpanded = new Set(expandedProducts);
    if (newExpanded.has(productId)) {
      newExpanded.delete(productId);
    } else {
      newExpanded.add(productId);
    }
    setExpandedProducts(newExpanded);
  };

  const getProductVariants = (productName: string) => {
    return productVariants.filter(variant => variant.parentProduct === productName);
  };

  const getProductLocations = (sku: string) => {
    return locations.filter(location => location.productSku === sku);
  };

  const getProductStats = (productName: string) => {
    const variants = getProductVariants(productName);
    const totalQuantity = variants.reduce((sum, v) => sum + v.quantity, 0);
    const totalValue = variants.reduce((sum, v) => sum + (v.price * v.quantity), 0);
    const lowStockCount = variants.filter(v => v.quantity <= v.minStock).length;
    const outOfStockCount = variants.filter(v => v.quantity === 0).length;
    const priceRange = variants.length > 0 ? {
      min: Math.min(...variants.map(v => v.price)),
      max: Math.max(...variants.map(v => v.price))
    } : { min: 0, max: 0 };

    return { totalQuantity, totalValue, lowStockCount, outOfStockCount, priceRange, variantCount: variants.length };
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Products</h2>
          <p className="text-gray-600">Manage your inventory items, variants, and warehouse locations</p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="secondary"
            onClick={() => setViewMode(viewMode === 'products' ? 'variants' : 'products')}
          >
            <i className={`${viewMode === 'products' ? 'ri-list-check' : 'ri-folder-line'} mr-2`}></i>
            {viewMode === 'products' ? 'View All Variants' : 'View Products'}
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <i className="ri-add-line mr-2"></i>
            Add {viewMode === 'products' ? 'Product' : 'Variant'}
          </Button>
        </div>
      </div>

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
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
            >
              <option value="all">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Accessories">Accessories</option>
              <option value="Software">Software</option>
              <option value="Furniture">Furniture</option>
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
            <i className="ri-filter-line mr-2"></i>
            More Filters
          </Button>
        </div>
      </div>

      {/* Products/Variants Display */}
      {viewMode === 'products' ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variants</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Locations</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price Range</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => {
                  const variants = getProductVariants(product.name);
                  const stats = getProductStats(product.name);
                  const productLocations = getProductLocations(product.sku);
                  const isExpanded = expandedProducts.has(product.id);
                  
                  return (
                    <>
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <button
                              onClick={() => toggleProductExpansion(product.id)}
                              className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 mr-2 cursor-pointer"
                            >
                              <i className={`ri-arrow-${isExpanded ? 'down' : 'right'}-s-line`}></i>
                            </button>
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover object-top mr-4"
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                              <div className="text-sm text-gray-500">{product.supplier}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.sku}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{stats.variantCount} variants</div>
                          {stats.lowStockCount > 0 && (
                            <div className="text-xs text-red-600">{stats.lowStockCount} low stock</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{productLocations.length} locations</div>
                          {productLocations.length > 0 && (
                            <div className="text-xs text-gray-500">
                              {warehouses.find(w => w.id === productLocations[0].warehouseId)?.name}
                              {productLocations.length > 1 && ` +${productLocations.length - 1} more`}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{stats.totalQuantity}</div>
                          <div className="text-xs text-gray-500">Total units</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${stats.priceRange.min} - ${stats.priceRange.max}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.status)}`}>
                            {product.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleViewLocations(product)}
                              className="w-8 h-8 flex items-center justify-center text-purple-600 hover:text-purple-900 cursor-pointer"
                              title="View Locations"
                            >
                              <i className="ri-map-pin-line"></i>
                            </button>
                            <button 
                              onClick={() => handleViewVariants(product)}
                              className="w-8 h-8 flex items-center justify-center text-blue-600 hover:text-blue-900 cursor-pointer"
                              title="View Variants"
                            >
                              <i className="ri-list-check"></i>
                            </button>
                            <button 
                              onClick={() => handleEdit(product)}
                              className="w-8 h-8 flex items-center justify-center text-blue-600 hover:text-blue-900 cursor-pointer"
                            >
                              <i className="ri-edit-line"></i>
                            </button>
                            <button className="w-8 h-8 flex items-center justify-center text-red-600 hover:text-red-900 cursor-pointer">
                              <i className="ri-delete-bin-line"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                      {isExpanded && variants.map((variant) => {
                        const variantLocations = getProductLocations(variant.sku);
                        return (
                          <tr key={`variant-${variant.id}`} className="bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center pl-8">
                                <img 
                                  src={variant.image} 
                                  alt={variant.name}
                                  className="w-10 h-10 rounded-lg object-cover object-top mr-3"
                                />
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{variant.name}</div>
                                  <div className="text-xs text-gray-500">
                                    {Object.entries(variant.attributes).map(([key, value]) => `${key}: ${value}`).join(' • ')}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{variant.sku}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">-</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">Variant</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-600">{variantLocations.length} locations</div>
                              {variantLocations.length > 0 && (
                                <div className="text-xs text-gray-500">
                                  {variantLocations[0].locationCode}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{variant.quantity}</div>
                              <div className="text-xs text-gray-500">Min: {variant.minStock}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${variant.price}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(variant.status)}`}>
                                {variant.status}
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
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parent Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attributes</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVariants.map((variant) => {
                  const variantLocations = getProductLocations(variant.sku);
                  return (
                    <tr key={variant.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img 
                            src={variant.image} 
                            alt={variant.name}
                            className="w-12 h-12 rounded-lg object-cover object-top mr-4"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{variant.name}</div>
                            <div className="text-sm text-gray-500">{variant.parentProduct}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{variant.parentProduct}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{variant.sku}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(variant.attributes).map(([key, value]) => (
                            <span key={key} className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                              {key}: {value}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {variantLocations.length > 0 ? (
                          <div>
                            <div className="text-sm text-gray-900">{variantLocations[0].locationCode}</div>
                            <div className="text-xs text-gray-500">
                              {warehouses.find(w => w.id === variantLocations[0].warehouseId)?.name}
                            </div>
                            {variantLocations.length > 1 && (
                              <div className="text-xs text-blue-600">+{variantLocations.length - 1} more</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">Not assigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{variant.quantity}</div>
                        <div className="text-xs text-gray-500">Min: {variant.minStock}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${variant.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(variant.status)}`}>
                          {variant.status}
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

      {/* Add Product Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={`Add New ${viewMode === 'products' ? 'Product' : 'Variant'}`}
        size="lg"
      >
        <div className="space-y-4">
          {viewMode === 'variants' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parent Product</label>
              <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8">
                <option value="">Select Parent Product</option>
                {products.map(product => (
                  <option key={product.id} value={product.name}>{product.name}</option>
                ))}
              </select>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label={`${viewMode === 'products' ? 'Product' : 'Variant'} Name`} placeholder="Enter name" />
            <Input label="SKU" placeholder="Enter SKU" />
          </div>
          {viewMode === 'products' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8">
                  <option>Electronics</option>
                  <option>Accessories</option>
                  <option>Software</option>
                  <option>Furniture</option>
                </select>
              </div>
              <Input label="Supplier" placeholder="Enter supplier name" />
            </div>
          )}
          {viewMode === 'variants' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Variant Attributes</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Color" placeholder="e.g., Space Gray" />
                <Input label="Size" placeholder="e.g., 16 inch" />
                <Input label="Storage" placeholder="e.g., 1TB" />
                <Input label="Other" placeholder="Additional attribute" />
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Quantity" type="number" placeholder="0" />
            <Input label="Min Stock" type="number" placeholder="0" />
            <Input label="Price" type="number" step="0.01" placeholder="0.00" />
          </div>
          
          {/* Warehouse and Location Selection */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Warehouse Location</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse</label>
                <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8">
                  <option value="">Select Warehouse</option>
                  {warehouses.map(warehouse => (
                    <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location Code</label>
                <Input placeholder="e.g., A-01-001-A" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <Input label="Zone" placeholder="A" />
              <Input label="Aisle" placeholder="01" />
              <Input label="Shelf" placeholder="001" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Enter description"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsAddModalOpen(false)}>
              Add {viewMode === 'products' ? 'Product' : 'Variant'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Product"
        size="lg"
      >
        {selectedProduct && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Product Name" defaultValue={selectedProduct.name} />
              <Input label="SKU" defaultValue={selectedProduct.sku} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select 
                  defaultValue={selectedProduct.category}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                >
                  <option>Electronics</option>
                  <option>Accessories</option>
                  <option>Software</option>
                  <option>Furniture</option>
                </select>
              </div>
              <Input label="Supplier" defaultValue={selectedProduct.supplier} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input label="Quantity" type="number" defaultValue={selectedProduct.quantity} />
              <Input label="Min Stock" type="number" defaultValue={selectedProduct.minStock} />
              <Input label="Price" type="number" step="0.01" defaultValue={selectedProduct.price} />
            </div>
            
            {/* Current Locations */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Current Locations</h4>
              <div className="space-y-2">
                {getProductLocations(selectedProduct.sku).map((location) => (
                  <div key={location.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{location.locationCode}</div>
                      <div className="text-xs text-gray-500">
                        {warehouses.find(w => w.id === location.warehouseId)?.name} • Stock: {location.currentStock}
                      </div>
                    </div>
                    <button className="w-6 h-6 flex items-center justify-center text-red-600 hover:text-red-900 cursor-pointer">
                      <i className="ri-close-line"></i>
                    </button>
                  </div>
                ))}
              </div>
              <Button variant="secondary" className="mt-3">
                <i className="ri-add-line mr-2"></i>
                Add Location
              </Button>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsEditModalOpen(false)}>
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Product Locations Modal */}
      <Modal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        title={selectedProduct ? `${selectedProduct.name} - Warehouse Locations` : 'Product Locations'}
        size="xl"
      >
        {selectedProduct && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedProduct.name}</h3>
                <p className="text-sm text-gray-600">Track product locations across all warehouses</p>
              </div>
              <Button size="sm">
                <i className="ri-add-line mr-2"></i>
                Add Location
              </Button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location Code</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Warehouse</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Zone/Aisle</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacity</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Stock</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {getProductLocations(selectedProduct.sku).map((location) => (
                    <tr key={location.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{location.locationCode}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {warehouses.find(w => w.id === location.warehouseId)?.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">Zone {location.zone} • Aisle {location.aisle}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{location.capacity}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{location.currentStock}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          location.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {location.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <button className="w-6 h-6 flex items-center justify-center text-blue-600 hover:text-blue-900 cursor-pointer">
                            <i className="ri-edit-line"></i>
                          </button>
                          <button className="w-6 h-6 flex items-center justify-center text-red-600 hover:text-red-900 cursor-pointer">
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Variants at Locations */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Product Variants at Locations</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getProductVariants(selectedProduct.name).map((variant) => {
                  const variantLocations = getProductLocations(variant.sku);
                  return (
                    <div key={variant.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <img 
                          src={variant.image} 
                          alt={variant.name}
                          className="w-10 h-10 rounded-lg object-cover object-top mr-3"
                        />
                        <div>
                          <h5 className="font-medium text-gray-900">{variant.name}</h5>
                          <p className="text-xs text-gray-500">{variant.sku}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        {variantLocations.length > 0 ? (
                          variantLocations.map((location) => (
                            <div key={location.id} className="text-sm text-gray-600">
                              {location.locationCode} - {warehouses.find(w => w.id === location.warehouseId)?.name}
                            </div>
                          ))
                        ) : (
                          <div className="text-sm text-red-600">No locations assigned</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Product Variants Modal */}
      {/* Product Variants Modal */}
      <Modal
        isOpen={isVariantModalOpen}
        onClose={() => setIsVariantModalOpen(false)}
        title={selectedProduct ? `${selectedProduct.name} - Variants` : 'Product Variants'}
        size="xl"
      >
        {selectedProduct && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedProduct.name}</h3>
                <p className="text-sm text-gray-600">Manage product variants and their attributes</p>
              </div>
              <Button size="sm">
                <i className="ri-add-line mr-2"></i>
                Add Variant
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getProductVariants(selectedProduct.name).map((variant) => (
                <div key={variant.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <img 
                      src={variant.image} 
                      alt={variant.name}
                      className="w-12 h-12 rounded-lg object-cover object-top"
                    />
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(variant.status)}`}>
                      {variant.status}
                    </span>
                  </div>
                  
                  <h4 className="font-medium text-gray-900 mb-2">{variant.name}</h4>
                  <p className="text-sm text-gray-600 mb-3">SKU: {variant.sku}</p>
                  
                  <div className="space-y-2 mb-3">
                    {Object.entries(variant.attributes).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-gray-600">{key}:</span>
                        <span className="font-medium text-gray-900">{value}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Stock:</span>
                      <span className="font-medium text-gray-900">{variant.quantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-medium text-gray-900">${variant.price}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 mt-4">
                    <button className="flex-1 px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 cursor-pointer">
                      Edit
                    </button>
                    <button className="flex-1 px-3 py-1 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200 cursor-pointer">
                      Delete
                    </button>
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
