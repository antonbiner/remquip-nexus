# SQL Database Implementation Guide

## Quick Start

This guide shows you exactly how to set up your PostgreSQL database for RemQuip Nexus.

## Files Overview

All SQL files are in the `database/` folder:

```
database/
├── schema.sql                          # Complete schema (all tables)
├── 001_create_core_tables.sql          # Users table
├── 002_create_access_control.sql       # Pages and permissions
├── 003_create_products.sql             # Products, categories, images
├── 004_create_customers.sql            # Customer CRM
├── 005_create_orders.sql               # Orders and order items
├── 006_create_inventory.sql            # Stock tracking
├── 007_create_discounts.sql            # Promotions
├── 008_create_cms.sql                  # Content management
├── 009_create_audit_analytics.sql      # Audit logs and metrics
```

## Installation

### 1. Create Database

```bash
createdb remquip_nexus
```

Or in psql:

```sql
CREATE DATABASE remquip_nexus;
\c remquip_nexus
```

### 2. Option A: Run All at Once (Recommended for fresh install)

```bash
psql remquip_nexus < database/schema.sql
```

### 2. Option B: Run Migrations Sequentially

```bash
for i in {001..009}; do
  psql remquip_nexus < database/${i}_*.sql
  echo "Migration $i completed"
done
```

Or manually:

```bash
psql remquip_nexus < database/001_create_core_tables.sql
psql remquip_nexus < database/002_create_access_control.sql
psql remquip_nexus < database/003_create_products.sql
psql remquip_nexus < database/004_create_customers.sql
psql remquip_nexus < database/005_create_orders.sql
psql remquip_nexus < database/006_create_inventory.sql
psql remquip_nexus < database/007_create_discounts.sql
psql remquip_nexus < database/008_create_cms.sql
psql remquip_nexus < database/009_create_audit_analytics.sql
```

### 3. Verify Installation

```sql
-- Check all tables were created
\dt

-- Should see 16 tables:
-- users, pages, user_page_access
-- product_categories, products, product_images, product_variants
-- customers
-- orders, order_items, order_notes
-- inventory_logs
-- discounts
-- cms_pages, cms_sections
-- audit_logs, analytics_daily_metrics
```

## Post-Installation Setup

### 1. Change Default Admin Password

```sql
-- Hash your new password with bcrypt and update:
UPDATE users
SET password_hash = '$2b$10$[your-bcrypt-hash-here]'
WHERE email = 'admin@remquip.ca';
```

### 2. Create Additional Admin Users

```sql
INSERT INTO users (email, password_hash, full_name, role, status)
VALUES (
  'another.admin@remquip.ca',
  '$2b$10$[bcrypt-hash]',
  'Another Admin',
  'admin',
  'active'
);
```

### 3. Grant Admin Full Access

```sql
-- Get the admin's user ID
SELECT id FROM users WHERE email = 'admin@remquip.ca';

-- Grant access to all pages
INSERT INTO user_page_access (user_id, page_id, can_view, can_edit, can_delete)
SELECT 
  '[ADMIN_USER_ID]'::uuid as user_id,
  p.id,
  true,
  true,
  true
FROM pages p;
```

### 4. Add Product Categories

```sql
INSERT INTO product_categories (name, slug, description, is_active, display_order)
VALUES
  ('Brake Parts', 'brake-parts', 'Brake system components', true, 1),
  ('Air Springs', 'air-springs', 'Air suspension parts', true, 2),
  ('Tires & Wheels', 'tires-wheels', 'Tires and wheel assemblies', true, 3),
  ('Filters', 'filters', 'Air, oil, and fuel filters', true, 4),
  ('Lights & Electrical', 'lights-electrical', 'Lighting and electrical parts', true, 5);
```

### 5. Add Sample Products

```sql
-- First get a category ID
SELECT id FROM product_categories WHERE slug = 'brake-parts' LIMIT 1;

-- Then insert products
INSERT INTO products (sku, name, description, category_id, price, wholesale_price, stock_quantity)
VALUES
  ('BK-001', 'Air Spring W01-358', 'Heavy duty air spring assembly', '[CATEGORY_ID]', 89.99, 72.00, 150),
  ('BK-002', 'Brake Pad Kit ADB22X', 'Complete brake pad set', '[CATEGORY_ID]', 156.00, 125.00, 200),
  ('BK-003', 'Brake Drum 3600A', 'Gunite replacement drum', '[CATEGORY_ID]', 198.00, 158.00, 80);
```

## Table Relationships (Foreign Keys)

```
users
├── created by: users (creator)
├── has many: user_page_access
├── has many: product_images (creator)
├── has many: product_variants (creator)
├── has many: customers (creator)
├── has many: orders (creator)
├── has many: order_notes
├── has many: inventory_logs
├── has many: discounts (creator)
├── has many: cms_pages (creator/updater)
└── has many: audit_logs

pages
└── has many: user_page_access

product_categories
└── has many: products

products
├── belongs to: product_categories
├── has many: product_images
├── has many: product_variants
├── has many: order_items
└── has many: inventory_logs

customers
└── has many: orders

orders
├── belongs to: customers
├── has many: order_items
├── has many: order_notes
└── has inventory_logs (via reference_id)

discounts
├── belongs to: product_categories (optional)
└── belongs to: products (optional)

cms_pages
└── has many: cms_sections
```

## Data Types Reference

| Type | Usage | Example |
|------|-------|---------|
| UUID | Primary keys, user IDs | `550e8400-e29b-41d4-a716-446655440000` |
| VARCHAR | Codes, names, emails | `'SUMMER2024'`, `'John Doe'` |
| TEXT | Long content | Product descriptions, notes |
| DECIMAL(10,2) | Money | `89.99`, `1234.56` |
| INT | Counts, quantities | `150`, `1000` |
| TIMESTAMP | Date + time | `2026-03-18 14:30:00` |
| DATE | Date only | `2026-03-18` |
| BOOLEAN | Yes/no | `true`, `false` |
| JSON | Flexible data | `{"key": "value"}` |

## Constraints Reference

### Unique Constraints
- `users.email` - No duplicate emails
- `product_categories.name` - No duplicate category names
- `product_categories.slug` - No duplicate category slugs
- `products.sku` - No duplicate SKUs
- `product_variants.variant_sku` - No duplicate variant SKUs
- `discounts.code` - No duplicate discount codes
- `cms_pages.slug` - No duplicate page slugs
- `user_page_access(user_id, page_id)` - One access record per user-page combo

### Enum-like Constraints (CHECK)
- `users.role` IN ('admin', 'manager', 'user')
- `users.status` IN ('active', 'inactive', 'suspended')
- `products.status` IN ('active', 'draft', 'archived')
- `orders.status` IN ('pending', 'processing', 'shipped', 'completed', 'cancelled', 'refunded')
- `orders.payment_status` IN ('pending', 'paid', 'failed')
- `discounts.discount_type` IN ('percentage', 'fixed_amount')
- `cms_pages.status` IN ('draft', 'published', 'scheduled', 'archived')

## Index Performance

All important columns are indexed for fast queries:

- Email lookups (users, customers)
- Product searches (SKU, name)
- Order filters (customer, status, date)
- Analytics queries (date)
- Audit logs (user, entity type, action)

## Backup & Recovery

### Create Backup

```bash
pg_dump remquip_nexus > backup-$(date +%Y%m%d-%H%M%S).sql
```

### Restore from Backup

```bash
psql remquip_nexus < backup-2026-03-18-140000.sql
```

## Troubleshooting

### Issue: "role does not exist" when creating tables

**Solution:** Make sure you're connected to the correct database

```sql
\c remquip_nexus
```

### Issue: Foreign key constraint violated

**Solution:** Check that referenced record exists first:

```sql
-- Check if user exists
SELECT * FROM users WHERE id = '[user_id]';

-- Before inserting product
INSERT INTO products (category_id, ...) 
VALUES ('[category_id]', ...);
```

### Issue: Unique constraint violation

**Solution:** Check for duplicates:

```sql
-- Find duplicate emails
SELECT email, COUNT(*) 
FROM users 
GROUP BY email 
HAVING COUNT(*) > 1;
```

## Next Steps

1. ✅ Database installed and configured
2. ⬜ Update admin password (see post-installation)
3. ⬜ Add product categories
4. ⬜ Import products from CSV/Excel (if applicable)
5. ⬜ Configure backend API to connect
6. ⬜ Run initial analytics calculation
7. ⬜ Test all CRUD operations

## Testing Checklist

```sql
-- 1. Users
SELECT COUNT(*) as user_count FROM users;
SELECT * FROM pages LIMIT 5;

-- 2. Products
SELECT COUNT(*) as product_count FROM products;
SELECT COUNT(*) as category_count FROM product_categories;

-- 3. Customers
SELECT COUNT(*) as customer_count FROM customers;

-- 4. Orders
SELECT COUNT(*) as order_count FROM orders;
SELECT COUNT(*) as order_item_count FROM order_items;

-- 5. Inventory
SELECT COUNT(*) as log_count FROM inventory_logs;

-- 6. Discounts
SELECT COUNT(*) as discount_count FROM discounts;

-- 7. CMS
SELECT COUNT(*) as page_count FROM cms_pages;
SELECT COUNT(*) as section_count FROM cms_sections;

-- 8. Audit
SELECT COUNT(*) as audit_count FROM audit_logs;
```

## Documentation References

- **DATABASE_COMPLETE.md** - Detailed schema documentation
- **API_ENDPOINTS.md** - Backend API specification
- **BACKEND_INTEGRATION_GUIDE.md** - Integration walkthrough

---

**Last Updated:** 2026-03-18
**PostgreSQL Version:** 12+
**Status:** Production Ready
