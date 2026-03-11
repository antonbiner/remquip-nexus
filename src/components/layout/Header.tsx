import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, ShoppingCart, User, Menu, X, Globe, ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useCart } from "@/contexts/CartContext";
import { categories } from "@/config/products";

export default function Header() {
  const { t, lang, setLang } = useLanguage();
  const { currency, setCurrency } = useCurrency();
  const { itemCount } = useCart();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      {/* Top bar */}
      <div className="nav-bar">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <Link to="/" className="font-display text-xl md:text-2xl font-bold tracking-widest text-nav-foreground">
            {t("site.name")}
          </Link>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={t("nav.search.placeholder")}
                className="w-full pl-10 pr-4 py-2 rounded-sm bg-background text-foreground text-sm border-0 focus:ring-2 focus:ring-accent outline-none"
              />
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            {/* Language */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 text-sm text-nav-foreground hover:text-nav-accent transition-colors"
              >
                <Globe className="h-4 w-4" />
                {lang === "en" ? "English" : "Français"}
                <ChevronDown className="h-3 w-3" />
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-sm shadow-lg py-1 min-w-[120px] z-50">
                  <button onClick={() => { setLang("en"); setLangOpen(false); }} className="block w-full text-left px-3 py-1.5 text-sm hover:bg-secondary">English</button>
                  <button onClick={() => { setLang("fr"); setLangOpen(false); }} className="block w-full text-left px-3 py-1.5 text-sm hover:bg-secondary">Français</button>
                </div>
              )}
            </div>

            {/* Currency */}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as "CAD" | "USD" | "EUR")}
              className="hidden md:block bg-transparent text-nav-foreground text-sm border border-nav-foreground/20 rounded-sm px-2 py-1 outline-none"
            >
              <option value="CAD">CAD</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>

            <Link to="/login" className="hidden md:flex items-center gap-1 text-sm text-nav-foreground hover:text-nav-accent transition-colors">
              <User className="h-4 w-4" />
              <span>{t("nav.signin")}</span>
              <span className="text-nav-foreground/50">{t("nav.or")}</span>
              <span className="text-nav-accent font-medium">{t("nav.register")}</span>
            </Link>

            <Link to="/cart" className="flex items-center gap-1 text-nav-foreground hover:text-nav-accent transition-colors relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="text-sm">({itemCount})</span>
            </Link>

            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-nav-foreground">
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Category bar */}
      <nav className="category-bar hidden md:block">
        <div className="container mx-auto px-4 flex items-center justify-center gap-0">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products/${cat.slug}`}
              className={`px-6 py-3 text-sm font-medium uppercase tracking-wide transition-colors ${
                location.pathname === `/products/${cat.slug}`
                  ? "bg-category-bar-active text-foreground"
                  : "text-category-bar-foreground hover:bg-category-bar-active/20"
              }`}
            >
              {t(cat.translationKey)}
            </Link>
          ))}
          <Link
            to="/products"
            className="px-6 py-3 text-sm font-medium uppercase tracking-wide text-category-bar-foreground hover:bg-category-bar-active/20 transition-colors"
          >
            {t("cat.shop_all")}
          </Link>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-card border-b border-border">
          <div className="px-4 py-3">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input type="text" placeholder={t("nav.search.placeholder")} className="w-full pl-10 pr-4 py-2 rounded-sm bg-secondary text-foreground text-sm border-0 outline-none" />
            </div>
            {categories.map((cat) => (
              <Link key={cat.id} to={`/products/${cat.slug}`} onClick={() => setMobileOpen(false)}
                className="block py-2 text-sm font-medium uppercase text-foreground">{t(cat.translationKey)}</Link>
            ))}
            <Link to="/products" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium uppercase text-foreground">{t("cat.shop_all")}</Link>
            <hr className="my-2 border-border" />
            <Link to="/login" onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-foreground">{t("nav.signin")}</Link>
            <div className="flex gap-3 mt-2">
              <button onClick={() => setLang("en")} className={`text-sm ${lang === "en" ? "font-bold" : ""}`}>English</button>
              <button onClick={() => setLang("fr")} className={`text-sm ${lang === "fr" ? "font-bold" : ""}`}>Français</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
