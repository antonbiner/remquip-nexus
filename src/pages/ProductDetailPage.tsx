import React, { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Minus, Plus, ShoppingCart, CheckCircle, ChevronRight, ZoomIn, X, Truck, Shield, FileText } from "lucide-react";
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
  const [activeImage, setActiveImage] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const product = products.find((p) => p.slug === slug);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
      .slice(0, 4);
  }, [product]);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-muted-foreground">
        {t("products.not_found")}
      </div>
    );
  }

  const stockLabel = product.stock > 20 ? t("products.in_stock") : product.stock > 0 ? t("products.low_stock") : t("products.out_of_stock");
  const stockClass = product.stock > 20 ? "text-success" : product.stock > 0 ? "text-warning" : "text-destructive";
  const images = product.images.length > 0 ? product.images : [{ id: "default", url: product.image, alt: product.name, position: 0 }];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-muted-foreground mb-6 gap-1">
        <Link to="/" className="hover:text-foreground transition-colors">{t("nav.home")}</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to={`/products/${product.categorySlug}`} className="hover:text-foreground transition-colors">{product.category}</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground truncate">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div className="space-y-3">
          <div
            className="aspect-square bg-secondary rounded-md overflow-hidden relative group cursor-zoom-in"
            onClick={() => setLightbox(true)}
          >
            <img
              src={images[activeImage].url}
              alt={images[activeImage].alt}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors flex items-center justify-center">
              <ZoomIn className="h-8 w-8 text-foreground/0 group-hover:text-foreground/40 transition-colors" />
            </div>
          </div>
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-16 md:w-20 md:h-20 rounded-sm overflow-hidden border-2 transition-colors flex-shrink-0 ${
                    i === activeImage ? "border-accent" : "border-border hover:border-muted-foreground"
                  }`}
                >
                  <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{product.category}</p>
          <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-sm text-muted-foreground mb-4">{t("products.sku")}: {product.sku}</p>

          <div className="flex items-baseline gap-3 mb-2">
            <p className="text-3xl font-bold text-foreground">{formatPrice(product.price)}</p>
            <p className="text-sm text-muted-foreground line-through">{formatPrice(product.wholesalePrice)}</p>
          </div>
          <p className="text-xs text-muted-foreground mb-4">{t("products.wholesale_label")}</p>

          <p className={`text-sm font-medium mb-6 flex items-center gap-1.5 ${stockClass}`}>
            <CheckCircle className="h-4 w-4" /> {stockLabel}
            {product.stock > 0 && product.stock <= 20 && (
              <span className="text-xs text-muted-foreground ml-1">({product.stock} {t("products.remaining")})</span>
            )}
          </p>

          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{product.description}</p>

          {/* Quantity + Add to cart */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center border border-border rounded-sm">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2.5 hover:bg-secondary transition-colors" aria-label="Decrease quantity">
                <Minus className="h-4 w-4" />
              </button>
              <span className="px-4 py-2.5 text-sm font-medium min-w-[48px] text-center border-x border-border">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="px-3 py-2.5 hover:bg-secondary transition-colors" aria-label="Increase quantity">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={() => addItem(product, qty)}
              disabled={product.stock === 0}
              className="flex-1 btn-accent py-3 rounded-sm font-semibold uppercase tracking-wide flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <ShoppingCart className="h-4 w-4" /> {t("products.add_to_cart")}
            </button>
          </div>

          {/* Request Quote */}
          <Link
            to="/contact"
            className="block w-full text-center border border-border rounded-sm py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors mb-6"
          >
            <FileText className="h-4 w-4 inline mr-2" />
            {t("products.request_quote")}
          </Link>

          {/* Trust badges */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Truck className="h-4 w-4 text-accent flex-shrink-0" />
              <span>{t("products.free_shipping_note")}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-4 w-4 text-accent flex-shrink-0" />
              <span>{t("products.warranty_note")}</span>
            </div>
          </div>

          {/* Specifications */}
          <div className="border border-border rounded-sm overflow-hidden">
            <h3 className="font-display font-bold text-sm uppercase px-4 py-3 bg-secondary">{t("products.specifications")}</h3>
            <div className="divide-y divide-border">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex px-4 py-2.5 text-sm">
                  <span className="w-40 text-muted-foreground flex-shrink-0">{key}</span>
                  <span className="font-medium text-foreground">
                    {Array.isArray(value) ? value.join(", ") : value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Compatibility */}
          {product.compatibility && product.compatibility.length > 0 && (
            <div className="border border-border rounded-sm overflow-hidden mt-4">
              <h3 className="font-display font-bold text-sm uppercase px-4 py-3 bg-secondary">{t("products.compatibility")}</h3>
              <div className="px-4 py-3">
                <div className="flex flex-wrap gap-2">
                  {product.compatibility.map((c) => (
                    <span key={c} className="text-xs bg-secondary text-foreground px-2.5 py-1 rounded-sm">{c}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="section-heading mb-6">{t("products.related")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((rp) => (
              <div key={rp.id} className="product-card group">
                <div className="aspect-square overflow-hidden bg-secondary">
                  <img src={rp.image} alt={rp.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                </div>
                <div className="p-3 md:p-4">
                  <Link to={`/product/${rp.slug}`} className="text-sm font-medium text-foreground hover:text-accent transition-colors line-clamp-2 uppercase">
                    {rp.name}
                  </Link>
                  <p className="text-sm font-bold text-foreground mt-1">{formatPrice(rp.price)}</p>
                  <button onClick={() => addItem(rp)} className="mt-2 w-full btn-accent text-xs py-2 rounded-sm font-medium uppercase tracking-wide">
                    {t("products.add_to_cart")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center p-4" onClick={() => setLightbox(false)}>
          <button className="absolute top-4 right-4 text-background hover:text-background/80 transition-colors" onClick={() => setLightbox(false)}>
            <X className="h-8 w-8" />
          </button>
          <img
            src={images[activeImage].url}
            alt={images[activeImage].alt}
            className="max-w-full max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          {images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={(e) => { e.stopPropagation(); setActiveImage(i); }}
                  className={`w-12 h-12 rounded-sm overflow-hidden border-2 ${i === activeImage ? "border-accent" : "border-background/30"}`}
                >
                  <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
