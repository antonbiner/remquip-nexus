import React, { useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft, Save, Trash2, Eye, 
  TrendingUp, Users, DollarSign, Package, ShoppingBag,
  Calendar, Clock, ChevronDown, ChevronUp, ExternalLink,
  BarChart3, History, User
} from "lucide-react";
import { products, categories, type Product } from "@/config/products";
import { getProductBuyers, getProductSalesStats, getProductActivityLogs } from "@/data/mockProducts";
import ProductImageManager, { type ProductImage } from "@/components/admin/ProductImageManager";
import type { ProductBuyer, ProductSalesStats, ProductActivityLog } from "@/types/admin";

// ─── STYLE MAPPINGS ───

const customerTypeStyles: Record<string, string> = {
  fleet: "bg-blue-500/10 text-blue-600 border-blue-200",
  wholesale: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  distributor: "bg-purple-500/10 text-purple-600 border-purple-200",
  enterprise: "bg-amber-500/10 text-amber-600 border-amber-200",
};

const activityActionStyles: Record<string, string> = {
  price_changed: "text-amber-600 bg-amber-500/10",
  stock_adjusted: "text-blue-600 bg-blue-500/10",
  product_edited: "text-purple-600 bg-purple-500/10",
  wholesale_price_changed: "text-amber-600 bg-amber-500/10",
  status_changed: "text-emerald-600 bg-emerald-500/10",
  product_created: "text-accent bg-accent/10",
};

type TabId = "details" | "sales" | "buyers" | "activity";

const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "details", label: "Product Details", icon: Package },
  { id: "sales", label: "Sales Analytics", icon: BarChart3 },
  { id: "buyers", label: "Buyers", icon: Users },
  { id: "activity", label: "Activity Log", icon: History },
];

const emptyProduct = (): Omit<Product, "id" | "images"> & { id?: string } => ({
  name: "",
  sku: "",
  slug: "",
  category: categories[0]?.name || "",
  categorySlug: categories[0]?.slug || "",
  description: "",
  specifications: {},
  image: "",
  price: 0,
  wholesalePrice: 0,
  stock: 0,
  status: "draft" as const,
  weightLbs: 0,
  compatibility: [],
});

export default function AdminProductEdit() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const isNew = !productId || productId === "new";

  const existing = !isNew ? products.find((p) => p.id === productId) : null;

  const [activeTab, setActiveTab] = useState<TabId>("details");
  const [form, setForm] = useState(() => existing ? { ...existing } : emptyProduct());
  const [specsJson, setSpecsJson] = useState(() =>
    JSON.stringify(form.specifications || {}, null, 2)
  );
  const [specsError, setSpecsError] = useState("");
  const [compatText, setCompatText] = useState(() =>
    (form.compatibility || []).join(", ")
  );
  const [expandedBuyer, setExpandedBuyer] = useState<string | null>(null);
  
  // Initialize product images from existing product or empty
  const [productImages, setProductImages] = useState<ProductImage[]>(() => {
    if (existing?.images) {
      return existing.images.map((img, index) => ({
        id: img.id,
        url: img.url,
        alt: img.alt || existing.name || "Product image",
        isPrimary: index === 0,
        order: index,
      }));
    }
    return [];
  });

  // Get product data
  const buyers = useMemo(() => productId ? getProductBuyers(productId) : [], [productId]);
  const salesStats = useMemo(() => productId ? getProductSalesStats(productId) : null, [productId]);
  const activityLogs = useMemo(() => productId ? getProductActivityLogs(productId) : [], [productId]);

  function updateField(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleCategoryChange(slug: string) {
    const cat = categories.find((c) => c.slug === slug);
    if (cat) {
      setForm((prev) => ({ ...prev, category: cat.name, categorySlug: cat.slug }));
    }
  }

  function handleSpecsChange(value: string) {
    setSpecsJson(value);
    try {
      const parsed = JSON.parse(value);
      setForm((prev) => ({ ...prev, specifications: parsed }));
      setSpecsError("");
    } catch {
      setSpecsError("Invalid JSON");
    }
  }

  function handleCompatChange(value: string) {
    setCompatText(value);
    setForm((prev) => ({ ...prev, compatibility: value.split(",").map(s => s.trim()).filter(Boolean) }));
  }

  function generateSlug(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function handleSave() {
    alert(`Product "${form.name}" saved (demo mode)`);
    navigate("/admin/products");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link to="/admin/products" className="p-1.5 hover:bg-secondary rounded-sm transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h2 className="font-display font-bold text-lg md:text-xl">
            {isNew ? "Create Product" : `Edit: ${form.name}`}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {!isNew && (
            <>
              <Link to={`/product/${form.slug}`} className="px-3 py-2 rounded-sm text-xs font-medium border border-border hover:bg-secondary transition-colors flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5" /> Preview
              </Link>
              <Link to={`/admin/products/${productId}/logs`} className="px-3 py-2 rounded-sm text-xs font-medium border border-border hover:bg-secondary transition-colors">
                Stock Logs
              </Link>
              <button className="px-3 py-2 rounded-sm text-xs font-medium border border-destructive text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-1.5">
                <Trash2 className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Delete</span>
              </button>
            </>
          )}
          <button onClick={handleSave} className="btn-accent px-4 py-2 rounded-sm text-sm font-medium flex items-center gap-2">
            <Save className="h-4 w-4" /> Save
          </button>
        </div>
      </div>

      {/* Tabs (only show for existing products) */}
      {!isNew && (
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
                  {tab.id === "buyers" && buyers.length > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 text-xs bg-secondary rounded-sm">{buyers.length}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      )}

      {/* DETAILS TAB */}
      {(activeTab === "details" || isNew) && (
        <div className="grid lg:grid-cols-3 gap-6 max-w-5xl">
          {/* Main form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic info */}
            <div className="dashboard-card space-y-4">
              <h3 className="font-display font-bold text-sm uppercase text-muted-foreground">Basic Information</h3>
              <div>
                <label className="block text-sm font-medium mb-1">Product Name</label>
                <input
                  value={form.name}
                  onChange={(e) => { updateField("name", e.target.value); if (isNew) updateField("slug", generateSlug(e.target.value)); }}
                  className="w-full px-3 py-2 border border-border rounded-sm text-sm bg-background outline-none focus:ring-2 focus:ring-accent"
                  placeholder="e.g. Air Spring W01-358 9781"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">SKU</label>
                  <input value={form.sku} onChange={(e) => updateField("sku", e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-sm text-sm bg-background outline-none focus:ring-2 focus:ring-accent" placeholder="e.g. 1T15ZR-6" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Slug</label>
                  <input value={form.slug} onChange={(e) => updateField("slug", e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-sm text-sm bg-background outline-none focus:ring-2 focus:ring-accent" placeholder="air-spring-w01-358-9781" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => updateField("description", e.target.value)} rows={4}
                  className="w-full px-3 py-2 border border-border rounded-sm text-sm bg-background outline-none focus:ring-2 focus:ring-accent resize-y"
                  placeholder="Product description..." />
              </div>
            </div>

            {/* Compatibility */}
            <div className="dashboard-card space-y-4">
              <h3 className="font-display font-bold text-sm uppercase text-muted-foreground">Vehicle Compatibility</h3>
              <div>
                <label className="block text-sm font-medium mb-1">Compatible Vehicles (comma-separated)</label>
                <textarea
                  value={compatText}
                  onChange={(e) => handleCompatChange(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-sm text-sm bg-background outline-none focus:ring-2 focus:ring-accent resize-y"
                  placeholder="e.g. Freightliner Cascadia, Kenworth T680, Volvo VNL"
                />
              </div>
              {(form.compatibility || []).length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {(form.compatibility || []).map((v, i) => (
                    <span key={i} className="badge-info text-xs">{v}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Specifications JSON */}
            <div className="dashboard-card space-y-4">
              <h3 className="font-display font-bold text-sm uppercase text-muted-foreground">Specifications (JSON)</h3>
              <textarea
                value={specsJson}
                onChange={(e) => handleSpecsChange(e.target.value)}
                rows={8}
                className={`w-full px-3 py-2 border rounded-sm text-sm bg-background outline-none focus:ring-2 focus:ring-accent font-mono ${specsError ? "border-destructive" : "border-border"}`}
              />
              {specsError && <p className="text-xs text-destructive">{specsError}</p>}
            </div>

            {/* Images */}
            <div className="dashboard-card space-y-4">
              <h3 className="font-display font-bold text-sm uppercase text-muted-foreground">Product Images</h3>
              <ProductImageManager
                images={productImages}
                onChange={setProductImages}
                maxImages={10}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <div className="dashboard-card space-y-4">
              <h3 className="font-display font-bold text-sm uppercase text-muted-foreground">Status</h3>
              <select
                value={form.status}
                onChange={(e) => updateField("status", e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-sm text-sm bg-background outline-none"
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Category */}
            <div className="dashboard-card space-y-4">
              <h3 className="font-display font-bold text-sm uppercase text-muted-foreground">Category</h3>
              <select
                value={form.categorySlug}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-sm text-sm bg-background outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Pricing */}
            <div className="dashboard-card space-y-4">
              <h3 className="font-display font-bold text-sm uppercase text-muted-foreground">Pricing</h3>
              <div>
                <label className="block text-sm font-medium mb-1">Retail Price (CAD)</label>
                <input type="number" step="0.01" value={form.price} onChange={(e) => updateField("price", parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-border rounded-sm text-sm bg-background outline-none focus:ring-2 focus:ring-accent" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Wholesale Price (CAD)</label>
                <input type="number" step="0.01" value={form.wholesalePrice} onChange={(e) => updateField("wholesalePrice", parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-border rounded-sm text-sm bg-background outline-none focus:ring-2 focus:ring-accent" />
              </div>
              {form.price > 0 && form.wholesalePrice > 0 && (
                <p className="text-xs text-muted-foreground">Margin: {Math.round(((form.price - form.wholesalePrice) / form.price) * 100)}%</p>
              )}
            </div>

            {/* Inventory */}
            <div className="dashboard-card space-y-4">
              <h3 className="font-display font-bold text-sm uppercase text-muted-foreground">Inventory</h3>
              <div>
                <label className="block text-sm font-medium mb-1">Stock Quantity</label>
                <input type="number" value={form.stock} onChange={(e) => updateField("stock", parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-border rounded-sm text-sm bg-background outline-none focus:ring-2 focus:ring-accent" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Weight (lbs)</label>
                <input type="number" step="0.1" value={form.weightLbs || 0} onChange={(e) => updateField("weightLbs", parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-border rounded-sm text-sm bg-background outline-none focus:ring-2 focus:ring-accent" />
              </div>
            </div>

            {/* SEO */}
            <div className="dashboard-card space-y-4">
              <h3 className="font-display font-bold text-sm uppercase text-muted-foreground">SEO</h3>
              <div>
                <label className="block text-sm font-medium mb-1">Meta Title</label>
                <input
                  defaultValue={form.name}
                  className="w-full px-3 py-2 border border-border rounded-sm text-sm bg-background outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Page title for search engines"
                />
                <p className="text-xs text-muted-foreground mt-1">{(form.name || "").length}/60 characters</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Meta Description</label>
                <textarea
                  defaultValue={form.description?.slice(0, 160)}
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-sm text-sm bg-background outline-none focus:ring-2 focus:ring-accent resize-none"
                  placeholder="Description for search results"
                />
                <p className="text-xs text-muted-foreground mt-1">{(form.description || "").slice(0, 160).length}/160 characters</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SALES ANALYTICS TAB */}
      {activeTab === "sales" && salesStats && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            <div className="dashboard-card">
              <div className="flex items-center gap-1.5 mb-1">
                <Package className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Units Sold</p>
              </div>
              <p className="text-2xl font-bold font-display">{salesStats.totalUnitsSold}</p>
            </div>
            <div className="dashboard-card">
              <div className="flex items-center gap-1.5 mb-1">
                <DollarSign className="h-4 w-4 text-emerald-600" />
                <p className="text-xs text-muted-foreground">Total Revenue</p>
              </div>
              <p className="text-2xl font-bold font-display text-emerald-600">C${salesStats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="dashboard-card">
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Avg. Price</p>
              </div>
              <p className="text-2xl font-bold font-display">C${salesStats.avgUnitPrice.toFixed(2)}</p>
            </div>
            <div className="dashboard-card">
              <div className="flex items-center gap-1.5 mb-1">
                <Users className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Unique Buyers</p>
              </div>
              <p className="text-2xl font-bold font-display">{salesStats.uniqueBuyers}</p>
            </div>
            <div className="dashboard-card">
              <div className="flex items-center gap-1.5 mb-1">
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Reorder Rate</p>
              </div>
              <p className="text-2xl font-bold font-display">{salesStats.reorderRate.toFixed(0)}%</p>
            </div>
          </div>

          {/* Sales Trend Chart (simplified) */}
          <div className="dashboard-card">
            <h3 className="font-display font-bold text-sm uppercase mb-4">Sales Trend (Last 30 Days)</h3>
            <div className="h-48 flex items-end gap-1">
              {salesStats.salesTrend.map((day, i) => {
                const maxUnits = Math.max(...salesStats.salesTrend.map(d => d.units), 1);
                const height = (day.units / maxUnits) * 100;
                return (
                  <div
                    key={i}
                    className="flex-1 bg-accent/20 hover:bg-accent/40 transition-colors rounded-t-sm relative group"
                    style={{ height: `${Math.max(height, 5)}%` }}
                  >
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                      {new Date(day.date).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}: {day.units} units
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>{new Date(salesStats.salesTrend[0]?.date).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}</span>
              <span>{new Date(salesStats.salesTrend[salesStats.salesTrend.length - 1]?.date).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}</span>
            </div>
          </div>

          {/* Top Buyers Preview */}
          <div className="dashboard-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-sm uppercase">Top Buyers</h3>
              <button onClick={() => setActiveTab("buyers")} className="text-xs text-accent hover:underline">
                View All
              </button>
            </div>
            <div className="space-y-3">
              {buyers.slice(0, 5).map((buyer, i) => (
                <div key={buyer.customerId} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs font-medium">
                      {i + 1}
                    </span>
                    <div>
                      <Link to={`/admin/customers/${buyer.customerId}`} className="text-sm font-medium hover:text-accent">
                        {buyer.companyName}
                      </Link>
                      <p className="text-xs text-muted-foreground">{buyer.orderCount} orders · {buyer.totalQuantity} units</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium">C${buyer.totalSpent.toFixed(2)}</span>
                </div>
              ))}
              {buyers.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No buyers yet</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* BUYERS TAB */}
      {activeTab === "buyers" && (
        <div className="space-y-4">
          <div className="dashboard-card">
            <h3 className="font-display font-bold text-sm uppercase mb-4 flex items-center gap-2">
              <Users className="h-4 w-4" /> All Buyers ({buyers.length})
            </h3>
            
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="table-header">
                    <th className="text-left px-3 py-2">Customer</th>
                    <th className="text-left px-3 py-2">Type</th>
                    <th className="text-right px-3 py-2">Orders</th>
                    <th className="text-right px-3 py-2">Qty Purchased</th>
                    <th className="text-right px-3 py-2">Total Spent</th>
                    <th className="text-left px-3 py-2">Last Purchase</th>
                    <th className="text-right px-3 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {buyers.map((buyer) => (
                    <React.Fragment key={buyer.customerId}>
                      <tr className="hover:bg-secondary/50 transition-colors">
                        <td className="px-3 py-3">
                          <Link to={`/admin/customers/${buyer.customerId}`} className="font-medium hover:text-accent">
                            {buyer.companyName}
                          </Link>
                          <p className="text-xs text-muted-foreground">{buyer.customerName}</p>
                        </td>
                        <td className="px-3 py-3">
                          <span className={`px-2 py-0.5 rounded-sm text-xs font-medium border ${customerTypeStyles[buyer.customerType]}`}>
                            {buyer.customerType}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-right">{buyer.orderCount}</td>
                        <td className="px-3 py-3 text-right font-medium">{buyer.totalQuantity}</td>
                        <td className="px-3 py-3 text-right font-medium">C${buyer.totalSpent.toFixed(2)}</td>
                        <td className="px-3 py-3 text-muted-foreground">
                          {new Date(buyer.lastPurchaseDate).toLocaleDateString()}
                        </td>
                        <td className="px-3 py-3 text-right">
                          <button
                            onClick={() => setExpandedBuyer(expandedBuyer === buyer.customerId ? null : buyer.customerId)}
                            className="p-1.5 hover:bg-secondary rounded-sm transition-colors"
                          >
                            {expandedBuyer === buyer.customerId ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </button>
                        </td>
                      </tr>
                      {/* Expanded Order Details */}
                      {expandedBuyer === buyer.customerId && (
                        <tr>
                          <td colSpan={7} className="px-3 py-3 bg-secondary/30">
                            <div className="space-y-2">
                              <p className="text-xs font-medium text-muted-foreground uppercase mb-2">Purchase History</p>
                              {buyer.orders.map((order) => (
                                <div key={order.orderId} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                                  <div className="flex items-center gap-4">
                                    <Link 
                                      to={`/admin/orders?orderId=${order.orderId}`}
                                      className="font-mono text-xs text-accent hover:underline"
                                    >
                                      {order.orderNumber}
                                    </Link>
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(order.date).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-4 text-xs">
                                    <span>{order.quantity} units</span>
                                    <span className="text-muted-foreground">@ C${order.unitPrice.toFixed(2)}</span>
                                    <span className="font-medium">C${order.total.toFixed(2)}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {buyers.map((buyer) => {
                const isExpanded = expandedBuyer === buyer.customerId;
                return (
                  <div key={buyer.customerId} className="border border-border rounded-md overflow-hidden">
                    <button
                      onClick={() => setExpandedBuyer(isExpanded ? null : buyer.customerId)}
                      className="w-full p-3 text-left flex items-center justify-between"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-medium text-sm truncate">{buyer.companyName}</span>
                          <span className={`px-1.5 py-0.5 rounded-sm text-xs font-medium border ${customerTypeStyles[buyer.customerType]}`}>
                            {buyer.customerType}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{buyer.orderCount} orders · {buyer.totalQuantity} units</p>
                        <p className="text-sm font-bold mt-1">C${buyer.totalSpent.toFixed(2)}</p>
                      </div>
                      {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
                    </button>
                    {isExpanded && (
                      <div className="px-3 pb-3 border-t border-border pt-3 space-y-2 bg-secondary/30">
                        <p className="text-xs font-medium text-muted-foreground uppercase mb-2">Purchase History</p>
                        {buyer.orders.map((order) => (
                          <div key={order.orderId} className="flex items-center justify-between text-xs py-1.5 border-b border-border last:border-0">
                            <div>
                              <Link to={`/admin/orders?orderId=${order.orderId}`} className="font-mono text-accent hover:underline">
                                {order.orderNumber}
                              </Link>
                              <span className="text-muted-foreground ml-2">{new Date(order.date).toLocaleDateString()}</span>
                            </div>
                            <span className="font-medium">{order.quantity} × C${order.unitPrice.toFixed(2)}</span>
                          </div>
                        ))}
                        <Link
                          to={`/admin/customers/${buyer.customerId}`}
                          className="w-full btn-accent text-xs py-2 rounded-sm font-medium mt-2 flex items-center justify-center gap-1"
                        >
                          <User className="h-3.5 w-3.5" /> View Customer
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {buyers.length === 0 && (
              <p className="text-center py-8 text-sm text-muted-foreground">No customers have purchased this product yet.</p>
            )}
          </div>
        </div>
      )}

      {/* ACTIVITY LOG TAB */}
      {activeTab === "activity" && (
        <div className="dashboard-card">
          <h3 className="font-display font-bold text-sm uppercase mb-4 flex items-center gap-2">
            <History className="h-4 w-4" /> Activity Log
          </h3>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
            <div className="space-y-6">
              {activityLogs.map((log) => (
                <div key={log.id} className="relative flex gap-4 pl-4">
                  <div className={`absolute left-0 w-8 h-8 rounded-full bg-card border-2 border-border flex items-center justify-center -translate-x-1/2 ${activityActionStyles[log.action] || "bg-secondary"}`}>
                    <Clock className="h-4 w-4" />
                  </div>
                  <div className="flex-1 ml-6">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-medium text-sm capitalize">{log.action.replace(/_/g, " ")}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                    {log.field && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">{log.field}:</span>{" "}
                        {log.oldValue && (
                          <>
                            <span className="line-through text-red-500">{log.oldValue}</span>
                            <span className="mx-1">→</span>
                          </>
                        )}
                        <span className="text-emerald-600">{log.newValue}</span>
                      </div>
                    )}
                    {log.metadata?.reason && (
                      <p className="text-xs text-muted-foreground mt-0.5">{String(log.metadata.reason)}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">by {log.user}</p>
                  </div>
                </div>
              ))}
              {activityLogs.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">No activity recorded</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom save bar for mobile */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-3 z-40 flex gap-2">
        <button onClick={handleSave} className="flex-1 btn-accent py-3 rounded-sm text-sm font-semibold flex items-center justify-center gap-2">
          <Save className="h-4 w-4" /> Save Product
        </button>
      </div>
      <div className="sm:hidden h-16" /> {/* spacer for fixed bar */}
    </div>
  );
}
