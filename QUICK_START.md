# Quick Start Guide - User Access Management

## 30-Second Overview

Frontend is **ready to use immediately** with mock data. Create users, assign them to pages, manage permissions. Three view modes for maximum flexibility.

## Where to Go

1. **Users Page**: `/admin/users`
   - Create users
   - Edit/delete users
   - Set user roles

2. **Access Control Page**: `/admin/access`
   - **Matrix View**: See users × pages grid
   - **By User View**: Manage one user's permissions
   - **By Page View**: See which users have each page
   - **Bulk Assign**: Assign multiple users to multiple pages at once

## What You Can Do Right Now

### Create a User
1. Go to `/admin/users`
2. Click "Add User"
3. Fill in: Name, Email, Password, Role
4. Click "Create User"

### Assign Page Access
1. Go to `/admin/access`
2. Click "Bulk Assign"
3. Select users (checkboxes)
4. Select pages (checkboxes)
5. Choose permissions (View, Edit, Delete)
6. Click "Assign"

### View in Different Ways
- **Matrix**: See everything at once
- **By User**: Focus on one person's access
- **By Page**: Focus on one page's access

## Permission Levels

| Level | Meaning |
|-------|---------|
| View | Can see the page |
| Edit | Can view and modify |
| Delete | Full control (view, edit, delete) |

## Mock Data

Comes with sample data so you can explore immediately:
- 6 users (Admin, Managers, Users)
- 6 pages (Dashboard, Products, Orders, etc.)
- Some pre-existing access assignments

## After You Build the Backend

Change one variable to connect to your backend:

**File:** `.env`
```env
VITE_API_URL=http://localhost:3001/api
```

Then the frontend automatically calls your API instead of using mock data.

## API Endpoints You Need to Build

### Critical (do these first)
- POST `/api/users` - Create user
- GET `/api/users` - List users
- POST `/api/pages` - Create page
- GET `/api/pages` - List pages
- POST `/api/access` - Grant access
- POST `/api/access/bulk-assign` - Bulk assign users to pages

### See BACKEND_INTEGRATION.md for complete list

## File Structure

```
src/
├── pages/admin/
│   ├── AdminUsers.tsx       ← User management
│   ├── AdminAccess.tsx      ← Access control (3 views)
├── lib/
│   └── api-admin.ts         ← API calls (30+ methods)
└── types/
    └── admin.ts             ← Types & interfaces
```

## Key Files

| File | Purpose |
|------|---------|
| `BACKEND_INTEGRATION.md` | Complete API spec (use this!) |
| `IMPLEMENTATION_SUMMARY.md` | Detailed overview |
| `src/lib/api-admin.ts` | How to call the API |
| `src/types/admin.ts` | Data structures |

## Test Checklist

- [ ] Visit `/admin/users` - See user list
- [ ] Create a new user
- [ ] Visit `/admin/access` - See matrix view
- [ ] Switch views (Matrix, By User, By Page)
- [ ] Use Bulk Assign to assign multiple users to pages
- [ ] Edit permissions in By User view
- [ ] Revoke access

## Common Tasks

### Add a User Role
Users can be: `admin`, `manager`, `user`

### Add a Page
Go to mock data in `AdminAccess.tsx`, add to `mockPages` array.

### Change Permission Levels
Edit `mockAccess` array in `AdminAccess.tsx` or use the UI.

### Connect to Backend
1. Update `VITE_API_URL` in `.env`
2. API client in `api-admin.ts` handles the rest

## What Each Page Does

### `/admin/users`
**Create and manage user accounts**
- Add new users
- Set roles (Admin/Manager/User)
- Edit existing users
- Enable/disable accounts
- Delete users

All user management happens here. Page access is managed separately in Access Control.

### `/admin/access`
**Assign users to pages with permission levels**

Three ways to assign access:

1. **Matrix View** (default)
   - See all users as rows
   - See all pages as columns
   - Click to grant/revoke access
   - Best for: Quick overview, bulk changes

2. **By User View**
   - Select a user
   - See all their page permissions
   - Change permission levels
   - Best for: Managing one person's access

3. **By Page View**
   - Select a page
   - See all users with access
   - Add/remove users
   - Best for: Page-centric management

**Bulk Assign Button**
- Select 3 users, 2 pages = creates 6 access records
- Very efficient for setup
- Skips existing assignments

## Troubleshooting

### "No users found"
→ You're in User Management. Create a user first.

### Matrix view is empty
→ Create users and pages first. The frontend is waiting for backend API.

### Bulk Assign button disabled
→ You need to select at least 1 user AND 1 page.

### API calls not working
→ Check VITE_API_URL environment variable. Default is `http://localhost:3001/api`

## Next Steps

1. **Read** BACKEND_INTEGRATION.md (20 mins)
2. **Design** your database schema (use provided schema)
3. **Build** Phase 1 endpoints (CRUD for users/pages)
4. **Connect** frontend to your backend
5. **Build** Phase 2 endpoints (access control)
6. **Build** Phase 3 endpoints (bulk operations)

## Phase Breakdown

### Phase 1: Core (2-3 days)
- Create users table
- Create pages table
- Build: Create, Read, Update, Delete for both

### Phase 2: Access Control (2-3 days)
- Create user_page_access table
- Build access endpoints
- Add authorization checks

### Phase 3: Bulk Ops (1-2 days)
- Implement bulk assign
- Implement bulk revoke
- Add transaction support

### Phase 4: Polish (ongoing)
- Audit logging
- Error handling
- Performance optimization

## Development Mode

The app comes with:
- ✅ Mock data (instant feedback)
- ✅ No backend needed initially
- ✅ Full UI/UX working
- ✅ Ready for API integration

You can develop and test the UI completely independently from backend.

## Production Checklist

Before deploying:
- [ ] All API endpoints implemented
- [ ] Authentication working
- [ ] Authorization checks in place
- [ ] Database indexes created
- [ ] Audit logging enabled
- [ ] Error handling robust
- [ ] Performance tested
- [ ] Security reviewed

## Support

- **API Questions**: See BACKEND_INTEGRATION.md
- **Frontend Questions**: Check the component files
- **Type Questions**: Look in src/types/admin.ts
- **Integration Questions**: See api-admin.ts

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│  Frontend (React Vite)                               │
├─────────────────────────────────────────────────────┤
│  Pages:                                               │
│  • AdminUsers.tsx (Create/Edit users)                │
│  • AdminAccess.tsx (Assign pages to users)           │
│                                                      │
│  API Client:                                         │
│  • api-admin.ts (30+ methods)                        │
└─────────────────────────────────────────────────────┘
           ↓ (REST API calls)
┌─────────────────────────────────────────────────────┐
│  Backend (You build this)                            │
├─────────────────────────────────────────────────────┤
│  Tables:                                              │
│  • users                                              │
│  • pages                                              │
│  • user_page_access (the core table)                │
│  • audit_logs (optional)                             │
│                                                      │
│  Endpoints:                                           │
│  • POST /api/users                                    │
│  • GET /api/users                                     │
│  • POST /api/access/bulk-assign                       │
│  • ... (20+ total)                                    │
└─────────────────────────────────────────────────────┘
           ↓ (SQL)
┌─────────────────────────────────────────────────────┐
│  Database                                             │
│  (PostgreSQL, MySQL, etc.)                           │
└─────────────────────────────────────────────────────┘
```

## Getting Started

1. **Explore the UI** - Go to `/admin/users` and `/admin/access`
2. **Read the docs** - BACKEND_INTEGRATION.md has everything
3. **Plan your API** - Use the provided specifications
4. **Code the backend** - Follow the phase breakdown
5. **Connect frontend** - Update VITE_API_URL
6. **Test** - Use the UI to verify

That's it! You're ready to build.
