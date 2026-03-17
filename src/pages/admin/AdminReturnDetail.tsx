import React, { useState, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Building2, Package, RotateCcw, CheckCircle, Clock, XCircle,
  Mail, Phone, MapPin, FileText, Truck, AlertTriangle, Camera, CreditCard,
  DollarSign, RefreshCcw, Tag, Calendar, User, ExternalLink, Send
} from "lucide-react";
import { returns, getReturnById, returnStatusLabels, returnReasonLabels, resolutionLabels } from "@/data/mockReturns";
import { customers, customerStats } from "@/data/mockCustomers";
import { orders } from "@/data/mockOrders";
import type { ReturnStatus, ReturnResolution } from "@/types/admin";

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

const conditionStyles: Record<string, string> = {
  unopened: "bg-emerald-500/10 text-emerald-600",
  opened: "bg-amber-500/10 text-amber-600",
  damaged: "bg-orange-500/10 text-orange-600",
  defective: "bg-red-500/10 text-red-600",
};

const resolutionIcons: Record<string, React.ElementType> = {
  refund: DollarSign,
  replacement: RefreshCcw,
  store_credit: Tag,
  repair: RotateCcw,
};

const statusFlow: ReturnStatus[] = ["requested", "approved", "received", "processing", "completed"];

export default function AdminReturnDetail() {
  const { returnId } = useParams<{ returnId: string }>();
  const navigate = useNavigate();

  const [currentStatus, setCurrentStatus] = useState<ReturnStatus | null>(null);
  const [selectedResolution, setSelectedResolution] = useState<ReturnResolution | "">("");
  const [refundAmount, setRefundAmount] = useState("");
  const [newNote, setNewNote] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [carrier, setCarrier] = useState("Purolator");

  const returnData = useMemo(() => {
    return getReturnById(returnId || "");
  }, [returnId]);

  const customer = useMemo(() => {
    if (!returnData) return null;
    return customers.find(c => c.id === returnData.customerId) || null;
  }, [returnData]);

  const stats = useMemo(() => {
    if (!customer) return null;
    return customerStats[customer.id] || null;
  }, [customer]);

  const originalOrder = useMemo(() => {
    if (!returnData) return null;
    return orders.find(o => o.id === returnData.orderId) || null;
  }, [returnData]);

  if (!returnData) {
    return (
      <div className="space-y-6">
        <button onClick={() => navigate("/admin/returns")} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Back to Returns
        </button>
        <div className="dashboard-card text-center py-12">
          <RotateCcw className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h2 className="font-display font-bold text-lg">Return Not Found</h2>
          <p className="text-sm text-muted-foreground mt-1">The requested return could not be found.</p>
        </div>
      </div>
    );
  }

  const status = currentStatus || returnData.status;
  const currentIdx = statusFlow.indexOf(status);
  const StatusIcon = statusIcons[status];

  function handleStatusChange(newStatus: ReturnStatus) {
    setCurrentStatus(newStatus);
  }

  const carriers = ["Purolator", "Canada Post", "UPS", "FedEx", "Day & Ross"];
  const resolutions: ReturnResolution[] = ["refund", "replacement", "store_credit", "repair"];

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button onClick={() => navigate("/admin/returns")} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
        <ArrowLeft className="h-4 w-4" /> Back to Returns
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display font-bold text-lg md:text-xl">{returnData.returnNumber}</h1>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-xs font-medium border ${statusStyles[status]}`}>
              <StatusIcon className="h-3 w-3" />
              {returnStatusLabels[status].en}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Requested on {new Date(returnData.requestedAt).toLocaleDateString()} · 
            Order <Link to={`/admin/orders?orderId=${returnData.orderId}`} className="text-accent hover:underline">{returnData.orderNumber}</Link>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="px-3 py-2 border border-border rounded-sm text-xs font-medium hover:bg-secondary transition-colors flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5" /> Email Customer
          </button>
          {status === "requested" && (
            <>
              <button
                onClick={() => handleStatusChange("approved")}
                className="px-3 py-2 bg-blue-500 text-white rounded-sm text-xs font-medium hover:bg-blue-600 transition-colors flex items-center gap-1.5"
              >
                <CheckCircle className="h-3.5 w-3.5" /> Approve Return
              </button>
              <button
                onClick={() => handleStatusChange("rejected")}
                className="px-3 py-2 bg-red-500 text-white rounded-sm text-xs font-medium hover:bg-red-600 transition-colors flex items-center gap-1.5"
              >
                <XCircle className="h-3.5 w-3.5" /> Reject
              </button>
            </>
          )}
          {(status === "received" || status === "processing") && (
            <button
              onClick={() => handleStatusChange("completed")}
              className="px-3 py-2 btn-accent rounded-sm text-xs font-medium flex items-center gap-1.5"
            >
              <CheckCircle className="h-3.5 w-3.5" /> Complete Return
            </button>
          )}
        </div>
      </div>

      {/* Status Timeline */}
      {status !== "rejected" && (
        <div className="dashboard-card">
          <h3 className="font-display font-bold text-sm uppercase mb-4">Return Status</h3>
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-2">
            {statusFlow.map((s, i) => {
              const Icon = statusIcons[s];
              const isActive = i <= currentIdx;
              const isCurrent = s === status;
              return (
                <React.Fragment key={s}>
                  {i > 0 && <div className={`h-0.5 flex-1 min-w-4 ${i <= currentIdx ? "bg-accent" : "bg-border"}`} />}
                  <button
                    onClick={() => handleStatusChange(s)}
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
          {returnData.trackingNumber && (
            <div className="flex items-center gap-2 text-sm bg-secondary/50 p-3 rounded-sm mt-4">
              <Truck className="h-4 w-4 text-accent flex-shrink-0" />
              <span className="text-muted-foreground">Return Tracking:</span>
              <span className="font-mono text-xs">{returnData.trackingNumber}</span>
              {returnData.carrier && <span className="text-xs text-muted-foreground">({returnData.carrier})</span>}
            </div>
          )}
        </div>
      )}

      {/* Rejected Notice */}
      {status === "rejected" && (
        <div className="dashboard-card border-red-200 bg-red-50">
          <div className="flex items-start gap-3">
            <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-display font-bold text-sm text-red-700">Return Rejected</h3>
              <p className="text-sm text-red-600 mt-1">
                This return request was rejected. The customer has been notified.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Return Items */}
          <div className="dashboard-card">
            <h3 className="font-display font-bold text-sm uppercase mb-4">Return Items</h3>
            <div className="space-y-4">
              {returnData.items.map((item) => (
                <div key={item.id} className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                  {item.productImage && (
                    <img src={item.productImage} alt="" className="w-16 h-16 rounded-sm object-cover bg-secondary flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link to={`/admin/products/${item.productId}`} className="text-sm font-medium hover:text-accent">
                          {item.productName}
                        </Link>
                        <p className="text-xs text-muted-foreground font-mono">{item.sku}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold">C${(item.unitPrice * item.quantity).toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">{item.quantity} × C${item.unitPrice.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-xs font-medium ${conditionStyles[item.condition]}`}>
                        {item.condition.charAt(0).toUpperCase() + item.condition.slice(1)}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-xs font-medium bg-secondary">
                        <AlertTriangle className="h-3 w-3" />
                        {returnReasonLabels[item.reason].en}
                      </span>
                    </div>
                    {item.notes && (
                      <p className="text-sm text-muted-foreground mt-2 italic">"{item.notes}"</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Return Subtotal</span>
                <span className="font-bold">C${returnData.subtotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Resolution Section */}
          {(status === "approved" || status === "received" || status === "processing") && (
            <div className="dashboard-card border-accent/30">
              <h3 className="font-display font-bold text-sm uppercase mb-4 flex items-center gap-2">
                <RefreshCcw className="h-4 w-4 text-accent" /> Resolution
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Resolution Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {resolutions.map((res) => {
                      const Icon = resolutionIcons[res];
                      const isSelected = (selectedResolution || returnData.resolution) === res;
                      return (
                        <button
                          key={res}
                          onClick={() => setSelectedResolution(res)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-sm text-sm font-medium border transition-colors ${
                            isSelected ? "border-accent bg-accent/10 text-accent" : "border-border hover:bg-secondary"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          {resolutionLabels[res].en}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">C$</span>
                    <input
                      type="number"
                      value={refundAmount || returnData.subtotal}
                      onChange={(e) => setRefundAmount(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-border rounded-sm text-sm bg-background outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Original: C${returnData.subtotal.toFixed(2)}</p>
                </div>
              </div>
              {!returnData.trackingNumber && (
                <div className="mt-4 pt-4 border-t border-border">
                  <label className="block text-sm font-medium mb-2">Return Shipping Label</label>
                  <div className="grid sm:grid-cols-3 gap-3">
                    <select
                      value={carrier}
                      onChange={(e) => setCarrier(e.target.value)}
                      className="px-3 py-2 border border-border rounded-sm text-sm bg-background outline-none"
                    >
                      {carriers.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <input
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="Tracking number"
                      className="px-3 py-2 border border-border rounded-sm text-sm bg-background outline-none focus:ring-2 focus:ring-accent font-mono"
                    />
                    <button className="px-3 py-2 btn-accent rounded-sm text-sm font-medium flex items-center justify-center gap-1.5">
                      <Send className="h-3.5 w-3.5" /> Send Label
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Activity Timeline */}
          <div className="dashboard-card">
            <h3 className="font-display font-bold text-sm uppercase mb-4 flex items-center gap-2">
              <FileText className="h-4 w-4" /> Activity & Notes
            </h3>
            <div className="space-y-4">
              {returnData.notes.map((note) => (
                <div key={note.id} className="flex gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    note.type === "status_change" ? "bg-accent" : note.type === "system" ? "bg-muted-foreground" : "bg-blue-500"
                  }`} />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">
                      {new Date(note.date).toLocaleString()} · {note.user}
                    </p>
                    <p className="text-sm mt-0.5">{note.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <label className="block text-sm font-medium mb-2">Add Note</label>
              <div className="flex gap-2">
                <input
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note about this return..."
                  className="flex-1 px-3 py-2 border border-border rounded-sm text-sm bg-background outline-none focus:ring-2 focus:ring-accent"
                />
                <button className="px-4 py-2 btn-accent rounded-sm text-sm font-medium">Add</button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Customer Card */}
          {customer && (
            <div className="dashboard-card border-accent/30">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-bold text-sm uppercase">Customer</h3>
                <Link
                  to={`/admin/customers/${customer.id}`}
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
                  <p className="text-sm font-medium">{customer.companyName}</p>
                  <p className="text-xs text-muted-foreground">{customer.firstName} {customer.lastName}</p>
                </div>
              </div>
              <div className="space-y-1.5 text-sm">
                <a href={`mailto:${customer.email}`} className="flex items-center gap-2 text-accent hover:underline">
                  <Mail className="h-3.5 w-3.5" /> {customer.email}
                </a>
                {customer.phone && (
                  <a href={`tel:${customer.phone}`} className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" /> {customer.phone}
                  </a>
                )}
              </div>
              {stats && (
                <div className="mt-3 pt-3 border-t border-border grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Orders</p>
                    <p className="text-sm font-bold">{stats.totalOrders}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Return Rate</p>
                    <p className="text-sm font-bold">{stats.returnRate}%</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Original Order */}
          {originalOrder && (
            <div className="dashboard-card">
              <h3 className="font-display font-bold text-sm uppercase mb-3">Original Order</h3>
              <Link
                to={`/admin/orders?orderId=${originalOrder.id}`}
                className="block hover:bg-secondary/50 -mx-4 px-4 py-2 transition-colors"
              >
                <p className="font-mono text-xs font-medium">{originalOrder.orderNumber}</p>
                <p className="text-xs text-muted-foreground">{new Date(originalOrder.createdAt).toLocaleDateString()}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-bold">C${originalOrder.total.toFixed(2)}</span>
                  <span className="text-xs text-muted-foreground">{originalOrder.items.length} items</span>
                </div>
              </Link>
            </div>
          )}

          {/* Return Summary */}
          <div className="dashboard-card">
            <h3 className="font-display font-bold text-sm uppercase mb-3">Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reason</span>
                <span className="font-medium">{returnReasonLabels[returnData.reason].en}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Items</span>
                <span>{returnData.items.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-bold">C${returnData.subtotal.toFixed(2)}</span>
              </div>
              {returnData.resolution && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Resolution</span>
                  <span className="font-medium">{resolutionLabels[returnData.resolution].en}</span>
                </div>
              )}
              {returnData.processedBy && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Processed By</span>
                  <span>{returnData.processedBy}</span>
                </div>
              )}
              {returnData.warehouseId && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Warehouse</span>
                  <span className="font-mono text-xs">{returnData.warehouseId}</span>
                </div>
              )}
            </div>
          </div>

          {/* Key Dates */}
          <div className="dashboard-card">
            <h3 className="font-display font-bold text-sm uppercase mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Timeline
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Requested</span>
                <span>{new Date(returnData.requestedAt).toLocaleDateString()}</span>
              </div>
              {returnData.approvedAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Approved</span>
                  <span>{new Date(returnData.approvedAt).toLocaleDateString()}</span>
                </div>
              )}
              {returnData.receivedAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Received</span>
                  <span>{new Date(returnData.receivedAt).toLocaleDateString()}</span>
                </div>
              )}
              {returnData.completedAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Completed</span>
                  <span>{new Date(returnData.completedAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
