import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Truck, Wrench, CheckCircle, ArrowRight, Package, Clock, Headphones } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useCart } from "@/contexts/CartContext";
import { categories, products } from "@/config/products";
import heroImage from "@/assets/images/hero-truck.jpg";
import warehouseImage from "@/assets/images/warehouse-banner.jpg";
import aboutImage from "@/assets/images/about-fleet.jpg";

const featureIcons = [Shield, Truck, Wrench, CheckCircle];
const featureKeys = ["features.experience", "features.fleet", "features.canadian", "features.quality"];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function HomePage() {
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();
  const { addItem } = useCart();
  const newProducts = products.slice(0, 4);

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative h-[420px] sm:h-[500px] md:h-[580px] overflow-hidden">
        <img
          src={heroImage}
          alt="Heavy-duty truck on Canadian highway"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/70 to-primary/20" />
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="max-w-xl"
          >
            <span className="inline-block text-accent text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3">
              {t("site.tagline")}
            </span>
            <h1 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold text-primary-foreground leading-[1.15] mb-4 uppercase">
              {t("hero.title")}
            </h1>
            <p className="text-primary-foreground/75 text-sm sm:text-base md:text-lg mb-6 leading-relaxed max-w-md">
              {t("hero.subtitle")}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 sm:px-8 py-3 rounded-sm font-semibold text-sm uppercase tracking-wide hover:opacity-90 transition-opacity"
              >
                {t("banner.stock.cta")}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 border border-primary-foreground/40 text-primary-foreground px-6 sm:px-8 py-3 rounded-sm font-medium text-sm uppercase tracking-wide hover:bg-primary-foreground/10 transition-colors"
              >
                {t("hero.cta")}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Trust bar ── */}
      <section className="bg-secondary border-b border-border">
        <div className="container mx-auto px-4 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featureKeys.map((key, i) => {
              const Icon = featureIcons[i];
              return (
                <div key={key} className="flex items-center gap-3 justify-center md:justify-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-md bg-accent/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-accent" strokeWidth={2} />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-foreground leading-tight">{t(key)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="container mx-auto px-4 py-10 md:py-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-heading">{t("footer.categories")}</h2>
          <Link to="/products" className="text-sm text-accent font-medium hover:underline flex items-center gap-1">
            {t("cat.shop_all")} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5"
        >
          {categories.map((cat) => (
            <motion.div key={cat.id} variants={fadeUp}>
              <Link to={`/products/${cat.slug}`} className="group block relative rounded-md overflow-hidden aspect-[4/3]">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                  <span className="text-sm sm:text-base font-bold uppercase tracking-wide text-primary-foreground">
                    {t(cat.translationKey)}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── New Products ── */}
      <section className="bg-secondary/50">
        <div className="container mx-auto px-4 py-10 md:py-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-heading">{t("products.new")}</h2>
            <Link to="/products" className="text-sm text-accent font-medium hover:underline flex items-center gap-1">
              {t("products.view_all")} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5"
          >
            {newProducts.map((product) => (
              <motion.div key={product.id} variants={fadeUp} className="product-card group flex flex-col">
                <Link to={`/product/${product.slug}`} className="block aspect-square overflow-hidden bg-secondary">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </Link>
                <div className="p-3 md:p-4 flex flex-col flex-1">
                  <p className="text-xs text-muted-foreground mb-1">{product.sku}</p>
                  <Link
                    to={`/product/${product.slug}`}
                    className="text-sm font-medium text-foreground hover:text-accent transition-colors line-clamp-2 mb-auto"
                  >
                    {product.name}
                  </Link>
                  <div className="mt-2">
                    <p className="text-base font-bold text-foreground">{formatPrice(product.price)}</p>
                    {product.stock > 0 && (
                      <p className="text-xs text-success mt-0.5 flex items-center gap-1">
                        <Package className="h-3 w-3" />
                        {t("products.in_stock")}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => addItem(product)}
                    className="mt-3 w-full btn-accent text-xs py-2.5 rounded-sm font-semibold uppercase tracking-wide"
                  >
                    {t("products.add_to_cart")}
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── About banner ── */}
      <section className="container mx-auto px-4 py-10 md:py-14">
        <div className="relative rounded-md overflow-hidden">
          <img src={aboutImage} alt="REMQUIP distribution center" className="w-full h-[280px] sm:h-[340px] md:h-[380px] object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/60 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="px-6 sm:px-8 md:px-12 max-w-lg">
              <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-primary-foreground mb-3">
                {t("about.title")}
              </h2>
              <p className="text-primary-foreground/75 text-xs sm:text-sm md:text-base mb-4 leading-relaxed">
                {t("about.description")}
              </p>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 border border-primary-foreground/40 text-primary-foreground px-5 py-2.5 rounded-sm text-sm font-medium hover:bg-primary-foreground/10 transition-colors"
              >
                {t("about.cta")} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stock / CTA banner ── */}
      <section className="relative h-[180px] sm:h-[200px] overflow-hidden">
        <img src={warehouseImage} alt="REMQUIP warehouse" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-primary/75" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-primary-foreground mb-1">
            {t("banner.stock.title")}
          </h3>
          <p className="text-primary-foreground/70 text-sm mb-4">{t("banner.stock.subtitle")}</p>
          <Link
            to="/products"
            className="btn-accent px-8 py-2.5 rounded-sm text-sm font-semibold uppercase tracking-wide inline-flex items-center gap-2"
          >
            {t("banner.stock.cta")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ── Service highlights ── */}
      <section className="container mx-auto px-4 py-10 md:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          {[
            { icon: Truck, titleKey: "features.canadian", descKey: "products.free_shipping_note" },
            { icon: Clock, titleKey: "banner.stock.subtitle", descKey: "banner.stock.title" },
            { icon: Headphones, titleKey: "contact.title", descKey: "contact.hours_value" },
          ].map(({ icon: Icon, titleKey, descKey }) => (
            <div key={titleKey} className="flex items-start gap-4 p-5 bg-card border border-border rounded-md">
              <div className="flex-shrink-0 w-11 h-11 rounded-md bg-accent/10 flex items-center justify-center">
                <Icon className="h-5 w-5 text-accent" strokeWidth={2} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground mb-0.5">{t(titleKey)}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{t(descKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Wholesale CTA ── */}
      <section className="container mx-auto px-4 pb-10 md:pb-14">
        <div className="relative rounded-md overflow-hidden">
          <img src={aboutImage} alt="REMQUIP fleet" className="w-full h-[280px] sm:h-[320px] object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/40" />
          <div className="absolute inset-0 flex items-center">
            <div className="px-6 sm:px-8 md:px-12 max-w-lg">
              <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-primary-foreground mb-3">
                {t("wholesale.title")}
              </h2>
              <p className="text-primary-foreground/75 text-xs sm:text-sm mb-2">{t("wholesale.description")}</p>
              <p className="text-primary-foreground/60 text-xs sm:text-sm mb-5">{t("wholesale.details")}</p>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 py-2.5 rounded-sm text-sm font-semibold uppercase tracking-wide hover:opacity-90 transition-opacity"
              >
                {t("wholesale.cta")} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
