import React from "react";
import { Eye, Search } from "lucide-react";

const orders = [
  { id: "RMQ-001234", customer: "Groupe Transport Lévis", email: "info@gtl.ca", items: 4, total: "C$2,450.00", status: "processing", date: "2026-03-10", payment: "Invoice" },
  { id: "RMQ-001233", customer: "Fleet Services Ontario", email: "orders@fso.com", items: 2, total: "C$1,890.50", status: "shipped", date: "2026-03-09", payment: "Credit Card" },
  { id: "RMQ-001232", customer: "Québec Truck Parts Inc.", email: "buy@qtp.ca", items: 8, total: "C$3,200.00", status: "completed", date: "2026-03-08", payment: "Bank Transfer" },
  { id: "RMQ-001231", customer: "Maritime Heavy Hauling", email: "fleet@mhh.ca", items: 1, total: "C$675.00", status: "pending", date: "2026-03-08", payment: "Invoice" },
  { id: "RMQ-001230", customer: "Prairie Fleet Maintenance", email: "parts@pfm.ca", items: 3, total: "C$1,120.00", status: "completed", date: "2026-03-07", payment: "Credit Card" },
  { id: "RMQ-001229", customer: "BC Trucking Solutions", email: "ops@bcts.ca", items: 6, total: "C$4,150.00", status: "processing", date: "2026-03-06", payment: "Invoice" },
];

const statusStyles: Record<string, string> = {
  pending: "badge-warning",
  processing: "badge-info",
  shipped: "badge-info",
  completed: "badge-success",
  cancelled: "badge-destructive",
};

export default function AdminOrders() {
  return (
    <div className="space-y-6">
      <h2 className="font-display font-bold text-xl">Order Management</h2>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {["All (6)", "Pending (1)", "Processing (2)", "Shipped (1)", "Completed (2)"].map((label) => (
          <button key={label} className="dashboard-card text-center text-sm font-medium hover:border-accent transition-colors">{label}</button>
        ))}
      </div>

      <div className="dashboard-card">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input placeholder="Search orders..." className="w-full pl-10 pr-4 py-2 border border-border rounded-sm text-sm bg-background outline-none focus:ring-2 focus:ring-accent" />
          </div>
        </div>
        <div className="overflow-x-auto">
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
              {orders.map((o) => (
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
      </div>
    </div>
  );
}
