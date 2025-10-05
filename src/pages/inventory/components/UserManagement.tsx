import { useState } from 'react';
import { users, roles, departments, userStats, permissions } from '../../../mocks/users';
import Button from '../../../components/base/Button';
import Input from '../../../components/base/Input';
import Modal from '../../../components/base/Modal';

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const getTabContent = () => {
    switch (activeTab) {
      case 'users':
        return <UsersTab searchTerm={searchTerm} selectedFilter={selectedFilter} onView={handleView} />;
      case 'roles':
        return <RolesTab searchTerm={searchTerm} selectedFilter={selectedFilter} onView={handleView} />;
      case 'departments':
        return <DepartmentsTab searchTerm={searchTerm} selectedFilter={selectedFilter} onView={handleView} />;
      case 'permissions':
        return <PermissionsTab searchTerm={searchTerm} selectedFilter={selectedFilter} onView={handleView} />;
      default:
        return <UsersTab searchTerm={searchTerm} selectedFilter={selectedFilter} onView={handleView} />;
    }
  };

  const handleView = (item: any) => {
    setSelectedItem(item);
    setIsViewModalOpen(true);
  };

  const getFilterOptions = () => {
    switch (activeTab) {
      case 'users':
        return [
          { value: 'all', label: 'All Users' },
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
          { value: 'administrator', label: 'Administrators' },
          { value: 'manager', label: 'Managers' }
        ];
      case 'roles':
        return [
          { value: 'all', label: 'All Roles' },
          { value: 'active', label: 'Active Roles' },
          { value: 'system', label: 'System Roles' },
          { value: 'custom', label: 'Custom Roles' }
        ];
      case 'departments':
        return [
          { value: 'all', label: 'All Departments' },
          { value: 'active', label: 'Active' },
          { value: 'large', label: 'Large Teams' },
          { value: 'small', label: 'Small Teams' }
        ];
      case 'permissions':
        return [
          { value: 'all', label: 'All Permissions' },
          { value: 'core', label: 'Core Permissions' },
          { value: 'admin', label: 'Admin Permissions' },
          { value: 'user', label: 'User Permissions' }
        ];
      default:
        return [{ value: 'all', label: 'All' }];
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* User Management Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{userStats.totalUsers}</p>
              <p className="text-xs text-green-600">+{userStats.newUsersThisMonth} this month</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="ri-user-line text-blue-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{userStats.activeUsers}</p>
              <p className="text-xs text-blue-600">{userStats.inactiveUsers} inactive</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="ri-user-check-line text-green-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Roles</p>
              <p className="text-2xl font-bold text-gray-900">{userStats.totalRoles}</p>
              <p className="text-xs text-purple-600">{userStats.totalDepartments} departments</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <i className="ri-shield-user-line text-purple-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Login Frequency</p>
              <p className="text-2xl font-bold text-gray-900">{userStats.averageLoginFrequency}/week</p>
              <p className="text-xs text-orange-600">Last added: {new Date(userStats.lastUserAdded).toLocaleDateString()}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <i className="ri-login-circle-line text-orange-600 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600">Manage users, roles, departments, and permissions</p>
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
              { id: 'users', label: 'Users', icon: 'ri-user-line', count: userStats.totalUsers },
              { id: 'roles', label: 'Roles', icon: 'ri-shield-user-line', count: userStats.totalRoles },
              { id: 'departments', label: 'Departments', icon: 'ri-building-line', count: userStats.totalDepartments },
              { id: 'permissions', label: 'Permissions', icon: 'ri-key-line', count: permissions.length }
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
        title={selectedItem ? `${selectedItem.name}` : 'Details'}
        size="xl"
      >
        {selectedItem && <DetailView item={selectedItem} type={activeTab} />}
      </Modal>
    </div>
  );
}

// Users Tab Component
function UsersTab({ searchTerm, selectedFilter, onView }: any) {
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || 
                         user.status.toLowerCase() === selectedFilter ||
                         user.role.toLowerCase().includes(selectedFilter.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Administrator': return 'bg-red-100 text-red-800';
      case 'Manager': return 'bg-blue-100 text-blue-800';
      case 'Warehouse Staff': return 'bg-green-100 text-green-800';
      case 'Sales Representative': return 'bg-purple-100 text-purple-800';
      case 'Accountant': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Login</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {filteredUsers.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <div className="flex items-center">
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover object-top mr-3"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.employeeId}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="text-sm text-gray-900">{user.email}</div>
                <div className="text-xs text-gray-500">{user.phone}</div>
              </td>
              <td className="px-4 py-3">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                  {user.role}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="text-sm text-gray-900">{user.department}</div>
                <div className="text-xs text-gray-500">{user.location}</div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">
                {new Date(user.lastLogin).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                  {user.status}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex space-x-2">
                  <button 
                    onClick={() => onView(user)}
                    className="w-8 h-8 flex items-center justify-center text-blue-600 hover:text-blue-900 cursor-pointer"
                  >
                    <i className="ri-eye-line"></i>
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center text-green-600 hover:text-green-900 cursor-pointer">
                    <i className="ri-edit-line"></i>
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center text-purple-600 hover:text-purple-900 cursor-pointer">
                    <i className="ri-key-line"></i>
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

// Roles Tab Component
function RolesTab({ searchTerm, selectedFilter, onView }: any) {
  const filteredRoles = roles.filter(role => {
    const matchesSearch = role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         role.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getRoleColor = (color: string) => {
    const colors: { [key: string]: string } = {
      red: 'bg-red-100 text-red-800',
      blue: 'bg-blue-100 text-blue-800',
      green: 'bg-green-100 text-green-800',
      purple: 'bg-purple-100 text-purple-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      indigo: 'bg-indigo-100 text-indigo-800',
      pink: 'bg-pink-100 text-pink-800',
      orange: 'bg-orange-100 text-orange-800'
    };
    return colors[color] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredRoles.map((role) => (
        <div key={role.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getRoleColor(role.color)}`}>
              {role.name}
            </span>
            <span className="text-sm text-gray-500">{role.userCount} users</span>
          </div>
          
          <p className="text-gray-600 text-sm mb-4">{role.description}</p>
          
          <div className="mb-4">
            <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">Permissions</h4>
            <div className="flex flex-wrap gap-1">
              {role.permissions.slice(0, 3).map((permission) => (
                <span key={permission} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                  {permission}
                </span>
              ))}
              {role.permissions.length > 3 && (
                <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                  +{role.permissions.length - 3} more
                </span>
              )}
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => onView(role)}
              className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 cursor-pointer"
            >
              View Details
            </button>
            <button className="px-3 py-2 text-sm bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 cursor-pointer">
              <i className="ri-edit-line"></i>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// Departments Tab Component
function DepartmentsTab({ searchTerm, selectedFilter, onView }: any) {
  const filteredDepartments = departments.filter(dept => {
    const matchesSearch = dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dept.manager.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredDepartments.map((dept) => (
        <div key={dept.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <i className="ri-building-line text-blue-600"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{dept.name}</h3>
                <p className="text-sm text-gray-500">{dept.userCount} members</p>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Manager:</span> {dept.manager}
            </p>
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => onView(dept)}
              className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 cursor-pointer"
            >
              View Members
            </button>
            <button className="px-3 py-2 text-sm bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 cursor-pointer">
              <i className="ri-edit-line"></i>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// Permissions Tab Component
function PermissionsTab({ searchTerm, selectedFilter, onView }: any) {
  const filteredPermissions = permissions.filter(permission => {
    const matchesSearch = permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permission.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Permission</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Module</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {filteredPermissions.map((permission) => (
            <tr key={permission.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <i className="ri-key-line text-blue-600 text-sm"></i>
                  </div>
                  <div className="text-sm font-medium text-gray-900">{permission.name}</div>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">{permission.description}</td>
              <td className="px-4 py-3">
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  {permission.id}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex space-x-2">
                  <button 
                    onClick={() => onView(permission)}
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
      {activeTab === 'users' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Full Name" placeholder="Enter full name" />
            <Input label="Email" type="email" placeholder="email@example.com" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Phone" placeholder="+1 (555) 123-4567" />
            <Input label="Employee ID" placeholder="EMP001" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8">
                {roles.map(role => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8">
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Location" placeholder="New York, NY" />
            <Input label="Hire Date" type="date" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea 
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Additional notes about the user"
            />
          </div>
        </>
      )}

      {activeTab === 'roles' && (
        <>
          <Input label="Role Name" placeholder="Enter role name" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Describe the role responsibilities"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Permissions</label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {permissions.map(permission => (
                <label key={permission.id} className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm text-gray-700">{permission.name}</span>
                </label>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === 'departments' && (
        <>
          <Input label="Department Name" placeholder="Enter department name" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Manager</label>
            <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8">
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Describe the department function"
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
  if (type === 'users') {
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
            <p className="text-gray-600">{item.role} - {item.department}</p>
            <p className="text-sm text-gray-500">{item.employeeId}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Contact Information</h4>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-600">Email:</span> {item.email}</p>
              <p><span className="text-gray-600">Phone:</span> {item.phone}</p>
              <p><span className="text-gray-600">Location:</span> {item.location}</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Employment Details</h4>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-600">Manager:</span> {item.manager}</p>
              <p><span className="text-gray-600">Hire Date:</span> {new Date(item.hireDate).toLocaleDateString()}</p>
              <p><span className="text-gray-600">Salary:</span> ${item.salary.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Permissions</h4>
          <div className="flex flex-wrap gap-2">
            {item.permissions.map((permission: string) => (
              <span key={permission} className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                {permission}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Activity</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-lg font-bold text-blue-600">{new Date(item.lastLogin).toLocaleDateString()}</div>
              <div className="text-sm text-blue-600">Last Login</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-lg font-bold text-green-600">{new Date(item.createdAt).toLocaleDateString()}</div>
              <div className="text-sm text-green-600">Account Created</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-lg font-bold text-purple-600">{item.status}</div>
              <div className="text-sm text-purple-600">Current Status</div>
            </div>
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