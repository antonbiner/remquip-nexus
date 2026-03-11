import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Package, Warehouse, ShoppingBag, Users, FileText,
  BarChart3, Settings, ChevronLeft, Menu,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, path: "/admin" },
  { label: "Products", icon: Package, path: "/admin/products" },
  { label: "Inventory", icon: Warehouse, path: "/admin/inventory" },
  { label: "Orders", icon: ShoppingBag, path: "/admin/orders" },
  { label: "Customers", icon: Users, path: "/admin/customers" },
  { label: "CMS", icon: FileText, path: "/admin/cms" },
  { label: "Analytics", icon: BarChart3, path: "/admin/analytics" },
  { label: "Settings", icon: Settings, path: "/admin/settings" },
];

export default function AdminLayout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex bg-secondary">
      {/* Sidebar */}
      <aside className={`bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-200 ${collapsed ? "w-16" : "w-60"}`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
          {!collapsed && <span className="font-display text-lg font-bold tracking-wider text-sidebar-primary">REMQUIP</span>}
          <button onClick={() => setCollapsed(!collapsed)} className="text-sidebar-foreground hover:text-sidebar-primary transition-colors">
            {collapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>
        <nav className="flex-1 py-4 space-y-1 px-2">
          {navItems.map((item) => {
            const active = location.pathname === item.path || (item.path !== "/admin" && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-colors ${
                  active ? "bg-sidebar-accent text-sidebar-primary font-medium" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          <Link to="/" className={`text-sm text-sidebar-foreground hover:text-sidebar-primary transition-colors ${collapsed ? "text-center block" : ""}`}>
            {collapsed ? "←" : "← Back to Store"}
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-card border-b border-border flex items-center px-6">
          <h2 className="font-display font-bold text-lg">Admin Dashboard</h2>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
