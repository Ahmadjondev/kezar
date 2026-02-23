"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import {
    LOCALE_FLAGS,
    LOCALE_LABELS,
    type Locale,
} from "@/i18n/translations";

const NAV_KEYS = [
    { key: "home" as const, href: "/" },
    { key: "about" as const, href: "/about" },
    { key: "products" as const, href: "/products" },
    { key: "factories" as const, href: "/factories" },
    { key: "gallery" as const, href: "/gallery" },
    { key: "news" as const, href: "/news" },
    { key: "contact" as const, href: "/contact" },
] as const;

const LOCALES: Locale[] = ["uz", "ru", "en"];

export default function Navbar() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [langOpen, setLangOpen] = useState(false);
    const [activeHash, setActiveHash] = useState("#hero");
    const [pillStyle, setPillStyle] = useState<React.CSSProperties>({});
    const navRef = useRef<HTMLUListElement>(null);
    const langRef = useRef<HTMLDivElement>(null);

    const { t, locale, setLocale } = useLanguage();
    const { theme, toggleTheme } = useTheme();

    const isSubpage = pathname !== "/";

    // Close lang dropdown on outside click
    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (langRef.current && !langRef.current.contains(e.target as Node)) {
                setLangOpen(false);
            }
        };
        document.addEventListener("click", onClick);
        return () => document.removeEventListener("click", onClick);
    }, []);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        if (isSubpage) return;
        const sectionIds = NAV_KEYS.filter((item) => item.href.startsWith("#")).map((item) => item.href.replace("#", ""));
        const sections = sectionIds
            .map((id) => document.getElementById(id))
            .filter((el): el is HTMLElement => Boolean(el));

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

                if (visible[0]?.target?.id) {
                    setActiveHash(`#${visible[0].target.id}`);
                }
            },
            {
                threshold: [0.3, 0.5, 0.7],
                rootMargin: "-25% 0px -55% 0px",
            },
        );

        sections.forEach((section) => observer.observe(section));
        return () => observer.disconnect();
    }, [isSubpage]);

    const updatePill = useCallback(() => {
        if (!navRef.current) return;
        const activeLink = navRef.current.querySelector(
            `a[href="${activeHash}"]`,
        ) as HTMLElement | null;
        if (activeLink) {
            const navRect = navRef.current.getBoundingClientRect();
            const linkRect = activeLink.getBoundingClientRect();
            setPillStyle({
                left: linkRect.left - navRect.left,
                width: linkRect.width,
                height: linkRect.height,
                opacity: 1,
            });
        }
    }, [activeHash]);

    useEffect(() => {
        updatePill();
        window.addEventListener("resize", updatePill);
        return () => window.removeEventListener("resize", updatePill);
    }, [updatePill]);

    const textBase = scrolled
        ? "text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800"
        : "text-white/60 hover:text-white hover:bg-white/10";
    const textActive = scrolled
        ? "text-primary font-semibold"
        : "text-white font-semibold";

    return (
        <nav
            className={`fixed top-5 left-1/2 z-50 -translate-x-1/2 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${scrolled
                ? "bg-white/80 dark:bg-gray-900/80 border border-gray-200/60 dark:border-gray-700/60 shadow-[0_4px_30px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.06)] backdrop-blur-2xl rounded-[22px] px-1.5 py-1.5"
                : "bg-black/25 border border-white/15 shadow-[0_4px_30px_rgba(0,0,0,0.2)] backdrop-blur-xl rounded-[22px] px-1.5 py-1.5"
                }`}
        >
            <div className="hidden lg:flex items-center gap-0.5">
                <ul ref={navRef} className="flex items-center gap-0.5 relative">
                    {/* Sliding active indicator pill */}
                    <li
                        aria-hidden
                        className={`absolute top-0 rounded-2xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] pointer-events-none ${scrolled ? "bg-primary/15 shadow-[0_0_12px_rgba(0,72,129,0.15)]"
                            : "bg-white/20 shadow-[0_0_12px_rgba(255,255,255,0.1)]"
                            }`}
                        style={pillStyle}
                    />

                    {NAV_KEYS.map((item) => {
                        const isPage = item.href.startsWith("/");
                        const isActive = isPage ? pathname === item.href : activeHash === item.href;
                        return (
                            <li key={item.href} className="relative z-10">
                                {isPage ? (
                                    <Link
                                        href={item.href}
                                        className={` block px-3 xl:px-4 py-2 text-[13px] font-medium rounded-2xl transition-colors duration-300 whitespace-nowrap ${isActive
                                            ? `${textActive} ${scrolled ? "bg-primary/12" : "bg-white/20"}`
                                            : textBase
                                            }`}
                                    >
                                        {t.nav[item.key]}
                                    </Link>
                                ) : (
                                    <a
                                        href={item.href}
                                        className={`block px-3 xl:px-4 py-2 text-[13px] font-medium rounded-2xl transition-colors duration-300 whitespace-nowrap ${isActive ? textActive : textBase}`}
                                    >
                                        {t.nav[item.key]}
                                    </a>
                                )}
                            </li>
                        );
                    })}
                </ul>

                {/* Divider */}
                <div className={`w-px h-5 mx-1.5 ${scrolled ? "bg-gray-200 dark:bg-gray-700" : "bg-white/20"}`} />

                {/* Language dropdown */}
                <div ref={langRef} className="relative">
                    <button
                        onClick={() => setLangOpen(!langOpen)}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[12px] font-medium rounded-xl transition-all duration-200 ${scrolled
                            ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
                            : "text-white/75 hover:text-white hover:bg-white/10"
                            }`}
                        aria-label="Change language"
                    >
                        <span className="text-sm">{LOCALE_FLAGS[locale]}</span>
                        <span className="uppercase">{locale}</span>
                        <svg
                            className={`w-3 h-3 transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {/* Dropdown */}
                    <div
                        className={`absolute top-full right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden min-w-36 transition-all duration-200 origin-top-right ${langOpen
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-95 pointer-events-none"
                            }`}
                    >
                        {LOCALES.map((loc) => (
                            <button
                                key={loc}
                                onClick={() => {
                                    setLocale(loc);
                                    setLangOpen(false);
                                }}
                                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm transition-colors duration-150 ${locale === loc
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                                    }`}
                            >
                                <span className="text-base">{LOCALE_FLAGS[loc]}</span>
                                <span>{LOCALE_LABELS[loc]}</span>
                                {locale === loc && (
                                    <svg className="w-3.5 h-3.5 ml-auto text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Theme toggle */}
                <button
                    onClick={toggleTheme}
                    className={`p-2 rounded-xl transition-all duration-200 ${scrolled
                        ? "text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800"
                        : "text-white/60 hover:text-white hover:bg-white/10"
                        }`}
                    aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
                >
                    {theme === "light" ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                    ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    )}
                </button>


            </div>

            {/* Mobile toggle */}
            <div className="lg:hidden flex items-center gap-2">
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="flex items-center gap-3 px-5 py-2 text-sm font-medium rounded-2xl transition-colors"
                    aria-label="Toggle menu"
                >
                    <span className={`${scrolled ? "text-gray-800 dark:text-gray-200" : "text-white"} tracking-wide`}>
                        Menu
                    </span>
                    <div className={`flex flex-col gap-1 transition-all ${mobileOpen ? "gap-0" : ""}`}>
                        <span
                            className={`block w-4 h-[1.5px] rounded-full transition-all duration-300 ${scrolled ? "bg-gray-800 dark:bg-gray-200" : "bg-white"
                                } ${mobileOpen ? "rotate-45 translate-y-[2.75px]" : ""}`}
                        />
                        <span
                            className={`block w-4 h-[1.5px] rounded-full transition-all duration-300 ${scrolled ? "bg-gray-800 dark:bg-gray-200" : "bg-white"
                                } ${mobileOpen ? "-rotate-45 -translate-y-[2.75px]" : ""}`}
                        />
                    </div>
                </button>

                {/* Mobile theme toggle */}
                <button
                    onClick={toggleTheme}
                    className={`p-2 rounded-xl transition-all duration-200 ${scrolled
                        ? "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                        : "text-white/60 hover:text-white"
                        }`}
                    aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
                >
                    {theme === "light" ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                    ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    )}
                </button>


            </div>

            {/* Mobile dropdown */}
            <div
                className={`lg:hidden absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-white/95 dark:bg-gray-900/95 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-2xl rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] p-2 min-w-56 transition-all duration-300 ease-out origin-top ${mobileOpen
                    ? "opacity-100 scale-100 translate-y-0"
                    : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                    }`}
            >
                <ul className="flex flex-col gap-0.5">
                    {NAV_KEYS.map((item) => {
                        const isPage = item.href.startsWith("/");
                        const isActive = isPage ? pathname === item.href : activeHash === item.href;
                        const cls = `block px-4 py-2.5 text-sm rounded-xl transition-all duration-200 ${isActive
                            ? "text-primary font-semibold bg-primary/12"
                            : "text-gray-500 dark:text-gray-400 font-medium hover:text-primary hover:bg-primary/5"
                            }`;
                        return (
                            <li key={item.href}>
                                {isPage ? (
                                    <Link href={item.href} onClick={() => setMobileOpen(false)} className={cls}>
                                        {t.nav[item.key]}
                                    </Link>
                                ) : (
                                    <a href={item.href} onClick={() => setMobileOpen(false)} className={cls}>
                                        {t.nav[item.key]}
                                    </a>
                                )}
                            </li>
                        );
                    })}
                </ul>

                {/* Mobile language switcher */}
                <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-1 px-2">
                        {LOCALES.map((loc) => (
                            <button
                                key={loc}
                                onClick={() => {
                                    setLocale(loc);
                                }}
                                className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${locale === loc
                                    ? "bg-primary/10 text-primary"
                                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                                    }`}
                            >
                                <span>{LOCALE_FLAGS[loc]}</span>
                                <span className="uppercase">{loc}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
}