# API Documentation

## 📁 Project Location
**Target Folder**: `c:\Users\PC\byu classwork\CSE310\module3`

## Overview
This document outlines the API structure and data models for the InventoryPro system. Currently using mock data, but designed for easy backend integration.

## Base Configuration

### API Base URL
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
```

### Headers
```typescript
const defaultHeaders = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}` // When authentication is implemented
};
```

## Core Endpoints

### Products API

#### Get All Products
```http
GET /api/products
```

**Response:**
```typescript
{
  "success": true,
  "data": Product[],
  "total": number,
  "page": number,
  "limit": number
}
```

#### Get Product by ID
```http
GET /api/products/:id
```

**Response:**
```typescript
{
  "success": true,
  "data": Product
}
```

#### Create Product
```http
POST /api/products
Content-Type: application/json

{
  "name": "Product Name",
  "sku": "PROD-001",
  "category": "Electronics",
  "supplierId": 1,
  "price": 99.99,
  "cost": 79.99,
  "quantity": 100,
  "minStock": 10,
  "description": "Product description"
}
```

#### Update Product
```http
PUT /api/products/:id
Content-Type: application/json

{
  "name": "Updated Product Name",
  "price": 109.99,
  // ... other fields to update
}
```

#### Delete Product
```http
DELETE /api/products/:id
```

### Stock Movements API

#### Get Stock Movements
```http
GET /api/stock-movements?productId=:id&limit=50&offset=0
```

#### Create Stock Movement
```http
POST /api/stock-movements
Content-Type: application/json

{
  "productId": 1,
  "quantity": 10,
  "type": "in" | "out" | "adjustment",
  "notes": "Stock adjustment notes",
  "warehouseId": 1
}
```

### Orders API

#### Get All Orders
```http
GET /api/orders?status=pending&limit=20&offset=0
```

#### Create Order
```http
POST /api/orders
Content-Type: application/json

{
  "customerId": 1,
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "price": 99.99
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "City",
    "state": "State",
    "zipCode": "12345"
  }
}
```

#### Update Order Status
```http
PATCH /api/orders/:id/status
Content-Type: application/json

{
  "status": "processing" | "shipped" | "delivered" | "cancelled"
}
```

### Suppliers API

#### Get All Suppliers
```http
GET /api/suppliers
```

#### Create Supplier
```http
POST /api/suppliers
Content-Type: application/json

{
  "name": "Supplier Name",
  "contactPerson": "John Doe",
  "email": "john@supplier.com",
  "phone": "+1-555-0123",
  "address": {
    "street": "456 Business Ave",
    "city": "Business City",
    "state": "State",
    "zipCode": "54321"
  },
  "paymentTerms": "Net 30"
}
```

### Categories API

#### Get All Categories
```http
GET /api/categories
```

#### Create Category
```http
POST /api/categories
Content-Type: application/json

{
  "name": "Category Name",
  "description": "Category description",
  "parentId": null // For hierarchical categories
}
```

### Warehouses API

#### Get All Warehouses
```http
GET /api/warehouses
```

#### Create Warehouse
```http
POST /api/warehouses
Content-Type: application/json

{
  "name": "Warehouse Name",
  "code": "WH-001",
  "address": {
    "street": "789 Warehouse Blvd",
    "city": "Storage City",
    "state": "State",
    "zipCode": "67890"
  },
  "capacity": 10000
}
```

### Reports API

#### Get Dashboard Statistics
```http
GET /api/reports/dashboard
```

#### Get Inventory Report
```http
GET /api/reports/inventory?startDate=2024-01-01&endDate=2024-12-31
```

#### Get Sales Report
```http
GET /api/reports/sales?period=monthly&year=2024
```

## Data Models

### Product Model
```typescript
interface Product {
  id: number;
  name: string;
  sku: string;
  description?: string;
  categoryId: number;
  category?: Category;
  supplierId: number;
  supplier?: Supplier;
  price: number;
  cost: number;
  quantity: number;
  minStock: number;
  maxStock?: number;
  status: 'active' | 'inactive' | 'discontinued';
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  images?: string[];
  barcode?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  createdAt: string;
  updatedAt: string;
}
```

### Stock Movement Model
```typescript
interface StockMovement {
  id: number;
  productId: number;
  product?: Product;
  warehouseId: number;
  warehouse?: Warehouse;
  quantity: number;
  type: 'in' | 'out' | 'adjustment' | 'transfer';
  reason: string;
  notes?: string;
  referenceId?: string; // Order ID, Purchase Order ID, etc.
  referenceType?: 'order' | 'purchase' | 'adjustment' | 'transfer';
  userId: number;
  user?: User;
  createdAt: string;
}
```

### Order Model
```typescript
interface Order {
  id: number;
  orderNumber: string;
  customerId?: number;
  customer?: Customer;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: Address;
  billingAddress?: Address;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  shippingMethod?: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  shippedAt?: string;
  deliveredAt?: string;
}

interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  product?: Product;
  quantity: number;
  price: number;
  total: number;
}
```

### Supplier Model
```typescript
interface Supplier {
  id: number;
  name: string;
  code: string;
  contactPerson: string;
  email: string;
  phone: string;
  website?: string;
  address: Address;
  paymentTerms: string;
  leadTime: number; // in days
  rating?: number;
  status: 'active' | 'inactive';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Category Model
```typescript
interface Category {
  id: number;
  name: string;
  description?: string;
  parentId?: number;
  parent?: Category;
  children?: Category[];
  productCount?: number;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}
```

### Warehouse Model
```typescript
interface Warehouse {
  id: number;
  name: string;
  code: string;
  address: Address;
  capacity: number;
  currentUtilization: number;
  managerId?: number;
  manager?: User;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Customer Model
```typescript
interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  addresses: Address[];
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  status: 'active' | 'inactive';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Address Model
```typescript
interface Address {
  id?: number;
  type?: 'shipping' | 'billing';
  street: string;
  street2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}
```

### User Model
```typescript
interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'manager' | 'staff' | 'viewer';
  permissions: string[];
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}
```

## Response Format

### Success Response
```typescript
interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    hasNext?: boolean;
    hasPrevious?: boolean;
  };
}
```

### Error Response
```typescript
interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  statusCode: number;
}
```

## Error Codes

### HTTP Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Unprocessable Entity
- `500` - Internal Server Error

### Custom Error Codes
```typescript
enum ErrorCodes {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  PRODUCT_NOT_FOUND = 'PRODUCT_NOT_FOUND',
  INSUFFICIENT_STOCK = 'INSUFFICIENT_STOCK',
  DUPLICATE_SKU = 'DUPLICATE_SKU',
  SUPPLIER_NOT_FOUND = 'SUPPLIER_NOT_FOUND',
  ORDER_NOT_FOUND = 'ORDER_NOT_FOUND',
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS'
}
```

## Authentication

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```typescript
{
  "success": true,
  "data": {
    "user": User,
    "token": string,
    "refreshToken": string,
    "expiresIn": number
  }
}
```

### Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "refresh_token_here"
}
```

## Pagination

### Query Parameters
```typescript
interface PaginationParams {
  page?: number;     // Default: 1
  limit?: number;    // Default: 20, Max: 100
  sortBy?: string;   // Field to sort by
  sortOrder?: 'asc' | 'desc'; // Default: 'asc'
}
```

### Example Request
```http
GET /api/products?page=1&limit=20&sortBy=name&sortOrder=asc
```

## Filtering and Search

### Products Filtering
```http
GET /api/products?category=Electronics&status=active&minPrice=10&maxPrice=1000&search=laptop
```

### Available Filters
```typescript
interface ProductFilters {
  category?: string;
  supplier?: string;
  status?: 'active' | 'inactive' | 'discontinued';
  stockStatus?: 'in_stock' | 'low_stock' | 'out_of_stock';
  minPrice?: number;
  maxPrice?: number;
  search?: string; // Searches name, SKU, description
}
```

## Bulk Operations

### Bulk Update Products
```http
PATCH /api/products/bulk
Content-Type: application/json

{
  "ids": [1, 2, 3],
  "updates": {
    "status": "inactive"
  }
}
```

### Bulk Delete Products
```http
DELETE /api/products/bulk
Content-Type: application/json

{
  "ids": [1, 2, 3]
}
```

## File Upload

### Product Image Upload
```http
POST /api/products/:id/images
Content-Type: multipart/form-data

Form Data:
- image: File
- alt: string (optional)
```

### Export Data
```http
GET /api/products/export?format=csv&filters={}
```

**Response:** File download with appropriate content-type

## Webhooks

### Order Status Changed
```typescript
interface OrderWebhook {
  event: 'order.status_changed';
  data: {
    orderId: number;
    oldStatus: string;
    newStatus: string;
    timestamp: string;
  };
}
```

### Low Stock Alert
```typescript
interface StockWebhook {
  event: 'stock.low_stock';
  data: {
    productId: number;
    currentStock: number;
    minStock: number;
    timestamp: string;
  };
}
```

---

**Last Updated**: October 5, 2025
**Target Folder**: `c:\Users\PC\byu classwork\CSE310\module3`
