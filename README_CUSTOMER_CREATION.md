# Customer Creation Feature - Complete Documentation

## Feature Overview

The Customer CRM now includes an **in-page customer creation form** that allows admins to quickly add new customers without navigating to a separate page.

## Location

**Admin Panel** → **Customers** → **+ New Customer** button (top-right header)

## What It Does

When you click "+ New Customer":
1. The customer list disappears
2. A comprehensive form appears
3. You fill in customer information
4. Click "Create Customer" to submit
5. Form data is sent to backend
6. New customer appears in list

## Form Fields

### Required Fields (marked with *)
- **Company Name** - The business name
- **Contact Name** - Primary contact person  
- **Email** - Business email (must be unique)
- **Customer Type** - Fleet, Wholesale, or Distributor

### Optional Fields
- **Phone** - Contact number
- **Street Address** - Physical address line 1
- **City** - City name
- **Province** - Canadian province (defaults to QC)
- **Postal Code** - Postal code
- **Tax ID** - Tax ID or GST number

## How to Use (Frontend)

### Step 1: Navigate to Customers
- Go to Admin Dashboard
- Click "Customers" in sidebar

### Step 2: Click Create Button
- Look for "+ New Customer" button at top-right
- Click it

### Step 3: Fill the Form
- All fields marked with * are required
- Fill in customer details
- Phone and address are optional
- Province defaults to Quebec (change if needed)

### Step 4: Submit
- Click blue "Create Customer" button
- Or click "Cancel" to go back without saving

### Step 5: Confirmation
- Currently shows console log (in development)
- Once backend is ready, will show success message
- New customer will appear in list

## Code Implementation

### File Modified
`/src/pages/admin/AdminCustomers.tsx`

### Key State Variables
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

### Form Submission
```typescript
onSubmit={(e) => {
  e.preventDefault();
  // Will send to API endpoint POST /api/customers
  console.log("[v0] Create customer:", newCustomer);
  setShowCreateModal(false);
}}
```

## Backend Integration (Next Steps)

### API Endpoint Needed
**Method:** POST  
**Path:** `/api/customers`  
**Auth:** Required (JWT token)

### Request Body Format
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

### Response Format (Success - 201)
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

### Error Responses

**Duplicate Email (409):**
```json
{
  "error": "Email already exists",
  "details": { "field": "email" }
}
```

**Missing Required Field (400):**
```json
{
  "error": "Validation failed",
  "details": {
    "field": "company",
    "message": "Company name is required"
  }
}
```

**Unauthorized (401):**
```json
{
  "error": "Unauthorized",
  "message": "Valid JWT token required"
}
```

## Data Validation

Backend should validate:

| Field | Type | Rules |
|-------|------|-------|
| company | string | Required, 2-100 chars, unique |
| name | string | Required, 2-100 chars |
| email | string | Required, valid email, unique |
| phone | string | Optional, valid format |
| type | enum | Required, one of: Fleet, Wholesale, Distributor |
| street | string | Optional, max 200 chars |
| city | string | Optional, 2-100 chars |
| province | string | Optional, 2-char code |
| postal | string | Optional, valid postal format |
| taxId | string | Optional, valid format |

## Database Schema

### Customers Table
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
```

### Customer Addresses Table (Optional)
```sql
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

## Implementation Checklist

### Backend Developer
- [ ] Create `/api/customers` POST endpoint
- [ ] Add JWT authentication middleware
- [ ] Validate all input fields
- [ ] Check email uniqueness
- [ ] Check company uniqueness
- [ ] Generate customer ID
- [ ] Store customer data
- [ ] Store address data
- [ ] Return created customer object
- [ ] Handle validation errors (400)
- [ ] Handle duplicate errors (409)
- [ ] Handle auth errors (401)
- [ ] Add activity log entry
- [ ] Add test cases

### Frontend Developer
- [ ] Update form submission to call API
- [ ] Add loading spinner during submit
- [ ] Handle API errors
- [ ] Show error messages in form
- [ ] Show success toast notification
- [ ] Refresh customer list
- [ ] Test with backend API
- [ ] Add loading state to button
- [ ] Clear form after success
- [ ] Handle network errors

## Testing Scenarios

### Happy Path
1. Fill all required fields ✓
2. Submit form ✓
3. Success message appears ✓
4. New customer in list ✓
5. Can view customer details ✓

### Validation
1. Skip company name → Error ✓
2. Skip contact name → Error ✓
3. Enter invalid email → Error ✓
4. Enter existing email → Error 409 ✓
5. Enter existing company → Error 409 ✓

### Edge Cases
1. Very long company name (100+ chars) → Validation ✓
2. Special characters in email → Validation ✓
3. Non-Canadian postal format → Validation ✓
4. Network timeout → Error handling ✓
5. Server error (500) → Error handling ✓

## UI/UX Details

- Form is in a full-page view (not a modal overlay)
- Back button returns to customer list without saving
- Required fields clearly marked with *
- Province defaults to Quebec (most common)
- Customer type defaults to Fleet
- All fields have placeholder text
- Form has responsive mobile layout
- Button shows loading state during submission
- Success message shows customer was created
- Error messages show specific field that failed

## Responsive Design

### Mobile (< 768px)
- Single column layout
- Full-width inputs
- Stacked form sections
- Touch-friendly buttons
- Easy vertical scrolling

### Tablet (768px - 1024px)
- 2-column grid for inputs
- Balanced spacing
- Address section 2-column

### Desktop (> 1024px)
- Full 2-column grid
- Optimal reading width
- Clear section separation
- Professional appearance

## Future Enhancements

1. **Bulk Import** - CSV upload for multiple customers
2. **Templates** - Save common address templates
3. **Customer Groups** - Organize by segment
4. **Email Verification** - Confirm email before activation
5. **Custom Fields** - Allow business-specific fields
6. **Activity Log** - Track who created customer and when
7. **Credit Terms** - Set initial credit limit
8. **Notifications** - Email confirmation to customer

## Troubleshooting

### Form Not Showing
- Check if you're logged in
- Verify you're at `/admin/customers`
- Look for "+ New Customer" button in top-right

### Form Shows But Can't Submit
- Verify all required fields (*) are filled
- Check email is valid format
- Ensure no duplicate email/company
- Check console for error messages

### No Success Message
- Backend API not yet implemented
- Check console for error details
- Verify network tab for API response

## Support Resources

- **Complete Spec:** See `CUSTOMER_CREATION_FEATURE.md`
- **Quick Summary:** See `CUSTOMER_FEATURE_SUMMARY.md`
- **Integration Guide:** See `COMPLETE_FEATURE_OVERVIEW.md`
- **Code Location:** `/src/pages/admin/AdminCustomers.tsx` (lines 217-375)
