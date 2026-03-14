import React, { useState } from "react";
import { Eye, Search, X, ChevronDown, ChevronUp, Package, Truck, CheckCircle, Clock } from "lucide-react";

const allOrders = [
  { id: "RMQ-001234", customer: "Groupe Transport Lévis", email: "info@gtl.ca", items: 4, total: "C$2,450.00", status: "processing", date: "2026-03-10", payment: "Invoice",
    products: [{ name: "Air Spring W01-358 9781", qty: 2, price: "C$89.99" }, { name: "30/30 Long Stroke Brake Chamber", qty: 2, price: "C$134.50" }] },
  { id: "RMQ-001233", customer: "Fleet Services Ontario", email: "orders@fso.com", items: 2, total: "C$1,890.50", status: "shipped", date: "2026-03-09", payment: "Credit Card",
    products: [{ name: "ADB22X Air Disc Brake Pad Kit", qty: 2, price: "C$156.00" }] },
  { id: "RMQ-001232", customer: "Québec Truck Parts Inc.", email: "buy@qtp.ca", items: 8, total: "C$3,200.00", status: "completed", date: "2026-03-08", payment: "Bank Transfer",
    products: [{ name: "4707Q Brake Shoe Kit", qty: 8, price: "C$74.99" }] },
  { id: "RMQ-001231", customer: "Maritime Heavy Hauling", email: "fleet@mhh.ca", items: 1, total: "C$675.00", status: "pending", date: "2026-03-08", payment: "Invoice",
    products: [{ name: "Brake Drum - Gunite 3600A", qty: 1, price: "C$198.00" }] },
  { id: "RMQ-001230", customer: "Prairie Fleet Maintenance", email: "parts@pfm.ca", items: 3, total: "C$1,120.00", status: "completed", date: "2026-03-07", payment: "Credit Card",
    products: [{ name: "4515Q Brake Shoe Assembly Kit", qty: 3, price: "C$89.99" }] },
  { id: "RMQ-001229", customer: "BC Trucking Solutions", email: "ops@bcts.ca", items: 6, total: "C$4,150.00", status: "processing", date: "2026-03-06", payment: "Invoice",
    products: [{ name: "Air Spring W01-358 9781", qty: 6, price: "C$89.99" }] },
];

const statusStyles: Record<string, string> = {
  pending: "badge-warning",
  processing: "badge-info",
  shipped: "badge-info",
  completed: "badge-success",
  cancelled: "badge-destructive",
};

const statusIcons: Record<string, React.ElementType> = {
  pending: Clock,
  processing: Package,
  shipped: Truck,
  completed: CheckCircle,
};

export default function AdminOrders() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const filtered = allOrders.filter((o) => {
    const matchesSearch = !search || o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: allOrders.length,
    pending: allOrders.filter(o => o.status === "pending").length,
    processing: allOrders.filter(o => o.status === "processing").length,
    shipped: allOrders.filter(o => o.status === "shipped").length,
    completed: allOrders.filter(o => o.status === "completed").length,
  };

  return (
    <div className="space-y-6">
      <h2 className="font-display font-bold text-lg md:text-xl">Order Management</h2>

      <div className="grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-4">
        {[
          { key: "", label: "All", count: statusCounts.all },
          { key: "pending", label: "Pending", count: statusCounts.pending },
          { key: "processing", label: "Processing", count: statusCounts.processing },
          { key: "shipped", label: "Shipped", count: statusCounts.shipped },
          { key: "completed", label: "Completed", count: statusCounts.completed },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`dashboard-card text-center text-xs md:text-sm font-medium transition-colors ${statusFilter === tab.key ? "border-accent text-accent" : "hover:border-muted-foreground"}`}
          >
            <span className="block">{tab.label}</span>
            <span className="block text-lg md:text-xl font-bold font-display mt-0.5">{tab.count}</span>
          </button>
        ))}
      </div>

      <div className="dashboard-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search orders..."
              className="w-full pl-10 pr-4 py-2 border border-border rounded-sm text-sm bg-background outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          {search && (
            <button onClick={() => setSearch("")} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Mobile card view */}
        <div className="md:hidden space-y-3">
          {filtered.map((o) => {
            const StatusIcon = statusIcons[o.status] || Package;
            const isExpanded = expandedOrder === o.id;
            return (
              <div key={o.id} className="border border-border rounded-md overflow-hidden">
                <button
                  onClick={() => setExpandedOrder(isExpanded ? null : o.id)}
                  className="w-full p-3 text-left flex items-center justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{o.id}</span>
                      <span className={statusStyles[o.status]}>{o.status}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{o.customer}</p>
                    <p className="text-sm font-bold mt-0.5">{o.total}</p>
                  </div>
                  {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </button>
                {isExpanded && (
                  <div className="px-3 pb-3 border-t border-border pt-3 space-y-2 bg-secondary/30">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Email</span>
                      <span>{o.email}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Payment</span>
                      <span>{o.payment}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Date</span>
                      <span>{o.date}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Items</span>
                      <span>{o.items}</span>
                    </div>
                    <div className="pt-2 border-t border-border">
                      <p className="text-xs font-medium mb-1.5">Products</p>
                      {o.products.map((p, i) => (
                        <div key={i} className="flex justify-between text-xs text-muted-foreground py-0.5">
                          <span className="truncate mr-2">{p.name} ×{p.qty}</span>
                          <span>{p.price}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button className="flex-1 btn-accent text-xs py-2 rounded-sm font-medium">Update Status</button>
                      <button className="px-3 py-2 border border-border rounded-sm text-xs hover:bg-secondary transition-colors">
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                    </div>
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
                <th className="text-left px-3 py-2">Order</th>
                <th className="text-left px-3 py-2">Customer</th>
                <th className="text-right px-3 py-2">Items</th>
                <th className="text-right px-3 py-2">Total</th>
                <th className="text-left px-3 py-2">Payment</th>
                <th className="text-left px-3 py-2">Status</th>
                <th className="text-left px-3 py-2">Date</th>
                <th className="text-right px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((o) => (
                <tr key={o.id} className="hover:bg-secondary/50 transition-colors">
                  <td className="px-3 py-3 font-medium">{o.id}</td>
                  <td className="px-3 py-3">
                    <div>{o.customer}</div>
                    <div className="text-xs text-muted-foreground">{o.email}</div>
                  </td>
                  <td className="px-3 py-3 text-right">{o.items}</td>
                  <td className="px-3 py-3 text-right font-medium">{o.total}</td>
                  <td className="px-3 py-3 text-muted-foreground">{o.payment}</td>
                  <td className="px-3 py-3"><span className={statusStyles[o.status]}>{o.status}</span></td>
                  <td className="px-3 py-3 text-muted-foreground">{o.date}</td>
                  <td className="px-3 py-3 text-right">
                    <button className="p-1.5 hover:bg-secondary rounded-sm transition-colors" title="View"><Eye className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-8 text-sm text-muted-foreground">No orders found.</div>
        )}
      </div>
    </div>
  );
}
