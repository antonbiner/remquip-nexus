import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Minus, Plus, ShoppingCart, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useCart } from "@/contexts/CartContext";
import { products } from "@/config/products";

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

  const product = products.find((p) => p.slug === slug);
  if (!product) {
    return <div className="container mx-auto px-4 py-16 text-center text-muted-foreground">Product not found.</div>;
  }

  const stockLabel = product.stock > 20 ? t("products.in_stock") : product.stock > 0 ? t("products.low_stock") : t("products.out_of_stock");
  const stockClass = product.stock > 20 ? "text-success" : product.stock > 0 ? "text-warning" : "text-destructive";

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <span className="mx-2">/</span>
        <Link to={`/products/${product.categorySlug}`} className="hover:text-foreground">{product.category}</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="aspect-square bg-secondary rounded-md overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>

        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-sm text-muted-foreground mb-4">{t("products.sku")}: {product.sku}</p>
          <p className="text-3xl font-bold text-foreground mb-2">{formatPrice(product.price)}</p>
          <p className={`text-sm font-medium mb-6 flex items-center gap-1 ${stockClass}`}>
            <CheckCircle className="h-4 w-4" /> {stockLabel}
          </p>

          <p className="text-sm text-muted-foreground mb-6">{product.description}</p>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-border rounded-sm">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 hover:bg-secondary transition-colors"><Minus className="h-4 w-4" /></button>
              <span className="px-4 py-2 text-sm font-medium min-w-[40px] text-center">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="px-3 py-2 hover:bg-secondary transition-colors"><Plus className="h-4 w-4" /></button>
            </div>
            <button
              onClick={() => addItem(product, qty)}
              disabled={product.stock === 0}
              className="flex-1 btn-accent py-3 rounded-sm font-semibold uppercase tracking-wide flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <ShoppingCart className="h-4 w-4" /> {t("products.add_to_cart")}
            </button>
          </div>

          {/* Specifications */}
          <div className="border border-border rounded-sm overflow-hidden">
            <h3 className="font-display font-bold text-sm uppercase px-4 py-3 bg-secondary">Specifications</h3>
            <div className="divide-y divide-border">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex px-4 py-2.5 text-sm">
                  <span className="w-40 text-muted-foreground">{key}</span>
                  <span className="font-medium text-foreground">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
