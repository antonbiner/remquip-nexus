import React from "react";
import { BarChart3, TrendingUp } from "lucide-react";

export default function AdminAnalytics() {
  return (
    <div className="space-y-6">
      <h2 className="font-display font-bold text-xl">Analytics</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="dashboard-card"><p className="text-sm text-muted-foreground">Page Views (30d)</p><p className="text-2xl font-bold font-display">12,480</p></div>
        <div className="dashboard-card"><p className="text-sm text-muted-foreground">Conversion Rate</p><p className="text-2xl font-bold font-display">3.2%</p></div>
        <div className="dashboard-card"><p className="text-sm text-muted-foreground">Avg Order Value</p><p className="text-2xl font-bold font-display">C$1,240</p></div>
        <div className="dashboard-card"><p className="text-sm text-muted-foreground">Return Customers</p><p className="text-2xl font-bold font-display">64%</p></div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="dashboard-card">
          <h3 className="font-display font-bold text-sm uppercase mb-4 flex items-center gap-2"><BarChart3 className="h-4 w-4 text-accent" /> Revenue by Category</h3>
          <div className="space-y-3">
            {[
              { cat: "Brake Shoes & Pads", pct: 38, val: "C$18,350" },
              { cat: "Brake Chambers", pct: 26, val: "C$12,555" },
              { cat: "Air Suspension", pct: 22, val: "C$10,624" },
              { cat: "Brake Drums", pct: 14, val: "C$6,761" },
            ].map((item) => (
              <div key={item.cat}>
                <div className="flex justify-between text-sm mb-1"><span>{item.cat}</span><span className="font-medium">{item.val}</span></div>
                <div className="w-full bg-secondary rounded-sm h-2"><div className="bg-accent h-2 rounded-sm" style={{ width: `${item.pct}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
        <div className="dashboard-card">
          <h3 className="font-display font-bold text-sm uppercase mb-4 flex items-center gap-2"><TrendingUp className="h-4 w-4 text-accent" /> Top Products</h3>
          <div className="space-y-3">
            {[
              { name: "ADB22X Air Disc Brake Pad Kit", units: 45 },
              { name: "30/30 Long Stroke Brake Chamber", units: 38 },
              { name: "4707Q Brake Shoe Kit", units: 32 },
              { name: "Brake Drum - Gunite 3600A", units: 28 },
              { name: "Air Spring W01-358 9781", units: 24 },
            ].map((p, i) => (
              <div key={p.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold">{i + 1}</span>
                  <span className="truncate max-w-[200px]">{p.name}</span>
                </div>
                <span className="text-muted-foreground">{p.units} units</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
