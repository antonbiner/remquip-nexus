# REMQUIP — Heavy-Duty Truck Parts Distributor

Canada's next-generation heavy-duty truck parts distributor platform.

## Tech Stack

- **Framework:** React 18 + Vite + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **State:** TanStack Query + React Context
- **Routing:** React Router v6

## Getting Started

```sh
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── config/         # App configuration and constants
├── data/           # Mock data for development
├── hooks/          # Custom React hooks
├── lib/            # Utility functions
├── pages/          # Page components
│   ├── admin/      # Admin dashboard pages
│   └── ...         # Public pages
├── schemas/        # Database schema (PostgreSQL)
└── types/          # TypeScript type definitions
```

## Admin Dashboard

The admin panel (`/admin`) includes:

- **Overview:** KPIs, recent orders, activity log
- **Products:** CRUD, bulk actions, CSV export
- **Inventory:** Multi-warehouse stock management
- **Orders:** Order workflow, shipment tracking
- **Customers:** Full CRM with order history
- **Discounts:** Coupon code management
- **CMS:** Page content editor
- **Analytics:** Revenue charts, metrics
- **Settings:** Store configuration

## Deployment

Deploy to Vercel:

```sh
npm run build
vercel deploy
```
