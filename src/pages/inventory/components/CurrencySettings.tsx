
import { useState } from 'react';
import { currencies, currencySettings, exchangeRateHistory } from '../../../mocks/currencies';
import { useCurrency } from '../../../hooks/useCurrency';
import Button from '../../../components/base/Button';
import Input from '../../../components/base/Input';
import Modal from '../../../components/base/Modal';

export default function CurrencySettings() {
  const { 
    baseCurrency, 
    displayCurrency, 
    availableCurrencies, 
    formatCurrency, 
    convertCurrency,
    getExchangeRate,
    updateDisplayCurrency,
    updateBaseCurrency 
  } = useCurrency();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('all');
  const [isAddCurrencyModalOpen, setIsAddCurrencyModalOpen] = useState(false);
  const [isRateHistoryModalOpen, setIsRateHistoryModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [newCurrency, setNewCurrency] = useState({
    code: '',
    name: '',
    symbol: '',
    position: 'before' as 'before' | 'after',
    decimals: 2,
    exchangeRate: 1.0
  });

  const filteredCurrencies = availableCurrencies.filter(currency => {
    const matchesSearch = currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         currency.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedCurrency === 'all' || 
                         (selectedCurrency === 'active' && currency.exchangeRate > 0) ||
                         (selectedCurrency === 'base' && currency.isBase);
    return matchesSearch && matchesFilter;
  });

  const handleUpdateExchangeRates = () => {
    console.log('Updating exchange rates...');
    // In a real app, this would fetch latest rates from an API
  };

  const handleSetBaseCurrency = (currencyCode: string) => {
    updateBaseCurrency(currencyCode);
    console.log(`Base currency updated to ${currencyCode}`);
  };

  const handleSetDisplayCurrency = (currencyCode: string) => {
    updateDisplayCurrency(currencyCode);
    console.log(`Display currency updated to ${currencyCode}`);
  };

  const getStatusColor = (currency: any) => {
    if (currency.isBase) return 'bg-blue-100 text-blue-800';
    if (currency.exchangeRate > 0) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (currency: any) => {
    if (currency.isBase) return 'Base Currency';
    if (currency.exchangeRate > 0) return 'Active';
    return 'Inactive';
  };

  const calculateStats = () => {
    const totalCurrencies = availableCurrencies.length;
    const activeCurrencies = availableCurrencies.filter(c => c.exchangeRate > 0).length;
    const baseCurrencyData = availableCurrencies.find(c => c.isBase);
    const lastUpdate = new Date(currencySettings.lastRateUpdate).toLocaleDateString();

    return { totalCurrencies, activeCurrencies, baseCurrencyData, lastUpdate };
  };

  const stats = calculateStats();

  return (
    <div className="p-6 space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Currencies</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCurrencies}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="ri-money-dollar-circle-line text-blue-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Currencies</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeCurrencies}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="ri-exchange-line text-green-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Base Currency</p>
              <p className="text-2xl font-bold text-purple-600">{stats.baseCurrencyData?.code}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <i className="ri-bank-line text-purple-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Last Update</p>
              <p className="text-2xl font-bold text-orange-600">{stats.lastUpdate}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <i className="ri-time-line text-orange-600 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Currency Management</h2>
          <p className="text-gray-600">Manage currencies, exchange rates, and multi-currency settings</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" onClick={() => setIsRateHistoryModalOpen(true)}>
            <i className="ri-line-chart-line mr-2"></i>
            Rate History
          </Button>
          <Button variant="secondary" onClick={() => setIsSettingsModalOpen(true)}>
            <i className="ri-settings-3-line mr-2"></i>
            Settings
          </Button>
          <Button onClick={handleUpdateExchangeRates}>
            <i className="ri-refresh-line mr-2"></i>
            Update Rates
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Search currencies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <div>
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
            >
              <option value="all">All Currencies</option>
              <option value="active">Active Only</option>
              <option value="base">Base Currency</option>
            </select>
          </div>

          <div>
            <select
              value={displayCurrency}
              onChange={(e) => handleSetDisplayCurrency(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
            >
              <option value="">Select Display Currency</option>
              {availableCurrencies.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>
          
          <Button variant="secondary" onClick={() => setIsAddCurrencyModalOpen(true)}>
            <i className="ri-add-line mr-2"></i>
            Add Currency
          </Button>
        </div>
      </div>

      {/* Currency Converter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Currency Converter</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <Input label="Amount" type="number" placeholder="100" defaultValue="100" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
            <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8">
              {availableCurrencies.map(currency => (
                <option key={currency.code} value={currency.code}>{currency.code}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
            <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8">
              {availableCurrencies.map(currency => (
                <option key={currency.code} value={currency.code}>{currency.code}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Result</label>
            <div className="px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg">
              {formatCurrency(convertCurrency(100, 'USD', 'EUR'), 'EUR')}
            </div>
          </div>
          <Button>
            <i className="ri-calculator-line mr-2"></i>
            Convert
          </Button>
        </div>
      </div>

      {/* Currencies Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Currency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exchange Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sample Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCurrencies.map((currency) => (
                <tr key={currency.code} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-sm font-medium">
                          {currency.symbol}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{currency.name}</div>
                        <div className="text-sm text-gray-500">{currency.code}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                      {currency.code}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {currency.symbol}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {currency.isBase ? '1.0000 (Base)' : currency.exchangeRate.toFixed(4)}
                    </div>
                    <div className="text-xs text-gray-500">
                      1 {baseCurrency} = {currency.exchangeRate.toFixed(4)} {currency.code}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(1000, currency.code)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(currency)}`}>
                      {getStatusText(currency)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(currency.lastUpdated).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {!currency.isBase && (
                        <button 
                          onClick={() => handleSetBaseCurrency(currency.code)}
                          className="w-8 h-8 flex items-center justify-center text-blue-600 hover:text-blue-900 cursor-pointer"
                          title="Set as Base Currency"
                        >
                          <i className="ri-bank-line"></i>
                        </button>
                      )}
                      <button 
                        onClick={() => handleSetDisplayCurrency(currency.code)}
                        className="w-8 h-8 flex items-center justify-center text-green-600 hover:text-green-900 cursor-pointer"
                        title="Set as Display Currency"
                      >
                        <i className="ri-eye-line"></i>
                      </button>
                      <button className="w-8 h-8 flex items-center justify-center text-purple-600 hover:text-purple-900 cursor-pointer">
                        <i className="ri-edit-line"></i>
                      </button>
                      {!currency.isBase && (
                        <button className="w-8 h-8 flex items-center justify-center text-red-600 hover:text-red-900 cursor-pointer">
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Currency Modal */}
      <Modal
        isOpen={isAddCurrencyModalOpen}
        onClose={() => setIsAddCurrencyModalOpen(false)}
        title="Add New Currency"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Currency Code" 
              placeholder="USD" 
              value={newCurrency.code}
              onChange={(e) => setNewCurrency(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
            />
            <Input 
              label="Currency Name" 
              placeholder="US Dollar"
              value={newCurrency.name}
              onChange={(e) => setNewCurrency(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input 
              label="Symbol" 
              placeholder="$"
              value={newCurrency.symbol}
              onChange={(e) => setNewCurrency(prev => ({ ...prev, symbol: e.target.value }))}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Symbol Position</label>
              <select 
                value={newCurrency.position}
                onChange={(e) => setNewCurrency(prev => ({ ...prev, position: e.target.value as 'before' | 'after' }))}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
              >
                <option value="before">Before Amount</option>
                <option value="after">After Amount</option>
              </select>
            </div>
            <Input 
              label="Decimal Places" 
              type="number" 
              placeholder="2"
              value={newCurrency.decimals}
              onChange={(e) => setNewCurrency(prev => ({ ...prev, decimals: parseInt(e.target.value) || 2 }))}
            />
          </div>
          <Input 
            label="Exchange Rate" 
            type="number" 
            step="0.0001"
            placeholder="1.0000"
            value={newCurrency.exchangeRate}
            onChange={(e) => setNewCurrency(prev => ({ ...prev, exchangeRate: parseFloat(e.target.value) || 1.0 }))}
          />
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Preview</h4>
            <p className="text-sm text-blue-700">
              Sample: {newCurrency.position === 'before' ? newCurrency.symbol : ''} 1,234{newCurrency.decimals > 0 ? '.00' : ''} {newCurrency.position === 'after' ? newCurrency.symbol : ''} {newCurrency.code}
            </p>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setIsAddCurrencyModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsAddCurrencyModalOpen(false)}>
              Add Currency
            </Button>
          </div>
        </div>
      </Modal>

      {/* Exchange Rate History Modal */}
      <Modal
        isOpen={isRateHistoryModalOpen}
        onClose={() => setIsRateHistoryModalOpen(false)}
        title="Exchange Rate History"
        size="xl"
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-gray-600">Historical exchange rate data for the past 30 days</p>
            <Button size="sm">
              <i className="ri-download-line mr-2"></i>
              Export Data
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">From</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">To</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {exchangeRateHistory.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{record.date}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{record.fromCurrency}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{record.toCurrency}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{record.rate.toFixed(4)}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{record.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>

      {/* Currency Settings Modal */}
      <Modal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        title="Currency Settings"
        size="lg"
      >
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Display Settings</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked={currencySettings.showCurrencySymbol} className="mr-2" />
                  <span className="text-sm text-gray-700">Show Currency Symbol</span>
                </label>
              </div>
              <div>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked={currencySettings.showCurrencyCode} className="mr-2" />
                  <span className="text-sm text-gray-700">Show Currency Code</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Exchange Rate Settings</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked={currencySettings.autoUpdateRates} className="mr-2" />
                  <span className="text-sm text-gray-700">Auto Update Exchange Rates</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Update Frequency</label>
                <select 
                  defaultValue={currencySettings.updateFrequency}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Formatting Settings</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rounding Method</label>
                <select 
                  defaultValue={currencySettings.roundingMethod}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                >
                  <option value="round">Round</option>
                  <option value="floor">Floor</option>
                  <option value="ceil">Ceiling</option>
                </select>
              </div>
              <Input label="Decimal Separator" defaultValue={currencySettings.decimalSeparator} />
              <Input label="Thousands Separator" defaultValue={currencySettings.thousandsSeparator} />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setIsSettingsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsSettingsModalOpen(false)}>
              Save Settings
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
