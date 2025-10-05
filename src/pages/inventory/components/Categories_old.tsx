
import { useState } from 'react';
import { useCategories, useProducts, useProductVariants } from '../../../hooks/useDatabase';
import { warehouses, locations } from '../../../mocks/inventory';
import Button from '../../../components/base/Button';
import Input from '../../../components/base/Input';
import Modal from '../../../components/base/Modal';

export default function Categories() {
  // Database hooks for real-time data
  const { categories } = useCategories();
  const { products } = useProducts();
  const { variants: productVariants } = useProductVariants();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  const filteredCategories = categories.filter(category =>
    (category.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Organize categories hierarchically
  const mainCategories = filteredCategories.filter(c => c.parent_id === null);
  const subCategories = filteredCategories.filter(c => c.parent_id !== null);

  const handleEdit = (category: any) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const handleView = (category: any) => {
    setSelectedCategory(category);
    setIsViewModalOpen(true);
  };

  // Calculate statistics from database categories
  const totalCategories = categories.length;
  const activeCategories = categories.filter(c => c.status === 'active').length;
  const mainCategoriesCount = mainCategories.length;
  const subCategoriesCount = subCategories.length;

  const getCategoryStats = (categoryId: string) => {
    const categoryProducts = products.filter(p => p.category_id === categoryId);
    const categoryVariants = productVariants.filter(v => 
      categoryProducts.some(p => p.id === v.product_id)
    );
    
    const totalProducts = categoryProducts.length;
    const totalVariants = categoryVariants.length;
    const totalQuantity = categoryProducts.reduce((sum, p) => sum + (p.quantity || 0), 0) + 
                         categoryVariants.reduce((sum, v) => sum + (v.stock_quantity || 0), 0);
    // For variants, calculate price with adjustment
    const variantValue = categoryVariants.reduce((sum, v) => {
      const product = categoryProducts.find(p => p.id === v.product_id);
      const finalPrice = product ? product.price + (v.price_adjustment || 0) : 0;
      return sum + (finalPrice * (v.stock_quantity || 0));
    }, 0);
    const totalValue = categoryProducts.reduce((sum, p) => sum + (p.price * (p.quantity || 0)), 0) + variantValue;
    
    const lowStockItems = categoryProducts.filter(p => (p.quantity || 0) <= (p.min_stock_level || 0)).length + 
                         categoryVariants.filter(v => (v.stock_quantity || 0) <= 5).length; // Default min stock for variants
    
    return {
      totalProducts,
      totalVariants,
      totalQuantity,
      totalValue,
      lowStockItems
    };
  };

  const getCategoryProducts = (categoryId: string) => {
    return products.filter(p => p.category_id === categoryId);
  };

  const getCategoryVariants = (categoryId: string) => {
    const categoryProducts = getCategoryProducts(categoryId);
    return productVariants.filter(v => 
      categoryProducts.some(p => p.id === v.product_id)
    );
  };
    return productVariants.filter(v =>
      categoryProducts.some(p => p.id === v.product_id)
    );
  };

  const getProductLocations = (sku: string) => {
    return locations.filter(l => l.productSku === sku);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
          <p className="text-gray-600">Organize products by categories with warehouse tracking</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <i className="ri-add-line mr-2"></i>
          Add Category
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="secondary">
            <i className="ri-filter-line mr-2"></i>
            Filter
          </Button>
          <Button variant="secondary">
            <i className="ri-download-line mr-2"></i>
            Export
          </Button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => {
          const stats = getCategoryStats(category.name);
          
          return (
            <div key={category.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                    <i className="ri-folder-line text-white text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleView(category)}
                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-600 cursor-pointer"
                  >
                    <i className="ri-eye-line"></i>
                  </button>
                  <button 
                    onClick={() => handleEdit(category)}
                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-600 cursor-pointer"
                  >
                    <i className="ri-edit-line"></i>
                  </button>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Products</span>
                  <span className="text-sm font-medium text-gray-900">{stats.totalProducts}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Variants</span>
                  <span className="text-sm font-medium text-gray-900">{stats.totalVariants}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Stock</span>
                  <span className="text-sm font-medium text-gray-900">{stats.totalQuantity.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Value</span>
                  <span className="text-sm font-medium text-gray-900">${stats.totalValue.toLocaleString()}</span>
                </div>
                
                {stats.lowStockItems > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Low Stock Items</span>
                    <span className="text-sm font-medium text-red-600">{stats.lowStockItems}</span>
                  </div>
                )}
              </div>

              {/* Warehouse Distribution */}
              {stats.warehouseDistribution.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Warehouse Distribution</h4>
                  <div className="space-y-2">
                    {stats.warehouseDistribution.slice(0, 3).map(([warehouseName, quantity]) => (
                      <div key={warehouseName} className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">{warehouseName}</span>
                        <span className="text-xs font-medium text-gray-900">{quantity}</span>
                      </div>
                    ))}
                    {stats.warehouseDistribution.length > 3 && (
                      <div className="text-xs text-blue-600 cursor-pointer" onClick={() => handleView(category)}>
                        +{stats.warehouseDistribution.length - 3} more warehouses
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4 text-center pt-4 border-t border-gray-200 mt-4">
                <div>
                  <p className="text-lg font-semibold text-gray-900">{stats.totalProducts + stats.totalVariants}</p>
                  <p className="text-xs text-gray-600">Total Items</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">{stats.warehouseDistribution.length}</p>
                  <p className="text-xs text-gray-600">Warehouses</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-green-600">
                    {stats.totalQuantity > 0 ? Math.round(((stats.totalQuantity - stats.lowStockItems) / stats.totalQuantity) * 100) : 0}%
                  </p>
                  <p className="text-xs text-gray-600">Healthy Stock</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Category Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Category"
        size="md"
      >
        <div className="space-y-4">
          <Input label="Category Name" placeholder="Enter category name" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Enter category description"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsAddModalOpen(false)}>
              Add Category
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Category Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Category"
        size="md"
      >
        {selectedCategory && (
          <div className="space-y-4">
            <Input label="Category Name" defaultValue={selectedCategory.name} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea 
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                defaultValue={selectedCategory.description}
              />
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

      {/* View Category Details Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={selectedCategory ? `${selectedCategory.name} - Details` : 'Category Details'}
        size="xl"
      >
        {selectedCategory && (
          <div className="space-y-6">
            {/* Category Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {(() => {
                const stats = getCategoryStats(selectedCategory.name);
                return (
                  <>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-blue-600">{stats.totalProducts}</div>
                      <div className="text-sm text-blue-600">Products</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-purple-600">{stats.totalVariants}</div>
                      <div className="text-sm text-purple-600">Variants</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-green-600">{stats.totalQuantity.toLocaleString()}</div>
                      <div className="text-sm text-green-600">Total Stock</div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-orange-600">${stats.totalValue.toLocaleString()}</div>
                      <div className="text-sm text-orange-600">Total Value</div>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Warehouse Distribution */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Warehouse Distribution</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getCategoryStats(selectedCategory.name).warehouseDistribution.map(([warehouseName, quantity]) => (
                  <div key={warehouseName} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{warehouseName}</div>
                        <div className="text-sm text-gray-600">Stock Quantity</div>
                      </div>
                      <div className="text-xl font-bold text-gray-900">{quantity}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Products in Category */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Products in Category</h4>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Variants</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Locations</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {getCategoryProducts(selectedCategory.name).map((product) => {
                      const variants = productVariants.filter(v => v.product_id === product.id);
                      const productLocations = getProductLocations(product.sku);
                      const totalVariantStock = variants.reduce((sum, v) => sum + (v.stock_quantity || 0), 0);
                      // Calculate variant value with price adjustments
                      const variantValue = variants.reduce((sum, v) => {
                        const finalPrice = product.price + (v.price_adjustment || 0);
                        return sum + (finalPrice * (v.stock_quantity || 0));
                      }, 0);
                      const totalValue = (product.price * (product.quantity || 0)) + variantValue;
                      
                      return (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <img 
                                src={product.image_url || 'https://images.unsplash.com/photo-1560472355-536de3962603?w=400&h=300&fit=crop'} 
                                alt={product.name}
                                className="w-10 h-10 rounded-lg object-cover object-top mr-3"
                              />
                              <div>
                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                <div className="text-xs text-gray-500">{product.sku}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">{variants.length}</td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-gray-900">{productLocations.length} locations</div>
                            {productLocations.length > 0 && (
                              <div className="text-xs text-gray-500">
                                {warehouses.find(w => w.id === productLocations[0].warehouseId)?.name}
                                {productLocations.length > 1 && ` +${productLocations.length - 1} more`}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">{(product.quantity || 0) + totalVariantStock}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">${totalValue.toLocaleString()}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              product.status === 'In Stock' ? 'bg-green-100 text-green-800' :
                              product.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {product.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Variants in Category */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Product Variants</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getCategoryVariants(selectedCategory.name).map((variant) => {
                  const product = products.find(p => p.id === variant.product_id);
                  const fullSku = product ? `${product.sku}${variant.sku_suffix || ''}` : variant.sku_suffix;
                  const variantLocations = getProductLocations(fullSku || '');
                  return (
                    <div key={variant.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <img 
                          src={variant.image_url || product?.image_url || 'https://images.unsplash.com/photo-1560472355-536de3962603?w=400&h=300&fit=crop'} 
                          alt={`${variant.variant_name}: ${variant.variant_value}`}
                          className="w-12 h-12 rounded-lg object-cover object-top mr-3"
                        />
                        <div>
                          <h5 className="font-medium text-gray-900">{variant.variant_name}: {variant.variant_value}</h5>
                          <p className="text-xs text-gray-500">{fullSku}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Stock:</span>
                          <span className="font-medium text-gray-900">{variant.stock_quantity || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Price:</span>
                          <span className="font-medium text-gray-900">${((product?.price || 0) + (variant.price_adjustment || 0)).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Locations:</span>
                          <span className="font-medium text-gray-900">{variantLocations.length}</span>
                        </div>
                      </div>
                      
                        <div className="mt-3">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            variant.status === 'active' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {variant.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
