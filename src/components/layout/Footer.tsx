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
    <footer className="bg-secondary border-t border-border">
      {/* Newsletter */}
      <div className="container mx-auto px-4 py-10 text-center">
        <h3 className="section-heading mb-3">{t("newsletter.title")}</h3>
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

      {/* Main footer */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {/* Company info */}
            <div className="col-span-2 md:col-span-1">
              <h4 className="font-display font-bold text-lg tracking-wider mb-4">REMQUIP</h4>
              <div className="space-y-2.5 text-sm text-primary-foreground/70">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Quebec City, QC, Canada</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span>1-800-555-0199</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <span>info@remquip.ca</span>
                </div>
              </div>
            </div>

            {/* Categories */}
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

            {/* Information */}
            <div>
              <h4 className="font-display font-bold uppercase text-sm tracking-wider mb-4">{t("footer.information")}</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">{t("footer.about")}</Link></li>
                <li><Link to="/shipping" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">{t("footer.shipping")}</Link></li>
                <li><Link to="/contact" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">{t("footer.contact")}</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-display font-bold uppercase text-sm tracking-wider mb-4">{t("footer.legal")}</h4>
              <ul className="space-y-2">
                <li><Link to="/terms" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">{t("footer.terms")}</Link></li>
                <li><Link to="/privacy" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">{t("footer.privacy")}</Link></li>
                <li><Link to="/refund" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">{t("footer.refund")}</Link></li>
                <li><Link to="/cookie" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">{t("footer.cookie")}</Link></li>
              </ul>
            </div>

            {/* Language & Currency */}
            <div>
              <h4 className="font-display font-bold uppercase text-sm tracking-wider mb-4">{t("language")}</h4>
              <div className="flex gap-2 mb-5">
                <button onClick={() => setLang("en")} className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-sm transition-colors ${lang === "en" ? "bg-accent text-accent-foreground" : "text-primary-foreground/70 hover:text-primary-foreground border border-primary-foreground/20"}`}>
                  <FlagIcon country="us" className="w-4 h-3 rounded-[1px] overflow-hidden" /> EN
                </button>
                <button onClick={() => setLang("fr")} className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-sm transition-colors ${lang === "fr" ? "bg-accent text-accent-foreground" : "text-primary-foreground/70 hover:text-primary-foreground border border-primary-foreground/20"}`}>
                  <FlagIcon country="fr" className="w-4 h-3 rounded-[1px] overflow-hidden" /> FR
                </button>
              </div>

              <h4 className="font-display font-bold uppercase text-sm tracking-wider mb-3">{t("currency")}</h4>
              <div className="flex flex-wrap gap-2">
                {([["CAD", "ca"], ["USD", "us"], ["EUR", "eu"]] as const).map(([code, flag]) => (
                  <button
                    key={code}
                    onClick={() => setCurrency(code as "CAD" | "USD" | "EUR")}
                    className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-sm transition-colors ${currency === code ? "bg-accent text-accent-foreground" : "text-primary-foreground/70 hover:text-primary-foreground border border-primary-foreground/20"}`}
                  >
                    <FlagIcon country={flag} className="w-4 h-3 rounded-[1px] overflow-hidden" /> {code}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-primary-foreground/10">
          <div className="container mx-auto px-4 py-4 text-center text-sm text-primary-foreground/50">
            {t("footer.copyright")}
          </div>
        </div>
      </div>
    </footer>
  );
}
