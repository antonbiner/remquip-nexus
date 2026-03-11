import React from "react";

export default function AdminSettings() {
  return (
    <div className="space-y-6">
      <h2 className="font-display font-bold text-xl">Settings</h2>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="dashboard-card">
          <h3 className="font-display font-bold text-sm uppercase mb-4">General</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Store Name</label>
              <input defaultValue="REMQUIP" className="w-full border border-border rounded-sm px-3 py-2 text-sm bg-background outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Contact Email</label>
              <input defaultValue="info@remquip.ca" className="w-full border border-border rounded-sm px-3 py-2 text-sm bg-background outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Default Currency</label>
              <select defaultValue="CAD" className="w-full border border-border rounded-sm px-3 py-2 text-sm bg-background outline-none">
                <option>CAD</option><option>USD</option><option>EUR</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Default Language</label>
              <select defaultValue="en" className="w-full border border-border rounded-sm px-3 py-2 text-sm bg-background outline-none">
                <option value="en">English</option><option value="fr">Français</option>
              </select>
            </div>
            <button className="btn-accent px-6 py-2 rounded-sm text-sm font-medium">Save Changes</button>
          </div>
        </div>

        <div className="dashboard-card">
          <h3 className="font-display font-bold text-sm uppercase mb-4">Tax & Shipping</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tax Rate (%)</label>
              <input defaultValue="14.975" type="number" step="0.001" className="w-full border border-border rounded-sm px-3 py-2 text-sm bg-background outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Free Shipping Threshold (CAD)</label>
              <input defaultValue="500" type="number" className="w-full border border-border rounded-sm px-3 py-2 text-sm bg-background outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Flat Shipping Rate (CAD)</label>
              <input defaultValue="25" type="number" className="w-full border border-border rounded-sm px-3 py-2 text-sm bg-background outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <button className="btn-accent px-6 py-2 rounded-sm text-sm font-medium">Save Changes</button>
          </div>
        </div>

        <div className="dashboard-card">
          <h3 className="font-display font-bold text-sm uppercase mb-4">Integrations</h3>
          <div className="space-y-3">
            {["Stripe", "PayPal", "Shipping API", "Email Service"].map((name) => (
              <div key={name} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span className="text-sm font-medium">{name}</span>
                <span className="badge-warning">Not Connected</span>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card">
          <h3 className="font-display font-bold text-sm uppercase mb-4">API Keys</h3>
          <p className="text-sm text-muted-foreground mb-4">Manage API access for external integrations.</p>
          <button className="btn-accent px-6 py-2 rounded-sm text-sm font-medium">Generate API Key</button>
        </div>
      </div>
    </div>
  );
}
