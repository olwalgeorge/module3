# Product Variants Database Update

## Instructions

To add product variants to your existing database:

1. **Go to Supabase SQL Editor**: https://supabase.com/dashboard/project/xxgpfxkokhuqoooqakkd
2. **Click "SQL Editor"** in the sidebar
3. **Copy the entire contents** of `add-variants.sql`
4. **Paste and click "Run"**

This will add:
- **22 product variants** across all 5 products
- **MacBook Pro**: Color (Silver, Space Gray) + Storage (512GB, 1TB) variants
- **iPhone 15 Pro**: Color (Natural, Blue, White Titanium) + Storage (128GB, 256GB, 512GB) variants  
- **Dell Monitor**: Resolution (4K, 1440p) + Panel Type (IPS, OLED) variants
- **Wireless Mouse**: Color (Graphite, Pale Gray) + Connectivity (Bluetooth, USB-C) variants
- **Gaming Keyboard**: Switch Type (Green, Orange) + Layout (Full Size, Tenkeyless) variants

## Verification

After running the script, you should see:
- Product Variants count: 22
- A detailed list showing all variants organized by product

## Next Steps

1. Run the script in Supabase
2. Refresh your application at http://localhost:5175
3. Navigate to Products page
4. Test the variants functionality:
   - Expand products to see variants
   - Switch to "View All Variants" mode
   - Try adding new variants
   - Edit existing variants

The application will now show real database variants with:
- Proper variant attributes (Color, Storage, etc.)
- Price adjustments
- Individual stock quantities
- Full CRUD operations
