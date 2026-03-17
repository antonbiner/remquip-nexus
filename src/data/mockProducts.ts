import type { ProductBuyer, ProductSalesStats, ProductActivityLog, StockLog } from "@/types/admin";
import { orders } from "./mockOrders";
import { customers } from "./mockCustomers";

// ─── PRODUCT BUYERS (derived from orders) ───

export function getProductBuyers(productId: string): ProductBuyer[] {
  const buyerMap = new Map<string, ProductBuyer>();
  
  orders.forEach((order) => {
    order.items.forEach((item) => {
      if (item.productId === productId) {
        const customer = customers.find((c) => c.id === order.customerId);
        if (!customer) return;
        
        const existing = buyerMap.get(customer.id);
        const orderEntry = {
          orderId: order.id,
          orderNumber: order.orderNumber,
          date: order.createdAt,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.totalPrice,
        };
        
        if (existing) {
          existing.totalQuantity += item.quantity;
          existing.totalSpent += item.totalPrice;
          existing.orderCount += 1;
          existing.orders.push(orderEntry);
          if (new Date(order.createdAt) > new Date(existing.lastPurchaseDate)) {
            existing.lastPurchaseDate = order.createdAt;
          }
        } else {
          buyerMap.set(customer.id, {
            customerId: customer.id,
            customerName: `${customer.firstName} ${customer.lastName}`,
            companyName: customer.companyName,
            customerType: customer.customerType,
            totalQuantity: item.quantity,
            totalSpent: item.totalPrice,
            orderCount: 1,
            lastPurchaseDate: order.createdAt,
            orders: [orderEntry],
          });
        }
      }
    });
  });
  
  return Array.from(buyerMap.values()).sort((a, b) => b.totalSpent - a.totalSpent);
}

// ─── PRODUCT SALES STATS ───

export function getProductSalesStats(productId: string): ProductSalesStats {
  const buyers = getProductBuyers(productId);
  const totalUnitsSold = buyers.reduce((sum, b) => sum + b.totalQuantity, 0);
  const totalRevenue = buyers.reduce((sum, b) => sum + b.totalSpent, 0);
  const uniqueBuyers = buyers.length;
  const repeatBuyers = buyers.filter((b) => b.orderCount > 1).length;
  const reorderRate = uniqueBuyers > 0 ? (repeatBuyers / uniqueBuyers) * 100 : 0;
  
  // Generate sales trend (last 30 days)
  const today = new Date();
  const salesTrend: { date: string; units: number; revenue: number }[] = [];
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    
    // Simulate some variance in sales
    const baseUnits = Math.floor(Math.random() * 5) + (i % 7 === 0 ? 0 : 2);
    const baseRevenue = baseUnits * 89.99;
    
    salesTrend.push({
      date: dateStr,
      units: baseUnits,
      revenue: parseFloat(baseRevenue.toFixed(2)),
    });
  }
  
  return {
    totalUnitsSold,
    totalRevenue,
    avgUnitPrice: totalUnitsSold > 0 ? totalRevenue / totalUnitsSold : 0,
    uniqueBuyers,
    reorderRate,
    salesTrend,
  };
}

// ─── PRODUCT ACTIVITY LOGS ───

export function getProductActivityLogs(productId: string): ProductActivityLog[] {
  // Generate activity logs for a product
  const logs: ProductActivityLog[] = [
    {
      id: `log-${productId}-1`,
      productId,
      action: "price_changed",
      field: "price",
      oldValue: "84.99",
      newValue: "89.99",
      user: "Marc Dupont",
      timestamp: "2026-03-01T10:30:00Z",
    },
    {
      id: `log-${productId}-2`,
      productId,
      action: "stock_adjusted",
      field: "stock",
      oldValue: "45",
      newValue: "120",
      user: "Julie Martin",
      timestamp: "2026-02-28T14:15:00Z",
      metadata: { reason: "Restock from supplier PO-2024-0891" },
    },
    {
      id: `log-${productId}-3`,
      productId,
      action: "product_edited",
      field: "description",
      oldValue: undefined,
      newValue: "Updated specifications",
      user: "Marc Dupont",
      timestamp: "2026-02-20T09:00:00Z",
    },
    {
      id: `log-${productId}-4`,
      productId,
      action: "wholesale_price_changed",
      field: "wholesalePrice",
      oldValue: "69.99",
      newValue: "74.99",
      user: "Marc Dupont",
      timestamp: "2026-02-15T11:20:00Z",
    },
    {
      id: `log-${productId}-5`,
      productId,
      action: "status_changed",
      field: "status",
      oldValue: "draft",
      newValue: "active",
      user: "Julie Martin",
      timestamp: "2026-01-10T08:45:00Z",
    },
    {
      id: `log-${productId}-6`,
      productId,
      action: "product_created",
      user: "Marc Dupont",
      timestamp: "2025-12-01T15:00:00Z",
    },
  ];
  
  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

// ─── STOCK LOGS WITH ORDER REFERENCES ───

export function getProductStockLogs(productId: string, currentStock: number): StockLog[] {
  // Find orders that include this product
  const productOrders = orders.flatMap((order) => 
    order.items
      .filter((item) => item.productId === productId)
      .map((item) => ({
        orderId: order.id,
        orderNumber: order.orderNumber,
        customerId: order.customerId,
        date: order.createdAt,
        quantity: item.quantity,
      }))
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const refs: {
    type: StockLog["type"];
    ref: string;
    note: string;
    user: string;
    orderId?: string;
    orderNumber?: string;
    customerId?: string;
    customerName?: string;
  }[] = [
    { type: "in", ref: "PO-2024-0891", note: "Supplier shipment received", user: "Marc Dupont" },
  ];
  
  // Add stock outs from orders
  productOrders.forEach((po) => {
    const customer = customers.find((c) => c.id === po.customerId);
    refs.push({
      type: "out",
      ref: po.orderNumber,
      note: `Order fulfilled - ${customer?.companyName || "Customer"}`,
      user: "System",
      orderId: po.orderId,
      orderNumber: po.orderNumber,
      customerId: po.customerId,
      customerName: customer?.companyName,
    });
  });
  
  // Add more generic stock movements
  refs.push(
    { type: "in", ref: "PO-2024-0876", note: "Restocking from manufacturer", user: "Marc Dupont" },
    { type: "transfer", ref: "TRF-0234", note: "Transfer QC-01 → ON-01", user: "Julie Martin" },
    { type: "adjustment", ref: "ADJ-0112", note: "Physical count correction", user: "Marc Dupont" },
    { type: "return", ref: "RET-0089", note: "Customer return - defective", user: "Julie Martin" },
    { type: "in", ref: "PO-2024-0845", note: "Bulk supplier delivery", user: "Marc Dupont" },
  );
  
  let balance = currentStock;
  const logs: StockLog[] = [];
  const warehouses = ["QC-01", "QC-02", "ON-01"];
  const baseDate = new Date(2026, 2, 15);
  
  for (let i = 0; i < refs.length; i++) {
    const entry = refs[i];
    const qty = entry.type === "adjustment" ? (i % 2 === 0 ? -3 : 5) :
      entry.type === "return" ? Math.floor(Math.random() * 5) + 1 :
      entry.type === "out" ? -(Math.floor(Math.random() * 10) + 2) :
      Math.floor(Math.random() * 30) + 10;
    
    const d = new Date(baseDate);
    d.setDate(d.getDate() - i * 2 - Math.floor(Math.random() * 3));
    
    logs.push({
      id: `slog-${productId}-${i}`,
      productId,
      date: d.toISOString(),
      type: entry.type,
      quantity: entry.type === "out" ? qty : Math.abs(qty),
      reference: entry.ref,
      orderId: entry.orderId,
      orderNumber: entry.orderNumber,
      customerId: entry.customerId,
      customerName: entry.customerName,
      warehouse: warehouses[i % 3],
      note: entry.note,
      user: entry.user,
      balanceAfter: balance,
    });
    
    balance -= qty;
  }
  
  return logs;
}

// ─── PRODUCT-SPECIFIC DATA EXPORTS ───

// Pre-computed for common products
export const productSalesData: Record<string, ProductSalesStats> = {
  "prod-1": getProductSalesStats("prod-1"),
  "prod-2": getProductSalesStats("prod-2"),
  "prod-3": getProductSalesStats("prod-3"),
  "prod-4": getProductSalesStats("prod-4"),
  "prod-5": getProductSalesStats("prod-5"),
  "prod-6": getProductSalesStats("prod-6"),
};
