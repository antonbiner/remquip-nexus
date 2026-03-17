import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Eye, Search, X, Mail, Phone, ChevronDown, ChevronUp, Building2, TrendingUp, Users, AlertTriangle, Download } from "lucide-react";
import { customers, customerStats } from "@/data/mockCustomers";
import type { Customer, CustomerType, CustomerStatus, CustomerLifecycleStage, CustomerValueSegment } from "@/types/admin";

// ─── STYLE MAPPINGS ───

const statusStyles: Record<string, string> = {
  active: "badge-success",
  inactive: "badge-warning",
  suspended: "badge-destructive",
};

const customerTypeStyles: Record<string, string> = {
  fleet: "bg-blue-500/10 text-blue-600 border-blue-200",
  wholesale: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  distributor: "bg-purple-500/10 text-purple-600 border-purple-200",
  enterprise: "bg-amber-500/10 text-amber-600 border-amber-200",
};

const lifecycleStyles: Record<string, string> = {
  lead: "bg-blue-500/10 text-blue-600",
  active: "bg-emerald-500/10 text-emerald-600",
  "at-risk": "bg-amber-500/10 text-amber-600",
  churned: "bg-red-500/10 text-red-600",
};

const valueSegmentStyles: Record<string, string> = {
  high: "text-emerald-600",
  medium: "text-blue-600",
  low: "text-muted-foreground",
};

export default function AdminCustomers() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<CustomerType | "">("");
  const [statusFilter, setStatusFilter] = useState<CustomerStatus | "">("");
  const [lifecycleFilter, setLifecycleFilter] = useState<CustomerLifecycleStage | "">("");
  const [valueFilter, setValueFilter] = useState<CustomerValueSegment | "">("");
  const [expandedCustomer, setExpandedCustomer] = useState<string | null>(null);
  const [selectedCustomers, setSelectedCustomers] = useState<Set<string>>(new Set());

  // Filter customers
  const filtered = useMemo(() => {
    return customers.filter((c) => {
      const matchesSearch = !search || 
        c.companyName.toLowerCase().includes(search.toLowerCase()) || 
        c.firstName.toLowerCase().includes(search.toLowerCase()) ||
        c.lastName.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase());
      const matchesType = !typeFilter || c.customerType === typeFilter;
      const matchesStatus = !statusFilter || c.status === statusFilter;
      const matchesLifecycle = !lifecycleFilter || c.lifecycleStage === lifecycleFilter;
      const matchesValue = !valueFilter || c.valueSegment === valueFilter;
      return matchesSearch && matchesType && matchesStatus && matchesLifecycle && matchesValue;
    });
  }, [search, typeFilter, statusFilter, lifecycleFilter, valueFilter]);

  // Counts
  const counts = useMemo(() => ({
    total: customers.length,
    fleet: customers.filter(c => c.customerType === "fleet").length,
    wholesale: customers.filter(c => c.customerType === "wholesale").length,
    distributor: customers.filter(c => c.customerType === "distributor").length,
    enterprise: customers.filter(c => c.customerType === "enterprise").length,
    active: customers.filter(c => c.lifecycleStage === "active").length,
    atRisk: customers.filter(c => c.lifecycleStage === "at-risk").length,
    high: customers.filter(c => c.valueSegment === "high").length,
  }), []);

  const totalRevenue = useMemo(() => 
    Object.values(customerStats).reduce((sum, stats) => sum + stats.totalSpent, 0)
  , []);

  const clearFilters = () => {
    setSearch("");
    setTypeFilter("");
    setStatusFilter("");
    setLifecycleFilter("");
    setValueFilter("");
  };

  const hasFilters = search || typeFilter || statusFilter || lifecycleFilter || valueFilter;

  const toggleSelect = (id: string) => {
    setSelectedCustomers(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedCustomers.size === filtered.length) {
      setSelectedCustomers(new Set());
    } else {
      setSelectedCustomers(new Set(filtered.map(c => c.id)));
    }
  };

  const exportCSV = () => {
    const data = filtered.map(c => {
      const stats = customerStats[c.id];
      return `${c.companyName},"${c.firstName} ${c.lastName}",${c.email},${c.customerType},${c.status},${stats?.totalOrders || 0},${stats?.totalSpent || 0}`;
    });
    const csv = `Company,Contact,Email,Type,Status,Orders,Total Spent\n${data.join("\n")}`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "customers.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-lg md:text-xl">Customer CRM</h2>
        <button onClick={exportCSV} className="px-3 py-2 border border-border rounded-sm text-xs font-medium hover:bg-secondary transition-colors flex items-center gap-1.5">
          <Download className="h-3.5 w-3.5" /> Export CSV
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
        <div className="dashboard-card">
          <div className="flex items-center gap-1.5 mb-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Total Customers</p>
          </div>
          <p className="text-2xl font-bold font-display">{counts.total}</p>
        </div>
        <div className="dashboard-card">
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            <p className="text-xs text-muted-foreground">High Value</p>
          </div>
          <p className="text-2xl font-bold font-display text-emerald-600">{counts.high}</p>
        </div>
        <div className="dashboard-card">
          <div className="flex items-center gap-1.5 mb-1">
            <Building2 className="h-4 w-4 text-purple-600" />
            <p className="text-xs text-muted-foreground">Enterprise</p>
          </div>
          <p className="text-2xl font-bold font-display">{counts.enterprise}</p>
        </div>
        <div className="dashboard-card">
          <div className="flex items-center gap-1.5 mb-1">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <p className="text-xs text-muted-foreground">At Risk</p>
          </div>
          <p className="text-2xl font-bold font-display text-amber-600">{counts.atRisk}</p>
        </div>
        <div className="dashboard-card">
          <p className="text-xs text-muted-foreground mb-1">Total Revenue</p>
          <p className="text-2xl font-bold font-display">C${totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedCustomers.size > 0 && (
        <div className="dashboard-card flex flex-wrap items-center gap-3 bg-accent/5 border-accent/30">
          <span className="text-sm font-medium">{selectedCustomers.size} selected</span>
          <button className="px-3 py-1.5 border border-border rounded-sm text-xs font-medium hover:bg-secondary flex items-center gap-1">
            <Mail className="h-3 w-3" /> Email Campaign
          </button>
          <button className="px-3 py-1.5 border border-border rounded-sm text-xs font-medium hover:bg-secondary">Update Tier</button>
          <button onClick={exportCSV} className="px-3 py-1.5 border border-border rounded-sm text-xs font-medium hover:bg-secondary">Export Selected</button>
          <button onClick={() => setSelectedCustomers(new Set())} className="text-xs text-muted-foreground hover:text-foreground ml-auto">Clear</button>
        </div>
      )}

      <div className="dashboard-card">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customers..."
              className="w-full pl-10 pr-4 py-2 border border-border rounded-sm text-sm bg-background outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as CustomerType | "")}
            className="border border-border rounded-sm px-3 py-2 text-sm bg-background outline-none"
          >
            <option value="">All Types</option>
            <option value="fleet">Fleet ({counts.fleet})</option>
            <option value="wholesale">Wholesale ({counts.wholesale})</option>
            <option value="distributor">Distributor ({counts.distributor})</option>
            <option value="enterprise">Enterprise ({counts.enterprise})</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as CustomerStatus | "")}
            className="border border-border rounded-sm px-3 py-2 text-sm bg-background outline-none"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
          <select
            value={valueFilter}
            onChange={(e) => setValueFilter(e.target.value as CustomerValueSegment | "")}
            className="border border-border rounded-sm px-3 py-2 text-sm bg-background outline-none"
          >
            <option value="">All Value</option>
            <option value="high">High Value</option>
            <option value="medium">Medium Value</option>
            <option value="low">Low Value</option>
          </select>
          {hasFilters && (
            <button onClick={clearFilters} className="text-xs text-accent hover:underline flex items-center gap-1">
              <X className="h-3 w-3" /> Clear
            </button>
          )}
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {filtered.map((c) => {
            const stats = customerStats[c.id];
            const isExpanded = expandedCustomer === c.id;
            return (
              <div key={c.id} className="border border-border rounded-md overflow-hidden">
                <button
                  onClick={() => setExpandedCustomer(isExpanded ? null : c.id)}
                  className="w-full p-3 text-left flex items-center justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-medium text-sm truncate">{c.companyName}</span>
                      <span className={`px-1.5 py-0.5 rounded-sm text-xs font-medium border ${customerTypeStyles[c.customerType]}`}>
                        {c.customerType}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{c.firstName} {c.lastName}</p>
                    <p className="text-sm font-bold mt-1">C${stats?.totalSpent.toLocaleString() || 0}</p>
                  </div>
                  {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
                </button>
                {isExpanded && (
                  <div className="px-3 pb-3 border-t border-border pt-3 space-y-2 bg-secondary/30">
                    <a href={`mailto:${c.email}`} className="flex items-center gap-2 text-xs text-accent">
                      <Mail className="h-3 w-3" /> {c.email}
                    </a>
                    {c.phone && (
                      <a href={`tel:${c.phone}`} className="flex items-center gap-2 text-xs text-accent">
                        <Phone className="h-3 w-3" /> {c.phone}
                      </a>
                    )}
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Orders</span>
                      <span className="font-medium">{stats?.totalOrders || 0}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Last Order</span>
                      <span>{stats?.lastOrderDate ? new Date(stats.lastOrderDate).toLocaleDateString() : "N/A"}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Status</span>
                      <span className={statusStyles[c.status]}>{c.status}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Value</span>
                      <span className={`font-medium capitalize ${valueSegmentStyles[c.valueSegment]}`}>{c.valueSegment}</span>
                    </div>
                    <Link
                      to={`/admin/customers/${c.id}`}
                      className="w-full btn-accent text-xs py-2 rounded-sm font-medium mt-2 flex items-center justify-center gap-1"
                    >
                      <Eye className="h-3.5 w-3.5" /> View Profile
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="table-header">
                <th className="text-left px-3 py-2 w-8">
                  <input
                    type="checkbox"
                    checked={selectedCustomers.size === filtered.length && filtered.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-border"
                  />
                </th>
                <th className="text-left px-3 py-2">Company</th>
                <th className="text-left px-3 py-2">Contact</th>
                <th className="text-left px-3 py-2">Type</th>
                <th className="text-left px-3 py-2">Status</th>
                <th className="text-left px-3 py-2">Value</th>
                <th className="text-right px-3 py-2">Orders</th>
                <th className="text-right px-3 py-2">Total Spent</th>
                <th className="text-left px-3 py-2">Last Order</th>
                <th className="text-right px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((c) => {
                const stats = customerStats[c.id];
                return (
                  <tr key={c.id} className="hover:bg-secondary/50 transition-colors">
                    <td className="px-3 py-3">
                      <input
                        type="checkbox"
                        checked={selectedCustomers.has(c.id)}
                        onChange={() => toggleSelect(c.id)}
                        className="rounded border-border"
                      />
                    </td>
                    <td className="px-3 py-3">
                      <Link to={`/admin/customers/${c.id}`} className="font-medium hover:text-accent">
                        {c.companyName}
                      </Link>
                    </td>
                    <td className="px-3 py-3">
                      <div>{c.firstName} {c.lastName}</div>
                      <div className="text-xs text-muted-foreground">{c.email}</div>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`px-2 py-0.5 rounded-sm text-xs font-medium border ${customerTypeStyles[c.customerType]}`}>
                        {c.customerType}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className={statusStyles[c.status]}>{c.status}</span>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`font-medium capitalize ${valueSegmentStyles[c.valueSegment]}`}>
                        {c.valueSegment}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right">{stats?.totalOrders || 0}</td>
                    <td className="px-3 py-3 text-right font-medium">C${stats?.totalSpent.toLocaleString() || 0}</td>
                    <td className="px-3 py-3 text-muted-foreground">
                      {stats?.lastOrderDate ? new Date(stats.lastOrderDate).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <Link
                        to={`/admin/customers/${c.id}`}
                        className="p-1.5 hover:bg-secondary rounded-sm transition-colors inline-flex"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-8 text-sm text-muted-foreground">No customers found.</div>
        )}

        <div className="mt-4 text-xs text-muted-foreground">
          Showing {filtered.length} of {customers.length} customers
        </div>
      </div>
    </div>
  );
}
