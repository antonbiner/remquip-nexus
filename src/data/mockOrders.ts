import type { Order, OrderItem, OrderNote, Shipment, Payment, Address } from "@/types/admin";
import { customers } from "./mockCustomers";

// ─── ORDER DATA ───

export const orders: Order[] = [
  {
    id: "ord-1",
    orderNumber: "RMQ-001234",
    customerId: "cust-1",
    status: "processing",
    items: [
      { id: "item-1-1", orderId: "ord-1", productId: "prod-1", sku: "1T15ZR-6", productName: "Air Spring W01-358 9781", productImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100", quantity: 2, unitPrice: 89.99, totalPrice: 179.98, metadata: {} },
      { id: "item-1-2", orderId: "ord-1", productId: "prod-2", sku: "SC3030LS", productName: "30/30 Long Stroke Brake Chamber", productImage: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=100", quantity: 2, unitPrice: 134.50, totalPrice: 269.00, metadata: {} },
      { id: "item-1-3", orderId: "ord-1", productId: "prod-3", sku: "4707Q-KIT", productName: "4707Q Brake Shoe Kit", productImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100", quantity: 4, unitPrice: 74.99, totalPrice: 299.96, metadata: {} },
      { id: "item-1-4", orderId: "ord-1", productId: "prod-4", sku: "ADB22X-PAD", productName: "ADB22X Air Disc Brake Pad Kit", productImage: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=100", quantity: 6, unitPrice: 156.00, totalPrice: 936.00, metadata: {} },
    ],
    subtotal: 2142.00,
    tax: 308.00,
    shippingCost: 0,
    discount: 0,
    total: 2450.00,
    currency: "CAD",
    billingAddress: { id: "addr-1-1", customerId: "cust-1", type: "billing", addressLine1: "456 Route de la Traverse", city: "Lévis", province: "QC", postalCode: "G6V 6N2", country: "CA", isDefault: true, createdAt: "2025-06-15" },
    shippingAddress: { id: "addr-1-2", customerId: "cust-1", type: "shipping", addressLine1: "456 Route de la Traverse", city: "Lévis", province: "QC", postalCode: "G6V 6N2", country: "CA", isDefault: true, createdAt: "2025-06-15" },
    paymentMethod: "invoice",
    paymentStatus: "pending",
    notes: [
      { id: "onote-1-1", orderId: "ord-1", date: "2026-03-10T09:15:00Z", user: "System", text: "Order placed", type: "system" },
      { id: "onote-1-2", orderId: "ord-1", date: "2026-03-10T10:30:00Z", user: "Marc Dupont", text: "Payment confirmed via invoice - Net 30 terms", type: "note" },
    ],
    shipments: [],
    payments: [
      { id: "pay-1-1", orderId: "ord-1", method: "invoice", status: "pending", amount: 2450.00, currency: "CAD", createdAt: "2026-03-10T09:15:00Z" },
    ],
    metadata: { source: "web", salesRep: "Marc Dupont" },
    createdAt: "2026-03-10T09:15:00Z",
    updatedAt: "2026-03-10T10:30:00Z",
  },
  {
    id: "ord-2",
    orderNumber: "RMQ-001233",
    customerId: "cust-2",
    status: "shipped",
    items: [
      { id: "item-2-1", orderId: "ord-2", productId: "prod-4", sku: "ADB22X-PAD", productName: "ADB22X Air Disc Brake Pad Kit", productImage: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=100", quantity: 2, unitPrice: 156.00, totalPrice: 312.00, metadata: {} },
      { id: "item-2-2", orderId: "ord-2", productId: "prod-1", sku: "1T15ZR-6", productName: "Air Spring W01-358 9781", productImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100", quantity: 8, unitPrice: 89.99, totalPrice: 719.92, metadata: {} },
    ],
    subtotal: 1652.19,
    tax: 238.31,
    shippingCost: 0,
    discount: 0,
    total: 1890.50,
    currency: "CAD",
    billingAddress: { id: "addr-2-1", customerId: "cust-2", type: "billing", addressLine1: "789 Industrial Pkwy", city: "Toronto", province: "ON", postalCode: "M3J 2P1", country: "CA", isDefault: true, createdAt: "2025-08-20" },
    shippingAddress: { id: "addr-2-2", customerId: "cust-2", type: "shipping", addressLine1: "789 Industrial Pkwy", city: "Toronto", province: "ON", postalCode: "M3J 2P1", country: "CA", isDefault: true, createdAt: "2025-08-20" },
    paymentMethod: "credit_card",
    paymentStatus: "paid",
    notes: [
      { id: "onote-2-1", orderId: "ord-2", date: "2026-03-09T08:00:00Z", user: "System", text: "Order placed", type: "system" },
      { id: "onote-2-2", orderId: "ord-2", date: "2026-03-09T08:01:00Z", user: "System", text: "Payment captured via Stripe", type: "system" },
      { id: "onote-2-3", orderId: "ord-2", date: "2026-03-09T14:00:00Z", user: "Julie Martin", text: "Shipped via Purolator", type: "status_change" },
    ],
    shipments: [
      { id: "ship-2-1", orderId: "ord-2", carrier: "Purolator", trackingNumber: "1Z999AA10123456784", status: "in_transit", shippedAt: "2026-03-09T14:00:00Z", estimatedDelivery: "2026-03-12" },
    ],
    payments: [
      { id: "pay-2-1", orderId: "ord-2", method: "credit_card", status: "paid", amount: 1890.50, currency: "CAD", transactionId: "ch_3OxampleStripe123", createdAt: "2026-03-09T08:01:00Z" },
    ],
    metadata: { source: "web" },
    createdAt: "2026-03-09T08:00:00Z",
    updatedAt: "2026-03-09T14:00:00Z",
  },
  {
    id: "ord-3",
    orderNumber: "RMQ-001232",
    customerId: "cust-3",
    status: "completed",
    items: [
      { id: "item-3-1", orderId: "ord-3", productId: "prod-3", sku: "4707Q-KIT", productName: "4707Q Brake Shoe Kit", productImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100", quantity: 8, unitPrice: 74.99, totalPrice: 599.92, metadata: {} },
      { id: "item-3-2", orderId: "ord-3", productId: "prod-5", sku: "3600AX", productName: "Brake Drum - Gunite 3600A", productImage: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=100", quantity: 4, unitPrice: 198.00, totalPrice: 792.00, metadata: {} },
      { id: "item-3-3", orderId: "ord-3", productId: "prod-6", sku: "4515Q-ASM", productName: "4515Q Brake Shoe Assembly Kit", productImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100", quantity: 6, unitPrice: 89.99, totalPrice: 539.94, metadata: {} },
    ],
    subtotal: 2798.25,
    tax: 401.75,
    shippingCost: 0,
    discount: 0,
    total: 3200.00,
    currency: "CAD",
    billingAddress: { id: "addr-3-1", customerId: "cust-3", type: "billing", addressLine1: "123 Rue du Commerce", city: "Québec", province: "QC", postalCode: "G1K 7P4", country: "CA", isDefault: true, createdAt: "2025-04-10" },
    shippingAddress: { id: "addr-3-2", customerId: "cust-3", type: "shipping", addressLine1: "123 Rue du Commerce", city: "Québec", province: "QC", postalCode: "G1K 7P4", country: "CA", isDefault: true, createdAt: "2025-04-10" },
    paymentMethod: "bank_transfer",
    paymentStatus: "paid",
    notes: [
      { id: "onote-3-1", orderId: "ord-3", date: "2026-03-08T07:30:00Z", user: "System", text: "Order placed", type: "system" },
      { id: "onote-3-2", orderId: "ord-3", date: "2026-03-08T11:00:00Z", user: "System", text: "Bank transfer received", type: "system" },
      { id: "onote-3-3", orderId: "ord-3", date: "2026-03-10T10:00:00Z", user: "System", text: "Delivered and confirmed", type: "status_change" },
    ],
    shipments: [
      { id: "ship-3-1", orderId: "ord-3", carrier: "Purolator", trackingNumber: "1Z999AA10123456785", status: "delivered", shippedAt: "2026-03-08T14:00:00Z", deliveredAt: "2026-03-10T10:00:00Z" },
    ],
    payments: [
      { id: "pay-3-1", orderId: "ord-3", method: "bank_transfer", status: "paid", amount: 3200.00, currency: "CAD", transactionId: "WIRE-2026-03-08-QTP", createdAt: "2026-03-08T11:00:00Z" },
    ],
    metadata: { source: "phone", salesRep: "Julie Martin" },
    createdAt: "2026-03-08T07:30:00Z",
    updatedAt: "2026-03-10T10:00:00Z",
  },
  {
    id: "ord-4",
    orderNumber: "RMQ-001231",
    customerId: "cust-4",
    status: "pending",
    items: [
      { id: "item-4-1", orderId: "ord-4", productId: "prod-5", sku: "3600AX", productName: "Brake Drum - Gunite 3600A", productImage: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=100", quantity: 1, unitPrice: 198.00, totalPrice: 198.00, metadata: {} },
    ],
    subtotal: 590.09,
    tax: 84.91,
    shippingCost: 25.00,
    discount: 0,
    total: 675.00,
    currency: "CAD",
    billingAddress: { id: "addr-4-1", customerId: "cust-4", type: "billing", addressLine1: "321 Harbour Rd", city: "Saint John", province: "NB", postalCode: "E2L 4Z6", country: "CA", isDefault: true, createdAt: "2025-10-01" },
    shippingAddress: { id: "addr-4-2", customerId: "cust-4", type: "shipping", addressLine1: "321 Harbour Rd", city: "Saint John", province: "NB", postalCode: "E2L 4Z6", country: "CA", isDefault: true, createdAt: "2025-10-01" },
    paymentMethod: "invoice",
    paymentStatus: "pending",
    notes: [
      { id: "onote-4-1", orderId: "ord-4", date: "2026-03-08T11:00:00Z", user: "System", text: "Order placed", type: "system" },
      { id: "onote-4-2", orderId: "ord-4", date: "2026-03-08T11:05:00Z", user: "System", text: "Awaiting payment confirmation", type: "system" },
    ],
    shipments: [],
    payments: [
      { id: "pay-4-1", orderId: "ord-4", method: "invoice", status: "pending", amount: 675.00, currency: "CAD", createdAt: "2026-03-08T11:00:00Z" },
    ],
    metadata: { source: "web" },
    createdAt: "2026-03-08T11:00:00Z",
    updatedAt: "2026-03-08T11:05:00Z",
  },
  {
    id: "ord-5",
    orderNumber: "RMQ-001230",
    customerId: "cust-5",
    status: "completed",
    items: [
      { id: "item-5-1", orderId: "ord-5", productId: "prod-6", sku: "4515Q-ASM", productName: "4515Q Brake Shoe Assembly Kit", productImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100", quantity: 3, unitPrice: 89.99, totalPrice: 269.97, metadata: {} },
      { id: "item-5-2", orderId: "ord-5", productId: "prod-1", sku: "1T15ZR-6", productName: "Air Spring W01-358 9781", productImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100", quantity: 4, unitPrice: 89.99, totalPrice: 359.96, metadata: {} },
    ],
    subtotal: 979.82,
    tax: 140.18,
    shippingCost: 0,
    discount: 0,
    total: 1120.00,
    currency: "CAD",
    billingAddress: { id: "addr-5-1", customerId: "cust-5", type: "billing", addressLine1: "555 Main St W", city: "Saskatoon", province: "SK", postalCode: "S7M 0W6", country: "CA", isDefault: true, createdAt: "2025-05-20" },
    shippingAddress: { id: "addr-5-2", customerId: "cust-5", type: "shipping", addressLine1: "555 Main St W", city: "Saskatoon", province: "SK", postalCode: "S7M 0W6", country: "CA", isDefault: true, createdAt: "2025-05-20" },
    paymentMethod: "credit_card",
    paymentStatus: "paid",
    notes: [
      { id: "onote-5-1", orderId: "ord-5", date: "2026-03-07T09:00:00Z", user: "System", text: "Order placed", type: "system" },
      { id: "onote-5-2", orderId: "ord-5", date: "2026-03-08T16:00:00Z", user: "System", text: "Delivered", type: "status_change" },
    ],
    shipments: [
      { id: "ship-5-1", orderId: "ord-5", carrier: "Canada Post", trackingNumber: "1Z999AA10123456786", status: "delivered", shippedAt: "2026-03-07T14:00:00Z", deliveredAt: "2026-03-08T16:00:00Z" },
    ],
    payments: [
      { id: "pay-5-1", orderId: "ord-5", method: "credit_card", status: "paid", amount: 1120.00, currency: "CAD", transactionId: "ch_3OxampleStripe456", createdAt: "2026-03-07T09:00:00Z" },
    ],
    metadata: { source: "web" },
    createdAt: "2026-03-07T09:00:00Z",
    updatedAt: "2026-03-08T16:00:00Z",
  },
  {
    id: "ord-6",
    orderNumber: "RMQ-001229",
    customerId: "cust-7",
    status: "processing",
    items: [
      { id: "item-6-1", orderId: "ord-6", productId: "prod-1", sku: "1T15ZR-6", productName: "Air Spring W01-358 9781", productImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100", quantity: 12, unitPrice: 89.99, totalPrice: 1079.88, metadata: {} },
      { id: "item-6-2", orderId: "ord-6", productId: "prod-2", sku: "SC3030LS", productName: "30/30 Long Stroke Brake Chamber", productImage: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=100", quantity: 8, unitPrice: 134.50, totalPrice: 1076.00, metadata: {} },
      { id: "item-6-3", orderId: "ord-6", productId: "prod-4", sku: "ADB22X-PAD", productName: "ADB22X Air Disc Brake Pad Kit", productImage: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=100", quantity: 6, unitPrice: 156.00, totalPrice: 936.00, metadata: {} },
    ],
    subtotal: 3631.58,
    tax: 518.42,
    shippingCost: 0,
    discount: 0,
    total: 4150.00,
    currency: "CAD",
    billingAddress: { id: "addr-7-1", customerId: "cust-7", type: "billing", addressLine1: "888 Terminal Ave", city: "Vancouver", province: "BC", postalCode: "V6A 4G2", country: "CA", isDefault: true, createdAt: "2025-03-01" },
    shippingAddress: { id: "addr-7-2", customerId: "cust-7", type: "shipping", addressLine1: "888 Terminal Ave", city: "Vancouver", province: "BC", postalCode: "V6A 4G2", country: "CA", isDefault: true, createdAt: "2025-03-01" },
    paymentMethod: "invoice",
    paymentStatus: "pending",
    notes: [
      { id: "onote-6-1", orderId: "ord-6", date: "2026-03-06T15:00:00Z", user: "System", text: "Order placed", type: "system" },
      { id: "onote-6-2", orderId: "ord-6", date: "2026-03-07T09:00:00Z", user: "Julie Martin", text: "Large order - priority processing", type: "note" },
    ],
    shipments: [],
    payments: [
      { id: "pay-6-1", orderId: "ord-6", method: "invoice", status: "pending", amount: 4150.00, currency: "CAD", createdAt: "2026-03-06T15:00:00Z" },
    ],
    metadata: { source: "phone", salesRep: "Julie Martin" },
    createdAt: "2026-03-06T15:00:00Z",
    updatedAt: "2026-03-07T09:00:00Z",
  },
  {
    id: "ord-7",
    orderNumber: "RMQ-001220",
    customerId: "cust-1",
    status: "completed",
    items: [
      { id: "item-7-1", orderId: "ord-7", productId: "prod-3", sku: "4707Q-KIT", productName: "4707Q Brake Shoe Kit", productImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100", quantity: 6, unitPrice: 74.99, totalPrice: 449.94, metadata: {} },
      { id: "item-7-2", orderId: "ord-7", productId: "prod-1", sku: "1T15ZR-6", productName: "Air Spring W01-358 9781", productImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100", quantity: 6, unitPrice: 89.99, totalPrice: 539.94, metadata: {} },
    ],
    subtotal: 1654.39,
    tax: 235.61,
    shippingCost: 0,
    discount: 0,
    total: 1890.00,
    currency: "CAD",
    billingAddress: { id: "addr-1-1", customerId: "cust-1", type: "billing", addressLine1: "456 Route de la Traverse", city: "Lévis", province: "QC", postalCode: "G6V 6N2", country: "CA", isDefault: true, createdAt: "2025-06-15" },
    shippingAddress: { id: "addr-1-2", customerId: "cust-1", type: "shipping", addressLine1: "456 Route de la Traverse", city: "Lévis", province: "QC", postalCode: "G6V 6N2", country: "CA", isDefault: true, createdAt: "2025-06-15" },
    paymentMethod: "invoice",
    paymentStatus: "paid",
    notes: [
      { id: "onote-7-1", orderId: "ord-7", date: "2026-02-28T11:20:00Z", user: "System", text: "Order placed", type: "system" },
      { id: "onote-7-2", orderId: "ord-7", date: "2026-03-05T14:30:00Z", user: "System", text: "Invoice paid", type: "system" },
    ],
    shipments: [
      { id: "ship-7-1", orderId: "ord-7", carrier: "Purolator", trackingNumber: "1Z999AA10123456790", status: "delivered", shippedAt: "2026-02-28T16:00:00Z", deliveredAt: "2026-03-01T11:00:00Z" },
    ],
    payments: [
      { id: "pay-7-1", orderId: "ord-7", method: "invoice", status: "paid", amount: 1890.00, currency: "CAD", createdAt: "2026-03-05T14:30:00Z" },
    ],
    metadata: { source: "web" },
    createdAt: "2026-02-28T11:20:00Z",
    updatedAt: "2026-03-05T14:30:00Z",
  },
  {
    id: "ord-8",
    orderNumber: "RMQ-001198",
    customerId: "cust-1",
    status: "completed",
    items: [
      { id: "item-8-1", orderId: "ord-8", productId: "prod-2", sku: "SC3030LS", productName: "30/30 Long Stroke Brake Chamber", productImage: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=100", quantity: 10, unitPrice: 134.50, totalPrice: 1345.00, metadata: {} },
      { id: "item-8-2", orderId: "ord-8", productId: "prod-4", sku: "ADB22X-PAD", productName: "ADB22X Air Disc Brake Pad Kit", productImage: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=100", quantity: 4, unitPrice: 156.00, totalPrice: 624.00, metadata: {} },
    ],
    subtotal: 2800.00,
    tax: 400.00,
    shippingCost: 0,
    discount: 0,
    total: 3200.00,
    currency: "CAD",
    billingAddress: { id: "addr-1-1", customerId: "cust-1", type: "billing", addressLine1: "456 Route de la Traverse", city: "Lévis", province: "QC", postalCode: "G6V 6N2", country: "CA", isDefault: true, createdAt: "2025-06-15" },
    shippingAddress: { id: "addr-1-2", customerId: "cust-1", type: "shipping", addressLine1: "456 Route de la Traverse", city: "Lévis", province: "QC", postalCode: "G6V 6N2", country: "CA", isDefault: true, createdAt: "2025-06-15" },
    paymentMethod: "invoice",
    paymentStatus: "paid",
    notes: [
      { id: "onote-8-1", orderId: "ord-8", date: "2026-02-15T08:30:00Z", user: "System", text: "Order placed", type: "system" },
    ],
    shipments: [
      { id: "ship-8-1", orderId: "ord-8", carrier: "Purolator", trackingNumber: "1Z999AA10123456791", status: "delivered", shippedAt: "2026-02-15T14:00:00Z", deliveredAt: "2026-02-17T10:00:00Z" },
    ],
    payments: [
      { id: "pay-8-1", orderId: "ord-8", method: "invoice", status: "paid", amount: 3200.00, currency: "CAD", createdAt: "2026-02-20T09:00:00Z" },
    ],
    metadata: { source: "web" },
    createdAt: "2026-02-15T08:30:00Z",
    updatedAt: "2026-02-20T09:00:00Z",
  },
  {
    id: "ord-9",
    orderNumber: "RMQ-001215",
    customerId: "cust-3",
    status: "completed",
    items: [
      { id: "item-9-1", orderId: "ord-9", productId: "prod-1", sku: "1T15ZR-6", productName: "Air Spring W01-358 9781", productImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100", quantity: 20, unitPrice: 76.49, totalPrice: 1529.80, metadata: { discountApplied: true } },
      { id: "item-9-2", orderId: "ord-9", productId: "prod-2", sku: "SC3030LS", productName: "30/30 Long Stroke Brake Chamber", productImage: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=100", quantity: 12, unitPrice: 114.33, totalPrice: 1371.96, metadata: { discountApplied: true } },
    ],
    subtotal: 3936.84,
    tax: 563.16,
    shippingCost: 0,
    discount: 0,
    total: 4500.00,
    currency: "CAD",
    billingAddress: { id: "addr-3-1", customerId: "cust-3", type: "billing", addressLine1: "123 Rue du Commerce", city: "Québec", province: "QC", postalCode: "G1K 7P4", country: "CA", isDefault: true, createdAt: "2025-04-10" },
    shippingAddress: { id: "addr-3-3", customerId: "cust-3", type: "shipping", addressLine1: "500 Industrial Park", city: "Trois-Rivières", province: "QC", postalCode: "G9A 5C1", country: "CA", isDefault: false, createdAt: "2025-07-22" },
    paymentMethod: "bank_transfer",
    paymentStatus: "paid",
    notes: [
      { id: "onote-9-1", orderId: "ord-9", date: "2026-02-25T09:15:00Z", user: "System", text: "Order placed - Distributor pricing applied", type: "system" },
    ],
    shipments: [
      { id: "ship-9-1", orderId: "ord-9", carrier: "Day & Ross", trackingNumber: "DR2026022500123", status: "delivered", shippedAt: "2026-02-25T14:00:00Z", deliveredAt: "2026-02-27T11:00:00Z" },
    ],
    payments: [
      { id: "pay-9-1", orderId: "ord-9", method: "bank_transfer", status: "paid", amount: 4500.00, currency: "CAD", transactionId: "WIRE-2026-02-25-QTP2", createdAt: "2026-02-25T16:00:00Z" },
    ],
    metadata: { source: "phone", salesRep: "Julie Martin", pricingTier: "distributor" },
    createdAt: "2026-02-25T09:15:00Z",
    updatedAt: "2026-02-27T11:00:00Z",
  },
  {
    id: "ord-10",
    orderNumber: "RMQ-001225",
    customerId: "cust-8",
    status: "shipped",
    items: [
      { id: "item-10-1", orderId: "ord-10", productId: "prod-1", sku: "1T15ZR-6", productName: "Air Spring W01-358 9781", productImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100", quantity: 30, unitPrice: 58.49, totalPrice: 1754.70, metadata: { discountApplied: true } },
      { id: "item-10-2", orderId: "ord-10", productId: "prod-2", sku: "SC3030LS", productName: "30/30 Long Stroke Brake Chamber", productImage: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=100", quantity: 20, unitPrice: 87.43, totalPrice: 1748.60, metadata: { discountApplied: true } },
      { id: "item-10-3", orderId: "ord-10", productId: "prod-4", sku: "ADB22X-PAD", productName: "ADB22X Air Disc Brake Pad Kit", productImage: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=100", quantity: 16, unitPrice: 101.40, totalPrice: 1622.40, metadata: { discountApplied: true } },
    ],
    subtotal: 7394.74,
    tax: 1055.26,
    shippingCost: 0,
    discount: 0,
    total: 8450.00,
    currency: "CAD",
    billingAddress: { id: "addr-8-1", customerId: "cust-8", type: "billing", addressLine1: "1200 Industrial Way", city: "Edmonton", province: "AB", postalCode: "T5J 1V8", country: "CA", isDefault: true, createdAt: "2024-11-01" },
    shippingAddress: { id: "addr-8-3", customerId: "cust-8", type: "shipping", addressLine1: "450 Distribution Ctr", city: "Calgary", province: "AB", postalCode: "T2P 3N4", country: "CA", isDefault: false, createdAt: "2025-02-15" },
    paymentMethod: "bank_transfer",
    paymentStatus: "paid",
    notes: [
      { id: "onote-10-1", orderId: "ord-10", date: "2026-03-05T08:45:00Z", user: "System", text: "Order placed - Enterprise pricing applied", type: "system" },
      { id: "onote-10-2", orderId: "ord-10", date: "2026-03-05T10:00:00Z", user: "Marc Dupont", text: "Priority processing for enterprise customer", type: "note" },
    ],
    shipments: [
      { id: "ship-10-1", orderId: "ord-10", carrier: "Day & Ross", trackingNumber: "DR2026030500456", status: "in_transit", shippedAt: "2026-03-05T15:00:00Z", estimatedDelivery: "2026-03-08" },
    ],
    payments: [
      { id: "pay-10-1", orderId: "ord-10", method: "bank_transfer", status: "paid", amount: 8450.00, currency: "CAD", transactionId: "WIRE-2026-03-05-NL", createdAt: "2026-03-05T11:00:00Z" },
    ],
    metadata: { source: "phone", salesRep: "Marc Dupont", pricingTier: "enterprise" },
    createdAt: "2026-03-05T08:45:00Z",
    updatedAt: "2026-03-05T15:00:00Z",
  },
];

// ─── HELPER FUNCTIONS ───

export function getOrderById(id: string): Order | undefined {
  return orders.find((o) => o.id === id);
}

export function getOrderByNumber(orderNumber: string): Order | undefined {
  return orders.find((o) => o.orderNumber === orderNumber);
}

export function getOrdersByCustomerId(customerId: string): Order[] {
  return orders.filter((o) => o.customerId === customerId).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getOrderWithCustomer(orderId: string): Order | undefined {
  const order = getOrderById(orderId);
  if (!order) return undefined;
  
  const customer = customers.find((c) => c.id === order.customerId);
  return { ...order, customer };
}

export function getOrderStatusCounts(): Record<string, number> {
  return orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

export function getCustomerOrderSummary(customerId: string): {
  totalOrders: number;
  totalSpent: number;
  avgOrderValue: number;
  lastOrderDate: string | null;
  ordersByStatus: Record<string, number>;
} {
  const customerOrders = getOrdersByCustomerId(customerId);
  const totalSpent = customerOrders.reduce((sum, o) => sum + o.total, 0);
  const ordersByStatus = customerOrders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return {
    totalOrders: customerOrders.length,
    totalSpent,
    avgOrderValue: customerOrders.length > 0 ? totalSpent / customerOrders.length : 0,
    lastOrderDate: customerOrders.length > 0 ? customerOrders[0].createdAt : null,
    ordersByStatus,
  };
}
