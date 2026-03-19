import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Package, Warehouse, ShoppingBag, Users, FileText,
  BarChart3, Settings, ChevronLeft, Menu, X, Tag, Shield,
} from "lucide-react";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, path: "/admin" },
  { label: "Products", icon: Package, path: "/admin/products" },
  { label: "Inventory", icon: Warehouse, path: "/admin/inventory" },
  { label: "Orders", icon: ShoppingBag, path: "/admin/orders" },
  { label: "Customers", icon: Users, path: "/admin/customers" },
  { label: "Discounts", icon: Tag, path: "/admin/discounts" },
  { label: "CMS", icon: FileText, path: "/admin/cms" },
  { label: "Analytics", icon: BarChart3, path: "/admin/analytics" },
  { label: "Users", icon: Users, path: "/admin/users" },
  { label: "Access Control", icon: Shield, path: "/admin/access" },
  { label: "Settings", icon: Settings, path: "/admin/settings" },
];

export default function AdminLayout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);

  const currentPage = navItems.find(
    (item) => location.pathname === item.path || (item.path !== "/admin" && location.pathname.startsWith(item.path))
  );

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile nav overlay */}
      {mobileNav && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" onClick={() => setMobileNav(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-sidebar text-sidebar-foreground flex flex-col">
            <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border/50">
              <span className="font-display text-xl font-bold tracking-tight text-sidebar-primary">REMQUIP</span>
              <button onClick={() => setMobileNav(false)} className="text-sidebar-foreground hover:text-sidebar-primary"><X className="h-5 w-5" /></button>
            </div>
            <nav className="flex-1 py-6 space-y-0.5 px-3 overflow-y-auto">
              {navItems.map((item) => {
                const active = location.pathname === item.path || (item.path !== "/admin" && location.pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileNav(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      active 
                        ? "bg-sidebar-accent/20 text-sidebar-primary bg-sidebar-accent" 
                        : "text-sidebar-foreground hover:bg-sidebar-border/30"
                    }`}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-sidebar-border/50">
              <Link to="/" className="text-sm text-sidebar-foreground hover:text-sidebar-primary font-medium transition-colors flex items-center gap-2">
                <ChevronLeft className="h-4 w-4" /> Back to Store
              </Link>
            </div>
          </aside>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex bg-sidebar text-sidebar-foreground flex-col border-r border-sidebar-border/50 transition-all duration-200 ${collapsed ? "w-20" : "w-64"}`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border/50">
          {!collapsed && <span className="font-display text-xl font-bold tracking-tight text-sidebar-primary">REMQUIP</span>}
          <button onClick={() => setCollapsed(!collapsed)} className="text-sidebar-foreground hover:text-sidebar-primary transition-colors p-1.5 hover:bg-sidebar-border/30 rounded-lg">
            {collapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>
        <nav className="flex-1 py-6 space-y-0.5 px-3">
          {navItems.map((item) => {
            const active = location.pathname === item.path || (item.path !== "/admin" && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active 
                    ? "bg-sidebar-accent text-sidebar-primary" 
                    : "text-sidebar-foreground hover:bg-sidebar-border/30"
                } ${collapsed ? "justify-center" : ""}`}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-sidebar-border/50">
          <Link to="/" title={collapsed ? "Back to Store" : undefined} className={`text-sm text-sidebar-foreground hover:text-sidebar-primary font-medium transition-colors flex items-center gap-2 p-1.5 hover:bg-sidebar-border/30 rounded-lg ${collapsed ? "justify-center" : ""}`}>
            {collapsed ? <ChevronLeft className="h-5 w-5" /> : <><ChevronLeft className="h-4 w-4" /> Back</>}
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 bg-background">
        <header className="h-16 bg-card border-b border-border/50 flex items-center px-4 md:px-8 gap-4 sticky top-0 z-40">
          <button onClick={() => setMobileNav(true)} className="md:hidden text-foreground hover:text-accent transition-colors">
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <h2 className="font-display font-bold text-lg text-foreground">{currentPage?.label || "Admin Dashboard"}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Manage your business operations</p>
          </div>
        </header>
        <main className="flex-1 p-6 md:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
