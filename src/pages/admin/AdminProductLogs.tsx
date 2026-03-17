import React, { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ArrowLeft, ArrowDownToLine, ArrowUpFromLine, ArrowLeftRight, Package, Search, 
  Calendar, ChevronDown, ChevronUp, TrendingUp, TrendingDown, RotateCcw, 
  Download, ExternalLink, User, FileText
} from "lucide-react";
import { products } from "@/config/products";
import { orders } from "@/data/mockOrders";
import { customers } from "@/data/mockCustomers";

type LogType = "in" | "out" | "transfer" | "adjustment" | "return";

interface StockLog {
  id: string;
  date: string;
  type: LogType;
  quantity: number;
  reference: string;
  referenceType: "order" | "purchase" | "transfer" | "adjustment" | "return";
  orderId?: string;
  customerId?: string;
  customerName?: string;
  warehouse: string;
  note: string;
  user: string;
  balanceAfter: number;
}

const logTypeConfig: Record<LogType, { label: string; icon: React.ElementType; className: string }> = {
  in: { label: "Stock In", icon: ArrowDownToLine, className: "text-green-600 bg-green-500/10" },
  out: { label: "Stock Out", icon: ArrowUpFromLine, className: "text-red-500 bg-red-500/10" },
  transfer: { label: "Transfer", icon: ArrowLeftRight, className: "text-blue-500 bg-blue-500/10" },
  adjustment: { label: "Adjustment", icon: RotateCcw, className: "text-amber-500 bg-amber-500/10" },
  return: { label: "Return", icon: RotateCcw, className: "text-purple-500 bg-purple-500/10" },
};

function generateLogs(productId: string, currentStock: number): StockLog[] {
  // Get real orders that contain this product (simulated)
  const productOrders = orders.slice(0, 5);
  
  const refs: Array<{
    type: LogType;
    ref: string;
    referenceType: "order" | "purchase" | "transfer" | "adjustment" | "return";
    orderId?: string;
    customerId?: string;
    customerName?: string;
    note: string;
    user: string;
  }> = [];
  
  // Add real order references
  productOrders.forEach((order, idx) => {
    const customer = customers.find(c => c.id === order.customerId);
    refs.push({
      type: "out" as LogType,
      ref: order.orderNumber,
      referenceType: "order",
      orderId: order.id,
      customerId: order.customerId,
      customerName: customer?.company || `${customer?.firstName} ${customer?.lastName}`,
      note: `Order fulfilled - ${order.items.length} items shipped`,
      user: "System"
    });
  });

  // Add purchase orders
  refs.push(
    { type: "in", ref: "PO-2024-0891", referenceType: "purchase", note: "Supplier shipment received - Main distributor", user: "Marc Dupont" },
    { type: "in", ref: "PO-2024-0876", referenceType: "purchase", note: "Restocking from manufacturer", user: "Marc Dupont" },
    { type: "in", ref: "PO-2024-0845", referenceType: "purchase", note: "Bulk supplier delivery", user: "Marc Dupont" },
    { type: "in", ref: "PO-2024-0812", referenceType: "purchase", note: "Scheduled restock from OEM", user: "Marc Dupont" },
  );

  // Add transfers
  refs.push(
    { type: "transfer", ref: "TRF-0234", referenceType: "transfer", note: "Transfer QC-01 → ON-01 (Regional demand)", user: "Julie Martin" },
    { type: "transfer", ref: "TRF-0221", referenceType: "transfer", note: "Transfer QC-02 → QC-01 (Consolidation)", user: "Julie Martin" },
  );

  // Add adjustments and returns
  refs.push(
    { type: "adjustment", ref: "ADJ-0112", referenceType: "adjustment", note: "Physical count correction - Annual inventory", user: "Marc Dupont" },
    { type: "adjustment", ref: "ADJ-0098", referenceType: "adjustment", note: "Damaged goods write-off (3 units)", user: "Marc Dupont" },
    { type: "return", ref: "RET-0089", referenceType: "return", customerId: "cust-001", customerName: "Northern Logistics Inc.", note: "Customer return - Defective unit replaced", user: "Julie Martin" },
    { type: "return", ref: "RET-0076", referenceType: "return", customerId: "cust-002", customerName: "Trans-Canada Freight", note: "Customer return - Wrong part ordered", user: "Julie Martin" },
  );

  let balance = currentStock;
  const logs: StockLog[] = [];
  const warehouses = ["QC-01", "QC-02", "ON-01"];
  const baseDate = new Date(2025, 2, 15);

  for (let i = 0; i < refs.length; i++) {
    const entry = refs[i];
    const qty = entry.type === "adjustment" ? (i % 2 === 0 ? -3 : 5) :
      entry.type === "return" ? Math.floor(Math.random() * 5) + 1 :
      Math.floor(Math.random() * 30) + 5;

    const d = new Date(baseDate);
    d.setDate(d.getDate() - i * 2 - Math.floor(Math.random() * 3));

    logs.push({
      id: `log-${productId}-${i}`,
      date: d.toISOString(),
      type: entry.type,
      quantity: entry.type === "out" ? -qty : qty,
      reference: entry.ref,
      referenceType: entry.referenceType,
      orderId: entry.orderId,
      customerId: entry.customerId,
      customerName: entry.customerName,
      warehouse: warehouses[i % 3],
      note: entry.note,
      user: entry.user,
      balanceAfter: balance,
    });

    balance -= (entry.type === "out" ? -qty : qty);
  }

  return logs;
}

export default function AdminProductLogs() {
  const { productId } = useParams();
  const product = products.find((p) => p.id === productId);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [expandedLog, setExpandedLog] = useState<string | null>(null);

  const logs = useMemo(() => product ? generateLogs(product.id, product.stock) : [], [product]);

  const filtered = useMemo(() =>
    logs.filter((l) => {
      const matchSearch = !search || 
        l.reference.toLowerCase().includes(search.toLowerCase()) || 
        l.note.toLowerCase().includes(search.toLowerCase()) ||
        l.customerName?.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === "all" || l.type === typeFilter;
      
      // Date range filtering
      const logDate = new Date(l.date);
      const fromDate = dateFrom ? new Date(dateFrom) : null;
      const toDate = dateTo ? new Date(dateTo) : null;
      const matchDateFrom = !fromDate || logDate >= fromDate;
      const matchDateTo = !toDate || logDate <= toDate;
      
      return matchSearch && matchType && matchDateFrom && matchDateTo;
    }), [logs, search, typeFilter, dateFrom, dateTo]);

  const totalIn = logs.filter((l) => l.quantity > 0).reduce((s, l) => s + l.quantity, 0);
  const totalOut = logs.filter((l) => l.quantity < 0).reduce((s, l) => s + Math.abs(l.quantity), 0);
  const orderCount = logs.filter((l) => l.referenceType === "order").length;

  const exportToCSV = () => {
    const headers = ["Date", "Type", "Reference", "Customer", "Quantity", "Balance After", "Warehouse", "Note", "User"];
    const rows = filtered.map(log => [
      new Date(log.date).toLocaleString(),
      logTypeConfig[log.type].label,
      log.reference,
      log.customerName || "-",
      log.quantity,
      log.balanceAfter,
      log.warehouse,
      log.note,
      log.user
    ]);
    
    const csvContent = [headers.join(","), ...rows.map(r => r.map(v => `"${v}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stock-logs-${product?.sku}-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!product) {
    return (
      <div className="text-center py-16">
        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
        <p className="text-muted-foreground">Product not found</p>
        <Link to="/admin/products" className="text-accent text-sm hover:underline mt-2 inline-block">Back to Products</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <Link to={`/admin/products/${productId}`} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 self-start">
          <ArrowLeft className="h-4 w-4" /> Back to Product
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src={product.image} alt="" className="w-12 h-12 rounded-sm object-cover bg-secondary flex-shrink-0" />
          <div>
            <h2 className="font-display font-bold text-lg md:text-xl">{product.name}</h2>
            <p className="text-xs text-muted-foreground font-mono">{product.sku} · Current Stock: <span className="font-bold text-foreground">{product.stock}</span></p>
          </div>
        </div>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-sm text-sm font-medium transition-colors"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="dashboard-card">
          <p className="text-xs text-muted-foreground">Total Movements</p>
          <p className="text-xl font-bold font-display">{logs.length}</p>
        </div>
        <div className="dashboard-card">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-green-600" />
            <p className="text-xs text-muted-foreground">Total In</p>
          </div>
          <p className="text-xl font-bold font-display text-green-600">+{totalIn}</p>
        </div>
        <div className="dashboard-card">
          <div className="flex items-center gap-1.5">
            <TrendingDown className="h-3.5 w-3.5 text-red-500" />
            <p className="text-xs text-muted-foreground">Total Out</p>
          </div>
          <p className="text-xl font-bold font-display text-red-500">-{totalOut}</p>
        </div>
        <div className="dashboard-card">
          <p className="text-xs text-muted-foreground">Net Change</p>
          <p className={`text-xl font-bold font-display ${totalIn - totalOut >= 0 ? "text-green-600" : "text-red-500"}`}>
            {totalIn - totalOut >= 0 ? "+" : ""}{totalIn - totalOut}
          </p>
        </div>
        <div className="dashboard-card">
          <div className="flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-accent" />
            <p className="text-xs text-muted-foreground">Orders</p>
          </div>
          <p className="text-xl font-bold font-display">{orderCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="dashboard-card">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3 mb-4">
          <div className="relative flex-1 w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reference, note, or customer..."
              className="w-full pl-10 pr-4 py-2 border border-border rounded-sm text-sm bg-background outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="flex flex-wrap gap-3 w-full lg:w-auto">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="border border-border rounded-sm px-3 py-2 text-sm bg-background outline-none"
            >
              <option value="all">All Types</option>
              <option value="in">Stock In</option>
              <option value="out">Stock Out</option>
              <option value="transfer">Transfer</option>
              <option value="adjustment">Adjustment</option>
              <option value="return">Return</option>
            </select>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="border border-border rounded-sm px-3 py-2 text-sm bg-background outline-none"
                placeholder="From"
              />
              <span className="text-muted-foreground">to</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="border border-border rounded-sm px-3 py-2 text-sm bg-background outline-none"
                placeholder="To"
              />
            </div>
          </div>
        </div>

        {/* Mobile card view */}
        <div className="md:hidden space-y-2">
          {filtered.length === 0 && (
            <p className="text-center py-8 text-sm text-muted-foreground">No logs found.</p>
          )}
          {filtered.map((log) => {
            const config = logTypeConfig[log.type];
            const Icon = config.icon;
            const isExpanded = expandedLog === log.id;
            return (
              <div key={log.id} className="border border-border rounded-md overflow-hidden">
                <button
                  onClick={() => setExpandedLog(isExpanded ? null : log.id)}
                  className="w-full p-3 text-left flex items-center gap-3"
                >
                  <div className={`p-2 rounded-sm flex-shrink-0 ${config.className}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{config.label}</span>
                      <span className={`text-sm font-bold ${log.quantity > 0 ? "text-green-600" : "text-red-500"}`}>
                        {log.quantity > 0 ? "+" : ""}{log.quantity}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{log.reference} · {new Date(log.date).toLocaleDateString()}</p>
                    {log.customerName && (
                      <p className="text-xs text-accent mt-0.5">{log.customerName}</p>
                    )}
                  </div>
                  {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
                </button>
                {isExpanded && (
                  <div className="px-3 pb-3 border-t border-border pt-3 bg-secondary/30 space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Warehouse</span>
                      <span>{log.warehouse}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Balance After</span>
                      <span className="font-medium">{log.balanceAfter}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">User</span>
                      <span>{log.user}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Time</span>
                      <span>{new Date(log.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                    <div className="pt-1.5 border-t border-border mt-1.5">
                      <p className="text-xs text-muted-foreground">{log.note}</p>
                    </div>
                    {(log.orderId || log.customerId) && (
                      <div className="flex gap-2 pt-2">
                        {log.orderId && (
                          <Link 
                            to={`/admin/orders?order=${log.orderId}`}
                            className="text-xs text-accent hover:underline flex items-center gap-1"
                          >
                            <ExternalLink className="h-3 w-3" /> View Order
                          </Link>
                        )}
                        {log.customerId && (
                          <Link 
                            to={`/admin/customers/${log.customerId}`}
                            className="text-xs text-accent hover:underline flex items-center gap-1"
                          >
                            <User className="h-3 w-3" /> View Customer
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="table-header">
                <th className="text-left px-3 py-2">Date</th>
                <th className="text-left px-3 py-2">Type</th>
                <th className="text-left px-3 py-2">Reference</th>
                <th className="text-left px-3 py-2">Customer</th>
                <th className="text-right px-3 py-2">Quantity</th>
                <th className="text-right px-3 py-2">Balance</th>
                <th className="text-left px-3 py-2">Warehouse</th>
                <th className="text-left px-3 py-2">Note</th>
                <th className="text-left px-3 py-2">User</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((log) => {
                const config = logTypeConfig[log.type];
                const Icon = config.icon;
                return (
                  <tr key={log.id} className="hover:bg-secondary/50 transition-colors">
                    <td className="px-3 py-3 text-muted-foreground whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(log.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-xs font-medium ${config.className}`}>
                        <Icon className="h-3 w-3" /> {config.label}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      {log.orderId ? (
                        <Link 
                          to={`/admin/orders?order=${log.orderId}`}
                          className="font-mono text-xs text-accent hover:underline flex items-center gap-1"
                        >
                          {log.reference}
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      ) : (
                        <span className="font-mono text-xs">{log.reference}</span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      {log.customerId ? (
                        <Link 
                          to={`/admin/customers/${log.customerId}`}
                          className="text-accent hover:underline flex items-center gap-1 text-xs"
                        >
                          <User className="h-3 w-3" />
                          {log.customerName}
                        </Link>
                      ) : (
                        <span className="text-muted-foreground text-xs">-</span>
                      )}
                    </td>
                    <td className={`px-3 py-3 text-right font-bold ${log.quantity > 0 ? "text-green-600" : "text-red-500"}`}>
                      {log.quantity > 0 ? "+" : ""}{log.quantity}
                    </td>
                    <td className="px-3 py-3 text-right font-medium">{log.balanceAfter}</td>
                    <td className="px-3 py-3">{log.warehouse}</td>
                    <td className="px-3 py-3 text-muted-foreground max-w-[200px] truncate">{log.note}</td>
                    <td className="px-3 py-3 text-muted-foreground">{log.user}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-center py-8 text-sm text-muted-foreground">No logs found.</p>
          )}
        </div>

        <div className="mt-4 text-xs text-muted-foreground">
          Showing {filtered.length} of {logs.length} entries
        </div>
      </div>
    </div>
  );
}
