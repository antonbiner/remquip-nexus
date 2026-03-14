import React, { useState } from "react";
import { Eye, Search, X, Mail, Phone, ChevronDown, ChevronUp } from "lucide-react";

const customers = [
  { id: "cust-1", company: "Groupe Transport Lévis", name: "Jean-Pierre Lavoie", email: "jp@gtl.ca", phone: "+1 418 555 0101", orders: 12, totalSpent: "C$28,400", lastOrder: "2026-03-10", type: "Wholesale" },
  { id: "cust-2", company: "Fleet Services Ontario", name: "Sarah Mitchell", email: "sarah@fso.com", phone: "+1 416 555 0202", orders: 8, totalSpent: "C$15,200", lastOrder: "2026-03-09", type: "Wholesale" },
  { id: "cust-3", company: "Québec Truck Parts Inc.", name: "Marc Tremblay", email: "marc@qtp.ca", phone: "+1 418 555 0303", orders: 22, totalSpent: "C$54,800", lastOrder: "2026-03-08", type: "Distributor" },
  { id: "cust-4", company: "Maritime Heavy Hauling", name: "David Fraser", email: "david@mhh.ca", phone: "+1 506 555 0404", orders: 5, totalSpent: "C$8,900", lastOrder: "2026-03-08", type: "Fleet" },
  { id: "cust-5", company: "Prairie Fleet Maintenance", name: "Lisa Chen", email: "lisa@pfm.ca", phone: "+1 306 555 0505", orders: 15, totalSpent: "C$32,100", lastOrder: "2026-03-07", type: "Fleet" },
];

export default function AdminCustomers() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [expandedCustomer, setExpandedCustomer] = useState<string | null>(null);

  const filtered = customers.filter((c) => {
    const matchesSearch = !search || c.company.toLowerCase().includes(search.toLowerCase()) || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
    const matchesType = !typeFilter || c.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const typeCounts = {
    Wholesale: customers.filter(c => c.type === "Wholesale").length,
    Distributor: customers.filter(c => c.type === "Distributor").length,
    Fleet: customers.filter(c => c.type === "Fleet").length,
  };

  return (
    <div className="space-y-6">
      <h2 className="font-display font-bold text-lg md:text-xl">Customer CRM</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="dashboard-card">
          <p className="text-xs md:text-sm text-muted-foreground">Total Customers</p>
          <p className="text-xl md:text-2xl font-bold font-display">{customers.length}</p>
        </div>
        {Object.entries(typeCounts).map(([type, count]) => (
          <button
            key={type}
            onClick={() => setTypeFilter(typeFilter === type ? "" : type)}
            className={`dashboard-card text-left transition-colors ${typeFilter === type ? "border-accent" : "hover:border-muted-foreground"}`}
          >
            <p className="text-xs md:text-sm text-muted-foreground">{type}</p>
            <p className="text-xl md:text-2xl font-bold font-display">{count}</p>
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
              placeholder="Search customers..."
              className="w-full pl-10 pr-4 py-2 border border-border rounded-sm text-sm bg-background outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          {(search || typeFilter) && (
            <button onClick={() => { setSearch(""); setTypeFilter(""); }} className="text-xs text-accent hover:underline flex items-center gap-1">
              <X className="h-3 w-3" /> Clear
            </button>
          )}
        </div>

        {/* Mobile card view */}
        <div className="md:hidden space-y-3">
          {filtered.map((c) => {
            const isExpanded = expandedCustomer === c.id;
            return (
              <div key={c.id} className="border border-border rounded-md overflow-hidden">
                <button
                  onClick={() => setExpandedCustomer(isExpanded ? null : c.id)}
                  className="w-full p-3 text-left flex items-center justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-medium text-sm truncate">{c.company}</span>
                      <span className="badge-info flex-shrink-0">{c.type}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{c.name}</p>
                    <p className="text-sm font-bold mt-1">{c.totalSpent}</p>
                  </div>
                  {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
                </button>
                {isExpanded && (
                  <div className="px-3 pb-3 border-t border-border pt-3 space-y-2 bg-secondary/30">
                    <a href={`mailto:${c.email}`} className="flex items-center gap-2 text-xs text-accent">
                      <Mail className="h-3 w-3" /> {c.email}
                    </a>
                    <a href={`tel:${c.phone}`} className="flex items-center gap-2 text-xs text-accent">
                      <Phone className="h-3 w-3" /> {c.phone}
                    </a>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Orders</span>
                      <span className="font-medium">{c.orders}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Last Order</span>
                      <span>{c.lastOrder}</span>
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
              {filtered.map((c) => (
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

        {filtered.length === 0 && (
          <div className="text-center py-8 text-sm text-muted-foreground">No customers found.</div>
        )}
      </div>
    </div>
  );
}
