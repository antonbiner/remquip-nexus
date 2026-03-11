import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { categories } from "@/config/products";

export default function Footer() {
  const { t, lang, setLang } = useLanguage();

  return (
    <footer className="bg-secondary border-t border-border">
      {/* Newsletter */}
      <div className="container mx-auto px-4 py-12 text-center">
        <h3 className="section-heading mb-4">{t("newsletter.title")}</h3>
        <div className="flex max-w-md mx-auto gap-2">
          <input
            type="email"
            placeholder={t("newsletter.placeholder")}
            className="flex-1 px-4 py-2.5 border border-border rounded-sm bg-background text-foreground text-sm outline-none focus:ring-2 focus:ring-accent"
          />
          <button className="btn-accent px-6 py-2.5 rounded-sm text-sm font-semibold uppercase tracking-wide">
            {t("newsletter.cta")}
          </button>
        </div>
      </div>

      {/* Links */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-display font-bold uppercase text-sm tracking-wider mb-4">{t("footer.categories")}</h4>
              <ul className="space-y-2">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link to={`/products/${cat.slug}`} className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                      {t(cat.translationKey)}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link to="/products" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                    {t("cat.shop_all")}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-bold uppercase text-sm tracking-wider mb-4">{t("footer.information")}</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">{t("footer.about")}</Link></li>
                <li><Link to="/privacy" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">{t("footer.privacy")}</Link></li>
                <li><Link to="/shipping" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">{t("footer.shipping")}</Link></li>
                <li><Link to="/contact" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">{t("footer.contact")}</Link></li>
                <li><Link to="/sitemap" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">{t("footer.sitemap")}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-bold uppercase text-sm tracking-wider mb-4">{t("footer.legal")}</h4>
              <ul className="space-y-2">
                <li><Link to="/terms" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">{t("footer.terms")}</Link></li>
                <li><Link to="/refund" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">{t("footer.refund")}</Link></li>
                <li><Link to="/cookie" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">{t("footer.cookie")}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-bold uppercase text-sm tracking-wider mb-4">{t("language")}</h4>
              <div className="flex gap-2 mb-4">
                <button onClick={() => setLang("en")} className={`text-sm px-3 py-1 rounded-sm ${lang === "en" ? "bg-accent text-accent-foreground" : "text-primary-foreground/70 hover:text-primary-foreground"}`}>English</button>
                <button onClick={() => setLang("fr")} className={`text-sm px-3 py-1 rounded-sm ${lang === "fr" ? "bg-accent text-accent-foreground" : "text-primary-foreground/70 hover:text-primary-foreground"}`}>Français</button>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-primary-foreground/10">
          <div className="container mx-auto px-4 py-4 text-center text-sm text-primary-foreground/50">
            {t("footer.copyright")}
          </div>
        </div>
      </div>
    </footer>
  );
}
