# Component Architecture Documentation

## 📁 Project Location
## 📁 Project Location
**Target Folder**: `c:\Users\PC\byu classwork\CSE310\module3`

## Overview
This document outlines the component architecture and design patterns used in the InventoryPro application. The system follows React best practices with TypeScript for type safety and maintainability.

## Architecture Principles

### 1. Component Hierarchy
```
App
├── Router
├── Layout Components
│   ├── Header
│   ├── Sidebar
│   └── Main Content Area
└── Page Components
    ├── Dashboard
    ├── Product Management
    ├── Orders
    └── ... other modules
```

### 2. Component Types

#### Base Components (`src/components/base/`)
Reusable UI primitives that form the foundation of the interface.

#### Feature Components (`src/components/feature/`)
Complex components that combine base components for specific features.

#### Page Components (`src/pages/`)
Top-level components that represent entire pages or major sections.

## Component Categories

### Base Components

#### Button Component
**File**: `src/components/base/Button.tsx`

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  children,
  onClick,
  type = 'button',
  className = ''
}: ButtonProps) {
  // Implementation
}
```

**Usage Examples:**
```typescript
<Button variant="primary" size="lg" onClick={handleSave}>
  Save Product
</Button>

<Button variant="danger" icon="ri-delete-bin-line" loading={isDeleting}>
  Delete
</Button>
```

#### Input Component
**File**: `src/components/base/Input.tsx`

```typescript
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  icon?: string;
  className?: string;
}

export default function Input({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  icon,
  className = ''
}: InputProps) {
  // Implementation
}
```

#### Modal Component
**File**: `src/components/base/Modal.tsx`

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  footer?: React.ReactNode;
  closeOnOverlayClick?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  size = 'md',
  children,
  footer,
  closeOnOverlayClick = true
}: ModalProps) {
  // Implementation with portal and focus management
}
```

### Feature Components

#### Header Component
**File**: `src/components/feature/Header.tsx`

```typescript
interface HeaderProps {
  title?: string;
  user?: User;
  notifications?: Notification[];
  onProfileClick?: () => void;
  onNotificationClick?: (notification: Notification) => void;
}

export default function Header({
  title = 'Dashboard',
  user,
  notifications = [],
  onProfileClick,
  onNotificationClick
}: HeaderProps) {
  // Implementation includes:
  // - Page title
  // - User profile dropdown
  // - Notifications bell
  // - Search functionality
  // - Settings access
}
```

**Features:**
- Responsive design
- User authentication status
- Real-time notifications
- Quick search
- Profile management

#### Sidebar Component
**File**: `src/components/feature/Sidebar.tsx`

```typescript
interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  user?: User;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function Sidebar({
  activeTab,
  onTabChange,
  user,
  collapsed = false,
  onToggleCollapse
}: SidebarProps) {
  // Implementation includes:
  // - Navigation menu
  // - Role-based menu items
  // - Collapsible design
  // - Active state management
}
```

**Navigation Structure:**
```typescript
const menuItems = [
  { id: 'dashboard', name: 'Dashboard', icon: 'ri-dashboard-line', roles: ['all'] },
  { id: 'products', name: 'Products', icon: 'ri-box-3-line', roles: ['admin', 'manager', 'staff'] },
  { id: 'orders', name: 'Orders', icon: 'ri-shopping-cart-line', roles: ['admin', 'manager', 'staff'] },
  { id: 'purchases', name: 'Purchases', icon: 'ri-shopping-bag-3-line', roles: ['admin', 'manager'] },
  { id: 'accounting', name: 'Accounting', icon: 'ri-calculator-line', roles: ['admin'] },
  { id: 'crm', name: 'CRM', icon: 'ri-user-heart-line', roles: ['admin', 'manager'] },
  { id: 'users', name: 'User Management', icon: 'ri-user-settings-line', roles: ['admin'] },
  { id: 'suppliers', name: 'Suppliers', icon: 'ri-truck-line', roles: ['admin', 'manager'] },
  { id: 'warehouses', name: 'Warehouses', icon: 'ri-building-line', roles: ['admin', 'manager'] },
  { id: 'categories', name: 'Categories', icon: 'ri-folder-line', roles: ['admin', 'manager'] },
  { id: 'movements', name: 'Stock Movements', icon: 'ri-exchange-line', roles: ['admin', 'manager', 'staff'] },
  { id: 'reports', name: 'Reports', icon: 'ri-file-chart-line', roles: ['all'] },
  { id: 'settings', name: 'Settings', icon: 'ri-settings-3-line', roles: ['admin'] }
];
```

### Page Components

#### Dashboard Component
**File**: `src/pages/inventory/components/Dashboard.tsx`

```typescript
interface DashboardProps {
  // Props if needed
}

export default function Dashboard() {
  // State management
  const [stats, setStats] = useState<DashboardStats>();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Effects for data fetching
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Render implementation
}
```

**Dashboard Sections:**
1. **Key Metrics Cards**
   - Total Products
   - Total Orders
   - Low Stock Alerts
   - Revenue Summary

2. **Charts and Analytics**
   - Sales trends
   - Inventory levels
   - Top products
   - Order status distribution

3. **Quick Actions**
   - Add Product
   - Create Order
   - Stock Adjustment
   - Generate Report

4. **Recent Activity**
   - Latest orders
   - Stock movements
   - System notifications

#### Product List Component
**File**: `src/pages/inventory/components/ProductList.tsx`

```typescript
interface ProductListProps {
  // Props configuration
}

export default function ProductList() {
  // State management
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<ProductFilters>({});
  const [sortConfig, setSortConfig] = useState<SortConfig>({});
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Implementation includes:
  // - Product table with sorting
  // - Search and filtering
  // - Bulk operations
  // - CRUD modals
  // - Export functionality
}
```

**Features:**
- Sortable columns
- Advanced filtering
- Bulk selection and operations
- Inline editing
- Image preview
- Status indicators
- Action buttons

## Component Design Patterns

### 1. Compound Components
```typescript
// Modal with compound pattern
<Modal isOpen={isOpen} onClose={onClose}>
  <Modal.Header>
    <Modal.Title>Add Product</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <ProductForm onSubmit={handleSubmit} />
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={onClose}>Cancel</Button>
    <Button variant="primary" onClick={handleSave}>Save</Button>
  </Modal.Footer>
</Modal>
```

### 2. Render Props Pattern
```typescript
interface DataTableProps<T> {
  data: T[];
  renderRow: (item: T, index: number) => React.ReactNode;
  renderHeader?: () => React.ReactNode;
  loading?: boolean;
  empty?: React.ReactNode;
}

<DataTable
  data={products}
  renderRow={(product) => (
    <ProductRow 
      key={product.id} 
      product={product} 
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  )}
  renderHeader={() => <ProductTableHeader />}
  loading={loading}
  empty={<EmptyState message="No products found" />}
/>
```

### 3. Custom Hooks Pattern
```typescript
// Custom hook for product management
function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = useCallback(async (product: CreateProductRequest) => {
    // Implementation
  }, []);

  const updateProduct = useCallback(async (id: number, updates: UpdateProductRequest) => {
    // Implementation
  }, []);

  const deleteProduct = useCallback(async (id: number) => {
    // Implementation
  }, []);

  return {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct
  };
}
```

### 4. Provider Pattern
```typescript
// Context for inventory state
interface InventoryContextType {
  products: Product[];
  orders: Order[];
  suppliers: Supplier[];
  refreshData: () => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  // State and methods implementation
  
  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within InventoryProvider');
  }
  return context;
}
```

## State Management Strategy

### 1. Local Component State
Use `useState` for:
- Form inputs
- UI state (modals, dropdowns)
- Component-specific data

### 2. Custom Hooks
Use for:
- Data fetching logic
- Complex state logic
- Reusable stateful behavior

### 3. Context API
Use for:
- Global application state
- User authentication
- Theme settings
- Notification system

### 4. URL State
Use `useSearchParams` for:
- Filter states
- Pagination
- Search queries
- Sort configurations

## Error Handling

### Error Boundary Component
```typescript
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<React.PropsWithChildren<{}>, ErrorBoundaryState> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}
```

### Error Handling Hook
```typescript
function useErrorHandler() {
  const [error, setError] = useState<string | null>(null);

  const handleError = useCallback((error: Error | string) => {
    const message = typeof error === 'string' ? error : error.message;
    setError(message);
    
    // Log to error reporting service
    console.error('Error:', error);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { error, handleError, clearError };
}
```

## Performance Optimization

### 1. Memoization
```typescript
// Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return calculateExpensiveValue(data);
}, [data]);

// Memoize callback functions
const handleClick = useCallback((id: number) => {
  onItemClick(id);
}, [onItemClick]);

// Memoize components
const ProductCard = memo(({ product }: { product: Product }) => {
  return <div>{product.name}</div>;
});
```

### 2. Virtual Scrolling
```typescript
// For large lists
function VirtualizedProductList({ products }: { products: Product[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { virtualItems, totalSize } = useVirtualizer({
    count: products.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => 60, // Item height
  });

  return (
    <div ref={containerRef} style={{ height: '400px', overflow: 'auto' }}>
      <div style={{ height: totalSize, position: 'relative' }}>
        {virtualItems.map((virtualItem) => (
          <div
            key={virtualItem.index}
            style={{
              position: 'absolute',
              top: virtualItem.start,
              left: 0,
              right: 0,
              height: virtualItem.size,
            }}
          >
            <ProductRow product={products[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 3. Code Splitting
```typescript
// Lazy load components
const ProductList = lazy(() => import('./components/ProductList'));
const Orders = lazy(() => import('./components/Orders'));

// Use with Suspense
<Suspense fallback={<Loading />}>
  <Routes>
    <Route path="/products" element={<ProductList />} />
    <Route path="/orders" element={<Orders />} />
  </Routes>
</Suspense>
```

## Testing Components

### Unit Testing Example
```typescript
// ProductCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from './ProductCard';

const mockProduct: Product = {
  id: 1,
  name: 'Test Product',
  sku: 'TEST-001',
  price: 99.99,
  // ... other properties
};

describe('ProductCard', () => {
  it('renders product information', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('TEST-001')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    const mockOnEdit = jest.fn();
    render(<ProductCard product={mockProduct} onEdit={mockOnEdit} />);
    
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    expect(mockOnEdit).toHaveBeenCalledWith(mockProduct);
  });
});
```

## Accessibility Guidelines

### 1. ARIA Labels
```typescript
<button
  aria-label="Delete product"
  aria-describedby="delete-description"
  onClick={handleDelete}
>
  <i className="ri-delete-bin-line" aria-hidden="true" />
</button>
<div id="delete-description" className="sr-only">
  This action cannot be undone
</div>
```

### 2. Keyboard Navigation
```typescript
function Modal({ isOpen, onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.focus();
    }
  }, [isOpen]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
}
```

### 3. Screen Reader Support
```typescript
<table role="table" aria-label="Products list">
  <thead>
    <tr role="row">
      <th role="columnheader" aria-sort="ascending">Name</th>
      <th role="columnheader">SKU</th>
      <th role="columnheader">Price</th>
    </tr>
  </thead>
  <tbody>
    {products.map((product) => (
      <tr key={product.id} role="row">
        <td role="gridcell">{product.name}</td>
        <td role="gridcell">{product.sku}</td>
        <td role="gridcell">${product.price}</td>
      </tr>
    ))}
  </tbody>
</table>
```

---

**Last Updated**: October 5, 2025
**Target Folder**: `c:\Users\PC\byu classwork\CSE310\module3`
