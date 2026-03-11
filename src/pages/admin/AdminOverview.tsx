import React from "react";
import { Package, ShoppingBag, Users, DollarSign, TrendingUp, AlertTriangle } from "lucide-react";
import { products } from "@/config/products";

const stats = [
  { label: "Total Products", value: products.length.toString(), icon: Package, change: "+3 this month" },
  { label: "Total Orders", value: "156", icon: ShoppingBag, change: "+12 this week" },
  { label: "Customers", value: "89", icon: Users, change: "+5 this month" },
  { label: "Revenue", value: "C$48,290", icon: DollarSign, change: "+18% vs last month" },
];

const recentOrders = [
  { id: "RMQ-001234", customer: "Groupe Transport Lévis", total: "C$2,450.00", status: "processing", date: "2026-03-10" },
  { id: "RMQ-001233", customer: "Fleet Services Ontario", total: "C$1,890.50", status: "shipped", date: "2026-03-09" },
  { id: "RMQ-001232", customer: "Québec Truck Parts Inc.", total: "C$3,200.00", status: "completed", date: "2026-03-08" },
  { id: "RMQ-001231", customer: "Maritime Heavy Hauling", total: "C$675.00", status: "pending", date: "2026-03-08" },
  { id: "RMQ-001230", customer: "Prairie Fleet Maintenance", total: "C$1,120.00", status: "completed", date: "2026-03-07" },
];

const statusStyles: Record<string, string> = {
  pending: "badge-warning",
  processing: "badge-info",
  shipped: "badge-info",
  completed: "badge-success",
  cancelled: "badge-destructive",
};

export default function AdminOverview() {
  const lowStockProducts = products.filter((p) => p.stock < 50);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="dashboard-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold font-display mt-1">{stat.value}</p>
                <p className="text-xs text-success flex items-center gap-1 mt-1"><TrendingUp className="h-3 w-3" />{stat.change}</p>
              </div>
              <stat.icon className="h-8 w-8 text-accent" strokeWidth={1.5} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="lg:col-span-2 dashboard-card">
          <h3 className="font-display font-bold text-sm uppercase mb-4">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="table-header">
                  <th className="text-left px-3 py-2">Order</th>
                  <th className="text-left px-3 py-2">Customer</th>
                  <th className="text-left px-3 py-2">Total</th>
                  <th className="text-left px-3 py-2">Status</th>
                  <th className="text-left px-3 py-2">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-secondary/50 transition-colors">
                    <td className="px-3 py-2.5 font-medium">{order.id}</td>
                    <td className="px-3 py-2.5">{order.customer}</td>
                    <td className="px-3 py-2.5 font-medium">{order.total}</td>
                    <td className="px-3 py-2.5"><span className={statusStyles[order.status]}>{order.status}</span></td>
                    <td className="px-3 py-2.5 text-muted-foreground">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low stock */}
        <div className="dashboard-card">
          <h3 className="font-display font-bold text-sm uppercase mb-4 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-warning" /> Low Stock Alerts
          </h3>
          <div className="space-y-3">
            {lowStockProducts.map((p) => (
              <div key={p.id} className="flex items-center justify-between text-sm">
                <span className="truncate mr-2">{p.name}</span>
                <span className={`font-medium ${p.stock < 20 ? "text-destructive" : "text-warning"}`}>{p.stock} units</span>
              </div>
            ))}
            {lowStockProducts.length === 0 && <p className="text-sm text-muted-foreground">All products well-stocked.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
