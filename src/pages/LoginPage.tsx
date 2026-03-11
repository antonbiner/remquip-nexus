import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export default function LoginPage() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <h1 className="font-display text-3xl font-bold text-center mb-8">{t("auth.login")}</h1>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">{t("auth.email")}</label>
          <input type="email" className="w-full border border-border rounded-sm px-3 py-2.5 text-sm bg-background outline-none focus:ring-2 focus:ring-accent" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t("auth.password")}</label>
          <input type="password" className="w-full border border-border rounded-sm px-3 py-2.5 text-sm bg-background outline-none focus:ring-2 focus:ring-accent" />
        </div>
        <button type="submit" className="w-full btn-accent py-3 rounded-sm font-semibold uppercase tracking-wide">{t("auth.login")}</button>
        <div className="text-center text-sm">
          <Link to="/forgot-password" className="text-accent hover:underline">{t("auth.forgot")}</Link>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          {t("auth.no_account")} <Link to="/register" className="text-accent font-medium hover:underline">{t("auth.register")}</Link>
        </p>
      </form>
    </div>
  );
}
