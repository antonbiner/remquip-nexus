// =====================================================
// REMQUIP Admin Types - API Ready
// Aligned with database.sql schema
// =====================================================

// ─── CUSTOMER TYPES ───

export type CustomerType = "fleet" | "wholesale" | "distributor" | "enterprise";
export type CustomerStatus = "active" | "inactive" | "suspended";
export type CustomerLifecycleStage = "lead" | "active" | "at-risk" | "churned";
export type CustomerValueSegment = "high" | "medium" | "low";

export interface Address {
  id: string;
  customerId: string;
  type: "billing" | "shipping";
  addressLine1: string;
  addressLine2?: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
}

export interface CustomerNote {
  id: string;
  customerId: string;
  date: string;
  user: string;
  text: string;
  type: "note" | "call" | "email" | "system";
}

export interface CustomerDocument {
  id: string;
  customerId: string;
  name: string;
  type: "quote" | "invoice" | "contract" | "other";
  url: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
}

export interface Customer {
  id: string;
  userId?: string;
  companyName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  taxId?: string;
  customerType: CustomerType;
  pricingTierId?: string;
  status: CustomerStatus;
  lifecycleStage: CustomerLifecycleStage;
  valueSegment: CustomerValueSegment;
  creditLimit?: number;
  paymentTerms?: string;
  addresses: Address[];
  notes: CustomerNote[];
  documents: CustomerDocument[];
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerStats {
  totalOrders: number;
  totalSpent: number;
  avgOrderValue: number;
  lifetimeValue: number;
  lastOrderDate: string | null;
  daysSinceLastOrder: number | null;
  orderFrequency: number; // orders per month
  returnRate: number; // percentage
}

// ─── ORDER TYPES ───

export type OrderStatus = "pending" | "processing" | "shipped" | "completed" | "cancelled" | "refunded";
export type PaymentMethod = "credit_card" | "invoice" | "bank_transfer" | "paypal";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  sku: string;
  productName: string;
  productImage?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  metadata: Record<string, unknown>;
}

export interface OrderNote {
  id: string;
  orderId: string;
  date: string;
  user: string;
  text: string;
  type: "note" | "status_change" | "system";
}

export interface Shipment {
  id: string;
  orderId: string;
  warehouseId?: string;
  carrier: string;
  serviceLevel?: string;
  trackingNumber: string;
  status: "pending" | "label_created" | "in_transit" | "delivered" | "exception";
  estimatedDelivery?: string;
  shippedAt?: string;
  deliveredAt?: string;
  weightLbs?: number;
}

export interface Payment {
  id: string;
  orderId: string;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  currency: string;
  transactionId?: string;
  gatewayResponse?: Record<string, unknown>;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customer?: Customer;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  total: number;
  currency: string;
  billingAddress: Address;
  shippingAddress: Address;
  pricingTierId?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  notes: OrderNote[];
  shipments: Shipment[];
  payments: Payment[];
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

// ─── PRODUCT TYPES ───

export type ProductStatus = "active" | "draft" | "archived";

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  sortOrder: number;
  isPrimary: boolean;
}

export interface ProductPricing {
  tierId: string;
  tierName: string;
  price: number;
}

export interface ProductBuyer {
  customerId: string;
  customerName: string;
  companyName: string;
  customerType: CustomerType;
  totalQuantity: number;
  totalSpent: number;
  orderCount: number;
  lastPurchaseDate: string;
  orders: {
    orderId: string;
    orderNumber: string;
    date: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
}

export interface ProductSalesStats {
  totalUnitsSold: number;
  totalRevenue: number;
  avgUnitPrice: number;
  uniqueBuyers: number;
  reorderRate: number; // % of customers who reorder
  salesTrend: { date: string; units: number; revenue: number }[];
}

export interface ProductActivityLog {
  id: string;
  productId: string;
  action: string;
  field?: string;
  oldValue?: string;
  newValue?: string;
  user: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface StockLog {
  id: string;
  productId: string;
  date: string;
  type: "in" | "out" | "transfer" | "adjustment" | "return";
  quantity: number;
  reference: string;
  orderId?: string;
  orderNumber?: string;
  customerId?: string;
  customerName?: string;
  warehouse: string;
  note: string;
  user: string;
  balanceAfter: number;
}

// ─── ACTIVITY TIMELINE ───

export type ActivityType = 
  | "order_placed"
  | "order_status_changed"
  | "payment_received"
  | "note_added"
  | "email_sent"
  | "call_logged"
  | "document_uploaded"
  | "address_updated"
  | "tier_changed"
  | "status_changed"
  | "product_edited"
  | "price_changed"
  | "stock_adjusted";

export interface ActivityItem {
  id: string;
  entityType: "customer" | "order" | "product";
  entityId: string;
  type: ActivityType;
  title: string;
  description?: string;
  user: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

// ─── API RESPONSE TYPES ───

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// ─── FILTER & SORT TYPES ───

export interface CustomerFilters {
  search?: string;
  type?: CustomerType;
  status?: CustomerStatus;
  lifecycleStage?: CustomerLifecycleStage;
  valueSegment?: CustomerValueSegment;
  minTotalSpent?: number;
  maxTotalSpent?: number;
  dateFrom?: string;
  dateTo?: string;
}

export interface OrderFilters {
  search?: string;
  status?: OrderStatus;
  customerId?: string;
  paymentStatus?: PaymentStatus;
  dateFrom?: string;
  dateTo?: string;
  minTotal?: number;
  maxTotal?: number;
}

export interface SortConfig {
  field: string;
  direction: "asc" | "desc";
}
