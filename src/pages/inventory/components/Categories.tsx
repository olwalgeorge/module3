import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { products, productVariants } from '../../../mocks/inventory';

export default function Categories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div></div>;
  if (error) return <div className="text-red-600 text-center p-4">Error: {error}</div>;

  // Filter categories by hierarchy
  const mainCategories = categories.filter(c => !c.parent_id);
  const subCategories = categories.filter(c => c.parent_id);

  // Calculate statistics
  const totalCategories = categories.length;
  const activeCategories = categories.filter(c => c.status === 'active').length;
  const mainCategoriesCount = mainCategories.length;
  const subCategoriesCount = subCategories.length;

  const getCategoryStats = (categoryId: string) => {
    // For mock data, we need to match by category name since products use category field
    const category = categories.find(c => c.id === categoryId);
    if (!category) return { totalProducts: 0, totalVariants: 0, totalQuantity: 0, totalValue: 0, lowStockItems: 0 };
    
    const categoryProducts = products.filter(p => p.category === category.name);
    const categoryVariants = productVariants.filter(v => 
      categoryProducts.some(p => p.name === v.parentProduct)
    );
    
    const totalProducts = categoryProducts.length;
    const totalVariants = categoryVariants.length;
    const totalQuantity = categoryProducts.reduce((sum, p) => sum + (p.quantity || 0), 0) + 
                         categoryVariants.reduce((sum, v) => sum + (v.quantity || 0), 0);
    
    const variantValue = categoryVariants.reduce((sum, v) => {
      return sum + (v.price * (v.quantity || 0));
    }, 0);
    const totalValue = categoryProducts.reduce((sum, p) => sum + (p.price * (p.quantity || 0)), 0) + variantValue;
    
    const lowStockItems = categoryProducts.filter(p => (p.quantity || 0) <= (p.minStock || 0)).length + 
                         categoryVariants.filter(v => (v.quantity || 0) <= (v.minStock || 5)).length;
    
    return {
      totalProducts,
      totalVariants,
      totalQuantity,
      totalValue,
      lowStockItems
    };
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Categories</p>
              <p className="text-2xl font-bold text-gray-900">{totalCategories}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Categories</p>
              <p className="text-2xl font-bold text-gray-900">{activeCategories}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Main Categories</p>
              <p className="text-2xl font-bold text-gray-900">{mainCategoriesCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.997 1.997 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Subcategories</p>
              <p className="text-2xl font-bold text-gray-900">{subCategoriesCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Categories List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Category Hierarchy</h3>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {mainCategories.map((category) => {
              const categoryStats = getCategoryStats(category.id);
              const subcategoriesForCategory = subCategories.filter(
                sub => sub.parent_id === category.id
              );

              return (
                <div key={category.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{category.name}</h4>
                        <p className="text-sm text-gray-600">{category.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        category.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {category.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        Created: {new Date(category.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Category Stats */}
                  <div className="grid grid-cols-5 gap-4 mb-4 text-sm">
                    <div className="bg-gray-50 rounded p-3 text-center">
                      <div className="font-semibold text-gray-900">{categoryStats.totalProducts}</div>
                      <div className="text-gray-600">Products</div>
                    </div>
                    <div className="bg-gray-50 rounded p-3 text-center">
                      <div className="font-semibold text-gray-900">{categoryStats.totalVariants}</div>
                      <div className="text-gray-600">Variants</div>
                    </div>
                    <div className="bg-gray-50 rounded p-3 text-center">
                      <div className="font-semibold text-gray-900">{categoryStats.totalQuantity}</div>
                      <div className="text-gray-600">Quantity</div>
                    </div>
                    <div className="bg-gray-50 rounded p-3 text-center">
                      <div className="font-semibold text-gray-900">${categoryStats.totalValue.toFixed(2)}</div>
                      <div className="text-gray-600">Value</div>
                    </div>
                    <div className="bg-gray-50 rounded p-3 text-center">
                      <div className={`font-semibold ${categoryStats.lowStockItems > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {categoryStats.lowStockItems}
                      </div>
                      <div className="text-gray-600">Low Stock</div>
                    </div>
                  </div>

                  {/* Subcategories */}
                  {subcategoriesForCategory.length > 0 && (
                    <div className="ml-6">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Subcategories:</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {subcategoriesForCategory.map((subcategory) => {
                          const subStats = getCategoryStats(subcategory.id);
                          return (
                            <div key={subcategory.id} className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                  <span className="font-medium text-gray-900 text-sm">{subcategory.name}</span>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  subcategory.status === 'active' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {subcategory.status}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 mb-2">{subcategory.description}</p>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="text-center">
                                  <div className="font-semibold text-gray-800">{subStats.totalProducts}</div>
                                  <div className="text-gray-600">Products</div>
                                </div>
                                <div className="text-center">
                                  <div className="font-semibold text-gray-800">${subStats.totalValue.toFixed(2)}</div>
                                  <div className="text-gray-600">Value</div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Categories without hierarchy (backup view) */}
      {categories.length > 0 && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">All Categories</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => {
                const stats = getCategoryStats(category.id);
                const parentCategory = categories.find(c => c.id === category.parent_id);
                
                return (
                  <div key={category.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{category.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        category.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {category.status}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                    
                    {parentCategory && (
                      <p className="text-xs text-gray-500 mb-2">
                        Parent: {parentCategory.name}
                      </p>
                    )}
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-gray-50 rounded p-2 text-center">
                        <div className="font-semibold text-gray-800">{stats.totalProducts}</div>
                        <div className="text-gray-600">Products</div>
                      </div>
                      <div className="bg-gray-50 rounded p-2 text-center">
                        <div className="font-semibold text-gray-800">${stats.totalValue.toFixed(2)}</div>
                        <div className="text-gray-600">Value</div>
                      </div>
                    </div>
                    
                    <div className="mt-2 text-xs text-gray-500">
                      Created: {new Date(category.created_at).toLocaleDateString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
