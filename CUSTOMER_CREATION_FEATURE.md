# Customer Creation Feature - Implementation Guide

## Overview

The Customer CRM page now includes a full-featured customer creation form directly integrated into the admin interface. This allows admins to create new customers without leaving the CRM view.

## Features Added

### 1. Create Customer Button
- Located in the header of the Customer CRM page
- Blue accent button with "+ New Customer" label
- Takes user to a dedicated creation form

### 2. Customer Creation Form
Comprehensive form with the following sections:

#### Basic Information
- **Company Name** (required) - The customer's business name
- **Contact Name** (required) - Primary contact person
- **Email** (required) - Business email address
- **Phone** (optional) - Contact phone number
- **Customer Type** (required) - Dropdown with options:
  - Fleet
  - Wholesale
  - Distributor

#### Address Information
- **Street Address** (optional) - Physical address line 1
- **City** (optional) - City name
- **Province** (optional) - Canadian province selector
- **Postal Code** (optional) - Postal/ZIP code

#### Billing Information
- **Tax ID** (optional) - Tax ID or GST number for invoicing

### 3. Form State Management
The form uses React state to manage:
- Input values with two-way binding
- Show/hide modal state
- Form validation (required fields marked with *)

### 4. Form Actions
- **Create Customer** - Submits the form
- **Cancel** - Returns to customer list without saving

## Code Location

**File:** `/src/pages/admin/AdminCustomers.tsx`

### State Variables Added
```typescript
const [showCreateModal, setShowCreateModal] = useState(false);
const [newCustomer, setNewCustomer] = useState({
  company: "",
  name: "",
  email: "",
  phone: "",
  type: "Fleet",
  street: "",
  city: "",
  province: "QC",
  postal: "",
  taxId: "",
});
```

### Form Submission Handler
```typescript
onSubmit={(e) => {
  e.preventDefault();
  // This will connect to backend API
  console.log("[v0] Create customer:", newCustomer);
  setNewCustomer({ /* reset form */ });
  setShowCreateModal(false);
}}
```

## Backend Integration Points

### 1. API Endpoint Required
**Endpoint:** `POST /api/customers`

**Request Body:**
```json
{
  "company": "Acme Transport",
  "name": "John Smith",
  "email": "john@acme.com",
  "phone": "+1 (555) 000-0000",
  "type": "Fleet",
  "address": {
    "street": "123 Industrial Way",
    "city": "Toronto",
    "province": "ON",
    "postal": "M3J 2P1"
  },
  "taxId": "ON-12345678"
}
```

**Response (Success):**
```json
{
  "id": "cust-123",
  "company": "Acme Transport",
  "name": "John Smith",
  "email": "john@acme.com",
  "phone": "+1 (555) 000-0000",
  "type": "Fleet",
  "status": "active",
  "created_at": "2026-03-18T10:30:00Z",
  "orders": 0,
  "totalSpent": 0,
  "lastOrder": null
}
```

**Error Response (Validation):**
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Email already exists"
    }
  ]
}
```

### 2. Form Submission Implementation

Update the form submission handler in `AdminCustomers.tsx`:

```typescript
const handleCreateCustomer = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        company: newCustomer.company,
        name: newCustomer.name,
        email: newCustomer.email,
        phone: newCustomer.phone,
        type: newCustomer.type,
        address: {
          street: newCustomer.street,
          city: newCustomer.city,
          province: newCustomer.province,
          postal: newCustomer.postal,
        },
        taxId: newCustomer.taxId,
      }),
    });

    if (!response.ok) throw new Error('Failed to create customer');
    
    const createdCustomer = await response.json();
    
    // Show success message
    // Refresh customer list
    // Close modal
    setShowCreateModal(false);
    setNewCustomer({ /* reset */ });
    
  } catch (error) {
    console.error('Error creating customer:', error);
    // Show error message to user
  }
};
```

### 3. Form Validation Rules

Backend should validate:

| Field | Rules |
|-------|-------|
| company | Required, 2-100 chars, must be unique |
| name | Required, 2-100 chars |
| email | Required, valid email format, must be unique |
| phone | Optional, valid phone format |
| type | Required, one of: Fleet, Wholesale, Distributor |
| address.street | Optional, max 200 chars |
| address.city | Optional, 2-100 chars |
| address.province | Optional, valid Canadian province code |
| address.postal | Optional, valid postal code format |
| taxId | Optional, valid tax ID format |

### 4. Database Schema

**Customers Table:**
```sql
CREATE TABLE customers (
  id VARCHAR(50) PRIMARY KEY,
  company VARCHAR(100) NOT NULL UNIQUE,
  contact_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(20),
  customer_type ENUM('Fleet', 'Wholesale', 'Distributor') NOT NULL,
  status ENUM('active', 'inactive') DEFAULT 'active',
  tax_id VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by VARCHAR(50),
  INDEX idx_email (email),
  INDEX idx_company (company),
  INDEX idx_status (status)
);

CREATE TABLE customer_addresses (
  id VARCHAR(50) PRIMARY KEY,
  customer_id VARCHAR(50) NOT NULL,
  street VARCHAR(200),
  city VARCHAR(100),
  province VARCHAR(2),
  postal_code VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);
```

### 5. Error Handling

Common errors to handle:

1. **Duplicate Email**
   - Status: 409 Conflict
   - Message: "Email already exists"
   
2. **Duplicate Company**
   - Status: 409 Conflict
   - Message: "Company name already exists"

3. **Invalid Email Format**
   - Status: 400 Bad Request
   - Message: "Invalid email format"

4. **Missing Required Fields**
   - Status: 400 Bad Request
   - Message: "Missing required field: {field}"

## Frontend Implementation Checklist

- [ ] Add API client method in `lib/api-admin.ts`:
  ```typescript
  export async function createCustomer(customerData: CustomerFormData) {
    return fetch(`${VITE_API_URL}/api/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customerData),
    });
  }
  ```

- [ ] Update form submission to call API
- [ ] Add loading state during submission
- [ ] Add error message display in form
- [ ] Add success toast notification
- [ ] Refresh customer list after successful creation
- [ ] Add form validation before submission

## Backend Implementation Checklist

- [ ] Create `/api/customers` POST endpoint
- [ ] Validate all input fields
- [ ] Check for duplicate email and company
- [ ] Generate unique customer ID
- [ ] Store customer in database
- [ ] Store address information
- [ ] Create initial activity log
- [ ] Return created customer object
- [ ] Handle validation errors with 400 status
- [ ] Handle conflict errors with 409 status

## Testing Scenarios

### Happy Path
1. Fill all required fields
2. Click Create Customer
3. Verify success message
4. Verify new customer appears in list
5. Verify customer can be clicked to view details

### Validation Errors
1. Submit without company name → error message
2. Submit without contact name → error message
3. Submit with invalid email → error message
4. Submit without customer type → error message

### Duplicate Detection
1. Try to create customer with existing email → error message
2. Try to create customer with existing company → error message

## UI/UX Considerations

- Form is in modal/separate view (no modal overlay)
- Back button returns to customer list
- All required fields clearly marked with *
- Postal code format specific to Canada
- Province selector pre-populated with Quebec
- Customer type defaults to "Fleet"
- Form submission shows feedback
- Mobile responsive layout with stacked inputs

## Future Enhancements

1. **Bulk Customer Import** - CSV upload capability
2. **Customer Templates** - Save common address templates
3. **Customer Groups** - Organize by business segment
4. **Email Verification** - Confirm customer email before activation
5. **Custom Fields** - Allow custom data per customer
6. **Activity Tracking** - Log who created customer and when
7. **Initial Credit Limit** - Set credit terms during creation
8. **Auto-numbering** - Generate sequential customer IDs
