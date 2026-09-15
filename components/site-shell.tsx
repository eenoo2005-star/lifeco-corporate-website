"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ArrowUpRight, Mail, MapPin, Menu, Phone, X } from "lucide-react";

export type SiteLanguage = "en" | "ar";

export function useSiteLanguage() {
  const [language, setLanguage] = useState<SiteLanguage>("en");
  useEffect(() => {
    const saved = window.localStorage.getItem("lifeco-language");
    if (saved === "ar") setLanguage("ar");
  }, []);
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    window.localStorage.setItem("lifeco-language", language);
  }, [language]);
  return { language, setLanguage, isArabic: language === "ar" };
}

const navigation = {
  en: [["Company", "/company"], ["Products", "/products"], ["News", "/news"], ["Tenders", "/tenders"], ["Contact", "/contact"]],
  ar: [["الشركة", "/company"], ["المنتجات", "/products"], ["الأخبار", "/news"], ["المناقصات", "/tenders"], ["اتصل بنا", "/contact"]],
} as const;

export function SiteHeader({ language, setLanguage, currentPath = "" }: { language: SiteLanguage; setLanguage: (language: SiteLanguage) => void; currentPath?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const ar = language === "ar";
  return <header className="site-header inner-header">
    <div className="utility-bar">
      <span><MapPin size={14} />{ar ? "البريقة، ليبيا" : "Al Brega, Libya"}</span>
      <a href="tel:+218934374452"><Phone size={14} />+218 93 437 4452</a>
      <a href="mailto:eenoo2005@gmail.com"><Mail size={14} />eenoo2005@gmail.com</a>
    </div>
    <div className="nav-wrap">
      <a className="brand" href="/" aria-label="LIFECO home"><img src="/assets/lifeco-logo.png" alt="LIFECO — Libyan Fertiliser Company" /></a>
      <nav className={menuOpen ? "main-nav open" : "main-nav"} aria-label="Primary navigation">
        {navigation[language].map(([label, href]) => <a className={currentPath === href ? "active" : ""} key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}
      </nav>
      <div className="nav-actions">
        <button className="language-toggle" onClick={() => setLanguage(ar ? "en" : "ar")} aria-label="Change language">{ar ? "EN" : "العربية"}</button>
        <a className="inquiry-link" href="/contact">{ar ? "استفسار تجاري" : "Sales inquiry"}<ArrowUpRight size={16} /></a>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">{menuOpen ? <X /> : <Menu />}</button>
      </div>
    </div>
  </header>;
}

export function SiteFooter({ language }: { language: SiteLanguage }) {
  const ar = language === "ar";
  return <footer className="site-footer">
    <div className="page-width footer-main">
      <img src="/assets/lifeco-logo.png" alt="LIFECO" />
      <nav className="footer-nav">{navigation[language].map(([label, href]) => <a key={href} href={href}>{label}</a>)}</nav>
      <a className="back-top" href="#top">{ar ? "أعلى الصفحة" : "Back to top"}<ArrowUpRight size={15} /></a>
    </div>
    <div className="page-width footer-bottom"><span>© 2026 LIFECO</span><span>{ar ? "الشركة الليبية للأسمدة. جميع الحقوق محفوظة." : "Libyan Fertiliser Company. All rights reserved."}</span></div>
  </footer>;
}

export function SubpageShell({ currentPath, eyebrow, title, description, image, language, setLanguage, children }: { currentPath: string; eyebrow: string; title: string; description: string; image: string; language: SiteLanguage; setLanguage: (language: SiteLanguage) => void; children: ReactNode }) {
  return <main className="site-shell" id="top">
    <SiteHeader language={language} setLanguage={setLanguage} currentPath={currentPath} />
    <section className="sub-hero">
      <img src={image} alt="" />
      <div className="sub-hero-shade" />
      <div className="page-width sub-hero-content">
        <p className="eyebrow light"><span />{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </section>
    {children}
    <SiteFooter language={language} />
  </main>;
}
