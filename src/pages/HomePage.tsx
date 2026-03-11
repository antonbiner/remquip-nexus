import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Truck, Wrench, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useCart } from "@/contexts/CartContext";
import { categories, products } from "@/config/products";
import heroImage from "@/assets/images/hero-truck.jpg";
import warehouseImage from "@/assets/images/warehouse-banner.jpg";
import aboutImage from "@/assets/images/about-fleet.jpg";

const featureIcons = [Shield, Truck, Wrench, CheckCircle];
const featureKeys = ["features.experience", "features.fleet", "features.canadian", "features.quality"];

export default function HomePage() {
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();
  const { addItem } = useCart();
  const newProducts = products.slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden">
        <img src={heroImage} alt="Heavy-duty truck on Canadian highway" className="absolute inset-0 w-full h-full object-cover" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/60 to-transparent" />
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-xl">
            <h1 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground leading-tight mb-4 uppercase">
              {t("hero.title")}
            </h1>
            <p className="text-primary-foreground/80 text-lg mb-6">{t("hero.subtitle")}</p>
            <Link to="/login" className="inline-block bg-accent text-accent-foreground px-8 py-3 rounded-sm font-semibold uppercase tracking-wide hover:opacity-90 transition-opacity">
              {t("hero.cta")}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features bar */}
      <section className="bg-secondary border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featureKeys.map((key, i) => {
              const Icon = featureIcons[i];
              return (
                <div key={key} className="flex flex-col items-center text-center gap-2">
                  <Icon className="h-8 w-8 text-accent" strokeWidth={1.5} />
                  <span className="text-sm font-medium text-foreground">{t(key)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-0">
          <div className="relative rounded-md overflow-hidden my-12">
            <img src={aboutImage} alt="REMQUIP distribution center" className="w-full h-[350px] md:h-[400px] object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="px-8 md:px-12 max-w-lg">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground mb-3">{t("about.title")}</h2>
                <p className="text-primary-foreground/80 text-sm md:text-base mb-4">{t("about.description")}</p>
                <Link to="/about" className="inline-block border border-primary-foreground text-primary-foreground px-6 py-2.5 rounded-sm text-sm font-medium hover:bg-primary-foreground/10 transition-colors">
                  {t("about.cta")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Products */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="section-heading text-center mb-8">{t("products.new")}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {newProducts.map((product) => (
            <div key={product.id} className="product-card group">
              <div className="aspect-square overflow-hidden bg-secondary">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
              </div>
              <div className="p-3 md:p-4">
                <Link to={`/product/${product.slug}`} className="text-sm font-medium text-foreground hover:text-accent transition-colors line-clamp-2">
                  {product.name}
                </Link>
                <p className="text-sm font-bold text-foreground mt-1">{formatPrice(product.price)}</p>
                <button onClick={() => addItem(product)} className="mt-2 w-full btn-accent text-xs py-2 rounded-sm font-medium uppercase tracking-wide">
                  {t("products.add_to_cart")}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stock banner */}
      <section className="relative h-[200px] overflow-hidden">
        <img src={warehouseImage} alt="REMQUIP warehouse" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-primary/70" />
        <div className="relative h-full flex flex-col items-center justify-center text-center">
          <h3 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground mb-1">{t("banner.stock.title")}</h3>
          <p className="text-primary-foreground/80 mb-3">{t("banner.stock.subtitle")}</p>
          <Link to="/products" className="btn-accent px-8 py-2.5 rounded-sm text-sm font-semibold uppercase tracking-wide">
            {t("banner.stock.cta")}
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link key={cat.id} to={`/products/${cat.slug}`} className="product-card group text-center">
              <div className="aspect-square overflow-hidden bg-secondary">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
              </div>
              <div className="p-3">
                <span className="text-sm font-semibold uppercase tracking-wide text-foreground">{t(cat.translationKey)}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Wholesale CTA */}
      <section className="relative overflow-hidden my-8">
        <div className="container mx-auto px-4">
          <div className="relative rounded-md overflow-hidden">
            <img src={aboutImage} alt="REMQUIP fleet" className="w-full h-[350px] object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/85 to-primary/40" />
            <div className="absolute inset-0 flex items-center">
              <div className="px-8 md:px-12 max-w-lg">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground mb-3">{t("wholesale.title")}</h2>
                <p className="text-primary-foreground/80 text-sm mb-2">{t("wholesale.description")}</p>
                <p className="text-primary-foreground/70 text-sm mb-4">{t("wholesale.details")}</p>
                <Link to="/register" className="inline-block border border-primary-foreground text-primary-foreground px-6 py-2.5 rounded-sm text-sm font-medium hover:bg-primary-foreground/10 transition-colors">
                  {t("wholesale.cta")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
