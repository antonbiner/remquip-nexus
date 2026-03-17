import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search, X, ChevronDown, ChevronUp, RotateCcw, Package, CheckCircle, Clock,
  Download, ArrowLeft, Building2, AlertTriangle, XCircle, Truck, Eye,
  Filter, Calendar
} from "lucide-react";
import { returns, returnStatusLabels, returnReasonLabels, resolutionLabels } from "@/data/mockReturns";
import { customers } from "@/data/mockCustomers";
import type { Return, ReturnStatus, ReturnReason } from "@/types/admin";

// ─── STYLE MAPPINGS ───

const statusStyles: Record<ReturnStatus, string> = {
  requested: "bg-amber-500/10 text-amber-600 border-amber-200",
  approved: "bg-blue-500/10 text-blue-600 border-blue-200",
  received: "bg-purple-500/10 text-purple-600 border-purple-200",
  processing: "bg-cyan-500/10 text-cyan-600 border-cyan-200",
  completed: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  rejected: "bg-red-500/10 text-red-600 border-red-200",
};

const statusIcons: Record<ReturnStatus, React.ElementType> = {
  requested: Clock,
  approved: CheckCircle,
  received: Package,
  processing: RotateCcw,
  completed: CheckCircle,
  rejected: XCircle,
};

const reasonStyles: Record<ReturnReason, string> = {
  defective: "bg-red-500/10 text-red-600",
  wrong_item: "bg-amber-500/10 text-amber-600",
  damaged_shipping: "bg-orange-500/10 text-orange-600",
  not_as_described: "bg-blue-500/10 text-blue-600",
  changed_mind: "bg-slate-500/10 text-slate-600",
  other: "bg-gray-500/10 text-gray-600",
};

const statusFlow: ReturnStatus[] = ["requested", "approved", "received", "processing", "completed"];

export default function AdminReturns() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReturnStatus | "">("");
  const [reasonFilter, setReasonFilter] = useState<ReturnReason | "">("");
  const [expandedReturn, setExpandedReturn] = useState<string | null>(null);
  const [selectedReturns, setSelectedReturns] = useState<Set<string>>(new Set());
  const [returnStatuses, setReturnStatuses] = useState<Record<string, ReturnStatus>>({});

  const getStatus = (returnId: string, originalStatus: ReturnStatus): ReturnStatus =>
    returnStatuses[returnId] || originalStatus;

  const filtered = useMemo(() => {
    return returns.filter((r) => {
      const customer = customers.find(c => c.id === r.customerId);
      const status = getStatus(r.id, r.status);
      const matchesSearch = !search ||
        r.returnNumber.toLowerCase().includes(search.toLowerCase()) ||
        r.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        (customer?.companyName.toLowerCase().includes(search.toLowerCase()));
      const matchesStatus = !statusFilter || status === statusFilter;
      const matchesReason = !reasonFilter || r.reason === reasonFilter;
      return matchesSearch && matchesStatus && matchesReason;
    });
  }, [search, statusFilter, reasonFilter, returnStatuses]);

  const statusCounts = useMemo(() => ({
    all: returns.length,
    requested: returns.filter(r => getStatus(r.id, r.status) === "requested").length,
    approved: returns.filter(r => getStatus(r.id, r.status) === "approved").length,
    received: returns.filter(r => getStatus(r.id, r.status) === "received").length,
    processing: returns.filter(r => getStatus(r.id, r.status) === "processing").length,
    completed: returns.filter(r => getStatus(r.id, r.status) === "completed").length,
    rejected: returns.filter(r => getStatus(r.id, r.status) === "rejected").length,
  }), [returnStatuses]);

  function toggleSelect(id: string) {
    setSelectedReturns(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selectedReturns.size === filtered.length) {
      setSelectedReturns(new Set());
    } else {
      setSelectedReturns(new Set(filtered.map(r => r.id)));
    }
  }

  function handleBulkStatusChange(status: ReturnStatus) {
    const updates: Record<string, ReturnStatus> = {};
    selectedReturns.forEach(id => { updates[id] = status; });
    setReturnStatuses(prev => ({ ...prev, ...updates }));
    setSelectedReturns(new Set());
  }

  function exportCSV() {
    const rows = filtered.map(r => {
      const customer = customers.find(c => c.id === r.customerId);
      return `${r.returnNumber},${r.orderNumber},${customer?.companyName || ""},${r.subtotal},${getStatus(r.id, r.status)},${returnReasonLabels[r.reason].en},${new Date(r.requestedAt).toLocaleDateString()}`;
    });
    const csv = `RMA Number,Order,Customer,Amount,Status,Reason,Requested Date\n${rows.join("\n")}`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "returns.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display font-bold text-lg md:text-xl">Returns / RMA</h1>
          <p className="text-sm text-muted-foreground">Manage product returns and refund requests</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={exportCSV}
            className="px-3 py-2 border border-border rounded-sm text-xs font-medium hover:bg-secondary transition-colors flex items-center gap-1.5"
          >
            <Download className="h-3.5 w-3.5" /> Export CSV
          </button>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-3">
        <button
          onClick={() => setStatusFilter("")}
          className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${!statusFilter ? "bg-accent text-accent-foreground" : "bg-secondary hover:bg-secondary/80"}`}
        >
          All ({statusCounts.all})
        </button>
        <button
          onClick={() => setStatusFilter("requested")}
          className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors flex items-center gap-1 ${statusFilter === "requested" ? "bg-amber-500 text-white" : "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"}`}
        >
          <Clock className="h-3 w-3" /> Requested ({statusCounts.requested})
        </button>
        <button
          onClick={() => setStatusFilter("approved")}
          className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors flex items-center gap-1 ${statusFilter === "approved" ? "bg-blue-500 text-white" : "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20"}`}
        >
          <CheckCircle className="h-3 w-3" /> Approved ({statusCounts.approved})
        </button>
        <button
          onClick={() => setStatusFilter("received")}
          className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors flex items-center gap-1 ${statusFilter === "received" ? "bg-purple-500 text-white" : "bg-purple-500/10 text-purple-600 hover:bg-purple-500/20"}`}
        >
          <Package className="h-3 w-3" /> Received ({statusCounts.received})
        </button>
        <button
          onClick={() => setStatusFilter("processing")}
          className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors flex items-center gap-1 ${statusFilter === "processing" ? "bg-cyan-500 text-white" : "bg-cyan-500/10 text-cyan-600 hover:bg-cyan-500/20"}`}
        >
          <RotateCcw className="h-3 w-3" /> Processing ({statusCounts.processing})
        </button>
        <button
          onClick={() => setStatusFilter("completed")}
          className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors flex items-center gap-1 ${statusFilter === "completed" ? "bg-emerald-500 text-white" : "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"}`}
        >
          <CheckCircle className="h-3 w-3" /> Completed ({statusCounts.completed})
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search RMA#, order#, customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-border rounded-sm text-sm bg-background outline-none focus:ring-2 focus:ring-accent"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
        <select
          value={reasonFilter}
          onChange={(e) => setReasonFilter(e.target.value as ReturnReason | "")}
          className="px-3 py-2 border border-border rounded-sm text-sm bg-background outline-none min-w-[160px]"
        >
          <option value="">All Reasons</option>
          <option value="defective">Defective Product</option>
          <option value="wrong_item">Wrong Item Sent</option>
          <option value="damaged_shipping">Damaged in Shipping</option>
          <option value="not_as_described">Not as Described</option>
          <option value="changed_mind">Changed Mind</option>
        </select>
      </div>

      {/* Bulk Actions */}
      {selectedReturns.size > 0 && (
        <div className="flex items-center gap-3 p-3 bg-accent/10 rounded-sm border border-accent/20">
          <span className="text-sm font-medium">{selectedReturns.size} selected</span>
          <div className="flex gap-2 ml-auto">
            <button onClick={() => handleBulkStatusChange("approved")} className="px-3 py-1.5 text-xs bg-blue-500 text-white rounded-sm hover:bg-blue-600">
              Approve
            </button>
            <button onClick={() => handleBulkStatusChange("processing")} className="px-3 py-1.5 text-xs bg-cyan-500 text-white rounded-sm hover:bg-cyan-600">
              Mark Processing
            </button>
            <button onClick={() => handleBulkStatusChange("completed")} className="px-3 py-1.5 text-xs bg-emerald-500 text-white rounded-sm hover:bg-emerald-600">
              Mark Completed
            </button>
            <button onClick={() => setSelectedReturns(new Set())} className="px-3 py-1.5 text-xs border border-border rounded-sm hover:bg-secondary">
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Returns Table - Desktop */}
      <div className="hidden lg:block dashboard-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="pb-3 pr-4 w-8">
                <input
                  type="checkbox"
                  checked={selectedReturns.size === filtered.length && filtered.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded border-border"
                />
              </th>
              <th className="pb-3 pr-4 font-medium">RMA #</th>
              <th className="pb-3 pr-4 font-medium">Order</th>
              <th className="pb-3 pr-4 font-medium">Customer</th>
              <th className="pb-3 pr-4 font-medium">Reason</th>
              <th className="pb-3 pr-4 font-medium">Items</th>
              <th className="pb-3 pr-4 font-medium text-right">Amount</th>
              <th className="pb-3 pr-4 font-medium">Status</th>
              <th className="pb-3 pr-4 font-medium">Requested</th>
              <th className="pb-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((ret) => {
              const customer = customers.find(c => c.id === ret.customerId);
              const status = getStatus(ret.id, ret.status);
              const StatusIcon = statusIcons[status];

              return (
                <tr key={ret.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="py-3 pr-4">
                    <input
                      type="checkbox"
                      checked={selectedReturns.has(ret.id)}
                      onChange={() => toggleSelect(ret.id)}
                      className="rounded border-border"
                    />
                  </td>
                  <td className="py-3 pr-4">
                    <span className="font-mono text-xs font-medium">{ret.returnNumber}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <Link to={`/admin/orders?orderId=${ret.orderId}`} className="font-mono text-xs text-accent hover:underline">
                      {ret.orderNumber}
                    </Link>
                  </td>
                  <td className="py-3 pr-4">
                    {customer && (
                      <Link to={`/admin/customers/${customer.id}`} className="hover:text-accent">
                        <p className="font-medium text-sm">{customer.companyName}</p>
                        <p className="text-xs text-muted-foreground">{customer.firstName} {customer.lastName}</p>
                      </Link>
                    )}
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-xs font-medium ${reasonStyles[ret.reason]}`}>
                      {ret.reason === "defective" && <AlertTriangle className="h-3 w-3" />}
                      {returnReasonLabels[ret.reason].en}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-sm">{ret.items.length} item{ret.items.length > 1 ? "s" : ""}</td>
                  <td className="py-3 pr-4 text-right font-medium">C${ret.subtotal.toFixed(2)}</td>
                  <td className="py-3 pr-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-xs font-medium border ${statusStyles[status]}`}>
                      <StatusIcon className="h-3 w-3" />
                      {returnStatusLabels[status].en}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-sm text-muted-foreground">
                    {new Date(ret.requestedAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 text-right">
                    <Link
                      to={`/admin/returns/${ret.id}`}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-accent hover:bg-accent/10 rounded-sm transition-colors"
                    >
                      <Eye className="h-3.5 w-3.5" /> View
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <RotateCcw className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No returns found</p>
          </div>
        )}
      </div>

      {/* Returns Cards - Mobile */}
      <div className="lg:hidden space-y-3">
        {filtered.map((ret) => {
          const customer = customers.find(c => c.id === ret.customerId);
          const status = getStatus(ret.id, ret.status);
          const isExpanded = expandedReturn === ret.id;
          const StatusIcon = statusIcons[status];

          return (
            <div key={ret.id} className="dashboard-card">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selectedReturns.has(ret.id)}
                    onChange={() => toggleSelect(ret.id)}
                    className="mt-1 rounded border-border"
                  />
                  <div>
                    <p className="font-mono text-xs font-medium">{ret.returnNumber}</p>
                    <Link to={`/admin/orders?orderId=${ret.orderId}`} className="text-xs text-accent hover:underline">
                      {ret.orderNumber}
                    </Link>
                    {customer && (
                      <p className="text-sm mt-1">{customer.companyName}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-xs font-medium border ${statusStyles[status]}`}>
                    <StatusIcon className="h-3 w-3" />
                    {returnStatusLabels[status].en}
                  </span>
                  <p className="text-sm font-bold mt-1">C${ret.subtotal.toFixed(2)}</p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-xs font-medium ${reasonStyles[ret.reason]}`}>
                  {returnReasonLabels[ret.reason].en}
                </span>
                <button
                  onClick={() => setExpandedReturn(isExpanded ? null : ret.id)}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  {isExpanded ? "Less" : "More"}
                </button>
              </div>

              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-border space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Items</p>
                    {ret.items.map(item => (
                      <div key={item.id} className="flex items-center gap-2 text-sm">
                        {item.productImage && (
                          <img src={item.productImage} alt="" className="w-8 h-8 rounded object-cover" />
                        )}
                        <div>
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity} · {item.condition}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {ret.resolution && (
                    <div>
                      <p className="text-xs text-muted-foreground">Resolution</p>
                      <p className="text-sm font-medium">{resolutionLabels[ret.resolution].en}</p>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Link
                      to={`/admin/returns/${ret.id}`}
                      className="flex-1 px-3 py-2 btn-accent rounded-sm text-xs font-medium text-center"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground dashboard-card">
            <RotateCcw className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No returns found</p>
          </div>
        )}
      </div>
    </div>
  );
}
