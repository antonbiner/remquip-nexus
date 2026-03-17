import React, { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Building2,
  FileText,
  ShoppingBag,
  CreditCard,
  Clock,
  Edit,
  Ban,
  CheckCircle,
  Plus,
  Download,
  ExternalLink,
  Calendar,
  TrendingUp,
  DollarSign,
  Package,
  RefreshCw,
  User,
  Tag,
  ChevronDown,
  ChevronUp,
  Eye,
  MessageSquare,
  Upload,
  Trash2,
} from "lucide-react";
import { customers, customerStats, customerActivities, getCustomerById, getCustomerStats, getCustomerActivities } from "@/data/mockCustomers";
import { getOrdersByCustomerId } from "@/data/mockOrders";
import type { Customer, CustomerStats, ActivityItem, Order, Address, CustomerNote, CustomerDocument } from "@/types/admin";

// ─── STYLE MAPPINGS ───

const statusStyles: Record<string, string> = {
  pending: "badge-warning",
  processing: "badge-info",
  shipped: "badge-info",
  completed: "badge-success",
  cancelled: "badge-destructive",
  refunded: "badge-destructive",
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

const valueSegmentStyles: Record<string, string> = {
  high: "text-emerald-600",
  medium: "text-blue-600",
  low: "text-muted-foreground",
};

const activityIcons: Record<string, React.ElementType> = {
  order_placed: ShoppingBag,
  order_status_changed: Package,
  payment_received: CreditCard,
  note_added: FileText,
  email_sent: Mail,
  call_logged: Phone,
  document_uploaded: Upload,
  address_updated: MapPin,
  tier_changed: TrendingUp,
  status_changed: RefreshCw,
};

type TabId = "overview" | "orders" | "addresses" | "payments" | "communications" | "documents" | "activity";

const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: Building2 },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "communications", label: "Communications", icon: MessageSquare },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "activity", label: "Activity", icon: Clock },
];

export default function AdminCustomerDetail() {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [newNote, setNewNote] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Get customer data
  const customer = useMemo(() => getCustomerById(customerId || ""), [customerId]);
  const stats = useMemo(() => getCustomerStats(customerId || ""), [customerId]);
  const activities = useMemo(() => getCustomerActivities(customerId || ""), [customerId]);
  const customerOrders = useMemo(() => getOrdersByCustomerId(customerId || ""), [customerId]);

  // Filter orders
  const filteredOrders = useMemo(() => {
    return customerOrders.filter((o) => {
      const matchesSearch = !orderSearch || 
        o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase());
      const matchesStatus = !orderStatusFilter || o.status === orderStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [customerOrders, orderSearch, orderStatusFilter]);

  // Order stats
  const orderStats = useMemo(() => ({
    total: customerOrders.length,
    pending: customerOrders.filter((o) => o.status === "pending").length,
    processing: customerOrders.filter((o) => o.status === "processing").length,
    shipped: customerOrders.filter((o) => o.status === "shipped").length,
    completed: customerOrders.filter((o) => o.status === "completed").length,
  }), [customerOrders]);

  if (!customer) {
    return (
      <div className="text-center py-16">
        <User className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
        <p className="text-muted-foreground">Customer not found</p>
        <Link to="/admin/customers" className="text-accent text-sm hover:underline mt-2 inline-block">
          Back to Customers
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <Link
        to="/admin/customers"
        className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 w-fit"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Customers
      </Link>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-md bg-accent/10 flex items-center justify-center flex-shrink-0">
            <Building2 className="h-7 w-7 text-accent" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="font-display font-bold text-xl md:text-2xl">{customer.companyName}</h1>
              <span className={statusStyles[customer.status]}>{customer.status}</span>
              <span className={`px-2 py-0.5 rounded-sm text-xs font-medium border ${customerTypeStyles[customer.customerType]}`}>
                {customer.customerType.charAt(0).toUpperCase() + customer.customerType.slice(1)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {customer.firstName} {customer.lastName} · Member since {new Date(customer.createdAt).toLocaleDateString()}
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm">
              <a href={`mailto:${customer.email}`} className="flex items-center gap-1.5 text-accent hover:underline">
                <Mail className="h-3.5 w-3.5" /> {customer.email}
              </a>
              {customer.phone && (
                <a href={`tel:${customer.phone}`} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
                  <Phone className="h-3.5 w-3.5" /> {customer.phone}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <button className="px-3 py-2 border border-border rounded-sm text-xs font-medium hover:bg-secondary transition-colors flex items-center gap-1.5">
            <Edit className="h-3.5 w-3.5" /> Edit
          </button>
          <button className="px-3 py-2 border border-border rounded-sm text-xs font-medium hover:bg-secondary transition-colors flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5" /> Email
          </button>
          <button className="px-3 py-2 border border-border rounded-sm text-xs font-medium hover:bg-secondary transition-colors flex items-center gap-1.5">
            <Plus className="h-3.5 w-3.5" /> New Order
          </button>
          <button className="px-3 py-2 border border-destructive text-destructive rounded-sm text-xs font-medium hover:bg-destructive/10 transition-colors flex items-center gap-1.5">
            <Ban className="h-3.5 w-3.5" /> Deactivate
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <div className="dashboard-card">
            <div className="flex items-center gap-1.5 mb-1">
              <ShoppingBag className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Total Orders</p>
            </div>
            <p className="text-xl font-bold font-display">{stats.totalOrders}</p>
          </div>
          <div className="dashboard-card">
            <div className="flex items-center gap-1.5 mb-1">
              <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Total Spent</p>
            </div>
            <p className="text-xl font-bold font-display">C${stats.totalSpent.toLocaleString()}</p>
          </div>
          <div className="dashboard-card">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Avg. Order</p>
            </div>
            <p className="text-xl font-bold font-display">C${Math.round(stats.avgOrderValue).toLocaleString()}</p>
          </div>
          <div className="dashboard-card">
            <div className="flex items-center gap-1.5 mb-1">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Last Order</p>
            </div>
            <p className="text-xl font-bold font-display">
              {stats.lastOrderDate ? new Date(stats.lastOrderDate).toLocaleDateString() : "N/A"}
            </p>
          </div>
          <div className="dashboard-card">
            <div className="flex items-center gap-1.5 mb-1">
              <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Order Freq.</p>
            </div>
            <p className="text-xl font-bold font-display">{stats.orderFrequency.toFixed(1)}/mo</p>
          </div>
          <div className="dashboard-card">
            <div className="flex items-center gap-1.5 mb-1">
              <Tag className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Value Segment</p>
            </div>
            <p className={`text-xl font-bold font-display capitalize ${valueSegmentStyles[customer.valueSegment]}`}>
              {customer.valueSegment}
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex gap-1 overflow-x-auto pb-px -mb-px">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  isActive
                    ? "border-accent text-accent"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
                {tab.id === "orders" && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs bg-secondary rounded-sm">{orderStats.total}</span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent Orders */}
            <div className="lg:col-span-2 dashboard-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-sm uppercase flex items-center gap-1.5">
                  <ShoppingBag className="h-3.5 w-3.5" /> Recent Orders
                </h3>
                <button
                  onClick={() => setActiveTab("orders")}
                  className="text-xs text-accent hover:underline"
                >
                  View All
                </button>
              </div>
              <div className="space-y-2">
                {customerOrders.slice(0, 5).map((order) => (
                  <Link
                    key={order.id}
                    to={`/admin/orders?orderId=${order.id}`}
                    className="flex items-center justify-between py-3 px-3 -mx-3 rounded-sm hover:bg-secondary/50 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium">{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()} · {order.items.length} items
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={statusStyles[order.status]}>{order.status}</span>
                      <span className="text-sm font-medium">C${order.total.toFixed(2)}</span>
                    </div>
                  </Link>
                ))}
                {customerOrders.length === 0 && (
                  <p className="text-sm text-muted-foreground py-4 text-center">No orders yet</p>
                )}
              </div>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-4">
              {/* Contact */}
              <div className="dashboard-card">
                <h3 className="font-display font-bold text-sm uppercase mb-3">Contact</h3>
                <div className="space-y-2">
                  <a href={`mailto:${customer.email}`} className="flex items-center gap-2 text-sm text-accent hover:underline">
                    <Mail className="h-3.5 w-3.5" /> {customer.email}
                  </a>
                  {customer.phone && (
                    <a href={`tel:${customer.phone}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                      <Phone className="h-3.5 w-3.5" /> {customer.phone}
                    </a>
                  )}
                </div>
              </div>

              {/* Primary Address */}
              {customer.addresses.length > 0 && (
                <div className="dashboard-card">
                  <h3 className="font-display font-bold text-sm uppercase mb-3 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" /> Primary Address
                  </h3>
                  {(() => {
                    const addr = customer.addresses.find((a) => a.isDefault) || customer.addresses[0];
                    return (
                      <div className="text-sm">
                        <p>{addr.addressLine1}</p>
                        {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                        <p>{addr.city}, {addr.province} {addr.postalCode}</p>
                        <p className="text-muted-foreground">{addr.country}</p>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Business Info */}
              <div className="dashboard-card">
                <h3 className="font-display font-bold text-sm uppercase mb-3">Business Info</h3>
                <dl className="space-y-2 text-sm">
                  {customer.taxId && (
                    <>
                      <dt className="text-muted-foreground">Tax ID</dt>
                      <dd className="font-mono">{customer.taxId}</dd>
                    </>
                  )}
                  {customer.paymentTerms && (
                    <>
                      <dt className="text-muted-foreground mt-2">Payment Terms</dt>
                      <dd>{customer.paymentTerms}</dd>
                    </>
                  )}
                  {customer.creditLimit && (
                    <>
                      <dt className="text-muted-foreground mt-2">Credit Limit</dt>
                      <dd>C${customer.creditLimit.toLocaleString()}</dd>
                    </>
                  )}
                </dl>
              </div>

              {/* Recent Activity */}
              <div className="dashboard-card">
                <h3 className="font-display font-bold text-sm uppercase mb-3 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" /> Recent Activity
                </h3>
                <div className="space-y-3">
                  {activities.slice(0, 4).map((activity) => {
                    const Icon = activityIcons[activity.type] || Clock;
                    return (
                      <div key={activity.id} className="flex gap-3 text-sm">
                        <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                          <Icon className="h-3 w-3 text-muted-foreground" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground">
                            {new Date(activity.timestamp).toLocaleDateString()} · {activity.user}
                          </p>
                          <p className="text-sm truncate">{activity.title}</p>
                        </div>
                      </div>
                    );
                  })}
                  {activities.length === 0 && (
                    <p className="text-sm text-muted-foreground">No activity recorded</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            {/* Order Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {[
                { key: "", label: "All", count: orderStats.total },
                { key: "pending", label: "Pending", count: orderStats.pending },
                { key: "processing", label: "Processing", count: orderStats.processing },
                { key: "shipped", label: "Shipped", count: orderStats.shipped },
                { key: "completed", label: "Completed", count: orderStats.completed },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setOrderStatusFilter(tab.key)}
                  className={`dashboard-card text-center text-xs font-medium transition-colors ${
                    orderStatusFilter === tab.key ? "border-accent text-accent" : "hover:border-muted-foreground"
                  }`}
                >
                  <span className="block">{tab.label}</span>
                  <span className="block text-lg font-bold font-display mt-0.5">{tab.count}</span>
                </button>
              ))}
            </div>

            {/* Orders Table */}
            <div className="dashboard-card">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="table-header">
                      <th className="text-left px-3 py-2">Order</th>
                      <th className="text-left px-3 py-2">Date</th>
                      <th className="text-left px-3 py-2">Status</th>
                      <th className="text-left px-3 py-2">Payment</th>
                      <th className="text-right px-3 py-2">Items</th>
                      <th className="text-right px-3 py-2">Total</th>
                      <th className="text-right px-3 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-secondary/50 transition-colors">
                        <td className="px-3 py-3">
                          <span className="font-medium font-mono">{order.orderNumber}</span>
                        </td>
                        <td className="px-3 py-3 text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-3 py-3">
                          <span className={statusStyles[order.status]}>{order.status}</span>
                        </td>
                        <td className="px-3 py-3">
                          <span className={statusStyles[order.paymentStatus]}>{order.paymentStatus}</span>
                        </td>
                        <td className="px-3 py-3 text-right">{order.items.length}</td>
                        <td className="px-3 py-3 text-right font-medium">C${order.total.toFixed(2)}</td>
                        <td className="px-3 py-3 text-right">
                          <Link
                            to={`/admin/orders?orderId=${order.id}`}
                            className="p-1.5 hover:bg-secondary rounded-sm transition-colors inline-flex"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredOrders.length === 0 && (
                  <p className="text-center py-8 text-sm text-muted-foreground">No orders found</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ADDRESSES TAB */}
        {activeTab === "addresses" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button className="px-3 py-2 btn-accent rounded-sm text-xs font-medium flex items-center gap-1.5">
                <Plus className="h-3.5 w-3.5" /> Add Address
              </button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customer.addresses.map((addr) => (
                <div key={addr.id} className="dashboard-card">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-sm text-xs font-medium ${
                        addr.type === "billing" ? "bg-blue-500/10 text-blue-600" : "bg-emerald-500/10 text-emerald-600"
                      }`}>
                        {addr.type}
                      </span>
                      {addr.isDefault && (
                        <span className="px-2 py-0.5 rounded-sm text-xs font-medium bg-accent/10 text-accent">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <button className="p-1.5 hover:bg-secondary rounded-sm transition-colors">
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button className="p-1.5 hover:bg-secondary rounded-sm transition-colors text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="text-sm">
                    <p>{addr.addressLine1}</p>
                    {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                    <p>{addr.city}, {addr.province} {addr.postalCode}</p>
                    <p className="text-muted-foreground">{addr.country}</p>
                  </div>
                </div>
              ))}
              {customer.addresses.length === 0 && (
                <p className="text-sm text-muted-foreground col-span-full text-center py-8">No addresses on file</p>
              )}
            </div>
          </div>
        )}

        {/* PAYMENTS TAB */}
        {activeTab === "payments" && (
          <div className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="dashboard-card">
                <h4 className="text-xs text-muted-foreground mb-1">Payment Terms</h4>
                <p className="text-lg font-bold font-display">{customer.paymentTerms || "Due on Receipt"}</p>
              </div>
              <div className="dashboard-card">
                <h4 className="text-xs text-muted-foreground mb-1">Credit Limit</h4>
                <p className="text-lg font-bold font-display">
                  {customer.creditLimit ? `C$${customer.creditLimit.toLocaleString()}` : "N/A"}
                </p>
              </div>
              <div className="dashboard-card">
                <h4 className="text-xs text-muted-foreground mb-1">Total Paid</h4>
                <p className="text-lg font-bold font-display text-emerald-600">
                  C${stats?.totalSpent.toLocaleString() || 0}
                </p>
              </div>
            </div>

            <div className="dashboard-card">
              <h3 className="font-display font-bold text-sm uppercase mb-4">Payment History</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="table-header">
                      <th className="text-left px-3 py-2">Date</th>
                      <th className="text-left px-3 py-2">Order</th>
                      <th className="text-left px-3 py-2">Method</th>
                      <th className="text-left px-3 py-2">Status</th>
                      <th className="text-right px-3 py-2">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {customerOrders.flatMap((order) =>
                      order.payments.map((payment) => (
                        <tr key={payment.id} className="hover:bg-secondary/50">
                          <td className="px-3 py-3 text-muted-foreground">
                            {new Date(payment.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-3 py-3 font-mono">{order.orderNumber}</td>
                          <td className="px-3 py-3 capitalize">{payment.method.replace("_", " ")}</td>
                          <td className="px-3 py-3">
                            <span className={statusStyles[payment.status]}>{payment.status}</span>
                          </td>
                          <td className="px-3 py-3 text-right font-medium">C${payment.amount.toFixed(2)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* COMMUNICATIONS TAB */}
        {activeTab === "communications" && (
          <div className="space-y-4">
            {/* Add Note */}
            <div className="dashboard-card">
              <h3 className="font-display font-bold text-sm uppercase mb-3">Add Note</h3>
              <div className="flex gap-2">
                <input
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note about this customer..."
                  className="flex-1 px-3 py-2 border border-border rounded-sm text-sm bg-background outline-none focus:ring-2 focus:ring-accent"
                />
                <select className="px-3 py-2 border border-border rounded-sm text-sm bg-background outline-none">
                  <option value="note">Note</option>
                  <option value="call">Call</option>
                  <option value="email">Email</option>
                </select>
                <button
                  onClick={() => setNewNote("")}
                  className="btn-accent px-4 py-2 rounded-sm text-sm font-medium"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Notes List */}
            <div className="dashboard-card">
              <h3 className="font-display font-bold text-sm uppercase mb-4">Communication History</h3>
              <div className="space-y-4">
                {customer.notes.map((note) => {
                  const Icon = note.type === "call" ? Phone : note.type === "email" ? Mail : FileText;
                  return (
                    <div key={note.id} className="flex gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        note.type === "call" ? "bg-blue-500/10" :
                        note.type === "email" ? "bg-emerald-500/10" :
                        note.type === "system" ? "bg-secondary" : "bg-amber-500/10"
                      }`}>
                        <Icon className={`h-4 w-4 ${
                          note.type === "call" ? "text-blue-600" :
                          note.type === "email" ? "text-emerald-600" :
                          note.type === "system" ? "text-muted-foreground" : "text-amber-600"
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs text-muted-foreground">
                            {new Date(note.date).toLocaleDateString()} · {note.user}
                          </p>
                          <span className="px-1.5 py-0.5 rounded-sm text-xs bg-secondary capitalize">{note.type}</span>
                        </div>
                        <p className="text-sm mt-1">{note.text}</p>
                      </div>
                    </div>
                  );
                })}
                {customer.notes.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No communications recorded</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* DOCUMENTS TAB */}
        {activeTab === "documents" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button className="px-3 py-2 btn-accent rounded-sm text-xs font-medium flex items-center gap-1.5">
                <Upload className="h-3.5 w-3.5" /> Upload Document
              </button>
            </div>
            <div className="dashboard-card">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="table-header">
                      <th className="text-left px-3 py-2">Name</th>
                      <th className="text-left px-3 py-2">Type</th>
                      <th className="text-left px-3 py-2">Uploaded</th>
                      <th className="text-left px-3 py-2">By</th>
                      <th className="text-right px-3 py-2">Size</th>
                      <th className="text-right px-3 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {customer.documents.map((doc) => (
                      <tr key={doc.id} className="hover:bg-secondary/50">
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="font-medium">{doc.name}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3 capitalize">{doc.type}</td>
                        <td className="px-3 py-3 text-muted-foreground">
                          {new Date(doc.uploadedAt).toLocaleDateString()}
                        </td>
                        <td className="px-3 py-3 text-muted-foreground">{doc.uploadedBy}</td>
                        <td className="px-3 py-3 text-right text-muted-foreground">
                          {(doc.size / 1024).toFixed(0)} KB
                        </td>
                        <td className="px-3 py-3 text-right">
                          <div className="flex justify-end gap-1">
                            <button className="p-1.5 hover:bg-secondary rounded-sm transition-colors">
                              <Download className="h-4 w-4" />
                            </button>
                            <button className="p-1.5 hover:bg-secondary rounded-sm transition-colors">
                              <ExternalLink className="h-4 w-4" />
                            </button>
                            <button className="p-1.5 hover:bg-secondary rounded-sm transition-colors text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {customer.documents.length === 0 && (
                  <p className="text-center py-8 text-sm text-muted-foreground">No documents uploaded</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ACTIVITY TAB */}
        {activeTab === "activity" && (
          <div className="dashboard-card">
            <h3 className="font-display font-bold text-sm uppercase mb-4">Activity Timeline</h3>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
              <div className="space-y-6">
                {activities.map((activity, index) => {
                  const Icon = activityIcons[activity.type] || Clock;
                  return (
                    <div key={activity.id} className="relative flex gap-4 pl-4">
                      <div className="absolute left-0 w-8 h-8 rounded-full bg-card border-2 border-border flex items-center justify-center -translate-x-1/2">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 ml-6">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{activity.title}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(activity.timestamp).toLocaleString()}
                          </span>
                        </div>
                        {activity.description && (
                          <p className="text-sm text-muted-foreground">{activity.description}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">by {activity.user}</p>
                      </div>
                    </div>
                  );
                })}
                {activities.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">No activity recorded</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
