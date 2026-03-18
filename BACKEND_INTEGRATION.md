# Backend Integration Guide - User Access Management System

This document provides complete specifications for integrating the frontend access management system with your backend API.

## Overview

The frontend is designed as a complete user and page access control system with three main components:

1. **User Management** - Create, edit, and manage admin users
2. **Page Management** - Define pages/sections that require access control
3. **Access Control** - Assign users to pages with granular permissions

## API Configuration

### Environment Variables

Create a `.env` file in the frontend root:

```env
VITE_API_URL=http://localhost:3001/api
```

The API client in `src/lib/api-admin.ts` reads this environment variable.

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'manager', 'user')),
  status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_status (status)
);
```

### Pages Table
```sql
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  "order" INT DEFAULT 0,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_slug (slug)
);
```

### User Page Access Table (CORE TABLE)
```sql
CREATE TABLE user_page_access (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  can_view BOOLEAN DEFAULT TRUE,
  can_edit BOOLEAN DEFAULT FALSE,
  can_delete BOOLEAN DEFAULT FALSE,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  assigned_by UUID REFERENCES users(id),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, page_id),
  INDEX idx_user_id (user_id),
  INDEX idx_page_id (page_id),
  INDEX idx_access (user_id, page_id)
);
```

### Audit Logs Table (Optional but Recommended)
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID,
  user_id UUID REFERENCES users(id),
  changes JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_entity (entity_type, entity_id),
  INDEX idx_user (user_id),
  INDEX idx_action (action),
  INDEX idx_created_at (created_at)
);
```

## API Endpoints Specification

### Authentication
All endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt-token>
```

### Users Endpoints

#### GET /api/users
List all users with optional filters.

**Query Parameters:**
- `search` (optional): Search by name or email
- `role` (optional): Filter by role (admin, manager, user)
- `status` (optional): Filter by status (active, inactive)

**Response:**
```json
[
  {
    "id": "user-1",
    "name": "Marc Dupont",
    "email": "marc@remquip.ca",
    "role": "admin",
    "status": "active",
    "created": "2024-01-15",
    "lastLogin": "2026-03-18"
  }
]
```

**Error Codes:**
- 401: Unauthorized
- 403: Forbidden (insufficient permissions)

---

#### GET /api/users/:userId
Get a single user with their access records.

**Response:**
```json
{
  "id": "user-1",
  "name": "Marc Dupont",
  "email": "marc@remquip.ca",
  "role": "admin",
  "status": "active",
  "created": "2024-01-15",
  "lastLogin": "2026-03-18",
  "permissions": [
    {
      "pageId": "page-1",
      "pageName": "Dashboard",
      "canView": true,
      "canEdit": true,
      "canDelete": true,
      "assigned": "2024-01-15"
    }
  ]
}
```

**Error Codes:**
- 404: User not found
- 401: Unauthorized

---

#### POST /api/users
Create a new user.

**Request Body:**
```json
{
  "name": "Sarah Johnson",
  "email": "sarah@remquip.ca",
  "password": "secure_password_here",
  "role": "user"
}
```

**Validation:**
- `name`: Required, 2-255 characters
- `email`: Required, valid email format, unique
- `password`: Required, minimum 8 characters
- `role`: Required, one of: admin, manager, user

**Response:** 201 Created
```json
{
  "id": "user-123",
  "name": "Sarah Johnson",
  "email": "sarah@remquip.ca",
  "role": "user",
  "status": "active",
  "created": "2026-03-18"
}
```

**Error Codes:**
- 400: Validation failed (invalid data)
- 409: Email already exists
- 401: Unauthorized
- 403: Forbidden (insufficient permissions)

---

#### PATCH /api/users/:userId
Update user information.

**Request Body:**
```json
{
  "name": "Sarah Johnson Updated",
  "role": "manager",
  "status": "inactive"
}
```

**Allowed Fields:**
- `name`
- `email` (must be unique)
- `role`
- `status`
- `password` (optional, hashed on server)

**Response:** 200 OK
```json
{
  "id": "user-123",
  "name": "Sarah Johnson Updated",
  "email": "sarah@remquip.ca",
  "role": "manager",
  "status": "inactive",
  "created": "2026-03-18"
}
```

**Error Codes:**
- 404: User not found
- 400: Validation failed
- 409: Email already taken
- 401: Unauthorized
- 403: Forbidden

---

#### DELETE /api/users/:userId
Delete a user and all their access records.

**Response:** 204 No Content

**Error Codes:**
- 404: User not found
- 401: Unauthorized
- 403: Forbidden

---

### Pages Endpoints

#### GET /api/pages
List all pages.

**Query Parameters:**
- `search` (optional): Search by name
- `isPublic` (optional): Filter by public/private

**Response:**
```json
[
  {
    "id": "page-1",
    "name": "Dashboard",
    "slug": "dashboard",
    "description": "Admin dashboard overview",
    "order": 1,
    "isPublic": false
  }
]
```

---

#### GET /api/pages/:pageId
Get a single page.

**Response:**
```json
{
  "id": "page-1",
  "name": "Dashboard",
  "slug": "dashboard",
  "description": "Admin dashboard overview",
  "order": 1,
  "isPublic": false
}
```

**Error Codes:**
- 404: Page not found

---

#### POST /api/pages
Create a new page.

**Request Body:**
```json
{
  "name": "Reports",
  "slug": "reports",
  "description": "Advanced reporting",
  "order": 7,
  "isPublic": false
}
```

**Validation:**
- `name`: Required, 2-255 characters
- `slug`: Required, unique, lowercase alphanumeric with hyphens
- `description`: Optional
- `order`: Optional, default 0
- `isPublic`: Optional, default false

**Response:** 201 Created

**Error Codes:**
- 400: Validation failed
- 409: Slug already exists
- 401: Unauthorized
- 403: Forbidden

---

#### PATCH /api/pages/:pageId
Update a page.

**Request Body:**
```json
{
  "name": "Reports Updated",
  "description": "Updated description",
  "order": 8
}
```

**Response:** 200 OK

**Error Codes:**
- 404: Page not found
- 400: Validation failed
- 401: Unauthorized
- 403: Forbidden

---

#### DELETE /api/pages/:pageId
Delete a page and revoke all access to it.

**Response:** 204 No Content

**Note:** Consider setting `is_public = true` or archiving instead of deleting.

**Error Codes:**
- 404: Page not found
- 401: Unauthorized
- 403: Forbidden

---

### Access Control Endpoints

#### GET /api/access
List all access records with optional filters.

**Query Parameters:**
- `userId` (optional): Filter by user
- `pageId` (optional): Filter by page

**Response:**
```json
[
  {
    "userId": "user-1",
    "pageId": "page-1",
    "canView": true,
    "canEdit": true,
    "canDelete": true,
    "assigned": "2024-01-15",
    "assignedBy": "system-user"
  }
]
```

---

#### POST /api/access
Grant access to a single user for a single page.

**Request Body:**
```json
{
  "userId": "user-1",
  "pageId": "page-1",
  "canView": true,
  "canEdit": true,
  "canDelete": false
}
```

**Validation:**
- `userId`: Required, must exist
- `pageId`: Required, must exist
- `canView`, `canEdit`, `canDelete`: Required, boolean

**Response:** 201 Created
```json
{
  "userId": "user-1",
  "pageId": "page-1",
  "canView": true,
  "canEdit": true,
  "canDelete": false,
  "assigned": "2026-03-18",
  "assignedBy": "admin-user-id"
}
```

**Error Codes:**
- 400: Validation failed
- 404: User or page not found
- 409: Access record already exists
- 401: Unauthorized
- 403: Forbidden

---

#### PATCH /api/access/:userId/:pageId
Update existing access record.

**Request Body:**
```json
{
  "canView": true,
  "canEdit": false,
  "canDelete": false
}
```

**Response:** 200 OK

**Error Codes:**
- 404: Access record not found
- 400: Validation failed
- 401: Unauthorized
- 403: Forbidden

---

#### DELETE /api/access/:userId/:pageId
Revoke access for a user from a page.

**Response:** 204 No Content

**Error Codes:**
- 404: Access record not found
- 401: Unauthorized
- 403: Forbidden

---

### Bulk Operations (IMPORTANT)

#### POST /api/access/bulk-assign
Assign multiple users to multiple pages at once.

**Request Body:**
```json
{
  "userIds": ["user-2", "user-3", "user-4"],
  "pageIds": ["page-1", "page-2", "page-3"],
  "permissions": {
    "canView": true,
    "canEdit": true,
    "canDelete": false
  }
}
```

**What this does:**
- Creates 9 access records (3 users × 3 pages)
- Skips any that already exist
- Returns array of created records

**Response:** 201 Created
```json
[
  {
    "userId": "user-2",
    "pageId": "page-1",
    "canView": true,
    "canEdit": true,
    "canDelete": false,
    "assigned": "2026-03-18"
  },
  // ... 8 more records
]
```

**Validation:**
- `userIds`: Array of user IDs, required, minimum 1
- `pageIds`: Array of page IDs, required, minimum 1
- `permissions.canView`, `canEdit`, `canDelete`: Required, boolean

**Error Codes:**
- 400: Validation failed
- 404: User or page not found
- 401: Unauthorized
- 403: Forbidden

---

#### POST /api/access/bulk-revoke
Revoke access for multiple users from multiple pages.

**Request Body:**
```json
{
  "userIds": ["user-2", "user-3"],
  "pageIds": ["page-1", "page-2"]
}
```

**What this does:**
- Deletes all access records matching the userIds × pageIds combinations
- Returns count of deleted records

**Response:** 200 OK
```json
{
  "deleted": 4
}
```

**Error Codes:**
- 400: Validation failed
- 401: Unauthorized
- 403: Forbidden

---

## Implementation Checklist

### Phase 1: Core Tables & Basic CRUD
- [ ] Create users table
- [ ] Create pages table
- [ ] Create user_page_access table
- [ ] Implement GET /api/users
- [ ] Implement POST /api/users
- [ ] Implement PATCH /api/users/:userId
- [ ] Implement DELETE /api/users/:userId
- [ ] Implement GET /api/pages
- [ ] Implement POST /api/pages
- [ ] Implement PATCH /api/pages/:pageId
- [ ] Implement DELETE /api/pages/:pageId

### Phase 2: Access Control Core
- [ ] Implement GET /api/access
- [ ] Implement POST /api/access
- [ ] Implement PATCH /api/access/:userId/:pageId
- [ ] Implement DELETE /api/access/:userId/:pageId
- [ ] Add authentication middleware
- [ ] Add authorization checks (role-based)

### Phase 3: Bulk Operations
- [ ] Implement POST /api/access/bulk-assign
- [ ] Implement POST /api/access/bulk-revoke
- [ ] Add transaction support

### Phase 4: Advanced Features
- [ ] Audit logging (track all changes)
- [ ] Soft deletes for users/pages
- [ ] Access groups (optional)
- [ ] Role templates (optional)

## Frontend API Integration Points

The API client is in `src/lib/api-admin.ts`. When you implement each endpoint, it will be automatically called from:

1. **AdminUsers.tsx** - User CRUD operations
2. **AdminAccess.tsx** - Access control interface

All API calls use the methods in `apiAdmin` object:
```typescript
apiAdmin.getUsers()
apiAdmin.createUser(data)
apiAdmin.setAccess(userId, pageId, permissions)
apiAdmin.bulkAssignAccess(request)
// ... etc
```

## Security Considerations

1. **Authentication**: Verify JWT token on every request
2. **Authorization**: Check user role/permissions:
   - Only admins can manage users
   - Only admins can manage pages
   - Managers can view access, but not modify
3. **Input Validation**: Validate all inputs on server
4. **SQL Injection**: Use parameterized queries
5. **Password Hashing**: Use bcrypt or similar
6. **Rate Limiting**: Implement on bulk operations
7. **Audit Logging**: Log all admin actions

## Testing the Integration

### 1. Test User Creation
```bash
curl -X POST http://localhost:3001/api/users \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"pwd123","role":"user"}'
```

### 2. Test Page Creation
```bash
curl -X POST http://localhost:3001/api/pages \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Page","slug":"test-page","description":"Test"}'
```

### 3. Test Bulk Assign
```bash
curl -X POST http://localhost:3001/api/access/bulk-assign \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userIds":["user-1","user-2"],
    "pageIds":["page-1","page-2"],
    "permissions":{"canView":true,"canEdit":false,"canDelete":false}
  }'
```

## Troubleshooting

### API not responding
- Check if backend server is running
- Verify VITE_API_URL environment variable
- Check network tab in browser DevTools

### 401 Unauthorized errors
- Verify token is being sent
- Check token expiration
- Ensure token is in Authorization header

### 403 Forbidden errors
- Verify user has admin role
- Check authorization logic on backend

### 404 errors
- Verify user/page IDs exist
- Check URL format

## Next Steps

1. Review this specification with your backend team
2. Create the database schema
3. Implement endpoints in order (Phase 1 → 2 → 3)
4. Test with the provided frontend
5. Add audit logging
6. Deploy to production

## Support

For questions about the frontend implementation, reference:
- `/src/lib/api-admin.ts` - API client
- `/src/pages/admin/AdminUsers.tsx` - Users page
- `/src/pages/admin/AdminAccess.tsx` - Access control page
- `/src/types/admin.ts` - TypeScript types
