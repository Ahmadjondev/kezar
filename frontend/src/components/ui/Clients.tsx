"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Client } from "@/lib/api";

export default function Clients({ clients }: { clients: Client[] }) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    const { t } = useLanguage();

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 },
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    if (!clients || clients.length === 0) return null;

    return (
        <section
            ref={sectionRef}
            className="w-full py-24 md:py-36 bg-white dark:bg-gray-950 transition-colors duration-500"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
                    {/* Left — Text content */}
                    <div
                        className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                            }`}
                    >
                        {/* Decorative script title */}
                        <h2 className="text-5xl sm:text-6xl md:text-7xl font-light italic text-gray-200 dark:text-gray-800 leading-none mb-6 select-none transition-colors">
                            {t.clients.sectionTitle}
                        </h2>

                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 uppercase leading-snug mb-6 max-w-md transition-colors">
                            {t.clients.heading}
                        </h3>

                        <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base leading-relaxed mb-4 max-w-lg transition-colors">
                            {t.clients.desc1}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base leading-relaxed max-w-lg transition-colors">
                            {t.clients.desc2}
                        </p>
                    </div>

                    {/* Right — Brand logos grid */}
                    <div
                        className={`bg-gray-50 dark:bg-gray-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-800 transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                            }`}
                    >
                        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-1">
                            {clients.map((client, i) => (
                                <div
                                    key={client.id}
                                    className={`flex items-center justify-center h-14 sm:h-16 md:h-18 px-2 rounded-xl hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm transition-all duration-300 cursor-default ${visible ? "opacity-100 scale-100" : "opacity-0 scale-90"
                                        }`}
                                    style={{
                                        transitionDelay: visible ? `${200 + i * 30}ms` : "0ms",
                                    }}
                                >
                                    {client.logo_url ? (
                                        <img src={client.logo_url} alt={client.name} className="max-h-8 sm:max-h-10 max-w-full object-contain" />
                                    ) : (
                                        <span className="select-none text-center leading-tight whitespace-nowrap font-bold text-xs sm:text-sm text-gray-700 dark:text-gray-300 tracking-wide">
                                            {client.name}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
