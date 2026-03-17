import type { Return, ReturnItem, ReturnNote, ReturnStatus, ReturnReason } from "@/types/admin";

// ─── RETURNS / RMA DATA ───

export const returns: Return[] = [
  {
    id: "ret-1",
    returnNumber: "RMA-2026-001",
    orderId: "ord-3",
    orderNumber: "RMQ-001232",
    customerId: "cust-3",
    status: "processing",
    reason: "defective",
    resolution: "replacement",
    items: [
      {
        id: "ret-item-1-1",
        returnId: "ret-1",
        orderItemId: "item-3-1",
        productId: "prod-3",
        sku: "4707Q-KIT",
        productName: "4707Q Brake Shoe Kit",
        productImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100",
        quantity: 2,
        unitPrice: 74.99,
        reason: "defective",
        condition: "defective",
        notes: "Brake pads showed premature wear after 500km"
      }
    ],
    subtotal: 149.98,
    refundAmount: 0,
    creditAmount: 0,
    notes: [
      { id: "rnote-1-1", returnId: "ret-1", date: "2026-03-12T10:00:00Z", user: "System", text: "Return request submitted", type: "system" },
      { id: "rnote-1-2", returnId: "ret-1", date: "2026-03-12T14:30:00Z", user: "Marc Dupont", text: "Approved - defective product confirmed by customer photos", type: "status_change" },
      { id: "rnote-1-3", returnId: "ret-1", date: "2026-03-14T09:00:00Z", user: "System", text: "Return shipping label sent to customer", type: "system" },
      { id: "rnote-1-4", returnId: "ret-1", date: "2026-03-15T11:00:00Z", user: "Warehouse", text: "Package received at QC-01 warehouse", type: "status_change" },
    ],
    requestedAt: "2026-03-12T10:00:00Z",
    approvedAt: "2026-03-12T14:30:00Z",
    receivedAt: "2026-03-15T11:00:00Z",
    trackingNumber: "RET1Z999AA10123456001",
    carrier: "Purolator",
    warehouseId: "QC-01",
    processedBy: "Marc Dupont",
    metadata: { priority: "normal", qualityIssue: true },
    createdAt: "2026-03-12T10:00:00Z",
    updatedAt: "2026-03-15T11:00:00Z",
  },
  {
    id: "ret-2",
    returnNumber: "RMA-2026-002",
    orderId: "ord-5",
    orderNumber: "RMQ-001230",
    customerId: "cust-5",
    status: "completed",
    reason: "wrong_item",
    resolution: "replacement",
    items: [
      {
        id: "ret-item-2-1",
        returnId: "ret-2",
        orderItemId: "item-5-1",
        productId: "prod-6",
        sku: "4515Q-ASM",
        productName: "4515Q Brake Shoe Assembly Kit",
        productImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100",
        quantity: 1,
        unitPrice: 89.99,
        reason: "wrong_item",
        condition: "unopened",
        notes: "Customer ordered 4707Q but received 4515Q"
      }
    ],
    subtotal: 89.99,
    refundAmount: 0,
    creditAmount: 0,
    notes: [
      { id: "rnote-2-1", returnId: "ret-2", date: "2026-03-09T08:00:00Z", user: "System", text: "Return request submitted", type: "system" },
      { id: "rnote-2-2", returnId: "ret-2", date: "2026-03-09T09:15:00Z", user: "Julie Martin", text: "Approved immediately - shipping error confirmed", type: "status_change" },
      { id: "rnote-2-3", returnId: "ret-2", date: "2026-03-10T14:00:00Z", user: "Warehouse", text: "Wrong item received, replacement shipped same day", type: "note" },
      { id: "rnote-2-4", returnId: "ret-2", date: "2026-03-12T10:00:00Z", user: "System", text: "Replacement delivered, return completed", type: "status_change" },
    ],
    requestedAt: "2026-03-09T08:00:00Z",
    approvedAt: "2026-03-09T09:15:00Z",
    receivedAt: "2026-03-10T14:00:00Z",
    completedAt: "2026-03-12T10:00:00Z",
    trackingNumber: "RET1Z999AA10123456002",
    carrier: "Canada Post",
    warehouseId: "QC-01",
    processedBy: "Julie Martin",
    metadata: { priority: "high", shippingError: true },
    createdAt: "2026-03-09T08:00:00Z",
    updatedAt: "2026-03-12T10:00:00Z",
  },
  {
    id: "ret-3",
    returnNumber: "RMA-2026-003",
    orderId: "ord-2",
    orderNumber: "RMQ-001233",
    customerId: "cust-2",
    status: "requested",
    reason: "damaged_shipping",
    resolution: undefined,
    items: [
      {
        id: "ret-item-3-1",
        returnId: "ret-3",
        orderItemId: "item-2-1",
        productId: "prod-4",
        sku: "ADB22X-PAD",
        productName: "ADB22X Air Disc Brake Pad Kit",
        productImage: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=100",
        quantity: 1,
        unitPrice: 156.00,
        reason: "damaged_shipping",
        condition: "damaged",
        notes: "Box was crushed during transit, pads are cracked"
      }
    ],
    subtotal: 156.00,
    notes: [
      { id: "rnote-3-1", returnId: "ret-3", date: "2026-03-16T11:00:00Z", user: "System", text: "Return request submitted", type: "system" },
      { id: "rnote-3-2", returnId: "ret-3", date: "2026-03-16T11:05:00Z", user: "Customer", text: "Attached photos of damaged packaging and product", type: "note" },
    ],
    requestedAt: "2026-03-16T11:00:00Z",
    metadata: { priority: "high", hasPhotos: true },
    createdAt: "2026-03-16T11:00:00Z",
    updatedAt: "2026-03-16T11:05:00Z",
  },
  {
    id: "ret-4",
    returnNumber: "RMA-2026-004",
    orderId: "ord-7",
    orderNumber: "RMQ-001220",
    customerId: "cust-1",
    status: "approved",
    reason: "not_as_described",
    resolution: "refund",
    items: [
      {
        id: "ret-item-4-1",
        returnId: "ret-4",
        orderItemId: "item-7-1",
        productId: "prod-3",
        sku: "4707Q-KIT",
        productName: "4707Q Brake Shoe Kit",
        productImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100",
        quantity: 2,
        unitPrice: 74.99,
        reason: "not_as_described",
        condition: "opened",
        notes: "Part numbers on product don't match catalog listing"
      }
    ],
    subtotal: 149.98,
    refundAmount: 149.98,
    notes: [
      { id: "rnote-4-1", returnId: "ret-4", date: "2026-03-14T09:00:00Z", user: "System", text: "Return request submitted", type: "system" },
      { id: "rnote-4-2", returnId: "ret-4", date: "2026-03-14T15:00:00Z", user: "Marc Dupont", text: "Verified catalog discrepancy, approved for full refund", type: "status_change" },
      { id: "rnote-4-3", returnId: "ret-4", date: "2026-03-14T15:05:00Z", user: "System", text: "Return shipping label sent to customer", type: "system" },
    ],
    requestedAt: "2026-03-14T09:00:00Z",
    approvedAt: "2026-03-14T15:00:00Z",
    trackingNumber: "RET1Z999AA10123456004",
    carrier: "Purolator",
    processedBy: "Marc Dupont",
    metadata: { priority: "normal", catalogIssue: true },
    createdAt: "2026-03-14T09:00:00Z",
    updatedAt: "2026-03-14T15:05:00Z",
  },
  {
    id: "ret-5",
    returnNumber: "RMA-2026-005",
    orderId: "ord-9",
    orderNumber: "RMQ-001215",
    customerId: "cust-3",
    status: "received",
    reason: "defective",
    resolution: "store_credit",
    items: [
      {
        id: "ret-item-5-1",
        returnId: "ret-5",
        orderItemId: "item-9-2",
        productId: "prod-2",
        sku: "SC3030LS",
        productName: "30/30 Long Stroke Brake Chamber",
        productImage: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=100",
        quantity: 2,
        unitPrice: 114.33,
        reason: "defective",
        condition: "defective",
        notes: "Air seal failure on both units within 30 days"
      }
    ],
    subtotal: 228.66,
    creditAmount: 228.66,
    notes: [
      { id: "rnote-5-1", returnId: "ret-5", date: "2026-03-10T10:00:00Z", user: "System", text: "Return request submitted", type: "system" },
      { id: "rnote-5-2", returnId: "ret-5", date: "2026-03-10T11:30:00Z", user: "Julie Martin", text: "Known batch issue - approved for store credit", type: "status_change" },
      { id: "rnote-5-3", returnId: "ret-5", date: "2026-03-13T09:00:00Z", user: "Warehouse", text: "Items received and inspected - defect confirmed", type: "status_change" },
    ],
    requestedAt: "2026-03-10T10:00:00Z",
    approvedAt: "2026-03-10T11:30:00Z",
    receivedAt: "2026-03-13T09:00:00Z",
    trackingNumber: "RET1Z999AA10123456005",
    carrier: "Day & Ross",
    warehouseId: "QC-01",
    processedBy: "Julie Martin",
    metadata: { priority: "normal", batchIssue: "BATCH-2026-02-15" },
    createdAt: "2026-03-10T10:00:00Z",
    updatedAt: "2026-03-13T09:00:00Z",
  },
  {
    id: "ret-6",
    returnNumber: "RMA-2026-006",
    orderId: "ord-8",
    orderNumber: "RMQ-001198",
    customerId: "cust-1",
    status: "rejected",
    reason: "changed_mind",
    resolution: undefined,
    items: [
      {
        id: "ret-item-6-1",
        returnId: "ret-6",
        orderItemId: "item-8-2",
        productId: "prod-4",
        sku: "ADB22X-PAD",
        productName: "ADB22X Air Disc Brake Pad Kit",
        productImage: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=100",
        quantity: 2,
        unitPrice: 156.00,
        reason: "changed_mind",
        condition: "opened",
        notes: "Customer decided to use different brand"
      }
    ],
    subtotal: 312.00,
    notes: [
      { id: "rnote-6-1", returnId: "ret-6", date: "2026-03-01T14:00:00Z", user: "System", text: "Return request submitted", type: "system" },
      { id: "rnote-6-2", returnId: "ret-6", date: "2026-03-01T16:00:00Z", user: "Marc Dupont", text: "Rejected - opened items not eligible for return after 14 days per policy", type: "status_change" },
      { id: "rnote-6-3", returnId: "ret-6", date: "2026-03-01T16:05:00Z", user: "System", text: "Customer notified of rejection", type: "system" },
    ],
    requestedAt: "2026-03-01T14:00:00Z",
    processedBy: "Marc Dupont",
    metadata: { priority: "low", policyViolation: true },
    createdAt: "2026-03-01T14:00:00Z",
    updatedAt: "2026-03-01T16:05:00Z",
  },
];

// ─── HELPER FUNCTIONS ───

export function getReturnsByCustomerId(customerId: string): Return[] {
  return returns.filter(r => r.customerId === customerId);
}

export function getReturnsByOrderId(orderId: string): Return[] {
  return returns.filter(r => r.orderId === orderId);
}

export function getReturnById(returnId: string): Return | undefined {
  return returns.find(r => r.id === returnId);
}

export const returnStatusLabels: Record<ReturnStatus, { en: string; fr: string }> = {
  requested: { en: "Requested", fr: "Demandé" },
  approved: { en: "Approved", fr: "Approuvé" },
  received: { en: "Received", fr: "Reçu" },
  processing: { en: "Processing", fr: "En traitement" },
  completed: { en: "Completed", fr: "Terminé" },
  rejected: { en: "Rejected", fr: "Rejeté" },
};

export const returnReasonLabels: Record<ReturnReason, { en: string; fr: string }> = {
  defective: { en: "Defective Product", fr: "Produit défectueux" },
  wrong_item: { en: "Wrong Item Sent", fr: "Mauvais article envoyé" },
  damaged_shipping: { en: "Damaged in Shipping", fr: "Endommagé lors de la livraison" },
  not_as_described: { en: "Not as Described", fr: "Non conforme à la description" },
  changed_mind: { en: "Changed Mind", fr: "Changement d'avis" },
  other: { en: "Other", fr: "Autre" },
};

export const resolutionLabels: Record<string, { en: string; fr: string }> = {
  refund: { en: "Full Refund", fr: "Remboursement complet" },
  replacement: { en: "Replacement", fr: "Remplacement" },
  store_credit: { en: "Store Credit", fr: "Crédit en magasin" },
  repair: { en: "Repair", fr: "Réparation" },
};
