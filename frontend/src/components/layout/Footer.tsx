"use client";

import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { SiteSetting } from "@/lib/api";

// Kezar Teks location: Andijon viloyati, Oltinkul tumani, Sadda KFY, Gulbahor ko'cha 35
const COMPANY_LAT = 40.8347;
const COMPANY_LON = 71.7333;

export default function Footer({ settings = {} }: { settings?: SiteSetting }) {
  const { t, locale } = useLanguage();
  const email = settings.contact_email || "kezar@list.ru";
  const website = settings.contact_website || "www.kezar.uz";
  const phone = settings.contact_phone || "+998 71 123 45 67";
  const address = settings[`contact_address_${locale}`] || settings.contact_address_uz || "";
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <footer className="relative bg-[#1a1e22] text-gray-300 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {/* Column 1 — Logo & Tagline */}
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <img
                  src="/images/logo-transparent.png"
                  alt="Kezar Teks"
                  className="w-14 h-14 object-contain"
                />
                <div>
                  <h3 className="text-white font-bold text-lg leading-tight">
                    Kezar Teks
                  </h3>
                  <p className="text-gray-500 text-xs tracking-wider uppercase">
                    MChJ
                  </p>
                </div>
              </div>

              <p className="text-gray-400 text-sm italic tracking-wide">
                {t.footer.tagline}
              </p>

              {/* Social links placeholder */}
              <div className="flex items-center gap-3 pt-2">
                <a
                  href={settings.social_facebook || "#"}
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/40 flex items-center justify-center transition-all duration-300"
                  aria-label="Facebook"
                >
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href={settings.social_instagram || "#"}
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/40 flex items-center justify-center transition-all duration-300"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
                <a
                  href={settings.social_telegram || "#"}
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/40 flex items-center justify-center transition-all duration-300"
                  aria-label="Telegram"
                >
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0h-.056zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Column 2 — Contact */}
            <div className="space-y-5">
              <h4 className="text-white font-bold text-sm tracking-wider uppercase">
                {t.footer.startConversation}
              </h4>

              <div className="space-y-4">
                <div>
                  <p className="text-gray-500 text-xs font-semibold tracking-wider uppercase mb-1">
                    {t.footer.headOffice}
                  </p>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    {address || <>Andijon viloyati, Oltinkul tumani,<br />Sadda KFY, Gulbahor ko&apos;chasi 35</>}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 text-xs font-semibold tracking-wider uppercase mb-1">
                    Email
                  </p>
                  <a
                    href={`mailto:${email}`}
                    className="text-gray-300 hover:text-primary text-sm transition-colors duration-200"
                  >
                    {email}
                  </a>
                </div>

                <div>
                  <p className="text-gray-500 text-xs font-semibold tracking-wider uppercase mb-1">
                    Web
                  </p>
                  <a
                    href={`https://${website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-gray-300 hover:text-primary text-sm transition-colors duration-200"
                  >
                    {website}
                  </a>
                </div>
              </div>
            </div>

            {/* Column 3 — Useful Links & Search */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-white font-bold text-sm tracking-wider uppercase">
                  {t.footer.usefulLinks}
                </h4>
                <ul className="space-y-2.5">
                  {[
                    { label: t.footer.aboutUs, href: "/about" },
                    { label: t.footer.products, href: "#products" },
                    { label: t.footer.contactUs, href: "/contact" },
                    { label: t.footer.news, href: "#news" },
                  ].map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="text-gray-400 hover:text-primary text-sm transition-colors duration-200 inline-flex items-center gap-1.5 group"
                      >
                        <svg
                          className="w-3 h-3 text-gray-600 group-hover:text-primary transition-transform duration-200 group-hover:translate-x-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>


            </div>

            {/* Column 4 — Location Map */}
            <div className="space-y-5">
              <h4 className="text-white font-bold text-sm tracking-wider uppercase">
                {t.footer.ourOffices}
              </h4>

              {/* Google Maps embed — free, no API key required */}
              <div className="relative w-full aspect-square sm:aspect-video lg:aspect-square rounded-xl overflow-hidden border border-white/10">
                <iframe
                  className="absolute inset-0 w-full h-full border-0"
                  src={`https://maps.google.com/maps?q=${COMPANY_LAT},${COMPANY_LON}&z=15&output=embed`}
                  title="Kezar Teks Location"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  style={{ filter: "saturate(0.8) brightness(0.85)" }}
                />
              </div>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${COMPANY_LAT},${COMPANY_LON}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-gray-400 hover:text-primary text-xs transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {t.footer.viewOnMap}
              </a>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-xs text-center md:text-left">
              {t.footer.copyright}
            </p>
            <div className="flex items-center gap-2 text-gray-600 text-xs">
              <span>Kezar Teks MChJ</span>
              <span>•</span>
              <span>Andijon, Uzbekistan</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to top button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-primary/90 hover:bg-primary text-white shadow-lg shadow-primary/25 flex items-center justify-center transition-all duration-300 ${showScrollTop
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-4 scale-90 pointer-events-none"
          }`}
        aria-label="Scroll to top"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 15l7-7 7 7"
          />
        </svg>
      </button>
    </>
  );
}
