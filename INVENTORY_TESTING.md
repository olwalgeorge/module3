# Testing Documentation

## 📁 Project Location
## 📁 Project Location
**Target Folder**: `c:\Users\PC\byu classwork\CSE310\module3`

## Testing Strategy Overview

This document outlines the comprehensive testing approach for the InventoryPro application, covering unit tests, integration tests, and end-to-end testing scenarios.

## Testing Stack

### Core Testing Libraries
```json
{
  "devDependencies": {
    "@testing-library/react": "^13.4.0",
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/user-event": "^14.4.3",
    "vitest": "^0.34.6",
    "jsdom": "^22.1.0",
    "msw": "^1.3.2",
    "cypress": "^13.3.0"
  }
}
```

### Test Configuration

#### Vitest Configuration (`vitest.config.ts`)
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    css: true,
  },
});
```

#### Test Setup (`src/test/setup.ts`)
```typescript
import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import { server } from './mocks/server';

// Establish API mocking before all tests
beforeAll(() => server.listen());

// Clean up after each test case
afterEach(() => {
  cleanup();
  server.resetHandlers();
});

// Clean up after all tests are done
afterAll(() => server.close());
```

## Unit Testing

### Component Testing

#### Base Component Tests

**Button Component Test**
```typescript
// src/components/base/__tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Button from '../Button';

describe('Button Component', () => {
  it('renders button with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies correct variant classes', () => {
    render(<Button variant="danger">Delete</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-red-600');
  });

  it('disables button when loading', () => {
    render(<Button loading>Save</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(screen.getByRole('status')).toBeInTheDocument(); // Loading spinner
  });

  it('renders with icon', () => {
    render(<Button icon="ri-save-line">Save</Button>);
    expect(screen.getByRole('button')).toContainHTML('ri-save-line');
  });
});
```

**Input Component Test**
```typescript
// src/components/base/__tests__/Input.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Input from '../Input';

describe('Input Component', () => {
  it('renders input with label', () => {
    render(<Input label="Product Name" value="" onChange={() => {}} />);
    expect(screen.getByLabelText('Product Name')).toBeInTheDocument();
  });

  it('calls onChange when value changes', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    
    render(<Input value="" onChange={handleChange} placeholder="Enter text" />);
    
    await user.type(screen.getByPlaceholderText('Enter text'), 'test');
    expect(handleChange).toHaveBeenCalledWith('test');
  });

  it('displays error message', () => {
    render(
      <Input 
        value="" 
        onChange={() => {}} 
        error="This field is required" 
      />
    );
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('applies disabled state', () => {
    render(<Input value="" onChange={() => {}} disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });
});
```

#### Feature Component Tests

**Sidebar Component Test**
```typescript
// src/components/feature/__tests__/Sidebar.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Sidebar from '../Sidebar';

describe('Sidebar Component', () => {
  const mockProps = {
    activeTab: 'dashboard',
    onTabChange: vi.fn(),
  };

  it('renders all menu items', () => {
    render(<Sidebar {...mockProps} />);
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Orders')).toBeInTheDocument();
  });

  it('highlights active tab', () => {
    render(<Sidebar {...mockProps} activeTab="products" />);
    
    const productsButton = screen.getByRole('button', { name: /products/i });
    expect(productsButton).toHaveClass('bg-blue-600'); // Active state class
  });

  it('calls onTabChange when menu item clicked', () => {
    const handleTabChange = vi.fn();
    render(<Sidebar {...mockProps} onTabChange={handleTabChange} />);
    
    fireEvent.click(screen.getByText('Products'));
    expect(handleTabChange).toHaveBeenCalledWith('products');
  });

  it('toggles collapsed state', () => {
    render(<Sidebar {...mockProps} />);
    
    const toggleButton = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(toggleButton);
    
    // Check if sidebar width changes (className change)
    const sidebar = screen.getByRole('navigation');
    expect(sidebar).toHaveClass('w-16'); // Collapsed width
  });
});
```

#### Page Component Tests

**Dashboard Component Test**
```typescript
// src/pages/inventory/components/__tests__/Dashboard.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Dashboard from '../Dashboard';
import { server } from '../../../test/mocks/server';
import { rest } from 'msw';

describe('Dashboard Component', () => {
  it('displays loading state initially', () => {
    render(<Dashboard />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('displays dashboard statistics', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Total Products')).toBeInTheDocument();
      expect(screen.getByText('125')).toBeInTheDocument(); // Mock value
    });
  });

  it('shows low stock alerts', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Low Stock Items')).toBeInTheDocument();
      expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
    });
  });

  it('handles API error gracefully', async () => {
    // Override default handler to return error
    server.use(
      rest.get('/api/dashboard/stats', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: 'Server Error' }));
      })
    );

    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Error loading dashboard data')).toBeInTheDocument();
    });
  });
});
```

### Custom Hook Testing

**useProducts Hook Test**
```typescript
// src/hooks/__tests__/useProducts.test.tsx
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useProducts } from '../useProducts';

describe('useProducts Hook', () => {
  it('fetches products on mount', async () => {
    const { result } = renderHook(() => useProducts());
    
    expect(result.current.loading).toBe(true);
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.products).toHaveLength(3); // Mock data length
    });
  });

  it('creates new product', async () => {
    const { result } = renderHook(() => useProducts());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const newProduct = {
      name: 'New Product',
      sku: 'NEW-001',
      price: 99.99,
      cost: 79.99,
      quantity: 10,
      minStock: 5,
      category: 'Electronics',
      supplier: 'Test Supplier'
    };

    await result.current.createProduct(newProduct);
    
    await waitFor(() => {
      expect(result.current.products).toHaveLength(4);
    });
  });

  it('handles errors correctly', async () => {
    // Mock API error
    const { result } = renderHook(() => useProducts());
    
    // Trigger error condition
    await result.current.deleteProduct(999); // Non-existent ID
    
    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });
  });
});
```

### Utility Function Testing

**Helper Functions Test**
```typescript
// src/utils/__tests__/helpers.test.ts
import { describe, it, expect } from 'vitest';
import { 
  formatCurrency, 
  calculateStockStatus, 
  validateSKU,
  generateOrderNumber 
} from '../helpers';

describe('Helper Functions', () => {
  describe('formatCurrency', () => {
    it('formats currency correctly', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
      expect(formatCurrency(0)).toBe('$0.00');
      expect(formatCurrency(999999.99)).toBe('$999,999.99');
    });

    it('handles different currencies', () => {
      expect(formatCurrency(100, 'EUR')).toBe('€100.00');
      expect(formatCurrency(100, 'GBP')).toBe('£100.00');
    });
  });

  describe('calculateStockStatus', () => {
    it('returns correct stock status', () => {
      expect(calculateStockStatus(0, 10)).toBe('out_of_stock');
      expect(calculateStockStatus(5, 10)).toBe('low_stock');
      expect(calculateStockStatus(20, 10)).toBe('in_stock');
    });
  });

  describe('validateSKU', () => {
    it('validates SKU format', () => {
      expect(validateSKU('PROD-001')).toBe(true);
      expect(validateSKU('ABC-123-XYZ')).toBe(true);
      expect(validateSKU('invalid')).toBe(false);
      expect(validateSKU('')).toBe(false);
    });
  });

  describe('generateOrderNumber', () => {
    it('generates unique order numbers', () => {
      const order1 = generateOrderNumber();
      const order2 = generateOrderNumber();
      
      expect(order1).toMatch(/^ORD-\d{8}-\d{4}$/);
      expect(order2).toMatch(/^ORD-\d{8}-\d{4}$/);
      expect(order1).not.toBe(order2);
    });
  });
});
```

## Integration Testing

### API Integration Tests

**Mock Server Setup**
```typescript
// src/test/mocks/server.ts
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { products, orders, suppliers } from '../fixtures/data';

export const handlers = [
  // Products endpoints
  rest.get('/api/products', (req, res, ctx) => {
    const page = Number(req.url.searchParams.get('page')) || 1;
    const limit = Number(req.url.searchParams.get('limit')) || 20;
    const search = req.url.searchParams.get('search');
    
    let filteredProducts = products;
    
    if (search) {
      filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedProducts = filteredProducts.slice(start, end);
    
    return res(
      ctx.json({
        success: true,
        data: paginatedProducts,
        meta: {
          total: filteredProducts.length,
          page,
          limit,
          hasNext: end < filteredProducts.length,
          hasPrevious: page > 1
        }
      })
    );
  }),

  rest.post('/api/products', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        success: true,
        data: { id: Date.now(), ...req.body }
      })
    );
  }),

  rest.put('/api/products/:id', (req, res, ctx) => {
    const { id } = req.params;
    return res(
      ctx.json({
        success: true,
        data: { id: Number(id), ...req.body }
      })
    );
  }),

  rest.delete('/api/products/:id', (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        message: 'Product deleted successfully'
      })
    );
  }),

  // Orders endpoints
  rest.get('/api/orders', (req, res, ctx) => {
    return res(ctx.json({ success: true, data: orders }));
  }),

  // Dashboard endpoints
  rest.get('/api/dashboard/stats', (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        data: {
          totalProducts: 125,
          totalOrders: 1543,
          lowStockItems: 8,
          revenue: 125430.50
        }
      })
    );
  }),
];

export const server = setupServer(...handlers);
```

### Component Integration Tests

**Product List Integration Test**
```typescript
// src/pages/inventory/components/__tests__/ProductList.integration.test.tsx
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import ProductList from '../ProductList';
import { server } from '../../../test/mocks/server';
import { rest } from 'msw';

describe('ProductList Integration', () => {
  it('loads and displays products', async () => {
    render(<ProductList />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('MacBook Pro 16"')).toBeInTheDocument();
      expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
    });
  });

  it('filters products by search term', async () => {
    const user = userEvent.setup();
    render(<ProductList />);
    
    await waitFor(() => {
      expect(screen.getByText('MacBook Pro 16"')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search products...');
    await user.type(searchInput, 'MacBook');
    
    await waitFor(() => {
      expect(screen.getByText('MacBook Pro 16"')).toBeInTheDocument();
      expect(screen.queryByText('iPhone 15 Pro')).not.toBeInTheDocument();
    });
  });

  it('creates new product', async () => {
    const user = userEvent.setup();
    render(<ProductList />);
    
    await waitFor(() => {
      expect(screen.getByText('Add Product')).toBeInTheDocument();
    });

    // Open create modal
    await user.click(screen.getByText('Add Product'));
    
    // Fill form
    await user.type(screen.getByLabelText('Product Name'), 'New Product');
    await user.type(screen.getByLabelText('SKU'), 'NEW-001');
    await user.type(screen.getByLabelText('Price'), '99.99');
    
    // Submit form
    await user.click(screen.getByRole('button', { name: 'Save Product' }));
    
    await waitFor(() => {
      expect(screen.getByText('Product created successfully')).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    // Override handler to return error
    server.use(
      rest.get('/api/products', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: 'Server Error' }));
      })
    );

    render(<ProductList />);
    
    await waitFor(() => {
      expect(screen.getByText('Error loading products')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
    });
  });

  it('performs bulk operations', async () => {
    const user = userEvent.setup();
    render(<ProductList />);
    
    await waitFor(() => {
      expect(screen.getByText('MacBook Pro 16"')).toBeInTheDocument();
    });

    // Select multiple products
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[1]); // First product
    await user.click(checkboxes[2]); // Second product
    
    // Open bulk actions
    await user.click(screen.getByText('Bulk Actions'));
    await user.click(screen.getByText('Delete Selected'));
    
    // Confirm deletion
    await user.click(screen.getByRole('button', { name: 'Confirm Delete' }));
    
    await waitFor(() => {
      expect(screen.getByText('Products deleted successfully')).toBeInTheDocument();
    });
  });
});
```

## End-to-End Testing

### Cypress Configuration

**cypress.config.ts**
```typescript
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
  },
});
```

### E2E Test Examples

**Product Management E2E Test**
```typescript
// cypress/e2e/product-management.cy.ts
describe('Product Management', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-cy="sidebar-products"]').click();
  });

  it('should display products list', () => {
    cy.get('[data-cy="products-table"]').should('be.visible');
    cy.get('[data-cy="product-row"]').should('have.length.greaterThan', 0);
  });

  it('should create a new product', () => {
    cy.get('[data-cy="add-product-btn"]').click();
    
    // Fill product form
    cy.get('[data-cy="product-name"]').type('Test Product');
    cy.get('[data-cy="product-sku"]').type('TEST-001');
    cy.get('[data-cy="product-category"]').select('Electronics');
    cy.get('[data-cy="product-price"]').type('99.99');
    cy.get('[data-cy="product-cost"]').type('79.99');
    cy.get('[data-cy="product-quantity"]').type('50');
    cy.get('[data-cy="product-min-stock"]').type('10');
    
    // Submit form
    cy.get('[data-cy="save-product-btn"]').click();
    
    // Verify success
    cy.get('[data-cy="success-message"]').should('contain', 'Product created successfully');
    cy.get('[data-cy="products-table"]').should('contain', 'Test Product');
  });

  it('should edit an existing product', () => {
    cy.get('[data-cy="product-row"]').first().within(() => {
      cy.get('[data-cy="edit-product-btn"]').click();
    });
    
    // Update product name
    cy.get('[data-cy="product-name"]').clear().type('Updated Product Name');
    cy.get('[data-cy="save-product-btn"]').click();
    
    // Verify update
    cy.get('[data-cy="success-message"]').should('contain', 'Product updated successfully');
    cy.get('[data-cy="products-table"]').should('contain', 'Updated Product Name');
  });

  it('should delete a product', () => {
    cy.get('[data-cy="product-row"]').first().within(() => {
      cy.get('[data-cy="delete-product-btn"]').click();
    });
    
    // Confirm deletion
    cy.get('[data-cy="confirm-delete-btn"]').click();
    
    // Verify deletion
    cy.get('[data-cy="success-message"]').should('contain', 'Product deleted successfully');
  });

  it('should filter products by search', () => {
    cy.get('[data-cy="product-search"]').type('MacBook');
    cy.get('[data-cy="product-row"]').should('have.length', 1);
    cy.get('[data-cy="product-row"]').should('contain', 'MacBook Pro 16"');
  });

  it('should sort products by price', () => {
    cy.get('[data-cy="sort-price"]').click();
    
    // Verify sorting order
    cy.get('[data-cy="product-row"]').first().should('contain', '$329.99'); // Lowest price
  });
});
```

**Order Management E2E Test**
```typescript
// cypress/e2e/order-management.cy.ts
describe('Order Management', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-cy="sidebar-orders"]').click();
  });

  it('should create a new order', () => {
    cy.get('[data-cy="create-order-btn"]').click();
    
    // Select customer
    cy.get('[data-cy="customer-select"]').select('John Doe');
    
    // Add products to order
    cy.get('[data-cy="add-product-btn"]').click();
    cy.get('[data-cy="product-select"]').select('MacBook Pro 16"');
    cy.get('[data-cy="product-quantity"]').type('2');
    cy.get('[data-cy="add-item-btn"]').click();
    
    // Add shipping address
    cy.get('[data-cy="shipping-street"]').type('123 Main St');
    cy.get('[data-cy="shipping-city"]').type('New York');
    cy.get('[data-cy="shipping-state"]').type('NY');
    cy.get('[data-cy="shipping-zip"]').type('10001');
    
    // Submit order
    cy.get('[data-cy="create-order-btn"]').click();
    
    // Verify order creation
    cy.get('[data-cy="success-message"]').should('contain', 'Order created successfully');
    cy.url().should('include', '/orders');
  });

  it('should update order status', () => {
    cy.get('[data-cy="order-row"]').first().within(() => {
      cy.get('[data-cy="order-status"]').should('contain', 'Pending');
      cy.get('[data-cy="update-status-btn"]').click();
    });
    
    cy.get('[data-cy="status-select"]').select('Processing');
    cy.get('[data-cy="update-status-confirm"]').click();
    
    // Verify status update
    cy.get('[data-cy="order-row"]').first().within(() => {
      cy.get('[data-cy="order-status"]').should('contain', 'Processing');
    });
  });
});
```

### Visual Regression Testing

**Percy Configuration**
```typescript
// cypress/e2e/visual-regression.cy.ts
describe('Visual Regression Tests', () => {
  it('should match dashboard layout', () => {
    cy.visit('/');
    cy.get('[data-cy="dashboard"]').should('be.visible');
    cy.percySnapshot('Dashboard');
  });

  it('should match product list layout', () => {
    cy.visit('/');
    cy.get('[data-cy="sidebar-products"]').click();
    cy.get('[data-cy="products-table"]').should('be.visible');
    cy.percySnapshot('Product List');
  });

  it('should match mobile layout', () => {
    cy.viewport('iphone-6');
    cy.visit('/');
    cy.percySnapshot('Mobile Dashboard');
  });
});
```

## Performance Testing

### Performance Test Example
```typescript
// src/test/performance/product-list.test.ts
import { performance } from 'perf_hooks';
import { render, waitFor } from '@testing-library/react';
import ProductList from '../pages/inventory/components/ProductList';

describe('Performance Tests', () => {
  it('should render large product list within acceptable time', async () => {
    const startTime = performance.now();
    
    render(<ProductList />);
    
    await waitFor(() => {
      expect(screen.getByText('Products')).toBeInTheDocument();
    });
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Should render within 100ms
    expect(renderTime).toBeLessThan(100);
  });

  it('should handle 1000+ products without performance degradation', async () => {
    // Mock large dataset
    const largeProductList = Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      name: `Product ${i}`,
      sku: `PROD-${i.toString().padStart(3, '0')}`,
      price: Math.random() * 1000,
      // ... other properties
    }));

    const startTime = performance.now();
    
    render(<ProductList initialData={largeProductList} />);
    
    await waitFor(() => {
      expect(screen.getAllByRole('row')).toHaveLength(21); // 1 header + 20 data rows
    });
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Should handle large dataset efficiently
    expect(renderTime).toBeLessThan(200);
  });
});
```

## Test Commands

### NPM Scripts
```json
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage",
    "test:ui": "vitest --ui",
    "test:e2e": "cypress run",
    "test:e2e:open": "cypress open",
    "test:all": "npm run test && npm run test:e2e"
  }
}
```

### Running Tests
```powershell
# Unit tests
npm run test

# Watch mode for development
npm run test:watch

# Coverage report
npm run test:coverage

# Visual test runner
npm run test:ui

# E2E tests
npm run test:e2e

# Open Cypress GUI
npm run test:e2e:open

# Run all tests
npm run test:all
```

## Test Coverage Goals

### Coverage Targets
- **Unit Tests**: 80%+ line coverage
- **Integration Tests**: Critical user flows
- **E2E Tests**: Main application workflows
- **Component Tests**: All public components

### Coverage Report Example
```
File                     | % Stmts | % Branch | % Funcs | % Lines |
-------------------------|---------|----------|---------|---------|
All files               |   85.2  |   78.1   |   92.3  |   84.8  |
 components/base        |   95.1  |   87.5   |   100   |   94.7  |
 components/feature     |   88.3  |   82.1   |   91.2  |   87.9  |
 pages/inventory        |   78.9  |   71.4   |   85.7  |   78.2  |
 hooks                  |   82.4  |   75.0   |   88.9  |   81.8  |
 utils                  |   94.7  |   89.5   |   100   |   94.1  |
```

## Testing Best Practices

### 1. Test Structure
- **Arrange**: Set up test data and mocks
- **Act**: Execute the functionality being tested
- **Assert**: Verify the expected results

### 2. Test Naming
```typescript
// Good: Descriptive test names
it('should display error message when API call fails')
it('should update product quantity when stock adjustment is submitted')

// Bad: Vague test names
it('should work')
it('test product update')
```

### 3. Data Attributes
```typescript
// Use data-cy attributes for reliable element selection
<button data-cy="save-product-btn">Save Product</button>
<div data-cy="product-row">Product information</div>
```

### 4. Mock Strategy
- Mock external dependencies
- Use MSW for API mocking
- Avoid mocking implementation details

### 5. Test Isolation
- Each test should be independent
- Clean up after each test
- Reset mocks between tests

---

**Last Updated**: October 5, 2025
**Target Folder**: `c:\Users\PC\byu classwork\CSE310\module3`
