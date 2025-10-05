
import { useState } from 'react';
import Sidebar from '../../components/feature/Sidebar';
import Header from '../../components/feature/Header';
import Dashboard from '../inventory/components/Dashboard';
import ProductList from '../inventory/components/ProductList';
import Purchases from '../inventory/components/Purchases';
import StockMovements from '../inventory/components/StockMovements';
import Categories from '../inventory/components/Categories';
import Suppliers from '../inventory/components/Suppliers';
import Orders from '../inventory/components/Orders';
import Warehouses from '../inventory/components/Warehouses';
import CRM from '../inventory/components/CRM';
import Reports from '../inventory/components/Reports';
import Settings from '../inventory/components/Settings';
import Accounting from '../inventory/components/Accounting';
import UserManagement from '../inventory/components/UserManagement';
import { useUsers } from '../../hooks/useDatabase';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  console.log('Home component activeTab:', activeTab);
  
  // Get database connection status
  const { users, loading, error } = useUsers();
  const isDatabaseConnected = !error && !loading;
  const userCount = users?.length || 0;

  const getPageContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <ProductList />;
      case 'purchases':
        return <Purchases />;
      case 'movements':
        return <StockMovements />;
      case 'categories':
        return <Categories />;
      case 'suppliers':
        return <Suppliers />;
      case 'orders':
        return <Orders />;
      case 'warehouses':
        return <Warehouses />;
      case 'crm':
        console.log('Rendering CRM component from home page');
        return <CRM />;
      case 'reports':
        return <Reports />;
      case 'accounting':
        return <Accounting />;
      case 'users':
        return <UserManagement />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard';
      case 'products': return 'Products';
      case 'purchases': return 'Purchase Orders';
      case 'movements': return 'Stock Movements';
      case 'categories': return 'Categories';
      case 'suppliers': return 'Suppliers';
      case 'orders': return 'Orders';
      case 'warehouses': return 'Warehouses & Locations';
      case 'crm': return 'Customer Relationship Management';
      case 'reports': return 'Reports';
      case 'accounting': return 'Accounting & Finance';
      case 'users': return 'User Management';
      case 'settings': return 'Settings';
      default: return 'Dashboard';
    }
  };

  const getPageSubtitle = () => {
    const baseSubtitles = {
      dashboard: 'Overview of your inventory system',
      products: 'Manage your inventory items',
      purchases: 'Manage supplier purchase orders and procurement',
      movements: 'Track all inventory stock changes',
      categories: 'Organize product categories',
      suppliers: 'Manage supplier relationships',
      orders: 'Track customer orders',
      warehouses: 'Manage warehouse facilities and storage locations',
      crm: 'Manage customer relationships, leads, and deals',
      reports: 'Analytics and insights',
      accounting: 'Complete financial management with taxes, costing, and multi-currency support',
      users: `Manage users, roles, departments, and permissions${isDatabaseConnected ? ` • ${userCount} users` : ''}`,
      settings: 'System configuration'
    };

    const subtitle = baseSubtitles[activeTab as keyof typeof baseSubtitles] || baseSubtitles.dashboard;
    
    // Add database status for dashboard
    if (activeTab === 'dashboard') {
      const status = isDatabaseConnected ? `• Database Connected • ${userCount} users registered` : '• Database Connecting...';
      return `${subtitle} ${status}`;
    }
    
    return subtitle;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="flex-1 flex flex-col">
        <Header title={getPageTitle()} subtitle={getPageSubtitle()} />
        
        <main className="flex-1 overflow-y-auto">
          {getPageContent()}
        </main>
      </div>
    </div>
  );
}
