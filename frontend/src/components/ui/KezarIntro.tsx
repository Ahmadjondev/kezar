"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { SiteSetting } from "@/lib/api";

export default function KezarIntro({ settings }: { settings: SiteSetting }) {
    const { locale } = useLanguage();
    const textRef = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.25 },
        );
        if (textRef.current) observer.observe(textRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section id="about" className="w-full bg-white dark:bg-gray-950 transition-colors duration-500">
            {/* Dark header strip with geometric pattern */}
            <div className="relative h-40 md:h-52 overflow-hidden bg-[#1a1e20] flex items-center justify-center px-6">
                <div className="absolute inset-0 opacity-[0.08]" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23004881' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
                <div className="absolute inset-0 bg-linear-to-b from-primary/15 to-transparent" />
                <h2 className="relative text-center text-white/85 text-xl md:text-4xl font-extralight tracking-[0.12em] uppercase">
                    {settings[`intro_title_${locale}`] || settings.intro_title_en || "Welcome to Kezar Teks"}
                </h2>
            </div>

            {/* Split content: text + image */}
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-135">
                <div
                    ref={textRef}
                    className={`flex items-center justify-center px-10 md:px-24 lg:px-28 py-20 md:py-28 transition-all duration-1000 ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
                        }`}
                >
                    <div className="max-w-lg">
                        <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl leading-loose font-light">
                            {settings[`intro_text_${locale}`] || settings.intro_text_en || ""}
                        </p>

                        <div className="mt-10 flex items-center gap-4">
                            <a
                                href={settings.social_facebook || "https://www.facebook.com"}
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Facebook"
                                className="group h-11 w-11 rounded-full border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:text-white hover:bg-primary hover:border-primary transition-all duration-300 flex items-center justify-center"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.378 14.192 5 15.115 5H18V0h-3.808C10.596 0 9 1.583 9 4.615V8z" />
                                </svg>
                            </a>
                            <a
                                href={settings.social_telegram || "https://t.me"}
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Telegram"
                                className="group h-11 w-11 rounded-full border border-gray-300 text-gray-500 hover:text-white hover:bg-primary hover:border-primary transition-all duration-300 flex items-center justify-center"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                                </svg>
                            </a>
                            <a
                                href={settings.social_instagram || "https://www.instagram.com"}
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Instagram"
                                className="group h-11 w-11 rounded-full border border-gray-300 text-gray-500 hover:text-white hover:bg-primary hover:border-primary transition-all duration-300 flex items-center justify-center"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Factory image */}
                <div
                    className={`min-h-95 lg:min-h-full bg-center bg-cover transition-all duration-1000 delay-200 ${visible ? "opacity-100 scale-100" : "opacity-0 scale-105"
                        }`}
                    style={{
                        backgroundImage:
                            `url('${settings.intro_image || "https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1800&q=80"}')`,
                    }}
                />
            </div>
        </section>
    );
}
