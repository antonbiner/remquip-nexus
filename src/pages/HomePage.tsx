import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Truck, Wrench, CheckCircle, ArrowRight, Package, Phone, Users, BarChart3 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useCart } from "@/contexts/CartContext";
import { categories, products } from "@/config/products";
import heroImage from "@/assets/images/hero-truck.jpg";
import warehouseImage from "@/assets/images/warehouse-banner.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

export default function HomePage() {
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();
  const { addItem } = useCart();
  const featuredProducts = products.slice(0, 4);

  return (
    <>
      {/* ═══ HERO ═══ */}
      <section className="relative min-h-[500px] sm:min-h-[600px] md:min-h-[700px] flex items-center overflow-hidden">
        <img
          src={heroImage}
          alt="Heavy-duty truck fleet"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/96 via-primary/85 to-primary/40" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-[0.15em]">
                <span className="w-2 h-2 rounded-full bg-accent" />
                {t("site.tagline")}
              </div>

              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-[1.05] tracking-tight">
                {t("hero.title")}
              </h1>

              <p className="text-primary-foreground/75 text-lg sm:text-xl leading-relaxed max-w-2xl font-light">
                {t("hero.subtitle")}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-4 rounded-lg font-semibold text-sm uppercase tracking-wide transition-all hover:shadow-lg active:scale-95"
                >
                  {t("banner.stock.cta")}
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 border border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/15 px-8 py-4 rounded-lg font-semibold text-sm uppercase tracking-wide transition-all"
                >
                  {t("wholesale.cta")}
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Hero stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 md:mt-24 grid grid-cols-3 gap-6 sm:gap-8 max-w-2xl"
          >
            {[
              { value: "500+", label: "SKUs in Stock" },
              { value: "48h", label: "Avg. Delivery" },
              { value: "15+", label: "Years Experience" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 + i * 0.1 }}
                className="border-l border-primary-foreground/30 pl-4"
              >
                <p className="text-3xl sm:text-4xl font-bold text-accent font-display">{stat.value}</p>
                <p className="text-primary-foreground/60 text-xs sm:text-sm mt-1 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ VALUE PROPS ═══ */}
      <section className="border-b border-border bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-border">
            {[
              { icon: Shield, text: t("features.quality") },
              { icon: Truck, text: t("features.canadian") },
              { icon: Wrench, text: t("features.experience") },
              { icon: CheckCircle, text: t("features.fleet") },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 px-4 sm:px-6 py-5">
                <Icon className="h-5 w-5 text-accent flex-shrink-0" strokeWidth={1.8} />
                <span className="text-xs sm:text-sm font-medium text-foreground leading-snug">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CATEGORIES ═══ */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div variants={fadeUp} className="flex items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-2 text-accent mb-3">
                <div className="h-1 w-8 bg-accent rounded-full" />
                <p className="text-xs font-semibold uppercase tracking-[0.15em]">{t("footer.categories")}</p>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-foreground leading-tight">Shop by Category</h2>
            </div>
            <Link to="/products" className="hidden sm:flex items-center gap-2 text-sm text-accent font-semibold hover:gap-3 transition-all">
              {t("cat.shop_all")} <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {categories.map((cat) => (
              <motion.div key={cat.id} variants={fadeUp}>
                <Link
                  to={`/products/${cat.slug}`}
                  className="group block relative rounded-xl overflow-hidden aspect-[4/3] border border-border hover:border-accent/50 transition-all duration-300"
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                    <span className="text-base sm:text-lg font-bold uppercase tracking-wide text-primary-foreground block">
                      {t(cat.translationKey)}
                    </span>
                    <span className="text-primary-foreground/60 text-xs sm:text-sm mt-2 font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                      {t("cat.shop_all")} <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <Link to="/products" className="sm:hidden flex items-center justify-center gap-2 text-sm text-accent font-semibold mt-6 hover:gap-3 transition-all">
            {t("cat.shop_all")} <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </section>

      {/* ═══ FEATURED PRODUCTS ═══ */}
      <section className="bg-gradient-to-b from-secondary/30 to-background border-b border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div variants={fadeUp} className="flex items-end justify-between mb-12">
              <div>
                <div className="inline-flex items-center gap-2 text-accent mb-3">
                  <div className="h-1 w-8 bg-accent rounded-full" />
                  <p className="text-xs font-semibold uppercase tracking-[0.15em]">{t("products.featured")}</p>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-foreground leading-tight">{t("products.new")}</h2>
              </div>
              <Link to="/products" className="hidden sm:flex items-center gap-2 text-sm text-accent font-semibold hover:gap-3 transition-all">
                {t("products.view_all")} <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.map((product) => (
                <motion.div key={product.id} variants={fadeUp}>
                  <Link to={`/product/${product.slug}`} className="bg-card border border-border rounded-xl overflow-hidden group h-full flex flex-col hover:border-accent/30 hover:shadow-lg transition-all duration-300 cursor-pointer block">
                    <div className="relative aspect-square overflow-hidden bg-secondary">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-[1.08] transition-transform duration-500"
                        loading="lazy"
                      />
                      {product.stock > 0 && (
                        <div className="absolute top-3 right-3 bg-success/90 backdrop-blur-sm text-success-foreground text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {t("products.in_stock")}
                        </div>
                      )}
                    </div>
                    <div className="p-4 sm:p-5 flex flex-col flex-1">
                      <p className="text-[10px] text-muted-foreground font-mono tracking-widest uppercase opacity-70">{product.sku}</p>
                      <span className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2 mt-2.5 mb-auto leading-snug">
                        {product.name}
                      </span>
                      <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-lg font-bold text-foreground mb-3">{formatPrice(product.price)}</p>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            addItem(product);
                          }}
                          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-2.5 rounded-lg font-semibold text-xs uppercase tracking-wide transition-all active:scale-95"
                        >
                          {t("products.add_to_cart")}
                        </button>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <Link to="/products" className="sm:hidden flex items-center justify-center gap-2 text-sm text-accent font-semibold mt-8 hover:gap-3 transition-all">
              {t("products.view_all")} <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══ WHY REMQUIP ═══ */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div variants={fadeUp} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-accent mb-4">
              <div className="h-1 w-8 bg-accent rounded-full" />
              <p className="text-xs font-semibold uppercase tracking-[0.15em]">Why REMQUIP</p>
              <div className="h-1 w-8 bg-accent rounded-full" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-foreground leading-tight mb-4">{t("about.title")}</h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-3xl mx-auto leading-relaxed font-light">
              {t("about.description")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
            {[
              { icon: Package, title: t("banner.stock.title"), desc: t("products.free_shipping_note") },
              { icon: Users, title: t("features.fleet"), desc: t("wholesale.description") },
              { icon: BarChart3, title: t("features.experience"), desc: t("wholesale.details") },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={i} variants={fadeUp}>
                <div className="border border-border rounded-xl p-7 sm:p-8 h-full bg-gradient-to-br from-card to-card/50 hover:border-accent/40 hover:shadow-md transition-all duration-300">
                  <div className="w-12 h-12 rounded-lg bg-accent/15 flex items-center justify-center mb-5">
                    <Icon className="h-6 w-6 text-accent" strokeWidth={1.8} />
                  </div>
                  <h3 className="font-display text-base sm:text-lg font-bold text-foreground mb-3 leading-snug">{title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ═══ WHOLESALE CTA ═══ */}
      <section className="relative overflow-hidden">
        <img
          src={warehouseImage}
          alt="REMQUIP warehouse"
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/88 to-primary/75" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center sm:text-left sm:mx-0"
          >
            <div className="inline-flex items-center gap-2 text-accent mb-4 sm:mb-5">
              <div className="h-1 w-8 bg-accent rounded-full" />
              <p className="text-xs font-semibold uppercase tracking-[0.15em]">For Businesses</p>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-primary-foreground mb-5 leading-tight">
              {t("wholesale.title")}
            </h2>
            <p className="text-primary-foreground/70 text-base sm:text-lg leading-relaxed mb-8 max-w-xl font-light">
              {t("wholesale.description")} {t("wholesale.details")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-4 rounded-lg font-semibold text-sm uppercase tracking-wide transition-all hover:shadow-lg active:scale-95"
              >
                {t("wholesale.cta")} <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 border border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/15 px-8 py-4 rounded-lg font-semibold text-sm uppercase tracking-wide transition-all"
              >
                <Phone className="h-5 w-5" /> {t("footer.contact")}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
