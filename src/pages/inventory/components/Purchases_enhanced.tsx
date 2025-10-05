import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useCurrency } from '../../../hooks/useCurrency';

export default function Purchases() {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSupplier, setSelectedSupplier] = useState('all');

  const { formatCurrency } = useCurrency();

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('purchases')
        .select('*')
        .order('order_date', { ascending: false });

      if (error) throw error;
      setPurchases(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div></div>;
  if (error) return <div className="text-red-600 text-center p-4">Error: {error}</div>;

  // Filter purchases
  const filteredPurchases = purchases.filter(purchase => {
    const matchesSearch = purchase.purchase_order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         purchase.supplier_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || purchase.status === selectedStatus;
    const matchesSupplier = selectedSupplier === 'all' || purchase.supplier_name === selectedSupplier;
    
    return matchesSearch && matchesStatus && matchesSupplier;
  });

  // Calculate statistics
  const totalPurchases = purchases.length;
  const totalValue = purchases.reduce((sum, purchase) => sum + purchase.total_amount, 0);
  const pendingPurchases = purchases.filter(p => p.status === 'pending').length;
  const deliveredPurchases = purchases.filter(p => p.status === 'delivered').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'in_transit': return 'bg-blue-100 text-blue-800';
      case 'ordered': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-purple-100 text-purple-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return '✅';
      case 'in_transit': return '🚚';
      case 'ordered': return '📋';
      case 'approved': return '👍';
      case 'pending': return '⏳';
      case 'rejected': return '❌';
      case 'cancelled': return '🚫';
      default: return '📄';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Purchases</p>
              <p className="text-2xl font-bold text-gray-900">{totalPurchases}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalValue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-900">{pendingPurchases}</p>
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
              <p className="text-sm font-medium text-gray-600">Delivered</p>
              <p className="text-2xl font-bold text-gray-900">{deliveredPurchases}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search purchases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="ordered">Ordered</option>
              <option value="in_transit">In Transit</option>
              <option value="delivered">Delivered</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Supplier</label>
            <select
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Suppliers</option>
              {Array.from(new Set(purchases.map(p => p.supplier_name))).map(supplier => (
                <option key={supplier} value={supplier}>{supplier}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={fetchPurchases}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Purchase Orders List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Purchase Orders</h3>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {filteredPurchases.map((purchase) => {
              const purchaseData = purchase.notes ? JSON.parse(purchase.notes) : {};
              const items = purchase.items ? JSON.parse(purchase.items) : [];
              const totalItems = items.reduce((sum: number, item: any) => sum + item.quantity, 0);

              return (
                <div key={purchase.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="text-2xl">{getStatusIcon(purchase.status)}</div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{purchase.purchase_order_number}</h4>
                        <p className="text-sm text-gray-600">{purchase.supplier_name}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(purchase.status)}`}>
                            {purchase.status.replace('_', ' ').toUpperCase()}
                          </span>
                          {purchaseData.priority && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(purchaseData.priority)}`}>
                              {purchaseData.priority.toUpperCase()} PRIORITY
                            </span>
                          )}
                          {purchaseData.category && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                              {purchaseData.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {purchase.currency} {purchase.total_amount.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">
                        {items.length} items • {totalItems} units
                      </div>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Order Information</h5>
                      <div className="space-y-1 text-sm">
                        <div>Order Date: {new Date(purchase.order_date).toLocaleDateString()}</div>
                        {purchase.expected_delivery_date && (
                          <div>Expected: {new Date(purchase.expected_delivery_date).toLocaleDateString()}</div>
                        )}
                        {purchase.actual_delivery_date && (
                          <div>Delivered: {new Date(purchase.actual_delivery_date).toLocaleDateString()}</div>
                        )}
                        <div>Payment: {purchase.payment_method}</div>
                        <div>Terms: {purchase.payment_terms}</div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Financial Breakdown</h5>
                      <div className="space-y-1 text-sm">
                        <div>Subtotal: {purchase.currency} {(purchase.total_amount - purchase.tax_amount - purchase.shipping_cost + purchase.discount_amount).toLocaleString()}</div>
                        {purchase.discount_amount > 0 && (
                          <div className="text-green-600">Discount: -{purchase.currency} {purchase.discount_amount.toLocaleString()}</div>
                        )}
                        {purchase.shipping_cost > 0 && (
                          <div>Shipping: {purchase.currency} {purchase.shipping_cost.toLocaleString()}</div>
                        )}
                        {purchase.tax_amount > 0 && (
                          <div>Tax: {purchase.currency} {purchase.tax_amount.toLocaleString()}</div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Business Information</h5>
                      <div className="space-y-1 text-sm">
                        {purchaseData.business_unit && (
                          <div>Business Unit: {purchaseData.business_unit}</div>
                        )}
                        {purchaseData.cost_center && (
                          <div>Cost Center: {purchaseData.cost_center}</div>
                        )}
                        {purchaseData.approval_workflow?.approved_by && (
                          <div>Approved By: {purchaseData.approval_workflow.approved_by}</div>
                        )}
                        {purchase.warehouse_name && (
                          <div>Warehouse: {purchase.warehouse_name}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Items Preview */}
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">Items ({items.length})</h5>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {items.slice(0, 6).map((item: any, index: number) => (
                          <div key={index} className="bg-white rounded p-3 text-sm">
                            <div className="font-medium text-gray-900">{item.product_name}</div>
                            <div className="text-gray-600">SKU: {item.sku}</div>
                            <div className="flex justify-between mt-1">
                              <span>Qty: {item.quantity}</span>
                              <span className="font-medium">{purchase.currency} {item.total_cost.toLocaleString()}</span>
                            </div>
                            {item.specifications && (
                              <div className="text-xs text-gray-500 mt-1">
                                {Object.entries(item.specifications).slice(0, 2).map(([key, value]) => (
                                  <span key={key} className="mr-2">{key}: {String(value)}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                        {items.length > 6 && (
                          <div className="bg-white rounded p-3 text-sm flex items-center justify-center text-gray-500">
                            +{items.length - 6} more items
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Logistics & Tracking */}
                  {purchaseData.logistics && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <h5 className="font-medium text-blue-900 mb-2">🚚 Logistics Information</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
                        {purchaseData.logistics.carrier && (
                          <div>Carrier: {purchaseData.logistics.carrier}</div>
                        )}
                        {purchaseData.logistics.tracking_number && (
                          <div>Tracking: {purchaseData.logistics.tracking_number}</div>
                        )}
                        {purchaseData.logistics.total_weight && (
                          <div>Weight: {purchaseData.logistics.total_weight}</div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Vendor Performance */}
                  {purchaseData.vendor_performance && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <h5 className="font-medium text-green-900 mb-2">⭐ Vendor Performance</h5>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-green-800">
                        {purchaseData.vendor_performance.quality_rating && (
                          <div>Quality: {purchaseData.vendor_performance.quality_rating}/5</div>
                        )}
                        {purchaseData.vendor_performance.delivery_rating && (
                          <div>Delivery: {purchaseData.vendor_performance.delivery_rating}/5</div>
                        )}
                        {purchaseData.vendor_performance.communication_rating && (
                          <div>Communication: {purchaseData.vendor_performance.communication_rating}/5</div>
                        )}
                        {purchaseData.vendor_performance.overall_satisfaction && (
                          <div>Overall: {purchaseData.vendor_performance.overall_satisfaction}/5</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {filteredPurchases.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-4xl mb-4">📦</div>
              <p className="text-gray-500">No purchase orders found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
