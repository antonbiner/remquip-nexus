import React from "react";
import { Edit, Eye } from "lucide-react";

const cmsPages = [
  { id: "cms-1", title: "Homepage", slug: "/", status: "published", lastModified: "2026-03-10", sections: 6 },
  { id: "cms-2", title: "About Us", slug: "/about", status: "published", lastModified: "2026-03-05", sections: 3 },
  { id: "cms-3", title: "Contact", slug: "/contact", status: "published", lastModified: "2026-03-01", sections: 2 },
  { id: "cms-4", title: "Terms & Conditions", slug: "/terms", status: "published", lastModified: "2026-02-20", sections: 1 },
  { id: "cms-5", title: "Privacy Policy", slug: "/privacy", status: "published", lastModified: "2026-02-20", sections: 1 },
  { id: "cms-6", title: "Shipping Policy", slug: "/shipping", status: "draft", lastModified: "2026-02-15", sections: 1 },
  { id: "cms-7", title: "Refund Policy", slug: "/refund", status: "draft", lastModified: "2026-02-15", sections: 1 },
];

export default function AdminCMS() {
  return (
    <div className="space-y-6">
      <h2 className="font-display font-bold text-xl">CMS Page Editor</h2>

      <div className="dashboard-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="table-header">
                <th className="text-left px-3 py-2">Page</th>
                <th className="text-left px-3 py-2">Slug</th>
                <th className="text-right px-3 py-2">Sections</th>
                <th className="text-left px-3 py-2">Status</th>
                <th className="text-left px-3 py-2">Last Modified</th>
                <th className="text-right px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {cmsPages.map((page) => (
                <tr key={page.id} className="hover:bg-secondary/50 transition-colors">
                  <td className="px-3 py-3 font-medium">{page.title}</td>
                  <td className="px-3 py-3 text-muted-foreground font-mono text-xs">{page.slug}</td>
                  <td className="px-3 py-3 text-right">{page.sections}</td>
                  <td className="px-3 py-3">
                    <span className={page.status === "published" ? "badge-success" : "badge-warning"}>{page.status}</span>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">{page.lastModified}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 hover:bg-secondary rounded-sm transition-colors"><Eye className="h-4 w-4" /></button>
                      <button className="p-1.5 hover:bg-secondary rounded-sm transition-colors"><Edit className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CMS JSON structure preview */}
      <div className="dashboard-card">
        <h3 className="font-display font-bold text-sm uppercase mb-4">Content Structure (JSON)</h3>
        <pre className="bg-secondary rounded-sm p-4 text-xs overflow-x-auto text-muted-foreground">
{JSON.stringify({
  page: "homepage",
  sections: [
    { type: "hero", data: { titleKey: "hero.title", subtitleKey: "hero.subtitle", ctaKey: "hero.cta" } },
    { type: "features", data: { items: ["features.experience", "features.fleet", "features.canadian", "features.quality"] } },
    { type: "about", data: { titleKey: "about.title", descriptionKey: "about.description" } },
    { type: "products", data: { titleKey: "products.new", limit: 4 } },
    { type: "banner", data: { titleKey: "banner.stock.title" } },
    { type: "wholesale", data: { titleKey: "wholesale.title" } },
  ],
}, null, 2)}
        </pre>
      </div>
    </div>
  );
}
