# InventoryPro - Professional Inventory Management System

## 📁 Project Location
**Target Folder**: `c:\Users\PC\byu classwork\CSE310\module3`

## 📋 Project Overview
InventoryPro is a comprehensive, modern inventory management system built for CSE310 Module 3 assignment. This React-based application provides businesses with tools to track stock levels, manage suppliers, process orders, and generate detailed reports with real-time analytics.

## 🛠️ Technology Stack

### Frontend
- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router v7** - Client-side routing

### Additional Libraries
- **i18next** - Internationalization support
- **Remix Icons** - Modern icon library
- **Recharts** - Data visualization and charts
- **Firebase** - Backend-as-a-Service integration ready
- **Supabase** - Alternative backend service
- **Stripe** - Payment processing integration

## 🏗️ Project Structure

```
module3/
├── public/                     # Static assets
├── src/
│   ├── components/            # Reusable components
│   │   ├── base/             # Basic UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Modal.tsx
│   │   └── feature/          # Feature-specific components
│   │       ├── Header.tsx
│   │       └── Sidebar.tsx
│   ├── hooks/                # Custom React hooks
│   │   └── useCurrency.ts
│   ├── i18n/                 # Internationalization
│   │   ├── index.ts
│   │   └── local/
│   ├── mocks/                # Mock data for development
│   │   ├── crm.ts
│   │   ├── currencies.ts
│   │   ├── inventory.ts
│   │   ├── productVariants.ts
│   │   └── users.ts
│   ├── pages/                # Page components
│   │   ├── NotFound.tsx
│   │   ├── home/
│   │   │   └── page.tsx
│   │   └── inventory/
│   │       └── components/   # Main application components
│   │           ├── Accounting.tsx
│   │           ├── Categories.tsx
│   │           ├── CRM.tsx
│   │           ├── CurrencySettings.tsx
│   │           ├── Dashboard.tsx
│   │           ├── Orders.tsx
│   │           ├── ProductList.tsx
│   │           ├── Purchases.tsx
│   │           ├── Reports.tsx
│   │           ├── Settings.tsx
│   │           ├── StockMovements.tsx
│   │           ├── Suppliers.tsx
│   │           ├── UserManagement.tsx
│   │           └── Warehouses.tsx
│   ├── router/               # Application routing
│   │   ├── config.tsx
│   │   └── index.ts
│   ├── App.tsx              # Main application component
│   ├── index.css            # Global styles
│   ├── main.tsx             # Application entry point
│   └── vite-env.d.ts        # Vite type definitions
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── tailwind.config.ts       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts          # Vite configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Navigate to the project directory**:
   ```bash
   cd "c:\Users\PC\byu classwork\CSE310\module3"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** to `http://localhost:5173`

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 📊 Features Overview

### Core Modules

#### 🏠 Dashboard
- Real-time inventory overview
- Key performance indicators (KPIs)
- Quick action buttons
- Recent activity feed
- Stock level alerts

#### 📦 Product Management
- Complete CRUD operations for products
- SKU-based tracking system
- Category organization
- Supplier assignment
- Price and cost management
- Stock level monitoring
- Product image support

#### 📈 Stock Movements
- Real-time stock tracking
- In/Out movement logging
- Adjustment capabilities
- Movement history
- Automated alerts for low stock

#### 🛒 Order Management
- Customer order processing
- Order status tracking
- Invoice generation
- Order history and search
- Fulfillment tracking

#### 🛍️ Purchase Management
- Purchase order creation
- Supplier order tracking
- Goods receiving
- Purchase analytics
- Cost tracking

#### 🏢 Supplier Management
- Supplier database
- Contact information management
- Performance tracking
- Payment terms
- Communication history

#### 📂 Categories
- Hierarchical category system
- Category-based reporting
- Product organization
- Custom categorization rules

#### 🏭 Warehouse Management
- Multi-location inventory
- Inter-warehouse transfers
- Location-based stock levels
- Warehouse analytics

#### 📊 Reports & Analytics
- Sales reports
- Inventory valuation
- Stock movement analysis
- Export capabilities (PDF, Excel)
- Custom report generation

#### 👥 User Management
- Role-based access control
- User authentication
- Permission management
- Activity logging
- Team collaboration

#### 🤝 CRM Integration
- Customer management
- Purchase history
- Customer analytics
- Loyalty programs
- Communication tracking

#### 💰 Accounting
- Financial transaction tracking
- Cost of goods sold (COGS)
- Profit/loss analysis
- Tax reporting
- Financial analytics

#### ⚙️ Settings
- System preferences
- Currency configuration
- Backup/restore
- API settings
- Customization options

## 🎨 UI/UX Design

### Design Principles
- **Modern & Clean**: Minimalist design with focus on usability
- **Responsive**: Mobile-first approach with desktop optimization
- **Accessible**: WCAG 2.1 compliant interface
- **Intuitive**: User-friendly navigation and workflows

### Color Scheme
- **Primary**: Gray-900 (Dark sidebar)
- **Secondary**: Various shades of gray
- **Accent**: Blue for interactive elements
- **Status Colors**: 
  - Green for success/in-stock
  - Yellow for warnings/low-stock
  - Red for errors/out-of-stock

### Typography
- **Primary Font**: System default
- **Brand Font**: Pacifico (for logo)
- **Icons**: Remix Icons library

## 🔧 Development Guidelines

### Code Style
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality enforcement
- **Component Structure**: Functional components with hooks
- **File Naming**: PascalCase for components, camelCase for utilities

### Component Architecture
```typescript
// Example component structure
interface ComponentProps {
  // Props interface
}

export default function Component({ prop }: ComponentProps) {
  // Hooks
  const [state, setState] = useState();
  
  // Functions
  const handleAction = () => {
    // Logic here
  };
  
  // Render
  return (
    <div>
      {/* JSX here */}
    </div>
  );
}
```

### State Management
- **Local State**: useState for component-specific state
- **Global State**: React Context for app-wide state
- **Custom Hooks**: Reusable logic extraction

### API Integration
```typescript
// API service structure
const apiService = {
  products: {
    getAll: () => fetch('/api/products'),
    create: (data) => fetch('/api/products', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => fetch(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => fetch(`/api/products/${id}`, { method: 'DELETE' })
  }
};
```

## 📊 Data Models

### Product Model
```typescript
interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  supplier: string;
  quantity: number;
  minStock: number;
  price: number;
  cost: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  lastUpdated: string;
  image?: string;
}
```

### Order Model
```typescript
interface Order {
  id: number;
  customerId: number;
  items: OrderItem[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  total: number;
  createdAt: string;
  shippedAt?: string;
}
```

### Stock Movement Model
```typescript
interface StockMovement {
  id: number;
  productId: number;
  quantity: number;
  type: 'in' | 'out' | 'adjustment';
  timestamp: string;
  userId: number;
  notes?: string;
}
```

## 🧪 Testing Strategy

### Unit Testing
- **Framework**: Jest + React Testing Library
- **Coverage**: Component logic and utility functions
- **Location**: `__tests__` folders alongside components

### Integration Testing
- **Focus**: API endpoints and data flow
- **Tools**: Jest + MSW (Mock Service Worker)

### End-to-End Testing
- **Framework**: Cypress or Playwright
- **Scenarios**: Critical user workflows
- **Coverage**: Complete user journeys

### Testing Commands
```bash
npm run test        # Run unit tests
npm run test:watch  # Run tests in watch mode
npm run test:e2e    # Run end-to-end tests
npm run test:coverage # Generate coverage report
```

## 🚀 Deployment

### Build Process
```bash
npm run build  # Creates optimized production build
```

### Environment Configuration
```typescript
// Environment variables
VITE_API_URL=your_api_url
VITE_FIREBASE_CONFIG=your_firebase_config
VITE_STRIPE_PUBLIC_KEY=your_stripe_key
```

### Deployment Options
- **Static Hosting**: Netlify, Vercel, GitHub Pages
- **Traditional Hosting**: Apache, Nginx
- **Cloud Platforms**: AWS S3, Azure Static Web Apps

## 📈 Performance Optimization

### Bundle Optimization
- **Code Splitting**: Lazy loading for routes
- **Tree Shaking**: Eliminate unused code
- **Asset Optimization**: Image compression and lazy loading

### Runtime Performance
- **React Optimization**: useMemo, useCallback for expensive operations
- **Virtual Scrolling**: For large data lists
- **Debouncing**: Search and filter operations

## 🔒 Security Considerations

### Frontend Security
- **Input Validation**: All user inputs sanitized
- **XSS Protection**: Content Security Policy (CSP)
- **Authentication**: Token-based authentication
- **HTTPS**: Secure data transmission

### Data Protection
- **Sensitive Data**: No sensitive data in localStorage
- **API Security**: Proper error handling without data leakage
- **User Permissions**: Role-based access control

## 🐛 Known Issues & Limitations

### Current Limitations
- Mock data only (no persistent backend)
- Basic authentication implementation
- Limited real-time features
- No offline capability

### Future Enhancements
- Real database integration
- WebSocket support for real-time updates
- Mobile app development
- Advanced analytics and AI insights
- Multi-tenant support

## 📚 Learning Objectives (CSE310)

### Technical Skills Demonstrated
1. **React Development**: Modern React patterns and hooks
2. **TypeScript**: Type-safe development practices
3. **Component Architecture**: Modular and reusable components
4. **State Management**: Effective state handling strategies
5. **Responsive Design**: Mobile-first CSS development
6. **Code Organization**: Clean code principles and project structure

### Business Logic Implementation
1. **Inventory Management**: Core business workflows
2. **Data Modeling**: Entity relationships and data structures
3. **User Experience**: Intuitive interface design
4. **Performance**: Optimized rendering and data handling

## 🤝 Contributing

### Development Workflow
1. Create feature branch from main
2. Implement changes with tests
3. Submit pull request with description
4. Code review and approval
5. Merge to main branch

### Code Standards
- Follow existing code style
- Add proper TypeScript types
- Include unit tests for new features
- Update documentation as needed

## 📞 Support & Contact

### Assignment Information
- **Course**: CSE310 - Software Engineering
- **Module**: 3
- **Project**: Inventory Management System
- **Location**: `c:\Users\PC\byu classwork\CSE310\module3\inventory`

### Resources
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)

---

## 📄 License
This project is created for educational purposes as part of CSE310 coursework.

**Last Updated**: October 5, 2025
**Version**: 1.0.0
**Status**: Development Phase
