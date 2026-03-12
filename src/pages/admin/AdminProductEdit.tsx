import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, Trash2, Plus, GripVertical } from "lucide-react";
import { products, categories, type Product } from "@/config/products";

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
});

export default function AdminProductEdit() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const isNew = !productId || productId === "new";

  const existing = !isNew ? products.find((p) => p.id === productId) : null;

  const [form, setForm] = useState(() => existing ? { ...existing } : emptyProduct());
  const [specsJson, setSpecsJson] = useState(() =>
    JSON.stringify(form.specifications || {}, null, 2)
  );
  const [specsError, setSpecsError] = useState("");

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

  function generateSlug(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function handleSave() {
    // In production, this would call an API
    alert(`Product "${form.name}" saved (demo mode)`);
    navigate("/admin/products");
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/admin/products" className="p-1.5 hover:bg-secondary rounded-sm transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h2 className="font-display font-bold text-xl">
            {isNew ? "Create Product" : `Edit: ${form.name}`}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {!isNew && (
            <button className="px-4 py-2 rounded-sm text-sm font-medium border border-destructive text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-2">
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          )}
          <button onClick={handleSave} className="btn-accent px-4 py-2 rounded-sm text-sm font-medium flex items-center gap-2">
            <Save className="h-4 w-4" /> Save Product
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
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
            <div className="grid grid-cols-2 gap-4">
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
            <div className="grid grid-cols-4 gap-3">
              {(existing?.images || []).map((img, i) => (
                <div key={img.id} className="aspect-square bg-secondary rounded-sm overflow-hidden relative group">
                  <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors flex items-center justify-center gap-1">
                    <button className="opacity-0 group-hover:opacity-100 p-1 bg-background rounded-sm" title="Reorder">
                      <GripVertical className="h-4 w-4" />
                    </button>
                    <button className="opacity-0 group-hover:opacity-100 p-1 bg-background rounded-sm text-destructive" title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  {i === 0 && <span className="absolute bottom-1 left-1 text-[10px] bg-accent text-accent-foreground px-1.5 py-0.5 rounded-sm font-medium">Primary</span>}
                </div>
              ))}
              <button className="aspect-square border-2 border-dashed border-border rounded-sm flex flex-col items-center justify-center text-muted-foreground hover:border-accent hover:text-accent transition-colors">
                <Plus className="h-6 w-6" />
                <span className="text-xs mt-1">Add Image</span>
              </button>
            </div>
            <p className="text-xs text-muted-foreground">Drag to reorder. First image is the primary product image.</p>
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
          </div>

          {/* Inventory */}
          <div className="dashboard-card space-y-4">
            <h3 className="font-display font-bold text-sm uppercase text-muted-foreground">Inventory</h3>
            <div>
              <label className="block text-sm font-medium mb-1">Stock Quantity</label>
              <input type="number" value={form.stock} onChange={(e) => updateField("stock", parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-border rounded-sm text-sm bg-background outline-none focus:ring-2 focus:ring-accent" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
