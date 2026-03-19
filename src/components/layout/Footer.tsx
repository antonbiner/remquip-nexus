import React from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { categories } from "@/config/products";
import FlagIcon from "@/components/FlagIcon";

export default function Footer() {
  const { t, lang, setLang } = useLanguage();
  const { currency, setCurrency } = useCurrency();

  return (
    <footer className="bg-gradient-to-b from-background to-secondary/30 border-t border-border/50">
      {/* Newsletter CTA */}
      <div className="bg-primary text-primary-foreground py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold font-display mb-3">{t("newsletter.title")}</h3>
            <p className="text-primary-foreground/70 text-sm md:text-base mb-6 font-light">Stay updated with our latest products and offers</p>
            <div className="flex flex-col sm:flex-row max-w-sm mx-auto gap-3">
              <input
                type="email"
                placeholder={t("newsletter.placeholder")}
                className="flex-1 px-5 py-3 border border-primary-foreground/20 rounded-lg bg-primary-foreground/10 text-primary-foreground text-sm outline-none focus:ring-2 focus:ring-accent placeholder:text-primary-foreground/50 transition-colors"
              />
              <button className="bg-accent hover:bg-accent/90 text-accent-foreground px-7 py-3 rounded-lg text-sm font-semibold uppercase tracking-wide whitespace-nowrap transition-all active:scale-95">
                {t("newsletter.cta")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-10 mb-10">
            {/* Company info */}
            <div className="lg:col-span-1">
              <h4 className="font-display font-bold text-lg md:text-xl tracking-tight text-foreground mb-4">REMQUIP</h4>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0 text-accent" />
                  <span className="font-light">Quebec City, QC, Canada</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 flex-shrink-0 text-accent" />
                  <span className="font-light">1-800-555-0199</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 flex-shrink-0 text-accent" />
                  <span className="font-light">info@remquip.ca</span>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div>
              <h4 className="font-display font-semibold text-sm text-foreground uppercase tracking-wide mb-4">{t("footer.categories")}</h4>
              <ul className="space-y-2">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link to={`/products/${cat.slug}`} className="text-sm text-muted-foreground hover:text-accent transition-colors font-light">
                      {t(cat.translationKey)}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link to="/products" className="text-sm text-muted-foreground hover:text-accent transition-colors font-light">
                    {t("cat.shop_all")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Information */}
            <div>
              <h4 className="font-display font-semibold text-sm text-foreground uppercase tracking-wide mb-4">{t("footer.information")}</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-sm text-muted-foreground hover:text-accent transition-colors font-light">{t("footer.about")}</Link></li>
                <li><Link to="/shipping" className="text-sm text-muted-foreground hover:text-accent transition-colors font-light">{t("footer.shipping")}</Link></li>
                <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-accent transition-colors font-light">{t("footer.contact")}</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-display font-semibold text-sm text-foreground uppercase tracking-wide mb-4">{t("footer.legal")}</h4>
              <ul className="space-y-2">
                <li><Link to="/terms" className="text-sm text-muted-foreground hover:text-accent transition-colors font-light">{t("footer.terms")}</Link></li>
                <li><Link to="/privacy" className="text-sm text-muted-foreground hover:text-accent transition-colors font-light">{t("footer.privacy")}</Link></li>
                <li><Link to="/refund" className="text-sm text-muted-foreground hover:text-accent transition-colors font-light">{t("footer.refund")}</Link></li>
                <li><Link to="/cookie" className="text-sm text-muted-foreground hover:text-accent transition-colors font-light">{t("footer.cookie")}</Link></li>
              </ul>
            </div>

            {/* Language & Currency */}
            <div>
              <h4 className="font-display font-semibold text-sm text-foreground uppercase tracking-wide mb-4">{t("language")}</h4>
              <div className="flex flex-wrap gap-2 mb-6">
                {([["en", "us", "EN"], ["fr", "fr", "FR"]] as const).map(([code, flag, label]) => (
                  <button
                    key={code}
                    onClick={() => setLang(code)}
                    className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all font-medium ${
                      lang === code
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:text-foreground border border-border hover:border-accent/50"
                    }`}
                  >
                    <FlagIcon country={flag} className="w-4 h-3 rounded-[2px] overflow-hidden" /> {label}
                  </button>
                ))}
              </div>

              <h4 className="font-display font-semibold text-sm text-foreground uppercase tracking-wide mb-4">{t("currency")}</h4>
              <div className="flex flex-wrap gap-2">
                {([["CAD", "ca"], ["USD", "us"], ["EUR", "eu"]] as const).map(([code, flag]) => (
                  <button
                    key={code}
                    onClick={() => setCurrency(code as "CAD" | "USD" | "EUR")}
                    className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all font-medium ${
                      currency === code
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:text-foreground border border-border hover:border-accent/50"
                    }`}
                  >
                    <FlagIcon country={flag} className="w-4 h-3 rounded-[2px] overflow-hidden" /> {code}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border/30" />
        </div>

          {/* Bottom bar */}
          <div className="pt-8 mt-8">
            <div className="text-center text-xs text-muted-foreground/60 font-light">
              {t("footer.copyright")}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
