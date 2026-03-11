import React, { useState } from "react";
import { AlertTriangle, ArrowUpDown, ArrowLeftRight, Search } from "lucide-react";
import { products } from "@/config/products";

const warehouses = [
  { id: "wh-1", name: "Quebec City HQ", code: "QC-01" },
  { id: "wh-2", name: "Montreal Distribution", code: "QC-02" },
  { id: "wh-3", name: "Toronto Warehouse", code: "ON-01" },
];

// Simulated multi-warehouse stock
function getWarehouseStock(productStock: number, whIndex: number): number {
  const splits = [0.5, 0.3, 0.2];
  return Math.round(productStock * splits[whIndex]);
}

export default function AdminInventory() {
  const [search, setSearch] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState("all");

  const sorted = [...products]
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.stock - b.stock);

  const totalUnits = products.reduce((s, p) => s + p.stock, 0);
  const lowStockCount = products.filter((p) => p.stock < 50).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-xl">Inventory Management</h2>
        <button className="btn-accent px-4 py-2 rounded-sm text-sm font-medium flex items-center gap-2">
          <ArrowLeftRight className="h-4 w-4" /> Stock Transfer
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="dashboard-card">
          <p className="text-sm text-muted-foreground">Total SKUs</p>
          <p className="text-2xl font-bold font-display">{products.length}</p>
        </div>
        <div className="dashboard-card">
          <p className="text-sm text-muted-foreground">Total Units</p>
          <p className="text-2xl font-bold font-display">{totalUnits}</p>
        </div>
        <div className="dashboard-card">
          <p className="text-sm text-muted-foreground">Warehouses</p>
          <p className="text-2xl font-bold font-display">{warehouses.length}</p>
        </div>
        <div className="dashboard-card">
          <p className="text-sm text-muted-foreground">Low Stock</p>
          <p className="text-2xl font-bold font-display text-warning">{lowStockCount}</p>
        </div>
        <div className="dashboard-card">
          <p className="text-sm text-muted-foreground">Out of Stock</p>
          <p className="text-2xl font-bold font-display text-destructive">{outOfStockCount}</p>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by product or SKU..."
              className="w-full pl-10 pr-4 py-2 border border-border rounded-sm text-sm bg-background outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <select
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
            className="border border-border rounded-sm px-3 py-2 text-sm bg-background outline-none"
          >
            <option value="all">All Warehouses</option>
            {warehouses.map((wh) => (
              <option key={wh.id} value={wh.id}>{wh.name} ({wh.code})</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="table-header">
                <th className="text-left px-3 py-2">Product</th>
                <th className="text-left px-3 py-2">SKU</th>
                <th className="text-left px-3 py-2">Category</th>
                {selectedWarehouse === "all" ? (
                  warehouses.map((wh) => (
                    <th key={wh.id} className="text-right px-3 py-2">{wh.code}</th>
                  ))
                ) : null}
                <th className="text-right px-3 py-2 cursor-pointer">
                  <span className="flex items-center justify-end gap-1">Total <ArrowUpDown className="h-3 w-3" /></span>
                </th>
                <th className="text-left px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sorted.map((p) => (
                <tr key={p.id} className="hover:bg-secondary/50 transition-colors">
                  <td className="px-3 py-3 font-medium">{p.name}</td>
                  <td className="px-3 py-3 text-muted-foreground">{p.sku}</td>
                  <td className="px-3 py-3">{p.category}</td>
                  {selectedWarehouse === "all" ? (
                    warehouses.map((wh, i) => {
                      const whStock = getWarehouseStock(p.stock, i);
                      return (
                        <td key={wh.id} className={`px-3 py-3 text-right font-medium ${whStock < 10 ? "text-warning" : ""}`}>
                          {whStock}
                        </td>
                      );
                    })
                  ) : null}
                  <td className={`px-3 py-3 text-right font-medium ${p.stock < 50 ? "text-warning" : ""}`}>
                    {p.stock < 50 && <AlertTriangle className="h-3 w-3 inline mr-1" />}{p.stock}
                  </td>
                  <td className="px-3 py-3">
                    <span className={p.stock > 20 ? "badge-success" : p.stock > 0 ? "badge-warning" : "badge-destructive"}>
                      {p.stock > 20 ? "In Stock" : p.stock > 0 ? "Low" : "Out"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
