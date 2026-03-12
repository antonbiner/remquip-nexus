import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User, Menu, X, ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useCart } from "@/contexts/CartContext";
import { categories, products } from "@/config/products";
import FlagIcon from "@/components/FlagIcon";

export default function Header() {
  const { t, lang, setLang } = useLanguage();
  const { currency, setCurrency, formatPrice } = useCurrency();
  const { itemCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [currOpen, setCurrOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<typeof products>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const currRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
      if (currRef.current && !currRef.current.contains(e.target as Node)) setCurrOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowResults(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSearch(query: string) {
    setSearchQuery(query);
    if (query.length >= 2) {
      const q = query.toLowerCase();
      setSearchResults(products.filter((p) =>
        p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      ).slice(0, 5));
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }

  const langFlag = lang === "en" ? "us" : "fr";
  const currFlag = currency === "CAD" ? "ca" : currency === "USD" ? "us" : "eu";
  const currSymbol = currency === "CAD" ? "C$" : currency === "USD" ? "$" : "€";

  return (
    <header className="sticky top-0 z-50">
      {/* Top bar */}
      <div className="nav-bar">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <Link to="/" className="font-display text-xl md:text-2xl font-bold tracking-widest text-nav-foreground flex-shrink-0">
            {t("site.name")}
          </Link>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-lg mx-6" ref={searchRef}>
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                placeholder={t("nav.search.placeholder")}
                className="w-full pl-10 pr-4 py-2 rounded-sm bg-background text-foreground text-sm border-0 focus:ring-2 focus:ring-accent outline-none"
              />
              {showResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-sm shadow-lg z-50 max-h-80 overflow-y-auto">
                  {searchResults.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => { navigate(`/product/${p.slug}`); setShowResults(false); setSearchQuery(""); }}
                      className="flex items-center gap-3 w-full px-3 py-2.5 text-left hover:bg-secondary transition-colors"
                    >
                      <img src={p.image} alt="" className="w-10 h-10 rounded-sm object-cover bg-secondary flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.sku} — {formatPrice(p.price)}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Language */}
            <div className="relative hidden md:block" ref={langRef}>
              <button
                onClick={() => { setLangOpen(!langOpen); setCurrOpen(false); }}
                className="flex items-center gap-1.5 text-sm text-nav-foreground hover:text-nav-accent transition-colors px-2 py-1"
              >
                <FlagIcon country={langFlag} className="w-5 h-3.5 rounded-[2px] overflow-hidden" />
                <span className="hidden lg:inline">{lang === "en" ? "EN" : "FR"}</span>
                <ChevronDown className="h-3 w-3" />
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-sm shadow-lg py-1 min-w-[140px] z-50">
                  <button onClick={() => { setLang("en"); setLangOpen(false); }} className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-secondary transition-colors">
                    <FlagIcon country="us" className="w-5 h-3.5 rounded-[2px] overflow-hidden" /> English
                  </button>
                  <button onClick={() => { setLang("fr"); setLangOpen(false); }} className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-secondary transition-colors">
                    <FlagIcon country="fr" className="w-5 h-3.5 rounded-[2px] overflow-hidden" /> Français
                  </button>
                </div>
              )}
            </div>

            {/* Currency */}
            <div className="relative hidden md:block" ref={currRef}>
              <button
                onClick={() => { setCurrOpen(!currOpen); setLangOpen(false); }}
                className="flex items-center gap-1.5 text-sm text-nav-foreground hover:text-nav-accent transition-colors px-2 py-1"
              >
                <FlagIcon country={currFlag} className="w-5 h-3.5 rounded-[2px] overflow-hidden" />
                <span className="hidden lg:inline">{currency} ({currSymbol})</span>
                <ChevronDown className="h-3 w-3" />
              </button>
              {currOpen && (
                <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-sm shadow-lg py-1 min-w-[160px] z-50">
                  {([["CAD", "ca", "C$"], ["USD", "us", "$"], ["EUR", "eu", "€"]] as const).map(([code, flag, sym]) => (
                    <button
                      key={code}
                      onClick={() => { setCurrency(code as "CAD" | "USD" | "EUR"); setCurrOpen(false); }}
                      className={`flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-secondary transition-colors ${currency === code ? "font-medium text-accent" : ""}`}
                    >
                      <FlagIcon country={flag} className="w-5 h-3.5 rounded-[2px] overflow-hidden" />
                      {code} ({sym})
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link to="/login" className="hidden md:flex items-center gap-1.5 text-sm text-nav-foreground hover:text-nav-accent transition-colors">
              <User className="h-4 w-4" />
              <span className="hidden lg:inline">{t("nav.signin")}</span>
            </Link>

            <Link to="/cart" className="flex items-center gap-1 text-nav-foreground hover:text-nav-accent transition-colors relative">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-accent text-accent-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
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
          <div className="px-4 py-3 space-y-3">
            {/* Mobile search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder={t("nav.search.placeholder")}
                className="w-full pl-10 pr-4 py-2 rounded-sm bg-secondary text-foreground text-sm border-0 outline-none"
              />
            </div>

            {/* Mobile categories */}
            {categories.map((cat) => (
              <Link key={cat.id} to={`/products/${cat.slug}`} onClick={() => setMobileOpen(false)}
                className="block py-2 text-sm font-medium uppercase text-foreground">{t(cat.translationKey)}</Link>
            ))}
            <Link to="/products" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium uppercase text-foreground">{t("cat.shop_all")}</Link>

            <hr className="border-border" />
            <Link to="/login" onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-foreground">{t("nav.signin")}</Link>

            {/* Mobile language */}
            <div className="flex gap-2">
              <button onClick={() => setLang("en")} className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-sm ${lang === "en" ? "bg-accent text-accent-foreground" : "bg-secondary"}`}>
                <FlagIcon country="us" className="w-4 h-3 rounded-[1px] overflow-hidden" /> EN
              </button>
              <button onClick={() => setLang("fr")} className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-sm ${lang === "fr" ? "bg-accent text-accent-foreground" : "bg-secondary"}`}>
                <FlagIcon country="fr" className="w-4 h-3 rounded-[1px] overflow-hidden" /> FR
              </button>
            </div>

            {/* Mobile currency */}
            <div className="flex gap-2">
              {([["CAD", "ca"], ["USD", "us"], ["EUR", "eu"]] as const).map(([code, flag]) => (
                <button
                  key={code}
                  onClick={() => setCurrency(code as "CAD" | "USD" | "EUR")}
                  className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-sm ${currency === code ? "bg-accent text-accent-foreground" : "bg-secondary"}`}
                >
                  <FlagIcon country={flag} className="w-4 h-3 rounded-[1px] overflow-hidden" /> {code}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
