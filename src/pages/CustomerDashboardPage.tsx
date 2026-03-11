import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Package, User, MapPin, Clock } from "lucide-react";

const mockOrders = [
  { id: "RMQ-001234", date: "2026-03-10", total: 2450.0, status: "processing", items: 4 },
  { id: "RMQ-001220", date: "2026-02-28", total: 890.5, status: "completed", items: 2 },
  { id: "RMQ-001198", date: "2026-02-15", total: 3200.0, status: "completed", items: 8 },
];

const statusStyles: Record<string, string> = {
  pending: "badge-warning",
  processing: "badge-info",
  shipped: "badge-info",
  completed: "badge-success",
  cancelled: "badge-destructive",
};

export default function CustomerDashboardPage() {
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-bold mb-8">{t("customer.dashboard")}</h1>

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <div className="dashboard-card flex items-center gap-3">
          <Package className="h-8 w-8 text-accent" strokeWidth={1.5} />
          <div>
            <p className="text-sm text-muted-foreground">{t("customer.total_orders")}</p>
            <p className="text-xl font-bold font-display">{mockOrders.length}</p>
          </div>
        </div>
        <div className="dashboard-card flex items-center gap-3">
          <Clock className="h-8 w-8 text-accent" strokeWidth={1.5} />
          <div>
            <p className="text-sm text-muted-foreground">{t("customer.pending_orders")}</p>
            <p className="text-xl font-bold font-display">1</p>
          </div>
        </div>
        <div className="dashboard-card flex items-center gap-3">
          <User className="h-8 w-8 text-accent" strokeWidth={1.5} />
          <div>
            <p className="text-sm text-muted-foreground">{t("customer.account_type")}</p>
            <p className="text-xl font-bold font-display">{t("customer.wholesale")}</p>
          </div>
        </div>
        <div className="dashboard-card flex items-center gap-3">
          <MapPin className="h-8 w-8 text-accent" strokeWidth={1.5} />
          <div>
            <p className="text-sm text-muted-foreground">{t("customer.addresses")}</p>
            <p className="text-xl font-bold font-display">2</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent orders */}
        <div className="lg:col-span-2 dashboard-card">
          <h3 className="font-display font-bold text-sm uppercase mb-4">{t("customer.recent_orders")}</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="table-header">
                  <th className="text-left px-3 py-2">{t("order.number")}</th>
                  <th className="text-left px-3 py-2">{t("customer.date")}</th>
                  <th className="text-right px-3 py-2">{t("customer.items")}</th>
                  <th className="text-right px-3 py-2">{t("cart.total")}</th>
                  <th className="text-left px-3 py-2">{t("order.status")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {mockOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-secondary/50 transition-colors">
                    <td className="px-3 py-2.5 font-medium">{order.id}</td>
                    <td className="px-3 py-2.5 text-muted-foreground">{order.date}</td>
                    <td className="px-3 py-2.5 text-right">{order.items}</td>
                    <td className="px-3 py-2.5 text-right font-medium">{formatPrice(order.total)}</td>
                    <td className="px-3 py-2.5"><span className={statusStyles[order.status]}>{order.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Account info */}
        <div className="dashboard-card">
          <h3 className="font-display font-bold text-sm uppercase mb-4">{t("customer.account_info")}</h3>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-muted-foreground">{t("contact.name")}</span>
              <p className="font-medium">Jean-Pierre Lavoie</p>
            </div>
            <div>
              <span className="text-muted-foreground">{t("checkout.company")}</span>
              <p className="font-medium">Groupe Transport Lévis</p>
            </div>
            <div>
              <span className="text-muted-foreground">{t("auth.email")}</span>
              <p className="font-medium">jp@gtl.ca</p>
            </div>
            <div>
              <span className="text-muted-foreground">{t("checkout.phone")}</span>
              <p className="font-medium">+1 418 555 0101</p>
            </div>
          </div>
          <Link to="/login" className="block mt-4 text-sm text-accent hover:underline">{t("customer.edit_profile")}</Link>
        </div>
      </div>
    </div>
  );
}
