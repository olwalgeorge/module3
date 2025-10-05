
import { useState } from 'react';
import { useCurrency } from '../../../hooks/useCurrency';
import { currencies, currencySettings, exchangeRateHistory } from '../../../mocks/currencies';
import Button from '../../../components/base/Button';
import Input from '../../../components/base/Input';
import Modal from '../../../components/base/Modal';

interface Transaction {
  id: number;
  date: string;
  type: 'Income' | 'Expense' | 'Transfer';
  category: string;
  description: string;
  amount: number;
  currency: string;
  account: string;
  reference: string;
  status: 'Completed' | 'Pending' | 'Cancelled';
  taxRate?: number;
  taxAmount?: number;
  attachments?: string[];
}

interface Account {
  id: number;
  name: string;
  type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  balance: number;
  currency: string;
  status: 'Active' | 'Inactive';
}

interface TaxRate {
  id: number;
  name: string;
  rate: number;
  type: 'Sales' | 'Purchase' | 'Income' | 'Payroll';
  description: string;
  isActive: boolean;
}

interface CostCenter {
  id: number;
  name: string;
  code: string;
  description: string;
  budget: number;
  spent: number;
  currency: string;
  isActive: boolean;
}

interface ExpenseCategory {
  id: number;
  name: string;
  code: string;
  description: string;
  budget: number;
  spent: number;
  parentId?: number;
  isActive: boolean;
}

const mockTransactions: Transaction[] = [
  {
    id: 1,
    date: '2024-01-15',
    type: 'Income',
    category: 'Sales Revenue',
    description: 'Product sales - Order #1001',
    amount: 2500.00,
    currency: 'USD',
    account: 'Sales Revenue',
    reference: 'INV-001',
    status: 'Completed',
    taxRate: 10,
    taxAmount: 250.00
  },
  {
    id: 2,
    date: '2024-01-14',
    type: 'Expense',
    category: 'Inventory Purchase',
    description: 'Purchase from TechCorp Supplies',
    amount: 1200.00,
    currency: 'USD',
    account: 'Cost of Goods Sold',
    reference: 'PO-001',
    status: 'Completed',
    taxRate: 8,
    taxAmount: 96.00
  },
  {
    id: 3,
    date: '2024-01-13',
    type: 'Expense',
    category: 'Operating Expenses',
    description: 'Office rent payment',
    amount: 800.00,
    currency: 'USD',
    account: 'Rent Expense',
    reference: 'RENT-001',
    status: 'Completed'
  },
  {
    id: 4,
    date: '2024-01-12',
    type: 'Income',
    category: 'Sales Revenue',
    description: 'Product sales - Order #1002',
    amount: 1800.00,
    currency: 'USD',
    account: 'Sales Revenue',
    reference: 'INV-002',
    status: 'Completed',
    taxRate: 10,
    taxAmount: 180.00
  },
  {
    id: 5,
    date: '2024-01-11',
    type: 'Expense',
    category: 'Marketing',
    description: 'Google Ads campaign',
    amount: 300.00,
    currency: 'USD',
    account: 'Marketing Expense',
    reference: 'MKT-001',
    status: 'Pending'
  }
];

const mockAccounts: Account[] = [
  { id: 1, name: 'Cash', type: 'Asset', balance: 15000.00, currency: 'USD', status: 'Active' },
  { id: 2, name: 'Accounts Receivable', type: 'Asset', balance: 8500.00, currency: 'USD', status: 'Active' },
  { id: 3, name: 'Inventory', type: 'Asset', balance: 25000.00, currency: 'USD', status: 'Active' },
  { id: 4, name: 'Equipment', type: 'Asset', balance: 12000.00, currency: 'USD', status: 'Active' },
  { id: 5, name: 'Accounts Payable', type: 'Liability', balance: 5500.00, currency: 'USD', status: 'Active' },
  { id: 6, name: 'Sales Tax Payable', type: 'Liability', balance: 1250.00, currency: 'USD', status: 'Active' },
  { id: 7, name: 'Sales Revenue', type: 'Revenue', balance: 45000.00, currency: 'USD', status: 'Active' },
  { id: 8, name: 'Cost of Goods Sold', type: 'Expense', balance: 18000.00, currency: 'USD', status: 'Active' },
  { id: 9, name: 'Rent Expense', type: 'Expense', balance: 9600.00, currency: 'USD', status: 'Active' },
  { id: 10, name: 'Marketing Expense', type: 'Expense', balance: 3200.00, currency: 'USD', status: 'Active' },
  { id: 11, name: 'Owner Equity', type: 'Equity', balance: 30000.00, currency: 'USD', status: 'Active' }
];

const mockTaxRates: TaxRate[] = [
  { id: 1, name: 'Sales Tax', rate: 10.0, type: 'Sales', description: 'Standard sales tax rate', isActive: true },
  { id: 2, name: 'VAT Standard', rate: 20.0, type: 'Sales', description: 'Value Added Tax - Standard rate', isActive: true },
  { id: 3, name: 'VAT Reduced', rate: 5.0, type: 'Sales', description: 'Value Added Tax - Reduced rate', isActive: true },
  { id: 4, name: 'Purchase Tax', rate: 8.0, type: 'Purchase', description: 'Tax on purchases', isActive: true },
  { id: 5, name: 'Income Tax', rate: 25.0, type: 'Income', description: 'Corporate income tax', isActive: true },
  { id: 6, name: 'Payroll Tax', rate: 15.0, type: 'Payroll', description: 'Payroll tax rate', isActive: true }
];

const mockCostCenters: CostCenter[] = [
  { id: 1, name: 'Sales Department', code: 'SALES', description: 'Sales and marketing activities', budget: 50000, spent: 32000, currency: 'USD', isActive: true },
  { id: 2, name: 'Operations', code: 'OPS', description: 'Operational activities', budget: 75000, spent: 45000, currency: 'USD', isActive: true },
  { id: 3, name: 'IT Department', code: 'IT', description: 'Information technology', budget: 30000, spent: 18000, currency: 'USD', isActive: true },
  { id: 4, name: 'HR Department', code: 'HR', description: 'Human resources', budget: 25000, spent: 15000, currency: 'USD', isActive: true }
];

const mockExpenseCategories: ExpenseCategory[] = [
  { id: 1, name: 'Office Expenses', code: 'OFF', description: 'General office expenses', budget: 12000, spent: 8500, isActive: true },
  { id: 2, name: 'Travel & Entertainment', code: 'T&E', description: 'Business travel and entertainment', budget: 15000, spent: 9200, isActive: true },
  { id: 3, name: 'Professional Services', code: 'PROF', description: 'Legal, accounting, consulting', budget: 20000, spent: 12000, isActive: true },
  { id: 4, name: 'Utilities', code: 'UTIL', description: 'Electricity, water, internet', budget: 8000, spent: 5400, isActive: true },
  { id: 5, name: 'Insurance', code: 'INS', description: 'Business insurance premiums', budget: 10000, spent: 7500, isActive: true },
  { id: 6, name: 'Equipment & Software', code: 'EQUIP', description: 'Hardware and software purchases', budget: 25000, spent: 16000, isActive: true }
];

export default function Accounting() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedAccount, setSelectedAccount] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('this-month');
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);
  const [isTaxModalOpen, setIsTaxModalOpen] = useState(false);
  const [isCostCenterModalOpen, setIsCostCenterModalOpen] = useState(false);
  const [isExpenseCategoryModalOpen, setIsExpenseCategoryModalOpen] = useState(false);
  const [isAddCurrencyModalOpen, setIsAddCurrencyModalOpen] = useState(false);
  const [isRateHistoryModalOpen, setIsRateHistoryModalOpen] = useState(false);
  const [isCurrencySettingsModalOpen, setIsCurrencySettingsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [newTransaction, setNewTransaction] = useState<Partial<Transaction>>({
    type: 'Income',
    category: '',
    description: '',
    amount: 0,
    currency: 'USD',
    account: '',
    reference: '',
    date: new Date().toISOString().split('T')[0],
    taxRate: 0,
    taxAmount: 0
  });
  const [newAccount, setNewAccount] = useState<Partial<Account>>({
    name: '',
    type: 'Asset',
    balance: 0,
    currency: 'USD'
  });
  const [newTaxRate, setNewTaxRate] = useState<Partial<TaxRate>>({
    name: '',
    rate: 0,
    type: 'Sales',
    description: '',
    isActive: true
  });
  const [newCostCenter, setNewCostCenter] = useState<Partial<CostCenter>>({
    name: '',
    code: '',
    description: '',
    budget: 0,
    spent: 0,
    currency: 'USD',
    isActive: true
  });
  const [newExpenseCategory, setNewExpenseCategory] = useState<Partial<ExpenseCategory>>({
    name: '',
    code: '',
    description: '',
    budget: 0,
    spent: 0,
    isActive: true
  });
  const [newCurrency, setNewCurrency] = useState({
    code: '',
    name: '',
    symbol: '',
    position: 'before' as 'before' | 'after',
    decimals: 2,
    exchangeRate: 1.0
  });

  const { formatCurrency, convertCurrency, displayCurrency, availableCurrencies, updateDisplayCurrency, updateBaseCurrency, baseCurrency } = useCurrency();

  const filteredTransactions = mockTransactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || transaction.type === selectedType;
    const matchesAccount = selectedAccount === 'all' || transaction.account === selectedAccount;
    return matchesSearch && matchesType && matchesAccount;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Income': return 'bg-green-100 text-green-800';
      case 'Expense': return 'bg-red-100 text-red-800';
      case 'Transfer': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Income': return 'ri-arrow-up-line';
      case 'Expense': return 'ri-arrow-down-line';
      case 'Transfer': return 'ri-exchange-line';
      default: return 'ri-file-list-line';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'Asset': return 'bg-blue-100 text-blue-800';
      case 'Liability': return 'bg-red-100 text-red-800';
      case 'Equity': return 'bg-purple-100 text-purple-800';
      case 'Revenue': return 'bg-green-100 text-green-800';
      case 'Expense': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTaxTypeColor = (type: string) => {
    switch (type) {
      case 'Sales': return 'bg-green-100 text-green-800';
      case 'Purchase': return 'bg-blue-100 text-blue-800';
      case 'Income': return 'bg-purple-100 text-purple-800';
      case 'Payroll': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate financial metrics with tax considerations
  const totalIncome = mockTransactions
    .filter(t => t.type === 'Income' && t.status === 'Completed')
    .reduce((sum, t) => sum + convertCurrency(t.amount, t.currency, displayCurrency), 0);

  const totalExpenses = mockTransactions
    .filter(t => t.type === 'Expense' && t.status === 'Completed')
    .reduce((sum, t) => sum + convertCurrency(t.amount, t.currency, displayCurrency), 0);

  const totalTaxes = mockTransactions
    .filter(t => t.status === 'Completed' && t.taxAmount)
    .reduce((sum, t) => sum + convertCurrency(t.taxAmount || 0, t.currency, displayCurrency), 0);

  const netProfit = totalIncome - totalExpenses - totalTaxes;

  const totalAssets = mockAccounts
    .filter(a => a.type === 'Asset')
    .reduce((sum, a) => sum + convertCurrency(a.balance, a.currency, displayCurrency), 0);

  const totalLiabilities = mockAccounts
    .filter(a => a.type === 'Liability')
    .reduce((sum, a) => sum + convertCurrency(a.balance, a.currency, displayCurrency), 0);

  const calculateTaxAmount = (amount: number, taxRate: number) => {
    return (amount * taxRate) / 100;
  };

  const handleTaxRateChange = (taxRate: number) => {
    const taxAmount = calculateTaxAmount(newTransaction.amount || 0, taxRate);
    setNewTransaction(prev => ({ ...prev, taxRate, taxAmount }));
  };

  const handleCreateTransaction = () => {
    console.log('Creating transaction:', newTransaction);
    setIsAddTransactionModalOpen(false);
    setNewTransaction({
      type: 'Income',
      category: '',
      description: '',
      amount: 0,
      currency: 'USD',
      account: '',
      reference: '',
      date: new Date().toISOString().split('T')[0],
      taxRate: 0,
      taxAmount: 0
    });
  };

  const handleCreateAccount = () => {
    console.log('Creating account:', newAccount);
    setIsAddAccountModalOpen(false);
    setNewAccount({
      name: '',
      type: 'Asset',
      balance: 0,
      currency: 'USD'
    });
  };

  const handleCreateTaxRate = () => {
    console.log('Creating tax rate:', newTaxRate);
    setIsTaxModalOpen(false);
    setNewTaxRate({
      name: '',
      rate: 0,
      type: 'Sales',
      description: '',
      isActive: true
    });
  };

  const handleCreateCostCenter = () => {
    console.log('Creating cost center:', newCostCenter);
    setIsCostCenterModalOpen(false);
    setNewCostCenter({
      name: '',
      code: '',
      description: '',
      budget: 0,
      spent: 0,
      currency: 'USD',
      isActive: true
    });
  };

  const handleCreateExpenseCategory = () => {
    console.log('Creating expense category:', newExpenseCategory);
    setIsExpenseCategoryModalOpen(false);
    setNewExpenseCategory({
      name: '',
      code: '',
      description: '',
      budget: 0,
      spent: 0,
      isActive: true
    });
  };

  // Currency management functions
  const handleUpdateExchangeRates = () => {
    console.log('Updating exchange rates...');
  };

  const handleSetBaseCurrency = (currencyCode: string) => {
    updateBaseCurrency(currencyCode);
    console.log(`Base currency updated to ${currencyCode}`);
  };

  const handleSetDisplayCurrency = (currencyCode: string) => {
    updateDisplayCurrency(currencyCode);
    console.log(`Display currency updated to ${currencyCode}`);
  };

  const getCurrencyStatusColor = (currency: any) => {
    if (currency.isBase) return 'bg-blue-100 text-blue-800';
    if (currency.exchangeRate > 0) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getCurrencyStatusText = (currency: any) => {
    if (currency.isBase) return 'Base Currency';
    if (currency.exchangeRate > 0) return 'Active';
    return 'Inactive';
  };

  const calculateCurrencyStats = () => {
    const totalCurrencies = availableCurrencies.length;
    const activeCurrencies = availableCurrencies.filter(c => c.exchangeRate > 0).length;
    const baseCurrencyData = availableCurrencies.find(c => c.isBase);
    const lastUpdate = new Date(currencySettings.lastRateUpdate).toLocaleDateString();

    return { totalCurrencies, activeCurrencies, baseCurrencyData, lastUpdate };
  };

  // Currency Management Tab
  const renderCurrencyManagement = () => {
    const stats = calculateCurrencyStats();
    const filteredCurrencies = availableCurrencies.filter(currency => {
      const matchesSearch = currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           currency.code.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });

    return (
      <div className="space-y-6">
        {/* Currency Statistics Cards */}
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

        {/* Currency Actions */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-3">
            <Button variant="secondary" onClick={() => setIsRateHistoryModalOpen(true)}>
              <i className="ri-line-chart-line mr-2"></i>
              Rate History
            </Button>
            <Button variant="secondary" onClick={() => setIsCurrencySettingsModalOpen(true)}>
              <i className="ri-settings-3-line mr-2"></i>
              Currency Settings
            </Button>
            <Button onClick={handleUpdateExchangeRates}>
              <i className="ri-refresh-line mr-2"></i>
              Update Rates
            </Button>
          </div>
          <Button onClick={() => setIsAddCurrencyModalOpen(true)}>
            <i className="ri-add-line mr-2"></i>
            Add Currency
          </Button>
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
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Currency Management</h3>
              <Input
                placeholder="Search currencies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
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
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCurrencyStatusColor(currency)}`}>
                        {getCurrencyStatusText(currency)}
                      </span>
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
      </div>
    );
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Income</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="ri-arrow-up-line text-green-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <i className="ri-arrow-down-line text-red-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Taxes</p>
              <p className="text-2xl font-bold text-orange-600">{formatCurrency(totalTaxes)}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <i className="ri-file-text-line text-orange-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Profit</p>
              <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(netProfit)}
              </p>
            </div>
            <div className={`w-12 h-12 ${netProfit >= 0 ? 'bg-green-100' : 'bg-red-100'} rounded-lg flex items-center justify-center`}>
              <i className={`${netProfit >= 0 ? 'ri-trending-up-line text-green-600' : 'ri-trending-down-line text-red-600'} text-xl`}></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Assets</p>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalAssets)}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="ri-safe-line text-blue-600 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <Button onClick={() => setIsAddTransactionModalOpen(true)}>
            <i className="ri-add-line mr-2"></i>
            Add Transaction
          </Button>
          <Button variant="secondary" onClick={() => setIsAddAccountModalOpen(true)}>
            <i className="ri-bank-line mr-2"></i>
            Add Account
          </Button>
          <Button variant="secondary" onClick={() => setIsTaxModalOpen(true)}>
            <i className="ri-file-text-line mr-2"></i>
            Manage Taxes
          </Button>
          <Button variant="secondary" onClick={() => setIsCostCenterModalOpen(true)}>
            <i className="ri-building-line mr-2"></i>
            Cost Centers
          </Button>
          <Button variant="secondary" onClick={() => setIsReportsModalOpen(true)}>
            <i className="ri-file-chart-line mr-2"></i>
            Generate Report
          </Button>
          <Button variant="secondary">
            <i className="ri-download-line mr-2"></i>
            Export Data
          </Button>
        </div>
      </div>

      {/* Cost Centers Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Cost Centers Performance</h3>
            <Button variant="secondary" size="sm" onClick={() => setActiveTab('costing')}>
              View All
            </Button>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockCostCenters.slice(0, 4).map((center) => {
              const budgetUsed = (center.spent / center.budget) * 100;
              const convertedBudget = convertCurrency(center.budget, center.currency, displayCurrency);
              const convertedSpent = convertCurrency(center.spent, center.currency, displayCurrency);
              
              return (
                <div key={center.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{center.name}</h4>
                    <span className="text-xs text-gray-500">{center.code}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Budget:</span>
                      <span className="font-medium">{formatCurrency(convertedBudget)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Spent:</span>
                      <span className="font-medium">{formatCurrency(convertedSpent)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${budgetUsed > 90 ? 'bg-red-500' : budgetUsed > 75 ? 'bg-yellow-500' : 'bg-green-500'}`}
                        style={{ width: `${Math.min(budgetUsed, 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 text-center">
                      {budgetUsed.toFixed(1)}% used
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
            <Button variant="secondary" size="sm" onClick={() => setActiveTab('transactions')}>
              View All
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tax</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockTransactions.slice(0, 5).map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(transaction.type)}`}>
                      <i className={`${getTypeIcon(transaction.type)} mr-1`}></i>
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(convertCurrency(transaction.amount, transaction.currency, displayCurrency))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.taxAmount ? formatCurrency(convertCurrency(transaction.taxAmount, transaction.currency, displayCurrency)) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTransactions = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
            >
              <option value="all">All Types</option>
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
              <option value="Transfer">Transfer</option>
            </select>
          </div>

          <div>
            <select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
            >
              <option value="all">All Accounts</option>
              {mockAccounts.map(account => (
                <option key={account.id} value={account.name}>{account.name}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
            >
              <option value="this-month">This Month</option>
              <option value="last-month">Last Month</option>
              <option value="this-quarter">This Quarter</option>
              <option value="this-year">This Year</option>
              <option value="all-time">All Time</option>
            </select>
          </div>
          
          <Button onClick={() => setIsAddTransactionModalOpen(true)}>
            <i className="ri-add-line mr-2"></i>
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(transaction.type)}`}>
                      <i className={`${getTypeIcon(transaction.type)} mr-1`}></i>
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {transaction.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {transaction.account}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <div className={transaction.type === 'Expense' ? 'text-red-600' : 'text-green-600'}>
                      {transaction.type === 'Expense' ? '-' : '+'}{formatCurrency(convertCurrency(transaction.amount, transaction.currency, displayCurrency))}
                    </div>
                    {transaction.currency !== displayCurrency && (
                      <div className="text-xs text-gray-500">
                        {formatCurrency(transaction.amount, transaction.currency)} {transaction.currency}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {transaction.reference}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setSelectedTransaction(transaction)}
                        className="w-8 h-8 flex items-center justify-center text-blue-600 hover:text-blue-900 cursor-pointer"
                        title="View Transaction"
                      >
                        <i className="ri-eye-line"></i>
                      </button>
                      <button className="w-8 h-8 flex items-center justify-center text-green-600 hover:text-green-900 cursor-pointer">
                        <i className="ri-edit-line"></i>
                      </button>
                      <button className="w-8 h-8 flex items-center justify-center text-red-600 hover:text-red-900 cursor-pointer">
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAccounts = () => (
    <div className="space-y-6">
      {/* Account Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'].map(type => {
          const accounts = mockAccounts.filter(a => a.type === type);
          const totalBalance = accounts.reduce((sum, a) => sum + convertCurrency(a.balance, a.currency, displayCurrency), 0);
          
          return (
            <div key={type} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">{type}s</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(totalBalance)}</p>
                <p className="text-xs text-gray-500">{accounts.length} accounts</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Account Button */}
      <div className="flex justify-end">
        <Button onClick={() => setIsAddAccountModalOpen(true)}>
          <i className="ri-add-line mr-2"></i>
          Add Account
        </Button>
      </div>

      {/* Accounts Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Currency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockAccounts.map((account) => (
                <tr key={account.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-sm font-medium">
                          {account.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{account.name}</div>
                        <div className="text-sm text-gray-500">Account #{account.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAccountTypeColor(account.type)}`}>
                      {account.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(convertCurrency(account.balance, account.currency, displayCurrency))}
                    {account.currency !== displayCurrency && (
                      <div className="text-xs text-gray-500">
                        {formatCurrency(account.balance, account.currency)} {account.currency}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {account.currency}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${account.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {account.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="w-8 h-8 flex items-center justify-center text-blue-600 hover:text-blue-900 cursor-pointer">
                        <i className="ri-eye-line"></i>
                      </button>
                      <button className="w-8 h-8 flex items-center justify-center text-green-600 hover:text-green-900 cursor-pointer">
                        <i className="ri-edit-line"></i>
                      </button>
                      <button className="w-8 h-8 flex items-center justify-center text-red-600 hover:text-red-900 cursor-pointer">
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTaxes = () => (
    <div className="space-y-6">
      {/* Tax Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sales Tax Collected</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalTaxes * 0.6)}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="ri-money-dollar-circle-line text-green-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Purchase Tax Paid</p>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalTaxes * 0.3)}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="ri-shopping-cart-line text-blue-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tax Payable</p>
              <p className="text-2xl font-bold text-orange-600">{formatCurrency(totalTaxes * 0.1)}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <i className="ri-file-text-line text-orange-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Tax Rates</p>
              <p className="text-2xl font-bold text-purple-600">{mockTaxRates.filter(t => t.isActive).length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <i className="ri-percent-line text-purple-600 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Add Tax Rate Button */}
      <div className="flex justify-end">
        <Button onClick={() => setIsTaxModalOpen(true)}>
          <i className="ri-add-line mr-2"></i>
          Add Tax Rate
        </Button>
      </div>

      {/* Tax Rates Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockTaxRates.map((taxRate) => (
                <tr key={taxRate.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-sm font-medium">
                          {taxRate.rate}%
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{taxRate.name}</div>
                        <div className="text-sm text-gray-500">Tax #{taxRate.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTaxTypeColor(taxRate.type)}`}>
                      {taxRate.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {taxRate.rate}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {taxRate.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${taxRate.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {taxRate.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="w-8 h-8 flex items-center justify-center text-blue-600 hover:text-blue-900 cursor-pointer">
                        <i className="ri-eye-line"></i>
                      </button>
                      <button className="w-8 h-8 flex items-center justify-center text-green-600 hover:text-green-900 cursor-pointer">
                        <i className="ri-edit-line"></i>
                      </button>
                      <button className="w-8 h-8 flex items-center justify-center text-red-600 hover:text-red-900 cursor-pointer">
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCosting = () => (
    <div className="space-y-6">
      {/* Cost Center Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Centers</h3>
          <div className="space-y-4">
            {mockCostCenters.map((center) => {
              const budgetUsed = (center.spent / center.budget) * 100;
              const convertedBudget = convertCurrency(center.budget, center.currency, displayCurrency);
              const convertedSpent = convertCurrency(center.spent, center.currency, displayCurrency);
              
              return (
                <div key={center.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{center.name}</h4>
                    <span className="text-xs text-gray-500">{center.code}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Budget:</span>
                      <span className="font-medium">{formatCurrency(convertedBudget)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Spent:</span>
                      <span className="font-medium">{formatCurrency(convertedSpent)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Remaining:</span>
                      <span className={`font-medium ${convertedBudget - convertedSpent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(convertedBudget - convertedSpent)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${budgetUsed > 90 ? 'bg-red-500' : budgetUsed > 75 ? 'bg-yellow-500' : 'bg-green-500'}`}
                        style={{ width: `${Math.min(budgetUsed, 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 text-center">
                      {budgetUsed.toFixed(1)}% used
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <Button className="mt-4 w-full" variant="secondary" onClick={() => setIsCostCenterModalOpen(true)}>
            <i className="ri-add-line mr-2"></i>
            Add Cost Center
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Categories</h3>
          <div className="space-y-4">
            {mockExpenseCategories.map((category) => {
              const budgetUsed = (category.spent / category.budget) * 100;
              
              return (
                <div key={category.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{category.name}</h4>
                    <span className="text-xs text-gray-500">{category.code}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Budget:</span>
                      <span className="font-medium">{formatCurrency(category.budget)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Spent:</span>
                      <span className="font-medium">{formatCurrency(category.spent)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Remaining:</span>
                      <span className={`font-medium ${category.budget - category.spent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(category.budget - category.spent)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${budgetUsed > 90 ? 'bg-red-500' : budgetUsed > 75 ? 'bg-yellow-500' : 'bg-green-500'}`}
                        style={{ width: `${Math.min(budgetUsed, 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 text-center">
                      {budgetUsed.toFixed(1)}% used
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <Button className="mt-4 w-full" variant="secondary" onClick={() => setIsExpenseCategoryModalOpen(true)}>
            <i className="ri-add-line mr-2"></i>
            Add Category
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Accounting & Finance</h2>
          <p className="text-gray-600">Complete financial management with taxes, costing, and multi-currency support</p>
        </div>
        <div className="flex items-center space-x-3">
          <div>
            <select
              value={displayCurrency}
              onChange={(e) => handleSetDisplayCurrency(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
            >
              {availableCurrencies.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: 'ri-dashboard-line' },
              { id: 'transactions', name: 'Transactions', icon: 'ri-exchange-line' },
              { id: 'accounts', name: 'Chart of Accounts', icon: 'ri-bank-line' },
              { id: 'taxes', name: 'Tax Management', icon: 'ri-file-text-line' },
              { id: 'costing', name: 'Cost Centers', icon: 'ri-building-line' },
              { id: 'currency', name: 'Currency Management', icon: 'ri-money-dollar-circle-line' },
              { id: 'reports', name: 'Reports', icon: 'ri-file-chart-line' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className={`${tab.icon} mr-2`}></i>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-6">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'transactions' && renderTransactions()}
          {activeTab === 'accounts' && renderAccounts()}
          {activeTab === 'taxes' && renderTaxes()}
          {activeTab === 'costing' && renderCosting()}
          {activeTab === 'currency' && renderCurrencyManagement()}
          {activeTab === 'reports' && (
            <div className="text-center py-12">
              <i className="ri-file-chart-line text-6xl text-gray-300 mb-4"></i>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Financial Reports</h3>
              <p className="text-gray-600 mb-4">Generate comprehensive financial reports and analytics</p>
              <Button onClick={() => setIsReportsModalOpen(true)}>
                <i className="ri-file-chart-line mr-2"></i>
                Generate Report
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Add Transaction Modal */}
      <Modal
        isOpen={isAddTransactionModalOpen}
        onClose={() => setIsAddTransactionModalOpen(false)}
        title="Add New Transaction"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
              <select 
                value={newTransaction.type}
                onChange={(e) => setNewTransaction(prev => ({ ...prev, type: e.target.value as 'Income' | 'Expense' | 'Transfer' }))}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
              >
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
                <option value="Transfer">Transfer</option>
              </select>
            </div>
            <Input 
              label="Date" 
              type="date"
              value={newTransaction.date}
              onChange={(e) => setNewTransaction(prev => ({ ...prev, date: e.target.value }))}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Category" 
              placeholder="e.g., Sales Revenue, Office Supplies"
              value={newTransaction.category}
              onChange={(e) => setNewTransaction(prev => ({ ...prev, category: e.target.value }))}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account</label>
              <select 
                value={newTransaction.account}
                onChange={(e) => setNewTransaction(prev => ({ ...prev, account: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
              >
                <option value="">Select Account</option>
                {mockAccounts.filter(a => a.status === 'Active').map(account => (
                  <option key={account.id} value={account.name}>{account.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <Input 
            label="Description" 
            placeholder="Transaction description"
            value={newTransaction.description}
            onChange={(e) => setNewTransaction(prev => ({ ...prev, description: e.target.value }))}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input 
              label="Amount" 
              type="number"
              step="0.01"
              placeholder="0.00"
              value={newTransaction.amount}
              onChange={(e) => {
                const amount = parseFloat(e.target.value) || 0;
                setNewTransaction(prev => ({ 
                  ...prev, 
                  amount,
                  taxAmount: calculateTaxAmount(amount, prev.taxRate || 0)
                }));
              }}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select 
                value={newTransaction.currency}
                onChange={(e) => setNewTransaction(prev => ({ ...prev, currency: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
              >
                {availableCurrencies.map(currency => (
                  <option key={currency.code} value={currency.code}>{currency.code}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
              <select 
                value={newTransaction.taxRate || 0}
                onChange={(e) => handleTaxRateChange(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
              >
                <option value={0}>No Tax</option>
                {mockTaxRates.filter(t => t.isActive).map(tax => (
                  <option key={tax.id} value={tax.rate}>{tax.name} ({tax.rate}%)</option>
                ))}
              </select>
            </div>
            <Input 
              label="Tax Amount" 
              type="number"
              step="0.01"
              placeholder="0.00"
              value={newTransaction.taxAmount || 0}
              onChange={(e) => setNewTransaction(prev => ({ ...prev, taxAmount: parseFloat(e.target.value) || 0 }))}
              disabled
            />
          </div>
          
          <Input 
            label="Reference" 
            placeholder="INV-001, PO-001, etc."
            value={newTransaction.reference}
            onChange={(e) => setNewTransaction(prev => ({ ...prev, reference: e.target.value }))}
          />

          {/* Transaction Summary */}
          {(newTransaction.amount || 0) > 0 && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Transaction Summary</h4>
              <div className="space-y-1 text-sm text-blue-700">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(newTransaction.amount || 0, newTransaction.currency)}</span>
                </div>
                {(newTransaction.taxAmount || 0) > 0 && (
                  <div className="flex justify-between">
                    <span>Tax ({newTransaction.taxRate}%):</span>
                    <span>{formatCurrency(newTransaction.taxAmount || 0, newTransaction.currency)}</span>
                  </div>
                )}
                <div className="flex justify-between font-medium border-t border-blue-200 pt-1">
                  <span>Total:</span>
                  <span>{formatCurrency((newTransaction.amount || 0) + (newTransaction.taxAmount || 0), newTransaction.currency)}</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setIsAddTransactionModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTransaction}>
              Add Transaction
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Tax Rate Modal */}
      <Modal
        isOpen={isTaxModalOpen}
        onClose={() => setIsTaxModalOpen(false)}
        title="Add Tax Rate"
        size="md"
      >
        <div className="space-y-4">
          <Input 
            label="Tax Name" 
            placeholder="e.g., Sales Tax, VAT"
            value={newTaxRate.name}
            onChange={(e) => setNewTaxRate(prev => ({ ...prev, name: e.target.value }))}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tax Type</label>
              <select 
                value={newTaxRate.type}
                onChange={(e) => setNewTaxRate(prev => ({ ...prev, type: e.target.value as TaxRate['type'] }))}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
              >
                <option value="Sales">Sales Tax</option>
                <option value="Purchase">Purchase Tax</option>
                <option value="Income">Income Tax</option>
                <option value="Payroll">Payroll Tax</option>
              </select>
            </div>
            <Input 
              label="Tax Rate (%)" 
              type="number"
              step="0.01"
              placeholder="10.00"
              value={newTaxRate.rate}
              onChange={(e) => setNewTaxRate(prev => ({ ...prev, rate: parseFloat(e.target.value) || 0 }))}
            />
          </div>
          
          <div className="text-sm text-gray-700">
            <label className="block font-medium mb-1">Description</label>
            <textarea 
              value={newTaxRate.description}
              onChange={(e) => setNewTaxRate(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div className="flex items-center">
            <input 
              type="checkbox" 
              checked={newTaxRate.isActive}
              onChange={(e) => setNewTaxRate(prev => ({ ...prev, isActive: e.target.checked }))}
              className="mr-2" 
            />
            <span className="text-sm text-gray-700">Active</span>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setIsTaxModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTaxRate}>
              Add Tax Rate
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Cost Center Modal */}
      <Modal
        isOpen={isCostCenterModalOpen}
        onClose={() => setIsCostCenterModalOpen(false)}
        title="Add Cost Center"
        size="md"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Cost Center Name" 
              placeholder="e.g., Sales Department"
              value={newCostCenter.name}
              onChange={(e) => setNewCostCenter(prev => ({ ...prev, name: e.target.value }))}
            />
            <Input 
              label="Code" 
              placeholder="e.g., SALES"
              value={newCostCenter.code}
              onChange={(e) => setNewCostCenter(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
            />
          </div>
          
          <div className="text-sm text-gray-700">
            <label className="block font-medium mb-1">Description</label>
            <textarea 
              value={newCostCenter.description}
              onChange={(e) => setNewCostCenter(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Budget" 
              type="number"
              step="0.01"
              placeholder="50000.00"
              value={newCostCenter.budget}
              onChange={(e) => setNewCostCenter(prev => ({ ...prev, budget: parseFloat(e.target.value) || 0 }))}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select 
                value={newCostCenter.currency}
                onChange={(e) => setNewCostCenter(prev => ({ ...prev, currency: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
              >
                {availableCurrencies.map(currency => (
                  <option key={currency.code} value={currency.code}>{currency.code}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center">
            <input 
              type="checkbox" 
              checked={newCostCenter.isActive}
              onChange={(e) => setNewCostCenter(prev => ({ ...prev, isActive: e.target.checked }))}
              className="mr-2" 
            />
            <span className="text-sm text-gray-700">Active</span>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setIsCostCenterModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCostCenter}>
              Add Cost Center
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Expense Category Modal */}
      <Modal
        isOpen={isExpenseCategoryModalOpen}
        onClose={() => setIsExpenseCategoryModalOpen(false)}
        title="Add Expense Category"
        size="md"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Category Name" 
              placeholder="e.g., Office Expenses"
              value={newExpenseCategory.name}
              onChange={(e) => setNewExpenseCategory(prev => ({ ...prev, name: e.target.value }))}
            />
            <Input 
              label="Code" 
              placeholder="e.g., OFF"
              value={newExpenseCategory.code}
              onChange={(e) => setNewExpenseCategory(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
            />
          </div>
          
          <div className="text-sm text-gray-700">
            <label className="block font-medium mb-1">Description</label>
            <textarea 
              value={newExpenseCategory.description}
              onChange={(e) => setNewExpenseCategory(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <Input 
            label="Budget" 
            type="number"
            step="0.01"
            placeholder="12000.00"
            value={newExpenseCategory.budget}
            onChange={(e) => setNewExpenseCategory(prev => ({ ...prev, budget: parseFloat(e.target.value) || 0 }))}
          />

          <div className="flex items-center">
            <input 
              type="checkbox" 
              checked={newExpenseCategory.isActive}
              onChange={(e) => setNewExpenseCategory(prev => ({ ...prev, isActive: e.target.checked }))}
              className="mr-2" 
            />
            <span className="text-sm text-gray-700">Active</span>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setIsExpenseCategoryModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateExpenseCategory}>
              Add Category
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Account Modal */}
      <Modal
        isOpen={isAddAccountModalOpen}
        onClose={() => setIsAddAccountModalOpen(false)}
        title="Add New Account"
        size="md"
      >
        <div className="space-y-4">
          <Input 
            label="Account Name" 
            placeholder="e.g., Petty Cash, Office Equipment"
            value={newAccount.name}
            onChange={(e) => setNewAccount(prev => ({ ...prev, name: e.target.value }))}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
              <select 
                value={newAccount.type}
                onChange={(e) => setNewAccount(prev => ({ ...prev, type: e.target.value as Account['type'] }))}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
              >
                <option value="Asset">Asset</option>
                <option value="Liability">Liability</option>
                <option value="Equity">Equity</option>
                <option value="Revenue">Revenue</option>
                <option value="Expense">Expense</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select 
                value={newAccount.currency}
                onChange={(e) => setNewAccount(prev => ({ ...prev, currency: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
              >
                {availableCurrencies.map(currency => (
                  <option key={currency.code} value={currency.code}>{currency.code}</option>
                ))}
              </select>
            </div>
          </div>
          
          <Input 
            label="Opening Balance" 
            type="number"
            step="0.01"
            placeholder="0.00"
            value={newAccount.balance}
            onChange={(e) => setNewAccount(prev => ({ ...prev, balance: parseFloat(e.target.value) || 0 }))}
          />
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setIsAddAccountModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateAccount}>
              Add Account
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reports Modal */}
      <Modal
        isOpen={isReportsModalOpen}
        onClose={() => setIsReportsModalOpen(false)}
        title="Generate Financial Reports"
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 cursor-pointer">
              <div className="flex items-center mb-3">
                <i className="ri-file-chart-line text-2xl text-blue-600 mr-3"></i>
                <h3 className="font-semibold text-gray-900">Profit & Loss Statement</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">Income and expenses over a specific period</p>
              <Button size="sm" variant="secondary">Generate</Button>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 cursor-pointer">
              <div className="flex items-center mb-3">
                <i className="ri-scales-line text-2xl text-green-600 mr-3"></i>
                <h3 className="font-semibold text-gray-900">Balance Sheet</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">Assets, liabilities, and equity at a point in time</p>
              <Button size="sm" variant="secondary">Generate</Button>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 cursor-pointer">
              <div className="flex items-center mb-3">
                <i className="ri-water-flash-line text-2xl text-purple-600 mr-3"></i>
                <h3 className="font-semibold text-gray-900">Cash Flow Statement</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">Cash inflows and outflows over a period</p>
              <Button size="sm" variant="secondary">Generate</Button>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 cursor-pointer">
              <div className="flex items-center mb-3">
                <i className="ri-pie-chart-line text-2xl text-orange-600 mr-3"></i>
                <h3 className="font-semibold text-gray-900">Expense Analysis</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">Breakdown of expenses by category</p>
              <Button size="sm" variant="secondary">Generate</Button>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-900 mb-3">Report Settings</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
                <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8">
                  <option value="this-month">This Month</option>
                  <option value="last-month">Last Month</option>
                  <option value="this-quarter">This Quarter</option>
                  <option value="this-year">This Year</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8">
                  <option value="pdf">PDF</option>
                  <option value="excel">Excel</option>
                  <option value="csv">CSV</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8">
                  {availableCurrencies.map(currency => (
                    <option key={currency.code} value={currency.code}>{currency.code}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setIsReportsModalOpen(false)}>
              Close
            </Button>
            <Button>
              <i className="ri-download-line mr-2"></i>
              Generate & Download
            </Button>
          </div>
        </div>
      </Modal>

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
        isOpen={isCurrencySettingsModalOpen}
        onClose={() => setIsCurrencySettingsModalOpen(false)}
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
            <Button variant="secondary" onClick={() => setIsCurrencySettingsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsCurrencySettingsModalOpen(false)}>
              Save Settings
            </Button>
          </div>
        </div>
      </Modal>

      {/* ... existing modals for transactions, accounts, taxes, etc. ... */}
    </div>
  );
}
