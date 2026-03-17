import React, { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { 
  Eye, Search, X, ChevronDown, ChevronUp, Package, Truck, CheckCircle, Clock, 
  Printer, Download, Mail, ArrowLeft, MapPin, CreditCard, FileText,
  Building2, User, ShoppingBag, TrendingUp, ExternalLink
} from "lucide-react";
import { orders, getOrdersByCustomerId } from "@/data/mockOrders";
import { customers, customerStats } from "@/data/mockCustomers";
import type { Order, OrderStatus } from "@/types/admin";

// ─── STYLE MAPPINGS ───

const statusStyles: Record<string, string> = {
  pending: "badge-warning",
  processing: "badge-info",
  shipped: "badge-info",
  completed: "badge-success",
  cancelled: "badge-destructive",
  refunded: "badge-destructive",
  paid: "badge-success",
};

const customerTypeStyles: Record<string, string> = {
  fleet: "bg-blue-500/10 text-blue-600 border-blue-200",
  wholesale: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  distributor: "bg-purple-500/10 text-purple-600 border-purple-200",
  enterprise: "bg-amber-500/10 text-amber-600 border-amber-200",
};

const statusFlow: OrderStatus[] = ["pending", "processing", "shipped", "completed"];
const statusIcons: Record<string, React.ElementType> = {
  pending: Clock,
  processing: Package,
  shipped: Truck,
  completed: CheckCircle,
};

const carriers = ["Purolator", "Canada Post", "UPS", "FedEx", "Day & Ross"];

export default function AdminOrders() {
  const [searchParams] = useSearchParams();
  const orderIdFromUrl = searchParams.get("orderId");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(orderIdFromUrl);
  const [orderStatuses, setOrderStatuses] = useState<Record<string, OrderStatus>>({});
  const [newNote, setNewNote] = useState("");
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [showShipment, setShowShipment] = useState<string | null>(null);
  const [shipmentCarrier, setShipmentCarrier] = useState("Purolator");
  const [shipmentTracking, setShipmentTracking] = useState("");

  const getStatus = (orderId: string, originalStatus: OrderStatus): OrderStatus => 
    orderStatuses[orderId] || originalStatus;

  const selectedOrder = useMemo(() => {
    if (!selectedOrderId) return null;
    return orders.find(o => o.id === selectedOrderId) || null;
  }, [selectedOrderId]);

  const selectedCustomer = useMemo(() => {
    if (!selectedOrder) return null;
    return customers.find(c => c.id === selectedOrder.customerId) || null;
  }, [selectedOrder]);

  const selectedCustomerStats = useMemo(() => {
    if (!selectedCustomer) return null;
    return customerStats[selectedCustomer.id] || null;
  }, [selectedCustomer]);

  const customerOrderHistory = useMemo(() => {
    if (!selectedOrder) return [];
    return getOrdersByCustomerId(selectedOrder.customerId).filter(o => o.id !== selectedOrder.id);
  }, [selectedOrder]);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const status = getStatus(o.id, o.status);
      const customer = customers.find(c => c.id === o.customerId);
      const matchesSearch = !search || 
        o.orderNumber.toLowerCase().includes(search.toLowerCase()) || 
        (customer?.companyName.toLowerCase().includes(search.toLowerCase()));
      const matchesStatus = !statusFilter || status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter, orderStatuses]);

  const statusCounts = useMemo(() => ({
    all: orders.length,
    pending: orders.filter(o => getStatus(o.id, o.status) === "pending").length,
    processing: orders.filter(o => getStatus(o.id, o.status) === "processing").length,
    shipped: orders.filter(o => getStatus(o.id, o.status) === "shipped").length,
    completed: orders.filter(o => getStatus(o.id, o.status) === "completed").length,
  }), [orderStatuses]);

  function handleStatusChange(orderId: string, newStatus: OrderStatus) {
    setOrderStatuses(prev => ({ ...prev, [orderId]: newStatus }));
  }

  function toggleSelect(id: string) {
    setSelectedOrders(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selectedOrders.size === filtered.length) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(filtered.map(o => o.id)));
    }
  }

  function handleBulkStatusChange(status: OrderStatus) {
    const updates: Record<string, OrderStatus> = {};
    selectedOrders.forEach(id => { updates[id] = status; });
    setOrderStatuses(prev => ({ ...prev, ...updates }));
    setSelectedOrders(new Set());
  }

  function exportCSV() {
    const rows = filtered.map(o => {
      const customer = customers.find(c => c.id === o.customerId);
      return `${o.orderNumber},${customer?.companyName || ""},${customer?.email || ""},${o.total},${getStatus(o.id, o.status)},${new Date(o.createdAt).toLocaleDateString()}`;
    });
    const csv = `Order,Customer,Email,Total,Status,Date\n${rows.join("\n")}`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "orders.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  function handleShipOrder(orderId: string) {
    handleStatusChange(orderId, "shipped");
    setShowShipment(null);
    setShipmentTracking("");
  }

  // ── Order Detail View ──
  if (selectedOrder) {
    const status = getStatus(selectedOrder.id, selectedOrder.status);
    const currentIdx = statusFlow.indexOf(status);

    return (
      <div className="space-y-6">
        <button onClick={() => setSelectedOrderId(null)} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Back to Orders
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="font-display font-bold text-lg md:text-xl">{selectedOrder.orderNumber}</h2>
            <p className="text-sm text-muted-foreground">
              Placed on {new Date(selectedOrder.createdAt).toLocaleDateString()} · {selectedOrder.paymentMethod.replace("_", " ")}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="px-3 py-2 border border-border rounded-sm text-xs font-medium hover:bg-secondary transition-colors flex items-center gap-1.5">
              <Printer className="h-3.5 w-3.5" /> Print Invoice
            </button>
            <button className="px-3 py-2 border border-border rounded-sm text-xs font-medium hover:bg-secondary transition-colors flex items-center gap-1.5">
              <Download className="h-3.5 w-3.5" /> Export PDF
            </button>
            <button className="px-3 py-2 border border-border rounded-sm text-xs font-medium hover:bg-secondary transition-colors flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" /> Email Customer
            </button>
            {status === "processing" && (
              <button onClick={() => setShowShipment(selectedOrder.id)} className="px-3 py-2 btn-accent rounded-sm text-xs font-medium flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5" /> Ship Order
              </button>
            )}
          </div>
        </div>

        {/* Shipment dialog */}
        {showShipment === selectedOrder.id && (
          <div className="dashboard-card border-accent">
            <h3 className="font-display font-bold text-sm uppercase mb-4 flex items-center gap-1.5">
              <Truck className="h-4 w-4 text-accent" /> Assign Shipping
            </h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Carrier</label>
                <select value={shipmentCarrier} onChange={(e) => setShipmentCarrier(e.target.value)} className="w-full px-3 py-2 border border-border rounded-sm text-sm bg-background outline-none">
                  {carriers.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tracking Number</label>
                <input value={shipmentTracking} onChange={(e) => setShipmentTracking(e.target.value)} placeholder="e.g. 1Z999AA1..." className="w-full px-3 py-2 border border-border rounded-sm text-sm bg-background outline-none focus:ring-2 focus:ring-accent font-mono" />
              </div>
              <div className="flex items-end gap-2">
                <button onClick={() => handleShipOrder(selectedOrder.id)} className="btn-accent px-4 py-2 rounded-sm text-sm font-medium flex-1">Mark Shipped</button>
                <button onClick={() => setShowShipment(null)} className="px-3 py-2 border border-border rounded-sm text-sm hover:bg-secondary">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Status timeline */}
        <div className="dashboard-card">
          <h3 className="font-display font-bold text-sm uppercase mb-4">Order Status</h3>
          <div className="flex items-center gap-1 sm:gap-2 mb-4 overflow-x-auto pb-2">
            {statusFlow.map((s, i) => {
              const Icon = statusIcons[s];
              const isActive = i <= currentIdx;
              const isCurrent = s === status;
              return (
                <React.Fragment key={s}>
                  {i > 0 && <div className={`h-0.5 flex-1 min-w-4 ${i <= currentIdx ? "bg-accent" : "bg-border"}`} />}
                  <button
                    onClick={() => handleStatusChange(selectedOrder.id, s)}
                    className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-sm text-xs font-medium whitespace-nowrap transition-colors ${
                      isCurrent ? "bg-accent text-accent-foreground" : isActive ? "bg-accent/20 text-accent" : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline capitalize">{s}</span>
                  </button>
                </React.Fragment>
              );
            })}
          </div>
          {selectedOrder.shipments.length > 0 && (
            <div className="flex items-center gap-2 text-sm bg-secondary/50 p-3 rounded-sm">
              <Truck className="h-4 w-4 text-accent flex-shrink-0" />
              <span className="text-muted-foreground">Tracking:</span>
              <span className="font-mono text-xs">{selectedOrder.shipments[0].trackingNumber || "Not yet assigned"}</span>
              {selectedOrder.shipments[0].carrier && <span className="text-xs text-muted-foreground">({selectedOrder.shipments[0].carrier})</span>}
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2 dashboard-card">
            <h3 className="font-display font-bold text-sm uppercase mb-4">Items</h3>
            <div className="space-y-3">
              {selectedOrder.items.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {p.productImage && (
                      <img src={p.productImage} alt="" className="w-10 h-10 rounded-sm object-cover bg-secondary flex-shrink-0" />
                    )}
                    <div className="min-w-0">
                      <Link to={`/admin/products/${p.productId}`} className="text-sm font-medium hover:text-accent">
                        {p.productName}
                      </Link>
                      <p className="text-xs text-muted-foreground font-mono">{p.sku}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <p className="text-sm font-medium">C${p.totalPrice.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">{p.quantity} × C${p.unitPrice.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>C${selectedOrder.subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>C${selectedOrder.tax.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{selectedOrder.shippingCost === 0 ? "Free" : `C$${selectedOrder.shippingCost.toFixed(2)}`}</span></div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-600"><span>Discount</span><span>-C${selectedOrder.discount.toFixed(2)}</span></div>
              )}
              <div className="flex justify-between font-bold text-base pt-2 border-t border-border"><span>Total</span><span>C${selectedOrder.total.toFixed(2)}</span></div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Customer Card - Enhanced */}
            {selectedCustomer && (
              <div className="dashboard-card border-accent/30">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display font-bold text-sm uppercase">Customer</h3>
                  <Link 
                    to={`/admin/customers/${selectedCustomer.id}`}
                    className="text-xs text-accent hover:underline flex items-center gap-1"
                  >
                    View Profile <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-md bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{selectedCustomer.companyName}</p>
                    <p className="text-xs text-muted-foreground">{selectedCustomer.firstName} {selectedCustomer.lastName}</p>
                    <span className={`inline-block mt-1 px-1.5 py-0.5 rounded-sm text-xs font-medium border ${customerTypeStyles[selectedCustomer.customerType]}`}>
                      {selectedCustomer.customerType}
                    </span>
                  </div>
                </div>
                <div className="space-y-1.5 text-sm">
                  <a href={`mailto:${selectedCustomer.email}`} className="flex items-center gap-2 text-accent hover:underline">
                    <Mail className="h-3.5 w-3.5" /> {selectedCustomer.email}
                  </a>
                  {selectedCustomer.phone && (
                    <a href={`tel:${selectedCustomer.phone}`} className="flex items-center gap-2 text-muted-foreground">
                      <User className="h-3.5 w-3.5" /> {selectedCustomer.phone}
                    </a>
                  )}
                </div>
                {/* Customer Stats */}
                {selectedCustomerStats && (
                  <div className="mt-3 pt-3 border-t border-border grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Total Orders</p>
                      <p className="text-sm font-bold">{selectedCustomerStats.totalOrders}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Spent</p>
                      <p className="text-sm font-bold">C${selectedCustomerStats.totalSpent.toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Customer Order History */}
            {customerOrderHistory.length > 0 && (
              <div className="dashboard-card">
                <h3 className="font-display font-bold text-sm uppercase mb-3 flex items-center gap-1.5">
                  <ShoppingBag className="h-3.5 w-3.5" /> Other Orders
                </h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {customerOrderHistory.slice(0, 5).map((order) => (
                    <button
                      key={order.id}
                      onClick={() => setSelectedOrderId(order.id)}
                      className="w-full flex items-center justify-between py-2 px-2 -mx-2 rounded-sm hover:bg-secondary/50 transition-colors text-left"
                    >
                      <div>
                        <p className="text-xs font-mono">{order.orderNumber}</p>
                        <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <span className={`${statusStyles[order.status]} text-xs`}>{order.status}</span>
                        <p className="text-xs font-medium mt-0.5">C${order.total.toFixed(2)}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Shipping Address */}
            <div className="dashboard-card">
              <h3 className="font-display font-bold text-sm uppercase mb-3 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> Shipping Address
              </h3>
              <p className="text-sm">{selectedOrder.shippingAddress.addressLine1}</p>
              {selectedOrder.shippingAddress.addressLine2 && <p className="text-sm">{selectedOrder.shippingAddress.addressLine2}</p>}
              <p className="text-sm">{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.province} {selectedOrder.shippingAddress.postalCode}</p>
              <p className="text-sm text-muted-foreground">{selectedOrder.shippingAddress.country}</p>
            </div>

            {/* Payment */}
            <div className="dashboard-card">
              <h3 className="font-display font-bold text-sm uppercase mb-3 flex items-center gap-1.5">
                <CreditCard className="h-3.5 w-3.5" /> Payment
              </h3>
              <p className="text-sm capitalize">{selectedOrder.paymentMethod.replace("_", " ")}</p>
              <span className={statusStyles[selectedOrder.paymentStatus]}>{selectedOrder.paymentStatus}</span>
            </div>
          </div>
        </div>

        {/* Activity & Notes */}
        <div className="dashboard-card">
          <h3 className="font-display font-bold text-sm uppercase mb-4 flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5" /> Activity & Notes
          </h3>
          <div className="space-y-3 mb-4">
            {selectedOrder.notes.map((note) => (
              <div key={note.id} className="flex gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">{new Date(note.date).toLocaleString()} · {note.user}</p>
                  <p className="text-sm">{note.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="Add a note..." className="flex-1 px-3 py-2 border border-border rounded-sm text-sm bg-background outline-none focus:ring-2 focus:ring-accent" />
            <button onClick={() => setNewNote("")} className="btn-accent px-4 py-2 rounded-sm text-sm font-medium">Add</button>
          </div>
        </div>
      </div>
    );
  }

  // ── Order List View ──
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-lg md:text-xl">Order Management</h2>
        <button onClick={exportCSV} className="px-3 py-2 border border-border rounded-sm text-xs font-medium hover:bg-secondary transition-colors flex items-center gap-1.5">
          <Download className="h-3.5 w-3.5" /> Export CSV
        </button>
      </div>

      {/* Status tabs */}
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

      {/* Bulk actions */}
      {selectedOrders.size > 0 && (
        <div className="dashboard-card flex flex-wrap items-center gap-3 bg-accent/5 border-accent/30">
          <span className="text-sm font-medium">{selectedOrders.size} selected</span>
          <button onClick={() => handleBulkStatusChange("processing")} className="px-3 py-1.5 border border-border rounded-sm text-xs font-medium hover:bg-secondary">→ Processing</button>
          <button onClick={() => handleBulkStatusChange("shipped")} className="px-3 py-1.5 border border-border rounded-sm text-xs font-medium hover:bg-secondary">→ Shipped</button>
          <button onClick={() => handleBulkStatusChange("completed")} className="px-3 py-1.5 border border-border rounded-sm text-xs font-medium hover:bg-secondary">→ Completed</button>
          <button onClick={exportCSV} className="px-3 py-1.5 border border-border rounded-sm text-xs font-medium hover:bg-secondary flex items-center gap-1"><Download className="h-3 w-3" /> Export</button>
          <button onClick={() => setSelectedOrders(new Set())} className="ml-auto text-xs text-muted-foreground hover:text-foreground">Clear</button>
        </div>
      )}

      <div className="dashboard-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search orders or customers..." className="w-full pl-10 pr-4 py-2 border border-border rounded-sm text-sm bg-background outline-none focus:ring-2 focus:ring-accent" />
          </div>
          {search && (
            <button onClick={() => setSearch("")} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
          )}
        </div>

        {/* Mobile card view */}
        <div className="md:hidden space-y-3">
          {filtered.map((o) => {
            const status = getStatus(o.id, o.status);
            const customer = customers.find(c => c.id === o.customerId);
            const isExpanded = expandedOrder === o.id;
            return (
              <div key={o.id} className="border border-border rounded-md overflow-hidden">
                <button onClick={() => setExpandedOrder(isExpanded ? null : o.id)} className="w-full p-3 text-left flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm font-mono">{o.orderNumber}</span>
                      <span className={statusStyles[status]}>{status}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{customer?.companyName}</p>
                    <p className="text-sm font-bold mt-0.5">C${o.total.toFixed(2)}</p>
                  </div>
                  {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </button>
                {isExpanded && (
                  <div className="px-3 pb-3 border-t border-border pt-3 space-y-2 bg-secondary/30">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Customer</span>
                      <Link to={`/admin/customers/${o.customerId}`} className="text-accent hover:underline">
                        {customer?.companyName}
                      </Link>
                    </div>
                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">Payment</span><span>{o.paymentMethod.replace("_", " ")}</span></div>
                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">Date</span><span>{new Date(o.createdAt).toLocaleDateString()}</span></div>
                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">Items</span><span>{o.items.length}</span></div>
                    {o.shipments[0]?.trackingNumber && (
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Tracking</span>
                        <span className="font-mono">{o.shipments[0].trackingNumber}</span>
                      </div>
                    )}
                    <div className="flex gap-2 pt-2">
                      <button onClick={() => setSelectedOrderId(o.id)} className="flex-1 btn-accent text-xs py-2 rounded-sm font-medium">View Details</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto -mx-6 px-6">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="table-header">
                <th className="text-left px-3 py-2 w-8">
                  <input type="checkbox" checked={selectedOrders.size === filtered.length && filtered.length > 0} onChange={toggleSelectAll} className="rounded-sm border-border accent-accent" />
                </th>
                <th className="text-left px-3 py-2">Order</th>
                <th className="text-left px-3 py-2">Customer</th>
                <th className="text-left px-3 py-2">Type</th>
                <th className="text-right px-3 py-2">Total</th>
                <th className="text-left px-3 py-2">Status</th>
                <th className="text-left px-3 py-2">Payment</th>
                <th className="text-left px-3 py-2">Date</th>
                <th className="text-right px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((order) => {
                const status = getStatus(order.id, order.status);
                const customer = customers.find(c => c.id === order.customerId);
                return (
                  <tr key={order.id} className={`hover:bg-secondary/50 transition-colors ${selectedOrders.has(order.id) ? "bg-accent/5" : ""}`}>
                    <td className="px-3 py-2.5">
                      <input type="checkbox" checked={selectedOrders.has(order.id)} onChange={() => toggleSelect(order.id)} className="rounded-sm border-border accent-accent" />
                    </td>
                    <td className="px-3 py-2.5 font-medium text-sm font-mono">{order.orderNumber}</td>
                    <td className="px-3 py-2.5">
                      <Link to={`/admin/customers/${order.customerId}`} className="hover:text-accent">
                        <p className="text-sm font-medium">{customer?.companyName}</p>
                        <p className="text-xs text-muted-foreground">{customer?.firstName} {customer?.lastName}</p>
                      </Link>
                    </td>
                    <td className="px-3 py-2.5">
                      {customer && (
                        <span className={`px-1.5 py-0.5 rounded-sm text-xs font-medium border ${customerTypeStyles[customer.customerType]}`}>
                          {customer.customerType}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 font-medium text-sm text-right">C${order.total.toFixed(2)}</td>
                    <td className="px-3 py-2.5"><span className={statusStyles[status]}>{status}</span></td>
                    <td className="px-3 py-2.5"><span className={statusStyles[order.paymentStatus]}>{order.paymentStatus}</span></td>
                    <td className="px-3 py-2.5 text-muted-foreground text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-3 py-2.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {status === "processing" && (
                          <button onClick={() => setShowShipment(order.id)} className="p-1.5 hover:bg-secondary rounded-sm transition-colors text-accent" title="Ship">
                            <Truck className="h-4 w-4" />
                          </button>
                        )}
                        <button onClick={() => setSelectedOrderId(order.id)} className="p-1.5 hover:bg-secondary rounded-sm transition-colors" title="View">
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Inline shipment form */}
        {showShipment && !selectedOrder && (
          <div className="mt-4 p-4 border border-accent/30 rounded-sm bg-accent/5">
            <h4 className="font-display font-bold text-sm uppercase mb-3 flex items-center gap-1.5">
              <Truck className="h-4 w-4 text-accent" /> Ship Order {orders.find(o => o.id === showShipment)?.orderNumber}
            </h4>
            <div className="grid sm:grid-cols-3 gap-3">
              <select value={shipmentCarrier} onChange={(e) => setShipmentCarrier(e.target.value)} className="px-3 py-2 border border-border rounded-sm text-sm bg-background outline-none">
                {carriers.map(c => <option key={c}>{c}</option>)}
              </select>
              <input value={shipmentTracking} onChange={(e) => setShipmentTracking(e.target.value)} placeholder="Tracking number..." className="px-3 py-2 border border-border rounded-sm text-sm bg-background outline-none focus:ring-2 focus:ring-accent font-mono" />
              <div className="flex gap-2">
                <button onClick={() => handleShipOrder(showShipment)} className="btn-accent px-4 py-2 rounded-sm text-sm font-medium flex-1">Ship</button>
                <button onClick={() => setShowShipment(null)} className="px-3 py-2 border border-border rounded-sm text-sm hover:bg-secondary">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {filtered.length === 0 && <div className="text-center py-8 text-sm text-muted-foreground">No orders found.</div>}

        <div className="mt-4 text-xs text-muted-foreground">
          Showing {filtered.length} of {orders.length} orders
        </div>
      </div>
    </div>
  );
}
