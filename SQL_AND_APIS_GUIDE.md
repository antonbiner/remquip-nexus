# SQL Database Schema & API Implementation Guide

## Overview

You now have a single, comprehensive SQL file with complete database schema and detailed API documentation:

**File Location:** `/database/complete-schema-with-apis.sql`

This file contains:
- 16 database tables with all relationships and constraints
- 100+ detailed API endpoints specifications
- Complete validation rules for each field
- Security and performance recommendations
- Data flow documentation

## Quick Start

### Step 1: Create Database
```bash
createdb remquip_nexus
```

### Step 2: Run SQL File
```bash
psql -d remquip_nexus -f database/complete-schema-with-apis.sql
```

### Step 3: Verify Installation
```sql
SELECT tablename FROM pg_tables WHERE schemaname = 'public';
```

You should see 16 tables created.

---

## Database Tables & API Endpoints

### 1. Users Table (45 endpoints)
**Table:** `users`
**Purpose:** Admin user authentication and management

**API Endpoints:**
- `POST /api/users` - Create user
- `GET /api/users` - List users (with pagination)
- `GET /api/users/:id` - Get user details
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `PATCH /api/users/:id/password` - Change password
- `PATCH /api/users/:id/role` - Update role
- `PATCH /api/users/:id/status` - Update status
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/users/me` - Current user
- `PUT /api/users/:id/avatar` - Upload avatar

**Key Fields:**
- `id` (UUID) - Primary key
- `email` (VARCHAR 255) - Unique, required
- `password_hash` (VARCHAR 255) - Bcrypt hashed
- `full_name` (VARCHAR 255) - Required, min 2 chars
- `role` (VARCHAR 50) - admin, manager, user
- `status` (VARCHAR 50) - active, inactive, suspended
- `avatar_url` (TEXT) - Profile picture URL
- `last_login` (TIMESTAMP) - Auto-updated on login

**Validation Rules:**
- Email: unique, valid format
- Password: min 8 chars, bcrypt hash (min 12 rounds)
- Full name: required, min 2 characters
- Role: must be admin, manager, or user
- Status: must be active, inactive, or suspended

**Indexes:**
- idx_users_email (for login lookups)
- idx_users_role (for filtering by role)
- idx_users_status (for filtering by status)
- idx_users_created_at (for sorting)

---

### 2. Pages & Access Control Tables (20 endpoints)
**Tables:** `pages`, `user_page_access`
**Purpose:** Manage admin page access and permissions

**API Endpoints:**
- `POST /api/pages` - Create page
- `GET /api/pages` - List pages
- `GET /api/pages/:id` - Get page
- `PATCH /api/pages/:id` - Update page
- `DELETE /api/pages/:id` - Delete page
- `POST /api/access/assign` - Assign user to page
- `GET /api/access` - List all access
- `GET /api/access/user/:userId` - Get user's pages
- `GET /api/access/page/:pageId` - Get page's users
- `POST /api/access/bulk-assign` - Bulk assign (most important!)
- `PATCH /api/access/:accessId` - Update permissions
- `DELETE /api/access/:accessId` - Remove access
- `GET /api/access/check/:userId/:pageId` - Check access

**Permissions (Three Levels):**
- `can_view` (BOOLEAN) - Can see the page
- `can_edit` (BOOLEAN) - Can modify data
- `can_delete` (BOOLEAN) - Can delete data

**Bulk Assignment Request Example:**
```json
POST /api/access/bulk-assign
{
  "userIds": ["user-1", "user-2", "user-3"],
  "pageIds": ["page-1", "page-2"],
  "permissions": {
    "can_view": true,
    "can_edit": true,
    "can_delete": false
  }
}
```
Result: 6 access records created (3 users × 2 pages)

---

### 3. Customers Table (15 endpoints)
**Table:** `customers`
**Purpose:** CRM - Store and manage customer information

**API Endpoints:**
- `POST /api/customers` - Create customer
- `GET /api/customers` - List customers (search, filter, pagination)
- `GET /api/customers/:id` - Get customer details
- `PATCH /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer
- `GET /api/customers/search` - Full-text search
- `GET /api/customers/type/:type` - Filter by type
- `GET /api/customers/:id/orders` - Get customer's orders
- `GET /api/customers/:id/notes` - Get customer notes
- `POST /api/customers/:id/notes` - Add note to customer
- `PATCH /api/customers/:id/status` - Update status

**Customer Types:**
- Fleet - Standard commercial customers
- Wholesale - Bulk purchasers
- Distributor - Resellers

**Key Fields:**
- `company_name` (VARCHAR 255) - Required
- `contact_name` (VARCHAR 255) - Required
- `email` (VARCHAR 255) - Required, unique
- `phone` (VARCHAR 20) - Optional
- `customer_type` (VARCHAR 50) - Fleet, Wholesale, Distributor
- `tax_id` (VARCHAR 50) - Quebec/Canada tax ID
- `status` (VARCHAR 50) - active, inactive, blocked
- `total_orders` (INT) - Aggregate from orders
- `total_spent` (DECIMAL) - Aggregate from orders
- `created_by` (UUID) - Which admin created

**Address Fields:**
- `street_address`, `city`, `province`, `postal_code`, `country`

---

### 4. Products Tables (40+ endpoints)
**Tables:** `product_categories`, `products`, `product_images`, `product_variants`
**Purpose:** Product catalog with images and variants

**API Endpoints:**
- **Categories:** Create, List, Get, Update, Delete, Filter
- **Products:** CRUD, Search, List by category, Get featured
- **Images:** Upload, List, Delete, Set primary
- **Variants:** Create, List, Get, Update, Delete

**Product Pricing (By Customer Type):**
- `price` - Default retail price
- `wholesale_price` - Wholesale customer price
- `distributor_price` - Distributor (lowest) price

**Apply Logic:**
- Fleet customer → use `price`
- Wholesale customer → use `wholesale_price`
- Distributor customer → use `distributor_price`

**Product Status:**
- active - Visible on frontend
- draft - Under development
- archived - Hidden but kept in history

**Variants:**
Use for sizes, colors, configurations
- `variant_name` (e.g., "Red - Large")
- `variant_sku` (unique per variant)
- `variant_price` (optional, inherits from parent if null)
- `stock_quantity` (independent per variant)

---

### 5. Inventory Tables (8 endpoints)
**Table:** `inventory_logs`
**Purpose:** Track all stock movements

**API Endpoints:**
- `GET /api/inventory/logs` - List all logs
- `GET /api/inventory/logs/product/:id` - Logs for product
- `POST /api/inventory/adjust` - Manual adjustment
- `GET /api/inventory/low-stock` - Low stock alerts
- `GET /api/inventory/report` - Generate report

**Stock Actions:**
- `stock_in` - Received inventory
- `stock_out` - Sold/shipped
- `adjustment` - Manual correction
- `return` - Customer return
- `damage` - Damaged goods

**When Order Created:**
1. Check `product.stock_quantity >= order_items.quantity`
2. Create `inventory_logs` entry with action=stock_out
3. Reduce `product.stock_quantity`
4. Update `customer.total_orders` and `customer.total_spent`

---

### 6. Orders Tables (25+ endpoints)
**Tables:** `orders`, `order_items`, `order_notes`
**Purpose:** Order management and fulfillment tracking

**API Endpoints:**
- `POST /api/orders` - Create order
- `GET /api/orders` - List orders (filters, sort, pagination)
- `GET /api/orders/:id` - Get order with items
- `PATCH /api/orders/:id` - Update order
- `PATCH /api/orders/:id/status` - Update status
- `PATCH /api/orders/:id/payment` - Update payment status
- `PATCH /api/orders/:id/shipping` - Update tracking
- `DELETE /api/orders/:id` - Cancel order
- `GET /api/orders/customer/:customerId` - Customer orders
- `POST /api/orders/:id/notes` - Add note
- `POST /api/orders/:id/refund` - Process refund

**Order Status Flow:**
```
pending → processing → shipped → completed
    ↓           ↓           ↓         ↓
  cancelled   cancelled  cancelled  refunded
```

**Order Number Format:** RMQ-001234 (auto-generated)

**Pricing Calculation:**
```
subtotal = sum of (product.price × quantity)
tax = subtotal × tax_rate (by province)
shipping_cost = based on carrier + weight
total = subtotal + tax + shipping_cost
```

**Payment Methods:**
- credit_card
- invoice
- bank_transfer
- cash

**Shipping Carriers:**
- Purolator
- Canada Post
- UPS
- FedEx

---

### 7. Discounts Table (10 endpoints)
**Table:** `discounts`
**Purpose:** Promotional codes and discounts

**API Endpoints:**
- `POST /api/discounts` - Create code
- `GET /api/discounts` - List codes
- `GET /api/discounts/:id` - Get details
- `PATCH /api/discounts/:id` - Update
- `DELETE /api/discounts/:id` - Delete
- `GET /api/discounts/code/:code` - Validate code
- `POST /api/discounts/:id/apply` - Calculate savings

**Discount Types:**
- `percentage` - e.g., 10% off
- `fixed_amount` - e.g., $5 off

**Targeting Options:**
- `all_products` - Apply to entire order
- `specific_category` - Only to items in category
- `specific_product` - Only to specific product
- `customer_type` - Only to Fleet/Wholesale/Distributor

**Constraints:**
- `minimum_order_value` - Only apply if order > value
- `maximum_uses` - Cap total uses (NULL = unlimited)
- `usage_per_customer` - Cap per customer (NULL = unlimited)
- `start_date` / `end_date` - Active period

---

### 8. CMS Tables (20+ endpoints)
**Tables:** `cms_pages`, `cms_sections`
**Purpose:** Content management for marketing pages

**API Endpoints:**
- `POST /api/cms/pages` - Create page
- `GET /api/cms/pages` - List pages
- `GET /api/cms/pages/:slug` - Get by slug
- `PATCH /api/cms/pages/:id` - Update
- `DELETE /api/cms/pages/:id` - Delete
- `PATCH /api/cms/pages/:id/publish` - Publish
- `PATCH /api/cms/pages/:id/schedule` - Schedule
- `PUT /api/cms/pages/:id/featured` - Upload image
- `POST /api/cms/pages/:id/sections` - Add section
- `PATCH /api/cms/sections/:id` - Update section
- `DELETE /api/cms/sections/:id` - Delete section

**Page Status:**
- `draft` - Not published
- `published` - Live
- `scheduled` - Will publish at scheduled_publish_date
- `archived` - Hidden

**Section Types:**
- `hero` - Large banner with CTA
- `features` - Feature list
- `testimonials` - Customer quotes
- `faq` - FAQ section
- `text` - Rich text
- `image` - Full-width image
- `video` - Embedded video
- `form` - Contact form

**Section Settings (JSON):**
Each section type stores type-specific settings in JSON
```json
{
  "hero": {
    "background_image": "url",
    "heading": "text",
    "subheading": "text",
    "cta_text": "button text",
    "cta_link": "button link"
  }
}
```

---

### 9. Audit Logs Table (5 endpoints)
**Table:** `audit_logs`
**Purpose:** Track all administrative actions

**API Endpoints:**
- `GET /api/audit/logs` - List logs
- `GET /api/audit/logs/user/:userId` - User's actions
- `GET /api/audit/logs/entity/:type/:id` - Entity history
- Logs are immutable (create only, no delete)

**Audit Actions:**
- `create` - New entity
- `update` - Modified entity
- `delete` - Deleted entity
- `publish` - Published content
- `approve` - Approved item
- `reject` - Rejected item

**Capture:**
- `user_id` - Which admin
- `entity_type` - products, orders, customers, etc.
- `entity_id` - Which specific entity
- `action` - What happened
- `old_values` (JSON) - Previous data
- `new_values` (JSON) - New data
- `ip_address` - For security
- `user_agent` - Browser info

---

### 10. Analytics Table (8 endpoints)
**Table:** `analytics_daily_metrics`
**Purpose:** Dashboard analytics and reporting

**API Endpoints:**
- `GET /api/analytics/daily` - List daily metrics
- `GET /api/analytics/daily/:date` - Metrics for date
- `GET /api/analytics/range` - Date range metrics
- `GET /api/analytics/summary` - Overall summary
- `GET /api/analytics/top-products` - Top sellers
- `GET /api/analytics/top-customers` - Top spenders

**Metrics:**
- `total_orders` - Orders placed
- `total_revenue` - Total sales
- `average_order_value` - Revenue ÷ orders
- `total_customers` - Unique customers
- `new_customers` - First-time customers
- `total_page_views` - Website page views
- `total_visits` - Unique sessions

**Data Aggregation:**
Run daily job to compute from orders and customers tables

---

## Implementation Roadmap

### Phase 1: Core Setup (Week 1)
- Create database
- Run SQL schema
- Setup environment variables
- Implement authentication endpoints

### Phase 2: CRUD Operations (Week 2)
- Users CRUD
- Customers CRUD
- Products CRUD
- Categories CRUD

### Phase 3: Advanced Features (Week 3)
- Order management with inventory sync
- Access control system
- Discounts application
- CMS system

### Phase 4: Analytics & Reporting (Week 4)
- Audit logging
- Analytics aggregation
- Reporting endpoints

### Phase 5: Optimization (Week 5)
- Performance tuning
- Caching strategy
- Load testing

---

## Key Implementation Notes

### Authentication
- Use JWT tokens with expiration (1 hour)
- Refresh tokens for extending sessions
- Hash passwords with bcrypt (minimum 12 rounds)
- Never log or return plaintext passwords

### Data Validation
- Validate ALL inputs on backend (don't trust frontend)
- Check business logic constraints
- Prevent invalid status transitions
- Validate foreign key references

### Database Transactions
- Use transactions for order creation
- Ensure inventory updates are atomic
- Rollback on any error

### Performance
- Use connection pooling
- Implement query caching
- Index frequently filtered columns
- Monitor slow queries

### Error Handling
- Return meaningful error messages
- Log all errors with context
- Never expose sensitive info
- Implement retry logic for transient failures

### Security
- Implement rate limiting
- CORS for frontend domain only
- SQL injection prevention (use parameterized queries)
- XSS protection in CMS content
- CSRF tokens for state-changing requests

---

## Testing Checklist

- Unit tests for business logic
- Integration tests for API endpoints
- Database tests for constraints and indexes
- Performance tests for large datasets
- Security tests for authentication
- End-to-end tests for complete workflows

---

## File Structure

```
/database/
├── complete-schema-with-apis.sql (THIS FILE - 967 lines)
├── 001_create_core_tables.sql (alternative migration)
├── 002_create_access_control.sql
├── ... (more migrations if needed)
└── schema.sql (original version)
```

Use `complete-schema-with-apis.sql` - it's the most comprehensive and has all API documentation in comments.

---

## Quick Reference

**Total Tables:** 16
**Total Indexes:** 40+
**Total API Endpoints:** 100+
**Database Size (approx):** Scalable to millions of records

**Most Important Endpoints:**
1. `/api/auth/login` - Must work first
2. `/api/users` - User management
3. `/api/access/bulk-assign` - Permission system
4. `/api/customers` - CRM
5. `/api/orders` - Order processing
6. `/api/products` - Product catalog
7. `/api/discounts` - Promotions
8. `/api/cms/pages` - Content

Start with these in order and build out from there.
