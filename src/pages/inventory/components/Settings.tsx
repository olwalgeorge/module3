
import { useState } from 'react';
import Button from '../../../components/base/Button';
import Input from '../../../components/base/Input';
import Modal from '../../../components/base/Modal';
import CurrencySettings from './CurrencySettings';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const [generalSettings, setGeneralSettings] = useState({
    companyName: 'Inventory Pro',
    companyEmail: 'admin@inventorypro.com',
    companyPhone: '+1 (555) 123-4567',
    companyAddress: '123 Business St, City, State 12345',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12',
    language: 'en'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    lowStockAlerts: true,
    orderUpdates: true,
    supplierNotifications: true,
    systemUpdates: false,
    marketingEmails: false,
    lowStockThreshold: 10,
    criticalStockThreshold: 5
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginAttempts: 5,
    ipWhitelist: '',
    auditLogging: true,
    dataEncryption: true
  });

  const [systemSettings, setSystemSettings] = useState({
    autoBackup: true,
    backupFrequency: 'daily',
    dataRetention: 365,
    apiRateLimit: 1000,
    maxFileSize: 10,
    allowedFileTypes: 'jpg,png,pdf,xlsx,csv',
    maintenanceMode: false
  });

  const tabs = [
    { id: 'general', name: 'General', icon: 'ri-settings-3-line' },
    { id: 'notifications', name: 'Notifications', icon: 'ri-notification-3-line' },
    { id: 'security', name: 'Security', icon: 'ri-shield-check-line' },
    { id: 'currency', name: 'Currency', icon: 'ri-money-dollar-circle-line' },
    { id: 'system', name: 'System', icon: 'ri-server-line' },
    { id: 'backup', name: 'Backup & Data', icon: 'ri-database-2-line' }
  ];

  const handleSaveSettings = () => {
    console.log('Saving settings...');
    // In a real app, this would save to API
  };

  const handleExportData = () => {
    console.log('Exporting data...');
    // In a real app, this would export data
  };

  const handleImportData = () => {
    console.log('Importing data...');
    setIsImportModalOpen(false);
  };

  const handleCreateBackup = () => {
    console.log('Creating backup...');
    setIsBackupModalOpen(false);
  };

  const handleResetSystem = () => {
    console.log('Resetting system...');
    setIsResetModalOpen(false);
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Company Name"
            value={generalSettings.companyName}
            onChange={(e) => setGeneralSettings(prev => ({ ...prev, companyName: e.target.value }))}
          />
          <Input
            label="Email Address"
            type="email"
            value={generalSettings.companyEmail}
            onChange={(e) => setGeneralSettings(prev => ({ ...prev, companyEmail: e.target.value }))}
          />
          <Input
            label="Phone Number"
            value={generalSettings.companyPhone}
            onChange={(e) => setGeneralSettings(prev => ({ ...prev, companyPhone: e.target.value }))}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
            <select
              value={generalSettings.timezone}
              onChange={(e) => setGeneralSettings(prev => ({ ...prev, timezone: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
            >
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="Europe/London">London (GMT)</option>
              <option value="Europe/Paris">Paris (CET)</option>
              <option value="Asia/Tokyo">Tokyo (JST)</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <Input
            label="Company Address"
            value={generalSettings.companyAddress}
            onChange={(e) => setGeneralSettings(prev => ({ ...prev, companyAddress: e.target.value }))}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Regional Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Format</label>
            <select
              value={generalSettings.dateFormat}
              onChange={(e) => setGeneralSettings(prev => ({ ...prev, dateFormat: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Format</label>
            <select
              value={generalSettings.timeFormat}
              onChange={(e) => setGeneralSettings(prev => ({ ...prev, timeFormat: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
            >
              <option value="12">12 Hour</option>
              <option value="24">24 Hour</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
            <select
              value={generalSettings.language}
              onChange={(e) => setGeneralSettings(prev => ({ ...prev, language: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="it">Italian</option>
              <option value="pt">Portuguese</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Notifications</h3>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={notificationSettings.emailNotifications}
              onChange={(e) => setNotificationSettings(prev => ({ ...prev, emailNotifications: e.target.checked }))}
              className="mr-3"
            />
            <span className="text-sm text-gray-700">Enable email notifications</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={notificationSettings.lowStockAlerts}
              onChange={(e) => setNotificationSettings(prev => ({ ...prev, lowStockAlerts: e.target.checked }))}
              className="mr-3"
            />
            <span className="text-sm text-gray-700">Low stock alerts</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={notificationSettings.orderUpdates}
              onChange={(e) => setNotificationSettings(prev => ({ ...prev, orderUpdates: e.target.checked }))}
              className="mr-3"
            />
            <span className="text-sm text-gray-700">Order status updates</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={notificationSettings.supplierNotifications}
              onChange={(e) => setNotificationSettings(prev => ({ ...prev, supplierNotifications: e.target.checked }))}
              className="mr-3"
            />
            <span className="text-sm text-gray-700">Supplier notifications</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={notificationSettings.systemUpdates}
              onChange={(e) => setNotificationSettings(prev => ({ ...prev, systemUpdates: e.target.checked }))}
              className="mr-3"
            />
            <span className="text-sm text-gray-700">System updates</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={notificationSettings.marketingEmails}
              onChange={(e) => setNotificationSettings(prev => ({ ...prev, marketingEmails: e.target.checked }))}
              className="mr-3"
            />
            <span className="text-sm text-gray-700">Marketing emails</span>
          </label>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock Alert Thresholds</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Low Stock Threshold"
            type="number"
            value={notificationSettings.lowStockThreshold}
            onChange={(e) => setNotificationSettings(prev => ({ ...prev, lowStockThreshold: parseInt(e.target.value) || 0 }))}
          />
          <Input
            label="Critical Stock Threshold"
            type="number"
            value={notificationSettings.criticalStockThreshold}
            onChange={(e) => setNotificationSettings(prev => ({ ...prev, criticalStockThreshold: parseInt(e.target.value) || 0 }))}
          />
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Authentication</h3>
        <div className="space-y-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={securitySettings.twoFactorAuth}
              onChange={(e) => setSecuritySettings(prev => ({ ...prev, twoFactorAuth: e.target.checked }))}
              className="mr-3"
            />
            <span className="text-sm text-gray-700">Enable Two-Factor Authentication</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Session Timeout (minutes)"
              type="number"
              value={securitySettings.sessionTimeout}
              onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) || 0 }))}
            />
            <Input
              label="Password Expiry (days)"
              type="number"
              value={securitySettings.passwordExpiry}
              onChange={(e) => setSecuritySettings(prev => ({ ...prev, passwordExpiry: parseInt(e.target.value) || 0 }))}
            />
          </div>
          <Input
            label="Max Login Attempts"
            type="number"
            value={securitySettings.loginAttempts}
            onChange={(e) => setSecuritySettings(prev => ({ ...prev, loginAttempts: parseInt(e.target.value) || 0 }))}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Access Control</h3>
        <div className="space-y-4">
          <Input
            label="IP Whitelist (comma-separated)"
            placeholder="192.168.1.1, 10.0.0.1"
            value={securitySettings.ipWhitelist}
            onChange={(e) => setSecuritySettings(prev => ({ ...prev, ipWhitelist: e.target.value }))}
          />
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={securitySettings.auditLogging}
                onChange={(e) => setSecuritySettings(prev => ({ ...prev, auditLogging: e.target.checked }))}
                className="mr-3"
              />
              <span className="text-sm text-gray-700">Enable audit logging</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={securitySettings.dataEncryption}
                onChange={(e) => setSecuritySettings(prev => ({ ...prev, dataEncryption: e.target.checked }))}
                className="mr-3"
              />
              <span className="text-sm text-gray-700">Enable data encryption</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Configuration</h3>
        <div className="space-y-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={systemSettings.autoBackup}
              onChange={(e) => setSystemSettings(prev => ({ ...prev, autoBackup: e.target.checked }))}
              className="mr-3"
            />
            <span className="text-sm text-gray-700">Enable automatic backups</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Backup Frequency</label>
              <select
                value={systemSettings.backupFrequency}
                onChange={(e) => setSystemSettings(prev => ({ ...prev, backupFrequency: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <Input
              label="Data Retention (days)"
              type="number"
              value={systemSettings.dataRetention}
              onChange={(e) => setSystemSettings(prev => ({ ...prev, dataRetention: parseInt(e.target.value) || 0 }))}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="API Rate Limit (requests/hour)"
            type="number"
            value={systemSettings.apiRateLimit}
            onChange={(e) => setSystemSettings(prev => ({ ...prev, apiRateLimit: parseInt(e.target.value) || 0 }))}
          />
          <Input
            label="Max File Size (MB)"
            type="number"
            value={systemSettings.maxFileSize}
            onChange={(e) => setSystemSettings(prev => ({ ...prev, maxFileSize: parseInt(e.target.value) || 0 }))}
          />
        </div>
        <div className="mt-4">
          <Input
            label="Allowed File Types"
            placeholder="jpg,png,pdf,xlsx,csv"
            value={systemSettings.allowedFileTypes}
            onChange={(e) => setSystemSettings(prev => ({ ...prev, allowedFileTypes: e.target.value }))}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Maintenance</h3>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={systemSettings.maintenanceMode}
            onChange={(e) => setSystemSettings(prev => ({ ...prev, maintenanceMode: e.target.checked }))}
            className="mr-3"
          />
          <span className="text-sm text-gray-700">Enable maintenance mode</span>
        </label>
        {systemSettings.maintenanceMode && (
          <div className="mt-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <i className="ri-warning-line text-yellow-600 mr-2"></i>
              <span className="text-sm text-yellow-800">
                Maintenance mode will prevent users from accessing the system
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderBackupSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button onClick={() => setIsBackupModalOpen(true)}>
            <i className="ri-download-cloud-line mr-2"></i>
            Create Backup
          </Button>
          <Button variant="secondary" onClick={handleExportData}>
            <i className="ri-file-download-line mr-2"></i>
            Export Data
          </Button>
          <Button variant="secondary" onClick={() => setIsImportModalOpen(true)}>
            <i className="ri-file-upload-line mr-2"></i>
            Import Data
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Backups</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="space-y-3">
            {[
              { date: '2024-01-16 10:00 AM', size: '2.4 MB', type: 'Automatic' },
              { date: '2024-01-15 10:00 AM', size: '2.3 MB', type: 'Automatic' },
              { date: '2024-01-14 10:00 AM', size: '2.2 MB', type: 'Automatic' },
              { date: '2024-01-13 02:30 PM', size: '2.1 MB', type: 'Manual' }
            ].map((backup, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <i className="ri-database-2-line text-blue-600"></i>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{backup.date}</div>
                    <div className="text-xs text-gray-500">{backup.size} • {backup.type}</div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="w-8 h-8 flex items-center justify-center text-blue-600 hover:text-blue-900 cursor-pointer">
                    <i className="ri-download-line"></i>
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center text-red-600 hover:text-red-900 cursor-pointer">
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Danger Zone</h3>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-red-900">Reset System</h4>
              <p className="text-sm text-red-700">This will permanently delete all data and reset the system to default settings.</p>
            </div>
            <Button variant="danger" onClick={() => setIsResetModalOpen(true)}>
              <i className="ri-restart-line mr-2"></i>
              Reset System
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'security':
        return renderSecuritySettings();
      case 'currency':
        return <CurrencySettings />;
      case 'system':
        return renderSystemSettings();
      case 'backup':
        return renderBackupSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
          <p className="text-gray-600">Configure your inventory management system preferences</p>
        </div>
        <Button onClick={handleSaveSettings}>
          <i className="ri-save-line mr-2"></i>
          Save All Settings
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <i className={`${tab.icon} mr-3`}></i>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>

      {/* Backup Modal */}
      <Modal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        title="Create System Backup"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            This will create a complete backup of your inventory system including all products, orders, suppliers, and settings.
          </p>
          <div className="space-y-3">
            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="mr-3" />
              <span className="text-sm text-gray-700">Include product data</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="mr-3" />
              <span className="text-sm text-gray-700">Include order history</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="mr-3" />
              <span className="text-sm text-gray-700">Include supplier information</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="mr-3" />
              <span className="text-sm text-gray-700">Include system settings</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-3" />
              <span className="text-sm text-gray-700">Include user data</span>
            </label>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setIsBackupModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateBackup}>
              <i className="ri-download-cloud-line mr-2"></i>
              Create Backup
            </Button>
          </div>
        </div>
      </Modal>

      {/* Import Modal */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Import Data"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Upload a backup file or CSV data to import into your system.
          </p>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <i className="ri-upload-cloud-2-line text-4xl text-gray-400 mb-4"></i>
            <p className="text-gray-600 mb-2">Drag and drop your file here, or click to browse</p>
            <p className="text-sm text-gray-500">Supported formats: .backup, .csv, .xlsx</p>
            <Button variant="secondary" className="mt-4">
              <i className="ri-folder-open-line mr-2"></i>
              Choose File
            </Button>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setIsImportModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleImportData}>
              <i className="ri-file-upload-line mr-2"></i>
              Import Data
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reset System Modal */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Reset System"
        size="lg"
      >
        <div className="space-y-4">
          <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
            <i className="ri-error-warning-line text-red-600 text-xl mr-3"></i>
            <div>
              <h4 className="text-sm font-medium text-red-900">Warning: This action cannot be undone</h4>
              <p className="text-sm text-red-700">All data will be permanently deleted and cannot be recovered.</p>
            </div>
          </div>
          <p className="text-gray-600">
            This will permanently delete all products, orders, suppliers, customers, and system settings. 
            The system will be reset to its default state.
          </p>
          <Input
            label="Type 'RESET' to confirm"
            placeholder="RESET"
          />
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setIsResetModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleResetSystem}>
              <i className="ri-restart-line mr-2"></i>
              Reset System
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
