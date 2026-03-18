# Complete Database Schema Documentation

## Overview

This document describes the complete SQL database schema for RemQuip Nexus admin system. All tables are prepared and ready for implementation with PostgreSQL.

## Table of Contents

1. [Setup Instructions](#setup-instructions)
2. [Core Tables](#core-tables)
3. [Product Management](#product-management)
4. [Order Management](#order-management)
5. [Customer Management](#customer-management)
6. [Content Management](#content-management)
7. [Access Control](#access-control)
8. [Analytics & Audit](#analytics--audit)
9. [API Integration Guide](#api-integration-guide)
10. [Example Queries](#example-queries)

---

## Setup Instructions

### Step 1: Create Database

```sql
CREATE DATABASE remquip_nexus;
```

### Step 2: Run Migrations in Order

Execute migration files in this exact order:

```bash
# 1. Core users
psql remquip_nexus < database/001_create_core_tables.sql

# 2. Access control
psql remquip_nexus < database/002_create_access_control.sql

# 3. Products and categories
psql remquip_nexus < database/003_create_products.sql

# 4. Customers
psql remquip_nexus < database/004_create_customers.sql

# 5. Orders
psql remquip_nexus < database/005_create_orders.sql

# 6. Inventory
psql remquip_nexus < database/006_create_inventory.sql

# 7. Discounts
psql remquip_nexus < database/007_create_discounts.sql

# 8. CMS
psql remquip_nexus < database/008_create_cms.sql

# 9. Audit & Analytics
psql remquip_nexus < database/009_create_audit_analytics.sql
```

Or run all at once:

```bash
psql remquip_nexus < database/schema.sql
```

---

## Core Tables

### 1. users
Stores admin users and their credentials.

**Columns:**
- `id` (UUID): Primary key
- `email` (VARCHAR): Unique email address
- `password_hash` (VARCHAR): Bcrypt hashed password
- `full_name` (VARCHAR): User's full name
- `role` (VARCHAR): 'admin', 'manager', 'user'
- `status` (VARCHAR): 'active', 'inactive', 'suspended'
- `avatar_url` (TEXT): Profile picture URL
- `phone` (VARCHAR): Contact number
- `created_at`, `updated_at`, `last_login` (TIMESTAMP)

**Indexes:**
- `idx_users_email` (email)
- `idx_users_role` (role)
- `idx_users_status` (status)

**Default User:**
- Email: `admin@remquip.ca`
- Password: `admin123` (bcrypt hashed)
- **IMPORTANT:** Change this immediately in production!

---

### 2. pages
Defines admin pages for access control.

**Columns:**
- `id` (UUID): Primary key
- `name` (VARCHAR): Page display name (e.g., "Products")
- `slug` (VARCHAR): Unique URL slug (e.g., "products")
- `description` (TEXT): What this page is for
- `icon` (VARCHAR): Icon name (lucide-react icon)
- `is_active` (BOOLEAN): Whether page is available

**Pre-populated Pages:**
- Overview, Products, Inventory, Orders, Customers
- Discounts, CMS, Analytics, Users, Access Control, Settings

---

### 3. user_page_access
Junction table linking users to pages with specific permissions.

**Columns:**
- `id` (UUID): Primary key
- `user_id` (UUID): Foreign key to users
- `page_id` (UUID): Foreign key to pages
- `can_view` (BOOLEAN): Can user view page?
- `can_edit` (BOOLEAN): Can user edit content?
- `can_delete` (BOOLEAN): Can user delete content?
- `created_at`, `updated_at` (TIMESTAMP)

**Unique Constraint:** `(user_id, page_id)`

**Example:**
```sql
-- Grant admin user access to all pages
INSERT INTO user_page_access (user_id, page_id, can_view, can_edit, can_delete)
SELECT users.id, pages.id, true, true, true
FROM users, pages
WHERE users.role = 'admin';
```

---

## Product Management

### 1. product_categories
Organize products into categories and subcategories.

**Columns:**
- `id` (UUID): Primary key
- `name` (VARCHAR): Category name (unique)
- `slug` (VARCHAR): URL slug (unique)
- `description` (TEXT): Category description
- `image_url` (TEXT): Category image
- `parent_category_id` (UUID): For subcategories
- `is_active` (BOOLEAN): Show in frontend?
- `display_order` (INT): Sort order

**Indexes:**
- `idx_categories_slug` (slug)
- `idx_categories_parent` (parent_category_id)
- `idx_categories_active` (is_active)

---

### 2. products
Core product table.

**Columns:**
- `id` (UUID): Primary key
- `sku` (VARCHAR): Unique stock keeping unit
- `name` (VARCHAR): Product name
- `description` (TEXT): Full description
- `category_id` (UUID): Foreign key to product_categories
- `price` (DECIMAL): Retail price
- `wholesale_price` (DECIMAL): Fleet/wholesale price
- `distributor_price` (DECIMAL): Distributor price
- `stock_quantity` (INT): Available stock
- `low_stock_threshold` (INT): Alert level (default 10)
- `status` (VARCHAR): 'active', 'draft', 'archived'
- `is_featured` (BOOLEAN): Featured product?
- `created_by` (UUID): Creator user ID
- `created_at`, `updated_at` (TIMESTAMP)

**Constraints:**
- SKU must be unique
- Price > 0
- Stock >= 0
- Status in ('active', 'draft', 'archived')

**Indexes:**
- `idx_products_sku` (sku)
- `idx_products_name` (name)
- `idx_products_category` (category_id)
- `idx_products_status` (status)
- `idx_products_stock` (stock_quantity)

---

### 3. product_images
Multiple images per product.

**Columns:**
- `id` (UUID): Primary key
- `product_id` (UUID): Foreign key to products
- `image_url` (TEXT): Full image URL
- `alt_text` (VARCHAR): Alt text for accessibility
- `is_primary` (BOOLEAN): Main product image?
- `display_order` (INT): Sort order
- `uploaded_at` (TIMESTAMP)
- `created_by` (UUID): Uploader user ID

**Indexes:**
- `idx_product_images_product` (product_id)
- `idx_product_images_primary` (product_id, is_primary)

**Example Query:**
```sql
-- Get all images for a product
SELECT * FROM product_images
WHERE product_id = '...'
ORDER BY is_primary DESC, display_order ASC;
```

---

### 4. product_variants
Different versions of a product (size, color, etc).

**Columns:**
- `id` (UUID): Primary key
- `product_id` (UUID): Foreign key to products
- `variant_name` (VARCHAR): e.g., "Red - Large"
- `variant_sku` (VARCHAR): Unique variant SKU
- `variant_price` (DECIMAL): Override price for variant
- `stock_quantity` (INT): Stock for this variant
- `is_active` (BOOLEAN): Available for purchase?
- `created_at` (TIMESTAMP)

**Indexes:**
- `idx_variants_product` (product_id)
- `idx_variants_sku` (variant_sku)

---

## Customer Management

### customers
All customer accounts and information.

**Columns:**
- `id` (UUID): Primary key
- `company_name` (VARCHAR): Business name
- `contact_name` (VARCHAR): Primary contact person
- `email` (VARCHAR): Contact email
- `phone` (VARCHAR): Contact phone
- `customer_type` (VARCHAR): 'Fleet', 'Wholesale', 'Distributor'
- `tax_id` (VARCHAR): Business tax ID
- `street_address`, `city`, `province`, `postal_code`, `country` (VARCHAR)
- `status` (VARCHAR): 'active', 'inactive', 'blocked'
- `notes` (TEXT): Internal notes
- `total_orders` (INT): Order count
- `total_spent` (DECIMAL): Lifetime spending
- `created_by` (UUID): Created by which user
- `created_at`, `updated_at` (TIMESTAMP)

**Constraints:**
- customer_type in ('Fleet', 'Wholesale', 'Distributor')
- status in ('active', 'inactive', 'blocked')

**Indexes:**
- `idx_customers_email` (email)
- `idx_customers_company` (company_name)
- `idx_customers_type` (customer_type)
- `idx_customers_status` (status)
- `idx_customers_created_by` (created_by)

---

## Order Management

### 1. orders
Main orders table.

**Columns:**
- `id` (UUID): Primary key
- `order_number` (VARCHAR): Unique order ID (e.g., "RMQ-001234")
- `customer_id` (UUID): Foreign key to customers
- `status` (VARCHAR): pending, processing, shipped, completed, cancelled, refunded
- `order_date` (TIMESTAMP)

**Pricing:**
- `subtotal` (DECIMAL): Pre-tax total
- `tax` (DECIMAL): Tax amount
- `shipping_cost` (DECIMAL): Shipping fee
- `total` (DECIMAL): Grand total

**Payment:**
- `payment_method` (VARCHAR): credit_card, invoice, bank_transfer, cash
- `payment_status` (VARCHAR): pending, paid, failed

**Shipping:**
- `shipping_address_*` (VARCHAR): Full shipping address
- `tracking_number` (VARCHAR): Tracking code
- `carrier` (VARCHAR): Purolator, Canada Post, UPS, FedEx, Day & Ross
- `shipped_date`, `delivered_date` (TIMESTAMP)

**Other:**
- `notes` (TEXT): Order notes
- `created_by` (UUID): Created by user
- `updated_at` (TIMESTAMP)

**Indexes:**
- `idx_orders_customer` (customer_id)
- `idx_orders_status` (status)
- `idx_orders_order_number` (order_number)
- `idx_orders_date` (order_date)
- `idx_orders_payment_status` (payment_status)

---

### 2. order_items
Individual line items in an order.

**Columns:**
- `id` (UUID): Primary key
- `order_id` (UUID): Foreign key to orders
- `product_id` (UUID): Foreign key to products
- `variant_id` (UUID): Foreign key to product_variants (optional)
- `quantity` (INT): Quantity ordered
- `unit_price` (DECIMAL): Price per unit (snapshot)
- `line_total` (DECIMAL): Quantity × unit_price
- `created_at` (TIMESTAMP)

**Indexes:**
- `idx_order_items_order` (order_id)
- `idx_order_items_product` (product_id)

---

### 3. order_notes
Timeline and notes for orders.

**Columns:**
- `id` (UUID): Primary key
- `order_id` (UUID): Foreign key to orders
- `user_id` (UUID): User who added note
- `note_text` (TEXT): Note content
- `created_at` (TIMESTAMP)

**Indexes:**
- `idx_order_notes_order` (order_id)

---

## Inventory Management

### inventory_logs
Track all stock movements.

**Columns:**
- `id` (UUID): Primary key
- `product_id` (UUID): Foreign key to products
- `variant_id` (UUID): Foreign key to product_variants (optional)
- `action` (VARCHAR): stock_in, stock_out, adjustment, return, damage
- `quantity_change` (INT): How much changed (positive or negative)
- `previous_quantity` (INT): Stock before
- `new_quantity` (INT): Stock after
- `reason` (TEXT): Why it changed
- `reference_id` (VARCHAR): Related order/return ID
- `created_by` (UUID): User who made change
- `created_at` (TIMESTAMP)

**Indexes:**
- `idx_inventory_logs_product` (product_id)
- `idx_inventory_logs_date` (created_at)
- `idx_inventory_logs_action` (action)

---

## Promotion & Discount Management

### discounts
Discount codes and rules.

**Columns:**
- `id` (UUID): Primary key
- `code` (VARCHAR): Unique discount code
- `description` (VARCHAR): What the discount is for
- `discount_type` (VARCHAR): 'percentage' or 'fixed_amount'
- `discount_value` (DECIMAL): Percentage or dollar amount
- `applicable_to` (VARCHAR): all_products, specific_category, specific_product, customer_type
- `applicable_category_id` (UUID): If category-specific
- `applicable_product_id` (UUID): If product-specific
- `applicable_customer_type` (VARCHAR): Fleet, Wholesale, Distributor, all
- `minimum_order_value` (DECIMAL): Min order to use
- `maximum_uses` (INT): Total uses allowed
- `current_uses` (INT): Times already used
- `usage_per_customer` (INT): Max per customer
- `start_date`, `end_date` (TIMESTAMP): Valid date range
- `is_active` (BOOLEAN): Currently active?
- `created_by` (UUID): Creator user ID
- `created_at`, `updated_at` (TIMESTAMP)

**Indexes:**
- `idx_discounts_code` (code)
- `idx_discounts_active` (is_active)
- `idx_discounts_category` (applicable_category_id)
- `idx_discounts_product` (applicable_product_id)

---

## Content Management (CMS)

### 1. cms_pages
Website pages managed through CMS.

**Columns:**
- `id` (UUID): Primary key
- `title` (VARCHAR): Page title
- `slug` (VARCHAR): URL slug (unique)
- `content` (TEXT): Main content
- `meta_description` (VARCHAR): SEO meta description
- `meta_keywords` (VARCHAR): SEO keywords
- `status` (VARCHAR): draft, published, scheduled, archived
- `featured_image_url` (TEXT): Hero/featured image
- `view_count` (INT): Total page views
- `last_viewed` (TIMESTAMP): Last view timestamp
- `published_date` (TIMESTAMP): When published
- `scheduled_publish_date` (TIMESTAMP): Schedule for future
- `created_by` (UUID): Creator user ID
- `updated_by` (UUID): Last editor user ID
- `created_at`, `updated_at` (TIMESTAMP)

**Indexes:**
- `idx_cms_pages_slug` (slug)
- `idx_cms_pages_status` (status)
- `idx_cms_pages_created_by` (created_by)

---

### 2. cms_sections
Sections within CMS pages (blocks).

**Columns:**
- `id` (UUID): Primary key
- `page_id` (UUID): Foreign key to cms_pages
- `section_type` (VARCHAR): hero, features, testimonials, faq, text, image, video, form
- `title` (VARCHAR): Section title
- `content` (TEXT): Section content
- `display_order` (INT): Position on page
- `is_visible` (BOOLEAN): Show on frontend?
- `settings` (JSON): Flexible settings per section type
- `created_at`, `updated_at` (TIMESTAMP)

**Indexes:**
- `idx_cms_sections_page` (page_id)
- `idx_cms_sections_order` (page_id, display_order)

**Example Settings JSON:**
```json
{
  "hero": {
    "background_color": "#000000",
    "text_alignment": "center",
    "button_text": "Learn More"
  },
  "testimonials": {
    "layout": "grid",
    "columns": 3
  }
}
```

---

## Analytics & Audit

### 1. audit_logs
Complete audit trail of all admin actions.

**Columns:**
- `id` (UUID): Primary key
- `user_id` (UUID): Who made the change
- `entity_type` (VARCHAR): products, orders, customers, users, discounts, cms_pages
- `entity_id` (VARCHAR): ID of changed entity
- `action` (VARCHAR): create, update, delete, publish, approve, reject
- `old_values` (JSON): Previous values
- `new_values` (JSON): New values
- `ip_address` (VARCHAR): User's IP
- `user_agent` (TEXT): Browser info
- `created_at` (TIMESTAMP)

**Indexes:**
- `idx_audit_logs_user` (user_id)
- `idx_audit_logs_entity` (entity_type, entity_id)
- `idx_audit_logs_action` (action)
- `idx_audit_logs_date` (created_at)

**Example:**
```sql
-- Get all changes by admin user
SELECT * FROM audit_logs
WHERE user_id = '...'
ORDER BY created_at DESC;

-- Get change history for a product
SELECT * FROM audit_logs
WHERE entity_type = 'products' AND entity_id = '...'
ORDER BY created_at DESC;
```

---

### 2. analytics_daily_metrics
Daily performance metrics.

**Columns:**
- `id` (UUID): Primary key
- `metric_date` (DATE): Which day
- `total_orders` (INT): Orders that day
- `total_revenue` (DECIMAL): Revenue that day
- `average_order_value` (DECIMAL): AOV
- `total_customers` (INT): Active customers
- `new_customers` (INT): New that day
- `total_page_views` (INT): Frontend views
- `total_visits` (INT): Unique visits
- `created_at` (TIMESTAMP)

**Unique Constraint:** `metric_date`

**Indexes:**
- `idx_analytics_date` (metric_date)

---

## API Integration Guide

### Backend Requirements

**Database Connection String:**
```
postgresql://user:password@host:5432/remquip_nexus
```

**Required Libraries:**
- PostgreSQL driver (e.g., `pg`, `pgx`, `asyncpg`)
- Password hashing: `bcryptjs` or `argon2`
- Date library: `date-fns` or `moment`
- Validation: `zod` or `joi`

### Authentication

All API endpoints require Bearer token:
```
Authorization: Bearer <jwt_token>
```

### Core API Endpoints

**Users:**
- `GET /api/users` - List users
- `POST /api/users` - Create user
- `GET /api/users/:id` - Get user
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `POST /api/auth/login` - Login (returns JWT)
- `POST /api/auth/logout` - Logout

**Products:**
- `GET /api/products` - List products
- `POST /api/products` - Create product
- `GET /api/products/:id` - Get product
- `PATCH /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `POST /api/products/:id/images` - Add image
- `POST /api/products/:id/variants` - Add variant

**Orders:**
- `GET /api/orders` - List orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order detail
- `PATCH /api/orders/:id/status` - Update status
- `POST /api/orders/:id/notes` - Add note
- `POST /api/orders/:id/ship` - Mark shipped

**Customers:**
- `GET /api/customers` - List customers
- `POST /api/customers` - Create customer
- `GET /api/customers/:id` - Get customer
- `PATCH /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

**CMS:**
- `GET /api/cms/pages` - List CMS pages
- `POST /api/cms/pages` - Create page
- `GET /api/cms/pages/:slug` - Get page
- `PATCH /api/cms/pages/:id` - Update page
- `POST /api/cms/pages/:id/sections` - Add section

**Access Control:**
- `GET /api/access/users/:userId/permissions` - Get user permissions
- `POST /api/access/bulk-assign` - Bulk assign pages to users
- `PATCH /api/access/:accessId` - Update permission

---

## Example Queries

### 1. Get Product with All Images

```sql
SELECT 
  p.*,
  json_agg(
    json_build_object(
      'id', pi.id,
      'url', pi.image_url,
      'altText', pi.alt_text,
      'isPrimary', pi.is_primary
    ) ORDER BY pi.is_primary DESC, pi.display_order
  ) as images
FROM products p
LEFT JOIN product_images pi ON p.id = pi.product_id
WHERE p.id = $1
GROUP BY p.id;
```

### 2. Get Order with All Items

```sql
SELECT 
  o.*,
  json_agg(
    json_build_object(
      'id', oi.id,
      'productName', p.name,
      'quantity', oi.quantity,
      'unitPrice', oi.unit_price,
      'lineTotal', oi.line_total
    )
  ) as items
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
LEFT JOIN products p ON oi.product_id = p.id
WHERE o.id = $1
GROUP BY o.id;
```

### 3. Get Customer Dashboard Stats

```sql
SELECT 
  c.*,
  COUNT(o.id)::INT as order_count,
  COALESCE(SUM(o.total), 0) as total_spent,
  MAX(o.order_date) as last_order_date
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
WHERE c.id = $1
GROUP BY c.id;
```

### 4. Get User Permissions for All Pages

```sql
SELECT 
  u.id, u.email, u.full_name,
  json_agg(
    json_build_object(
      'pageId', p.id,
      'pageName', p.name,
      'canView', upa.can_view,
      'canEdit', upa.can_edit,
      'canDelete', upa.can_delete
    )
  ) as pages
FROM users u
LEFT JOIN user_page_access upa ON u.id = upa.user_id
LEFT JOIN pages p ON upa.page_id = p.id
WHERE u.id = $1
GROUP BY u.id;
```

### 5. Get Low Stock Products

```sql
SELECT 
  p.*,
  c.name as category_name,
  (p.low_stock_threshold - p.stock_quantity) as units_below_threshold
FROM products p
JOIN product_categories c ON p.category_id = c.id
WHERE p.stock_quantity <= p.low_stock_threshold
  AND p.status = 'active'
ORDER BY p.stock_quantity ASC;
```

### 6. Get Orders by Status Summary

```sql
SELECT 
  status,
  COUNT(*) as count,
  SUM(total) as total_revenue,
  AVG(total) as average_order_value
FROM orders
WHERE order_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY status
ORDER BY count DESC;
```

### 7. Apply Discount to Order

```sql
-- Calculate discounted price
SELECT 
  o.id,
  o.subtotal,
  CASE 
    WHEN d.discount_type = 'percentage' 
      THEN o.subtotal * (d.discount_value / 100)
    WHEN d.discount_type = 'fixed_amount'
      THEN d.discount_value
  END as discount_amount,
  o.subtotal - CASE 
    WHEN d.discount_type = 'percentage' 
      THEN o.subtotal * (d.discount_value / 100)
    WHEN d.discount_type = 'fixed_amount'
      THEN d.discount_value
  END as new_subtotal
FROM orders o
JOIN discounts d ON d.code = $1
WHERE o.id = $2
  AND d.is_active
  AND (d.end_date IS NULL OR d.end_date > NOW());
```

---

## Performance Notes

- All frequently queried columns are indexed
- Foreign keys have cascading deletes where appropriate
- JSON columns for flexible settings (CMS sections)
- Timestamps on all entities for audit trail
- Use `created_at`, `updated_at` for time-series analytics

## Security Notes

- Always hash passwords with bcrypt (cost 10+)
- Use parameterized queries to prevent SQL injection
- Validate all user inputs server-side
- Implement rate limiting on auth endpoints
- Log all admin actions to audit_logs
- Use HTTPS for all API communication
- Implement JWT with short expiration (15 min) + refresh token (7 days)

---

**Database Version:** PostgreSQL 12+
**Last Updated:** 2026-03-18
**Status:** Ready for Production
