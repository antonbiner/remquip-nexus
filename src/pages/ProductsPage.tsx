import React from "react";
import { useParams, Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useCart } from "@/contexts/CartContext";
import { categories, products } from "@/config/products";

export default function ProductsPage() {
  const { categorySlug } = useParams<{ categorySlug?: string }>();
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();
  const { addItem } = useCart();

  const category = categorySlug ? categories.find((c) => c.slug === categorySlug) : null;
  const filtered = categorySlug
    ? products.filter((p) => p.categorySlug === categorySlug)
    : products;

  const pageTitle = category ? t(category.translationKey) : t("cat.shop_all");

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-4">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{pageTitle}</span>
      </nav>

      <h1 className="font-display text-3xl font-bold uppercase mb-8">{pageTitle}</h1>

      <div className="flex gap-8">
        {/* Sidebar filters */}
        <aside className="hidden md:block w-56 flex-shrink-0">
          <div className="border border-border rounded-sm p-4 mb-4">
            <h3 className="font-display font-bold text-sm uppercase mb-3">{category ? t(category.translationKey) : t("footer.categories")}</h3>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/products/${cat.slug}`}
                    className={`text-sm ${cat.slug === categorySlug ? "text-accent font-medium" : "text-muted-foreground hover:text-foreground"} transition-colors`}
                  >
                    {t(cat.translationKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-border rounded-sm p-4">
            <h3 className="font-display font-bold text-sm uppercase mb-3">{t("products.shop_by_price")}</h3>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li className="hover:text-foreground cursor-pointer">$0.00 – $29.00</li>
              <li className="hover:text-foreground cursor-pointer">$29.00 – $59.00</li>
              <li className="hover:text-foreground cursor-pointer">$59.00 – $99.00</li>
              <li className="hover:text-foreground cursor-pointer">$99.00 – $199.00</li>
              <li className="hover:text-foreground cursor-pointer">$199.00+</li>
            </ul>
          </div>
        </aside>

        {/* Product grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-muted-foreground">{filtered.length} products</span>
            <select className="text-sm border border-border rounded-sm px-3 py-1.5 bg-background text-foreground outline-none">
              <option>{t("products.featured")}</option>
              <option>{t("products.price_low")}</option>
              <option>{t("products.price_high")}</option>
              <option>{t("products.newest")}</option>
            </select>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filtered.map((product) => (
              <div key={product.id} className="product-card group">
                <div className="aspect-square overflow-hidden bg-secondary">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                </div>
                <div className="p-3 md:p-4">
                  <Link to={`/product/${product.slug}`} className="text-sm font-medium text-foreground hover:text-accent transition-colors line-clamp-2 uppercase">
                    {product.name}
                  </Link>
                  <p className="text-sm font-bold text-foreground mt-2">{formatPrice(product.price)}</p>
                  <button onClick={() => addItem(product)} className="mt-2 w-full btn-accent text-xs py-2 rounded-sm font-medium uppercase tracking-wide">
                    {t("products.add_to_cart")}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <p>No products found in this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
