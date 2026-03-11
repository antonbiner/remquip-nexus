import React, { useState } from "react";
import { Search, Plus, Edit, Trash2, Copy } from "lucide-react";
import { products } from "@/config/products";

const statusStyles: Record<string, string> = {
  active: "badge-success",
  draft: "badge-warning",
  archived: "badge-destructive",
};

export default function AdminProducts() {
  const [search, setSearch] = useState("");
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-xl">Product Management</h2>
        <button className="btn-accent px-4 py-2 rounded-sm text-sm font-medium flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      <div className="dashboard-card">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border border-border rounded-sm text-sm bg-background outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <select className="border border-border rounded-sm px-3 py-2 text-sm bg-background outline-none">
            <option>All Categories</option>
            <option>Air Suspension</option>
            <option>Brake Shoes & Pads</option>
            <option>Brake Chambers</option>
            <option>Brake Drums</option>
          </select>
          <select className="border border-border rounded-sm px-3 py-2 text-sm bg-background outline-none">
            <option>All Status</option>
            <option>Active</option>
            <option>Draft</option>
            <option>Archived</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="table-header">
                <th className="text-left px-3 py-2">Product</th>
                <th className="text-left px-3 py-2">SKU</th>
                <th className="text-left px-3 py-2">Category</th>
                <th className="text-right px-3 py-2">Price</th>
                <th className="text-right px-3 py-2">Stock</th>
                <th className="text-left px-3 py-2">Status</th>
                <th className="text-right px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-secondary/50 transition-colors">
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt="" className="w-10 h-10 rounded-sm object-cover bg-secondary" />
                      <span className="font-medium truncate max-w-[200px]">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">{product.sku}</td>
                  <td className="px-3 py-3">{product.category}</td>
                  <td className="px-3 py-3 text-right font-medium">C${product.price.toFixed(2)}</td>
                  <td className={`px-3 py-3 text-right font-medium ${product.stock < 50 ? "text-warning" : ""}`}>{product.stock}</td>
                  <td className="px-3 py-3"><span className={statusStyles[product.status]}>{product.status}</span></td>
                  <td className="px-3 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 hover:bg-secondary rounded-sm transition-colors" title="Edit"><Edit className="h-4 w-4" /></button>
                      <button className="p-1.5 hover:bg-secondary rounded-sm transition-colors" title="Duplicate"><Copy className="h-4 w-4" /></button>
                      <button className="p-1.5 hover:bg-secondary rounded-sm transition-colors text-destructive" title="Delete"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
          <span>Showing {filtered.length} of {products.length} products</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-border rounded-sm hover:bg-secondary">Prev</button>
            <button className="px-3 py-1 bg-accent text-accent-foreground rounded-sm">1</button>
            <button className="px-3 py-1 border border-border rounded-sm hover:bg-secondary">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
