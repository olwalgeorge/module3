
import { useState } from 'react';
import { useProducts, useCategories, useSuppliers, useProductVariants } from '../../../hooks/useDatabase';
import { warehouses, locations } from '../../../mocks/inventory';
import Button from '../../../components/base/Button';
import Input from '../../../components/base/Input';
import Modal from '../../../components/base/Modal';

export default function ProductList() {
  // Database hooks for real-time data
  const { products, loading: productsLoading, addProduct, updateProduct, deleteProduct } = useProducts();
  const { categories } = useCategories();
  const { suppliers } = useSuppliers();
  const { variants: allVariants, addVariant, updateVariant, deleteVariant } = useProductVariants();

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

  // Form state for add/edit operations
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    category_id: '',
    supplier_id: '',
    price: 0,
    cost: 0,
    quantity: 0,
    min_stock_level: 0,
    image_url: '',
    weight: 0,
    dimensions: {}
  });

  // Form state for variants
  const [variantFormData, setVariantFormData] = useState({
    product_id: '',
    variant_name: '',
    variant_value: '',
    sku_suffix: '',
    price_adjustment: 0,
    stock_quantity: 0
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category_name === selectedCategory;
    
    // Filter by warehouse if selected (using existing mock data for now)
    let matchesWarehouse = true;
    if (selectedWarehouse !== 'all') {
      const productLocations = locations.filter(l => l.productSku === product.sku);
      matchesWarehouse = productLocations.some(l => l.warehouseId.toString() === selectedWarehouse);
    }
    
    return matchesSearch && matchesCategory && matchesWarehouse;
  });

  // For variants, we'll use the database variants
  const filteredVariants = allVariants.filter(variant => {
    const productName = variant.products?.name || '';
    const variantName = variant.variant_name || '';
    const variantValue = variant.variant_value || '';
    
    const matchesSearch = productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         variantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         variantValue.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (variant.sku_suffix || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by warehouse if selected (using existing mock data for now)
    let matchesWarehouse = true;
    if (selectedWarehouse !== 'all') {
      const variantLocations = locations.filter(l => l.productSku === variant.sku_suffix);
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
    setFormData({
      name: product.name || '',
      sku: product.sku || '',
      description: product.description || '',
      category_id: product.category_id || '',
      supplier_id: product.supplier_id || '',
      price: product.price || 0,
      cost: product.cost || 0,
      quantity: product.quantity || 0,
      min_stock_level: product.min_stock_level || 0,
      image_url: product.image_url || '',
      weight: product.weight || 0,
      dimensions: product.dimensions || {}
    });
    setIsEditModalOpen(true);
  };

  const handleAddProduct = async () => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      await addProduct(formData);
      setIsAddModalOpen(false);
      // Reset form
      setFormData({
        name: '',
        sku: '',
        description: '',
        category_id: '',
        supplier_id: '',
        price: 0,
        cost: 0,
        quantity: 0,
        min_stock_level: 0,
        image_url: '',
        weight: 0,
        dimensions: {}
      });
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProduct = async () => {
    if (isSubmitting || !selectedProduct) return;
    
    try {
      setIsSubmitting(true);
      await updateProduct(selectedProduct.id, formData);
      setIsEditModalOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (isSubmitting) return;
    
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      await deleteProduct(productId);
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddVariant = async () => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      await addVariant(variantFormData);
      setIsAddModalOpen(false);
      // Reset form
      setVariantFormData({
        product_id: '',
        variant_name: '',
        variant_value: '',
        sku_suffix: '',
        price_adjustment: 0,
        stock_quantity: 0
      });
    } catch (error) {
      console.error('Error adding variant:', error);
      alert('Failed to add variant. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateVariant = async () => {
    if (isSubmitting || !selectedProduct) return;
    
    try {
      setIsSubmitting(true);
      await updateVariant(selectedProduct.id, variantFormData);
      setIsEditModalOpen(false);
      setSelectedProduct(null);
      // Reset form
      setVariantFormData({
        product_id: '',
        variant_name: '',
        variant_value: '',
        sku_suffix: '',
        price_adjustment: 0,
        stock_quantity: 0
      });
    } catch (error) {
      console.error('Error updating variant:', error);
      alert('Failed to update variant. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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

  const getProductVariants = (productId: string) => {
    return allVariants.filter(variant => variant.product_id === productId);
  };

  const getProductImage = (product: any) => {
    // Product should have its own base image
    if (product.image_url) {
      return product.image_url;
    }
    // Fallback based on product type
    if (product.name?.toLowerCase().includes('macbook') || product.name?.toLowerCase().includes('laptop')) {
      return 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop';
    }
    if (product.name?.toLowerCase().includes('iphone') || product.name?.toLowerCase().includes('phone')) {
      return 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop';
    }
    if (product.name?.toLowerCase().includes('monitor') || product.name?.toLowerCase().includes('display')) {
      return 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop';
    }
    if (product.name?.toLowerCase().includes('mouse')) {
      return 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop';
    }
    if (product.name?.toLowerCase().includes('keyboard')) {
      return 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=300&fit=crop';
    }
    return 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop';
  };

  const getVariantImage = (variant: any, parentProduct: any) => {
    // First priority: variant's own image
    if (variant.image_url) {
      return variant.image_url;
    }
    // Second priority: inherit from parent product
    if (parentProduct?.image_url) {
      return parentProduct.image_url;
    }
    // Fallback: generate variant-specific image based on variant attributes
    const variantName = variant.variant_name?.toLowerCase() || '';
    const variantValue = variant.variant_value?.toLowerCase() || '';
    
    // Color-specific images for variants
    if (variantName.includes('color')) {
      if (variantValue.includes('silver') || variantValue.includes('white')) {
        return 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop';
      }
      if (variantValue.includes('space') || variantValue.includes('gray') || variantValue.includes('black')) {
        return 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop';
      }
      if (variantValue.includes('blue')) {
        return 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop';
      }
      if (variantValue.includes('red')) {
        return 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=300&fit=crop';
      }
    }
    
    // Storage-specific or size-specific variants might use different angles
    if (variantName.includes('storage') || variantName.includes('size')) {
      return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop';
    }
    
    // Default: use parent product image logic
    return getProductImage(parentProduct);
  };

  const getProductLocations = (sku: string) => {
    return locations.filter(location => location.productSku === sku);
  };

  const getProductStats = (productId: string) => {
    const variants = getProductVariants(productId);
    const totalQuantity = variants.reduce((sum: number, v: any) => sum + (v.stock_quantity || 0), 0);
    const totalValue = variants.reduce((sum: number, v: any) => sum + ((v.price_adjustment || 0) * (v.stock_quantity || 0)), 0);
    const lowStockCount = variants.filter((v: any) => (v.stock_quantity || 0) <= 5).length; // Using 5 as default min stock
    const outOfStockCount = variants.filter((v: any) => (v.stock_quantity || 0) === 0).length;
    const priceRange = variants.length > 0 ? {
      min: Math.min(...variants.map((v: any) => v.price_adjustment || 0)),
      max: Math.max(...variants.map((v: any) => v.price_adjustment || 0))
    } : { min: 0, max: 0 };

    return { totalQuantity, totalValue, lowStockCount, outOfStockCount, priceRange, variantCount: variants.length };
  };

  // Loading state
  if (productsLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Products</h2>
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Loading products from database...</span>
        </div>
      </div>
    );
  }

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
              {categories.map(category => (
                <option key={category.id} value={category.name}>{category.name}</option>
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
                  const variants = getProductVariants(product.id);
                  const stats = getProductStats(product.id);
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
                              src={getProductImage(product)} 
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover object-top mr-4"
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                              <div className="text-sm text-gray-500">{product.supplier_name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.sku}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.category_name}</td>
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
                          <div className="text-sm text-gray-900">{product.quantity + stats.totalQuantity}</div>
                          <div className="text-xs text-gray-500">Total units</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${product.price} {stats.priceRange.max > 0 && `- $${product.price + stats.priceRange.max}`}
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
                            <button 
                              onClick={() => handleDeleteProduct(product.id)}
                              className="w-8 h-8 flex items-center justify-center text-red-600 hover:text-red-900 cursor-pointer"
                              disabled={isSubmitting}
                            >
                              <i className="ri-delete-bin-line"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                      {isExpanded && variants.map((variant: any) => {
                        const variantLocations = getProductLocations(variant.sku_suffix || variant.sku);
                        return (
                          <tr key={`variant-${variant.id}`} className="bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center pl-8">
                                <img 
                                  src={getVariantImage(variant, product)} 
                                  alt={variant.variant_name}
                                  className="w-10 h-10 rounded-lg object-cover object-top mr-3"
                                />
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{variant.variant_name}</div>
                                  <div className="text-xs text-gray-500">
                                    {variant.variant_value}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{variant.sku_suffix}</td>
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
                              <div className="text-sm text-gray-900">{variant.stock_quantity}</div>
                              <div className="text-xs text-gray-500">Variant stock</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ${product.price + (variant.price_adjustment || 0)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(variant.status || 'active')}`}>
                                {variant.status || 'Active'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button 
                                  onClick={() => {
                                    setVariantFormData({
                                      product_id: variant.product_id,
                                      variant_name: variant.variant_name,
                                      variant_value: variant.variant_value,
                                      sku_suffix: variant.sku_suffix,
                                      price_adjustment: variant.price_adjustment,
                                      stock_quantity: variant.stock_quantity
                                    });
                                    setSelectedProduct(variant);
                                    setIsEditModalOpen(true);
                                  }}
                                  className="w-8 h-8 flex items-center justify-center text-blue-600 hover:text-blue-900 cursor-pointer"
                                >
                                  <i className="ri-edit-line"></i>
                                </button>
                                <button 
                                  onClick={() => deleteVariant(variant.id)}
                                  className="w-8 h-8 flex items-center justify-center text-red-600 hover:text-red-900 cursor-pointer"
                                >
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
                {filteredVariants.map((variant: any) => {
                  const variantLocations = getProductLocations(variant.sku_suffix || '');
                  const parentProduct = products.find(p => p.id === variant.product_id);
                  return (
                    <tr key={variant.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img 
                            src={getVariantImage(variant, parentProduct)}
                            alt={variant.variant_name}
                            className="w-12 h-12 rounded-lg object-cover object-top mr-4"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{variant.variant_name}</div>
                            <div className="text-sm text-gray-500">{parentProduct?.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{parentProduct?.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{variant.sku_suffix}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          <span className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                            {variant.variant_name}: {variant.variant_value}
                          </span>
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
                        <div className="text-sm text-gray-900">{variant.stock_quantity}</div>
                        <div className="text-xs text-gray-500">Variant stock</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${(parentProduct?.price || 0) + (variant.price_adjustment || 0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(variant.status || 'active')}`}>
                          {variant.status || 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => {
                              setVariantFormData({
                                product_id: variant.product_id,
                                variant_name: variant.variant_name,
                                variant_value: variant.variant_value,
                                sku_suffix: variant.sku_suffix,
                                price_adjustment: variant.price_adjustment,
                                stock_quantity: variant.stock_quantity
                              });
                              setSelectedProduct(variant);
                              setIsEditModalOpen(true);
                            }}
                            className="w-8 h-8 flex items-center justify-center text-blue-600 hover:text-blue-900 cursor-pointer"
                          >
                            <i className="ri-edit-line"></i>
                          </button>
                          <button 
                            onClick={() => deleteVariant(variant.id)}
                            className="w-8 h-8 flex items-center justify-center text-red-600 hover:text-red-900 cursor-pointer"
                          >
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
              <select 
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                value={variantFormData.product_id}
                onChange={(e) => setVariantFormData({...variantFormData, product_id: e.target.value})}
              >
                <option value="">Select Parent Product</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>{product.name}</option>
                ))}
              </select>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {viewMode === 'products' ? (
              <>
                <Input 
                  label="Product Name" 
                  placeholder="Enter name" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
                <Input 
                  label="SKU" 
                  placeholder="Enter SKU" 
                  value={formData.sku}
                  onChange={(e) => setFormData({...formData, sku: e.target.value})}
                />
              </>
            ) : (
              <>
                <Input 
                  label="Variant Name" 
                  placeholder="e.g., Color, Size" 
                  value={variantFormData.variant_name}
                  onChange={(e) => setVariantFormData({...variantFormData, variant_name: e.target.value})}
                />
                <Input 
                  label="Variant Value" 
                  placeholder="e.g., Red, Large" 
                  value={variantFormData.variant_value}
                  onChange={(e) => setVariantFormData({...variantFormData, variant_value: e.target.value})}
                />
              </>
            )}
          </div>
          {viewMode === 'products' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select 
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                  value={formData.category_id}
                  onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                <select 
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                  value={formData.supplier_id}
                  onChange={(e) => setFormData({...formData, supplier_id: e.target.value})}
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map(supplier => (
                    <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
          {viewMode === 'variants' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="SKU Suffix" 
                placeholder="e.g., -RED" 
                value={variantFormData.sku_suffix}
                onChange={(e) => setVariantFormData({...variantFormData, sku_suffix: e.target.value})}
              />
              <Input 
                label="Price Adjustment" 
                type="number" 
                step="0.01" 
                placeholder="0.00" 
                value={variantFormData.price_adjustment}
                onChange={(e) => setVariantFormData({...variantFormData, price_adjustment: parseFloat(e.target.value) || 0})}
              />
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {viewMode === 'products' ? (
              <>
                <Input 
                  label="Quantity" 
                  type="number" 
                  placeholder="0" 
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 0})}
                />
                <Input 
                  label="Min Stock" 
                  type="number" 
                  placeholder="0" 
                  value={formData.min_stock_level}
                  onChange={(e) => setFormData({...formData, min_stock_level: parseInt(e.target.value) || 0})}
                />
                <Input 
                  label="Price" 
                  type="number" 
                  step="0.01" 
                  placeholder="0.00" 
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                />
              </>
            ) : (
              <Input 
                label="Stock Quantity" 
                type="number" 
                placeholder="0" 
                value={variantFormData.stock_quantity}
                onChange={(e) => setVariantFormData({...variantFormData, stock_quantity: parseInt(e.target.value) || 0})}
              />
            )}
          </div>
          
          {viewMode === 'products' && (
            <>
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
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </>
          )}
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={viewMode === 'products' ? handleAddProduct : handleAddVariant}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : `Add ${viewMode === 'products' ? 'Product' : 'Variant'}`}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={selectedProduct?.variant_name ? "Edit Variant" : "Edit Product"}
        size="lg"
      >
        {selectedProduct && (
          <div className="space-y-4">
            {selectedProduct.variant_name ? (
              // Variant editing form
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input 
                    label="Variant Name" 
                    value={variantFormData.variant_name}
                    onChange={(e) => setVariantFormData({...variantFormData, variant_name: e.target.value})}
                  />
                  <Input 
                    label="Variant Value" 
                    value={variantFormData.variant_value}
                    onChange={(e) => setVariantFormData({...variantFormData, variant_value: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input 
                    label="SKU Suffix" 
                    value={variantFormData.sku_suffix}
                    onChange={(e) => setVariantFormData({...variantFormData, sku_suffix: e.target.value})}
                  />
                  <Input 
                    label="Price Adjustment" 
                    type="number" 
                    step="0.01" 
                    value={variantFormData.price_adjustment}
                    onChange={(e) => setVariantFormData({...variantFormData, price_adjustment: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <Input 
                  label="Stock Quantity" 
                  type="number" 
                  value={variantFormData.stock_quantity}
                  onChange={(e) => setVariantFormData({...variantFormData, stock_quantity: parseInt(e.target.value) || 0})}
                />
              </>
            ) : (
              // Product editing form
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input 
                    label="Product Name" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                  <Input 
                    label="SKU" 
                    value={formData.sku}
                    onChange={(e) => setFormData({...formData, sku: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select 
                      value={formData.category_id}
                      onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                    >
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                    <select 
                      value={formData.supplier_id}
                      onChange={(e) => setFormData({...formData, supplier_id: e.target.value})}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                    >
                      {suppliers.map(supplier => (
                        <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input 
                    label="Quantity" 
                    type="number" 
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 0})}
                  />
                  <Input 
                    label="Min Stock" 
                    type="number" 
                    value={formData.min_stock_level}
                    onChange={(e) => setFormData({...formData, min_stock_level: parseInt(e.target.value) || 0})}
                  />
                  <Input 
                    label="Price" 
                    type="number" 
                    step="0.01" 
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                  />
                </div>
                
                {/* Current Locations */}
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Current Locations</h4>
                  <div className="space-y-2">
                    {getProductLocations(selectedProduct.sku).map((location: any) => (
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea 
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Enter description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </>
            )}
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={selectedProduct.variant_name ? handleUpdateVariant : handleUpdateProduct}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
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
              {getProductVariants(selectedProduct.id).map((variant: any) => (
                <div key={variant.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <img 
                      src={getVariantImage(variant, selectedProduct)}
                      alt={variant.variant_name}
                      className="w-12 h-12 rounded-lg object-cover object-top"
                    />
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(variant.status || 'active')}`}>
                      {variant.status || 'Active'}
                    </span>
                  </div>
                  
                  <h4 className="font-medium text-gray-900 mb-2">{variant.variant_name}</h4>
                  <p className="text-sm text-gray-600 mb-3">Value: {variant.variant_value}</p>
                  <p className="text-sm text-gray-600 mb-3">SKU: {variant.sku_suffix}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Stock:</span>
                      <span className="font-medium text-gray-900">{variant.stock_quantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price Adj:</span>
                      <span className="font-medium text-gray-900">${variant.price_adjustment || 0}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 mt-4">
                    <button 
                      onClick={() => {
                        setVariantFormData({
                          product_id: variant.product_id,
                          variant_name: variant.variant_name,
                          variant_value: variant.variant_value,
                          sku_suffix: variant.sku_suffix,
                          price_adjustment: variant.price_adjustment,
                          stock_quantity: variant.stock_quantity
                        });
                        setSelectedProduct(variant);
                        setIsEditModalOpen(true);
                      }}
                      className="flex-1 px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => deleteVariant(variant.id)}
                      className="flex-1 px-3 py-1 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200 cursor-pointer"
                    >
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
