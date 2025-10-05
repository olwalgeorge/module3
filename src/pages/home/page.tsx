
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

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');

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
    switch (activeTab) {
      case 'dashboard': return 'Overview of your inventory system';
      case 'products': return 'Manage your inventory items';
      case 'purchases': return 'Manage supplier purchase orders and procurement';
      case 'movements': return 'Track all inventory stock changes';
      case 'categories': return 'Organize product categories';
      case 'suppliers': return 'Manage supplier relationships';
      case 'orders': return 'Track customer orders';
      case 'warehouses': return 'Manage warehouse facilities and storage locations';
      case 'crm': return 'Manage customer relationships, leads, and deals';
      case 'reports': return 'Analytics and insights';
      case 'accounting': return 'Complete financial management with taxes, costing, and multi-currency support';
      case 'users': return 'Manage users, roles, departments, and permissions';
      case 'settings': return 'System configuration';
      default: return 'Overview of your inventory system';
    }
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
