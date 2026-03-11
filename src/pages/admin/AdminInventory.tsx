import React from "react";
import { AlertTriangle, ArrowUpDown } from "lucide-react";
import { products } from "@/config/products";

export default function AdminInventory() {
  const sorted = [...products].sort((a, b) => a.stock - b.stock);

  return (
    <div className="space-y-6">
      <h2 className="font-display font-bold text-xl">Inventory Management</h2>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="dashboard-card">
          <p className="text-sm text-muted-foreground">Total SKUs</p>
          <p className="text-2xl font-bold font-display">{products.length}</p>
        </div>
        <div className="dashboard-card">
          <p className="text-sm text-muted-foreground">Total Units</p>
          <p className="text-2xl font-bold font-display">{products.reduce((s, p) => s + p.stock, 0)}</p>
        </div>
        <div className="dashboard-card">
          <p className="text-sm text-muted-foreground">Low Stock Items</p>
          <p className="text-2xl font-bold font-display text-warning">{products.filter((p) => p.stock < 50).length}</p>
        </div>
        <div className="dashboard-card">
          <p className="text-sm text-muted-foreground">Out of Stock</p>
          <p className="text-2xl font-bold font-display text-destructive">{products.filter((p) => p.stock === 0).length}</p>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="table-header">
                <th className="text-left px-3 py-2">Product</th>
                <th className="text-left px-3 py-2">SKU</th>
                <th className="text-left px-3 py-2">Category</th>
                <th className="text-right px-3 py-2 cursor-pointer"><span className="flex items-center justify-end gap-1">Stock <ArrowUpDown className="h-3 w-3" /></span></th>
                <th className="text-left px-3 py-2">Status</th>
                <th className="text-left px-3 py-2">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sorted.map((p) => (
                <tr key={p.id} className="hover:bg-secondary/50 transition-colors">
                  <td className="px-3 py-3 font-medium">{p.name}</td>
                  <td className="px-3 py-3 text-muted-foreground">{p.sku}</td>
                  <td className="px-3 py-3">{p.category}</td>
                  <td className={`px-3 py-3 text-right font-medium ${p.stock < 50 ? "text-warning" : ""}`}>
                    {p.stock < 50 && <AlertTriangle className="h-3 w-3 inline mr-1" />}{p.stock}
                  </td>
                  <td className="px-3 py-3">
                    <span className={p.stock > 20 ? "badge-success" : p.stock > 0 ? "badge-warning" : "badge-destructive"}>
                      {p.stock > 20 ? "In Stock" : p.stock > 0 ? "Low" : "Out"}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">Warehouse A</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
