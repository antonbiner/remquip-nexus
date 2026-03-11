import React from "react";
import { Eye, Search } from "lucide-react";

const customers = [
  { id: "cust-1", company: "Groupe Transport Lévis", name: "Jean-Pierre Lavoie", email: "jp@gtl.ca", phone: "+1 418 555 0101", orders: 12, totalSpent: "C$28,400", lastOrder: "2026-03-10", type: "Wholesale" },
  { id: "cust-2", company: "Fleet Services Ontario", name: "Sarah Mitchell", email: "sarah@fso.com", phone: "+1 416 555 0202", orders: 8, totalSpent: "C$15,200", lastOrder: "2026-03-09", type: "Wholesale" },
  { id: "cust-3", company: "Québec Truck Parts Inc.", name: "Marc Tremblay", email: "marc@qtp.ca", phone: "+1 418 555 0303", orders: 22, totalSpent: "C$54,800", lastOrder: "2026-03-08", type: "Distributor" },
  { id: "cust-4", company: "Maritime Heavy Hauling", name: "David Fraser", email: "david@mhh.ca", phone: "+1 506 555 0404", orders: 5, totalSpent: "C$8,900", lastOrder: "2026-03-08", type: "Fleet" },
  { id: "cust-5", company: "Prairie Fleet Maintenance", name: "Lisa Chen", email: "lisa@pfm.ca", phone: "+1 306 555 0505", orders: 15, totalSpent: "C$32,100", lastOrder: "2026-03-07", type: "Fleet" },
];

export default function AdminCustomers() {
  return (
    <div className="space-y-6">
      <h2 className="font-display font-bold text-xl">Customer CRM</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="dashboard-card"><p className="text-sm text-muted-foreground">Total Customers</p><p className="text-2xl font-bold font-display">{customers.length}</p></div>
        <div className="dashboard-card"><p className="text-sm text-muted-foreground">Wholesale</p><p className="text-2xl font-bold font-display">2</p></div>
        <div className="dashboard-card"><p className="text-sm text-muted-foreground">Distributors</p><p className="text-2xl font-bold font-display">1</p></div>
        <div className="dashboard-card"><p className="text-sm text-muted-foreground">Fleet Accounts</p><p className="text-2xl font-bold font-display">2</p></div>
      </div>

      <div className="dashboard-card">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input placeholder="Search customers..." className="w-full pl-10 pr-4 py-2 border border-border rounded-sm text-sm bg-background outline-none focus:ring-2 focus:ring-accent" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="table-header">
                <th className="text-left px-3 py-2">Company</th>
                <th className="text-left px-3 py-2">Contact</th>
                <th className="text-left px-3 py-2">Type</th>
                <th className="text-right px-3 py-2">Orders</th>
                <th className="text-right px-3 py-2">Total Spent</th>
                <th className="text-left px-3 py-2">Last Order</th>
                <th className="text-right px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-secondary/50 transition-colors">
                  <td className="px-3 py-3 font-medium">{c.company}</td>
                  <td className="px-3 py-3">
                    <div>{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.email}</div>
                  </td>
                  <td className="px-3 py-3"><span className="badge-info">{c.type}</span></td>
                  <td className="px-3 py-3 text-right">{c.orders}</td>
                  <td className="px-3 py-3 text-right font-medium">{c.totalSpent}</td>
                  <td className="px-3 py-3 text-muted-foreground">{c.lastOrder}</td>
                  <td className="px-3 py-3 text-right">
                    <button className="p-1.5 hover:bg-secondary rounded-sm transition-colors"><Eye className="h-4 w-4" /></button>
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
