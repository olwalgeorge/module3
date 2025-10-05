
import { useState } from 'react';
import { useCustomers } from '../../../hooks/useDatabase';
import { leads, activities, deals, crmStats } from '../../../mocks/crm';
import Button from '../../../components/base/Button';
import Input from '../../../components/base/Input';
import Modal from '../../../components/base/Modal';

export default function CRM() {
  // Database hooks for real-time data
  const { customers, loading: customersLoading, addCustomer, updateCustomer } = useCustomers();
  const [activeTab, setActiveTab] = useState('customers');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const getTabContent = () => {
    switch (activeTab) {
      case 'customers':
        return <CustomersTab searchTerm={searchTerm} selectedFilter={selectedFilter} onView={handleView} customers={customers} loading={customersLoading} />;
      case 'leads':
        return <LeadsTab searchTerm={searchTerm} selectedFilter={selectedFilter} onView={handleView} />;
      case 'deals':
        return <DealsTab searchTerm={searchTerm} selectedFilter={selectedFilter} onView={handleView} />;
      case 'activities':
        return <ActivitiesTab searchTerm={searchTerm} selectedFilter={selectedFilter} onView={handleView} />;
      default:
        return <CustomersTab searchTerm={searchTerm} selectedFilter={selectedFilter} onView={handleView} customers={customers} loading={customersLoading} />;
    }
  };

  const handleView = (item: any) => {
    setSelectedItem(item);
    setIsViewModalOpen(true);
  };

  const getFilterOptions = () => {
    switch (activeTab) {
      case 'customers':
        return [
          { value: 'all', label: 'All Customers' },
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
          { value: 'prospect', label: 'Prospects' }
        ];
      case 'leads':
        return [
          { value: 'all', label: 'All Leads' },
          { value: 'new', label: 'New' },
          { value: 'qualified', label: 'Qualified' },
          { value: 'nurturing', label: 'Nurturing' }
        ];
      case 'deals':
        return [
          { value: 'all', label: 'All Deals' },
          { value: 'active', label: 'Active' },
          { value: 'won', label: 'Won' },
          { value: 'lost', label: 'Lost' }
        ];
      case 'activities':
        return [
          { value: 'all', label: 'All Activities' },
          { value: 'completed', label: 'Completed' },
          { value: 'pending', label: 'Pending' },
          { value: 'in-progress', label: 'In Progress' }
        ];
      default:
        return [{ value: 'all', label: 'All' }];
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* CRM Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{crmStats.totalCustomers}</p>
              <p className="text-xs text-green-600">+{crmStats.newCustomersThisMonth} this month</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="ri-user-line text-blue-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Deals</p>
              <p className="text-2xl font-bold text-gray-900">{crmStats.activeDeals}</p>
              <p className="text-xs text-blue-600">${crmStats.totalDealValue.toLocaleString()} total value</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="ri-money-dollar-circle-line text-green-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{crmStats.conversionRate}%</p>
              <p className="text-xs text-purple-600">{crmStats.qualifiedLeads} qualified leads</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <i className="ri-line-chart-line text-purple-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Deal Size</p>
              <p className="text-2xl font-bold text-gray-900">${crmStats.averageDealSize.toLocaleString()}</p>
              <p className="text-xs text-orange-600">{crmStats.customerRetentionRate}% retention</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <i className="ri-trophy-line text-orange-600 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Customer Relationship Management</h2>
          <p className="text-gray-600">Manage customers, leads, deals, and activities</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <i className="ri-add-line mr-2"></i>
          Add {activeTab.slice(0, -1).charAt(0).toUpperCase() + activeTab.slice(1, -1)}
        </Button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'customers', label: 'Customers', icon: 'ri-user-line', count: crmStats.totalCustomers },
              { id: 'leads', label: 'Leads', icon: 'ri-user-add-line', count: crmStats.totalLeads },
              { id: 'deals', label: 'Deals', icon: 'ri-money-dollar-circle-line', count: crmStats.totalDeals },
              { id: 'activities', label: 'Activities', icon: 'ri-calendar-line', count: activities.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className={`${tab.icon} mr-2`}></i>
                {tab.label}
                <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <div>
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
              >
                {getFilterOptions().map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            
            <Button variant="secondary">
              <i className="ri-download-line mr-2"></i>
              Export {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </Button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {getTabContent()}
        </div>
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={`Add New ${activeTab.slice(0, -1).charAt(0).toUpperCase() + activeTab.slice(1, -1)}`}
        size="lg"
      >
        <AddForm activeTab={activeTab} onClose={() => setIsAddModalOpen(false)} />
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={selectedItem ? `${selectedItem.name || selectedItem.subject}` : 'Details'}
        size="xl"
      >
        {selectedItem && <DetailView item={selectedItem} type={activeTab} />}
      </Modal>
    </div>
  );
}

// Customers Tab Component
function CustomersTab({ searchTerm, selectedFilter, onView, customers, loading }: any) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Loading customers...</span>
      </div>
    );
  }

  const filteredCustomers = customers.filter((customer: any) => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (customer.company && customer.company.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = selectedFilter === 'all' || customer.status.toLowerCase() === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      case 'Prospect': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {filteredCustomers.map((customer) => (
            <tr key={customer.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <div className="flex items-center">
                  <img 
                    src={customer.avatar} 
                    alt={customer.name}
                    className="w-10 h-10 rounded-full object-cover object-top mr-3"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                    <div className="text-xs text-gray-500">{customer.position}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="text-sm text-gray-900">{customer.company}</div>
                <div className="text-xs text-gray-500">{customer.industry}</div>
              </td>
              <td className="px-4 py-3">
                <div className="text-sm text-gray-900">{customer.email}</div>
                <div className="text-xs text-gray-500">{customer.phone}</div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">{customer.totalOrders}</td>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">${customer.totalValue.toLocaleString()}</td>
              <td className="px-4 py-3">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(customer.priority)}`}>
                  {customer.priority}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(customer.status)}`}>
                  {customer.status}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex space-x-2">
                  <button 
                    onClick={() => onView(customer)}
                    className="w-8 h-8 flex items-center justify-center text-blue-600 hover:text-blue-900 cursor-pointer"
                  >
                    <i className="ri-eye-line"></i>
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center text-green-600 hover:text-green-900 cursor-pointer">
                    <i className="ri-edit-line"></i>
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center text-purple-600 hover:text-purple-900 cursor-pointer">
                    <i className="ri-mail-line"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Leads Tab Component
function LeadsTab({ searchTerm, selectedFilter, onView }: any) {
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || lead.status.toLowerCase() === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'Qualified': return 'bg-green-100 text-green-800';
      case 'Nurturing': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lead</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Probability</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {filteredLeads.map((lead) => (
            <tr key={lead.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <div>
                  <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                  <div className="text-xs text-gray-500">{lead.position}</div>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="text-sm text-gray-900">{lead.company}</div>
                <div className="text-xs text-gray-500">{lead.email}</div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">{lead.source}</td>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">${lead.estimatedValue.toLocaleString()}</td>
              <td className="px-4 py-3">
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${lead.probability}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600">{lead.probability}%</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(lead.priority)}`}>
                  {lead.priority}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(lead.status)}`}>
                  {lead.status}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex space-x-2">
                  <button 
                    onClick={() => onView(lead)}
                    className="w-8 h-8 flex items-center justify-center text-blue-600 hover:text-blue-900 cursor-pointer"
                  >
                    <i className="ri-eye-line"></i>
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center text-green-600 hover:text-green-900 cursor-pointer">
                    <i className="ri-edit-line"></i>
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center text-purple-600 hover:text-purple-900 cursor-pointer">
                    <i className="ri-phone-line"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Deals Tab Component
function DealsTab({ searchTerm, selectedFilter, onView }: any) {
  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deal.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || deal.status.toLowerCase() === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Qualification': return 'bg-blue-100 text-blue-800';
      case 'Proposal': return 'bg-yellow-100 text-yellow-800';
      case 'Negotiation': return 'bg-orange-100 text-orange-800';
      case 'Verbal Commitment': return 'bg-purple-100 text-purple-800';
      case 'Contract Review': return 'bg-indigo-100 text-indigo-800';
      case 'Closed Won': return 'bg-green-100 text-green-800';
      case 'Closed Lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deal</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Probability</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stage</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Close Date</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {filteredDeals.map((deal) => (
            <tr key={deal.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <div className="text-sm font-medium text-gray-900">{deal.name}</div>
                <div className="text-xs text-gray-500">{deal.source}</div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">{deal.customerName}</td>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">${deal.value.toLocaleString()}</td>
              <td className="px-4 py-3">
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${deal.probability}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600">{deal.probability}%</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStageColor(deal.stage)}`}>
                  {deal.stage}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">
                {new Date(deal.expectedCloseDate).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">{deal.assignedTo}</td>
              <td className="px-4 py-3">
                <div className="flex space-x-2">
                  <button 
                    onClick={() => onView(deal)}
                    className="w-8 h-8 flex items-center justify-center text-blue-600 hover:text-blue-900 cursor-pointer"
                  >
                    <i className="ri-eye-line"></i>
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center text-green-600 hover:text-green-900 cursor-pointer">
                    <i className="ri-edit-line"></i>
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center text-purple-600 hover:text-purple-900 cursor-pointer">
                    <i className="ri-file-text-line"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Activities Tab Component
function ActivitiesTab({ searchTerm, selectedFilter, onView }: any) {
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || activity.status.toLowerCase().replace(' ', '-') === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Call': return 'ri-phone-line';
      case 'Email': return 'ri-mail-line';
      case 'Meeting': return 'ri-calendar-line';
      case 'Task': return 'ri-task-line';
      default: return 'ri-file-text-line';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Activity</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {filteredActivities.map((activity) => (
            <tr key={activity.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                    <i className={`${getTypeIcon(activity.type)} text-gray-600`}></i>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{activity.subject}</div>
                    <div className="text-xs text-gray-500">{activity.description}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">{activity.customerName}</td>
              <td className="px-4 py-3">
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  {activity.type}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="text-sm text-gray-900">{new Date(activity.date).toLocaleDateString()}</div>
                <div className="text-xs text-gray-500">{activity.time}</div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">{activity.duration} min</td>
              <td className="px-4 py-3 text-sm text-gray-900">{activity.assignedTo}</td>
              <td className="px-4 py-3">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(activity.status)}`}>
                  {activity.status}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex space-x-2">
                  <button 
                    onClick={() => onView(activity)}
                    className="w-8 h-8 flex items-center justify-center text-blue-600 hover:text-blue-900 cursor-pointer"
                  >
                    <i className="ri-eye-line"></i>
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center text-green-600 hover:text-green-900 cursor-pointer">
                    <i className="ri-edit-line"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Add Form Component
function AddForm({ activeTab, onClose }: any) {
  return (
    <div className="space-y-4">
      {activeTab === 'customers' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Full Name" placeholder="Enter full name" />
            <Input label="Email" type="email" placeholder="email@example.com" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Phone" placeholder="+1 (555) 123-4567" />
            <Input label="Company" placeholder="Company name" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Position" placeholder="Job title" />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
              <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8">
                <option>Technology</option>
                <option>Marketing</option>
                <option>Healthcare</option>
                <option>Finance</option>
                <option>Education</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea 
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Enter full address"
            />
          </div>
        </>
      )}

      {activeTab === 'leads' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Lead Name" placeholder="Enter lead name" />
            <Input label="Email" type="email" placeholder="email@example.com" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Phone" placeholder="+1 (555) 123-4567" />
            <Input label="Company" placeholder="Company name" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
              <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8">
                <option>Website Form</option>
                <option>Cold Call</option>
                <option>Referral</option>
                <option>Trade Show</option>
                <option>LinkedIn</option>
              </select>
            </div>
            <Input label="Estimated Value" type="number" placeholder="0" />
            <Input label="Probability %" type="number" placeholder="50" />
          </div>
        </>
      )}

      {activeTab === 'deals' && (
        <>
          <Input label="Deal Name" placeholder="Enter deal name" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
              <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8">
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>{customer.name}</option>
                ))}
              </select>
            </div>
            <Input label="Deal Value" type="number" placeholder="0" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Probability %" type="number" placeholder="50" />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
              <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8">
                <option>Qualification</option>
                <option>Proposal</option>
                <option>Negotiation</option>
                <option>Verbal Commitment</option>
                <option>Contract Review</option>
              </select>
            </div>
            <Input label="Expected Close Date" type="date" />
          </div>
        </>
      )}

      {activeTab === 'activities' && (
        <>
          <Input label="Activity Subject" placeholder="Enter activity subject" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8">
                <option>Call</option>
                <option>Email</option>
                <option>Meeting</option>
                <option>Task</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
              <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8">
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>{customer.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Date" type="date" />
            <Input label="Time" type="time" />
            <Input label="Duration (min)" type="number" placeholder="30" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Enter activity description"
            />
          </div>
        </>
      )}

      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onClose}>
          Create {activeTab.slice(0, -1).charAt(0).toUpperCase() + activeTab.slice(1, -1)}
        </Button>
      </div>
    </div>
  );
}

// Detail View Component
function DetailView({ item, type }: any) {
  if (type === 'customers') {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <img 
            src={item.avatar} 
            alt={item.name}
            className="w-16 h-16 rounded-full object-cover object-top"
          />
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
            <p className="text-gray-600">{item.position} at {item.company}</p>
            <div className="flex space-x-2 mt-2">
              {item.tags.map((tag: string) => (
                <span key={tag} className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Contact Information</h4>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-600">Email:</span> {item.email}</p>
              <p><span className="text-gray-600">Phone:</span> {item.phone}</p>
              <p><span className="text-gray-600">Website:</span> {item.website}</p>
              <p><span className="text-gray-600">Address:</span> {item.address}</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Business Information</h4>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-600">Industry:</span> {item.industry}</p>
              <p><span className="text-gray-600">Customer Type:</span> {item.customerType}</p>
              <p><span className="text-gray-600">Source:</span> {item.source}</p>
              <p><span className="text-gray-600">Assigned To:</span> {item.assignedTo}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">{item.totalOrders}</div>
            <div className="text-sm text-blue-600">Total Orders</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">${item.totalValue.toLocaleString()}</div>
            <div className="text-sm text-green-600">Total Value</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600">{new Date(item.lastOrderDate).toLocaleDateString()}</div>
            <div className="text-sm text-purple-600">Last Order</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-orange-600">{new Date(item.nextFollowUp).toLocaleDateString()}</div>
            <div className="text-sm text-orange-600">Next Follow-up</div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Notes</h4>
          <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">{item.notes}</p>
        </div>
      </div>
    );
  }

  if (type === 'deals') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
            <p className="text-gray-600">{item.customerName}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">${item.value.toLocaleString()}</div>
            <div className="text-sm text-gray-600">{item.probability}% probability</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-lg font-bold text-blue-600">{item.stage}</div>
            <div className="text-sm text-blue-600">Current Stage</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-lg font-bold text-purple-600">{new Date(item.expectedCloseDate).toLocaleDateString()}</div>
            <div className="text-sm text-purple-600">Expected Close</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="text-lg font-bold text-orange-600">{item.assignedTo}</div>
            <div className="text-sm text-orange-600">Deal Owner</div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Products</h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {item.products.map((product: any, index: number) => (
                  <tr key={index}>
                    <td className="px-3 py-2 text-sm text-gray-900">{product.name}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{product.quantity}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">${product.unitPrice.toLocaleString()}</td>
                    <td className="px-3 py-2 text-sm font-medium text-gray-900">${(product.quantity * product.unitPrice).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Notes</h4>
          <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">{item.notes}</p>
        </div>
      </div>
    );
  }

  // Default view for other types
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(item).map(([key, value]) => {
          if (typeof value === 'object' || key === 'id') return null;
          return (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
              </label>
              <p className="text-sm text-gray-900 bg-gray-50 rounded-lg p-2">{String(value)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
