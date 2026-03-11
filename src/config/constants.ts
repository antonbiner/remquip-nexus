export const SITE_NAME = "REMQUIP";
export const SITE_DESCRIPTION = "Canada's Next-Generation Heavy-Duty Parts Distributor";

export const ORDER_STATUSES = ["pending", "processing", "shipped", "completed", "cancelled"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const TAX_RATE = 0.14975;
export const FREE_SHIPPING_THRESHOLD = 500;
export const FLAT_SHIPPING_RATE = 25;
