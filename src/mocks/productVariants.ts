// Enhanced product structure with variants support
export interface ProductVariant {
  id: string;
  sku: string;
  attributes: Record<string, string>; // e.g., { color: 'Blue', storage: '256GB' }
  quantity: number;
  price: number;
  cost: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  image?: string;
  barcode?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
}

export interface ProductWithVariants {
  id: number;
  name: string;
  basesku: string;
  category: string;
  supplier: string;
  description: string;
  brand: string;
  minStock: number;
  lastUpdated: string;
  
  // Variant configuration
  hasVariants: boolean;
  variantAttributes: string[]; // e.g., ['color', 'storage', 'size']
  variants: ProductVariant[];
  
  // Aggregated data from variants
  totalQuantity: number;
  minPrice: number;
  maxPrice: number;
  totalValue: number;
  lowStockVariants: number;
  outOfStockVariants: number;
}

// Example products with variants
export const productsWithVariants: ProductWithVariants[] = [
  {
    id: 1,
    name: 'MacBook Pro',
    basesku: 'MBP',
    category: 'Electronics',
    supplier: 'Apple Inc.',
    description: 'Professional laptop with M3 chip',
    brand: 'Apple',
    minStock: 5,
    lastUpdated: '2024-01-15',
    hasVariants: true,
    variantAttributes: ['size', 'color', 'storage'],
    totalQuantity: 45,
    minPrice: 1599.99,
    maxPrice: 3999.99,
    totalValue: 125000,
    lowStockVariants: 2,
    outOfStockVariants: 0,
    variants: [
      {
        id: 'mbp-14-silver-512',
        sku: 'MBP-14-SLV-512',
        attributes: { size: '14"', color: 'Silver', storage: '512GB' },
        quantity: 15,
        price: 1999.99,
        cost: 1599.99,
        status: 'In Stock',
        image: 'https://readdy.ai/api/search-image?query=silver%20MacBook%20Pro%2014%20inch%20laptop%20on%20clean%20white%20background%2C%20professional%20product%20photography%2C%20minimalist%20style%2C%20studio%20lighting%2C%20modern%20design&width=400&height=300&seq=mbp14silver&orientation=landscape'
      },
      {
        id: 'mbp-14-spacegray-512',
        sku: 'MBP-14-SG-512',
        attributes: { size: '14"', color: 'Space Gray', storage: '512GB' },
        quantity: 12,
        price: 1999.99,
        cost: 1599.99,
        status: 'In Stock',
        image: 'https://readdy.ai/api/search-image?query=space%20gray%20MacBook%20Pro%2014%20inch%20laptop%20on%20clean%20white%20background%2C%20professional%20product%20photography%2C%20minimalist%20style%2C%20studio%20lighting%2C%20modern%20design&width=400&height=300&seq=mbp14gray&orientation=landscape'
      },
      {
        id: 'mbp-16-silver-1tb',
        sku: 'MBP-16-SLV-1TB',
        attributes: { size: '16"', color: 'Silver', storage: '1TB' },
        quantity: 8,
        price: 2499.99,
        cost: 1999.99,
        status: 'In Stock',
        image: 'https://readdy.ai/api/search-image?query=silver%20MacBook%20Pro%2016%20inch%20laptop%20on%20clean%20white%20background%2C%20professional%20product%20photography%2C%20minimalist%20style%2C%20studio%20lighting%2C%20modern%20design&width=400&height=300&seq=mbp16silver&orientation=landscape'
      },
      {
        id: 'mbp-16-spacegray-1tb',
        sku: 'MBP-16-SG-1TB',
        attributes: { size: '16"', color: 'Space Gray', storage: '1TB' },
        attributes: { size: '16"', color: 'Space Gray', storage: '1TB' },
        quantity: 10,
        price: 2499.99,
        cost: 1999.99,
        status: 'In Stock',
        image: 'https://readdy.ai/api/search-image?query=space%20gray%20MacBook%20Pro%2016%20inch%20laptop%20on%20clean%20white%20background%2C%20professional%20product%20photography%2C%20minimalist%20style%2C%20studio%20lighting%2C%20modern%20design&width=400&height=300&seq=mbp16gray&orientation=landscape'
      }
    ]
  },
  {
    id: 2,
    name: 'iPhone 15 Pro',
    basesku: 'IP15P',
    category: 'Electronics',
    supplier: 'Apple Inc.',
    description: 'Pro smartphone with titanium design and A17 Pro chip',
    brand: 'Apple',
    minStock: 10,
    lastUpdated: '2024-01-14',
    hasVariants: true,
    variantAttributes: ['color', 'storage'],
    totalQuantity: 32,
    minPrice: 999.99,
    maxPrice: 1499.99,
    totalValue: 38000,
    lowStockVariants: 1,
    outOfStockVariants: 1,
    variants: [
      {
        id: 'ip15p-natural-128',
        sku: 'IP15P-NAT-128',
        attributes: { color: 'Natural Titanium', storage: '128GB' },
        quantity: 8,
        price: 999.99,
        cost: 799.99,
        status: 'In Stock',
        image: 'https://readdy.ai/api/search-image?query=iPhone%2015%20Pro%20in%20natural%20titanium%20color%20on%20clean%20white%20background%2C%20professional%20product%20photography%2C%20modern%20smartphone%20design%2C%20studio%20lighting&width=400&height=300&seq=ip15natural&orientation=landscape'
      },
      {
        id: 'ip15p-blue-256',
        sku: 'IP15P-BLU-256',
        attributes: { color: 'Blue Titanium', storage: '256GB' },
        quantity: 12,
        price: 1099.99,
        cost: 879.99,
        status: 'In Stock',
        image: 'https://readdy.ai/api/search-image?query=iPhone%2015%20Pro%20in%20blue%20titanium%20color%20on%20clean%20white%20background%2C%20professional%20product%20photography%2C%20modern%20smartphone%20design%2C%20studio%20lighting&width=400&height=300&seq=ip15blue&orientation=landscape'
      },
      {
        id: 'ip15p-white-512',
        sku: 'IP15P-WHT-512',
        attributes: { color: 'White Titanium', storage: '512GB' },
        quantity: 7,
        price: 1299.99,
        cost: 1039.99,
        status: 'Low Stock',
        image: 'https://readdy.ai/api/search-image?query=iPhone%2015%20Pro%20in%20white%20titanium%20color%20on%20clean%20white%20background%2C%20professional%20product%20photography%2C%20modern%20smartphone%20design%2C%20studio%20lighting&width=400&height=300&seq=ip15white&orientation=landscape'
      },
      {
        id: 'ip15p-black-1tb',
        sku: 'IP15P-BLK-1TB',
        attributes: { color: 'Black Titanium', storage: '1TB' },
        quantity: 0,
        price: 1499.99,
        cost: 1199.99,
        status: 'Out of Stock',
        image: 'https://readdy.ai/api/search-image?query=iPhone%2015%20Pro%20in%20black%20titanium%20color%20on%20clean%20white%20background%2C%20professional%20product%20photography%2C%20modern%20smartphone%20design%2C%20studio%20lighting&width=400&height=300&seq=ip15black&orientation=landscape'
      },
      {
        id: 'ip15p-natural-256',
        sku: 'IP15P-NAT-256',
        attributes: { color: 'Natural Titanium', storage: '256GB' },
        quantity: 5,
        price: 1099.99,
        cost: 879.99,
        status: 'Low Stock',
        image: 'https://readdy.ai/api/search-image?query=iPhone%2015%20Pro%20in%20natural%20titanium%20color%20on%20clean%20white%20background%2C%20professional%20product%20photography%2C%20modern%20smartphone%20design%2C%20studio%20lighting&width=400&height=300&seq=ip15natural256&orientation=landscape'
      }
    ]
  },
  {
    id: 3,
    name: 'Dell UltraSharp Monitor',
    basesku: 'DUS',
    category: 'Electronics',
    supplier: 'Dell Technologies',
    description: 'Professional 4K monitor with USB-C connectivity',
    brand: 'Dell',
    minStock: 15,
    lastUpdated: '2024-01-13',
    hasVariants: true,
    variantAttributes: ['size', 'resolution'],
    totalQuantity: 67,
    minPrice: 299.99,
    maxPrice: 799.99,
    totalValue: 35000,
    lowStockVariants: 0,
    outOfStockVariants: 0,
    variants: [
      {
        id: 'dus-24-fhd',
        sku: 'DUS-24-FHD',
        attributes: { size: '24"', resolution: 'Full HD' },
        quantity: 25,
        price: 299.99,
        cost: 239.99,
        status: 'In Stock',
        image: 'https://readdy.ai/api/search-image?query=Dell%2024%20inch%20monitor%20with%20black%20frame%20on%20clean%20white%20background%2C%20professional%20display%20screen%2C%20modern%20design%2C%20studio%20lighting%2C%20minimalist%20product%20photography&width=400&height=300&seq=dell24&orientation=landscape'
      },
      {
        id: 'dus-27-4k',
        sku: 'DUS-27-4K',
        attributes: { size: '27"', resolution: '4K UHD' },
        quantity: 22,
        price: 499.99,
        cost: 399.99,
        status: 'In Stock',
        image: 'https://readdy.ai/api/search-image?query=Dell%2027%20inch%204K%20monitor%20with%20black%20frame%20on%20clean%20white%20background%2C%20professional%20display%20screen%2C%20modern%20design%2C%20studio%20lighting%2C%20minimalist%20product%20photography&width=400&height=300&seq=dell27&orientation=landscape'
      },
      {
        id: 'dus-32-4k',
        sku: 'DUS-32-4K',
        attributes: { size: '32"', resolution: '4K UHD' },
        quantity: 20,
        price: 799.99,
        cost: 639.99,
        status: 'In Stock',
        image: 'https://readdy.ai/api/search-image?query=Dell%2032%20inch%204K%20monitor%20with%20black%20frame%20on%20clean%20white%20background%2C%20professional%20display%20screen%2C%20modern%20design%2C%20studio%20lighting%2C%20minimalist%20product%20photography&width=400&height=300&seq=dell32&orientation=landscape'
      }
    ]
  },
  {
    id: 4,
    name: 'Wireless Gaming Mouse',
    basesku: 'WGM',
    category: 'Accessories',
    supplier: 'Logitech',
    description: 'High-performance wireless gaming mouse with RGB lighting',
    brand: 'Logitech',
    minStock: 20,
    lastUpdated: '2024-01-12',
    hasVariants: true,
    variantAttributes: ['color', 'dpi'],
    totalQuantity: 48,
    minPrice: 79.99,
    maxPrice: 129.99,
    totalValue: 4800,
    lowStockVariants: 1,
    outOfStockVariants: 0,
    variants: [
      {
        id: 'wgm-black-12k',
        sku: 'WGM-BLK-12K',
        attributes: { color: 'Black', dpi: '12000 DPI' },
        quantity: 18,
        price: 99.99,
        cost: 69.99,
        status: 'In Stock',
        image: 'https://readdy.ai/api/search-image?query=black%20wireless%20gaming%20mouse%20with%20RGB%20lighting%20on%20clean%20white%20background%2C%20modern%20ergonomic%20design%2C%20professional%20product%20photography%2C%20studio%20lighting&width=400&height=300&seq=mouseblack&orientation=landscape'
      },
      {
        id: 'wgm-white-12k',
        sku: 'WGM-WHT-12K',
        attributes: { color: 'White', dpi: '12000 DPI' },
        quantity: 15,
        price: 99.99,
        cost: 69.99,
        status: 'In Stock',
        image: 'https://readdy.ai/api/search-image?query=white%20wireless%20gaming%20mouse%20with%20RGB%20lighting%20on%20clean%20white%20background%2C%20modern%20ergonomic%20design%2C%20professional%20product%20photography%2C%20studio%20lighting&width=400&height=300&seq=mousewhite&orientation=landscape'
      },
      {
        id: 'wgm-black-25k',
        sku: 'WGM-BLK-25K',
        attributes: { color: 'Black', dpi: '25000 DPI' },
        quantity: 8,
        price: 129.99,
        cost: 89.99,
        status: 'Low Stock',
        image: 'https://readdy.ai/api/search-image?query=premium%20black%20wireless%20gaming%20mouse%20with%20advanced%20sensor%20on%20clean%20white%20background%2C%20modern%20ergonomic%20design%2C%20professional%20product%20photography%2C%20studio%20lighting&width=400&height=300&seq=mouseblackpro&orientation=landscape'
      },
      {
        id: 'wgm-rgb-12k',
        sku: 'WGM-RGB-12K',
        attributes: { color: 'RGB Edition', dpi: '12000 DPI' },
        quantity: 7,
        price: 79.99,
        cost: 59.99,
        status: 'Low Stock',
        image: 'https://readdy.ai/api/search-image?query=RGB%20gaming%20mouse%20with%20colorful%20lighting%20effects%20on%20clean%20white%20background%2C%20modern%20ergonomic%20design%2C%20professional%20product%20photography%2C%20studio%20lighting&width=400&height=300&seq=mousergb&orientation=landscape'
      }
    ]
  }
];

// Utility functions for variant management
export const getVariantCombinations = (attributes: Record<string, string[]>) => {
  const keys = Object.keys(attributes);
  const combinations: Record<string, string>[] = [];
  
  const generate = (current: Record<string, string>, index: number) => {
    if (index === keys.length) {
      combinations.push({ ...current });
      return;
    }
    
    const key = keys[index];
    attributes[key].forEach(value => {
      current[key] = value;
      generate(current, index + 1);
    });
  };
  
  generate({}, 0);
  return combinations;
};

export const generateVariantSKU = (baseSku: string, attributes: Record<string, string>) => {
  const attributeValues = Object.values(attributes)
    .map(value => value.replace(/[^a-zA-Z0-9]/g, '').substring(0, 3).toUpperCase());
  return `${baseSku}-${attributeValues.join('-')}`;
};

export const getVariantDisplayName = (productName: string, attributes: Record<string, string>) => {
  const attributeString = Object.values(attributes).join(' ');
  return `${productName} (${attributeString})`;
};

// Variant attribute options
export const variantAttributeOptions = {
  color: ['Black', 'White', 'Silver', 'Space Gray', 'Blue', 'Red', 'Green', 'Natural Titanium', 'Blue Titanium', 'White Titanium', 'Black Titanium'],
  size: ['13"', '14"', '15"', '16"', '24"', '27"', '32"', 'Small', 'Medium', 'Large', 'XL'],
  storage: ['64GB', '128GB', '256GB', '512GB', '1TB', '2TB'],
  memory: ['8GB', '16GB', '32GB', '64GB'],
  resolution: ['HD', 'Full HD', '4K UHD', '5K', '8K'],
  connectivity: ['USB-A', 'USB-C', 'Thunderbolt', 'HDMI', 'DisplayPort'],
  dpi: ['800 DPI', '1600 DPI', '3200 DPI', '6400 DPI', '12000 DPI', '25000 DPI'],
  material: ['Plastic', 'Metal', 'Aluminum', 'Carbon Fiber', 'Leather'],
  capacity: ['500ml', '750ml', '1L', '1.5L', '2L']
};