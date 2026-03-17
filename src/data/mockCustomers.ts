import type { Customer, CustomerStats, ActivityItem, CustomerNote, Address, CustomerDocument } from "@/types/admin";

// ─── CUSTOMER DATA ───

export const customers: Customer[] = [
  {
    id: "cust-1",
    companyName: "Groupe Transport Lévis",
    firstName: "Jean-Pierre",
    lastName: "Lavoie",
    email: "jp@gtl.ca",
    phone: "+1 418 555 0101",
    taxId: "QC-12345678",
    customerType: "wholesale",
    status: "active",
    lifecycleStage: "active",
    valueSegment: "high",
    creditLimit: 50000,
    paymentTerms: "Net 30",
    addresses: [
      { id: "addr-1-1", customerId: "cust-1", type: "billing", addressLine1: "456 Route de la Traverse", city: "Lévis", province: "QC", postalCode: "G6V 6N2", country: "CA", isDefault: true, createdAt: "2025-06-15" },
      { id: "addr-1-2", customerId: "cust-1", type: "shipping", addressLine1: "456 Route de la Traverse", city: "Lévis", province: "QC", postalCode: "G6V 6N2", country: "CA", isDefault: true, createdAt: "2025-06-15" },
      { id: "addr-1-3", customerId: "cust-1", type: "shipping", addressLine1: "789 Warehouse Blvd", city: "Montréal", province: "QC", postalCode: "H2X 1Y4", country: "CA", isDefault: false, createdAt: "2025-09-10" },
    ],
    notes: [
      { id: "note-1-1", customerId: "cust-1", date: "2026-03-01", user: "Marc Dupont", text: "Approved for 30-day net payment terms. Key decision maker.", type: "note" },
      { id: "note-1-2", customerId: "cust-1", date: "2026-02-15", user: "Julie Martin", text: "Called about bulk order discount. Quoted 15% for orders over $10k.", type: "call" },
      { id: "note-1-3", customerId: "cust-1", date: "2025-06-15", user: "System", text: "Account created via wholesale application", type: "system" },
    ],
    documents: [
      { id: "doc-1-1", customerId: "cust-1", name: "Wholesale Agreement 2025", type: "contract", url: "/documents/contract-gtl-2025.pdf", size: 245000, uploadedBy: "Marc Dupont", uploadedAt: "2025-06-15" },
      { id: "doc-1-2", customerId: "cust-1", name: "Q1 2026 Invoice", type: "invoice", url: "/documents/invoice-gtl-q1-2026.pdf", size: 128000, uploadedBy: "System", uploadedAt: "2026-03-10" },
    ],
    metadata: { preferredContact: "email", source: "trade_show", salesRep: "Marc Dupont" },
    createdAt: "2025-06-15",
    updatedAt: "2026-03-10",
  },
  {
    id: "cust-2",
    companyName: "Fleet Services Ontario",
    firstName: "Sarah",
    lastName: "Mitchell",
    email: "sarah@fso.com",
    phone: "+1 416 555 0202",
    taxId: "ON-87654321",
    customerType: "wholesale",
    status: "active",
    lifecycleStage: "active",
    valueSegment: "medium",
    creditLimit: 25000,
    paymentTerms: "Net 15",
    addresses: [
      { id: "addr-2-1", customerId: "cust-2", type: "billing", addressLine1: "789 Industrial Pkwy", city: "Toronto", province: "ON", postalCode: "M3J 2P1", country: "CA", isDefault: true, createdAt: "2025-08-20" },
      { id: "addr-2-2", customerId: "cust-2", type: "shipping", addressLine1: "789 Industrial Pkwy", city: "Toronto", province: "ON", postalCode: "M3J 2P1", country: "CA", isDefault: true, createdAt: "2025-08-20" },
    ],
    notes: [
      { id: "note-2-1", customerId: "cust-2", date: "2026-03-05", user: "Julie Martin", text: "Interested in expanding to brake components. Follow up next month.", type: "note" },
      { id: "note-2-2", customerId: "cust-2", date: "2025-08-20", user: "System", text: "Account created", type: "system" },
    ],
    documents: [],
    metadata: { preferredContact: "phone", source: "referral" },
    createdAt: "2025-08-20",
    updatedAt: "2026-03-09",
  },
  {
    id: "cust-3",
    companyName: "Québec Truck Parts Inc.",
    firstName: "Marc",
    lastName: "Tremblay",
    email: "marc@qtp.ca",
    phone: "+1 418 555 0303",
    taxId: "QC-99887766",
    customerType: "distributor",
    status: "active",
    lifecycleStage: "active",
    valueSegment: "high",
    creditLimit: 100000,
    paymentTerms: "Net 45",
    addresses: [
      { id: "addr-3-1", customerId: "cust-3", type: "billing", addressLine1: "123 Rue du Commerce", city: "Québec", province: "QC", postalCode: "G1K 7P4", country: "CA", isDefault: true, createdAt: "2025-04-10" },
      { id: "addr-3-2", customerId: "cust-3", type: "shipping", addressLine1: "123 Rue du Commerce", city: "Québec", province: "QC", postalCode: "G1K 7P4", country: "CA", isDefault: true, createdAt: "2025-04-10" },
      { id: "addr-3-3", customerId: "cust-3", type: "shipping", addressLine1: "500 Industrial Park", city: "Trois-Rivières", province: "QC", postalCode: "G9A 5C1", country: "CA", isDefault: false, createdAt: "2025-07-22" },
    ],
    notes: [
      { id: "note-3-1", customerId: "cust-3", date: "2026-01-15", user: "Julie Martin", text: "Upgraded to Distributor tier based on volume. New pricing applied.", type: "note" },
      { id: "note-3-2", customerId: "cust-3", date: "2025-11-20", user: "Marc Dupont", text: "Discussed exclusive regional distribution. Needs board approval.", type: "call" },
      { id: "note-3-3", customerId: "cust-3", date: "2025-04-10", user: "System", text: "Account created", type: "system" },
    ],
    documents: [
      { id: "doc-3-1", customerId: "cust-3", name: "Distributor Agreement", type: "contract", url: "/documents/contract-qtp-dist.pdf", size: 312000, uploadedBy: "Julie Martin", uploadedAt: "2026-01-15" },
    ],
    metadata: { preferredContact: "email", source: "cold_call", salesRep: "Julie Martin", region: "Quebec" },
    createdAt: "2025-04-10",
    updatedAt: "2026-03-08",
  },
  {
    id: "cust-4",
    companyName: "Maritime Heavy Hauling",
    firstName: "David",
    lastName: "Fraser",
    email: "david@mhh.ca",
    phone: "+1 506 555 0404",
    customerType: "fleet",
    status: "active",
    lifecycleStage: "active",
    valueSegment: "low",
    paymentTerms: "Due on Receipt",
    addresses: [
      { id: "addr-4-1", customerId: "cust-4", type: "billing", addressLine1: "321 Harbour Rd", city: "Saint John", province: "NB", postalCode: "E2L 4Z6", country: "CA", isDefault: true, createdAt: "2025-10-01" },
      { id: "addr-4-2", customerId: "cust-4", type: "shipping", addressLine1: "321 Harbour Rd", city: "Saint John", province: "NB", postalCode: "E2L 4Z6", country: "CA", isDefault: true, createdAt: "2025-10-01" },
    ],
    notes: [
      { id: "note-4-1", customerId: "cust-4", date: "2026-03-08", user: "System", text: "Order RMQ-001231 placed", type: "system" },
      { id: "note-4-2", customerId: "cust-4", date: "2025-10-01", user: "System", text: "Account created", type: "system" },
    ],
    documents: [],
    metadata: { preferredContact: "phone", source: "website", fleetSize: 12 },
    createdAt: "2025-10-01",
    updatedAt: "2026-03-08",
  },
  {
    id: "cust-5",
    companyName: "Prairie Fleet Maintenance",
    firstName: "Lisa",
    lastName: "Chen",
    email: "lisa@pfm.ca",
    phone: "+1 306 555 0505",
    taxId: "SK-11223344",
    customerType: "fleet",
    status: "active",
    lifecycleStage: "active",
    valueSegment: "medium",
    creditLimit: 15000,
    paymentTerms: "Net 15",
    addresses: [
      { id: "addr-5-1", customerId: "cust-5", type: "billing", addressLine1: "555 Main St W", city: "Saskatoon", province: "SK", postalCode: "S7M 0W6", country: "CA", isDefault: true, createdAt: "2025-05-20" },
      { id: "addr-5-2", customerId: "cust-5", type: "shipping", addressLine1: "555 Main St W", city: "Saskatoon", province: "SK", postalCode: "S7M 0W6", country: "CA", isDefault: true, createdAt: "2025-05-20" },
    ],
    notes: [
      { id: "note-5-1", customerId: "cust-5", date: "2026-02-01", user: "Marc Dupont", text: "Loyal customer - consider tier upgrade to wholesale.", type: "note" },
      { id: "note-5-2", customerId: "cust-5", date: "2025-05-20", user: "System", text: "Account created", type: "system" },
    ],
    documents: [],
    metadata: { preferredContact: "email", source: "google_ads", fleetSize: 28 },
    createdAt: "2025-05-20",
    updatedAt: "2026-03-07",
  },
  {
    id: "cust-6",
    companyName: "Atlantic Parts & Service",
    firstName: "Robert",
    lastName: "Murphy",
    email: "rob@aps.ca",
    phone: "+1 902 555 0707",
    customerType: "fleet",
    status: "inactive",
    lifecycleStage: "at-risk",
    valueSegment: "low",
    paymentTerms: "Due on Receipt",
    addresses: [
      { id: "addr-6-1", customerId: "cust-6", type: "billing", addressLine1: "99 Harbour Dr", city: "Halifax", province: "NS", postalCode: "B3H 2Y8", country: "CA", isDefault: true, createdAt: "2025-11-15" },
    ],
    notes: [
      { id: "note-6-1", customerId: "cust-6", date: "2026-02-20", user: "System", text: "Marked inactive - no activity 30+ days", type: "system" },
      { id: "note-6-2", customerId: "cust-6", date: "2025-11-15", user: "System", text: "Account created", type: "system" },
    ],
    documents: [],
    metadata: { preferredContact: "phone", source: "website" },
    createdAt: "2025-11-15",
    updatedAt: "2026-02-20",
  },
  {
    id: "cust-7",
    companyName: "BC Trucking Solutions",
    firstName: "Michael",
    lastName: "Wong",
    email: "ops@bcts.ca",
    phone: "+1 604 555 0606",
    taxId: "BC-55667788",
    customerType: "wholesale",
    status: "active",
    lifecycleStage: "active",
    valueSegment: "high",
    creditLimit: 35000,
    paymentTerms: "Net 30",
    addresses: [
      { id: "addr-7-1", customerId: "cust-7", type: "billing", addressLine1: "888 Terminal Ave", city: "Vancouver", province: "BC", postalCode: "V6A 4G2", country: "CA", isDefault: true, createdAt: "2025-03-01" },
      { id: "addr-7-2", customerId: "cust-7", type: "shipping", addressLine1: "888 Terminal Ave", city: "Vancouver", province: "BC", postalCode: "V6A 4G2", country: "CA", isDefault: true, createdAt: "2025-03-01" },
    ],
    notes: [
      { id: "note-7-1", customerId: "cust-7", date: "2026-03-06", user: "System", text: "Order RMQ-001229 placed - large air spring order", type: "system" },
      { id: "note-7-2", customerId: "cust-7", date: "2025-03-01", user: "System", text: "Account created", type: "system" },
    ],
    documents: [],
    metadata: { preferredContact: "email", source: "trade_show", salesRep: "Julie Martin" },
    createdAt: "2025-03-01",
    updatedAt: "2026-03-06",
  },
  {
    id: "cust-8",
    companyName: "Northern Logistics Ltd",
    firstName: "Emma",
    lastName: "Thompson",
    email: "emma@northernlog.ca",
    phone: "+1 780 555 0808",
    taxId: "AB-44332211",
    customerType: "enterprise",
    status: "active",
    lifecycleStage: "active",
    valueSegment: "high",
    creditLimit: 150000,
    paymentTerms: "Net 60",
    addresses: [
      { id: "addr-8-1", customerId: "cust-8", type: "billing", addressLine1: "1200 Industrial Way", city: "Edmonton", province: "AB", postalCode: "T5J 1V8", country: "CA", isDefault: true, createdAt: "2024-11-01" },
      { id: "addr-8-2", customerId: "cust-8", type: "shipping", addressLine1: "1200 Industrial Way", city: "Edmonton", province: "AB", postalCode: "T5J 1V8", country: "CA", isDefault: true, createdAt: "2024-11-01" },
      { id: "addr-8-3", customerId: "cust-8", type: "shipping", addressLine1: "450 Distribution Ctr", city: "Calgary", province: "AB", postalCode: "T2P 3N4", country: "CA", isDefault: false, createdAt: "2025-02-15" },
    ],
    notes: [
      { id: "note-8-1", customerId: "cust-8", date: "2026-02-28", user: "Marc Dupont", text: "Annual contract renewal discussion. Very satisfied with service.", type: "call" },
      { id: "note-8-2", customerId: "cust-8", date: "2025-12-01", user: "Julie Martin", text: "Enterprise pricing approved by management.", type: "note" },
      { id: "note-8-3", customerId: "cust-8", date: "2024-11-01", user: "System", text: "Account created - enterprise referral", type: "system" },
    ],
    documents: [
      { id: "doc-8-1", customerId: "cust-8", name: "Enterprise Master Agreement", type: "contract", url: "/documents/contract-nl-enterprise.pdf", size: 456000, uploadedBy: "Marc Dupont", uploadedAt: "2024-11-01" },
      { id: "doc-8-2", customerId: "cust-8", name: "2025 Volume Commitment", type: "contract", url: "/documents/volume-nl-2025.pdf", size: 189000, uploadedBy: "Julie Martin", uploadedAt: "2025-01-05" },
    ],
    metadata: { preferredContact: "email", source: "enterprise_sales", salesRep: "Marc Dupont", accountManager: "Julie Martin" },
    createdAt: "2024-11-01",
    updatedAt: "2026-02-28",
  },
];

// ─── CUSTOMER STATS (derived from orders) ───

export const customerStats: Record<string, CustomerStats> = {
  "cust-1": {
    totalOrders: 12,
    totalSpent: 28400,
    avgOrderValue: 2366.67,
    lifetimeValue: 34080, // with projected future value
    lastOrderDate: "2026-03-10",
    daysSinceLastOrder: 7,
    orderFrequency: 1.3,
    returnRate: 2.1,
  },
  "cust-2": {
    totalOrders: 8,
    totalSpent: 15200,
    avgOrderValue: 1900,
    lifetimeValue: 18240,
    lastOrderDate: "2026-03-09",
    daysSinceLastOrder: 8,
    orderFrequency: 1.0,
    returnRate: 0,
  },
  "cust-3": {
    totalOrders: 22,
    totalSpent: 54800,
    avgOrderValue: 2490.91,
    lifetimeValue: 71240,
    lastOrderDate: "2026-03-08",
    daysSinceLastOrder: 9,
    orderFrequency: 1.9,
    returnRate: 1.5,
  },
  "cust-4": {
    totalOrders: 5,
    totalSpent: 8900,
    avgOrderValue: 1780,
    lifetimeValue: 10680,
    lastOrderDate: "2026-03-08",
    daysSinceLastOrder: 9,
    orderFrequency: 0.8,
    returnRate: 0,
  },
  "cust-5": {
    totalOrders: 15,
    totalSpent: 32100,
    avgOrderValue: 2140,
    lifetimeValue: 41730,
    lastOrderDate: "2026-03-07",
    daysSinceLastOrder: 10,
    orderFrequency: 1.5,
    returnRate: 0.5,
  },
  "cust-6": {
    totalOrders: 2,
    totalSpent: 1450,
    avgOrderValue: 725,
    lifetimeValue: 1450,
    lastOrderDate: "2026-01-20",
    daysSinceLastOrder: 56,
    orderFrequency: 0.3,
    returnRate: 0,
  },
  "cust-7": {
    totalOrders: 18,
    totalSpent: 42500,
    avgOrderValue: 2361.11,
    lifetimeValue: 55250,
    lastOrderDate: "2026-03-06",
    daysSinceLastOrder: 11,
    orderFrequency: 1.5,
    returnRate: 1.8,
  },
  "cust-8": {
    totalOrders: 45,
    totalSpent: 156000,
    avgOrderValue: 3466.67,
    lifetimeValue: 218400,
    lastOrderDate: "2026-03-05",
    daysSinceLastOrder: 12,
    orderFrequency: 2.8,
    returnRate: 0.8,
  },
};

// ─── CUSTOMER ACTIVITY TIMELINE ───

export const customerActivities: Record<string, ActivityItem[]> = {
  "cust-1": [
    { id: "act-1-1", entityType: "customer", entityId: "cust-1", type: "order_placed", title: "Order Placed", description: "Order RMQ-001234 for $2,450.00", user: "System", timestamp: "2026-03-10T09:15:00Z" },
    { id: "act-1-2", entityType: "customer", entityId: "cust-1", type: "payment_received", title: "Payment Received", description: "Invoice payment of $1,890.00 for RMQ-001220", user: "System", timestamp: "2026-03-05T14:30:00Z" },
    { id: "act-1-3", entityType: "customer", entityId: "cust-1", type: "note_added", title: "Note Added", description: "Approved for 30-day net payment terms", user: "Marc Dupont", timestamp: "2026-03-01T10:00:00Z" },
    { id: "act-1-4", entityType: "customer", entityId: "cust-1", type: "order_placed", title: "Order Placed", description: "Order RMQ-001220 for $1,890.00", user: "System", timestamp: "2026-02-28T11:20:00Z" },
    { id: "act-1-5", entityType: "customer", entityId: "cust-1", type: "call_logged", title: "Call Logged", description: "Discussed bulk order discount", user: "Julie Martin", timestamp: "2026-02-15T15:45:00Z" },
    { id: "act-1-6", entityType: "customer", entityId: "cust-1", type: "order_placed", title: "Order Placed", description: "Order RMQ-001198 for $3,200.00", user: "System", timestamp: "2026-02-15T08:30:00Z" },
    { id: "act-1-7", entityType: "customer", entityId: "cust-1", type: "document_uploaded", title: "Document Uploaded", description: "Q1 2026 Invoice uploaded", user: "System", timestamp: "2026-02-01T09:00:00Z" },
  ],
  "cust-3": [
    { id: "act-3-1", entityType: "customer", entityId: "cust-3", type: "order_placed", title: "Order Placed", description: "Order RMQ-001232 for $3,200.00", user: "System", timestamp: "2026-03-08T07:30:00Z" },
    { id: "act-3-2", entityType: "customer", entityId: "cust-3", type: "order_placed", title: "Order Placed", description: "Order RMQ-001215 for $4,500.00", user: "System", timestamp: "2026-02-25T09:15:00Z" },
    { id: "act-3-3", entityType: "customer", entityId: "cust-3", type: "tier_changed", title: "Tier Upgraded", description: "Upgraded from Wholesale to Distributor tier", user: "Julie Martin", timestamp: "2026-01-15T11:00:00Z" },
    { id: "act-3-4", entityType: "customer", entityId: "cust-3", type: "document_uploaded", title: "Document Uploaded", description: "Distributor Agreement signed", user: "Julie Martin", timestamp: "2026-01-15T10:30:00Z" },
    { id: "act-3-5", entityType: "customer", entityId: "cust-3", type: "call_logged", title: "Call Logged", description: "Discussed exclusive regional distribution", user: "Marc Dupont", timestamp: "2025-11-20T14:00:00Z" },
  ],
  "cust-8": [
    { id: "act-8-1", entityType: "customer", entityId: "cust-8", type: "call_logged", title: "Call Logged", description: "Annual contract renewal discussion", user: "Marc Dupont", timestamp: "2026-02-28T10:00:00Z" },
    { id: "act-8-2", entityType: "customer", entityId: "cust-8", type: "order_placed", title: "Order Placed", description: "Order RMQ-001225 for $8,450.00", user: "System", timestamp: "2026-03-05T08:45:00Z" },
    { id: "act-8-3", entityType: "customer", entityId: "cust-8", type: "payment_received", title: "Payment Received", description: "Wire transfer of $12,500.00", user: "System", timestamp: "2026-02-20T16:30:00Z" },
    { id: "act-8-4", entityType: "customer", entityId: "cust-8", type: "address_updated", title: "Address Added", description: "Calgary distribution center added", user: "Emma Thompson", timestamp: "2025-02-15T09:00:00Z" },
  ],
};

// ─── HELPER FUNCTIONS ───

export function getCustomerById(id: string): Customer | undefined {
  return customers.find((c) => c.id === id);
}

export function getCustomerStats(id: string): CustomerStats | undefined {
  return customerStats[id];
}

export function getCustomerActivities(id: string): ActivityItem[] {
  return customerActivities[id] || [];
}

export function getCustomerFullName(customer: Customer): string {
  return `${customer.firstName} ${customer.lastName}`;
}

export function formatCustomerType(type: string): string {
  return type.charAt(0).toUpperCase() + type.slice(1);
}
