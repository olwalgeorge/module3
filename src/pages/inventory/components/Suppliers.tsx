
import { useState } from 'react';
import { useSuppliers } from '../../../hooks/useDatabase';
import Button from '../../../components/base/Button';
import Input from '../../../components/base/Input';
import Modal from '../../../components/base/Modal';

export default function Suppliers() {
  // Database hooks for real-time data
  const { suppliers } = useSuppliers();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);

  // Helper function to parse supplier notes JSON safely
  const parseSupplierNotes = (notes: string | null) => {
    if (!notes) return {};
    try {
      return JSON.parse(notes);
    } catch {
      return {};
    }
  };

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = 
      (supplier.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (supplier.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (supplier.phone || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || (supplier.status || '').toLowerCase() === selectedStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    const statusLower = (status || '').toLowerCase();
    switch (statusLower) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEdit = (supplier: any) => {
    setSelectedSupplier(supplier);
    setIsEditModalOpen(true);
  };

  // Calculate statistics from database suppliers
  const totalSuppliers = suppliers.length;
  const activeSuppliers = suppliers.filter(s => (s.status || '').toLowerCase() === 'active').length;
  const totalOrders = suppliers.reduce((sum, supplier) => {
    const notes = parseSupplierNotes(supplier.notes);
    return sum + (notes.totalOrders || 0);
  }, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Suppliers</h2>
          <p className="text-gray-600">Manage your supplier relationships</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <i className="ri-add-line mr-2"></i>
          Add Supplier
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Suppliers</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{totalSuppliers}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <i className="ri-truck-line text-white text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Suppliers</p>
              <p className="text-2xl font-bold text-green-600 mt-2">{activeSuppliers}</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <i className="ri-check-line text-white text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Top Supplier</p>
              <p className="text-lg font-bold text-gray-900 mt-2">TechCorp Ltd</p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <i className="ri-star-line text-white text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-orange-600 mt-2">{totalOrders}</p>
            </div>
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <i className="ri-shopping-bag-line text-white text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Search suppliers..."
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          
          <Button variant="secondary">
            <i className="ri-download-line mr-2"></i>
            Export
          </Button>
        </div>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.map((supplier) => {
          const notes = parseSupplierNotes(supplier.notes);
          
          return (
            <div key={supplier.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-lg">
                      {(supplier.name || 'S').charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{supplier.name || 'Unknown Supplier'}</h3>
                    <p className="text-sm text-gray-500">{notes.category || 'General'}</p>
                  </div>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(supplier.status || 'inactive')}`}>
                  {supplier.status || 'Inactive'}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <i className="ri-mail-line w-4 h-4 mr-2"></i>
                  <span className="truncate">{supplier.email || 'No email'}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <i className="ri-phone-line w-4 h-4 mr-2"></i>
                  <span>{supplier.phone || 'No phone'}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <i className="ri-map-pin-line w-4 h-4 mr-2"></i>
                  <span className="truncate">{supplier.address || 'No address'}</span>
                </div>
                {supplier.country && (
                  <div className="flex items-center text-sm text-gray-600">
                    <i className="ri-global-line w-4 h-4 mr-2"></i>
                    <span>{supplier.country}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">{notes.totalOrders || 0}</p>
                  <p className="text-xs text-gray-500">Total Orders</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-green-600">
                    {notes.currency || 'USD'} {(notes.totalValue || 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">Total Value</p>
                </div>
              </div>

              {/* Enhanced metadata display */}
              {(notes.rating || notes.qualityScore || notes.onTimeDelivery) && (
                <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-blue-50 rounded-lg">
                  {notes.rating && (
                    <div className="text-center">
                      <p className="text-sm font-bold text-blue-600">{notes.rating}/5</p>
                      <p className="text-xs text-gray-500">Rating</p>
                    </div>
                  )}
                  {notes.qualityScore && (
                    <div className="text-center">
                      <p className="text-sm font-bold text-purple-600">{notes.qualityScore}%</p>
                      <p className="text-xs text-gray-500">Quality</p>
                    </div>
                  )}
                  {notes.onTimeDelivery && (
                    <div className="text-center">
                      <p className="text-sm font-bold text-green-600">{notes.onTimeDelivery}%</p>
                      <p className="text-xs text-gray-500">On-Time</p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex space-x-2">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => handleEdit(supplier)}
                  className="flex-1"
                >
                  <i className="ri-edit-line mr-1"></i>
                  Edit
                </Button>
                <Button variant="secondary" size="sm" className="flex-1">
                  <i className="ri-eye-line mr-1"></i>
                  View
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Supplier Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Supplier"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Supplier Name" placeholder="Enter supplier name" />
            <Input label="Contact Person" placeholder="Enter contact person" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Email" type="email" placeholder="supplier@example.com" />
            <Input label="Phone" placeholder="+1 (555) 123-4567" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8">
                <option>Electronics</option>
                <option>Office Supplies</option>
                <option>Manufacturing</option>
                <option>Software</option>
                <option>Services</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8">
                <option>Active</option>
                <option>Inactive</option>
                <option>Pending</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea 
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
              placeholder="Enter supplier address"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Website" placeholder="https://supplier.com" />
            <Input label="Tax ID" placeholder="Enter tax identification" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea 
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Additional notes about this supplier"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsAddModalOpen(false)}>
              Add Supplier
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Supplier Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Supplier"
        size="lg"
      >
        {selectedSupplier && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Supplier Name" defaultValue={selectedSupplier.name} />
              <Input label="Contact Person" defaultValue={selectedSupplier.contactPerson} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Email" type="email" defaultValue={selectedSupplier.email} />
              <Input label="Phone" defaultValue={selectedSupplier.phone} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select 
                  defaultValue={selectedSupplier.category}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                >
                  <option>Electronics</option>
                  <option>Office Supplies</option>
                  <option>Manufacturing</option>
                  <option>Software</option>
                  <option>Services</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select 
                  defaultValue={selectedSupplier.status}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                >
                  <option>Active</option>
                  <option>Inactive</option>
                  <option>Pending</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea 
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                defaultValue={selectedSupplier.address}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Website" defaultValue={selectedSupplier.website} />
              <Input label="Tax ID" defaultValue={selectedSupplier.taxId} />
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
    </div>
  );
}
