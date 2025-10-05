
import { useState } from 'react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: 'ri-dashboard-line' },
    { id: 'products', name: 'Products', icon: 'ri-box-3-line' },
    { id: 'orders', name: 'Orders', icon: 'ri-shopping-cart-line' },
    { id: 'purchases', name: 'Purchases', icon: 'ri-shopping-bag-3-line' },
    { id: 'accounting', name: 'Accounting', icon: 'ri-calculator-line' },
    { id: 'crm', name: 'CRM', icon: 'ri-user-heart-line' },
    { id: 'users', name: 'User Management', icon: 'ri-user-settings-line' },
    { id: 'suppliers', name: 'Suppliers', icon: 'ri-truck-line' },
    { id: 'warehouses', name: 'Warehouses', icon: 'ri-building-line' },
    { id: 'categories', name: 'Categories', icon: 'ri-folder-line' },
    { id: 'movements', name: 'Stock Movements', icon: 'ri-exchange-line' },
    { id: 'reports', name: 'Reports', icon: 'ri-file-chart-line' },
    { id: 'settings', name: 'Settings', icon: 'ri-settings-3-line' }
  ];

  return (
    <div className={`bg-gray-900 text-white transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} min-h-screen`}>
      <div className="p-4">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h1 className="text-xl font-bold" style={{ fontFamily: '"Pacifico", serif' }}>
              InventoryPro
            </h1>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer"
          >
            <i className={`ri-${isCollapsed ? 'menu-unfold' : 'menu-fold'}-line text-lg`}></i>
          </button>
        </div>
      </div>

      <nav className="mt-8">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-800 transition-colors cursor-pointer ${
              activeTab === item.id ? 'bg-blue-600 border-r-4 border-blue-400' : ''
            }`}
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <i className={`${item.icon} text-lg`}></i>
            </div>
            {!isCollapsed && (
              <span className="ml-3 whitespace-nowrap">{item.name}</span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
